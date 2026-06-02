# AI Stock Price Predictor & FinTech Analytics Dashboard

An end-to-end deep learning web application that uses Long Short-Term Memory (LSTM) recurrent neural networks to process time-series market streams and forecast asset valuations.

## 🚀 Project Overview
This predictive analytics architecture bridges real-time financial market data parsing with deep learning inference. The system uses the Yahoo Finance API (`yfinance`) to inject historical equity records, preprocesses data vectors with Scikit-Learn pipelines, executes multi-timestep predictions with a trained TensorFlow LSTM network, and displays outputs inside a responsive data-grid web dashboard.

## 🛠️ Core Technology Stack
* **Deep Learning Pipeline:** TensorFlow / Keras (Sequential LSTM Architectures)
* **Data Processing & Engineering:** Scikit-Learn (`MinMaxScaler`), NumPy, Pandas
* **Web Framework Engine:** Flask (Python REST API Backend)
* **Financial Data Source:** Yahoo Finance Core API (`yfinance`)
* **Frontend Design Framework:** Vanilla HTML5, Advanced CSS3 Glassmorphic Styling, Modern Asynchronous JavaScript (Fetch API Engine)

## 📊 Core Operational Features
* **Real-Time Data Ingestion:** Dynamic REST endpoints fetch market variations using token signatures (e.g., AAPL, NVDA, TSLA) straight from global exchanges.
* **Time-Series Sliding Window Engine:** Isolates a 50-day sliding historical lookback sequence to format array structures ($1, 50, 1$) required by Recurrent Neural Networks.
* **Advanced Evaluation Framework:** Calculates 14-day momentum shifting thresholds, asset delta variations, and predictive buy/sell validation parameters.
* **Premium Interactive Interface:** A responsive dark-mode cockpit styled with a sapphire-to-midnight cosmic gradient, custom status color badges, and loading stutters protection.

## 📁 System Architecture & Directory Tree
```text
├── app.py                  # Core Flask Engine, API endpoints & model inference loop
├── lstm_model.keras        # Trained production Keras LSTM Neural Network layers
├── stock_model.pkl         # Serialized backup model file parameters
├── scaler.pkl              # Pickled MinMax preprocessing matrix scaling weights
├── Requirements.txt        # System library version specifications
├── static/
│   ├── styles.css          # Premium cosmic animated UI design parameters
│   └── script.js           # Asynchronous DOM rendering listeners & API calls
└── templates/
    └── index.html          # Main financial metrics dashboard structure
