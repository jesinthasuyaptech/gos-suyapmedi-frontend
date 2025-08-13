import React, { useState, useEffect } from "react";
import Header from "../../header";
import DashboardSidebar from "../dashboard/sidebar/sidebar";
import Footer from "../../footer";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { doctor_thumb_13, doctor_thumb_14, doctor_thumb_15, doctor_thumb_16, doctor_thumb_17, doctor_thumb_18, doctor_thumb_19, doctor_thumb_21 } from "../../imagepath";
import { Filter, initialSettings } from "../../common/filter";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { var_api, image_api } from "../../../../constant.js";
import axios from "axios";
import { Modal } from 'react-bootstrap';
import Patientdashboardprofile01 from "../../../assets/img/patients/pat_dummy.png";
import { Button, Form } from "react-bootstrap";
import { notification } from "antd";


const PatientAppointments = (props) => {
const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("patient_token");
  const patient_id = localStorage.getItem("patient_id");
  const hospital_id = localStorage.getItem("Patient_HospitalId");
  const history = useHistory(); // React Router v5 navigation
  const [currentTab, setCurrentTab] = useState("upcoming"); // Initial tab
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
  const hospital_profile =  localStorage.getItem("hospital_profile");
  const appointment_prefix = localStorage.getItem("appointment_prefix");
  const invoiced_prefix = localStorage.getItem("invoiced_prefix");
  const invoicem_prefix = localStorage.getItem("invoicem_prefix");
  const prescription_prefix = localStorage.getItem("prescription_prefix");
  const patient_prefix = localStorage.getItem("patient_prefix");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRebook, setShowRebook] = useState(false);
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState(null);
  const patientToken = localStorage.getItem("patient_token_no") || "SMPP001";
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const cancelAppt = localStorage.getItem("cancel_appt_bypatient");
  const patientEmail = localStorage.getItem("patient_email");
  const cancelled_by_patient_email = localStorage.getItem("cancelled_by_patient_email") === "1";
  console.log("cancel by patient is t or f", cancelAppt, patientEmail);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 



  const cancellationReasons = [
    "Schedule Change",
    "Weather conditions",
    "Unexpected Work",
    "Childcare Issue",
    "Travel Delays",
    "Other",
  ];


  
  useEffect(() => {
    setFilteredAppointments(
      appointments.filter((appointment) =>
        appointment.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctor_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctor_primary_mobile.includes(searchQuery)
      )
    );
  }, [searchQuery, appointments]);

  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appointments.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  
    const fetchDoctorDetails = async () => {
      setLoading(true);
      const token = localStorage.getItem("patient_token");
      const doc_id = localStorage.getItem("doctor_id");
      try {
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
        console.error("Error fetching doctor details:", err);
      }
      setLoading(false);
    };



  const handleClose=()=>{
    setShow(false);
}


