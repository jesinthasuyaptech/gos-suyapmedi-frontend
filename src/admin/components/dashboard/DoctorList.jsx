import React from "react";
//import { Table } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Table, Button, Modal, Form, Input, Select, TimePicker, Switch, notification } from "antd";
import  { useState,useEffect } from 'react';
import { image_api, var_api } from "../../../constant";
import doc_dummy from "../../assets/img/doctors/doc_dummy.png";
import { Link } from "react-router-dom";

  
// import {
//   doctor_thumb_01,
//   doctor_thumb_02,
//   doctor_thumb_03,
//   doctor_thumb_04,
//   doctor_thumb_05,
// } from "../imagepath";
//import { Link } from "react-router-dom";

const DoctorListDesboard = () => {
  const [loading, setLoading] = useState(false);
  const [doctor, setdoctor] = useState(false);
  const [data, setdata] = useState([]);

    const fetchdoctorData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${var_api}technicalstaff/get-by-doctor/${hospital_id}/doctor`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();// Set initial filtered data
        setdoctor(result || []);
        
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
      fetchdoctorData();
      }, []); 
  // const data = [
  //   {
  //     id: 1,
  //     DoctorName: "Dr. Ruby Perrin",
  //     Speciality: "Dental ",
  //     Earned: "$3200.00 ",
  //     Date: "27 Sep 2019",
  //     time: "03.40 PM",
  //     image: doctor_thumb_01,
  //   },
  //   {
  //     id: 2,
  //     DoctorName: "Dr. Darren Elder",
  //     Speciality: "Dental ",
  //     Earned: "$3100.00 ",
  //     Date: "1 Nov 2019",
  //     time: "02.59 PM",
  //     image: doctor_thumb_02,
  //   },
  //   {
  //     id: 3,
  //     DoctorName: "Dr. Deborah Angel",
  //     Speciality: "Cardiology ",
  //     Earned: "$4000.00",
  //     Date: "3 Nov 2019",
  //     time: "09.59 PM",
  //     image: doctor_thumb_03,
  //   },
  //   {
  //     id: 4,
  //     DoctorName: "Dr. Sofia Brient",
  //     Speciality: "Urology ",
  //     Earned: "$3200.00 ",
  //     Date: "16 Jun 2019",
  //     time: "04.50 PM",
  //     image: doctor_thumb_04,
  //   },
  //   {
  //     id: 5,
  //     DoctorName: "Dr. Marvin Campbell",
  //     Speciality: "Orthopaedics ",
  //     Earned: "$3500.00 ",
  //     Date: "22 Aug 2019",
  //     time: "01.50 PM",
  //     image: doctor_thumb_05,
  //   },
  // ];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (text ? text : "N/A"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    
    {
      title: "Profile Image",
      dataIndex: "profile_image",
      render: (text) =>
        text ? (
          <img
            src={ text && /\.(jpeg|jpg|png|webp)$/i.test(text) 
                            ? `${image_api}technical/${text}`
                            : doc_dummy}
            alt="Profile"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          "-"
        ),
    },
      {
        title: "Specialization",
        dataIndex: "specialization",
        render: (text) => (text ? text : "N/A"),
      },
      // {
      //   title: "Qualification",
      //   dataIndex: "qualification",
      //   render: (text) => (text ? text : "N/A"),
      // }, 
    

    //   title: "Doctor Name",
    //   dataIndex: "DoctorName",
    //   render: (text, record) => (
    //     <>
    //       <Link className="avatar mx-2" to="/admin/profile">
    //         <img className="rounded-circle" src={record.image} />
    //       </Link>
    //       <Link to="/admin/profile">{text}</Link>
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
    //   title: "Earned",
    //   dataIndex: "Earned",
    //   sorter: (a, b) => a.Earned.length - b.Earned.length,
    // },
    // {
    //   title: "Review",
    //   dataIndex: "Rating",
    //   render: () => (
    //     <>
    //       <span>
    //         <i className="fe fe-star text-warning" />
    //         <i className="fe fe-star text-warning" />
    //         <i className="fe fe-star text-warning" />
    //         <i className="fe fe-star text-warning" />
    //         <i className="fe fe-star-o text-secondary" />
    //       </span>
    //     </>
    //   ),
    //   sorter: (a, b) => a.Rating.length - b.Rating.length,
    // },
  ];
  return (
    <>
      <div className="col-md-6 d-flex">
        {/* Recent Orders */}
        <div className="card card-table flex-fill">
        <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">Doctors List</h4>
            <Link
                            to="/admin/technical"
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
                dataSource={doctor}
                rowKey={(record) => record.id}
                //  onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
        {/* /Recent Orders */}
      </div>
    </>
  );
};
export default DoctorListDesboard;
