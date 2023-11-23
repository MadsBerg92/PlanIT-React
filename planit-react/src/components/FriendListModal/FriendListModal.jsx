import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../Button/Button";
import Parse from "parse";
import { useParams } from "react-router-dom";

/**
 * FriendListModal component displays a modal for inviting friends to an event.
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Determines whether the modal is visible or not.
 * @param {function} props.onClose - Callback function to close the modal.
 * @returns {JSX.Element} The rendered FriendListModal component.
 */
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

  /**
   * Fetches the friend list for the current user.
   * @returns {Promise<void>} A promise that resolves when the friend list is fetched successfully.
   */
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

  /**
   * Updates the attendee names based on the provided attendee IDs.
   * @param {string[]} attendeeIds - An array of attendee IDs.
   * @returns {Promise<void>} - A promise that resolves once the attendee names are updated.
   */
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

  /**
   * Adds friends to an event and updates the attendees list.
   * @param {string[]} selectedFriendIds - The IDs of the selected friends to add.
   * @returns {Promise<void>} - A promise that resolves when the attendees are updated successfully.
   */
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

  /**
   * Toggles the selection of a friend.
   * @param {Object} friend - The friend object.
   */
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

  /**
   * Renders the list of friends.
   * If there are no friends available, it displays a message.
   * @returns {JSX.Element} The rendered list of friends.
   */

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
