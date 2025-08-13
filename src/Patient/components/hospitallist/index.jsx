import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
import StickyBox from "react-sticky-box"; 
import hospital_dummy from "../../../admin/assets/img/hospital/hospital_dummy.png"

const hospitallist = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletename, setDeletename] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const history = useHistory(); 

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("patient_token");

    try {
      const response = await fetch(`${var_api}hospital/get-public`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 401) {
        history.push("/patient/patientlogin");
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []);
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
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(value) ||
        hospital.email.toLowerCase().includes(value) ||
        (hospital.address && hospital.address.toLowerCase().includes(value))
    );
    setFilteredData(filtered);
  };

  const handleModalOpen = (record = null) => {
    setEditData(record);
    form.resetFields();
    if (record) {
      form.setFieldsValue(record);
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setIsDeleteConfirmVisible(false);
  };

  const handleCardClick = (hospitalId, hospitalname) => {
    localStorage.setItem("Patient_HospitalId", hospitalId);
    localStorage.setItem("patient_Hospital_Name", hospitalname);
    history.push(`/patient/dashboard`);
    window.location.href = "/patient/dashboard";
  };

  return (
    <>
      <style>
        {`
          .page-wrapper {
            margin-left: 0 !important;
            padding: 20px;
          }
          .content.container-fluid {
            padding: 0;
            max-width: 100%;
          }
          .hospital-card {
            width: 100%;
          }
        `}
         {`
      .header {
        display: none !important;
      }
    `}
      </style>
      
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      
      <div className="page-wrapper">
        <div className="content container-fluid" style={{ padding: '0 15px' }}>
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Public Hospital List</h3>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12">
              <input
                type="text"
                className="form-control"
                style={{ width: "100%", maxWidth: "350px" }}
                placeholder="Search hospital..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="row d-flex flex-wrap" style={{ margin: '0 -10px' }}>
            {loading ? (
              <p>Loading...</p>
            ) : filteredData.length > 0 ? (
              filteredData.map((hospital) => (
                <div
                  key={hospital.id}
                  className="col-12 col-md-6 col-lg-3 mb-3"
                  onClick={() => handleCardClick(hospital.id, hospital.name)}
                  style={{ cursor: "pointer", padding: '0 10px' }}
                >
               <div className="profile-widget patient-favour card p-3 shadow-sm h-100 d-flex flex-column">
               
  <div className="hospital-card d-flex flex-column h-100">
    <div className="hospital-header text-center">
      <img
        src={hospital.profile_image ? `${var_api}${hospital.profile_image}` : hospital_dummy}
        alt={hospital.name}
        className="img-fluid mb-3 rounded"
        style={{ height: "100px", width: "100px", objectFit: "cover" }}
      />
    </div>
    <div className="hospital-content flex-grow-1">
      <h5 className="text-primary">{hospital.name}</h5>
      <p className="hospital-location">
        <i className="fas fa-map-marker-alt"></i> {hospital.address || "Not Provided"},{" "}
        {hospital.state || "N/A"}, {hospital.country || "N/A"}
      </p>
      <p className="hospital-contact">
        <i className="fas fa-phone"></i> {hospital.mobile || "Not Available"}
      </p>
      <p className="hospital-contact">
        <i className="fas fa-envelope"></i> {hospital.email || "N/A"}
      </p>
    </div>
    <div className="mt-auto text-end">
      <button className="btn btn-primary">
        Select &rarr;
      </button>
    </div>
  </div>
</div>

                </div>
              ))
            ) : (
              <div className="col-12">
                <p>No hospitals found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default hospitallist;