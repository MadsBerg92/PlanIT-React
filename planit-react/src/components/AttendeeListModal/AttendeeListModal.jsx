import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Parse from "parse";
import { useParams } from "react-router-dom";

const AttendeeListModal = ({ show, onClose }) => {
  const { eventId } = useParams();
  const [attendeeNames, setAttendeeNames] = useState([]);

  useEffect(() => {
    if (show) {
      fetchAttendees();
    }
  }, [show, eventId]);

  const fetchAttendees = async () => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", parseInt(eventId, 10));
      query.include("attendees");

      const event = await query.first();
      if (event) {
        const attendees = event.get("attendees") || [];
        const attendeeQuery = new Parse.Query(Parse.User);
        attendeeQuery.containedIn("objectId", attendees);
        const attendeeObjects = await attendeeQuery.find();

        const names = attendeeObjects.map((user) => user.get("username"));
        setAttendeeNames(names);
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Event Attendees</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {attendeeNames.length === 0 ? (
          <p>No attendees yet.</p>
        ) : (
          attendeeNames.map((name, index) => <div key={index}>{name}</div>)
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AttendeeListModal;
