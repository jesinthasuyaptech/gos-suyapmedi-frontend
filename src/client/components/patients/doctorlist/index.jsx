import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useHistory } from "react-router-dom";

import { IMG01, IMG02, IMG03, IMG05, IMG10, IMG11, IMG12, IMG13 } from "./img";
import Map from "../doctorgrid/map";
import Header from "../../header";
import MyComponent from "../../pages/searchdoctor/searchList/mycomponent";
import { notification } from "antd";
import { doc_dummy, doctor_thumb_21 } from "../../imagepath";
import { var_api, image_api } from "../../../../constant";
import axios from "axios";
import { Tooltip } from "bootstrap";


const data = [
  {
    id: 1,
    doc_name: "Ruby Perrin",
    speciality: "Digital Marketer",
    address: "Florida, USA",
    next_available: "Available on Fri, 22 Mar",
    amount: "$300 - $1000",
    lat: -33.847927,
    lng: 150.6517938,
    icons: "default",
    profile_link: "/patient/doctor-profile",
    total_review: "17",
    image: IMG01,
  },
  {
    id: 2,
    doc_name: "Darren Elder",
    speciality: "Digital Marketer",
    address: "Newyork, USA",
    next_available: "Available on Fri, 23 Mar",
    amount: "$50 - $300",
    lat: -37.9722342,
    lng: 144.7729561,
    icons: "default",
    profile_link: "/patient/doctor-profile",
    total_review: "35",
    image: IMG02,
  },
  {
    id: 3,
    doc_name: "Deborah Angel",
    speciality: "UNIX, Calculus, Trigonometry",
    address: "Georgia, USA",
    next_available: "Available on Fri, 24 Mar",
    amount: "$100 - $400",
    lat: -31.9546904,
    lng: 112.8350292,
    icons: "default",
    profile_link: "/patient/doctor-profile",
    total_review: "27",
    image: IMG03,
  },
  {
    id: 4,
    doc_name: "Sofia Brient",
    speciality: "Computer Programming",
    address: "Louisiana, USA",
    next_available: "Available on Fri, 25 Mar",
    amount: "$150 - $250",
    lat: -32.9546904,
    lng: 115.8350292,
    icons: "default",
    profile_link: "/patient/doctor-profile",
    total_review: "4",
    image: IMG05,
  },
  {
    id: 5,
    doc_name: "Marvin Campbell",
    speciality: "ASP.NET,Computer Gaming",
    address: "Michigan, USA",
    next_available: "Available on Fri, 25 Mar",
    amount: "$50 - $700",
    lat: -34.9546904,
    lng: 125.8650292,
    icons: "default",
    profile_link: "/patient/doctor-profile",
    total_review: "66",
    image: IMG03,
  },
  {
    id: 6,
    doc_name: "Katharine Berthold",
    speciality: "Digital Marketer",
    address: "Texas, USA",
    next_available: "Available on Fri, 25 Mar",
    amount: "$100 - $500",
    lat: -35.9546904,
    lng: 153.8350292,
    icons: "default",
    profile_link: "/patient/doctor-profile",
    total_review: "52",
    image: IMG02,
  },
  {
    id: 7,
    doc_name: "Linda Tobin",
    speciality: "UNIX, Calculus, Trigonometry",
    address: "Kansas, USA",
    next_available: "Available on Fri, 25 Mar",
    amount: "$100 - $1000",
    lat: -36.9548904,
    lng: 105.8350292,
    icons: "default",
    profile_link: "/patient/doctor-profile",
    total_review: "43",
    image: IMG01,
  },
];

