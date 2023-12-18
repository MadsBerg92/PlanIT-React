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
  const currentUser = Parse.User.current();

  const fetchEvents = async (activeBtn, sortOrd, filterTyp, dateFilt) => {
    try {
      const currentUser = Parse.User.current();
      const userEventIds = currentUser.get("eventId");

      if (userEventIds && userEventIds.length > 0) {
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);
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
          "attendees",
          "createdBy"
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
            eventCompareDate: result.get("eventDate"),
            image: result.get("image").url(),
            eventRSVP: result.get("RSVP"),
            attendees: result.get("attendees"),
            createdBy: result.get("createdBy"),
          },
        }));

        const sortedAndFilteredEvents = applySortingAndFiltering(
          eventsFromParse,
          sortOrd,
          filterTyp,
          dateFilt
        );
        setEvents(sortedAndFilteredEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
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
    fetchEvents(activeButton, sortOrder, filterType, dateFilter);
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