const handleCloseRebook=()=>{
  setShowRebook(false);
}


    
    
    const fetchData = async (start_date, end_date) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${var_api}appointment/patients-appointments-bydate/${hospital_id}/${start_date}/${end_date}/${patient_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        
    
        if (response.status === 401) {
          history.push("/patient/patientlogin");
          return;
        }
    
        if (!response.ok) throw new Error("Failed to fetch data");
    
        const result = await response.json();
        setAppointments(result || []);
        setTotalPages(result.totalPages || 1);
        filterAppointments(result || []); // Trigger filtering
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    
    const filterAppointments = (appointmentsList) => {
      setLoading(true);
      const upcoming = appointmentsList.filter((appointment) =>
        [0, 1].includes(appointment.status)
      );
      const cancelled = appointmentsList.filter((appointment) =>
        [4, 5].includes(appointment.status)
      );
      const completed = appointmentsList.filter(
        (appointment) => appointment.status === 3
      );
    
      setUpcomingCount(upcoming.length);
      setCancelledCount(cancelled.length);
      setCompletedCount(completed.length);
    
      if (currentTab === "upcoming") {
        setFilteredAppointments(upcoming);
      } else if (currentTab === "cancelled") {
        setFilteredAppointments(cancelled);
      } else if (currentTab === "completed") {
        setFilteredAppointments(completed);
      }
      setLoading(false);
    };
    
    const handleTabClick = (tab) => {
      setCurrentTab(tab);
      // setCurrentPage(1);
      // const start_date = formatDate(initialSettings.startDate);
      // const end_date = formatDate(initialSettings.endDate);
    };

    useEffect(() => {
      fetchDoctorDetails();
      // fetchSettingsData();
    }, [])
    
    useEffect(() => {
      const starts_date = formatDate(initialSettings.startDate);
      const ends_date = formatDate(initialSettings.endDate);
      setStartDate(starts_date);
      setEndDate(ends_date);
      fetchData(starts_date, ends_date);
    }, [currentPage]);
    
    useEffect(() => {
      filterAppointments(appointments);
    }, [currentTab, appointments]);
    
    
//to change date format like dd-mm-yyyy
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


//update status 2
const handleStartNow = async (appointment) => {
  // Update status to 'In Progress' (status 2)  // Get the current time
  const updatedAppointment = {  status: 2, apt_start_time: currentTime  };
  setAppointments(updatedAppointment);
 
  try {
    // API call to update the status in the backend (adjust URL and method as needed)
    const response = await fetch(`${var_api}appointment/status-update/${appointment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // Add token in Authorization header
      },
      body: JSON.stringify({ status: 2, apt_start_time: currentTime, apt_end_time:'00:00:00' }), // Pass the updated status
    });


    if (response.status === 401) {
      history.push("/patient/patientlogin");
      return;
    }


    if (response.ok) {
      // You can update local state here to reflect the change immediately
      console.log('Status updated successfully');
    } else {
      console.error('Failed to update the status');
    }
  } catch (error) {
    console.error('Error updating the status:', error);
  }
};



//update status 3
const handleCancelNow = async (appointment) => {
  console.log("passed apt", appointment);
  setShow(true);
  setSelectedAppointment(appointment);
};


 //send email for apt success
    const sendEmail = async () => {

      const toemails = [patientEmail, selectedAppointment?.doctor_email]
      // Prepare the request body
      const requestData = {
        to: toemails,
        subject: "Appointment Cancellation",
        text: "Your appointment has been cancelled.",
      };
  
      try {
        const response = await axios.post(
          `${var_api}email-notify/apt-cancel/${selectedAppointment?.id}/patient`,
          requestData
        );
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };
  


//update status 3
const handleConfirmCancel = async () => {
  setLoading(true);

  if (!selectedReason) {
    // If no reason is selected, show a notification or error message
    notification.error({
      message: "Error",
      description: "Please select a cancellation reason.",
      placement: 'bottomLeft', 
    });
    setLoading(false);
    return; // Prevent the rest of the code from running
  }
  const remark = selectedReason === "Other" ? otherReason : selectedReason;
  try {
    // API call to update the status in the backend (adjust URL and method as needed)
    const response = await fetch(`${var_api}appointment/status-update/${selectedAppointment?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // Add token in Authorization header
      },
      body: JSON.stringify({ status: 5, apt_start_time: "00:00:00", apt_end_time:'00:00:00', cancel_remark: remark }), // Pass the updated status
    });


    if (response.status === 401) {
      history.push("/patient/patientlogin");
      return;
    }


    if (response.ok) {
      // You can update local state here to reflect the change immediately
      console.log('Status updated successfully');
      await handleHospitalNotify();
      await handleDoctorNotify();
      fetchData(startDate, endDate);
      if (cancelled_by_patient_email) {
        await sendEmail();
      }
      setShow(false);
      setSelectedAppointment(null);
      notification.success({
              message: "success",
              description: "Appointment cancelled successfully!",
            });
    } else {
      console.error('Failed to update the status');
    }
  } catch (error) {
    console.error('Error updating the status:', error);
  }
  setLoading(false);
};


 //hospital notification post
    const handleHospitalNotify = async () => {
      const patient_id = localStorage.getItem('patient_id');
      const payload = {
        hospital_id: parseInt(selectedAppointment?.hospital_id),
        patient_id: patient_id,
        doc_id: parseInt(selectedAppointment?.id),
        title: `Patient ID: ${patientToken} - Appointment Cancelled on ${selectedAppointment?.appointment_day}`,
        description: ` ${patientToken} has Cancelled an appointment on ${selectedAppointment?.appointment_day} at ${selectedAppointment?.slot_time}. APT Token No: ${selectedAppointment?.token_no}.`,
        read_status: 0, // Unread status
      };
    
      const token = localStorage.getItem("patient_token");
    
      try {
        const apiUrl = `${var_api}hospitalnotification/add`;
        console.log("API URL:", apiUrl);
        console.log("Payload:", payload);
        console.log("Token:", token);
      
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        const result = await response.json();
        console.log("hospital Notification sent:", result);
        // alert("Notification sent successfully!");
      } catch (error) {
        console.error("Fetch error:", error);
        // alert("Failed to send notification");
      }
      
    };


    //doctor notification post
    const handleDoctorNotify = async () => {
      const patient_id = localStorage.getItem('patient_id');
      const payload = {
        hospital_id: parseInt(selectedAppointment?.hospital_id),
        patient_id: patient_id,
        doc_id: parseInt(selectedAppointment?.id),
        title: `Patient ID: ${patientToken} - Appointment Cancelled on ${selectedAppointment?.appointment_day}`,
        description: ` ${patientToken} has Cancelled an appointment on ${selectedAppointment?.appointment_day} at ${selectedAppointment?.slot_time}. APT Token No: ${selectedAppointment?.token_no}.`,
        read_status: 0, // Unread status
      };
    
      const token = localStorage.getItem("patient_token");
    
      try {
        const apiUrl = `${var_api}doctornotification/add`;
        console.log("API URL:", apiUrl);
        console.log("Payload:", payload);
        console.log("Token:", token);
      
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        const result = await response.json();
        console.log("doctor Notification sent:", result);
        notification.success({
          message: "success",
          description: "Notification sent successfully!",
        });
        // alert("Notification sent successfully!");
      } catch (error) {
        console.error("Fetch error:", error);
        // alert("Failed to send notification");
      }
      
    };


