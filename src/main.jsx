import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./amplify-config"; // ✅ This line is missing in your current file!

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
