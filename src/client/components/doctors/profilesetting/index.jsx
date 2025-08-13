/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import DoctorSidebar from "../sidebar/index";
import Header from "../../header";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import { TagsInput } from "react-tag-input-component";
import { Link } from "react-router-dom";
import SettingsHeader from "./settingsHeader.jsx";
import axios from "axios";
import { var_api, image_api } from "../../../../constant.js";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "../../style/Loader.css";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctordashboardprofile3 } from "../../imagepath";

const ProfileSetting = (props) => {
  const [language, setLanguage] = useState(["English", "German"]);
  const [membershipInfos, setMembershipInfos] = useState([{ title: '', about: '' }]);

  const addMembershipInfo = () => {
    setMembershipInfos([...membershipInfos, { title: '', about: '' }]);
  };

  const deleteMembershipInfo = (index) => {
    const updatedMembershipInfos = membershipInfos.filter((_, i) => i !== index);
    setMembershipInfos(updatedMembershipInfos);
  };

  const [profileDetails, setProfileDetails] = useState(null);
  const doc_id = localStorage.getItem("doctor_id");
  const [errorState, setErrorState] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    primary_mobile: "",
    secondary_mobile: "",
    gender: "",
    dob: null,
    blood_group: "",
    qualification: "",
    profile_image: "",
  });


   //fetch medicines list
   const fetchProfileSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const doctor_id = doc_id || profileDetails.id;
       
      const response = await axios.get(
        `${var_api}technicalstaff/get/${doctor_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );
  const option = response.data;
  console.log("data", option);
      setProfileDetails(option);
      localStorage.setItem("doctor_name", option?.name);
      localStorage.setItem("doctor_profile", option?.profile_image);
      localStorage.setItem("doctor_available", option?.is_available);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching medicine subcategories:", err);
    //   setError(err.message || "An error occurred.");
    }
    finally {
      setLoading(false);
    }
  };


   useEffect(() => {
  
     // Populate the form with user data on mount
     if (profileDetails) {
      setFormData({
        name: profileDetails.name || "",
        email_id: profileDetails.email_id || "",
        primary_mobile: profileDetails.primary_mobile || "",
        secondary_mobile: profileDetails.secondary_mobile || "",
        gender: profileDetails.gender || "",
        dob: profileDetails.dob || "",
        blood_group: profileDetails.blood_group || "",
        qualification: profileDetails.qualification || "",
        profile_image: profileDetails.profile_image || "",
        is_verify_email: profileDetails.is_verify_email || "",
        password: profileDetails.password || "",
        joining_date: profileDetails.joining_date || "",
        leaving_date: profileDetails.leaving_date || "",
        roll: profileDetails.roll || "",
        specialization: profileDetails.specialization || "",
        specialization_id: profileDetails.specialization_id || "",
        qualification: profileDetails.qualification || "",
        id_proof: profileDetails.id_proof || "",
        is_available: profileDetails.is_available || "",
        created_at: profileDetails.created_at || "",
        updated_at: profileDetails.updated_at || "",
      });
    }
    }, [profileDetails]);



    useEffect(() => {
      fetchProfileSettings();
     
      }, []);



    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };



    const handleFormSubmit = (e) => {
      setLoading(true);
      const token = localStorage.getItem("doc_token");
      e.preventDefault();
    
      const requiredFields = [
        'name',
        'email_id',
        'primary_mobile',
        'gender',
        'dob',
        'blood_group',
        'qualification',
      ];
    
      let errors = {};
      requiredFields.forEach((field) => {
        if (!formData[field]) {
          errors[field] = `${field} is required`;
        }
      });
    
      if (Object.keys(errors).length > 0) {
        setErrorState(errors);
        setLoading(false); // Stop loading if there are validation errors
        return;
      }
    
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email_id", formData.email_id);
      payload.append("primary_mobile", formData.primary_mobile);
      payload.append("secondary_mobile", formData.secondary_mobile);
      payload.append("gender", formData.gender);
      payload.append("dob", formData.dob);
      payload.append("blood_group", formData.blood_group);
      payload.append("qualification", formData.qualification);
      payload.append("id_proof", formData.id_proof);
      payload.append("is_verify_email", formData.is_verify_email);
      payload.append("joining_date", formData.joining_date);
      payload.append("leaving_date", formData.leaving_date);
      payload.append("password", formData.password);
      payload.append("roll", formData.roll);
      payload.append("specialization", formData.specialization);
      payload.append("specialization_id", formData.specialization_id);
      payload.append("is_available", formData.is_available);
    
      if (formData.profile_image) {
        payload.append("profile_image", formData.profile_image);
      }
    
      fetch(`${var_api}technicalstaff/update/${profileDetails.id}`, {
        method: "PUT",
        headers: {
          "Authorization": token,
        },
        body: payload,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Profile updated:", data);
          fetchProfileSettings();
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    


    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (e.g., 1MB limit)
        if (file.size > 1 * 1024 * 1024) {
          alert("File size should be below 1MB");
          return;
        }
    
        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
          alert("Accepted formats: JPG, PNG, JPEG");
          return;
        }
    
        // Set the file in state
        setFormData({ ...formData, profile_image: file });
      }
    };
    


    // Format Date to dd-MM-yyyy
  const formatDateToDDMMYYYY = (date) => {
    if (!date || !(date instanceof Date)) return null;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  // Parse dd-MM-yyyy to Date
  const parseDDMMYYYYToDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("-");
    const parsedDate = new Date(year, month - 1, day);
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Ensure valid Date object
  };

 // Handle Date Change
 const handleDateChange = (date) => {
  const formattedDate = formatDateToDDMMYYYY(date); // Convert to dd-MM-yyyy
  setFormData((prev) => ({ ...prev, dob: formattedDate }));
};

// Convert stored date to Date object for DatePicker
const parsedDate = formData.dob ? parseDDMMYYYYToDate(formData.dob) : null;




  return (
    <div>
      <Header profileDetails={profileDetails} />
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {/* Breadcrumb */}
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Doctor Profile</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Doctor Profile
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
              <DoctorSidebar 
               profileDetails={profileDetails}
               setProfileDetails={setProfileDetails}
              />
              {/* /Profile Sidebar */}
            </div>
            <div className="col-lg-8 col-xl-9">
              {/* Profile Settings */}
              <div className="dashboard-header">
                <h3>Profile Settings</h3>
              </div>
              {/* Settings List */}
              <SettingsHeader />
              {/* /Settings List */}
              <div className="setting-title">
                <h5>Profile</h5>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="setting-card">
                  <div className="change-avatar img-upload">
                    {/* <div className="profile-img">
                      <i className="fa-solid fa-file-image" />
                    </div> */}
                    <div className="profile-img">
                    {formData.profile_image ? (
          // <img src={
          //   formData.profile_image && /\.(jpeg|jpg|png|webp)$/i.test(formData.profile_image)
          //                               ? `${image_api}technical/${formData.profile_image}`
          //                               : doctordashboardprofile01
          //   } alt="Profile" />
          <img src={
           `${image_api}technical/${formData.profile_image}`
            } alt="Profile" />
        ) : (
          <i className="fa-solid fa-file-image" />
        )}
            
          </div>
                    <div className="upload-img">
                      <h5>Profile Image</h5>
                      <div className="imgs-load d-flex align-items-center">
                        <div className="change-photo">
                          Upload New
                          <input type="file" className="upload"  onChange={handleFileChange}/>
                        </div>
                        <Link to="#" className="upload-remove" onClick={() => setFormData({ ...formData, profile_image: "" })}>
                          Remove
                        </Link>
                      </div>
                      <p className="form-text">
                        Your Image should Below 1 MB, Accepted format Jpg,Png,Jpeg
                      </p>
                    </div>
                  </div>
                </div>
                <div className="setting-title">
                  <h5>Information</h5>
                </div>
                <div className="setting-card">
                  <div className="row">
                  {[
  { label: "Name", name: "name", value: formData.name },
  { label: "Email Address", name: "email_id", value: formData.email_id, type: "email" },
  { label: "Phone Number", name: "primary_mobile", value: formData.primary_mobile, type: "number" },
  { label: "Secondary Phone Number", name: "secondary_mobile", value: formData.secondary_mobile, type: "number" },
  {
    label: "Gender",
    name: "gender",
    value: formData.gender,
    isDropdown: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
  {
    label: "DOB",
    name: "dob",
    value: formData.dob,
    isDatePicker: true,
  },
  {
    label: "Blood Group",
    name: "blood_group",
    value: formData.blood_group,
    isDropdown: true,
    options: [
      { value: "A+", label: "A+" },
      { value: "A-", label: "A-" },
      { value: "B+", label: "B+" },
      { value: "B-", label: "B-" },
      { value: "AB+", label: "AB+" },
      { value: "AB-", label: "AB-" },
      { value: "O+", label: "O+" },
      { value: "O-", label: "O-" },
    ],
  },
  { label: "Qualification", name: "qualification", value: formData.qualification },
].map((field) => (
  <div className="col-lg-4 col-md-6" key={field.name}>
    <div className="form-wrap">
      <label className="col-form-label">
        {field.label} <span className="text-danger">*</span>
      </label>
      {field.isDatePicker ? (
        <DatePicker
          className="form-control datetimepicker"
          selected={parsedDate} // Pass valid Date object or null
          onChange={handleDateChange} // Update state on date change
          dateFormat="dd/MM/yyyy" // Display format
          showDayMonthYearPicker
        />
      ) : field.isDropdown ? (
        <Select
          className="select"
          options={field.options}
          value={field.options.find((option) => option.value === field.value)}
          onChange={(selectedOption) =>
            handleInputChange({ target: { name: field.name, value: selectedOption.value } })
          }
        />
      ) : (
        <input
          type={field.type || "text"}
          className="form-control"
          name={field.name}
          value={field.value}
          onChange={handleInputChange}
        />
      )}
      {errorState[field.name] && <div className="text-danger">{errorState[field.name]}</div>}
    </div>
  </div>
))}

                   
                    {/* <div className="col-lg-12">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Known Languages <span className="text-danger">*</span>
                        </label>

                        <TagsInput
                          // className="input-tags form-control"
                          value={language}
                          onChange={setLanguage}
                          placeHolder='Type'
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="setting-title">
                  {/* <h5>Memberships</h5> */}
                  {/* <h5>Other Details</h5> */}
                </div>

                 <div className="setting-card">
                  <div className="add-info membership-infos">
                  <h5>Other Details</h5>



                  





                    {/* ))} */}
                  </div>


                    {/* {membershipInfos.map((info, index) => ( */}
                    <div className="row membership-content">
                        <div className="col-lg-3 col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Role: {profileDetails?.roll}
                            </label>
                            {/* <input
                              type="text"
                              className="form-control"
                              placeholder="Add Title"
                              value={info.title}
                              onChange={(e) => {
                                const updatedInfos = [...membershipInfos];
                                updatedInfos[index].title = e.target.value;
                                setMembershipInfos(updatedInfos);
                              }}
                            /> */}
                          </div>
                        </div>
                        <div className="col-lg-9 col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="form-wrap w-100">
                              <label className="col-form-label">Specialization: {profileDetails?.specialization}</label>
                              {/* <input
                                type="text"
                                className="form-control"
                                value={info.about}
                                onChange={(e) => {
                                  const updatedInfos = [...membershipInfos];
                                  updatedInfos[index].about = e.target.value;
                                  setMembershipInfos(updatedInfos);
                                }}
                              /> */}
                            </div>
                            {/* <div className="form-wrap ms-2">
                              <label className="col-form-label d-block">&nbsp;</label>
                              <Link
                                to="#"
                                className="trash-icon trash"
                                onClick={() => deleteMembershipInfo(index)}
                              >
                                Delete
                              </Link>
                            </div> */}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Joining Date: {profileDetails?.joining_date}
                            </label>
                            {/* <input
                              type="text"
                              className="form-control"
                              placeholder="Add Title"
                              value={info.title}
                              onChange={(e) => {
                                const updatedInfos = [...membershipInfos];
                                updatedInfos[index].title = e.target.value;
                                setMembershipInfos(updatedInfos);
                              }}
                            /> */}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Leaving Date: {profileDetails?.leaving_date}
                            </label>
                            {/* <input
                              type="text"
                              className="form-control"
                              placeholder="Add Title"
                              value={info.title}
                              onChange={(e) => {
                                const updatedInfos = [...membershipInfos];
                                updatedInfos[index].title = e.target.value;
                                setMembershipInfos(updatedInfos);
                              }}
                            /> */}
                          </div>
                        </div>
                      </div>






                  {/* <div className="text-end">
                    <Link to="#" className="add-membership-info more-item" onClick={addMembershipInfo}>Add New</Link>
                  </div> */}
                </div> 



                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-gray me-1">
                    Cancel
                  </Link>
                  {/* <Link to="#" className="btn btn-primary prime-btn">
                    Save Changes
                  </Link> */}
                    <button type="submit" className="btn btn-primary prime-btn">
      Save Changes
    </button>
                </div>
              </form>
              {/* /Profile Settings */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter {...props} />
    </div>
  );
};

export default ProfileSetting;
