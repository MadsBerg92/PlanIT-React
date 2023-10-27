import styles from "./button.module.css"
import React from 'react';

function Button(props) {
  return (
    <button
      className={props.className}  // Optional: Pass a class name as a prop for styling
      onClick={props.onClick}      // Handle the button click event
      disabled={props.disabled}    // Optional: Disable the button based on a prop
    >
      {props.label}               {/* Button label passed as a prop */}
    </button>
  );
}

export default Button;

