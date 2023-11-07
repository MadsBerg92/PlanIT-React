import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import EventPage from "./pages/EventPage/EventPage.jsx";
import Login from "./pages/LogIn/Login.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import EditProfile from "./pages/EditProfile/EditProfile.jsx";
import CreateEvent from "./pages/CreateEvent/CreateEvent.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import FeedPage from "./pages/FeedPage/FeedPage.jsx";

const Layout = () => {
  const location = useLocation();
  const showNavBar = location.pathname !== "/login";

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/Eventpage" element={<EventPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/event-creation" element={<CreateEvent />} />
      </Routes>
    </>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default AppRouter;
