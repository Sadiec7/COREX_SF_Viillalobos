// models/user_model_sqljs.js
// UserModel v2 adaptado para sql.js + bcryptjs

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class UserModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Crear nuevo usuario con password hasheado
     */
    async createUser(username, email, password, rol = 'operador') {
        try {
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordHash = await bcrypt.hash(password, 10);

            const result = this.dbManager.execute(`
                INSERT INTO Usuario (
                    username, email, password_hash, salt, rol,
                    fecha_ultimo_cambio_password
                ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [username, email, passwordHash, salt, rol]);

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
     */
    async checkCredentials(username, password) {
        try {
            // Buscar usuario activo y no bloqueado
            const user = this.dbManager.queryOne(`
                SELECT * FROM Usuario
                WHERE username = ? AND activo = 1 AND bloqueado = 0
            `, [username]);

            console.log('🔍 Usuario encontrado:', user ? 'Sí' : 'No');

            if (!user) {
                return null;
            }

            console.log('🔑 Hash en BD:', user.password_hash);
            console.log('🔑 Password ingresado:', password);

            // Verificar password
            const isValid = await bcrypt.compare(password, user.password_hash);
            console.log('✅ Password válido:', isValid);

            if (isValid) {
                // Actualizar último acceso y resetear intentos fallidos
                this.dbManager.execute(`
                    UPDATE Usuario
                    SET ultimo_acceso = CURRENT_TIMESTAMP,
                        intentos_fallidos = 0
                    WHERE usuario_id = ?
                `, [user.usuario_id]);

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
                this.dbManager.execute(`
                    UPDATE Usuario
                    SET intentos_fallidos = intentos_fallidos + 1,
                        bloqueado = CASE
                            WHEN intentos_fallidos >= 4 THEN 1
                            ELSE 0
                        END
                    WHERE usuario_id = ?
                `, [user.usuario_id]);

                // Verificar si se bloqueó la cuenta
                const updatedUser = this.dbManager.queryOne(
                    'SELECT bloqueado, intentos_fallidos FROM Usuario WHERE usuario_id = ?',
                    [user.usuario_id]
                );

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
     */
    getUserById(usuarioId) {
        return this.dbManager.queryOne(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   ultimo_acceso, fecha_creacion
            FROM Usuario
            WHERE usuario_id = ?
        `, [usuarioId]);
    }

    /**
     * Obtener usuario por username
     */
    getUserByUsername(username) {
        return this.dbManager.queryOne(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   ultimo_acceso, fecha_creacion
            FROM Usuario
            WHERE username = ?
        `, [username]);
    }

    /**
     * Listar todos los usuarios
     */
    getAllUsers() {
        return this.dbManager.query(`
            SELECT usuario_id, username, email, rol, activo, bloqueado,
                   intentos_fallidos, ultimo_acceso, fecha_creacion
            FROM Usuario
            ORDER BY fecha_creacion DESC
        `);
    }

    /**
     * Cambiar contraseña de usuario
     */
    async changePassword(usuarioId, oldPassword, newPassword) {
        if (!newPassword || newPassword.length < 8) {
            throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
        }

        const user = this.dbManager.queryOne(`
            SELECT password_hash FROM Usuario WHERE usuario_id = ?
        `, [usuarioId]);

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
        this.dbManager.execute(`
            UPDATE Usuario
            SET password_hash = ?,
                salt = ?,
                fecha_ultimo_cambio_password = CURRENT_TIMESTAMP
            WHERE usuario_id = ?
        `, [passwordHash, salt, usuarioId]);

        return true;
    }

    /**
     * Actualizar datos básicos de la cuenta (username y email)
     */
    async updateProfile(usuarioId, username, email = null) {
        if (!usuarioId) {
            throw new Error('Usuario inválido');
        }

        const current = this.dbManager.queryOne(`
            SELECT usuario_id FROM Usuario WHERE usuario_id = ?
        `, [usuarioId]);

        if (!current) {
            throw new Error('Usuario no encontrado');
        }

        const sanitizedUsername = username?.trim();
        if (!sanitizedUsername) {
            throw new Error('El nombre de usuario no puede estar vacío');
        }

        const sanitizedEmail = email?.trim() || null;

        const usernameExists = this.dbManager.queryOne(`
            SELECT usuario_id FROM Usuario WHERE username = ? AND usuario_id != ?
        `, [sanitizedUsername, usuarioId]);

        if (usernameExists) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        if (sanitizedEmail) {
            const emailExists = this.dbManager.queryOne(`
                SELECT usuario_id FROM Usuario WHERE email = ? AND usuario_id != ?
            `, [sanitizedEmail, usuarioId]);

            if (emailExists) {
                throw new Error('El correo ya está en uso');
            }
        }

        const result = this.dbManager.execute(`
            UPDATE Usuario
            SET username = ?,
                email = ?,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE usuario_id = ?
        `, [sanitizedUsername, sanitizedEmail, usuarioId]);

        if (result.changes > 0) {
            return {
                usuario_id: usuarioId,
                username: sanitizedUsername,
                email: sanitizedEmail
            };
        }

        throw new Error('No se pudo actualizar la cuenta');
    }

    /**
     * Resetear contraseña (solo admin)
     */
    async resetPassword(usuarioId, newPassword) {
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = await bcrypt.hash(newPassword, 10);

        this.dbManager.execute(`
            UPDATE Usuario
            SET password_hash = ?,
                salt = ?,
                bloqueado = 0,
                intentos_fallidos = 0,
                fecha_ultimo_cambio_password = CURRENT_TIMESTAMP
            WHERE usuario_id = ?
        `, [passwordHash, salt, usuarioId]);

        return true;
    }

    /**
     * Desbloquear cuenta de usuario
     */
    unlockUser(usuarioId) {
        const result = this.dbManager.execute(`
            UPDATE Usuario
            SET bloqueado = 0,
                intentos_fallidos = 0
            WHERE usuario_id = ?
        `, [usuarioId]);

        return result.changes > 0;
    }

    /**
     * Activar/Desactivar usuario
     */
    toggleUserStatus(usuarioId, activo) {
        const result = this.dbManager.execute(`
            UPDATE Usuario
            SET activo = ?
            WHERE usuario_id = ?
        `, [activo ? 1 : 0, usuarioId]);

        return result.changes > 0;
    }

    /**
     * Cambiar rol de usuario
     */
    changeRole(usuarioId, nuevoRol) {
        const rolesValidos = ['admin', 'operador', 'lectura'];

        if (!rolesValidos.includes(nuevoRol)) {
            throw new Error('Rol inválido. Debe ser: admin, operador o lectura');
        }

        const result = this.dbManager.execute(`
            UPDATE Usuario
            SET rol = ?
            WHERE usuario_id = ?
        `, [nuevoRol, usuarioId]);

        return result.changes > 0;
    }

    /**
     * Cerrar conexión (delegado al DatabaseManager)
     */
    close() {
        console.log('UserModel: Conexión manejada por DatabaseManager');
    }
}

module.exports = UserModel;
