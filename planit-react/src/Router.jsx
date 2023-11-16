import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import EventPage from "./pages/EventPage/EventPage.jsx";
import Login from "./pages/LogIn/Login.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import EditProfile from "./pages/EditProfile/EditProfile.jsx";
import CreateEvent from "./pages/CreateEvent/CreateEvent.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import FeedPage from "./pages/FeedPage/FeedPage.jsx";
import Footer from "./components/Footer/Footer.jsx";

const Layout = () => {
  const location = useLocation();
  const showNavBar = location.pathname !== "/";

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<FeedPage />} />
        <Route path="/Eventpage/:eventId" element={<EventPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/event-creation" element={<CreateEvent />} />
      </Routes>
      <Footer/>
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
