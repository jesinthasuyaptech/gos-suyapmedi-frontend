import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "../../header";
import DoctorSidebar from "../sidebar/index";
import DoctorFooter from "../../common/doctorFooter";
import { var_api, image_api } from "../../../../constant";
import axios from "axios";
import "../../style/Loader.css";

const Password = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const doc_id = localStorage.getItem("doctor_id");
  const token = localStorage.getItem("doc_token");
  const history = useHistory();
  
  const [profileDetails, setProfileDetails] = useState(null);


  const fetchDoctorDetails = async () => {
    const token = localStorage.getItem("doc_token");
    const doc_id = localStorage.getItem("doctor_id");
    try {
      setLoading(true);
      const response = await axios.get(`${var_api}technicalstaff/get/${doc_id}`, {
        headers: {
          Authorization: token,
        },
      });
      setProfileDetails(response.data);
      localStorage.setItem("doctor_name", response.data?.name);
      localStorage.setItem("doctor_profile", response.data?.profile_image);
      localStorage.setItem("doctor_available", response.data?.is_available);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching doctor details:", err);
    }
    finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate passwords
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New Password and Confirm Password do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${var_api}technicalstaff/change-password/${doc_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password.");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header profileDetails={profileDetails} />
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Change Password</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Change Password
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              <DoctorSidebar
              profileDetails={profileDetails}
              setProfileDetails={setProfileDetails} 
              />
            </div>
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Change Password</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card pass-card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block input-block-new">
                          <label className="form-label">Old Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                        </div>
                        <div className="input-block input-block-new">
                          <label className="form-label">New Password</label>
                          <div className="pass-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control pass-input"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span
                              className={`feather-eye${showPassword ? "" : "-off"} toggle-password`}
                              onClick={togglePasswordVisibility}
                            />
                          </div>
                        </div>
                        <div className="input-block input-block-new mb-0">
                          <label className="form-label">Confirm Password</label>
                          <div className="pass-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="form-control pass-input-sub"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                              className={`feather-eye${showConfirmPassword ? "" : "-off"} toggle-password`}
                              onClick={toggleConfirmPasswordVisibility}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}
                <div className="form-set-button">
                  {/* <button className="btn btn-light" type="button" onClick={() => history.goBack()}>
                    Cancel
                  </button> */}
                  <button
    className="btn btn-light"
    type="button"
    onClick={() => {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      setSuccessMessage("");
    }}
  >
    Cancel
  </button>
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <DoctorFooter />
    </div>
  );
};

export default Password;
