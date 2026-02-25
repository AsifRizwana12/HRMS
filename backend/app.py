from flask import Flask
from flask_cors import CORS
from routes import api
import os

app = Flask(__name__)

# Reverted to basic CORS for local development
CORS(app)

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
