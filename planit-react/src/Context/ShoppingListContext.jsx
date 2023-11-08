import React from "react";
import { useState } from "react";

export const ShoppingListContext = React.createContext();

export const ShoppingListProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading] = useState(true);

  // Here we will ultimately fetch the shopping list from the backend

  return (
    <ShoppingListContext.Provider
      value={{ shoppingList, setShoppingList, isLoading }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
