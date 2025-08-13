import React, { useState, useEffect } from "react";
import DashboardSidebar from "../dashboard/sidebar/sidebar.jsx";
import { Modal } from "react-bootstrap";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import Header from "../../header";
import Footer from "../../footer";
import { doctordashboardprofile06 } from "../../imagepath.jsx";
import DatePicker from "react-datepicker";
import { var_api } from "../../../../constant.js";
import { useHistory } from "react-router-dom";
import {notification} from "antd";
import moment from "moment";


const MedicalDetails = (props) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Dataprofile, setDataprofile] = useState([]);
  const appointment_prefix = localStorage.getItem("admin_appointment_prefix");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');
    try {
      const response = await fetch(`${var_api}vitaldetails/get-latest/${hospital_id}/${patient_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("admin/patientLogin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);// Set initial filtered data
      setLoading(false);
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

  const fetchDataprofile = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');
    try {
      const response = await fetch(`${var_api}patientdetails/get/${patient_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("admin/patientLogin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setDataprofile(result || []);// Set initial filtered data
      setLoading(false);
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

  const fetchDatavital = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');
    try {
      const response = await fetch(`${var_api}vitaldetails/get-all/by-patient/${hospital_id}/${patient_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("admin/patientLogin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setFilteredData(result || []); // Set initial filtered data
      setLoading(false);
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
    fetchData();
    fetchDatavital();
    fetchDataprofile();
  }, []);

  return (
    <>
    <div className="main-wrapper">
    {loading && (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  )}
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Medical Details</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Medical Details
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <DashboardSidebar />
              </StickyBox>
            </div>
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Medical Details</h3>
              </div>
              <div className="dashboard-card w-100 medical-details-item">
                <div className="dashboard-card-head medical-detail-head">
                  <div className="header-title">
                    <h6>Latest updated medical details</h6>
                  </div>
                  <div className="latest-update">
  <p>
    <i className="fa-solid fa-calendar-check me-2" />
    Last update on : {data.updated_at ? moment(data.updated_at).format("DD-MM-YYYY") : "Nil"}
  </p>
</div>
                </div>

                <div className="dashboard-card-body">
  <div className="row">
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-red">
        <span><i className="fa-solid fa-syringe" /> Blood Pressure</span>
        <h3>{data.bp ? `${data.bp} mmHg` : "Nil"}</h3>
      </div>
    </div>
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-orange">
        <span><i className="fa-solid fa-heart" /> Heart Rate</span>
        <h3>{data.pulse ? `${data.pulse} BPM` : "Nil"}</h3>
      </div>
    </div>
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-dark-blue">
        <span><i className="fa-solid fa-notes-medical" /> Before Sugar</span>
        <h3>{data.before_sugar ? `${data.before_sugar} mg/dL` : "Nil"}</h3>
      </div>
    </div>
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-teal">
        <span><i className="fa-solid fa-notes-medical" />After Sugar</span>
        <h3>{data.after_sugar ? `${data.after_sugar} mg/dL` : "Nil"}</h3>
      </div>
    </div>
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-amber">
        <span><i className="fa-solid fa-temperature-high" /> Temperature</span>
        <h3>{data.temp ? `${data.temp}°C` : "Nil"}</h3>
      </div>
    </div>
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-purple">
        <span><i className="fa-solid fa-user-pen" /> BMI</span>
        <h3>{data.bmi_value ? `${data.bmi_value} kg/m²` : "Nil"}</h3>
      </div>
    </div>
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-green">
        <span><i className="fa-solid fa-weight-scale" /> Weight</span>
        <h3>{data.weight ? `${data.weight} kg` : "Nil"}</h3>
      </div>
    </div>
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-brown">
        <span><i className="fa-solid fa-ruler" /> Height</span>
        <h3>{data.height ? `${data.height} cm` : "Nil"}</h3>
      </div>
    </div>
    <div className="col-xl-2 col-lg-4 col-md-6">
      <div className="health-records icon-blue">
        <span><i className="fa-solid fa-highlighter" /> SPo2</span>
        <h3>{data.spo2 ? `${data.spo2}%` : "Nil"}</h3>
      </div>
    </div>
  </div>
</div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="search-header">
                    <div className="search-field">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="add-med-record">
                    {/* <Link
                      to="#add-med-record"
                      className="btn btn-primary prime-btn"
                      data-bs-toggle="modal"
                    >
                      Add Medical Details
                    </Link> */}
                  </div>
                </div>
     

<div className="col-md-12">
  <div className="custom-table">
    <div className="table-responsive">
      <table className="table table-center mb-0">
        <thead>
          <tr>
            <th>Appt Id</th>
            <th>Weight (Kg)</th>
            <th>Height (cm)</th>
            <th>BMI</th>
            <th>Add on</th>
            {/* <th>Blood Pressure</th>
            <th>Temperature (°C)</th>
            <th>Before Sugar</th>
            <th>After Sugar</th>
            <th>Pulse (BPM)</th>
            <th>SpO2 (%)</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
<td
  style={{ color: "#179ecb", cursor: "pointer" }}
  onClick={() => new bootstrap.Modal(document.getElementById('med-detail')).show()}
>
  {item.appoinment_id ? `#${appointment_prefix}${item.appoinment_id}` : "-"}
</td>
                <td>{item.weight ? `${item.weight} Kg` : "0 Kg"}</td>
                <td>{item.height ? `${item.height} cm` : "0 cm"}</td>
                <td>{item.bmi_value || "0"}</td>
                {/* <td>{item.bp || "0"} mmHg</td>
                <td>{item.temp ? `${item.temp}°C` : "0°C"}</td>
                <td>{item.before_sugar || "0"} mg/dL</td>
                <td>{item.after_sugar || "0"} mg/dL</td>
                <td>{item.pulse || "0"} BPM</td>
                <td>{item.spo2 || "0"}%</td> */}
                <td>
  {item.created_at ? moment(item.created_at).format("DD-MM-YYYY") : "0"}
</td>
<td>
                              <div className="action-item">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#med-detail"
                                >
                                  <i className="fa-solid fa-link" />
                                </Link>
                                {/* <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit-med-record"
                                >
                                  <i className="fa-solid fa-pen-to-square" />
                                </Link>
                                <Link to="#">
                                  <i className="fa-solid fa-trash-can" />
                                </Link> */}
                              </div>
                            </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

              </div>

            </div>
          </div>
        </div>
      </div>
     
       

      <Footer {...props} />
      
    </div>
     {/* Add Medical Detail */}
     <div className="modal fade custom-modals" id="add-med-record">
     <div className="modal-dialog modal-dialog-centered modal-md">
       <div className="modal-content">
         <div className="modal-header">
           <h5 className="modal-title">Add Medical Details</h5>
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
                   <div className="input-block input-block-new">
                     <label className="form-label">BMI</label>
                     <input type="text" className="form-control" />
                   </div>
                 </div>
                 <div className="col-md-6">
                   <div className="input-block input-block-new">
                     <label className="form-label">Heart Rate</label>
                     <input type="text" className="form-control" />
                   </div>
                 </div>
                 <div className="col-md-6">
                   <div className="input-block input-block-new">
                     <label className="form-label">Weight</label>
                     <input type="text" className="form-control" />
                   </div>
                 </div>
                 <div className="col-md-6">
                   <div className="input-block input-block-new">
                     <label className="form-label">FBC</label>
                     <input type="text" className="form-control" />
                   </div>
                 </div>
                 <div className="col-md-12">
                   <div className="input-block input-block-new">
                     <label className="col-form-label">
                       End Date <span className="text-danger">*</span>
                     </label>
                     <div className="form-icon position-relative">
                       <DatePicker
                         className="form-control datetimepicker"
                         selected={selectedDate}
                         onChange={handleDateChange}
                         dateFormat="dd-MM-yyyy"
                       />
                       <span className="icon cal-form-icon">
                         <i className="fa-regular fa-calendar-days" />
                       </span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <div className="modal-footer">
             <div className="modal-btn text-end">
               <a
                 href="#"
                 className="btn btn-gray"
                 data-bs-toggle="modal"
                 data-bs-dismiss="modal"
               >
                 Cancel
               </a>
               <button type="submit" className="btn btn-primary prime-btn">
                 Save Changes
               </button>
             </div>
           </div>
         </form>
       </div>
     </div>
   </div>
   {/* /Add Medical Detail */}
   {/* Edit Medical Detail */}
   <div className="modal fade custom-modals" id="edit-med-record">
     <div className="modal-dialog modal-dialog-centered modal-md">
       <div className="modal-content">
         <div className="modal-header">
           <h5 className="modal-title">Edit Medical Details</h5>
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
                   <div className="input-block input-block-new">
                     <label className="form-label">BMI</label>
                     <input
                       type="text"
                       className="form-control"
                       defaultValue="20.1 kg/m2"
                     />
                   </div>
                 </div>
                 <div className="col-md-6">
                   <div className="input-block input-block-new">
                     <label className="form-label">Heart Rate</label>
                     <input
                       type="text"
                       className="form-control"
                       defaultValue="140 Bpm"
                     />
                   </div>
                 </div>
                 <div className="col-md-6">
                   <div className="input-block input-block-new">
                     <label className="form-label">Weight</label>
                     <input
                       type="text"
                       className="form-control"
                       defaultValue={300}
                     />
                   </div>
                 </div>
                 <div className="col-md-6">
                   <div className="input-block input-block-new">
                     <label className="form-label">FBC</label>
                     <input
                       type="text"
                       className="form-control"
                       defaultValue="70 - 90"
                     />
                   </div>
                 </div>
                 <div className="col-md-12">
                   <div className="input-block input-block-new">
                     <label className="col-form-label">
                       End Date <span className="text-danger">*</span>
                     </label>
                     <div className="form-icon position-relative">
                     <DatePicker
                         className="form-control datetimepicker"
                         selected={selectedDate}
                         onChange={handleDateChange}
                         dateFormat="dd-MM-yyyy"
                       />
                       <span className="icon cal-form-icon">
                         <i className="fa-regular fa-calendar-days" />
                       </span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <div className="modal-footer">
             <div className="modal-btn text-end">
               <a
                 href="#"
                 className="btn btn-gray"
                 data-bs-toggle="modal"
                 data-bs-dismiss="modal"
               >
                 Cancel
               </a>
               <button type="submit" className="btn btn-primary prime-btn">
                 Save Changes
               </button>
             </div>
           </div>
         </form>
       </div>
     </div>
   </div>
   {/* /Edit Medical Detail */}

 <div className="modal fade custom-modals" id="med-detail">
   <div className="modal-dialog modal-dialog-centered modal-md">
     <div className="modal-content">
       <div className="modal-header">
         <h6 className="modal-title">Medical Details</h6>
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
         <div className="med-detail-patient">
  <div className="med-patient">
    <span>
      <img src={Dataprofile?.profile_image || doctordashboardprofile06} alt="Img" />
    </span>
    <div className="name-detail">
    <h6 className="fw-bold" style={{ fontSize: "15px" }}>
  {Dataprofile?.name || "N/A"}
</h6>
  <div className="profile-details">
    <ul className="list-unstyled">
      <li><strong>Age:</strong> {Dataprofile?.age > 0 ? Dataprofile.age : "N/A"}</li>
      <li>{Dataprofile?.gender !== "Select Gender" ? Dataprofile.gender : "N/A"}</li>
      <li> {Dataprofile?.blood_group || "N/A"}</li>
    </ul>
  </div>
</div>

  </div>
  <div className="date-cal">
  <p>
  <span className="fw-semibold small">
    <i className="fa-solid fa-calendar-days me-2" />
    Last Updated:
  </span>
  <span className="ms-1">
  {Dataprofile?.updated_at
    ? new Date(Dataprofile.updated_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A"}
</span>
</p>
  </div>
</div>

           <div className="med-detail-item">
             <div className="d-flex flex-wrap">
             <div className="health-records icon-red">
        <span><i className="fa-solid fa-syringe" /> Blood Pressure</span>
        <h3>{data.bp ? `${data.bp} mmHg` : "0"}</h3>
      </div>
      <div className="health-records icon-orange">
        <span><i className="fa-solid fa-heart" /> Heart Rate</span>
        <h3>{data.pulse ? `${data.pulse} BPM` : "0"}</h3>
      </div>
      <div className="health-records icon-dark-blue">
        <span><i className="fa-solid fa-notes-medical" /> Before Sugar</span>
        <h3>{data.before_sugar ? `${data.before_sugar} mg/dL` : "0"}</h3>
      </div>
      <div className="health-records icon-teal">
        <span><i className="fa-solid fa-notes-medical" />After Sugar</span>
        <h3>{data.after_sugar ? `${data.after_sugar} mg/dL` : "0"}</h3>
      </div>
      <div className="health-records icon-amber">
        <span><i className="fa-solid fa-temperature-high" /> Temperature</span>
        <h3>{data.temp ? `${data.temp}°C` : "0"}</h3>
      </div>
      <div className="health-records icon-purple">
        <span><i className="fa-solid fa-user-pen" /> BMI</span>
        <h3>{data.bmi_value ? `${data.bmi_value} kg/m²` : "0"}</h3>
      </div>
      <div className="health-records icon-brown">
        <span><i className="fa-solid fa-ruler" /> Height</span>
        <h3>{data.height ? `${data.height} cm` : "0"}</h3>
      </div>
      <div className="health-records icon-green">
        <span><i className="fa-solid fa-weight-scale" /> Weight</span>
        <h3>{data.weight ? `${data.weight} kg` : "0"}</h3>
      </div>
      <div className="health-records icon-blue">
        <span><i className="fa-solid fa-highlighter" /> SPo2</span>
        <h3>{data.spo2 ? `${data.spo2}%` : "0"}</h3>
      </div>
             </div>
           </div>
         </div>
         {/* <div className="modal-footer">
           <div className="modal-btn text-end">
             <a
               href="#"
               className="btn btn-gray"
               data-bs-toggle="modal"
               data-bs-dismiss="modal"
             >
               Cancel
             </a>
             <button type="submit" className="btn btn-primary prime-btn">
               Save Changes
             </button>
           </div>
         </div> */}
       </form>
     </div>
   </div>
 </div>
 </>
  );
};

export default MedicalDetails;
