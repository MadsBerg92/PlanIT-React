import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import styles from './navbar.module.css';
import Dropdown from 'react-bootstrap/Dropdown';

function NavBar() {
  return (
    <Navbar className={styles.bar} data-bs-theme="dark">
      <Container >
      <Navbar.Brand className={`${styles.title} ms-auto`} href="#home">
        <img
            src="./././logo.png"
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
            <Nav.Link className={styles.navlink} href="#home">
              Home
            </Nav.Link>
            <Nav.Link className={styles.navlink} href="#create">
              Create Event
            </Nav.Link>
            <Nav.Link className={styles.navlink} href="#event">
              My Events
            </Nav.Link>
          </Nav>
          <NavDropdown className={`${styles.dropdown} ms-auto`} title="Profile" id="basic-nav-dropdown">
            <NavDropdown.Item className='dropdownitem' href="#action/3.2">
              My Profile
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Edit Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
