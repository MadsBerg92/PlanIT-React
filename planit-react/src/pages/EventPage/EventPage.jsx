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
import FriendListModal from "../../components/FriendListModal/FriendListModal.jsx";

const EventPage = () => {
  const { eventId } = useParams();
  //useParams returns a string - so we parse it to a number to match the eventId datatype
  const eventIdAsNumber = parseInt(eventId, 10);
  console.log(eventIdAsNumber);
  // Data for information box
  const [eventData, setEventData] = useState([]);
  const { shoppingList } = React.useContext(ShoppingListContext);
  const [description, setDescription] = useState("");
  const [showFriendList, setShowFriendList] = useState(false);
  const [userFriendList, setUserFriendList] = useState([]);

  const handleFriendListModalClose = async (selectedFriends) => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", eventIdAsNumber); // Assuming eventIdAsNumber is available

      const eventObject = await query.first();

      if (eventObject) {
        // Get the existing attendees and merge with the selectedFriends
        const existingAttendees = eventObject.get("attendees") || [];
        const updatedAttendees = [...existingAttendees, ...selectedFriends];

        // Update the attendees column with the merged array
        eventObject.set("attendees", updatedAttendees);

        // Save the updated object back to the database
        await eventObject.save();

        console.log("Attendees updated successfully");
        // Handle success or display a message to the user
      } else {
        console.error("Event not found");
        // Handle the case where the event is not found
      }
    } catch (error) {
      console.error("Error updating attendees:", error);
      // Handle the error or display an error message
    }
    setShowFriendList(false);
  };

  const handleButtonClick = async () => {
    try {
      const currentUser = Parse.User.current();
      if (currentUser) {
        const userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo("objectId", currentUser.id);
        userQuery.include("friendList");

        const userResult = await userQuery.first();
        const friendListFromParse = userResult.get("friendList");
        setUserFriendList([]);

        if (friendListFromParse) {
          // Fetch User objects for each friend
          const friendUserQuery = new Parse.Query(Parse.User);
          friendUserQuery.containedIn("objectId", friendListFromParse);
          const friends = await friendUserQuery.find();

          // Extract usernames and update state
          const friendUsernames = friends.map((friend) =>
            friend.get("username")
          );
          console.log(friendUsernames);
          setUserFriendList(friendUsernames);
        }

        setShowFriendList(true);
      }
    } catch (error) {
      console.error("Error fetching friend list:", error);
    }
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
          "creatorName"
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
      <FriendListModal
        show={showFriendList}
        onClose={handleFriendListModalClose}
        friendList={userFriendList}
      />
    </div>
  );
};

export default EventPage;
