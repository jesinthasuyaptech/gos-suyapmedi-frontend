
//import { logoWhite } from "../imagepath";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { notification, Modal, Button } from "antd";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom"; // Import useNavigate
import { admin_logo } from "../imagepath";
import { FaHome, FaUserPlus, FaRegCopy } from "react-icons/fa";


const registerpatient = (props) => {
  const history = useHistory();
    const [loading,setLoading] = useState();
    const [runningNumber, setRunningNumber] = useState("");
    const [password, setPassword] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
 

  // const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [registeredData, setRegisteredData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  useEffect(() => {
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

    const handleHomeClick = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 500); // Short delay to ensure loader appears
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    // Validate if passwords match (only in UI)
    if (formData.password !== formData.confirmPassword) {
      notification.error({
        message: "Error",
        description: "Passwords do not match!",
      });
      return;
    }

    localStorage.setItem("registeredPatName",formData.name);
    localStorage.setItem("registeredPatEmail",formData.email);
    localStorage.setItem("registeredPatMobile",formData.mobile);
    localStorage.setItem("registeredPatGender",formData.gender);
    localStorage.setItem("registeredPatPassword",formData.password);

    try {
          const response = await axios.post(`${var_api}otp/send-email`, {
            email: formData.email,
            otp_type: 0,
          });
    
          if (response.status === 200) {
            notification.success({
              message: "OTP Sent",
              description: "OTP sent to your email",
            });
            window.location.href = "/pages/eotp"
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.response?.data?.message || "Something went wrong",
          });
        } finally{
          setLoading(false);
        }
    // window.location.href = "/pages/onboarding-email";
    
    // history.push("/pages/onboarding-email");
    // setLoading(true);
    // try {
    //   const response = await axios.post(
    //     `${var_api}patientdetails/public-registration`,
    //     {
    //       name: formData.name,
    //       email_id: formData.email,
    //       mobile_no: formData.mobile,
    //       gender: formData.gender,
    //       password: formData.password, // Sending only `password`, not `confirmPassword`
    //     }
    //   );
  
    //   notification.success({
    //     message: "Success",
    //     description: "Patient Created Successfully.",
    //   });
  
    
  
    //   console.log("API Response:", response.data);
    //   setRegisteredData(response.data);
    //   setRunningNumber(response.data.running_no); 
    //   setIsModalVisible(true); // Show modal after success

    //   // Redirect to patient login page after successful registration
    //   // history.push("/admin/patientLogin"); // Use history.push instead of navigate()
    // } catch (error) {
    //   if (error.response && error.response.data && error.response.data.error) {
    //     notification.error({
    //       message: "Error",
    //       description: error.response.data.error,
    //     });
    //   } else {
    //     console.error("API Error:", error);
    //     notification.error({
    //       message: "Error",
    //       description: "Failed to register. Please try again.",
    //     });
    //   }
    // } finally {
    //   setLoading(false);
    // }
    
  };


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
  
          console.log(localStorage.getItem("patient_id"));  
          // Redirect logic based on is_private value
          if (result.user.is_private === 1) {
            console.log("🔀 Redirecting to Dashboard");
            //history.push("/patient/dashboard"); // Redirect to Dashboard Page
            window.location.href = "/patient/dashboard";
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
        handleSubmitlogin();
      } finally {
        setLoading(false);
      }
    };

      const handleLoginClick = (e) => {
    e.preventDefault(); // prevent immediate navigation
    setLoading(true); // show loader

    // simulate a short delay (e.g., for animation or processing)
    setTimeout(() => {
      window.location.href = "/patient/patientlogin";
    }, 1000); // 1 second delay
  };

    const handleSubmitlogin = (event) => {
      event.preventDefault();
      console.log("📝 Form submitted with running_no:", runningNumber, "Password:", formData.password);
  
      if (!runningNumber || !formData.password) {
        console.warn("⚠️ Missing email or password");
        setModalMessage("Please enter your email and password.");
        setShowModal(true);
        return;
      }
      const recordData = { running_no: runningNumber, password:formData.password};
      createRecord(recordData);
    };


  //using for copy the patient id
  const handleCopy = () => {
    navigator.clipboard.writeText(registeredData?.running_no);
    notification.success({ message: "Copied!", description: "Patient ID copied to clipboard." });
  };


  //clost the modal and navigate to login page
  const handleOk = () => {
    setIsModalVisible(false);
    createRecord();
    
    // Simulate an event with an empty object
    handleSubmitlogin({ preventDefault: () => {} });
  
    setFormData({
      name: "",
      email: "",
      mobile: "",
      gender: "",
      password: "",
      confirmPassword: "",
    });
  };
  


  return (
    <div className="main-wrapper login-body">
      <div className="login-wrapper">
      <style>
    {`
      .header {
        display: none !important;
      }
    `}
  </style>
  {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
<div className="container">
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="w-100" style={{ maxWidth: "600px" }}>
      <div className="card shadow-lg p-3">
        <div className="text-center">
          <img
            src={admin_logo}
            alt="Logo"
            className="img-fluid mx-auto d-block mb-2"
            style={{ maxWidth: "150px" }}
          />
          <h2 className="mb-2" style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
           Public Patient Register
          </h2>
          <p className="text-muted" style={{ fontSize: "1rem" }}>
            Access to our dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
  <div className="row g-2">
    <div className="col-md-6">
      <label className="form-label">
        Name <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        className="form-control form-control-sm"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Mobile Number <span className="text-danger">*</span>
      </label>
      <input
        type="tel"
        name="mobile"
        value={formData.mobile}
        onChange={handleInputChange}
        className="form-control form-control-sm"
        pattern="[0-9]{10}"
        title="Enter a valid 10-digit mobile number"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Email <span className="text-danger">*</span>
      </label>
      <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  className="form-control form-control-sm"
  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
  title="Enter a valid email address"
  required

/>
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Gender <span className="text-danger">*</span>
      </label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        className="form-select form-select-sm"
        required
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Create Password <span className="text-danger">*</span>
      </label>
      <input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleInputChange}
  className="form-control form-control-sm"
  pattern=".{6,}"
  title="Password must be at least 6 characters long"
  required
/>
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Confirm Password <span className="text-danger">*</span>
      </label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className="form-control form-control-sm"
        required
      />
     {formData.confirmPassword && formData.password !== formData.confirmPassword && (
  <small className="text-danger">Passwords do not match</small>
)}
    
    </div>

    <div className="col-12 mt-2">
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary w-100" type="submit">
          Signup
        </button>
      </div>
    </div>
  </div>
</form>


        <div className="text-center mt-3">
          <p className="mb-1">
            Already have an account?   <div>
      <a href="/patient/patientlogin" onClick={handleLoginClick}>Login</a>
      {loading && <p>Loading...</p>}
    </div>
          </p>
          <p className="mb-0">
            <strong>GO TO</strong>
   <button 
        onClick={handleHomeClick} 
        className="btn btn-link text-decoration-none text-dark"
        disabled={loading} // Disable button while loading
      >
        <FaHome /> HOME
      </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>

      <Modal
  title={
    <div style={{ textAlign: "center", width: "100%", fontWeight: "bold", fontSize:"20px" }}>
    Login Credential
  </div>
  }
  visible={isModalVisible}
  onCancel={handleOk}
  footer={[
    <div style={{ textAlign: "center", width: "100%" }}>
      <Button key="ok" type="primary" onClick={handleOk} style={{ width: "100px" }}>
        OK
      </Button>
    </div>
  ]}
>
 <div style={{padding:"20px"}}>
 <p>
    Patient ID: <b style={{fontSize:"18px"}}>{registeredData?.running_no}</b>
    <span onClick={handleCopy} style={{ cursor: "pointer", marginLeft: "10px", color: "#1890ff" }}>
      <FaRegCopy style={{ fontSize: "17px" }} />
    </span>
  </p>
  <p>The Patient ID has been sent to the email <b style={{fontSize:"18px"}}>{formData?.email}</b></p>
 </div>
</Modal>

    </div>
  );
};


export default registerpatient;
