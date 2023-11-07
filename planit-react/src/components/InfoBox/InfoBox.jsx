import React from 'react';
import styles from "./infoBox.module.css"

function InformationBox({ title, content }) {
  return (
    <div className={styles.informationBox}>
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
}

export default InformationBox;
