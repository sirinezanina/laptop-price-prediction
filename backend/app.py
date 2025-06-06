from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(
    app,
    resources={r"/predict": {"origins": "https://laptop-price-frontend-a5gwegdferb2e0ac.centralus-01.azurewebsites.net"}}
)

# Load your trained model
model = joblib.load('model.joblib') 

# List of expected columns (must match the training columns exactly)
selected_features = ['Acer', 'Weight', 'FlashStorage', 'Razer', 'Workstation', 'Ultrabook',
       'Nvidia_GPU', 'Gaming', 'HDD', 'CPU_Frequency', 'SSD', 'Notebook',
       'Screen_Height', 'Screen_Width', 'Ram']

@app.route('/')
def home():
    return "Flask is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Incoming JSON:", data)

        df = pd.DataFrame([data], columns=selected_features)
        print("DataFrame before prediction:", df)

        prediction = model.predict(df)
        return jsonify({'prediction': prediction[0]})
    
    except Exception as e:
        print("Error:", str(e))  # This will show in your terminal
        return jsonify({'error': str(e)}), 500
