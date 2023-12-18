import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import styles from "./EventCard.module.css";
import { useNavigate, Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa"; // Import edit icon from react-icons
import Parse from "parse";

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
  // Get current user's objectId
  const currentUserId = Parse.User.current().id;
  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent triggering handleEventClick
    // Navigate to the edit page
    navigate(`/EditEventPage/${eventData.eventId}`);
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
          {/* Only show edit icon if the event is created by the current user  */}
        </Nav.Link>
        {eventData.createdBy === currentUserId && (
          <div>
            <Link to={`/edit-event/${eventData.eventId}`}>
              <FaEdit />
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}

export default EventCard;
