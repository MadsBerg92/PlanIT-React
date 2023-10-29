import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import EventPage from "./pages/EventPage/EventPage.jsx";
import Login from "./pages/LogIn/Login.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventPage/>} />
        <Route path="/EventPage" element={<EventPage />} />
        <Route path="/Login" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
