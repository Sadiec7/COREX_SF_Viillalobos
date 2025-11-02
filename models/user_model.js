// models/user_model.js
// UserModel - Autenticación con bcrypt y roles (compatible con sql.js)

const bcrypt = require('bcryptjs');

class UserModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Verificar credenciales de usuario
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña en texto plano
     * @returns {Object|null} Datos del usuario si las credenciales son correctas
     */
    async checkCredentials(username, password) {
        try {
            // Buscar usuario activo y no bloqueado
            const user = this.dbManager.queryOne(`
                SELECT * FROM Usuario
                WHERE username = ? AND activo = 1 AND bloqueado = 0
            `, [username]);

            if (!user) {
                console.log(`❌ Usuario no encontrado o bloqueado: ${username}`);
                return null;
            }

            // Verificar contraseña con bcrypt
            const isValid = await bcrypt.compare(password, user.password_hash);

            if (isValid) {
                // Credenciales correctas - actualizar último acceso y resetear intentos fallidos
                this.dbManager.execute(`
                    UPDATE Usuario
                    SET ultimo_acceso = CURRENT_TIMESTAMP,
                        intentos_fallidos = 0
                    WHERE usuario_id = ?
                `, [user.usuario_id]);

                console.log(`✅ Login exitoso: ${username} (${user.rol})`);

                // Retornar datos del usuario (sin password_hash ni salt)
                return {
                    usuario_id: user.usuario_id,
                    username: user.username,
                    email: user.email,
                    rol: user.rol,
                    ultimo_acceso: user.ultimo_acceso
                };
            } else {
                // Contraseña incorrecta - incrementar intentos fallidos
                this._incrementarIntentosFallidos(user.usuario_id);
                console.log(`❌ Contraseña incorrecta para: ${username}`);
                return null;
            }

        } catch (error) {
            console.error('Error al verificar credenciales:', error);
            throw error;
        }
    }

    /**
     * Incrementar intentos fallidos y bloquear cuenta si es necesario
     * @private
     * @param {number} usuarioId - ID del usuario
     */
    _incrementarIntentosFallidos(usuarioId) {
        const user = this.dbManager.queryOne(`
            SELECT intentos_fallidos FROM Usuario WHERE usuario_id = ?
        `, [usuarioId]);

        const nuevoIntento = (user?.intentos_fallidos || 0) + 1;
        const debeBloquear = nuevoIntento >= 5; // Bloquear después de 5 intentos

        this.dbManager.execute(`
            UPDATE Usuario
            SET intentos_fallidos = ?,
                bloqueado = ?
            WHERE usuario_id = ?
        `, [nuevoIntento, debeBloquear ? 1 : 0, usuarioId]);

        if (debeBloquear) {
            console.log(`🔒 Usuario bloqueado por intentos fallidos: ${usuarioId}`);
        }
    }

    /**
     * Crear nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Object} Usuario creado
     */
    async create(userData) {
        const { username, email, password, rol = 'operador' } = userData;

        try {
            // Generar salt y hash de la contraseña
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const result = this.dbManager.execute(`
                INSERT INTO Usuario (
                    username, email, password_hash, salt, rol,
                    fecha_ultimo_cambio_password
                ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [username, email || null, passwordHash, salt, rol]);

            console.log(`✅ Usuario creado: ${username} (${rol})`);

            return {
                usuario_id: result.lastInsertRowid,
                username,
                email,
                rol
            };

        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw new Error(`El usuario '${username}' ya existe`);
            }
            throw error;
        }
    }

    /**
     * Obtener usuario por ID
     * @param {number} usuarioId - ID del usuario
     * @returns {Object|null} Datos del usuario
     */
    getById(usuarioId) {
        const user = this.dbManager.queryOne(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   ultimo_acceso, fecha_creacion
            FROM Usuario
            WHERE usuario_id = ?
        `, [usuarioId]);

        return user;
    }

    /**
     * Obtener usuario por username
     * @param {string} username - Nombre de usuario
     * @returns {Object|null} Datos del usuario
     */
    getUserByUsername(username) {
        const user = this.dbManager.queryOne(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   ultimo_acceso, fecha_creacion
            FROM Usuario
            WHERE username = ?
        `, [username]);

        return user;
    }

    /**
     * Listar todos los usuarios
     * @returns {Array} Lista de usuarios
     */
    getAll() {
        return this.dbManager.query(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   intentos_fallidos, ultimo_acceso, fecha_creacion
            FROM Usuario
            ORDER BY fecha_creacion DESC
        `);
    }

    /**
     * Cambiar contraseña
     * @param {number} usuarioId - ID del usuario
     * @param {string} newPassword - Nueva contraseña
     * @returns {boolean} True si se cambió
     */
    async changePassword(usuarioId, newPassword) {
        try {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, salt);

            const result = this.dbManager.execute(`
                UPDATE Usuario
                SET password_hash = ?,
                    salt = ?,
                    fecha_ultimo_cambio_password = CURRENT_TIMESTAMP
                WHERE usuario_id = ?
            `, [passwordHash, salt, usuarioId]);

            console.log(`✅ Contraseña actualizada para usuario: ${usuarioId}`);
            return result.changes > 0;

        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            throw error;
        }
    }

    /**
     * Desbloquear usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {boolean} True si se desbloqueó
     */
    unlock(usuarioId) {
        const result = this.dbManager.execute(`
            UPDATE Usuario
            SET bloqueado = 0,
                intentos_fallidos = 0
            WHERE usuario_id = ?
        `, [usuarioId]);

        if (result.changes > 0) {
            console.log(`🔓 Usuario desbloqueado: ${usuarioId}`);
        }

        return result.changes > 0;
    }

    /**
     * Desactivar usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {boolean} True si se desactivó
     */
    deactivate(usuarioId) {
        const result = this.dbManager.execute(`
            UPDATE Usuario
            SET activo = 0
            WHERE usuario_id = ?
        `, [usuarioId]);

        return result.changes > 0;
    }

    /**
     * Activar usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {boolean} True si se activó
     */
    activate(usuarioId) {
        const result = this.dbManager.execute(`
            UPDATE Usuario
            SET activo = 1
            WHERE usuario_id = ?
        `, [usuarioId]);

        return result.changes > 0;
    }
}

module.exports = UserModel;