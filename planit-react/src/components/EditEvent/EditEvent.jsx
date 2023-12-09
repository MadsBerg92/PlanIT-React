import Button from "../../components/Button/Button";
import InputBox from "../../components/InputBox/InputBox";
import ShoppingListModal from "../../components/Shoppinglistmodal/ShoppingListModal";
import Parse from "parse";
import { useState, useContext, useEffect } from "react";
import { ShoppingListContext } from "../../Context/ShoppingListContext";
import { useRef } from "react";
import { React } from "react";
import styles from "../../components/InputBox/InputBox.module.css";
import { useParams, useNavigate } from "react-router";

const EditEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); // Get the event ID from the URL
  console.log(eventId);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", parseInt(eventId));
      const result = await query.first();

      if (result) {
        const eventDate = result.get("eventDate");
        const formattedDate = `${eventDate.getFullYear()}-${String(
          eventDate.getMonth() + 1
        ).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`;

        const formattedTime = `${String(eventDate.getHours()).padStart(
          2,
          "0"
        )}:${String(eventDate.getMinutes()).padStart(2, "0")}`;
        setEventName(result.get("title"));
        setEventDate(formattedDate);
        setEventTime(formattedTime);
        setEventLocation(result.get("eventLocation"));
        setEventDescription(result.get("eventDescription"));
        const imageUrl = result.get("image") ? result.get("image").url() : "";
        setEventImage(imageUrl);
      } else {
        console.error(`No event found with eventId: ${eventId}`);
      }
    };
    fetchEventData();
  }, [eventId]);

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
      // Fetch the existing event
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", parseInt(eventId));
      const existingEvent = await query.first();

      // Set properties for the existing event
      existingEvent.set("title", eventName);
      existingEvent.set("eventDate", new Date(`${eventDate}T${eventTime}:00`)); // Combine date and time
      existingEvent.set("eventLocation", eventLocation);
      existingEvent.set("eventDescription", eventDescription);
      if (eventImage) {
        existingEvent.set(
          "image",
          new Parse.File("eventImage.jpg", eventImage)
        );
      }

      // Save the existing event
      await existingEvent.save();

      // Handle success or redirect to the event page
      console.log("Event updated successfully!", existingEvent);
      navigate("/Home");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleCancel = () => {
    // Add your cancel button logic here
  };

  const previewImage = (event) => {
    // Add your image preview logic here
  };

  return (
    <>
      <div className={styles.formGroup}>
        <form onSubmit={handleSubmit}>
          <img
            id="event-image-preview"
            className={styles.eventImagePreview}
            src={eventImage}
            alt="Preview"
          />
          <InputBox
            label="Event Name"
            id="event-name"
            name="event-name"
            type="text"
            required
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <InputBox
            label="Event Date"
            id="event-date"
            name="event-date"
            type="date"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <InputBox
            label="Event Time"
            id="event-time"
            name="event-time"
            type="time"
            required
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
          <InputBox
            label="Event Location"
            id="event-location"
            name="event-location"
            type="event-location"
            placeholder="Enter event location"
            required
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
          <InputBox
            label="Event Description"
            id="event-description"
            name="event-description"
            type="textarea"
            placeholder="Enter event description"
            required
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
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
            onClick={handleSubmit}
          />
          <Button
            textInactive="Cancel"
            textActive="Cancel"
            type="create"
            onClick={handleCancel}
          />
        </form>
      </div>

      {<ShoppingListModal eventId={eventId} isEditEvent={true} />}
    </>
  );
};
export default EditEvent;
