/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { ChevronDown } from "lucide-react";
import { Table,notification,Spin } from "antd";
import admin_dummy from "../../assets/img/admin_dummy.jpg";
import {
  logo,
  logoSmall,
  header_logo,
} from "../imagepath";
import { useHistory } from "react-router-dom";
import { var_api, image_api } from "../../../constant.js";


const Header = () => {
  const location = useLocation(); // Use useLocation() instead of props.location
  const hospital = localStorage.getItem("hospital_id");
  const token = localStorage.getItem("token");
  const admin_name = localStorage.getItem("admin_name");
  const admin_profile = localStorage.getItem("admin_profile");
  const history = useHistory(); 


  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    // useEffect(() => {
    //   if (!hospital || !token) {
    //     history.push("/admin/login");
    //   }
    // }, []);
    
  // Exclude this component from rendering on certain pages
  const exclusionArray = ["/admin/login"];
const isExcluded = exclusionArray.includes(location.pathname);

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };

  const handlesidebarmobilemenu = () => {
    document.body.classList.toggle("slide-nav");
  };


    // Handle search input change
    const handleSearch = (e) => {
      const value = e.target.value.toLowerCase();
      setSearchTerm(value);
  
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value)||
          item.running_no.toLowerCase().includes(value)||
          item.title.toLowerCase().includes(value)
      );
      setFilteredData(filtered);
    };
  // const clearLocalStorage = () => {
  //   localStorage.removeItem("hospital_id");
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("doctor_id");
  //   localStorage.removeItem("user_email");
  //   console.log("All tokens and user-related data have been removed from localStorage.");
  // };

  const clearLocalStorage = () => {
    localStorage.removeItem("hospital_id");
    localStorage.removeItem("token");
    localStorage.removeItem("doctor_id");
    localStorage.removeItem("user_email");
  
    console.log("All tokens and user-related data have been removed from localStorage.");
  
    // Ensure proper navigation on logout
    history.push("/admin/login")
    // window.location.href = "/admin/login"; // Instead of <Link to="/admin/login">
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    setFilteredData([...filteredData]); // Forces a re-render
  };
  

  useEffect(() => {
    fetchDatanoti();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${var_api}hospital/get/${hospital}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      localStorage.setItem("admin_appointment_prefix", result.appointment_prefix);
      localStorage.setItem("admin_invoiced_prefix", result.doctorinvoice_prefix);
      localStorage.setItem("admin_invoicem_prefix", result.medicalinvoice_prefix);
      localStorage.setItem("admin_prescription_prefix", result.prescriptionid_prefix);
      localStorage.setItem("admin_patient_prefix", result.patentid_prefix);
      localStorage.setItem("is_private", result.is_private);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDatanoti();
  }, []);

  const fetchDatanoti = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const hospital_id = localStorage.getItem('hospital_id');
      try {
        const response = await fetch(`${var_api}hospitalnotification/get-hospital/${hospital_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if (response.status === 401) {
          // notification.warning({
          //   message: "Unauthorized",
          //   description: "Your session has expired. Please log in again.",
          // });
          // window.location.href = "/admin/login"; // Redirect to login page
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result || []);
        setFilteredData(result || []); // Set initial filtered data
        setNotificationCount(result.length);
        setLoading(false);
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

      const handleMarkAsRead = async (id) => {
      
         
        console.log ("harini",id)
      
        setLoading(true);  // Set loading to true before making the API call
       
        const token = localStorage.getItem('token');
        
        try {
          const payload = {
            title: id.title,
            description: id.description,
            read_status: 1 // Marking as read
          };
      
          const response = await fetch(`${var_api}hospitalnotification/update/${id.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update notification');
          }
          fetchDatanoti();
    
      
          const data = await response.json();
          console.log('Notification marked as read', data);
      
        } catch (error) {
          console.error('Error marking notification as read', error);
        } finally {
          setLoading(false);
        }
      };
  

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Patient ID",
      dataIndex: 'running_no',
   
    },
    {
      title: "Patient name",
      dataIndex: 'name',
    
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.title?.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (text ? text : "-"),
    },
  
    {
      title: "Action",
      className: "text-start",
      render: (_, record) => (
        <div className="text-start">
          <button 
            className="btn btn-sm bg-success-light" 
            onClick={() => handleMarkAsRead(record)} 
            disabled={record.read_status === 1} // Disable button if already read
          >
            {record.read_status === 1 ? "Read" : "Mark as Read"}
          </button>
        </div>
      ),
    },
  ];

    if (isExcluded) return null;

  return (
    <>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <Link to="/admin" className="logo">
            <img src={header_logo} alt="Logo" />
          </Link>
          <Link to="/admin" className="logo logo-small">
            <img src={header_logo} alt="Logo" width="30" height="30" />
          </Link>
        </div>
        <Link to="#" id="toggle_btn" onClick={handlesidebar}>
          <i className="fe fe-text-align-left"></i>
        </Link>

        <Link to="#" className="mobile_btn" id="mobile_btn" onClick={handlesidebarmobilemenu}>
          <i className="fa fa-bars" />
        </Link>


        <ul className="nav user-menu">
          <Dropdown>
            <Dropdown.Toggle as="a" className="nav-link dropdown-toggle">
              <span className="user-img">
                <img
                  className="rounded-circle"
                  src={admin_profile && /\.(jpeg|jpg|png|webp)$/i.test(admin_profile) ? `${image_api}${admin_profile}` : admin_dummy}
                  width={31}
                  alt="Admin"
                />
              </span>
              <ChevronDown className="ms-2" size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item><b>{admin_name}!</b></Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin/profile">My Profile</Dropdown.Item>
              {/* <Dropdown.Item as={Link} to="/admin/hospital-settings">Settings</Dropdown.Item> */}
              <Dropdown.Item as="button" onClick={clearLocalStorage}>
             Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
        
        <ul className="nav user-menu">
          <li className="nav-item dropdown">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
  <button
    className="nav-link dropdown-toggle border-0 bg-transparent"
    type="button"
    onClick={() => setShowModal(true)}
    style={{
      position: "relative",
      background: "transparent",
      border: "none",
      padding: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "40px",
      width: "40px",
    }}
  >
    <i className="fa fa-bell" style={{ fontSize: "18px", color: "#007bff" }}></i>
    {notificationCount > 0 && (
      <span style={{
        position: "absolute",
        top: "2px",
        right: "2px",
        backgroundColor: "red",
        color: "#fff",
        borderRadius: "50%",
        fontSize: "10px",
        minWidth: "16px",
        height: "16px",
        lineHeight: "16px",
        textAlign: "center",
        fontWeight: "bold",
        padding: "0 5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box"
      }}>
        {notificationCount}
      </span>
    )}
  </button>
</div>


            {showModal && (
              <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Notifications</h5>
                      <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div >
                      <br/>
                    <div className="row m-3">
            <div className="col-md-4">
             
                          <input
  className="form-control"
  type="text"
  placeholder="Search"
  value={searchTerm}
  onChange={handleSearch}
  style={{ width: "300px" }} // Adjust the width as needed
/>
            </div>
          </div>
                    <div className="card-body">
                      <div className="table-responsive">
                      <Spin spinning={loading}>
                      <Table
  pagination={{
    total: filteredData.length,
    pageSize,
    current: currentPage,
    showSizeChanger: false, // Hide page size selector
    showQuickJumper: false, // Prevent number input field
    simple: true, // Enable minimal pagination style
    onChange: handlePaginationChange,
  }}
  columns={columns}
  dataSource={filteredData || []}
  rowKey={(record) => record?.id}
/>


</Spin>
                      </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
