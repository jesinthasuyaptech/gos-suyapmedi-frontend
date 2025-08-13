/* eslint-disable react/no-unescaped-entities */
import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory} from "react-router-dom";
// import Header from "../../header";
import { emailicon, shape01, shape02 } from "./img";
import AuthenticationHeader from "../../authiticationHeader";
import { logo } from "../../imagepath";
import axios from 'axios';
import { notification, Modal, Button } from "antd";
import { var_api } from "../../../../constant";
import { FaHome, FaUserPlus, FaRegCopy } from "react-icons/fa";

const EmailOtp = () => {
  const patientEmail = localStorage.getItem('registeredPatEmail');
  const patientName = localStorage.getItem('registeredPatName');
  const patientMobile = localStorage.getItem('registeredPatMobile');
  const patientGender = localStorage.getItem('registeredPatGender');
  const patientPassword = localStorage.getItem('registeredPatPassword');
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [runningNumber, setRunningNumber] = useState("");
  const history = useHistory();

    // Auto focus on first box
    useEffect(() => {
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }, []);
  
    const handleChange = (index, e) => {
      const value = e.target.value;
      if (/^\d$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (index < 5) inputRefs.current[index + 1]?.focus();
      }
    };
  
    const handleKeyDown = (index, e) => {
      if (e.key === 'Backspace') {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        if (index > 0) inputRefs.current[index - 1]?.focus();
      }
    };
  
    const clearOtp = () => {
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    };
  
    const handleVerify = async (e) => {
      e.preventDefault();
      setLoading(true);
      const enteredOtp = otp.join("");
      if (enteredOtp.length < 6) {
        notification.warning({
          message: "Required",
          description: "Enter full 6-digit OTP",
        });
        setLoading(false);
        return;
      }
  
      try {
        const res = await axios.post(`${var_api}otp/check-for-email`, {
          email: patientEmail,
          otp: enteredOtp,
        });
  
        if (res.data.opstatus) {
          console.log("status", res.data.opstatus)
          notification.success({
            message: "Success",
            description: "OTP Verified!",
          });
          


           try {
      const response = await axios.post(
        `${var_api}patientdetails/public-registration`,
        {
          name: patientName,
          email_id: patientEmail,
          mobile_no: patientMobile,
          gender: patientGender,
          password: patientPassword, // Sending only `password`, not `confirmPassword`
        }
      );
  
      notification.success({
        message: "Success",
        description: "Patient Created Successfully.",
      });
  
  
      console.log("API Response:", response.data);
      setRegisteredData(response.data);
      setRunningNumber(response.data.running_no); 
      setIsModalVisible(true); // Show modal after success

      // Redirect to patient login page after successful registration
      // history.push("/admin/patientLogin"); // Use history.push instead of navigate()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        notification.error({
          message: "Error",
          description: error.response.data.error,
        });
      } else {
        console.error("API Error:", error);
        notification.error({
          message: "Error",
          description: "Failed to register. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
        

        } else {
          console.log("res.data.message", res.data.message);
            notification.error({
                  message: "Error",
                  description: res.data.message || "Verification failed",
                });
          // toast.error(res.data.message || "Verification failed");
          // clearOtp();
        }
      } catch (err) {
        console.log("error", err)
          notification.error({
                message: "Error",
                description: err.response?.data?.message || "Error verifying OTP",
              });
        // toast.error(err.response?.data?.message || "Error verifying OTP");
        // clearOtp();
      } finally{
        setLoading(false);
      }
    };


    const handleOk = () => {
      setIsModalVisible(false);
      // createRecord();
      
      // Simulate an event with an empty object
      handleSubmitlogin();   
    };
  
    const handleSubmitlogin = () => {
    
      console.log("📝 Form submitted with running_no:", runningNumber, "Password:", patientPassword);
  
      if (!runningNumber || !patientPassword) {
        console.warn("⚠️ Missing email or password");
        // setModalMessage("Please enter your email and password.");
        // setShowModal(true);
        return;
      }
      const recordData = { running_no: runningNumber, password:patientPassword};
      createRecord(recordData);
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
                history.push("/patient/dashboard"); // Redirect to Dashboard Page
                // window.location.href = "/patient/dashboard";
              } else {
                console.log("🔀 Redirecting to Hospital Page");
                history.push("/admin/hospitallist"); // Redirect to Hospital Page
              }
            } else {
              console.error("❌ Login Failed:", result.message);
              // setModalMessage(result.message || "Invalid email or password. Please try again.");
              // setShowModal(true);
            }
          } catch (error) {
            console.error("⚠️ API Error:", error);
            // setModalMessage("An error occurred while processing your request. Please try again later.");
            // setShowModal(true);
            // handleSubmitlogin();
            notification.error({
              message: "Error",
              description: "An error occurred during login. Please try again.",
            });
          } finally {
            setLoading(false);
          }
        };

        

  //using for copy the patient id
  const handleCopy = () => {
    navigator.clipboard.writeText(registeredData?.running_no);
    notification.success({ message: "Copied!", description: "Patient ID copied to clipboard." });
  };



  return (
    <>
      {/* <Header {...props} /> */}
      {/* <AuthenticationHeader /> */}
      <>
        {/* Page Content */}
        <div className="login-content-info">
        { loading && (
            <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        )}
          <div className="container">
            {/* Login Email Otp */}
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6">
                <div className="account-content"
                 style={{
                  border: '1px solid #e0e0e0',
                  padding: '30px',
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
                }}
                >
                  <div className="login-shapes">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px' }}>
                      <img src={logo} alt="" />
                    </div>
                    {/* <div className="shape-img-right">
                      <img src={logo} alt="" />
                    </div> */}
                  </div>
                  <div className="account-info">
                    {/* <div className="login-back">
                      <Link to="/pages/email-otp">
                        <i className="fa-solid fa-arrow-left-long" /> Back
                      </Link>
                    </div> */}
                    {/* <div className="login-verify-img">
                      <img src={emailicon} alt="" />
                    </div> */}
                    <div className="login-title" style={{ textAlign: 'center', marginTop: '20px' }}>
                      <h3>Email OTP Verification</h3>
                      <p className="mb-0">
                        OTP sent to your Email {" "}
                        <strong>{patientEmail}</strong>
                      </p>
                    </div>
                    <form
                      method="get"
                      className="digit-group login-form-control"
                      data-group-name="digits"
                      data-autosubmit="false"
                      autoComplete="off"
                      // action="/doctor/doctor-dashboard"
                    >
                      <div className="otp-box">
                        <div className="form-group" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        {[1, 2, 3, 4, 5, 6].map((digit, index) => (
          <input
          key={index}
            type="text"
            id={`digit-${digit}`}
            name={`digit-${digit}`}
            maxLength={1}
            style={{
              width: '50px',
              height: '50px',
              fontSize: '20px',
              textAlign: 'center',
              margin: '0 5px',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
                        </div>
                      </div>
                      {/* <div className="form-group">
                        <div className="otp-info">
                          <div className="otp-code">
                            <p>Didn't receive OTP code?</p>
                            <Link to="#">Resend Code</Link>
                          </div>
                          <div className="otp-sec">
                            <p>
                              <i className="feather-clock" /> 00:25 secs
                            </p>
                          </div>
                        </div>
                      </div> */}
                      <div className="reset-btn">
                        <button className="btn btn-block" onClick={handleVerify}>
                        Verify OTP
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* /Login Email Otp */}
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
  <p>The Patient ID has been sent to the email <b style={{fontSize:"18px"}}>{patientEmail}</b></p>
 </div>
</Modal>

        </div>
        {/* /Page Content */}
      </>
    </>
  );
};

export default EmailOtp;
