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

  //Preview image when changing profile picture
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

  //Submit button when updating profile information
  const handleSubmit = (event) => {
    event.preventDefault();

    const username = event.target.elements["username"].value;
    const email = event.target.elements["email"].value;
    const profilePicture = new Parse.File(
      "profilePicture",
      event.target.elements["profilePicture"].files[0]
    );

    const user = Parse.User.current();

    user.set("email", email);
    user.set("username", username);
    user.set("profilePicture", profilePicture);

    user
      .save()
      .then((user) => {
        console.log("User updated successfully");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error while updating user", error);
      });
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <div className={styles.header}>
            <h1>Edit Your Profile</h1>
          </div>

          <img
            id="profile-picture-preview"
            className={style.profile_picture}
            src={profile.get("profilePicture").url()}
          ></img>

          <div className={styles.editSection}>
            <form action="/updateProfile" method="post" onSubmit={handleSubmit}>
              <InputBox
                label="Profile Picture"
                type="file"
                name="profilePicture"
                onChange={previewImage}
                required
              />
              <InputBox
                id="user-name"
                label="User Name"
                name="username"
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

              <button type="submit" className={styles.updateButton}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className={style.header}>
            <h2>My Profile</h2>
          </div>
          <img
            id="profile-picture-preview"
            className={style.profile_picture}
            src={profile.get("profilePicture").url()}
          ></img>
          <div className={styles.editSection}>
            <form>
              <InputBox
                id="user-name"
                label="User Name"
                name="user-name"
                type="username"
                disabled={true}
                placeholder={profile.get("username")}
                required
              />
              <InputBox
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder={profile.get("email")}
                disabled={true}
                required
              />

              <button
                className={style.button}
                onClick={() => setIsEditing(true)}
              >
                Edit your profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
