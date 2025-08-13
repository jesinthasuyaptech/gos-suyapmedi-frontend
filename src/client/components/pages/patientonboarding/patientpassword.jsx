import React, { useState } from "react";
import { Link, useHistory} from "react-router-dom";
// import ReactFlagsSelect from "react-flags-select";
// import FeatherIcon from "feather-icons-react";
import { onelogo, oneslide, success_tick } from "./img";
import OnboardingSidebar from "../doctoronboarding/onboardingsidebar";
import { header_logo } from "../../../../admin/components/imagepath";
import { var_api } from "../../../../constant";
import axios from "axios";
import { notification } from "antd";

const patientpassword = () => {
  const [input, setInput] = useState({
    password: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    password: '',
    confirm: '',
  });
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  

  const handleinput = (value) => {
    if (value === "password") setInput({ ...input, password: !input.password });
    else setInput({ ...input, confirm: !input.confirm });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const id = localStorage.getItem("changePassPatientId")
    if (!formData.password || !formData.confirm) {
      notification.error({
              message: "Error",
              description: "Both fields are required",
            });
    
      setLoading(false);
      return;
    }
  
    if (formData.password !== formData.confirm) {
      notification.error({
        message: "Error",
        description: "Passwords do not match",
      });
      
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.put(
        `${var_api}patientdetails/change-forgotpassword/${id}`,
        { new_password: formData.password }
      );
      notification.success({
        message: "Success",
        description: response.data.message,
      });
      // window.location.href = "/admin/patientlogin";
     history.push("/patient/patientlogin");
     localStorage.removeItem("changePassPatientId")
     localStorage.removeItem("changePassPatientemail")
      // Redirect or clear form as needed
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Error",
        description: err.response?.data?.error || "Failed to update password",
      });
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="onboard-wrapper">
      <div className="left-panel">
        <div className="onboarding-logo text-center">
          <Link to="/home-2">
            <img src={header_logo} className="img-fluid" alt="" style={{borderRadius:"70px"}}/>
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
            <div className="col-lg-4">
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
                      <div className="onboarding-progress active">
                        <span>3</span>
                      </div>
                      <div className="onboarding-list">
                        <h6>Change Password</h6>
                        <p>Enter new password to update your account</p>
                      </div>
                    </Link>
                  </li>
                  {/* 
                   <li>
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
                    <Link to="/pages/patient-Personalize">
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
            <div className="col-lg-8">
              <div className="onboarding-content-box content-wrap">
                <div className="onboard-set">
                  <div className="onboarding-title pass-title">
                    <h2>Create a new password on your SuyapMedi account</h2>
                  </div>
                  <div className="onboarding-content">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group pass-group">
                          <div
                            onClick={() => handleinput("password")}
                            className={` input-placeholder form-focus passcode-wrap mail-box ${
                              input.password
                                ? "input-placeholder form-focus passcode-wrap mail-box focused"
                                : ""
                            }`}
                          >
                            {/* <div className="input-placeholder form-focus passcode-wrap mail-box"> */}
                            <label className="focus-label">
                              Enter New Password<span>*</span>
                            </label>
                            <input
                              type="password"
                              className="form-control floating pass-icon"
                              required
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <div
                            onClick={() => handleinput("confirm")}
                            className={` input-placeholder form-focus passcode-wrap mail-box ${
                              input.confirm
                                ? "input-placeholder form-focus passcode-wrap mail-box focused"
                                : ""
                            }`}
                          >
                            <label className="focus-label">
                              Enter Confirm Password<span>*</span>
                            </label>
                            <input
                              type="password"
                              className="form-control floating pass-icon-1"
                              required
                              value={formData.confirm}
                              onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="onboarding-btn">
                  <Link
                    to="#"
                    onClick={handleSubmit}
                    // data-bs-toggle="modal"
                    // data-bs-target="#patient-verified"
                  >
                    Continue
                  </Link>
                </div>
              </div>
              {/* Modal */}
              <div
                className="modal fade fade-custom"
                id="patient-verified"
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="modal-dialog id-upload modal-dialog-centered">
                  <div className="modal-content id-pop-content">
                    <div className="modal-header id-pop-header justify-content-center">
                      <img src={success_tick} alt="" />
                    </div>
                    <div className="modal-body id-pop-body text-center">
                      <h2>Your account has been Created</h2>
                      <p>Please enter other Details to complete your Profile</p>
                    </div>
                    <div className="modal-footer id-pop-footer text-center">
                      <div
                        className="onboarding-btn pop-btn "
                        onClick={() => window.location.reload()}
                      >
                        <Link to="/pages/patient-personalize">Continue</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default patientpassword;
