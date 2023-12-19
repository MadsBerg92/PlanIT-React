import { useNavigate } from "react-router";
import EventCard from "../../components/EventCard/EventCard.jsx";
import Parse from "parse";
import styles from "./FeedPage.module.css";
import React, { useContext, useEffect, useState } from "react";
import { LiveQueryClientContext } from "../../index.js";

const Feed = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [attendingFilter, setAttendingFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const liveQueryClient = useContext(LiveQueryClientContext);

  const currentUser = Parse.User.current();

  const fetchEvents = async (
    eventFilter,
    attendingFilter,
    sortOrd,
    filterTyp,
    dateFilt
  ) => {
    try {
      const currentUser = Parse.User.current();
      const userEventIds = currentUser.get("eventId");

      if (userEventIds && userEventIds.length > 0) {
        const ParseEvents = Parse.Object.extend("Events");
        const query = new Parse.Query(ParseEvents);
        query.notEqualTo("title", "Temporary Title");

        if (eventFilter === "all") {
          query.containedIn("objectId", userEventIds);
        } else if (eventFilter === "my") {
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

  const applySortingAndFiltering = (
    events,
    attendingFilter,
    sortOrd,
    filterTyp,
    dateFilt
  ) => {
    let filteredEvents = events.filter((event) => {
      const attendees = event.eventData.attendees || [];
      if (attendingFilter === "attending") {
        return attendees.includes(currentUser.id);
      } else if (attendingFilter === "notAttending") {
        return !attendees.includes(currentUser.id);
      }
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

    if (sortOrder === "newest") {
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
    fetchEvents(eventFilter, sortOrder, attendingFilter, dateFilter);
    const ParseEvents = Parse.Object.extend("Events");
    const query = new Parse.Query(ParseEvents);
    query.notEqualTo("title", "Temporary Title");

    const subscription = liveQueryClient.subscribe(query);

    subscription.on("create", (newEvent) => {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    });

    return () => {
      liveQueryClient.unsubscribe(query, subscription);
    };
  }, [eventFilter, sortOrder, attendingFilter, dateFilter, liveQueryClient]);

  function renderValue(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  const handleEventClick = (eventId) => {
    navigate(`/Eventpage/${eventId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.body}>
      <button onClick={toggleSidebar} className={styles.sidebarToggle}>
        <span className="material-icons">
          {isSidebarOpen ? "" : "settings"}
        </span>
      </button>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <button onClick={toggleSidebar} className={styles.closeSidebarButton}>
          <span className="material-icons">
            {" "}
            {!isSidebarOpen ? "" : "close"}
          </span>
        </button>
        <div
          className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
        >
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Sort By</div>
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Events</div>
            <select
              onChange={(e) => setEventFilter(e.target.value)}
              value={eventFilter}
            >
              <option value="all">All Events</option>
              <option value="my">My Events</option>
            </select>
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Attending</div>
            <select
              onChange={(e) => setAttendingFilter(e.target.value)}
              value={attendingFilter}
            >
              <option value="all">None</option>
              <option value="attending">Attending</option>
              <option value="notAttending">Not Attending</option>
            </select>
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Date</div>
            <select
              onChange={(e) => setDateFilter(e.target.value)}
              value={dateFilter}
            >
              <option value="all">None</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
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
