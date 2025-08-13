import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import  doctorprofileimg  from "../../../assets/img/doctors/doc_dummy.png";
import Select from 'react-select'
import axios from 'axios';
import { notification } from "antd";
import { var_api, image_api } from "../../../../constant";

const DoctorSidebar = ({ profileDetails = {}, setProfileDetails = () => {} }) => {
  let pathnames = window.location.pathname;
  // Initial state for is_available
  const [isAvailable, setIsAvailable] = useState(
    localStorage.getItem("doctor_available")
  );
  const availablity = [
    { value: 1, label: 'I am Available Now' },
    { value: 0, label: 'Not Available' },
  ];
  // const [profileDetails, setProfileDetails] = useState(null);

  
  const doc_id = localStorage.getItem("doctor_id");
  console.log('Profile Details:', profileDetails)
  
  useEffect(() => {
    fetchMedicineSubcategories();
            }, []);


   //fetch medicines list
   const fetchMedicineSubcategories = async () => {
    try {
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get(
        `${var_api}technicalstaff/get/${doc_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Map API data to Select component options
      const options = response.data;
      setIsAvailable(options.is_available);
      if (typeof setProfileDetails === "function") {
        setProfileDetails(options);
      } else {
        console.log("setProfileDetails is not a valid function");
      }
     
      console.log("avai", availablity.find((option) => option.value == isAvailable), isAvailable)
      localStorage.setItem('doctor_name', options?.name);
      localStorage.setItem('doctor_profile', options?.profile_image);
      localStorage.setItem('doctor_available', options?.is_available);
    } catch (err) {
      console.error("Error fetching medicine subcategories:", err);
    //   setError(err.message || "An error occurred.");
    }
  };


   // Handle dropdown change
   const handleChange = (selectedOption) => {
    setIsAvailable(selectedOption.value);
    const token = localStorage.getItem("doc_token");

    const updatedData = {
      name: profileDetails.name,
      email_id: profileDetails.email_id,
      is_verify_email: profileDetails.is_verify_email,
      password: profileDetails.password,
      primary_mobile: profileDetails.primary_mobile,
      secondary_mobile: profileDetails.secondary_mobile,
      profile_image: profileDetails.primary_mobile,
      gender: profileDetails.gender,
      dob: profileDetails.dob,
      blood_group: profileDetails.blood_group,
      joining_date: profileDetails.joining_date,
      leaving_date: profileDetails.leaving_date,
      roll: profileDetails.roll,
      specialization: profileDetails.specialization,
      specialization_id: profileDetails.	specialization_id,
      qualification: profileDetails.qualification,
      id_proof: profileDetails.id_proof,
      is_available: selectedOption.value,
    };

    // Update the server with the new availability value
    fetch(`${var_api}technicalstaff/update/${profileDetails.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Availability updated:", data);
        setProfileDetails(updatedData);
        fetchMedicineSubcategories();
        notification.success({
          message: "Success",
          description: "Available Status updated successfully!",
        });
      })
      .catch((error) => {
        console.error("Error updating availability:", error);
      });
  };



  return (
    <>
      {/* Profile Sidebar */}
      <div className="profile-sidebar doctor-sidebar profile-sidebar-new">
        <div className="widget-profile pro-widget-content">
          <div className="profile-info-widget">
            <Link to="/patient/doctor-profile" className="booking-doc-img">
              <img
                src={profileDetails?.profile_image && /\.(jpeg|jpg|png|webp)$/i.test(profileDetails.profile_image) 
                  ? `${image_api}technical/${profileDetails.profile_image}` 
                  : doctorprofileimg}
                alt="User Image"
              />
            </Link>
            <div className="profile-det-info">
              <h3>
                <Link to="#">
                  Dr {profileDetails?.name || "Unknown"}
                </Link>
              </h3>
              <div className="patient-details">
                <h5 className="mb-0">
                  {profileDetails?.qualification || "No qualification"}
                </h5>
              </div>
              <span className="badge doctor-role-badge">
                <i className="fa-solid fa-circle" />
                {profileDetails?.specialization || "General"}
              </span>
            </div>
          </div>
        </div>
        <div className="doctor-available-head">
          <div className="input-block input-block-new">
            <label className="form-label">
              Availability <span className="text-danger">*</span>
            </label>

            <Select
              className='select'
              options={availablity}
              defaultValue={availablity.find((option) => option.value == isAvailable)} 
              onChange={handleChange}
              />

          </div>
        </div>
        <div className="dashboard-widget">
          <nav className="dashboard-menu">
            <ul>
              <li className={pathnames.includes("/doctor/doctor-dashboard") ? "active" : ""}>

                <Link to="/doctor/doctor-dashboard">
                  <i className="fa-solid fa-shapes me-2" />
                  <span>Dashboard</span>
                </Link>
              </li>
              {/* <li className={pathnames.includes("/doctor/doctor-request") ? "active" : ""}>
                <Link to="/doctor/doctor-request">
                  <i className="fa-solid fa-calendar-check me-2" />
                  <span>Requests</span>
                  <small className="unread-msg">2</small>
                </Link>
              </li> */}
              <li
                className={
                  pathnames.includes("/doctor/doctor-appointments-grid") || pathnames.includes('/doctor/appointments') || pathnames.includes('/doctor/doctor-appointment-start') || pathnames.includes('/doctor/doctor-upcoming-appointment') || pathnames.includes("/doctor/doctor-cancelled-appointment-2") || pathnames.includes('/doctor/doctor-cancelled-appointment') ? "active" : ""
                }
              >
                <Link to="/doctor/appointments">
                  <i className="fa-solid fa-calendar-days me-2" />
                  <span>Appointments</span>
                </Link>
              </li>

              <li className={pathnames.includes('/doctor/available-timings') ? 'active' : ''}>
                <Link to="/doctor/available-timings">
                  <i className="fa-solid fa-calendar-day me-2" />
                  <span>Available Timings</span>
                </Link>
              </li>
              <li className={pathnames.includes('/doctor/my-patients') 
                || pathnames.includes('/doctor/patient-profile') ? "active" : ''}
                >
                <Link to="/doctor/my-patients">
                  <i className="fa-solid fa-user-injured me-2" />
                  <span>My Patients</span>
                </Link>
              </li>
              {/* <li className={pathnames.includes('/doctor/doctor-specialities') ? 'active' : ''}>
                <Link to="/doctor/doctor-specialities">
                  <i className="fa-solid fa-clock me-2" />
                  <span>Specialties &amp; Services</span>
                </Link>
              </li> */}
              <li className={pathnames.includes('/doctor/review') ? 'active' : ''}>
                <Link to="/doctor/review">
                  <i className="fas fa-star me-2" />
                  <span>Reviews</span>
                </Link>
              </li>
              {/* <li className={pathnames.includes('/doctor/account') ? 'active' : ''}>

                <Link to="/doctor/account">
                  <i className="fa-solid fa-file-contract me-2" />
                  <span>Accounts</span>
                </Link>
              </li> */}
              <li className={pathnames.includes('/doctor/invoices') ? 'active' : ''}>
                <Link to="/doctor/invoices">
                  <i className="fa-solid fa-file-lines me-2" />
                  <span>Invoices</span>
                </Link>
              </li>
              {/* <li className={pathnames.includes('/doctor/doctor-payment') ? 'active' : ''}>
                <Link to="/doctor/doctor-payment">
                  <i className="fa-solid fa-money-bill-1 me-2" />
                  <span>Payout Settings</span>
                </Link>
              </li> */}
              {/* <li>
                <Link to="/doctor/chat-doctor">
                  <i className="fa-solid fa-comments me-2" />
                  <span>Message</span>
                  <small className="unread-msg">7</small>
                </Link>
              </li> */}
              <li className={pathnames.includes('/doctor/profile-setting') || pathnames.includes('/doctor/doctor-experience') || pathnames.includes('/doctor/doctor-awards-settings') || pathnames.includes('/doctor/doctor-insurance-settings') || pathnames.includes('/doctor/doctor-clinics-settings') || pathnames.includes('/doctor/doctor-business-setting') ? 'active' : ''}>
                <Link to="/doctor/profile-setting">
                  <i className="fa-solid fa-user-pen me-2" />
                  <span>Profile Settings</span>
                </Link>
              </li>
              {/* <li className={pathnames.includes('/doctor/social-media') ? 'active' : ''}>
                <Link to="/doctor/social-media">
                  <i className="fa-solid fa-shield me-2" />
                  <span>Social Media</span>
                </Link>
              </li> */}
              <li className={pathnames.includes('/doctor/doctor-change-password') ? 'active' : ''}>
                <Link to="/doctor/doctor-change-password">
                  <i className="fa-solid fa-key me-2" />
                  <span>Change Password</span>
                </Link>
              </li>
              <li className={pathnames.includes("/login") ? 'active' : ''}>
                <Link to="/login">
                  <i className="fa-solid fa-calendar-check me-2" />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {/* /Profile Sidebar */}
    </>
  );
};

export default DoctorSidebar;
