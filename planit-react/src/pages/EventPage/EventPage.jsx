import Button from "../../components/Button/Button.jsx";
import styles from "./EventPage.module.css";
import EventCalendar from "../../components/calendar/Calendar.tsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ShoppingListContext } from "../../Context/ShoppingListContext.jsx";
import React from "react";
// import ShoppingList from "../../components/ShoppingList/ShoppingList.jsx";
import Box from "../../components/box/Box.jsx";
import Parse, { User } from "parse";

const EventPage = () => {
  const { eventId } = useParams();
  //useParams returns a string - so we parse it to a number to match the eventId datatype
  const eventIdAsNumber = parseInt(eventId, 10);
  const [isActive, setIsActive] = useState(false);
  // Data for information box
  const [eventData, setEventData] = useState([]);
  const { shoppingList } = React.useContext(ShoppingListContext);
  const [description, setDescription] = useState("");
  const userId = Parse.User.current();

  const handleButtonClick = () => {
    alert("Button clicked!");
  };

  const handleToggle = async () => {
    console.log("Event ID:", eventIdAsNumber);
    setIsActive(!isActive);

    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);

      // Fetch the specific event using the eventId
      const event = await query.get("rZksBvJUBT"); // Ensure eventIdAsNumber is a string if it's required by your Parse setup
      console.log(event);
      if (!isActive) {
        event.addUnique("attendees", userId); // Assuming 'userId' is defined
      } else {
        event.remove("attendees", userId);
      }

      await event.save(); // Save the updated event
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);
        query.equalTo("eventId", eventIdAsNumber);
        query.select(
          "eventLocation",
          "creatorName",
          "eventDate",
          "eventDescription"
        );
        const result = await query.first();

        const eventDataFromParse = [
          {
            label: "Location",
            value: result.get("eventLocation"),
          },
          {
            label: "Created By",
            value: result.get("creatorName"),
          },
          {
            label: "Event Date",
            value: result.get("eventDate"),
          },
        ];

        setEventData(eventDataFromParse);
        setDescription(result.get("eventDescription"));
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  return (
    <div>
      <div className={styles.centered}>
        <img
          className={styles.image}
          src="/images/Birthday.png"
          alt="logo"
        ></img>
      </div>
      <div className={styles.centered}>
        <Button
          textActive={"Attending"}
          textInactive={"Not Attending"}
          isActive={isActive}
          onClick={handleToggle}
          type={"normal"}
        />
        <Button
          textInactive={"Invite Friends"}
          type={"special"}
          onClick={handleButtonClick}
        ></Button>
      </div>
      <div className={styles.boxContainer}>
        <Box title="Event Details" content={eventData} type="second"></Box>
        <Box title="Event Description" content={description} type="first"></Box>
      </div>
      <div className={styles.calendarBox}>
        <Box type="first" content={<EventCalendar />}></Box>
        <Box title="Shopping List" content={shoppingList} type="shopping"></Box>
      </div>
    </div>
  );
};

export default EventPage;
