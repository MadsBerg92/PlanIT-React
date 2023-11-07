import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import styles from "./EventCard.module.css";
import { useNavigate } from "react-router-dom";

function EventCard() {
  const navigate = useNavigate();

  return (
    <Container>
      <div className={styles.mainDiv}>
        <Nav.Link onClick={() => navigate("/EventPage")}>
          <div className={styles.contentDiv}>
            <div className={styles.info}>
              <h5>Louise's Event</h5>
              <h5>Dinner Party!</h5>
              <img src="./images/Birthday.png" alt="event" />
            </div>
            <div className={styles.description}>
              <span>
                Heya! I wanted to invited you all for dinner at my place! I’ve
                proposed 3 dates that fits well for me. Please choose the days
                that fit you so we can get this thing rolling :D
              </span>
              <div className={styles.date}>
                <span>
                  Date: Fixed Date Poll <br />
                  RSVP: 5/1 - 2023
                </span>
              </div>
            </div>
          </div>
        </Nav.Link>
      </div>
    </Container>
  );
}
export default EventCard;
