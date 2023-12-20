import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import EventPage from "./pages/EventPage/EventPage.jsx";
import Login from "./pages/LogIn/Login.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import CreateEvent from "./pages/CreateEvent/CreateEvent.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import FeedPage from "./pages/FeedPage/FeedPage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import FriendListPage from "./pages/FriendList/FriendList.jsx";
import EditEventPage from "./pages/EditEventPage/EditEventPage.jsx";
import styles from "./Router.css";

const Layout = () => {
  const location = useLocation();
  const showNavBar = location.pathname !== "/";
  const showFooter = location.pathname !== "/";

  return (
    <div className="layout">
      {showNavBar && <NavBar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<FeedPage />} />
          <Route path="/Eventpage/:eventId" element={<EventPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/Friendlist" element={<FriendListPage />} />
          <Route path="/event-creation" element={<CreateEvent />} />
          <Route path="/edit-event/:eventId" element={<EditEventPage />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
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
