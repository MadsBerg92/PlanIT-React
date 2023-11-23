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
  const [attendeeNames, setAttendeeNames] = useState([]);

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

          setUserFriendList(friends);
        }
      }
    } catch (error) {
      console.error("Error fetching friend list:", error);
    }
  };

  const updateAttendeeNames = async (attendeeIds) => {
    try {
      // Create a query for the User object
      const User = Parse.Object.extend("User");
      const query = new Parse.Query(User);

      // Query users whose objectId is in the attendeeIds array
      query.containedIn("objectId", attendeeIds);

      // Execute the query
      const results = await query.find();

      // Extract usernames from the results
      const attendeeNames = results.map((user) => user.get("username"));

      // Update the state with these names
      setAttendeeNames(attendeeNames);
    } catch (error) {
      console.error("Error fetching attendee names:", error);
    }
  };

  //Handle Add Friends
  const onAddFriends = async (selectedFriendIds) => {
    try {
      const ParseEvents = Parse.Object.extend("Events");
      const query = new Parse.Query(ParseEvents);
      query.equalTo("eventId", eventIdAsNumber); // Assuming eventIdAsNumber is available

      const eventObject = await query.first();

      if (eventObject) {
        const existingAttendees = eventObject.get("attendees") || [];
        const uniqueAttendees = new Set([
          ...existingAttendees,
          ...selectedFriendIds,
        ]);

        eventObject.set("attendees", Array.from(uniqueAttendees));
        await eventObject.save();

        // Notify parent component to update display names
        updateAttendeeNames(Array.from(uniqueAttendees));

        console.log("Attendees updated successfully");

        // Add the objectId of the event to the eventId column of the invited users
        const ParseUser = Parse.Object.extend("User");
        for (const friendId of selectedFriendIds) {
          await Parse.Cloud.run("addEventToUser", {
            userId: friendId,
            eventId: eventObject.id,
          });
        }
      } else {
        console.error("Event not found");
      }
    } catch (error) {
      console.error("Error updating attendees:", error);
      // Handle the error or display an error message
    }
  };

  const toggleFriendSelection = (friend) => {
    const friendId = friend.id;
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friendId)) {
        return prevSelectedFriends.filter((id) => id !== friendId);
      } else {
        return [...prevSelectedFriends, friendId];
      }
    });
  };

  const renderFriends = () => {
    if (!Array.isArray(userFriendList) || userFriendList.length === 0) {
      return <p>No friends available to invite.</p>;
    }

    return userFriendList.map((friend, index) => (
      <div key={friend.id}>
        <label>
          <input
            type="checkbox"
            checked={selectedFriends.includes(friend.id)}
            onChange={() => toggleFriendSelection(friend)}
          />
          {friend.get("username")}
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
