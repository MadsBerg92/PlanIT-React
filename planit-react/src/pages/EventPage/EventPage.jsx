import Button from "../../components/buttons/Button.jsx";
import NavBar from "../../components/navbar/NavBar.jsx";
import styles from "./EventPage.module.css"
// import image from "/images/Birthday.png"

const EventPage = () => {
  
  const handleButtonClick = () => {
    //Add relevant code here isntead of alert
    alert('Button clicked!');
  };

    return (
      <div>
      <NavBar></NavBar>
      <div className={styles.centered}>
      <img className={styles.image} src="/images/Birthday.png" alt="logo"></img>
      </div>
      <Button label="click me" type={"normal"} ></Button>
      <Button label="click! " type={"special"} onClick={handleButtonClick}></Button>
     <p>I AM EVENT PAGE</p>
     </div>
    );
  };
  
  export default EventPage;