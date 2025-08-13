/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profileimage } from "../imagepath";
import { Table, Button, Modal, Form, Input, notification,Spin,Badge  } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Dropdown } from "bootstrap";
import { var_api,image_api } from "../../../constant";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { header_logo2 } from "../imagepath"; 
import admin_dummy from "../../../admin/assets/img/admin_dummy.jpg";

const Header = () => {
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState("Guest");
  const [userRole, setUserRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(profileimage);
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]); 
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsId,   setNotificationId] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)||
        item.title.toLowerCase().includes(value)||
        item.running_no.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const filteredNotifications = filteredData.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };


  useEffect(() => {
    console.log("🔍 Checking Bootstrap...");
    console.log(typeof bootstrap !== "undefined" ? "✅ Bootstrap Loaded" : "❌ Bootstrap Not Loaded");

    const admin_profile = localStorage.getItem("pres_admin_profile") ?? "";
    const admin_role = localStorage.getItem("pres_admin_role") ?? "User";
    const admin_name = localStorage.getItem("pres_admin_name") ?? "Guest";
    

    setUserName(admin_name);
    setUserRole(admin_role);
    setProfileImage(admin_profile && admin_profile !== "-" ? admin_profile : profileimage);

    // Manually initialize Bootstrap dropdown
    setTimeout(() => {
      const dropdownElement = document.querySelector(".dropdown-toggle");
      if (dropdownElement) {
        new Dropdown(dropdownElement);
        console.log("✅ Bootstrap Dropdown Initialized");
      } else {
        console.error("❌ Dropdown toggle not found");
      }
    }, 500);
  }, []);

    useEffect(() => {
      const storedData = localStorage.getItem("user_data");
      console.log("kokki",storedData);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserName(parsedData.name);
        setUserRole(parsedData.roll);
      }
    }, []);

  const toggleSidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    console.log("🔄 Sidebar Toggled");
  };

  const toggleMobileMenu = () => {
    document.body.classList.toggle("slide-nav");
    console.log("🔄 Mobile Menu Toggled");
  };


  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const toggleDropdown = () => {
    console.log("🔄 Manually Toggling Dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (dropdownMenu) {
      dropdownMenu.classList.toggle("show"); // Manually toggle
    } else {
      console.error("❌ Dropdown menu not found");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('pres_token');
    const hospital_id = localStorage.getItem('pres_hospital_id');
    try {
      const response = await fetch(`${var_api}pharmacynotification/get-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("pharmacyadmin/pharmacyLogin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []); // Set initial filtered data
      setNotificationCount(result?.length || 0); 
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
   
    const token = localStorage.getItem('pres_token');
    
    try {
      const payload = {
        title: id.title,
        description: id.description,
        read_status: 1 // Marking as read
      };
  
      const response = await fetch(`${var_api}pharmacynotification/update/${id.id}`, {
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
      fetchData();

  
      const data = await response.json();
      console.log('Notification marked as read', data);
  
    } catch (error) {
      console.error('Error marking notification as read', error);
    } finally {
      setLoading(false);
    }
  };
  
  

    useEffect(() => {
      fetchData();
    }, []);

    const clearLocalStorage = () => {

      localStorage.removeItem("pres_token");
      console.log("afterlogout",localStorage.getItem("pres_token"))
    
      // window.location.href = "pharmacyadmin/pharmacyLogin";
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



  return (
    <div className="header">
      <div className="header-left">
        <Link to="/pharmacyadmin" className="logo">
         <img src={header_logo2} alt="Logo" />
        </Link>
        <Link to="/pharmacyadmin" className="logo logo-small">
                      <img src={header_logo2} alt="Logo" width="30" height="30" />
        </Link>
      </div>

      <Link to="#" id="toggle_btn" onClick={toggleSidebar}>
        <i className="fe fe-text-align-left text-black"></i>
      </Link>

      <Link to="#" className="mobile_btn" id="mobile_btn" onClick={toggleMobileMenu}>
        <i className="fa fa-bars text-black" />
      </Link>


      <ul className="nav user-menu">
        <li className="nav-item dropdown">
        <button
  className="nav-link dropdown-toggle border-0 bg-transparent"
  type="button"
  data-bs-toggle="dropdown"
  aria-expanded="false"
  onClick={toggleDropdown}
>
  <span className="user-img">
  <img
  className="rounded-circle"
  src={profileImage && /\.(jpeg|jpg|png|webp)$/i.test(profileImage) ? `${image_api}${profileImage}` : admin_dummy}
  width={31}
  alt="Admin"
/>
  </span>
</button> 

<div className="dropdown position-relative">
  {/* Dropdown Toggle Button */}
  {/* <button 
    className="btn btn-secondary dropdown-toggle" 
    type="button" 
    id="userDropdown" 
    data-bs-toggle="dropdown" 
    aria-expanded="false"
  >
    {userName ? userName : "Guest"}
  </button> */}

  {/* Dropdown Menu */}
  <ul 
    className="dropdown-menu dropdown-menu-end w-100" 
    aria-labelledby="userDropdown"
    style={{ minWidth: "250px" }}
  >
    {/* Dropdown Header with User Info */}
    <li className="dropdown-header text-center px-4 py-2">
      <div className="d-flex flex-column align-items-center">
        {/* Profile Image - Uncomment if you want to use it */}
        {/* <div className="avatar avatar-lg mb-2">
          <img
            className="rounded-circle"
            src={profileImage && /\.(jpeg|jpg|png|webp)$/i.test(profileImage) 
                  ? `${image_api}${profileImage}` 
                  : admin_dummy}
            width="60"
            alt="User"
          />
        </div> */}
        <h6 className="mb-0 fw-bold">{userName ? userName : "Guest"}</h6>
        <small className="text-muted">{userRole ? userRole : "User"}</small>
      </div>
    </li>
    
    <li><hr className="dropdown-divider m-0" /></li>
    
    {/* Profile Link */}
    <li>
      <Link 
       className="dropdown-item d-flex align-items-center py-2 text-dark"
        to="/pharmacyadmin/profile"
      >
        <i className="bi bi-person me-2"></i>
        My Profile
      </Link>
    </li>
    
    {/* Logout Link */}
    <li>
      <Link
        className="dropdown-item d-flex align-items-center px-4 py-2 text-danger"
        to="/pharmacyadmin/pharmacyLogin"
        onClick={clearLocalStorage}
      >
        <i className="bi bi-box-arrow-right me-2"></i>
        Logout
      </Link>
    </li>
  </ul>
</div>
        </li>
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
      height: "40px", // Adjust as per navbar height
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
  <div className="modal d-block bg-dark bg-opacity-50" style={{ overflow: 'hidden' }}>
    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
      <div className="modal-content">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Notifications</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowModal(false)}
          />
        </div>
        <br/>
        <div className="row m-3">
            <div className="col-md-4">
             
                          <input 
                     
  className="form-control"
  type="text"
  placeholder="Search"
  value={searchTerm}
  onChange={handleSearch}
  style={{ width: "300px" ,height : "24px"}} // Adjust the width as needed
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
                 

        <div className="modal-footer border-0 pt-0">
          <button 
            className="btn btn-danger"
            onClick={() => setShowModal(false)}
          >
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
  );
};

export default Header;