//update status 3
const handleRebookNow = async (appointment) => {
  setShowRebook(true);
  setSelectedAppointment(appointment);
};



//update rebook
const handleConfirmRebook = async () => {
  setLoading(true);
  try {
    // API call to update the status in the backend (adjust URL and method as needed)
    const response = await fetch(`${var_api}appointment/status-update/${selectedAppointment?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // Add token in Authorization header
      },
      body: JSON.stringify({ status: 0, apt_start_time: "00:00:00", apt_end_time:'00:00:00' }), // Pass the updated status
    });


    if (response.status === 401) {
      history.push("/patient/patientlogin");
      return;
    }


    if (response.ok) {
      // You can update local state here to reflect the change immediately
      console.log('Status updated successfully');
      fetchData(startDate, endDate);
      setShowRebook(false);
      setSelectedAppointment(null);
      notification.success({
              message: "success",
              description: "Appointment Rebooked successfully!",
            });
    } else {
      console.error('Failed to update the status');
    }
  } catch (error) {
    console.error('Error updating the status:', error);
  }
  setLoading(false);
};


 const fetchSettingsData = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    try {
      const response = await fetch(`${var_api}settings/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/patient/patientlogin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setSettings(result || {});
     
      console.log("oa",  result )
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

// const removeApt = () => {
//   localStorage.removeItem("selectedApt");
// }


  return (
    <>
      <Header {...props} />
      <div className="breadcrumb-bar-two">
      {loading && (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  )}
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Patient Appointments</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Patient Appointments
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <DashboardSidebar />
              </StickyBox>
            </div>

            <div className="col-lg-8 col-xl-9">
            <div className="dashboard-header">
                <h3>Appointments</h3>
                <ul className="header-list-btns">
                  <li>
                    <div className="input-block dash-search-input">
                    <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </li>
                  {/* <li>
                    <div className="view-icons">
                      <Link to="/doctor/appointments" className="active">
                        <i className="fa-solid fa-list" />
                      </Link>
                    </div>
                  </li> */}
                  {/* <li>
                    <div className="view-icons">
                      <Link to="/doctor/doctor-appointments-grid">
                        <i className="fa-solid fa-th" />
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="view-icons">
                      <Link to="#">
                        <i className="fa-solid fa-calendar-check" />
                      </Link>
                    </div>
                  </li> */}
                </ul>
              </div>
               <div className="appointment-tab-head">
                            <div className="appointment-tabs">
                              <ul
                                className="nav nav-pills inner-tab "
                                id="pills-tab"
                                role="tablist"
                              >
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={`nav-link ${currentTab === "upcoming" ? "active" : ""}`}
                                    id="pills-upcoming-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-upcoming"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-upcoming"
                                    aria-selected="false"
                                    onClick={() => handleTabClick("upcoming")}
                                  >
                                    Upcoming<span>{upcomingCount}</span>
                                  </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={`nav-link ${currentTab === "cancelled" ? "active" : ""}`}
                                    id="pills-cancel-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-cancel"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-cancel"
                                    aria-selected="true"
                                    onClick={() => handleTabClick("cancelled")}
                                  >
                                    Cancelled<span>{cancelledCount}</span>
                                  </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={`nav-link ${currentTab === "completed" ? "active" : ""}`}
                                    id="pills-complete-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-complete"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-complete"
                                    aria-selected="true"
                                    onClick={() => handleTabClick("completed")}
                                  >
                                    Completed<span>{completedCount}</span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                            <div className="filter-head">
                              <div className="position-relative daterange-wraper me-2">
                                <div className="input-groupicon calender-input">
                                <DateRangePicker 
                                initialSettings={initialSettings}
                                onCallback={(start, end) => {
                                  const formattedStartDate = formatDate(new Date(start));
                                  const formattedEndDate = formatDate(new Date(end));
                                  setStartDate(formattedStartDate);
                                  setEndDate(formattedEndDate);
                                  fetchData(formattedStartDate, formattedEndDate); // Trigger fetch with selected dates
                                }}
                                >
                                <input
                                    className="form-control  date-range bookingrange"
                                    type="text"
                                />
                            </DateRangePicker>
                                </div>
                                <i className="fa-solid fa-calendar-days" />
                              </div>
                              {/* <Filter /> */}
                            </div>
                          </div>
                          <div className="tab-content appointment-tab-content">
                <div
                  className="tab-pane fade show active"
                  id="pills-upcoming"
                  role="tabpanel"
                  aria-labelledby="pills-upcoming-tab"
                >    
                  {/* Appointment List */}
                  {currentItems.map((appointment, index) => (
  <div className="appointment-wrap" key={index}>
    <ul>
      <li>
        <div className="patinet-information">
          <Link to="#">
            <img
              src={
                appointment?.doctor_profile_image &&
                /\.(jpeg|jpg|png|webp)$/i.test(appointment?.doctor_profile_image)
                  ? `${image_api}${appointment?.doctor_profile_image}`
                  : Patientdashboardprofile01
              }
              alt="Img"
            />
          </Link>
          <div className="patient-info">
            <p>#{appointment_prefix}{appointment.token_no}</p>
            <h6>
              <Link to="/doctor/doctor-cancel-appointment">{appointment.doctor_name}</Link>
            </h6>
          </div>
        </div>
      </li>
      <li className="appointment-info">
        <p><i className="fa-solid fa-clock" /> {appointment.appointment_day} {appointment.appointment_time}</p>
        <ul className="d-flex apponitment-types">
          <li>General Visit</li>
        </ul>
      </li>
      <li className="mail-info-patient">
        <ul>
          <li><i className="fa-solid fa-envelope" /> {appointment.doctor_email}</li>
          <li><i className="fa-solid fa-phone" /> &nbsp;&nbsp;{appointment.doctor_primary_mobile}</li>
        </ul>
      </li>
    </ul>
  </div>
))}

                  {/* /Appointment List */}
                  {/* Pagination */}
                  <div className="pagination dashboard-pagination">
  <ul>
    <li>
      <Link to="#" onClick={() => handlePageChange(currentPage - 1)} className="page-link">
        <i className="fa-solid fa-chevron-left" />
      </Link>
    </li>
    {Array.from({ length: totalPages }, (_, index) => (
      <li key={index + 1}>
        <Link
          to="#"
          onClick={() => handlePageChange(index + 1)}
          className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
        >
          {index + 1}
        </Link>
      </li>
    ))}
    <li>
      <Link to="#" onClick={() => handlePageChange(currentPage + 1)} className="page-link">
        <i className="fa-solid fa-chevron-right" />
      </Link>
    </li>
  </ul>
</div>


                  {/* /Pagination */}
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-cancel"
                  role="tabpanel"
                  aria-labelledby="pills-cancel-tab"
                >
               
                  {/* /Appointment List */}

                  {filteredAppointments.map((appointment, index) => (
                  <div className="appointment-wrap" key={index}>
                    <ul>
                      <li>
                        <div className="patinet-information">
                          {/* <Link to="/doctor/doctor-cancel-appointment">
                            <img
                              src={doctordashboardprofile08}
                              alt="User Image"
                            /> */}
                            <Link to="#">
                              <img
                                                                    src={
                                                                      appointment?.doctor_profile_image &&
                                                                      /\.(jpeg|jpg|png|webp)$/i.test(
                                                                        appointment?.doctor_profile_image
                                                                      )
                                                                        ? `${image_api}${appointment?.doctor_profile_image}`
                                                                        :Patientdashboardprofile01}
                                                                    alt="Img"
                                                                  />
                          </Link>
                          <div className="patient-info">
                            <p>#{appointment_prefix}{appointment.token_no}</p>
                            <h6>
                              <Link to="#">{appointment.doctor_name}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          {appointment.appointment_day} {appointment.appointment_time}
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          {/* <li>Video Call</li> */}
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            {appointment.doctor_email}
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;&nbsp;{appointment.doctor_primary_mobile}
                          </li>
                        </ul>
                      </li>
                      {/* <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-cancel-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="fa-solid fa-comments" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="fa-solid fa-xmark" />
                            </Link>
                          </li>
                        </ul>
                      </li> */}
                      {/* <li className="appointment-start">
                        <Link
                          to="#"
                          className="start-link"
                          onClick={() => handleRebookNow(appointment)}
                        >
                          ReBook
                        </Link>
                      </li> */}
                    </ul>
                  </div>
                  ))}
           
                  {/* Pagination */}
                  <div className="pagination dashboard-pagination">
            <ul>
              <li>
                <Link
                  to="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="page-link"
                >
                  <i className="fa-solid fa-chevron-left" />
                </Link>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1}>
                  <Link
                    to="#"
                    onClick={() => handlePageChange(index + 1)}
                    className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    {index + 1}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="page-link"
                >
                  <i className="fa-solid fa-chevron-right" />
                </Link>
              </li>
            </ul>
          </div>
          </div>
                <div
                  className="tab-pane fade"
                  id="pills-complete"
                  role="tabpanel"
                  aria-labelledby="pills-complete-tab"
                >
                  {/* Appointment List */}
                  {filteredAppointments.map((appointment, index) => (
                  <div className="appointment-wrap" key={index}>
                    <ul>
                      <li>
                        <div className="patinet-information">
                          {/* <Link to="/doctor/doctor-complete-appointment">
                            <img
                              src={doctordashboardprofile08}
                              alt="User Image"
                            /> */}
                             <Link to="#">
                              <img
                                                                    src={
                                                                      appointment?.doctor_profile_image &&
                                                                      /\.(jpeg|jpg|png|webp)$/i.test(
                                                                        appointment?.doctor_profile_image
                                                                      )
                                                                        ? `${image_api}${appointment?.doctor_profile_image}`
                                                                        :Patientdashboardprofile01}
                                                                    alt="Img"
                                                                  />
                          </Link>
                          <div className="patient-info">
                            <p>#{appointment_prefix}{appointment.token_no}</p>
                            <h6>
                              <Link to="/doctor/doctor-complete-appointment">{appointment.doctor_name}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          {appointment.appointment_day} {appointment.appointment_time}
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          {/* <li>Video Call</li> */}
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            {appointment.doctor_email}
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;&nbsp;{appointment.doctor_primary_mobile}
                          </li>
                        </ul>
                      </li>
                      {/* <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-complete-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="fa-solid fa-comments" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="fa-solid fa-xmark" />
                            </Link>
                          </li>
                        </ul>
                      </li> */}
                      {/* <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li> */}
                       <li className="appointment-detail-btn">
                        <Link
                          to={{
                            pathname: "/patient/patient-completed-appointment",
                            state: { appointment },
                          }}
                          //  to="#"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  ))}
               
                 
                  {/* Pagination */}
                  <div className="pagination dashboard-pagination">
            <ul>
              <li>
                <Link
                  to="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="page-link"
                >
                  <i className="fa-solid fa-chevron-left" />
                </Link>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1}>
                  <Link
                    to="#"
                    onClick={() => handlePageChange(index + 1)}
                    className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    {index + 1}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="page-link"
                >
                  <i className="fa-solid fa-chevron-right" />
                </Link>
              </li>
            </ul>
          </div>
                  {/* /Pagination */}
                </div>
              </div>
            </div>
          </div>
        </div>
          {/* cancel confirmation Modal */}
          <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
    <Modal.Title>Cancel Booking</Modal.Title>
  </Modal.Header>
                      <Modal.Body>
                        {/* <div className="form-content p-2">
                          <h4 className="modal-title">Confirm</h4>
                          <p className="mb-4">Are you sure want to Cancel this Appointment <span style={{color:"black", fontWeight:"bold"}}>  #{appointment_prefix}{selectedAppointment?.token_no}</span>?</p>
                          <button type="button" className="btn btn-primary" onClick={handleConfirmCancel}>Confirm </button>
                          <button type="button" className="btn btn-danger" style={{marginLeft:"5px"}} data-bs-dismiss="modal" onClick={handleClose}>Close</button>
     <Modal.Title>Cancel Booking</Modal.Title>                    </div> */}
                         <p className="mb-3" style={{fontWeight:"bold"}}>Please select the reason for cancellation:</p>
        <Form>
          {cancellationReasons.map((reason, index) => (
            <Form.Check
              key={index}
              type="radio"
              label={reason}
              name="cancelReason"
              value={reason}
              checked={selectedReason === reason}
              onChange={(e) => setSelectedReason(e.target.value)}
            />
          ))}
          {selectedReason === "Other" && (
            <Form.Group className="mt-3">
              <Form.Label>Other</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            </Form.Group>
          )}
        </Form>
                      </Modal.Body>
                      <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
    <Button variant="success" onClick={handleConfirmCancel}>
      Confirm
    </Button>
  </Modal.Footer>
                   </Modal>
                {/* cancel confirmation Modal */}


                 {/* confirmation Modal rebook*/}
                 <Modal show={showRebook} onHide={handleCloseRebook} centered>
                      <Modal.Body className="text-center">
                        <div className="form-content p-2">
                          <h4 className="modal-title">Confirm</h4>
                          <p className="mb-4">Are you sure want to Rebook this Appointment <span style={{color:"black", fontWeight:"bold"}}>  #{appointment_prefix}{selectedAppointment?.token_no}</span>?</p>
                          <button type="button" className="btn btn-primary" onClick={handleConfirmRebook}>Confirm </button>
                          <button type="button" className="btn btn-danger" style={{marginLeft:"5px"}} data-bs-dismiss="modal" onClick={handleCloseRebook}>Close</button>
                        </div>
                      </Modal.Body>
                   </Modal>
                {/* confirmation Modal rebook */}   
      </div>

      <Footer {...props} />
    </>
  );
};

export default PatientAppointments;
