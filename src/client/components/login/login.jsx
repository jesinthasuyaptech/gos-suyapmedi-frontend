import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Header from "../header";
import Footer from "../footer";
import logoWhite from "../../assets/images/logo-03.png";
import { DoctorBackground3 } from "../imagepath";
import { logo } from "../imagepath";
import { var_api } from "../../../constant";
import "../style/Loader.css";
import { Eye, EyeOff } from "lucide-react";

const LoginContainer = (props) => {
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const history = useHistory();

  useEffect(() => {
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

  const createRecord = async (data) => {
    setLoading(true);
    const url = `${var_api}user/tech`;
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
        localStorage.setItem("doc_hospital_id", result.user.hospital_id);
        localStorage.setItem("doc_token", result.user.token);
        localStorage.setItem("doctor_id", result.user.id);
        localStorage.setItem("doc_email_id", result.user.email_id);

        console.log(result);
        history.push("/doctor/doctor-dashboard");
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


    const handleHomeClick = (e) => {
    e.preventDefault();
    setLoading(true);

    // Optional: clear data or tokens
    // localStorage.clear(); sessionStorage.clear();

    setTimeout(() => {
      history.push("/");
    }, 1000); // simulate loader delay
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email_id.trim()) {
      setModalMessage("Please enter your email.");
      setShowModal(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id)) {
      setModalMessage("Please enter a valid email address.");
      setShowModal(true);
      return;
    }

    if (!password.trim()) {
      setModalMessage("Please enter your password.");
      setShowModal(true);
      return;
    }

    const recordData = {
      email_id,
      password,
    };
    createRecord(recordData);
  };

  return (
    <>
          <Header {...props} />

      <div
        className="content top-space"
        style={{
          //background: `url(${DoctorBackground3}) no-repeat center center fixed`,
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "rgb(255, 252, 252)",
          backgroundBlendMode: "darken",
        }}
      >
        {loading && (
          <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        )}
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="account-content text-center p-4 rounded shadow" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                <div className="login-header">
                  <img src={logo} alt="Logo" className="mb-3" style={{ width: "100px", maxWidth: "100%", marginBottom: "20px" }} />
                  <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>Doctor Login</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group form-focus">
                    <input
                      type="email"
                      className="form-control floating"
                      value={email_id}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      style={{ fontWeight: "bold" }}
                    />
                                            <label className="focus-label">Email</label>

                  </div>
                  <div className="form-group" style={{ position: "relative" }}>
      <input
        className="form-control"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: "#aaa",
        }}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </span>
    </div>
                  <button type="submit" className="btn btn-primary w-100 btn-lg" style={{ backgroundColor: "#0056b3", borderColor: "#004085", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", transition: "all 0.3s" }}>
                    Login
                  </button>
                  <div className="login-or">
                    <span className="or-line" />
                    <span className="span-or">or</span>
                  </div>
                  <div className="text-center dont-have">
                    <span className="highlight-text">
                      <strong>GO TO</strong>{" "}
                         <Link to="#" className="home-link" onClick={handleHomeClick}>
        <i className="fa fa-home"></i> HOME
      </Link>

      {loading && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
        </div>
      )}
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer {...props} />

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
