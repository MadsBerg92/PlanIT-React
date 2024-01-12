import React from "react";
import styles from "./shoppingList.module.css";
import InputBox from "../InputBox/InputBox";
import { useState, useEffect, useContext } from "react";
import Button from "../Button/Button";
import { ShoppingListContext } from "../../Context/ShoppingListContext";
import Parse from "parse";
import { useNavigate } from "react-router-dom";

/**
 * Renders a modal component for managing a shopping list.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.eventId - The ID of the event associated with the shopping list.
 * @returns {JSX.Element} The rendered ShoppingListModal component.
 */

function ShoppingListModal({ eventId, isEditEvent }) {
  const [shoppingListItems, setShoppingListItems] = useState([]);

  const { saveShoppingList, shoppingList } = useContext(ShoppingListContext);
  const [showModal, setShowModal] = useState(false);

  const [inputs, setInputs] = useState([{ id: 1, name: "" }]);

  const navigate = useNavigate();
  useEffect(() => {
    if (isEditEvent) {
      fetchShoppingList();
    }
  }, [eventId, isEditEvent]);

  const fetchShoppingList = async () => {
    console.log(`Fetching shopping list for event with id ${eventId}`);

    const Event = Parse.Object.extend("Events");
    const query = new Parse.Query(Event);
    query.equalTo("objectId", eventId);
    const event = await query.first();

    if (event) {
      const fetchedShoppingList = event.get("shoppingList");
      console.log("Event fetched:", event);
      console.log("fetchedShoppingList:", fetchedShoppingList);

      if (fetchedShoppingList) {
        setShoppingListItems(fetchedShoppingList);

        const newInputs = fetchedShoppingList.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        console.log("newInputs:", newInputs);
        setInputs(newInputs);
      } else {
        console.log(`No shopping list found for event with id ${eventId}`);
      }
    } else {
      console.log(`No event found with id ${eventId}`);
    }
  };

  const handleOpenModal = (event) => {
    event.preventDefault();
    console.log("Opening modal");
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
    setInputs(inputs.concat({ id: Date.now(), name: "", checked: false }));
  };

  /**
   * Handles the form submission for the shopping list.
   * @param {Event} event - The form submission event.
   * @returns {void}
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("event id:", eventId);
    saveShoppingList(inputs, eventId);
    setShowModal(false);
  };

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
                  <Button
                    type="submit"
                    textInactive="Add Item"
                    onClick={handleAddItem}
                  />
                  <div>
                    {inputs.map((input, index) => (
                      <li key={input.id}>
                        Item {index + 1}: {input.name}
                        <Button
                          type="delete"
                          textInactive="Delete"
                          onClick={() => handleDelete(input.id)}
                        />
                      </li>
                    ))}
                  </div>
                </div>
                <br />
                <div className="modal-footer">
                  <Button
                    type="cancel"
                    textInactive="Close"
                    onClick={handleCloseModal}
                  />
                  <Button
                    type="submit"
                    textInactive="Save changes"
                    onClick={handleSubmit}
                  />
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
