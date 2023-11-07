import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from "react";
import EventPage from "./pages/EventPage/EventPage.jsx";
import Login from "./pages/LogIn/Login.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import EditProfile from "./pages/EditProfile/EditProfile.jsx";
import CreateEvent from "./pages/CreateEvent/CreateEvent.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";


const AppRouter = () => {
  return (
    <BrowserRouter>


      <NavBar />

    

      <Routes>
        <Route path="/" element={<EventPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/event-creation" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
