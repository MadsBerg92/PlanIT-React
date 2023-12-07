import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import styles from "./EventCard.module.css";
import { useNavigate } from "react-router-dom";

/**
 * Renders an event card component.
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of event.
 * @param {Object} props.eventData - The event data.
 * @returns {JSX.Element} The rendered event card.
 */

function EventCard({ type, eventData }) {
  const navigate = useNavigate();

  /**
   * Renders the content based on the type of event.
   * @returns {JSX.Element|null} The rendered content.
   */
  const renderContent = () => {
    switch (type) {
      case "specific":
        return (
          <div>
            <li>Date: {eventData.eventDate}</li>
            <li>RSVP: {eventData.eventRSVP}</li>
          </div>
        );
      case "openPoll":
      case "specificPoll":
        return (
          <div>
            <li>Date: To be decided</li>
            <li>RSVP: {eventData.eventRSVP}</li>
          </div>
        );
      default:
        return null;
    }
  };

  /**
   * Handles the click event for the event card.
   */
  const handleEventClick = () => {
    navigate(`/EventPage/${eventData.eventId}`);
  };

  return (
    <Container>
      <div className={styles.mainDiv}>
        <Nav.Link onClick={handleEventClick}>
          <div>
            <h5 className={styles.nameText}>{eventData.eventName}</h5>
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
                <ul>{renderContent()}</ul>
              </div>
            </div>
          </div>
        </Nav.Link>
      </div>
    </Container>
  );
}

export default EventCard;
