/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import DashboardSidebar from "../dashboard/sidebar/sidebar.jsx";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import StickyBox from "react-sticky-box";
import Footer from "../../footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../header.jsx";
import { var_api, image_api } from "../../../../constant.js";
import { pat_dummy } from "../../imagepath.jsx";

import {
  dependent1,
  dependent2,
  dependent3,
  dependent4,
} from "../../imagepath.jsx";
import Select from "react-select";
import { notification } from "antd";

const Dependent = (props) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dependantData, setDependantData] = useState(null);
  const [dependantList, setDependantList] = useState(null);
  const dependantId = localStorage.getItem('dependant_id');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");



  // const handleChange = (date) => {
  //   setDate(date);
  // };
  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  const [formData, setFormData] = useState({
    name: "",
    dependant_relationship: "",
    dob: "",
    gender: "",
    profile_image: null,
    is_dependant: dependantId,
    mobile_no:"",
    full_address:"",
    blood_group:"",
    email_id:"",
    old_running_no:"",
    asthma:"",
    diabetes:"",
    drug_allergy:"",
    pregnancy:"",
    bp:"",
    cardiac:"",
    others:"",
    cheif_complaints:"",
    city:"",
    secondary_mobile:"",
    age:"",
    referal_Person:0,
    is_other_referal:0,
    other_referal_name:"",
    other_referal_mobile:"",
    is_private:0, // Determines if the patient is private or public
    password:"",
    state:"",
    country:"",
    pincode:"",
    is_active:1
  });
  
  const [selectedDate, setSelectedDate] = useState("");
  const gender = [
    { value: "Select", label: "Select" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const gender1 = [
    { value: "Select", label: "Select" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const relationship = [
    { value: "Select", label: "Select" },
    { value: "Spouse", label: "Spouse" },
    { value: "Parent", label: "Parent" },
    { value: "Child", label: "Child" },
    { value: "Sibling", label: "Sibling" },
    { value: "Friend", label: "Friend" },
    { value: "Grandparent", label: "Grandparent" },
    { value: "Other", label: "Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prevData) => ({ ...prevData, [field]: selectedOption.value }));
  };


  const calculateAge = (dob) => {
    if (!dob) return 0; // Return 0 if no DOB is provided
  
    // dob is in "dd-mm-yyyy" format, split it
    const [day, month, year] = dob.split("-").map(Number);
  
    const birthDate = new Date(year, month - 1, day); // Month is zero-based
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    return age;
  };
  

  const handleDateChange = (date) => {
    console.log("date", date);
    setSelectedDate(date);
    if (date) {
      // Format date as "dd-mm-yyyy"
      const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  
      setFormData((prevData) => ({
        ...prevData,
        dob: formattedDate,
        age: calculateAge(formattedDate) // Update age dynamically
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, dob: "" }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profile_image: e.target.files[0],
    }));
  };


  //post method
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const hospital_id = localStorage.getItem("Patient_HospitalId");
      const token = localStorage.getItem("patient_token");
      const parentMobileNo = dependantData?.mobile_no;
  
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }

      // VALIDATION: Check required fields
      const requiredFields = {
        name: formData.name,
        gender: formData.gender
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        throw new Error(`Please provide: ${missingFields.join(", ")}`);
      }

      const submissionData = new FormData();
      
      // Prepare data with defaults for optional fields
      const dataToSubmit = {
        ...formData,
        hospital_id, // Include the hospital_id
        mobile_no: parentMobileNo, // ✅ Auto-fill parent's mobile number
        is_other_referal: formData.is_other_referal || 0,
        referal_Person: formData.referal_Person || 0,
        is_private: formData.is_private || 0,
        is_active: formData.is_active ?? 1 // Default to 1 if not set
      };

      // Append all data to FormData
      Object.entries(dataToSubmit).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'profile_image' && value instanceof File) {
            submissionData.append(key, value);
          } else {
            submissionData.append(key, value.toString());
          }
        }
      });

      // Debug: Log what's being sent
      console.log("Submitting data:", Object.fromEntries(submissionData));

      const response = await fetch(`${var_api}patientdetails/post-dependent`, {
        method: "POST",
        headers: { 
          Authorization: token 
        },
        body: submissionData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      // Success handling
      notification.success({
        message: "Success",
        description: "Dependent added successfully!",
      });

      fetchDependantListData();
      resetForm();
      
      // Close modal
      document.querySelector('#add_dependent .btn-close')?.click();
      
    } catch (error) {
      console.error("Submission error:", error);
      notification.error({
        message: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
};
// Helper function to reset form
const resetForm = () => {
    setFormData({
        name: "",
        dependant_relationship: "",
        dob: "",
        gender: "",  
    });
};


  //dependant details
  const fetchDependantData = async () => {
      setLoading(true);
      const token = localStorage.getItem('patient_token');
      try {
        const response = await fetch(`${var_api}patientdetails/get/${dependantId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if (response.status === 401) {
          history.push("/patient/patientlogin"); // Redirect to login page
          notification.warning({
            message: "Unauthorized",
            description: "Your session has expired. Please log in again.",
          });
        return
        }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setDependantData(result || {});
       
        console.log("oa",  result )
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
        notification.error({
          message: "Fetch Failed",
          description: "Unable to retrieve data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };


    //dependant list
  const fetchDependantListData = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem("Patient_HospitalId");
    try {
      const response = await fetch(`${var_api}patientdetails/get-dependants/${hospital_id}/${dependantId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/patient/patientlogin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setDependantList(result || []);
     
      console.log("oa",  result )
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    let formattedDob = null;
    if (patient.dob) {
        // Convert 'dd-mm-yyyy' to 'yyyy-mm-dd' for Date object
        const [day, month, year] = patient.dob.split("-");
        formattedDob = new Date(`${year}-${month}-${day}`);
        setSelectedDate(formattedDob);
    }
    setFormData({
      name: patient.name || "",
      dependant_relationship: patient.dependant_relationship || "",
      gender: patient.gender || "",
      dob: patient.dob, 
      profile_image: patient.profile_image,
      age: patient.age
    });
  };
  


     useEffect(() => {
          fetchDependantData();
          fetchDependantListData();
        }, [])

        useEffect(() => {
          if (dependantData && Object.keys(dependantData).length > 0) {
            setFormData((prevData) => {
              const updatedData = { ...prevData };
        
              // Exclude specific fields
              const excludedFields = ["is_private", "name", "dependant_relationship", "gender", "dob", "profile_image", "is_dependant", "asthma", "diabetes", "drug_allergy", "pregnancy", "bp", "cardiac", "others", "cheif_complaints", "id"];
              
              Object.keys(dependantData).forEach((key) => {
                if (!excludedFields.includes(key)) {
                  updatedData[key] = dependantData[key] || ""; // Keep empty if null/undefined
                }
              });
        console.log("MOBILE",formData);
              return updatedData;
            });
          }
        }, [dependantData]);


        const handleUpdateSubmit = async (e) => {
          e.preventDefault();
          const token = localStorage.getItem('patient_token');
          setLoading(true);
      
          // Create FormData object
          const formDataToSend = new FormData();
          formDataToSend.append("hospital_id", selectedPatient?.hospital_id || "");
          formDataToSend.append("running_no", selectedPatient?.running_no || "");
          formDataToSend.append("is_active", selectedPatient?.is_active ?? 1);
          formDataToSend.append("name", formData.name || "");
          
          if (formData.profile_image) {
              formDataToSend.append("profile_image", formData.profile_image);
          }
      
          formDataToSend.append("mobile_no", selectedPatient?.mobile_no || "");
          formDataToSend.append("full_address", selectedPatient?.full_address || "");
          formDataToSend.append("dob", formData.dob || "");
          formDataToSend.append("gender", formData.gender || "");
          formDataToSend.append("email_id", selectedPatient?.email_id || "");
          formDataToSend.append("blood_group", selectedPatient?.blood_group || "");
          formDataToSend.append("old_running_no", selectedPatient?.old_running_no || "");
          formDataToSend.append("city", selectedPatient?.city || "");
          formDataToSend.append("secondary_mobile", selectedPatient?.secondary_mobile || "");
          formDataToSend.append("age", formData.age || selectedPatient?.age); // Default age to 0 if undefined
          formDataToSend.append("referal_Person", selectedPatient?.referal_Person ?? 0); // Fix issue
          formDataToSend.append("is_other_referal", selectedPatient?.is_other_referal ?? 0);
          formDataToSend.append("other_referal_name", selectedPatient?.other_referal_name || "");
          formDataToSend.append("other_referal_mobile", selectedPatient?.other_referal_mobile || "");
          formDataToSend.append("state", selectedPatient?.state || "");
          formDataToSend.append("country", selectedPatient?.country || "");
          formDataToSend.append("pincode", selectedPatient?.pincode || "");
          formDataToSend.append("is_dependant", selectedPatient?.is_dependant ?? 0);
          formDataToSend.append("dependant_relationship", formData.dependant_relationship || "");
      
          try {
              const response = await fetch(`${var_api}patientdetails/update-dependent/${selectedPatient.id}`, {
                  method: "PUT",
                  body: formDataToSend, // Corrected
                  headers: {
                      Authorization: `${token}`, // Corrected
                  },
              });
      
              if (response.ok) {
                  fetchDependantListData();
                  // alert("Dependant updated successfully!");
                  notification.success({
                    message: "success",
                    description: "Dependant updated successfully!",
                  });
                  setFormData({
                    name: "",
    dependant_relationship: "",
    dob: "",
    gender: "",
    profile_image: null,
    is_dependant: dependantId,
    mobile_no:"",
    full_address:"",
    blood_group:"",
    email_id:"",
    old_running_no:"",
    asthma:"",
    diabetes:"",
    drug_allergy:"",
    pregnancy:"",
    bp:"",
    cardiac:"",
    others:"",
    cheif_complaints:"",
    city:"",
    secondary_mobile:"",
    age:"",
    referal_Person:"",
    is_other_referal:0,
    other_referal_name:"",
    other_referal_mobile:"",
    is_private:"", // Determines if the patient is private or public
    password:"",
    state:"",
    country:"",
    pincode:""
                  })
                  const closeButton = document.querySelector('#edit_dependent .btn-close');
                  closeButton.click();
                  // Refresh list or close modal
              } else {
                  const errorData = await response.json();
                  console.error("Failed to update dependant:", errorData);
              }
          } catch (error) {
              console.error("Error updating dependant:", error);
          } finally {
            setLoading(false);
          }
      };



      const filteredDependants = dependantList?.filter((patient) =>
        patient.name?.toLowerCase().includes(searchTerm) ||
        patient.dependant_relationship?.toLowerCase().includes(searchTerm) ||
        patient.gender?.toLowerCase().includes(searchTerm) ||
        String(patient.age).includes(searchTerm) ||
        patient.blood_group?.toLowerCase().includes(searchTerm)
      );
      
      
  return (
    <>
    <div className="main-wrapper">
      <Header {...props} />
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <div className="breadcrumb-bar-two">
     
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <h2 className="breadcrumb-title">Dependent</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-2">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dependent
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <DashboardSidebar />
              </StickyBox>
            </div>
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Dependants</h3>
                {/* <ul className="header-list-btns">
                  <li>
                    <div className="input-block dash-search-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </li>
                </ul> */}
              </div>
              <div className="dashboard-header border-0 m-0">
                <ul className="header-list-btns">
                  <li>
                    <div className="input-block dash-search-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </li>
                </ul>
                <Link
                  to="#"
                  className="btn btn-primary prime-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#add_dependent"
                >
                  Add Dependants
                </Link>
              </div>
              {/* Depeendent Item */}
              {
                filteredDependants?.map((patient, index)=>(
                  <div className="dependent-wrap" key={index}>
                  <div className="dependent-info">
                    <div className="patinet-information">
                      <Link to="/doctor/patient-profile">
                        <img src={patient.profile_image ? `${image_api}${patient.profile_image}` : pat_dummy} alt="User Image"   onError={(e) => e.target.src = pat_dummy}/>
                      </Link>
                      <div className="patient-info">
                        <h5>{patient.name}</h5>
                        <ul>
                          <li>{patient.dependant_relationship}</li>
                          <li>{patient.gender}</li>
                          <li>{patient.age}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="blood-info">
                      <p>Blood Group</p>
                      <h6>{patient.blood_group}</h6>
                    </div>
                  </div>
                  <div className="dependent-status">
                    {/* <div className="status-toggle">
                      <span className="deactive">Deactivate</span>
                      <input
                        type="checkbox"
                        id="status_1"
                        className="check"
                        defaultChecked=""
                      />
                      <label htmlFor="status_1" className="checktoggle">
                        checkbox
                      </label>
                      <span className="active">Activate</span>
                    </div> */}
                    <Link
                      to="#"
                      className="edit-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_dependent"
                      onClick={() => handleEditClick(patient)}
                    >
                      <i className="fa-solid fa-pen-to-square" />
                    </Link>
                  </div>
                </div>
                ))
              }
             
              {/* /Depeendent Item */}
              {/* Depeendent Item */}
              {/* <div className="dependent-wrap">
                <div className="dependent-info">
                  <div className="patinet-information">
                    <Link to="/doctor/patient-profile">
                      <img src={dependent2} alt="User Image" />
                    </Link>
                    <div className="patient-info">
                      <h5>Mathew</h5>
                      <ul>
                        <li>Father</li>
                        <li>Male</li>
                        <li>59 years 15 days</li>
                      </ul>
                    </div>
                  </div>
                  <div className="blood-info">
                    <p>Blood Group</p>
                    <h6>AB+ve</h6>
                  </div>
                </div>
                <div className="dependent-status">
                  <div className="status-toggle">
                    <span className="deactive">Deactivate</span>
                    <input
                      type="checkbox"
                      id="status_2"
                      className="check"
                      defaultChecked=""
                    />
                    <label htmlFor="status_2" className="checktoggle">
                      checkbox
                    </label>
                    <span className="active">Activate</span>
                  </div>
                  <Link
                    to="#"
                    className="edit-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_dependent"
                  >
                    <i className="fa-solid fa-pen-to-square" />
                  </Link>
                </div>
              </div> */}
              {/* /Depeendent Item */}
              {/* Depeendent Item */}
              {/* <div className="dependent-wrap">
                <div className="dependent-info">
                  <div className="patinet-information">
                    <Link to="/doctor/patient-profile">
                      <img src={dependent3} alt="User Image" />
                    </Link>
                    <div className="patient-info">
                      <h5>Christopher</h5>
                      <ul>
                        <li>Brother</li>
                        <li>Male</li>
                        <li>32 years 6 Months</li>
                      </ul>
                    </div>
                  </div>
                  <div className="blood-info">
                    <p>Blood Group</p>
                    <h6>A+ve</h6>
                  </div>
                </div>
                <div className="dependent-status">
                  <div className="status-toggle">
                    <span className="deactive">Deactivate</span>
                    <input
                      type="checkbox"
                      id="status_3"
                      className="check"
                      defaultChecked=""
                    />
                    <label htmlFor="status_3" className="checktoggle">
                      checkbox
                    </label>
                    <span className="active">Activate</span>
                  </div>
                  <Link
                    to="#"
                    className="edit-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_dependent"
                  >
                    <i className="fa-solid fa-pen-to-square" />
                  </Link>
                </div>
              </div> */}
              {/* /Depeendent Item */}
              {/* Depeendent Item */}
              {/* <div className="dependent-wrap">
                <div className="dependent-info">
                  <div className="patinet-information">
                    <Link to="/doctor/patient-profile">
                      <img src={dependent4} alt="User Image" />
                    </Link>
                    <div className="patient-info">
                      <h5>Elisa</h5>
                      <ul>
                        <li>Sister</li>
                        <li>Female</li>
                        <li>28 years 4 Months</li>
                      </ul>
                    </div>
                  </div>
                  <div className="blood-info">
                    <p>Blood Group</p>
                    <h6>B+ve</h6>
                  </div>
                </div>
                <div className="dependent-status">
                  <div className="status-toggle">
                    <span className="deactive">Deactivate</span>
                    <input type="checkbox" id="status_4" className="check" />
                    <label htmlFor="status_4" className="checktoggle">
                      checkbox
                    </label>
                    <span className="active">Activate</span>
                  </div>
                  <Link
                    to="#"
                    className="edit-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_dependent"
                  >
                    <i className="fa-solid fa-pen-to-square" />
                  </Link>
                </div>
              </div> */}
              {/* /Depeendent Item */}
            </div>
          </div>
        </div>
      </div>
     

      <Footer {...props} />
    </div>
     <>
     {/* Add Dependent Modal*/}
     <div className="modal fade custom-modals" id="add_dependent">
       <div
         className="modal-dialog modal-dialog-centered modal-lg"
         role="document"
       >
         <div className="modal-content">
           <div className="modal-header">
             <h3 className="modal-title">Add Dependant</h3>
             <button
               type="button"
               className="btn-close"
               data-bs-dismiss="modal"
               aria-label="Close"
             >
               <i className="fa-solid fa-xmark" />
             </button>
           </div>
           {loading ? (
  <div className="modal-body d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
    <div className="loader"></div>
  </div>
) : (
  <form onSubmit={handleFormSubmit}>
  <div className="add-dependent">
    <div className="modal-body">
      <div className="row">
        <div className="col-md-12">
          <div className="form-wrap pb-0">
            <div className="change-avatar img-upload">
              <div className="profile-img">
                <i className="fa-solid fa-file-image" />
              </div>
              <div className="upload-img">
                <h5>Profile Image</h5>
                <div className="imgs-load d-flex align-items-center">
                  <div className="change-photo">
                    Upload New
                    <input type="file" className="upload" onChange={handleFileChange} />
                  </div>
                  <Link to="#" className="upload-remove">
                    Remove
                  </Link>
                </div>
                <p>
                  Your Image should Below 1 MB, Accepted format
                  Jpg, Png, Jpeg
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-wrap">
            <label className="col-form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-wrap">
            <label className="col-form-label">Relationship</label>
            <Select
              placeholder="Select"
              options={relationship}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "dependant_relationship")}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-wrap">
            <label className="col-form-label">
              DOB <span className="text-danger">*</span>
            </label>
            <div className="form-icon">
              <DatePicker
                className="form-control datetimepicker"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                showDayMonthYearPicker
              />
              <span className="icon">
                <i className="fa-regular fa-calendar-days" />
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-wrap">
            <label className="col-form-label">Select Gender</label>
            <Select
              placeholder="Select"
              options={gender}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "gender")}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="modal-footer">
    <div className="modal-btn text-end">
      <Link to="#" className="btn btn-gray" data-bs-dismiss="modal">
        Cancel
      </Link>
      <button type="submit" className="btn btn-primary prime-btn">
        Save Changes
      </button>
    </div>
  </div>
</form>
)}
         </div>
       </div>
     </div>
     {/* /Add Dependent Modal*/}
     {/* Edit Dependent Modal*/}
     <div className="modal fade custom-modals" id="edit_dependent">
       <div
         className="modal-dialog modal-dialog-centered modal-lg"
         role="document"
       >
         <div className="modal-content">
           <div className="modal-header">
             <h3 className="modal-title">Edit Dependant</h3>
             <button
               type="button"
               className="btn-close"
               data-bs-dismiss="modal"
               aria-label="Close"
             >
               <i className="fa-solid fa-xmark" />
             </button>
           </div>
           {loading ? (
  <div className="modal-body d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
    <div className="loader"></div>
  </div>
) : (
           <form onSubmit={handleUpdateSubmit}>
             <div className="add-dependent">
               <div className="modal-body">
                 <div className="row">
                   <div className="col-md-12">
                     <div className="form-wrap pb-0">
                       <div className="change-avatar img-upload">
                         <div className="profile-img">
                         {formData.profile_image ? (
    <img src={`${image_api}${formData.profile_image}`} alt="Profile" className="img-fluid" />
  ) : (
    <i className="fa-solid fa-file-image" />
  )}
                           {/* <i className="fa-solid fa-file-image" /> */}
                         </div>
                         <div className="upload-img">
                           <h5>Profile Image</h5>
                           <div className="imgs-load d-flex align-items-center">
                             <div className="change-photo">
                               Upload New
                               <input type="file" className="upload" onChange={handleFileChange} />
                             </div>
                             <Link to="#" className="upload-remove">
                               Remove
                             </Link>
                           </div>
                           <p>
                             Your Image should Below 4 MB, Accepted format
                             jpg,png,svg
                           </p>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div className="col-md-6">
                     <div className="form-wrap">
                       <label className="col-form-label">Name</label>
                       <input
                         type="text"
                         className="form-control"
                         name="name"
                         value={formData.name}
                         onChange={handleInputChange}
                       />
                     </div>
                   </div>
                   <div className="col-md-6">
                     <div className="form-wrap">
                       <label className="col-form-label">Relationship</label>
                       <Select
  placeholder="Select"
  options={relationship}
  value={relationship.find((opt) => opt.value === formData.dependant_relationship)}
  onChange={(selectedOption) => handleSelectChange(selectedOption, "dependant_relationship")}
/>
                     </div>
                   </div>
                   <div className="col-md-6">
                     <div className="form-wrap">
                       <label className="col-form-label">
                         DOB <span className="text-danger">*</span>
                       </label>
                       <div className="form-icon">
                       <DatePicker
  className="form-control datetimepicker"
  selected={selectedDate}
  onChange={handleDateChange}
  dateFormat="dd/MM/yyyy"
/>
                         <span className="icon">
                           <i className="fa-regular fa-calendar-days" />
                         </span>
                       </div>
                     </div>
                   </div>
                   <div className="col-md-6">
                     <div className="form-wrap">
                       <label className="col-form-label">
                         Select Gender
                       </label>
                       <Select
  placeholder="Select"
  options={gender}
  value={gender.find((opt) => opt.value === formData.gender)}
  onChange={(selectedOption) => handleSelectChange(selectedOption, "gender")}
/>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             <div className="modal-footer">
               <div className="modal-btn text-end">
                 <Link
                   to="#"
                   className="btn btn-gray"
                  //  data-bs-toggle="modal"
                   data-bs-dismiss="modal"
                 >
                   Cancel
                 </Link>
                 <button type="submit" className="btn btn-primary prime-btn">
                   Save Changes
                 </button>
               </div>
             </div>
           </form>
)}
         </div>
       </div>
     </div>
     {/* /Edit Dependent Modal*/}
   </>
   </>
  );
};

export default Dependent;
