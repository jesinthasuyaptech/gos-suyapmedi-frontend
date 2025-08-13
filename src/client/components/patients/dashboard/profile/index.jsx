import React, { useState, useEffect } from "react";
import DashboardSidebar from "../sidebar/sidebar.jsx";
import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import Footer from "../../../footer.jsx";
import Header from "../../../header.jsx";
import axios from "axios";
import { var_api, image_api } from "../../../../../constant.js";
import { notification } from "antd";
import { pat_dummy } from "../../../imagepath.jsx";

const Profile = (props) => {
    const [language, setLanguage] = useState(["English", "German"]);
    const [membershipInfos, setMembershipInfos] = useState([{ title: '', about: '' }]);
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [touchedFields, setTouchedFields] = useState({});
  
    const addMembershipInfo = () => {
      setMembershipInfos([...membershipInfos, { title: '', about: '' }]);
    };
  
    const deleteMembershipInfo = (index) => {
      const updatedMembershipInfos = membershipInfos.filter((_, i) => i !== index);
      setMembershipInfos(updatedMembershipInfos);
    };
  
    const [profileDetails, setProfileDetails] = useState(null);
    const doc_id = localStorage.getItem("doctor_id");
    const [formData, setFormData] = useState({
      name: "",
      mobile_no: "",
      email_id: "",
      blood_group: "",
      full_address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      profile_image: null,
      hospital_id: 0,
      running_no: "",
      old_running_no: "",
      secondary_mobile: "",
      age: 0,
      is_active: 1,
      dob: "",
      referal_Person: 0,
      is_other_referal: 0,
      other_referal_name: "",
      other_referal_mobile: "",
      gender: "N/A",
      is_dependant: 0,
      dependant_relationship: "N/A",
    });

    const validateForm = () => {
        const errors = {};
        const requiredFields = [
            "name", "mobile_no", "email_id", "blood_group", "gender", "dob",
            "full_address", "city", "state", "country", "pincode"
        ];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field] === '') {
                errors[field] = `${field.replace(/_/g, ' ')} is required`;
            }
        });

        // Email validation
        if (formData.email_id && !/^\S+@\S+\.\S+$/.test(formData.email_id)) {
            errors.email_id = "Please enter a valid email address";
        }

        // Phone number validation
        if (formData.mobile_no && !/^\d{10,15}$/.test(formData.mobile_no)) {
            errors.mobile_no = "Please enter a valid phone number (10-15 digits)";
        }

        // Pincode validation
        if (formData.pincode && !/^\d{4,10}$/.test(formData.pincode)) {
            errors.pincode = "Please enter a valid pincode (4-10 digits)";
        }

        // Age validation
        if (formData.age && (formData.age < 0 || formData.age > 120)) {
            errors.age = "Please enter a valid age";
        }

        setErrorMessages(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };

    useEffect(() => {
        validateForm();
    }, [formData]);

    const fetchProfileSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("patient_token");
            const patient_id = localStorage.getItem("patient_id"); 
            
            if (!token) {
                throw new Error("Token not found. Please log in again.");
            }
            
            const response = await axios.get(
                `${var_api}patientdetails/get/${patient_id}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            
            const option = response.data;
            setProfileDetails(option);
            localStorage.setItem("patientname", option.name);
            localStorage.setItem("patient_token_no", option.running_no);
            localStorage.setItem("patient_gender", option.gender);
            localStorage.setItem("patient_age", option.age);
            localStorage.setItem("patient_email", option.email_id);
            localStorage.setItem("patient_profile", option.profile_image);
        } catch (err) {
            console.error("Error fetching profile:", err);
            notification.error({
                message: "Error",
                description: "Failed to fetch profile data. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        if (profileDetails) {
            setFormData({
                hospital_id: profileDetails?.hospital_id || "",
                running_no: profileDetails?.running_no || "",
                old_running_no: profileDetails?.old_running_no || "",
                name: profileDetails?.name || "",
                mobile_no: profileDetails?.mobile_no || "",
                secondary_mobile: profileDetails?.secondary_mobile || "",
                email_id: profileDetails?.email_id || "",
                blood_group: profileDetails?.blood_group || "",
                full_address: profileDetails?.full_address || "",
                city: profileDetails?.city || "",
                state: profileDetails?.state || "",
                age: profileDetails?.age ? parseInt(profileDetails.age, 10) : 0,
                country: profileDetails?.country || "",
                pincode: profileDetails?.pincode || "",
                profile_image: profileDetails?.profile_image || null,
                is_active: profileDetails?.is_active ?? 1,
                dob: profileDetails?.dob || "",  
                referal_Person: profileDetails?.referal_Person ? parseInt(profileDetails.referal_Person, 10) : 0,
                is_other_referal: profileDetails?.is_other_referal ? parseInt(profileDetails.is_other_referal, 10) : 0,
                other_referal_name: profileDetails?.other_referal_name || "",
                other_referal_mobile: profileDetails?.other_referal_mobile || "",
                gender: profileDetails?.gender || "N/A",
                is_dependant: profileDetails?.is_dependant || 0,
                dependant_relationship: profileDetails?.dependant_relationship || "N/A",
            });
        }
    }, [profileDetails]);
    
    useEffect(() => {
        fetchProfileSettings();
    }, []);
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setTouchedFields({ ...touchedFields, [name]: true });
        
        if (errorMessages[name]) {
            setErrorMessages(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
  
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched to show all errors
        const allFields = {
            name: true,
            mobile_no: true,
            email_id: true,
            blood_group: true,
            gender: true,
            dob: true,
            full_address: true,
            city: true,
            state: true,
            country: true,
            pincode: true
        };
        setTouchedFields(allFields);
        
        validateForm();
        
        if (!isFormValid) {
            notification.error({
                message: "Validation Error",
                description: "Please fix all errors before submitting.",
            });
            return;
        }
        
        setLoading(true);
        const token = localStorage.getItem("patient_token");
        const patient_id = localStorage.getItem("patient_id");
        
        if (!token || !patient_id) {
            notification.error({
                message: "Authentication Error",
                description: "Token or patient ID not found. Please log in again.",
            });
            setLoading(false);
            return;
        }
    
        try {
            const formDataPayload = new FormData();
            
            // Append all required fields
            formDataPayload.append('hospital_id', hospital_id || 0);
            formDataPayload.append('is_active', formData.is_active);
            formDataPayload.append('name', formData.name);
            formDataPayload.append('mobile_no', formData.mobile_no);
            formDataPayload.append('full_address', formData.full_address);
            formDataPayload.append('dob', formData.dob);
            formDataPayload.append('gender', formData.gender);
            formDataPayload.append('email_id', formData.email_id);
            formDataPayload.append('blood_group', formData.blood_group);
            formDataPayload.append('running_no', formData.running_no);
            formDataPayload.append('old_running_no', formData.old_running_no);
            formDataPayload.append('referal_Person', formData.referal_Person);
            formDataPayload.append('is_other_referal', formData.is_other_referal);
            formDataPayload.append('other_referal_name', formData.other_referal_name);
            formDataPayload.append('other_referal_mobile', formData.other_referal_mobile);
            formDataPayload.append('is_dependant', formData.is_dependant);
            formDataPayload.append('dependant_relationship', formData.dependant_relationship);
            // Append optional fields
            if (formData.city) formDataPayload.append('city', formData.city);
            if (formData.state) formDataPayload.append('state', formData.state);
            if (formData.country) formDataPayload.append('country', formData.country);
            if (formData.pincode) formDataPayload.append('pincode', formData.pincode);
            if (formData.secondary_mobile) formDataPayload.append('secondary_mobile', formData.secondary_mobile);
            if (formData.age) formDataPayload.append('age', formData.age);
            if (formData.profile_image) {
                formDataPayload.append('profile_image', formData.profile_image);
            }
    
            const response = await axios.put(
                `${var_api}patientdetails/update/${patient_id}`,
                formDataPayload,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            if (response.status === 200) {
                notification.success({
                    message: "Success",
                    description: "Profile updated successfully!",
                });
                fetchProfileSettings();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            notification.error({
                message: "Error",
                description: error.response?.data?.error || "Failed to update profile. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };
  
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        // Validate file size (1MB limit)
        if (file.size > 1 * 1024 * 1024) {
            notification.error({
                message: "File Too Large",
                description: "File size should be below 1MB.",
            });
            return;
        }
    
        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            notification.error({
                message: "Invalid File Type",
                description: "Accepted formats: JPG, PNG, JPEG.",
            });
            return;
        }
    
        setFormData({ ...formData, profile_image: file });
    };
    
    const handleDateChange = (e) => {
        const dob = new Date(e.target.value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        
        setFormData(prev => ({
            ...prev,
            dob: e.target.value,
            age: age,
        }));
        setTouchedFields({ ...touchedFields, dob: true });
    };

    const shouldShowError = (fieldName) => {
        return touchedFields[fieldName] && errorMessages[fieldName];
    };

    return (
        <div>
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
                            <h2 className="breadcrumb-title">Profile Settings</h2>
                            <nav aria-label="breadcrumb" className="page-breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/home-1">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item" aria-current="page">
                                        Profile Settings
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
                                <DashboardSidebar />
                            </StickyBox>
                        </div>

                        <div className="col-lg-8 col-xl-9">
                            <form onSubmit={handleFormSubmit}>
                                <div className="setting-card">
                                    <div className="change-avatar img-upload">
                                        <div className="profile-img">
                                            {formData.profile_image ? (
                                                <img 
                                                    src={
                                                        typeof formData.profile_image === 'string' 
                                                            ? `${image_api}${formData.profile_image}`
                                                            : URL.createObjectURL(formData.profile_image)
                                                    } 
                                                    alt="Profile" 
                                                    onError={(e) => e.target.src = pat_dummy} 
                                                />
                                            ) : (
                                                <i className="fa-solid fa-file-image" />
                                            )}
                                        </div>
                                        <div className="upload-img">
                                            <h5>Profile Image</h5>
                                            <div className="imgs-load d-flex align-items-center">
                                                <div className="change-photo">
                                                    Upload New
                                                    <input 
                                                        type="file" 
                                                        className="upload" 
                                                        onChange={handleFileChange} 
                                                        accept="image/jpeg, image/png, image/jpg"
                                                    />
                                                </div>
                                                <Link 
                                                    to="#" 
                                                    className="upload-remove" 
                                                    onClick={() => setFormData({ ...formData, profile_image: null })}
                                                >
                                                    Remove
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="setting-title">
                                    <h5>Information</h5>
                                </div>

                                <div className="setting-card">
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    First Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${shouldShowError('name') ? 'is-invalid' : ''}`}
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                                {shouldShowError('name') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Phone Number <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${shouldShowError('mobile_no') ? 'is-invalid' : ''}`}
                                                    name="mobile_no"
                                                    value={formData.mobile_no}
                                                    onChange={handleChange}
                                                />
                                                {shouldShowError('mobile_no') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.mobile_no}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Email Address <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${shouldShowError('email_id') ? 'is-invalid' : ''}`}
                                                    name="email_id"
                                                    value={formData.email_id}
                                                    onChange={handleChange}
                                                />
                                                {shouldShowError('email_id') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.email_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Blood Group <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`form-control ${shouldShowError('blood_group') ? 'is-invalid' : ''}`}
                                                    name="blood_group"
                                                    value={formData.blood_group}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Blood Group</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                </select>
                                                {shouldShowError('blood_group') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.blood_group}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-lg-4 col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Gender <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`form-control ${shouldShowError('gender') ? 'is-invalid' : ''}`}
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {shouldShowError('gender') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.gender}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-lg-4 col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Date of Birth <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    className={`form-control ${shouldShowError('dob') ? 'is-invalid' : ''}`}
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleDateChange}
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                                {shouldShowError('dob') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.dob}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="setting-title">
                                    <h5>Address</h5>
                                </div>

                                <div className="setting-card">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Address <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${shouldShowError('full_address') ? 'is-invalid' : ''}`}
                                                    name="full_address"
                                                    value={formData.full_address}
                                                    onChange={handleChange}
                                                />
                                                {shouldShowError('full_address') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.full_address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    City <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${shouldShowError('city') ? 'is-invalid' : ''}`}
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                />
                                                {shouldShowError('city') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.city}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    State <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${shouldShowError('state') ? 'is-invalid' : ''}`}
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                />
                                                {shouldShowError('state') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.state}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Country <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${shouldShowError('country') ? 'is-invalid' : ''}`}
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                />
                                                {shouldShowError('country') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.country}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Pincode <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${shouldShowError('pincode') ? 'is-invalid' : ''}`}
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                />
                                                {shouldShowError('pincode') && (
                                                    <div className="invalid-feedback d-block">
                                                        {errorMessages.pincode}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-btn text-end">
                                    <Link to="/patient/dashboard" className="btn btn-gray">
                                        Cancel
                                    </Link>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary prime-btn"
                                        disabled={!isFormValid || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </>
                                        ) : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer {...props} />
        </div>
    );
};

export default Profile;