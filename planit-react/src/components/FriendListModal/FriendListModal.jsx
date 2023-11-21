import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../Button/Button";

const FriendListModal = ({ show, onHide, friendList }) => {
  const renderFriends = () => {
    if (!Array.isArray(friendList)) {
      return <p>You do not have any friends to invite :(</p>;
    }
    return friendList.map((friend, index) => <p key={index}>{friend}</p>);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Invite friends</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{renderFriends()}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          textInactive={"Add friends"}
          type={"special"}
          onClick={onHide}
        ></Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FriendListModal;
