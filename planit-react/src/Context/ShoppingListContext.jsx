import React from "react";
import { useState, useEffect } from "react";
import Parse from "parse";
export const ShoppingListContext = React.createContext();

export const ShoppingListProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the shopping list from the backend when the component mounts
    fetchShoppingList();
  }, []);

  // Here we will ultimately fetch the shopping list from the backend
  const fetchShoppingList = async () => {
    setIsLoading(true);
    const Events = Parse.Object.extend("Events");
    const query = new Parse.Query(Events);

    try {
      const results = await query.find();
      // Assuming that each event has a shoppingList property
      const allShoppingLists = results.map((event) =>
        event.get("shoppingList")
      );
      setShoppingList(allShoppingLists);
    } catch (error) {
      console.error("Error while fetching ShoppingList: ", error);
    }
    setIsLoading(false);
  };

  const saveShoppingList = async (list, eventId) => {
    const Events = Parse.Object.extend("Events");
    const query = new Parse.Query(Events);
    try {
      const event = await query.get(eventId);
      event.set("shoppingList", list);
      await event.save();
      fetchShoppingList(); // Refresh the list
    } catch (error) {
      console.error("Failed to save new shopping list: ", error);
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{ shoppingList, setShoppingList, isLoading }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
