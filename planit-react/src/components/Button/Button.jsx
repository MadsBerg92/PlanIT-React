import styles from "./Button.module.css";
import React from "react";
// import { useState } from "react";

function Button(props) {
  const isActive = props.isActive;

  const buttonText = isActive ? props.textActive : props.textInactive;

  // Changing the styling by defining type.

  let buttonClass = styles.normalButton;
  switch (props.type) {
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
    default:
      buttonClass = styles.normalButton;
  }

  //Define a different onclick function when you create an instance of button to change the onclick behavior!
  return (
    <button
      className={`${buttonClass} ${isActive ? styles.active : ""}`} // Optional: Pass a class name as a prop for styling
      onClick={() => {
        props.onClick();
      }}
      // disabled={props.disabled}    // Optional: Disable the button based on a prop
      type={props.type}
    >
      {/* Button label passed as a prop */}
      {buttonText}
    </button>
  );
}

export default Button;
