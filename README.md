# Binance WebSocket Server

This is a simple Express WebSocket server that streams real-time candlestick data from the Binance API. The server establishes a WebSocket connection to Binance for a specified cryptocurrency symbol and time interval, allowing clients to receive live market updates.

## Features

- WebSocket server for real-time cryptocurrency data.
- Streams candlestick (Kline) data for specified symbols (e.g., ETH/USDT) and intervals (e.g., 1m, 3m).
- CORS support for cross-origin requests.

## Tech Stack

- **Node.js**: JavaScript runtime for server-side programming.
- **Express**: Web framework for building the server.
- **WebSocket**: For real-time communication.
- **CORS**: Middleware for enabling CORS (Cross-Origin Resource Sharing).

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/binance-websocket-server.git
