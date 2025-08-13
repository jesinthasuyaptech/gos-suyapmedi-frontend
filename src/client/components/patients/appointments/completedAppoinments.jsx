import React, {useState, useEffect} from 'react';
import Header from '../../header';
import DashboardSidebar from '../dashboard/sidebar/sidebar';
import DoctorFooter from '../../common/doctorFooter';
import { doctor_15, doctor_thumb_02, doctorprofileimg } from '../../imagepath';
import { useLocation,Link } from "react-router-dom";
import { image_api, var_api } from '../../../../constant';
import { doc_dummy } from '../../imagepath';
import axios from 'axios';
import { logo } from '../../imagepath';

const CompletedAppoinments = (props) => {
    const location = useLocation();
    const { appointment } = location.state || {};
    
      const [selectedPrescription, setSelectedPrescription] = useState(null);  
     // Store appointment in localStorage
  useEffect(() => {
    if (appointment) {
        try {
          localStorage.setItem("selectedApt", JSON.stringify(appointment));
          setSelectedAppointment(appointment); // Update state immediately
        } catch (error) {
          console.error("Error storing appointment in localStorage:", error);
        }
    }
  }, [appointment]);

    console.log("ao", appointment);
      // Retrieve appointment from localStorage safely
  const [selectedAppointment, setSelectedAppointment] = useState(() => {
    try {
      const storedAppointment = localStorage.getItem("selectedApt");
      return storedAppointment ? JSON.parse(storedAppointment) : {};
    } catch (error) {
      console.error("Error parsing stored appointment:", error);
      localStorage.removeItem("selectedApt"); // Clear invalid data
      return {};
    }
  });

  console.log("ao", appointment, selectedAppointment);
   
    const [reviewNote, setReviewNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [aptReview, setAptReview] = useState(null);
    const [rating, setRating] = useState(aptReview?.rating_count ||0);
    const [hoverRating, setHoverRating] = useState(null);
    // const [prescriptionDetails, setPrescriptionDetails] = useState(null);
    const prescription_prefix = localStorage.getItem("prescription_prefix");
    const patient_mobile_no =  localStorage.getItem("patient_mobile_no");
    const patient_name = localStorage.getItem("patient_name");
    const patient_email = localStorage.getItem("patient_email");
    const [selectedpatientdetails, setPatientdetails] = useState(null); 
    const [pres, setPres] = useState([]);
    const submitPaReview = localStorage.getItem('submit_review_bypatient');
    const paReview = localStorage.getItem('patient_review');


    // Handle star click
  const handleStarClick = (index) => {
    setRating(index + 1); // Set rating from 1 to 5
  };

  // const handleViewPrescription = (pres) => {
  //   setSelectedPrescription(pres);
  // };
  
   // Handle review text change
   const handleReviewChange = (e) => {
    setReviewNote(e.target.value);
  };

   // Submit review
   const handleSubmitReview = async () => {
    setLoading(true);
    const payload = {
      hos_id: selectedAppointment?.hospital_id,
      doc_id: selectedAppointment?.tech_id,
      patient_id: selectedAppointment?.patient_id,
      review_note: reviewNote,
      rating_count: rating,
      reply: "",
      reply_tech: "",
      reply_nontech: "",
    };
  
    const token = localStorage.getItem("patient_token");
  
    if (!token) {
      alert("Authentication error: Token not found!");
      return;
    }
  
    try {
        let apiUrl;
    
        // If `aptReview` exists, update the review; otherwise, update the appointment
        if (aptReview?.id) {
          apiUrl = `${var_api}review/update/${aptReview?.id}`;
        } else {
          apiUrl = `${var_api}appointment/apt-review-update/${selectedAppointment?.id}`;
        }
    
        const response = await axios.put(apiUrl, payload, {
          headers: {
            Authorization: token, 
            "Content-Type": "application/json",
          },
        });
    
      alert("Review submitted successfully!");
      fetchReviewDetails();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    } finally {
        setLoading(false);
    }
  };

  //get the appointment
     const fetchReviewDetails = async () => {
        setLoading(true);
        const token = localStorage.getItem("patient_token");
        try {
          const response = await axios.get(`${var_api}review/get-patient/${selectedAppointment?.hospital_id}/${selectedAppointment?.patient_id}/${selectedAppointment?.id}`, {
            headers: {
              Authorization: token,
            },
          });
          const result = response.data[0];
          setAptReview(result);
          console.log("res", result);
          setReviewNote(result.review_note);
          setRating(result.rating_count)
        } catch (err) {
          console.error("Error fetching doctor details:", err);
        }
        finally{
            setLoading(false);
        }
      };

       // Call fetchReviewDetails when selectedAppointment is set
  useEffect(() => {
    if (selectedAppointment?.id) {
      fetchReviewDetails();
      fetchPrescriptionDetails();
      fetchpatientdetails();

    }
  }, [selectedAppointment]);


   const fetchPrescriptionDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("patient_token");
    
        // Call First API
        const response = await fetch(`${var_api}prescription/patients-prescriptions-apt/${selectedAppointment.id}`, {
          method: "GET",
          headers: { "Authorization": `${token}` }
        });
    
        const data = await response.json();
        // setPrescriptionDetails(data || null); 
        setPres(data || null);
        setSelectedPrescription(data[0] || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally{
        setLoading(false);
      }
    };
    
  
    const handleDownloadPDF = () => {
        const input = document.getElementById("prescription-content");
      
        html2canvas(input, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
      
          // Calculate best height to fit everything on one page
          const imgWidth = 210; // A4 width
          const imgHeight = (canvas.height * imgWidth) / canvas.width; 
      
          // If height exceeds A4 page, scale down
          if (imgHeight > 297) {
            pdf.addImage(imgData, "PNG", 0, 10, imgWidth, 280); // Adjust height
          } else {
            pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
          }
      
          pdf.save(`${prescription_prefix}-${selectedPrescription.prescription_token}_${selectedPrescription.appointment_day}.pdf`);
        });
      };

        const fetchpatientdetails = async () => {
          const token = localStorage.getItem("patient_token");
          const patient_id = localStorage.getItem("patient_id");
          // if (!token || !patient_id || !hospital_id) {
          //   console.warn("Missing authentication details.");
          //   return;
          // }
          try {
            const response = await axios.get(
              `${var_api}patientdetails/get/${patient_id}`,
              {
                headers: {
                  Authorization: `${token}`, // Ensure proper format
                },
                
              }
            );
            setPatientdetails(response.data);
      
          } catch (err) {
            if (err.name !== "AbortError") {
              console.error("Error fetching doctor details:", err);
            }
          }
        };
      


    return (
        <>
            <Header {...props} />
            {/* Breadcrumb */}
            <div className="breadcrumb-bar-two">
            {loading && (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  )}
                <div className="container">
                    <div className="row align-items-center inner-banner">
                        <div className="col-md-12 col-12 text-center">
                            <h2 className="breadcrumb-title">Patient Appointments</h2>
                            <nav aria-label="breadcrumb" className="page-breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/index">Home</a>
                                    </li>
                                    <li className="breadcrumb-item" aria-current="page">
                                        Patient Appointments
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
                        {/* Profile Sidebar */}
                        <div className="col-lg-4 col-xl-3 theiaStickySidebar">
                            {/* Profile Sidebar */}
                            <DashboardSidebar />
                            {/* /Profile Sidebar */}
                        </div>
                        {/* / Profile Sidebar */}
                        <div className="col-lg-8 col-xl-9">
                            <div className="dashboard-header">
                                <div className="header-back">
                                    <a href="/patient/patient-appointments" className="back-arrow">
                                        <i className="fa-solid fa-arrow-left" />
                                    </a>
                                    <h3>Appointment Details</h3>
                                </div>
                            </div>
                            <div className="appointment-details-wrap">
                                {/* Appointment Detail Card */}
                                <div className="appointment-wrap appointment-detail-card">
                                    <ul>
                                        <li>
                                            <div className="patinet-information">
                                                <a href="#">
                                                    <img
                                                     src={
                                                        selectedAppointment?.doctor_profile_image &&
                                                                                                                          /\.(jpeg|jpg|png|webp)$/i.test(
                                                                                                                            selectedAppointment.doctor_profile_image
                                                                                                                          )
                                                                                                                            ? `${image_api}${selectedAppointment.doctor_profile_image}`
                                                                                                                            :doc_dummy}
                                                        alt="doctor Image"
                                                    />
                                                </a>
                                                <div className="patient-info">
                                                    <p>#{selectedAppointment?.appointment_prefix}{selectedAppointment?.token_no}</p>
                                                    <h6>
                                                        <a href="#">Dr {selectedAppointment?.doctor_name}</a>
                                                    </h6>
                                                    <div className="mail-info-patient">
                                                        <ul>
                                                            <li>
                                                                <i className="fa-solid fa-envelope" />
                                                                {selectedAppointment?.doctor_email}
                                                            </li>
                                                            <li>
                                                                <i className="fa-solid fa-phone" />
                                                                &nbsp;{selectedAppointment?.doctor_primary_mobile}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        {/* <li className="appointment-info">
                                            <div className="person-info">
                                                <p>Person with patient</p>
                                                <ul className="d-flex apponitment-types">
                                                    <li>Andrew</li>
                                                </ul>
                                            </div>
                                            <div className="person-info">
                                                <p>Type of Appointment</p>
                                                <ul className="d-flex apponitment-types">
                                                    <li>
                                                        <i className="fa-solid fa-video text-indigo" />
                                                        Video Call
                                                    </li>
                                                </ul>
                                            </div>
                                        </li> */}
                                        <li className="appointment-action">
                                            <div className="detail-badge-info">
                                                <span className="badge bg-green">Completed</span>
                                            </div>
                                            {/* <div className="consult-fees">
                                                <h6>Consultation Fees : $200</h6>
                                            </div> */}
                                            {/* <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-solid fa-comments" />
                                                    </a>
                                                </li>
                                            </ul> */}
                                        </li>
                                    </ul>
                                    <ul className="detail-card-bottom-info">
                                        <li>
                                            <h6>Appointment Date &amp; Time</h6>
                                            <span>{selectedAppointment?.appointment_day} - {selectedAppointment?.slot_time}</span>
                                        </li>
                                        <li>
                                            <h6>Visit Type</h6>
                                            <span>General</span>
                                        </li>
                                        <li className="detail-badge-info">
                                            {/* <a
                                                href="#view_prescription"
                                                data-bs-toggle="modal"
                                                className="btn btn-primary prime-btn me-3"
                                            >
                                                Download Prescription
                                            </a> */}
                                            {/* <a href="#" className="btn reschedule-btn btn-primary-border">
                                                Reschedule Appointment
                                            </a> */}
                                            {
                                              pres.length != 0 && <Link to="#" data-bs-toggle="modal" className="btn btn-primary prime-btn me-3" data-bs-target="#view_prescription"> Download Prescription</Link>
                                            }
                                              
                                        </li>
                                    </ul>



                                    {
                                      paReview == 1 && (
                                        <ul className="detail-card-bottom-info">
                                        <li>
                                            <h6>Ratings:</h6>
                                            <span>
                                            <div className="rating">
      {[...Array(5)].map((_, index) => (
        <i
          key={index}
          className={`fas fa-star ${index < (hoverRating ?? rating) ? "filled" : ""}`}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(null)}
          style={{
            cursor: "pointer",
            color: index < (hoverRating ?? rating) ? "#FFD700" : "#ccc",
            fontSize: "20px", // Increase size (adjust as needed)
            marginTop:"10px"
          }}
        />
      ))}
    </div>
                                            </span>
                                        </li>
                                        <li>
                                            <h6>Review Note: </h6>
                                           
                                        </li>
                                        <li>
                                            
                                            <textarea
                                 className="form-control"
                                 placeholder="Leave a comment here"
                                 id="floatingTextarea2"
                                 style={{ width: "450px" }}
                                 value={reviewNote}
                                 onChange={handleReviewChange}
                                />
                                        </li>
                                        {
                                          submitPaReview == 1 && (
                                            <li>
                                            <a href="#" className="btn-sm reschedule-btn btn-primary-border" onClick={handleSubmitReview}>
                                                Submit Review
                                            </a>
                                        </li>
                                          )
                                        }
                                      
                                        <li>
                                            
                                        </li>
                                        <li>
                                            
                                        </li>
                                    </ul>
                                    
    )
                                    }

                                    
                                </div>



                                 <div
                                       className="modal fade custom-modals"
                                       id="view_prescription"
                                       tabIndex="-1"
                                       aria-hidden="true"
                                     >
                                       <div className="modal-dialog modal-dialog-centered modal-lg">
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
                                           <div className="modal-body pb-0" >
                                           <div className="prescribe-download">
                                           {selectedPrescription && (
                                       <h5>{selectedPrescription.appointment_day}        
                                       </h5>
                                           )}
                                       <ul>
                                         {/* <li>
                                           <Link to="#" className="print-link">
                                             <i className="fa-solid fa-print" onClick={() => window.print()} />
                                           </Link>
                                         </li> */}
                                         <li>
                                           <Link href="#" className="btn btn-primary prime-btn" onClick={handleDownloadPDF}>
                                             Download
                                           </Link>
                                         </li>
                                       </ul>
                                     </div>
                                             {selectedPrescription && (
                                               <div className="view-prescribe invoice-content " id="prescription-content">
                                                 <div className="invoice-item">
                                         <div className="row">
                                           <div className="col-md-6">
                                             <div className="invoice-logo">
                                               <img src={logo} alt="logo" />
                                             </div>
                                           </div>
                                           <div className="col-md-6">
                                             <p className="invoice-details">
                                               <strong>Prescription ID :#{prescription_prefix}-{selectedPrescription.prescription_token}</strong> <br />
                                               <strong>Issued:</strong> {selectedPrescription.appointment_day}
                                             </p>
                                           </div>
                                         </div>
                                       </div>
                                       {/* Invoice Item */}
                                                
                                                 <div className="invoice-item">
                                                   <div className="row">
                                                     <div className="col-md-6">
                                                     <div className="invoice-info">
                                                       <h6 className="customer-text">Doctor Details</h6>
                                                       <p className="invoice-details invoice-details-two">
                                                         {selectedPrescription?.tech_name} <br />
                                                         {selectedPrescription?.hospital_name}<br />
                                                         {selectedPrescription?.hospital_address}<br />
                                                         {selectedPrescription?.hospital_state}<br />
                                                         {selectedPrescription?.hospital_country}
                               
                                                       </p>
                                                       </div>
                                                     </div>
                                                     <div className="col-md-6">
                                                     <div className="invoice-info invoice-info2">
                                                       <h6 className="customer-text">Patient Details</h6>
                                                       <p className="invoice-details">
                                                         {patient_name} <br />
                                                         {selectedpatientdetails?.full_address},
                                                         {selectedpatientdetails?.city}<br/>
                                                         {selectedpatientdetails?.state},
                                                         {selectedpatientdetails?.country}<br/>
                                                         {selectedpatientdetails?.pincode}
                                                        
                                                       </p>
                                                     </div>
                                                   </div>
                                                 </div>
                                               </div>
                                                 {/* Prescription Details */}
                                                 <div className="invoice-item invoice-table-wrap">
                                                   <h6>Prescription Details</h6>
                                                   <div className="table-responsive">
                                                     <table className="invoice-table table table-bordered">
                                                       <thead>
                                                         <tr>
                                                           <th>#</th>
                                                           <th>Medicine Name</th>
                                                           <th>Dosage</th>
                                                           <th>Frequency</th>
                                                           <th>Duration</th>
                                                           <th>Timings</th>
                                                         </tr>
                                                       </thead>
                                                       <tbody>
                                                         {selectedPrescription.prescriptions.map((med, index) => (
                                                           <tr key={index}>
                                                             <td>{index+1}</td>
                                                             <td>{med.medicine_name}</td>
                                                             <td>{med.qty}</td>
                                                             <td>{med.is_morning}-{med.is_noon}-{med.is_evening}-{med.is_night}</td>
                                                             <td>{med.cycle}</td>
                                                             <td>{med.is_before_food=0?"After Food":"Before Food"}</td>
                                                           </tr>
                                                         ))}
                                                       </tbody>
                                                     </table>
                                                   </div>
                                                 </div>
                                                 <div className="other-info">
                                         <h4>Other information</h4>
                                         <p className="text-muted mb-0">
                                          {selectedPrescription?.advice}
                                         </p>
                                       </div>
                                       <div className="other-info">
                                         <h4>Follow Up</h4>
                                         <p className="text-muted mb-0">
                                         {selectedPrescription?.follow_up}
                                         </p>
                                         </div>
                               
                                                 <div className="prescriber-info">
                                                   <h6>Dr. {selectedPrescription?.tech_name}</h6>
                                                   <p>{selectedPrescription?.tech_specialization}</p>
                                                 </div>
                                               </div>
                                             )}
                                           </div>
                                         </div>
                                       </div>
                                     </div>





                                {/* /Appointment Detail Card */}
                                {/* <div className="recent-appointments">
                                    <h5 className="head-text">Recent Appointments</h5> */}
                                    {/* Appointment List */}
                                    {/* <div className="appointment-wrap">
                                        <ul>
                                            <li>
                                                <div className="patinet-information">
                                                    <a href="#">
                                                        <img
                                                            src={doctor_15}
                                                            alt="User Image"
                                                        />
                                                    </a>
                                                    <div className="patient-info">
                                                        <p>#Apt0002</p>
                                                        <h6>
                                                            <a href="#">Dr.Shanta Nesmith</a>
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
                                                        shanta@example.com
                                                    </li>
                                                    <li>
                                                        <i className="fa-solid fa-phone" />
                                                        &nbsp;+1 504 368 6874
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="appointment-action">
                                                <ul>
                                                    <li>
                                                        <a href="#">
                                                            <i className="fa-solid fa-eye" />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div> */}
                                    {/* /Appointment List */}
                                    {/* Appointment List */}
                                    {/* <div className="appointment-wrap">
                                        <ul>
                                            <li>
                                                <div className="patinet-information">
                                                    <a href="#">
                                                        <img
                                                            src={doctor_thumb_02}
                                                            alt="User Image"
                                                        />
                                                    </a>
                                                    <div className="patient-info">
                                                        <p>#Apt0003</p>
                                                        <h6>
                                                            <a href="#">Dr.John Ewel</a>
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
                                                        john@example.com
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
                                                        <a href="#">
                                                            <i className="fa-solid fa-eye" />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div> */}
                                    {/* /Appointment List */}
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>

              
            </div>
            <DoctorFooter {...props} />
            {/* /Page Content */}
        </>

    )
}

export default CompletedAppoinments
