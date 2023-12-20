import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import Parse from "parse";
import { ShoppingListProvider } from "./Context/ShoppingListContext";

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = "1Rlktuc7TuG8QhZi4UqFPHRbrqnrYQilMCZb0jz5";
const PARSE_JAVASCRIPT_KEY = "vNDpn9RfEHerJ7prekfEV6V1ilw5XBFbP9PpTUpr";
const PARSE_HOST_URL = "https://parseapi.back4app.com/";
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

const LiveQueryClient = Parse.LiveQueryClient;
const client = new LiveQueryClient({
  applicationId: PARSE_APPLICATION_ID,
  serverURL: "wss://planit.b4a.io", // Replace with your WebSocket server URL
  javascriptKey: PARSE_JAVASCRIPT_KEY,
});
client.open();

// Make the LiveQuery client available to your React components
export const LiveQueryClientContext = React.createContext();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LiveQueryClientContext.Provider value={client}>
      <ShoppingListProvider>
        <App />
      </ShoppingListProvider>
    </LiveQueryClientContext.Provider>
  </React.StrictMode>
);
