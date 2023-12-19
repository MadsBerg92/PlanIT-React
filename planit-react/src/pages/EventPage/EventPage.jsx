import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Button from "../../components/Button/Button.jsx";
import EventCalendar from "../../components/calendar/Calendar.tsx";
import Box from "../../components/box/Box.jsx";
import FriendListModal from "../../components/FriendListModal/FriendListModal.jsx";
import AttendeeListModal from "../../components/AttendeeListModal/AttendeeListModal.jsx";
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
import { useLocation } from "react-router-dom";

const EventPage = () => {
  const { eventId } = useParams();
  const eventIdAsNumber = parseInt(eventId, 10);
  const [isActive, setIsActive] = useState();
  const [eventData, setEventData] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [showFriendList, setShowFriendList] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [attendeesData, setAttendeesData] = useState([]);
  const [attendees, setAttendees] = useState([]); // Added state for attendees
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [showAttendeesList, setShowAteendeesList] = useState(false);
  const [allowFriendsToInvite, setAllowFriendsToInvite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [eventCreatorId, setEventCreatorId] = useState(null);
  const location = useLocation();

  const fetchAttendeesData = async (attendeeIds) => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", eventIdAsNumber);
      query.select(
        "title",
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
      setEventTitle(result.get("title"));
      setEventImage(eventImage);
      setDescription(result.get("eventDescription"));
      setShoppingList(result.get("shoppingList"));
      setAttendeeCount(attendees.length);
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
        setAttendees(attendeesWithoutCurrentUser);
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
          setIsActive(false);
        }
      }

      event.set("attendees", attendees);
      await event.save();

      setAttendeeCount(attendees.length);
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
          {(currentUserId === eventCreatorId || allowFriendsToInvite) && (
            <Button
              textInactive={"Invite Friends"}
              type={"special"}
              onClick={handleModalOpenInvite}
            />
          )}
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
      </div>
      <div className={styles.boxContainer}>
        <Box title={eventTitle} content={eventData} type="second"></Box>
        <Box content={description} type="first"></Box>
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
