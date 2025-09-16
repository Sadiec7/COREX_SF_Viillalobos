# models/user_model.py
import sqlite3
import os

class UserModel:
    def __init__(self, db_name="gestor_db.sqlite"):
        # Asegura que la ruta a la BD sea relativa al directorio del proyecto
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.join(base_dir, db_name)
        
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self._create_table()

    def _create_table(self):
        """Crea la tabla de usuarios si no existe y añade un usuario de ejemplo."""
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        """)
        # Añadir un usuario de ejemplo si la tabla está vacía
        self.cursor.execute("SELECT * FROM users WHERE username = 'admin'")
        if self.cursor.fetchone() is None:
            # NOTA: En una aplicación real, NUNCA guardes contraseñas en texto plano.
            # Usa librerías como bcrypt para "hashear" las contraseñas.
            self.cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('admin', '1234'))
            self.conn.commit()

    def check_credentials(self, username, password):
        """Verifica si el usuario y la contraseña son correctos."""
        self.cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        # fetchone() devuelve un resultado (fila) si lo encuentra, o None si no.
        return self.cursor.fetchone() is not None

    def close(self):
        """Cierra la conexión a la base de datos."""
        self.conn.close()