import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../Button/Button";

const FriendListModal = ({ show, onPassFriends, friendList, onAddFriends }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);

  const toggleFriendSelection = (friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(
        selectedFriends.filter((selectedFriend) => selectedFriend !== friend)
      );
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const renderFriends = () => {
    if (!Array.isArray(friendList)) {
      return <p>You do not have any friends to invite :(</p>;
    }
    return friendList.map((friend, index) => (
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

  return (
    <Modal show={show} onPassFriends={() => onPassFriends(selectedFriends)}>
      <Modal.Header closeButton>
        <Modal.Title>Invite to event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{renderFriends()}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          textInactive={"Add friends"}
          type={"special"}
          onClick={() => {
            // Pass the selected friends to the parent component
            onAddFriends(selectedFriends);
          }}
        ></Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FriendListModal;
