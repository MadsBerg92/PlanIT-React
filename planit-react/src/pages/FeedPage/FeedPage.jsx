import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import EventCard from "../../components/EventCard/EventCard.jsx";
import Parse from "parse";
import Button from "../../components/Button/Button.jsx";
import styles from "./FeedPage.module.css";

const Feed = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeButton, setActiveButton] = useState("all"); // Button 1 is active by default

  const handleButtonClick = (toggleButton) => {
    setActiveButton(toggleButton);
  };

  const fetchEvents = async () => {
    try {
      // Fetch current user and their event IDs
      const currentUser = Parse.User.current();

      const userEventIds = currentUser.get("eventId");

      if (userEventIds && userEventIds.length > 0) {
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);
        query.notEqualTo("title", "Temporary Title");
        if (activeButton === "all") {
          query.containedIn("objectId", userEventIds);
        } else if (activeButton === "my") {
          query.equalTo("createdBy", currentUser.id);
        }
        query.select(
          "eventId",
          "creatorName",
          "title",
          "eventDescription",
          "eventDate",
          "image",
          "RSVP"
        );

        const results = await query.find();

        const eventsFromParse = results.map((result) => ({
          type: "specific",
          eventData: {
            eventId: result.get("eventId"),
            eventCreator: result.get("creatorName"),
            eventName: result.get("title"),
            eventDescription: result.get("eventDescription"),
            eventDate: renderValue(result.get("eventDate")),
            image: result.get("image").url(),
            eventRSVP: result.get("RSVP"),
          },
        }));

        setEvents(eventsFromParse);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeButton]);

  function renderValue(value) {
    // Handle special rendering for certain types, e.g., Date
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return value;
  }

  const handleEventClick = (eventId) => {
    navigate(`/Eventpage/${eventId}`);
  };

  return (
    <div>
      <div className={styles.myEventsButton}>
        <Button
          type="normal"
          textActive="All events"
          textInactive="All events"
          isActive={activeButton === "all"} // Pass isActive as a prop
          onClick={() => handleButtonClick("all")}
        />
        <Button
          type="normal"
          textActive="My events"
          textInactive="My events"
          isActive={activeButton === "my"} // Pass isActive as a prop
          onClick={() => handleButtonClick("my")}
        />
      </div>
      {events.map((event, index) => (
        <EventCard
          key={index}
          type={event.type}
          eventData={event.eventData}
          onClick={() => handleEventClick(event.eventId)}
        />
      ))}
    </div>
  );
};

export default Feed;
