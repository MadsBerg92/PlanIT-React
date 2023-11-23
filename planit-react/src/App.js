import "./App.css";
import AppRouter from "./Router";
import { useState } from "react";
import { ShoppingListContext } from "./Context/ShoppingListContext";

function App() {
  const [shoppingList, setShoppingList] = useState([]);
  return <AppRouter />;
}

export default App;
