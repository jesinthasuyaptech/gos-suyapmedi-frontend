import React, { useEffect, useState } from "react";
import { Link,useHistory  } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import { header_logo } from "../../imagepath";
import "../../../../admin/components/styles/Loader.css";
// Import the loader


const Home3Header = () => {
  const [headerClass, setHeaderClass] = useState(
    "header header-trans header-three header-eight"
  );
  const [Loading, setLoading] = useState(false)
  const history = useHistory(); // Initialize history

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        setHeaderClass("header header-trans header-three header-eight pharmacy-header");
      } else {
        setHeaderClass("header header-trans header-three header-eight");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onHandleMobileMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.add("menu-opened");
  };

  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
  };

    useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);  // Hide loader after 2 seconds (or replace with actual async task)
    }, 2000);
  }, []);

    const handleNavigation = (path, isExternal = false) => {
    setLoading(true);
    onhandleCloseMenu(); // Close mobile menu if open
    
    setTimeout(() => {
      if (isExternal) {
        // For external links (anchor tags with href)
        window.location.href = path;
      } else {
        // For internal navigation using history
        history.push(path);
      }
      setLoading(false);
    }, 500);
  };


  return (
    <>
      {Loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {/* Header */}
      <header className={headerClass}>
        <div className="container">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <Link id="mobile_btn" to="#" onClick={() => onHandleMobileMenu()}>
                <span className="bar-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </Link>
              <Link to="/" className="navbar-brand logo">
               <img
  src={header_logo}
  className="img-fluid"
  alt="Logo"
  style={{ width: "100px", height: "auto" }}  // Adjust width to 100px, height auto to maintain aspect ratio
/>
              </Link>
            </div>
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link to="/" className="menu-logo">
                  <img
  src={header_logo}
  className="img-fluid"
  alt="Logo"
  style={{ width: "100px", height: "auto" }}  // Adjust width to 100px, height auto to maintain aspect ratio
/>
                </Link>
                <Link id="menu_close" className="menu-close"  onClick={() => onhandleCloseMenu()} to="#">
                  <i className="fas fa-times" />
                </Link>
              </div>
              <ul className="main-nav">
                <li className="has-submenu megamenu active">
                  <Link to="#" style={{fontSize:"18px"}}>Home 
                  {/* <i className="fas fa-chevron-down" /> */}
                  </Link>
                  {/* <ul className="submenu mega-submenu">
                    <li>
                      <div className="megamenu-wrapper">
                        <div className="row">
                          <div className="col-lg-2">
                            <div className="single-demo ">
                              <div className="demo-img">
                                <Link to="/home-1" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-01.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-1" className="inner-demo-img">General Home 1</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-2" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-02.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-2" className="inner-demo-img">General Home 2</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo active">
                              <div className="demo-img">
                                <Link to="/home-3" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-03.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-3" className="inner-demo-img">General Home 3</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-5" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-04.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-5" className="inner-demo-img">Cardiology</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-6" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-05.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-6" className="inner-demo-img">Eyecare</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo ">
                              <div className="demo-img">
                                <Link to="/home-7" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-06.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-7" className="inner-demo-img">Veterinary</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-8" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-07.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-8" className="inner-demo-img">Pediatric</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-9" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-08.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-9" className="inner-demo-img">Fertility</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-10" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-09.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-10" className="inner-demo-img">ENT</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-11" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-10.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-11" className="inner-demo-img">Cosmetics</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-12" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-11.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-12" className="inner-demo-img">Lab Test</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/Pharmacy/Pharmacy-index" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-12.jpg" className="img-fluid" alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-12" className="inner-demo-img">Pharmacy</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-13" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-13.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-13" className="inner-demo-img">Home Care</Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-14" className="inner-demo-img"><ImageWithBasePath src="assets/img/home/home-14.jpg" className="img-fluid " alt="img" /></Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-14" className="inner-demo-img">Dentists</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul> */}
                </li>
                {/* <li className="has-submenu">
                  <Link to="/login"   onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/login");
                    }}>Doctors 
                  <i className="fas fa-chevron-down" />
                  </Link> */}
                  {/* <ul className="submenu">
                    <li><Link to="/doctor/doctor-dashboard">Doctor Dashboard</Link></li>
                    <li><Link to="/doctor/appointments">Appointments</Link></li>
                    <li><Link to="/doctor/available-timings">Available Timing</Link></li>
                    <li><Link to="/doctor/my-patients">Patients List</Link></li>
                    <li><Link to="/doctor/patient-profile">Patients Profile</Link></li>
                    <li><Link to="/doctor/chat-doctor">Chat</Link></li>
                    <li><Link to="/doctor/invoices">Invoices</Link></li>
                    <li><Link to="/doctor/profile-setting">Profile Settings</Link></li>
                    <li><Link to="/doctor/review">Reviews</Link></li>
                    <li><Link to="/doctor/doctor-register">Doctor Register</Link></li>
                    <li className="has-submenu">
                      <Link to="/doctor-blog">Blog</Link>
                      <ul className="submenu">
                        <li><Link to="/doctor-blog">Blog</Link></li>
                        <li><Link to="/blog/blog-details">Blog view</Link></li>
                        <li><Link to="/blog/doctor-add-blog">Add Blog</Link></li>
                      </ul>
                    </li>
                  </ul> */}
                {/* </li> */}
                {/* <li className="has-submenu">
                  <Link to="#">Patients <i className="fas fa-chevron-down" /></Link>
                  <ul className="submenu">
                    <li><Link to="/patient/dashboard">Patient Dashboard</Link></li>
                    <li className="has-submenu">
                      <Link to="#">Doctors</Link>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/patient/doctor-grid">Map Grid</Link></li>
                        <li><Link to="/patient/doctor-list">Map List</Link></li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Search Doctor</Link>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/patient/search-doctor1">Search Doctor 1</Link></li>
                        <li><Link to="/patient/search-doctor2">Search Doctor 2</Link></li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Doctor Profile</Link>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/patient/doctor-profile">Doctor Profile 1</Link></li>
                        <li><Link to="doctor-profile-2.html">Doctor Profile 2</Link></li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Booking</Link>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/patient/booking1">Booking 1</Link></li>
                        <li><Link to="/patient/booking2">Booking 2</Link></li>
                      </ul>
                    </li>
                    <li><Link to="/patient/checkout">Checkout</Link></li>
                    <li><Link to="/patient/booking-success">Booking Success</Link></li>
                    <li><Link to="/patient/favourites">Favourites</Link></li>
                    <li><Link to="/patient/patient-chat">Chat</Link></li>
                    <li><Link to="/patient/profile">Profile Settings</Link></li>
                    <li><Link to="/patient/change-password">Change Password</Link></li>
                  </ul>
                </li>
                <li className="has-submenu">
                  <Link to="#">Pharmacy <i className="fas fa-chevron-down" /></Link>
                  <ul className="submenu">
                    <li><Link to="/Pharmacy/Pharmacy-index">Pharmacy</Link></li>
                    <li><Link to="/Pharmacy/Pharmacy-details">Pharmacy Details</Link></li>
                    <li><Link to="/Pharmacy/pharmacy-search">Pharmacy Search</Link></li>
                    <li><Link to="/Pharmacy/product-all">Product</Link></li>
                    <li><Link to="/Pharmacy/product-description">Product Description</Link></li>
                    <li><Link to="/Pharmacy/cart">Cart</Link></li>
                    <li><Link to="/Pharmacy/product-checkout">Product Checkout</Link></li>
                    <li><Link to="/Pharmacy/payment-success">Payment Success</Link></li>
                    <li><Link to="/Pharmacy/pharmacy-register">Pharmacy Register</Link></li>
                  </ul>
                </li>
                <li className="has-submenu">
                  <Link to="#">Pages <i className="fas fa-chevron-down" /></Link>
                  <ul className="submenu">
                    <li><Link to="/pages/aboutus">About Us</Link></li>
                    <li><Link to="/pages/contactus">Contact Us</Link></li>
                    <li className="has-submenu">
                      <Link to="#">Call</Link>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/pages/voice-call">Voice Call</Link></li>
                        <li><Link to="/pages/video-call">Video Call</Link></li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Invoices</Link>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/doctor/invoices">Invoices</Link></li>
                        <li><Link to="/pages/invoice">Invoice View</Link></li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Authentication</Link>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/pages/login-email">Login Email</Link></li>
                        <li><Link to="/pages/login-phone">Login Phone</Link></li>
                        <li><Link to="/pages/doctor-signup">Doctor Signup</Link></li>
                        <li><Link to="/pages/patient-signup">Patient Signup</Link></li>
                        <li><Link to="/pages/forgot-password">Forgot Password 1</Link></li>
                        <li><Link to="/pages/forgot-password2">Forgot Password 2</Link></li>
                        <li><Link to="/pages/email-otp">Email OTP</Link></li>
                        <li><Link to="/pages/phone-otp">Phone OTP</Link></li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Error Pages</Link>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/pages/error-404">404 Error</Link></li>
                        <li><Link to="/pages/error-500">500 Error</Link></li>
                      </ul>
                    </li>
                    <li><Link to="/pages/blank-page">Starter Page</Link></li>
                    <li><Link to="/pages/pricing-plan">Pricing Plan</Link></li>
                    <li><Link to="/pages/faq">FAQ</Link></li>
                    <li><Link to="/pages/maintenance">Maintenance</Link></li>
                    <li><Link to="/pages/comingsoon">Coming Soon</Link></li>
                    <li><Link to="/pages/terms">Terms &amp; Condition</Link></li>
                    <li><Link to="/pages/privacy-policy">Privacy Policy</Link></li>
                    <li><Link to="/pages/component">Components</Link></li>
                  </ul>
                </li>
                <li className="has-submenu">
                  <Link to="#">Blog <i className="fas fa-chevron-down" /></Link>
                  <ul className="submenu">
                    <li><Link to="/blog/blog-list">Blog List</Link></li>
                    <li><Link to="/blog/blog-grid">Blog Grid</Link></li>
                    <li><Link to="/blog/blog-details">Blog Details</Link></li>
                  </ul>
                </li> */}
                <li className="has-submenu">
                  <a href="/admin/login"  onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/admin/login", true);
                    }}>Login 
                  {/* <i className="fas fa-chevron-down" /> */}
                  </a>
                  {/* <ul className="submenu">
                    <li><Link to="/admin" target="_blank">Admin</Link></li>
                    <li><Link to="/pharmacyadmin" target="_blank">Pharmacy Admin</Link></li>
                  </ul> */}
                </li>
                {/* <li className="has-submenu">
                  <Link to="#">Pharmacy </Link>
                  <a href="/pharmacyadmin/pharmacyLogin"   onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/pharmacyadmin/pharmacyLogin", true);
                    }}>Pharmacy 
                  <i className="fas fa-chevron-down" />
                  </a>
                </li> */}
                {/* <li className="has-submenu">
                  <Link to="#">Pharmacy </Link>
                  <a href="/patient/patientlogin">Patient 
                  <i className="fas fa-chevron-down" />
                  </a>
                </li> */}
                {/* <li className="login-link">
                  <Link to="/login">Signup</Link>
                </li> */}
              </ul>
            </div>
            <ul className="nav header-navbar-rht">
              <li className="contact-item"><i className="fa-solid fa-phone" /><span>Contact :</span>+91 807 230 7889</li>
              {/* <li className="nav-item">
                <Link className="nav-link header-login" to="/login"><ImageWithBasePath src="assets/img/icons/user-circle.svg" alt="img" />Sign up </Link>
                <Link className="nav-link header-login" to="/register"><ImageWithBasePath src="assets/img/icons/user-circle.svg" alt="img" /> Hospital Register </Link>
              </li> */}
            </ul>
          </nav>
        </div>
      </header>
      {/* /Header */}
    </>
  );
};

export default Home3Header;
