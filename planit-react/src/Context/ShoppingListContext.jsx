import React from "react";
import { useState, useEffect } from "react";
import Parse from "parse";
export const ShoppingListContext = React.createContext();

/**
 * Provides a context for managing the shopping list and its related operations.
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element} The rendered component.
 */
export const ShoppingListProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches the shopping list from the backend when the component mounts.
   * @async
   * @function fetchShoppingList
   */
  useEffect(() => {
    fetchShoppingList();
  }, []);

  /**
   * Fetches the shopping list from the backend.
   * @async
   * @function fetchShoppingList
   */
  const fetchShoppingList = async () => {
    setIsLoading(true);
    const Events = Parse.Object.extend("Events");
    const query = new Parse.Query(Events);

    try {
      const results = await query.find();
      const allShoppingLists = results.map((event) =>
        event.get("shoppingList")
      );
      setShoppingList(allShoppingLists);
    } catch (error) {
      console.error("Error while fetching ShoppingList: ", error);
    }
    setIsLoading(false);
  };

  /**
   * Saves the shopping list for a specific event.
   * @async
   * @function saveShoppingList
   * @param {Array} list - The shopping list to be saved.
   * @param {string} eventId - The ID of the event.
   */
  const saveShoppingList = async (list, eventId) => {
    console.log("Saving shopping list with id ", eventId);
    const Events = Parse.Object.extend("Events");
    const query = new Parse.Query(Events);
    query.equalTo("objectId", eventId);
    try {
      const results = await query.find();
      if (results.length === 0) {
        console.error(`No event found with id ${eventId}`);
        return;
      }
      const event = results[0];
      event.set("shoppingList", list);
      await event.save();
      fetchShoppingList();
    } catch (error) {
      console.error("Failed to save new shopping list: ", error);
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{ shoppingList, setShoppingList, isLoading, saveShoppingList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
