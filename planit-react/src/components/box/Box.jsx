import React from "react";
import styles from "./box.module.css";

function Box({ title, content, type }) {
  const renderContent = (item, index) => {
    if (type === "second") {
      return (
        <li key={index}>
          <strong>{item.label}:</strong> {item.value}
        </li>
      );
    } else if (type === "shopping") {
      return (
        <li key={index}>
          {index + 1}: {item.name}
        </li>
      );
    }
  };

  if (type === "first") {
    return (
      <div className={styles.box}>
        <h2>{title}</h2>
        <p>{content}</p>
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

export default Box;
