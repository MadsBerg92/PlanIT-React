import InputBox from "../components/Inputbox/InputBox";
import styles from "../components/Inputbox/create_styles.module.css";
import Button from "../components/Button/Button";

const CreateEvent = () => {
  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  function previewImage(e) {
    const preview = document.querySelector("#event-image-preview");
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
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
          onchange={(e) => this.props.previewImage(e)}
          required
        />
        <Button label="Create Event" type="special" onClick={handleSubmit} />
      </form>
    </div>
  );
};
export default CreateEvent;
