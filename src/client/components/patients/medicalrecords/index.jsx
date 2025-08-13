/* eslint-disable no-unused-vars */
import DashboardSidebar from "../dashboard/sidebar/sidebar.jsx";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import Header from "../../header";
import Footer from "../../footer";
import Select from "react-select";
import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import { var_api, image_api } from "../../../../constant.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  doctor_thumb_01,
  doctor_thumb_03,
  doctor_thumb_05,
  doctor_thumb_08,
  doctorthumb02,
  logo,
} from "../../imagepath.jsx";
import {Form ,notification } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from "react-bootstrap";



const MedicalRecords = (props) => {
 
 
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);  
  const [selectedpatientdetails, setPatientdetails] = useState(null);  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust based on UI needs
  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);

  const prescription_prefix = localStorage.getItem("admin_prescription_prefix");
  const patient_mobile_no =  localStorage.getItem("patient_mobile_no");
  const patient_name = localStorage.getItem("patient_name");
  const patient_email = localStorage.getItem("patient_email");
  const printRef = useRef(null);
  //harini
  const [data, setData] = useState([]); 
    const [currentPageRecord, setCurrentPageRecord] = useState(1);
    const [selectedPatientsId, setSelectedPatientsId] = useState(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [searchTermrecord,setSearchTermrecord] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [editData, setEditData] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [specializationDetails, setSpecializationDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [seatImage, setseatImage] = useState('');
    const [form] = Form.useForm();
    const [file2, setFile2] = useState(null);
    const itemsPerPageRecord= 10; 
    const totalPagesRecord = Math.ceil(data.length / itemsPerPageRecord);

    // Extract records for the current page
    const indexOfLastRecord = currentPageRecord * itemsPerPageRecord;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPageRecord;
    const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
    const [showModal, setShowModal] = useState(false); 
    const [deleteId, setDeleteId] = useState(null); 
    const createmedirecord = localStorage.getItem("created_by_patient");
    const listmedirecord = localStorage.getItem("list_by_patient");
    const updatemedirecord = localStorage.getItem("updated_by_patient");
    const deletemedirecord = localStorage.getItem("delete_by_patient");
    // Pagination handler
    const paginateRecord = (pageNumber) => setCurrentPageRecord(pageNumber);

  const handleDownloadPDFrow = () => {
    if (!printRef.current) return;
  
    html2canvas(printRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale height
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Prescription_${selectedPrescription.prescription_token}.pdf`);
    });
  }

  const patients = [
    { value: "Select Patient", label: "Select Patient" },
    { value: "Rajesh", label: "Rajesh" },
    { value: "Kaviya", label: "Kaviya" },
    { value: "Janani Gracey", label: "Janani Gracey" },
  ];
  const [records, setRecords] = useState(["Fever", "Headache","Stomach Pain"]);

  const fetchDoctorDetails = async () => {
    const token = localStorage.getItem("patient_token");
    const patient_id = localStorage.getItem("patient_id");
    const hospital_id = localStorage.getItem("Patient_HospitalId");
    // if (!token || !patient_id || !hospital_id) {
    //   console.warn("Missing authentication details.");
    //   return;
    // }
  
    try {
      const response = await axios.get(
        `${var_api}prescription/patients-prescriptions/${patient_id}/${hospital_id}`,
       // `${var_api}prescription/patients-prescriptions/${patient_id}/${hospital_id}`,
        {
          headers: {
            Authorization: `${token}`, // Ensure proper format
          },
        }
      );
      setPrescriptions(response.data); // Store the fetched data
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching doctor details:", err);
      }
    }
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

  const handleDelete = async () => {
    if (!deleteId) {
      console.error("Error: No record ID provided for deletion.");
      return;
    }
  
    setLoading(true);
    const token = localStorage.getItem("patient_token");
  
    try {
      const response = await fetch(
        `${var_api}medicalrecords/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) throw new Error("Error deleting record");
  
      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });
  
      fetchDatamedi();// Refresh data
      handleCloseModal(); // Close modal
      setDeleteId(null); // Reset deleteId
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleViewPrescription = (pres) => {
    setSelectedPrescription(pres);
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleShowModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing Delete Modal...");
    setShowModal(false);
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPrescriptions = prescriptions.slice(startIndex, startIndex + itemsPerPage)  
    useEffect(() => {
      fetchDoctorDetails(setPrescriptions);
      fetchpatientdetails();
    }, []);
     const fetchDatamedi = async () => {
        console.log("🔄 Fetching updated data...");
        const token = localStorage.getItem('patient_token');
        const hospital_id = localStorage.getItem('Patient_HospitalId');
        const patient_id = localStorage.getItem("patient_id");
        
        setLoading(true);
        try {
            const response = await fetch(`${var_api}medicalrecords/get-latest-patient-hospital/${hospital_id}/${patient_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
    
            console.log("📡 Fetch Response Status:", response.status);
            if (response.status === 401) {
                history.push("/admin/login");
                notification.warning({
                    message: "Unauthorized",
                    description: "Your session has expired. Please log in again.",
                });
                return;
            }
    
            if (!response.ok) throw new Error("Failed to fetch data");
    
            const result = await response.json();
            console.log("📥 Fetched Data:", result); // Debugging log
    
            setData(result || []);
            setFilteredData(result || []);
            setSpecializationDetails([]);
        } catch (error) {
            console.error("❌ Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleFormSubmit = async (values) => {
      
      console.log("📝 Form Values Received:", values);
      if (!values) {
        console.error("❌ Error: Form values are undefined!");
        return;
      }
    
      setLoading(true);
      try {
        const hospital_id = localStorage.getItem("Patient_HospitalId");
        const user_id = localStorage.getItem("user_id");
        const patient_id = localStorage.getItem("patient_id");
        const token = localStorage.getItem("patient_token");
    
        if (!hospital_id || !user_id) {
          throw new Error("Required data missing in localStorage.");
        }
    
        const formData = new FormData();
        formData.append("description", description.trim() || "-");
        formData.append("hospital_id", Number(hospital_id));
        formData.append("patient_id", Number(patient_id) || "");
        formData.append("tech_id", Number(selectedDoctorId) || "");
    
        if (selectedDate instanceof Date && !isNaN(selectedDate)) {
          const formattedDate = selectedDate.toLocaleDateString("en-GB");
          formData.append("date", formattedDate);
        } else {
          console.warn("⚠️ Invalid date detected:", selectedDate);
        }
    
        formData.append("uploaded_by_nontech", Number(values?.uploaded_by_nontech) || 0);
        formData.append("uploaded_by_tech", Number(values?.uploaded_by_tech) || 0);
        formData.append("is_patient", values?.is_patient ? Number(values.is_patient) : 1);
        formData.append("is_active", values?.is_active !== undefined ? Number(values.is_active) : 1);
    
        if (seatImage) {
          formData.append("report_file", seatImage);
        } else if (editData?.report_file) {
          formData.append("report_file", editData.report_file);
        }
    
        console.log("🔄 FormData Entries:");
        for (let [key, value] of formData.entries()) {
          console.log(`➡️ ${key}: ${value}`);
        }
    
        const url = editData
          ? `${var_api}medicalrecords/update/${editData.id}`
          : `${var_api}medicalrecords/post`;
    
        console.log("📡 API URL:", url);
    
        const response = await fetch(url, {
          method: editData ? "PUT" : "POST",
          headers: { Authorization: token },
          body: formData,
        });
    
        const responseData = await response.json();
        console.log("📥 API Response:", responseData);
    
        if (!response.ok) {
          throw new Error(responseData.message || "Failed to save data");
        }
    
        notification.success({
          message: editData ? "Update Successful" : "Creation Successful",
          description: editData
            ? "The record has been successfully updated."
            : "A new record has been successfully created.",
        });
        setEditData(null);
    
        if (typeof fetchDatamedi === "function") {
          console.log("🚀 Calling fetchDatamedi...");
          await fetchDatamedi();
        } else {
          console.warn("⚠️ fetchDatamedi function is missing!");
        }
    
        if (typeof handleModalClose === "function") {
          console.log("🚀 Calling handleModalClose...");
          handleModalClose();
        } else {
          console.warn("⚠️ handleModalClose function is missing!");
        }
      } catch (error) {
        console.error("❌ Error submitting form:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      form.setFieldsValue({
        doctor: selectedDoctorId,
        patient: selectedPatientsId,
        description: description,
        date: selectedDate
      });
    }, [selectedDoctorId, selectedPatientsId, description, selectedDate]);
    
    
    
    
    
    const fetchSpecializationDetails = async () => {
      const hospital_id = localStorage.getItem("Patient_HospitalId");
      const token = localStorage.getItem("patient_token");
    
      const apiUrl = `${var_api}technicalstaff/getby-hospital/${hospital_id}`; // Fixed URL format
    
      console.log("Fetching from API:", apiUrl); // Debugging
    
      try {
        const response = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
    
        if (!response.ok) throw new Error("Failed to fetch doctor details");
    
        const result = await response.json();
        console.log("API Response (Raw):", result); // Debugging
    
        if (result.length === 0) {
          console.log("No doctors found.");
          setSpecializationDetails([]); // Clear the list
          return;
        }
    
        // Transform response if needed
        const formattedDoctors = result.map((doctor) => ({
          id: doctor.id,
          name: doctor.name,
        }));
        console.log("Formatted Doctors:", formattedDoctors); // Debugging
    
        setSpecializationDetails(formattedDoctors); // Update state
    
        // Optional: Set first doctor as default selection
        if (formattedDoctors.length > 0) {
          setSelectedDoctorId(formattedDoctors[0].id);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setSpecializationDetails([]); // Clear the list on error
      }
    };
              
    
      
       useEffect(() => {
        fetchDatamedi();
        handleFormSubmit();
        fetchSpecializationDetails();
       },
        []);
    
         const handleAddNew = () => {
            setEditData(null);  // ✅ Ensure `editData` is empty
            setIsEditMode(false);  // ✅ Set Add mode
          
            setTimeout(() => {  // ✅ Open modal AFTER state clears
              const modalElement = document.getElementById("add_medical_records");
              if (modalElement) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();
              }
            }, 0);
          };
    
          const handleFileChangeSeat = (e) => {
            setseatImage(e.target.files[0]);
            console.log("seat", seatImage);
          };
    
          const handleReset = () => {
            // Reset form fields to their initial values
            // form.resetFields();
            setseatImage("");
            setFile2("");
            // setFile1("");
            // setFile3("");
          };
    
          
    
             const handleSwitchChange = (e, record) => {
                const isChecked = e.target.checked;
                const newStatus = isChecked ? 1 : 0;
              
                // UI Update (React State)
                setRecords((prevRecords) =>
                  prevRecords.map((item) =>
                    item.id === record.id ? { ...item, is_active: newStatus } : item
                  )
                );
              
                // Backend Update
                updateSlotStatus(record, newStatus);
              };
              const updateSlotStatus = (record, newStatus) => {
                const token = localStorage.getItem("patient_token");
              
                fetch(`${var_api}medicalrecords/update/${record.id}`, {
                  method: "PUT",
                  body: JSON.stringify({ ...record, is_active: newStatus }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`, // Ensure token is prefixed properly
                  },
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log("Updated Successfully:", data);
                    fetchDatamedi(); // Call fetchDatamedi only after successful update
                  })
                  .catch((error) => console.error("Error:", error));
              };
    
              const handleEdit = (record) => { 
                console.log("📝 Editing Record Data:", record); 
              
                setEditData(record);
              
                setSelectedPatientsId(record.patient_id || ""); 
                setSelectedDoctorId(record.tech_id || ""); // FIXED: Using `tech_id`
                setDescription(record.description || ""); 
                setseatImage(record.image_url || ""); 
              
                // Convert date string "19/03/2025" to Date object
                let parsedDate = null;
                if (record.date) {
                  const [day, month, year] = record.date.split("/").map(Number);
                  parsedDate = new Date(year, month - 1, day); // JS months are 0-based
                }
                setSelectedDate(parsedDate);
              
                form.setFieldsValue({
                  doctor: record.tech_id || "", // FIXED: Using `tech_id`
                  patient: record.patient_id || "",
                  description: record.description || "",
                  date: parsedDate
                });
              
                console.log("🎯 Selected Doctor ID (Fixed):", record.tech_id);
                console.log("📅 Selected Date (Fixed):", parsedDate);
              };
              
              
    
              const handleModalClose = () => {
                form.resetFields();
                setSelectedDoctorId(null);
                setSelectedDate(null);
                setDescription("");
                setseatImage(null);
              
              
                const modalElement = document.getElementById("add_medical_records");
                if (modalElement) {
                  const modal = bootstrap.Modal.getInstance(modalElement);
                  if (modal) {
                    modal.hide();
                  }
                }
              };

              useEffect(() => {
                console.log("Component Mounted - Fetching Data...");
                fetchSpecializationDetails();
              }, []);
              
              useEffect(() => {
                console.log("Updated specializationDetails:", specializationDetails);
                if (specializationDetails.length > 0) {
                  setSelectedDoctorId(specializationDetails[0].id);
                  form.setFieldsValue({ doctor: specializationDetails[0].id });
                }
              }, [specializationDetails]);
    
  
  
  return (
    
    <>
    <div className="main-wrapper">
      <Header {...props} />
      <div className="breadcrumb-bar-two">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title"> Records</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                  Records
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
                <DashboardSidebar />{" "}
              </StickyBox>
            </div>
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Records</h3>
                <div className="appointment-tabs">
                  <ul className="nav">
                    {
                      listmedirecord == 1 && (
                        <li>
                      <Link
                        to="#"
                        className="nav-link active"
                        data-bs-toggle="tab"
                        data-bs-target="#medical"
                      >
                        Medical Records
                      </Link>
                    </li>
                      )
                    }
                    
                    <li>
                      <Link
                        to="#"
                        className="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#prescription"
                      >
                        Prescriptions
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="tab-content pt-0">
                {/* Prescription Tab */}
                <div className="tab-pane fade  show" id="prescription">
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
      <div className="custom-table">
        <div className="table-responsive">
          <table className="table table-center mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Created Date</th>
                <th>Prescribed By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {displayedPrescriptions.length > 0 ? (
    displayedPrescriptions.map((pres, index) => (
      <tr key={index}>
        <td>{index + 1}</td> {/* Serial Number */}
        {/* <td className="text-blue-600">#{prescription_prefix}-{pres.prescription_token}</td> */}
        <td>{pres.appointment_day}</td>
        <td>
          <h2 className="table-avatar">
          <Link to="/patient/doctor-profile" className="avatar avatar-sm me-2">
  <img
    className="avatar-img rounded-3"
    src={pres.tech_profile_image ? `${image_api}${pres.tech_profile_image}` : "default-doctor.jpg"}
    alt="Doctor"
    onError={(e) => { e.target.src = "default-doctor.jpg"; }} // Fallback image if not found
  />
</Link>
            <Link to="/patient/doctor-profile">
              {pres.tech_name}
            </Link>
          </h2>
        </td>
        <td>
          <div className="action-item">
            <Link to="#" data-bs-toggle="modal" onClick={() => handleViewPrescription(pres)} data-bs-target="#view_prescription">
              <i className="fa-solid fa-link" />
            </Link>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center">No prescriptions found</td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="pagination dashboard-pagination">
  <ul>
    <li>
      <Link to="#" className="page-link" onClick={goToPreviousPage} disabled={currentPage === 1}>
        <i className="fa-solid fa-chevron-left" />
      </Link>
    </li>

    {[...Array(totalPages)].map((_, index) => (
      <li key={index}>
        <Link
          to="#"
          className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
          onClick={() => goToPage(index + 1)}
        >
          {index + 1}
        </Link>
      </li>
    ))}

    <li>
      <Link to="#" className="page-link" onClick={goToNextPage} disabled={currentPage === totalPages}>
        <i className="fa-solid fa-chevron-right" />
      </Link>
    </li>
  </ul>
</div>

      {/* /Pagination */}
    </div>
                {/* /Prescription Tab */}
                {/* Medical Records Tab */}
                {/* Medical Records Tab */}
                <div className="tab-pane fade show active" id="medical">
                <div className="search-header">
                                  <div className="search-field">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Search"
                                      value={searchTermrecord}
                                      onChange={(e) => setSearchTermrecord(e.target.value)}
                                    />
                                    <span className="search-icon">
                                      <i className="fa-solid fa-magnifying-glass" />
                                    </span>
                                
                                  </div>
                                  {
                                    createmedirecord == 1 && (
                                      <div>
                                  <Link
            to="#"
            className="btn btn-primary prime-btn"
            onClick={handleAddNew} // Reset form when opening modal
            data-bs-toggle="modal"
            data-bs-target="#add_medical_records"
          >
            Add New
          </Link>
          
                                  </div>
                                    )
                                  }
                                  
                                </div>
                  <div className="custom-table">
                    <div className="table-responsive">
                      <table className="table table-center mb-0">
                      <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Date</th>
      <th>Image</th>
      <th>Description</th>
      {/* <th>Active</th> */}
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
  {currentRecords
    .filter((record) =>
      record.tech_name?.toLowerCase().includes(searchTermrecord.toLowerCase()) ||
      record.date?.toLowerCase().includes(searchTermrecord.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTermrecord.toLowerCase())
    )
    .length > 0 ? (
    currentRecords
      .filter((record) =>
        record.tech_name?.toLowerCase().includes(searchTermrecord.toLowerCase()) ||
        record.date?.toLowerCase().includes(searchTermrecord.toLowerCase()) ||
        record.description?.toLowerCase().includes(searchTermrecord.toLowerCase())
      )
      .map((record, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{record.tech_name ?? "N/A"}</td>
          <td>{record.date ?? "N/A"}</td>
          <td>
            {record.report_file ? (
              <a
                href={`${image_api}${record.report_file}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                View Report
              </a>
            ) : (
              "No Image"
            )}
          </td>
          <td>{record.description ?? "N/A"}</td>
          {/* <td>
            {record.is_active ? (
              <span className="badge badge-green status-badge">Active</span>
            ) : (
              <span className="badge badge-danger status-badge">Inactive</span>
            )}
            <div className="status-toggle" style={{ marginTop: "0px", paddingLeft: "10px" }}>
              <input
                id={`switch-${record.id}`}
                className="check"
                type="checkbox"
                checked={record.is_active === 1}
                onChange={(e) => handleSwitchChange(e, record)}
                style={{
                  width: "20px",
                  height: "10px",
                  display: "inline-block",
                  margin: "0px",
                }}
              />
              <label htmlFor={`switch-${record.id}`} className="checktoggle checkbox-bg"></label>
            </div>
          </td> */}
          <td>
            {
              updatemedirecord == 1 || deletemedirecord == 1 ? (
<div className="action-item">
  {
    updatemedirecord == 1 && (
      <Link to="#" data-bs-toggle="modal" data-bs-target="#add_medical_records">
      <i className="fa-solid fa-pen-to-square" onClick={() => handleEdit(record)} />
    </Link>
    )
  }
   {
    deletemedirecord == 1 && (
      <a href="#" onClick={(e) => { e.preventDefault(); handleShowModal(record.id); }}>
      <i className="fa-solid fa-trash-can" />
    </a>
    
    )}
             
             
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this medical record?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
            </div>
              ) : "No Access"
            }
            
          </td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center">No records found</td>
    </tr>
  )}
</tbody>

                      </table>
                    </div>
                  </div>
                  {/* Pagination */}
                            <div className="pagination dashboard-pagination">
                <ul>
                  <li>
                    <Link
                      to="#"
                      className="page-link"
                      onClick={() => paginateRecord(currentPageRecord > 1 ? currentPageRecord - 1 : 1)}
                    >
                      <i className="fa-solid fa-chevron-left" />
                    </Link>
                  </li>
                  {Array.from({ length: totalPagesRecord }, (_, index) => (
                    <li key={index + 1}>
                      <Link
                        to="#"
                        className={`page-link ${currentPageRecord === index + 1 ? "active" : ""}`}
                        onClick={() => paginateRecord(index + 1)}
                      >
                        {index + 1}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="#"
                      className="page-link"
                      onClick={() =>
                        paginateRecord(currentPageRecord < totalPagesRecord ? currentPageRecord + 1 : totalPagesRecord)
                      }
                    >
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </li>
                </ul>
              </div>
                  {/* /Pagination */}
                </div>
                {/* /Medical Records Tab */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer {...props} />
      
  </div>
  <>
{/* Add Medical Records Modal */}
<div className="modal fade custom-modals" id="add_medical_records">
<div
  className="modal-dialog modal-dialog-centered modal-lg"
  role="document"
>
  <div className="modal-content">
    <div className="modal-header">
      <h3 className="modal-title">Add Medical Record</h3>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
    <Form form={form} onFinish={handleFormSubmit} layout="vertical">
      <div className="modal-body">
        <div className="row">
          {/* <div className="col-md-6">
            <div className="form-wrap">
              <label className="col-form-label">Title</label>
              <input
                type="text"
                className="form-control"
                defaultValue="Echocardiogram"
              />
            </div>
          </div> */}
          <div className="col-md-6">
            <div className="form-wrap">
            <label className="col-form-label">Select Doctor</label>
            <select
  className="form-control"
  value={selectedDoctorId || ""}
  onChange={(e) => {
    setSelectedDoctorId(e.target.value);
    form.setFieldsValue({ doctor: e.target.value });
  }}
>
  <option value="">Select Doctor</option>
  {specializationDetails.length > 0 ? (
    specializationDetails.map((doctor) => (
      <option key={doctor.id} value={doctor.id}>
        {doctor.name}
      </option>
    ))
  ) : (
    <option disabled>No doctors available</option>
  )}
</select>


            </div>
          </div>
          <div className="col-md-6">
          <div className="form-wrap">
      <label className="col-form-label">
        Start Date <span className="text-danger">*</span>
      </label>
      <DatePicker
  className="form-control datetimepicker w-100"
  selected={selectedDate instanceof Date && !isNaN(selectedDate) ? selectedDate : null}
  onChange={(date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedDate(date);
      form.setFieldsValue({ date });
    }
  }}
  dateFormat="dd/MM/yyyy"
  isClearable
  placeholderText="Select a date"
/>




      {!selectedDate && <p className="text-danger">Please select a date</p>}
    </div>
          </div>
          <div className="col-md-6">
            {/* <div className="form-wrap">
              <label className="col-form-label">Doctor</label>
              <select
  className="form-control"
  value={selectedDoctorId || ""}
  onChange={(e) => setSelectedDoctorId(e.target.value)}
>
  <option value="">Select Doctor</option>
  {(specializationDetails || []).map((doctor) => (
    <option key={doctor.id} value={doctor.id}>
      {doctor.name}
    </option>
  ))}
</select>
            </div> */}
          </div>
          <div className="col-md-12">
          <div className="form-wrap">
          <label className="col-form-label">Description</label>
  <div className="input-block input-block-new mb-0">
  <input
  className="input-tags form-control"
  type="text"
  placeholder="Type New"
  name="description"
  value={description || ""}
  onChange={(e) => setDescription(e.target.value)}
/>
    <a href="#" className="input-text save-btn" onClick={(e) => e.preventDefault()}>
      Save
    </a>
  </div>
</div>

            <div className="form-wrap mb-0">
            <div className="form-wrap">
  <label className="col-form-label">Report</label>
  <div>
  <input
  type="file"
  className="form-control"
  accept="image/*"
  onChange={handleFileChangeSeat}
/>

{/* Show existing image if editing */}
{editData?.report_file && !seatImage && (
  <div style={{ marginTop: "10px" }}>
    <p>Current Image:</p>
    <img
      src={`${image_api}medical_records/${editData.report_file}`}
      alt="Existing Report"
      style={{ width: "150px", height: "150px", borderRadius: "8px", border: "1px solid #ddd" }}
    />
  </div>
)}

/* Show new image preview if uploaded */
{seatImage && (
  <div style={{ marginTop: "10px" }}>
    <p>New Selected Image:</p>
    <img
      src={URL.createObjectURL(seatImage)}
      alt="New Upload"
      style={{ width: "150px", height: "150px", borderRadius: "8px", border: "1px solid #ddd" }}
    />
  </div>
    )}
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
            onClick={editData ? handleModalClose : handleReset}
          >
            Cancel
          </a>
          <button type="submit" className="btn btn-primary prime-btn">
  {editData ? "Update" : "Save Changes"}
</button>


        </div>
      </div>
    </Form>
  </div>
</div>
</div>
{/* /Add Medical Records Modal */}

{/*View Prescription */}
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
          <button className="btn btn-primary prime-btn" onClick={handleDownloadPDF}>
  Download
</button>
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
                          {selectedPrescription.tech_name} <br />
                          {selectedPrescription.hospital_name}<br />
                          {selectedPrescription.hospital_address}<br />
                          {selectedPrescription.hospital_state}<br />
                          {selectedPrescription.hospital_country}

                        </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                      <div className="invoice-info invoice-info2">
                        <h6 className="customer-text">Patient Details</h6>
                        <p className="invoice-details">
                          {patient_name} <br />
                          {selectedpatientdetails.full_address},
                          {selectedpatientdetails.city}<br/>
                          {selectedpatientdetails.state},
                          {selectedpatientdetails.country}<br/>
                          {selectedpatientdetails.pincode}
                         
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
           {selectedPrescription.advice}
          </p>
        </div>
        <div className="other-info">
          <h4>Follow Up</h4>
          <p className="text-muted mb-0">
          {selectedPrescription.follow_up}
          </p>
          </div>

                  <div className="prescriber-info">
                    <h6>Dr. {selectedPrescription.tech_name}</h6>
                    <p>{selectedPrescription.tech_specialization}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
{/* /View Prescription */}
</>
</>


  );
  
};



export default MedicalRecords;
