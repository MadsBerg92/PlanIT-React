import Button from "../../components/Button/Button.jsx";
import styles from "./EventPage.module.css";
import EventCalendar from "../../components/calendar/Calendar.tsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ShoppingListContext } from "../../Context/ShoppingListContext.jsx";
import React from "react";
// import ShoppingList from "../../components/ShoppingList/ShoppingList.jsx";
import Box from "../../components/box/Box.jsx";
import Parse from "parse";

const EventPage = () => {
  const { eventId } = useParams();
  //useParams returns a string - so we parse it to a number to match the eventId datatype
  const eventIdAsNumber = parseInt(eventId, 10);
  // Data for information box
  const [eventData, setEventData] = useState([]);
  const [description, setDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const handleButtonClick = () => {
    alert("Button clicked!");
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);
        console.log(eventId);
        query.equalTo("eventId", eventIdAsNumber);
        query.select(
          "eventLocation",
          "createdBy",
          "eventDate",
          "eventDescription",
          "image",
          "shoppingList"
        );

        console.log(query);
        const result = await query.first();
        console.log(result);

        const eventDataFromParse = [
          {
            label: "Location",
            value: result.get("eventLocation"),
          },
          {
            label: "Created By",
            value: result.get("createdBy"),
          },
          {
            label: "Event Date",
            value: result.get("eventDate"),
          },
        ];
        const eventImage = result.get("image").url();

        setEventImage(eventImage);
        setEventData(eventDataFromParse);
        setDescription(result.get("eventDescription"));
        setShoppingList(result.get("shoppingList"));
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  return (
    <div>
      <div className={styles.centered}>
        <img className={styles.image} src={eventImage} alt="logo"></img>
      </div>
      <div className={styles.centered}>
        <Button
          textActive={"Attending"}
          textInactive={"Not Attending"}
          type={"normal"}
        ></Button>
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
