// models/user_model_v2.js
// UserModel v2 - Con bcrypt, roles y seguridad mejorada

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class UserModel {
    constructor(db) {
        this.db = db;
    }

    /**
     * Crear nuevo usuario con password hasheado
     * @param {string} username - Nombre de usuario
     * @param {string} email - Correo electrónico
     * @param {string} password - Contraseña en texto plano
     * @param {string} rol - Rol del usuario (admin/operador/lectura)
     * @returns {Object} Usuario creado
     */
    async createUser(username, email, password, rol = 'operador') {
        try {
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordHash = await bcrypt.hash(password, 10);

            const result = this.db.prepare(`
                INSERT INTO Usuario (
                    username, email, password_hash, salt, rol,
                    fecha_ultimo_cambio_password
                ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `).run(username, email, passwordHash, salt, rol);

            return {
                usuario_id: result.lastInsertRowid,
                username,
                email,
                rol
            };
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw new Error('El nombre de usuario o email ya existe');
            }
            throw error;
        }
    }

    /**
     * Verificar credenciales de login
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña en texto plano
     * @returns {Object|null} Datos del usuario si es válido, null si no
     */
    async checkCredentials(username, password) {
        try {
            // Buscar usuario activo y no bloqueado (sql.js requiere dbManager)
            const stmt = this.db.prepare(`
                SELECT * FROM Usuario
                WHERE username = ? AND activo = 1 AND bloqueado = 0
            `);
            stmt.bind([username]);

            let user = null;
            if (stmt.step()) {
                user = stmt.getAsObject();
            }
            stmt.free();

            if (!user) {
                return null;
            }

            // Verificar password
            const isValid = await bcrypt.compare(password, user.password_hash);

            if (isValid) {
                // Actualizar último acceso y resetear intentos fallidos
                this.db.prepare(`
                    UPDATE Usuario
                    SET ultimo_acceso = CURRENT_TIMESTAMP,
                        intentos_fallidos = 0
                    WHERE usuario_id = ?
                `).run(user.usuario_id);

                // Retornar datos sin información sensible
                return {
                    usuario_id: user.usuario_id,
                    username: user.username,
                    email: user.email,
                    rol: user.rol,
                    ultimo_acceso: new Date().toISOString()
                };
            } else {
                // Incrementar intentos fallidos
                this.db.prepare(`
                    UPDATE Usuario
                    SET intentos_fallidos = intentos_fallidos + 1,
                        bloqueado = CASE
                            WHEN intentos_fallidos >= 4 THEN 1
                            ELSE 0
                        END
                    WHERE usuario_id = ?
                `).run(user.usuario_id);

                // Verificar si se bloqueó la cuenta
                const updatedUser = this.db.prepare(
                    'SELECT bloqueado, intentos_fallidos FROM Usuario WHERE usuario_id = ?'
                ).get(user.usuario_id);

                if (updatedUser.bloqueado) {
                    throw new Error('Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador.');
                }

                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener usuario por ID
     * @param {number} usuarioId - ID del usuario
     * @returns {Object|null} Datos del usuario
     */
    getUserById(usuarioId) {
        return this.db.prepare(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   ultimo_acceso, fecha_creacion
            FROM Usuario
            WHERE usuario_id = ?
        `).get(usuarioId);
    }

    /**
     * Obtener usuario por username
     * @param {string} username - Nombre de usuario
     * @returns {Object|null} Datos del usuario
     */
    getUserByUsername(username) {
        return this.db.prepare(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   ultimo_acceso, fecha_creacion
            FROM Usuario
            WHERE username = ?
        `).get(username);
    }

    /**
     * Listar todos los usuarios
     * @returns {Array} Lista de usuarios
     */
    getAllUsers() {
        return this.db.prepare(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   intentos_fallidos, ultimo_acceso, fecha_creacion
            FROM Usuario
            ORDER BY fecha_creacion DESC
        `).all();
    }

    /**
     * Cambiar contraseña de usuario
     * @param {number} usuarioId - ID del usuario
     * @param {string} oldPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @returns {boolean} True si se cambió exitosamente
     */
    async changePassword(usuarioId, oldPassword, newPassword) {
        const user = this.db.prepare(`
            SELECT password_hash FROM Usuario WHERE usuario_id = ?
        `).get(usuarioId);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar contraseña actual
        const isValid = await bcrypt.compare(oldPassword, user.password_hash);

        if (!isValid) {
            throw new Error('Contraseña actual incorrecta');
        }

        // Generar nuevo hash
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Actualizar
        this.db.prepare(`
            UPDATE Usuario
            SET password_hash = ?,
                salt = ?,
                fecha_ultimo_cambio_password = CURRENT_TIMESTAMP
            WHERE usuario_id = ?
        `).run(passwordHash, salt, usuarioId);

        return true;
    }

    /**
     * Resetear contraseña (solo admin)
     * @param {number} usuarioId - ID del usuario
     * @param {string} newPassword - Nueva contraseña
     * @returns {boolean} True si se resetea exitosamente
     */
    async resetPassword(usuarioId, newPassword) {
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = await bcrypt.hash(newPassword, 10);

        this.db.prepare(`
            UPDATE Usuario
            SET password_hash = ?,
                salt = ?,
                bloqueado = 0,
                intentos_fallidos = 0,
                fecha_ultimo_cambio_password = CURRENT_TIMESTAMP
            WHERE usuario_id = ?
        `).run(passwordHash, salt, usuarioId);

        return true;
    }

    /**
     * Desbloquear cuenta de usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {boolean} True si se desbloqueó
     */
    unlockUser(usuarioId) {
        const result = this.db.prepare(`
            UPDATE Usuario
            SET bloqueado = 0,
                intentos_fallidos = 0
            WHERE usuario_id = ?
        `).run(usuarioId);

        return result.changes > 0;
    }

    /**
     * Activar/Desactivar usuario
     * @param {number} usuarioId - ID del usuario
     * @param {boolean} activo - Estado deseado
     * @returns {boolean} True si se actualizó
     */
    toggleUserStatus(usuarioId, activo) {
        const result = this.db.prepare(`
            UPDATE Usuario
            SET activo = ?
            WHERE usuario_id = ?
        `).run(activo ? 1 : 0, usuarioId);

        return result.changes > 0;
    }

    /**
     * Cambiar rol de usuario
     * @param {number} usuarioId - ID del usuario
     * @param {string} nuevoRol - Nuevo rol (admin/operador/lectura)
     * @returns {boolean} True si se actualizó
     */
    changeRole(usuarioId, nuevoRol) {
        const rolesValidos = ['admin', 'operador', 'lectura'];

        if (!rolesValidos.includes(nuevoRol)) {
            throw new Error('Rol inválido. Debe ser: admin, operador o lectura');
        }

        const result = this.db.prepare(`
            UPDATE Usuario
            SET rol = ?
            WHERE usuario_id = ?
        `).run(nuevoRol, usuarioId);

        return result.changes > 0;
    }

    /**
     * Cerrar conexión (delegado al DatabaseManager)
     */
    close() {
        // El DatabaseManager se encarga de cerrar la conexión
        console.log('UserModel: Conexión manejada por DatabaseManager');
    }
}

module.exports = UserModel;
