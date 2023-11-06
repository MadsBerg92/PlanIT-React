

import "./App.css";
import NavBar from "./components/Navbar/navbar";
import ShoppingListModal from "./components/Shoppinglistmodal/ShoppingListModal";
import CreateEvent from "./Pages/CreateEvent";



function App() {
  return (
    <>
      <NavBar> </NavBar>
      <CreateEvent></CreateEvent>
      <ShoppingListModal> </ShoppingListModal>
    </>
  );
}

export default App;
