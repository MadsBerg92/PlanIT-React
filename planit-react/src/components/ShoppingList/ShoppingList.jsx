import styles from "./ShoppingList.module.css";
import React, { useContext } from "react";
import { ShoppingListContext } from "../../Context/ShoppingListContext.jsx";

function ShoppingList({ title, content }) {
  const { shoppingList, isLoading } = React.useContext(ShoppingListContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.shoppingListBox}>
      <div>
        <h2>{title}</h2>
        <ul>
          {shoppingList.map((item, index) => (
            <li key={index}>
              Item {index + 1}: {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ShoppingList;
