// EditProfile.jsx

import styles from "../../pages/ProfilePage/ProfilePage.module.css";
import { useState, useEffect } from "react";
import Parse from "parse";

const EditProfile = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const user = Parse.User.current();
    if (user) {
      setProfile(user);
    } else {
      console.log("No user is currently logged in");
    }
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isEditing ? (
        <div>
          <div className={styles.header}>
            <h1>My Profile</h1>
          </div>
          <div className={styles.editSection}>
            <form action="/updateProfile" method="post">
              <input type="file" id="img" name="img" accept="image/*" />
              <input defaultValue={profile.get("username")} />
              <input
                type="email"
                placeholder="Email"
                defaultValue={profile.get("email")}
              />

              <button
                type="submit"
                onClick={() => {
                  setIsEditing(false);
                }}
                className={styles.updateButton}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.header}>
            <h2>Edit Profile</h2>
          </div>
          <div className={styles.editSection}>
            <p>
              <strong>User Name:</strong>{" "}
              <input type="email" defaultValue={profile.get("name")} />
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <input type="name" defaultValue={profile.get("email")} />
            </p>
            {/* <p>
            <strong>Birthday:</strong>{" "}
            <input type="date" defaultValue="1990-04-15" />
          </p> */}
            <button
              className={styles.saveButton}
              onClick={() => setIsEditing(true)}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
