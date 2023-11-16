// EditProfile.jsx
import { useNavigate } from "react-router-dom";
import styles from "../../pages/ProfilePage/ProfilePage.module.css";

const EditProfile = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.details}>
      <h2>My Profile</h2>
      <p>
        <strong>Email:</strong>{" "}
        <input type="email" defaultValue="mads.nielsen@email.dk" />
      </p>
      <p>
        <strong>Phone:</strong>{" "}
        <input type="tel" defaultValue="+45 1234 5678" />
      </p>
      <p>
        <strong>Birthday:</strong>{" "}
        <input type="date" defaultValue="1990-04-15" />
      </p>
      <button
        className={styles.saveButton}
        onClick={() => navigate("/profile")}
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
