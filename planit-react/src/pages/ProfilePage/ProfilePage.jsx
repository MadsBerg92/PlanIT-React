// Profile.jsx
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import EditProfile from "../../components/EditProfile/EditProfile";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <EditProfile />
    </>
  );
};

export default ProfilePage;
