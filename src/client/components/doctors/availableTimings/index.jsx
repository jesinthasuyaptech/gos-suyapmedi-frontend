import React, { useState, useEffect } from "react";
import Header from "../../header";
import DoctorSidebar from "../sidebar";
import DoctorFooter from "../../common/doctorFooter";
import { TimePicker } from "antd";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";
import "../../style/Loader.css";
import { var_api, image_api } from "../../../../constant";

const AvailableTimings = (props) => {
  const interval = [
    { label: "10 Minutes", value: "10 Minutes" },
    { label: "20 Minutes", value: "20 Minutes" },
    { label: "30 Minutes", value: "30 Minutes" },
  ];
  const duration = [
    { label: "30 Minutes", value: "30 Minutes" },
    { label: "1 hour", value: "1 hour" },
  ];
  const clinicList = [
    {
      label: "The Family Dentistry Clinic",
      value: "The Family Dentistry Clinic",
    },
    { label: "Dentistry Clinic", value: "Dentistry Clinic" },
  ];

  const [selectedTime, setSelectedTime] = useState();
  // const handleTimeChange = (value) => {
  //   setSelectedTime(value);
  // };
  const [selectedTimeEnd, setSelectedTimeEnd] = useState();
  // const handleTimeChangeEnd = (value) => {
  //   setSelectedTimeEnd(value);
  // };
  const hospital_id = localStorage.getItem("doc_hospital_id");
  const doc_id = localStorage.getItem("doctor_id");
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [formatstartTime, setFormatStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formatendTime, setFormatEndTime] = useState("");
  const [profileDetails, setProfileDetails] = useState(null);
// const [remarks, setRemarks] = useState("");
const [error, setError] = useState('');

const fetchDoctorDetails = async () => {
  setLoading(true);
  const token = localStorage.getItem("doc_token");
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
    setLoading(false);
    console.error("Error fetching doctor details:", err);
  }
  finally {
    setLoading(false);
  }
};

  useEffect(() => {
    // Determine the current day
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[new Date().getDay()]; // Get current day name in lowercase
    setActiveDay(currentDay); // Set the current day as active
    fetchDoctorDetails();
    fetchDayTimings(currentDay);
  }, []);


     //fetch medicines list
    const fetchDayTimings = async (currentDay) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
        if (!token) {
          throw new Error("Token not found. Please log in again.");
        }
         
        const response = await axios.get(
          `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${currentDay}`, // Replace with your API endpoint
          {
            headers: {
              Authorization: token,
            },
          }
        );
    const option = response.data;
    console.log("data", option);
        setTimings(option);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching medicine subcategories:", err);
      //   setError(err.message || "An error occurred.");
      }
      finally {
        setLoading(false);
      }
    };


    const handleTimeChange = (time) => {

      // Ensure `time` is a valid Day.js object
  if (!time || !time.isValid()) {
    setError("Please select a valid time.");
    return;
  }
  // Extract time in HH:mm:ss format
  const formattedTime = time.format("HH:mm:ss");
  console.log("Formatted Time:", formattedTime);
  setFormatStartTime(formattedTime); // Update the state with the formatted time
  setError(""); // Clear any previous errors
  setStartTime(time);
    };


    
    const handleTimeChangeEnd = (time) => {
      console.log("Time passed to handleTimeChangeEnd:", time);
  
      if (!time || !time.isValid()) {
        setError("Please select a valid time.");
        return;
      }
      const formattedTime = time.format("HH:mm");
      setFormatEndTime(formattedTime); // Update the state with the formatted time
      setError(""); // Clear any previous errors
      setEndTime(time);
    };
    
// const handleRemarksChange = (e) => {
//   setRemarks(e.target.value);
//   setError('');
// };



