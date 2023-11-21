import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import EventCard from "../../components/EventCard/EventCard.jsx";
import Parse from "parse";
import Button from "../../components/Button/Button.jsx";
import styles from "./FeedPage.module.css";

const Feed = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeButton, setActiveButton] = useState(1); // Button 1 is active by default

  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch current user and their event IDs
        const currentUser = Parse.User.current();
        const userEventIds = currentUser.get("eventId"); // Assuming 'eventIds' is the field
        if (userEventIds && userEventIds.length > 0) {
          const ParseEvents = Parse.Object.extend("Events");
          const query = new Parse.Query(ParseEvents);
          query.containedIn("eventId", userEventIds);
          query.select(
            "eventId",
            "creatorName",
            "title",
            "eventDescription",
            "eventDate",
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
              eventRSVP: result.get("RSVP"),
            },
          }));

          setEvents(eventsFromParse);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

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
          textActive="All events"
          textInactive="All events"
          onClick={() => handleButtonClick(1)}
          isActive={activeButton === 1} // Pass isActive as a prop
        />
        <Button
          textActive="Yeet"
          textInactive="Yeet"
          onClick={() => handleButtonClick(2)}
          isActive={activeButton === 2} // Pass isActive as a prop
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
