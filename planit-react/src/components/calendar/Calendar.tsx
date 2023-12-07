import React, { useState } from "react";
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
  const eventIdAsNumber = parseInt(eventId || "0", 10);

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
      console.log(eventIdAsNumber);

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

      <div>
        <Button
          textActive={"submit dates"}
          textInactive={""}
          isActive={true}
          onClick={HandleCalendarSubmit}
          type={"special"}
        />
      </div>
    </div>
  );
}

export default EventCalendar;
