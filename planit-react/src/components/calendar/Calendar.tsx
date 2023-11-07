import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../calendar/calendar.module.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function EventCalendar() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className={styles.calendarBox}>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}

export default EventCalendar;
