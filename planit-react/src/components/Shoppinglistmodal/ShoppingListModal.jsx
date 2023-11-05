import React from "react";
import Button from "../Button/Button";
import styles from "./shoppingList.module.css";
import Bootstrap from "bootstrap/dist/css/bootstrap.css";

function ShoppingListModal(props) {
  return (
    <>
      <Button
        type="Custom"
        data-toggle="modal"
        data-target="#shoppingListModal"
        label="Shopping List"
        onClick={props.onClick}
      ></Button>
      <button
        type="button"
        className="btn btn-success"
        data-toggle="modal"
        data-target="#shopping-list-modal"
        id="shopping-list-button"
      >
        Add Shopping List
      </button>

      <div
        className="modal fade"
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
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label htmlFor="item-1">Item 1:</label>
              <input
                type="text"
                id="item-1"
                name="item-1"
                placeholder="Enter item name"
                required
              />
              <br />

              <label htmlFor="item-2">Item 2:</label>
              <input
                type="text"
                id="item-2"
                name="item-2"
                placeholder="Enter item name"
                required
              />
              <br />

              <label htmlFor="item-3">Item 3:</label>
              <input
                type="text"
                id="item-3"
                name="item-3"
                placeholder="Enter item name"
                required
              />
              <br />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />
    </>
  );
}

export default ShoppingListModal;
