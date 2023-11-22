import styles from "../../components/InputBox/InputBox.module.css";
import Button from "../../components/Button/Button";
import InputBox from "../../components/InputBox/InputBox";
import ShoppingListModal from "../../components/Shoppinglistmodal/ShoppingListModal";
import Parse from "parse";
import { useNavigate } from "react-router";
import { useState } from "react";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventId, setEventId] = useState(null);

  // handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get form values
    const eventName = document.getElementById("event-name").value;
    const eventDate = document.getElementById("event-date").value;
    const eventTime = document.getElementById("event-time").value;
    const eventLocation = document.getElementById("event-location").value;
    const eventDescription = document.getElementById("event-description").value;
    const eventImage = document.getElementById("event-image").files[0];

    try {
      // Create a new Parse object for the "Events" class
      const ParseEvents = Parse.Object.extend("Events");
      const newEvent = new ParseEvents();

      //setting up the array with the user's own id as the initial value
      const attendeesArray = [];
      const currentUser = Parse.User.current().get("userID");
      attendeesArray.push(currentUser);

      // Set properties for the new event
      newEvent.set("title", eventName);
      newEvent.set("eventDate", new Date(`${eventDate} ${eventTime}`)); // Combine date and time
      newEvent.set("eventLocation", eventLocation);
      newEvent.set("eventDescription", eventDescription);
      newEvent.set("createdDate", new Date());
      newEvent.set("attendees", attendeesArray);
      newEvent.set("createdBy", currentUser);
      newEvent.set("image", new Parse.File("eventImage.jpg", eventImage));

      // Save the new event
      const savedEvent = await newEvent.save();
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
        </form>
      </div>

      {eventId && <ShoppingListModal eventId={eventId} />}
    </>
  );
};

export default CreateEvent;
