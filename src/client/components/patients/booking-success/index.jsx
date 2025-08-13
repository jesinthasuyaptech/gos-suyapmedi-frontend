import React from "react";
import { Link } from "react-router-dom";
import Header from "../../header";
import Footer from "../../footer";

const BookingSuccess = (props) => {
  const resultData = localStorage.getItem("appoitnment_result");
    const parsedData = JSON.parse(resultData); // Parse the JSON string
    console.log("rr", parsedData, parsedData.tech_name); // Now you can access tech_name

  return (
    <>
      <Header {...props} />
      {/* // <!-- Breadcrumb --> */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Booking</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Booking
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* // <!-- /Breadcrumb -->       */}
      <div className="content success-page-cont">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card success-card">
                <div className="card-body">
                  <div className="success-cont">
                    <i className="fas fa-check"></i>
                    <h3>Appointment booked Successfully!</h3>
                    <p>
                      Appointment booked with <strong>Dr. {parsedData?.tech_name}</strong>
                      <br /> on <strong>{parsedData?.appointment_day} {parsedData?.slot_time}</strong>
                    </p>
                    <Link
                      to="/patient/dashboard"
                      className="btn btn-primary view-inv-btn"
                    >
                      Finish
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer {...props} />
    </>
  );
};

export default BookingSuccess;
