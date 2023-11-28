import styles from "./Button.module.css";
import React from "react";
import { useState, useEffect } from "react";
import Parse from "parse";

function Button({ props, textActive, textInactive, isActive, onClick, type }) {
  //Setting the status
  const [userId, setUserId] = useState("");

  const buttonText = isActive ? textActive : textInactive;

  useEffect(() => {
    // Fetch the current user's userId when the component mounts
    const fetchUserId = async () => {
      try {
        const currentUser = Parse.User.current();
        if (currentUser) {
          setUserId(currentUser.id);
        } else {
          console.log("No current user.");
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUserId();
  }, []);

  // Changing the styling by defining type.
  let buttonClass;

  switch (type) {
    case "special":
      buttonClass = styles.specialButton;
      break;
    case "custom":
      buttonClass = styles.customButton;
      break;
    case "create":
      buttonClass = styles.createButton;
      break;
    case "shoppingList":
      buttonClass = styles.shoppingListBtn;
      break;
    case "normal":
      buttonClass = styles.normalButton;
  }
  //Define a different onclick function when you create an instance of button to change the onclick behavior!
  return (
    <div>
      <button
        className={`${buttonClass} ${isActive ? styles.active : ""}`}
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default Button;
