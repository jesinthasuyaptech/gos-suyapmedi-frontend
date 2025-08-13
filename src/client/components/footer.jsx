/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
// import logo from "../assets/images/logo.png";
import header_logo from "../../admin/assets/img/header_logo.png";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const Footer = (props) => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  const exclusionArray = [
    "/pages/doctor-grid",
    "/pages/doctor-list",
    "/pages/video-call",
    "/pages/voice-call",
    "/pages/chat-doctor",
    "/patient/doctor-list",
    "/patient/doctor-grid",
  ];
  if (exclusionArray.includes(props.location.pathname)) {
    return null;
  }

  return (
    <>
      {!props.location.pathname.includes("/index-6") &&
        !props.location.pathname.includes("/index-7") &&
        !props.location.pathname.includes("/index-8") && (
          <footer style={styles.footer}>
            <div style={styles.footerTop}>
              <div style={styles.container}>
                <div style={styles.row}>
                  
                  {/* Logo Section */}
                  <div style={styles.column}>
                    <div style={styles.footerWidget}>
                      <div style={styles.footerLogo}>
<img
  src={header_logo}
  alt="logo"
  style={{
    ...styles.footerLogoImg,
    width: "100px",     // reduce width more
    height: "auto",    // auto to maintain aspect ratio
  }}
/>
                      </div>
                    </div>
                  </div>

                  {/* Admin Section */}
                  <div style={styles.column}>
                    <div style={styles.footerWidget}>
                      <h2 style={styles.footerTitle}>For Admin</h2>
                      <ul style={styles.list}>
                        <li>
                          <a href="/admin/login" style={styles.link}>Login</a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Doctors Section */}
                  <div style={styles.column}>
                    <div style={styles.footerWidget}>
                      <h2 style={styles.footerTitle}>For Doctors</h2>
                      <ul style={styles.list}>
                        <li>
                          <Link to="/login" style={styles.link}>Login</Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div style={styles.contactColumn}>
                    <div style={styles.footerWidget}>
                      <h2 style={styles.footerTitle}>Contact Us</h2>
                      <div style={styles.footerContactInfo}>
                        <p style={styles.contactText}>
                          <FeatherIcon icon="map-pin" style={styles.icon} />  
                          3rd floor, Ram Arcade, West Thillai Nagar, 11th cross Bus stop near, Tiruchirapalli, Tamil Nadu 620017
                        </p>
                        <p style={styles.contactText}>
                          <FeatherIcon icon="phone-call" style={styles.icon} />  
                          +91 807 230 7889
                        </p>
                        <p style={styles.contactText}>
                          <FeatherIcon icon="mail" style={styles.icon} />  
                          info@suyaptech.com
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div style={styles.footerBottom}>
              <div style={styles.container}>
                <p style={styles.footerBottomText}>
                  Copyright © 2023 All Rights Reserved
                </p>
              </div>
            </div>
          </footer>
        )}
    </>
  );
};

// Inline CSS Styles
const styles = {
  footer: {
    background: "#f8f9fa",
    padding: "40px 0",
  },
  footerTop: {
    textAlign: "left",
  },
  container: {
    maxWidth: "1140px",
    margin: "0 auto",
  },
  row: {
    display: "flex",
    justifyContent: "left",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  column: {
    width: "20%",
    minWidth: "150px",
    textAlign: "left",
    padding: "10px",
  },
  contactColumn: {
    width: "40%",
    minWidth: "200px",
    textAlign: "left",
    padding: "10px",
  },
  footerWidget: {
    textAlign: "left",
  },
  footerLogoImg: {
    maxWidth: "150px",
    display: "block",
    margin: "0 auto 10px",
  },
  footerTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "black",
  },
  list: {
    listStyle: "none",
    padding: "0",
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
  footerContactInfo: {
    textAlign: "left",
  },
  contactText: {
    display: "flex",
    alignItems: "left",
    justifyContent: "left",
    gap: "8px",
    marginBottom: "8px",
    fontSize: "14px",
    color: "black",
  },
  icon: {
    color: "black",
  },
  footerBottom: {
    textAlign: "center",
    padding: "15px 0",
    background: "#e9ecef",
  },
  footerBottomText: {
    margin: "0",
    fontSize: "14px",
    color: "black",
  },
};

export default Footer;
