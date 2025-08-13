import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// import DoctorSidebar from "../sidebar/index";
// import DoctorFooter from "../../common/doctorFooter";
import { var_api, image_api } from "../../../../../constant.js";
import axios from "axios";
import DashboardSidebar from "../sidebar/sidebar.jsx";
import StickyBox from "react-sticky-box";
import Footer from "../../../footer";
import Header from "../../../header.jsx";

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
  const patient_id = localStorage.getItem("patient_id");
  const token = localStorage.getItem("patient_token");
  const history = useHistory();
  
  const [profileDetails, setProfileDetails] = useState(null);


  // const fetchDoctorDetails = async () => {
  //   const token = localStorage.getItem("token");
  //   const patient_id = localStorage.getItem("patient_id");
  //   try {
  //     const response = await axios.get(`${var_api}technicalstaff/get/${patient_id}`, {
  //       headers: {
  //         Authorization: token,
  //       },
  //     });
  //     setProfileDetails(response.data);
  //     localStorage.setItem("doctor_name", response.data?.name);
  //     localStorage.setItem("doctor_profile", response.data?.profile_image);
  //     localStorage.setItem("doctor_available", response.data?.is_available);
  //   } catch (err) {
  //     console.error("Error fetching doctor details:", err);
  //   }
  // };

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
      const response = await fetch(`${var_api}patientdetails/change-password/${patient_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          old_password: oldPassword || "", 
          new_password: newPassword || "",
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
  <Header {...props} />
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
          <StickyBox offsetTop={20} offsetBottom={20}>
            <DashboardSidebar />
          </StickyBox>
        </div>

        <div className="col-lg-8 col-xl-9">
          <div className="dashboard-header">
            <h3>Change Password</h3>
          </div>

          {/* Form with Border */}
          <form 
            onSubmit={handleSubmit} 
            style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "5px" }}
          >
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

            {/* Error & Success Messages */}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}

            {/* Buttons */}
            <div className="form-set-button text-end mt-3">
              <button
                className="btn btn-light me-2"
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
          {/* End of Form */}
        </div>
      </div>
    </div>
  </div>

  <Footer {...props} />
</div>


  );
};

export default Password;