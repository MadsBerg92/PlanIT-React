import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import EventCard from "../../components/EventCard/EventCard.jsx";
import Parse from "parse";

const MyEventsComponent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const currentUser = Parse.User.current();
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);
        query.equalTo("createdBy", currentUser.id);
        query.select(
          "eventId",
          "creatorName",
          "title",
          "eventDescription",
          "eventDate",
          "image"
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
          },
        }));

        setEvents(eventsFromParse);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  function renderValue(value) {
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
      <h1>My Events</h1>
      {events.map((event, index) => (
        <EventCard
          key={index}
          type={event.type}
          eventData={event.eventData}
          onClick={() => handleEventClick(event.eventData.eventId)}
        />
      ))}
    </div>
  );
};

export default MyEventsComponent;
