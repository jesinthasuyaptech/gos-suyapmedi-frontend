import React, { useRef, useState} from "react";
import { onelogo, oneslide } from "./img";
import { Link, useHistory } from "react-router-dom";
import OnboardingSidebar from "../doctoronboarding/onboardingsidebar";
import { header_logo } from "../../../../admin/components/imagepath";
import axios from "axios";
import { notification } from "antd";
import { var_api } from "../../../../constant";

const PatientEmailOtp = () => {
  const patientEmail = localStorage.getItem("changePassPatientemail");

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const history = useHistory();
  const [loading, setLoading] = useState(false);


  const handleChange = (input, index) => {
    const value = input.value.replace(/[^0-9]/g, "");
    if (!value) return;
  
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    if (index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Just clear current digit
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input
        inputRefs.current[index - 1].focus();
  
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };
  

  const handleSubmit = async () => {
    setLoading(true);
    const fullOtp = otp.join("");

    if (fullOtp.length < 6) {
       notification.error({
                  message: "OTP missing",
                  description: "Please enter all 6 digits",
                });
                setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${var_api}otp/check-for-password`, {
        email : patientEmail,
        otp: fullOtp,
      });

      if (response.data.opstatus) {
        notification.success({
          message: "success",
          description: response.data.message,
        });
        history.push("/pages/patient-password");
      } else {
        notification.error({
          message: "Error",
          description: response.data.message || "Failed to verify OTP",
        });
       
      }
    } catch (err) {
      console.log("err", err);
      notification.error({
        message: "Error",
        description: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="onboard-wrapper">
       { loading &&(
            <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        )
        }
      <div className="left-panel">
        <div className="onboarding-logo text-center">
          <Link to="/home-2">
            <img src={header_logo} className="img-fluid" alt="" />
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
                                          <h6>Confirm Email</h6>
                                          <p>confirm your email to receive OTP</p>
                                        </div>
                                      </Link>
                                    </li>
                                    <li>
                                      <Link to="#">
                                        <div className="onboarding-progress active">
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
                      <div className="onboarding-progress ">
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
                <div className="onboard-set">
                  <div className="onboarding-title">
                    <h2>Enter 6-digit code sent to your email.</h2>
                    <h6>We’ve sent it to {patientEmail}</h6>
                  </div>
                  <div className="onboarding-content passcode-wrap">
                  <div className="d-flex digit-group">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="form-control mx-1 text-center"
            style={{ width: "45px", fontSize: "24px" }}
          />
        ))}
      </div>
                  </div>
                  {/* <div className="opt-resend">
                    <Link to="#" className="text-danger">
                      Resend OTP
                    </Link>
                  </div> */}
                </div>
                <div className="onboarding-btn">
                  <Link 
                  to ="#"
                  onClick={handleSubmit}
                  // to="/pages/patient-phone"
                  >Verify OTP</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientEmailOtp;
