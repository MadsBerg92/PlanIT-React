import "./App.css";
import AppRouter from "./Router";
import { useState } from "react";
import { ShoppingListContext } from "./Context/ShoppingListContext";

function App() {
  const [shoppingList, setShoppingList] = useState([]);
  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList }}>
      <AppRouter />
    </ShoppingListContext.Provider>
  );
}

export default App;
