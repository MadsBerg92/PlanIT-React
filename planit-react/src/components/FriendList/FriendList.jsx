import React, { useEffect, useState } from "react";
import Parse from "parse";
import Button from "../Button/Button";
import Box from "../box/Box";
import InputBox from "../InputBox/InputBox";
import styles from "./FriendList.module.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

/**
 * FriendList component displays the list of friends and allows searching and adding new friends.
 */
const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDeleteFriendModal, setShowDeleteFriendModal] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const User = Parse.Object.extend("User");
    const currentUser = Parse.User.current();

    currentUser.fetch().then((user) => {
      const friendList = user.get("friendList");
      console.log("FriendList:", friendList); // Log the friendList to the console

      const query = new Parse.Query(User);
      query.containedIn("objectId", friendList);

      query
        .find()
        .then((results) => {
          console.log("Query results:", results); // Log the results of the query to the console
          setFriends(results);
        })
        .catch((error) => {
          console.log("Error while fetching Friends", error);
        });
    });
  }, []);

  const openDeleteFriendModal = (id) => {
    setSelectedFriendId(id);
    setShowDeleteFriendModal(true);
  };
  const closeDeleteFriendModal = () => setShowDeleteFriendModal(false);

  const openSearchModal = () => setShowSearchModal(true);
  const closeSearchModal = () => setShowSearchModal(false);
  /**
   * Handles the search for friends based on the search input.
   */
  const handleSearch = () => {
    const User = Parse.Object.extend("User");
    const query = new Parse.Query(User);
    query.matches("username", searchInput, "i");
    query
      .find()
      .then((results) => {
        setSearchResults(results);
      })
      .catch((error) => {
        console.log("Error while searching for friends", error);
      });
  };

  /**
   * Handles the addition of a friend to the current user's friend list.
   * @param {string} objectId - The ID of the friend to be added.
   * @returns {Promise<void>} - A promise that resolves when the friend is added successfully.
   */
  const handleAddFriend = async (objectId) => {
    try {
      const currentUser = Parse.User.current();

      await currentUser.fetch();
      currentUser.addUnique("friendList", objectId);

      await currentUser.save();

      // Fetch the updated friend list
      const User = Parse.Object.extend("User");
      const friendList = currentUser.get("friendList");
      const query = new Parse.Query(User);
      query.containedIn("objectId", friendList);

      const results = await query.find();
      setFriends(results);
      toast.success("Friend Added!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      console.error("Error while adding friend", error);
    }
  };

  /**
   * Handles the removal of a friend from the friend list.
   * @param {string} objectId - The object ID of the friend to be removed.
   * @returns {Promise<void>} - A promise that resolves when the friend is successfully removed.
   */
  const handleRemoveFriend = (objectId) => async () => {
    try {
      const currentUser = Parse.User.current();

      await currentUser.fetch();

      // Fetch the friendList array
      let friendList = currentUser.get("friendList") || [];

      // Filter out the objectId
      friendList = friendList.filter((id) => id !== objectId);

      // Update the friendList field
      currentUser.set("friendList", friendList);

      await currentUser.save();

      // Update the friends state
      setFriends(friends.filter((friend) => friend.id !== objectId));

      closeDeleteFriendModal();
      toast.success("Friend Deleted!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: false,
      });
    } catch (error) {
      console.error("Error while removing friend", error);
    }
  };

  return (
    <>
      <div className={styles.friendlistpage}>
        <Box
          className={styles.Box}
          title="Friend List"
          type="second"
          content={friends.map((friend) => ({
            value: (
              <div className={styles.friendItem}>
                <span className={styles.boldText}>
                  {friend.get("username")}
                </span>
                <Button
                  type="deleteFriend"
                  textInactive={<FontAwesomeIcon icon={faTrash} size="sm" />}
                  onClick={() => openDeleteFriendModal(friend.id)}
                />
              </div>
            ),
            friend: friend,
          }))}
          ExtraButton={() => (
            <Button
              type="create"
              textInactive="Find More Friends"
              onClick={openSearchModal}
            />
          )}
        />
        <ToastContainer></ToastContainer>

        <Modal show={showSearchModal} onHide={closeSearchModal}>
          <Modal.Header closeButton>
            <Modal.Title>Search For New Friends</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputBox
              id="search"
              type="text"
              label="Search"
              name="search"
              placeholder="Enter username"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              required
            />
            <Button
              type="create"
              onClick={handleSearch}
              textInactive="Search"
            ></Button>
            {searchResults.length > 0
              ? searchResults.map((user) => (
                  <div key={user.id} className={styles.flexContainer}>
                    <span>{user.get("username")}</span>
                    <Button
                      type="addFriend"
                      textInactive={
                        <>
                          <FontAwesomeIcon icon={faUser} size="sm" />
                          <FontAwesomeIcon icon={faPlus} size="sm" />
                        </>
                      }
                      onClick={() => handleAddFriend(user.id)}
                    />
                  </div>
                ))
              : "No users with that username"}
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteFriendModal} onHide={closeDeleteFriendModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete your friend?</Modal.Body>
          <Modal.Footer>
            <Button
              textInactive="Cancel"
              textActive="Cancel"
              type="cancel"
              onClick={closeDeleteFriendModal}
            ></Button>

            <Button
              textInactive="Delete Friend"
              textActive="Delete Friend"
              type="delete"
              onClick={handleRemoveFriend(selectedFriendId)}
            ></Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default FriendList;
