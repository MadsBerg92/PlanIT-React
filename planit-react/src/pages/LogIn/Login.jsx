import styles from "./Login.module.css";

const Login = () => {
  return (
    <div>
      <div className={styles.header}>
        {/* <i className="material-icons">edit_calendar</i> */}
        <img src="./././logo.png" alt="logo" className={styles.logo} />
        <h1>PlanIT</h1>
      </div>
      <div className={styles.stroke}>
        <h2>Log in</h2>
        <br />
        <h5>Stay updated on your favourite events</h5>
        <br />
        <form action="EventPage" method="get">
          <input type="text" placeholder="Username or email" />
          <input type="password" placeholder="Password" />
          <button type="submit" className="button-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
