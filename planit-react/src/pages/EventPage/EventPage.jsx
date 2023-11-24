import Button from "../../components/Button/Button.jsx";
import styles from "./EventPage.module.css";
import EventCalendar from "../../components/calendar/Calendar.tsx";

import { ShoppingListContext } from "../../Context/ShoppingListContext.jsx";
import React from "react";
import ShoppingList from "../../components/ShoppingList/ShoppingList.jsx";

import Box from "../../components/box/Box.jsx";

import { useState } from "react";

const EventPage = () => {
  const handleButtonClick = () => {
    alert("Button clicked!");
  };

  const [isActive, setIsActive] = useState(false);

  const toggleStatus = () => {
    setIsActive(!isActive);
  };

  //data for information box
  const eventData = [
    { label: "Event Location", value: "My house at Frederiksberg" },
    { label: "Date", value: "October 15, 2023, 17:00" },
    { label: "Host", value: "Pernille Svendsen" },
    { label: "Attending", value: "You are going!" },
  ];

  const { shoppingList } = React.useContext(ShoppingListContext);

  const description = `Celebrate with us as we mark a significant milestone in life! It's
    time to revel in the joy of reaching 35 years, filled with memories,
    accomplishments, and laughter. Join us for a remarkable evening that
    promises to be an unforgettable chapter in the book of our lives. Our
    35th birthday party has a fantastic theme—[Theme Name]. Get ready to
    immerse yourself in a world of [Theme Description], from the
    decorations to the music and everything in between. Dress up according
    to the theme, or come as you are; the choice is yours!`;

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
          textInactive={isActive ? "Attending" : "Not Attending"}
          
          type={"normal"}
          onClick={toggleStatus}
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
