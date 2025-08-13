import React, { useState, useEffect,useCallback} from "react";
// import FeatherIcon from "feather-icons-react";
import SidebarNav from "../sidebar";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { avatar01 } from "../imagepath";
import { useHistory } from "react-router-dom";  // Use this for reac
import { Modal, Form, Input, notification, Radio, Select,Row,Col,Card } from "antd";
import dayjs from "dayjs";
import { var_api, image_api } from "../../../constant";
import axios from "axios";
import hospitaldummy from "../../assets/img/hoslogo.png";


const Profile = () => {
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const [selectedDate3, setSelectedDate3] = useState(new Date());
  const [hospitalname, setHospitalName] = useState('');
  const [email, setEmail] = useState(''); 
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [hospitalprofileimage, sethospitalprofileImage] = useState(null);
  const [profileimage, setProfileImage] = useState(null);
  const [fileadminidproof, setFileidproof] = useState(null);
  const [data, setData] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [adminDOB, setAdminDOB] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminmobile, setAdminMobile] = useState('');
  const [admingender, setAdminGender] = useState('');
  const [adminjoinedDate, setAdminjoinedDate] = useState('');
  const [adminleavedDate, setAdminleavedDate] = useState('');
  const [adminbloodgroup, setAdminbloodgroup] = useState('');
  const [adminqulification, setAdminqulification] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const hospital_id = localStorage.getItem("hospital_id");
  const user_id = localStorage.getItem("user_id");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [fileadmin, setFileadmin] = useState(null);
    const [form] = Form.useForm();
    const [hospitalform] = Form.useForm();
  const history = useHistory(); 
  const [ishospitalEdit, setHospitalEdit] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [hospitalDetails, setHospitalDetails] = useState([]);
    const userRole = localStorage.getItem('roll');
    const [profileDetails, setProfileDetails] = useState(null);
    const [tech, setTech] = useState(null);
    const [nontech, setNontech] = useState(null);
    // Blood group options
