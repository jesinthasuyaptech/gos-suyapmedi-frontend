/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { ChevronDown } from "lucide-react";
// import admin_dummy from "../../assets/img/admin_dummy.jpg";
import { logo, logoSmall, header_logo } from "../components/imagepath.jsx";
import { var_api, image_api } from "../../constant.js";
import admin_dummy from "../assets/img/admin_dummy.jpg";

const UltraHeader = () => {
  const location = useLocation();
  const hospital = localStorage.getItem("hospital_id");
  const token = localStorage.getItem("ultratoken");
  const admin_name = localStorage.getItem("admin_name");
  const admin_profile = localStorage.getItem("admin_profile");
  console.log("Hospital IDheader:", hospital);

  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };

  const handlesidebarmobilemenu = () => {
    document.body.classList.toggle("slide-nav");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value) ||
        item.running_no.toLowerCase().includes(value) ||
        item.title.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const clearLocalStorage = () => {

    localStorage.removeItem("ultratoken");
  
    window.location.href = "/admin/superultraadmin";
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    setFilteredData([...filteredData]);
  };

 

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch(`${var_api}hospital/get/${hospital}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       },
  //     });

  //     if (!response.ok) throw new Error("Failed to fetch data");

  //     const result = await response.json();
  //     localStorage.setItem("admin_appointment_prefix", result.appointment_prefix);
  //     localStorage.setItem("admin_invoiced_prefix", result.doctorinvoice_prefix);
  //     localStorage.setItem("admin_invoicem_prefix", result.medicalinvoice_prefix);
  //     localStorage.setItem("admin_prescription_prefix", result.prescriptionid_prefix);
  //     localStorage.setItem("admin_patient_prefix", result.patentid_prefix);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

//   const fetchDatanoti = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     const hospital_id = localStorage.getItem('hospital_id');
//     try {
//       const response = await fetch(`${var_api}hospitalnotification/get-hospital/${hospital_id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${token}`,
//         },
//       });
      
//       if (response.status === 401) {
//         window.location.href = "/admin/login";
//         notification.warning({
//           message: "Unauthorized",
//           description: "Your session has expired. Please log in again.",
//         });
//         return;
//       }
      
//       if (!response.ok) throw new Error("Failed to fetch data");
//       const result = await response.json();
//       setData(result || []);
//       setFilteredData(result || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       notification.error({
//         message: "Fetch Failed",
//         description: "Unable to retrieve data. Please try again later.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAsRead = async (id) => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     try {
//       const payload = {
//         title: id.title,
//         description: id.description,
//         read_status: 1
//       };

//       const response = await fetch(`${var_api}hospitalnotification/update/${id.id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update notification');
//       }
//       fetchDatanoti();
//     } catch (error) {
//       console.error('Error marking notification as read', error);
//     } finally {
//       setLoading(false);
//     }
//   };



  return (
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
        <li className="nav-item dropdown">
          {/* <button className="nav-link dropdown-toggle border-0 bg-transparent" type="button" onClick={() => setShowModal(true)}>
            <i className="fa fa-bell"></i>
          </button> */}
        </li>
      </ul>

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
            {/* <Dropdown.Item as={Link} to="/admin/profile">My Profile</Dropdown.Item>
            <Dropdown.Item as={Link} to="/admin/hospital-settings">Settings</Dropdown.Item> */}
            <Dropdown.Item as="button" onClick={clearLocalStorage}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ul>
    </div>
  );
};

export default UltraHeader;