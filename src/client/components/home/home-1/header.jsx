import React, { useState } from "react";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import { Link, useHistory  } from "react-router-dom";

const Home1Header = () => {
  const [searchField, setSearchField] = useState(false);

  const toggleSearch = () => {
    setSearchField(!searchField);
  };
  const history = useHistory();

  const directionPath = () => {
    history.push('/patient/search-doctor1')
  }


  return (
    <>
      <header className="header header-custom header-fixed header-one home-head-one">
        <div className="container">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <Link id="mobile_btn" to="#">
                <span className="bar-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </Link>
              <Link to="/" className="navbar-brand logo">
                <ImageWithBasePath
                  src="/assets/img/logo-01.svg"
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link to="/home-3" className="menu-logo">
                  <ImageWithBasePath
                    src="/assets/img/logo-01.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
                <Link id="menu_close" className="menu-close" to="#">
                  <i className="fas fa-times" />
                </Link>
              </div>
              <ul className="main-nav">
                <li className="has-submenu megamenu active">
                  <Link to="#">
                    Home <i className="fas fa-chevron-down" />
                  </Link>
                  <ul className="submenu mega-submenu">
                    <li>
                      <div className="megamenu-wrapper">
                        <div className="row">
                          <div className="col-lg-2">
                            <div className="single-demo active">
                              <div className="demo-img">
                                <Link to="/home-1" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-01.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-1" className="inner-demo-img">
                                  General Home 1
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-2" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-02.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-2" className="inner-demo-img">
                                  General Home 2
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-3" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="/assets/img/home/home-03.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-3" className="inner-demo-img">
                                  General Home 3
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-5" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-04.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-5" className="inner-demo-img">
                                  Cardiology
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-6" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-05.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-6" className="inner-demo-img">
                                  Eyecare
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo ">
                              <div className="demo-img">
                                <Link to="/home-7" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-06.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-7" className="inner-demo-img">
                                  Veterinary
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-8" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-07.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-8" className="inner-demo-img">
                                  Pediatric
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-9" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-08.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-9" className="inner-demo-img">
                                  Fertility
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-10" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-09.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-10" className="inner-demo-img">
                                  ENT
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-11" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-10.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-11" className="inner-demo-img">
                                  Cosmetics
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-12" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-11.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-12" className="inner-demo-img">
                                  Lab Test
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link
                                  to="/Pharmacy/Pharmacy-index"
                                  className="inner-demo-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/home/home-12.jpg"
                                    className="img-fluid"
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-12" className="inner-demo-img">
                                  Pharmacy
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-13" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-13.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-13" className="inner-demo-img">
                                  Home Care
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="single-demo">
                              <div className="demo-img">
                                <Link to="/home-14" className="inner-demo-img">
                                  <ImageWithBasePath
                                    src="assets/img/home/home-14.jpg"
                                    className="img-fluid "
                                    alt="img"
                                  />
                                </Link>
                              </div>
                              <div className="demo-info">
                                <Link to="/home-14" className="inner-demo-img">
                                  Dentists
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li className="has-submenu">
                  <Link to="#">
                    Doctors <i className="fas fa-chevron-down" />
                  </Link>
                  <ul className="submenu">
                    <li>
                      <Link to="/doctor/doctor-dashboard">
                        Doctor Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/doctor/appointments">Appointments</Link>
                    </li>
                    <li>
                      <Link to="/doctor/available-timings">
                        Available Timing
                      </Link>
                    </li>
                    <li>
                      <Link to="/doctor/my-patients">Patients List</Link>
                    </li>
                    <li>
                      <Link to="/doctor/patient-profile">Patients Profile</Link>
                    </li>
                    <li>
                      <Link to="/doctor/chat-doctor">Chat</Link>
                    </li>
                    <li>
                      <Link to="/doctor/invoices">Invoices</Link>
                    </li>
                    <li>
                      <Link to="/doctor/profile-setting">Profile Settings</Link>
                    </li>
                    <li>
                      <Link to="/doctor/review">Reviews</Link>
                    </li>
                    <li>
                      <Link to="/doctor/doctor-register">Doctor Register</Link>
                    </li>
                    <li className="has-submenu">
                      <Link to="/doctor-blog">Blog</Link>
                      <ul className="submenu">
                        <li>
                          <Link to="/doctor-blog">Blog</Link>
                        </li>
                        <li>
                          <Link to="/blog/blog-details">Blog view</Link>
                        </li>
                        <li>
                          <Link to="/blog/doctor-add-blog">Add Blog</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/* <li className="has-submenu">
                  <Link to="#">
                    Patients <i className="fas fa-chevron-down" />
                  </Link>
                  <ul className="submenu">
                    <li>
                      <Link to="/patient/dashboard">Patient Dashboard</Link>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Doctors</Link>
                      <ul className="submenu inner-submenu">
                        <li>
                          <Link to="/patient/doctor-grid">Map Grid</Link>
                        </li>
                        <li>
                          <Link to="/patient/doctor-list">Map List</Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Search Doctor</Link>
                      <ul className="submenu inner-submenu">
                        <li>
                          <Link to="/patient/search-doctor1">
                            Search Doctor 1
                          </Link>
                        </li>
                        <li>
                          <Link to="/patient/search-doctor2">
                            Search Doctor 2
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Doctor Profile</Link>
                      <ul className="submenu inner-submenu">
                        <li>
                          <Link to="/patient/doctor-profile">
                            Doctor Profile 1
                          </Link>
                        </li>
                        <li>
                          <Link to="doctor-profile-2.html">
                            Doctor Profile 2
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Booking</Link>
                      <ul className="submenu inner-submenu">
                        <li>
                          <Link to="/patient/booking1">Booking 1</Link>
                        </li>
                        <li>
                          <Link to="/patient/booking2">Booking 2</Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/patient/checkout">Checkout</Link>
                    </li>
                    <li>
                      <Link to="/patient/booking-success">Booking Success</Link>
                    </li>
                    <li>
                      <Link to="/patient/favourites">Favourites</Link>
                    </li>
                    <li>
                      <Link to="/patient/patient-chat">Chat</Link>
                    </li>
                    <li>
                      <Link to="/patient/profile">Profile Settings</Link>
                    </li>
                    <li>
                      <Link to="/patient/change-password">Change Password</Link>
                    </li>
                  </ul>
                </li>
                <li className="has-submenu">
                  <Link to="#">
                    Pharmacy <i className="fas fa-chevron-down" />
                  </Link>
                  <ul className="submenu">
                    <li>
                      <Link to="/Pharmacy/Pharmacy-index">Pharmacy</Link>
                    </li>
                    <li>
                      <Link to="/Pharmacy/Pharmacy-details">
                        Pharmacy Details
                      </Link>
                    </li>
                    <li>
                      <Link to="/Pharmacy/pharmacy-search">
                        Pharmacy Search
                      </Link>
                    </li>
                    <li>
                      <Link to="/Pharmacy/product-all">Product</Link>
                    </li>
                    <li>
                      <Link to="/Pharmacy/product-description">
                        Product Description
                      </Link>
                    </li>
                    <li>
                      <Link to="/Pharmacy/cart">Cart</Link>
                    </li>
                    <li>
                      <Link to="/Pharmacy/product-checkout">
                        Product Checkout
                      </Link>
                    </li>
                    <li>
                      <Link to="/Pharmacy/payment-success">
                        Payment Success
                      </Link>
                    </li>
                    <li>
                      <Link to="/Pharmacy/pharmacy-register">
                        Pharmacy Register
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="has-submenu">
                  <Link to="#">
                    Pages <i className="fas fa-chevron-down" />
                  </Link>
                  <ul className="submenu">
                    <li>
                      <Link to="/pages/aboutus">About Us</Link>
                    </li>
                    <li>
                      <Link to="/pages/contactus">Contact Us</Link>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Call</Link>
                      <ul className="submenu inner-submenu">
                        <li>
                          <Link to="/pages/voice-call">Voice Call</Link>
                        </li>
                        <li>
                          <Link to="/pages/video-call">Video Call</Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Invoices</Link>
                      <ul className="submenu inner-submenu">
                        <li>
                          <Link to="/doctor/invoices">Invoices</Link>
                        </li>
                        <li>
                          <Link to="/pages/invoice">Invoice View</Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Authentication</Link>
                      <ul className="submenu inner-submenu">
                        <li>
                          <Link to="/pages/login-email">Login Email</Link>
                        </li>
                        <li>
                          <Link to="/pages/login-phone">Login Phone</Link>
                        </li>
                        <li>
                          <Link to="/pages/doctor-signup">Doctor Signup</Link>
                        </li>
                        <li>
                          <Link to="/pages/patient-signup">Patient Signup</Link>
                        </li>
                        <li>
                          <Link to="/pages/forgot-password">
                            Forgot Password 1
                          </Link>
                        </li>
                        <li>
                          <Link to="/pages/forgot-password2">
                            Forgot Password 2
                          </Link>
                        </li>
                        <li>
                          <Link to="/pages/email-otp">Email OTP</Link>
                        </li>
                        <li>
                          <Link to="/pages/phone-otp">Phone OTP</Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <Link to="#">Error Pages</Link>
                      <ul className="submenu inner-submenu">
                        <li>
                          <Link to="/pages/error-404">404 Error</Link>
                        </li>
                        <li>
                          <Link to="/pages/error-500">500 Error</Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/pages/blank-page">Starter Page</Link>
                    </li>
                    <li>
                      <Link to="/pages/pricing-plan">Pricing Plan</Link>
                    </li>
                    <li>
                      <Link to="/pages/faq">FAQ</Link>
                    </li>
                    <li>
                      <Link to="/pages/maintenance">Maintenance</Link>
                    </li>
                    <li>
                      <Link to="/pages/comingsoon">Coming Soon</Link>
                    </li>
                    <li>
                      <Link to="/pages/terms">Terms &amp; Condition</Link>
                    </li>
                    <li>
                      <Link to="/pages/privacy-policy">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/pages/component">Components</Link>
                    </li>
                  </ul>
                </li>
                <li className="has-submenu">
                  <Link to="#">
                    Blog <i className="fas fa-chevron-down" />
                  </Link>
                  <ul className="submenu">
                    <li>
                      <Link to="/blog/blog-list">Blog List</Link>
                    </li>
                    <li>
                      <Link to="/blog/blog-grid">Blog Grid</Link>
                    </li>
                    <li>
                      <Link to="/blog/blog-details">Blog Details</Link>
                    </li>
                  </ul>
                </li> */}
                <li className="has-submenu">
                  <Link to="#">
                    Admin <i className="fas fa-chevron-down" />
                  </Link>
                  <ul className="submenu">
                    <li>
                      <Link to="/admin" target="_blank">
                        Admin
                      </Link>
                    </li>
                    <li>
                      <Link to="/pharmacyadmin" target="_blank">
                        Pharmacy Admin
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="searchbar">
                  <Link to="#" onClick={toggleSearch}>
                    <i className="feather icon-search" />
                  </Link>
                  <div
                    className={
                      searchField
                        ? "togglesearch d-block"
                        : "togglesearch d-none"
                    }
                  >
                    <form>
                      <div className="input-group">
                        <input type="text" className="form-control" />
                        <button type="submit" className="btn" onClick={directionPath}>
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                </li>
                <li className="login-link">
                  <Link to="/login">Login / Signup</Link>
                </li>
              </ul>
            </div>
            <ul className="nav header-navbar-rht">
              <li className="register-btn">
                <Link to="/register" className="btn reg-btn">
                  <i className="feather icon-user" />
                  Register
                </Link>
              </li>
              <li className="register-btn">
                <Link to="/login" className="btn btn-primary log-btn">
                  <i className="feather icon-lock" />
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Home1Header;