const bloodGroupOptions = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
];

    
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleDateChange1 = (date) => {
    console.log("Selected Date:", date); // Debugging
    if (date instanceof Date && !isNaN(date)) {
      setSelectedDate1(date);
    } else {
      console.error("Invalid Date Selected:", date);
      setSelectedDate1(null);
    }
  };

  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };

  const handleDateChange3 = (date) => {
    setSelectedDate3(date);
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${var_api}hospital/get/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
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

      const result = await response.json();
      setHospitalDetails(result);
      setHospitalName(result.name); // Set the fetched data
      setEmail(result.email); // Set filtered data (if needed)
      setMobile(result.mobile);
      setAddress(result.address);
      setState(result.state);
      setCountry(result.country);
      sethospitalprofileImage(result.profile_image);
      setTech(result.tech_count);
      setNontech(result.nontech_count);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchnontechnicalList = async () => {
    const token = localStorage.getItem("token");
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${var_api}nontechnicalstaff/get/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
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

      const result = await response.json();
      setData(result);
      setAdminName(result.name);
      setAdminDOB(result.dob);
      setAdminEmail(result.email_id);
      setAdminMobile(result.primary_mobile);
      setProfileImage(result.profile_image);
      setAdminGender(result.gender);
      setFileidproof(result.id_proof);
      setFileadmin(result.profile_image);
      setAdminjoinedDate(result.joining_date);
      setAdminleavedDate(result.leaving_date);
      setAdminbloodgroup(result.blood_group);
      setAdminqulification(result.qualification);
      setSelectedDate1(result.dob ? new Date(result.dob) : new Date());
      setSelectedDate2(result.joining_date ? new Date(result.joining_date) : new Date());
      setSelectedDate3(result.leaving_date ? new Date(result.leaving_date) : new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

//   const handleEditClick = () => {
//     console.log("bloodGroupOptions:", bloodGroupOptions);
// console.log("adminbloodgroup:", adminbloodgroup);
// console.log("Selected value from options:", bloodGroupOptions.find(option => option.value === adminbloodgroup));

//     setIsModalVisible(true);

//     // Pre-fill form fields with existing data
//     form.setFieldsValue({
//       name: adminName,
//       dob: adminDOB,
//       email_id: adminEmail,
//       primary_mobile: adminmobile,
//       joining_date:adminjoinedDate,
//       leaving_date:adminleavedDate,
//       blood_group:adminbloodgroup,
//       profile_image:fileadmin,
//       id_proof:fileadminidproof,
//       qualification:adminqulification,
//       joining_date: adminjoinedDate,
//       leaving_date: adminleavedDate,
//       gender: admingender
//     });
//   };


const handleEditClick = useCallback(() => {
  setIsModalVisible(true);
  form.setFieldsValue({
    name: adminName,
    dob: adminDOB,
    email_id: adminEmail,
    primary_mobile: adminmobile,
    joining_date: adminjoinedDate,
    leaving_date: adminleavedDate,
    blood_group: adminbloodgroup,
    profile_image: fileadmin,
    id_proof: fileadminidproof,
    qualification: adminqulification,
    gender: admingender
  });
}, [adminName, adminDOB, adminEmail, adminmobile, adminjoinedDate, adminleavedDate, adminbloodgroup, fileadmin, fileadminidproof, adminqulification, admingender]);

  const closeModal = () => {
    setIsModalVisible(false);
  };



  const closeModalHospital = () => {
    setHospitalEdit(false);
  };

  useEffect(() => {
    console.log("useEffect called");
    console.log("hospital_id:", hospital_id);
    console.log("user_id:", user_id);
  
    if (hospital_id) {
      fetchData();
    }
    // fetchDoctorDetails();
    fetchnontechnicalList();
  }, [hospital_id, user_id]);
  



  const handleFileChange = (e) => {
    // setFile(e.target.files[0]); // Store the selected file
    setFileadmin(e.target.files[0]);
  };

  const handleFileChangeidproof = (e) => {
    setFileidproof(e.target.files[0]); // Store the selected file
  };

  const handleFileChangeadmin = (e) => {
    setFileadmin(e.target.files[0]); // Store the selected file
  };

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("Invalid Date for Formatting:", date);
      return "";
    }
    return new Intl.DateTimeFormat("en-GB").format(date);
  };
  
  

  const handleUpdate = async (values) => {
    setLoading(true);
  
    // Create FormData to send both file and other fields
    const formData = new FormData();
  
    // Handle blood group: ensure it's just the value, not the full object
    if (values.blood_group && typeof values.blood_group === 'object') {
      values.blood_group = values.blood_group.value;  // Extract value if it's an object
    }
  
    // Ensure dob is not nullified unless invalid
    if (values.dob) {
      console.log("Before Formatting:", values.dob); // Debugging
      if (values.dob instanceof Date && !isNaN(values.dob.getTime())) {
        values.dob = formatDate(values.dob);  // Ensure it's properly formatted
      } else {
        console.error("Invalid DOB:", values.dob);
        // Only set to null if invalid, else leave it unchanged
        if (!values.dob) {
          values.dob = null;
        }
      }
    }
  
    if (values.joining_date) {
      values.joining_date = formatDate(values.joining_date);
    }
    if (values.leaving_date) {
      values.leaving_date = formatDate(values.leaving_date);
    }
  
    // Append form fields to FormData
    for (const [key, value] of Object.entries(values)) {
      if (key !== "profile_image" && key !== "id_proof") {
        formData.append(key, value);
      }
    }
  
    console.log('Form values on submit:', values); // Debug form values
  
    if (data) {
      formData.append("password", data.password || "");
      formData.append("secondary_mobile", data.secondary_mobile || "");
      formData.append("is_verify_email", data.is_verify_email || "");
      formData.append("joining_date", data.joining_date || "");
      formData.append("leaving_date", data.leaving_date || "");
      formData.append("roll", data.roll || "");
    }
  
    // Append file if it exists
    if (fileadmin) {
      formData.append("profile_image", fileadmin); // If file is updated
    } else if (values.profile_image) {
      formData.append("profile_image", values.profile_image); // Use existing file name
    }
  
    if (fileadminidproof) {
      formData.append("id_proof", fileadminidproof); // If file is updated
    } else if (values.id_proof) {
      formData.append("id_proof", values.id_proof); // Use existing file name
    }
  
    try {
      const response = await fetch(`${var_api}nontechnicalstaff/update/${user_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': ` ${localStorage.getItem('token')}`, // Replace with actual token
        },
        body: formData, // Send the FormData as the body
      });
  
      const result = await response.json(); // Parse the response as JSON
  
      if (response.ok) {
        notification.success({
          message: 'Staff details updated successfully',
          description: result.message || '', // Show response message
        });
        setIsModalVisible(false); // Close the modal
        fetchnontechnicalList();
      } else {
        notification.error({
          message: 'Failed to update staff details',
          description: result.message || 'An error occurred while updating the details.', // Show error description if available
        });
      }
    } catch (error) {
      console.error('Error updating staff details:', error);
      notification.error('An error occurred while updating staff details');
    } finally {
      setLoading(false);
    }
  };
  


  // const fetchDoctorDetails = async () => {
  //   const token = localStorage.getItem("token");
  //   const doc_id = localStorage.getItem("doctor_id");
  //   try {
  //     const response = await axios.get(`${var_api}technicalstaff/get/${doc_id}`, {
  //       headers: {
  //         Authorization: token,
  //       },
  //     });
  //     setProfileDetails(response.data);
  //     localStorage.setItem("doctor_name", response.data?.name);
  //     localStorage.setItem("doctor_profile", response.data?.profile_image);
  //     localStorage.setItem("doctor_available", response.data?.is_available);
  //   } catch (err) {
  //     console.error("Error fetching doctor details:", err);
  //   }
  // };
  
  

  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    // Validate input fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      notification.error({
        message: 'Please fill in all fields.',
        duration: 5, // Increase duration
      });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      notification.error({
        message: 'New password and confirm password do not match.',
        duration: 5, // Increase duration
      });
      return;
    }
  
    setLoading(true);
  
    const body = {
      oldPassword,
      newPassword,
    };
  
    try {
      const response = await fetch(`${var_api}nontechnicalstaff/admin/change-password/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        notification.success({
          message: 'Password updated successfully',
          description: result.message || '',
          duration: 5, // Increase duration
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchnontechnicalList();
      } else {
        notification.error({
          message: 'Failed to update Password',
          description: result.message || 'An error occurred while updating the details.',
          duration: 5, // Increase duration
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      notification.error({
        message: 'An error occurred while updating the password',
        duration: 5, // Increase duration
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClickHospital = () => {
    setHospitalEdit(true);
    hospitalform.setFieldsValue({
      name: hospitalname,
      email: email,
      mobile: mobile,
      address:address,
      state:state,
      country:country,
      profile_image: profileimage,
      website: hospitalDetails.website,
      patentid_prefix: hospitalDetails.patentid_prefix,
      doctorinvoice_prefix: hospitalDetails.doctorinvoice_prefix,
      appointment_prefix: hospitalDetails.appointment_prefix,
      medicalinvoice_prefix: hospitalDetails.medicalinvoice_prefix,
      prescriptionid_prefix: hospitalDetails.prescriptionid_prefix
    });
  };



  const handleHospitalUpdate = async (values) => {
    setLoading(true);
  
    // Get all current form data (pre-filled + updated values)
    const formDataValues = hospitalform.getFieldsValue();
  
    // Create FormData to send both file and other fields
    const formData = new FormData();
  
    // Merge form data and input values
    const combinedValues = { ...formDataValues, ...values };
  
    // Append all fields to FormData except profile_image
    for (const [key, value] of Object.entries(combinedValues)) {
      if (key !== "profile_image") { // Exclude profile_image from automatic appending
        formData.append(key, value);
      }
    }
  
    // Add specific fields from `hospitalDetails` to FormData
    if (hospitalDetails) {
      formData.append("patentid_prefix", hospitalDetails.patentid_prefix || "");
      formData.append("doctorinvoice_prefix", hospitalDetails.doctorinvoice_prefix || "");
      formData.append("appointment_prefix", hospitalDetails.appointment_prefix || "");
      formData.append("medicalinvoice_prefix", hospitalDetails.medicalinvoice_prefix || "");
      formData.append("prescriptionid_prefix", hospitalDetails.prescriptionid_prefix || "");
    }
  
    // Append profile_image separately to avoid duplication
    if (fileadmin instanceof File) {
      // If a new file is selected, send it as binary
      formData.append("profile_image", fileadmin);
    } else if (typeof values.profile_image === "string" && values.profile_image.trim() !== "") {
      // If no new file but an existing filename is available, send it as text
      formData.append("profile_image", values.profile_image);
    }
    
  
    try {
      const response = await fetch(`${var_api}hospital/update/${hospital_id}`, {
        method: "PUT",
        headers: {
          Authorization: `${localStorage.getItem("token")}`, // Replace with actual token
        },
        body: formData, // Send the FormData as the body
      });
  
      if (response.ok) {
        const result = await response.json();
        notification.success({
          message: "Hospital details updated successfully",
        });
        setFileadmin(null);
        setHospitalEdit(false); // Close the modal
        fetchData();
      } else {
        const errorData = await response.json();
        notification.error({
          message: "Failed to update hospital details",
          description: errorData.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Error updating hospital details:", error);
      notification.error({
        message: "An error occurred while updating hospital details",
      });
    } finally {
      setLoading(false);
    }
  };
  
  


  return (
    <>
      <SidebarNav />
      {/* Page Wrapper */}
      <div className="page-wrapper">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Profile</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Profile</li>
                </ul>
              </div>
            </div>
          </div>
          
       
    {tech === 1 && nontech === 2 && (
      <Card
        bordered={true}
        style={{
          width: 1000,
          height: 50,
          backgroundColor: '#fdecea',
          color: '#d32f2f',
          border: '1px solid #f44336',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box' // Add this to include border in height calculation
        }}
      >
        <h6 style={{ margin: 0, paddingLeft: 16, lineHeight: '50px' }}>You are using a trial pack</h6>
      </Card>
    )}

    <br/>
 
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="profile-header">
                <div className="row align-items-center">
                <div className="col-auto profile-image">
                <a href="#">
  <img
    className="rounded-circle"
    alt="User Image"
    src={
      hospitalprofileimage && hospitalprofileimage.trim() !== ""
        ? `${image_api}hospital_image/${hospitalprofileimage}`
        : hospitaldummy
    }
    onError={(e) => {
      e.target.onerror = null; // prevent infinite loop
      e.target.src = hospitaldummy;
    }}
  />
</a>

                </div>
                  <div className="col ml-md-n2 profile-user-info">
                    <h4 className="user-name mb-0">{hospitalname}</h4>
                    <h6 className="text-muted">{email}</h6>
                    <h6 className="text-muted">{mobile}</h6>
                    <div className="user-Location">
                      <i className="fa fa-map-marker" /> {address}<br />{state}<br />{country}
                    </div>
                  </div>
                  {/* {userRole === 'superadmin' && ( */}
      <div className="col-auto profile-btn">
        <a href="#" className="btn btn-primary" onClick={handleEditClickHospital}>
          Edit
        </a>
      </div>
    {/* )} */}
                </div>
              </div>
              <div className="profile-menu">
                <ul className="nav nav-tabs nav-tabs-solid">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#per_details_tab"
                    >
                      About
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#password_tab"
                    >
                      Password
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-content profile-tab-cont">
                {/* Personal Details Tab */}
                <div className="tab-pane fade show active" id="per_details_tab">
                  {/* Personal Details */}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title d-flex justify-content-between">
                            <span>Personal Details</span>
                            <a
                              className="edit-link"
                              // data-bs-toggle="modal"
                              onClick={handleEditClick}
                              // href="#edit_personal_details"
                            >
                              <i className="fa fa-edit me-1" />
                              Edit
                            </a>
                          </h5>
                          <div className="row">
    {/* Left Side: Profile Image */}
    <div className="col-auto">
    <div className="profile-image">
    <a href="#">
        <img
          className="rounded-circle"
          alt="User Image"
          src={profileimage ? `${image_api}${profileimage}` : avatar01}
          style={{ width: "100px", height: "100px" }} // Adjust size here
        />
      </a>
    </div>
  </div>

    {/* Right Side: Information */}
    <div className="col">
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Name</p>
        <p className="col-sm-10">{adminName}</p>
      </div>
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Date of Birth</p>
        <p className="col-sm-10">{adminDOB}</p>
      </div>
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Email ID</p>
        <p className="col-sm-10">{adminEmail}</p>
      </div>
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Mobile</p>
        <p className="col-sm-10">{adminmobile}</p>
      </div>
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Gender</p>
        <p className="col-sm-10">{admingender}</p>
      </div>
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Blood Group</p>
        <p className="col-sm-10">{adminbloodgroup}</p>
      </div>
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Qualification</p>
        <p className="col-sm-10">{adminqulification}</p>
      </div>
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Joined Date</p>
        <p className="col-sm-10">
          {adminjoinedDate}
          </p>
      </div>
      <div className="row">
        <p className="col-sm-2 text-muted text-sm-left mb-0 mb-sm-3">Leaved Date</p>
        <p className="col-sm-10">{adminleavedDate}</p>
      </div>
    </div>
  </div>
                       
                        </div>
                      </div>
                      {/* Edit Details Modal */}
                      <Modal
  title="Edit Hospital Details"
  visible={ishospitalEdit}
  onCancel={closeModalHospital}
  footer={null}
  width={700}
>
  <Form form={hospitalform} onFinish={handleHospitalUpdate}>
    {/* Name & Profile Image in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Profile "
          name="profile_image"
          rules={[{ required: !profileimage, message: "Please upload a profile image!" }]}
        >
          <div className="form-group">
            <input type="file" className="form-control" onChange={handleFileChange} />
            {file && <p>Selected File: {file.name}</p>}
          </div>
        </Form.Item>
      </Col>
    </Row>

    {/* Email & Mobile in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Email ID"
          name="email"
          rules={[{ required: true, message: "Please input the email id!" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Mobile No"
          name="mobile"
          rules={[{ required: true, message: "Please input the mobile no!" }]}
        >
          <Input
    maxLength={10}
    onKeyPress={(event) => {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    }}
  />
        </Form.Item>
      </Col>
    </Row>

    {/* Country & State in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Country" name="country">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="State" name="state">
          <Input />
        </Form.Item>
      </Col>
    </Row>

    {/* Address & Patent ID Prefix in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Patent ID Prefix" name="patentid_prefix">
          <Input />
        </Form.Item>
      </Col>
    </Row>

    {/* Doctor Invoice Prefix & Appointment Prefix in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Doctor Invoice Prefix" name="doctorinvoice_prefix">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Appointment Prefix" name="appointment_prefix">

          <Input />
        </Form.Item>
      </Col>
    </Row>

    {/* Medical Invoice Prefix & Prescription ID Prefix in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Medical Invoice Prefix" name="medicalinvoice_prefix">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Prescription ID Prefix" name="prescriptionid_prefix">
          <Input />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Latitude" name="latitude">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Longitude" name="longitude">
          <Input />
        </Form.Item>
      </Col>
    </Row>

    {/* Submit & Cancel Buttons */}
    <Form.Item>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button type="submit" className="btn btn-primary mx-1">
          Update
        </button>
        <button type="button" className="btn btn-danger" onClick={closeModalHospital}>
          Cancel
        </button>
      </div>
    </Form.Item>
  </Form>
</Modal>

<Modal
  title="Edit Admin Details"
  visible={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
>
  <Form
    form={form}
    onFinish={handleUpdate}
    initialValues={{
      blood_group: adminbloodgroup,
    }}
  >
    {/* Name and Date of Birth in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input defaultValue={adminName} />
        </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
  label="Date of Birth"
  name="dob"
  rules={[{ required: true, message: "Please select the date of birth!" }]}
>
  <DatePicker
    className="form-control"
    selected={selectedDate1 instanceof Date && !isNaN(selectedDate1) ? selectedDate1 : null}
    onChange={handleDateChange1}
    dateFormat="dd/MM/yyyy"
  />
</Form.Item>
      </Col>
    </Row>

    {/* Email ID and Mobile No in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Email ID"
          name="email_id"
          rules={[{ required: true, message: "Please input the email id!" }]}
        >
          <Input defaultValue={adminEmail} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Mobile No"
          name="primary_mobile"
          rules={[{ required: true, message: "Please input the mobile no!" }]}
        >
           <Input
    maxLength={10}
    onKeyPress={(event) => {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    }}
  />
        </Form.Item>
      </Col>
    </Row>

    {/* Blood Group and Qualification in one row */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Blood Group" name="blood_group">
          <Select placeholder="Select Blood Group">
            <Select.Option value="A+">A+</Select.Option>
            <Select.Option value="A-">A-</Select.Option>
            <Select.Option value="B+">B+</Select.Option>
            <Select.Option value="B-">B-</Select.Option>
            <Select.Option value="O+">O+</Select.Option>
            <Select.Option value="O-">O-</Select.Option>
            <Select.Option value="AB+">AB+</Select.Option>
            <Select.Option value="AB-">AB-</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Qualification" name="qualification">
          <Input defaultValue={adminqulification} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
    <Col span={24}>
    <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
              <Radio value="Other">Other</Radio>
            </Radio.Group>
          </Form.Item>
          </Col>
          </Row>

    {/* Profile Image in its own row */}
    <Row gutter={16}>
      <Col span={24}>
        <Form.Item label="Profile Image" name="profile_image">
          <div className="form-group">
            <input type="file" className="form-control" onChange={handleFileChangeadmin} />
            {fileadmin && <p>Selected File: {fileadmin.name}</p>}
          </div>
        </Form.Item>
      </Col>
    </Row>

    {/* ID Proof Image in its own row */}
    <Row gutter={16}>
      <Col span={24}>
        <Form.Item label="ID Proof Image" name="id_proof">
          <div className="form-group">
            <input type="file" className="form-control" onChange={handleFileChangeidproof} />
            {fileadminidproof && <p>Selected File: {fileadminidproof.name}</p>}
          </div>
        </Form.Item>
      </Col>
    </Row>

    {/* Form Actions */}
    <Form.Item>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button type="submit" className="btn btn-primary mx-1">
          Update
        </button>
        <button type="button" className="btn btn-danger" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </Form.Item>
  </Form>
</Modal>

                      {/* /Edit Details Modal */}
                    </div>
                  </div>
                  {/* /Personal Details */}
                </div>
                {/* /Personal Details Tab */}
                {/* Change Password Tab */}
                <div id="password_tab" className="tab-pane fade">
                  {/* <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Change Password</h5>
                      <div className="row">
                        <div className="col-md-10 col-lg-6">
                          <form>
                            <div className="form-group">
                              <label>Old Password</label>
                              <input type="password" className="form-control" />
                            </div>
                            <div className="form-group">
                              <label>New Password</label>
                              <input type="password" className="form-control" />
                            </div>
                            <div className="form-group">
                              <label>Confirm Password</label>
                              <input type="password" className="form-control" />
                            </div>
                            <button className="btn btn-primary" type="submit">
                              Save Changes
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="card">
      <div className="card-body">
        <h5 className="card-title">Change Password</h5>
        <form onSubmit={handlePasswordChange}>
        <div className="input-block input-block-new">
                          <label className="form-label">Old Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                        </div>
                        <div className="input-block input-block-new">
                          <label className="form-label">New Password</label>
                          <div className="pass-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control pass-input"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span
                              className={`feather-eye${showPassword ? "" : "-off"} toggle-password`}
                              onClick={togglePasswordVisibility}
                            />
                          </div>
                        </div>

      <div className="input-block input-block-new mb-0">
                          <label className="form-label">Confirm Password</label>
                          <div className="pass-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="form-control pass-input-sub"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                              className={`feather-eye${showConfirmPassword ? "" : "-off"} toggle-password`}
                              onClick={toggleConfirmPasswordVisibility}
                            />
                          </div>
                        </div>
                        <Form.Item style={{ marginTop: "20px" }}>
  <Row justify="start">
    <button type="submit" className="btn btn-primary" disabled={loading}>
      {loading ? "Saving..." : "Save Changes"}
    </button>
  </Row>
</Form.Item>
        </form>
      </div>
    </div>
                </div>
                {/* /Change Password Tab */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* /Page Wrapper */}
    </>
  );
};

export default Profile;
