import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, Upload, notification,Select,DatePicker} from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons"; // For the upload icon
import { image_api, var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
import { Filter, initialSettingsApt } from "../../../client/components/common/filter";
import "../styles/Loader.css";
//import { DatePicker } from "antd";
// import dayjs from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);




const medicalrecord = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [selectedDoctorsId, setSelectedDoctorsId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState('');
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [form] = Form.useForm();
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [seatImage, setseatImage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const history = useHistory(); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedPatientsId, setSelectedPatientsId] = useState(null);
  const [specializationDetails, setSpecializationDetails] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [settings, setSettings] = useState(null);
  // const isdeletebyadminEnabled = localStorage.getItem("delete_by_admin") === "1";
  const deleteadmin = localStorage.getItem("delete_by_admin");
  const updateadmin = localStorage.getItem("updated_by_admin");
  const createadmin = localStorage.getItem("created_by_admin");


  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";//your_token_here"; // Update with actual token


  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    setLoading(true);
    try {
      const response = await fetch(`${var_api}medicalrecords/getby-hospital/${hospital_id}`, {
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
      setData(result || []);
      setFilteredData(result || []); // Set initial filtered data
      setSpecializationDetails([]);
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

  const fetchPatientData = async () => {
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
    setLoading(true);
    try {
      const response = await fetch(`${var_api}patientdetails/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Ensure 'Bearer ' prefix is added
        },
      });
  
      if (response.status === 401) {
        console.log("Unauthorized access");
        return;
      }
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const result = await response.json();
      console.log("Fetched Patients:", result); // Debugging line
      setPatientList(result || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Converts to YYYY-MM-DD format
  };
  

  const fetchSpecializationDetails = async () => {
    const hospital_id = localStorage.getItem("hospital_id");
    const token = localStorage.getItem("token");
  
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
        setSpecializationDetails([]);
        return;
      }
  
      // Transform response correctly
      const formattedDoctors = result
        .filter((doctor) => doctor.roll === "doctor") // Ensure filtering doctors correctly
        .map((doctor) => ({
          id: doctor.id,
          name: doctor.name,
        }));
  
      console.log("Formatted Doctors:", formattedDoctors); // Debugging
  
      setSpecializationDetails(formattedDoctors);
      setLoading(false); // Stop loading
  
      if (formattedDoctors.length > 0) {
        setSelectedDoctorId(formattedDoctors[0].id);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setSpecializationDetails([]);
      setLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchSpecializationDetails();
    // fetchSettingsList();
  }, []);
  

    const handleDoctorChange = (e) => {
        const doctorId = e.target.value;
      
        setSelectedDoctorId(doctorId); // Update doctor state
      
        // Preserve patient selection when updating doctor
        form.setFieldsValue({
          doctor: doctorId,
          patient: selectedPatientsId || form.getFieldValue("patient"), 
        });
      
        console.log("Doctor selected:", doctorId);
      };
      
    
      // const handlePatientChangeFilter = (patientId) => {
      //   console.log("Selected Patient ID:", patientId);
      //   // const patientId = selectedOption ? selectedOption.value : null;
      //   // console.log("Extracted Patient ID:", patientId);
      
      //   setSelectedPatientsId(patientId)  
      //     // Preserve doctor selection
      //     form.setFieldsValue({
      //       patient: patientId,
      //       //  doctor: selectedDoctorId || form.getFieldValue("doctor"),  
      //     });
      //     console.log("Updated Selected Patient:", patientId);
      
      //     // Ensure start_date and end_date are defined before formatting
      //     const formattedStartDate = startDate 
      //       ? formatDate(startDate) 
      //       : initialSettingsApt?.startDate ? formatDate(initialSettingsApt.startDate) : null;
          
      //     const formattedEndDate = endDate 
      //       ? formatDate(endDate) 
      //       : initialSettingsApt?.endDate ? formatDate(initialSettingsApt.endDate) : null;
        
      //     console.log("Start Date:", formattedStartDate);
      //     console.log("End Date:", formattedEndDate);
      //     console.log("Selected Patient:", patientId);
        
      //     // Ensure latest values are used in fetchData
      //   //   setTimeout(() => {
      //   //     fetchData(formattedStartDate, formattedEndDate, selectedDoctorId, patientId);
      //   //   }, 100);
      
      //     return patientId; // Ensures correct state update
    
      // };
      
      const handlePatientChangeFilter = (selectedOption) => {
        const patientId = selectedOption ? selectedOption.value : null;
        setSelectedPatientsId(patientId); // Update state
      
        const start_date = startDate || formatDate(initialSettingsApt.startDate) || null;
        const end_date = endDate || formatDate(initialSettingsApt.endDate) || null;
      
        // Always call API, even when selection is cleared
        setTimeout(() => {
          // fetchData(start_date, end_date, selectedDoctorsId, patientId);
        }, 100);
      };  
      
      

  useEffect(() => {
    fetchData();
    fetchSpecializationDetails();
    fetchPatientData();
  }, []);

  useEffect(() => {
    if (editData) {
      console.log("Original Date from API:", editData.date); 
  
      let parsedDate = null;
  
      if (editData.date) {
        if (editData.date.includes("/")) {
          parsedDate = dayjs(editData.date, "DD/MM/YYYY");
        } else {
          parsedDate = dayjs(editData.date, "YYYY-MM-DD");
        }
      }
  
      console.log("Parsed Date:", parsedDate.isValid() ? parsedDate.format() : "Invalid Date");
  
      form.setFieldsValue({
        ...editData,
        date: parsedDate.isValid() ? parsedDate : null, // ✅ Ensure it's set properly
        patient: editData.patient_id,
        doctor: editData.tech_id,
      });
  
      setSelectedDate(parsedDate.isValid() ? parsedDate : null);
    } else {
      form.resetFields();
      setSelectedDate(null);
    }
  }, [editData, form]);
  useEffect(() => {
    console.log("Updated patientList:", patientList);
  }, [patientList]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter((item) =>
        (item.name && item.name.toLowerCase().includes(value)) ||
        (item.date && item.date.toLowerCase().includes(value)) ||
        (item.description && item.description.toLowerCase().includes(value)) ||
        (item.report_file && item.report_file.toLowerCase().includes(value)) // If searching by image name
    );

    setFilteredData(filtered);
};
  const handleSwitchChange = (e, recordId) => {
    const isChecked = e.target.checked; // true if checked, false if unchecked
  
    const newStatus = isChecked ? 1 : 0; // If checked, pass 1, else pass 0
  console.log(recordId);
    // Optionally, update the backend or local state
    updateSlotStatus(recordId, newStatus);
  };
  const updateSlotStatus = (recordId, newStatus) => {
    // You can make an API call to update the status or update the local state here
    console.log(`recordId: ${recordId}, New Status: ${newStatus}`);
    const token = localStorage.getItem('token');
   
    // Example of making an API call (you would replace this with your actual API call):
    fetch(`${var_api}medicalrecords/update/${recordId.id}`, {
      method: 'PUT',
      //body: JSON.stringify({ recordId, newStatus }),
     // body: JSON.stringify(recordId, newStatus),
   
      body : JSON.stringify({
      ...recordId, is_active :newStatus  // Spread the properties of recordId into the new object
  }),

      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };


  const handleModalOpen = (record = null) => {
    setEditData(record);
    form.resetFields();

    if (record && record.date) {
        console.log("Original Date from API:", record.date);

        // Ensure we correctly parse the date from "DD/MM/YYYY" format
        const parsedDate = dayjs(record.date, "DD/MM/YYYY", true);

        console.log("Parsed Date Object:", parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "Invalid Date");

        if (parsedDate.isValid()) {
            form.setFieldsValue({ 
                ...record, 
                date: parsedDate // ✅ Store as a valid dayjs object
            });

            setSelectedDate(parsedDate);
        } else {
            console.warn("Invalid Date detected! Falling back to today.");
            form.setFieldsValue({ date: dayjs() });
            setSelectedDate(dayjs());
        }
    }

    setIsModalVisible(true);
};



 //fetch settings
  const fetchSettingsList = async () => {
    const hospital_id = localStorage.getItem('hospital_id');
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
     
      const response = await fetch(`${var_api}settings/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 401) {
        setLoading(false);
        // history.push("/login");
        return; 
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setSettings(result || []);
      setLoading(false);
     // setFilteredData(result || []); // Set initial filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    //  notification.error({
     //   message: "Fetch Failed",
     //   description: "Unable to retrieve data. Please try again later.",
     // });
    } finally {
      setLoading(false);
    }
  };
  


  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setEditData(null);         // Clear the edit data
  };

  const handleFileChangeSeat = (e) => {
    setseatImage(e.target.files[0]);
    console.log("seat", seatImage);
  };
  
  
  
//   const handleFormSubmit = async (values) => {
//     setLoading(true);
//     try {
//         const hospital_id = localStorage.getItem("hospital_id");
//         const user_id = localStorage.getItem("user_id");
//         const token = localStorage.getItem("token");

//         if (!hospital_id || !user_id) {
//             throw new Error("Required data missing in localStorage.");
//         }

//         const formData = new FormData();
//         formData.append("name", values.name);
//         formData.append("description", values.description || "-");
//         formData.append("hospital_id", hospital_id);
//         formData.append("patient_id", values.patient_id || 0);
//         formData.append("date", values.date || "");
//         formData.append("uploaded_by_nontech", user_id);
//         formData.append("uploaded_by_tech", values.uploaded_by_tech || 0);
//         formData.append("is_patient", values.is_patient || 0);
//         formData.append("is_active", values.is_active !== undefined ? values.is_active : 1); // Ensure it's not 0
//         formData.append("report_file", seatImage || values.report_file || new File([], ""));

//         console.log("FormData being sent:", [...formData]); // Debugging

//         const url = editData 
//             ? `${var_api}medicalrecords/update/${editData.id}` 
//             : `${var_api}medicalrecords/post`;

//         const method = editData ? "PUT" : "POST"; // Use PATCH instead of PUT

//         const response = await fetch(url, {
//             method,
//             headers: {
//                 Authorization: token,
//             },
//             body: formData,
//         });

//         const responseData = await response.json();
//         console.log("API Response:", responseData); // Debugging API response

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to save data");
//         }

//         notification.success({
//             message: editData ? "Update Successful" : "Creation Successful",
//             description: editData 
//                 ? "The record has been successfully updated." 
//                 : "A new record has been successfully created.",
//         });

//         fetchData();
//         handleModalClose();
//     } catch (error) {
//         console.error("Error submitting form:", error.message);
//         setLoading(false);
//         notification.error({
//             message: "Operation Failed",
//             description: error.message || "There was an error while saving the data.",
//         });
//     }
// };

const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
        const hospital_id = localStorage.getItem("hospital_id");
        const user_id = localStorage.getItem("user_id");
        const token = localStorage.getItem("token");

        if (!hospital_id || !user_id) {
            throw new Error("Required data missing in localStorage.");
        }
   

        const formData = new FormData();
        formData.append("description", values.description || "-");
        formData.append("hospital_id", Number(hospital_id)); // Ensure it's a number
        formData.append("patient_id", Number(form.getFieldValue("patient")) || 0);
        formData.append("tech_id", Number(selectedDoctorId) || 0);
        const formattedDate = values.date 
    ? new Date(values.date).toLocaleDateString("en-GB") // DD/MM/YYYY format
    : "";
    formData.append("date", formattedDate);// Format date
        formData.append("uploaded_by_nontech", Number(user_id));
        formData.append("uploaded_by_tech", Number(values.uploaded_by_tech) || 0);
        formData.append("is_patient", Number(values.is_patient) || 0);
        formData.append("is_active", values.is_active !== undefined ? Number(values.is_active) : 1);

        if (seatImage) {
            formData.append("report_file", seatImage);
        } else if (values.report_file) {
            formData.append("report_file", values.report_file);
        }

        console.log("FormData being sent:", [...formData]); // Debugging

        const url = editData 
            ? `${var_api}medicalrecords/update/${editData.id}` 
            : `${var_api}medicalrecords/post`;

        const method = editData ? "PUT" : "POST"; // Use PUT for full update

        const response = await fetch(url, {
            method,
            headers: { Authorization: token },
            body: formData,
        });

        const responseData = await response.json();
        console.log("API Response:", responseData);

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to save data");
        }

        notification.success({
            message: editData ? "Update Successful" : "Creation Successful",
            description: editData 
                ? "The record has been successfully updated." 
                : "A new record has been successfully created.",
        });

        fetchData();
        handleModalClose();
    } catch (error) {
        console.error("Error submitting form:", error.message);
        setLoading(false);
        notification.error({
            message: "Operation Failed",
            description: error.message || "There was an error while saving the data.",
        });
    }
};

  
  
  
  

  const handleReset = () => {
    // Reset form fields to their initial values
    form.resetFields();
    setseatImage("");
    setFile2("");
    setFile1("");
    setFile3("");
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setDeleteName();                // Set the ID of the specialization to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${var_api}medicalrecords/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error deleting record");

      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });

      fetchData();
      handleDeleteCancel(); // Close the delete confirmation modal
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date); // Ensure it's a dayjs object
      console.log("Date selected:", formattedDate.format("YYYY-MM-DD"));
      setSelectedDate(formattedDate);
      form.setFieldsValue({ date: formattedDate }); // Update form field
    } else {
      console.log("No date selected");
      setSelectedDate(null);
      form.setFieldsValue({ date: null });
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };


  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => {
        if (!text) return "-"; // Handle empty/null values
  
        const parsedDate = dayjs(text, ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"], true);
        
        return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "Invalid Date";
      },
    },
    {
      title: "Patient Name",
      dataIndex: "patient_id",
      render: (patientId) => {
        if (!patientList.length) return "Loading..."; // Show something until loaded
        const patient = patientList.find((p) => p.id === patientId);
        return patient ? patient.name : "-";
      },
    },
    {
      title: "Doctor Name",
      dataIndex: "tech_name",
      render: (text) => (text ? text : "-"),
    },


 
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (text ? text : "-"),
    },

    // {
    //     title: "Active",
    //     dataIndex: "is_active",
    //     render: (text, record) => {
    //         return (
    //           <div className="status-toggle">
    //             <input
    //               id={`rating${record?.id}`}
    //               className="check"
    //               type="checkbox"
    //               defaultChecked={record.is_active === 1}
    //               onChange={(e) => handleSwitchChange(e, record)}
    //             />
    //             <label
    //               htmlFor={`rating${record?.id}`}
    //               className="checktoggle checkbox-bg"
    //             >
    //               checkbox
    //             </label>
    //           </div>
    //         );
    //       },
    //       sorter: (a, b) => a.Status.length - b.Status.length,
    //     },
        {
          title: "Report",
          dataIndex: "report_file",
          render: (text) => (
            text ? (
              <a href={`${image_api}${text}`} target="_blank" rel="noopener noreferrer">
                View Report
              </a>
            ) : "-"
          ),
        },
        
    // {
    //   title: "Action",
    //   render: (_, text) => (
    //       <div className="text-start">
    //    {settings?.updated_by_admin == 1 &&( 
    //   <a
    //     href="#"
    //     className="me-1 btn btn-sm bg-success-light"
    //     // data-bs-toggle="modal"
    //     data-bs-target="#edit_specialities_details"
    //     onClick={() => handleModalOpen(text)}
    //   >
    //     <i className="fe fe-pencil"></i> Edit
    //   </a>
    //    )}
    //   {settings?.delete_by_admin == 1 &&(
    //   <a
    //     href="#"
    //     className="me-1 btn btn-sm bg-danger-light"
    //     // data-bs-toggle="modal"
    //     data-bs-target="#delete_modal"
    //     onClick={() => handleDeleteConfirm(text.id, text.name)}
    //   >
    //     <i className="fe fe-trash"></i> Delete
    //   </a>
    //   )}
    // </div>
    //   ),
    // },
  ];


  if (updateadmin == 1 || deleteadmin == 1) {
    columns.push({
         title: "Action",
      render: (_, text) => (
          <div className="text-start">
       {updateadmin == 1 &&( 
      <a
        href="#"
        className="me-1 btn btn-sm bg-success-light"
        // data-bs-toggle="modal"
        data-bs-target="#edit_specialities_details"
        onClick={() => handleModalOpen(text)}
      >
        <i className="fe fe-pencil"></i> Edit
      </a>
       )}
      {deleteadmin == 1 &&(
      <a
        href="#"
        className="me-1 btn btn-sm bg-danger-light"
        // data-bs-toggle="modal"
        data-bs-target="#delete_modal"
        onClick={() => handleDeleteConfirm(text.id, text.name)}
      >
        <i className="fe fe-trash"></i> Delete
      </a>
      )}
    </div>
      ),
    });
  }

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Medicine Record Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Medicine Record</li>
                </ul>
              </div>
              {createadmin == 1 &&( 
              <div className="col-auto">
                <button type="button" className="btn btn-primary mx-1"  onClick={() => handleModalOpen()}>
                  Add New
                </button>
              </div>
              )}
            </div>
          </div>

          <div className="row mb-3">
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

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                                           total: filteredData.length,
                                           pageSize: pageSize, // Limit to 2 rows per page
                                           current: currentPage,
                                           showSizeChanger: false,
                                           onShowSizeChange: (current, size) => handlePaginationChange(current, size),
                                           onChange: handlePaginationChange,
                                           itemRender: itemRender,
                                          
                                        }}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Modal */}
          <Modal
            visible={isModalVisible}
            title={editData ? "Edit Medicine Record" : "Add Medicine Record"}
            onCancel={handleModalClose}
            footer={null}
            destroyOnClose
          >
            <Form form={form} onFinish={handleFormSubmit} layout="vertical">
            <Form.Item name="patient" label="Patient">
            <Select
  className="select-social-img w-100"
  style={{ width: "100%",height: "45px" }} 
  placeholder="Select Patient"
  isSearchable={true}
  isClearable={true} // Enables the clear option
  options={patientList.map((patient) => ({
    value: patient.id,
    label: `${patient.name}-(${patient.running_no}) (${patient.mobile_no})`,
  }))}
  onChange={handlePatientChangeFilter}
  value={
    selectedPatientsId
      ? patientList.find((patient) => patient.id === selectedPatientsId)
        ? {
            value: selectedPatientsId,
            label: `${patientList.find((patient) => patient.id === selectedPatientsId)?.name}-(${patientList.find((patient) => patient.id === selectedPatientsId)?.running_no}) (${patientList.find((patient) => patient.id === selectedPatientsId)?.mobile_no})`,
          }
        : null
      : null
  }
