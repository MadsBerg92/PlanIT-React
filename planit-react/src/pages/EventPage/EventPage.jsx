import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Button from "../../components/Button/Button.jsx";
import EventCalendar from "../../components/calendar/Calendar.tsx";
import Box from "../../components/box/Box.jsx";
import FriendListModal from "../../components/FriendListModal/FriendListModal.jsx";
import AttendeeListModal from "../../components/AttendeeListModal/AttendeeListModal.jsx";
import styles from "./EventPage.module.css";
import Parse from "parse";
import { useLocation } from "react-router-dom";

const EventPage = () => {
  const { eventId } = useParams();
  const eventIdAsNumber = parseInt(eventId, 10);
  const [isActive, setIsActive] = useState();
  const [eventData, setEventData] = useState([]);
  const [description, setDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [showFriendList, setShowFriendList] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [showAttendeesList, setShowAteendeesList] = useState(false);
  const [allowFriendsToInvite, setAllowFriendsToInvite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [eventCreatorId, setEventCreatorId] = useState(null);
  const location = useLocation();

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
        "shoppingList"
      );

      const result = await query.first();
      // Fetch the allowFriendsToInvite value
      const allowFriendsToInvite = result.get("allowFriendsToInvite");

      // Set the state variable
      setAllowFriendsToInvite(allowFriendsToInvite);

      // Check if the current user is in the list of attendees
      const attendees = result.get("attendees") || [];
      const currentUser = Parse.User.current();
      const eventCreator = result.get("createdBy");
      const isAttending = attendees.includes(currentUser.id);

      setCurrentUserId(currentUser.id);
      setEventCreatorId(eventCreator);

      // Set the initial state based on user's attendance
      setIsActive(isAttending);

      setEventData([
        { label: "Location", value: result.get("eventLocation") },
        { label: "Created By", value: result.get("creatorName") },
        { label: "Event Date", value: result.get("eventDate") },
      ]);
      const eventImage = result.get("image").url();
      setEventImage(eventImage);
      setDescription(result.get("eventDescription"));
      setShoppingList(result.get("shoppingList"));
      setAttendeeCount(attendees.length);
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

      let newAttendeeCount = attendeeCount;

      if (!isActive && !attendees.includes(userId)) {
        attendees.push(userId); // Add the userId to the attendees array
        setIsActive(true);
      } else {
        const index = attendees.indexOf(userId);
        if (index > -1) {
          attendees.splice(index, 1); // Remove the userId from the attendees array
          setIsActive(false);
        }
      }

      event.set("attendees", attendees); // Update the attendees array

      await event.save(); // Save the updated event

      setAttendeeCount(attendees.length); // Update the attendee count
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };
  useEffect(() => {
    console.log("Current user ID:", currentUserId);
    console.log("Event creator ID:", eventCreatorId);
  }, [currentUserId, eventCreatorId]);

  useEffect(() => {
    fetchEventData();

    // Open the "Invite Friends" modal only if the event has just been created
    if (location.state?.isNewEvent) {
      setShowFriendList(true);
    }
  }, [eventId, eventIdAsNumber, location.state]);

  const handleModalOpenInvite = () => {
    setShowFriendList(true);
  };

  const handleModalCloseInvite = () => {
    setShowFriendList(false);
  };

  const handleModalOpenAttendees = () => {
    setShowAteendeesList(true);
  };

  const handleModalCloseAttendees = () => {
    setShowAteendeesList(false);
  };

  return (
    <div>
      <div className={styles.centered}>
        <img className={styles.image} src={eventImage} alt="logo"></img>
      </div>
      <div className={styles.centered}>
        <div className={styles.actionItems}>
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
            onClick={handleModalOpenInvite}
          />
          <div
            className={styles.attendeeInfo}
            onClick={handleModalOpenAttendees}
          >
            <span className="material-icons" style={{ cursor: "pointer" }}>
              group
            </span>
            <span style={{ cursor: "pointer", marginLeft: "5px" }}>
              {attendeeCount === 1
                ? "1 person is attending"
                : `${attendeeCount} people are attending`}
            </span>
          </div>
          <AttendeeListModal
            show={showAttendeesList}
            onClose={handleModalCloseAttendees}
          />
        </div>
        {(currentUserId === eventCreatorId || allowFriendsToInvite) && (
          <Button
            textInactive={"Invite Friends"}
            type={"special"}
            onClick={handleModalOpen}
          />
        )}
      </div>
      <div className={styles.boxContainer}>
        <Box title="Event Details" content={eventData} type="second"></Box>
        <Box title="Event Description" content={description} type="first"></Box>
      </div>
      <div className={styles.calendarBox}>
        <Box type="first" content={<EventCalendar />}></Box>
        <Box title="Shopping List" content={shoppingList} type="shopping"></Box>
      </div>
      <FriendListModal show={showFriendList} onClose={handleModalCloseInvite} />
    </div>
  );
};

export default EventPage;
