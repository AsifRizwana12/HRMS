from flask import Flask
from flask_cors import CORS
from routes import api

app = Flask(__name__)
# Enable all-permissive CORS for debugging
CORS(app, supports_credentials=True)

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    # Run the Flask app on port 5001 
    app.run(debug=True, port=5001)
