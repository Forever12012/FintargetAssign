const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const port = 4000;

const cors = require("cors");
app.use(cors());

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Upgrade to WebSocket connection when clients connect to '/ws/:symbol/:interval'
wss.on("connection", (client, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const symbol = url.pathname.split("/")[2]; // Extract symbol from URL
  const interval = url.pathname.split("/")[3]; // Extract interval from URL

  // Create connection to Binance WebSocket stream
  const binanceWs = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
  );

  // Forward messages from Binance WebSocket to connected clients
  binanceWs.on("message", (data) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data); // Send data to client
    }
  });

  binanceWs.on("error", (error) =>
    console.log("Binance WebSocket Error:", error)
  );

  client.on("close", () => {
    binanceWs.close(); // Close Binance WebSocket when client disconnects
  });
});

// Start HTTP server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
