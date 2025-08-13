import React, {useEffect, useState} from "react";
import Header from "../../header";
import { Link, useLocation } from "react-router-dom";
import {
  appimg,
  devicemessage,
  doctor_01,
  googleimg,
  smartphone,
  todayicon,
} from "../../imagepath";
import Footer from "../../footer";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { var_api, image_api } from "../../../../constant";
import { doc_dummy } from "../../imagepath";
import { format } from "date-fns";
import axios from "axios";
import { notification } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Booking2 = (props) => {
  const location = useLocation();
  const [doctor, setDoctor] = useState(location.state?.doctor || JSON.parse(localStorage.getItem("doctor")));
  const hospital_name = localStorage.getItem("hospital_name");
  const hospital_mobile = localStorage.getItem("hospital_mobile");
  const futurebooking = localStorage.getItem("future_booking_daterange");
  const totalDays = 11; // Today + next 10 days
  const itemsPerPage = 6; // Show only 5 days at a time
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  // Generate the full date list
  const generateDates = () => {
    let today = new Date();
    const datesArray = [];

    for (let i = 0; i < futurebooking; i++) {
      let date = new Date();
      date.setDate(today.getDate() + i);

      datesArray.push({
        day: format(date, "EEEE"), // Full day name (Monday, Tuesday, etc.)
        date: format(date, "MMM d"), // Short date format (Sep 5)
      });
    }
    return datesArray;
  };
  const daysList = generateDates();
  const [startIndex, setStartIndex] = useState(0); // Track pagination index
  const [selectedDate, setSelectedDate] = useState(daysList[0]?.date || ""); // Default to first date
  const [dayOfWeek, setDayOfWeek] = useState(daysList[0]?.day || ""); // Default to first day
  const [settings, setSettings] = useState(null);
  const history = useHistory();
  const patientToken = localStorage.getItem("patient_token_no");
  const patientEmail = localStorage.getItem("patient_email");
  const booked_by_patient_email = localStorage.getItem("booked_by_patient_email") === "1";
  console.log("doc", JSON.parse(localStorage.getItem("doctor")));


  useEffect(() => {
    if (!doctor) {
      setDoctor(JSON.parse(localStorage.getItem("doctor"))); // Ensure doctor is retrieved
    }
  }, []);

  // Move forward (Next 1 day)
  const handleNext = () => {
    if (startIndex + 1 < totalDays - (itemsPerPage - 1)) { // Prevent scrolling beyond available dates
      setStartIndex(startIndex + 1);
    }
  };
  
  // Move backward (Previous 1 day)
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

 useEffect(() => {
   // Get today's day name (e.g., "Monday", "Tuesday")
   const todayDay = format(new Date(), "EEEE");
  fetchTimeSlots(todayDay);
  fetchSettingDetails();
   }, []);
 

  const fetchTimeSlots = async(selectedDay) => {
    setLoading(true);
    const token = localStorage.getItem("patient_token");
     try {
          // Construct the API URL
          const apiUrl = `${var_api}availabledaytime/getbydoc/${doctor?.hospital_id}/${doctor?.id}/${selectedDay}`;
      
          // Fetch data from the API
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: token, // Include token in the header
            },
          });
      
          // Filter the response data for active timings
          const activeDayTimings = response.data.filter((timing) => timing.is_active === 1);
          setTimeSlots(activeDayTimings); // Update state with active timings
      
          console.log("API Response:", response.data);
         
          
        } catch (error) {
          console.error("Error fetching data:", error);
          setTimeSlots([]); // Clear day timings in case of an error
        } finally{
          setLoading(false);
        }
  }


  const handleTimeClick = (time) => {
    console.log("time", time, doctor);
    setSelectedTime(time.available_from_time);
  };


  const shouldHideVitals = (settings) => {
    if (!settings || typeof settings !== "object") {
        console.warn("Settings object is invalid:", settings);
        return true; // Hide vitals by default
    }

    // Specify vital fields
    const vitalFields = [
        "after_sugar",
        "before_sugar",
        "bmi_value",
        "bp",
        "height",
        "pulse",
        "spo2",
        "temp",
        "weight",
    ];

    // Check only vital fields
    const areVitalsHidden = vitalFields.every((field) => settings[field] == 0);

    console.log("Vital fields are hidden:", areVitalsHidden);
    return areVitalsHidden;
};


  const bookAppointment = async () => {
    setLoading(true);
    const patient_id = localStorage.getItem('patient_id');
    
      if (!selectedDate || !selectedTime) {
        // notification.error({
        //   message: "Error",
        //   description: "please select Date and Time.",
        // });
        // alert('please select Date and Time.')
        notification.error({
          message: "Error",
          description: "please select Date and Time.!",
          placement: "bottomRight", // Moves the notification to the top right
          style: { zIndex: 9999 }, // Ensures it appears above everything
        });
        setLoading(false);
        return;
      }
    
      const appointmentDate = new Date(); 
      const dateObj = new Date(selectedDate + " " + new Date().getFullYear()); // Ensure full date
const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${dateObj.getFullYear()}`;


      const payload = {
        hospital_id: parseInt(doctor?.hospital_id),
        patient_id: patient_id , // From fetched patient details
        tech_id: parseInt(doctor?.id), // Doctor selected in dropdown
        payment_status: 0,
        booked_by: 0,
        status: 0, // Define appropriate status
        slot_time: selectedTime,
        appointment_time: selectedTime,
        appointment_day: formattedDate,
        referal_person: 0,
        is_other_referal: 0,
        other_referal_name:  "-",
        other_referal_mobile:  "-"
      };
  
    
      try {
        const token = localStorage.getItem("patient_token"); 
        const response = await fetch(`${var_api}appointment/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, // Ensure the token is set
          },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
          throw new Error('Failed to book appointment');
        }
  
        // setNotificationList((prevList) => [
        //   ...prevList,
        //   {
        //     id: response.appointmentId,
        //     token: response.token_no,
        //     date: response.appointment_date,
        //     time: response.slot_time,
        //     doctor: response.tech_name,
        //   },
        // ]);
    
        const result = await response.json();
        console.log('Appointment booked successfully:', result);
        localStorage.setItem("appoitnment_result", JSON.stringify(result));
        // notification.success({
        //   message: "Appointment Successful!",
        //   description: `Appointment booked for ${result.appointment_day} at slot ${result.slot_time} with ${result.tech_name}. Token No: ${result.token_no}`,
        // });
        notification.success({
          message: "Success",
          description: "Appointment Successfull!",
          placement: "bottomRight", // Moves the notification to the top right
          style: { zIndex: 9999 }, // Ensures it appears above everything
        });
        // alert("Appointment Successfull!")
       await handleHospitalNotify(result);
       await handleDoctorNotify(result);
       if (booked_by_patient_email) {
        await sendEmail(result?.appointmentId);
      }
  
        if (!shouldHideVitals(settings)) {
        // Get the appointment ID from the response
        const appointmentId = result.appointmentId;
    
        // Prepare the vital details payload
        const vitalDetailsPayload = {
          hospital_id: parseInt(doctor?.hospital_id),
          appoinment_id: appointmentId, // Pass the appointment ID from the response
          weight: 0.0, // double
          height: 0.0, // double
          bmi_value: 0.0, // double
          bp: 0.0, // double
          temp: 0.0, // double
          before_sugar: 0, // int(11)
          after_sugar: 0, // int(11)
          problem: "", // text
          diagnosis: "", // text
          note: "", // text
          pulse: 0, // text, nullable
          spo2: 0, // text, nullable
        };
  
        setSelectedDate(null);
        setSelectedTime(null);
  
      
    
        // Post the vital details API
        const vitalDetailsResponse = await fetch(`${var_api}vitaldetails/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`, // Ensure the token is set
          },
          body: JSON.stringify(vitalDetailsPayload),
        });
  
        if (!vitalDetailsResponse.ok) {
          throw new Error('Failed to post vital details');
        }
      
        const vitalDetailsResult = await vitalDetailsResponse.json();
        console.log('Vital details posted successfully:', vitalDetailsResult);
        // notification.success('Vital details posted successfully!');
        }
        setSelectedTime(null);
        history.push('/patient/booking-success');
      } catch (error) {
        console.error('Error booking appointment or posting vital details:', error);
        notification.error({
          message: "Error",
          description: "Failed to book appointment or post vital details.!",
          placement: "bottomRight", // Moves the notification to the top right
          style: { zIndex: 9999 }, // Ensures it appears above everything
        });
        // alert("Failed to book appointment or post vital details.!")
        // notification.error('');
      }finally{
        setLoading(false);
      }
    
    };

    
    //send email for apt success
    const sendEmail = async (aptId) => {

      const toemails = [patientEmail,doctor?.email_id]
      // Prepare the request body
      const requestData = {
        to: toemails,
        subject: "Appointment Confirmation",
        text: "Your appointment has been booked.",
      };
  
      try {
        const response = await axios.post(
          `${var_api}email-notify/apt-success/${aptId}/patient`,
          requestData
        );
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };
  


    //hospital notification post
    const handleHospitalNotify = async (result) => {
      const patient_id = localStorage.getItem('patient_id');
      const payload = {
        hospital_id: parseInt(doctor?.hospital_id),
        patient_id: patient_id,
        doc_id: parseInt(doctor?.id),
        title: `Patient ID: ${patientToken} - Appointment booked on ${result.appointment_day}`,
        description: ` ${patientToken} has booked an appointment on ${result.appointment_day} at ${result.slot_time}. APT Token No: ${result.token_no}.`,
        read_status: 0, // Unread status
      };
    
      const token = localStorage.getItem("patient_token");
    
      try {
        const apiUrl = `${var_api}hospitalnotification/add`;
        console.log("API URL:", apiUrl);
        console.log("Payload:", payload);
        console.log("Token:", token);
      
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        const result = await response.json();
        console.log("hospital Notification sent:", result);
        // alert("Notification sent successfully!");
      } catch (error) {
        console.error("Fetch error:", error);
        
        alert("Failed to send notification");
      }
      
    };


    //doctor notification post
    const handleDoctorNotify = async (result) => {
      const patient_id = localStorage.getItem('patient_id');
      const payload = {
        hospital_id: parseInt(doctor?.hospital_id),
        patient_id: patient_id,
        doc_id: parseInt(doctor?.id),
        title: `Patient ID: ${patientToken} - Appointment booked on ${result.appointment_day}`,
        description: ` ${patientToken} has booked an appointment on ${result.appointment_day} at ${result.slot_time}. APT Token No: ${result.token_no}.`,
        read_status: 0, // Unread status
      };
    
      const token = localStorage.getItem("patient_token");
    
      try {
        const apiUrl = `${var_api}doctornotification/add`;
        console.log("API URL:", apiUrl);
        console.log("Payload:", payload);
        console.log("Token:", token);
      
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        const result = await response.json();
        console.log("doctor Notification sent:", result);
        notification.success({
          message: "Success",
          description: "Notification sent successfully!",
          placement: "bottomRight", // Moves the notification to the top right
          style: { zIndex: 9999 }, // Ensures it appears above everything
        });
        // alert("Notification sent successfully!");
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to send notification");
      }
      
    };

    const formatDateToDDMMYYYY = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
    
      return `${day}-${month}-${year}`;
    };


     const fetchSettingDetails = async () => {
           setLoading(true);
          const token = localStorage.getItem('patient_token');
          const hospital_id = localStorage.getItem('Patient_HospitalId');
          try {
            const response = await fetch(`${var_api}settings/getby-hospital/${hospital_id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            });
            if (response.status === 401) {
              history.push("/admin/login"); // Redirect to login page
              // notification.warning({
              //   message: "Unauthorized",
              //   description: "Your session has expired. Please log in again.",
              // });
            return
            }
            if (!response.ok) throw new Error("Failed to fetch data");
            const result = await response.json();
            setSettings(result || {});
          
            console.log("oa", result)
          } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
            // notification.error({
            //   message: "Fetch Failed",
            //   description: "Unable to retrieve data. Please try again later.",
            // });
          } 
          finally {
            setLoading(false);
          }
        };
    



  return (
    <div className="main-wrapper">
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

      {/* Page Content */}
      <div className="content content-space">
        <div className="container">
          {/* Booking */}
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="booking-header">
                <h4 className="booking-title">Select Available Slots</h4>
              </div>
              {/* <div className="booking-date choose-date-book">
                <p>Choose Date</p>
                <div className="booking-range">
                  <div className="bookingrange btn">
                    <img src={todayicon} alt="icons" />
                    <span></span>
                    <div className="datepicker-icon">
                    <DateRangePicker
                    initialSettings={{
                      endDate: new Date("2020-08-11T12:30:00.000Z"),
                      ranges: {
                        "Last 30 Days": [
                          new Date("2020-07-12T04:57:17.076Z"),
                          new Date("2020-08-10T04:57:17.076Z"),
                        ],
                        "Last 7 Days": [
                          new Date("2020-08-04T04:57:17.076Z"),
                          new Date("2020-08-10T04:57:17.076Z"),
                        ],
                        "Last Month": [
                          new Date("2020-06-30T18:30:00.000Z"),
                          new Date("2020-07-31T18:29:59.999Z"),
                        ],
                        "This Month": [
                          new Date("2020-07-31T18:30:00.000Z"),
                          new Date("2020-08-31T18:29:59.999Z"),
                        ],
                        Today: [
                          new Date("2020-08-10T04:57:17.076Z"),
                          new Date("2020-08-10T04:57:17.076Z"),
                        ],
                        Yesterday: [
                          new Date("2020-08-09T04:57:17.076Z"),
                          new Date("2020-08-09T04:57:17.076Z"),
                        ],
                      },
                      startDate: new Date("2020-08-10T04:30:00.000Z"),
                      timePicker: false,
                    }}>
                    <input
                      className="form-control col-4 input-range"
                      type="text"
                      style={{border: "none"  }}
                      // custom="input-range"
                     
                    />
                  </DateRangePicker>
                  </div>
                    <i className="fas fa-chevron-down" />
                  </div>
                </div>
              </div> */}
              <div className="card booking-card">
                <div className="card-body time-slot-card-body">
                  <div className="schedule-header">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="day-slot">
                        <ul>
            {/* Left Arrow */}
            <li className={`left-arrow ${startIndex === 0 ? "disabled" : ""}`}>
    <Link to="#0" onClick={handlePrev} style={{ pointerEvents: startIndex === 0 ? "none" : "auto" }}>
      <i className="fa fa-chevron-left"></i>
    </Link>
  </li>


            {/* Show only 5 days at a time */}
            {daysList.slice(startIndex, startIndex + itemsPerPage).map((dayItem, index) => (
  <li key={index} 
  style={{ margin: "0 9px", cursor: "pointer", background: selectedDate === dayItem.date ? "#ddd" : "transparent", borderRadius:"7px" }}
  onClick={() => {
    setSelectedDate(dayItem.date); // Update selected date
    setDayOfWeek(dayItem.day); // Update selected day of the week
    fetchTimeSlots(dayItem.day); // Fetch new time slots
  }}
  > {/* Adds gap between items */}
    <span>{dayItem.day.substring(0, 3)}</span> {/* Show only first 3 letters */}
    <span className="slot-date">{dayItem.date}</span>
  </li>
))}


            {/* Right Arrow */}
            <li className={`right-arrow ${startIndex + itemsPerPage >= totalDays ? "disabled" : ""}`}>
    <Link to="#0" onClick={handleNext} style={{ pointerEvents: startIndex + itemsPerPage >= totalDays ? "none" : "auto" }}>
      <i className="fa fa-chevron-right"></i>
    </Link>
  </li>
          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: 40 }}>

                    <div className="col-lg-12 col-md-12">
                      <div className="time-slot time-slot-blk">
                        {/* <h4>Morning</h4> */}
                        <div className="time-slot-list">
                        {timeSlots.length === 0 ? (
    <p style={{ textAlign: "center", fontSize: "16px", color: "#777" }}>
      No slots available
    </p>
  ) : (
                          <ul style={{ 
  display: "flex", 
  flexWrap: "wrap", 
  gap: "10px", 
  padding: 0, 
  listStyle: "none",
  justifyContent: "space-between"
}}>
                            {
                              timeSlots.map((time, index)=>(
                                <li key={index}
                                style={{ 
                                  flex: "1 1 32%", // Each item takes about 32% width (3 in a row)
                                  maxWidth: "32%", 
                                  textAlign: "center" 
                                }}
                                >
                              <Link className="timing" 
                              to="#"
                              onClick={() => handleTimeClick(time)}
                              style={{
                                display: "block",
                                padding: "8px 12px",
                                background: selectedTime === time.available_from_time ? "#007bff" : "#f5f5f5",
                                color: selectedTime === time.available_from_time ? "#fff" : "#000",
                                borderRadius: "8px",
                                textAlign: "center",
                                minWidth: "120px",
                                cursor: "pointer",
                              }}>
                                <span>
                                  <i className="feather-clock" /> {time.available_from_time.split(":").slice(0, 2).join(":")} -{" "}
                                  {time.available_to_time.split(":").slice(0, 2).join(":")}
                                </span>
                              </Link>
                            </li>
                              ))

                            }
                            {/* <li>
                              <Link className="timing" to="#">
                                <span>
                                  <i className="feather-clock" /> 10:00 - 10:30
                                </span>
                              </Link>
                            </li>
                            <li className="time-slot-open time-slot-morning">
                              <Link className="timing" to="#">
                                <span>
                                  <i className="feather-clock" /> 11:00 - 11:30
                                </span>
                              </Link>
                            </li>
                            <li>
                              <div className="load-more-timings load-more-morning">
                                <Link to="#">Load More</Link>
                              </div>
                            </li> */}
                          </ul>
  )}
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-lg-4 col-md-4">
                      <div className="time-slot time-slot-blk">
                        <h4>Afternoon</h4>
                        <div className="time-slot-list">
                          <ul>
                            <li>
                              <Link className="timing" to="#">
                                <span>
                                  <i className="feather-clock" /> 12:00 - 12:30
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link className="timing active" to="#">
                                <span>
                                  <i className="feather-clock" /> 01:00 - 01:30
                                </span>
                              </Link>
                            </li>
                            <li className="time-slot-open time-slot-afternoon">
                              <Link className="timing" to="#">
                                <span>
                                  <i className="feather-clock" /> 02:30 - 03:00
                                </span>
                              </Link>
                            </li>
                            <li>
                              <div className="load-more-timings load-more-afternoon">
                                <Link to="#">Load More</Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="time-slot time-slot-blk">
                        <h4>Evening</h4>
                        <div className="time-slot-list">
                          <ul>
                            <li>
                              <Link className="timing" to="#">
                                <span>
                                  <i className="feather-clock" /> 03:00 - 03:30
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link className="timing" to="#">
                                <span>
                                  <i className="feather-clock" /> 04:00 - 04:30
                                </span>
                              </Link>
                            </li>
                            <li className="time-slot-open time-slot-evening">
                              <Link className="timing" to="#">
                                <span>
                                  <i className="feather-clock" /> 05:00 - 05:30
                                </span>
                              </Link>
                            </li>
                            <li>
                              <div className="load-more-timings load-more-evening">
                                <Link to="#">Load More</Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="booking-btn" onClick={bookAppointment}>
                <Link
                  to="#"
                  className="btn btn-primary prime-btn justify-content-center align-items-center"
                >
                  Next <i className="feather-arrow-right-circle" />
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-12">
              <div className="booking-header">
                <h4 className="booking-title">Booking Summary</h4>
              </div>
              <div className="card booking-card">
                <div className="card-body booking-card-body">
                  <div className="booking-doctor-details">
                    <div className="booking-doctor-left">
                      <div className="booking-doctor-img">
                        <Link to="/patient/doctor-profile">
                          <img 
                          src={
                                                                                          typeof doctor?.profile_image === 'string' && 
                                                                                          doctor?.profile_image.trim() !== '' && 
                                                                                          /\.(jpeg|jpg|png|webp)$/i.test(doctor?.profile_image) 
                                                                                            ? `${image_api}${doctor?.profile_image}`
                                                                                            : doc_dummy
                                                                                        }
                          alt="doctor" />
                        </Link>
                      </div>
                      <div className="booking-doctor-info">
                        <h4>
                          <Link to="/patient/doctor-profile">Dr. {doctor?.name}</Link>
                        </h4>
                        <p>{doctor?.qualification}, {doctor?.specialization}</p>
                      </div>
                    </div>
                    <div className="booking-doctor-right">
                      <p>
                        <i className="fas fa-check-circle" />
                        <Link to="/patient/doctor-list">Back</Link>
                        {/* <Link to="/patient/profile">Edit</Link> */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card booking-card">
                <div className="card-body booking-card-body">
                  <div className="booking-doctor-details">
                    <div className="booking-device">
                      <div className="booking-device-img">
                        <img src={devicemessage} alt="devicemsg" />
                      </div>
                      <div className="booking-doctor-info">
                        <h3>We can help you</h3>
                        <p className="device-text">
                          Call us +91 {hospital_mobile} (or) chat with our {hospital_name} customer
                          support team.
                        </p>
                        {/* <Link to="/patient/patient-chat" className="btn">
                          Chat With Us
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card booking-card mb-0">
                <div className="card-body booking-card-body">
                  <div className="booking-doctor-details">
                    <div className="booking-device">
                      <div className="booking-device-img">
                        <img src={smartphone} alt="smartphone" />
                      </div>
                      <div className="booking-doctor-info">
                        <h3>Get the App</h3>
                        <p className="device-text">
                          Download our app for better experience and for more
                          feature
                        </p>
                        <div className="app-images">
                          <Link to="#">
                            <img src={googleimg} alt="googleimg" />
                          </Link>
                          <Link to="#">
                            <img src={appimg} alt="appimg" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Booking */}
        </div>
      </div>
      {/* /Page Content */}
      <Footer {...props} />
    </div>
  );
};

export default Booking2;
