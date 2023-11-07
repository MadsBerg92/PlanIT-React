import React from "react";
import { useState } from "react";

export const ShoppingListContext = React.createContext();

export const ShoppingListProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch your data here and update the shopping list and loading state
  // ...

  return (
    <ShoppingListContext.Provider
      value={{ shoppingList, setShoppingList, isLoading }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
