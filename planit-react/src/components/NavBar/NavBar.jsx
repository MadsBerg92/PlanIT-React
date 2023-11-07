import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styles from "./navbar.module.css";

import Dropdown from "react-bootstrap/Dropdown";

import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar className={styles.bar} data-bs-theme="dark">
      <Container>

        <Navbar.Brand className={`${styles.title} ms-auto`} href="#home">
          <img
            src="/images/logo.png"

            width="50"
            height="40"
            className="d-inline-block align-top image"
            alt="React Bootstrap logo"
          />
          PlanIT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto justify-content-between">
            <Nav.Link className={styles.navlink} onClick={() => navigate("/")}>
              Home
            </Nav.Link>
            <Nav.Link
              className={styles.navlink}
              onClick={() => navigate("/CreateEvent")}
            >
              Create Event
            </Nav.Link>
            <Nav.Link
              className={styles.navlink}
              onClick={() => navigate("/MyEvents")}
            >
              My Events
            </Nav.Link>
          </Nav>
          <NavDropdown
            className={`${styles.dropdown} ms-auto`}
            title="Profile"
            id="basic-nav-dropdown"
          >


            <NavDropdown.Item className="dropdownitem" href="/ProfilePage">

              My Profile
            </NavDropdown.Item>
            <NavDropdown.Item href="/EditProfile">
              Edit Profile
            </NavDropdown.Item>
            {/* TODO: This is dummy to redirect to the login page, log out will be added later */}
            <NavDropdown.Item href="/Login">Logout</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
