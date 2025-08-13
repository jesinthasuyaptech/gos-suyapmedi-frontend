import React, { useState, useEffect } from "react";
import { Link, useHistory} from "react-router-dom";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter";
import DoctorSidebar from "../sidebar";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctordashboardprofile3 } from "../../imagepath";
import { initialSettings } from "../../common/filter";
import DateRangePicker from "react-bootstrap-daterangepicker/dist";
import { var_api, image_api } from "../../../../constant";
import "../../style/Loader.css";
import patientdashboardprofile01 from "../../../assets/img/patients/pat_dummy.png";

const MyPatient = (props) => {
  const [appointments, setAppointments] = useState([]);
  const doc_id = localStorage.getItem("doctor_id");
  const token = localStorage.getItem("doc_token");
  const hospital_id = localStorage.getItem("doc_hospital_id");
  const [loading, setLoading] = useState(true);
  const [activePatients, setActivePatients] = useState([]);
  const [inactivePatients, setInactivePatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredActivePatients, setFilteredActivePatients] = useState([]);
  const [filteredInactivePatients, setFilteredInactivePatients] = useState([]);
  const [activePage, setActivePage] = useState(1); // Track active patients page
  const [inactivePage, setInactivePage] = useState(1); // Track inactive patients page
  const patientsPerPage = 10; // Number of patients to show per page
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

  
  
  useEffect(() => {
    fetchDoctorDetails();
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${var_api}appointment/appointments-between-doc/${hospital_id}/${doc_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (response.status === 401) {
          setLoading(false);
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setAppointments(result || []);

        // Categorize patients based on their status
        const activePatients = result.filter(patient => patient.patient_status === 'active');
        const inactivePatients = result.filter(patient => patient.patient_status === 'inactive');
        
        setActivePatients(activePatients);
        setInactivePatients(inactivePatients);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [hospital_id, doc_id, token]);

  // Handle the search query and filter the patients
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredActivePatients(activePatients);
      setFilteredInactivePatients(inactivePatients);
    } else {
      setFilteredActivePatients(
        activePatients.filter(patient =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredInactivePatients(
        inactivePatients.filter(patient =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, activePatients, inactivePatients]);

  // Function to handle the "Load More" button click for Active Patients
  const loadMoreActive = () => {
    setActivePage(prevPage => prevPage + 1);
  };

  // Function to handle the "Load More" button click for Inactive Patients
  const loadMoreInactive = () => {
    setInactivePage(prevPage => prevPage + 1);
  };

  // Get the current page data for Active Patients
  const currentActivePatients = filteredActivePatients.slice(0, activePage * patientsPerPage);

  // Get the current page data for Inactive Patients
  const currentInactivePatients = filteredInactivePatients.slice(0, inactivePage * patientsPerPage);

  function formatDate(dateString) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Validate the input
    if (!dateString || typeof dateString !== "string") {
      console.error("Invalid or missing date string:", dateString);
      return "Invalid Date"; // Return a default value for invalid input
    }
  
    // Try parsing as an ISO date first
    const date = new Date(dateString);
  
    if (!isNaN(date.getTime())) {
      // Valid ISO date
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  
    // Handle custom 'dd-mm-yyyy' format
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    }
  
    // If all parsing attempts fail
    console.error("Unexpected date format:", dateString);
    return "Invalid Date";
  }
  

  
  return (
    <div>
      <Header profileDetails={profileDetails}  />
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
              <h2 className="breadcrumb-title">My Patients</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    My Patients
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
              {/* Profile Sidebar */}
              <DoctorSidebar
              profileDetails={profileDetails}
              setProfileDetails={setProfileDetails}
               />
              {/* /Profile Sidebar */}
            </div>
            <div className="col-lg-8 col-xl-9">
      <div className="dashboard-header">
        <h3>My Patients</h3>
        <ul className="header-list-btns">
          <li>
            <div className="input-block dash-search-input">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
              />
              <span className="search-icon">
                <i className="fa-solid fa-magnifying-glass" />
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div className="appointment-tab-head">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab " id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-upcoming-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-upcoming"
                type="button"
                role="tab"
                aria-controls="pills-upcoming"
                aria-selected="false"
              >
                Active <span>{currentActivePatients.length}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-cancel-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-cancel"
                type="button"
                role="tab"
                aria-controls="pills-cancel"
                aria-selected="true"
              >
                Inactive <span>{currentInactivePatients.length}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content appointment-tab-content grid-patient">
        <div
          className="tab-pane fade show active"
          id="pills-upcoming"
          role="tabpanel"
          aria-labelledby="pills-upcoming-tab"
        >
          <div className="row">
            {currentActivePatients.map(patient => (
              <div key={patient.id} className="col-xl-4 col-lg-6 col-md-6 d-flex">
                <div className="appointment-wrap appointment-grid-wrap">
                  <ul>
                    <li>
                      <div className="appointment-grid-head">
                        <div className="patinet-information">
                        <Link to={{
                            pathname: "/doctor/patient-profile",
                            state: { patient },
                          }}>
                      <img
                        src={
                          patient.profile_image && /\.(jpeg|jpg|png|webp)$/i.test(patient.profile_image)
                            ? `${image_api}${patient.profile_image}`
                            : patientdashboardprofile01
                        }
                        alt="Img"
                      />
                    </Link>
                          <div className="patient-info">
                            <p>{`#Apt${patient.token_no}`}</p>
                            <h6>
                            {/* <Link to={`/doctor/patient-profile/${patient.id}`}>{patient.name}</Link> */}
                            <Link  to={{
                            pathname: "/doctor/patient-profile",
                            state: { patient },
                          }} >{patient.name}</Link>    
                                                     </h6>
                            <ul>
                              <li>Dob: {formatDate(patient.dob)}</li>
                              <li>{patient.gender}</li>
                              <li>{patient.blood_group}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-phone" />
                        {patient.mobile_no}
                      </p>
                      <p className="mb-0">
                        <i className="fa-solid fa-location-dot" />
                        {patient.full_address}
                      </p>
                    </li>
                    {/* <li className="appointment-action">
                      <div className="patient-book">
                        <p>
                          <i className="fa-solid fa-calendar-days" />
                          Last Booking <span>{formatDate(patient.appointment_day)}</span>
                        </p>
                      </div>
                    </li> */}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-12">
            <div className="loader-item text-center">
              <button
                onClick={loadMoreActive}
                className="btn btn-load"
                disabled={currentActivePatients.length >= filteredActivePatients.length}
              >
                Load More
              </button>
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="pills-cancel"
          role="tabpanel"
          aria-labelledby="pills-cancel-tab"
        >
          <div className="row">
            {currentInactivePatients.map(patient => (
              <div key={patient.id} className="col-xl-4 col-lg-6 col-md-6 d-flex">
                <div className="appointment-wrap appointment-grid-wrap">
                  <ul>
                    <li>
                      <div className="appointment-grid-head">
                        <div className="patinet-information">
                        <Link to={{
                            pathname: "/doctor/patient-profile",
                            state: { patient },
                          }}>
                      <img
                        src={
                          patient.profile_image && /\.(jpeg|jpg|png|webp)$/i.test(patient.profile_image)
                            ? `${image_api}${patient.profile_image}`
                            : patientdashboardprofile01
                        }
                        alt="Img"
                      />
                    </Link>
                          <div className="patient-info">
                            <p>{`#Apt${patient.token_no}`}</p>
                            <h6>
                            {/* <Link to={`/doctor/patient-profile/${patient.id}`}>{patient.name}</Link>   */}
                            <Link  to={{
                            pathname: "/doctor/patient-profile",
                            state: { patient },
                          }} >{patient.name}</Link>                           
                            </h6>
                            <ul>
                            <li>Dob: {formatDate(patient.dob)}</li>
                            <li>{patient.gender}</li>
                              <li>{patient.blood_group}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock" />
                        {patient.mobile_no}
                      </p>
                      <p className="mb-0">
                        <i className="fa-solid fa-location-dot" />
                        {patient.full_address}
                      </p>
                    </li>
                    {/* <li className="appointment-action">
                      <div className="patient-book">
                        <p>
                          <i className="fa-solid fa-calendar-days" />
                          Last Booking <span>{patient.last_booking}</span>
                        </p>
                      </div>
                    </li> */}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-12">
            <div className="loader-item text-center">
              <button
                onClick={loadMoreInactive}
                className="btn btn-load"
                disabled={currentInactivePatients.length >= filteredInactivePatients.length}
              >
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter />
    </div>
  );
};

export default MyPatient;
