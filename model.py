# model.py
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
from database import MongoDB
import joblib

class StockPredictor:
    def __init__(self):
        self.db = MongoDB()
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.look_back = 60  # Number of previous days to consider
        
    def prepare_data(self, symbol):
        data = self.db.get_latest_stock_data(symbol, limit=1000)
        df = pd.DataFrame(data)
        df = df.sort_values("date")
        
        # Use closing prices
        dataset = df["close"].values.reshape(-1, 1)
        dataset = dataset.astype('float32')
        
        # Normalize the dataset
        scaled_data = self.scaler.fit_transform(dataset)
        
        # Create training data
        x_train, y_train = [], []
        
        for i in range(self.look_back, len(scaled_data)):
            x_train.append(scaled_data[i-self.look_back:i, 0])
            y_train.append(scaled_data[i, 0])
            
        x_train, y_train = np.array(x_train), np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
        
        return x_train, y_train, df
    
    def build_model(self):
        model = Sequential()
        model.add(LSTM(units=50, return_sequences=True, 
                      input_shape=(self.look_back, 1)))
        model.add(Dropout(0.2))
        model.add(LSTM(units=50, return_sequences=False))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model
    
    def train_and_predict(self, symbol, future_days=30):
        x_train, y_train, df = self.prepare_data(symbol)
        
        model = self.build_model()
        model.fit(x_train, y_train, epochs=20, batch_size=32)
        
        # Save model
        model.save(f"models/{symbol}_model.h5")
        joblib.dump(self.scaler, f"models/{symbol}_scaler.save")
        
        # Make predictions
        last_sequence = x_train[-1]
        predictions = []
        
        for _ in range(future_days):
            pred = model.predict(last_sequence.reshape(1, self.look_back, 1))
            predictions.append(pred[0, 0])
            
            # Update sequence
            last_sequence = np.roll(last_sequence, -1)
            last_sequence[-1] = pred[0, 0]
        
        # Inverse transform predictions
        predictions = self.scaler.inverse_transform(
            np.array(predictions).reshape(-1, 1))
        
        # Create prediction dates
        last_date = df["date"].iloc[-1]
        prediction_dates = pd.date_range(
            last_date, periods=future_days+1)[1:]
        
        # Save predictions to DB
        prediction_records = []
        for date, pred in zip(prediction_dates, predictions):
            record = {
                "symbol": symbol,
                "date": date,
                "predicted_price": float(pred[0]),
                "created_at": datetime.now()
            }
            prediction_records.append(record)
        
        self.db.prediction_results.insert_many(prediction_records)
        
        return prediction_records