import styles from "../../components/InputBox/InputBox.module.css";
import Button from "../../components/Button/Button";
import InputBox from "../../components/InputBox/InputBox";
import ShoppingListModal from "../../components/Shoppinglistmodal/ShoppingListModal";
import Parse from "parse";
import { useNavigate } from "react-router";
import { useState, useContext, useEffect } from "react";
import { ShoppingListContext } from "../../Context/ShoppingListContext";
import { useRef } from "react";
import React from "react";

const CreateEvent = () => {
  console.log("Rendering CreateEvent component...");
  const navigate = useNavigate();
  const [eventId, setEventId] = useState(null);
  const { shoppingList, saveShoppingList } = useContext(ShoppingListContext);
  const hasMountedRef = useRef(false);

  const createTempEvent = async () => {
    const ParseEvents = Parse.Object.extend("Events");
    const newEvent = new ParseEvents();

    // Set minimal properties for the new event
    newEvent.set("title", "Temporary Title");
    newEvent.set("createdBy", Parse.User.current().id);
    newEvent.set("attendees", [Parse.User.current().id]);

    // Save the new event
    const savedEvent = await newEvent.save();

    // Save the event ID to state
    setEventId(savedEvent.id);
  };

  useEffect(() => {
    if (!hasMountedRef.current) {
      console.log("Creating temporary event...");
      createTempEvent();
      hasMountedRef.current = true;
    }
  }, []);

  // handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    await createTempEvent();
    // Get form values
    const eventName = document.getElementById("event-name").value;
    const eventDate = document.getElementById("event-date").value;
    const eventTime = document.getElementById("event-time").value;
    const eventLocation = document.getElementById("event-location").value;
    const eventDescription = document.getElementById("event-description").value;
    const eventImage = document.getElementById("event-image").files[0];

    try {
      // Fetch the previously created event
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      console.log("Fetching event with ID:", eventId);
      const existingEvent = await query.get(eventId);
      const shoppingList = existingEvent.get("shoppingList");
      const currentUser = Parse.User.current();
      const randomEventId = Math.floor(Math.random() * 1000000);

      // Set properties for the new event
      existingEvent.set("title", eventName);
      existingEvent.set("eventDate", new Date(`${eventDate} ${eventTime}`)); // Combine date and time
      existingEvent.set("eventLocation", eventLocation);
      existingEvent.set("eventDescription", eventDescription);
      existingEvent.set("createdDate", new Date());
      existingEvent.set("createdBy", currentUser.id);
      existingEvent.set("image", new Parse.File("eventImage.jpg", eventImage));
      existingEvent.set("creatorName", currentUser.get("username"));
      existingEvent.set("shoppingList", shoppingList);
      existingEvent.set("eventId", randomEventId);

      // Save the new event
      const savedEvent = await existingEvent.save();

      // Save the event ID to state
      setEventId(savedEvent.id);

      // Save the shopping list to the event
      saveShoppingList(shoppingList, savedEvent.id);

      currentUser.addUnique("eventId", eventId);

      await currentUser.save();

      setEventId(savedEvent.id); // Save the event ID to state

      // Handle image upload (assuming you have a separate "EventImages" class for images)
      const EventImages = Parse.Object.extend("EventImages");
      const eventImageObject = new EventImages();
      const parseFile = new Parse.File("eventImage.jpg", eventImage);

      // Set properties for the image object
      eventImageObject.set("eventId", savedEvent.id);
      eventImageObject.set("imageFile", parseFile);

      // Save the image object
      await eventImageObject.save();

      // Handle success or redirect to the event page
      console.log("Event created successfully!", savedEvent);

      navigate("/Home");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  const handleCancel = async () => {
    // Fetch the temporary event
    const ParseEvents = Parse.Object.extend("Events");
    const query = new Parse.Query(ParseEvents);
    const tempEvent = await query.get(eventId);

    // Delete the temporary event
    await tempEvent.destroy();

    // Navigate back to the previous page
    navigate(-1);
  };

  // preview image when changing image for an event
  const previewImage = (event) => {
    const preview = document.querySelector("#event-image-preview");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      preview.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  };

  return (
    <>
      <div className={styles.formGroup}>
        <form onSubmit={handleSubmit}>
          <img
            id="event-image-preview"
            className={styles.eventImagePreview}
            src="/images/event-photography.jpg"
            alt="Preview"
          />
          <InputBox
            label="Event Name"
            id="event-name"
            name="event-name"
            type="event-name"
            placeholder="Enter event name"
            required
          />
          <InputBox
            label="Event Date"
            id="event-date"
            name="event-date"
            type="date"
            required
          />
          <InputBox
            label="Event Time"
            id="event-time"
            name="event-time"
            type="time"
            required
          />
          <InputBox
            label="Event Location"
            id="event-location"
            name="event-location"
            type="event-location"
            placeholder="Enter event location"
            required
          />
          <InputBox
            label="Event Description"
            id="event-description"
            name="event-description"
            type="textarea"
            placeholder="Enter event description"
            required
          />
          <InputBox
            label="Event Image"
            type="file"
            id="event-image"
            name="event-image"
            onChange={previewImage}
            required
          />
          <Button
            textInactive="Create Event"
            textActive="Create Event"
            type="create"
          />
          <Button
            textInactive="Cancel"
            textActive="Cancel"
            type="create"
            onClick={handleCancel}
          />
        </form>
      </div>

      {<ShoppingListModal eventId={eventId} />}
    </>
  );
};

export default React.memo(CreateEvent);
