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
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return null;
  }
}

export default Box;
