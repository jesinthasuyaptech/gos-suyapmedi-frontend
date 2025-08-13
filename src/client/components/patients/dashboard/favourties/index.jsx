import Footer from "../../../footer";
import Header from "../../../header.jsx";
import {
  doctor_thumb_13,
  doctor_thumb_14,
  doctor_thumb_15,
  doctor_thumb_16,
  doctor_thumb_17,
  doctor_thumb_18,
  doctor_thumb_19,
  doctor_thumb_20,
  doctor_thumb_21,
} from "../../../imagepath.jsx";
import DashboardSidebar from "../sidebar/sidebar.jsx";
import { Link } from "react-router-dom";
import StickyBox from "react-sticky-box";
import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import { var_api, image_api } from "../../../../../constant.js"
import { doc_dummy } from "../../../imagepath.jsx";

const Favourites = (props) => {
  const [isFavourite, setIsFavourite] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [isfavdocdetails, setfavdocdetails] = useState([]);
  const [visibleDoctors, setVisibleDoctors] = useState(7); // Initially show 7
  const hospital_address = localStorage.getItem("hospital_address");
  const hospital_state = localStorage.getItem("hospital_state");
  const hospital_country = localStorage.getItem("hospital_country");
  const [loading, setLoading] = useState(false);
  


   const fetchfavdoctor = async () => {
    setLoading(true);
        const token = localStorage.getItem("patient_token");
        const patient_id = localStorage.getItem("patient_id");
        const hospital_id = localStorage.getItem("Patient_HospitalId");
        
        try {
          const response = await axios.get(
            `${var_api}doctofavourite/doctor-favourites/get-patients/${hospital_id}/${patient_id}`,
            {
              headers: {
                Authorization: `${token}`, // Ensure proper format
              },
              
            }
          );
          setfavdocdetails(response.data.data);
          setIsFavourite(new Array(response.data.data.length).fill(true)); 
    
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Error fetching doctor details:", err);
          }
        } finally{
          setLoading(false);
        }
      };

  useEffect(() => {
    fetchfavdoctor();
    }, []);
    const filteredDoctors = isfavdocdetails.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayedDoctors = filteredDoctors.slice(0, visibleDoctors);

  // const toggleFavourite = (index) => {
  //   setIsFavourite((prevState) => {
  //     const updatedState = [...prevState];
  //     updatedState[index] = !updatedState[index];
  //     return updatedState;
  //   });
  // };

  const handleFavouriteToggle = async (doctorId, index) => {
    setLoading(true);
    const token = localStorage.getItem("patient_token");

    try {
      if (isFavourite[index]) {
        // Call DELETE API to remove from favourites
        const response = await axios.delete(`${var_api}doctofavourite/delete/${doctorId}`, {
          headers: {
            Authorization: `${token}`, // Ensure Bearer token format if required
          },
        });
  
      
          // Refresh the favourite doctor list
          fetchfavdoctor();
       
      }
    } catch (err) {
      console.error("Error updating favourite:", err);
    } finally{
          setLoading(false);
        }
  };
      // Refresh the favourite doctor list after update
      
 

  return (
    <div>
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
              <h2 className="breadcrumb-title">Favourites</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Favourites
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
                <h3>Favourites</h3>
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
                </ul>
              </div>
              {/* Favourites */}
              <div className="row">
  {displayedDoctors.length > 0 ? (
    displayedDoctors.map((doctor, index) => (
      <div key={doctor.id} className="col-md-6 col-lg-4">
        <div className="profile-widget patient-favour">
          <div className="fav-head">
          <Link
                to="#"
                className="fav-btn favourite-btn"
                onClick={() => handleFavouriteToggle(doctor.favourites_id, index)}
              >
                <span
                  className={`favourite-icon ${isFavourite[index] ? "favourite" : "favourite"}`}
                >
                  <i className="fa-solid fa-heart"></i>
                </span>
              </Link>
            <div className="doc-img">
              <Link to="/patient/doctor-profile">
                <img
                  className="img-fluid"
                  alt="User Image"
                  src={
                                                                                  typeof doctor.profile_image === 'string' && 
                                                                                  doctor.profile_image.trim() !== '' && 
                                                                                  /\.(jpeg|jpg|png|webp)$/i.test(doctor.profile_image) 
                                                                                    ? `${image_api}${doctor.profile_image}`
                                                                                    : doc_dummy
                                                                                }
                                                                                onError={(e) => e.target.src = doc_dummy} 
                />
              </Link>
            </div>
            <div className="pro-content">
              <h3 className="title">
                <Link to="/patient/doctor-profile">{doctor.name || "Dr. Unknown"}</Link>
                <i className="fas fa-check-circle verified" />
              </h3>
              <p className="speciality">
                {doctor.specialization ? ` ${doctor.specialization}` : "Doctor"}
              </p>
              {/* <div className="rating">
               
                {!doctor.rating && (
                  <>
                    <i className="fas fa-star filled" />
                    <i className="fas fa-star filled" />
                    <i className="fas fa-star filled" />
                    <i className="fas fa-star filled" />
                    <i className="fas fa-star" />
                    <span className="d-inline-block average-rating">5.0</span>
                  </>
                )}
              </div> */}
              <ul className="available-info">
                {/* <li>
                  <span>
                    <i className="fa-solid fa-calendar-day" />
                  </span>
                  Next Availability: {doctor.joining_date || "Not Available"}
                </li> */}
     
                <li>
                            <span>
                              <i className="fas fa-map-marker-alt" />
                            </span>
                            Location : {hospital_state},{hospital_country}
                          </li>
                          <li>
                  <span>
                    <i className="fa-solid fa-phone" />
                  </span>
                  Contact: {doctor.primary_mobile || "N/A"}
                  </li>
              
              </ul>
              {/* <div className="last-book">
                <p>Last Book on 21 Jan 2023</p>
              </div> */}
            </div>
          </div>
          <div className="fav-footer">
            <div className="row row-sm">
              {/* <div className="col-6">
                <Link to="/patient/doctor-profile" className="btn view-btn">
                  View Details
                </Link>
              </div> */}
              <div className="col-6">
                <Link 
                to={{
                  pathname: "/patient/booking2",
                  state: { doctor }, // Pass doctor object
                  
                }}
                className="btn book-btn">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No favorite doctors found</p>
  )}
              </div>
              

              {/* /Favourites */}
              {/* Load More Button */}
      {visibleDoctors < filteredDoctors.length && (
        <div className="col-md-12">
          <div className="loader-item text-center">
            <button
              onClick={() => setVisibleDoctors((prev) => prev + 5)}
              className="btn btn-load"
            >
              Load More
            </button>
          </div>
        </div>
      )}
            </div>
          </div>
        </div>
      </div>
      <Footer {...props} />
    </div>
  );
};

export default Favourites;
