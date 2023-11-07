import { useNavigate } from "react-router-dom";
import styles from "./EditProfile.module.css";

const EditProfile = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <div className={styles.header}>
          <h1>Edit Profile</h1>
        </div>
        <div className={styles.editSection}>
          <form action="/updateProfile" method="post">
            <input type="file" id="img" name="img" accept="image/*" />
            <input
              type="text"
              placeholder="Full Name"
              defaultValue="Mads Nielsen"
            />
            <input
              type="email"
              placeholder="Email"
              defaultValue="mads.nielsen@email.dk"
            />
            <input
              type="tel"
              placeholder="Phone"
              defaultValue="+45 1234 5678"
            />
            <input type="date" defaultValue="1990-04-15" />
            <button
              type="submit"
              onClick={() => {
                alert("Dummy Edit on point");
                navigate("/profile");
              }}
              className={styles.updateButton}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
