import React from "react";
import styles from "./box.module.css";

/**
 * Renders a box component with customizable content based on the provided props.
 *
 * @param {Object} props - The props for the Box component.
 * @param {string} props.title - The title of the box.
 * @param {Array} [props.content=[]] - The content to be rendered inside the box.
 * @param {string} props.type - The type of the box.
 * @param {React.Component} props.Button - The button component to be rendered.
 * @param {React.ReactNode} props.children - The children components to be rendered inside the box.
 * @returns {React.ReactNode} The rendered Box component.
 */
function Box({ title, content = [], type, Button, ExtraButton, children }) {
  const renderContent = (item, index) => {
    if (type === "second") {
      const showColon = item.label && item.label.length > 0;
      return (
        <li key={index}>
          <strong>
            {item.label}
            {showColon ? ":" : ""}
          </strong>{" "}
          {renderValue(item.value)}
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

  const renderBoxContent = () => {
    if (content.length === 0) {
      return (
        <p className={styles.noFriendsMessage}>
          You don't seem to have any friends yet, search for them and add them
          here!
        </p>
      );
    } else {
      return (
        <ul>{content.map((item, index) => renderContent(item, index))}</ul>
      );
    }
  };

  if (type === "first") {
    return (
      <div className={styles.box}>
        <h2>{title}</h2>
        <div>{content}</div>
        {children}
      </div>
    );
  } else {
    return (
      <div className={styles.box}>
        <h2>{title}</h2>
        {ExtraButton && (
          <div className={styles.extraButton}>{ExtraButton()}</div>
        )}
        {renderBoxContent()}
        {children}
      </div>
    );
  }
}

function renderValue(value) {
  if (value instanceof Date) {
    return value.toLocaleString();
  }

  return value;
}

export default Box;
