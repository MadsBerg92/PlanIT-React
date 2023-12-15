import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import EventCard from "../../components/EventCard/EventCard.jsx";
import Parse from "parse";
import Button from "../../components/Button/Button.jsx";
import styles from "./FeedPage.module.css";

const Feed = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeButton, setActiveButton] = useState("all"); // Button "all" is active by default
  const [sortOrder, setSortOrder] = useState("latest"); // Options: 'latest', 'oldest'
  const [filterType, setFilterType] = useState("all"); // Options: 'attending', 'notAttending', 'all'
  const [dateFilter, setDateFilter] = useState("all"); // Options: 'past', 'upcoming', 'all'
  const [subscription, setSubscription] = useState(null);
  const currentUser = Parse.User.current();

  const fetchAndSubscribeEvents = async (
    activeBtn,
    sortOrd,
    filterTyp,
    dateFilt
  ) => {
    const ParseEvents = Parse.Object.extend("Events");
    const query = new Parse.Query(ParseEvents);
    const currentUser = Parse.User.current();
    const userEventIds = currentUser.get("eventId");

    if (userEventIds && userEventIds.length > 0) {
      query.notEqualTo("title", "Temporary Title");

      if (activeBtn === "all") {
        query.containedIn("objectId", userEventIds);
      } else if (activeBtn === "my") {
        query.equalTo("createdBy", currentUser.id);
      }

      query.select(
        "eventId",
        "creatorName",
        "title",
        "eventDescription",
        "eventDate",
        "image",
        "RSVP",
        "attendees"
      );

      try {
        // Subscribe to the query for live updates
        const liveQuerySubscription = await query.subscribe();
        setSubscription(liveQuerySubscription);

        // Handle new event creation
        liveQuerySubscription.on("create", (newEvent) => {
          const newFormattedEvent = formatEventFromParse(newEvent);
          setEvents((currentEvents) => {
            if (
              !currentEvents.some(
                (event) =>
                  event.eventData.eventId ===
                  newFormattedEvent.eventData.eventId
              )
            ) {
              // Apply sorting and filtering logic if needed, then update state
              const updatedEvents = [...currentEvents, newFormattedEvent];
              return applySortingAndFiltering(
                updatedEvents,
                sortOrd,
                filterTyp,
                dateFilt
              );
            }
            return currentEvents; // If event already exists, return current state
          });
        });

        // Fetch initial set of events
        const initialResults = await query.find();
        const initialFormattedEvents = initialResults.map(formatEventFromParse);
        setEvents(
          applySortingAndFiltering(
            initialFormattedEvents,
            sortOrd,
            filterTyp,
            dateFilt
          )
        );
      } catch (error) {
        console.error("Error setting up live query:", error);
      }
    }
  };
  //       const results = await query.find();

  //       const eventsFromParse = results.map((result) =>
  //         formatEventFromParse(result)
  //       );
  //       const sortedAndFilteredEvents = applySortingAndFiltering(
  //         eventsFromParse,
  //         sortOrd,
  //         filterTyp,
  //         dateFilt
  //       );
  //       setEvents(sortedAndFilteredEvents);

  //       // Subscribe to the query for live updates
  //       const subscription = await query.subscribe();
  //       setSubscription(subscription);

  //       // Handle new event creation
  //       subscription.on("create", (newEvent) => {
  //         setEvents((currentEvents) => [
  //           ...currentEvents,
  //           formatEventFromParse(newEvent),
  //         ]);
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching events:", error);
  //   }
  // };

  // Function to convert a Parse Event object to your state event format
  const formatEventFromParse = (parseEvent) => {
    return {
      type: "specific",
      eventData: {
        eventId: parseEvent.get("eventId"),
        eventCreator: parseEvent.get("creatorName"),
        eventName: parseEvent.get("title"),
        eventDescription: parseEvent.get("eventDescription"),
        eventDate: renderValue(parseEvent.get("eventDate")),
        eventCompareDate: parseEvent.get("eventDate"),
        image: parseEvent.get("image").url(),
        eventRSVP: parseEvent.get("RSVP"),
        attendees: parseEvent.get("attendees"),
      },
    };
  };

  const applySortingAndFiltering = (events, sortOrd, filterTyp, dateFilt) => {
    let filteredEvents = events.filter((event) => {
      const attendees = event.eventData.attendees || [];
      if (filterType === "attending") {
        return attendees.includes(currentUser.id);
      } else if (filterType === "notAttending") {
        return !attendees.includes(currentUser.id);
      }
      //"True" is equal to all events
      return true;
    });

    const currentDate = new Date();

    if (dateFilter === "past") {
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.eventData.eventCompareDate) < currentDate
      );
    } else if (dateFilter === "upcoming") {
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.eventData.eventCompareDate) >= currentDate
      );
    }

    if (sortOrder === "latest") {
      filteredEvents.sort(
        (a, b) =>
          new Date(b.eventData.eventCompareDate) -
          new Date(a.eventData.eventCompareDate)
      );
    } else if (sortOrder === "oldest") {
      filteredEvents.sort(
        (a, b) =>
          new Date(a.eventData.eventCompareDate) -
          new Date(b.eventData.eventCompareDate)
      );
    }

    return filteredEvents;
  };

  useEffect(() => {
    fetchAndSubscribeEvents(activeButton, sortOrder, filterType, dateFilter);
    return () => {
      // Cleanup: Unsubscribe from Live Query on component unmount or dependency change
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [activeButton, sortOrder, filterType, dateFilter]);

  const handleButtonClick = (toggleButton) => {
    setActiveButton(toggleButton);
  };

  function renderValue(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  const handleEventClick = (eventId) => {
    navigate(`/Eventpage/${eventId}`);
  };

  return (
    <div>
      <select onChange={(e) => setSortOrder(e.target.value)}>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
      <select onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">All Events</option>
        <option value="attending">Attending</option>
        <option value="notAttending">Not Attending</option>
      </select>
      <select onChange={(e) => setDateFilter(e.target.value)}>
        <option value="all">All Dates</option>
        <option value="upcoming">Upcoming Events</option>
        <option value="past">Past Events</option>
      </select>
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
