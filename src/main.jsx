import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import { StoreProvider } from "./store.jsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StoreProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StoreProvider>
);
