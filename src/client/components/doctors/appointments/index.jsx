import Header from "../../header";
import DoctorSidebar from "../sidebar";
import DoctorFooter from "../../common/doctorFooter";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctordashboardprofile3 } from "../../imagepath";
import { Filter, initialSettings } from "../../common/filter";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { var_api, image_api } from "../../../../constant";
import { Modal } from 'react-bootstrap';
import { notification } from "antd";
import Patientdashboardprofile01 from "../../../assets/img/patients/pat_dummy.png";
import axios from "axios";
import "../../style/Loader.css";

const Appointments = (props) => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("doc_token");
  const doc_id = localStorage.getItem("doctor_id");
  const hospital_id = localStorage.getItem("doc_hospital_id");
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
  const [loading, setLoading ] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRebook, setShowRebook] = useState(false);
    const [profileDetails, setProfileDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const rebooked_by_doctor_email = localStorage.getItem("rebooked_by_doctor_email") === "1";
    const cancelled_by_doctor_email = localStorage.getItem("cancelled_by_doctor_email") === "1";
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 10; 


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



  const handleClose=()=>{
    setShow(false);
}


const handleCloseRebook=()=>{
  setShowRebook(false);
}

const totalPages = Math.ceil(appointments.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = appointments.slice(indexOfFirstItem, indexOfLastItem);

const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    
    const fetchData = async (start_date, end_date) => {
      try {
        setLoading(true);
        const response = await fetch(
          `${var_api}appointment/appointments-between-doc/${hospital_id}/${doc_id}/${start_date}/${end_date}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
    
        if (response.status === 401) {
          history.push("/login");
          return;
        }
    
        if (!response.ok) throw new Error("Failed to fetch data");
    
        const result = await response.json();
        setAppointments(result || []);
        setTotalPages(result.totalPages || 1);
        filterAppointments(result || []); // Trigger filtering
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
      finally {
        setLoading(false);
      }
    };
    
    const filterAppointments = (appointmentsList) => {
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
    };
    
    const handleTabClick = (tab) => {
      setCurrentTab(tab);
      // setCurrentPage(1);
      // const start_date = formatDate(initialSettings.startDate);
      // const end_date = formatDate(initialSettings.endDate);
    };

    useEffect(() => {
      fetchDoctorDetails();
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


    useEffect(() => {
      setFilteredAppointments(
        appointments.filter((appointment) =>
          appointment.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.patient_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.patient_mobile_no?.includes(searchQuery)
        )
      );
    }, [searchQuery, appointments]);

    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
    
    
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
    setLoading(true);
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
      history.push("/login");
      return;
    }


    if (response.ok) {
      // You can update local state here to reflect the change immediately
      console.log('Status updated successfully');
    } else {
      console.error('Failed to update the status');
    }
  } catch (error) {
    setLoading(false);
    console.error('Error updating the status:', error);
  }
  finally {
    setLoading(false);
  }
};



//update status 3
const handleCancelNow = async (appointment) => {
  setShow(true);
  setSelectedAppointment(appointment);
};



//send email for cancellation
  const sendEmail = async () => {

      const toemails = [selectedAppointment?.patient_email, selectedAppointment?.doctor_email]
      // Prepare the request body
      const requestData = {
        to: toemails,
        subject: "Appointment Cancellation",
        text: "Your appointment has been cancelled.",
      };
  
      try {
        setLoading(true);
        const response = await axios.post(
          `${var_api}email-notify/apt-cancel/${selectedAppointment?.id}/doctor`,
          requestData
        );
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        setLoading(false);
        console.error('Error sending email:', error);
      }
      finally {
        setLoading(false);
      }
    };


    //send email for rebook
  const sendEmailRebook = async () => {

    const toemails = [selectedAppointment?.patient_email, selectedAppointment?.doctor_email]
    // Prepare the request body
    const requestData = {
      to: toemails,
      subject: "Appointment Rebooking",
      text: "Your appointment has been Rebooked.",
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${var_api}email-notify/apt-rebook/${selectedAppointment?.id}/doctor`,
        requestData
      );
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      setLoading(false);
      console.error('Error sending email:', error);
    }
    finally {
      setLoading(false);
    }
  };
  



//update status 3
const handleConfirmCancel = async () => {
  
  try {
    setLoading(true);
    // API call to update the status in the backend (adjust URL and method as needed)
    const response = await fetch(`${var_api}appointment/status-update/${selectedAppointment?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // Add token in Authorization header
      },
      body: JSON.stringify({ status: 4, apt_start_time: "00:00:00", apt_end_time:'00:00:00' }), // Pass the updated status
    });


    if (response.status === 401) {
      history.push("/login");
      return;
    }


    if (response.ok) {
      // You can update local state here to reflect the change immediately
      console.log('Status updated successfully');
      fetchData(startDate, endDate);
      setShow(false);
      setSelectedAppointment(null);
    
      if (cancelled_by_doctor_email) {
        await sendEmail()
      }
      notification.success({
              message: "success",
              description: "Appointment cancelled successfully!",
            });
    } else {
      console.error('Failed to update the status');
    }
  } catch (error) {
    setLoading(false);
    console.error('Error updating the status:', error);
  }
  finally {
    setLoading(false);
  }
};


//update status 3
const handleRebookNow = async (appointment) => {
  setShowRebook(true);
  setSelectedAppointment(appointment);
};



//update rebook
const handleConfirmRebook = async () => {
  
  try {
    setLoading(true);
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
      history.push("/login");
      return;
    }


    if (response.ok) {
      // You can update local state here to reflect the change immediately
      console.log('Status updated successfully');
      fetchData(startDate, endDate);
      setShowRebook(false);
      setSelectedAppointment(null);
      if (rebooked_by_doctor_email) {
        await sendEmailRebook();
      }
      notification.success({
              message: "success",
              description: "Appointment Rebooked successfully!",
            });
    } else {
      console.error('Failed to update the status');
    }
  } catch (error) {
    setLoading(false);
    console.error('Error updating the status:', error);
  }
  finally {
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
              <h2 className="breadcrumb-title">Appointments</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Appointments
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
              <DoctorSidebar 
               profileDetails={profileDetails}
               setProfileDetails={setProfileDetails}
              />
              {/* /Profile Sidebar */}
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
                  <li>
                    <div className="view-icons">
                      <Link to="/doctor/appointments" className="active">
                        <i className="fa-solid fa-list" />
                      </Link>
                    </div>
                  </li>
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
                  {currentItems.length > 0 ? (
  filteredAppointments.map((appointment, index) => (
    <div className="appointment-wrap" key={index}>
      <ul>
        <li>
          <div className="patinet-information">
            <Link to="#">
              <img
                src={
                  appointment?.patient_profile_image &&
                  /\.(jpeg|jpg|png|webp)$/i.test(appointment?.patient_profile_image)
                    ? `${image_api}${appointment?.patient_profile_image}`
                    : Patientdashboardprofile01
                }
                alt="Img"
              />
            </Link>
            <div className="patient-info">
              <p>#{appointment_prefix}{appointment.token_no}</p>
              <h6>
                <Link to="#">{appointment.patient_name}</Link>
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
          </ul>
        </li>
        <li className="mail-info-patient">
          <ul>
            <li>
              <i className="fa-solid fa-envelope" />
              {appointment.patient_email}
            </li>
            <li>
              <i className="fa-solid fa-phone" />
              &nbsp;&nbsp;{appointment.patient_mobile_no}
            </li>
          </ul>
        </li>
        <li className="appointment-start">
          <Link
            to={{
              pathname: "/doctor/doctor-appointment-start",
              state: { ...appointment, status: 2, apt_start_time: currentTime },
            }}
            className="start-link"
            onClick={() => handleStartNow(appointment)}
          >
            Start Now
          </Link>
        </li>
        <li className="appointment-start">
          <Link
            to="#"
            className="start-link"
            onClick={() => handleCancelNow(appointment)}
            style={{ color: "red" }}
          >
            Cancel
          </Link>
        </li>
      </ul>
    </div>
  ))
) : (
  <p>No appointments found.</p>
)}

                  {/* /Appointment List */}
                  {/* Pagination */}
           <div className="pagination dashboard-pagination">
                            <ul>
                              <li>
                                <Link
                                  to="#"
                                  className="page-link"
                                  onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                                >
                                  <i className="fa-solid fa-chevron-left" />
                                </Link>
                              </li>
                              {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index + 1}>
                                  <Link
                                    to="#"
                                    className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                                    onClick={() => paginate(index + 1)}
                                  >
                                    {index + 1}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link
                                  to="#"
                                  className="page-link"
                                  onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                >
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
                                                                      appointment?.patient_profile_image &&
                                                                      /\.(jpeg|jpg|png|webp)$/i.test(
                                                                        appointment?.patient_profile_image
                                                                      )
                                                                        ? `${image_api}${appointment?.patient_profile_image}`
                                                                        :Patientdashboardprofile01}
                                                                    alt="Img"
                                                                  />
                          </Link>
                          <div className="patient-info">
                            <p>#{appointment_prefix}{appointment.token_no}</p>
                            <h6>
                              <Link to="/doctor/doctor-cancel-appointment">{appointment.patient_name}</Link>
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
                            {appointment.patient_email}
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;&nbsp;{appointment.patient_mobile_no}
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
                      <li className="appointment-start">
                        <Link
                          to="#"
                          className="start-link"
                          onClick={() => handleRebookNow(appointment)}
                        >
                          ReBook
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
                                                                      appointment?.patient_profile_image &&
                                                                      /\.(jpeg|jpg|png|webp)$/i.test(
                                                                        appointment?.patient_profile_image
                                                                      )
                                                                        ? `${var_api}${appointment?.patient_profile_image}`
                                                                        :Patientdashboardprofile01}
                                                                    alt="Img"
                                                                  />
                          </Link>
                          <div className="patient-info">
                            <p>#{appointment_prefix}{appointment.token_no}</p>
                            <h6>
                              <Link to="/doctor/doctor-complete-appointment">{appointment.patient_name}</Link>
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
                            {appointment.patient_email}
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;&nbsp;{appointment.patient_mobile_no}
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
                            pathname: "/doctor/doctor-completed-appointment",
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

        {/* confirmation Modal */}
                    <Modal show={show} onHide={handleClose} centered>
                      <Modal.Body className="text-center">
                        <div className="form-content p-2">
                          <h4 className="modal-title">Confirm</h4>
                          <p className="mb-4">Are you sure want to Cancel this Appointment <span style={{color:"black", fontWeight:"bold"}}>  #{appointment_prefix}{selectedAppointment?.token_no}</span>?</p>
                          <button type="button" className="btn btn-primary" onClick={handleConfirmCancel}>Confirm </button>
                          <button type="button" className="btn btn-danger" style={{marginLeft:"5px"}} data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                        </div>
                      </Modal.Body>
                   </Modal>
                {/* confirmation Modal */}



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
      {/* /Page Content */}
      <DoctorFooter {...props} />
    </div>
  );
};

export default Appointments;
