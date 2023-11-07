import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styles from "./NavBar.module.css";

import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar className={styles.bar} data-bs-theme="dark">
      <Container>
        <Nav.Link>
          <Navbar.Brand
            className={`${styles.title} ms-auto`}
            onClick={() => navigate("Home")}
          >
            <img
              src="/images/logo.png"
              width="50"
              height="40"
              className="d-inline-block align-top image"
              alt="React Bootstrap logo"
            />
            PlanIT
          </Navbar.Brand>
        </Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto justify-content-between">
            <Nav.Link
              className={styles.navlink}
              onClick={() => navigate("Home")}
            >
              Home
            </Nav.Link>
            <Nav.Link
              className={styles.navlink}
              onClick={() => navigate("/event-creation")}
            >
              Create Event
            </Nav.Link>
            <Nav.Link
              className={styles.navlink}
              onClick={() => navigate("Home")}
            >
              My Events
            </Nav.Link>
          </Nav>
          <NavDropdown
            className={`${styles.dropdown} ms-auto`}
            title="Profile"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item
              className="dropdownitem"
              onClick={() => navigate("/profile")}
            >
              My Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </NavDropdown.Item>
            {/* TODO: This is dummy to redirect to the login page, log out will be added later */}
            <NavDropdown.Item onClick={() => navigate("/")}>
              Logout
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => navigate("Home")}>
              Home
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
