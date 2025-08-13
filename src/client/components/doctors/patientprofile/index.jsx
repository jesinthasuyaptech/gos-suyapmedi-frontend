import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams, useLocation} from "react-router-dom";
import Header from "../../header";
import "react-datepicker/dist/react-datepicker.css";
import DoctorFooter from "../../common/doctorFooter";
import DoctorSidebar from "../sidebar";
import { Table, Form, Input, Upload, notification} from "antd";
import {
  doctor_thumb_01,
  doctor_thumb_02,
  doctor_thumb_03,
  doctor_thumb_05,
  doctor_thumb_07,
  doctor_thumb_08,
  doctor_thumb_09,
  doctordashboardprofile01,
  doctorthumb02,
  logo,
} from "../../imagepath";
import Select from "react-select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { image_api, var_api } from "../../../../constant";
import patientdashboardprofile01 from "../../../assets/img/patients/pat_dummy.png";
import dummyDoc from "../../../assets/img/doctors/doc_dummy.png";
import { Filter, initialSettingsApt } from "../../common/filter";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure CSS is loaded
import "bootstrap/dist/js/bootstrap.bundle.min"; 
import * as bootstrap from "bootstrap";
import { Modal, Button } from "react-bootstrap"; // Correct import
window.bootstrap = bootstrap;

