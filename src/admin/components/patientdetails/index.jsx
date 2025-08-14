import React, { useState, useEffect, useRef } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, Radio, Upload, message, Checkbox, Row, Col, Switch, notification, Space } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import moment from "moment"; // For handling date format
import { useLocation } from "react-router-dom";
import { UploadOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom"; 
import dayjs from "dayjs";
import { image_api, var_api } from "../../../constant";
import * as XLSX from "xlsx";
import { bd } from "../imagepath";
import pat_dummy from "../../assets/img/patients/pat_dummy.png";
import { EyeOutlined } from '@ant-design/icons';
import "../styles/Loader.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
import Select from "react-select";

const Patientdetails = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [form] = Form.useForm();
  // const [activeTab, setActiveTab] = useState("EditPatient");
  const location = useLocation();
  const { customerMobile } = location.state || {};
  const history = useHistory();
  const [seatImage, setseatImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isOpenAptHistory, setIsOpenAptHistory] = useState(false);
  const [isOpenPatientServiceHistory, setIsOpenPatientServiceHistory] = useState(false);
  const [isOpenpatientdetails,setisOpenpatientdetails] = useState(false);
  const [PatientServicedetails,setPatientServicedetails] = useState([]);
  const appointmentPrefix = localStorage.getItem("admin_appointment_prefix");
  const [patientAptHistory, setPatientAptHistory] = useState([]);
  const [patientdetails, setpatientdetails] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const[selectedPatient, setselectedPatient]= useState(null);
 const [selectedDate, setSelectedDate] = useState('');
 const [age, setAge] = useState(null);
   const [isModalInsta, setIsModalInsta] = useState(false);
   const [isModalpop, setIsModalpop] = useState(false);
  const [switchStates, setSwitchStates] = useState({
    asthma: false,
    diabetes: false,
    drug_allergy: false,
    pregnancy: false,
    bp: false,
    cardiac: false,
  });
  const [isModal, setIsModal] = useState(false);
  const [patient, setPatientId] = useState('');
  const adminpatientp = localStorage.getItem("admin_patient_prefix");
  const [initialValues, setInitialValues] = useState({});
  const [isOthers, setIsOthers] = useState(false);
  const [otherReferalName, setOtherReferalName] = useState("");
  const [otherReferalMobile, setOtherReferalMobile] = useState("");
  const [referalPersonId, setReferalPersonId] = useState(null);
  const [referalPersons, setReferalPersons] = useState([]);
  console.log ("hariiiiii",localStorage.getItem ("admin_patient_prefix"));
  const options = [
    { value: 7, label: "All" },
    { value: 0, label: "upcoming" },
    { value: 1, label: "Reached Hospital" },
    { value: 2, label: "Inprogress" },
    { value: 3, label: "Completed" },
    { value: 4, label: "Cancel by Hospital" },
    { value: 5, label: "Cancel by Patient" },
    { value: 6, label: "Revisit For Report" },
  ];



  const[patientname, setPatientname]=useState(null);
  const[patientid, setPatientid]=useState(null);
  const [installDetails, setInstallDetails] = useState(null);
  const hospital_private = localStorage.getItem('is_private');

  const handleModalOpenDOB = () => setIsModalOpen(true);
  const handleModalCloseDOB = () => setIsModalOpen(false);

  const handleMonthChange = (value) => setSelectedMonth(value);

  const [showCsvUpload, setShowCsvUpload] = React.useState(false);
  const [isEndSessionModalVisible, setIsEndSessionModalVisible] = useState(false);
  const [csvFile, setCsvFile] = React.useState(null);

  const totalAppointments = patientAptHistory ? patientAptHistory.length : 0;

const totalAmount = patientAptHistory
  ? patientAptHistory.reduce((sum, record) => sum + (parseFloat(record.bill_amount) || 0), 0)
  : 0;

  const finalAmount = PatientServicedetails.reduce(
    (sum, record) => sum + (record.final_amount || 0),
    0
  );
  
  const uniqueServiceTypes = new Set(
    PatientServicedetails.map((record) => record.master_service_name)
  ).size;

  const datatech = {
    techstaff: false,
    availabletime: false,
    patient: false,
    servicetype: false,
    uom: false,
    category: false,
    brand: false,
    medicine: false,
    paymodemaster: false,
    makeappointment: false,
    endsession: false,
    payment: false,
  };



    const [activeTab, setActiveTab] = useState("op");
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    // Helper function to create empty service row
    const createEmptyServiceRow = (serviceType) => ({
      id: Date.now(),
      service_name: null,
      service_type_id: null,
      service_type: serviceType,
      price: 0,
      qty: 1,
      final_price: 0,
      remarks: '',
      is_lab: 0
    });
    const [serviceGroups, setServiceGroups] = useState({
      OP: [createEmptyServiceRow(0)],
      Scan: [createEmptyServiceRow(1)],
      Investigation: [createEmptyServiceRow(2)],
      Review: [createEmptyServiceRow(3)],
      laser: [createEmptyServiceRow(4)]
    });
    const [tabRows, setTabRows] = useState({
      op: [createEmptyServiceRow(0)],
      scan: [createEmptyServiceRow(1)],
      investigation: [createEmptyServiceRow(2)],
      review: [createEmptyServiceRow(3)],
      laser: [createEmptyServiceRow(4)]
    });
    
    const [tabDiscounts, setTabDiscounts] = useState({
      op: 0,
      scan: 0,
      investigation: 0,
      review: 0,
      laser: 0
    });
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [isEnable, setIsEnable] = useState(false);
    const [subTotal, setSubTotal] = useState(0);
    const [aptDiscount, setAptDiscount] = useState(0);
    const [consultationFee, setConsultationFee] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finallAmount, setFinallAmount] = useState(0);
    const [editing, setEditing] = useState(false);
    const [discountValue, setDiscountValue] = useState(0);
    const [aptGrandTotal, setAptGrandTotal] = useState(0);
    
    //for calculate the overall count
  const calculateOverallGrandTotal = () => {
  const tabs = ['op', 'scan', 'investigation', 'review'];
  return tabs.reduce((total, tab) => {
    const { grandTotal } = calculateTabTotals(tab); // your existing function
    return total + grandTotal;
  }, 0);
};

const handleAddNewRow = () => {
  const newRow = {
    id: Date.now(), // Unique ID
    service_name: null,
    service_type_id: null,
    service_type: getServiceTypeForTab(activeTab),
    price: 0,
    qty: 1,
    final_price: 0,
    remarks: '',
    is_lab: 0
  };
  
  setTabRows(prev => ({
    ...prev,
    [activeTab]: [newRow, ...(prev[activeTab] || [])] // Prepend new row
  }));
};
const hospital_id = localStorage.getItem("hospital_id");

