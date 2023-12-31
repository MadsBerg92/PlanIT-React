import React from "react";
import styles from "./shoppingList.module.css";
import InputBox from "../InputBox/InputBox";
import { useState, useEffect } from "react";
import Button from "../Button/Button";
import { ShoppingListContext } from "../../Context/ShoppingListContext";

function ShoppingListModal() {
  //useState for modal starting as false
  const [showModal, setShowModal] = useState(false);

  //useState for inputs starting as empty array with one object
  const [inputs, setInputs] = useState([{ id: 1, name: "" }]);

  //useContext for shoppingList
  const { shoppingList, setShoppingList } =
    React.useContext(ShoppingListContext);

  //Opens the shopping list modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  //Closes the shopping list modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //Handler for deleting items from the shopping list
  const handleDelete = (id) => {
    const newInputs = inputs.filter((input) => input.id !== id);
    setInputs(newInputs);
  };

  //Handler for changing the input value
  const handleInputChange = (id, event) => {
    const newInputs = inputs.map((input) => {
      if (input.id === id) {
        return { ...input, name: event.target.value };
      }
      return input;
    });
    setInputs(newInputs);
  };

  //Handler for adding a new inputfield and Object to the shopping lists with a unique id through Date.now()
  const handleAddItem = (e, id) => {
    setInputs(inputs.concat({ id: Date.now(), name: "" }));
  };

  //Handler for submitting the shopping list storing the inputs in the shoppingList state
  const handleSubmit = (event) => {
    event.preventDefault();
    setShoppingList(inputs);
    console.log(inputs);
  };

  //useEffect for closing the modal when the shopping list is updated

  useEffect(() => {
    if (showModal) {
      setShowModal(false);
    }
  }, [shoppingList]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Button
          type="shoppingList"
          textInactive="Shopping List"
          onClick={handleOpenModal}
        ></Button>

        {showModal && (
          <div
            className={`modal fade show ${styles.modal}`}
            style={{ display: "block" }}
            id="shopping-list-modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="shopping-list-modal-label"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="shopping-list-modal-label">
                    Shopping List
                  </h5>
                  <button
                    type="button"
                    className={styles["modal-close"]}
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={handleCloseModal}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {inputs.map((input, index) => (
                    <InputBox
                      key={input.id}
                      type="text"
                      id={`item-${input.id}`}
                      name={`item${input.id}`}
                      label={`Item ${index + 1}:`}
                      placeholder="Enter item name"
                      required
                      value={input.name}
                      onChange={(event) => handleInputChange(input.id, event)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className={styles.btn}
                  >
                    Add Item
                  </button>
                  <div>
                    {inputs.map((input, index) => (
                      <li key={input.id}>
                        Item {index + 1}: {input.name}
                        <button
                          onClick={() => handleDelete(input.id)}
                          className={styles["delete-btn"]}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </div>
                  <br />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className={styles["btn-close"]}
                    data-dismiss="modal"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button type="submit" className={styles.btn}>
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <br />
      </form>
    </>
  );
}

export default ShoppingListModal;
