import React, { useState, useEffect } from "react";
import { logoWhite } from "../imagepath";
import { Link, useHistory } from "react-router-dom";
import { Modal, Button} from "react-bootstrap";
import { var_api } from "../../../constant";
import { FaHome } from "react-icons/fa";
// import "../style/Loader.css";


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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const history = useHistory(); // React Router v5 navigation
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

  const createRecord = async (data) => {
    const url = `${var_api}user/nontech`; // Update with your backend URL
    setLoading(true); // Start loader
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setResponse(result);

      if (result.success) {
        // Store the user data in localStorage after successful login
        localStorage.setItem("hospital_id", result.user.hospital_id);
        localStorage.setItem("token", result.user.token);
        localStorage.setItem("user_id", result.user.id);
        localStorage.setItem("user_email", result.user.email);
        localStorage.setItem("admin_name", result.user.name);
        localStorage.setItem("admin_role", result.user.roll);
        localStorage.setItem("admin_profile", result.user.profile_image);

        console.log(result);
        console.log("admin_role");
        console.log(result.user.roll);
        if (result.user?.roll === "Employee") {
          // localStorage.setItem("admin_role", result.user.roll);
          history.push("/admin/patientdetails");
        } else {
          // localStorage.setItem("admin_role", result.user?.roll || "Guest");
          history.push("/admin");
        }
      } else {
        setModalMessage(result.message || "Invalid email or password. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error creating record:", error);
      setModalMessage("An error occurred while processing your request. Please try again later.");
      setShowModal(true);
    } finally {
      setLoading(false); // Stop loader
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
      email_id:email,
      password,
    };
    createRecord(recordData);
  };

  return (
    <div className="main-wrapper login-body">
       <style>{loaderStyles}</style>

        {/* Loading overlay */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      
      <div className="login-wrapper">
        <div className="container">
          <div className="loginbox">
            <div className="login-left">
              <img className="img-fluid" src={logoWhite} alt="Logo" />
            </div>
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>Login</h1>
                <p className="account-subtitle">Access to our dashboard1</p>
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
                    <div className="login-or">
                                          <span className="or-line" />
                                          <span className="span-or">or</span>
                                        </div>
                                        <div className="text-center dont-have">
                                          <span className="highlight-text">
                                            <strong>GO TO</strong>{" "}
                                            <Link to="/" className="home-link" 
                                            onClick={() => setTimeout(() => window.location.reload(), 100)
                                            }>
                                           <FaHome /> HOME
                                           </Link>
                                          </span>
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

export default Login;