// Handle delete row for current tab
const handleDeleteRow = (rowId) => {
  const currentRows = getCurrentRows();
  if (currentRows.length <= 1) {
    notification.warning({
      message: "Cannot delete",
      description: "At least one service must remain"
    });
    return;
  }

  setTabRows(prev => ({
    ...prev,
    [activeTab]: (prev[activeTab] || []).filter(row => row.id !== rowId)
  }));
};

 const handleSubmitNewInvoiceDetail = async () => {
    setLoading(true);
    // Get the last index of rows
    const lastRow = rows[rows.length - 1];

    // Check if service_type_id is null
    if (lastRow.service_type_id === null) {
      notification.warning({ message: "Please Select service name" });
      setLoading(false);
      return;
    }

    const detail = {
      hospital_id: selectedAppointment.hospital_id,
      tech_id: selectedAppointment.tech_id,
      appointment_id: selectedAppointment.id,
      patient_id: selectedAppointment.patient_id,
      service_name: lastRow.service_name,
      lab_id: lastRow.lab_id || 0,
      is_lab: lastRow.is_lab || 0,
      invoice_billing_id: existingServices.id,
      service_type_id: lastRow.service_type_id,
      service_type: lastRow.service_type,
      unit_price: lastRow.price,
      quantity: lastRow.qty,
      discount: lastRow.discount,
      remark: lastRow.remarks
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token if needed
      const response = await axios.post(
        `${var_api}invoicebillingdetail/add-invoice-billing-detail`,
        detail, // Send rows as the payload
        {
          headers: {
            Authorization: `${token}`, // Include token if required
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      setIsEnable(false);
      await handleServiceTypesHistotry(selectedAppointment?.id);
      notification.success({ message: "Invoice billing details submitted successfully!" });
    } catch (error) {
      console.error("Error submitting invoice details:", error);
      notification.error({ message: "Failed to submit invoice billing details!" });
    } finally {
      setLoading(false);
    }
  }

    const handleDeleteLastRow = () => {
    setRows((prevRows) => prevRows.slice(0, -1));
    console.log("Updated Rows:", rows);
    setIsEnable(false);
  }


  
     // Handle end session
   const handleEndSession = async () => {
    setLoading(true);
    try {
      const appointmentData = prepareAppointmentData();
      // Apply the discount to the first service type (or distribute as needed)
      // appointmentData.gosServices[0].discount = discount;
      // appointmentData.grand_discount = discount;
      appointmentData.amount = appointmentData.grand_total - discount;
  
      const payload = {
        ...appointmentData,
        private_status: 0, // Mark as private appointment 
      };
  
      // Check if both date and slot are not empty
      const hasPrivateAppointment = appointmentPrivateDate && selectedPrivateSlot;
      
      if (hasPrivateAppointment) {
        // Add private appointment details to the payload
        const formattedDate = new Date(appointmentPrivateDate)
          .toLocaleDateString('en-GB')
          .split('/')
          .join('-');
  
        payload.private_status = 1; // Mark as private appointment
        payload.private_appointment = {  // Add private appointment details
          date: formattedDate,
          slot: selectedPrivateSlot,
          remark: remarkPrivate,
          status: 0
        };
      }
  
      
      const response = await axios.put(
        `${var_api}appointment/gos-end-session/${selectedAppointment.id}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.message) {
        notification.success({
          message: 'Session Completed',
          description: response.data.message
        });
        setIsEndSessionModalVisible(false);
          const start_date = startDate ? formatDate(startDate) : formatDate(initialSettingsApt.startDate);
          const end_date = endDate ? formatDate(endDate) : formatDate(initialSettingsApt.endDate);
  
        fetchData(start_date, end_date, selectedPatientsId);
  
         // Reset form fields
        setAppointmentPrivateDate('');
        setSelectedPrivateSlot('');
        setRemarkPrivate('');
      }
    } catch (error) {
      console.error('Error ending session:', error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.error || 'Failed to end session'
      });
    } finally {
      setLoading(false);
    }
  };
  
    useEffect(() => {
      const sub = parseFloat(subTotal) || 0;
      const dis = parseFloat(aptDiscount) || 0;
      const total = sub - dis;
      setAptGrandTotal(total >= 0 ? total : 0);
    }, [subTotal, aptDiscount]);
  
  
    useEffect(() => {
    const fee = parseFloat(consultationFee) || 0;
    const disc = parseFloat(discount) || 0;
    const total = fee - disc;
    setFinallAmount(total >= 0 ? total : 0);
  }, [consultationFee, discount]);
  
  useEffect(() => {
    setFinallAmount(consultationFee - discount);
  }, [consultationFee, discount]);
  
   // Fetch service groups when hospitalId changes
    useEffect(() => {
      
      const fetchServiceGroups = async () => {
        try {
          const response = await axios.get(`${var_api}gos-service-master/gos-getby-hospital/${hospital_id}`, {
            headers: {
              Authorization: `${localStorage.getItem('token')}`
            }
          });
          setServiceGroups(response.data);
        } catch (error) {
          console.error('Error fetching service groups:', error);
          notification.error({ message: 'Failed to load services' });
        }
      };
  
      if (hospital_id) {
        fetchServiceGroups();
      }
    }, [hospital_id]);


  // Get current tab's rows - returns an array
const getCurrentRows = () => {
  return tabRows[activeTab] || [];
};

  // Get services for current tab
  const getCurrentTabServices = () => {
    switch (activeTab) {
      case 'op':
        return serviceGroups.OP;
      case 'scan':
        return serviceGroups.Scan;
      case 'investigation':
        return serviceGroups.Investigation;
      case 'review':
        return serviceGroups.Review;
      default:
        return [];
    }
  };


 // Render service dropdown
 const renderServiceDropdown = (row) => {
  const services = getCurrentTabServices();
  const currentRows = getCurrentRows();

   // Get IDs of already selected services (excluding the current row)
  const selectedServiceIds = currentRows
    .filter(r => r.id !== row.id) // exclude current row
    .map(r => r.service_type_id)
    .filter(Boolean); // remove undefined/null

  // const options = services?.map(service => ({
  //   value: service.id,
  //   label: `${service.service_name} (₹${service.price})` // Show price in dropdown label
  // }));

   const options = services
    ?.filter(service => !selectedServiceIds.includes(service.id)) // filter out already selected
    ?.map(service => ({
      value: service.id,
       label: `${service.service_name || service.name || 'Unnamed Service'} (₹${service.price})`
    }));

  // If current selection is now invalid (duplicate), show a message
  const currentSelectionInvalid = selectedServiceIds.includes(row.service_type_id);

  return (
     <div>
    <Select
      placeholder="Select Service"
      options={options}
      value={options?.find(option => option.value === row.service_type_id)}
      onChange={(selectedOption) => handleServiceChange(row.id, selectedOption.value)}
      isDisabled={selectedAppointment?.status === 3 && !isEnable}
    />
     {currentSelectionInvalid && (
        <div className="text-danger small mt-1">
          This service is already selected in another row
        </div>
      )}
    </div>
  );
};


const handleFinalPriceChange = (rowId, newPrice) => {
  setTabRows(prev => ({
    ...prev,
    [activeTab]: (prev[activeTab] || []).map(row =>
      row.id === rowId
        ? {
            ...row,
            final_price: newPrice,
            price: newPrice / (row.qty || 1) // Update unit price if needed
          }
        : row
    )
  }));
};



const handleRemarksChange = (rowId, remarks) => {
  setTabRows(prev => ({
    ...prev,
    [activeTab]: (prev[activeTab] || []).map(row =>
      row.id === rowId
        ? {
            ...row,
            remarks: remarks
          }
        : row
    )
  }));
};

// Update calculateTabTotals to use the discount from state
const calculateTabTotals = (tab) => {
  try {
    const rows = tabRows[tab] || [];
    const subTotal = rows.reduce((sum, row) => sum + (Number(row.final_price) || 0) * (Number(row.qty) || 0), 0);
    const discount = Number(tabDiscounts[tab]) || 0;
    const grandTotal = subTotal - discount;
    
    return { 
      subTotal: Math.max(0, subTotal),
      discount: Math.max(0, discount),
      grandTotal: Math.max(0, grandTotal)
    };
  } catch (error) {
    console.error(`Error calculating totals for ${tab}:`, error);
    return { subTotal: 0, discount: 0, grandTotal: 0 };
  }
};


  const getServiceTypeForTab = (tab) => {
  switch(tab) {
    case 'op': return 0;
    case 'scan': return 1;
    case 'investigation': return 2;
    case 'review': return 3;
    default: return 4; // Others
  }
};

const handleTabDiscountChange = (tab, value) => {
  const numValue = Math.max(0, Number(value) || 0);
  setTabDiscounts(prev => ({
    ...prev,
    [tab]: numValue
  }));
};


const handleFileDrop = (files) => {
  if (files.length > 0) {
    processFiles(Array.from(files));
  }
};

 const handleFileSelect = (files) => {
  if (files.length > 0) {
    processFiles(Array.from(files));
  }
};

const processFiles = async (files) => {
  setSelectedFiles(files);
  await handleFileUpload(files);
};

const handleFileUpload = async (files) => {
  setLoading(true);
  const formData = new FormData();
  formData.append('appointment_id', selectedAppointment.id);
  formData.append('hospital_id', hospital_id);
  formData.append('folder', s3Config.folderPath);
  console.log("selectedAppointmentId",selectedAppointment)

  for (let file of files) {
    formData.append('cash_sheet', file);
  }

  try {
    const response = await axios.post(`${var_api}cash_sheet/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      },
  
    });


 setUploadProgress(0);
  await fetchUploadedFiles();
   

  } catch (error) {
    console.error("Upload failed", error);
    alert("Upload failed. Please try again.");
    setUploadProgress(0);
  } finally{
     setLoading(false);
  }
};


const handlePreview = (fileUrl) => {
  const imageFiles = uploadedFiles.filter(f => 
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(f.extension.toLowerCase())
  );
  
  const clickedIndex = imageFiles.findIndex(f => f.url === fileUrl);
  
  setPreviewFiles([]); // Reset first
  
  setTimeout(() => {
    setPreviewFiles(imageFiles);
    setCurrentPreviewIndex(clickedIndex >= 0 ? clickedIndex : 0);
    setPreviewModalVisible(true);
  }, 50);
};

useEffect(() => {
  const handleKeyDown = (e) => {
    if (!previewModalVisible) return;
    if (e.key === 'ArrowLeft' && currentPreviewIndex > 0) {
      carouselRef.current.prev();
    } else if (e.key === 'ArrowRight' && currentPreviewIndex < previewFiles.length - 1) {
      carouselRef.current.next();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [previewModalVisible, currentPreviewIndex, previewFiles.length]);
const carouselRef = useRef();

const handleCsvFileChange = (e) => {
  const file = e.target.files[0];
  setCsvFile(file);
};

// const handleReferalChange = (selectedOption) => {
//   setReferalPersonId(selectedOption ? selectedOption.value : null);
// };
const handleReferalChange = (selectedOption) => {
  console.log("📌 Referral selected:", selectedOption);
  setReferalPersonId(selectedOption ? selectedOption.value : null);
};


const handleServiceChange = (rowId, serviceId) => {
    const currentRows = getCurrentRows();
  
  // Check if this service is already selected in another row
  const isDuplicate = currentRows.some(
    row => row.id !== rowId && row.service_type_id === serviceId
  );

  if (isDuplicate) {
    notification.warning({
      message: 'Duplicate Service',
      description: 'This service is already selected in another row',
    });
    return;
  }

  const services = getCurrentTabServices();
  const selectedService = services.find(s => s.id === serviceId);
  
  if (selectedService) {
    setTabRows(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(row =>
        row.id === rowId
          ? {
              ...row,
              service_type_id: serviceId,
              service_name: selectedService.service_name,
              price: selectedService.price, // Auto-fill the price
              qty: 1, // Reset quantity to 1 when service changes
              final_price: selectedService.price * 1, // Calculate with quantity 1
              is_lab: selectedService.is_lab || 0 // Update lab status if needed
            }
          : row
      )
  }));
  }
};


const fetchMedicineData = async (id) => {
  const token = localStorage.getItem("token");
  setLoading(true);
  try {
    const response = await fetch(`${var_api}patientmedicalhistory/get-by-patient/${id}`, {
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

    setPatientId(result.patient_id);
    // Map response to the form values
    // const formValues = {
    //   asthma: Boolean(result.asthma),
    //   diabetes: Boolean(result.diabetes),
    //   drug_allergy: Boolean(result.drug_allergy),
    //   pregnancy: Boolean(result.pregnancy),
    //   bp: Boolean(result.bp),
    //   cardiac: Boolean(result.cardiac),
    //   others: result.others || "",
    //   cheif_complaints: result.cheif_complaints || "",
    // };
    const formValues = {
      asthma: Boolean(result.asthma),
      diabetes: Boolean(result.diabetes),
      drug_allergy: Boolean(result.drug_allergy),
      pregnancy: Boolean(result.pregnancy),
      bp: Boolean(result.bp),
      cardiac: Boolean(result.cardiac),
      others: result.others || "-",
      cheif_complaints: result.cheif_complaints || "-",
    };
    console.log("val", formValues);
    setInitialValues(formValues);
    setSwitchStates({
      asthma: formValues.asthma,
      diabetes: formValues.diabetes,
      drug_allergy: formValues.drug_allergy,
      pregnancy: formValues.pregnancy,
      bp: formValues.bp,
      cardiac: formValues.cardiac,
    }); // Sync switchStates
    form.setFieldsValue(formValues); // Populate the form with fetched data
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

const deleteFile = async (file) => {
  try {
    await axios.delete(`${var_api}cash_sheet/delete/${file.id}`);
    setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
  } catch (err) {
    console.error("Delete failed", err);
    alert("Failed to delete file.");
  }
};

const handlePrint = (url) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Image</title>
        <style>
          body { text-align: center; margin: 0; }
          img { max-width: 100%; max-height: 100vh; }
        </style>
      </head>
      <body>
        <img src="${url}" onload="window.print(); window.close();" />
      </body>
    </html>
  `);
  printWindow.document.close();
};


const handleDobChange = (date, dateString) => {
  console.log('DOB changed:', dateString);
  // Example: set form field value manually if needed
  form.setFieldsValue({ dob: date });
};


 const updateTechstaffStatus = async () => {
  const token = localStorage.getItem("token");
  const hospital_id = localStorage.getItem("hospital_id");

  try {
    const response = await fetch(`${var_api}installation/update-hospital/${hospital_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        techstaff: installDetails?.techstaff ?? false,
        availabletime: installDetails?.availabletime ?? false,
        patient: 1,
        servicetype: installDetails?.servicetype ?? false,
        uom: installDetails?.uom ?? false,
        category: installDetails?.category ?? false,
        brand: installDetails?.brand ?? false,
        medicine: installDetails?.medicine ?? false,
        paymodemaster: installDetails?.paymodemaster ?? false,
        makeappointment: installDetails?.makeappointment ?? false,
        endsession: installDetails?.endsession ?? false,
        payment: installDetails?.payment ?? false,
        hospital_id: parseInt(hospital_id),
      }),
    });

    // Log status code and response
    console.log("Response Status:", response.status);
    const responseText = await response.text();
    console.log("Response Text:", responseText);

    if (response.ok) {
      console.log("Installation techstaff updated successfully.");
      // Only show modal if patient is not being updated to 1
      if (installDetails?.patient !== 1) {
        setIsModalpop(true);
      }
      fetchinstalldata();
    } else {
      console.error("Failed to update installation:", responseText);
    }
  } catch (err) {
    console.error("Error updating techstaff:", err);
  }
};

const handleCsvUpload = async () => {
  setLoading(true);
  if (!csvFile) {
     notification.error({ message: "Error", description: "Please select a CSV file to upload"});
    return;
  }
  const hospital_id = localStorage.getItem("hospital_id");

  const formData = new FormData();
  formData.append("file", csvFile);

  try {
    const response = await fetch(
      `${var_api}patientdetails/upload-csv/${hospital_id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      fetchData();
      const result = await response.json();
      notification.success({
        message: "Data Upload Success",
        description: result.message,
      });
      setIsModalVisible(false);
    } else {
      const errorData = await response.json();
      notification.error({
        message: "Error",
        description:`Error: ${errorData.message || "Failed to upload CSV."}`,
      });
     
    }
  } catch (error) {
    console.error("Error uploading CSV:", error);
    setLoading(false);
    notification.error({
      message: "Error",
      description:"An error occurred while uploading the CSV file. Please try again.",
    });
  } finally{
    setLoading(false);
  }
};



  const handleSubmit = async () => {
    setLoading(true);
    if (!selectedMonth) {
      message.error("Please select a month!");
      return;
    }
    console.log("selected month: ", selectedMonth);
  
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
  
    try {
      const response = await fetch(
        // `${var_api}patientdetails/get-by-dob/5/${selectedMonth}`,
        `${var_api}patientdetails/get-by-dob/${hospital_id}/${selectedMonth}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      ); // Replace with your API endpoint
  
      const data = await response.json();

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    
      const monthName = monthNames[parseInt(selectedMonth) - 1];

      if (Array.isArray(data) && data.length > 0) {
        // Define Excel columns and map the response data
        const formattedData = data.map((item) => ({
          "Patient ID": item.running_no,
          "Patient Name": item.name,
          "Date of Birth": item.dob,
          "Email ID": item.email_id,
          "Mobile Number": item.mobile_no,
          "Gender": item.gender,
          "Blood Group": item.blood_group,
          "Address": item.full_address,
        }));
  
        // Convert the formatted data to Excel
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, monthName);
  
        // Save the Excel file
        XLSX.writeFile(workbook, `DOB_${monthName}.xlsx`);
        message.success("Excel file downloaded successfully!");
      } else {
        message.error("No data available to download!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error downloading the report:", error);
      message.error("Failed to download the report!");
      setLoading(false);
    }
    finally{
      setLoading(false);
    }
  
    handleModalClose();
  };


 const fetchinstalldata = async () => {
  setLoading(true);
  const token = localStorage.getItem('token');
  const hospital_id = localStorage.getItem('hospital_id');

  try {
    const response = await fetch(`${var_api}installation/get-by-hospital/${hospital_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

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
    const firstItem = result[0];

    if (firstItem) {
      setInstallDetails(firstItem); // Save the full object
    }
    console.log("availabletime value:", firstItem?.patient);

    // ✅ Save installation_id in localStorage if it exists
    if (result?.id) {
      localStorage.setItem("installation_id", result.id);
      console.log("Saved installation_id:", result.id); // ✅ confirm this
    }

    setData(result || []);
    
    // Check if patient is 0 to trigger the modal, and only trigger if patient === 0
    if (firstItem?.patient === 0) {
      console.log("Modal should show: patient is 0");
      setIsModalInsta(true);
    } else {
      console.log("Modal not triggered: patient is not 0");
      setIsModalInsta(false); // Ensure the modal is not shown if patient is not 0
    }

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




  

  // const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
    setLoading(true);
    try {
      const response = await fetch(`${var_api}patientdetails/getby-hospital/${hospital_id}`, {
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
      let result = await response.json();

        // ✅ Split name into first_name & last_name
    result = result.map((item) => {
      const [first_name = "", last_name = ""] = (item.name || "").split(" ");
      return { ...item, first_name, last_name };
    });
      setData(result || []);
      setFilteredData(result || []); // Set initial filtered data
    } catch (error) {
      console.error("aa:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReferalDetails = async () => {
    setLoading(true);
    const hospitalid = localStorage.getItem("hospital_id");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${var_api}referralmaster/get-by-hospitalid/${hospitalid}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`, // Add the 'Bearer' prefix before the token
        },
      });
  
      if (response.status === 401) {
        // Redirect or handle unauthorized access
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch patient details');
  
      const result = await response.json();
  console.log("abcr", result);
        // If the input is partial, set mobile options for dropdown
        const options = result.map((item) => ({
          label: item.mobile
            ? `${item.name} (${item.mobile})` 
            : item.name, // Include mobile number only if it's not null or empty
          value: item.id, // Use mobile number as value, fallback to name if it's empty
        })).filter(option => option.value); // Exclude items with no value
        
        setReferalPersons(options);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchinstalldata();
    fetchReferalDetails();
    fetchData();
    if (location.state?.openModal) {
      handleModalOpen();
    }
  }, [location.state]);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = data.filter((item) => {
      const safeToLower = (val) => (val ? val.toString().toLowerCase() : ''); // Safe toLower function
  
      return (
        safeToLower(item.hospital_id).includes(value) ||
        safeToLower(item.running_no).includes(value) ||
        safeToLower(item.old_running_no).includes(value) || // Added old_running_no
        safeToLower(item.first_name).includes(value) ||
         safeToLower(item.last_name).includes(value) ||
        safeToLower(item.profile_image).includes(value) ||
        safeToLower(item.mobile_no).includes(value) ||
        safeToLower(item.full_address).includes(value) ||
        safeToLower(item.dob).includes(value) ||
        safeToLower(item.gender).includes(value) ||
        safeToLower(item.blood_group).includes(value) ||
        safeToLower(item.email_id).includes(value) ||
        safeToLower(item.city).includes(value)
      );
    });
  
    setFilteredData(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };


  

  // const handleModalOpen = (record = null) => {
  //   setEditData(record); // Set record data for editing (if any)
    
  //   if (record) {
  //     const { profile_image, ...otherFields } = record;
  //     form.setFieldsValue({
  //       ...otherFields,
  //       // Do not set profile_image to avoid the error
  //     });
  //     console.log("j", otherFields);
  //     setseatImage(profile_image ? { name: profile_image } : null); // Set file name if available
  //   } else {
  //     form.resetFields();
  //     setseatImage(null);
  //   }// Clear file state
  //   setIsModalVisible(true); // Show the modal
  //   setPatientname(record?.name);// Set the selected row data
  //   setPatientid(record?.running_no);
  // };
  
  // const handleModalOpen = (record = null) => {
  //   setEditData(record); 
  
  //   if (record) {
  //     const { profile_image, is_other_referal, other_referal_name, other_referal_mobile, ...otherFields } = record;
      
  //     setIsOthers(is_other_referal === 1);  // Ensure is_others is correctly set
  
  //     form.setFieldsValue({
  //       ...otherFields,
  //       other_referal_name: other_referal_name || "",
  //       other_referal_mobile: other_referal_mobile || "",
  //     });
  
  //     setseatImage(profile_image ? { name: profile_image } : null);
  //   } else {
  //     form.resetFields();
  //     setseatImage(null);
  //   }
    
  //   setIsModalVisible(true);
  // };

  const handleModalOpen = (record = null) => {
    setEditData(record);
  
    if (record) {
      const {
        profile_image,
        name, // full name from API
        is_other_referal,
        other_referal_name,
        other_referal_mobile,
        referal_Person,
        ...otherFields
      } = record;

       // 🆕 Split full name into first & last
    let firstName = "";
    let lastName = "";
    if (name) {
      const nameParts = name.trim().split(" ");
      firstName = nameParts.shift() || "";
      lastName = nameParts.join(" ") || "";
    }
  
      const isOther = is_other_referal === 1;
      setIsOthers(isOther); // ✅ Correctly set state
  
      setOtherReferalName(isOther ? other_referal_name || "" : "");
      setOtherReferalMobile(isOther ? other_referal_mobile || "" : "");
  
      // ✅ Ensure referalPersonId is cleared if "Others" is selected
      const selectedReferral = isOther ? null : referal_Person;
      setReferalPersonId(selectedReferral);
  
      console.log("🛠 Setting referalPersonId:", selectedReferral);
  
      form.setFieldsValue({
        ...otherFields,
        first_name: firstName,
        last_name: lastName,
        is_other_referal: isOther ? 1 : 0, // ✅ Ensure correct value is set
        referal_Person: selectedReferral,
        other_referal_name: isOther ? other_referal_name || "" : undefined,
        other_referal_mobile: isOther ? other_referal_mobile || "" : undefined,
        Password: record.password
      });
  
      setseatImage(profile_image ? { name: profile_image } : null);
    } else {
      form.resetFields();
      setseatImage(null);
      setIsOthers(false);
      setReferalPersonId(null);
    }
  
    setIsModalVisible(true);
  };
  

  const handleModalClose = () => {
    setShowCsvUpload(false);
    setIsModalVisible(false); // Hide the modal
    setEditData(null);         // Clear the edit data
  };



  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileChangeSeat = (e) => {
    const file = e.target.files[0];
    setseatImage(file);
    console.log("Selected file:", file); // Now shows the actual File object
  };

