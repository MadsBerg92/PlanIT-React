// Profile.jsx
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div>
        <div className={styles.header}>
          <img
            alt="user pic"
            src="/images/user-profile.png"
            className={styles.profileImage}
          />
          <h1>Mads Nielsen</h1>
          <p>Copenhagen, Denmark</p>
        </div>
        <div className={styles.details}>
          <h2>Profile Details</h2>
          <p>
            <strong>Email:</strong> mads.nielsen@email.dk
          </p>
          <p>
            <strong>Phone:</strong> +45 1234 5678
          </p>
          <p>
            <strong>Birthday:</strong> 15th April 1990
          </p>
          <button
            className={styles.editButton}
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
