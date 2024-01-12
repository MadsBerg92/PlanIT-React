import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import styles from "./EventCard.module.css";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faGear } from "@fortawesome/free-solid-svg-icons";

import Parse from "parse";
import { useState, useEffect } from "react";

/**
 * Renders an event card component.
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of event.
 * @param {Object} props.eventData - The event data.
 * @returns {JSX.Element} The rendered event card.
 */

function EventCard({ eventData }) {
  const navigate = useNavigate();

  const [formattedDate, setFormattedDate] = useState("");

  /**
   * Renders the content based on the type of event.
   * @returns {JSX.Element|null} The rendered content.
   */
  useEffect(() => {
    const eventDate = new Date(eventData.eventCompareDate);
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "numeric",
      year: "numeric",
    };
    setFormattedDate(eventDate.toLocaleDateString("en-US", options));
  }, [eventData.eventDate]);

  const handleEventClick = () => {
    navigate(`/EventPage/${eventData.eventId}`);
  };
  const currentUserId = Parse.User.current().id;
  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/EditEventPage/${eventData.eventId}`);
  };
  return (
    <Container>
      <div className={styles.mainDiv}>
        <Nav.Link onClick={handleEventClick}>
          <div>
            <h4 className={styles.nameText}>{eventData.eventName}</h4>
          </div>
          <div className={styles.contentDiv}>
            <div className={styles.info}>
              <h5>{eventData.eventCreator}'s event</h5>
              <img src={eventData.image} alt="event" />
            </div>
            <div className={styles.descriptionDateContainer}>
              <div className={styles.description}>
                <span>{eventData.eventDescription}</span>
              </div>

              <div className={styles.date}>
                <ul> {formattedDate}</ul>
              </div>
            </div>
          </div>
          {/* Only show edit icon if the event is created by the current user  */}
        </Nav.Link>
        {eventData.createdBy === currentUserId && (
          <div className={`${styles.editLink} editLink`}>
            <Link
              to={`/edit-event/${eventData.eventId}`}
              className={styles.icon}
            >
              <FontAwesomeIcon icon={faGear} />
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}

export default EventCard;
