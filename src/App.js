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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Binance Market Data WebSocket
        </h1>

        <div className="controls flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <div className="flex items-center space-x-3">
            <label className="text-lg">Select Cryptocurrency:</label>
            <select
              onChange={(e) => setSymbol(e.target.value)}
              value={symbol}
              className="bg-gray-800 border border-gray-600 text-white py-2 px-3 rounded-lg transition duration-300 ease-in-out hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ethusdt">ETH/USDT</option>
              <option value="bnbusdt">BNB/USDT</option>
              <option value="dotusdt">DOT/USDT</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-lg">Select Interval:</label>
            <select
              onChange={(e) => setInterval(e.target.value)}
              value={interval}
              className="bg-gray-800 border border-gray-600 text-white py-2 px-3 rounded-lg transition duration-300 ease-in-out hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1m">1 Minute</option>
              <option value="3m">3 Minutes</option>
              <option value="5m">5 Minutes</option>
            </select>
          </div>
        </div>

        <div className="chart-container bg-gray-800 p-4 rounded-lg shadow-lg">
          <canvas ref={chartRef} className="w-full h-96"></canvas>
        </div>

        <footer className="mt-8 text-center text-gray-400">
          <p className="text-sm">Real-time data powered by Binance</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
