// models/user_model_mock.js
// Versión mock sin better-sqlite3 para evitar problemas de compilación

class UserModel {
    constructor(dbName = "gestor_db.sqlite") {
        // Mock database en memoria (mantiene la misma interfaz que la versión SQLite)
        this.users = [
            { id: 1, username: 'admin', password: '1234' }
        ];

        console.log('✅ UserModel inicializado con datos mock en memoria');
        console.log('✅ Usuario de ejemplo disponible: admin / 1234');
    }

    _createTable() {
        // Mock - tabla ya "creada" en memoria
        console.log('Mock: Tabla de usuarios inicializada');
    }

    checkCredentials(username, password) {
        /**
         * Verifica si el usuario y la contraseña son correctos.
         * @param {string} username - Nombre de usuario
         * @param {string} password - Contraseña
         * @returns {boolean} - true si las credenciales son correctas
         */
        const user = this.users.find(u =>
            u.username === username && u.password === password
        );

        return user !== undefined;
    }

    getUserByUsername(username) {
        /**
         * Obtiene un usuario por su nombre de usuario
         * @param {string} username - Nombre de usuario
         * @returns {Object|null} - Datos del usuario o null
         */
        const user = this.users.find(u => u.username === username);

        if (user) {
            return {
                id: user.id,
                username: user.username
            };
        }

        return null;
    }

    close() {
        /**
         * Mock: "cierra" la conexión (no hace nada en memoria)
         */
        console.log('Mock: Conexión a base de datos cerrada');
    }
}

module.exports = UserModel;