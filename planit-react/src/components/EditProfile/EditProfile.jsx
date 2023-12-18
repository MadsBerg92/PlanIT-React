// EditProfile.jsx

import style from "./EditProfile.module.css";
import styles from "../../pages/ProfilePage/ProfilePage.module.css";
import { useState, useEffect } from "react";
import Parse from "parse";
import InputBox from "../../components/InputBox/InputBox.jsx";
import Button from "../Button/Button.jsx";
/**
 * EditProfile component for editing user profile information.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The EditProfile component.
 */

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

  /**
   * Preview the selected image file and display it in the profile picture preview element.
   * @param {Event} event - The event object triggered by selecting an image file.
   */
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
  /**
   * Handles the form submission for editing the user profile.
   *
   * @param {Event} event - The form submission event.
   */
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
  const handleBack = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <img
            id="profile-picture-preview"
            className={style.profile_picture}
            src={profile.get("profilePicture").url()}
            alt=""
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
              <Button type="submit" textInactive="Save Changes" />
              <Button type="cancel" textInactive="Back" onClick={handleBack} />
            </form>
          </div>
        </div>
      ) : (
        <div>
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
              <Button
                type="create"
                textInactive="Edit Your Profile"
                onClick={() => setIsEditing(true)}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
