# app.py
import streamlit as st
from database import MongoDB
from model import StockPredictor
import pandas as pd
import plotly.express as px

# Initialize components
db = MongoDB()
predictor = StockPredictor()

st.title("Stock Prediction System")

# Sidebar for user input
st.sidebar.header("User Input")
symbol = st.sidebar.text_input("Stock Symbol", "AAPL")
days_to_predict = st.sidebar.slider("Days to Predict", 1, 90, 30)
action = st.sidebar.selectbox("Action", ["View Data", "Make Prediction"])

if action == "View Data":
    st.header(f"Historical Data for {symbol}")
    data = db.get_latest_stock_data(symbol, limit=100)
    if data:
        df = pd.DataFrame(data)
        fig = px.line(df, x="date", y="close", title=f"{symbol} Closing Prices")
        st.plotly_chart(fig)
    else:
        st.warning("No data found for this symbol")

elif action == "Make Prediction":
    st.header(f"Prediction for {symbol}")
    if st.button("Run Prediction"):
        with st.spinner("Training model and making predictions..."):
            predictions = predictor.train_and_predict(symbol, days_to_predict)
            
            if predictions:
                pred_df = pd.DataFrame(predictions)
                fig = px.line(pred_df, x="date", y="predicted_price", 
                             title=f"Predicted Prices for {symbol}")
                st.plotly_chart(fig)
                
                st.success("Prediction completed!")
                st.dataframe(pred_df)
            else:
                st.error("Prediction failed. Please try again.")