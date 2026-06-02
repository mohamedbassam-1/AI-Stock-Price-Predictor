from flask import Flask, render_template, request, jsonify
import yfinance as yf
import numpy as np
import pickle
import os
import tensorflow as tf

app = Flask(__name__)

# Core Model Configurations matching your architecture
LOOKBACK_WINDOW = 50  

# Safely load the trained LSTM models and processing scalers
model = None
scaler = None

try:
    if os.path.exists('lstm_model.keras'):
        model = tf.keras.models.load_model('lstm_model.keras', compile=False)
        print("Successfully loaded Keras LSTM Engine.")
    elif os.path.exists('stock_model.pkl'):
        with open('stock_model.pkl', 'rb') as file:
            model = pickle.load(file)
            print("Successfully loaded Pickled Model Engine.")
except Exception as e:
    print(f"Error loading model engines: {e}")

try:
    if os.path.exists('scaler.pkl'):
        with open('scaler.pkl', 'rb') as file:
            scaler = pickle.load(file)
            print("Data Scaler loaded successfully.")
except Exception as e:
    print(f"Error loading data scaler: {e}")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Grab stock ticker token from client payload
        stock_symbol = request.form.get("stock_value", "").upper().strip()
        if not stock_symbol:
            return jsonify({"error": "Stock symbol field cannot be left blank."})
            
        stock = yf.Ticker(stock_symbol)
        
        # 2. Extract historical records for inference (Fetching extra days to ensure a complete window)
        historical_raw = stock.history(period="3mo")
        if historical_raw.empty or len(historical_raw) < LOOKBACK_WINDOW:
            return jsonify({"error": f"Insufficient historical tracking entries found for token: '{stock_symbol}'"})
            
        # Isolate closing points
        closing_prices = historical_raw['Close'].values
        latest_price = closing_prices[-1]
        previous_close = closing_prices[-2]
        
        # Calculate variations
        change_value = latest_price - previous_close
        change_percentage = (change_value / previous_close) * 100
        change_text = f"{'+' if change_value >= 0 else ''}{change_value:.2f} ({'+' if change_value >= 0 else ''}{change_percentage:.2f}%)"
        change_icon = "▲" if change_value > 0 else "▼" if change_value < 0 else ""
        
        # Extra calculated metrics
        avg_2week = np.mean(closing_prices[-14:])
        avg_prediction_text = "Likely to Increase" if avg_2week > previous_close else "Likely to Decrease"
        
        # 3. Handle Neural Network Prediction Math
        predicted_price_str = "Engine Offline"
        trend_suggestion = "Hold / Analyze"
        suggestion_icon = "⏳"
        
        if model is not None and scaler is not None:
            # Extract exactly the last 50 sequential values
            target_window = closing_prices[-LOOKBACK_WINDOW:].reshape(-1, 1)
            
            # Apply identical scaling weights
            scaled_data = scaler.transform(target_window)
            
            # Reshape vector layout for LSTM layers: [batch, timesteps, features]
            lstm_matrix_input = np.reshape(scaled_data, (1, LOOKBACK_WINDOW, 1))
            
            # Execute calculation
            prediction_output = model.predict(lstm_matrix_input)
            
            # Invert values back to regular fiat scale
            raw_prediction = scaler.inverse_transform(prediction_output)
            final_pred_val = float(raw_prediction[0][0])
            predicted_price_str = f"${final_pred_val:.2f}"
            
            # Formulate strategic analytics logic
            if final_pred_val > latest_price:
                trend_suggestion = "Buy Target Detected"
                suggestion_icon = "✅"
            else:
                trend_suggestion = "Sell Risk Detected / Avoid"
                suggestion_icon = "❌"

        return jsonify({
            "currentPrice": f"${latest_price:.2f}",
            "change": change_text,
            "changeIcon": change_icon,
            "trend": change_icon,
            "twoWeekPrediction": avg_prediction_text,
            "suggestion": trend_suggestion,
            "suggestionIcon": suggestion_icon,
            "predictedPrice": predicted_price_str
        })
        
    except Exception as error_log:
        return jsonify({"error": f"Operational Execution Fault: {str(error_log)}"})

if __name__ == '__main__':
    app.run(debug=True)