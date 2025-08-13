import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, Radio, Select, DatePicker, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import moment from "moment"; // For handling date format
import { useLocation } from "react-router-dom";
import { var_api } from "../../../constant";
// import {
//     logo,
//   } from "../../../../";

const PrescriptionList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedAppointment, setSelectedAppointment] = useState(null); 
  const appointmentPrefix = localStorage.getItem("admin_prescription_prefix");


  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
    setLoading(true);
    try {
      const response = await fetch(`${var_api}appointment/getAppointments-byhospital-prescriptions/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result.data || []);
      setFilteredData(result.data || []); // Set initial filtered data
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
  },[]);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = data.filter((item) => {
      return (
        (item.invoice_token && item.invoice_token.toLowerCase().includes(value)) ||
        (item.tech_details && item.tech_details.name && item.tech_details.name.toLowerCase().includes(value)) ||
        (item.patient_details && item.patient_details.name && item.patient_details.name.toLowerCase().includes(value)) ||
        (item.appointment_day && item.appointment_day.toLowerCase().includes(value)) ||
        (item.appointment_time && item.appointment_time.toLowerCase().includes(value)) ||
        (item.final_amount && item.final_amount.toString().includes(value)) ||
        (item.paid_amount && item.paid_amount.toString().includes(value)) ||
        (item.balance_amount && item.balance_amount.toString().includes(value)) ||
        (item.paid_status !== undefined && item.paid_status.toString().includes(value))
      );
    });
  
    setFilteredData(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
        title: "Serial No",
        render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
      },
      {
            title: "Appointment",
            dataIndex: "token_no",
            render: (text,record) => (
              <>
  <Link
  to={{
    pathname: `/admin/prescriptionreport`,
    state: { appointmentData: record }, // Pass the full response
  }}
  className="text-decoration-none"
>
  {text ? `#${appointmentPrefix}-${text}` : "N/A"}
</Link>


              </>
            ),
            // sorter: (a, b) => a.InvoiceNumber.length - b.InvoiceNumber.length,
          },     
    {
      title: "Appointment Date",
      dataIndex: "appointment_day",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Appointment Time",
      dataIndex: "appointment_time",
      render: (text) => (text ? text : "N/A"),
    },
    // {
    //     title: "Actions",
    //     render: (text, record) => (
    //     <div className="action-item">
    //         <Link
    //             to="#"
    //             data-bs-toggle="modal"
    //             data-bs-target="#view_prescription"
    //             onClick={() => handlePrescriptionClick(text.appointment_id)}
    //         >
    //             <i className="fa-solid fa-link" />
    //         </Link>
    //     </div>
    //     ),
    //   },
  ];

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Prescription Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Prescription Tables</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Prescription Details</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                     pagination={{
                        total: filteredData.length,
                        pageSize: pageSize, // Limit to 2 rows per page
                        current: currentPage,
                        showSizeChanger: false,
                        onShowSizeChange: (current, size) => handlePaginationChange(current, size),
                        onChange: handlePaginationChange,
                        itemRender: itemRender,
                      }}
                      loading={loading}
                      columns={columns}
                      dataSource={filteredData || []}
                      rowKey={(record) => record?.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
               className="modal fade custom-modals"
               id="view_prescription"
               tabIndex="-1"
               aria-labelledby="view_prescriptionLabel"
               aria-hidden="true"
              >
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
                      <h5>{selectedAppointment ? selectedAppointment.appointment_day : ""}</h5>
                        <ul>
                          <li>
                            <a href="#" className="print-link">
                              <i className="fa-solid fa-print" />
                            </a>
                          </li>
                          <li>
                            <a href="#" className="btn btn-primary prime-btn">
                              Download
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="view-prescribe invoice-content">
                        <div className="invoice-item">
                          <div className="row">
                            <div className="col-md-6">
                              {/* <div className="invoice-logo">
                                <img src={logo} alt="logo" />
                              </div> */}
                            </div>
                            <div className="col-md-6">
                              <p className="invoice-details">
                              <strong>Prescription ID :</strong> {selectedAppointment ? `#PR-${selectedAppointment.appointment_id}` : ""}  
                              <br />
                                <strong>Issued:</strong> {selectedAppointment ? selectedAppointment.appointment_day : ""}
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
                                {selectedAppointment ? selectedAppointment.tech_name : "Dr. "}<br />
                                {selectedAppointment ? selectedAppointment.tech_email : ""}<br />
                                {selectedAppointment ? selectedAppointment.tech_primary_mobile : ""}<br />
                                 
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="invoice-info invoice-info2">
                                <h6 className="customer-text">Patient Details</h6>
                                <p className="invoice-details">
                                {selectedAppointment ? selectedAppointment.patient_name : "Patient Name"}
                                   <br />
                                   {selectedAppointment ? selectedAppointment.patient_address : "Patient address"}
                                  <br />
                                  {selectedAppointment ? selectedAppointment.patient_mobile_no : "Patient mobile no"}
        
                                  
                                  <br />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* /Invoice Item */}
                        {/* Invoice Item */}
                        <div className="invoice-item invoice-table-wrap">
                          <div className="row">
                            <div className="col-md-12">
                              <h6>Prescription Details</h6>
                              <div className="table-responsive">
                                <table className="invoice-table table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Medicine Name</th>
                                      <th>Dosage</th>
                                      <th>Frequency</th>
                                      <th>Duration</th>
                                      <th>Timings</th>
                                    </tr>
                                  </thead>
                                  {/* <tbody>
                                    {selectedPrescription && selectedPrescription.length > 0 ? (
                                      selectedPrescription.map((prescription, index) => (
                                        <tr key={index}>
                                                 <td>{prescription.subcat_name?prescription.subcat_name:'tablet test'}</td>
                                                 <td>{prescription.qty}</td>
        
                                                 <td>{prescription.is_before_food}-{prescription.is_morning}-{prescription.is_noon}-{prescription.is_evening}</td>
                                          <td>{prescription.cycle} Months</td>
                                          <td>{prescription.is_before_food}</td>
                                   
                                    </tr>
                                       ))
                                      ) : (
                                        <tr>
                                          <td colSpan="5">No prescription available.</td>
                                        </tr>
                                      )}
                                  </tbody> */}
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* /Invoice Item */}
                        {/* Invoice Information */}
                        <div className="other-info">
                          <h4>Other information</h4>
                          <p className="text-muted mb-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Vivamus sed dictum ligula, cursus blandit risus. Maecenas
                            eget metus non tellus dignissim aliquam ut a ex. Maecenas
                            sed vehicula dui, ac suscipit lacus. Sed finibus leo vitae
                            lorem interdum, eu scelerisque tellus fermentum. Curabitur
                            sit amet lacinia lorem. Nullam finibus pellentesque libero.
                          </p>
                        </div>
                        <div className="other-info">
                          <h4>Follow Up</h4>
                          <p className="text-muted mb-0">
                            Follow u p after 3 months, Have to come on empty stomach
                          </p>
                        </div>
                        <div className="prescriber-info">
                        <h6>{selectedAppointment ? selectedAppointment.tech_name : "Dr. John Doe"}</h6>                  
                        <p>Dept of Cardiology</p>
                        </div>
                        {/* /Invoice Information */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      </div>
    
    </>
  );
};

export default PrescriptionList;
