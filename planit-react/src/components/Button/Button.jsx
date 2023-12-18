import styles from "./Button.module.css";
import React from "react";
import { useState, useEffect } from "react";
import Parse from "parse";

/**
 * Button component.
 * @param {Object} props - The component props.
 * @param {string} props.textActive - The text to display when the button is active.
 * @param {string} props.textInactive - The text to display when the button is inactive.
 * @param {boolean} props.isActive - Indicates whether the button is active or not.
 * @param {function} props.onClick - The function to be called when the button is clicked.
 * @param {string} props.type - The type of button.
 * @returns {JSX.Element} The rendered Button component.
 */
function Button({ textActive, textInactive, isActive, onClick, type }) {
  //Setting the status
  const [userId, setUserId] = useState("");

  const buttonText = isActive ? textActive : textInactive;

  useEffect(() => {
    // Fetch the current user's userId when the component mounts
    /**
     * Fetches the user ID asynchronously.
     * @returns {Promise<void>} A promise that resolves when the user ID is fetched.
     */
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
      break;
    case "delete":
      buttonClass = styles.deleteButton;
      break;
    case "cancel":
      buttonClass = styles.cancelButton;
      break;
    case "deleteFriend":
      buttonClass = styles.deleteFriend;
      break;
    default:
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
