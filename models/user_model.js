// models/user_model.js
const Database = require('better-sqlite3');
const path = require('path');

class UserModel {
    constructor(dbName = "gestor_db.sqlite") {
        // Asegura que la ruta a la BD sea relativa al directorio del proyecto
        const baseDir = path.dirname(__dirname);
        const dbPath = path.join(baseDir, dbName);

        this.db = new Database(dbPath);
        this._createTable();
    }

    _createTable() {
        /**
         * Crea la tabla de usuarios si no existe y añade un usuario de ejemplo.
         */
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        // Añadir un usuario de ejemplo si la tabla está vacía
        const checkUser = this.db.prepare('SELECT * FROM users WHERE username = ?');
        const existingUser = checkUser.get('admin');

        if (!existingUser) {
            // NOTA: En una aplicación real, NUNCA guardes contraseñas en texto plano.
            // Usa librerías como bcrypt para "hashear" las contraseñas.
            const insertUser = this.db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
            insertUser.run('admin', '1234');
            console.log('Usuario de ejemplo creado: admin / 1234');
        }
    }

    checkCredentials(username, password) {
        /**
         * Verifica si el usuario y la contraseña son correctos.
         * @param {string} username - Nombre de usuario
         * @param {string} password - Contraseña
         * @returns {boolean} - true si las credenciales son correctas
         */
        const query = this.db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
        const user = query.get(username, password);

        // Retorna true si encontró un usuario, false si no
        return user !== undefined;
    }

    getUserByUsername(username) {
        /**
         * Obtiene un usuario por su nombre de usuario
         * @param {string} username - Nombre de usuario
         * @returns {Object|null} - Datos del usuario o null
         */
        const query = this.db.prepare('SELECT id, username FROM users WHERE username = ?');
        return query.get(username) || null;
    }

    close() {
        /**
         * Cierra la conexión a la base de datos.
         */
        this.db.close();
    }
}

module.exports = UserModel;