const DoctorList = (props) => {
  const [doctorsList, setDoctorList] = useState([]);
  const [doctorsFavs, setDoctorFavs] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const hospital_state = localStorage.getItem('hospital_state');
  const hospital_country = localStorage.getItem('hospital_country');
   const [isFavourite, setIsFavourite] = useState([
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);


    useEffect(() => {
      // Initialize Bootstrap tooltip
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new Tooltip(tooltipTriggerEl);
      });
    }, []);

     //add or delete favourites
    const toggleFavourite = (doctor) => {
      // setIsFavourite((prevState) => {
      //   const updatedState = [...prevState];
      //   updatedState[index] = !updatedState[index];
      //   return updatedState;
      // });
      setLoading(true);
      const isFav = doctorsFavs.some((fav) => fav.id == doctor.id);
      const favItem = doctorsFavs.find((fav) => fav.id == doctor.id);
    
      console.log("isf", isFav, favItem);
      const patient_id = localStorage.getItem('patient_id');
      const hospital_id = localStorage.getItem('Patient_HospitalId');

      if (isFav) {
        // Call DELETE API if already favorited
        axios.delete(`${var_api}doctofavourite/delete/${favItem.favourites_id}`)
          .then(() => {
            fetchPatientFavs();
            notification.success({
              message: "Success",
              description: "Favourite removed!",
            });
          })
          .catch(error => console.error("Error removing favourite:", error))
          .finally(() => setLoading(false)); // Stop loader
      } else {
        // Call POST API if not favorited
        axios.post(`${var_api}doctofavourite/post`, { doctor_id: doctor.id, patient_id: parseInt(patient_id), hospital_id: parseInt(hospital_id) })
          .then((response) => {
            fetchPatientFavs();
            notification.success({
              message: "Success",
              description: "Favourite Added!",
            });
          })
          .catch(error => console.error("Error adding favourite:", error))
          .finally(() => setLoading(false)); // Stop loader
      }
    };

  useEffect(() => {
    document.body.classList.add("map-page");

    return () => document.body.classList.remove("map-page");
  }, []);
  

  const options = [
    { value: "Select", label: "Select" },
    { value: "Rating", label: "Rating" },
    { value: "Popular", label: "Popular" },
    { value: "Lastest", label: "Lastest" },
    { value: "Free", label: "Free" },
  ];


  //doctors list
    const fetchDoctorsData = async () => {
      setLoading(true);
      const token = localStorage.getItem('patient_token');
      const hospital_id = localStorage.getItem('Patient_HospitalId');
     
  
      try {
        const response = await fetch(`${var_api}technicalstaff/getby-hospital/${hospital_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, 
          },
        });
        if (response.status === 401) {
                // history.push("/admin/login"); // Redirect to login page
                notification.warning({
                  message: "Unauthorized",
                  description: "Your session has expired. Please log in again.",
                });
              return;
              }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setDoctorList(result || null);
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


    //patients favourites list
    const fetchPatientFavs = async () => {
      setLoading(true);
      const token = localStorage.getItem('patient_token');
      const hospital_id = localStorage.getItem('Patient_HospitalId');
      const patient_id = localStorage.getItem('patient_id');
  
      try {
        const response = await fetch(`${var_api}doctofavourite/doctor-favourites/get-patients/${hospital_id}/${patient_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, 
          },
        });
        if (response.status === 401) {
                // history.push("/admin/login"); // Redirect to login page
                notification.warning({
                  message: "Unauthorized",
                  description: "Your session has expired. Please log in again.",
                });
              return;
              }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setDoctorFavs(result.data || null);
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
      fetchDoctorsData();
      fetchPatientFavs();
    }, []);
    

  return (
    <>
      <Header {...props} />
      <div className="content top-space">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12 col-lg-12 order-md-last order-sm-last order-last map-left">
              <div className="row align-items-center mb-4">
                <div className="col-md-6 col">
                  <h4>{doctorsList?.length} Doctors found</h4>
                </div>
                <div className="col-md-6 col-auto">
                  <div className="view-icons">
                    {/* <Link
                      to="/patient/doctor-grid"
                      className="grid-view active"
                    >
                      <i className="fas fa-th-large"></i>
                    </Link> */}
                    <Link to="/patient/dashboard" className="list-view" 
                    // data-bs-toggle="tooltip" title="Dashboard"  data-bs-placement="top"
                    >
                      {/* <i className="fas fa-bars"></i> */}
                      <i className="fas fa-house"></i>
                    </Link>
                   
                  </div>
                  {/* <div className="sort-by d-sm-block d-none">
                    <span className="sortby-fliter">
                      <Select options={options} />
                    </span>
                  </div> */}
                </div>
              </div>
               
              
                <div className="row">
                {
                doctorsList.map((doctor, index) => {
                  const isFav = doctorsFavs.some((fav) => fav.id == doctor.id);
                  return (
                              <div className="col-md-6 col-lg-3" key={index}>
                                <div className="profile-widget patient-favour">
                                  <div className="fav-head">
                                    <Link
                                      to="#"
                                      className="fav-btn favourite-btn"
                                      onClick={() => toggleFavourite(doctor)}
                                    >
                                      <span
                                        className={`favourite-icon ${
                                          isFav ? "favourite" : ""
                                        }`}
                                      >
                                        <i className="fa-solid fa-heart"></i>
                                      </span>
                                    </Link>
                                    <div className="doc-img">
                                      {/* <Link to="/patient/doctor-profile"> */}
                                      <img  src={
                                                                typeof doctor.profile_image === 'string' && 
                                                                doctor.profile_image.trim() !== '' && 
                                                                /\.(jpeg|jpg|png|webp)$/i.test(doctor.profile_image) 
                                                                  ? `${image_api}${doctor.profile_image}`
                                                                  : doc_dummy
                                                              } className="img-fluid" alt="User"  onError={(e) => e.target.src = doc_dummy} />
                                      {/* </Link> */}
                                    </div>
                                    <div className="pro-content">
                                      <h3 className="title">
                                        <Link to="/patient/doctor-profile">
                                          Dr. {doctor.name}
                                        </Link>
                                        <i className="fas fa-check-circle verified" />
                                      </h3>
                                      <p className="speciality">
                                      {doctor.qualification}, <br/>{doctor.specialization}
                                      </p>
                                      <div className="rating">
                                      <span className="d-inline-block average-rating" style={{fontSize:"18px"}}>
  {(doctor.average_rating || 0).toFixed(1)}
  </span> {" "}
  {Array.from({ length: 5 }, (_, index) => (
    <i
      key={index}
      className={`fas fa-star ${index < Math.floor(doctor.average_rating) ? 'filled' : ''}`}
    />
  ))}
 
</div>
                                      <ul className="available-info">
                                        {/* <li>
                                          <span>
                                            <i className="fa-solid fa-calendar-day" />
                                          </span>
                                          Next Availability : 23 Mar 2024
                                        </li> */}
                                        <li>
                                          <span>
                                            <i className="fas fa-map-marker-alt" />
                                          </span>
                                          Location : {hospital_state},  {hospital_country}
                                        </li>
                                      </ul>
                                      {/* <div className="last-book">
                                        <p>Last Book on 21 Jan 2023</p>
                                      </div> */}
                                    </div>
                                  </div>
                                  <div className="fav-footer">
                                    <div className="row row-sm">
                                      <div className="col-6">
                                        {/* <Link
                                          to="/patient/doctor-profile"
                                          className="btn view-btn"
                                        >
                                          View Details
                                        </Link> */}
                                      </div>
                                      <div className="col-6">
                                        <Link 
                                       to={{
                                        pathname: "/patient/booking2",
                                        state: { doctor }, // Pass doctor object
                                        
                                      }}
                                        className="btn book-btn"
                                        onClick={() => localStorage.setItem("doctor", JSON.stringify(doctor))}
                                        >
                                          Book Now
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                 );
                })}
                              </div>
              {/* {
                doctorsList.map((doctor, index) => (
                  <div className="card" key={index}>
                <div className="card-body">
                  <div className="doctor-widget">
                    <div className="doc-info-left">
                      <div className="doctor-img">
                        <Link to="/patient/doctor-profile">
                        
                          <img  src={
                                                                typeof doctor.profile_image === 'string' && 
                                                                doctor.profile_image.trim() !== '' && 
                                                                /\.(jpeg|jpg|png|webp)$/i.test(doctor.profile_image) 
                                                                  ? `${image_api}${doctor.profile_image}`
                                                                  : doc_dummy
                                                              } className="img-fluid" alt="User" />
                        </Link>
                      </div>
                      <div className="doc-info-cont">
                        <h4 className="doc-name">
                          <Link to="/patient/doctor-profile">
                            Dr. {doctor.name}
                          </Link>
                        </h4>
                        <p className="doc-speciality">
                          {doctor.qualification}
                        </p>
                        <h5 className="doc-department">
                          <img
                            src={IMG10}
                            className="img-fluid"
                            alt="Speciality"
                          />
                          {doctor.specialization}
                        </h5>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                        
                        </div>
                        <div className="clinic-details">
                          <p className="doc-location">
                            <i className="fas fa-map-marker-alt"></i> {hospital_state}, {' '}
                            {hospital_country}
                          </p>
                          <div>
                            
                          </div>
                        </div>
                      
                      </div>
                    </div>
                    <div className="doc-info-right">
                    
                      <div className="clinic-booking">
                       
                        <Link className="apt-btn" onClick={() => localStorage.setItem("doctor", JSON.stringify(doctor))}  to={{
    pathname: "/patient/booking2",
    state: { doctor }, // Pass doctor object
    
  }}>
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                ))
              } */}
              


              {/* <div className="card">
                <div className="card-body">
                  <div className="doctor-widget">
                    <div className="doc-info-left">
                      <div className="doctor-img">
                        <Link to="/patient/doctor-profile">
                          <img src={IMG02} className="img-fluid" alt="User" />
                        </Link>
                      </div>
                      <div className="doc-info-cont">
                        <h4 className="doc-name">
                          <Link to="/patient/doctor-profile">
                            Dr. Darren Elder
                          </Link>
                        </h4>
                        <p className="doc-speciality">
                          BDS, MDS - Oral & Maxillofacial Surgery
                        </p>
                        <h5 className="doc-department">
                          <img
                            src={IMG10}
                            className="img-fluid"
                            alt="Speciality"
                          />
                          Dentist
                        </h5>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating ms-1">
                            (35)
                          </span>
                        </div>
                        <div className="clinic-details">
                          <p className="doc-location">
                            <i className="fas fa-map-marker-alt"></i> Newyork,
                            USA
                          </p>
                          <div>
                            <MyComponent />
                          </div>
                        </div>
                        <div className="clinic-services">
                          <span>Dental Fillings</span>
                          <span> Whitneing</span>
                        </div>
                      </div>
                    </div>
                    <div className="doc-info-right">
                      <div className="clini-infos">
                        <ul>
                          <li>
                            <i className="far fa-thumbs-up"></i> 100%
                          </li>
                          <li>
                            <i className="far fa-comment"></i> 35 Feedback
                          </li>
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Newyork,
                            USA
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $50 - $300{" "}
                            <i
                              className="fas fa-info-circle"
                              data-bs-toggle="tooltip"
                              title="Lorem Ipsum"
                            ></i>
                          </li>
                        </ul>
                      </div>
                      <div className="clinic-booking">
                        <Link
                          className="view-pro-btn"
                          to="/patient/doctor-profile"
                        >
                          View Profile
                        </Link>
                        <Link className="apt-btn" to="/patient/booking1">
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="doctor-widget">
                    <div className="doc-info-left">
                      <div className="doctor-img">
                        <Link to="/patient/doctor-profile">
                          <img src={IMG03} className="img-fluid" alt="User" />
                        </Link>
                      </div>
                      <div className="doc-info-cont">
                        <h4 className="doc-name">
                          <Link to="/patient/doctor-profile">
                            Dr. Deborah Angel
                          </Link>
                        </h4>
                        <p className="doc-speciality">
                          MBBS, MD - General Medicine, DNB - Cardiology
                        </p>
                        <p className="doc-department">
                          <img
                            src={IMG11}
                            className="img-fluid"
                            alt="Speciality"
                          />
                          Cardiology
                        </p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating ms-1">
                            (27)
                          </span>
                        </div>
                        <div className="clinic-details">
                          <p className="doc-location">
                            <i className="fas fa-map-marker-alt"></i> Georgia,
                            USA
                          </p>
                          <div>
                            <MyComponent />
                          </div>
                        </div>
                        <div className="clinic-services">
                          <span>Dental Fillings</span>
                          <span> Whitneing</span>
                        </div>
                      </div>
                    </div>
                    <div className="doc-info-right">
                      <div className="clini-infos">
                        <ul>
                          <li>
                            <i className="far fa-thumbs-up"></i> 99%
                          </li>
                          <li>
                            <i className="far fa-comment"></i> 35 Feedback
                          </li>
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Newyork,
                            USA
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $100 -
                            $400{" "}
                            <i
                              className="fas fa-info-circle"
                              data-bs-toggle="tooltip"
                              title="Lorem Ipsum"
                            ></i>
                          </li>
                        </ul>
                      </div>
                      <div className="clinic-booking">
                        <Link
                          className="view-pro-btn"
                          to="/patient/doctor-profile"
                        >
                          View Profile
                        </Link>
                        <Link className="apt-btn" to="/patient/booking1">
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="doctor-widget">
                    <div className="doc-info-left">
                      <div className="doctor-img">
                        <Link to="/patient/doctor-profile">
                          <img src={IMG05} className="img-fluid" alt="User" />
                        </Link>
                      </div>
                      <div className="doc-info-cont">
                        <h4 className="doc-name">
                          <Link to="/patient/doctor-profile">
                            Dr. Sofia Brient
                          </Link>
                        </h4>
                        <p className="doc-speciality">
                          MBBS, MS - General Surgery, MCh - Urology
                        </p>
                        <p className="doc-department">
                          <img
                            src={IMG12}
                            className="img-fluid"
                            alt="Speciality"
                          />
                          Urology
                        </p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating ms-1">
                            (4)
                          </span>
                        </div>
                        <div className="clinic-details">
                          <p className="doc-location">
                            <i className="fas fa-map-marker-alt"></i> Louisiana,
                            USA
                          </p>
                          <div>
                            <MyComponent />
                          </div>
                        </div>
                        <div className="clinic-services">
                          <span>Dental Fillings</span>
                          <span> Whitneing</span>
                        </div>
                      </div>
                    </div>
                    <div className="doc-info-right">
                      <div className="clini-infos">
                        <ul>
                          <li>
                            <i className="far fa-thumbs-up"></i> 97%
                          </li>
                          <li>
                            <i className="far fa-comment"></i> 4 Feedback
                          </li>
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Newyork,
                            USA
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $150 -
                            $250{" "}
                            <i
                              className="fas fa-info-circle"
                              data-bs-toggle="tooltip"
                              title="Lorem Ipsum"
                            ></i>
                          </li>
                        </ul>
                      </div>
                      <div className="clinic-booking">
                        <Link
                          className="view-pro-btn"
                          to="/patient/doctor-profile"
                        >
                          View Profile
                        </Link>
                        <Link className="apt-btn" to="/patient/booking1">
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="doctor-widget">
                    <div className="doc-info-left">
                      <div className="doctor-img">
                        <Link to="/patient/doctor-profile">
                          <img src={IMG05} className="img-fluid" alt="User" />
                        </Link>
                      </div>
                      <div className="doc-info-cont">
                        <h4 className="doc-name">
                          <Link to="/patient/doctor-profile">
                            Dr. Katharine Berthold
                          </Link>
                        </h4>
                        <p className="doc-speciality">
                          MS - Orthopaedics, MBBS, M.Ch - Orthopaedics
                        </p>
                        <p className="doc-department">
                          <img
                            src={IMG13}
                            className="img-fluid"
                            alt="Speciality"
                          />
                          Orthopaedics
                        </p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating ms-1">
                            (52)
                          </span>
                        </div>
                        <div className="clinic-details">
                          <p className="doc-location">
                            <i className="fas fa-map-marker-alt"></i> Texas, USA
                          </p>
                          <div>
                            <MyComponent />
                          </div>
                        </div>
                        <div className="clinic-services">
                          <span>Dental Fillings</span>
                          <span> Whitneing</span>
                        </div>
                      </div>
                    </div>
                    <div className="doc-info-right">
                      <div className="clini-infos">
                        <ul>
                          <li>
                            <i className="far fa-thumbs-up"></i> 100%
                          </li>
                          <li>
                            <i className="far fa-comment"></i> 52 Feedback
                          </li>
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Texas, USA
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $100 -
                            $500{" "}
                            <i
                              className="fas fa-info-circle"
                              data-bs-toggle="tooltip"
                              title="Lorem Ipsum"
                            ></i>
                          </li>
                        </ul>
                      </div>
                      <div className="clinic-booking">
                        <Link
                          className="view-pro-btn"
                          to="/patient/doctor-profile"
                        >
                          View Profile
                        </Link>
                        <Link className="apt-btn" to="/patient/booking1">
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="load-more text-center">
                <Link to="#0" className="btn btn-primary btn-sm">
                  Load More
                </Link>
              </div> */}
            </div>


            {/* <div className="col-xl-5 col-lg-12 map-right grid-list-map">
              <div id="map" className="map-listing">
                <div style={{ height: "100vh", width: "100%" }}>
                  <Map
                    places={data}
                    center={{ lat: -24.9923319, lng: 135.2252427 }}
                  />
                </div>
              </div>
            </div> */}

            
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorList;
