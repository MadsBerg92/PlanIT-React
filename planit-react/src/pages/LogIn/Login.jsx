import React, { useState } from "react";
import Parse from "parse";
import styles from "./Login.module.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

/**
 * Form component for user sign up and login.
 *
 * @component
 * @returns {JSX.Element} Form component
 */
const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  /**
   * Toggles the form between sign up and login.
   */
  const switchForm = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage(null);
  };

  /**
   * Handles the form submission.
   * @param {Event} e - The form submission event.
   */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      const user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("email", email);
      user.set("userId", uuidv4());

      user
        .signUp()
        .then((user) => {
          console.log(
            "User created successful with name: " + user.get("username")
          );
          return Parse.User.logIn(username, password, email);
        })
        .then((user) => {
          console.log(
            "User logged in successful with name: " + user.get("username")
          );
          navigate("/Home"); // navigate to FeedPage after successful login
        })
        .catch((error) => {
          console.log("Error: " + error.code + " " + error.message);
          setErrorMessage(
            "Sign up failed. Please check your details and try again."
          );
        });
    } else {
      Parse.User.logIn(username, password)
        .then((user) => {
          console.log(
            "User logged in successful with name: " + user.get("username")
          );
          navigate("/Home"); // navigate to FeedPage after successful login
        })
        .catch((error) => {
          console.log("Error: " + error.code + " " + error.message);
          setErrorMessage(
            "Login failed. Please check your details and try again."
          );
        });
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <img src=".\Images\logo_tab.png" alt="logo" className={styles.logo} />
      </div>
      <div className={styles.stroke}>
        {isSignUp ? (
          <>
            <h2>Sign Up</h2>
            <br />
            <h5>Create your account</h5>
            <br />
            <form onSubmit={handleSubmit}>
              <input
                type="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && (
                <p className={styles.error_message}>{errorMessage}</p>
              )}
              <Button type="login" textInactive="Create Account" />
              <br />
              <br />
              <h5>Already have an account?</h5>
            </form>
          </>
        ) : (
          <>
            <h2>Log in</h2>
            <br />
            <h5>Stay updated on your favourite events</h5>
            <br />
            <form onSubmit={handleSubmit}>
              <input
                type="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && (
                <p className={styles.error_message}>{errorMessage}</p>
              )}
              <Button type="login" textInactive="Login" />
              <br />
              <br />
              <h5>Don't have an account?</h5>
            </form>
          </>
        )}
        <div className={styles.is_signed_up}>
          <Button
            onClick={switchForm}
            type="cancel"
            textInactive={isSignUp ? "Sign In" : "Create Account"}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
