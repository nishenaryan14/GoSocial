import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ColorContextProvider } from "./context/ColorContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ColorContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ColorContextProvider>
);