const handleSaveChanges = async () => {
  setLoading(true);
  if (!startTime || !endTime) {
    setError('required.');
    return;
  }
  const token = localStorage.getItem("doc_token");
  const payload = {
    hospital_id: parseInt(hospital_id),
    tec_staff_id: parseInt(doc_id),
    available_day: activeDay,
    available_from_time: formatstartTime,
    available_to_time: formatendTime
  };

  try {
    const response = await axios.post(`${var_api}availabledaytime/post`, payload, {
      headers: {
        "Authorization": token, // Add token to the headers
      }
    });
    fetchDayTimings(activeDay);
    if (response.status === 200 || response.status === 201) {
      console.log("Appointment saved successfully!");
      notification.warning({
        message: "success",
        description: "Appointment saved successfully!",
      });
      setStartTime('');
      setEndTime('');
      setError('');
    }
  } catch (error) {
    setLoading(false);
      // Handle the error response
      if (error.response && error.response.status === 400) {
        notification.error({
          message: "Duplicate Entry",
          description: error.response.data.message || 'Time range overlaps with an existing entry.',
        });
      
      }
    console.error("Error saving appointment:", error);
    console.log("Failed to save appointment. Please try again.");
  }
  finally {
    setLoading(false);
  }
};

//update function for switch
const handleSwitchChange = (e, slot) => {
  const isChecked = e.target.checked;
  const newStatus = isChecked ? 1 : 0;

  updateSlotStatus(slot, newStatus);
};


