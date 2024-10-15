# Cryptocurrency Charting App

This is a real-time cryptocurrency charting application that uses WebSocket to fetch market data from Binance. It displays candlestick charts for selected cryptocurrencies, allowing users to analyze price movements over different time intervals.

## Features

- Real-time candlestick charting for popular cryptocurrencies (e.g., ETH/USDT, BNB/USDT, DOT/USDT).
- Customizable time intervals (1 minute, 3 minutes, and 5 minutes).
- Data persistence using local storage for historical price analysis.
- Responsive design powered by Tailwind CSS.

## Tech Stack

- **React**: For building the user interface.
- **Chart.js**: For rendering the candlestick charts.
- **Tailwind CSS**: For styling the application.
- **WebSocket**: For real-time data updates from the Binance API.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Forever12012/FintargetAssign.git

2. **Navigate to the project directory**:
   cd FintargetAssign

3. **Install the dependencies**:
   npm install

4. **Start the development server**:
   npm start

## Usage

1. **Select a Cryptocurrency**: Use the dropdown menu to choose the cryptocurrency you want to analyze.
2. **Select a Time Interval**: Choose the time interval for the candlestick chart from the provided options.
3. **View the Chart**: The candlestick chart will update in real-time as new data comes in from the WebSocket.

