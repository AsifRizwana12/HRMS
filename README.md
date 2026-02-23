# HRMS Lite

Build a web-based HRMS Lite application that allows an admin to manage employee records and track daily attendance.

## Features
- **Employee Management**: Add, view, and delete employees.
- **Attendance Tracking**: Mark attendance (Present/Absent) and view records.
- **Duplicate Prevention**: Prevents duplicate attendance entries for the same employee on the same date.
- **Modern UI**: Refactored React frontend with Toast notifications and a professional look.

## Project Structure
- `backend/`: Python Flask API with MySQL integration.
- `frontend/`: React application built with Vite.

## Setup Instructions

### Backend
1. Navigate to `backend/`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Configure your MySQL database (ensure it matches the connection settings in `models.py`).
4. Run the application: `python app.py`.

### Frontend
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.

## Deployment
This project is prepared for deployment. 
- Frontend can be hosted on GitHub Pages or Vercel.
- Backend requires a Python-capable hosting service (e.g., Render, Railway, or Heroku) and a MySQL database.
