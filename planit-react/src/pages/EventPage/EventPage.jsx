import Button from "../../components/button/Button.jsx";
import NavBar from "../../components/navbar/navbar.jsx";
import styles from "./EventPage.module.css";

const EventPage = () => {
  const handleButtonClick = () => {
    alert("Button clicked!");
  };

  return (
    <div>
      <NavBar />
      <div className={styles.centered}>
        <img
          className={styles.image}
          src="/images/Birthday.png"
          alt="logo"
        ></img>
      </div>
      <Button label="click me" type={"normal"}></Button>
      <Button
        label="click! "
        type={"special"}
        onClick={handleButtonClick}
      ></Button>
      <p>I AM EVENT PAGE</p>
    </div>
  );
};

export default EventPage;