const PatientProfile = (props) => {
  const options = [
    { value: "", label: "Select Patient" },
    { value: "Naveen_marshall", label: "Rajesh" },
    { value: "Jaya Priya_stevens", label: "Kaviya" },
    { value: "Janani_gracey", label: "Janani Gracey" },
  ];
  const options2 = [
    { value: "", label: "Select Patient" },
    { value: "Naveen_marshall", label: "Rajesh" },
    { value: "Jaya Priya_stevens", label: "Kaviya" },
    { value: "Janani_gracey", label: "Janani Gracey" },
  ];
  const options3 = [
    { value: "", label: "Select" },
    { value: "Visit", label: "Visit" },
    { value: "Online", label: "Online" },
  ];
  const options4 = [
    { value: "", label: "Select" },
    { value: "1 Month", label: "1 Month" },
    { value: "1 Day", label: "1 Day" },
  ];
  const { id } = useParams(); 
  const location = useLocation();
 

  // Destructure patient data from location.state (it will be undefined if state is not passed)
  const { patient } = location.state || {};  // Default to an empty object if state is not found
  console.log("pat", patient);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsprescription, setAppointmentsprescription] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const doc_id = localStorage.getItem("doctor_id");
  const token = localStorage.getItem("doc_token");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [seatImage, setseatImage] = useState('');
  const [patientList, setPatientList] = useState([]);
  const [searchTermInv, setSearchTermInv] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;  // Number of items per page
  const [currentPageInv, setCurrentPageInv] = useState(1);
  const [currentPageRecord, setCurrentPageRecord] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState([]); 
  const itemsPerPageInv = 10;  // Number of items per page
  const itemsPerPageRecord= 10; 
  const history = useHistory();
    const [selectedDate, setSelectedDate] = useState(null);
  const [invoicebilling, setinvoicebilling] = useState([]);
  const [selectedinvoicebilling, setselectedinvoicebilling] = useState(null);
  // const [selectedPrescription, setSelectedPrescription] = useState([]);
  // const [modalTitle, setModalTitle] = useState("Prescription Details");
  const [selectedPrescription, setSelectedPrescription] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatientsId, setSelectedPatientsId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [specializationDetails, setSpecializationDetails] = useState([]);
  const hospital_profile =  localStorage.getItem("hospital_profile");
  const appointment_prefix = localStorage.getItem("appointment_prefix");
  const invoiced_prefix = localStorage.getItem("admin_invoiced_prefix");
  const invoicem_prefix = localStorage.getItem("invoicem_prefix");
  const prescription_prefix = localStorage.getItem("admin_prescription_prefix");
  const patient_prefix = localStorage.getItem("patient_prefix");
  const [startDate, setStartDate] = useState(null);
  const [records, setRecords] = useState([]); // State for records
  const [endDate, setEndDate] = useState(null);
  const [profileDetails, setProfileDetails] = useState(null);
  const [description, setDescription] = useState("");
  const [deleteId, setDeleteId] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState(null);
  // Adjust items per page as needed

  // Calculate total pages


  // Extract records for current page
  const totalPagesRecord = Math.ceil(data.length / itemsPerPageRecord);

  // Extract records for the current page
  const indexOfLastRecord = currentPageRecord * itemsPerPageRecord;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPageRecord;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  // Pagination handler
  const paginateRecord = (pageNumber) => setCurrentPageRecord(pageNumber);
  console.log("selectedinvoicebilling",selectedinvoicebilling)



  // Handle pagination click
 

  const handleReset = () => {
    // Reset form fields to their initial values
    // form.resetFields();
    setseatImage("");
    setFile2("");
    setFile1("");
    setFile3("");
  };

  const renderPagination = () => {
    const maxPageNumbersToShow = 3; // Number of visible pages before showing "..."
    let pageNumbers = [];
  
    if (totalPagesRecord <= maxPageNumbersToShow + 2) {
      // Show all pages if total pages are small
      pageNumbers = Array.from({ length: totalPagesRecord }, (_, i) => i + 1);
    } else {
      // Show pagination with ellipsis
      if (currentPageRecord <= maxPageNumbersToShow) {
        pageNumbers = [...Array(maxPageNumbersToShow).keys()].map((n) => n + 1);
        pageNumbers.push("...", totalPagesRecord);
      } else if (currentPageRecord > totalPagesRecord - maxPageNumbersToShow) {
        pageNumbers = [1, "..."];
        pageNumbers.push(...Array.from({ length: maxPageNumbersToShow }, (_, i) => totalPagesRecord - maxPageNumbersToShow + i + 1));
      } else {
        pageNumbers = [1, "...", currentPageRecord - 1, currentPageRecord, currentPageRecord + 1, "...", totalPagesRecord];
      }
    };
  }

  const handleShowModal = (id) => {
    console.log("Opening Delete Modal for ID:", id);
    setDeleteId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing Delete Modal...");
    setShowModal(false);
    setDeleteId(null);
  };

  

  const handleDelete = async () => {
    if (!deleteId) {
      console.error("Error: No record ID provided for deletion.");
      return;
    }
  
    setLoading(true);
    const token = localStorage.getItem("doc_token");
  
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


  
  const fetchDoctorDetails = async () => {
    const token = localStorage.getItem("doc_token");
    const doc_id = localStorage.getItem("doctor_id");
    try {
      const response = await axios.get(`${var_api}technicalstaff/get/${doc_id}`, {
        headers: {
          Authorization: token,
        },
      });
      setProfileDetails(response.data);
      localStorage.setItem("doctor_name", response.data?.name);
      localStorage.setItem("doctor_profile", response.data?.profile_image);
      localStorage.setItem("doctor_available", response.data?.is_available);
    } catch (err) {
      console.error("Error fetching doctor details:", err);
    }
  };

    const fetchDatamedi = async () => {
      const token = localStorage.getItem('doc_token');
      const hospital_id = localStorage.getItem('doc_hospital_id');
      const doctor_id = localStorage.getItem("doctor_id");
      setLoading(true);
      try {
        const response = await fetch(`${var_api}medicalrecords/get-latest-tech-hospital/${hospital_id}/${doctor_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response.status === 401) {
          // history.push("/admin/login"); // Redirect to login page
          // notification.warning({
          //   message: "Unauthorized",
          //   description: "Your session has expired. Please log in again.",
          // });
        return;
        }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result || []);
        setFilteredData(result || []); // Set initial filtered data
        setSpecializationDetails([]);
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

       const fetchSpecializationDetails = async () => {
          const hospital_id = localStorage.getItem("doc_hospital_id");
          const token = localStorage.getItem("doc_token");
        
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

        const handlePatientChangeFilter = (patientId) => {
          console.log("Selected Patient ID:", patientId);
          // const patientId = selectedOption ? selectedOption.value : null;
          // console.log("Extracted Patient ID:", patientId);
        
          setSelectedPatientsId(patientId)  
            // Preserve doctor selection
            form.setFieldsValue({
              patient: patientId,
              //  doctor: selectedDoctorId || form.getFieldValue("doctor"),  
            });
            console.log("Updated Selected Patient:", patientId);
        
            // Ensure start_date and end_date are defined before formatting
            const formattedStartDate = startDate 
              ? formatDate(startDate) 
              : initialSettingsApt?.startDate ? formatDate(initialSettingsApt.startDate) : null;
            
            const formattedEndDate = endDate 
              ? formatDate(endDate) 
              : initialSettingsApt?.endDate ? formatDate(initialSettingsApt.endDate) : null;
          
            console.log("Start Date:", formattedStartDate);
            console.log("End Date:", formattedEndDate);
            console.log("Selected Patient:", patientId);
          
            // Ensure latest values are used in fetchData
          //   setTimeout(() => {
          //     fetchData(formattedStartDate, formattedEndDate, selectedDoctorId, patientId);
          //   }, 100);
        
            return patientId; // Ensures correct state update
      
        };

          const fetchPatientData = async () => {
            const token = localStorage.getItem("doc_token");
            const hospital_id = localStorage.getItem("doc_hospital_id");
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

        

        const handleFileChangeSeat = (e) => {
          setseatImage(e.target.files[0]);
          console.log("seat", seatImage);
        };

        const handleDateChange1 = (date) => {
          setSelectedDate(date);
        };


        const handleFormSubmit = async (values) => {
          setLoading(true);
          try {
            const hospital_id = localStorage.getItem("doc_hospital_id");
            const user_id = localStorage.getItem("user_id");
            const doctor_id = localStorage.getItem("doctor_id");
            const token = localStorage.getItem("doc_token");
        
            if (!hospital_id || !user_id) {
              throw new Error("Required data missing in localStorage.");
            }
        
            const formData = new FormData();
            formData.append("description", description.trim() || "-");
            formData.append("hospital_id", Number(hospital_id));
            formData.append("patient_id", Number(selectedPatientsId) || "");
            formData.append("tech_id", Number(doctor_id) || "");
        
            if (selectedDate) {
              if (selectedDate instanceof Date && !isNaN(selectedDate)) {
                const formattedDate = selectedDate.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
                formData.append("date", formattedDate);
              } else {
                console.warn("⚠️ Invalid date detected:", selectedDate);
              }
            }
            
            formData.append("uploaded_by_nontech", Number(values.uploaded_by_nontech) || 0);
            formData.append("uploaded_by_tech", Number(user_id));
            formData.append("is_patient", Number(values.is_patient) || 0);
            formData.append("is_active", values.is_active !== undefined ? Number(values.is_active) : 1);
        
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
        
            console.log("🔍 Checking function existence:");
            console.log("fetchDatamedi exists?", typeof fetchDatamedi);
            console.log("handleModalClose exists?", typeof handleModalClose);
        
            // ✅ Ensure both functions exist before calling
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
            // notification.error({
            //   message: "Operation Failed",
            //   description: error?.message || "There was an error while saving the data.",
            // });
          } finally {
            setLoading(false);
          }
        };
        
        
        
        
        
        
        
      


 useEffect(() => {
      fetchData();
      fetchPatientData();
      fetchDataprescription();
      fetchSpecializationDetails();
      fetchInvoiceData();
      fetchDoctorDetails();
      handleFormSubmit();
      fetchDatamedi();
      fetchSettingsList();
    }, [doc_id, token]);

    useEffect(() => {
      if (editData?.date && editData.date !== "0000-00-00") {
        let parsedDate = null;
    
        if (typeof editData.date === "string") {
          if (editData.date.includes("-")) {
            // Convert yyyy-mm-dd → Date object
            const [year, month, day] = editData.date.split("-");
            parsedDate = new Date(year, month - 1, day); // Month is 0-indexed
          } else if (editData.date.includes("/")) {
            // Convert dd/mm/yyyy → Date object
            const [day, month, year] = editData.date.split("/");
            parsedDate = new Date(year, month - 1, day); // Month is 0-indexed
          }
        } else if (editData.date instanceof Date) {
          parsedDate = editData.date;
        }
    
        // Validate the parsed date
        if (parsedDate instanceof Date && !isNaN(parsedDate)) {
          setSelectedDate(parsedDate);
        } else {
          console.error("Invalid date parsed:", parsedDate);
          setSelectedDate(null); // Fallback to null if invalid
        }
      } else {
        setSelectedDate(null); // Fallback to null if no date
      }
    }, [editData]);
    
    


      useEffect(() => {
        if (editData) {
          setSelectedPatientsId(editData.patient_id || "");
          setSelectedDoctorId(editData.tech_id || "");
          setSelectedDate(editData.date ? new Date(editData.date) : null);
          setDescription(editData.description || "");
          // No need to set seatImage for existing image unless a new one is uploaded
        }
      }, [editData]);

      useEffect(() => {
        if (editData) {
          form.setFieldsValue({
            description: editData.description || "",
            patient_id: editData.patient_id ? String(editData.patient_id) : "",
            tech_id: editData.tech_id ? String(editData.tech_id) : "",
            date: editData.date ? new Date(editData.date) : null,
          });
        }
      }, [editData, form]);
      
      useEffect(() => {
        if (editData?.report_file) {
          setseatImage(null); // Reset new image selection
        }
      }, [editData]);
      

  //listing the appointments
  const fetchData = async () => {
    setLoading(true);
    try {
     
      const response = await fetch(`${var_api}appointment/appointment-patients-list/${doc_id}/${patient.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 401) {
        setLoading(false);
        history.push("/login");
        return; 
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setAppointments(result || []);
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

  //fetch prescription
  const fetchDataprescription = async () => {
    setLoading(true);
    try {
     
      const response = await fetch(`${var_api}appointment/getAppointments-with-prescriptions/${patient.id}/${doc_id}`, {
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
      setAppointmentsprescription(result.data || []);
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


  //fetch settings
  const fetchSettingsList = async () => {
    const hospital_id = localStorage.getItem('doc_hospital_id');
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

  
  const handleAddNew = () => {
    setEditData(null);  // ✅ Ensure `editData` is empty
    setIsEditMode(false);  // ✅ Set Add mode
  
    setTimeout(() => {  // ✅ Open modal AFTER state clears
      const modalElement = document.getElementById("medical_records");
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 0);
  };
  
  
  const handleEdit = (record) => {
    setEditData(record); // Existing data set pannudhu
    setSelectedPatientsId(record.patient_id);
    setSelectedDate(new Date(record.date));
    setSelectedDoctorId(record.doctor_id);
    setDescription(record.description);
    setseatImage(record.image_url);
  };
  
  
  
  
  

  
  function getStatusBadge(status) {
    switch (status) {
      case 0:
      case 1:
        return <span className="badge badge-yellow status-badge">Upcoming</span>;
      case 2:
        return <span className="badge badge-green status-badge">Inprogress</span>;
      case 3:
        return <span className="badge badge-green status-badge">Completed</span>;
      case 4:
      case 5:
        return <span className="badge badge-danger status-badge">Cancelled</span>;
      case 6:
        return <span className="badge badge-green status-badge">Revisit</span>;
      default:
        return <span className="badge badge-danger status-badge">Unknown</span>;
    }
  }
  function getStatusName(status) {
    switch (status) {
      case 0:
      case 1:
        return "Upcoming";
      case 2:
        return "Inprogress";
      case 3:
        return "Completed";
      case 4:
      case 5:
        return "Cancelled";
      case 6:
        return "Revisit";
      default:
        return "Unknown";
    }
  }
  function formatDate(dateString) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Validate the input
    if (!dateString || typeof dateString !== "string") {
      console.error("Invalid or missing date string:", dateString);
      return "Invalid Date"; // Return a default value for invalid input
    }
  
    // Try parsing as an ISO date first
    const date = new Date(dateString);
  
    if (!isNaN(date.getTime())) {
      // Valid ISO date
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  
    // Handle custom 'dd-mm-yyyy' format
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    }
  
    // If all parsing attempts fail
    console.error("Unexpected date format:", dateString);
    return "Invalid Date";
  }
  

  
  const filteredAppointments = appointments.filter((appt) => {
    const searchString = searchTerm.toLowerCase();
    return (
      appt.doctor_name?.toLowerCase().includes(searchString) ||
      getStatusName(appt.status)?.toString().toLowerCase().includes(searchString) ||
      (`#${appointment_prefix}${appt.token_no}`.toLowerCase().includes(searchString)) ||
      appt.id?.toString().toLowerCase().includes(searchString) ||
      appt.amount?.toString().toLowerCase().includes(searchString) ||
      formatDate(appt.appointment_day).toLowerCase().includes(searchString) ||
      formatDate(appt.created_at).toLowerCase().includes(searchString)
    );
  });
  const filteredAppointmentspres = appointmentsprescription.filter((appt) => {
    const searchString = searchTerm.toLowerCase();
    return (
      appt.tech_name?.toLowerCase().includes(searchString) ||
      (`#${appointment_prefix}${appt.token_no}`.toLowerCase().includes(searchString)) ||
      formatDate(appt.appointment_day).toLowerCase().includes(searchString)
    );
  });

  const filteredInvoices = invoicebilling.filter((appt) => {
    const searchString = searchTermInv.toLowerCase();
    const paidStatus = appt.paid_status === 1 
    ? "paid" 
    : appt.paid_status === 0 
    ? "not paid" 
    : "unknown";

    return (
      paidStatus.toLowerCase().includes(searchString) ||
      appt.id?.toString().toLowerCase().includes(searchString) ||
      appt.final_amount?.toString().toLowerCase().includes(searchString) ||
      formatDate(appt.appointment_day).toLowerCase().includes(searchString) 
    );
  });

   // Function to handle the click and fetch prescription details by appointment_id
   const handlePrescriptionClick = (appointment_id) => {
    const appointment = appointmentsprescription.find(
      (appt) => appt.appointment_id === appointment_id
    );

    if (appointment && appointment.prescriptions) {
      setSelectedPrescription(appointment.prescriptions);
      setSelectedAppointment(appointment);
    } else {
      setSelectedPrescription([]);
      setSelectedAppointment(null);
    }
  };

  const handleModalOpen = (record = null) => {
    setEditData(record); // Set record data for editing (if any)
    Form.resetFields();   // Reset the form fields
    if (record) {
      Form.setFieldsValue(record); // Set initial values for the edit form
    }
    setIsModalVisible(true);  // Show the modal
  };


    // Pagination logic
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const totalPagespres = Math.ceil(filteredAppointmentspres.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
    const currentItemspres = filteredAppointmentspres.slice(indexOfFirstItem, indexOfLastItem);
  
    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


   //fetch invoice billing details
     //listing the appointments
     const fetchInvoiceData = async () => {
      setLoading(true);
      try {
       
        const response = await fetch(`${var_api}invoicebilling/get-doctor-patient-invoices/${doc_id}/${patient.id}`, {
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
        setinvoicebilling(result || []);
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


    //invoice selected data
    const handleinvoicebillingdetailsClick = (invoice) => {
     setselectedinvoicebilling(invoice);
     console.log("inv", invoice);
    }
    const handleModalClose = () => {
      setEditData(null);
      form.resetFields();
      setSelectedPatientsId("");
      setSelectedDoctorId("");
      setSelectedDate(null);
      setDescription("");
      setseatImage(null);
    
      const modal = bootstrap.Modal.getInstance(document.getElementById("medical_records"));
      modal.hide();
    };
    
  

//to download invoice pdf
    const handleDownloadPDF = () => {
      const pdfName = `${selectedinvoicebilling?.patient_details?.name || "Patient"}-${
        selectedinvoicebilling?.invoice_token || "INV000"
      }-${formatDate(selectedinvoicebilling?.appointment_day || "")}.pdf`;
    
      // Select the modal content to download
      const invoiceContent = document.querySelector(".invoice-billing");
    
      if (invoiceContent) {
        html2canvas(invoiceContent, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
    
          // Set PDF dimensions
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(pdfName);
        });
      } else {
        alert("Invoice content not found.");
      }
    };
//to download prescription pdf
    const handleDownloadPDFPrescription = () => {
      const pdfName = `${selectedAppointment?.patient_details?.name || "Patient"}- #PR${
        selectedAppointment?.token_no || "PR000"
      }-${formatDate(selectedAppointment?.appointment_day || "")}.pdf`;
    
      // Select the modal content to download
      const prescriptionContent = document.querySelector(".prescription");
    
      if (prescriptionContent) {
        html2canvas(prescriptionContent, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
    
          // Set PDF dimensions
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(pdfName);
        });
      } else {
        alert("Prescription content not found.");
      }
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
      const token = localStorage.getItem("doc_token");
    
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
    
    



     // Pagination logic for invoice
     const totalPagesinv = Math.ceil(filteredInvoices.length / itemsPerPageInv);
     const indexOfLastIteminv = currentPageInv * itemsPerPageInv;
     const indexOfFirstIteminv = indexOfLastIteminv - itemsPerPageInv;
     const currentItemsinv = filteredInvoices.slice(indexOfFirstIteminv, indexOfLastIteminv);
   
     // Handle page change
     const paginateinv = (pageNumber) => setCurrentPageInv(pageNumber);
 


  return (
    <>
      <div className="main-wrapper">
        <Header profileDetails={profileDetails}  />
        {/* Breadcrumb */}
        <div className="breadcrumb-bar-two">
        {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <h2 className="breadcrumb-title">My Patient</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home-1">Home</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      My Patient
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
              {/* Patient Details */}
              <div className="col-lg-8 col-xl-9">
                <div className="appointment-patient">
                  <div className="dashboard-header">
                    <h3>
                      <Link to="/doctor/my-patients">
                        <i className="fa-solid fa-arrow-left" /> Patient Details
                      </Link>
                    </h3>
                  </div>
                  <div className="patient-wrap">
                    <div className="patient-info">
                      {/* <img src={doctordashboardprofile01} alt="img" /> */}
                      <img src={
                                                                                                                          patient?.profile_image &&
                                                                                                                        /\.(jpeg|jpg|png|webp)$/i.test(
                                                                                                                          patient.profile_image
                                                                                                                        )
                                                                                                                          ? `${var_api}${patient?.profile_image}`
                                                                                                                          :patientdashboardprofile01} />
                      <div className="user-patient">
                        <h6>#{patient_prefix}{patient?.running_no}</h6>
                        <h5>{patient?.name}</h5>
                        <ul>
                          <li>DOB : {patient?.dob}</li>
                          <li>{patient?.gender}</li>
                          <li>{patient?.blood_group}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="patient-book">
                      <p>
                        <i className="fa-solid fa-calendar-days" />
                        Last Booking
                      </p>
                      <p>{formatDate(patient?.appointment_day)}</p>
                    </div>
                  </div>
                  {/* Appoitment Tabs */}
                  <div className="appointment-tabs user-tab">
                    <ul className="nav">
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="#pat_appointments"
                          data-bs-toggle="tab"
                        >
                          Appointments
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#prescription"
                          data-bs-toggle="tab"
                        >
                          Prescription
                        </Link>
                      </li>
                      {/* <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#medical"
                          data-bs-toggle="tab"
                        >
                          Medical Records
                        </Link>
                      </li> */}
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#billing"
                          data-bs-toggle="tab"
                        >
                          Billing
                        </Link>
                      </li>
                      {
                          settings?.list_by_tech == 1 && (
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#medicalrecords"
                          data-bs-toggle="tab"
                        >
                          Medical Records
                        </Link>
                      </li>
                          )}
                    </ul>
                  </div>
                  {/* /Appoitment Tabs */}
                  <div className="tab-content pt-0">
                    {/* Appointment Tab */}



                    <div
                      id="pat_appointments"
                      className="tab-pane fade show active"
                    >
                      <div className="search-header">
                        <div className="search-field">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <span className="search-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </span>
                        </div>
                      </div>
                      <div className="custom-table">
                        <div className="table-responsive">
                          <table className="table table-center mb-0" loading={loading}>
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Doctor</th>
                                <th>Appt Date</th>
                                <th>Booking Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                {/* <th>Action</th> */}
                              </tr>
                            </thead>
                            <tbody>
                            {currentItems.length > 0 ? (
                  currentItems.map((appt, index) => (
                              <tr key={index}>
                                <td>
                                  <Link
                                    to="#"
                                    className="text-blue-600"
                                  >
                                    #{appointment_prefix}{appt.token_no}
                                  </Link>
                                </td>
                                <td>
                                  <h2 className="table-avatar">
                                    <Link
                                      to="#"
                                      className="avatar avatar-sm me-2"
                                    >
                                      <img
                                        className="avatar-img rounded-3"
                                        src={appt.tech_profile_image &&
                                          /\.(jpeg|jpg|png|webp)$/i.test(appt.tech_profile_image) ? `${image_api}${appt.tech_profile_image}` : dummyDoc}
                                        alt="User Image"
                                      />
                                    </Link>
                                    <Link to="#">
                                      {appt.tech_name}
                                    </Link>
                                  </h2>
                                </td>
                                <td>{formatDate(appt.appointment_day)}</td>
                                <td>{formatDate(appt.created_at)}</td>
                                <td>{appt.amount}</td>
                                <td>
                                {getStatusBadge(appt.status)}
                                </td>
                                {/* <td>
                                  <div className="action-item">
                                    <Link to="/patient/upcoming-appointment">
                                      <i className="fa-solid fa-link" />
                                    </Link>
                                  </div>
                                </td> */}
                              </tr>
                               ))
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">No appointments found</td>
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
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            >
              <i className="fa-solid fa-chevron-left" />
            </Link>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1}>
              <Link
                to="#"
                className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="#"
              className="page-link"
              onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            >
              <i className="fa-solid fa-chevron-right" />
            </Link>
          </li>
        </ul>
      </div>
                      {/* /Pagination */}
                    </div>





                    {/* /Appointment Tab */}
                    {/* Prescription Tab */}
                    <div className="tab-pane fade" id="prescription">
                      <div className="search-header">
                        <div className="search-field">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <span className="search-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </span>
                        </div>
                        {/* <div>
                          <Link
                            to="#"
                            className="btn btn-primary prime-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#add_prescription"
                          >
                            Add New Prescription
                          </Link>
                        </div> */}
                      </div>
                      <div className="custom-table">
                        <div className="table-responsive">
                          <table className="table table-center mb-0" loading={loading}>
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Prescriped By</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                            {currentItemspres.length > 0 ? (
                  currentItemspres.map((pres, index) => (
                  
                              <tr key={index}>
                                <td>
                                  <Link
                                    to="#"
                                    className="text-blue-600"
                                  >
                                       #{appointment_prefix}{pres.token_no}
                                  </Link>
                                </td>
                                <td>
                                  <h2 className="table-avatar">
                                  <Link
                                      to="#"
                                      className="avatar avatar-sm me-2"
                                    >
                                     <img
  className="avatar-img rounded-3"
  src={
    pres.tech_profile_image
      ? `${image_api}${pres.tech_profile_image}`
      : dummyDoc
  }
  alt="User Image"
/>
                                
                                    </Link>
                                    <Link to="#">
                                    {pres.tech_name}
                                    </Link>
                                  </h2>
                                </td>
                                <td>Visit</td>
                                <td>{formatDate(pres.appointment_day)}</td>
                                <td>
                                  <div className="action-item">
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#view_prescription"
                                      onClick={() => handlePrescriptionClick(pres.appointment_id)}
                                    >
                                      <i className="fa-solid fa-link" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">No appointments found</td>
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
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            >
              <i className="fa-solid fa-chevron-left" />
            </Link>
          </li>
          {Array.from({ length: totalPagespres }, (_, index) => (
            <li key={index + 1}>
              <Link
                to="#"
                className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="#"
              className="page-link"
              onClick={() => setCurrentPage(currentPage < totalPagespres ? currentPage + 1 : totalPagespres)}
            >
              <i className="fa-solid fa-chevron-right" />
            </Link>
          </li>
        </ul>
      </div>
                    
                      {/* /Pagination */}
                    </div>
                    {/* /Prescription Tab */}
                    {/* Medical Records Tab */}
                    {/* /Medical Records Tab */}
                    {/* Billing Tab */}
                    <div className="tab-pane" id="billing">
                      <div className="search-header">
                        <div className="search-field">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTermInv}
                            onChange={(e) => setSearchTermInv(e.target.value)}
                          />
                          <span className="search-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </span>
                        </div>
                        {/* <div>
                          <Link
                            to="#"
                            className="btn btn-primary prime-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#add_billing"
                          >
                            Add New Billing
                          </Link>
                        </div> */}
                      </div>
                      <div className="custom-table">
                        <div className="table-responsive">
                          <table className="table table-center mb-0">
                            <thead>
                              <tr>
                                <th>Billing Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                            {currentItemsinv.length > 0 ? (
                  currentItemsinv.map((inv, index) => (
                              <tr key={index}>
                                <td>{formatDate(inv.appointment_day)}</td>
                                <td>${inv.final_amount}</td>
                                <td> 
                                  {
                                    inv.paid_status == 1 ?
                                    <span className="badge badge-green status-badge">
                                    Paid
                                  </span> :  inv.paid_status == 0 ?
                                    <span className="badge badge-danger status-badge">
                                    Not Paid
                                  </span> :
                                  <span className="badge badge-danger status-badge">
                                  Unknown
                                </span>
                                  }
                                  
                                </td>
                                <td>
                                  <div className="action-item">
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#view_bill"
                                      onClick={() => handleinvoicebillingdetailsClick(inv)}
                                    >
                                      <i className="fa-solid fa-link" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                               ))
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">No billings found</td>
                                </tr>
                              )}
                              {/* <tr>
                                <td>28 Mar 2024</td>
                                <td>$350</td>
                                <td>
                                  <span className="badge badge-green status-badge">
                                    Paid
                                  </span>
                                </td>
                                <td>
                                  <div className="action-item">
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#view_bill"
                                    >
                                      <i className="fa-solid fa-link" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>10 Apr 2024</td>
                                <td>$400</td>
                                <td>
                                  <span className="badge badge-green status-badge">
                                    Paid
                                  </span>
                                </td>
                                <td>
                                  <div className="action-item">
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#view_bill"
                                    >
                                      <i className="fa-solid fa-link" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>19 Apr 2024</td>
                                <td>$250</td>
                                <td>
                                  <span className="badge badge-green status-badge">
                                    Paid
                                  </span>
                                </td>
                                <td>
                                  <div className="action-item">
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#view_bill"
                                    >
                                      <i className="fa-solid fa-link" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>22 Apr 2024</td>
                                <td>$320</td>
                                <td>
                                  <span className="badge badge-green status-badge">
                                    Paid
                                  </span>
                                </td>
                                <td>
                                  <div className="action-item">
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#view_bill"
                                    >
                                      <i className="fa-solid fa-link" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>02 May 2024</td>
                                <td>$480</td>
                                <td>
                                  <span className="badge badge-danger status-badge">
                                    Unpaid
                                  </span>
                                </td>
                                <td>
                                  <div className="action-item">
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#view_bill"
                                    >
                                      <i className="fa-solid fa-link" />
                                    </Link>
                                  </div>
                                </td>
                              </tr> */}
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
              onClick={() => setCurrentPageInv(currentPageInv > 1 ? currentPageInv - 1 : 1)}
            >
              <i className="fa-solid fa-chevron-left" />
            </Link>
          </li>
          {Array.from({ length: totalPagesinv }, (_, index) => (
            <li key={index + 1}>
              <Link
                to="#"
                className={`page-link ${currentPageInv === index + 1 ? "active" : ""}`}
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
              onClick={() => setCurrentPageInv(currentPageInv < totalPagesinv ? currentPageInv + 1 : totalPagesinv)}
            >
              <i className="fa-solid fa-chevron-right" />
            </Link>
          </li>
        </ul>
      </div>
                      {/* /Pagination */}
                    </div>
                    <div className="tab-pane" id="medicalrecords">
                      <div className="search-header">
                        <div className="search-field">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTermInv}
                            onChange={(e) => setSearchTermInv(e.target.value)}
                          />
                          <span className="search-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </span>
                      
                        </div>
                        {
                          settings?.created_by_tech == 1 && (
                            <div>
                            <Link
      to="#"
      className="btn btn-primary prime-btn"
      onClick={handleAddNew} // Reset form when opening modal
      data-bs-toggle="modal"
      data-bs-target="#medical_records"
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
  {currentRecords.length > 0 ? (
    currentRecords.map((record, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{record.patient_name ?? "N/A"}</td>
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
<label
  htmlFor={`switch-${record.id}`}
  className="checktoggle checkbox-bg"
></label>
  </div>
</td> */}
        
        <td>
          <div className="action-item">
            {
              settings?.updated_by_tech == 1 && (
                <Link to="#" data-bs-toggle="modal" data-bs-target="#medical_records" >
                <i className="fa-solid fa-pen-to-square"  onClick={() => handleEdit(record)} />
              </Link>
              )
            }

           {
              settings?.delete_by_tech == 1 && (
<a href="#" onClick={(e) => {
  console.log('Trash icon clicked'); // Add this
  e.preventDefault(); 
  handleShowModal(record.id);
}}>
  <i className="fa-solid fa-trash-can" />
</a>
              )
            }

            {
              settings?.updated_by_tech == 0 && settings?.delete_by_tech == 0 && "No Access"
            }
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
        </td>
      </tr>

    ))
  ) : (
    <tr>
      <td colSpan="20" className="text-center">No records found</td>
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

                    {/* Billing Tab */}
                  </div>
                </div>
              </div>
              {/* /Patient Details */}
            </div>
          </div>
        </div>
        {/* /Page Content */}
        <DoctorFooter />
      </div>
      {/*View Prescription */}
      <div
        className="modal fade custom-modals"
        id="view_prescription"
        tabIndex="-1"
        aria-labelledby="view_prescriptionLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
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
            <div className="modal-body pb-0">
              <div className="prescribe-download">
              <h5>{selectedAppointment ? selectedAppointment.appointment_day : ""}</h5>
                <ul>
                  <li>
                    <a href="#" className="print-link">
                      <i className="fa-solid fa-print" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="btn btn-primary prime-btn" onClick={handleDownloadPDFPrescription}>
                      Download
                    </a>
                  </li>
                </ul>
              </div>
              <div className="view-prescribe invoice-content prescription">
                <div className="invoice-item">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="invoice-logo">
                        <img src={hospital_profile &&
                                          /\.(jpeg|jpg|png|webp)$/i.test(hospital_profile) ? `${image_api}${hospital_profile}` :logo} alt="logo" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p className="invoice-details">
                      <strong>Prescription ID :</strong> {selectedAppointment ? `#${prescription_prefix}${selectedAppointment.appointment_id}` : ""}  
                      <br />
                        <strong>Issued:</strong> {selectedAppointment ? selectedAppointment.appointment_day : ""}
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
                        {selectedAppointment ? selectedAppointment.tech_name : "Dr. "}<br />
                        {selectedAppointment ? selectedAppointment.tech_email : ""}<br />
                        {selectedAppointment ? selectedAppointment.tech_primary_mobile : ""}<br />
                         
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="invoice-info invoice-info2">
                        <h6 className="customer-text">Patient Details</h6>
                        <p className="invoice-details">
                        {selectedAppointment ? selectedAppointment.patient_name : "Patient Name"}
                           <br />
                           {selectedAppointment ? selectedAppointment.patient_address : "Patient address"}
                          <br />
                          {selectedAppointment ? selectedAppointment.patient_mobile_no : "Patient mobile no"}

                          
                          <br />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Item */}
                <div className="invoice-item invoice-table-wrap">
                  <div className="row">
                    <div className="col-md-12">
                      <h6>Prescription Details</h6>
                      <div className="table-responsive">
                        <table className="invoice-table table table-bordered">
                          <thead>
                            <tr>
                              <th>Medicine Name</th>
                              <th>Dosage</th>
                              <th>Frequency</th>
                              <th>Duration</th>
                              <th>Timings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPrescription && selectedPrescription.length > 0 ? (
                              selectedPrescription.map((prescription, index) => (
                                <tr key={index}>
                                         <td>{prescription.subcat_name?prescription.subcat_name:'tablet test'}</td>
                                         <td>{prescription.qty}</td>

                                         <td>{prescription.is_before_food}-{prescription.is_morning}-{prescription.is_noon}-{prescription.is_evening}</td>
                                  <td>{prescription.cycle} Months</td>
                                  <td>{prescription.is_before_food}</td>
                           
                            </tr>
                               ))
                              ) : (
                                <tr>
                                  <td colSpan="5">No prescription available.</td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Information */}
                <div className="other-info">
                  <h4>Other information</h4>
                  <p className="text-muted mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus sed dictum ligula, cursus blandit risus. Maecenas
                    eget metus non tellus dignissim aliquam ut a ex. Maecenas
                    sed vehicula dui, ac suscipit lacus. Sed finibus leo vitae
                    lorem interdum, eu scelerisque tellus fermentum. Curabitur
                    sit amet lacinia lorem. Nullam finibus pellentesque libero.
                  </p>
                </div>
                <div className="other-info">
                  <h4>Follow Up</h4>
                  <p className="text-muted mb-0">
                    Follow u p after 3 months, Have to come on empty stomach
                  </p>
                </div>
                <div className="prescriber-info">
                <h6>{selectedAppointment ? selectedAppointment.tech_name : "Dr. John Doe"}</h6>                  
                <p>Dept of Cardiology</p>
                </div>
                {/* /Invoice Information */}
              </div>
            </div>
          </div>
        </div>
      </div>


      
      {/* /View Prescription */}
      {/*View Prescription */}
      <div className="modal fade custom-modals" id="view_bill">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header justify-content-end">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body pb-0">
              <div className="prescribe-download">
                <h5>View Billing</h5>
                <ul>
                  <li>
                    <a href="#" className="print-link">
                      <i className="fa-solid fa-print" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="btn btn-primary prime-btn" onClick={handleDownloadPDF}>
                      Download
                    </a>
                  </li>
                </ul>
              </div>
              <div className="view-prescribe invoice-content invoice-billing">
                <div className="invoice-item">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="invoice-logo">
                        <img src={hospital_profile &&
                                          /\.(jpeg|jpg|png|webp)$/i.test(hospital_profile) ? `${image_api}${hospital_profile}` :logo} alt="logo" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p className="invoice-details">
                        <strong>Invoice No : </strong> {invoiced_prefix}{selectedinvoicebilling?.invoice_token||"N/A"}
                        <br />
                        <strong>Issued:</strong> {formatDate(selectedinvoicebilling?.appointment_day || "")}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Invoice Item */}
                <div className="invoice-item">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="invoice-info">
                        <h6 className="customer-text">Billing From</h6>
                        <p className="invoice-details invoice-details-two">
                        {selectedinvoicebilling?.tech_details?.name || "Unknown Technician"} <br />
                        {selectedinvoicebilling?.hospital_details?.name || "N/A"},<br />
                        {selectedinvoicebilling?.hospital_details?.address || "N/A"},<br />
                        {selectedinvoicebilling?.hospital_details?.state || "N/A"},{" "}
                        {selectedinvoicebilling?.hospital_details?.country || "N/A"}
                       
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="invoice-info">
                        <h6 className="customer-text">Billing To</h6>
                        <p className="invoice-details invoice-details-two">
                        {selectedinvoicebilling?.patient_details?.name || "N/A"} <br />
                        {selectedinvoicebilling?.patient_details?.full_address || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="invoice-info invoice-info2">
                        <h6 className="customer-text">Payment Method</h6>
                        <p className="invoice-details">
                        {selectedinvoicebilling?.pay_modes || "N/A"} <br />
      
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Item */}
                <div className="invoice-item invoice-table-wrap">
                  <div className="row">
                    <div className="col-md-12">
                      <h6>Invoice Details</h6>
                      <div className="table-responsive">
                        <table className="invoice-table table table-bordered">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Quatity</th>
                              <th>VAT</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                          {selectedinvoicebilling?.details?.length > 0 ? (
                selectedinvoicebilling?.details?.map((detail, index) => (
                            <tr key={index}>
                              <td>{detail?.service_name || "N/A"}</td>
                              <td>{detail?.quantity || 0}</td>
                              <td>${detail?.unit_price || 0}</td>
                              <td>${detail?.total_amount || 0}</td>
                            </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4">No Invoice billing details available.</td>
                            </tr>
                          )}
                            {/* <tr>
                              <td>Video Call</td>
                              <td>1</td>
                              <td>$0</td>
                              <td>$100</td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-md-6 col-xl-4 ms-auto">
                      <div className="table-responsive">
                        <table className="invoice-table-two table">
                          <tbody>
                            <tr>
                              <th>Subtotal:</th>
                              <td>
                                <span>${selectedinvoicebilling?.sub_total || 0}</span>
                              </td>
                            </tr>
                            <tr>
                              <th>Discount:</th>
                              <td>
                                <span>{selectedinvoicebilling?.any_discount || 0}%</span>
                              </td>
                            </tr>
                            <tr>
                              <th>Total Amount:</th>
                              <td>
                                <span>${selectedinvoicebilling?.final_amount || 0}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Information */}
                <div className="other-info mb-0">
                  <h4>Other information</h4>
                  <p className="text-muted mb-0">
                  {selectedinvoicebilling?.clinical_notes || "No clinical notes available."}
                  </p>
                </div>
                {/* /Invoice Information */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /View Prescription */}
      {/* Add Medical Records Modal */}
      {/* <div className="modal fade custom-modals" id="add_medical_records">
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
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Title</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Select Patient</label>
                      <Select
                        className="select"
                        options={options}
                        placeholder="Select Patient"
                        isClearable={true}
                        isSearchable={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Hospital Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Symptoms <span className="text-danger">*</span>
                      </label>
                      <div className="input-block input-block-new mb-0">
                        <input
                          className="input-tags form-control"
                          id="inputBox3"
                          type="text"
                          data-role="tagsinput"
                          placeholder="Type New"
                          name="Label"
                          defaultValue="Fever, Headache"
                        />
                        <a href="#" className="input-text save-btn">
                          Save
                        </a>
                      </div>
                    </div>
                    <div className="form-wrap mb-0">
                      <label className="col-form-label">Report</label>
                      <div className="upload-file">
                        <input type="file" />
                        <p>Drop files or Click to upload</p>
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
                  >
                    Cancel
                  </a>
                  <button type="submit" className="btn btn-primary prime-btn">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}
      {/* /Add Medical Records Modal */}
      {/* Add Medical Records Modal */}
      {/* <div className="modal fade custom-modals" id="edit_medical_records">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Medical Record</h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Echocardiogram	"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Select Patient</label>
                      <Select
                        className="select"
                        options={options2}
                        placeholder="Select"
                        isClearable={true}
                        isSearchable={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
                        defaultValue="17/03/2024"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Hospital Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="ENT Hospital"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Symptoms <span className="text-danger">*</span>
                      </label>
                      <div className="input-block input-block-new mb-0">
                        <input
                          className="input-tags form-control"
                          id="inputBox3"
                          type="text"
                          data-role="tagsinput"
                          placeholder="Type New"
                          name="Label"
                          defaultValue="Fever, Headache"
                        />
                        <a href="#" className="input-text save-btn">
                          Save
                        </a>
                      </div>
                    </div>
                    <div className="form-wrap mb-0">
                      <label className="col-form-label">Report</label>
                      <div className="upload-file">
                        <input type="file" />
                        <p>Drop files or Click to upload</p>
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
                  >
                    Cancel
                  </a>
                  <button type="submit" className="btn btn-primary prime-btn">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}
      {/* /Add Medical Records Modal */}
      {/* Add Prescription */}
      <div className="modal fade custom-modals" id="add_prescription">
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Prescription</h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form action="patient-profile.html">
              <div className="modal-body">
                <div className="patient-wrap">
                  <div className="patient-info mt-0">
                    <img src={doctordashboardprofile01} alt="img" />
                    <div className="user-patient">
                      <h6>#P0016</h6>
                      <h5>Rajesh</h5>
                      <ul>
                        <li>299 Star Trek Drive, Florida, 32405, USA</li>
                      </ul>
                    </div>
                  </div>
                  <div className="patient-book patien-inv">
                    <h6>#INV0001</h6>
                    <p>1 November 2023</p>
                  </div>
                </div>
                <div className="add-prescripe-info">
                  <div className="row prescripe-cont">
                    <div className="col-xl-2 xol-lg-3 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Name</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-xl-2 xol-lg-3 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Type</label>
                        <Select
                        className="select"
                        options={options3}
                        placeholder="Select"
                        isClearable={true}
                        isSearchable={true}
                      />
                      </div>
                    </div>
                    <div className="col-xl-2 xol-lg-3 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Dosage</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-xl-2 xol-lg-3 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Frequency</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-xl-2 xol-lg-3 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Duration</label>
                        <Select
                        className="select"
                        options={options4}
                        placeholder="Select"
                        isClearable={true}
                        isSearchable={true}
                      />
                      </div>
                    </div>
                    <div className="col-xl-2 xol-lg-3 col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="form-wrap w-100">
                          <label className="col-form-label">Instruction</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="form-wrap ms-2">
                          <label className="col-form-label d-block">
                            &nbsp;
                          </label>
                          <a href="#" className="trash">
                            <i className="fa-solid fa-trash-can" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <a href="#" className="add-prescribe">
                    Add More
                  </a>
                </div>
                <div className="wrap-sign">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="sign-wrapper">
                        <div className="upload-sign">
                          <p>Click here to sign</p>
                        </div>
                        <div className="info-name">
                          <h6>( Dr. Darren Elder )</h6>
                          <p>Signature</p>
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
                  >
                    Cancel
                  </a>
                  <button type="submit" className="btn btn-primary prime-btn">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Prescription */}
      {/* Add Billing */}
      <div className="modal fade custom-modals" id="add_billing">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Billing</h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form action="#">
              <div className="modal-body">
                <div className="patient-wrap">
                  <div className="patient-info">
                    <img src={doctordashboardprofile01} alt="img" />
                    <div className="user-patient">
                      <h6>#P0016</h6>
                      <h5>Rajesh</h5>
                      <ul>
                        <li>Age : 42</li>
                        <li>Male</li>
                        <li>AB+ve</li>
                      </ul>
                    </div>
                  </div>
                  <div className="patient-book patien-inv">
                    <h6>#INV0001</h6>
                    <p>1 November 2023</p>
                  </div>
                </div>
                <div className="add-billing-info">
                  <div className="row bill-cont">
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="form-wrap w-100">
                          <label className="col-form-label">Amount</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="form-wrap ms-2">
                          <label className="col-form-label d-block">
                            &nbsp;
                          </label>
                          <a href="#" className="trash">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <a href="#" className="add-bill">
                    Add More
                  </a>
                </div>
                <div className="wrap-sign">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="sign-wrapper">
                        <div className="upload-sign">
                          <p>Click here to sign</p>
                        </div>
                        <div className="info-name">
                          <h6>( Dr. Darren Elder )</h6>
                          <p>Signature</p>
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
                  >
                    Cancel
                  </a>
                  <button type="submit" className="btn btn-primary prime-btn">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>


      {/* medical records add new */}
      <div className="modal fade custom-modals" id="medical_records">
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Medical Records</h3>
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
            <label className="col-form-label">Select Patient</label>
            <select
  className="form-control"
  value={selectedPatientsId || ""}
  onChange={(e) => setSelectedPatientsId(e.target.value)}
>
  <option value="">Select Patient</option>
  {patientList.map((patient) => (
    <option key={patient.id} value={patient.id}>
      {patient.name}
    </option>
  ))}
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
      setSelectedDate(date); // Only set if valid
    } else {
      setSelectedDate(null); // Fallback to null if invalid
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


      {/* /Add Billing */}
    </>
  );
};

export default PatientProfile;
