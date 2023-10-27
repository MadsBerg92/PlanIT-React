import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import EventPage from "./pages/EventPage.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventPage/>} />
        <Route path="/EventPage" element={<EventPage />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
