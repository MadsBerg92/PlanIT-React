import React from "react";
import styles from "./shoppingList.module.css";
import InputBox from "../InputBox/InputBox";
import { useState, useEffect, useContext } from "react";
import Button from "../Button/Button";
import { ShoppingListContext } from "../../Context/ShoppingListContext";

/**
 * Renders a modal component for managing a shopping list.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.eventId - The ID of the event associated with the shopping list.
 * @returns {JSX.Element} The rendered ShoppingListModal component.
 */

function ShoppingListModal({ eventId }) {
  const { saveShoppingList, shoppingList } = useContext(ShoppingListContext);
  //useState for modal starting as false
  const [showModal, setShowModal] = useState(false);

  //useState for inputs starting as empty array with one object
  const [inputs, setInputs] = useState([{ id: 1, name: "" }]);

  //Opens the shopping list modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  /**
   * Closes the shopping list modal.
   */
  const handleCloseModal = () => {
    setShowModal(false);
  };

  /**
   * Deletes an input from the inputs array based on the provided id.
   * @param {number} id - The id of the input to be deleted.
   */
  const handleDelete = (id) => {
    const newInputs = inputs.filter((input) => input.id !== id);
    setInputs(newInputs);
  };

  /**
   * Handles the input change for a specific input field.
   * @param {string} id - The id of the input field.
   * @param {object} event - The event object containing the target value.
   */
  const handleInputChange = (id, event) => {
    const newInputs = inputs.map((input) => {
      if (input.id === id) {
        return { ...input, name: event.target.value };
      }
      return input;
    });
    setInputs(newInputs);
  };

  /**
   * Handles adding a new inputfield and Object to the shopping lists with a unique id through Date.now()
   * @param {Event} e - The event object.
   * @param {number} id - The ID of the item.
   */
  const handleAddItem = (e, id) => {
    setInputs(inputs.concat({ id: Date.now(), name: "" }));
  };

  /**
   * Handles the form submission for the shopping list.
   * @param {Event} event - The form submission event.
   * @returns {void}
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    saveShoppingList(inputs, eventId); // Save the shopping list to the database
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
                      type="item"
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
