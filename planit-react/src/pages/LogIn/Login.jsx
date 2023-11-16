import React from "react";
import styles from "./Login.module.css";
import Form from "../../components/Form/Form"; // Make sure the path is correct

const Login = () => {
  return (
    <div className={styles.stroke}>
      <Form />
    </div>
  );
};

export default Login;