const handleFormSubmit = async (values) => {
  setLoading(true);

  try {
    const hospital_id = localStorage.getItem("hospital_id");
    const token = localStorage.getItem("token");

    if (!hospital_id) {
      throw new Error("Hospital ID is not available in localStorage.");
    }

    const formData = new FormData();
    const { profile_image, first_name, last_name, ...restValues } = values;

     // 🆕 Combine first & last name
    const fullName = `${first_name || ""} ${last_name || ""}`.trim();
    formData.append("name", fullName);

    // 1. Append all non-file fields
    Object.entries(restValues).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      const finalValue = Array.isArray(value) ? value[0] : value;

      // Convert numeric fields to string
      if (["iop_od", "iop_os", "pincode"].includes(key)) {
        formData.append(key, finalValue ? finalValue.toString() : "0");
      } else {
        formData.append(key, finalValue !== undefined ? finalValue : "");
      }
    });

    // 2. Handle defaults
    if (!formData.get("dob")) formData.set("dob", "-");
    formData.append("hospital_id", hospital_id);
    formData.append("is_active", "1");
    formData.append("old_running_no", "0");
    formData.append("is_other_referal", isOthers ? "1" : "0");
    formData.append("is_private", "1");
    formData.append("running_no", editData?.running_no);

    // 3. File Handling
    console.log("seatImage:", seatImage);
    console.log("is File:", seatImage instanceof File);

    if (seatImage && seatImage instanceof File) {
      formData.append("profile_image", seatImage);
    }
    // 🛑 DO NOT append anything if seatImage is not a real File
    // Backend will fall back to req.body.profile_image if needed

    // 4. API call
    const url = editData
      ? `${var_api}patientdetails/update/${editData.id}`
      : `${var_api}patientdetails/post-gos`;

    const response = await fetch(url, {
      method: editData ? "PUT" : "POST",
      headers: {
        Authorization: token,
        // 🛑 Do not set Content-Type, let browser set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error saving data");
    }

    if (!editData) updateTechstaffStatus();

    notification.success({
      message: editData ? "Update Successful" : "Creation Successful",
      description: "Patient details saved successfully.",
    });

    form.resetFields();
    setFile(null);
    fetchData();
    handleModalClose();

  } catch (error) {
    console.error("Submission error:", error);
    notification.error({
      message: "Operation Failed",
      description: error.message.includes("Unexpected end of form")
        ? "File upload failed. Please reselect the image or try again."
        : error.message || "Error saving data",
    });
  } finally {
    setLoading(false);
  }
};


  const handleGetpatientAptistotry = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const hospital_id = localStorage.getItem('hospital_id');
  
      // Call First API
      const response = await fetch(`${var_api}appointment/get-appointment-list/by-patient/${hospital_id}/${id}`, {
        method: "GET",
        headers: { "Authorization": `${token}` }
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const data = await response.json();
  
      setPatientAptHistory(data || []);
  
    } catch (error) {
      console.error("Error fetching data:", error);
      console.log("harini",selectedAppointment);
    }
  };

 

 

  const handleDeleteConfirm = (id,name) => {
    setDeleteId(id);   
    setDeleteName(name);             // Set the ID of the patient to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };
  const handleOpenSeriveHistory = (reco) => {
    console.log("reco", reco);
    setPatientServicedetails(reco);
    setIsOpenPatientServiceHistory(true);
  };
  const handleReset = () => {
    form.resetFields();
    setFile(null); // Clear file state
    setseatImage("");
    setSelectedDate("");
  };

  const handleOpenAptHistory = (record) =>{
    console.log("harini", record);
    setIsOpenAptHistory(true);
    handleGetpatientAptistotry(record.id);
    setSelectedAppointment(record);
  };

  const handleOpenpatientdetails = (record) =>{
    console.log("guh", selectedPatient);
    console.log("harini", record);
    setisOpenpatientdetails(true);
    setselectedPatient(record); 
    console.log("jay",record);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${var_api}patientdetails/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 401) {
        history.push("/admin/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
      if (!response.ok) throw new Error("Error deleting record");

      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });

      fetchData();
      handleDeleteCancel(); // Close the delete confirmation modal
    } catch (error) {
      console.error("Error deleting record:", error);
      if (response.status === 401) {
        history.push("/admin/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    } finally{
      setLoading(false);
    }
  };

  const columns = [
    // {
    //   title: "Hospital Name",
    //   dataIndex: "hospital_id",
    //   render: (text) => (text ? text : "N/A"),
    // },
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    // {
    //   title: "Running No",
    //   dataIndex: "running_no",
    //   render: (text) => (text ? <span style={{ color: '#1d7ed8' }}>#{adminpatientp}{text}</span> : "-"),
    // },
    {
      title: "Patient Id",
      dataIndex: "running_no",
      render: (text,record) => (
        text ? (
          <span 
            style={{ color: '#1d7ed8', cursor: 'pointer' }} 
            onClick={() => handleOpenAptHistory(record)}
          >
            {/* #{adminpatientp}{text} */}
            #{text}
          </span>
        ) : "-"
      ),
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      render: (text, record) => (
        text ? (
          <span 
            style={{ color: '#1d7ed8', cursor: 'pointer' }} 
            // onClick={() => handleOpenpatientdetails(record)}
          >
            {text}
          </span>
        ) : "-"
      ),
    },

     {
      title: "Last Name",
      dataIndex: "last_name",
      render: (text, record) => (
        text ? (
          <span 
            style={{ color: '#1d7ed8', cursor: 'pointer' }} 
            // onClick={() => handleOpenpatientdetails(record)}
          >
            {text}
          </span>
        ) : "-"
      ),
    },
    // {
    //   title: "Profile Image",
    //   dataIndex: "profile_image",
    //   render: (text) => (text ? text : "N/A"),
    // },
    // {
    //   title: "Profile ",
    //   dataIndex: "profile_image",
    //   render: (text) =>
      
    //       <img
    //         src={ typeof text === 'string' && 
    //           text.trim() !== '' && 
    //           /\.(jpeg|jpg|png|webp)$/i.test(text) ? `${image_api}${text}` : pat_dummy}
    //         alt="Profile"
    //         style={{ width: "50px", height: "50px", objectFit: "cover" }}
    //       />
   
    // },
    {
      title: "Mobile No",
      dataIndex: "mobile_no",
      render: (text) => (text ? text : "-"),
    },
    // {
    //   title: "Email Id",
    //   dataIndex: "email_id",
    //   render: (text) => (text ? text : "-"),
    // },
    // {
    //   title: "Full Address",
    //   dataIndex: "full_address",
    //   render: (text) => (text ? text : "-"),
    // },
    {
      title: "Age",
      dataIndex: "age",
      render: (text) => (text ? text : "-"),
    },
    // {
    //   title: "Date of Birth",
    //   dataIndex: "dob",
    //   render: (text) => (text ? text : "-"),
    // },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (text) => (text ? text : "-"),
    },
    // {
    //   title: "Blood Group",
    //   dataIndex: "blood_group",
    //   render: (text) => (text ? text : "-"),
    // },
    // {
    //   title: "Old Patient No",
    //   dataIndex: "old_running_no",
    //   render: (text) => (
    //     text ? (
    //       <span style={{ color: '#1d7ed8' }}>
    //         #{adminpatientp}{text}
    //       </span>
    //     ) : "-"
    //   ),
    // },
    
    {
      title: "Action",
      className: "text-start",
      render: (_, record) => (
        <div className="text-start">
           {/* <a
        href="#"
        className="me-1 btn btn-sm bg-primary-light"
        // Add your modal trigger or navigation logic
        data-bs-target="#view_details_modal"
        onClick={() => handleModal(record)}
      >
        <i className="fe fe-eye"></i> View
      </a> */}
        
          <a
            href="#"
            className="me-1 btn btn-sm bg-success-light"
            // data-bs-toggle="modal"
            data-bs-target="#edit_specialities_details"
            onClick={() => handleModalOpen(record)}
          >
            <i className="fe fe-pencil"></i> Edit
          </a>
           <a
        href="#"
        className="me-1 btn btn-sm bg-info-light"
        data-bs-target="#make_appointment_modal"
        onClick={() => handleMakeAppointment(record)}
      >
        <i className="fe fe-calendar"></i> Registration
      </a>
          {/* <a
            href="#"
            className="me-1 btn btn-sm bg-danger-light"
            // data-bs-toggle="modal"
            data-bs-target="#delete_modal"
            onClick={() => handleDeleteConfirm(record.id, record.name)}
          >
            <i className="fe fe-trash"></i> Delete
          </a> */}
        </div>
      ),
    },
  ];

  const handleMakeAppointment = (record) => {
    setIsEndSessionModalVisible(true);
    setselectedPatient(record);
  }

  const columnspatientHistory = [
    {
      title: "S.No", // Serial number column
      key: "sno", // Unique key for the column
      render: (_, __, index) => index + 1, // Calculate serial number based on index
    },
    {
      title: "Appointment Id",
      dataIndex: "token_no",
      render: (text) => (
        <span style={{ color: '#1d7ed8', cursor: 'pointer' }}>
          {text ? `#${appointmentPrefix}${text}` : "N/A"}
        </span>
      ),
    },
    {
      title: "Appointment Date",
      dataIndex: "appointment_day",
      render: (text) => (
        text ? text : "N/A"
      ),
    },    
    {
      title: " Appointment Time",
      dataIndex: "slot_time",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Amount",
      dataIndex: "bill_amount",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Payment Status",
      dataIndex: "paid_status",
      render: (text) => {
        let statusText = text === 0 ? "Not Paid" : text === 1 ? "Paid" : "N/A";
        let badgeColor = text === 0 ? "#ff4d4f" : text === 1 ? "#52c41a" : "#d9d9d9"; // Colors: red, green, gray
    
        return (
          <span
            style={{
              backgroundColor: badgeColor,
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              display: "inline-block",
            }}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const statusOption = options.find((option) => option.value === status);
        let backgroundColor = '';
        let textColor = '';
    
        // Assign background and text color based on status
        switch (status) {
          case 3: // Completed
            backgroundColor = 'green';
            textColor = 'white'; // White text for green background
            break;
          case 0: // Pending
            backgroundColor = 'yellow';
            textColor = 'black'; // Black text for yellow background
            break;
          case 1: // Reached Hospital
            backgroundColor = 'blue';
            textColor = 'white'; // White text for blue background
            break;
          case 2: // Inprogress
            backgroundColor = 'orange';
            textColor = 'black'; // Black text for orange background
            break;
          case 4: // Cancel by Hospital
            backgroundColor = 'red';
            textColor = 'white'; // White text for red background
            break;
          case 5: // Cancel by Patient
            backgroundColor = 'red';
            textColor = 'white'; // White text for red background
            break;
          case 6: // Revisit For Report
            backgroundColor = 'purple';
            textColor = 'white'; // White text for purple background
            break;
          default:
            backgroundColor = 'white'; // Default background
            textColor = 'black'; // Default text color
        }
    
        return (
          <span style={{ 
            backgroundColor, 
            color: textColor, 
            padding: '5px', 
            borderRadius: '5px', 
            display: 'inline-block' 
          }}>
            {statusOption ? statusOption.label : "N/A"}
          </span>
        );
      },
    },    
    {
      title: "Detal History", // New column for vital details
      dataIndex: "dental_medical_chart_count", // Key for the new column
      render: (text, record) => (
        // <p onClick={() => handleDentalHistoryModal(record)} className="text-success text-md">{text}</p>
        <Button
          icon={<EyeOutlined />}
          type="primary"
          onClick={() => handleOpenSeriveHistory(record.invoice_billing)} // Opens modal with row data
        />
      ),
    },
  ];

  const columnspatientServiceHistory = [
    {
      title: "S.No", // Serial number column
      key: "sno", // Unique key for the column
      render: (_, __, index) => index + 1, // Calculate serial number based on index
    },
    {
      title: "Servcie Name",
      dataIndex: "master_service_name",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      render: (text) => (
        text ? text : "N/A"
      ),
    },    
    {
      title: "Qty",
      dataIndex: "quantity",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Amount",
      dataIndex: "final_amount",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "is_lab",
      dataIndex: "master_is_lab",
      render: (text) => (text === 0 ? "No" : text === 1 ? "Yes" : "N/A"),
    },
    {
      title: "Lab Name",
      dataIndex: "lab_master_details", // Remove dot notation
      render: (lab_master_details) => (lab_master_details?.lab_name ? lab_master_details.lab_name : "N/A"),
    }   
   
  ];





  const handleFormSubmitmedicine = async (values) => {
    setLoading(true);
    console.log("Form Submitted Values:", values);
    
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${var_api}patientmedicalhistory/update/${patient}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...values// Ensure patient ID is included for identification
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update data");
      }
  
      const result = await response.json();
      console.log("Update Success:", result);
  
      notification.success({
        message: "Update Successful",
        description: "The patient medical history has been updated.",
      });
  
      handleModalClose(); // Close the modal on success
    } catch (error) {
      setLoading(false);
      console.error("Error updating data:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update the patient medical history. Please try again.",
      });
    } finally{
      setLoading(false);
    }
  };


  const handleSwitchChange = (field, checked) => {
    setSwitchStates((prev) => ({ ...prev, [field]: checked })); // Update switch state
    form.setFieldsValue({ [field]: checked }); // Update form field value
    form.validateFields().then((values) => handleFormSubmitmedicine(values)); // Call the onFinish function
  };

  
   
  
  const handleModal = (record) => {
    fetchMedicineData(record.id);
    setPatientname(record.name);// Set the selected row data
    setPatientid(record.running_no);
    setIsModal(true); // Open the modal
    console.log("hiii",record)
  };



  const updateSlotStatus = (recordId, newStatus) => {
    // You can make an API call to update the status or update the local state here
    console.log(`recordId: ${recordId}, New Status: ${newStatus}`);
    const token = localStorage.getItem('token');
   
    // Example of making an API call (you would replace this with your actual API call):
    fetch(`${var_api}patientmedicalhistory/update/${recordId.id}`, {
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



  const handleModalCloseMedical = () => {
    setIsModal(false);
    setIsModalVisible(false); // Hide the modal
    setEditData(null);         // Clear the edit data
  };


  const handleDateChange = (date) => {
    // Update the selected date value
    setSelectedDate(date);
  
    if (date) {
      // Calculate age
      const currentDate = new Date();
      const dob = new Date(date);
      let age = currentDate.getFullYear() - dob.getFullYear();
      const monthDiff = currentDate.getMonth() - dob.getMonth();
      const dayDiff = currentDate.getDate() - dob.getDate();
  
      // If the birthday hasn't occurred yet this year, subtract 1 from the age
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
  
      // Set the calculated age to the form
      form.setFieldsValue({ age: age });
    }
  };


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
                <h3 className="page-title">Patients Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Patients Tables</li>
                </ul>
              </div>
              <div className="col-auto">
  <button
    type="button"
    className="btn btn-primary mb-2"
    onClick={() => handleModalOpen()}
  >
    Add New
  </button>
  {/* <button
    type="button"
    className="btn btn-success d-flex align-items-center"
    onClick={() => handleModalOpenDOB()}
  >
    <img
      src={bd} // Replace with your image path
      alt="DOB Icon"
      style={{
        width: "16px",
        height: "16px",
        marginRight: "8px",
      }}
    />
    DOB Report
  </button> */}

              </div>
              {/* <div className="col-auto">
                
              </div> */}
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
                <div className="card-header">
                  <h4 className="card-title">Patient Details</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
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
                      columns={columns}
                      dataSource={filteredData || []}
                      rowKey={(record) => record?.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
  title="Download DOB Report"
  visible={isModalOpen}
  onCancel={handleModalCloseDOB}
  footer={null} // Moved buttons into modal content
>
  <div>
    <label style={{ display: "inline", marginRight: "10px" }}>Select Month</label>
    <Select
      className="select-social-img"
      placeholder="Select a month"
      onChange={handleMonthChange}
      isSearchable={false}
      styles={{
        container: (provided) => ({
          ...provided,
          width: '100%', // Full width for the dropdown in the modal
        }),
      }}
    >
      {[
        { name: "January", value: "01" },
        { name: "February", value: "02" },
        { name: "March", value: "03" },
        { name: "April", value: "04" },
        { name: "May", value: "05" },
        { name: "June", value: "06" },
        { name: "July", value: "07" },
        { name: "August", value: "08" },
        { name: "September", value: "09" },
        { name: "October", value: "10" },
        { name: "November", value: "11" },
        { name: "December", value: "12" },
      ].map((month) => (
        <Select.Option key={month.value} value={month.value}>
          {month.name}
        </Select.Option>
      ))}
    </Select>
  </div>

  {/* Button Section */}
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <button
      type="submit"
      className="btn btn-primary mx-1"
      onClick={handleSubmit}
      disabled={!selectedMonth}
    >
      Submit
    </button>
    <button
      type="button"
      className="btn btn-danger"
      onClick={handleModalCloseDOB}
    >
      Cancel
    </button>
  </div>
</Modal>




<Modal
  title="Edit Patient Medical History"
  visible={isModal}
  onCancel={handleModalCloseMedical}
  footer={null}
>
  {/* Patient Details */}
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Patient Name">
        <span>{patientname}</span>
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label="Running No">
        <span>{patientid}</span>
      </Form.Item>
    </Col>
  </Row>

  <Form form={form} onFinish={handleFormSubmitmedicine} layout="vertical">
    {/* Row for switches */}
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item
          label={
            <>
              Asthma:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: switchStates.asthma ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {switchStates.asthma ? "Yes" : "No"}
              </span>
            </>
          }
          name="asthma"
          valuePropName="checked"
        >
          <Switch
            onChange={(checked) => handleSwitchChange("asthma", checked)}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label={
            <>
              Diabetes:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: switchStates.diabetes ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {switchStates.diabetes ? "Yes" : "No"}
              </span>
            </>
          }
          name="diabetes"
          valuePropName="checked"
        >
          <Switch
            onChange={(checked) => handleSwitchChange("diabetes", checked)}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label={
            <>
              Drug Allergy:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: switchStates.drug_allergy ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {switchStates.drug_allergy ? "Yes" : "No"}
              </span>
            </>
          }
          name="drug_allergy"
          valuePropName="checked"
        >
          <Switch
            onChange={(checked) =>
              handleSwitchChange("drug_allergy", checked)
            }
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <Form.Item
          label={
            <>
              Pregnancy:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: switchStates.pregnancy ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {switchStates.pregnancy ? "Yes" : "No"}
              </span>
            </>
          }
          name="pregnancy"
          valuePropName="checked"
        >
          <Switch
            onChange={(checked) => handleSwitchChange("pregnancy", checked)}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label={
            <>
              Blood Pressure (BP):{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: switchStates.bp ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {switchStates.bp ? "Yes" : "No"}
              </span>
            </>
          }
          name="bp"
          valuePropName="checked"
        >
          <Switch
            onChange={(checked) => handleSwitchChange("bp", checked)}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label={
            <>
              Cardiac:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: switchStates.cardiac ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {switchStates.cardiac ? "Yes" : "No"}
              </span>
            </>
          }
          name="cardiac"
          valuePropName="checked"
        >
          <Switch
            onChange={(checked) => handleSwitchChange("cardiac", checked)}
          />
        </Form.Item>
      </Col>
    </Row>

    {/* Textarea for "Others" */}
    <Form.Item label="Others:" name="others">
    <input
  className="form-control"
  type="text"
  style={{ width: '450px' }} // Adjust the width as needed
/>
    </Form.Item>

    {/* Textarea for "Chief Complaints" */}
    <Form.Item label="Chief Complaints:" name="cheif_complaints">
    <input
  className="form-control"
  type="text"
  style={{ width: '450px' }} // Adjust the width as needed
/>
    </Form.Item>

    {/* Submit and Cancel buttons */}
    <Form.Item>
      <div style={{ textAlign: "center" }}>
        <button type="submit" className="btn btn-primary mx-1">
          Update
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleModalCloseMedical}
        >
          Cancel
        </button>
      </div>
    </Form.Item>
  </Form>
</Modal>




 <Modal
      title={editData ? "Edit Patient" : "Add New Patient"}
      visible={isModalVisible}
      onCancel={handleModalClose}
      footer={null}
      width={800}
    >
      {editData ? (
        // Edit Patient Form
        <>
     {activeTab === "EditPatient" && (
  <Form
    form={form}
    onFinish={handleFormSubmit}
    initialValues={{
      mobile_no: customerMobile || "", // Pre-fill the mobile_no field with customerMobile if available
    }}
  >
  

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "Please input the name!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter your name"
            type="text"
            style={{ width: "215px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "Please input the name!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter your name"
            type="text"
            style={{ width: "215px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>
     
    </Row>
     

    {/* Age and Dob in one row */}
    <Row gutter={16}>

       <Col span={12}>
        <Form.Item
          label="Mobile No"
          name="mobile_no"
          rules={[{ required: true, message: "Please input the mobile_no!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            type="text"
            maxLength="10"
            style={{ width: "180px" }}
            placeholder="Enter 10-digit number"
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Age"
          name="age"
          initialValue={age} // Set calculated age as initial value
          rules={[{ required: true, message: "Please input the age!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            value={age || ""}
            onChange={(e) => setAge(e.target.value)}
            className="form-control"
            placeholder="Enter your name"
            type="text"
            style={{ width: "230px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>
  </Row>

   <Row gutter={16}>
       <Col span={12}>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select the gender!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Radio.Group style={{ marginLeft: '10px' }}> {/* Align input to the left */}
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
    </Row>

    {/* Submit and Reset Buttons */}
    <Form.Item>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button type="submit" className="btn btn-primary mx-1">
          {editData ? "Update" : "Submit"}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={editData ? closeModal : handleReset}
        >
          {editData ? "Cancel" : "Reset"}
        </button>
      </div>
    </Form.Item>
  </Form>
)}
          
        </>
      ) : (
        // Add New Patient Form
       <Form
  form={form}
  onFinish={handleFormSubmit}
  initialValues={{
    mobile_no: customerMobile || "",
  }}
> 
    {/* Name and Profile Image */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "Please enter First name" }]}
        >
          <Input 
            className="form-control" 
            placeholder="Enter first name" 
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>

       <Col span={12}>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: false, message: "Please enter Last name" }]}
        >
          <Input 
            className="form-control" 
            placeholder="Enter last name" 
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      </Row> 

 <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Mobile No"
          name="mobile_no"
          rules={[{ 
            required: true, 
            message: "Please enter mobile number",
            len: 10,
            pattern: /^[0-9]+$/,
          }]}
        >
          <Input
            className="form-control"
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>

       <Col span={12}>
   <Form.Item
          label="Age"
          name="age"
          initialValue={age} // Set calculated age as initial value
          rules={[{ required: false, message: "Please input the age!" }]}
        >
       <Input
  value={age || ""}
  onChange={(e) => setAge(e.target.value)}
  className="form-control"
  style={{ width: '240px' }} // Adjust the width as needed
/>
        </Form.Item>
  </Col>

     
    </Row>


     {/* Contact Information */}
    <Row gutter={16}>

       
       <Col span={12}>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: false, message: "Please select gender" }]}
        >
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      
    </Row>


  {/* Form Actions */}
  <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
    <Space>
      <Button type="primary" htmlType="submit" size="large">
        {editData ? "Update" : "Submit"}
      </Button>
      <Button
        htmlType="button"
        onClick={editData ? closeModal : handleReset}
        size="large"
      >
        {editData ? "Cancel" : "Reset"}
      </Button>
    </Space>
  </Form.Item>
</Form>
      )}
    </Modal>
    



      {/* Modal for Add / Edit */}
      {/* <Modal
      title={editData ? "Edit Patient" : "Add New Patient"}
      visible={isModalVisible}
      onCancel={handleModalClose}
      footer={null}
      width={800}
    >
      {editData ? (
        // Edit Patient Form
        <>
     {activeTab === "EditPatient" && (
  <Form
    form={form}
    onFinish={handleFormSubmit}
    initialValues={{
      mobile_no: customerMobile || "", // Pre-fill the mobile_no field with customerMobile if available
    }}
  >
  
   <div style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter your name"
            type="text"
            style={{ width: "215px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter your name"
            type="text"
            style={{ width: "215px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>
      
      <Col span={12}>
        <Form.Item
          label="Mobile No"
          name="mobile_no"
          rules={[{ required: true, message: "Please input the mobile_no!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            type="text"
            maxLength="10"
            style={{ width: "180px" }}
            placeholder="Enter 10-digit number"
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Col>
     
    </Row>
      </div>
 
  <div style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
    <h4>Other Details</h4>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Email ID"
          name="email_id"
          required={false} // This prevents the red asterisk
          rules={[{ required: false, message: "Please input the email address!" }]}
          style={{ width: "210px", marginLeft: '10px' }} 
        >
          <input
            className="form-control"
            placeholder="Enter your Email"
            type="text"
            style={{ width: "210px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Secondary Mobile"
          name="secondary_mobile"
          rules={[{ required: false, message: "Please input the name!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            type="text"
            maxLength="10"
            style={{ width: "210px" }}
            placeholder="Enter 10-digit number"
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Age"
          name="age"
          initialValue={age} // Set calculated age as initial value
          rules={[{ required: true, message: "Please input the age!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            value={age || ""}
            onChange={(e) => setAge(e.target.value)}
            className="form-control"
            placeholder="Enter your name"
            type="text"
            style={{ width: "230px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Dob"
          name="dob"
          getValueFromEvent={(date) => {
            if (!date) return null;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${day}-${month}-${date.getFullYear()}`;
          }}
          rules={[{ required: false, message: "Please select your Date of Birth!" }]}
          style={{ width: '400px' }}
        >
          <DatePicker
            className="form-control"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            showDayMonthYearPicker
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
        </Form.Item>
      </Col>
    </Row>

   
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select the gender!" }]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Radio.Group style={{ marginLeft: '10px' }}> 
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Running No"
          name="running_no"
          rules={[
            { required: false, message: "Please input the Running No!" },
            { whitespace: true, message: "Running No cannot be empty spaces!" },
          ]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter your Running no"
            type="text"
            style={{ width: "250px" }} // Adjust the width as needed
            disabled={true}
          />
        </Form.Item>
      </Col>
    </Row>

   
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Blood Group"
          name="blood_group"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <select
            className="form-select form-control"
            name="blood_group"
            style={{ width: "180px", marginLeft: '10px' }} // Align input to the left
            defaultValue="" // Ensures "Select Blood Group" is selected initially
          >
            <option value="" disabled>
              Select Blood Group
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="City"
          name="city"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter your City"
            type="text"
            style={{ width: "300px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>
    </Row>

   
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="profile_image"
          label="Profile Image"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            type="file"
            onChange={handleFileChangeSeat}
            id="seatImageInput"
            accept="image/*"
            className="form-control"
            style={{ width: '230px', marginLeft: '10px' }} // Align input to the left
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Full Address"
          name="full_address"
          required={false} // Prevents the red asterisk
          rules={[
            { required: false, message: "Please input the full address!" },
            { whitespace: true, message: "Address cannot be empty spaces!" },
          ]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter your Full Address"
            type="text"
            style={{ width: "250px" }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>
    </Row>
    </div> */}

    {/* Eye Examination Section */}
    {/* <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Uncorrected OD"
          name="uncorrected_od"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter uncorrected OD"
            type="text"
            style={{ width: "180px", marginLeft: '10px' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Uncorrected OS"
          name="uncorrected_os"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter uncorrected OS"
            type="text"
            style={{ width: "180px", marginLeft: '10px' }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Corrected OD"
          name="corrected_od"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter corrected OD"
            type="text"
            style={{ width: "180px", marginLeft: '10px' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Corrected OS"
          name="corrected_os"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter corrected OS"
            type="text"
            style={{ width: "180px", marginLeft: '10px' }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="IOP OD (mmHg)"
          name="iop_od"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter IOP OD"
            type="number"
            step="0.01"
            style={{ width: "180px", marginLeft: '10px' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="IOP OS (mmHg)"
          name="iop_os"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form-control"
            placeholder="Enter IOP OS"
            type="number"
            step="0.01"
            style={{ width: "180px", marginLeft: '10px' }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={24}>
        <Form.Item
          label="Remarks"
          name="remarks"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <textarea
            className="form-control"
            placeholder="Enter any remarks"
            style={{ width: "100%", marginLeft: '10px', minHeight: '80px' }}
          />
        </Form.Item>
      </Col>
    </Row> */}

    {/* {hospital_private == 1 &&
      <Col span={12}>
        <Form.Item
          label="App Password"
          name="password"
          rules={[{ required: false }]}
        >
          <input
            className="form-control"
            name="name"
            type="text"
            style={{ width: '230px' }} // Adjust the width as needed
          />
        </Form.Item>
      </Col>
    } */}

   
    {/* <Form.Item>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button type="submit" className="btn btn-primary mx-1">
          {editData ? "Update" : "Submit"}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={editData ? closeModal : handleReset}
        >
          {editData ? "Cancel" : "Reset"}
        </button>
      </div>
    </Form.Item>
  </Form>
)}
          
        </>
      ) : (
        // Add New Patient Form
       <Form
  form={form}
  onFinish={handleFormSubmit}
  initialValues={{
    mobile_no: customerMobile || "",
  }}
>

  <div style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
  
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter patient name" }]}
        >
          <Input 
            className="form-control" 
            placeholder="Enter full name" 
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Mobile No"
          name="mobile_no"
          rules={[{ 
            required: true, 
            message: "Please enter mobile number",
            len: 10,
            pattern: /^[0-9]+$/,
          }]}
        >
          <Input
            className="form-control"
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
     
    </Row>

   
  </div>


  <div style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
    <h4>Other Details</h4>


    <Row gutter={16}>
       <Col span={12}>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Secondary Mobile"
          name="secondary_mobile"
        >
          <Input
            className="form-control"
            placeholder="Optional secondary number"
            maxLength={10}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    </Row>

 
   <Row gutter={16}>
  <Col span={12}>
   <Form.Item
          label="Dob"
          name="dob"
          getValueFromEvent={(date) => {
            if (!date) return null;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${day}-${month}-${date.getFullYear()}`;
          }}
          rules={[{ required: false, message: "Please select your Date of Birth!" }]}
          
        >
           <DatePicker
  className="form-control"
  selected={selectedDate}
  onChange={handleDateChange}
  dateFormat="dd/MM/yyyy"
  showDayMonthYearPicker
  showYearDropdown
  showMonthDropdown
  dropdownMode="select"
  style={{ width: '240px' }}
/>
        </Form.Item>
  </Col>
  <Col span={12}>
   <Form.Item
          label="Age"
          name="age"
          initialValue={age} // Set calculated age as initial value
          rules={[{ required: false, message: "Please input the age!" }]}
        >
       <Input
  value={age || ""}
  onChange={(e) => setAge(e.target.value)}
  className="form-control"
  style={{ width: '240px' }} // Adjust the width as needed
/>
        </Form.Item>
  </Col>
</Row>

<Row gutter={16}>
  <Col span={12}>
    <Form.Item label="Blood Group" name="blood_group">
   <select
  className="form-select form-control"
  name="blood_group"
  style={{ width: "272px" }}
  defaultValue="" // Ensures "Select Blood Group" is selected initially
>
  <option value="" disabled>
    Select Blood Group
  </option>
  <option value="A+">A+</option>
  <option value="A-">A-</option>
  <option value="B+">B+</option>
  <option value="B-">B-</option>
  <option value="O+">O+</option>
  <option value="O-">O-</option>
  <option value="AB+">AB+</option>
  <option value="AB-">AB-</option>
</select>

  </Form.Item>
  </Col>
       <Col span={12}>
        <Form.Item label="Profile Image" name="profile_image">
          <input
            type="file"
            onChange={handleFileChangeSeat}
            className="form-control"
            style={{ width: '100%' }}
            accept="image/*"
          />
        </Form.Item>
      </Col>
    </Row>
    
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Email" name="email_id">
          <Input
            className="form-control"
            placeholder="Enter email address"
            type="email"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="City" name="city">
          <Input
            className="form-control"
            placeholder="Enter city"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item label="Full Address" name="full_address">
      <Input.TextArea
        className="form-control"
        placeholder="Enter full address"
        rows={3}
      />
    </Form.Item>
  </div>

  {/* Eye Examination Section */}
  {/* <div style={{ marginBottom: '24px' }}>
    <h4>Eye Examination Details</h4>
    
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Uncorrected OD (Right Eye)" name="uncorrected_od">
          <Input
            className="form-control"
            placeholder="Enter uncorrected vision for right eye"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Uncorrected OS (Left Eye)" name="uncorrected_os">
          <Input
            className="form-control"
            placeholder="Enter uncorrected vision for left eye"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Corrected OD (Right Eye)" name="corrected_od">
          <Input
            className="form-control"
            placeholder="Enter corrected vision for right eye"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Corrected OS (Left Eye)" name="corrected_os">
          <Input
            className="form-control"
            placeholder="Enter corrected vision for left eye"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="IOP OD (Right Eye mmHg)" name="iop_od">
          <Input
            className="form-control"
            placeholder="Enter IOP for right eye"
            type="number"
            step="0.1"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="IOP OS (Left Eye mmHg)" name="iop_os">
          <Input
            className="form-control"
            placeholder="Enter IOP for left eye"
            type="number"
            step="0.1"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item label="Remarks" name="remarks">
      <Input.TextArea
        className="form-control"
        placeholder="Enter any additional remarks"
        rows={3}
      />
    </Form.Item>
  </div>

 
  <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
    <Space>
      <Button type="primary" htmlType="submit" size="large">
        {editData ? "Update" : "Submit"}
      </Button>
      <Button
        htmlType="button"
        onClick={editData ? closeModal : handleReset}
        size="large"
      >
        {editData ? "Cancel" : "Reset"}
      </Button>
    </Space>
  </Form.Item>
</Form>
      )}
    </Modal>
     */}


      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Confirmation"
        visible={isDeleteConfirmVisible}
        // onOk={handleDelete}
        onCancel={handleDeleteCancel}
       footer={null}
      >
        <p>Are you sure you want to delete <span style={{fontWeight:"bold"}}>"{deleteName}"</span> Patientdetail record?</p>
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




      <Modal
  title={
    <div className="d-flex justify-content-between align-items-center w-100">
      <span>Appointment History</span>
      <span className="text-muted small" style={{ marginLeft: "-30px" }}>
        Total Appointments: <strong>{totalAppointments}</strong> | 
        Total Cost: <strong>{totalAmount.toFixed(2)}</strong>
      </span>
    </div>
  }
  visible={isOpenAptHistory}
  onCancel={() => setIsOpenAptHistory(false)}
  footer={null}
  width={1000}
>
  <div className="card">
    <div className="card-body">
      <div className="table-responsive">
        <Table
          pagination={{
            total: totalAppointments,
            pageSize: 10,
            showSizeChanger: false,
          }}
          style={{ overflowX: "auto" }}
          loading={loading}
          columns={columnspatientHistory}
          dataSource={patientAptHistory}
          rowKey={(record) => record.id}
        />
      </div>
    </div>
  </div>
</Modal>

<Modal
    title={
      <div className="d-flex justify-content-between align-items-center w-100">
        <span>Service History</span>
        <span className="text-muted small" style={{ marginLeft: "-50px" }}>
          Total Service Types: <strong>{uniqueServiceTypes}</strong> | 
          Total Cost: <strong>{finalAmount.toFixed(2)}</strong>
        </span>
      </div>
    }
  visible={isOpenPatientServiceHistory}
  onCancel={() => setIsOpenPatientServiceHistory(false)}
  footer={null}
  width={1000}
>
  <div className="card">
    <div className="card-body">
      <div className="table-responsive">
        <Table
          pagination={{
            total: PatientServicedetails.length,
            pageSize: 10,
            showSizeChanger: false,
          }}
          style={{ overflowX: "auto" }}
          loading={loading}
          columns={columnspatientServiceHistory}
          dataSource={PatientServicedetails}
          rowKey={(record) => record.id}
        />
      </div>
    </div>
  </div>
</Modal>
      <Modal
  // title="Patient Details"
  visible={isOpenpatientdetails}
  onCancel={() => setisOpenpatientdetails(false)}
  footer={null}
>
<h5><strong>Patient Details</strong></h5>
  <div className="container">
    <div className="row align-items-center mb-3">
      <div className="col-auto">
        <img
          src={
            selectedPatient?.profile_image && /\.(jpeg|jpg|png|webp)$/i.test(selectedPatient?.profile_image)
              ? `${image_api}${selectedPatient?.profile_image}`
              : pat_dummy
          }
          alt={`${selectedPatient?.name}'s profile`}
          style={{ width: '60px', height: '60px', borderRadius: '50%' }}
        />
       
      </div>
      <div className="col">
        <p><strong>{selectedPatient?.name}</strong></p>
      </div>
    </div>
    
    <div className="row mb-3">
      <div className="col-6">
        <p><strong>DOB:</strong> {selectedPatient?.dob}</p>
      </div>
      <div className="col-6">
        <p><strong>Address:</strong> {selectedPatient?.full_address}</p>
      </div>
    </div>
    
    <div className="row mb-3">
      <div className="col-6">
        <p><strong>Blood Group:</strong> {selectedPatient?.blood_group}</p>
      </div>
      <div className="col-6">
        <p>
          <strong>Old Running No:</strong> 
          {selectedPatient?.old_running_no ? (
            <span style={{ color: '#1d7ed8' }}>
              #{adminpatientp}{selectedPatient.old_running_no}
            </span>
          ) : "-"}
        </p>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-6">
        <p><strong>Age:</strong> {selectedPatient?.age}</p>
      </div>
      <div className="col-6">
        <p><strong>Secondary Mobile:</strong> {selectedPatient?.secondary_mobile}</p>
      </div>
    </div>
    <div className="row mb-3">
    <div className="col-6">
    <p><strong>Referral Name:</strong> {selectedPatient?.other_referal_name || selectedPatient?.referral_name || "-"}</p>
    </div>
    <div className="col-6">
      <p><strong>Referral Mobile:</strong> {selectedPatient?.other_referal_mobile || selectedPatient?.referral_mobile || "-"}</p>
    </div>
   
    
  </div>

   <div className="row">
    <div className="col-12">
    <p><strong>App Password:</strong> {selectedPatient?.password || "-"}</p>
    </div>  
  </div>
    
    <hr />
    <h5><strong>Medical History</strong></h5>
    
    <div className="row">
      <div className="col-4">
        <p>Asthma: <span style={{ color: switchStates.asthma ? 'green' : 'red' }}>{switchStates.asthma ? "Yes" : "No"}</span></p>
        <p>Diabetes: <span style={{ color: switchStates.diabetes ? 'green' : 'red' }}>{switchStates.diabetes ? "Yes" : "No"}</span></p>
        <p>Drug Allergy: <span style={{ color: switchStates.drug_allergy ? 'green' : 'red' }}>{switchStates.drug_allergy ? "Yes" : "No"}</span></p>
      </div>
      <div className="col-4">
        <p>Pregnancy: <span style={{ color: switchStates.pregnancy ? 'green' : 'red' }}>{switchStates.pregnancy ? "Yes" : "No"}</span></p>
        <p> BP: <span style={{ color: switchStates.bp ? 'green' : 'red' }}>{switchStates.bp ? "Yes" : "No"}</span></p>
        <p>Cardiac: <span style={{ color: switchStates.cardiac ? 'green' : 'red' }}>{switchStates.cardiac ? "Yes" : "No"}</span></p>
      </div>
    </div>
    
    <div className="row">
      <div className="col-6">
        <p>Others: {selectedPatient?.others}</p>
      </div>
      <div className="col-6">
        <p>Chief Complaints: {selectedPatient?.cheif_complaints}</p>
      </div>
    </div>
  </div>
</Modal>

 <Modal
       title="Installation Info"
       visible={isModalInsta}
       onCancel={() => setIsModalInsta(false)}
       footer={[
        <Button
        key="close"
        type="primary"
        onClick={() => {
          setIsModalInsta(false);
          setIsModalVisible(true); // Show the second modal
        }}
      >
        Okay
      </Button>
       ]}
     >
       {/* Your modal content goes here */}
       <div style={{ fontSize: '16px', fontWeight: '500', lineHeight: '1.6' }}>
  <div><strong>Step 1:</strong> Click the <strong>Add New</strong> button to initiate the process.</div>
  <div><strong>Step 2:</strong> Complete the form after clicking the <strong>Okay</strong> button to proceed.</div>
  <div><strong>Step 3:</strong> Click the <strong>Submit</strong> button to finalize the process.</div>
</div>
     </Modal>

    <Modal
  title="Installation Info"
  visible={isModalpop}
  onCancel={() => setIsModalpop(false)}
  footer={[
    <Button
    key="close"
    type="primary"
    onClick={() => {
      setIsModalpop(false);
      history.push('/admin/servicetypemaster'); // Call the switch case function here
    }}
  >
    Continue
  </Button>
  ]}
>
  {/* Your modal content goes here */}
  <h3 style={{ color: 'green', fontWeight: '600' }}>Submission Successful</h3>
<div style={{ fontSize: '16px', lineHeight: '1.6' }}>
  <p>Click the <strong>Continue</strong> button to move to the next step.</p>
</div>
</Modal>

    <Modal
          title="End session"
          visible={isEndSessionModalVisible}
          onCancel={() => setIsEndSessionModalVisible(false)}
          footer={null}
          // width={1150}
          width="90vw" // Responsive width
          style={{ maxWidth: "1150px" }} // Maximum width limit
          bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }} // Scrollable content
        >
          <ul className="nav nav-tabs nav-tabs-solid">
          {/* {
              settings?.prescription == 1 &&
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeTab === "medications" ? "active" : ""}`}
                  onClick={() => setActiveTab("medications")}
                  to="#"
                >
                  Medications
                </Link>
              </li>
            } */}
             <li className="nav-item">
            <Link
  className={`nav-link ${activeTab === "op" ? "active" : ""}`}
  onClick={() => setActiveTab("op")}
  to="#"
>
  OP
</Link>
            </li>
            
             <li className="nav-item">
            <Link
  className={`nav-link ${activeTab === "scan" ? "active" : ""}`}
  onClick={() => setActiveTab("scan")}
  to="#"
>
  Scan
</Link>
            </li>
            
             <li className="nav-item">
            <Link
  className={`nav-link ${activeTab === "investigation" ? "active" : ""}`}
  onClick={() => setActiveTab("investigation")}
  to="#"
>
  Investigation
</Link>
            </li>

             <li className="nav-item">
            <Link
  className={`nav-link ${activeTab === "review" ? "active" : ""}`}
  onClick={() => setActiveTab("review")}
  to="#"
>
  Review
</Link>
            </li>

              <li className="nav-item">
            <Link
  className={`nav-link ${activeTab === "laser" ? "active" : ""}`}
  onClick={() => setActiveTab("laser")}
  to="#"
>
  Laser
</Link>
            </li>
            
                <li className="nav-item">
            <Link
  className={`nav-link ${activeTab === "documents" ? "active" : ""}`}
  onClick={() => setActiveTab("documents")}
  to="#"
>
  Documents
</Link>
            </li>


            

             {/*  <li className="nav-item">
            <Link
  className={`nav-link ${activeTab === "appointments" ? "active" : ""}`}
  onClick={() => setActiveTab("appointments")}
  to="#"
>
  Appointments
</Link>
            </li> */}
            

            {/* {
              selectedAppointment?.doctor_specialization === "Dental" &&
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeTab === "operatings" ? "active" : ""}`}
                  onClick={() => setActiveTab("operatings")}
                  to="#"
                >
                  Operatings
                </Link>
              </li>
            } */}
          </ul>

          <br />
          
           {
            (selectedAppointment?.status == 0 || selectedAppointment?.status == 1 || selectedAppointment?.status == 2) && (
              <div  className="d-flex justify-content-between align-items-center"  style={{ marginTop:"10px" }}>
                   <h5>
      Overall Grand Total:{" "}
      <strong style={{color:"green"}}>₹ {calculateOverallGrandTotal().toFixed(2)}</strong>
    </h5>
       {/* Right side - Buttons */}
      <div>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEndSessionModalVisible(false)} style={{ marginRight: "10px" }}>
                  Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary" onClick={handleEndSession}>
                  End Session
                </button>
                   </div>
              </div>
            )}
            <br/>

          {/* Content */}
        {['op', 'scan', 'investigation', 'review', 'laser'].map(tab => (
        activeTab === tab && (
          <div className="start-appointment-set" key={tab}>
            <div className="form-bg-title">
              <h5>Service Types</h5>
            </div>
            <div className="row meditation-row">
              <div className="col-md-12">
                {(selectedAppointment?.status == 0 || selectedAppointment?.status == 1) ? (
                  <div className="d-flex justify-content-end align-items-end mb-4">
                    <Link to="#" className="add-medical more-item mb-0" onClick={handleAddNewRow}>
                      Add New
                    </Link>
                  </div>
                ) : (
                  <div className="add-new-med text-end mb-4">
                    {isEnable ? (
                      <>
                        <Link to="#" className="btn btn-warning more-item mb-0" onClick={handleSubmitNewInvoiceDetail}>
                          Add service
                        </Link>
                        <Link to="#" className="btn btn-secondary more-item mb-0 ml-2" onClick={handleDeleteLastRow}>
                          Cancel
                        </Link>
                      </>
                    ) : (
                      // <Link to="#" className="add-medical more-item mb-0 ml-2" onClick={handleExistingAddNewRow}>
                      //   Add New
                      // </Link>
                       <button type="submit" className="btn btn-primary mx-1">
                  Update
                </button>
                    )}
                  </div>
                )}

                

                {getCurrentRows().map((row, index) => (
                  <div className="d-flex flex-wrap medication-wrap align-items-center" key={row.id}>
                    <div className="input-block input-block-new">
                      <label className="form-label">Name</label>
                      {renderServiceDropdown(row)}
                    </div>

          {/* Final Price Field */}
          <div className="input-block input-block-new">
            <label className="form-label">Final Price</label>
            <input
              type="number"
              className="form-control"
              value={typeof row.final_price === 'number' ? row.final_price.toFixed(2) : 
              (row.price && row.qty ? (row.price * row.qty).toFixed(2) : '0.00')}
              onChange={(e) => handleFinalPriceChange(row.id, parseFloat(e.target.value || 0))}
            />
          </div>


<div className="input-block input-block-new">
            <label className="form-label">Remarks</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter remarks..."
              value={row.remarks || ''}
              onChange={(e) => handleRemarksChange(row.id, e.target.value)}
            />
          </div>
          

         <button 
                    className="btn btn-sm btn-outline-danger ml-2"
 onClick={() => handleDeleteRow(row.id)}
                  >
                   <i className="fe fe-trash" />
                  </button>  
 
 
                    {/* Rest of your row rendering remains the same */}
                    {/* ... */}
                  </div>
                ))}
              
              </div>
            </div>
            {/* Add these totals fields below your service rows */}
      <div className="row mt-3">
        <div className="col-md-4">
          <div className="input-block">
            <label className="form-label">Sub Total</label>
            <input
              type="number"
              className="form-control"
              value={calculateTabTotals(tab).subTotal.toFixed(2)}
              readOnly
            />
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="input-block">
            <label className="form-label">Discount</label>
            <input
              type="number"
              className="form-control"
              value={calculateTabTotals(tab).discount}
              onChange={(e) => handleTabDiscountChange(tab, e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="input-block">
            <label className="form-label">Grand Total (Sub Total - Discount)</label>
            <input
              type="number"
              className="form-control"
              value={calculateTabTotals(tab).grandTotal.toFixed(2)}
              readOnly
            />
          </div>
        </div>
      </div>
          </div>
        )
      ))}

          {activeTab === "documents" && (
  <div className="document-upload-container">
    <div className="form-bg-title">
      <h5>Upload Documents</h5>
      <p className="text-muted">Supported formats: JPG, PNG (Max 10MB each)</p>
    </div>

    <div className="document-upload-area">
      {/* Dropzone Area */}
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileDrop(e.dataTransfer.files);
        }}
      >
        <CloudUploadIcon className="upload-icon" />
        <p>Drag & drop files here or click to browse</p>
        <input
          type="file"
          id="document-upload"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
          accept=".jpg,.jpeg,.png,.pdf"
        />
        <button 
          className="btn btn-primary mt-2"
          onClick={() => document.getElementById('document-upload').click()}
        >
          Select Files
        </button>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="upload-progress mt-4">
          <div className="progress">
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              role="progressbar"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
          <p className="text-center mt-2">Uploading... Please wait</p>
        </div>
      )}

      {/* Uploaded Files List */}
    {uploadedFiles.length > 0 && (
  <div className="uploaded-files mt-4">
    <h6>Uploaded Documents</h6>
    <div className="row">
      {uploadedFiles.map((file, index) => (
        <div key={index} className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-2 d-flex flex-column">
              {/* Top row: Date + Buttons */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">{file.created_at}</small>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => handlePreview(file.url)}
                  >
                      <Eye size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger me-1"
                    onClick={() => deleteFile(file)}
                  >
                   <Trash2 size={16} />
                  </button>
                   <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => handlePrint(file.url)}
                  >
                    <PrinterIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="flex-grow-1 d-flex align-items-center justify-content-center border rounded overflow-hidden">
                <img
                  src={file.url}
                  alt={file.name}
                  className="img-fluid"
                  style={{ maxHeight: "200px", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  </div>
)}

         {activeTab === "appointments" && (
  <div className="appointment-form-container">
    <h5 className="mb-3">Book Appointment</h5>
    
    <form onSubmit={handleAppointmentSubmit}>
      <div className="form-group mb-3">
        <label htmlFor="appointment-date">Appointment Date</label>
        <input
          type="date"
          className="form-control"
          id="appointment-date"
          value={appointmentPrivateDate}
          onChange={(e) => setAppointmentPrivateDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="slot-select">Select Slot</label>
        <select
          className="form-control"
          id="slot-select"
          value={selectedPrivateSlot}
          onChange={(e) => setSelectedPrivateSlot(e.target.value)}
          required
        >
          <option value="">-- Select Slot --</option>
          {privateSlotList.map((slot, index) => (
            <option key={index} value={slot.from_time}>
              {slot.from_time} - {slot.to_time}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="appointment-remark">Remark</label>
        <textarea
          className="form-control"
          id="appointment-remark"
          rows="3"
          value={remarkPrivate}
          onChange={(e) => setRemarkPrivate(e.target.value)}
          placeholder="Optional notes..."
        />
      </div>

      {/* <button type="submit" className="btn btn-success">
        Book Appointment
      </button> */}
    </form>
    {
                  selectedAppointment?.status == 3 &&
                   <button type="submit" className="btn btn-primary mx-1">
                  Update
                </button>
                }
  </div>
)}
          {activeTab === "operatings" && (

            <>
              <ul className="nav nav-tabs nav-tabs-solid">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activeSecondTab === "current_appointment" ? "active" : ""}`}
                    onClick={() => setActiveSecondTab("current_appointment")}
                    to="#"
                  >
                    Current Appointment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activeSecondTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveSecondTab("history")}
                    to="#"
                  >
                    History
                  </Link>
                </li>
              </ul>



              {activeSecondTab === "current_appointment" && (
                <>
                  <div className="row">
                    <div className="col-md-6 col-xl-6 col-sm-12">
                      <div className="create-details-card">
                        {
                          toothDirections['Upper Left'] && toothDirections['Upper Left'].length > 0 ? (
                            [...Array(Math.ceil(toothDirections['Upper Left'].length / 4))].map((_, rowIndex) => (
                              <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px' }}> {/* Add vertical gap between rows */}
                                {
                                  toothDirections['Upper Left']
                                    .slice(rowIndex * 4, (rowIndex + 1) * 4)
                                    .map((dir, index) => (
                                      <Col
                                        key={index}
                                        lg={6}
                                        // className="d-flex justify-content-center"
                                        style={{ paddingLeft: '8px', paddingRight: '8px' }} // Horizontal gap between columns
                                        onClick={() => handleOpenModalTooth(dir)}
                                      >
                                        {(dir?.dental_chart_remark || dir?.dental_chart_description) ? (
                                          <Tooltip
                                            placement="top"
                                            title={
                                              <div>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>Remark: {dir?.dental_chart_remark || 'No remark'}</p>
                                                <p style={{ margin: 0 }}>Description: {dir?.dental_chart_description || 'No description'}</p>
                                              </div>
                                            }
                                            overlayStyle={{ maxWidth: 300 }}
                                          >
                                            <div
                                              className="create-details-card"
                                              style={{
                                                //   padding: '10px',
                                                //   border: '1px solid #ddd',
                                                //   borderRadius: '8px',
                                                backgroundColor: dir?.dental_chart_id && dir.dental_chart_id > 0 ? '#d1f7d6' : '#f8f9fa',
                                                //   textAlign: 'center',
                                                //   height: 'auto',
                                                //   width: '100%', // Ensures cards stretch to occupy space consistently
                                                //   maxWidth: '200px', // Optional for consistent sizing
                                                //   display: 'flex',
                                                //   flexDirection: 'column',
                                                //   justifyContent: 'space-between',
                                                cursor: 'pointer',
                                              }}
                                            >
                                              <p style={{ margin: 0, fontWeight: 'bold' }}>FDI-{dir?.fdi}</p>
                                              {dir?.dental_chart_description && (
                                                <p style={{ margin: 0, wordBreak: 'break-word' }}> {dir?.dental_chart_description
                                                  ? `${dir.dental_chart_description.substring(0, 6)}...`
                                                  : ''}</p>
                                              )}
                                            </div>
                                          </Tooltip>
                                        ) : (

                                          <div
                                            className="create-details-card"
                                            style={{
                                              backgroundColor: dir?.dental_chart_id && dir.dental_chart_id > 0 ? '#d1f7d6' : '#f8f9fa',
                                            }}
                                          >
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>FDI-{dir?.fdi}</p>
                                            {dir?.dental_chart_description && (
                                              <p style={{ margin: 0, wordBreak: 'break-word' }}> {dir?.dental_chart_description
                                                ? `${dir.dental_chart_description.substring(0, 6)}...`
                                                : ''}</p>
                                            )}
                                          </div>
                                        )}
                                      </Col>
                                    ))
                                }
                              </Row>
                            ))
                          ) : (
                            <p>No data available for Upper Left.</p>
                          )
                        }
                      </div>
                    </div>


                    <div className="col-md-6 col-xl-6 col-sm-12">
                      <div className="create-details-card">
                        {
                          toothDirections['Upper Right'] && toothDirections['Upper Right'].length > 0 ? (
                            [...Array(Math.ceil(toothDirections['Upper Right'].length / 4))].map((_, rowIndex) => (
                              <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px' }}> {/* Add vertical gap between rows */}
                                {
                                  toothDirections['Upper Right']
                                    .slice(rowIndex * 4, (rowIndex + 1) * 4)
                                    .map((dir, index) => (
                                      <Col
                                        key={index}
                                        lg={6}
                                        // className="d-flex justify-content-center"
                                        style={{ paddingLeft: '8px', paddingRight: '8px' }} // Horizontal gap between columns
                                        onClick={() => handleOpenModalTooth(dir)}
                                      >
                                        {(dir?.dental_chart_remark || dir?.dental_chart_description) ? (
                                          <Tooltip
                                            placement="top"
                                            title={
                                              <div>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>Remark: {dir?.dental_chart_remark || 'No remark'}</p>
                                                <p style={{ margin: 0 }}>Description: {dir?.dental_chart_description || 'No description'}</p>
                                              </div>
                                            }
                                            overlayStyle={{ maxWidth: 300 }}
                                          >
                                            <div
                                              className="create-details-card"
                                              style={{
                                                backgroundColor: dir?.dental_chart_id && dir.dental_chart_id > 0 ? '#d1f7d6' : '#f8f9fa',
                                              }}
                                            >
                                              <p style={{ margin: 0, fontWeight: 'bold' }}>FDI-{dir?.fdi}</p>
                                              {dir?.dental_chart_description && (
                                                <p style={{ margin: 0, wordBreak: 'break-word' }}> {dir?.dental_chart_description
                                                  ? `${dir.dental_chart_description.substring(0, 6)}...`
                                                  : ''}</p>
                                              )}
                                            </div>
                                          </Tooltip>
                                        ) : (
                                          <div
                                            className="create-details-card"
                                            style={{
                                              backgroundColor: dir?.dental_chart_id && dir.dental_chart_id > 0 ? '#d1f7d6' : '#f8f9fa',
                                            }}
                                          >
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>FDI-{dir?.fdi}</p>
                                            {dir?.dental_chart_description && (
                                              <p style={{ margin: 0, wordBreak: 'break-word' }}> {dir?.dental_chart_description
                                                ? `${dir.dental_chart_description.substring(0, 6)}...`
                                                : ''}</p>
                                            )}
                                          </div>
                                        )}
                                      </Col>
                                    ))
                                }
                              </Row>
                            ))
                          ) : (
                            <p>No data available for Upper Right.</p>
                          )
                        }
                      </div>
                    </div>
                  </div>




                  <div className="row">
                    <div className="col-md-6 col-xl-6 col-sm-12">
                      <div className="create-details-card">
                        {
                          toothDirections['Lower Left'] && toothDirections['Lower Left'].length > 0 ? (
                            [...Array(Math.ceil(toothDirections['Lower Left'].length / 4))].map((_, rowIndex) => (
                              <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px' }}> {/* Add vertical gap between rows */}
                                {
                                  toothDirections['Lower Left']
                                    .slice(rowIndex * 4, (rowIndex + 1) * 4)
                                    .map((dir, index) => (
                                      <Col
                                        key={index}
                                        lg={6}
                                        // className="d-flex justify-content-center"
                                        style={{ paddingLeft: '8px', paddingRight: '8px' }} // Horizontal gap between columns
                                        onClick={() => handleOpenModalTooth(dir)}
                                      >
                                        {(dir?.dental_chart_remark || dir?.dental_chart_description) ? (
                                          <Tooltip
                                            placement="top"
                                            title={
                                              <div>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>Remark: {dir?.dental_chart_remark || 'No remark'}</p>
                                                <p style={{ margin: 0 }}>Description: {dir?.dental_chart_description || 'No description'}</p>
                                              </div>
                                            }
                                            overlayStyle={{ maxWidth: 300 }}
                                          >
                                            <div
                                              className="create-details-card"
                                              style={{
                                                backgroundColor: dir?.dental_chart_id && dir.dental_chart_id > 0 ? '#d1f7d6' : '#f8f9fa',
                                                cursor: 'pointer',
                                              }}
                                            >
                                              <p style={{ margin: 0, fontWeight: 'bold' }}>FDI-{dir?.fdi}</p>
                                              {dir?.dental_chart_description && (
                                                <p style={{ margin: 0, wordBreak: 'break-word' }}> {dir?.dental_chart_description
                                                  ? `${dir.dental_chart_description.substring(0, 6)}...`
                                                  : ''}</p>
                                              )}
                                            </div>
                                          </Tooltip>
                                        ) : (
                                          <div
                                            className="create-details-card"
                                            style={{
                                              //   padding: '10px',
                                              //   border: '1px solid #ddd',
                                              //   borderRadius: '8px',
                                              backgroundColor: dir?.dental_chart_id && dir.dental_chart_id > 0 ? '#d1f7d6' : '#f8f9fa',
                                              //   textAlign: 'center',
                                              //   height: 'auto',
                                              //   width: '100%', // Ensures cards stretch to occupy space consistently
                                              //   maxWidth: '200px', // Optional for consistent sizing
                                              //   display: 'flex',
                                              //   flexDirection: 'column',
                                              //   justifyContent: 'space-between',

                                            }}
                                          >
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>FDI-{dir?.fdi}</p>
                                            {dir?.dental_chart_description && (
                                              <p style={{ margin: 0, wordBreak: 'break-word' }}> {dir?.dental_chart_description
                                                ? `${dir.dental_chart_description.substring(0, 6)}...`
                                                : ''}</p>
                                            )}
                                          </div>
                                        )}
                                      </Col>
                                    ))
                                }
                              </Row>
                            ))
                          ) : (
                            <p>No data available for Lower Left.</p>
                          )
                        }
                      </div>
                    </div>

                    <div className="col-md-6 col-xl-6 col-sm-12">
                      <div className="create-details-card">
                        {
                          toothDirections['Lower Right'] && toothDirections['Lower Right'].length > 0 ? (
                            [...Array(Math.ceil(toothDirections['Lower Right'].length / 4))].map((_, rowIndex) => (
                              <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px' }}> {/* Add vertical gap between rows */}
                                {
                                  toothDirections['Lower Right']
                                    .slice(rowIndex * 4, (rowIndex + 1) * 4)
                                    .map((dir, index) => (
                                      <Col
                                        key={index}
                                        lg={6}
                                        // className="d-flex justify-content-center"
                                        style={{ paddingLeft: '8px', paddingRight: '8px' }} // Horizontal gap between columns
                                        onClick={() => handleOpenModalTooth(dir)}
                                      >
                                        {(dir?.dental_chart_remark || dir?.dental_chart_description) ? (
                                          <Tooltip
                                            placement="top"
                                            title={
                                              <div>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>Remark: {dir?.dental_chart_remark || 'No remark'}</p>
                                                <p style={{ margin: 0 }}>Description: {dir?.dental_chart_description || 'No description'}</p>
                                              </div>
                                            }
                                            overlayStyle={{ maxWidth: 300 }}
                                          >
                                            <div
                                              className="create-details-card"
                                              style={{
                                                backgroundColor: dir?.dental_chart_id && dir.dental_chart_id > 0 ? '#d1f7d6' : '#f8f9fa',
                                              }}
                                            >
                                              <p style={{ margin: 0, fontWeight: 'bold' }}>FDI-{dir?.fdi}</p>
                                              {dir?.dental_chart_description && (
                                                <p style={{ margin: 0, wordBreak: 'break-word' }}> {dir?.dental_chart_description
                                                  ? `${dir.dental_chart_description.substring(0, 6)}...`
                                                  : ''}</p>
                                              )}
                                            </div>
                                          </Tooltip>
                                        ) : (

                                          <div
                                            className="create-details-card"
                                            style={{
                                              //   padding: '10px',
                                              //   border: '1px solid #ddd',
                                              //   borderRadius: '8px',
                                              backgroundColor: dir?.dental_chart_id && dir.dental_chart_id > 0 ? '#d1f7d6' : '#f8f9fa',
                                              //   textAlign: 'center',
                                              //   height: 'auto',
                                              //   width: '100%', // Ensures cards stretch to occupy space consistently
                                              //   maxWidth: '200px', // Optional for consistent sizing
                                              //   display: 'flex',
                                              //   flexDirection: 'column',
                                              //   justifyContent: 'space-between',
                                            }}
                                          >
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>FDI-{dir?.fdi}</p>
                                            {dir?.dental_chart_description && (
                                              <p style={{ margin: 0, wordBreak: 'break-word' }}> {dir?.dental_chart_description
                                                ? `${dir.dental_chart_description.substring(0, 6)}...`
                                                : ''}</p>
                                            )}
                                          </div>
                                        )}
                                      </Col>
                                    ))
                                }
                              </Row>
                            ))
                          ) : (
                            <p>No data available for Lower Right.</p>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSecondTab === "history" && (
                <div className="card">
                  <div className="card-body">
                    <div className="table-reeeeeesponsive">
                      <Table
                        pagination={{
                          total: toothHistory.length,
                          pageSize: 10, // Limit to 2 rows per page
                          showSizeChanger: false,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        style={{ overflowX: "auto" }}
                        loading={loading}
                        columns={columnsHistory}
                        dataSource={toothHistory}
                        rowKey={(record) => record.id}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>


          )}
        </Modal>


    </>
  );
};

export default Patientdetails;
