import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";

import Parse from "parse";

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = "1Rlktuc7TuG8QhZi4UqFPHRbrqnrYQilMCZb0jz5";
const PARSE_JAVASCRIPT_KEY = "vNDpn9RfEHerJ7prekfEV6V1ilw5XBFbP9PpTUpr";
const PARSE_HOST_URL = "https://parseapi.back4app.com/";
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
