import React, { useState } from "react";
import Parse from "parse";
import styles from "../../pages/LogIn/Login.module.css";

const Form = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const switchForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      const user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("email", email);

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
        })
        .catch((error) => {
          console.log("Error: " + error.code + " " + error.message);
        });
    } else {
      Parse.User.logIn(username, password)
        .then((user) => {
          console.log(
            "User logged in successful with name: " + user.get("username")
          );
        })
        .catch((error) => {
          console.log("Error: " + error.code + " " + error.message);
        });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <img src=".\Images\logo.png" alt="logo" className={styles.logo} />
        <h1>PlanIT</h1>
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
                type="text"
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
              <button type="submit">Sign Up</button>
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
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
          </>
        )}
        <div className={styles.is_signed_up}>
          <button onClick={switchForm} className={styles.question_button}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