/>
</Form.Item>

<Form.Item name="doctor" label="Doctor">
    <select
      className="form-control"
      value={selectedDoctorId || ""}
      onChange={(e) => {
        const doctorId = e.target.value;
        setSelectedDoctorId(doctorId);

        form.setFieldsValue({
          doctor: doctorId,
          patient: form.getFieldValue("patient") || selectedPatientsId, // Keep the patient
        });
      }}
    >
      <option value="">Select Doctor</option>
      {loading ? (
        <option disabled>Loading...</option>
      ) : specializationDetails.length === 0 ? (
        <option disabled>No Doctors Available</option>
      ) : (
        specializationDetails.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))
      )}
    </select>
  </Form.Item>
  {/* <Form.Item
  name="date"
  label="Date"
  rules={[{ required: true, message: "Please select a date" }]}
>
  <DatePicker
    value={selectedDate ? dayjs(selectedDate, "YYYY-MM-DD") : null} // Ensure correct format
    onChange={(date) => {
      if (date) {
        const formattedDate = dayjs(date).format("YYYY-MM-DD");
        setSelectedDate(formattedDate);
        form.setFieldsValue({ date: formattedDate });
      } else {
        setSelectedDate(null);
        form.setFieldsValue({ date: null });
      }
    }}
    format="DD/MM/YYYY" // Show as DD/MM/YYYY but store as YYYY-MM-DD
    className="form-control datetimepicker"
    style={{ width: "150px", fontSize: "12px", padding: "5px" }}
  />
</Form.Item> */}
<Form.Item
  name="date"
  label="Date"
  rules={[{ required: true, message: "Please select a date" }]}
