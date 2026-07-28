import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProgressProvider } from "./ProgressContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </React.StrictMode>
);