import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import env from "dotenv";


const root = ReactDOM.createRoot(document.getElementById("root"));
const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
console.log("12",googleApiKey, googleApiKey);
root.render(
  <GoogleOAuthProvider clientId={googleApiKey}>
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  </GoogleOAuthProvider>
);
