import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { StoreProvider } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>
);