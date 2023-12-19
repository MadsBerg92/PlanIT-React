import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Button from "../../components/Button/Button.jsx";
import EventCalendar from "../../components/calendar/Calendar.tsx";
import Box from "../../components/box/Box.jsx";
import FriendListModal from "../../components/FriendListModal/FriendListModal.jsx";
import AttendeeListModal from "../../components/AttendeeListModal/AttendeeListModal.jsx";
import styles from "./EventPage.module.css";
import Parse from "parse";
import { useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser,
  faCalendarDays,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const EventPage = () => {
  const location = useLocation();
  const { eventId } = useParams();
  const eventIdAsNumber = parseInt(eventId, 10);
  const [eventDetails, setEventDetails] = useState({
    isActive: false,
    eventData: [],
    eventTitle: "",
    description: "",
    eventImage: "",
    shoppingList: [],
    attendeesCount: 0,
    showFriendList: false,
    showAttendeesList: false,
    allowFriendsToInvite: false,
  });

  const formatDate = (dateString) => {
    const options = { weekday: "long", day: "numeric", month: "long" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  const formatEventData = (result, attendeesData) => {
    const attendeeUsernames = attendeesData.map((a) => a.username).join(", ");
    const formattedData = [
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
          <div
            onClick={() => handleModalOpen("showAttendeesList")}
            className={styles.attendeeInfo}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span style={{ cursor: "pointer", marginLeft: "5px" }}>
              {attendeesData.length === 1
                ? "1 person is attending"
                : `${attendeesData.length} people are attending`}
            </span>
          </div>
        ),
        value: attendeeUsernames,
      },
    ];

    return formattedData;
  };

  const fetchEventData = async () => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", eventIdAsNumber);
      const result = await query.first();

      if (result) {
        const currentUser = Parse.User.current();
        const attendees = result.get("attendees") || [];
        const isAttending = attendees.includes(currentUser.id);

        const User = Parse.Object.extend("User");
        const userQuery = new Parse.Query(User);
        userQuery.containedIn("objectId", attendees);
        const attendeesResults = await userQuery.find();

        const attendeesData = attendeesResults.map((user) => ({
          id: user.id,
          username: user.get("username"),
        }));

        setEventDetails((prevDetails) => ({
          ...prevDetails,
          isActive: isAttending,
          eventData: formatEventData(result, attendeesData),
          eventTitle: result.get("title"),
          description: result.get("eventDescription"),
          eventImage: result.get("image").url(),
          shoppingList: result.get("shoppingList"),
          attendeesCount: attendees.length,
          allowFriendsToInvite: result.get("allowFriendsToInvite"),
          attendeesData: attendeesData, // Add this line
        }));
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    fetchEventData();

    if (location.state?.isNewEvent) {
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        showFriendList: true,
      }));
    }
  }, [eventId, eventIdAsNumber, location.state]);

  const handleToggle = async () => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);

      query.equalTo("eventId", eventIdAsNumber);

      const event = await query.first();
      const userId = Parse.User.current().id;
      const attendees = event.get("attendees") || [];

      let newIsActive = !eventDetails.isActive;
      if (newIsActive && !attendees.includes(userId)) {
        attendees.push(userId);
      } else if (!newIsActive) {
        const index = attendees.indexOf(userId);
        if (index > -1) {
          attendees.splice(index, 1);
        }
      }

      event.set("attendees", attendees);
      await event.save();

      setEventDetails((prevDetails) => ({
        ...prevDetails,
        isActive: newIsActive,
        attendeesCount: attendees.length,
      }));
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  const handleModalOpen = (type) => {
    setEventDetails((prevDetails) => ({ ...prevDetails, [type]: true }));
  };

  const handleModalClose = (type) => {
    setEventDetails((prevDetails) => ({ ...prevDetails, [type]: false }));
  };

  return (
    <div>
      <div className={styles.centered}>
        <img
          className={styles.image}
          src={eventDetails.eventImage}
          alt="Event"
        />
      </div>
      <div className={styles.centered}>
        <div className={styles.actionItems}>
          <Button
            textActive={"Attending"}
            textInactive={"Not Attending"}
            isActive={eventDetails.isActive}
            onClick={handleToggle}
            type={"normal"}
          />
          {eventDetails.allowFriendsToInvite && (
            <Button
              textInactive="Invite Friends"
              type="special"
              onClick={() => handleModalOpen("showFriendList")}
            />
          )}
        </div>
      </div>

      <div className={styles.boxContainer}>
        <Box
          title={eventDetails.eventTitle}
          content={eventDetails.eventData}
          type="second"
        ></Box>
        <Box content={eventDetails.description} type="first"></Box>
      </div>
      <div className={styles.calendarBox}>
        <Box type="first" content={<EventCalendar />}></Box>
        <Box
          title="Shopping List"
          content={eventDetails.shoppingList}
          type="shopping"
        ></Box>
      </div>
      <FriendListModal
        show={eventDetails.showFriendList}
        onClose={() => handleModalClose("showFriendList")}
      />
      <AttendeeListModal
        show={eventDetails.showAttendeesList}
        onClose={() => handleModalClose("showAttendeesList")}
      />
    </div>
  );
};

export default EventPage;
