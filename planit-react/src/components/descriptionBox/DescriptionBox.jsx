import React from 'react';
import styles from "./descriptionBox.module.css";

function DescriptionBox({ title, content }) {
  return (
    <div className={styles.descriptionBox}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}

export default DescriptionBox;
