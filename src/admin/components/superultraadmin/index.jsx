import React, { useState, useEffect, useContext } from "react";
import { logoWhite } from "../imagepath";
import { Link, useHistory } from "react-router-dom";
import { Modal, Button} from "react-bootstrap";
import { Appcontext } from "../../../approuter";
import { var_api } from "../../../constant";
import {headers} from "../ultraadminheader";


// Add loader CSS styles
const loaderStyles = `
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loader {
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const superultraAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const history = useHistory(); // React Router v5 navigation
  const [loading, setLoading] = useState(false); // Loader state
  const { isAuth, setIsAuth } = useContext(Appcontext);

  useEffect(() => {
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

  const createRecord = async (data) => {
    const url = `${var_api}superultraadmin/login`;
    setLoading(true);
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      console.log("Login API Response:", result);  // ✅ Log the full response
  
      if (!result.success) {
        console.error("Login failed:", result.error);
        setModalMessage(result.error || "Invalid email or password.");
        setShowModal(true);
        return;
      }
  
      if (!result.user?.token) {  // ✅ Correct key
        console.error("Backend did not return a token!");
        setModalMessage("Authentication failed: No token received.");
        setShowModal(true);
        return;
      }
      localStorage.setItem("ultratoken", result.user.token); // ✅ Store correct token
      console.log("Token stored successfully:", result.user.token);
      
  
      history.push("/admin/superultradashboard");
    } catch (error) {
      console.error("Error creating record:", error);
      setModalMessage("An error occurred. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setModalMessage("Please enter your email.");
      setShowModal(true);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setModalMessage("Please enter a valid email address.");
      setShowModal(true);
      return;
    }

    if (!password) {
      setModalMessage("Please enter your password.");
      setShowModal(true);
      return;
    }

    const recordData = {
      email: email,  
      password: password,
    };
    createRecord(recordData);
  };

  return (
    <div className="main-wrapper login-body">
      <style>
    {`
      .header {
        display: none !important;
      }
    `}
  </style>
       <style>{loaderStyles}</style>

        {/* Loading overlay */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

   {isAuth === "admin" && <headers />}
      <div className="login-wrapper">
        <div className="container">
          <div className="loginbox">
            <div className="login-left">
              <img className="img-fluid" src={logoWhite} alt="Logo" />
            </div>
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>Ultra Admin Login</h1>
                <p className="account-subtitle">Access to our dashboard</p>
                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary w-100" type="submit">
                    {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </div>
                </form>
                {/* /Form */}
                {/* <div className="text-center forgotpass">
                  <Link to="/admin/forgotpassword">Forgot Passwords?</Link>
                </div> */}
                {/* <div className="login-or">
                  <span className="or-line" />
                  <span className="span-or">or</span>
                </div> */}
                {/* Social Login */}
                {/* <div className="social-login">
                  <span>Login with</span>
                  <Link to="#" className="facebook">
                    <i className="fa fa-facebook" />
                  </Link>
                  <Link to="#" className="google">
                    <i className="fa fa-google" />
                  </Link>
                </div> */}
                {/* /Social Login */}
                {/* <div className="text-center dont-have">
                  Don’t have an account? <Link to="/admin/register">Register</Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for showing error messages */}
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
    </div>
  );
};

export default superultraAdmin;
