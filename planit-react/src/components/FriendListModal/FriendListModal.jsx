import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../Button/Button";
import Parse from "parse";
import { useParams } from "react-router-dom";

const FriendListModal = ({ show, onClose }) => {
  const { eventId } = useParams();
  const eventIdAsNumber = parseInt(eventId, 10);
  const [userFriendList, setUserFriendList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    if (show) {
      fetchFriendList(); // fetchFriendList is now an internal function
    }
  }, [show]);

  //Fetch friend list
  const fetchFriendList = async () => {
    try {
      const currentUser = Parse.User.current();
      if (currentUser) {
        const userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo("objectId", currentUser.id);
        userQuery.include("friendList");

        const userResult = await userQuery.first();
        const friendListFromParse = userResult.get("friendList");

        if (friendListFromParse) {
          // Fetch User objects for each friend
          const friendUserQuery = new Parse.Query(Parse.User);
          friendUserQuery.containedIn("objectId", friendListFromParse);
          const friends = await friendUserQuery.find();

          // Extract usernames and update state
          const friendUsernames = friends.map((friend) =>
            friend.get("username")
          );
          setUserFriendList(friendUsernames);
        }
      }
    } catch (error) {
      console.error("Error fetching friend list:", error);
    }
  };

  //Handle Add Friends
  const onAddFriends = async (selectedFriends) => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", eventIdAsNumber); // Assuming eventIdAsNumber is available

      const eventObject = await query.first();

      if (eventObject) {
        // Get the existing attendees and merge with the selectedFriends
        const existingAttendees = eventObject.get("attendees") || [];
        const updatedAttendees = [...existingAttendees, ...selectedFriends];

        // Update the attendees column with the merged array
        eventObject.set("attendees", updatedAttendees);

        // Save the updated object back to the database
        await eventObject.save();

        console.log("Attendees updated successfully");
        // Handle success or display a message to the user
      } else {
        console.error("Event not found");
        // Handle the case where the event is not found
      }
    } catch (error) {
      console.error("Error updating attendees:", error);
      // Handle the error or display an error message
    }
  };

  const toggleFriendSelection = (friend) => {
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friend)) {
        return prevSelectedFriends.filter(
          (selectedFriend) => selectedFriend !== friend
        );
      } else {
        return [...prevSelectedFriends, friend];
      }
    });
  };

  const renderFriends = () => {
    if (!Array.isArray(userFriendList) || userFriendList.length === 0) {
      return <p>No friends available to invite.</p>;
    }

    return userFriendList.map((friend, index) => (
      <div key={index}>
        <label>
          <input
            type="checkbox"
            checked={selectedFriends.includes(friend)}
            onChange={() => toggleFriendSelection(friend)}
          />
          {friend}
        </label>
      </div>
    ));
  };

  const handleAddClick = () => {
    onAddFriends(selectedFriends);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Invite to Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{renderFriends()}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          textInactive={"Add Friends"}
          type={"special"}
          onClick={handleAddClick}
        ></Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FriendListModal;
