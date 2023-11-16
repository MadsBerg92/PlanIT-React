import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import styles from "./EventCard.module.css";
import { useNavigate } from "react-router-dom";

function EventCard({ type, eventData }) {
  const navigate = useNavigate();

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

  return (
    <Container>
      <div className={styles.mainDiv}>
        <Nav.Link onClick={() => navigate("/EventPage")}>
          <div className={styles.contentDiv}>
            <div className={styles.info}>
              <h5>{eventData.eventCreator}'s event</h5>
              <h5>{eventData.eventName}</h5>
              <img src="./images/Birthday.png" alt="event" />
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