>
<DatePicker
          value={selectedDate} // Ensure it's a dayjs object
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          className="form-control datetimepicker"
          style={{ width: "100%", height: "40px", fontSize: "16px", padding: "8px" }} 
        />
</Form.Item>


















              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: false, message: "Please enter Description" }]}
              >
                                    <input
  className="form-control"
  type="text"
  style={{ width: '480px' }} // Adjust the width as needed
/>
              </Form.Item>
              









              {/* <Form.Item
                name="cat_image"
                label="Category Image"
                rules={[{ required: false, message: "Please enter Category Description" }]}
              >
                <Input type="file" placeholder="Select File"  onChange={handleFileChangeSeat} id="seatImageInput" />
              </Form.Item> */}
            <Form.Item name="report_file" label="Image">
  <div>
    <input
      type="file"
      className="form-control"
      accept="image/*"
      onChange={handleFileChangeSeat} // Ensure this function processes the file correctly
    />

    {/* Show existing image if in edit mode and an image exists */}
    {editData?.report_file && !seatImage && (
      <div style={{ marginTop: "10px" }}>
        <p>Current Image:</p>
        <img
          src={`${image_api}medical_records/${editData.report_file}`} // Adjust API path if needed
          alt="Existing Report"
          style={{ width: "150px", height: "150px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
      </div>
    )}

    {/* Show newly selected image preview if user uploads a new one */}
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
</Form.Item>


              <Form.Item>
              <div className="d-flex justify-content-center">
                  <button type="submit"className="btn btn-primary mx-1" >
                    {editData ? "Update" : "Submit"}
                  </button>
                <button
              type="button"
              className="btn btn-danger"
              onClick={editData ? handleModalClose : handleReset}
            >
               {editData ? "Cancel" : "Reset"}
            </button>
            </div>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Delete Confirmation"
            visible={isDeleteConfirmVisible}
            onCancel={handleDeleteCancel} 
            footer={null} 
          >
          <p>Are you sure you want to delete this <span style={{fontWeight:"bold"}}></span> Medicalrecord?</p>
            <Form.Item>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary mx-1"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </button>
              </div>
            </Form.Item>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default medicalrecord;
