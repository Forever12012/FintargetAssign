import React, { useState, useEffect, useRef } from "react";
import { createWebSocket } from "./services/websocketService";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";

// Register the candlestick chart components
Chart.register(CandlestickController, CandlestickElement);

const App = () => {
  const [symbol, setSymbol] = useState("ethusdt");
  const [interval, setInterval] = useState("1m");
  const [candlestickData, setCandlestickData] = useState([]);
  const chartRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (wsRef.current) wsRef.current.close();

    wsRef.current = createWebSocket(symbol, interval, (data) => {
      const { t, o, h, l, c } = data.k;
      setCandlestickData((prev) => [
        ...prev,
        { time: t, open: o, high: h, low: l, close: c },
      ]);
    });

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [symbol, interval]);

  useEffect(() => {
    if (candlestickData.length > 0) {
      localStorage.setItem(symbol, JSON.stringify(candlestickData));
    }
  }, [candlestickData, symbol]);

  useEffect(() => {
    if (chartRef.current && candlestickData.length > 0) {
      const chart = new Chart(chartRef.current, {
        type: "candlestick",
        data: {
          datasets: [
            {
              label: `${symbol.toUpperCase()} Candlestick`,
              data: candlestickData.map((data) => ({
                x: data.time,
                o: data.open,
                h: data.high,
                l: data.low,
                c: data.close,
              })),
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "minute",
              },
            },
            y: {
              beginAtZero: false,
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }
  }, [candlestickData, symbol]);

  return (
    <div className="App">
      <h1>Binance Market Data WebSocket</h1>
      <div className="controls">
        <label>Select Cryptocurrency: </label>
        <select onChange={(e) => setSymbol(e.target.value)} value={symbol}>
          <option value="ethusdt">ETH/USDT</option>
          <option value="bnbusdt">BNB/USDT</option>
          <option value="dotusdt">DOT/USDT</option>
        </select>

        <label>Select Interval: </label>
        <select onChange={(e) => setInterval(e.target.value)} value={interval}>
          <option value="1m">1 Minute</option>
          <option value="3m">3 Minutes</option>
          <option value="5m">5 Minutes</option>
        </select>
      </div>

      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default App;
