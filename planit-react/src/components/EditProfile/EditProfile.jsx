// EditProfile.jsx

import style from "./EditProfile.module.css";
import styles from "../../pages/ProfilePage/ProfilePage.module.css";
import { useState, useEffect } from "react";
import Parse from "parse";
import InputBox from "../../components/InputBox/InputBox.jsx";

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
  const previewImage = (event) => {
    const preview = document.querySelector("#profile-picture-preview");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      preview.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  };
  return (
    <div>
      {isEditing ? (
        <div>
          <div className={style.header}>
            <h2>My Profile</h2>
          </div>
          <img
            id="profile-picture-preview"
            className={style.profile_picture}
            src="./Images/user-profile.png"
          ></img>
          <div className={style.editSection}>
            <form>
              <InputBox
                id="user-name"
                label="User Name"
                name="user-name"
                type="username"
                placeholder={profile.get("username")}
                required
              />
              <InputBox
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder={profile.get("email")}
                required
              />

              <button
                className={style.button}
                onClick={() => setIsEditing(false)}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.header}>
            <h1>Edit Your Profile</h1>
          </div>

          <img
            id="profile-picture-preview"
            className={style.profile_picture}
            src="./Images/user-profile.png"
          ></img>

          <div className={styles.editSection}>
            <form action="/updateProfile" method="post">
              <InputBox
                label="Profile Picture"
                type="file"
                onChange={previewImage}
                required
              />
              <InputBox
                id="user-name"
                label="User Name"
                name="user-name"
                type="username"
                placeholder={profile.get("username")}
                required
              />

              <InputBox
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder={profile.get("email")}
                required
              />

              <button
                type="submit"
                onClick={() => {
                  setIsEditing(true);
                }}
                className={styles.updateButton}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
