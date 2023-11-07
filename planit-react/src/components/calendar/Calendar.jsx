import React, { useState } from "react";
import Calendar from "react-calendar";
import styles from "./calendar.module.css";
import "react-calendar/dist/Calendar.css";

function EventCalendar() {
  const [value, onChange] = useState(new Date());

  return (
    <div className={styles.calendarBox}>
      <Calendar onChange={onChange} value={value} className={styles.calendar} />
    </div>
  );
}

export default EventCalendar;
