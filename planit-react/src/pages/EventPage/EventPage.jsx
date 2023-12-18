import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Button from "../../components/Button/Button.jsx";
import EventCalendar from "../../components/calendar/Calendar.tsx";
import Box from "../../components/box/Box.jsx";
import FriendListModal from "../../components/FriendListModal/FriendListModal.jsx";
import styles from "./EventPage.module.css";
import Parse from "parse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUser, faCalendarDays } from "@fortawesome/free-solid-svg-icons"; 

//Transfrom fetched date to a more readable format
const formatDate = (dateString) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
  return formattedDate;
};

const EventPage = () => {
  const { eventId } = useParams();
  const eventIdAsNumber = parseInt(eventId, 10);
  const [isActive, setIsActive] = useState();
  const [eventData, setEventData] = useState([]);
  const [description, setDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [showFriendList, setShowFriendList] = useState(false);
  const [eventTitle, setEventTitle] = useState("");

  const [attendeesData, setAttendeesData] = useState([]);

  const fetchAttendeesData = async (attendeeIds) => {
    try {
      const ParseUser = Parse.Object.extend("User");
      const userQuery = new Parse.Query(ParseUser);
      userQuery.containedIn("objectId", attendeeIds);
      userQuery.select("username"); // Add other user fields you want to display

      const users = await userQuery.find();

      const attendeesData = users.map((user) => {
        return {
          label: "Attendee",
          value: user.get("username"),
        };
      });

      setAttendeesData(attendeesData);
    } catch (error) {
      console.error("Error fetching attendees data:", error);
    }
  };

  


  const fetchEventData = async () => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", eventIdAsNumber);
      query.select(
        "eventLocation",
        "createdBy",
        "eventDate",
        "eventDescription",
        "creatorName",
        "image",
        "shoppingList",
        "title",
        "attendees" 
      );

      const result = await query.first();

      // Check if the current user is in the list of attendees
      const attendees = result.get("attendees") || [];
      const currentUser = Parse.User.current();
      const isAttending = attendees.includes(currentUser.id);

      // Set the initial state based on user's attendance
      setIsActive(isAttending);

      setEventTitle(result.get("title"));

      // Fetch usernames of attendees
      await fetchAttendeesData(attendees);

      
    console.log("Attendees Data:", attendeesData);

      setEventData([
        { label: (
          <>
            <FontAwesomeIcon icon={faLocationDot} /> Location
          </>
        ),
        value: result.get("eventLocation"),
      },
      { label: (
        <>
          <FontAwesomeIcon icon={faUser} /> Hosted by
        </>
      ), value: result.get("creatorName") },
      { label: (
        <>
          <FontAwesomeIcon icon={faCalendarDays} /> Date
        </>
      ), value: formatDate(result.get("eventDate")) },
      { label: ( <> <FontAwesomeIcon icon={faUser} /> Attendees </> ), value: attendeesData.map((attendee) => attendee.value).join(", ") },
      ]);
      const eventImage = result.get("image").url();
      setEventImage(eventImage);
      setDescription(result.get("eventDescription"));
      setShoppingList(result.get("shoppingList"));
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };


  const handleToggle = async () => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);

      // Fetch the specific event using the eventId
      query.equalTo("eventId", eventIdAsNumber);

      const event = await query.first(); // Use the dynamic eventId here

      // Get the userId
      const userId = Parse.User.current().id;

      // Fetch the attendees array
      const attendees = event.get("attendees") || [];

      if (!isActive && !attendees.includes(userId)) {
        attendees.push(userId); // Add the userId to the attendees array
        setIsActive(true);
      } else {
        const index = attendees.indexOf(userId);
        if (index > -1) {
          attendees.splice(index, 1); // Remove the userId from the attendees array
        }
        setIsActive(false);
      }

      event.set("attendees", attendees); // Update the attendees array

      await event.save(); // Save the updated event
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  useEffect(() => {
    
    fetchEventData();
  }, [eventId, eventIdAsNumber]);

  const handleModalOpen = () => {
    setShowFriendList(true);
  };

  const handleModalClose = () => {
    setShowFriendList(false);
  };

  return (
    <div>
      <div className={styles.centered}>
        <img className={styles.image} src={eventImage} alt="logo"></img>
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
          onClick={handleModalOpen}
        ></Button>
      </div>
      <div className={styles.boxContainer}>
        <Box title={eventTitle} content={eventData} type="second"></Box>
        <Box title="Description" content={description} type="first"></Box>
      </div>
      <div className={styles.calendarBox}>
        <Box type="first" content={<EventCalendar />}></Box>
        <Box title="Shopping List" content={shoppingList} type="shopping"></Box>
      </div>
      <FriendListModal show={showFriendList} onClose={handleModalClose} />
    </div>
  );
};

export default EventPage;
