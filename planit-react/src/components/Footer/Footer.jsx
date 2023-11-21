import styles from "./Footer.module.css";
import {
  faTwitter,
  faInstagram,
  faPinterestP,
  faYoutube,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className={styles.topMargin}>
      <footer
        className={`text-center text-lg-start text-muted ${styles.borderTop} ${styles.footer}`}
        id="footer"
      >
        <section className="">
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <i className="fas fa-gem me-3"></i>PostIT
                </h6>
                <p>
                  A Space to keep up with all your friends through social
                  gatherings and interactive... bla bla
                </p>
              </div>

              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Go to</h6>
                <p>
                  <Link to="/Home" className={styles.black}>
                    Feed
                  </Link>
                </p>
                <p>
                  <Link to="/About" className={styles.black}>
                    My Events
                  </Link>
                </p>
                <p>
                  <Link to="/event-creation" className={styles.black}>
                    Create Event
                  </Link>
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
                <p>
                  <Link to="About" className={styles.black}>
                    Community
                  </Link>
                </p>
                <p>
                  <Link to="/About" className={styles.black}>
                    Terms of agreement
                  </Link>
                </p>
                <p>
                  <Link to="/About" className={styles.black}>
                    How to use
                  </Link>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                <p>Rued Langgaards Vej 7</p>
                <p>Copenhagen, Denmark</p>
                <a href="" className="text-reset">
                  info@PlanIT.DK
                </a>
              </div>

              <div
                className={`follow col-md-3 col-lg-2 col-xl-2 mx-auto mb-4 ${styles.follow}`}
              >
                <h4>Follow us on</h4>
                <div className={styles.icon}>
                  <a href="https://www.facebook.com/" target="_blank">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                  <a href="https://www.twitter.com/" target="_blank">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href="https://www.instagram.com/" target="_blank">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="https://www.pinterest.com/" target="_blank">
                    <FontAwesomeIcon icon={faPinterestP} />
                  </a>
                  <a href="https://www.youtube.com/" target="_blank">
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center p-4">
          Technical interaction design project - Group PlanIT (Including
          external photo and video content)
        </div>
      </footer>
    </div>
  );
};

export default Footer;
