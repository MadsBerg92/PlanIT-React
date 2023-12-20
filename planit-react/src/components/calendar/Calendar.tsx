import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../calendar/calendar.module.css";
import Button from "../Button/Button";
import { useParams } from "react-router-dom";
import Parse from "parse";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function EventCalendar() {
  const [value, onChange] = useState<Value>(new Date());
  const { eventId } = useParams();
  const [suggestedDates, setSuggestedDates] = useState<string[]>([]);
  const eventIdAsNumber = parseInt(eventId || "0", 10);

  useEffect(() => {
    // Fetch suggested dates when the component mounts
    fetchSuggestedDates();
  }, [eventIdAsNumber]); // Re-fetch suggested dates when eventIdAsNumber changes

  const fetchSuggestedDates = async () => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", eventIdAsNumber);

      const eventObject = await query.first();

      if (eventObject) {
        const existingSuggestedDates = eventObject.get("suggestedDate") || [];
        setSuggestedDates(existingSuggestedDates);
      } else {
        console.error("Event not found");
      }
    } catch (error) {
      console.error("Error fetching suggested dates:", error);
    }
  };

  async function HandleCalendarSubmit() {
    try {
      const chosendate = value?.toLocaleString();

      if (!chosendate) {
        // Handle the case where no date is selected
        return;
      }

      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", eventIdAsNumber);

      const eventObject = await query.first();

      if (eventObject) {
        // Get the existing suggested dates and add the new date
        const existingSuggestedDates = eventObject.get("suggestedDate") || [];
        const updatedSuggestedDates = [...existingSuggestedDates, chosendate];

        // Update the suggestedDates column with the merged array
        eventObject.set("suggestedDate", updatedSuggestedDates);

        // Save the updated object back to the database
        await eventObject.save();

        console.log("Suggested dates updated successfully");

        setSuggestedDates(updatedSuggestedDates);

        //Sets the value back to new Date
        onChange(new Date());
      } else {
        console.error("Event not found");
        // Handle the case where the event is not found
      }
    } catch (error) {
      console.error("Error updating suggested dates:", error);
      // Handle the error or display an error message
    }
  }

  return (
    <div className={styles.calendarBox}>
      <Calendar onChange={onChange} value={value} />

      <div className={styles.button}>
        <Button
          textActive={"Submit Date"}
          textInactive={""}
          isActive={true}
          onClick={HandleCalendarSubmit}
          type={"special"}
        />
      </div>

      <div className={styles.suggestedDates}>
        <h3>Suggested Dates:</h3>
        <ul>
          {suggestedDates.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventCalendar;
