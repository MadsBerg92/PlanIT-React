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
  const [attendingFilter, setAttendingFilter] = useState("all"); // Options: 'attending', 'notAttending', 'all'
  const [dateFilter, setDateFilter] = useState("all"); // Options: 'past', 'upcoming', 'all'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          "attendees"
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
      if (attendingFilter === "attending") {
        return attendees.includes(currentUser.id);
      } else if (attendingFilter === "notAttending") {
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
    fetchEvents(activeButton, sortOrder, attendingFilter, dateFilter);
  }, [activeButton, sortOrder, attendingFilter, dateFilter]);

  const handleButtonClick = (toggleButton) => {
    setActiveButton(toggleButton);
  };

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
    <div>
      <button onClick={toggleSidebar} className={styles.sidebarToggle}>
        <span className="material-icons">
          {isSidebarOpen ? "" : "settings"}
        </span>
      </button>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <button onClick={toggleSidebar} className={styles.closeSidebarButton}>
          <span className="material-icons">
            {!isSidebarOpen ? "" : "close"}
          </span>
        </button>
        <div className={`${styles.myEventsButton} ${styles.twoButtonsRow}`}>
          <Button
            type="filter"
            textActive="All events"
            textInactive="All events"
            isActive={activeButton === "all"}
            onClick={() => handleButtonClick("all")}
          />
          <Button
            type="filter"
            textActive="My events"
            textInactive="My events"
            isActive={activeButton === "my"}
            onClick={() => handleButtonClick("my")}
          />
        </div>
        <div className={`${styles.myEventsButton} ${styles.twoButtonsRow}`}>
          <Button
            type="filter"
            textActive="Newest"
            textInactive="Newest"
            isActive={sortOrder === "latest"}
            onClick={() => setSortOrder("latest")}
          />
          <Button
            type="filter"
            textActive="Oldest"
            textInactive="Oldest"
            isActive={sortOrder === "oldest"}
            onClick={() => setSortOrder("oldest")}
          />
        </div>
        <div className={styles.myEventsButton}>
          <Button
            type="filter"
            textActive="All"
            textInactive="All"
            isActive={attendingFilter === "all"}
            onClick={() => setAttendingFilter("all")}
          />
          <Button
            type="filter"
            textActive="Attending"
            textInactive="Attending"
            isActive={attendingFilter === "attending"}
            onClick={() => setAttendingFilter("attending")}
          />
          <Button
            type="filter"
            textActive="Not Attending"
            textInactive="Not Attending"
            isActive={attendingFilter === "notAttending"}
            onClick={() => setAttendingFilter("notAttending")}
          />
        </div>
        <div className={styles.myEventsButton}>
          <Button
            type="filter"
            textActive="All"
            textInactive="All"
            isActive={dateFilter === "all"}
            onClick={() => setDateFilter("all")}
          />
          <Button
            type="filter"
            textActive="Upcoming"
            textInactive="Upcoming"
            isActive={dateFilter === "upcoming"}
            onClick={() => setDateFilter("upcoming")}
          />
          <Button
            type="filter"
            textActive="Past"
            textInactive="Past"
            isActive={dateFilter === "past"}
            onClick={() => setDateFilter("past")}
          />
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
