import React, { useEffect, useState } from "react";
import Parse from "parse";
import Button from "../Button/Button";
import Box from "../box/Box";
import InputBox from "../InputBox/InputBox";
import styles from "./FriendList.module.css";

/**
 * FriendList component displays the list of friends and allows searching and adding new friends.
 */
const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
    } catch (error) {
      console.error("Error while removing friend", error);
    }
  };

  return (
    <>
      <div className={styles.title}>
        <h1>Friend List </h1>
      </div>
      <div className={styles.friendlistpage}>
        <Box
          className={styles.Box}
          title="Friend List"
          type="second"
          content={friends.map((friend, index) => ({
            label: "Friend " + (index + 1),
            value: friend.get("username"),
            friend: friend,
          }))}
          Button={(item) => (
            <Button
              type="special"
              textInactive="Remove Friend"
              onClick={handleRemoveFriend(item.friend.id)}
            ></Button>
          )}
        />

        <Box
          className={styles.Box}
          title="Search For New Friends"
          type="second"
          content={
            searchResults.length > 0
              ? searchResults.map((user, index) => ({
                  label: "User " + (index + 1),
                  value: user.get("username"),
                  id: user.id,
                }))
              : [{ label: "", value: "No users with that username" }]
          }
          Button={(user) =>
            user.id && (
              <Button
                type="create"
                textInactive="Add Friend"
                onClick={() => handleAddFriend(user.id)}
              />
            )
          }
        >
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
        </Box>
      </div>
    </>
  );
};

export default FriendList;
