import React from "react";
//import { Table } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
// import SidebarNav from '../sidebar';
import { Table, Button, Modal, Form, Input, Select, TimePicker, Switch, notification } from "antd";
import  { useState,useEffect } from 'react';
import { var_api } from "../../../constant";
import { Link } from "react-router-dom";


// import {
//   doctor_thumb_01,
//   doctor_thumb_02,
//   doctor_thumb_03,
//   doctor_thumb_04,
//   doctor_thumb_05,
//   patient1,
//   patient2,
//   patient3,
//   patient4,
//   patient5,
// } from "../imagepath";
//import { Link } from "react-router-dom";



const AppointmentList = () => {
  const [loading, setLoading] = useState(false);
  const [appointment, settotalappointment] = useState(false);
  const [data, setdata] = useState([]);
  const adminappointmentp = localStorage.getItem("admin_appointment_prefix");
  const fetchappointmentData = async () => {
    setLoading(true);
    const hospital_id = localStorage.getItem('hospital_id');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${var_api}appointment/appointments-by-topfive-appointment/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, 
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();// Set initial filtered data
      settotalappointment(result || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      // notification.error({
      //   message: "Fetch Failed",
      //   description: "Unable to retrieve data. Please try again later.",
      // });
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  fetchappointmentData();
  }, []);

  // const data = [
  //   {
  //     id: 1,
  //     DoctorName: "Dr. Ruby Perrin",
  //     Speciality: "Dental ",
  //     PatientName: "Charlene Reed",
  //     Earned: "$5000.00 ",
  //     Date: "27 Sep 2019",
  //     time: "11.00 AM - 11.15 AM",
  //     Amount: "$200.00",
  //     image: doctor_thumb_01,
  //     images1: patient1,
  //     Status: "checkbox",
  //   },
  //   {
  //     id: 2,
  //     DoctorName: "Dr. Darren Elder",
  //     Speciality: "Dental ",
  //     PatientName: "Travis Trimble",
  //     Earned: "$3300.00 ",
  //     Date: "1 Nov 2019",
  //     time: "11.00 PM - 11.35 PM",
  //     Amount: "$300.00",
  //     image: doctor_thumb_02,
  //     images1: patient2,
  //     Status: "checkbox",
  //   },
  //   {
  //     id: 3,
  //     DoctorName: "Dr. Deborah Angel",
  //     Speciality: "Cardiology ",
  //     PatientName: "Carl Jaya Priya",
  //     Earned: "$4100.00",
  //     Date: "3 Nov 2019",
  //     time: "12.00 PM - 12.15 PM",
  //     Amount: "$150.00",
  //     image: doctor_thumb_03,
  //     images1: patient3,
  //     Status: "checkbox",
  //   },
  //   {
  //     id: 4,
  //     DoctorName: "Dr. Sofia Brient",
  //     Speciality: "Urology ",
  //     PatientName: "Michelle Fairfax",
  //     Earned: "$4000.00 ",
  //     Date: "16 Jun 2019",
  //     time: "1.00 PM - 1.20 PM",
  //     Amount: "$150.00",
  //     image: doctor_thumb_04,
  //     images1: patient4,
  //     Status: "checkbox",
  //   },
  //   {
  //     id: 5,
  //     DoctorName: "Dr. Marvin Campbell",
  //     Speciality: "Orthopaedics ",
  //     PatientName: "Gina Moore",
  //     Earned: "$2000.00 ",
  //     Date: "22 Aug 2019",
  //     time: "1.00 PM - 1.15 PM",
  //     Amount: "$200.00",
  //     image: doctor_thumb_05,
  //     images1: patient5,
  //     Status: "checkbox",
  //   },
  // ];
  const columns = [
    {
      title: "Appt.No",
      dataIndex: "token_no",
      render: (text) => (text ? <span style={{ color: '#1d7ed8' }}>#{adminappointmentp}{text}</span> : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),

    },
    {
      title: "Patient Name",
      dataIndex: "patient_name",
      render: (text) => (text ? text : "N/A"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Doctor",
      dataIndex: "tech_name",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: " Appt.Time",
      dataIndex: "appointment_time",
      render: (text) => (text ? text : "N/A"),
    },
    // {
    //   title: "Status",
    //   dataIndex: "paid_status",
    //   render: (text) => {
    //     const getStatusColor = (status) => {
    //       if (status == 0) return "#f8d7da"; // Mild red
    //       if (status == 1) return "#d4edda"; // Mild green
    //       if (status == 2) return "#fff3cd"; // Mild orange
    //       return "#f8f9fa"; // Mild gray for "N/A"
    //     };
    
    //     const getTextColor = (status) => {
    //       if (status == 0) return "#721c24"; // Dark red for text
    //       if (status == 1) return "#155724"; // Dark green for text
    //       if (status == 2) return "#856404"; // Dark orange for text
    //       return "#6c757d"; // Gray for text
    //     };
    
    //     return (
    //       <div
    //         style={{
    //           display: "inline-block",
    //           color: getTextColor(text),
    //           backgroundColor: getStatusColor(text),
    //           padding: "2px 6px", // Reduced padding for a more compact look
    //           borderRadius: "6px", // Slightly smaller border radius
    //           textAlign: "center",
    //           boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow
    //           border:` 1px solid ${getTextColor(text)}`, // Matches border color with text color
    //           width: "80px", // Reduced width
    //           fontSize: "12px", // Smaller font size
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //           whiteSpace: "nowrap",
    //         }}
    //       >
    //         {text == 0
    //           ? "Not Paid"
    //           : text == 1
    //           ? "Paid"
    //           : text == 2
    //           ? "Partial"
    //           : "N/A"}
    //       </div>
    //     );
    //   },
    // }
    // {
    //   title: "Doctor Name",
    //   dataIndex: "DoctorName",
    //   render: (text, record) => (
    //     <>
    //       <Link className="avatar mx-2" to="/admin/profile">
    //         <img className="rounded-circle" src={record.image} />
    //       </Link>
    //       <Link to="/admin/profile" className="text-decoration-none">
    //         {text}
    //       </Link>
    //     </>
    //   ),
    //   sorter: (a, b) => a.DoctorName.length - b.DoctorName.length,
    // },
    // {
    //   title: "Speciality",
    //   dataIndex: "Speciality",
    //   sorter: (a, b) => a.Speciality.length - b.Speciality.length,
    // },

    // {
    //   title: "Patient Name",
    //   dataIndex: "PatientName",
    //   render: (text, record) => (
    //     <>
    //       <Link className="avatar mx-2" to="/admin/profile">
    //         <img className="rounded-circle" src={record.images1} />
    //       </Link>
    //       <Link to="/admin/profile">{text}</Link>
    //     </>
    //   ),
    //   sorter: (a, b) => a.PatientName.length - b.PatientName.length,
    // },

    // {
    //   title: "Apointment Time",
    //   render: (record) => (
    //     <>
    //       <span className="user-name">{record.Date}</span>
    //       <br />
    //       <span className="d-block">{record.time}</span>
    //     </>
    //   ),
    //   sorter: (a, b) => a.Date.length - b.time.length,
    // },
    // {
    //   title: "Status",
    //   dataIndex: "Status",
    //   render: (text, record) => {
    //     return (
    //       <div className="status-toggle">
    //         <input
    //           id={`rating${record?.id}`}
    //           className="check"
    //           type="checkbox"
    //           defaultChecked=""
    //         />
    //         <label
    //           htmlFor={`rating${record?.id}`}
    //           className="checktoggle checkbox-bg"
    //         >
    //           checkbox
    //         </label>
    //       </div>
    //     );
    //   },
    //   sorter: (a, b) => a.Status.length - b.Status.length,
    // },
    // {
    //   title: "Amount",
    //   dataIndex: "Amount",
    //   sorter: (a, b) => a.Amount.length - b.Amount.length,
    // },
  ];
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {/* Recent Orders */}
          <div className="card card-table">
          <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title">Appointment List</h4>
              <Link
    to="/admin/appointment-list"
    className="btn btn-primary ms-auto"
  >
    View All
  </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <Table
               pagination={false}
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={appointment}
                  rowKey={(record) => record.id}
                  //  onChange={this.handleTableChange}
                />
              </div>
            </div>
          </div>
          {/* /Recent Orders */}
        </div>
      </div>
    </>
  );
};
export default AppointmentList;
