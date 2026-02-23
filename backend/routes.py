from flask import Blueprint, request, jsonify
from models import add_employee, get_all_employees, delete_employee, mark_attendance, get_attendance_records
import re

api = Blueprint('api', __name__)

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@api.route('/employees', methods=['POST'])
def create_employee():
    data = request.json
    print(f"Received data: {data}")
    required_fields = ['employee_id', 'full_name', 'email', 'department']
    
    # Validation
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            print(f"Validation failed: missing or empty field '{field}'")
            return jsonify({"error": f"Field '{field}' is required"}), 400
    
    if not is_valid_email(data['email']):
        return jsonify({"error": "Invalid email format"}), 400
    
    # Check for duplicate employee ID or email is handled by DB constraints (simplified here)
    success, message = add_employee(data['employee_id'], data['full_name'], data['email'], data['department'])
    if success:
        return jsonify({"message": message}), 201
    else:
        status_code = 409 if "already exists" in message else 500
        return jsonify({"error": message}), status_code

@api.route('/employees', methods=['GET'])
def list_employees():
    employees = get_all_employees()
    return jsonify(employees), 200

@api.route('/employees/<employee_id>', methods=['DELETE'])
def remove_employee(employee_id):
    if delete_employee(employee_id):
        return jsonify({"message": "Employee deleted successfully"}), 200
    else:
        return jsonify({"error": "Employee not found or deletion failed"}), 404

@api.route('/attendance', methods=['POST'])
def record_attendance():
    data = request.json
    required_fields = ['employee_id', 'date', 'status']
    
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return jsonify({"error": f"Field '{field}' is required"}), 400
    
    if data['status'] not in ['Present', 'Absent']:
        return jsonify({"error": "Status must be 'Present' or 'Absent'"}), 400
    
    success, message = mark_attendance(data['employee_id'], data['date'], data['status'])
    if success:
        return jsonify({"message": message}), 201
    else:
        status_code = 409 if "already marked" in message else 500
        return jsonify({"error": message}), status_code

@api.route('/attendance/<employee_id>', methods=['GET'])
def view_attendance(employee_id):
    records = get_attendance_records(employee_id)
    return jsonify(records), 200
