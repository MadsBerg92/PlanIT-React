import Button from "../../components/button/Button.jsx";
import NavBar from "../../components/navbar/Navbar.jsx";
import styles from "./EventPage.module.css"


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
      <div className={styles.centered}>
      <Button textActive={"Attending"} textInactive={"Not Attending"} type={"normal"} ></Button>
      <Button textInactive={"Invite Friends"} type={"special"} onClick={handleButtonClick}></Button>
      </div>
     </div>
    );
  };
  
  export default EventPage;