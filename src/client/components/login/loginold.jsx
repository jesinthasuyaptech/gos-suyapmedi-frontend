import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Header from "../header";
import Footer from "../footer";
import logoWhite from "../../assets/images/logo-03.png";
import DoctorBackground from "../imagepath";
import { var_api } from "../../../constant";
import "../style/Loader.css";

const LoginContainer = (props) => {
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory(); // React Router v5 navigation

  useEffect(() => {
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

  const createRecord = async (data) => {
    setLoading(true)
    const url = `${var_api}user/tech`; // Update with your backend URL
    try {
      const requestData = { ...data };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();
      setResponse(result);

      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem("hospital_id", result.user.hospital_id);
        localStorage.setItem("token", result.user.token);
        localStorage.setItem("doctor_id", result.user.id);
        localStorage.setItem("user_email", result.user.email_id);

        console.log(result);
        history.push("/doctor/doctor-dashboard"); // Navigate to dashboard
      } else {
        setModalMessage(result.message || "Invalid email or password. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error creating record:", error);
      setModalMessage("An error occurred while processing your request. Please try again later.");
      setShowModal(true);
    }
    setLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate email
    if (!email_id) {
      setModalMessage("Please enter your email.");
      setShowModal(true);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email_id)) {
      setModalMessage("Please enter a valid email address.");
      setShowModal(true);
      return;
    }

    // Validate password
    if (!password) {
      setModalMessage("Please enter your password.");
      setShowModal(true);
      return;
    }

    // Proceed with API call if validation passes
    const recordData = {
      email_id,
      password,
    };
    createRecord(recordData);
  };

  return (
    <>
      <Header {...props} />
      <div className="content top-space">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="account-content">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-7 col-lg-6 login-left">
                    <img className="img-fluid" src={logoWhite} alt="Logo" />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3>Doctor Login</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group form-focus">
                        <input
                          type="email"
                          className="form-control floating"
                          value={email_id}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="focus-label">Email</label>
                      </div>
                      <div className="form-group form-focus">
                        <input
                          type="password"
                          className="form-control floating"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="focus-label">Password</label>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg login-btn"
                      >
                        Login
                      </button>
                      <div className="login-or">
                        <span className="or-line" />
                        <span className="span-or">or</span>
                      </div>
                      <div className="text-center dont-have">
                        <span className="highlight-text">
                          <strong>GO TO</strong>{" "}
                          <Link to="/" className="home-link">
                            <i className="fa fa-home"></i> HOME
                          </Link>
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer {...props} />

      {/* Modal for showing messages */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginContainer;
