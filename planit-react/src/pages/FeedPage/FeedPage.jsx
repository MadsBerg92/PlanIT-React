import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import EventCard from "../../components/EventCard/EventCard.jsx";
import Parse from "parse";

const Feed = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);
        query.select(
          "eventId",
          "creatorName",
          "title",
          "eventDescription",
          "eventDate"
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
          },
        }));

        setEvents(eventsFromParse);
      } catch (error) {
        console.error("Error fethcing events:", error);
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
