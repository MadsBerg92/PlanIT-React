import Button from "../../components/Button/Button.jsx";
import styles from "./EventPage.module.css";
import InformationBox from "../../components/InfoBox/InfoBox.jsx";
import DescriptionBox from "../../components/descriptionBox/DescriptionBox.jsx";
import EventCalendar from "../../components/calendar/Calendar.jsx";


const EventPage = () => {
  const handleButtonClick = () => {
    alert("Button clicked!");
  };

  //data for information box
  const eventData = [
    { label: 'Event Location', value: 'My house at Frederiksberg' },
    { label: 'Date', value: 'October 15, 2023, 17:00' },
    { label: 'Host', value: 'Pernille Svendsen' },
    { label: 'Attending', value: 'You are going!' },
  ];

  const description = `Celebrate with us as we mark a significant milestone in life! It's
    time to revel in the joy of reaching 35 years, filled with memories,
    accomplishments, and laughter. Join us for a remarkable evening that
    promises to be an unforgettable chapter in the book of our lives. Our
    35th birthday party has a fantastic theme—[Theme Name]. Get ready to
    immerse yourself in a world of [Theme Description], from the
    decorations to the music and everything in between. Dress up according
    to the theme, or come as you are; the choice is yours!`;

  return (
    <div>

      <div className={styles.centered}>
        <img
          className={styles.image}
          src="/images/Birthday.png"
          alt="logo"
        ></img>
      </div>
      <div className={styles.centered}>
      <Button textActive={"Attending"} textInactive={"Not Attending"} type={"normal"} ></Button>
      <Button textInactive={"Invite Friends"} type={"special"} onClick={handleButtonClick}></Button>
      </div>
      <div className={styles.boxContainer}>
      <InformationBox  title="Event Details" content={eventData}></InformationBox>
      <DescriptionBox  title="Event Description" content={description}></DescriptionBox>
      </div>
        <EventCalendar/>
      
    </div>
  );
};

export default EventPage;
