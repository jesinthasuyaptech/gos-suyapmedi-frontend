/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import React, { useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import logosvg from "../assets/images/logo.svg";
import IMG01 from "../assets/images/doctors/doctor-thumb-02.jpg";
// import Dropdown from "react-bootstrap/Dropdown";
import { useEffect } from "react";
import { var_api, image_api } from "../../constant";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import FeatherIcon from "feather-icons-react";
import {
  Browser_categorie,
  Home_12,
  Home_13,
  doctorprofileimg,
  home_01,
  home_02,
  home_03,
  home_04,
  home_05,
  home_06,
  home_07,
  home_08,
  home_09,
  home_10,
  home_11,
  logo_03,
  logo_15,
  logo_svg,
  logo_white,
  pat_dummy
} from "./imagepath";

import Chart from "./patients/dashboard/chart";
import Notification from "./patients/dashboard/notification";
import DoctorNotification from "./pages/doctornotification";
import { IMG07 } from "../components/patients/doctorprofile/img";
import NavLinks from "./nav";
import { notification } from "antd";
import doctorpro from "../assets/img/doctors/doc_dummy.png";



const Header = ({ profileDetails }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const history = useHistory();
  const dropdownRef = useRef(null);

  // const history = useHistory();
  //Aos
  // const location = useLocation();
  const doc_name = localStorage.getItem('doctor_name');
  const doc_profile = localStorage.getItem('doctor_profile');
  const doc_available = localStorage.getItem('doctor_available')
  const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedpatientdetails, setPatientdetails] = useState(null);  
  

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
     
  }, []);

  const config = "/react/template";

  //mobile menu
  const [change, setChange] = useState(false);
  const [isSideMenu, setSideMenu] = useState("");
  const [isSideMenuone, setSideMenuone] = useState("");
  const [isSideMenutwo, setSideMenutwo] = useState("");
  const [isSideSearch, setSideSearch] = useState("");
  const [isSidebooking, setSideBooking] = useState("");
  const [button, setButton] = useState(true);
  const [navbar, setNavbar] = useState(false);
  const [isSideMenuthree, setSideMenuthree] = useState("");
  const [isSideMenufour, setSideMenufour] = useState("");
  const [sideMenufive, setSideMenufive] = useState("");
  const [menu, setMenu] = useState(false);
  const hopital_id = localStorage.getItem("Patient_HospitalId");
  const patient_name = localStorage.getItem("patient_name");
  const patient_profile = localStorage.getItem("patient_profile");

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    history.push("/patient/patientlogin");
    // window.location.href = "/admin/patientlogin";
    setDropdownOpen(false);  // Redirect to login page
    localStorage.removeItem("patient_profile");
    localStorage.removeItem("patient_token");
  };

  
  // const handleClick = () => {
  //   localStorage.clear();
  //   window.location.href ="/patient/patientnotification"; // Navigate to the Notification page
  // };

  // const [menu1, setMenu1] = useState(false);
  const toggleSidebarthree = (value) => {
    setSideMenuthree(value);
  };
  const toggleSidebar = (value) => {
    setSideMenu(value);
  };
  const toggleSidebarfour = (value) => {
    setSideMenufour(value);
  };
  const toggleSidebarfive = (value) => {
    setSideMenufive(value);
  };
  const toggleSidebarone = (value) => {
    setSideMenuone(value);
  };
  const toggleSidebartwo = (value) => {
    setSideMenutwo(value);
  };
  const toggleSidebarsearch = (value) => {
    setSideSearch(value);
  };
  const toggleSidebarbooking = (value) => {
    setSideBooking(value);
  };

  // const mobilemenus = () => {
  //   setMenu(!true);
  // };

  // Rest of your code that uses pathnames

  let pathnames = window.location.pathname;

  // const [active, setActive] = useState(false);
  const url = pathnames.split("/").slice(0, -1).join("/");

  const onHandleMobileMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.add("menu-opened");
  };

  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
  };



  //nav transparent

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);
  window.addEventListener("resize", showButton);

  const changeBackground = () => {
    if (window.scrollY >= 95) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  window.addEventListener("scroll", changeBackground);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const fetchData = async () => {
    // Determine user type
    const isDoctor = localStorage.getItem("doc_token") !== null;
    const isPatient = localStorage.getItem("patient_token") !== null;
  
    // Get appropriate credentials
    const token = 
    isDoctor ? 
    localStorage.getItem("doc_token") 
                         : localStorage.getItem("patient_token");
    
    const hospitalId = isDoctor ? localStorage.getItem("doc_hospital_id")
                              : localStorage.getItem("Patient_HospitalId");
    try {
      const response = await fetch(`${var_api}hospital/get/${hospitalId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      localStorage.setItem("hospital_profile", result.profile_image);
      localStorage.setItem("appointment_prefix", result.appointment_prefix);
      localStorage.setItem("invoiced_prefix", result.doctorinvoice_prefix);
      localStorage.setItem("invoicem_prefix", result.medicalinvoice_prefix);
      localStorage.setItem("prescription_prefix", result.prescriptionid_prefix);
      localStorage.setItem("patient_prefix", result.patient_prefix);
      localStorage.setItem("hospital_country", result.country);
      localStorage.setItem("hospital_state", result.state);
      localStorage.setItem("hospital_name", result.name);
      localStorage.setItem("hospital_mobile", result.mobile);
      localStorage.setItem("hospital_address", result.address);
      // setData(result.data || []);
      // setFilteredData(result.data || []); // Set initial filtered data
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // notification.error({
      //   message: "Fetch Failed",
      //   description: "Unable to retrieve data. Please try again later.",
      // });
    } finally {
      // setLoading(false);
    }
  };
  const fetchpatientdetails = async () => {
     // Determine user type
  const isDoctor = localStorage.getItem("doc_token") !== null;
  const isPatient = localStorage.getItem("patient_token") !== null;

  if (!isDoctor && !isPatient) {
    console.warn("No user authentication found");
    return;
  }

  const token = isDoctor ? localStorage.getItem("doc_token")
                       : localStorage.getItem("patient_token");
  
  const userId = isDoctor ? localStorage.getItem("doctor_id")
                        : localStorage.getItem("patient_id");

                        console.log("isDoctor",isDoctor);

                        try {
                          const endpoint = isDoctor 
                            ? `${var_api}technicalstaff/get/${userId}`
                            : `${var_api}patientdetails/get/${userId}`;
                      
                          const response = await axios.get(endpoint, {
                            headers: { Authorization: token },
                          });
                      
                          // Handle the response based on user type
                          if (isDoctor) {
                            // Set doctor details
                            console.log("Doctor details:", response.data);
                            // Add any doctor-specific logic here
                          } else {
                            // Set patient details
                            setPatientdetails(response.data);
                          }
                      
                        } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching doctor details:", err);
      }
    }
  };

  useEffect(() => {
    // fetchData();
    fetchpatientdetails();
  },[]);

  return (
    <>
      {!pathnames.includes("home1") && (
        <header
          className={`header ${
            pathnames.includes("/index-11")
              ? "header-fixed header-fourteen header-sixteen"
              : "" || pathnames.includes("/index-10")
              ? "header-fixed header-fourteen header-fifteen"
              : "" || pathnames.includes("/index-9")
              ? "header-fixed header-fourteen"
              : "" || pathnames.includes("/index-8")
              ? "header-fixed header-fourteen header-twelve header-thirteen"
              : "" || pathnames.includes("/index-7")
              ? "header-fixed header-fourteen header-twelve"
              : "" || pathnames.includes("/index-6")
              ? "header-trans header-eleven"
              : "" || pathnames.includes("/index-4")
              ? "header-trans custom"
              : "" || pathnames.includes("/index-5")
              ? "header header-fixed header-ten"
              : "" || pathnames.includes("home")
              ? "header-trans header-two"
              : "" || pathnames.includes("/index-13")
              ? "header header-custom header-fixed header-ten home-care-header"
              : "" || pathnames.includes("/Pharmacy-index")
              ? "header header-one"
              : "header-fixed header-one header-space header-custom"
          } 
           ${isScrolled ? 'pharmacy-header' : ''} `}
          style={
            pathnames.includes("/index-6") && navbar
              ? { background: "rgb(30, 93, 146)" }
              : { background: "" } && pathnames.includes("/index-10") && navbar
              ? { background: "rgb(255, 255, 255)" }
              : { background: "" } && pathnames.includes("/index-11") && navbar
              ? { background: "rgb(255, 255, 255)" }
              : { background: "" } && pathnames.includes("/index-4") && navbar
              ? { background: "rgb(43, 108, 203)" }
              : { background: "" } && pathnames.includes("/index-9") && navbar
              ? { background: "rgb(43, 108, 203)" }
              : { background: "" } && pathnames.includes("/index-2") && navbar
              ? { background: "rgb(255, 255, 255)" }
              : { background: "" }
          }
        >
          <div className="container">
            <nav
              className={`navbar navbar-expand-lg header-nav ${
                pathnames.includes("home1") ? "nav-transparent" : ""
              }`}
            >
              <div className="navbar-header">
                {/* <Link
                  to="#0"
                  id="mobile_btn"
                  onClick={() => onHandleMobileMenu()}
                >
                  <span className="bar-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </Link> */}
                <Link to="/" className="navbar-brand logo">
                  {pathnames.includes("/index-5") ? (
                    <img src="/assets/img/logo-01.svg" className="img-fluid" alt="Logo" />
                  ) : pathnames.includes(
                      "/react/template/Pharmacy/Pharmacy-index"
                    ) ? (
                    <div className="browse-categorie">
                      <div className="dropdown categorie-dropdown">
                        <Link
                          to="#"
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <img src={Browser_categorie} alt /> Browse Categories
                        </Link>
                        <div className="dropdown-menu">
                          <Link className="dropdown-item" to="#">
                            Ayush
                          </Link>
                          <Link className="dropdown-item" to="#">
                            Covid Essentials
                          </Link>
                          <Link className="dropdown-item" to="#">
                            Devices
                          </Link>
                          <Link className="dropdown-item" to="#">
                            Glucometers
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={
                        pathnames === "/react/template/index-6" ||
                        pathnames === "/react/template/index-4"
                          ? logosvg
                          : pathnames === "/react/template/index-11"
                          ? logo_15
                          : pathnames === "/react/template/index-10"
                          ? logo_15
                          : pathnames === "/react/template/index-9"
                          ? logo_03
                          : pathnames === "/react/template/index-7"
                          ? logo_svg
                          : pathnames == "/react/template/index-13"
                          ? logo_white
                          : logo
                      }
                      className="img-fluid"
                      alt="Logo"
                      style={{ width: "100px", height: "auto" }} 
                    />
                  )}
                </Link>
              </div>
              <div className="main-menu-wrapper">
                <div className="menu-header">
                  <Link to="/home-2" className="menu-logo">
                    <img src={logo} className="img-fluid" alt="Logo" />
                  </Link>
                  <Link
                    to="#0"
                    id="menu_close"
                    className="menu-close"
                    onClick={() => onhandleCloseMenu()}
                  >
                    <i className="fas fa-times"></i>
                  </Link>
                </div>
                  
                <ul
                  className={`main-nav ${
                    pathnames.includes("home4") ? "white-font" : ""
                  }`}
                >
                  <NavLinks/>
                  {pathnames.includes("/index-5") ||
                  pathnames.includes("/index-11") ? (
                    <li className="searchbar">
                      <Link to="#">
                        <i>
                          {" "}
                          <FeatherIcon icon="search" />
                        </i>
                      </Link>
                      <div className="togglesearch" style={{ display: "none" }}>
                        <form action={`${config}/patient/search-doctor1`}>
                          <div className="input-group">
                            <input type="text" className="form-control" />
                            <button type="submit" className="btn">
                              Search
                            </button>
                          </div>
                        </form>
                      </div>
                    </li>
                  ) : null}
                  {(!pathnames.includes("/index-10") &&
                    pathnames.includes("index")) ||
                  pathnames.includes("/login") ||
                  pathnames.includes("/register") ||
                  pathnames.includes("blog") ||
                  pathnames.includes("/doctor/doctor-register") ||
                  pathnames.includes("pages") ||
                  pathnames.includes("/patient/search-doctor1") ||
                  (pathnames.includes("/aboutus") &&
                    !pathnames.includes("/index-6") &&
                    !pathnames.includes("/index-13") &&
                    !pathnames.includes("/index-5") &&
                    !pathnames.includes("/index-6") &&
                    !pathnames.includes("/index-7") &&
                    !pathnames.includes("/index-8") &&
                    !pathnames.includes("/index-9") &&
                    !pathnames.includes("/index-10") &&
                    !pathnames.includes("/index-11")) ? (
                    <>
                      <li className="searchbar">
                        <Link to="#" onClick={() => setChange(!change)}>
                          <i> {/* <FeatherIcon icon="search" /> */}</i>
                        </Link>
                        <div
                          className={`${
                            change === true
                              ? "togglesearch d-block"
                              : "togglesearch d-none"
                          }`}
                        >
                          <form action={`${config}/patient/search-doctor1`}>
                            <div className="input-group">
                              <input type="text" className="form-control" />
                              <button type="submit" className="btn">
                                Search
                              </button>
                            </div>
                          </form>
                        </div>
                      </li>
                      <li className="login-link">
                        <Link to="/login">Login / Signup</Link>
                      </li>
                      {!pathnames.includes("/index-13") &&
                        !pathnames.includes("/index-5") &&
                        !pathnames.includes("/index-6") &&
                        !pathnames.includes("/index-7") &&
                        !pathnames.includes("/index-8") &&
                        !pathnames.includes("/index-9") &&
                        !pathnames.includes("/index-4") &&
                        !pathnames.includes("/index-10") &&
                        !pathnames.includes("/index-2") &&
                        !pathnames.includes("/index-11") && (
                          // <div
                          //   style={{
                          //     visibility: pathnames.includes(
                          //       "/Pharmacy/Pharmacy-index"
                          //     )
                          //       ? "hidden"
                          //       : "",
                          //   }}
                          // >
                          <>
                            {/* <li className="register-btn">
                              <Link to="/register" className="btn reg-btn">
                                <i>
                                  <FeatherIcon icon="user" />
                                </i>
                                Register
                              </Link>
                            </li> */}
                            {/* <li className="register-btn">
                              <Link
                                to="/login"
                                className="btn btn-primary log-btn"
                              >
                                <i>
                                  <FeatherIcon icon="lock" />
                                </i>
                                Login
                              </Link>
                            </li> */}
                          </>
                          // {/* </div> */}
                        )}
                    </>
                  ) : null}
                </ul>
              </div>
              {pathnames.includes("/index-6") ? (
                <ul className="nav header-navbar-rht">
                  <li className="nav-item">
                    <Link
                      className={`nav-link header-login ${
                        pathnames.includes("home6") ? "white-bg" : ""
                      }`}
                      to="/login"
                    >
                      <i className="me-2">
                        <FeatherIcon icon="lock" />
                      </i>
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link header-login btn-light-blue"
                      to="/login"
                    >
                      <i className="me-2">
                        <FeatherIcon icon="user" />
                      </i>
                      Login
                    </Link>
                  </li>
                </ul>
              ) : null}
              {pathnames.includes("/index-2") &&
              !pathnames.includes("/index-11") &&
              !pathnames.includes("/index-5") &&
              !pathnames.includes("/index-6") &&
              !pathnames.includes("/index-7") &&
              !pathnames.includes("/index-8") &&
              !pathnames.includes("/index-9") &&
              !pathnames.includes("/index-4") ? (
                <ul className="nav header-navbar-rht">
                  <li className="nav-item">
                    <Link
                      className={`nav-link header-login ${
                        pathnames.includes("home4") ? "white-bg" : ""
                      }`}
                      to="/login"
                    >
                      login / Signup
                    </Link>
                  </li>
                </ul>
              ) : null}

              {pathnames.includes("/index-5") ||
              pathnames.includes("/index-7") ||
              pathnames.includes("/index-9") ? (
                <ul className="nav header-navbar-rht">
                  {pathnames.includes("/index-11") ||
                  pathnames.includes("home7") ||
                  pathnames.includes("home9") ? (
                    <li className="searchbar searchbar-fourteen me-2">
                      <Link to="#">
                        <i>
                          <FeatherIcon icon="search" />
                        </i>
                      </Link>
                      <div className="togglesearch">
                        <form action={`${config}/patient/search-doctor1`}>
                          <div className="input-group">
                            <input type="text" className="form-control" />
                            <button type="submit" className="btn btn-primary">
                              Search
                            </button>
                          </div>
                        </form>
                      </div>
                    </li>
                  ) : null}

                  <li
                    className={`${
                      pathnames.includes("/index-7") || "/index-9"
                        ? "login-in-fourteen"
                        : "register-btn"
                    }`}
                  >
                    <Link
                      to="/pages/login-email"
                      className={
                        pathnames === "/index-9"
                          ? "btn reg-btn"
                          : "btn log-btn" && pathnames === "/index-7"
                          ? "btn reg-btn"
                          : "btn log-btn"
                      }
                    >
                      <i className="me-2">
                        {pathnames.includes("home7") ? (
                          <FeatherIcon icon="user" />
                        ) : (
                          <FeatherIcon icon="lock" />
                        )}
                      </i>
                      Log In
                    </Link>
                  </li>
                  <li
                    className={`${
                      pathnames.includes("/index-7") || "/index-9"
                        ? "login-in-fourteen"
                        : "register-btn"
                    }`}
                  >
                    <Link
                      to="/signup"
                      className={`${
                        pathnames.includes("/index-7") || "/index-9"
                          ? "btn btn-primary reg-btn reg-btn-fourteen"
                          : "btn reg-btn"
                      }`}
                    >
                      <i className="me-2">
                        <FeatherIcon icon="user" />
                      </i>
                      Sign Up
                    </Link>
                  </li>
                </ul>
              ) : null}
              {(!pathnames.includes("/patient/search-doctor1") &&
                pathnames.includes("patient")) ||
              (pathnames.includes("Pharmacy") &&
                !pathnames.includes("/Pharmacy/Pharmacy-index")) ? (
                <>
              <ul className="nav header-navbar-rht d-flex align-items-center">
  {/* Notification Icon */}
  <Notification />
  {/* <li className="nav-item">
    <div style={{ cursor: "pointer", marginRight: "15px" }}>
      <FeatherIcon icon="bell" size={24} color="black"/>
    </div>
  </li> */}

  {/* User Profile Dropdown */}
  <li  ref={dropdownRef} className={`nav-item dropdown has-arrow logged-item ${dropdownOpen ? "show" : ""}`}>
    <Link to="#" className="dropdown-toggle nav-link" 
        role="button" aria-expanded={dropdownOpen}
       onClick={toggleDropdown}>
      <span className="user-img">
        <img className="rounded-circle" src={patient_profile ? `${image_api}${patient_profile}` : pat_dummy} width="31" alt="priya"  onError={(e) => e.target.src = pat_dummy} />
      </span>
    </Link>
    <div className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`} style={{ top: "50px" }}>
      <div className="user-header">
        <div className="avatar avatar-sm">
          <img src={patient_profile ? `${image_api}${patient_profile}` : pat_dummy}  alt="User Image" className="avatar-img rounded-circle"  onError={(e) => e.target.src = pat_dummy} />
        </div>
        <div className="user-text">
          <h6>{patient_name}</h6>
          <p className="text-muted mb-0">Patient</p>
        </div>
      </div>
      <Link className="dropdown-item" to="/patient/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
      <Link className="dropdown-item" to="/patient/profile" onClick={() => setDropdownOpen(false)}>Profile Settings</Link>
      <button className="dropdown-item" onClick={handleLogout}>Logout</button>
    </div>
  </li>
</ul>
                   </>
              ) : pathnames.includes("doctor") &&
!pathnames.includes("/doctor/doctor-register") &&
!pathnames.includes("/patient/search-doctor1") &&
!pathnames.includes("/pages/doctor-signup") &&
!pathnames.includes("/doctor-blog") &&
!pathnames.includes("/doctor-edit-blog") &&
!pathnames.includes("/doctor-pending-blog") &&
!pathnames.includes("/blog/doctor-add-blog") ||
pathnames.includes("/doctor/my-patients") ? (
                <ul className="nav header-navbar-rht">
                  {/* <Chart /> */}
                  {/* <Notification /> */}
                  <DoctorNotification />
  <li  ref={dropdownRef} className={`nav-item dropdown has-arrow logged-item ${dropdownOpen ? "show" : ""}`}>
  <Link
                      to="#"
                      className="dropdown-toggle nav-link"
                      data-bs-toggle="dropdown"
                      role="button"
                      aria-expanded={dropdownOpen}
                    onClick={toggleDropdown}>
                      <span className="user-img">
                        <img
                          className="rounded-circle"
                          src={doc_profile && /\.(jpeg|jpg|png|webp)$/i.test(doc_profile) 
                            ? `${image_api}technical/${doc_profile}` 
                            : doctorpro}
                          width="31"
                          alt="Darren Elder"
                        />
                      </span>
                    </Link>
                    <div className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`} style={{ top: "50px" }}>
                    <div className="user-header">
                        <div className="avatar avatar-sm">
                          <img
                            src={doc_profile && /\.(jpeg|jpg|png|webp)$/i.test(doc_profile) 
                              ? `${image_api}technical/${doc_profile}` 
                              : doctorpro}
                            alt="User Image"
                            className="avatar-img rounded-circle"
                          />
                        </div>
                        <div className="user-text">
                          <h6>{profileDetails?.name || "Doctor"}</h6>
                          {
                            profileDetails?.is_available == 1 ? <p className="text-muted mb-0">Available</p> :
                            profileDetails?.is_available == 0 ? <p className="text-danger mb-0" style={{ color: "red"}}>UnAvailable</p> :
                            <p className="text-danger mb-0">No data</p>
                          }
                          
                        </div>
                      </div>
                      <Link className="dropdown-item" to="/doctor/doctor-dashboard" onClick={() => setDropdownOpen(false)}>
                        Dashboard
                      </Link>
                      <Link className="dropdown-item" to="/doctor/profile-setting" onClick={() => setDropdownOpen(false)}>
                        Profile Settings
                      </Link>
                      <Link
  className="dropdown-item"
  to="/login"
  onClick={() => {
    localStorage.clear();
    localStorage.removeItem("doc_profile");
    localStorage.removeItem("doc_token");
    setDropdownOpen(false);
  }}
>
  Logout
</Link>
                    </div>
                  </li>
                </ul>
              ) : null}
              {pathnames.includes("/index-8") ? (
                <ul className="nav header-navbar-rht">
                  <li className="login-link">
                    <Link to="/login">Login / Signup</Link>
                  </li>
                  <li className="login-in-fourteen">
                    <Link to="/pages/login-email" className="btn reg-btn">
                      Log In
                    </Link>
                  </li>
                  <li className="login-in-fourteen">
                    <Link to="/signup" className=" reg-btn-thirteen">
                      <span>Sign Up</span>
                      <div className="user-icon-header">
                        <i>
                          <FeatherIcon icon="user" />
                        </i>
                      </div>
                    </Link>
                  </li>
                </ul>
              ) : pathnames.includes("/index-10") ? (
                <ul className="nav header-navbar-rht">
                  <li className="login-link">
                    <Link to="/login">Login / Signup</Link>
                  </li>
                  <li className="login-in-fourteen">
                    <Link to="/pages/login-email" className="btn reg-btn">
                      <i className="me-2">
                        <FeatherIcon icon="video" />
                      </i>
                      Live Demo
                    </Link>
                  </li>
                  <li className="login-in-fourteen">
                    <Link
                      to="/signup"
                      className="btn btn-primary reg-btn reg-btn-fourteen"
                    >
                      <i className="me-2">
                        <FeatherIcon icon="shopping-cart" />
                      </i>
                      Buy Template
                    </Link>
                  </li>
                </ul>
              ) : null}
              {pathnames.includes("/index-11") ? (
                <ul className="nav header-navbar-rht">
                  <li className="login-link">
                    <Link to="/login">Login / Signup</Link>
                  </li>
                  <li className="login-in-sixteen">
                    <Link to="/pages/login-email" className="btn reg-btn">
                      <i className="me-2">
                        <FeatherIcon icon="lock" />
                      </i>
                      Login<span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </Link>
                  </li>
                  <li className="login-in-sixteen">
                    <Link
                      to="/signup"
                      className="btn btn-primary reg-btn reg-btn-sixteen"
                    >
                      <i className="me-2">
                        <FeatherIcon icon="user" />
                      </i>
                      Sign Up
                    </Link>
                  </li>
                </ul>
              ) : null}

              {pathnames.includes("/index-13") ? (
                <ul className="nav header-navbar-rht">
                  <li className="register-btn">
                    <Link to="/pages/login-email" className="btn log-btn">
                      <i className="feather-lock"></i>Login
                    </Link>
                  </li>
                  <li className="register-btn">
                    <Link to="/signup" className="btn reg-btn">
                      <i className="feather-user"></i>Sign Up
                    </Link>
                  </li>
                </ul>
              ) : null}

              {/* {pathnames == "/react/template/index-13" ? (
                <ul class="nav header-navbar-rht">
                  <li class="register-btn">
                    <Link to="/pages/login-email" class="btn log-btn">
                      <i class="feather-lock"></i>Login
                    </Link>
                  </li>
                  <li class="register-btn">
                    <Link to="/signup" class="btn reg-btn">
                      <i class="feather-user"></i>Sign Up
                    </Link>
                  </li>
                </ul>
              ) : null} */}
            </nav>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
