import styles from "./button.module.css"
import React from 'react';

function Button(props) {
  let buttonClass = styles.normalButton;

  if (props.type === 'special') {
    buttonClass = styles.specialButton;
  } else if (props.type === 'custom') {
    buttonClass = styles.customButton;
  } 

  return (
    <button
      className={`${buttonClass} ${props.isActive ? styles.active : ""}`}  // Optional: Pass a class name as a prop for styling
      onClick={props.onClick}      // Handle the button click event
      disabled={props.disabled}    // Optional: Disable the button based on a prop
      type={props.type}
    >
      {props.label}               {/* Button label passed as a prop */}
    </button>
  );
}

export default Button;

