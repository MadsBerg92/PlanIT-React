import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import EventPage from "./pages/EventPage/EventPage.jsx";
import Login from "./pages/LogIn/Login.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import EditProfile from "./pages/EditProfile/EditProfile.jsx";
import CreateEvent from "./pages/CreateEvent/CreateEvent.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventPage />} />
        <Route path="/EventPage" element={<EventPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/CreateEvent" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
