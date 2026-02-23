from flask import Flask
from flask_cors import CORS
from routes import api
import os

app = Flask(__name__)

# Configure CORS more explicitly for production and development
CORS(app, resources={r"/api/*": {
    "origins": [
        "https://frontend-sigma-coral-59.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}}, supports_credentials=True)

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    # Use environment variable for port in production
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=os.environ.get('FLASK_ENV') != 'production', host='0.0.0.0', port=port)
