import React, {useEffect, useState} from 'react';
import Header from '../../header';
import DoctorSidebar from '../sidebar';
import DoctorFooter from '../../common/doctorFooter';
import { useLocation } from 'react-router-dom';
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile3, logo, scan } from '../../imagepath';
import { Link } from 'react-router-dom';
import doc_dummy from "../../../assets/img/doctors/doc_dummy.png";
import axios from 'axios';
import { var_api, image_api } from '../../../../constant';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import patientdashboardprofile01 from "../../../assets/img/patients/pat_dummy.png";

const CompletedAppointment = (props) => {
      const location = useLocation();
      const { state } = location; // Extract the state object
      console.log("sta", state.appointment);
      const currentAppointment = state.appointment;
      const hospital_id = localStorage.getItem("doc_hospital_id");
      const apptPrefix = localStorage.getItem("appointment_prefix");
      const [comPres, setComPres] = useState(null);
      
        const [profileDetails, setProfileDetails] = useState(null);


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
      


      useEffect(() => {
        fetchServicesSubcategories();
        fetchDoctorDetails();
    }, []);


      const fetchServicesSubcategories = async () => {
        try {
          const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
          if (!token) {
            throw new Error("Token not found. Please log in again.");
          }
  
          const response = await axios.get(
            `${var_api}appointment/get-appointment/view-details/${currentAppointment?.id}`, // Replace with your API endpoint
            {
              headers: {
                Authorization: token,
              },
            }
          );
  
          // Map API data to Select component options
          const options = response.data;
          console.log("pr",options.
            prescriptions
            )
          setComPres(options);
        } catch (err) {
          console.error("Error fetching medicine subcategories:", err);
        //   setError(err.message || "An error occurred.");
        }
      };


      const handleDownloadPDF = () => {
        // Check if data is loaded
        if (!comPres) {
          alert("Data is still loading. Please try again.");
          return;
        }
      
        // Generate PDF name with fallbacks
        const pdfName = `${comPres.patient_name || "Patient"}-${apptPrefix}${
          comPres.token_no || "0"
        }-${formatDate(comPres.appointment_day || new Date().toLocaleDateString())}.pdf`;
      
        // Select the invoice content
        const invoiceContent = document.querySelector(".invoice-content");
      
        if (invoiceContent) {
          html2canvas(invoiceContent, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
      
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(pdfName);
          });
        } else {
          alert("Invoice content not found.");
        }
      };

      const fetchDoctorDetails = async () => {
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
          console.error("Error fetching doctor details:", err);
        }
      };

    return (
        <div>
            <div className='main-wrapper'>
                <Header profileDetails={profileDetails} />
                {/* Breadcrumb */}
                <div className="breadcrumb-bar-two">
                    <div className="container">
                        <div className="row align-items-center inner-banner">
                            <div className="col-md-12 col-12 text-center">
                                <h2 className="breadcrumb-title">Appointment Detail</h2>
                                <nav aria-label="breadcrumb" className="page-breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/home-1">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item" aria-current="page">
                                            Appointment Detail
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Breadcrumb */}
                {/* Page Content */}
                <div className="content">
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
                                    <div className="header-back">
                                        <Link to="/doctor/appointments" className="back-arrow">
                                            <i className="fa-solid fa-arrow-left" />
                                        </Link>
                                        <h3>Appointment Details</h3>
                                    </div>
                                </div>
                                <div className="appointment-details-wrap">
                                    {/* Appointment Detail Card */}
                                    <div className="appointment-wrap appointment-detail-card">
                                        <ul>
                                            <li>
                                                <div className="patinet-information">
                                                    {/* <Link to="#">
                                                        <img
                                                            src={doctordashboardprofile02}
                                                            alt="User Image"
                                                        /> */}
                                                         <Link
                                                                                              to="/doctor/invoices"
                                                                                              className="table-avatar"
                                                                                            >
                                                                                              <img
                                                                                                src={
                                                                                                    currentAppointment?.patient_profile_image &&
                                                                                                  /\.(jpeg|jpg|png|webp)$/i.test(
                                                                                                    currentAppointment.patient_profile_image
                                                                                                  )
                                                                                                    ? `${image_api}${currentAppointment?.patient_profile_image}`
                                                                                                    :patientdashboardprofile01}
                                                                                                alt="Img"
                                                                                              />
                                                    </Link>
                                                    <div className="patient-info">
                                                        <p>#{apptPrefix}{currentAppointment.token_no}</p>
                                                        <h6>
                                                            <Link to="#">{currentAppointment.patient_name} </Link>
                                                            {/* <span className="badge new-tag">New</span> */}
                                                        </h6>
                                                        <div className="mail-info-patient">
                                                            <ul>
                                                                <li>
                                                                    <i className="fa-solid fa-envelope" />
                                                                    {currentAppointment.patient_email}
                                                                </li>
                                                                <li>
                                                                    <i className="fa-solid fa-phone" />
                                                                    {currentAppointment.patient_mobile_no}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="appointment-info">
                                                {/* <div className="person-info">
                                                    <p>Person with patient</p>
                                                    <ul className="d-flex apponitment-types">
                                                        <li>Andrew</li>
                                                    </ul>
                                                </div> */}
                                                {/* <div className="person-info">
                                                    <p>Type of Appointment</p>
                                                    <ul className="d-flex apponitment-types">
                                                        <li>
                                                            <i className="fa-solid fa-video text-indigo" />
                                                            Video Call
                                                        </li>
                                                    </ul>
                                                </div> */}
                                            </li>
                                            <li className="appointment-action">
                                                <div className="detail-badge-info">
                                                    <span className="badge bg-green">Completed</span>
                                                </div>
                                                {/* <div className="consult-fees">
                                                    <h6>Consultation Fees : $200</h6>
                                                </div> */}
                                                {/* <ul>
                                                    <li>
                                                        <Link to="#">
                                                            <i className="fa-solid fa-comments" />
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">
                                                            <i className="fa-solid fa-xmark" />
                                                        </Link>
                                                    </li>
                                                </ul> */}
                                            </li>
                                        </ul>
                                        <ul className="detail-card-bottom-info">
                                            <li>
                                                <h6>Appointment Date &amp; Time</h6>
                                                <span>{currentAppointment.appointment_day} - {currentAppointment.appointment_time}</span>
                                            </li>
                                            {/* <li>
                                                <h6>Visit Type</h6>
                                                <span>General</span>
                                            </li> */}
                                            <li className="appointment-detail-btn">
                                                <Link to="#view_prescription" data-bs-toggle="modal">
                                                    View Details
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* /Appointment Detail Card */}
                                    {/* <div className="recent-appointments">
                                        <h5 className="head-text">Recent Appointments</h5>
                                        <div className="appointment-wrap">
                                            <ul>
                                                <li>
                                                    <div className="patinet-information">
                                                        <Link to="#">
                                                            <img
                                                                src={doctordashboardprofile01}
                                                                alt="User Image"
                                                            />
                                                        </Link>
                                                        <div className="patient-info">
                                                            <p>#Apt0001</p>
                                                            <h6>
                                                                <Link to="#">Naveen</Link>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="appointment-info">
                                                    <p>
                                                        <i className="fa-solid fa-clock" />
                                                        11 Nov 2024 10.45 AM
                                                    </p>
                                                    <ul className="d-flex apponitment-types">
                                                        <li>General Visit</li>
                                                        <li>Chat</li>
                                                    </ul>
                                                </li>
                                                <li className="mail-info-patient">
                                                    <ul>
                                                        <li>
                                                            <i className="fa-solid fa-envelope" />
                                                            adran@example.com
                                                        </li>
                                                        <li>
                                                            <i className="fa-solid fa-phone" />
                                                            +1 504 368 6874
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li className="appointment-action">
                                                    <ul>
                                                        <li>
                                                            <Link to="#">
                                                                <i className="fa-solid fa-eye" />
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="appointment-wrap">
                                            <ul>
                                                <li>
                                                    <div className="patinet-information">
                                                        <Link to="#">
                                                            <img
                                                                src={doctordashboardprofile3}
                                                                alt="User Image"
                                                            />
                                                        </Link>
                                                        <div className="patient-info">
                                                            <p>#Apt0003</p>
                                                            <h6>
                                                                <Link to="#">Saran</Link>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="appointment-info">
                                                    <p>
                                                        <i className="fa-solid fa-clock" />
                                                        27 Oct 2024 09.30 AM
                                                    </p>
                                                    <ul className="d-flex apponitment-types">
                                                        <li>General Visit</li>
                                                        <li>Video Call</li>
                                                    </ul>
                                                </li>
                                                <li className="mail-info-patient">
                                                    <ul>
                                                        <li>
                                                            <i className="fa-solid fa-envelope" />
                                                            Saran@example.com
                                                        </li>
                                                        <li>
                                                            <i className="fa-solid fa-phone" />
                                                            &nbsp;+1 749 104 6291
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li className="appointment-action">
                                                    <ul>
                                                        <li>
                                                            <Link to="#">
                                                                <i className="fa-solid fa-eye" />
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Page Content */}
                <DoctorFooter />

            </div>
            {/*View Prescription */}
            <div className="modal fade custom-modals" id="view_prescription">
                <div
                    className="modal-dialog modal-dialog-centered modal-lg"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">View Prescription</h3>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>
                        <div className="modal-body pb-0">
                            <div className="prescribe-download">
                                <h5>{formatDate(comPres?.appointment_day)}</h5>
                                <ul>
                                    <li>
                                        <a href="#" className="print-link">
                                            <i className="fa-solid fa-print" />
                                        </a>
                                    </li>
                                    <li>
                                        <a  className="btn btn-primary prime-btn" onClick={handleDownloadPDF}>
                                            Download
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="view-prescribe-details invoice-content">
                                <div className="hospital-addr">
                                    <div className="invoice-logo">
                                        <img src={logo} alt="logo" />
                                    </div>
                                    <h5>
                                        {comPres?.hospital_address}, {comPres?.hospital_country}. Phone : {comPres?.hospital_mobile}{" "}
                                    </h5>
                                    {/* <p>Monday to Sunday - 09:30am to 12:00pm</p> */}
                                </div>
                                {/* Invoice Item */}
                                <div className="invoice-item">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="invoice-info">
                                                <h6 className="customer-text">Dr {comPres?.doctor_name}</h6>
                                                <p>{comPres?.doctor_qualification} &amp; {comPres?.doctor_specialization}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="invoice-info2">
                                                <p>
                                                    <span>Date : </span>{comPres?.appointment_day}, {comPres?.slot_time}
                                                </p>
                                                {/* <p>
                                                    <span>Appointment Type :</span>Video
                                                </p> */}
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="patient-id">
                                                <h6>Patient Details</h6>
                                                <div className="patient-det">
                                                    <h6>{comPres?.patient_name}</h6>
                                                    <ul>
                                                        <li>{comPres?.patient_dob} / {comPres?.patient_gender}</li>
                                                        <li>Blood : {comPres?.patient_blood_group}</li>
                                                        <li>Patient ID : #{comPres?.patentid_prefix}{comPres?.patient_running_no}</li>
                                                        {/* <li>Type : Outpatient</li> */}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Invoice Item */}
                                <div className="appointment-notes">
                                    <h3>Appointment Note</h3>
                                </div>
                                <div className="appoint-wrap">
                                    <h5>Vitals</h5>
                                    <ul>
                                        <li>
                                            <span>Pulse : </span> {comPres?.pulse} Bpm
                                        </li>
                                        <li>
                                            <span>BP : </span>{comPres?.bp} mmHg
                                        </li>
                                        <li>
                                            <span>Temprature : </span>{comPres?.temp} mmHg
                                        </li>
                                        <li>
                                            <span>Spo2 : </span>{comPres?.spo2}%
                                        </li>
                                        <li>
                                            <span>Height :</span>{comPres?.height} cm
                                        </li>
                                        <li>
                                            <span>Weight : </span>{comPres?.weight} Kg
                                        </li>
                                        <li>
                                            <span>BMI Value : </span>{comPres?.bmi_value}
                                        </li>
                                        <li>
                                            <span>Before Sugar : </span> {comPres?.before_sugar}
                                        </li>
                                        <li>
                                        <span>After Sugar : </span> {comPres?.after_sugar}
                                        </li>
                                       
                                    </ul>
                                </div>
                                <div className="appoint-wrap">
                                    <h5>Previous Medical History</h5>
                                    <p>
                                        {comPres?.previous_history}
                                    </p>
                                </div>
                                <div className="appoint-wrap">
                                    <h5>Clinical Notes</h5>
                                    <p>
                                        {comPres?.clinical_notes}
                                    </p>
                                </div>
                                <div className="appoint-wrap">
                                    <h5>Complaint</h5>
                                    <p>
                                    {comPres?.complaints}
                                    </p>
                                </div>
                                {/* <div className="appoint-wrap">
                                    <h5>Medications</h5>
                                    <p>
                                        The patient has a history of type 2 diabetes mellitus diagnosed
                                        in 2018, well-controlled on metformin. Additionally, the patient
                                        underwent appendectomy in 2020 without postoperative
                                        complications.
                                    </p>
                                </div> */}
                                {/* Invoice Item */}
                                <div className="invoice-item invoice-table-wrap">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="table-responsive inv-table">
                                                <table className="invoice-table table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>SNO</th>
                                                            <th>Medecine Name</th>
                                                            <th>Frequency</th>
                                                            <th>Duration</th>
                                                            <th>Timings</th>
                                                            <th>Instruction</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            comPres?.prescriptions.map((pres,index)=>(
<tr key={index}>
                                                            <td>{index+1}</td>
                                                            <td>{pres.medicine_name}</td>
                                                            <td>{pres.is_morning}-{pres.is_noon}-{pres.is_evening}-{pres.is_night}</td>
                                                            <td>{pres.cycle} days</td>
                                                            <td>{pres.is_before_food ==1 ? "Before Food": "After Food"}</td>
                                                            <td>{pres.remarks}</td>
                                                        </tr>
                                                            ))
                                                        }
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Invoice Item */}
                                <div className="row align-items-center">
                                    {/* <div className="col-md-6">
                                        <div className="scan-wrap">
                                            <h6>Scan to download report</h6>
                                            <img src={scan} alt="scan" />
                                        </div>
                                    </div> */}
                                    <div className="col-md-6">
                                        <div className="prescriber-info">
                                            <h6>Dr. {comPres?.doctor_name}</h6>
                                            <p>Dept of {comPres?.doctor_specialization}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* <ul className="nav inv-paginate justify-content-center">
                                    <li>
                                        Page 01 of{" "}
                                        <a
                                            href="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#view_prescription2"
                                            data-bs-dismiss="modal"
                                        >
                                            02
                                        </a>
                                    </li>
                                </ul> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /View Prescription */}
        </div>

    )
}

export default CompletedAppointment
