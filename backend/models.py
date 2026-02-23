import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables for production readiness
load_dotenv()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'hrms_lite'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', 'Rizwana@123'),
            port=int(os.getenv('DB_PORT', 3306))
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

def add_employee(employee_id, full_name, email, department):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        try:
            query = "INSERT INTO employees (employee_id, full_name, email, department) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (employee_id, full_name, email, department))
            connection.commit()
            return True, "Employee added successfully"
        except Error as e:
            print(f"Error adding employee: {e}")
            if e.errno == 1062:
                return False, "Employee ID or Email already exists."
            return False, f"Database error: {str(e)}"
        finally:
            cursor.close()
            connection.close()
    return False, "Database connection failed"

def get_all_employees():
    connection = get_db_connection()
    employees = []
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM employees")
            employees = cursor.fetchall()
        except Error as e:
            print(f"Error fetching employees: {e}")
        finally:
            cursor.close()
            connection.close()
    return employees

def delete_employee(employee_id):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute("DELETE FROM employees WHERE employee_id = %s", (employee_id,))
            connection.commit()
            return cursor.rowcount > 0
        except Error as e:
            print(f"Error deleting employee: {e}")
            return False
        finally:
            cursor.close()
            connection.close()
    return False

def mark_attendance(employee_id, date, status):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        try:
            query = "INSERT INTO attendance (employee_id, date, status) VALUES (%s, %s, %s)"
            cursor.execute(query, (employee_id, date, status))
            connection.commit()
            return True, "Attendance marked successfully"
        except Error as e:
            if e.errno == 1062:
                return False, "Attendance already marked for this date"
            print(f"Error marking attendance: {e}")
            return False, str(e)
        finally:
            cursor.close()
            connection.close()
    return False, "Database connection failed"

def get_attendance_records(employee_id):
    connection = get_db_connection()
    records = []
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM attendance WHERE employee_id = %s ORDER BY date DESC", (employee_id,))
            records = cursor.fetchall()
            # Convert date to string for JSON serialization
            for record in records:
                record['date'] = str(record['date'])
        except Error as e:
            print(f"Error fetching attendance: {e}")
        finally:
            cursor.close()
            connection.close()
    return records
