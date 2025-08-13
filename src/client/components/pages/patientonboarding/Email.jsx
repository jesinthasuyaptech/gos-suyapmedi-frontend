import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// import Header from "../../header";
// import Footer from "../../footer";
import { onelogo, oneslide } from "./img";
import OnboardingSidebar from "../doctoronboarding/onboardingsidebar";
import { header_logo } from "../../../../admin/components/imagepath";
import axios from "axios";
import { var_api } from "../../../../constant";
import { notification } from "antd";

const OnboardingEmail = () => {
  const [email, setEmail] = useState("");
  const [input, setInput] = useState("");
  const [lable, setlable] = useState("");
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handletinput = () => setInput(!input);

  const handlelable = () => {
    setlable(!lable);
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

   const handleGoToBack = () => {
    setLoading(true);
    // Simulate a delay before navigation (optional, if you want loader to be visible)
    setTimeout(() => {
      history.push("/patient/patientlogin");
    }, 1000);
  };

  const handleSubmit = async () => {
   
    if (!email) {
      notification.error({
            message: "Patient Id is required",
            description: "Please enter Patient Id.",
          });
      return;
    }

     setLoading(true);

    // if (!validateEmail(email)) {
    //   notification.error({
    //     message: "Valid Email",
    //     description: "Please enter a valid email address",
    //   });
    
    //   return;
    // }

    try {
      const response = await axios.post(`${var_api}otp/send-patientid`, {
        patientid: email,
        otp_type: 5,
      });

      if (response.status === 200) {
        notification.success({
          message: "OTP Sent",
          description: "OTP sent to your email",
        });
        history.push("/pages/patient-email-otp");
        const patientId = response.data.patientid;
        const patientemail = response.data.email;
        console.log("pa-id",patientId, response);
        localStorage.setItem("changePassPatientId", patientId)
        localStorage.setItem("changePassPatientemail", patientemail)
        
      }
    } catch (error) {
       setLoading(false);
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally{
      setLoading(false);
    }
  };

  return (
    <>
      <div className="onboard-wrapper">
        { loading &&(
            <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        )
        }
        <div className="left-panel">
          <div className="onboarding-logo text-center">
            <Link to= '#'>
           <img 
  src={header_logo} 
  className="img-fluid"
  alt="" 
  style={{
    width: "200px",           // Make sure width & height are equal
    height: "200px",
    borderRadius: "50%",     // Makes it a circle
    backgroundColor: "white",// White background
    padding: "5px",          // Optional: Adds spacing inside the white background
    boxShadow: "0 0 5px rgba(0,0,0,0.1)" // Optional: soft shadow
  }} 
/>

            </Link>
          </div>
          <div className="onboard-img">
            <img src={oneslide} className="img-fluid" alt="" />
          </div>
          <OnboardingSidebar></OnboardingSidebar>
        </div>
        <div className="right-panel">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 p-0">
                <div className="right-panel-title text-center">
                  <Link to="/home-2">
                    {" "}
                    <img src={onelogo} alt="" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="on-board-wizard">
                  <ul>

                     <li>
                                        <Link to="#">
                                          <div className="onboarding-progress active">
                                            <span>1</span>
                                          </div>
                                          <div className="onboarding-list">
                                            <h6>Enter PatientId</h6>
                                            <p>Enter your patient Id to receive OTP</p>
                                          </div>
                                        </Link>
                                      </li>
                                      <li>
                                        <Link to="#">
                                          <div className="onboarding-progress">
                                            <span>2</span>
                                          </div>
                                          <div className="onboarding-list">
                                            <h6>OTP Verification</h6>
                                            <p>Enter OTP to verify your email</p>
                                          </div>
                                        </Link>
                                      </li>
                                      <li>
                                        <Link to="#">
                                          <div className="onboarding-progress">
                                            <span>3</span>
                                          </div>
                                          <div className="onboarding-list">
                                            <h6>Change Password</h6>
                                            <p>Enter new password to update your account</p>
                                          </div>
                                        </Link>
                                      </li>
                    {/* <li>
                      <Link to="/pages/patient-email">
                        <div className="onboarding-progress active">
                          <span>1</span>
                        </div>
                        <div className="onboarding-list">
                          <h6>Registration</h6>
                          <p>Enter Details for Register </p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pages/patient-personalize">
                        <div className="onboarding-progress">
                          <span>2</span>
                        </div>
                        <div className="onboarding-list">
                          <h6>Profile Picture</h6>
                          <p>Upload Profile picture</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pages/patient-details">
                        <div className="onboarding-progress">
                          <span>3</span>
                        </div>
                        <div className="onboarding-list">
                          <h6>Personal Details</h6>
                          <p>Enter your Personal Details</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pages/patient-family-details">
                        <div className="onboarding-progress">
                          <span>4</span>
                        </div>
                        <div className="onboarding-list">
                          <h6>Select Members</h6>
                          <p>Enter Details for Register </p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pages/patient-dependant-details">
                        <div className="onboarding-progress">
                          <span>5</span>
                        </div>
                        <div className="onboarding-list">
                          <h6>Dependant details</h6>
                          <p>Dependants Profile</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pages/patient-other-details">
                        <div className="onboarding-progress">
                          <span>6</span>
                        </div>
                        <div className="onboarding-list">
                          <h6>Other Detail</h6>
                          <p>More information</p>
                        </div>
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="col-lg-8 col-md-12">
                <div className="onboarding-content-box content-wrap">
                  <div className="onborad-set">
                    <div className="onboarding-title">
                      <h2>
                        Enter your Patient Id!<span>*</span>
                      </h2>
                      <h6>
                        We will only use it to advise you for any important
                        changes.
                      </h6>
                    </div>
                    <div className="onboarding-content">
                      <div className="row">
                        {/* <div className="col-lg-12">
                          <div className="form-group">
                            <div
                              onClick={handlelable}
                              className={` input-placeholder form-focus passcode-wrap mail-box ${
                                lable
                                  ? "input-placeholder form-focus passcode-wrap mail-box focused"
                                  : ""
                              }`}
                            >
                              <label className="focus-label">
                                Legal name<span>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control floating"
                                required=""
                              />
                            </div>
                          </div>
                        </div> */}
                        <div className="col-lg-12">
                          <div className="form-group">
                            <div
                              onClick={handletinput}
                              className={` input-placeholder form-focus passcode-wrap mail-box  ${
                                input ? "focused" : ""
                              }`}
                            >
                              <label className="focus-label">
                                patient Id<span>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control floating"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="onboarding-btn">

  {!loading && (
        <Link
          to="#"
          onClick={handleGoToBack}
          style={{
            backgroundColor: "grey",
            color: "white",
            borderRadius: "4px",
            border: "1px solid grey",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <i className="fa fa-angle-left" /> Back
        </Link>
      )}

                    <Link to="#" onClick={handleSubmit} style={{marginLeft: "5px"}}>Continue</Link>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingEmail;
