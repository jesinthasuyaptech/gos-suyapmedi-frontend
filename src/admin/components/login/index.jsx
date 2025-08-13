import React, { useState, useEffect,useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { var_api } from "../../../constant";
import { admin_login5 } from "../imagepath";
import { FaHome } from "react-icons/fa";
import { admin_logo } from "../imagepath";
import header_logo from "../../assets/img/header_logo.png";
import { Appcontext } from "../../../approuter";
import { notification } from "antd";
import { Eye, EyeOff } from "lucide-react";

const loaderStyles = `
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
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

  // .login-wrapper {
  //   background: url('${admin_login5}') no-repeat center center fixed;
  //   background-size: cover;
  //   width: 100%;
  //   height: 100vh;
  //   display: flex;
  //   align-items: center;
  //   justify-content: flex-start;
  //   padding-left: 5%;
  //   position: relative;
  // }

  // /* Transparent Background Overlay */
  // .login-wrapper::before {
  //   content: "";
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   background: rgba(255, 255, 255, 0.31);
  //   z-index: 1;
  // }
  .login-wrapper {
    //background: url('${admin_login5}') no-repeat center center fixed;
    background-size: cover;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Transparent Background Overlay */
  .login-wrapper::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.77);
    z-index: 1;
  }

  .login-right-wrap {
    position: relative;
    z-index: 2;
    background: rgba(255, 255, 255, 0.95);
    padding: 60px;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 500px;
    text-align: center;
  }
  
  .login-logo {
    width: 50%;
    max-width: 220px;
    display: block;
    margin: 0 auto 15px;
  }

  .login-right-wrap h1, .login-right-wrap p, .form-group input, .home-link {
    color: #333; /* Dark text for better readability */
  }

  .form-group input {
    background: #fff;
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 16px;
    color: #333;
  }

  .btn-primary {
    background-color: #007bff;
    border: none;
    font-size: 18px;
    font-weight: bold;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [homeLoading, setHomeLoading] = useState(false);
  const { isAuth, setIsAuth } = useContext(Appcontext);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

  const createRecord = async (data) => {
    const url = `${var_api}user/gos-login`;
    setLoading(true);
    console.log("url", url);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (res.status === 401) {
        setModalMessage("Unauthorized Access: Invalid email.");
        setShowModal(true);
        setLoading(false);
        return;
      }
  
      const result = await res.json();
  
      if (result.success) {
        const role = result.user?.roll;
  
        // if (role === "admin" || role === "superadmin" || role === "Employee") {
          // localStorage.setItem("hospital_id", 31); //domo
           localStorage.setItem("hospital_id", 18);
          localStorage.setItem("token", result.user.token);
          localStorage.setItem("user_id", result.user.id);
          localStorage.setItem("user_email", result.user.email);
          localStorage.setItem("admin_name", result.user.name);
          localStorage.setItem("admin_role", result.user.roll);
          localStorage.setItem("admin_profile", result.user.profile_image);
  
          setIsAuth("user");
  
          if (role === "Employee") {
            history.push("/admin/patientdetails");
          } else {
            history.push("/admin");
            fetchSettingsList(31, result.user.token);
            //  fetchSettingsList(18, result.user.token);
          }
        // } else {
        //   setModalMessage("Unauthorized Access: Your role does not have permission to log in.");
        //   setShowModal(true);
        // }
      } else {
        setModalMessage(result.message || "Invalid email or password.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setModalMessage("Something went wrong. Please try again later.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };
  
  


    // Fetch settings
const fetchSettingsList = async (id, token) => {
  setLoading(true);

  try {
    const response = await fetch(`${var_api}settings/getby-hospital/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.status === 401) {
      setLoading(false);
      // history.push("/login");
      return;
    }

    if (!response.ok) throw new Error("Failed to fetch data");
    
    const result = await response.json();
    // setSettings(result || []);

    // Store each key-value pair in localStorage
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value)); // Store as JSON string
      });
    }

    setLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
    setLoading(false);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();

  if (!email && !password) {
    setModalMessage("Please enter your email and password.");
    setShowModal(true);
    return;
  }

  if (!email) {
    setModalMessage("Please enter your email.");
    setShowModal(true);
    return;
  }

  if (!password) {
    setModalMessage("Please enter your password.");
    setShowModal(true);
    return;
  }

  const recordData = { email_id: email, password };
  createRecord(recordData);
};

const handleHomeClick = () => {
  setHomeLoading(true);
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
};


  return (
    <div className="main-wrapper login-body">
      <style>{loaderStyles}</style>
    
      {(loading || homeLoading) && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <div className="login-wrapper">
        <div className="login-right-wrap">
          <img src={header_logo} alt="Logo" className="login-logo"  style={{ width: "100px", height: "auto" }}  />
          <h2>Admin Login</h2>
          <p className="account-subtitle">Access to our dashboard</p>
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
            <div className="form-group">
              <button className="btn btn-primary w-100" type="submit">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="login-or">
            <span className="or-line" />
            <span className="span-or">or</span>
          </div>
          <div className="text-center dont-have">
            <strong>GO TO</strong>{" "}
            <Link to="#" className="home-link" onClick={handleHomeClick}>
              <FaHome /> HOME
            </Link>     
                  
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