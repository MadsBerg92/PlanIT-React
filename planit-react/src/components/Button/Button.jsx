import styles from "./Button.module.css"
import React from 'react';
import {useState} from 'react';

function Button(props) {
  //Setting the status
  const [isActive, setIsActive] = useState(false);
  //If you want standard behavior define textActive and textInactive (default is inactive)
  //If you want to define a different onClick function, then define textInactive only.
  const buttonText = isActive ? props.textActive : props.textInactive
  
  const toggleStatus = () => {
    setIsActive(!isActive);
  }
  

  // Changing the styling by defining type.
  let buttonClass = styles.normalButton;

  if (props.type === 'special') {
    buttonClass = styles.specialButton;
  } else if (props.type === 'custom') {
    buttonClass = styles.customButton;
  } else if (props.type === "create") {
    buttonClass = styles.createButton;
  } else if (props.type === "shoppingList") {
    buttonClass = styles.shoppingListBtn;
}
  //Define a different onclick function when you create an instance of button to change the onclick behavior!
  return (
    <button
      className={`${buttonClass} ${isActive ? styles.active : ""}`}  // Optional: Pass a class name as a prop for styling
      onClick={ () => {
        
        if (props.onClick) {
          props.onClick();
        } else {
          toggleStatus();
        }
      }}    
      // disabled={props.disabled}    // Optional: Disable the button based on a prop
      type={props.type}
    >
      {buttonText}              {/* Button label passed as a prop */}
    </button>
  );
}

export default Button;

