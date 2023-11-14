import Button from "../../components/Button/Button.jsx";
import styles from "./EventPage.module.css";
import EventCalendar from "../../components/calendar/Calendar.tsx";
import { useState, useEffect } from "react";

import { ShoppingListContext } from "../../Context/ShoppingListContext.jsx";
import React from "react";
import ShoppingList from "../../components/ShoppingList/ShoppingList.jsx";

import Box from "../../components/box/Box.jsx";
import Parse from "parse";

const EventPage = () => {
  const handleButtonClick = () => {
    alert("Button clicked!");
  };

  //data for information box
  const [eventData, setEventData] = useState([]);

  const { shoppingList } = React.useContext(ShoppingListContext);

  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);

        query.select("location", "createdBy", "eventDate");

        const results = await query.find();

        const eventDataFromParse = results.map((result) => ({
          label: "Location",
          value: result.get("location"),
        }));

        results.forEach((result) => {
          eventDataFromParse.push({
            label: "Created By",
            value: result.get("createdBy"),
          });

          eventDataFromParse.push({
            label: "Event Date",
            value: result.get("eventDate"),
          });
        });

        setEventData(eventDataFromParse);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, []);

  useEffect(() => {
    const fetchEventDescription = async () => {
      try {
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);

        query.select("description");

        const results = await query.find();

        const eventDescriptionFromParse = results[0].get("description");

        setDescription(eventDescriptionFromParse);
      } catch (error) {
        console.error("Error fetching event description:", error);
      }
    };

    fetchEventDescription();
  }, []);



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
        <ShoppingList
          title="Shopping List"
          content={shoppingList}
        ></ShoppingList>
      </div>
    </div>
  );
};

export default EventPage;
