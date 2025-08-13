import React from 'react'
import { app_icon_store, google_icon_play, logo, payment_icon_01, payment_icon_02, payment_icon_03, payment_icon_04 } from '../../imagepath'
import { Link } from 'react-router-dom';


const DoctorFooter = () => {
    return (
        <>
            {/* Footer Section */}
            <div className="footer pharmacy-footer">
                <div className="container">
                    <div className="top-footer">
                        <div className="footer-logo">
                            <Link to="/">
                                {/* <img src="/assets/img/logo-01.svg" alt="logo" /> */}
                                <img src={logo} alt="logo" style={{ width: "100px", height: "auto" }} />
                            </Link>
                        </div>
                        <div className="SuyapDoc-info">
                            <p>
                            SuyapMedi is one of India’s most trusted platforms for streamlining hospital operations and empowering doctor management.  
                            </p>
                        </div>
                    </div>
                    {/* <div className="mid-footer">
                        <div className="row">
                            <div className="col-xl-2 col-lg-3 col-md-4">
                                <div className="footer-links">
                                    <h4>Company</h4>
                                    <ul className="pages-links">
                                        <li>
                                            <Link to="/pages/aboutus">About SuyapDoc</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Customers Speak</Link>
                                        </li>
                                        <li>
                                            <Link to="#">In the News</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Career</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/contactus">Contact</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-3 col-md-4">
                                <div className="footer-links">
                                    <h4>Shopping</h4>
                                    <ul className="pages-links">
                                        <li>
                                            <Link to="#">Browse by A-Z</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Browse by Manufacturers</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Health Articles</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Offers / Coupons</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/faq">FAQs</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-3 col-md-4">
                                <div className="footer-links">
                                    <h4>Our Policies</h4>
                                    <ul className="pages-links">
                                        <li>
                                            <Link to="/pages/terms">Terms and Conditions</Link>
                                        </li>
                                        <li>
                                            <Link to="/pages/privacy-policy">Privacy Policy</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Fees and Payments</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Shipping and Delivery</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Return, Refund </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-3 col-md-4">
                                <div className="footer-links">
                                    <h4>Our Services</h4>
                                    <ul className="pages-links">
                                        <li>
                                            <Link to="#">Order Medicines</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Book Lab Tests</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Consult a Doctor</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Ayurveda Articles</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Careers</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-8">
                                <div className="footer-links">
                                    <h4>Subscribe to Newsletter</h4>
                                    <form action="#">
                                        <div className="input-block">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter Email Address"
                                            />
                                            <Link to="submit" className="submit-btn">
                                                Submit
                                            </Link>
                                        </div>
                                    </form>
                                    <div className="app-store-links">
                                        <Link to="#">
                                            <img src={app_icon_store} alt="Img" />
                                        </Link>
                                        <Link to="#">
                                            <img src={google_icon_play} alt="Img" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="mid-foot-two">
                        <div className="row align-items-center">
                            {/* <div className="col-md-6">
                                <ul className="payment-methods d-flex align-items-center">
                                    <li>
                                        <Link to="#">
                                            <img src={payment_icon_01} alt="Img" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <img src={payment_icon_02} alt="Img" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <img src={payment_icon_03} alt="Img" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <img src={payment_icon_04} alt="Img" />
                                        </Link>
                                    </li>
                                </ul>
                            </div> */}
                            {/* <div className="col-md-6">
                                <ul className="social-icons d-flex align-items-center">
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-facebook-f" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-twitter" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-linkedin-in" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-instagram" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="fa-brands fa-dribbble" />
                                        </Link>
                                    </li>
                                </ul>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="copy-right text-center">
                        <p>Copyright © 2024 SuyapDoc. All Rights Reserved</p>
                    </div>
                </div>
            </div>
            {/* /Footer Section */}
        </>

    )
}

export default DoctorFooter
