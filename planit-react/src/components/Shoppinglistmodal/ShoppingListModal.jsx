import React from "react";
import styles from "./shoppingList.module.css";
import Bootstrap from "bootstrap/dist/css/bootstrap.css";
import InputBox from "../inputBox/inputBox";
import { useState, useEffect } from "react";

function ShoppingListModal(props) {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [inputs, setInputs] = useState([{ id: 1, name: "" }]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleDelete = (id) => {
    const newInputs = inputs.filter((input) => input.id !== id);
    setInputs(newInputs);
  };

  const handleInputChange = (id, event) => {
    console.log(`Changing item with id ${id} to ${event.target.value}`);
    const newInputs = inputs.map((input) => {
      if (input.id === id) {
        return { ...input, name: event.target.value };
      }
      return input;
    });
    setInputs(newInputs);
  };
  const handleAddItem = (e, id) => {
    setInputs(inputs.concat({ id: Date.now(), name: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setItems(inputs);
    console.log(items);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Button
          type="Custom"
          label="Add Shopping List"
          onClick={handleOpenModal}
        ></Button>

        {showModal && (
          <div
            className="modal fade show"
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
                    className="close"
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
                          className={styles.deletebtn}
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
                    className={styles.btnclose}
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