const updateSlotStatus = (slot, newStatus) => {

  const token = localStorage.getItem("doc_token");
  if (!token) {
    console.error("Token not found.");
    return;
  }

  const updatedData = {
    tec_staff_id: slot.tec_staff_id,
    available_day: slot.available_day,
    available_from_time: slot.available_from_time,
    available_to_time: slot.available_to_time,
    is_active: newStatus,
  };

  fetch(`${var_api}availabledaytime/update/${slot.id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Updated:", data);
      setActiveDay(slot.available_day); // This might be redundant
      fetchDayTimings(slot.available_day); // Refresh data
    })
    
    .catch((error) => console.error('Error updating slot:', error));
    
};






  return (
    <>
    <div className="main-wrapper">
      <Header profileDetails={profileDetails} 
 />
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
              <h2 className="breadcrumb-title">Available Timings</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Available Timings
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
                <h3>Available Timings</h3>
              </div>
              <div className="appointment-tabs">
                <ul className="nav">
                  <li className="nav-item" role="presentation">
                    <Link
                      className="nav-link active"
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#general-availability"
                    >
                      General Availability
                    </Link>
                  </li>
                  {/* <li className="nav-item" role="presentation">
                    <Link
                      className="nav-link"
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#clinic-availability"
                    >
                      Clinic Availability
                    </Link>
                  </li> */}
                </ul>
              </div>
              <div className="tab-content pt-0">
                {/* General Availability */}
                <div
                  className="tab-pane fade show active"
                  id="general-availability"
                >
                  <div className="card custom-card">
                    <div className="card-body">
                      <div className="card-header">
                        <h3>Select Available Slots</h3>
                      </div>
                      <div className="available-tab">
                        <label className="form-label">
                          Select Available days
                        </label>
                        <ul className="nav" style={{ display: 'flex', listStyle: 'none', padding: 0, gap: '10px' }}>
  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
    <li key={day} style={{ flex: '1', textAlign: 'center' }}>
      <Link
        to="#"
        className={`nav-link ${activeDay === day ? "active" : ""}`} // Apply active class
        onClick={() => {
          setActiveDay(day);  
          setTimeout(() => fetchDayTimings(day), 0); // Ensures fetch happens after state update
        }}
        data-bs-toggle="tab"
        data-bs-target={`#${day}`}
        style={{
          display: 'block',
          padding: '8px 12px',
          borderRadius: '5px',
          textDecoration: 'none',
          color: activeDay === day ? 'white' : 'black',
          backgroundColor: activeDay === day ? '#007bff' : 'transparent',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {day.charAt(0).toUpperCase() + day.slice(1)}
      </Link>
    </li>
  ))}


                          {/* <li>
                            <Link
                              to="#"
                              className={activeDay === "monday" ? "active" : ""}
                              data-bs-toggle="tab"
                              data-bs-target="#monday"
                            >
                              Monday
                            </Link>
                          </li>
                          <li>
                            <Link
                             className={activeDay === "tuesday" ? "active" : ""}
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#tuesday"
                            >
                              Tuesday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className={activeDay === "wednesday" ? "active" : ""}
                              data-bs-toggle="tab"
                              data-bs-target="#wedneday"
                            >
                              Wedneday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className={activeDay === "thursday" ? "active" : ""}
                              data-bs-toggle="tab"
                              data-bs-target="#thursday"
                            >
                              Thursday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className={activeDay === "friday" ? "active" : ""}
                              data-bs-toggle="tab"
                              data-bs-target="#friday"
                            >
                              Friday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className={activeDay === "saturday" ? "active" : ""}
                              data-bs-toggle="tab"
                              data-bs-target="#saturday"
                            >
                              Saturday
                            </Link>
                          </li>
                          <li>
                            <Link
                              className={activeDay === "sunday" ? "active" : ""}
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#sunday"
                            >
                              Sunday
                            </Link>
                          </li> */}
                        </ul>
                      </div>
                      <div className="tab-content pt-0">
                        {/* Slot */}
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
          (day) => (
                        <div key={day} className={`tab-pane ${activeDay === day ? "active show" : "fade"}`}  id={day}>
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>{day.charAt(0).toUpperCase() + day.slice(1)}</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                {/* <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li> */}
                              </ul>
                            </div>
                            <div className="slot-body">
                            {timings
            .map((slot,index) => (
              <div key={slot.id} className="slot-item">
                               {/* <h5>Slots {index+1}</h5> */}
                              <ul className="time-slots" style={{ listStyleType: "none", paddingLeft: "0" }}>
                              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Slot {index + 1}</span>
        
      </li>
                                <li>
                                  <i className="fa-regular fa-clock" />
                                  From Time: {slot.available_from_time}
                                </li>
                                {/* <li className="slot-space">Space : 2</li> */}
                                {/* <li>
                                  <i className="fa-regular fa-clock" />
                                 To Time
                                </li> */}
                                <li>
                                  <i className="fa-regular fa-clock" />
                                  To Time: {slot.available_to_time}
                                </li>
                                <li style={{ backgroundColor:"white" }}>
                    <div className="status-toggle" style={{ marginTop: "0px", paddingLeft: "0" }}>
                    <input
  id={`switch-${slot.id}`}
  className="check"
  type="checkbox"
  checked={slot.is_active === 1}
  onChange={(e) => handleSwitchChange(e, slot)}
/>
                      <label
                        htmlFor={`switch-${slot.id}`}
                        className="checktoggle checkbox-bg"
                        style={{ paddingLeft: "5px", margin:"0px" }} // Adjust the label if needed
                      >
                        checkbox
                      </label>
                    </div>
                  </li>
                              </ul>
                              {/* <div className="status-toggle">
                    <input
                      id={`switch-${slot.id}`}
                      className="check"
                      type="checkbox"
                      defaultChecked={slot.is_active === 1}
                      style={{
                        width: "10px",  // Adjust switch width
                        height: "10px", // Adjust switch height
                        display: "inline-block", // Ensure it stays inline
                      }}
                    />
                    <label htmlFor={`switch-${slot.id}`} className="checktoggle checkbox-bg">
                      checkbox
                    </label>
                  </div> */}
                </div>
            ))}
                              
                              {timings.length === 0 && (
            <p>No Slots Available</p>
          )}
        </div>
      </div>
    </div>
  ))}
                        {/* /Slot */}
                        {/* Slot */}
                        {/* <div className="tab-pane fade" id="tuesday">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Tuesday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div> */}
                        {/* /Slot */}
                        {/* Slot */}
                        {/* <div className="tab-pane fade" id="wednesday">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Wednesday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div> */}
                        {/* /Slot */}
                        {/* Slot */}
                        {/* <div className="tab-pane fade" id="thursday">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Thursday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div> */}
                        {/* /Slot */}
                        {/* Slot */}
                        {/* <div className="tab-pane fade" id="friday">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Friday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div> */}
                        {/* /Slot */}
                        {/* Slot */}
                        {/* <div className="tab-pane fade" id="saturday">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Saturday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div> */}
                        {/* /Slot */}
                        {/* Slot */}
                        {/* <div className="tab-pane fade" id="sunday">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Sunday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div> */}
                        {/* /Slot */}
                        {/* <div className="form-wrap">
                          <label className="col-form-label">
                            Appointment Fees ($)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={254}
                          />
                        </div> */}
                        {/* <div className="modal-btn text-end">
                          <Link to="#" className="btn btn-gray">
                            Cancel
                          </Link>
                          <button className="btn btn-primary prime-btn">
                            Save Changes
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /General Availability */}





















                {/* Clinic Availability */}
                <div className="tab-pane fade" id="clinic-availability">
                  <div className="clinic-wrap">
                    <h5>Select Clinic</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <Select options={clinicList} className="select-img" />
                      </div>
                    </div>
                  </div>
                  <div className="card custom-card">
                    <div className="card-body">
                      <div className="card-header">
                        <h3>Select Available Slots</h3>
                      </div>
                      <div className="available-tab">
                        <label className="form-label">
                          Select Available days
                        </label>
                        <ul className="nav">
                          <li>
                            <Link
                              to="#"
                              className="active"
                              data-bs-toggle="tab"
                              data-bs-target="#monday-slot"
                            >
                              Monday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#tuesday-slot"
                            >
                              Tuesday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#wedneday-slot"
                            >
                              Wedneday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#thursday-slot"
                            >
                              Thursday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#friday-slot"
                            >
                              Friday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#saturday-slot"
                            >
                              Saturday
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#sunday-slot"
                            >
                              Sunday
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="tab-content pt-0">
                        {/* Slot */}
                        <div className="tab-pane active show" id="monday-slot">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Monday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <ul className="time-slots">
                                <li>
                                  <i className="fa-regular fa-clock" />
                                  09:00 AM
                                </li>
                                <li>
                                  <i className="fa-regular fa-clock" />
                                  09:30 AM
                                </li>
                                {/* <li className="slot-space">Space : 2</li> */}
                                <li>
                                  <i className="fa-regular fa-clock" />
                                  10:30 AM
                                </li>
                                <li>
                                  <i className="fa-regular fa-clock" />
                                  11:00 AM
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* /Slot */}
                        {/* Slot */}
                        <div className="tab-pane fade" id="tuesday-slot">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Tuesday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div>
                        {/* /Slot */}
                        {/* Slot */}
                        <div className="tab-pane fade" id="wednesday-slot">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Wednesday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div>
                        {/* /Slot */}
                        {/* Slot */}
                        <div className="tab-pane fade" id="thursday-slot">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Thursday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div>
                        {/* /Slot */}
                        {/* Slot */}
                        <div className="tab-pane fade" id="friday-slot">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Friday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div>
                        {/* /Slot */}
                        {/* Slot */}
                        <div className="tab-pane fade" id="saturday-slot">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Saturday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div>
                        {/* /Slot */}
                        {/* Slot */}
                        <div className="tab-pane fade" id="sunday-slot">
                          <div className="slot-box">
                            <div className="slot-header">
                              <h5>Sunday</h5>
                              <ul>
                                <li>
                                  <Link
                                    to="#"
                                    className="add-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_slot"
                                  >
                                    Add Slots
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="del-slot"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_slot"
                                  >
                                    Delete All
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="slot-body">
                              <p>No Slots Available</p>
                            </div>
                          </div>
                        </div>
                        {/* /Slot */}
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Appointment Fees ($)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={254}
                          />
                        </div>
                        <div className="modal-btn text-end">
                          <Link
                            to="#"
                            className="btn btn-gray"
                            data-bs-toggle="modal"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </Link>
                          <button className="btn btn-primary prime-btn">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Clinic Availability */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter />
    </div>
     {/* Add Slots */}
     <div className="modal fade custom-modals" id="add_slot">
     <div className="modal-dialog modal-dialog-centered modal-lg">
       <div className="modal-content">
         <div className="modal-header">
           <h5 className="modal-title">Appointment Details</h5>
           <button
             type="button"
             className="btn-close"
             data-bs-dismiss="modal"
             aria-label="Close"
           >
             <i className="fa-solid fa-xmark" />
           </button>
         </div>
         <form>
           <div className="modal-body">
             <div className="timing-modal">
               <div className="row">
                 <div className="col-md-6">
                   <div className="form-wrap">
                     <label className="col-form-label">Start Time</label>

                     <TimePicker
                       value={startTime}
                       onChange={handleTimeChange}
                       className={`form-control timepicker1 ${error ? 'is-invalid' : ''}`}
                       placeholder="Time"
                     />
                     {error && <div className="error-message" style={{ color: 'red', fontSize:"13px",margin:"2px" }}>{error}</div>}
                   </div>
                 </div>
                 <div className="col-md-6">
                   <div className="form-wrap">
                     <label className="col-form-label">End Time</label>
                     <TimePicker
                       value={endTime}
                       onChange={handleTimeChangeEnd}
                       className={`form-control timepicker1 ${error ? 'is-invalid' : ''}`}
                       placeholder="Time"
                     />
                     {error && <div className="error-message" style={{ color: 'red', fontSize:"13px",margin:"2px" }}>{error}</div>}
                   </div>
                 </div>

                 {/* <div className="col-md-6">
                   <div className="form-wrap">
                     <label className="col-form-label">Remarks</label>
                     
                   </div>
                 </div>
                */}
                 {/* <div className="col-md-6">
                   <div className="form-wrap">
                     <label className="col-form-label">
                      Remarks
                     </label> */}

                     {/* <Select
                       options={interval}
                       className="select"
                       placeholder="10 Minutes"
                     /> */}
                     {/* <input
                                    type="text"
                                    className="form-control floating" value={remarks} onChange={handleRemarksChange}/>
                                    {error && <div className="error-message" style={{ color: 'red', fontSize:"13px",margin:"2px" }}>{error}</div>}
                   </div>
                 </div> */}
                 {/* <div className="col-md-6">
                   <div className="form-wrap">
                     <label className="col-form-label">
                       Appointment Durations
                     </label>

                     <Select
                       options={duration}
                       className="select"
                       placeholder="30 Minutes"
                     />
                   </div>
                 </div> */}
                 {/* <div className="col-md-12">
                   <div className="form-wrap mb-0">
                     <label className="col-form-label d-block">
                       Assign Appointment Spaces
                     </label>
                     <div className="custom-control form-check custom-control-inline">
                       <input
                         type="radio"
                         id="space1"
                         name="rating_option"
                         className="form-check-input"
                         defaultValue="price_free"
                         defaultChecked=""
                       />
                       <label className="form-check-label" htmlFor="space1">
                         Space 1
                       </label>
                     </div>
                     <div className="custom-control form-check custom-control-inline">
                       <input
                         type="radio"
                         id="space2"
                         name="rating_option"
                         className="form-check-input"
                         defaultValue="price_free"
                         defaultChecked=""
                       />
                       <label className="form-check-label" htmlFor="space2">
                         Space 2
                       </label>
                     </div>
                     <div className="custom-control form-check custom-control-inline">
                       <input
                         type="radio"
                         id="space3"
                         name="rating_option"
                         className="form-check-input"
                         defaultValue="price_free"
                         defaultChecked=""
                       />
                       <label className="form-check-label" htmlFor="space3">
                         Space 3
                       </label>
                     </div>
                     <div className="custom-control form-check custom-control-inline">
                       <input
                         type="radio"
                         id="space4"
                         name="rating_option"
                         className="form-check-input"
                         defaultValue="price_free"
                         defaultChecked=""
                       />
                       <label className="form-check-label" htmlFor="space4">
                         Space 4
                       </label>
                     </div>
                   </div>
                 </div> */}
               </div>
             </div>
           </div>
           <div className="modal-footer">
             <div className="modal-btn text-end">
               <Link
                 to="#"
                 className="btn btn-gray"
                //  data-bs-toggle="modal"
                 data-bs-dismiss="modal"
               >
                 Cancel
               </Link>
               <Link
                 to="#"
                 className="btn btn-primary prime-btn"
                 data-bs-dismiss="modal"
                 onClick={handleSaveChanges}
               >
                 Save Changes
               </Link>
             </div>
           </div>
         </form>
       </div>
     </div>
   </div>
   {/* /Add Slots */}
   {/* Remove Slots */}
   <div className="modal fade info-modal" id="delete_slot">
     <div className="modal-dialog modal-dialog-centered">
       <div className="modal-content">
         <div className="modal-body">
           <div className="success-wrap">
             <div className="success-info">
               <div className="text-center">
                 <span className="icon-success bg-red">
                   <i className="fa-solid fa-xmark" />
                 </span>
                 <h3>Remove Slots</h3>
                 <p>Are you sure you want to remove this slots?</p>
               </div>
             </div>
           </div>
           <div className="modal-btn text-center">
             <Link to="#" className="btn btn-gray" data-bs-dismiss="modal">
               Yes, Remove
             </Link>
             <button
               className="btn btn-primary prime-btn"
               data-bs-dismiss="modal"
             >
               No, i Changed my mind
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>
   {/* /Remove Slots */}
   </>
  );
};

export default AvailableTimings;
