import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doctordashboardprofile06 } from "../../../imagepath";
import { var_api, image_api } from '../../../../../constant.js';
import { pat_dummy } from "../../../imagepath";
import { useHistory } from 'react-router-dom';
import {notification } from "antd";


export const DashboardSidebar = () => {
  const pathnames = window.location.pathname;
  const [loading, setLoading] = useState(false);
  const [dataprofile, setDataprofile] = useState([]);
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem("patient_profile") || "";
  });
  
  const patient_name =  localStorage.getItem("patientname");
  const patient_token = localStorage.getItem("patient_token_no");
  const patient_gender = localStorage.getItem("patient_gender");
  const patient_age = localStorage.getItem("patient_age");
  const patientProfile = localStorage.getItem("patient_profile");
  const changePaPassword = localStorage.getItem("patient_change_password");
  const history = useHistory();


  const fetchDataprofile = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');
    try {
      const response = await fetch(`${var_api}patientdetails/get/${patient_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("admin/patientLogin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setDataprofile(result || {});// Set initial filtered data
      setLoading(false);
       // Store data in localStorage
       localStorage.setItem("patient_profile", result.profile_image ||"");
        // ✅ Update profileImage state directly
       setProfileImage(localStorage.getItem("patient_profile") || result.profile_image);
       localStorage.setItem("patientname", result.name || "");
       localStorage.setItem("patient_token_no", result.running_no ||"");
       localStorage.setItem("patient_gender", result.gender ||"");
       localStorage.setItem("patient_age", result.age ||"");
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
       // Call API only if data is not in localStorage
    if (!localStorage.getItem("patient_profile")|| !profileImage) {
      fetchDataprofile();
    }
    }, []);
  


return (
    <>
    {/* Profile Sidebar */}
    <div className="profile-sidebar patient-sidebar profile-sidebar-new">
    <div className="widget-profile pro-widget-content">
  <div className="profile-info-widget">
    <Link to="/patient/profile" className="booking-doc-img">
    <img 
 src={patientProfile ? `${image_api}${patientProfile}` : pat_dummy} 
  alt="patient Image" 
  onError={(e) => e.target.src = pat_dummy} 
/>
    </Link>
    <div className="profile-det-info">
      <h3>
        <Link to="/patient/profile">{patient_name || dataprofile.name}</Link>
      </h3>
      <div className="patient-details">
        <h5 className="mb-0">Patient ID: {patient_token || dataprofile.running_no}</h5>
      </div>
      <span>
        {patient_gender || dataprofile.gender} <i className="fa-solid fa-circle" /> {patient_age || dataprofile.age} years
      </span>
    </div>
  </div>
</div>

      <div className="dashboard-widget">
        <nav className="dashboard-menu">
          <ul>
            <li className={pathnames.includes('/patient/dashboard') ? 'active' : ''}>
              <Link to="/patient/dashboard">
                <i className="fa-solid fa-shapes me-2" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={pathnames.includes('/patient/patient-appointments') 
              || pathnames.includes('/patient/patient-cancelled-appointment') 
              || pathnames.includes('/patient/patient-cancelled-appointment') 
              || pathnames.includes('/patient/patient-completed-appointment') 
              || pathnames.includes('/patient/upcoming-appointment') ? 'active' : ''}>

              <Link to="/patient/patient-appointments">
                <i className="fa-solid fa-calendar-days me-2" />
                <span>My Appointments</span>
              </Link>
            </li>
            <li className={pathnames.includes('/patient/favourites') ? 'active' : ''}>

              <Link to="/patient/favourites">
                <i className="fa-solid fa-user-doctor me-2" />
                <span>Favourites</span>
              </Link>
            </li>
            <li className={pathnames.includes('/patient/dependent') ? 'active' : ''}>

              <Link to="/patient/dependent">
                <i className="fa-solid fa-user-plus me-2" />
                <span>Dependants</span>
              </Link>
            </li>
            <li className={pathnames.includes('/patient/medicalrecords') ? 'active' : ''}>

              <Link to="/patient/medicalrecords">
                <i className="fa-solid fa-money-bill-1 me-2" />
                <span> Records</span>
              </Link>
            </li>
            {/* <li className={pathnames.includes('/patient/accounts') ? 'active' : ''}>

              <Link to="/patient/accounts">
                <i className="fa-solid fa-file-contract me-2" />
                <span>Accounts</span>
              </Link>
            </li> */}
            <li className={pathnames.includes('/patient/patient-invoice') ? 'active' : ''}>

              <Link to="/patient/patient-invoice">
                <i className="fa-solid fa-file-lines me-2" />
                <span>Invoices</span>
              </Link>
            </li>
            {/* <li className={pathnames.includes('/patient/patient-chat') ? 'active' : ''}>

              <Link to="/patient/patient-chat">
                <i className="fa-solid fa-comments me-2" />
                <span>Message</span>
                <small className="unread-msg">7</small>
              </Link>
            </li> */}
                     <li className={pathnames.includes('/patient/medicaldetail') ? 'active' : ''}>

<Link to="/patient/medicaldetails">
  <i className="fa-solid fa-shield-halved me-2" />
  <span>Vitals</span>
</Link>
</li>
            <li className={pathnames.includes('/patient/profile') ? 'active' : ''}>

              <Link to="/patient/profile">
                <i className="fa-solid fa-user-pen me-2" />
                <span>Profile Settings</span>
              </Link>
            </li>
   
   {
    changePaPassword == 1 && (

      <li className={pathnames.includes('/patient/change-password') ? 'active' : ''}>

      <Link to="/patient/change-password">
        <i className="fa-solid fa-key me-2" />
        <span>Change Password</span>
      </Link>
    </li>
    )
   }
            <li>
              {/* <Link to="/admin/patientlogin">
                <i className="fa-solid fa-calendar-check me-2" />
                <span>Logout</span>
              </Link> */}
              <Link 
                  to="/patient/patientlogin"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    localStorage.removeItem("token"); // Clear stored authentication tokens
                    sessionStorage.clear(); // Clear session-related data

                    setTimeout(() => {
                      // window.location.href = "/admin/patientlogin"; // Redirect & reload
                      history.push("/patient/patientlogin");
                    }, 100);
                  }}
>
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
export default DashboardSidebar;
