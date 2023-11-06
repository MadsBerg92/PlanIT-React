import InputBox from "../components/inputBox/inputBox";
import styles from "../components/inputBox/inputBox.module.css";
import Button from "../components/Button/Button";

const CreateEvent = () => {
  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const previewImage = (event) => {
    const preview = document.querySelector("#event-image-preview");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      preview.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  };
  return (
    <div className={styles.formGroup}>
      <form>
        <img
          id="event-image-preview"
          className={styles.eventImagePreview}
          src="/images/event-photography.jpg"
          alt="Event Image Preview"
        />
        <InputBox
          label="Event Name"
          id="event-name"
          name="event-name"
          type="text"
          placeholder="Enter event name"
          required
        />
        <InputBox
          label="Event Date"
          id="event-date"
          name="event-date"
          type="date"
          required
        />
        <InputBox
          label="Event Time"
          id="event-time"
          name="event-time"
          type="time"
          required
        />
        <InputBox
          label="Event Location"
          id="event-location"
          name="event-location"
          type="text"
          placeholder="Enter event location"
          required
        />
        <InputBox
          label="Event Description"
          id="event-description"
          name="event-description"
          type="textarea"
          placeholder="Enter event description"
          required
        />

        <InputBox
          label="Event Image"
          type="file"
          id="event-image"
          name="event-image"
          onChange={previewImage}
          required
        />
        <Button label="Create Event" type="special" onClick={handleSubmit} />
      </form>
    </div>
  );
};
export default CreateEvent;
