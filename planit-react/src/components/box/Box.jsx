import React from "react";
import styles from "./box.module.css";

function Box({ title, content = [], type, Button: Button, children }) {
  const renderContent = (item, index) => {
    if (type === "second") {
      return (
        <li key={index}>
          <strong>{item.label}:</strong> {renderValue(item.value)}
          {Button && Button(item)}
        </li>
      );
    } else if (type === "shopping") {
      if (item) {
        return (
          <li key={index}>
            {index + 1}: {item.name}
            {Button && Button(item)}
          </li>
        );
      } else {
        return null;
      }
    }
  };
  if (type === "first") {
    return (
      <div className={styles.box}>
        <h2>{title}</h2>
        <div>{content}</div>
      </div>
    );
  } else {
    return (
      <div className={styles.box}>
        <h2>{title}</h2>
        <ul>{content.map((item, index) => renderContent(item, index))}</ul>
      </div>
    );
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
