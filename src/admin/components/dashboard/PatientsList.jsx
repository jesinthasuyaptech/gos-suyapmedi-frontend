import React from "react";
//import { Table } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { patient1, patient2, patient3, patient4, patient5 } from "../imagepath";
// import SidebarNav from '../sidebar';
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Form, Input, Select, TimePicker, Switch, notification } from "antd";
import  { useState,useEffect } from 'react';
import { image_api, var_api } from "../../../constant";
// import patientimg from "../../../client/assets/img/patient/pat_dummy.jpeg"
import pat_dummy from "../../assets/img/patients/pat_dummy.png";


 

const PatientsListDesboard = () => {
 const [loading, setLoading] = useState(false);
  const [patient, setpatient] = useState(false);
  const adminpatientp = localStorage.getItem("admin_patient_prefix");
  //const [data, setdata] = useState([]);
  
   const fetchpatientData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${var_api}patientdetails/get-bypatient-topfive/${hospital_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, 
          },
        });
                if (response.status === 401) {
                  history.push("/admin/login"); // Redirect to login page
                  notification.warning({
                    message: "Unauthorized",
                    description: "Your session has expired. Please log in again.",
                  });
                  return;
                }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();// Set initial filtered data
        setpatient(result || []);
        
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
      fetchpatientData();
      }, []);

  const data = [
    {
      id: 1,
      PatientID: "#PT001",
      PatientName: "Charlene Reed",
      Age: "29",
      Address: "4417 Goosetown Drive, Taylorsville, North Carolina, 28681",
      Phone: "8286329170",
      VisitLast: "20 Oct 2019",
      Paid: "$100.00",
      image: patient1,
    },
    {
      id: 2,
      PatientID: "#PT001",
      PatientName: "Travis Trimble",
      Age: "23",
      Address: "4026 Fantages Way, Brunswick, Maine, 04011 ",
      Phone: "2077299974",
      VisitLast: "22 Oct 2019",
      Paid: "$200.00",
      image: patient2,
    },
    {
      id: 3,
      PatientID: "#PT001",
      PatientName: "Carl Jaya Priya",
      Age: "29",
      Address: "2037 Pearcy Avenue, Decatur, Indiana, 46733 ",
      Phone: "2607247769",
      VisitLast: "21 Oct 2019",
      Paid: "$250.00",
      image: patient3,
    },
    {
      id: 4,
      PatientID: "#PT001",
      PatientName: "Michelle Fairfax",
      Age: "25",
      Address: "2037 Pearcy Avenue, Decatur, Indiana, 46733 ",
      Phone: "5043686874",
      VisitLast: "21 Sep 2019",
      Paid: "$150.00",
      image: patient4,
    },
    {
      id: 5,
      PatientID: "#PT001",
      PatientName: "Gina Moore",
      Age: "23",
      Address: "888 Everette Alley, Hialeah, Florida, 33012 ",
      Phone: "9548207887",
      VisitLast: "18 Sep 2019",
      Paid: "$350.00",
      image: patient5,
    },
  ];
  const columns = [
    {
      title: "Patient Id",
      dataIndex: "running_no",
      render: (text) => (text ? <span style={{ color: '#1d7ed8' }}>#{text}</span> : "-"),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (text ? text : "N/A"),
    },
    // {
    //   title: "Profile Image",
    //   dataIndex: "profile_image",
    //   render: (text) => (text ? text : "N/A"),
    // },
    {
      title: "Profile Image",
      dataIndex: "profile_image",
      render: (text) =>
        text && /\.(jpeg|jpg|png|webp)$/i.test(text) ? (
          <img
            src={`${image_api}technical/${text}`}
            alt="Profile"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <img
            src={pat_dummy}
            alt="Dummy Profile"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ),
    },
    {
      title: "Mobile No",
      dataIndex: "mobile_no",
      render: (text) => (text ? text : "N/A"),
    },
    // {
    //   title: "Patient Name",
    //   dataIndex: "PatientName",
    //   render: (text, record) => (
    //     <>
    //       <Link className="avatar mx-2" to="/admin/profile">
    //         <img className="rounded-circle" src={record.image} />
    //       </Link>
    //       <Link to="/admin/profile">{text}</Link>
    //     </>
    //   ),
    //   sorter: (a, b) => a.PatientName.length - b.PatientName.length,
    // },

    // {
    //   title: "Phone",
    //   dataIndex: "Phone",
    //   sorter: (a, b) => a.Phone.length - b.Phone.length,
    // },
    // {
    //   title: "Last Visit",
    //   dataIndex: "VisitLast",
    //   sorter: (a, b) => a.length - b.length,
    // },
    // {
    //   title: "Paid",
    //   dataIndex: "Paid",
    //   sorter: (a, b) => a.Paid.length - b.Paid.length,
    // },
  ];
  return (
    <>
      <div className="col-md-12 d-flex">
        {/* Feed Activity */}
        <div className="card  card-table flex-fill">
        <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">Patients List</h4>
            <Link
                                     to="/admin/patientdetails"
                                     className="btn btn-primary"
                                    
                                     
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
                dataSource={patient}
                rowKey={(record) => record.id}
                //  onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
        {/* /Feed Activity */}
      </div>
    </>
  );
};
export default PatientsListDesboard;
