import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Button from "../../components/Button/Button.jsx";
import EventCalendar from "../../components/calendar/Calendar.tsx";
import Box from "../../components/box/Box.jsx";
import FriendListModal from "../../components/FriendListModal/FriendListModal.jsx";
import styles from "./EventPage.module.css";
import Parse from "parse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser,
  faCalendarDays,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

// Transfrom fetched date to a more readable format
const formatDate = (dateString) => {
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
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
  const [attendees, setAttendees] = useState([]); // Added state for attendees
  const [attendeesCount, setAttendeesCount] = useState(0);

  const fetchAttendeesData = async (attendeeIds) => {
    try {
      const ParseUser = Parse.Object.extend("User");
      const userQuery = new Parse.Query(ParseUser);
      userQuery.containedIn("objectId", attendeeIds);
      userQuery.select("username");

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

  useEffect(() => {
    const fetchData = async () => {
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

        const currentUserId = Parse.User.current().id;

        const attendees = result.get("attendees") || [];
        const attendeesWithoutCurrentUser = attendees.filter(
          (attendeeId) => attendeeId !== currentUserId
        );

        //showing number of attendees
        setAttendeesCount(attendeesWithoutCurrentUser.length);

        const currentUser = Parse.User.current();
        const isAttending = attendees.includes(currentUser.id);

        setIsActive(isAttending);
        setEventTitle(result.get("title"));

        await fetchAttendeesData(attendeesWithoutCurrentUser);

        const updatedAttendeesData = attendeesData
          .map((attendee) => attendee.value)
          .join(", ");

        setEventData([
          {
            label: (
              <>
                <FontAwesomeIcon icon={faLocationDot} /> Location
              </>
            ),
            value: result.get("eventLocation"),
          },
          {
            label: (
              <>
                <FontAwesomeIcon icon={faUser} /> Hosted by
              </>
            ),
            value: result.get("creatorName"),
          },
          {
            label: (
              <>
                <FontAwesomeIcon icon={faCalendarDays} /> Date
              </>
            ),
            value: formatDate(result.get("eventDate")),
          },
          {
            label: (
              <>
                {" "}
                <FontAwesomeIcon icon={faUsers} />
                {` ${attendeesCount} `} People attending{" "}
              </>
            ),
            value: updatedAttendeesData,
          },
        ]);

        const eventImage = result.get("image").url();
        setEventImage(eventImage);
        setDescription(result.get("eventDescription"));
        setShoppingList(result.get("shoppingList"));
        setAttendees(attendeesWithoutCurrentUser); // Set the attendees state
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchData();
  }, [eventIdAsNumber, attendees, attendeesData]);

  const handleToggle = async () => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);

      query.equalTo("eventId", eventIdAsNumber);

      const event = await query.first();

      const userId = Parse.User.current().id;
      const attendees = event.get("attendees") || [];

      if (!isActive && !attendees.includes(userId)) {
        attendees.push(userId);
        setIsActive(true);
      } else {
        const index = attendees.indexOf(userId);
        if (index > -1) {
          attendees.splice(index, 1);
        }
        setIsActive(false);
      }

      event.set("attendees", attendees);
      await event.save();
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

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
