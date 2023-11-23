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
      alert("Friend added successfully!");
    } catch (error) {
      console.error("Error while adding friend", error);
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
          }))}
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
                textInactive="Add Friend"
                onClick={() => handleAddFriend(user.id)}
              />
            )
          }
        >
          <InputBox
            type="text"
            label="Search"
            name="search"
            placeholder="Enter username"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            required
          />
          <Button onClick={handleSearch} textInactive="Search"></Button>
        </Box>
      </div>
    </>
  );
};

export default FriendList;
