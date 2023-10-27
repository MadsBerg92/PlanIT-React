import React from "react";
import "./create_styles.css";

import flatpickr from "react-flatpickr";


function CreateEvent() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission
  };

  React.useEffect(() => {
    const eventDateInput = document.querySelector("#event-date");
  
    new flatpickr(eventDateInput, {
      enableTime: false,
      dateFormat: "Y-m-d",
    });
  }, []);


  const previewImage = (event) => {
    const preview = document.querySelector("#event-image-preview");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-group">
      <img
        id="event-image-preview"
        className="event-image-preview"
        src="/images/event-photography.jpg"
        alt="Event Image Preview"
      />
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="event-name">Event Name:</label>
        <input
          type="text"
          id="event-name"
          name="event-name"
          placeholder="Enter event name"
          required
        />
        <br />

        <label htmlFor="event-date">Event Date:</label>
        <input type="date" id="event-date" name="event-date" required />
        <br />

        <label htmlFor="event-time">Event Time:</label>
        <input type="time" id="event-time" name="event-time" required />
        <br />

        <label htmlFor="event-location">Event Location:</label>
        <input
          type="text"
          id="event-location"
          name="event-location"
          placeholder="Enter event location"
          required
        />
        <br />

        <label htmlFor="event-description">Event Description:</label>
        <textarea
          id="event-description"
          name="event-description"
          placeholder="Enter event description"
          required
        ></textarea>
        <br />

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

        <label htmlFor="event-image">Event Image:</label>
        <input
          type="file"
          id="event-image"
          name="event-image"
            onChange={previewImage}
          required
        />
        <br />

        <input type="submit" value="Create Event" />
      </form>
    </div>
  );
}

export default CreateEvent;