import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // UseNavigate for React Router v6
import { Modal, Button } from "react-bootstrap";
import { var_api } from "../../../constant";
import { header_logo2 } from "../imagepath";
import { FaHome,FaUserPlus } from "react-icons/fa";
import { useHistory } from "react-router-dom";
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
`;

const Loginpatient = () => {
  const [running_no, setrunning_no] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory(); // UseNavigate for React Router v6
  const [showPassword, setShowPassword] = useState(false);
  

  useEffect(() => {
    console.log("🔄 Loginpatient Component Mounted!");
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

  const createRecord = async (data) => {
    const url = `${var_api}user/patient`;
    setLoading(true);
    console.log("📡 Sending request to:", url, "with data:", data);
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      console.log("✅ API Response:", result);
  
      if (result.success) {
        localStorage.setItem("Patient_HospitalId", result.user.hospital_id);
        localStorage.setItem("patient_token", result.user.token);
        localStorage.setItem("user_id", result.user.id);
        localStorage.setItem("patient_id", result.user.id);
        localStorage.setItem("admin_name", result.user.name);
        localStorage.setItem("admin_role", result.user.roll);
        localStorage.setItem("admin_profile", result.user.profile_image);
        localStorage.setItem("patient_mobile_no", result.user.mobile_no);
        localStorage.setItem("patient_name", result.user.name);
        localStorage.setItem("patient_email", result.user.email);
        localStorage.setItem("is_private", result.user.is_private);
        localStorage.setItem("patient_token_no", result.user.patient_running_no);
        localStorage.setItem("dependant_id", result.user.id);
        localStorage.setItem("dependant_name", result.user.name);
        localStorage.setItem("dependant_profile", result.user.profile_image);
        localStorage.setItem("dependant_mobile_no", result.user.mobile_no);
        localStorage.setItem("dependant_email", result.user.email);
        localStorage.setItem("dependant_is_private", result.user.is_private);
        localStorage.setItem("dependant_token_no", result.user.patient_running_no);
        fetchSettingsList(result.user.hospital_id, result.user.token);

        console.log(localStorage.getItem("patient_id"));  
        // Redirect logic based on is_private value
        if (result.user.is_private === 1) {
          const patientEmail = localStorage.getItem("patient_email");
          console.log("🔀 Redirecting to Dashboard",patientEmail, result.user.email);
          
          history.push("/patient/dashboard"); // Redirect to Dashboard Page
          // window.location.href = "/patient/dashboard";
        } else {
          console.log("🔀 Redirecting to Hospital Page");
          history.push("/admin/hospitallist"); // Redirect to Hospital Page
        }
      } else {
        console.error("❌ Login Failed:", result.message);
        setModalMessage(result.message || "Invalid email or password. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("⚠️ API Error:", error);
      setModalMessage("An error occurred while processing your request. Please try again later.");
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
      console.log("lko", result);
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  
  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("📝 Form submitted with running_no:", running_no, "Password:", password);

    if (!running_no || !password) {
      console.warn("⚠️ Missing email or password");
      setModalMessage("Please enter your Patient ID and password.");
      setShowModal(true);
      return;
    }
    const recordData = { running_no: running_no, password };
    createRecord(recordData);
  };

  
 const handleLogout = (e) => {
  e.preventDefault();
  setLoading(true);

  // Clear storage
  localStorage.removeItem("token");
  sessionStorage.clear();

  // Redirect after showing loader
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
};


  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      history.push("/admin/registerpatient");
    }, 1000); // Delay for loader
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

      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <div className="login-wrapper" style={{marginTop:"80px"}}>
      <div className="login-right-wrap mx-auto p-4 shadow bg-white text-center rounded-4" style={{ maxWidth: "500px" }}>
      <img src={header_logo2} alt="Logo" className="img-fluid mx-auto d-block mb-3" style={{ maxWidth: "150px" }} />
  <h2 className="fw-bold">Patient Login</h2>
  <p className="account-subtitle">Access to our dashboard</p>

  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <input
        className="form-control"
        type="text"
        placeholder="Patient ID"
        value={running_no}
        onChange={(e) => setrunning_no(e.target.value)}
      />
      <div className="text-end mb-1">
    <Link to="/pages/email-otp" className="text-decoration-none"  style={{ fontSize: "13px" }}>
      Forgot PatientId?
    </Link>
  </div>
    </div>
    <div className="form-group" style={{ position: "relative" }}>
      {/* Input field */}
      <input
        className="form-control"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          paddingRight: "40px", // space for the eye icon
        }}
      />

      {/* Eye icon inside input (top-right corner) */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          top: "6px",         // adjust to push it near top
          right: "10px",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "#aaa",
        }}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      {/* Forgot Password link */}
      <div className="text-end mb-1">
        <Link
          to="/pages/patient-email"
          className="text-decoration-none"
          style={{ fontSize: "13px" }}
        >
          Forgot Password?
        </Link>
      </div>
    </div>
    <div className="form-group">
      <button className="btn btn-primary w-100" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
   
  </form>


          <div className="login-or">
            <span className="or-line" />
            <span className="span-or">or</span>
          </div>

          <div className="text-center dont-have">
            <span style={{fontWeight:"lighter"}}>Don't have an account? </span>{" "}
             <div>
     <span onClick={handleClick} className="home-link" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        Signup
      </span>
      {loading && <p>Loading...</p>}
    </div>
          </div>

          <div className="text-center dont-have">
            <span style={{fontWeight:"lighter"}}>Go to</span>{" "}
              {loading && (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    )}
            <Link 
      to="/" 
      className="home-link" 
      onClick={handleLogout}
    >
      HOME
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

export default Loginpatient;