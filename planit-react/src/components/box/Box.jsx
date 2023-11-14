import React from "react";
import styles from "./box.module.css";

function Box({ title, content, type }) {
  if (type === "first") {
    return (
      <div className={styles.box}>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    );
  } else if (type === "second") {
    return (
      <div className={styles.box}>
        <h2>{title}</h2>
        <ul>
          {content.map((item, index) => (
            <li key={index}>
              <strong>{item.label}:</strong> {renderValue(item.value)}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return null;
  }
}

function renderValue(value) {
  // Handle special rendering for certain types, e.g., Date
  if (value instanceof Date) {
    return value.toLocaleString(); // Adjust this based on your date formatting preference
  }

  return value;
}

export default Box;
