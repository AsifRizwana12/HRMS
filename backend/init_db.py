import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables from the .env file in the same directory
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

def init_db():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=int(os.getenv('DB_PORT', 3306)),
            ssl_disabled=False
        )
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create employees table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS employees (
                employee_id VARCHAR(50) PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                department VARCHAR(100) NOT NULL
            )
            """)
            
            # Create attendance table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id VARCHAR(50),
                date DATE NOT NULL,
                status VARCHAR(20) NOT NULL,
                FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
                UNIQUE KEY unique_attendance (employee_id, date)
            )
            """)
            
            print("Database initialized successfully!")
            
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    init_db()
