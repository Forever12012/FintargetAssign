export const createWebSocket = (symbol, interval, onMessage) => {
  const ws = new WebSocket(`ws://localhost:4000/ws/${symbol}/${interval}`);

  ws.onmessage = async (event) => {
    // Check if the message is a Blob
    if (event.data instanceof Blob) {
      const textData = await event.data.text(); // Convert Blob to text
      const parsedData = JSON.parse(textData); // Parse the text to JSON
      if (parsedData && parsedData.k) {
        onMessage(parsedData);
      }
    } else {
      // If it's not a Blob (just in case)
      const parsedData = JSON.parse(event.data);
      if (parsedData && parsedData.k) {
        onMessage(parsedData);
      }
    }
  };

  ws.onclose = () => console.log("WebSocket closed");
  ws.onerror = (error) => console.error("WebSocket error:", error);

  return ws;
};
