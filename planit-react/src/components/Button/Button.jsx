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

  const toggleStatus = async () => {
    try {
      setIsActive(!isActive);

      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);

      // Assume you have an objectId for the specific event
      const eventId = props.eventId; // Make sure to pass the eventId as a prop

      const event = await query.get(eventId);

      if (isActive) {
        // If isActive is true, add the userId to the attendees array
        event.addUnique("attendees", userId);
      } else {
        // If isActive is false, remove the userId from the attendees array
        event.remove("attendees", userId);
      }

      await event.save();
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };


  // Changing the styling by defining type.
  let buttonClass = styles.normalButton;


  if (type === "special") {
    buttonClass = styles.specialButton;
  } else if (type === "custom") {
    buttonClass = styles.customButton;
  } else if (type === "create") {
    buttonClass = styles.createButton;
  } else if (type === "shoppingList") {
    buttonClass = styles.shoppingListBtn;
  }
  //Define a different onclick function when you create an instance of button to change the onclick behavior!
  return (
    <div>
      <button
        className={`${buttonClass} ${isActive ? styles.active : ""}`}
        type="button"
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default Button;
