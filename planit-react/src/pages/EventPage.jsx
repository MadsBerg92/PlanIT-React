import Button from "../components/buttons/Button.jsx";
import NavBar from "../components/navbar/NavBar.jsx";

const EventPage = () => {
  
  const handleButtonClick = () => {
    alert('Button clicked!');
  };

    return (
      <div>
      <NavBar></NavBar>
      <Button label="click me" type={"normal"} ></Button>
      <Button label="click! " type={"special"} onClick={handleButtonClick}></Button>
     <p>I AM EVENT PAGE</p>
     </div>
    );
  };
  
  export default EventPage;