import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import Router from "./Router";

import Login from "./pages/LogIn/Login";
import { Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div>
      <Router>
        <div>
          <Route exact path=".\LogIn\Login.jsx" component={Login} />
        </div>
      </Router>
    </div>
  </React.StrictMode>
);
