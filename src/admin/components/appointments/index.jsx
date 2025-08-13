import React from "react";
//import { Table } from "antd";
import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-daterangepicker/daterangepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Table, Button, Modal, Form, Input, notification, Row, Col, Switch, Checkbox , Carousel} from "antd";
import { Tabs } from 'antd';
import { Filter, initialSettingsApt } from "../../../client/components/common/filter";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import SidebarNav from "../sidebar";
import Select from "react-select";
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import { EyeOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import axios from "axios";
import { var_api } from "../../../constant";
import { Tooltip, Tag } from 'antd';
import { coming_soon, doctor_thumb_21 } from "../../../client/components/imagepath";
import { image_api } from "../../../constant";
import pat_dummy from "../../assets/img/patients/pat_dummy.png";
import "../styles/Loader.css";
import { text } from "@fortawesome/fontawesome-svg-core";
import { FaTrash } from "react-icons/fa";
import noDataImage from "../../assets/img/nodata/nodata_image.png";
import { ArrowRight, Eye, User, Cake, Clock, Calendar, Thermometer, HeartPulse, Droplet, Ruler, Weight, Scale, Activity, ShieldCheck, Candy, Stethoscope, Star, UserCheck, BriefcaseMedical, IdCard, CandyOff, Users, MapPin, PrinterIcon, MessageCircle, Gauge, EyeOff } from "lucide-react";
import bookingaudio from "../../assets/audio/booking_audio.wav";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { FaCalendarAlt, FaClock, FaStickyNote, FaInfoCircle } from "react-icons/fa"



const Appointments = () => {
  const today = new Date();
  const [data, setData] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patientReview, setpatientReview] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCloneTime, setSelectedCloneTime] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isEditModalVisibleplus, setEditModalVisibleplus] = useState(false);
  const [specializationCloneDetails, setSpecializationCloneDetails] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [specializationDetails, setSpecializationDetails] = useState([]);
  const [specializationupdateDetails, setSpecializationupdateDetails] = useState([]);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState();
  const [selectedSpecializationupdateId, setSelectedSpecializationupdateId] = useState("");
  const token = localStorage.getItem("token");
  const hospital_id = localStorage.getItem("hospital_id");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctorupdateId, setSelectedDoctorupdateId] = useState("");
  const [customerMobile, setCustomerMobile] = useState('');
  const [mobileOptions, setMobileOptions] = useState([]);
  const [existingOrder, setExistingOrder] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [isModal, setIsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [dayCloneTimings, setDayCloneTimings] = useState([]);
  const [review, setReview] = useState(null); // Initially no review
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const history = useHistory(); // React Router v5 navigation
  // const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDatepic, setSelectedDatepic] = useState('');
  const [selectedDateclone, setSelectedDateclone] = useState(new Date());
  const [selectedDateupdate, setSelectedDateupdate] = useState(today);
  const [dayTimings, setDayTimings] = useState([]);
  const [dayTimingsupdate, setDayTimingsupdate] = useState([]);
  const [dayTimingsclone, setDayTimingsclone] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeclone, setSelectedTimeclone] = useState(null);
  const [selectedTimeupdate, setSelectedTimeupdate] = useState(null);
  const [activeTab, setActiveTab] = useState("op");
  const [activeSecondTab, setActiveSecondTab] = useState("current_appointment");
  const [activethirdTab, setActivethirdTab] = useState("Apthistory");
  const [activefourthTab, setActivefourthTab] = useState("patientinfo");
  const [selectedSpecializationLabel, setSelectedSpecializationLabel] = useState("");
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedCloneDoctorId, setSelectedCloneDoctorId] = useState("");
  const [modefiltereddata, setmodeFilteredData] = useState([]);
  const [modals, setModals] = useState([]);
  const [installDetails, setInstallDetails] = useState(null);
  const [firstDoctor, setFirstDoctor] = useState(null);
  const [currentDetail, setCurrentDetail] = useState(null);
  const [columns, setColumns] = useState({
    firstCol: 'col-md-6 col-xl-6 col-sm-12', // Default to 50%
    secondCol: 'd-none', // Hidden initially
    thirdCol: 'd-none',  // Hidden initially
  });
  const [doctorList, setDoctorList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [selectedDoctorsId, setSelectedDoctorsId] = useState(null);
  const [selectedPatientsId, setSelectedPatientsId] = useState(null);
  const appointmentPrefix = localStorage.getItem("admin_appointment_prefix");
  const [reply, setReply] = useState("");
  const localSelectedValue = localStorage.getItem('selectedStatus') || 7;
  console.log("status", localSelectedValue);
  // Filter the data based on the selected status
  const filterData = localSelectedValue == 7 ? data : data?.filter((item) => item.status == localSelectedValue);
  console.log("appliedstatus", filterData)
  const [selectedStatus, setSelectedStatus] = useState(localSelectedValue || 7); // Default to "All"
  const [filteredData, setFilteredData] = useState(filterData || []);  // Assuming dataSource is the full data
  console.log("appliedstatus", filteredData)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formVitalData, setFormVitalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEndSessionModalVisible, setIsEndSessionModalVisible] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [meditions, setMeditions] = useState([]);
  const [isMedEditing, setIsMedEditing] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const [selectedCard, setSelectedCard] = useState(null);
  //const [SelectedCardclone, setSelectedCardclone] = useState(null);
  const [selectedCardData, setSelectedCardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const adminpatientp = localStorage.getItem("admin_patient_prefix");
  const [notificationList, setNotificationList] = useState([]);
  const [editDiscount, setEditDiscount] = useState(null);
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const [switchStates, setSwitchStates] = useState({
    asthma: false,
    diabetes: false,
    drug_allergy: false,
    pregnancy: false,
    bp: false,
    cardiac: false,
  });
  const [isModalInsta, setIsModalInsta] = useState(false);
  const [isModalpop, setIsModalpop] = useState(false);
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

  const [paymode, setpaymode] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedCloneDate, setSelectedCloneDate] = useState('');
  const [specializationClone, setSpecializationClone] = useState([]);
  const [selectedCloneSpecializationId, setSelectedCloneSpecializationId] = useState();
  const [selectedDoctorcloneId, setSelectedDoctorcloneId] = useState("");
  const [specializationcloneDetails, setSpecializationcloneDetails] = useState([]);
  console.log("selectedDoctorcloneId type:", typeof selectedDoctorcloneId);
  console.log("setSelectedDoctorcloneId type:", typeof setSelectedDoctorcloneId);
  const [form] = Form.useForm();
  const [referalPersons, setReferalPersons] = useState([]);
  const [referalPersonsupdate, setReferalPersonsupdate] = useState([]);
  const [referalPersonId, setReferalPersonId] = useState(null);
  const [referalPersonupdateId, setReferalPersonupdateId] = useState(null);
  const [toothDirections, setToothDirections] = useState([]);
  const [historytoothDirections, setHistoryToothDirections] = useState([]);
  const [isOpenToothModal, setIsOpenToothModal] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [toothDescription, setToothDescription] = useState('');
  const [toothRemark, setToothRemark] = useState('');
  const [toothHistory, setToothHistory] = useState([]);
  const [selectedToothHistory, setSelectedToothHistory] = useState([]);
  const [isOpenHistoryChart, setIsOpenHistoryChart] = useState(false);
  const [settings, setSettings] = useState(null);
  const [isApptEditing, setIsApptEditing] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [startDate, setStartDate] = useState(initialSettingsApt.startDate);
  const [endDate, setEndDate] = useState(initialSettingsApt.endDate);
  const [updatedAppointment, setUpdatedAppointment] = useState({});
  const [labDropdowns, setLabDropdowns] = useState({});
  const [patientAptHistory, setPatientAptHistory] = useState([]);
  const [isOpenAptHistory, setIsOpenAptHistory] = useState(false);
  const [isOpenPatientServiceHistory, setIsOpenPatientServiceHistory] = useState(false);
  const [PatientServicedetails, setPatientServicedetails] = useState([]);
  const [existingServices, setExistingServices] = useState(null);
   const [invoiceData, setInvoiceData] = useState(null);
  const [existingMedicalInvoice, setExistingMedicalInvoice] = useState(null);
  const [isEnable, setIsEnable] = useState(false);
  const [isOthers, setIsOthers] = useState(false);
  const [otherReferalName, setOtherReferalName] = useState("");
  const [otherReferalNameupdate, setOtherReferalNameupdate] = useState("");
  const [otherReferalMobile, setOtherReferalMobile] = useState("");
  const [otherReferalMobileupdate, setOtherReferalMobileupdate] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [datareview, setDatareview] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [isEditDiscount, setIsEditDiscount] = useState(false);

  const [isPlusButtonVisible, setIsPlusButtonVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [isPatient, setIsPatient] = useState(true); // Default: Show patient list
  const totalAppointments = patientAptHistory ? patientAptHistory.length : 0;
  const isapptdashboardstatusfilterEnabled = localStorage.getItem("appt_dashboard_status_filter") === "1";
  const isapptdashboarddoctorfilterEnabled = localStorage.getItem("appt_dashboard_doctor_filter") === "1";
  const isadmindashboardotherappointmentEnabled = localStorage.getItem("admin_dashboard_otherappointment") === "1";
  const isbookedbyadminpatientemail = localStorage.getItem("booked_by_admin_patient_email") === "1";
  const iscancelledbyadminemail = localStorage.getItem("cancelled_by_admin_email") === "1";
  const booked_by_admin_doctor_email = localStorage.getItem("booked_by_admin_doctor_email") === "1";
  const isreviewreplyadminEnabled = localStorage.getItem("review_reply_admin") === "1";
  const rescheduled_by_admin_doctor_email = localStorage.getItem("rescheduled_by_admin_doctor_email") === "1";
  const rescheduled_by_admin_patient_email = localStorage.getItem("rescheduled_by_admin_patient_email") === "1";
  const endsession_by_admin_doctor_email = localStorage.getItem("endsession_by_admin_doctor_email") === "1";
  const endsession_by_admin_patient_email = localStorage.getItem("endsession_by_admin_patient_email") === "1";
  console.log("isreviewreplyadminEnabled:", isreviewreplyadminEnabled);
  const [totalPayAmount, setTotalPayAmount] = useState(0);
  const [editFinalAmount, setEditFinalAmount] = useState(0);
  const [calculatatedpaymode, setCalculatatedpaymode] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [invoicefiltereddata, setInvoicefiltereddata] = useState([]);

  const [aptDiscount, setAptDiscount] = useState(0);
  const [aptGrandTotal, setAptGrandTotal] = useState(0);
const [consultationFee, setConsultationFee] = useState(0);
const [discount, setDiscount] = useState(0);
const [finallAmount, setFinallAmount] = useState(0);
const [editing, setEditing] = useState(false);
const [discountValue, setDiscountValue] = useState(0);


const [previewModalVisible, setPreviewModalVisible] = useState(false);
const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
const [previewFiles, setPreviewFiles] = useState([]);

const [appointmentPrivateDate, setAppointmentPrivateDate] = useState('');
const [selectedPrivateSlot, setSelectedPrivateSlot] = useState('');
const [privateSlotList, setPrivateSlotList] = useState([]);
const [remarkPrivate, setRemarkPrivate] = useState('');
const { TabPane } = Tabs;
const sectionTypes = ['op', 'scan', 'investigation', 'review'];

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


const [isDragging, setIsDragging] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
const [uploadedFiles, setUploadedFiles] = useState([]);
const [uploadProgress, setUploadProgress] = useState(0);
const [s3Config, setS3Config] = useState({
  bucketName: '',
  region: '',
  folderPath: '',
});

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
  Others: [createEmptyServiceRow(4)]
});

const [tabDiscounts, setTabDiscounts] = useState({
  op: 0,
  scan: 0,
  investigation: 0,
  review: 0
});

const handleTabDiscountChange = (tab, value) => {
  const numValue = Math.max(0, Number(value) || 0);
  setTabDiscounts(prev => ({
    ...prev,
    [tab]: numValue
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


const calculateTotals = () => {
  const totals = {
    op_total: 0,
    op_discount: 0,
    scan_total: 0,
    scan_discount: 0,
    investigation_total: 0,
    investigation_discount: 0,
    review_total: 0,
    review_discount: 0,
    grand_total: 0,
    grand_discount: 0
  };

  // Calculate totals for each service type
  Object.entries(tabRows).forEach(([tab, rows]) => {
    const serviceType = getServiceTypeForTab(tab);
    const serviceTotal = rows.reduce((sum, row) => sum + (row.price * row.qty), 0);
    
    switch(serviceType) {
      case 0: // OP
        totals.op_total = serviceTotal;
        break;
      case 1: // Scan
        totals.scan_total = serviceTotal;
        break;
      case 2: // Investigation
        totals.investigation_total = serviceTotal;
        break;
      case 3: // Review
        totals.review_total = serviceTotal;
        break;
    }
  });

  // Calculate grand totals
  totals.grand_total = totals.op_total + totals.scan_total + 
                      totals.investigation_total + totals.review_total;
  totals.grand_discount = totals.op_discount + totals.scan_discount + 
                         totals.investigation_discount + totals.review_discount;

  return totals;
};


 const prepareAppointmentData = () => {
  const allServices = Object.entries(tabRows).flatMap(([tab, rows]) => 
    rows
   .filter(row => row.service_type_id != null && row.service_type_id !== '') // Filter out null/empty
   .map(row => ({
      service_type_id: row.service_type_id,
      service_type: getServiceTypeForTab(tab),
      unit_price: row.price,
      quantity: row.qty,
      discount: 0,
      remark: row.remarks
    }))
  );

  // Initialize with default values to prevent null
  const opTotals = calculateTabTotals('op') || { subTotal: 0, discount: 0, grandTotal: 0 };
  const scanTotals = calculateTabTotals('scan') || { subTotal: 0, discount: 0, grandTotal: 0 };
  const investigationTotals = calculateTabTotals('investigation') || { subTotal: 0, discount: 0, grandTotal: 0 };
  const reviewTotals = calculateTabTotals('review') || { subTotal: 0, discount: 0, grandTotal: 0 };

  // Convert all values to numbers and provide fallback
  const opDiscount = Number(opTotals.discount) || 0;
  const scanDiscount = Number(scanTotals.discount) || 0;
  const investigationDiscount = Number(investigationTotals.discount) || 0;
  const reviewDiscount = Number(reviewTotals.discount) || 0;

  const grandDiscount = opDiscount + scanDiscount + investigationDiscount + reviewDiscount;
  const grandTotal = (Number(opTotals.subTotal) || 0) + 
                    (Number(scanTotals.subTotal) || 0) + 
                    (Number(investigationTotals.subTotal) || 0) + 
                    (Number(reviewTotals.subTotal) || 0) - 
                    grandDiscount;
console.log("grna", grandDiscount, opDiscount, scanDiscount,investigationDiscount,reviewDiscount );
  return {
    hospital_id: hospital_id,
    patient_id: selectedAppointment.patient_id,
    tech_id: selectedAppointment.tech_id,
    appointment_day: selectedAppointment.appointment_day,
    appointment_time: selectedAppointment.appointment_time,
    payment_status: 0,
    status: 3,
    apt_start_time: selectedAppointment.apt_start_time,
    apt_end_time: new Date().toISOString(),
    amount: Math.max(0, grandTotal), // Ensure amount is never negative
    gosServices: allServices,
    op_total: Number(opTotals.subTotal) || 0,
    op_discount: opDiscount,
    scan_total: Number(scanTotals.subTotal) || 0,
    scan_discount: scanDiscount,
    investigation_total: Number(investigationTotals.subTotal) || 0,
    investigation_discount: investigationDiscount,
    review_total: Number(reviewTotals.subTotal) || 0,
    review_discount: reviewDiscount,
    grand_discount: grandDiscount,
    grand_total: Math.max(0, grandTotal) // Ensure total is never negative
  };
};

  // Handle direct quantity input
const handleDirectQtyChange = (rowId, newQty) => {
  setRows(prevRows =>
    prevRows.map(row =>
      row.id === rowId
        ? {
            ...row,
            qty: newQty,
            final_price: row.price * newQty
          }
        : row
    )
  );
};


// Handle remarks change
// const handleRemarksChange = (rowId, remarks) => {
//   setRows(prevRows =>
//     prevRows.map(row =>
//       row.id === rowId
//         ? { ...row, remarks }
//         : row
//     )
//   );
// };


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

  const [doctorsList, setDoctorsList] = useState([]);
  const updatedDoctorId = parseInt(selectedDoctorupdateId || selectedAppointment?.tech_id);

  // 🩺 Get doctor details
  const doctorDetails = doctorList.find((doc) => doc.id === updatedDoctorId);
  console.log("harinii", selectedAppointment);
  console.log("mk", specializationupdateDetails);

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



  // Handles switching between edit and view mode
  const handleMedEditClick = () => setIsMedEditing(true);
  const handleApptEditClick = () => setIsApptEditing(true);
  const handleMedCancelClick = () => setIsMedEditing(false);

  // Handles switch changes
  const handleSwitchChange = (key, checked) => {
    setSwitchStates((prevState) => ({
      ...prevState,
      [key]: checked,
    }));
  };

  const handleAddAppointment = () => {
    if (!selectedCard) {
      // alert("Please select a card first!"); // Prevent opening modal without selection
      return;
    }
    setIsModal(true); // Open modal
  };

  const fetchCloneSpecializationDetails = async (specializationId) => {
    if (!specializationId) return;

    const hospital_id = localStorage.getItem('hospital_id');
    const token = localStorage.getItem('token');

    console.log("Fetching doctors for specialization ID:", specializationId); // Debugging
    console.log("API Endpoint:", `${var_api}technicalstaff/technical/specialization/${hospital_id}/${specializationId}`); // Debugging

    try {
      const response = await fetch(`${var_api}technicalstaff/technical/specialization/${hospital_id}/${specializationId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      console.log("API Response Status:", response.status); // Debugging

      if (!response.ok) throw new Error("Failed to fetch doctor details");

      const result = await response.json();
      console.log("API Response (Raw):", result); // Debugging

      // Check if the response contains doctor data
      if (result.length === 0) {
        console.log("No doctors found for the selected specialization.");
        setSpecializationCloneDetails([]); // Clear the list
        return;
      }

      // Transform the response if necessary
      const formattedDoctors = result.map(doctor => ({
        id: doctor.id, // Use the correct field from the API response
        name: doctor.name, // Use the correct field from the API response
      }));
      console.log("Formatted Doctors:", formattedDoctors); // Debugging

      setSpecializationCloneDetails(formattedDoctors); // Update state with the list of doctors

      // Set the first doctor as selected (optional)
      if (formattedDoctors.length > 0) {
        const firstDoctorId = formattedDoctors[0].id;
        console.log("First Doctor ID:", firstDoctorId); // Debugging
        setSelectedCloneDoctorId(firstDoctorId);
        fetchCloneDateTimings(firstDoctorId);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setSpecializationCloneDetails([]); // Clear the list in case of an error
    }
  };

  const fetchCloneDateTimings = async (doc_id) => {
    // Ensure selectedDate is a valid Date object; if not, set it to today
    const dateObj = selectedCloneDate instanceof Date && !isNaN(selectedCloneDate) ? selectedCloneDate : new Date();
    setSelectedCloneDate(dateObj); // Update selected date if it was invalid

    // Get the day of the week
    const dayOfWeek = dateObj.toLocaleDateString("en-GB", { weekday: "long" });

    try {
      // Construct the API URL
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${dayOfWeek}`;

      // Fetch data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      // Filter the response data for active timings
      const activeDayTimings = response.data?.filter((timing) => timing.is_active === 1);
      setDayCloneTimings(activeDayTimings); // Update state with active timings

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayCloneTimings([]); // Clear day timings in case of an error
    }
  }





  const handleCloneDateChange = async (date) => {
    if (!selectedCloneDoctorId) {
      notification.error({
        message: "Error",
        description: "Please select a doctor.",
      });
      return;
    }
    setSelectedCloneDate(date); // Update the selected date in state
    console.log("Selected date:", date); // Log the selected date

    // Get the day of the week for the selected date
    const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'long' });
    const token = localStorage.getItem("token");
    const doc_id = selectedCloneDoctorId;
    try {
      // Construct the API 
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${dayOfWeek}`;

      // Fetch data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      // Filter the response data for is_active: 1
      const activeDayTimings = response.data?.filter((timing) => timing.is_active == 1);
      setDayCloneTimings(activeDayTimings);

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayCloneTimings([]); // Clear the response in case of an error
    }
  };




  const handleCloneSpecializationChange = (selectedOption) => {
    const specializationId = selectedOption.value;
    console.log("Selected Specialization ID:", specializationId); // Debugging

    setSelectedCloneSpecializationId(specializationId); // Update selected specialization ID
    fetchCloneSpecializationDetails(specializationId); // Fetch doctors for the selected specialization
  };

  const handleEditClickvital = () => {
    console.log("harini");
    setShowModal(true); // Open the modal
  };

  const handleCloneConfirmAppointment = async (id) => {
    try {
      await bookCloneAppointment(id); // Call your API
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };


  const handleCloneSelectTime = (id, fromTime) => {
    if (!id || !fromTime) {
      console.error("Invalid slot time selection:", { id, fromTime });
      return;
    }
    setSelectedCloneTime({ id, fromTime });
    // handleAppointmentChange('slot_time', fromTime);
  };

  const handleCloneDoctorChange = async (event) => {
    const doctorId = event.target.value;
    setSelectedCloneDoctorId(doctorId); // Update selected doctor ID

    // Ensure selectedDate is a valid Date object; if not, set it to today
    const dateObj = selectedCloneDate instanceof Date && !isNaN(selectedCloneDate) ? selectedCloneDate : new Date();
    setSelectedCloneDate(dateObj); // Update selected date if it was invalid

    // Get the day of the week
    const dayOfWeek = dateObj.toLocaleDateString("en-GB", { weekday: "long" });

    try {
      // Construct the API URL
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doctorId}/${dayOfWeek}`;

      // Fetch data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      // Filter the response data for active timings
      const activeDayTimings = response.data?.filter((timing) => timing.is_active === 1);
      setDayCloneTimings(activeDayTimings); // Update state with active timings

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayCloneTimings([]); // Clear day timings in case of an error
    }
  };



  const handleOthersClick = () => {
    history.push("/admin/othersappoint"); // Use push() instead of navigate()
  };

  const handleCancelEdit = () => {
    setShowModal(false); // Close the modal
    setIsEditing(false);
  };

  // const handleFormSubmit = (values) => {
  //   console.log("Updated values:", values);
  //   setIsModalOpen(false);
  // };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleEditswtich = () => {
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data?.filter(
      (item) =>
        item.patient_name.toLowerCase().includes(value) ||
        item.patient_mobile_no.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };


  console.log("haru", patientAptHistory);
  console.log("Selected Appointment:", specializationDetails);

  const initialFormValues = {
    specialization: selectedAppointment?.doctor_specialization_id,
    doctor: selectedAppointment?.tech_id,
    others_name: selectedAppointment?.referal_person_name || "",
    others_phone: selectedAppointment?.other_referal_mobile || "",
    appointment_day: selectedAppointment?.appointment_day,
    appointment_time: selectedAppointment?.appointment_time,
    slot_time: selectedAppointment?.slot_time,
  };


  const handleThirdTabChange = (Apthistory) => {
    setActivethirdTab(Apthistory);
  };



  const toggleEditModal = async () => {
    setEditModalVisible((prev) => !prev);

    if (selectedAppointment?.appointment_day) {
      console.log("jesi", selectedAppointment);

      // Convert "dd-MM-yyyy" to a Date object
      const [day, month, year] = selectedAppointment.appointment_day.split("-");
      const parsedDate = new Date(`${year}-${month}-${day}`);

      // Get day of the week (0 - Sunday, 6 - Saturday)
      const dayOfWeek = parsedDate.getDay();

      // Pass dayOfWeek when calling handleAppointmentChangeupdate
      handleAppointmentChangeupdate(dayOfWeek);
      setSelectedDateupdate(parsedDate);
      setUpdatedAppointment(prev => ({
        ...prev,
        appointment_day: selectedAppointment?.appointment_day,
        is_other_referal: selectedAppointment?.is_other_referal,
        other_referal_name: selectedAppointment?.other_referal_name,
        other_referal_mobile: selectedAppointment?.other_referal_mobile
      }));
    } else {
      setSelectedDateupdate(null);
    }

    // Automatically set "Others" checkbox if is_other_referal is true
    if (selectedAppointment?.is_other_referal) {
      setIsOthers(true);
      setOtherReferalNameupdate(selectedAppointment?.other_referal_name || "");
      setOtherReferalMobileupdate(selectedAppointment?.other_referal_mobile || "");
    } else {
      setIsOthers(false);
      setOtherReferalNameupdate("");
      setOtherReferalMobileupdate("");
    }

    if (selectedAppointment?.doctor_specialization_id) {
      fetchSpecializationupdateDetails(selectedAppointment?.doctor_specialization_id);

      const matchedSpecialization = specialization.find(
        (spec) => spec.value.toString() === selectedAppointment.doctor_specialization_id.toString()
      );

      if (matchedSpecialization) {
        setSelectedSpecializationupdateId(matchedSpecialization.value);
        setSelectedSpecializationLabel(matchedSpecialization.label);

        const matchedDoctor = specializationDetails.find(
          (doctor) => doctor.id === selectedAppointment.tech_id
        );
        console.log("jjj", matchedDoctor)
        setSelectedDoctorupdateId(matchedDoctor ? matchedDoctor.id : "");
      } else {
        setSelectedSpecializationupdateId("");
        setSelectedSpecializationLabel("");
        setSelectedDoctorupdateId("");
      }
    } else {
      setSelectedSpecializationupdateId("");
      setSelectedSpecializationLabel("");
      setSelectedDoctorupdateId("");
    }

    // Call API if both doctorId and dateObj are available
    if (selectedAppointment.tech_id && selectedDateupdate) {
      await fetchDoctorAvailability(selectedAppointment.tech_id, selectedDateupdate);
    }

  };

  // Function to fetch available time slots for the doctor
  const fetchDoctorAvailability = async (doctorId, selectedDate) => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
      selectedDate = new Date(); // Fallback to today's date if invalid
    }

    const dayOfWeek = selectedDate.toLocaleDateString("en-GB", { weekday: "long" });

    try {
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doctorId}/${dayOfWeek}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      // Filter the response data for active timings
      const activeDayTimings = response.data?.filter((timing) => timing.is_active === 1);
      setDayTimingsupdate(activeDayTimings); // Update state with active timings
      setSelectedTimeupdate(selectedAppointment?.slot_time);
      setUpdatedAppointment(prev => ({
        ...prev,
        slot_time: selectedAppointment?.slot_time,
        referal_person: selectedAppointment?.referal_person
      }));
      setReferalPersonupdateId(selectedAppointment?.referal_person);

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayTimingsupdate([]); // Clear day timings in case of an error
    }
  };

  useEffect(() => {
    console.log("isPlusButtonVisible Updated:", isPlusButtonVisible);
  }, [isPlusButtonVisible]);


  const handleEditSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        history.push("/login");
        return;
      }

      // 1. First make the edit API call
      const response = await fetch(`${var_api}appointment/update/${selectedAppointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update appointment");
      }

      const updatedAppointment = await response.json();

      // 2. Send notifications to both patient and doctor
      const notificationData = {
        hospital_id: updatedAppointment.hospital_id,
        patient_id: updatedAppointment.patient_id,
        doc_id: updatedAppointment.doc_id,
        read_status: 0,
      };

      await Promise.all([
        // Patient notification
        fetch(`${var_api}patientnotification/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            ...notificationData,
            title: "Appointment Updated",
            description: "Your appointment details have been modified",
          }),
        }),
        // Doctor notification
        fetch(`${var_api}doctornotification/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            ...notificationData,
            title: "Appointment Modified",
            description: `Appointment with patient ID ${updatedAppointment.patient_id} has been updated`,
          }),
        }),
      ]);

      // 3. Show success and close modal
      notification.success({
        message: "Success",
        description: "Appointment updated successfully!",
      });

      setEditModalVisible(false);
      fetchAppointments(); // Refresh the appointments list

    } catch (error) {
      console.error("Edit error:", error);
      notification.error({
        message: "Error",
        description: error.message || "Failed to update appointment",
      });
    }
  };

  // const handleAppointmentplus = () => {
  //   setEditModalVisibleplus((prev) => !prev);

  //   if (selectedAppointment?.appointment_day) {
  //     console.log("jesi", selectedAppointment);

  //     // Convert "dd-MM-yyyy" to a Date object
  //     const [day, month, year] = selectedAppointment.appointment_day.split("-");
  //     const parsedDate = new Date(`${year}-${month}-${day}`);

  //     // Get day of the week (0 - Sunday, 6 - Saturday)
  //     const dayOfWeek = parsedDate.getDay();

  //     // Pass dayOfWeek when calling handleAppointmentChangeupdate
  //     handleAppointmentChangeupdate(dayOfWeek);
  //     setSelectedDateupdate(parsedDate);
  //   } else {
  //     setSelectedDateupdate(null);
  //   }

  //   if (selectedAppointment?.doctor_specialization_id) {
  //     fetchSpecializationupdateDetails(selectedAppointment?.doctor_specialization_id);

  //     const matchedSpecialization = specialization.find(
  //       (spec) => spec.value.toString() === selectedAppointment.doctor_specialization_id.toString()
  //     );

  //     if (matchedSpecialization) {
  //       setSelectedSpecializationupdateId(matchedSpecialization.value);
  //       setSelectedSpecializationLabel(matchedSpecialization.label);

  //       const matchedDoctor = specializationDetails.find(
  //         (doctor) => doctor.id === selectedAppointment.tech_id
  //       );
  //       setSelectedDoctorupdateId(matchedDoctor ? matchedDoctor.id : "");
  //     } else {
  //       setSelectedSpecializationupdateId("");
  //       setSelectedSpecializationLabel("");
  //       setSelectedDoctorupdateId("");
  //     }
  //   } else {
  //     setSelectedSpecializationupdateId("");
  //     setSelectedSpecializationLabel("");
  //     setSelectedDoctorupdateId("");
  //   }
  // };







  // const handleEditAppointment = (selectedAppointment) => {
  //   if (!selectedAppointment) return;

  //   // Set existing data in state
  //   setSelectedSpecializationupdateId(selectedAppointment.specialization || '');
  //   setSelectedDoctorupdateId(selectedAppointment.doctor || '');
  //   setSelectedDateupdate(selectedAppointment.date ? new Date(selectedAppointment.date) : null);
  //   setSelectedTimeupdate(selectedAppointment.timeId ? { id: selectedAppointment.timeId, available_from_time: selectedAppointment.time } : null);
  //   setReferalPersonupdateId(selectedAppointment.referalPersonId || '');
  //   setIsOthers(selectedAppointment.isOthers || false);
  //   setOtherReferalNameupdate(selectedAppointment.others_name || '');
  //   setOtherReferalMobileupdate(selectedAppointment.others_phone || '');

  //   // Open the modal
  //   setEditModalVisible(true);
  // };

  console.log("mokey", selectedAppointment)


  // Fetch lab options from API
  const fetchLabOptions = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await axios.get(`${var_api}labmaster/get-active-by-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setLabOptions(response.data.map(item => ({ value: item.id, label: item.lab_name })));
      }
    } catch (error) {
      console.error("Error fetching lab options:", error);
    }
  };



  // Initialize state when appointment is selected
 // When loading existing appointment data
useEffect(() => {
  if (selectedAppointment?.services) {
    // Group services by type
    const groupedServices = {
      op: [],
      scan: [],
      investigation: [],
      review: []
    };
    
    selectedAppointment.services.forEach(service => {
      const tab = getTabForServiceType(service.service_type);
      if (tab) {
        groupedServices[tab].push({
          id: service.id || Date.now(),
          service_type_id: service.service_type_id,
          service_name: service.service_name,
          price: service.unit_price,
          qty: service.quantity,
          final_price: service.final_amount,
          is_lab: service.is_lab || 0,
          remarks: service.remark || ''
        });
      }
    });
    
    setTabRows(groupedServices);
  }
}, [selectedAppointment]);

const getTabForServiceType = (type) => {
  switch(type) {
    case 0: return 'op';
    case 1: return 'scan';
    case 2: return 'investigation';
    case 3: return 'review';
    default: return null;
  }
};


  function getStatusBadge(status) {
    switch (status) {
      case 0:
      case 1:
        return <span className="badge status-badge badge-upcoming">Scheduled</span>;
      // case 2:
      //   return <span className="badge status-badge badge-inprogress">Checked-In</span>;
      case 3:
        return <span className="badge status-badge badge-completed">Completed</span>;
      case 4:
      // case 5:
      //   return <span className="badge status-badge badge-cancelled">Cancelled</span>;
      // case 6:
      //   return <span className="badge status-badge badge-revisit">Revisit</span>;
      default:
        return <span className="badge status-badge badge-unknown">Unknown</span>;
    }
  }


  useEffect(() => {
    setReply(datareview[0]?.reply_nontech || ""); // Sync initial value when data changes
  }, [datareview]);




  // Unified change handler
  const handleAppointmentChange = async (field, value) => {
    if (field === "specialization_id") {
      // When specialization is selected, fetch doctors
      setUpdatedAppointment((prev) => ({
        ...prev,
        [field]: value,
        doctor: "", // Reset doctor field when specialization changes
      }));
      if (value) {
        fetchSpecializationDetails(value);
      } else {
        setSpecializationDetails([]); // Clear doctors if no specialization is selected
      }
    } else if (field === "appointment_day") {
      setLoading(true);
      // Format the date to dd-mm-yyyy
      const formattedDate = value instanceof Date
        ? value.toLocaleDateString("en-GB").split('/').reverse().join('-')
        : value;

      console.log("for", formattedDate);
      setUpdatedAppointment((prev) => ({
        ...prev,
        [field]: formattedDate,
      }));

      '' // Get the day of the week for the selected date
      const dayOfWeek = value.toLocaleDateString("en-GB", { weekday: "long" });
      console.log("Day of the week:", dayOfWeek);

      const token = localStorage.getItem("token");
      const doc_id = updatedAppointment.doctor;

      if (!doc_id) {
        notification.success({ message: "Doctor ID is not selected" });
        console.error("Doctor ID is not selected");
        setLoading(false);
        // setDayTimings([]);
        return;
      }

      try {
        // Construct the API URL
        const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${dayOfWeek}`;

        // Fetch data from the API
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: token, // Include token in the header
          },
        });

        const res = response.data;

        // Filter the response data for active slots
        const activeDayTimings = res.filter((timing) => timing.is_active === 1);

        // Update the day timings state
        setDayTimings(activeDayTimings);

        console.log("Available slot timings:", activeDayTimings);
      } catch (error) {
        console.error("Error fetching available slot timings:", error.message);
        setLoading(false);
        // setDayTimings([]); // Clear the timings in case of an error
      }
      finally {
        setLoading(false);
      }
    } else {
      // Handle other fields
      setUpdatedAppointment((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const fetchDatareview = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');

    try {
      const response = await fetch(`${var_api}review/get-admin/${hospital_id}/${selectedAppointment.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
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

      if (result && result.length > 0) {
        setDatareview(result); // ✅ Ensure this updates the state properly
      } else {
        setDatareview([]); // ✅ Prevent UI issues if empty
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



  const handleFormSubmitReview = async (reviewId) => {
    try {
      const hospital_id = localStorage.getItem("hospital_id");
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");

      if (!hospital_id) throw new Error("Hospital ID is not available in localStorage.");
      if (!reviewId) throw new Error("Update operation requires an existing review ID.");

      setLoading(true);

      // Get existing review data to prevent overwriting values
      const existingReview = datareview.find((review) => review.id === reviewId);

      const formData = {
        doc_id: existingReview?.doc_id || 0,
        nontech_id: user_id,
        review_note: existingReview?.review_note || "-", // ✅ Use existing review_note
        rating_count: existingReview?.rating_count || 0, // ✅ Use existing rating_count
        reply: editData?.reply || existingReview?.reply || "",
        reply_tech: editData?.reply_tech || existingReview?.reply_tech || "",
        reply_nontech: reply || existingReview?.reply_nontech || "", // ✅ Ensure updated reply is used
      };

      const url = `${var_api}review/update/${reviewId}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        history.push("/admin/login");
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }

      if (!response.ok) throw new Error(`Error updating review: ${response.statusText}`);

      notification.success({
        message: "Update Successful",
        description: "The review has been successfully updated.",
      });

      // ✅ Reset input fields to avoid stale data issues
      setReply("");
      setEditData(null);

      // ✅ Wait for fetchDatareview to complete before rendering UI
      await fetchDatareview();

    } catch (error) {
      console.error("Error updating review:", error);
      notification.error({
        message: "Operation Failed",
        description: error.message || "There was an error while updating the review.",
      });
    } finally {
      setLoading(false);
    }
  };






  useEffect(() => {
    if (selectedAppointment?.id) {
      fetchDatareview(selectedAppointment.id);
    }
  }, [selectedAppointment]);


  const handleAppointmentChangeupdate = async (dayOfWeek) => {
    const doc_id = selectedDoctorupdateId || selectedAppointment.tech_id;

    console.log("gh", doc_id, selectedDoctorupdateId, selectedAppointment.tech_id)

    if (!doc_id) {
      notification.success({ message: "Doctor ID is not selected" });
      console.error("Doctor ID is not selected");
      setLoading(false);
      setDayTimingsupdate([]);
      return;
    }

    try {
      // Construct the API URL
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${dayOfWeek}`;

      // Fetch data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      const res = response.data;

      // Filter the response data for active slots
      const activeDayTimings = res.filter((timing) => timing.is_active === 1);

      // Update the day timings state
      setDayTimings(activeDayTimings);

      console.log("Available slot timings:", activeDayTimings);
    } catch (error) {
      console.error("Error fetching available slot timings:", error.message);
      setLoading(false);
      setDayTimings([]);
    } finally {
      setLoading(false);
    }
  };


  // Update API call
  const handleUpdateAppointment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const hospital_id = localStorage.getItem("hospital_id");
      console.log("updatedAppointment.tech_id", selectedDoctorupdateId);
      console.log("selectedAppointment.tech_id", selectedAppointment.tech_id);
      console.log("🧠 updatedAppointment BEFORE payload:", updatedAppointment);
      const payload = {
        appointment_day: updatedAppointment.appointment_day,
        appointment_time: updatedAppointment.slot_time,
        slot_time: updatedAppointment.slot_time,
        hospital_id: parseInt(hospital_id),
        doctor: parseInt(selectedDoctorupdateId || selectedAppointment.tech_id),
        referal_person: isOthers
          ? 0
          : updatedAppointment.referal_person || selectedAppointment.referal_person,
        is_other_referal: isOthers ? 1 : 0,
        other_referal_mobile: isOthers
          ? otherReferalMobileupdate
          : updatedAppointment.other_referal_mobile,
        other_referal_name: isOthers
          ? otherReferalNameupdate
          : updatedAppointment.other_referal_name
      };

      console.log("Payload being sent:", payload);

      const response = await fetch(
        `${var_api}appointment/re-update/${selectedAppointment.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) throw new Error('Update failed');

      notification.success({ message: "Update Successful" });
      handleGetpatientAptistotry();
      setEditModalVisible(false);
      setSelectedAppointment((prev) => ({
        ...prev,
        appointment_day: updatedAppointment.appointment_day,
        appointment_time: updatedAppointment.slot_time,
        doctor_name: doctorDetails?.name || prev.doctor_name,
        doctor_specialization: doctorDetails?.specialization || prev.doctor_specialization,
        hospital_id: updatedAppointment.hospital_id,
        referal_person: updatedAppointment.referal_person,
        slot_time: updatedAppointment.slot_time,
        specialization_id: updatedAppointment.specialization_id,
        other_referal_name: payload.other_referal_name,
        other_referal_mobile: payload.other_referal_mobile
      }));
      if (
        rescheduled_by_admin_doctor_email ||
        rescheduled_by_admin_patient_email
      ) {
        await sendEmailReschedule();
      }
      setIsApptEditing(false);
      setUpdatedAppointment(null);

      // ➕ Send Notifications
      const appointmentPrefix = "TK"; // or your actual prefix logic
      const patientDescription = `Your appointment (Token No: ${selectedAppointment?.token_no}) at ${selectedAppointment?.hospital_name} with Dr. ${selectedAppointment?.doctor_name} (${selectedAppointment?.doctor_specialization}) has been updated. New time: ${payload.appointment_day} at ${payload.slot_time}.`;

      const doctorDescription = `Appointment with patient ${selectedAppointment?.patient_name} (Token No: ${appointmentPrefix}${selectedAppointment?.token_no}) has been updated. New schedule: ${payload.appointment_day} at ${payload.slot_time}.`;

      const notifyPayload = {
        hospital_id: hospital_id,
        patient_id: selectedAppointment?.patient_id,
        doc_id: selectedAppointment?.doc_id,
        title: "Appointment Updated",
        description: "", // to be filled per target
        read_status: 0
      };

      // Patient Notification
      await fetch(`${var_api}patientnotification/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...notifyPayload,
          description: patientDescription
        }),
      });

      // Doctor Notification
      await fetch(`${var_api}doctornotification/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...notifyPayload,
          description: doctorDescription
        }),
      });

    } catch (error) {
      console.error("Update Failed:", error);
      notification.error({ message: "Update Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };


  //send email for reschedule
  const sendEmailReschedule = async () => {

    const doctor_id = updatedAppointment.tech_id || selectedAppointment.tech_id;
    // Find selected doctor object
    const selectedDoctorEmail = specializationupdateDetails.find(
      (doc) => doc.id == doctor_id
    );

    const toemails = [];
    if (rescheduled_by_admin_doctor_email && selectedDoctorEmail?.doctor_email) {
      toemails.push(selectedDoctorEmail.doctor_email);
    }

    if (rescheduled_by_admin_patient_email && selectedAppointment?.patient_email) {
      toemails.push(selectedAppointment.patient_email);
    }


    // Prepare the request body
    const requestData = {
      to: toemails,
      subject: "Appointment Reschedule",
      text: "Your appointment has been rescheduled.",
    };

    try {
      const response = await axios.post(
        `${var_api}email-notify/apt-reschedule/${selectedAppointment?.id}/admin`,
        requestData
      );
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };



  const handleSelectTime = (id, fromTime) => {
    if (!id || !fromTime) {
      console.error("Invalid slot time selection:", { id, fromTime });
      return;
    }
    // setSelectedTimeupdate({ id, fromTime });
    setSelectedTime({ id, fromTime });
    handleAppointmentChange('slot_time', fromTime);
  };

  const handleSelectTimeclone = (id, fromTime) => {
    if (!id || !fromTime) {
      console.error("Invalid slot time selection:", { id, fromTime });
      return;
    }
    // setSelectedTimeupdate({ id, fromTime });
    setSelectedTimeclone({ id, fromTime });
    handleAppointmentChange('slot_time', fromTime);
  };

  const handleSelectTimeupdate = (id, fromTime) => {
    if (!id || !fromTime) {
      console.error("Invalid slot time selection:", { id, fromTime });
      return;
    }
    setSelectedTimeupdate({ id, fromTime });
    // setSelectedTime({ id, fromTime });
    handleAppointmentChange('slot_time', fromTime);
  };




  // Handles form submission
  const handleMedFormSubmit = async (values) => {
    setLoading(true);
    console.log("Form Submitted:", values);

    // Prepare payload with conditional values
    const payload = {
      ...values,
      others: values.others ? values.others : '',
      cheif_complaints: values.cheif_complaints ? values.cheif_complaints : '',
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${var_api}patientmedicalhistory/update/${selectedAppointment?.patient_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
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

      setIsMedEditing(false); // Exit edit mode after submission
      setIsModalOpen(false);

    } catch (error) {
      setLoading(false);
      console.error("Error updating data:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update the patient medical history. Please try again.",
      });
    }
    finally {
      setLoading(false);
    }

  };


  // const [serviceTypes, setServiceTypes] = useState([
  //   { id: 1, name: "", price: 0, quantity: 1, finalPrice: 0, instruction: "" },
  // ]);

  const [rows, setRows] = useState([{
    id: Date.now(), // Unique identifier for each row
    service_type_id: null,
    service_type: 0,
    price: 0,
    qty: 1,
    final_price: 0,
    remarks: '',
    discount: 0
  }]);

 const [tabRows, setTabRows] = useState({
  op: [createEmptyServiceRow(0)],
  scan: [createEmptyServiceRow(1)],
  investigation: [createEmptyServiceRow(2)],
  review: [createEmptyServiceRow(3)]
});


// Get current tab's rows - returns an array
const getCurrentRows = () => {
  return tabRows[activeTab] || [];
};

// Handle adding new row for current tab
// const handleAddNewRow = () => {
//   const newRow = {
//     id: Date.now(),
//     service_type_id: null,
//     service_name: '',
//     price: 0,
//     qty: 1,
//     final_price: 0,
//     is_lab: 0,
//     remarks: ''
//   };
  
//   setTabRows(prev => ({
//     ...prev,
//     [activeTab]: [...(prev[activeTab] || []), newRow]
//   }));
// };
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

// Handle quantity change for current tab
const handleQtyChange = (rowId, change) => {
  setTabRows(prev => ({
    ...prev,
    [activeTab]: (prev[activeTab] || []).map(row =>
      row.id === rowId
        ? {
            ...row,
            qty: Math.max(1, (row.qty || 1) + change),
            final_price: row.price * Math.max(1, (row.qty || 1) + change)
          }
        : row
    )
  }));
};


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

  const [medications, setMedications] = useState([{
    id: Date.now(),
    sub_cat_id: null,
    unit_price: 0,           // ✅ safer default
    is_before_food: 0,
    cycle: 0,
    remarks: '',
    is_morning: 0,
    is_evening: 0,
    is_noon: 0,
    is_night: 0
  }]);
  const beforeAfter = [
    { value: 1, label: 'Before food' },
    { value: 0, label: 'After food' },
  ];


  // Handle adding a new medication row
  const handleAddNewMedication = () => {
    const newMedication = {
      id: Date.now(), // Unique ID
      sub_cat_id: null,
      unit_price: null,
      is_before_food: 0,
      cycle: 0,
      remarks: '',
      is_morning: 0,
      is_evening: 0,
      is_noon: 0,
      is_night: 0,
    };
    setMedications([...medications, newMedication]);
  };


  const handleDeleteMedication = (id) => {
    setMedications(medications.filter((medication) => medication.id !== id)); // Remove row by ID
  };


  // Sort medications by descending ID
  const sortedMedications = [...medications].sort((a, b) => b.id - a.id);


  // Handle when a medication is selected
  const handleMedicationSelect = (id, selectedOption) => {
    // Update the medications array by finding the medication with the matching id
    const updatedMedications = medications.map((medication) =>
      medication.id === id
        ? {
          ...medication, // spread the existing properties
          sub_cat_id: selectedOption.value, // update sub_cat_id
          unit_price: selectedOption.price, // update unit_price
        }
        : medication // leave other medications unchanged
    );

    setMedications(updatedMedications); // update state
    console.log("Updated medications", updatedMedications);
  };


  //fetch service list
  const fetchToothHistory = async (patient_id, tech_id) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get(
        `${var_api}appointment/get-appointment-list/dental-chart/${tech_id}/${hospital_id}/${patient_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Map API data to Select component options
      const options = response.data;

      setToothHistory(options || []);
      handleGetpatientAptistotry();
    } catch (err) {
      console.error("Error fetching medicine subcategories:", err);
      //   setError(err.message || "An error occurred.");
    }
  };



  //fetch service list
  const fetchServicesSubcategories = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get(
        `${var_api}serviceType/getby-hospital/${hospital_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Map API data to Select component options
      const options = response.data.map((item) => ({
        value: item.id, // Replace `id` with your unique identifier field
        label: item.service_name, // Replace `name` with your display field
        price: item.charge_amount,
        service_type: item.service_type,
        is_lab: item.is_lab
      }));

      setServiceTypes(options);
    } catch (err) {
      console.error("Error fetching medicine subcategories:", err);
      //   setError(err.message || "An error occurred.");
    }
  };


  //fetch settings details
  const fetchSettingDetails = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}settings/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/admin/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setSettings(result || {});

      console.log("oa", result)
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    }
    finally {
      setLoading(false);
    }
  };


  //fetch medicines list
  const fetchMedicineSubcategories = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get(
        `${var_api}medicinesubcategory/getby-hospital/${hospital_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Map API data to Select component options
      const options = response.data.map((item) => ({
        value: item.id, // Replace `id` with your unique identifier field
        label: item.name, // Replace `name` with your display field
        price: item.price,
      }));

      setMeditions(options);
    } catch (err) {
      console.error("Error fetching medicine subcategories:", err);
      //   setError(err.message || "An error occurred.");
    }
  };



//   // Handle adding a new row
//   const handleAddNewRow = () => {
//   const newRow = {
//     id: Date.now(),
//     service_type_id: null,
//     service_name: '',
//     price: 0,
//     qty: 1, // Default quantity
//     final_price: 0,
//     remarks: ''
//   };
//   setRows([...rows, newRow]);
// };

// // Handle row deletion
// const handleDeleteRow = (rowId) => {
//   if (sortedRows.length <= 1) {
//     notification.warning({
//       message: "Cannot delete",
//       description: "At least one service must remain"
//     });
//     return;
//   }

//   setRows(prevRows => prevRows.filter(row => row.id !== rowId));
// };

  const handleExistingAddNewRow = () => {
    const newRow = {
      id: Date.now(), // Unique identifier for each row
      service_type_id: null,
      service_type: 0,
      price: 0,
      qty: 1,
      final_price: 0,
      remarks: '',
      discount: 0
    };
    setRows([...rows, newRow]); // Add the new row at the top
    console.log("rw", rows)
    setIsEnable(true);

  }

  // Sort rows by descending ID
  const sortedRows = [...rows].sort((a, b) => b.id - a.id);


  // Handle deleting a row
  // const handleDeleteRow = (id) => {
  //   setRows(rows.filter((row) => row.id !== id)); // Remove the row by ID
  // };

  const handleDeleteCancel = () => {
    setDeleteConfirmVisible(false);
  };

  const showDeleteModal = () => {
    console.log("apt before cancel", selectedAppointment);
    setDeleteConfirmVisible(true);
  };

  // const handleDeleteclick = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await fetch(`${var_api}appointment/delete/${selectedAppointment.id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `${token}`, // Replace with actual token if needed
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to delete appointment");
  //     }

  //     //alert("Appointment deleted successfully!");
  //     setDeleteConfirmVisible(false); // Close the modal after successful deletion
  //     fetchData(startDate, endDate, selectedDoctorsId, selectedPatientsId);

  //     // Optionally, update the UI or refresh the list here
  //   } catch (error) {
  //     console.error("Error deleting appointment:", error);
  //     //alert("An error occurred while deleting the appointment.");
  //   }
  // };



  //handle onchange for service change

// In your component, modify the handleServiceChange function:
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

  const handleConfirmCancel = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const description = `Your appointment (Token No: ${selectedAppointment.token_no}) at ${selectedAppointment.hospital_name} with Dr. ${selectedAppointment.doctor_name} (${selectedAppointment.doctor_specialization}) on ${selectedAppointment.appointment_day} at ${selectedAppointment.slot_time} has been cancelled successfully. If you need to reschedule, please contact ${selectedAppointment.hospital_name} at ${selectedAppointment.hospital_mobile}.`;

    try {
      console.log("Cancelling appointment...");

      // First, update the appointment status
      const response = await fetch(
        `${var_api}appointment/status-update/${selectedAppointment?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            status: 4,
            apt_start_time: "00:00:00",
            apt_end_time: "00:00:00",
          }),
        }
      );

      if (response.status === 401) {
        history.push("/admin/patientlogin");
        return;
      }

      const responseData = await response.json();

      if (response.status === 200) {
        console.log("Status updated successfully:", responseData);

        // Send notifications to both patient and doctor
        try {
          // Patient notification
          await fetch(`${var_api}patientnotification/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              hospital_id: selectedAppointment?.hospital_id,
              patient_id: selectedAppointment?.patient_id,
              doc_id: selectedAppointment?.doc_id,
              title: "Appointment Cancelled",
              description: description,
              read_status: 0
            }),
          });

          // Doctor notification
          await fetch(`${var_api}doctornotification/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              hospital_id: selectedAppointment?.hospital_id,
              patient_id: selectedAppointment?.patient_id,
              doc_id: selectedAppointment?.doc_id,
              title: "Appointment Cancelled",
              description: `The appointment with Patient ${selectedAppointment?.patient_name} (Token No: ${appointmentPrefix}${selectedAppointment?.token_no}) scheduled on ${selectedAppointment?.appointment_day} at ${selectedAppointment?.slot_time} has been cancelled.`,
              read_status: 0
            }),
          });

        } catch (notificationError) {
          console.error("Error sending notifications:", notificationError);
        }

        setDeleteConfirmVisible(false);

        notification.success({
          message: "Success",
          description: "Appointment cancelled successfully!",
        });

        if (iscancelledbyadminemail) {
          await sendEmailCancel();
        }
      } else {
        console.error("Unexpected response status:", response.status, responseData);
      }
    } catch (error) {
      console.error("Error updating the status:", error);
    }

    setLoading(false);
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
          patient: installDetails?.patient ?? false,
          servicetype: installDetails?.servicetype ?? false,
          uom: installDetails?.uom ?? false,
          category: installDetails?.category ?? false,
          brand: installDetails?.brand ?? false,
          medicine: installDetails?.medicine ?? false,
          paymodemaster: installDetails?.paymodemaster ?? false,
          makeappointment: 1,
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
        //                 if (installDetails?.makeappointment !== 1) {
        //   setIsModalpop(true);
        // }
        fetchinstalldata(); // Open modal only on success
      } else {
        console.error("Failed to update installation:", responseText);
      }

    } catch (err) {
      console.error("Error updating techstaff:", err);
    }
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
      console.log("availabletime value:", firstItem?.makeappointment);

      // ✅ Save installation_id in localStorage if it exists
      if (firstItem?.id) {
        localStorage.setItem("installation_id", firstItem.id);
        console.log("Saved installation_id:", firstItem.id); // ✅ confirm this
      }


      setData(result || []);
      if (firstItem?.makeappointment === 0) {
        console.log("Modal should show: availabletime is 0");
        setIsModalInsta(true);
      } else {
        console.log("Modal not triggered: availabletime is not 0");
        setIsModalInsta(false);
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


  //send email for cancellation
  const sendEmailCancel = async () => {

    const toemails = [selectedAppointment?.patient_email, selectedAppointment?.doctor_email]
    // Prepare the request body
    const requestData = {
      to: toemails,
      subject: "Appointment Cancellation",
      text: "Your appointment has been cancelled.",
    };

    try {
      const response = await axios.post(
        `${var_api}email-notify/apt-cancel/${selectedAppointment?.id}/admin`,
        requestData
      );
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


  const handleClick = async () => {
    if (!selectedRecord) {
      console.error("No selected record found.");
      return;
    }



    const payload = {
      hospital_id: selectedRecord.hospital_id,
      patient_id: selectedRecord.patient_id,
      doc_id: selectedRecord.tech_id,
      title: `Payment Status `,
      description: `Payment status updated to .`,
      read_status: 0, // Unread status
    };

    const token = localStorage.getItem("token");

    console.log("Sending notification:", payload); // Debugging log

    try {
      const response = await fetch(`${var_api}patientnotification/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification - Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Notification sent:", result);
      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send notification");
    }
  };



  //Handle Quantity
//   const handleQtyChange = (rowId, change) => {
//   setRows(prevRows =>
//     prevRows.map(row =>
//       row.id === rowId
//         ? {
//             ...row,
//             qty: Math.max(1, (row.qty || 1) + change), // Ensure minimum quantity of 1
//             final_price: row.price * Math.max(1, (row.qty || 1) + change)
//           }
//         : row
//     )
//   );
// };

  const handleDateChange = async (date) => {
    console.log("entered date", date);
    if (!date) {
      setSelectedDate(null);
      // setDayTimings([]); // Clear available timings when date is cleared
      return;
    }

    // const docoid = selectedDoctorId || firstDoctor;

    // if (!docoid) {
      // notification.error({
      //   message: "Error",
      //   description: "Please select a doctor.",
      // });
    //   return;
    // }

    setSelectedDate(date); // Update the selected date in state
    console.log("Selected date:", date); // Log the selected date

    // Get the day of the week for the selected date
    // const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'long' });
    // const token = localStorage.getItem("token");
    // // const doc_id = selectedDoctorId;

    // try {
    //   // Construct the API 
    //   const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${docoid}/${dayOfWeek}`;

    //   // Fetch data from the API
    //   const response = await axios.get(apiUrl, {
    //     headers: {
    //       Authorization: token, // Include token in the header
    //     },
    //   });

    //   // Filter the response data for is_active: 1
    //   const activeDayTimings = response.data.filter((timing) => timing.is_active === 1);
    //   setDayTimings(activeDayTimings);

    //   console.log("API Response:", response.data);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    //   setDayTimings([]); // Clear response in case of an error
    // }
  };


    //get doctors list by hospital id
  const fetchSlotMaster = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${var_api}gos-slot/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Add the 'Bearer ' prefix before the token
        },
      });

      if (response.status === 401) {
        // history.push("/template/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      // Only keep entries where is_active === 1
const activeTimings = (result || []).filter(item => item.is_active == 1);
console.log("activeTimings", activeTimings)
      setDayTimings(activeTimings || []);
      setLoading(false);
      // Set the first doctor as selected

      // setFilteredData(result || []); // Set initial filtered data
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


   const fetchPrivateSlotMaster = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${var_api}gos-slot/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Add the 'Bearer ' prefix before the token
        },
      });

      if (response.status === 401) {
        // history.push("/template/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      // Only keep entries where is_active === 1
const activeTimings = (result || []).filter(item => item.is_active == 1);
console.log("activeTimings", activeTimings)
      setPrivateSlotList(activeTimings || []);
      setLoading(false);
      // Set the first doctor as selected

      // setFilteredData(result || []); // Set initial filtered data
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


  const handleDateChangeclone = async (date) => {
    if (!date) {
      setSelectedDateclone(null);
      setDayTimingsclone([]); // Clear available timings when date is cleared
      return;
    }

    if (!selectedDoctorId) {
      // notification.error({
      //   message: "Error",
      //   description: "Please select a doctor.",
      // });
      return;
    }

    setSelectedDateclone(date); // Update the selected date in state
    console.log("Selected date:", date); // Log the selected date

    // Get the day of the week for the selected date
    const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'long' });
    const token = localStorage.getItem("token");
    const doc_id = selectedDoctorId;

    try {
      // Construct the API 
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${dayOfWeek};`;

      // Fetch data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      // Filter the response data for is_active: 1
      const activeDayTimings = response.data?.filter((timing) => timing.is_active === 1);
      setDayTimingsclone(activeDayTimings);

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayTimingsclone([]); // Clear response in case of an error
    }
  };



  const handleDateChangeupdate = async (date) => {

    console.log("hhh", selectedDoctorupdateId)
    if (!selectedDoctorupdateId) {
      // notification.error({
      //   message: "Error",
      //   description: "Please select a doctor.",
      // });
      return;
    }


    setSelectedDateupdate(date); // Update the selected date in state
    console.log("Selected date:", date); // Log the selected date

    // Get the day of the week for the selected date
    const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'long' });
    const token = localStorage.getItem("token");
    const doc_id = selectedDoctorupdateId;
    try {
      // Construct the API 
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${dayOfWeek}`;

      // Fetch data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      // Filter the response data for is_active: 1
      const activeDayTimings = response.data?.filter((timing) => timing.is_active == 1);
      setDayTimingsupdate(activeDayTimings);

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayTimingsupdate([]); // Clear the response in case of an error
    }
  };



  //to change date format like dd-mm-yyyy
  // const formatDate = (date) => {
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`
  // }; 
  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      console.error("Invalid date provided to formatDate:", date);
      return ""; // Return an empty string to prevent errors
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };


  // useEffect(() => {
  //   fetchDoctorData();

  // }, [selectedDoctorId]);


  useEffect(() => {
    fetchinstalldata();
    fetchData();
    fetchSlotMaster();
    fetchPrivateSlotMaster();
    // fetchDoctorData();
    fetchPatientData();
    fetchSettingDetails();
    fetchSpecialization();
    fetchServicesSubcategories();
    fetchMedicineSubcategories();
    const date = new Date();
    const formattedDate = date.toLocaleDateString(); // Formats the date in dd/mm/yyyy format (you can adjust it as per your requirement)
    const formattedTime = date.toLocaleTimeString(); // Formats the time as hh:mm:ss AM/PM
    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
    fetchReferalDetails();
    fetchpaymode();
  }, []);

  const fetchData = async (start_date, end_date, patient_id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${var_api}appointment/gos-appointments-status/${hospital_id}/${start_date}/${end_date}/${patient_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 401) return;

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);

      // Debugging: Check if status values are correct
      console.log("Raw Data:", result);

      // Filter and sort data
      let filterData = localSelectedValue == 7 ? result : result.filter((item) => item.status == selectedStatus);

      // filterData.sort((a, b) => {
      //   const statusOrder = { "0": 1, "3": 3 }; // 0 (Upcoming) first, 3 (Completed) last
      //   const aStatus = statusOrder[a.status] || 2; // Default 2 for other statuses
      //   const bStatus = statusOrder[b.status] || 2;

      //   if (aStatus !== bStatus) return aStatus - bStatus; // Sort by status order

      //   // Sort by time if status is the same
      //   return a.appointment_time.localeCompare(b.appointment_time);
      // });

      console.log("Sorted Data:", filterData);
      setFilteredData(filterData);
      // setIsPlusButtonVisible(false);
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



  //get doctors list by hospital id
  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${var_api}technicalstaff/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Add the 'Bearer ' prefix before the token
        },
      });

      if (response.status === 401) {
        // history.push("/template/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setDoctorList(result || []);
      setLoading(false);
      // Set the first doctor as selected
      if (result.length > 0 || !isApptEditing) {
        const firstDoctorId = result[0].id;
        // setSelectedDoctorsId(firstDoctorId); // Set selected doctor's ID
        const start_date = startDate ? formatDate(startDate) : formatDate(initialSettingsApt.startDate);
        const end_date = endDate ? formatDate(endDate) : formatDate(initialSettingsApt.endDate);
        //       const start_date = startDate ? formatDate(startDate) : null;
        // const end_date = endDate ? formatDate(endDate) : null;

        await fetchData(start_date, end_date); // Fetch data for the first doctor
      }
      // setFilteredData(result || []); // Set initial filtered data
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


  //get doctors list by hospital id
  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${var_api}patientdetails/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Add the 'Bearer ' prefix before the token
        },
      });

      if (response.status === 401) {
        // history.push("/template/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setPatientList(result || []);
      setLoading(false);
      // Set the first doctor as selected

      // setFilteredData(result || []); // Set initial filtered data
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

  const fetchSpecialization = async () => {
    setLoading(true);
    const hospital_id = localStorage.getItem('hospital_id');
    const token = localStorage.getItem('token');
    try {
      // const response = await fetch(`${var_api}specialization/getby-hospital/${hospital_id}`, {
      const response = await fetch(`${var_api}specialization/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Add the 'Bearer ' prefix before the token
        },
      });

      if (response.status === 401) {
        // Redirect or handle unauthorized access
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      const formattedSpecialization = result.map(specialization => ({
        label: specialization.name, // Use 'name' as the label
        value: specialization.id, // Use 'id' as the value
      })) || []
      setSpecialization(
        formattedSpecialization
      );
      setSpecializationClone(formattedSpecialization)

      // Fetch details for the first specialization
      if (formattedSpecialization.length > 0) {
        const firstSpecializationId = formattedSpecialization[0].value;
        setSelectedSpecializationId(firstSpecializationId);
        fetchSpecializationDetails(firstSpecializationId); // Fetch doctor list for the first specialization
        setSelectedCloneSpecializationId(firstSpecializationId);
        fetchCloneSpecializationDetails(firstSpecializationId);
      }
      //setSpecialization(result);
      //fetchSpecializationDetails(result[0].id);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchSpecializationDetails(specialization[0]?.id);
  // }, [specialization]);


  const fetchSpecializationDetails = async (specializationId) => {
    setLoading(true);
    if (!specializationId) return;

    const hospital_id = localStorage.getItem('hospital_id');
    const token = localStorage.getItem('token');

    console.log("Fetching doctors for specialization ID:", specializationId); // Debugging
    console.log("API Endpoint:", `${var_api}technicalstaff/technical/specialization/${hospital_id}/${specializationId}`); // Debugging

    try {
      const response = await fetch(`${var_api}technicalstaff/technical/specialization/${hospital_id}/${specializationId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      console.log("API Response Status:", response.status); // Debugging

      if (!response.ok) throw new Error("Failed to fetch doctor details");

      const result = await response.json();
      console.log("API Response (Raw):", result); // Debugging

      // Check if the response contains doctor data
      if (result.length === 0) {
        console.log("No doctors found for the selected specialization.");
        // setSelectedDoctorId(null);
        setSpecializationDetails([]); // Clear the list
        return;
      }

      setDoctorsList(result);
      // Transform the response if necessary
      const formattedDoctors = result.map(doctor => ({
        id: doctor.id, // Use the correct field from the API response
        name: doctor.name, // Use the correct field from the API response
      }));
      console.log("Formatted Doctors:", formattedDoctors); // Debugging

      setSpecializationDetails(formattedDoctors); // Update state with the list of doctors

      // Set the first doctor as selected (optional)
      if (formattedDoctors.length > 0) {
        const firstDoctorId = formattedDoctors[0].id;
        console.log("First Doctor ID:", firstDoctorId); // Debugging
        setSelectedDoctorupdateId(firstDoctorId);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setSpecializationDetails([]); // Clear the list in case of an error
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializationcloneDetails = async (specializationId) => {
    if (!specializationId) return;

    setLoading(true);
    const hospital_id = localStorage.getItem("hospital_id");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${var_api}technicalstaff/technical/specialization/${hospital_id}/${specializationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch doctor details");

      const result = await response.json();

      if (!result.length) {
        setSpecializationcloneDetails([]);
        setSelectedDoctorcloneId("");
        return;
      }

      const formattedDoctors = result.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
      }));

      setSpecializationcloneDetails(formattedDoctors);
      setSelectedDoctorcloneId(formattedDoctors[0]?.id || ""); // Set first doctor if available
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setSpecializationcloneDetails([]);
      setSelectedDoctorcloneId("");
    } finally {
      setLoading(false);
    }
  };





  const fetchSpecializationupdateDetails = async (specializationId) => {
    if (!specializationId) return;

    const hospital_id = localStorage.getItem('hospital_id');
    setLoading(true);
    try {
      const response = await fetch(`${var_api}technicalstaff/technical/specialization/${hospital_id}/${specializationId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch details");

      const result = await response.json();
      setSpecializationupdateDetails(result); // Store the details of the selected specialization

    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSpecializationChange = (selectedOption) => {
    const specializationId = selectedOption.value;
    console.log("Selected Specialization ID:", specializationId); // Debugging

    setSelectedSpecializationId(specializationId); // Update selected specialization ID
    fetchSpecializationDetails(specializationId); // Fetch doctors for the selected specialization
  };
  const handleSpecializationcloneChange = (value) => {
    setSelectedSpecialization(value);
    setSelectedDoctorcloneId(""); // Reset doctor field
    setSpecializationcloneDetails([]);
    if (value) fetchSpecializationcloneDetails(value);
  };


  const handleSpecializationChangeupdate = (event) => {
    const selectedValue = event.target.value; // Extract value from event
    setSelectedSpecializationupdateId(selectedValue); // Store specialization ID
    fetchSpecializationDetails(selectedValue); // Fetch doctors based on specialization
    console.log("Selected Specialization ID:", selectedValue);
  };


  useEffect(() => {
    if (specialization.length > 0) {
      setSelectedSpecialization(specialization[0].value); // Set first specialization
      fetchSpecializationcloneDetails(specialization[0].value);
    }
  }, [specialization]);




  const handleModalOpen = () => {
    setIsModalVisible(true); // Show the modal
    console.log("dat", dayTimings);
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModal = (record) => {
    setSelectedRecord(record); // Set the selected row data
    setFormData(record);
    setIsModal(true); // Open the modal
  };

  //open history moda;
  const handleDentalHistoryModal = (record) => {
    fetchHistoryToothDirections(record.appoinment_id)
    setSelectedToothHistory(record);
    setIsOpenHistoryChart(true);
    setIsEndSessionModalVisible(false);
    console.log("rrr", record);
  };

  const closeModal = () => {
    setIsModal(false);
    setSelectedRecord(null);
  };

  const handleInputChange = (inputValue, { action }) => {
    // const numericInput = inputValue.replace(/[^0-9]/g, "");
    // If sanitized input differs, it means there were non-numeric characters
    // if (numericInput !== inputValue) {
    //   notification.error({
    //     message: "Error",
    //     description: "Only numbers are allowed.",
    //   });;
    // }

    if (action === 'input-change' && /^\d{0,10}$/.test(inputValue)) {
      setCustomerMobile(inputValue);
      setPatientDetails(null); // Clear patient details when the input changes
      if (inputValue.length >= 2) {
        // Fetch matching mobile numbers for partial input
        fetchPatientDetailsByNumber(inputValue);
      }
    }
  };

  const handleMobileChange = (selectedOption) => {
    const mobileNumber = selectedOption ? selectedOption.value : '';
    setCustomerMobile(mobileNumber);
    setPatientDetails(null); // Clear patient details when the selection changes

    if (mobileNumber.length === 10) {
      // Fetch full details on valid mobile number selection
      // fetchPatientDetailsByNumber(mobileNumber, selectedOption.label); // Pass the name along with the number
      const name = selectedOption.label.split(" (")[0];  // Extract only the name part before the parentheses
      fetchPatientDetailsByNumber(mobileNumber, name);
      console.log("abcdef", mobileNumber, name);
    }
  };


  const handleReferalChange = (selectedOption) => {
    const mobileNumber = selectedOption ? selectedOption.value : '';
    console.log("referal person", selectedOption, mobileNumber);
    setReferalPersonId(mobileNumber);
  };

  const handleReferalChangeupdate = (selectedOption) => {
    const mobileNumber = selectedOption ? selectedOption.value : '';
    console.log("referal person", selectedOption, mobileNumber);
    setReferalPersonupdateId(mobileNumber);
    setUpdatedAppointment(prev => ({
      ...prev,
      referal_person: mobileNumber,
    }));

  };

  const fetchPatientDetailsByNumber = async (number, name) => {
    setLoading(true);
    const hospital_id = localStorage.getItem("hospital_id");
    try {
      const response = await fetch(`${var_api}patientdetails/get-bypatient-number/${hospital_id}/${number}`, {
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
      console.log("abc", number);
      console.log("abc", name);
      // If the input is a full mobile number, find the matching patient
      if (number.length === 10) {
        const matchedPatient = result.find(patient => patient.mobile_no === number && patient.name === name);
        console.log("abc", matchedPatient);

        if (matchedPatient) {
          setPatientDetails(matchedPatient); // Set the patient details if found
        } else {
          setPatientDetails(null); // No match found
        }
      } else {
        // If the input is partial, set mobile options for dropdown
        const options = result.map((item) => ({
          label: `${item.name} (${item.mobile_no})`, // Display both name and mobile number
          value: item.mobile_no, // Use mobile number as value
        }));
        setMobileOptions(options);
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };


  //gettting referal master
  const fetchReferalDetails = async () => {
    setLoading(true);
    const hospitalid = localStorage.getItem("hospital_id")
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
      setReferalPersonsupdate(options);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };




  //gettting referal master
  const fetchToothDirections = async (aptId) => {
    setLoading(true);
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}commondentalchart/get-by-direction/${hospital_id}/${aptId}`, {
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
      console.log("abctr", result);
      setToothDirections(result);
    } catch (error) {
      console.error('Error fetching tooth details:', error);
    } finally {
      setLoading(false);
    }
  };


  //gettting referal master
  const fetchHistoryToothDirections = async (aptId) => {
    setLoading(true);
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}commondentalchart/get-by-direction/${hospital_id}/${aptId}`, {
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
      console.log("abctr", result);
      setHistoryToothDirections(result);
    } catch (error) {
      console.error('Error fetching tooth details:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleAddPatientClick = () => {
    history.push({
      pathname: '/admin/patientdetails',
      state: { openModal: true, customerMobile },
    });
  };
  const handleAddModal = () => {
    if (selectedCardData) {
      // Open the modal with the selected card data
      setModals([...modals, { id: Date.now(), data: selectedCardData }]);
    }
  };

  const options = [
    { value: 7, label: "All" },
    { value: 0, label: "Scheduled" },
    // { value: 1, label: "Reached Hospital" },
    // { value: 2, label: "Checked-In" },
    { value: 3, label: "Completed" },
    // { value: 4, label: "Cancel by Hospital" },
    // { value: 5, label: "Cancel by Patient" },
    // { value: 6, label: "Revisit For Report" },
  ];

  function getStatusBadge(status) {
    switch (status) {
      case 0:
      case 1:
        return <span className="badge status-badge badge-upcoming">Scheduled</span>;
      // case 2:
      //   return <span className="badge status-badge badge-inprogress">Checked-In</span>;
      case 3:
        return <span className="badge status-badge badge-completed">Completed</span>;
      // case 4:
      // case 5:
      //   return <span className="badge status-badge badge-cancelled">Cancelled</span>;
      // case 6:
      //   return <span className="badge status-badge badge-revisit">Revisit</span>;
      default:
        return <span className="badge status-badge badge-unknown">Unknown</span>;
    }
  }
  // const columns = [
  //   {
  //     title: "S.No", // Serial number column
  //     key: "sno", // Unique key for the column
  //     render: (_, __, index) => index + 1, // Calculate serial number based on index
  //   },
  //   {
  //     title: "Patient Name",
  //     dataIndex: "patient_name",
  //     render: (text) => (text ? text : "N/A"),
  //     sorter: (a, b) => a.name?.localeCompare(b.name),
  //   },
  //   {
  //     title: "Doctor",
  //     dataIndex: "doctor_name",
  //     render: (text, record) => (
  //       <div>
  //         <div>{text ? text : "N/A"}</div>
  //         <div>{record.doctor_specialization ? record.doctor_specialization : "N/A"}</div>
  //       </div>
  //     ),
  //   },    
  //   {
  //     title: "Appointment Day",
  //     dataIndex: "appointment_day",
  //     render: (text) => (text ? text : "N/A"),
  //   },
  //   {
  //     title: " Appointment Time",
  //     dataIndex: "appointment_time",
  //     render: (text) => (text ? text : "N/A"),
  //   },
  //   {
  //     title: "Payment Status",
  //     dataIndex: "payment_status",
  //     render: (text) => (text === 0 ? "Not Paid" : text === 1 ? "Paid" : "N/A"),
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     render: (status) => {
  //       const statusOption = options.find((option) => option.value === status);
  //       return statusOption ? statusOption.label : "N/A";
  //     },
  //   },    
  //   {
  //     title: "Vital Details", // New column for vital details
  //     key: "vital_details", // Key for the new column
  //     render: (_, record) => (
  //       <Button
  //         icon={<EyeOutlined />}
  //         type="primary"
  //         onClick={() => handleModal(record)} // Opens modal with row data
  //       />
  //     ),
  //   },
  // ];


  const handleStatusChange = (value) => {
    // console.log(value);
    // setSelectedStatus(value);
    // localStorage.setItem('selectedStatus', value.value);
    // const filterData = value.value === 7 ? data : data.filter((item) => item.status === value.value);
    // setFilteredData(filterData);
    // console.log("statusa", value, localStorage.getItem('selectedStatus'));
    // setIsPlusButtonVisible(false);
    console.log(value);
    if (value) {
      setSelectedStatus(value);
      localStorage.setItem('selectedStatus', value.value);
      const filterData = value.value === 7 ? data : data?.filter((item) => item.status === value.value);
      setFilteredData(filterData);
    } else {
      // If cleared, reset state and remove from localStorage
      setSelectedStatus(null);
      localStorage.removeItem('selectedStatus');
      setFilteredData(data); // Show all data when cleared
    }
    console.log("statusa", value, localStorage.getItem('selectedStatus'));
    setIsPlusButtonVisible(false);
  };

  // const handleStatusChange = (selectedOption) => {
  //   const selectedStatus = selectedOption.value;  // Get selected status value

  //   // Filter data based on selected status
  //   const filtered = filteredData.filter(record => {
  //     // If 'All' is selected, return all records
  //     if (selectedStatus === 7) return true;

  //     return record.status === selectedStatus; // Filter based on status
  //   });

  //   // Update the filtered data
  //   setFilteredData(filtered);
  // };


  // 👉 Auto-load doctor with role "doctor" on component mount
  useEffect(() => {
    const fetchFirstDoctor = async () => {
      try {
        const doctorApiUrl = `${var_api}technicalstaff/get-by-doctor/${hospital_id}/doctor`;

        const response = await axios.get(doctorApiUrl, {
          headers: { Authorization: token },
        });

        const doctors = response.data;

        if (doctors && doctors.length > 0) {
          const firstDoctorId = doctors[0].id;
          setFirstDoctor(firstDoctor);
          handleDoctorChange(firstDoctorId); // Call internal handler
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchFirstDoctor();
  }, []);




  const handleDoctorChange = async (doctorId) => {
    // const doctorId = event.target.value;
    console.log("do", doctorId)
    setSelectedDoctorId(doctorId); // Update selected doctor ID

    // Ensure selectedDate is a valid Date object; if not, set it to today
    const dateObj = selectedDate instanceof Date && !isNaN(selectedDate) ? selectedDate : new Date();
    setSelectedDate(dateObj); // Update selected date if it was invalid

    // Get the day of the week
    const dayOfWeek = dateObj.toLocaleDateString("en-GB", { weekday: "long" });

    try {
      // Construct the API URL
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doctorId}/${dayOfWeek}`;

      // Fetch data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      // Filter the response data for active timings
      const activeDayTimings = response.data?.filter((timing) => timing.is_active === 1);
      // setDayTimings(activeDayTimings); // Update state with active timings

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setDayTimings([]); // Clear day timings in case of an error
    }
  };


  const handleDoctorChangeupdate = async (event) => {
    setSelectedDoctorupdateId(event.target.value); // Update state when a doctor is selected
    // handleDateChange(selectedDate);


    // Get the day of the week for the selected date
    const dayOfWeek = selectedDateupdate.toLocaleDateString('en-GB', { weekday: 'long' });
    const token = localStorage.getItem("token");
    const doc_id = selectedDoctorupdateId;
    try {
      // Construct the API 
      const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${dayOfWeek}`;

      // Fetch data from the API
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token, // Include token in the header
        },
      });

      // Filter the response data for is_active: 1
      const activeDayTimings = response.data?.filter((timing) => timing.is_active == 1);
      setDayTimingsupdate(activeDayTimings);

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayTimingsupdate([]); // Clear the response in case of an error
    }
  };

  // const handleBookNowClick = async (values) => {
  //   // 1. Validate all required data
  //   if (!patientDetails || !patientDetails.id || !patientDetails.name) {
  //     notification.error({
  //       message: "Error",
  //       description: "Please complete patient details before booking",
  //     });
  //     return;
  //   }

  //   if (!selectedDoctorId) {
  //     notification.error({
  //       message: "Error",
  //       description: "Please select a doctor",
  //     });
  //     return;
  //   }
  //   const description = `Your appointment (Token No: ${selectedAppointment?.token_no}) at ${selectedAppointment?.hospital_name} with Dr. ${selectedAppointment?.doctor_name} (${selectedAppointment?.doctor_specialization}) on ${selectedAppointment?.appointment_day} at ${selectedAppointment?.slot_time} has been cancelled successfully. If you need to reschedule, please contact ${selectedAppointment?.hospital_name} at ${selectedAppointment?.hospital_mobile}.`;

  //   // Get hospital ID - use a default if not available
  //   const hospitalId = selectedHospitalId || localStorage.getItem("defaultHospitalId") || 1; // Fallback to 1 or your default

  //   const selectedDoctor = specializationDetails.find((doc) => doc.id == selectedDoctorId);
  //   if (!selectedDoctor) {
  //     notification.error({
  //       message: "Error",
  //       description: "Selected doctor not found",
  //     });
  //     return;
  //   }

  //   // 2. Prepare the appointment data with fallbacks
  //   const appointmentData = {
  //     hospital_id: parseInt(hospital_id),
  //     patient_id: patientDetails?.id , // From fetched patient details
  //     tech_id: parseInt(selectedDoctorId), // Doctor selected in dropdown
  //     payment_status: 0,
  //     booked_by: 0,
  //     status: 0, // Define appropriate status
  //     slot_time: selectedTime.fromTime,
  //     appointment_time: selectedTime.fromTime,
  //     appointment_day: formatDateToDDMMYYYY(selectedDate),
  //     referal_person: isOthers ? 0 : referalPersonId,
  //     is_other_referal: isOthers ? 1 : 0,
  //     other_referal_name: isOthers ? otherReferalName : "-",
  //     other_referal_mobile: isOthers ? otherReferalMobile : "-"
  //   };

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       history.push("/login");
  //       return;
  //     }

  //     // 3. Make the booking API call
  //     const response = await fetch(`${var_api}appointment/post`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       },
  //       body: JSON.stringify(appointmentData),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Booking failed");
  //     }

  //     const responseData = await response.json();

  //     // 4. Send notifications (simplified error handling)
  //     try {
  //       await Promise.all([
  //         // Patient notification
  //         fetch(`${var_api}patientnotification/add`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: token,
  //           },
  //           body: JSON.stringify({
  //             hospital_id: hospitalId,
  //             patient_id: patientDetails.id,
  //             doc_id: selectedDoctorId,
  //             title: "Appointment Booked",
  //             description: description,
  //             read_status: 0
  //           }),
  //         }),
  //         // Doctor notification
  //         fetch(`${var_api}doctornotification/add`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: token,
  //           },
  //           body: JSON.stringify({
  //             hospital_id: hospitalId,
  //             patient_id: patientDetails.id,
  //             doc_id: selectedDoctorId,
  //             title: "New Appointment",
  //             description: `The appointment with Patient ${selectedAppointment?.patient_name} (Token No: ${selectedAppointment?.token_no}) scheduled on ${selectedAppointment?.appointment_day} at ${selectedAppointment?.slot_time} has been cancelled.`,
  //             read_status: 0
  //           }),
  //         })
  //       ]);
  //     } catch (notificationError) {
  //       console.warn("Notification failed:", notificationError);
  //       // Not critical, so we continue
  //     }

  //     // 5. Show success and refresh
  //     notification.success({
  //       message: "Success",
  //       description: "Appointment booked successfully!",
  //     });

  //     setIsConfirmationModalVisible(false);
  //     fetchData(startDate, endDate, selectedDoctorId, selectedPatientsId);

  //   } catch (error) {
  //     console.error("Booking failed:", error);
  //     notification.error({
  //       message: "Error",
  //       description: error.message || "Failed to complete booking",
  //     });
  //   }
  // };

  const handleBookNowClick = (values) => {
    // Store form values (appointment details)
    const details = {
      mobile: customerMobile,
      specialization: specialization.find((spec) => spec.value === selectedSpecializationId)?.label,
      doctor: specializationDetails.find((doc) => doc.id === selectedDoctorId)?.name,
      patientName: patientDetails.name, // Add patient details
      dob: patientDetails.dob,
      address: patientDetails.full_address,
      gender: patientDetails.gender,
      bloodGroup: patientDetails.blood_group,
      profile_image: patientDetails?.profile_image,

      ...values, // Additional form values if needed
    };

    console.log("doctorName", specializationDetails.find((doc) => doc.id === selectedDoctorId)?.name)
    setAppointmentDetails(details);
    setIsConfirmationModalVisible(true); // Show confirmation modal

  };

  const handleConfirmAppointment = async () => {
    try {
      await bookAppointment(); // Call your API
      await updateTechstaffStatus();
      setIsConfirmationModalVisible(false);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };


  // Helper function to format date to "dd-mm-yyyy"
  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };


  //send email for apt success
  const sendEmail = async (aptId) => {
    console.log("📩 sendEmail function triggered with aptId:", aptId);

    const selectedDoctorEmail = doctorsList.find(
      (doc) => doc.id == selectedDoctorId
    );

    const patientEmail = patientDetails?.email_id;

    // Get and convert localStorage flags to numbers
    const isbookedbyadminpatientemail = Number(localStorage.getItem("booked_by_admin_patient_email")) === 1;
    const booked_by_admin_doctor_email = Number(localStorage.getItem("booked_by_admin_doctor_email")) === 1;

    console.log("🧾 Selected Doctor Email:", selectedDoctorEmail?.email_id);
    console.log("🧾 Patient Email:", patientEmail);
    console.log("📊 Flags → isbookedbyadminpatientemail:", isbookedbyadminpatientemail, "| booked_by_admin_doctor_email:", booked_by_admin_doctor_email);

    // Only send if at least one flag is 1
    if ((isbookedbyadminpatientemail || booked_by_admin_doctor_email) && patientDetails) {
      const toemails = [patientEmail, selectedDoctorEmail?.email_id].filter(Boolean);
      console.log("✅ Sending email to:", toemails);

      const requestData = {
        to: toemails,
        subject: "Appointment Confirmation",
        text: "Your appointment has been booked.",
      };

      try {
        const response = await axios.post(
          `${var_api}email-notify/apt-success/${aptId}/admin`,
          requestData
        );
        console.log("✅ Email sent successfully:", response.data);
      } catch (error) {
        console.error("❌ Error sending email:", error);
      }
    } else {
      console.log("❌ Conditions not met, email not sent. Either flags are 0 or patient details missing.");
    }
  };



  const bookAppointment = async () => {
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      notification.error({
        message: "Error",
        description: "Please select a Doctor and Date.",
      });
      return;
    }

    const payload = {
      hospital_id: parseInt(hospital_id),
      patient_id: patientDetails?.id,
      // tech_id: parseInt(selectedDoctorId),
      payment_status: 0,
      booked_by: 0,
      status: 0,
      slot_time: selectedTime.fromTime,
      appointment_time: selectedTime.fromTime,
      appointment_day: formatDateToDDMMYYYY(selectedDate),
      referal_person: isOthers ? 0 : referalPersonId,
      is_other_referal: isOthers ? 1 : 0,
      other_referal_name: isOthers ? otherReferalName : "-",
      other_referal_mobile: isOthers ? otherReferalMobile : "-",
      apt_start_time: selectedTime.fromTime,
      apt_end_time: "00:00:00"
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${var_api}appointment/gos-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Booking success, calling updateTechstaffStatus()");
        await updateTechstaffStatus(); // Call after success
      } else {
        throw new Error("Failed to book appointment");
      }

      const result = await response.json(); // Ensure response parsing before using data
      console.log("Appointment booked successfully:", result);
      const audio = new Audio(bookingaudio);
      audio.play();
      notification.success({
        message: "Registration Successful!",
        description: `Registration booked for ${result.appointment_day} at slot ${result.slot_time} with ${result.tech_name}. Token No: ${result.token_no}`,
      });

      setSelectedAppointment({
          hospital_id: parseInt(hospital_id),
          appointment_day: result?.appointment_day,
          id: result?.appointmentId,
          patient_id: patientDetails?.id,
          slot_time: result?.slot_time,
          appointment_time: selectedTime.fromTime,
          status: 0
        })


      if ((isbookedbyadminpatientemail || booked_by_admin_doctor_email) && patientDetails) {
        console.log("✅ Sending email...");
        await sendEmail(result?.appointmentId);
      }


      setNotificationList((prevList) => [
        ...prevList,
        {
          id: result.appointmentId,
          token: result.token_no,
          date: result.appointment_date,
          time: result.slot_time,
          doctor: result.tech_name,
        },
      ]);

      // if (!shouldHideVitals(settings)) {
      //   const vitalDetailsPayload = {
      //     hospital_id: parseInt(hospital_id),
      //     appoinment_id: result.appointmentId,
      //     weight: 0.0,
      //     height: 0.0,
      //     bmi_value: 0.0,
      //     bp: 0.0,
      //     temp: 0.0,
      //     before_sugar: 0,
      //     after_sugar: 0,
      //     problem: "",
      //     diagnosis: "",
      //     note: "",
      //     pulse: "",
      //     spo2: "",
      //   };

      //   // Post vital details
      //   const vitalDetailsResponse = await fetch(`${var_api}vitaldetails/post`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: token,
      //     },
      //     body: JSON.stringify(vitalDetailsPayload),
      //   });

      //   if (!vitalDetailsResponse.ok) {
      //     throw new Error("Failed to post vital details");
      //   }

      //   console.log("Vital details posted successfully:", await vitalDetailsResponse.json());
      // }

      // Send notifications (after appointment confirmation)
      try {
        await Promise.all([
          fetch(`${var_api}patientnotification/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              hospital_id: hospital_id,
              patient_id: patientDetails.id,
              doc_id: selectedDoctorId,
              title: "Appointment Booked",
              description: "Your appointment has been confirmed.",
              read_status: 0,
            }),
          }),
          fetch(`${var_api}doctornotification/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              hospital_id: hospital_id,
              patient_id: patientDetails.id,
              doc_id: selectedDoctorId,
              title: "New Appointment",
              description: `New appointment with Patient ${patientDetails?.name} scheduled on ${result.appointment_day} at ${result.slot_time}.`,
              read_status: 0,
            }),
          }),
        ]);
        handleModalClose();
        setIsConfirmationModalVisible(false);
      } catch (notificationError) {
        console.warn("Notification failed:", notificationError);
      }

      // Reset State
      resetFormState();

      // Fetch updated appointment slots
      // fetchAvailableDoctorSlots(selectedDoctorId);
      const start_date = startDate ? formatDate(startDate) : formatDate(initialSettingsApt.startDate);
      const end_date = endDate ? formatDate(endDate) : formatDate(initialSettingsApt.endDate);

      fetchData(start_date, end_date, selectedPatientsId);
       setAppointmentPrivateDate("");
       setSelectedPrivateSlot("");
      setRemarkPrivate("");
      setIsEndSessionModalVisible(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      notification.error({
        message: "Failed",
        description: "Failed to book appointment or post vital details.",
      });
    }
  };


  const bookCloneAppointment = async (idm) => {

    if (!selectedCloneDoctorId || !selectedCloneDate || !selectedCloneTime) {
      notification.error({
        message: "Error",
        description: "please select Doctor and Date Time.",
      });
      return;
    }
    const payload = {
      hospital_id: parseInt(hospital_id),
      patient_id: modals[0]?.data.patient_id || selectedAppointment?.patient_id, // From fetched patient details
      tech_id: parseInt(selectedCloneDoctorId), // Doctor selected in dropdown
      payment_status: 0,
      booked_by: 0,
      status: 0, // Define appropriate status
      slot_time: selectedCloneTime.fromTime,
      appointment_time: selectedCloneTime.fromTime,
      appointment_day: formatDateToDDMMYYYY(selectedCloneDate),
      referal_person: isOthers ? 0 : referalPersonId,
      is_other_referal: isOthers ? 1 : 0,
      other_referal_name: isOthers ? otherReferalName : "-",
      other_referal_mobile: isOthers ? otherReferalMobile : "-"
    };


    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${var_api}appointment/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, // Ensure the token is set
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const result = await response.json();
      console.log('Appointment booked successfully:', result);
      notification.success({
        message: "Successful",
        description: "Appointment booked successfully!",
      });



      if (!shouldHideVitals(settings)) {
        // Get the appointment ID from the response
        const appointmentId = result.appointmentId;

        

        // Prepare the vital details payload
        const vitalDetailsPayload = {
          hospital_id: parseInt(hospital_id),
          appoinment_id: appointmentId, // Pass the appointment ID from the response
          weight: 0.0, // double
          height: 0.0, // double
          bmi_value: 0.0, // double
          bp: 0.0, // double
          temp: 0.0, // double
          before_sugar: 0, // int(11)
          after_sugar: 0, // int(11)
          problem: "", // text
          diagnosis: "", // text
          note: "", // text
          pulse: "", // text, nullable
          spo2: "", // text, nullable
        };

        setSelectedCloneDate(null);
        setSelectedCloneTime(null);



        // Post the vital details API
        const vitalDetailsResponse = await fetch(`${var_api}vitaldetails/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`, // Ensure the token is set
          },
          body: JSON.stringify(vitalDetailsPayload),
        });

        if (!vitalDetailsResponse.ok) {
          throw new Error('Failed to post vital details');
        }

        const vitalDetailsResult = await vitalDetailsResponse.json();
        console.log('Vital details posted successfully:', vitalDetailsResult);
        // notification.success('Vital details posted successfully!');
      }

      setModals(modals.filter(m => m.id !== idm));
      // const start_date = formatDate(initialSettings.startDate);
      // const end_date = formatDate(initialSettings.endDate);
      // fetchData(start_date, end_date, selectedDoctorsId);

      fetchSpecialization();
      setSelectedCloneDoctorId(specializationDetails[0].id);
      setSelectedCloneTime(null);
      setReferalPersonId(null);
      setSelectedCloneDate(today);
      setIsOthers(false);
      setOtherReferalMobile("");
      setOtherReferalName("");
      setSelectedCloneSpecializationId(specialization[0].value);

      console.log("Selected date:", today); // Log the selected date
      const start_date = startDate ? formatDate(startDate) : formatDate(initialSettingsApt.startDate);
      const end_date = endDate ? formatDate(endDate) : formatDate(initialSettingsApt.endDate);
      fetchData(start_date, end_date, selectedPatientsId);
  //      const matchedAppointment = data?.find(
  //   (item) => item.id === result.appointmentId
  // );

  // if (matchedAppointment) {
  //   setSelectedAppointment(matchedAppointment);
  // }
      setIsEndSessionModalVisible(true);

      // Get the day of the week for the selected date
      const dayOfWeek = today.toLocaleDateString('en-GB', { weekday: 'long' });
      // const token =localStorage.getItem("token"); 
      const doc_id = selectedCloneDoctorId;
      try {
        // Construct the API 
        const apiUrl = `${var_api}availabledaytime/getbydoc/${hospital_id}/${doc_id}/${dayOfWeek}`;

        // Fetch data from the API
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: token, // Include token in the header
          },
        });

        // Filter the response data for is_active: 1
        const activeDayTimings = response.data?.filter((timing) => timing.is_active == 1);
        setDayCloneTimings(activeDayTimings);

        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDayCloneTimings([]); // Clear the response in case of an error
      }
      console.log("")
    } catch (error) {
      console.error('Error booking appointment or posting vital details:', error);
      notification.error('Failed to book appointment or post vital details.');
    }

  };




  // Helper function to reset form state
  const resetFormState = () => {
    // setSelectedDoctorId(specializationDetails[0]?.id);
    setSelectedTime(null);
    setReferalPersonId(null);
    setCustomerMobile("");
    setPatientDetails(null);
    setSelectedDate(new Date()); // Reset to today's date
    setIsOthers(false);
    setOtherReferalMobile("");
    setOtherReferalName("");
    setSelectedSpecializationId(specialization[0]?.value);
  };

  // Fetch available slots for a doctor on a specific day
  const fetchAvailableDoctorSlots = async (doctorId) => {
    const token = localStorage.getItem("token");
    const dayOfWeek = new Date().toLocaleDateString("en-GB", { weekday: "long" });

    try {
      const response = await axios.get(
        `${var_api}availabledaytime/getbydoc/${hospital_id}/${doctorId}/${dayOfWeek}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const activeDayTimings = response.data?.filter((timing) => timing.is_active == 1);
      setDayTimings(activeDayTimings);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setDayTimings([]);
    }
  };


  const handlevitalInputChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  // Handle Update button click
  const handleUpdate = async () => {
    try {
      // Get the token (you can retrieve it from localStorage or context)
      const token = localStorage.getItem('token'); // Adjust based on how you store the token

      // Prepare the payload (use formData as the body)
      const vitalDetailsPayload = {
        hospital_id: formData.hospital_id,
        appointment_id: formData.id,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        bmi_value: parseFloat(formData.bmi_value),
        bp: parseFloat(formData.bp),
        temp: parseFloat(formData.temp),
        before_sugar: parseInt(formData.before_sugar),
        after_sugar: parseInt(formData.after_sugar),
        problem: formData.problem,
        diagnosis: formData.diagnosis,
        note: formData.note || "-",
        pulse: formData.pulse,
        spo2: formData.spo2
      };

      // Make the PUT request using fetch
      const response = await fetch(
        `${var_api}vitaldetails/update/${formData.vital_id}`, // Use formData.id for the URL param
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`, // Add token in Authorization header
          },
          body: JSON.stringify(vitalDetailsPayload), // Send the form data in the body
        }
      );

      if (response.ok) {
        setShowModal(false);
        // Handle success (e.g., notify user, close modal, etc.)
        alert('Vital details updated successfully');
        closeModal();
        const start_date = formatDate(initialSettingsApt.startDate);
        const end_date = formatDate(initialSettingsApt.endDate);
        fetchData(start_date, end_date);
      } else {
        // Handle error (e.g., show error message)
        alert('Failed to update vital details');
      }
    } catch (error) {
      console.error('Error updating vital details:', error);
      alert('An error occurred while updating vital details');
    }
  };


  const handleEyeClick = async (apt) => {
    console.log("Before Setting:", isPlusButtonVisible); // Should be false initially
    console.log("🔥 Button Clicked!");
    console.log("apt.appointment_day:", apt.appointment_day, apt.tech_id, apt.patient_id, apt, filteredData);
    setPatientId(apt.patient_id);
    console.log("k", selectedCard)

    // Validate and parse the date
    const isValidDate = (dateString) => {
      return !isNaN(new Date(dateString).getTime());
    };
    const parsedDate = isValidDate(apt.appointment_day) ? new Date(apt.appointment_day) : new Date();
    console.log("parsedDate:", parsedDate, filteredData);

    // Set the selected date
    setSelectedDate(parsedDate);
    handleDateChange(parsedDate);
    // Map numerical values (1, 0) to boolean (true, false)
    // fetchToothDirections(apt.id);
    setSwitchStates({
      asthma: apt.asthma == 1,
      diabetes: apt.diabetes == 1,
      drug_allergy: apt.drug_allergy == 1,
      pregnancy: apt.pregnancy == 1,
      bp: apt.bp == 1,
      cardiac: apt.cardiac == 1,
    });
    console.log("filer", filteredData);
    fetchHistoryToothDirections(apt.id);
    setSelectedAppointment(apt);
    console.log("filer1", filteredData);
    // Fetch doctors if not already loaded
    // if (!doctorList || doctorList.length === 0) {
    //   fetchDoctorData();
    // }
    console.log("filer2", filteredData);
    // Set selected doctor ID
    console.log("selectedDoctorId:", apt.tech_id);
    // setSelectedDoctorId(apt.tech_id);
    console.log("filer3", filteredData);
    // Check if the selected doctor exists
    const selectedDoctor = doctorList.find(doctor => doctor.id === apt.tech_id);
    console.log("Selected Doctor:", selectedDoctor, doctorList);
    console.log("filer4", filteredData);

    setReferalPersonId(apt.referal_person);
    setFormVitalData({
      corrected_od: apt.corrected_od || "-",
      corrected_os: apt.corrected_os || "-",
      uncorrected_od: apt.uncorrected_od || "-",
      uncorrected_os: apt.uncorrected_os || "-",
      iop_od: apt.iop_od || 0,
      iop_os: apt.iop_os || 0,
      appointment_id: apt?.id,
      remarks: apt?.remarks || "-"
    });
    // Update switch states from the appointment data

    console.log("filer5", filteredData);
    // Check and debug the updated values directly from apt
    console.log("Switch States from apt:", {
      asthma: apt.asthma == 1,
      diabetes: apt.diabetes == 1,
      drug_allergy: apt.drug_allergy == 1,
      pregnancy: apt.pregnancy == 1,
      bp: apt.bp == 1,
      cardiac: apt.cardiac == 1,
      others: apt?.others,
      cheif_complaints: apt?.cheif_complaints,
    });
    console.log("filer6", filteredData);
    setColumns({
      firstCol: 'col-md-6 col-xl-6 col-sm-12', // Expand first column to 50%
      secondCol: 'col-md-6 col-xl-6 col-sm-12', // Show second column at 50%
      thirdCol: 'd-none', // Hide third column
    });
    console.log("filer7", filteredData);
    document.body.classList.add("mini-sidebar");
    console.log("filer8", filteredData);
    fetchToothHistory(apt?.patient_id, apt?.tech_id);
    console.log("filer9", filteredData);
    console.log("testing", apt);
    await handleServiceTypesHistotry(apt.id);
    if (apt.status == 3) {
      console.log("yes condition satisfied");
      await handleServiceTypesHistotry(apt.id);
      await handelMedicationsHistory();

       // Set form values from apt object
  setAppointmentPrivateDate(convertToInputDateFormat(apt?.Private_date)); // Ensure correct date format
  setSelectedPrivateSlot(apt?.private_slot || "");
  setRemarkPrivate(apt?.private_remark || "");

      
    }else{
      setAppointmentPrivateDate(""); // Ensure correct date format
  setSelectedPrivateSlot("");
  setRemarkPrivate(""); 
    }
  };

const convertToInputDateFormat = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
};


  useEffect(() => {
    form.setFieldsValue({
      asthma: switchStates.asthma,
      diabetes: switchStates.diabetes,
      drug_allergy: switchStates.drug_allergy,
      pregnancy: switchStates.pregnancy,
      bp: switchStates.bp,
      cardiac: switchStates.cardiac,
    });
    console.log("Updated Switch States:", switchStates);
  }, [switchStates]);

  // useEffect(() => {
  //   if (selectedDoctorsId && startDate && endDate) {
  //     fetchData(startDate, endDate, selectedDoctorsId);
  //   }
  // }, [selectedDoctorsId, startDate, endDate]);



  const handleEditClick = async () => {

    setIsEndSessionModalVisible(true);
    // setColumns({
    //   firstCol: 'col-md-6 col-xl-3 col-sm-12', // Set first column to 25%
    //   secondCol: 'col-md-6 col-xl-4 col-sm-12', // Set second column to 33%
    //   thirdCol: 'col-md-6 col-xl-5 col-sm-12', // Set third column to 42%
    // });
    if (selectedAppointment.status != 3) {
      setRows([{
        id: Date.now(), // Unique identifier for each row
        service_type_id: null,
        service_type: 0,
        price: 0,
        qty: 1,
        final_price: 0,
        remarks: '',
        discount: 0
      }])
    };
    console.log("selectedApt", selectedAppointment.status)
    if (selectedAppointment.status == 3) {
      await handleServiceTypesHistotry(selectedAppointment?.id);
      await handelMedicationsHistory();
    };
    setDiagnosis(selectedAppointment?.diagnosis);
  }


  const fetchLabData = async (id) => {
    const hospital_id = localStorage.getItem("hospital_id");
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${var_api}labmaster/get-active-by-hospital/${hospital_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}` // Pass token in Authorization header
        },
      });

      const data = await response.json();

      if (data && data.length > 0) {
        // Populate the labDropdowns for the specific row (use id)
        setLabDropdowns((prev) => ({
          ...prev,
          [id]: data, // Map the response data to the respective row id
        }));

        // Optionally set the selected lab to the first item if no lab is selected yet
        setRows((prevServices) =>
          prevServices.map((service) =>
            service.id === id
              ? {
                ...service,
                lab_id: service.lab_id || data[0].id, // Default to first lab if none selected
                lab_service_name: service.lab_service_name || data[0].lab_name, // Default to first lab's name
              }
              : service
          )
        );
        console.log("cjh", rows, labDropdowns, data);
      }
    } catch (error) {
      console.error("Error fetching lab data:", error);
    }
  };



  // const handleServiceTypesHistotry = async (apt_id) => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");

  //     // Call First API
  //     const response = await fetch(`${var_api}invoicebilling/invoice-list/by-appointment/${apt_id}`, {
  //       method: "GET",
  //       headers: { "Authorization": `${token}` }
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }

  //     const data = await response.json();
  //     setExistingServices(data);
  //     console.log("yes invoice data", data);

  //     if (data && data.details && Array.isArray(data.details)) {
  //       const mappedRows = data.details.map(item => ({

  //         // const labServiceName = labId && labDropdowns[labId] ? labDropdowns[labId][0].lab_name : "";

  //         // // Fetch lab data if it's a lab service and lab data is missing
  //         // if (item.service_details?.is_lab === 1 && !labServiceName) {
  //         //   fetchLabData(item.invoice_billing_id); // Fetch lab data for the specific service
  //         // }


  //         id: item.id,
  //         service_type_id: item.service_type_id,
  //         service_name: item.service_name || "Unknown",
  //         price: item.unit_price,
  //         qty: item.quantity,
  //         final_price: item.final_amount,
  //         remarks: item.remark,
  //         discount: item.discount,
  //         is_lab: item.is_lab || 0,
  //         lab_id: item.lab_id || null,
  //         service_type: item.service_type,
  //         lab_service_name: item.lab_name || "", // Initially empty or default to first lab name

  //       }));

  //       setRows(Array.isArray(mappedRows) ? mappedRows : []); // Update state with API data
  //       console.log("mappedRows", mappedRows);
  //       console.log("mappedRows", mappedRows);
  //       setEditFinalAmount(data.final_amount);
  //       setEditDiscount(data.any_discount);
  //       setAptDiscount(data.any_discount);
  //     } else {
  //       setExistingServices(null);
  //       console.error("Error: data.details is missing or not an array", data);
  //     }

  //   } catch (error) {
  //     setExistingServices(null);
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const transformInvoiceData = (apiData) => {
  if (!apiData) return null;

  return {
    // Grand Summary data
    id: apiData.id,
    appointment_id: apiData.appointment_id,
    consultation: apiData.op_total || 0,
    medical_total: (apiData.scan_total || 0) + (apiData.investigation_total || 0) + (apiData.review_total || 0),
    discount: apiData.grand_discount || 0,
    final_charge: apiData.grand_total || 0,
    payment_status : apiData.paid_status,
    
    // Individual sections
    op: {
      subtotal: apiData.op_total || 0,
      discount: apiData.op_discount || 0,
      total: (apiData.op_total || 0) - (apiData.op_discount || 0),
      items: apiData.services?.op?.map(item => ({
        name: item.service_details?.service_name || 'OP Service',
        qty: item.quantity || 1,
        amount: item.final_amount || item.total_amount || 0,
        remark: item.remark
      })) || []
    },
    scan: {
      subtotal: apiData.scan_total || 0,
      discount: apiData.scan_discount || 0,
      total: (apiData.scan_total || 0) - (apiData.scan_discount || 0),
      items: apiData.services?.scan?.map(item => ({
        name: item.service_details?.service_name || 'Scan Service',
        qty: item.quantity || 1,
        amount: item.final_amount || item.total_amount || 0,
        remark: item.remark
      })) || []
    },
    investigation: {
      subtotal: apiData.investigation_total || 0,
      discount: apiData.investigation_discount || 0,
      total: (apiData.investigation_total || 0) - (apiData.investigation_discount || 0),
      items: apiData.services?.investigation?.map(item => ({
        name: item.service_details?.service_name || 'Investigation Service',
        qty: item.quantity || 1,
        amount: item.final_amount || item.total_amount || 0,
        remark: item.remark
      })) || []
    },
    review: {
      subtotal: apiData.review_total || 0,
      discount: apiData.review_discount || 0,
      total: (apiData.review_total || 0) - (apiData.review_discount || 0),
      items: apiData.services?.review?.map(item => ({
        name: item.service_details?.service_name || 'Review Service',
        qty: item.quantity || 1,
        amount: item.final_amount || item.total_amount || 0,
        remark: item.remark
      })) || []
    }
  };
};


const transformInvoiceRows = (servicesData) => {
  // servicesData: { op: [...], scan: [...], investigation: [...], review: [...]}
  const mapItemsToRows = (items, serviceTypeId) =>
    items.map(item => ({
      id: Date.now() + Math.random(), // unique id
      service_name: item.service_details?.service_name || "Unknown",
      service_type_id: serviceTypeId,
      service_type: serviceTypeId,
      price: item.unit_price || 0,
      qty: item.quantity || 1,
      final_price: item.final_amount || item.total_amount || 0,
      remarks: item.remark || "",
      is_lab: item.is_lab || 0,
    }));

  return {
    op: mapItemsToRows(servicesData.op || [], 0),
    scan: mapItemsToRows(servicesData.scan || [], 1),
    investigation: mapItemsToRows(servicesData.investigation || [], 2),
    review: mapItemsToRows(servicesData.review || [], 3)
  };
};



    const handleServiceTypesHistotry = async (apt_id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Call First API
      const response = await fetch(`${var_api}gos-invoice-billing/invoice-service-list/${apt_id}`, {
        method: "GET",
        headers: { "Authorization": `${token}` }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
       const transformedData = transformInvoiceData(data);
        setInvoiceData(transformedData);
      setExistingServices(data);

      // If appointment status is 3, update tabRows from the API services
    if (selectedAppointment?.status === 3) {
      const newTabRows = transformInvoiceRows(data.services || {});
      setTabRows(newTabRows);
    }

      // setConsultationFee(data.consultation);
      // setDiscount(data.discount);
    
      // console.log("yes invoice data", data);

      // if (data && data.details && Array.isArray(data.details)) {
      //   const mappedRows = data.details.map(item => ({

        
      //     id: item.id,
      //     service_type_id: item.service_type_id,
      //     service_name: item.service_name || "Unknown",
      //     price: item.unit_price,
      //     qty: item.quantity,
      //     final_price: item.final_amount,
      //     remarks: item.remark,
      //     discount: item.discount,
      //     is_lab: item.is_lab || 0,
      //     lab_id: item.lab_id || null,
      //     service_type: item.service_type,
      //     lab_service_name: item.lab_name || "", // Initially empty or default to first lab name

      //   }));

      //   setRows(Array.isArray(mappedRows) ? mappedRows : []); // Update state with API data
      //   console.log("mappedRows", mappedRows);
      //   console.log("mappedRows", mappedRows);
      //   setEditFinalAmount(data.final_amount);
      //   setEditDiscount(data.any_discount);
      //   setAptDiscount(data.any_discount);
      // } else {
      //   setExistingServices(null);
      //   console.error("Error: data.details is missing or not an array", data);
      // }

    } catch (error) {
      setExistingServices(null);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handelMedicationsHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Call First API
      const response = await fetch(`${var_api}medicalbilling/get-medical-invoice/by-appointment/${selectedAppointment.id}`, {
        method: "GET",
        headers: { "Authorization": `${token}` }
      });

      const data = await response.json();
      setExistingMedicalInvoice(data || null);

      // If appointment_status is 3, load existing medications
      if (selectedAppointment.status == 3 && data?.items) {
        const formattedMedications = data.items.map((item) => ({
          id: Date.now() + Math.random(), // Unique ID
          sub_cat_id: item.sub_cat_id ?? null,
          unit_price: item.unit_price ?? 0, // ✅ Default to 0 to avoid undefined
          is_before_food: item.is_before_food ?? false,
          cycle: item.cycle ?? "",
          remarks: item.remarks ?? "",
          is_morning: item.is_morning ?? false,
          is_noon: item.is_noon ?? false,
          is_evening: item.is_evening ?? false,
          is_night: item.is_night ?? false,
          mbd_id: item.mbd_id ?? null,
          prescription_id: item.prescription_id ?? null
        }));

        console.log("formattedMedications", formattedMedications);
        setMedications(formattedMedications);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


// Handle input change for all fields
const handleInputVitalChange = (e) => {
  const { name, value } = e.target;
  
  setFormVitalData((prevState) => ({
    ...prevState,
    [name]: value
  }));
};

  // Handle change in selected doctor
  // const handleDoctorChangeFilter = (selectedOption) => {
  //   const doctorId = selectedOption ? selectedOption.value : null;
  //   setSelectedDoctorsId(doctorId); // Update state

  //   const start_date = startDate || formatDate(initialSettingsApt.startDate) || null;
  //   const end_date = endDate || formatDate(initialSettingsApt.endDate) || null;

  //   // Ensure selectedOption.value exists before passing it to fetchData
  //   setTimeout(() => {
  //     if (start_date && end_date) {
  //       fetchData(start_date, end_date, doctorId, selectedPatientsId); // Use doctorId instead of selectedOption.value
  //     } else {
  //       console.error("Start date or end date is missing.");
  //       // notification.warning({
  //       //   message: "Date Range Missing",
  //       //   description: "Please select a date range before filtering by doctor.",
  //       // });
  //     }
  //   }, 100);
  // };
  const handleDoctorChangeFilter = (selectedOption) => {
    const doctorId = selectedOption ? selectedOption.value : null;
    setSelectedDoctorsId(doctorId); // Update state

    // const start_date = formatDate(startDate) || formatDate(initialSettingsApt.startDate) || null;
    // const end_date = formatDate(endDate) || formatDate(initialSettingsApt.endDate) || null;

    // Ensure API is called even when doctor is cleared
    setTimeout(() => {
      fetchData(null, null, selectedPatientsId); // Always call API
      setSelectedDatepic("");
    }, 100);
  };



  const handlePatientChangeFilter = (selectedOption) => {
    const patientId = selectedOption ? selectedOption.value : null;
    setSelectedPatientsId(patientId); // Update state

    // const start_date = startDate || formatDate(initialSettingsApt.startDate) || null;
    // const end_date = endDate || formatDate(initialSettingsApt.endDate) || null;

    // Always call API, even when selection is cleared
    setTimeout(() => {
      if (patientId) {
        // If patient is selected, fetch without date filter
        fetchData(null, null, patientId);
        setSelectedDatepic("");
      } else {
        // If patient is cleared, fetch with date range filter
        const formattedStart =
          startDate ? formatDate(startDate) : formatDate(initialSettingsApt.startDate);
        const formattedEnd =
          endDate ? formatDate(endDate) : formatDate(initialSettingsApt.endDate);
        fetchData(formattedStart, formattedEnd, null);
        setSelectedDatepic(`${formattedStart} - ${formattedEnd}`)
      }
    }, 100);
  };

  // Handle Update
  const handleEditVitalClick = async () => {
    console.log("Updated Vitals:", formVitalData);

    try {
      // Construct the API URL
      const apiUrl = `${var_api}gos-eye/update/${selectedAppointment?.eye_details_id}`;

      // Make the PUT request with the data payload and headers
      const response = await axios.put(
        apiUrl,
        formVitalData, // Data payload to update
        {
          headers: {
            Authorization: token, // Include token in the header
          },
        }
      );

      // Log the API response
      console.log("API Response:", response.data);
      notification.success({
        message: "Success",
        description: "Vitals updated successfully!",
      });
      setShowModal(false);
      setIsEditing(false);
       const start_date = startDate ? formatDate(startDate) : formatDate(initialSettingsApt.startDate);
        const end_date = endDate ? formatDate(endDate) : formatDate(initialSettingsApt.endDate);

        await fetchData(start_date, end_date, selectedPatientsId);
    } catch (error) {
      console.error("Error updating vitals:", error);
      notification.error({
        message: "Error Occured",
        description: "Failed to update vitals. Please try again.!",
      });
    }
  };


  const handlevitalEdit = () => {
    setIsEditing(true);
  }


  const handleCancelVitalEdit = () => {
    setIsEditing(false);
  }



  const handleCancelApptEdit = () => {
    setIsApptEditing(false);
  }


  const getDosageCode = (medication) => {
    if (!medication) return "0000"; // Default if no data found

    return `${medication.is_morning || 0}${medication.is_noon || 0}${medication.is_evening || 0}${medication.is_night || 0}`;
  };



  const handleInputDurationChange = (id, e) => {
    const value = e.target.value.replace(/[^01]/g, ""); // Allow only 0s and 1s
    const parts = value.split("");

    // Extract individual values
    const morning = parseInt(parts[0] || 0, 10);
    const noon = parseInt(parts[1] || 0, 10);
    const evening = parseInt(parts[2] || 0, 10);
    const night = parseInt(parts[3] || 0, 10);

    // Update the state
    setMedications((prevMedications) =>
      prevMedications.map((medication, i) =>
        medication.id === id
          ? {
            ...medication,
            is_morning: morning,
            is_noon: noon,
            is_evening: evening,
            is_night: night,
          }
          : medication
      )
    );
  };

  //update medicaion
  const handleInputDurationUpdateChange = (id, e) => {
    let value = e.target.value.replace(/[^01]/g, ""); // Allow only 0s and 1s

    // Ensure length does not exceed 4
    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    // Ensure at least a default "0000" value is set if empty
    while (value.length < 4) {
      value += "0";
    }

    // Extract individual values safely
    const morning = parseInt(value[0], 10);
    const noon = parseInt(value[1], 10);
    const evening = parseInt(value[2], 10);
    const night = parseInt(value[3], 10);

    // Update the state
    setMedications((prevMedications) =>
      prevMedications.map((medication) =>
        medication.id === id
          ? {
            ...medication,
            is_morning: morning,
            is_noon: noon,
            is_evening: evening,
            is_night: night,
          }
          : medication
      )
    );
  };


  // Handle changes in medication details
  const handleMedicationChange = (id, field, value) => {
    const updatedMedications = medications.map((medication) =>
      medication.id === id ? { ...medication, [field]: value } : medication
    );
    setMedications(updatedMedications);
    console.log("Updated Medications:", updatedMedications);
  };



  const handleKeyPress = (e) => {
    const allowedKeys = ["0", "1", "Backspace", "ArrowLeft", "ArrowRight", "Tab"];

    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };




  // const endAppointmentSession = async () => {


  //   if (subTotal <= 0) {
  //     notification.error({
  //       message: "Error",
  //       description: "Subtotal must be greater than 0.",
  //     });
  //     return; // Stop execution if subtotal is invalid
  //   }
  //   setLoading(true);
  //   const currentedTime = new Date().toLocaleTimeString('en-US', { hour12: false });

  //   console.log("update", selectedAppointment, formVitalData, rows, medications, patientId);
  //  // Calculate the updated medications with qty and total_amount
  // const updatedMedications = medications.map(medication => {
  //   const totalDosages = parseInt(medication.is_morning) +
  //   parseInt(medication.is_noon) +
  //   parseInt(medication.is_evening) +
  //   parseInt(medication.is_night);

  //   const qty = totalDosages * medication.cycle;
  //   const total_amount = qty * medication.unit_price;

  //   return {
  //       ...medication,
  //       qty,
  //       total_amount
  //   };
  // });

  //    //Calculate the total final_price
  //  const totalFinalPrice = rows.reduce((sum, service) => sum + service.final_price, 0);
  //  const isDiscount = totalFinalPrice - subTotal;

  //   const appointmentData = {
  //       hospital_id: selectedAppointment?.hospital_id || hospital_id,
  //       patient_id: selectedAppointment?.patient_id || patientId || 1,
  //       tech_id: selectedAppointment?.tech_id || 0,
  //       appointment_day: selectedAppointment?.appointment_day || 0,
  //       appointment_time: selectedAppointment?.appointment_time || 0,
  //       payment_status: 0,
  //       status: 3,
  //       apt_start_time: selectedAppointment?.apt_start_time || 0,
  //       apt_end_time: currentedTime,
  //       amount: totalFinalPrice,
  //       referal_person: selectedAppointment?.referal_person,
  //       vital_details: {
  //         id: selectedAppointment?.vital_id || formVitalData?.vital_id,
  //         appointment_id : selectedAppointment?.id || 0,
  //         weight: formVitalData.weight || 0,
  //         height: formVitalData.height || 0,
  //         bmi_value: formVitalData.bmi_value || 0,
  //         bp: formVitalData.bp || 0,
  //         temp: formVitalData.temp || 0,
  //         before_sugar: formVitalData.before_sugar || 0,
  //         after_sugar: formVitalData.after_sugar || 0,
  //         pulse: formVitalData.pulse || 0,
  //         spo2: formVitalData.spo2 || 0,
  //         note: formVitalData.note || "",
  //       },
  //       clinical_notes: selectedAppointment?.clinical_notes,
  //       complaints: selectedAppointment?.complaints,
  //       advice: selectedAppointment?.advice,
  //       follow_up: selectedAppointment?.follow_up,
  //       previous_history: selectedAppointment?.previous_history,
  //       medicines: updatedMedications,
  //       newInvoiceBilling:{
  //           hospital_id:selectedAppointment?.hospital_id || hospital_id,
  //           appointment_id: selectedAppointment?.id || 0 ,
  //           patient_id: selectedAppointment?.patient_id || 0,
  //           tech_id: selectedAppointment?.tech_id || 0,

  //             sub_total: (totalFinalPrice ?? 0).toFixed(2),
  //           any_discount:isDiscount,
  //           final_sub_total: parseFloat(subTotal),
  //           final_amount:totalFinalPrice,
  //           paid_status:0,
  //           paid_amount:0,
  //           balance_amount:(totalFinalPrice ?? 0).toFixed(2),
  //           pay_mode:0,
  //           remarks:"-",
  //           services:rows
  //       }
  //     };


  //     console.log("xyz",appointmentData, updatedMedications);
  //     const appointment_id = selectedAppointment?.id || 0;

  //   try {
  //     const response = await axios.put(
  //       `${var_api}appointment/end-session/${appointment_id}`, 
  //       appointmentData,
  //       {
  //         headers: {
  //           Authorization: token,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     if (response.status == 200) {
  //       // Clear all relevant data
  //       // setMedications([]);
  //       // setRows([]);
  //       setIsEndSessionModalVisible(false);
  //       setRows([{
  //         id: Date.now(), // Unique identifier for each row
  //           service_type_id: null,
  //           service_type: 0,
  //           price: 0,
  //           qty: 1,
  //           final_price: 0,
  //           remarks: '',
  //           discount:0
  //       }]);
  //       setMedications([{ id: Date.now(),sub_cat_id: null, unit_price: null, is_before_food: 0, cycle: 0, remarks: '',  is_morning:0, is_evening:0, is_noon:0, is_night:0}])
  //       fetchData(startDate, endDate, selectedDoctorsId, selectedPatientsId);
  //       setColumns({
  //         firstCol: 'col-md-6 col-xl-6 col-sm-12', // Default to 50%
  //         secondCol: 'd-none', // Hidden initially
  //         thirdCol: 'd-none',  // Hidden initially
  //       })
  //       notification.success({
  //         message: "Success",
  //         description: "Appointment session ended successfully.",
  //       });
  //       console.log("Appointment session ended successfully, data cleared.");

  //   }
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error ending appointment session:', error.response || error.message);
  //     setLoading(false);
  //     throw error;
  //   } finally{
  //     setLoading(false);
  //   }
  // };


  const endAppointmentSession = async () => {
    setLoading(true);
    const appointment_id = selectedAppointment?.id || 0;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${var_api}appointment/gos-end-session/${appointment_id}`,
        appointmentData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setIsEndSessionModalVisible(false);
        setRows([{
          id: Date.now(),
          service_type_id: null,
          service_type: 0,
          price: 0,
          qty: 1,
          final_price: 0,
          remarks: '',
          discount: 0
        }]);

     
        setSubTotal(0);
        setAptDiscount(0);
        setAptGrandTotal(0);
        setFormVitalData({});

        const start_date = startDate ? formatDate(startDate) : formatDate(initialSettingsApt.startDate);
        const end_date = endDate ? formatDate(endDate) : formatDate(initialSettingsApt.endDate);

        await fetchData(start_date, end_date, selectedPatientsId);

        setColumns({
          firstCol: 'col-md-6 col-xl-6 col-sm-12',
          secondCol: 'd-none',
          thirdCol: 'd-none',
        });

        notification.success({
          message: "Success",
          description: "Appointment session ended successfully.",
        });

        await updateendsessionStatus();

        // ✅ Only show modal if endsession is not already set to 1
        if (
          (installDetails?.endsession ?? 0) === 0 &&
          installDetails &&
          Object.keys(installDetails).length > 0
        ) {
          setIsModalpop(true);
        }

        if (updatedMedications.length > 0) {
          const updatedAppointment = response.data?.data || response.data || {};

          const notificationData = {
            hospital_id: updatedAppointment.hospital_id || selectedAppointment?.hospitalID || currentDetail?.hospitalID || 0,
            patient_id: updatedAppointment.patient_id || selectedAppointment?.patient_id || currentDetail?.patient_id || 0,
            doc_id: updatedAppointment.doc_id || selectedAppointment?.tech_id || currentDetail?.tech_id || 0,
            read_status: 0,
          };

          if (notificationData.hospital_id && notificationData.patient_id && notificationData.doc_id) {
            await Promise.all([
              fetch(`${var_api}pharmacynotification/add`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify({
                  ...notificationData,
                  title: "Appointment Updated",
                  description: "Your appointment details have been modified",
                }),
              }),
              fetch(`${var_api}doctornotification/add`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify({
                  ...notificationData,
                  title: "Appointment Modified",
                  description: `Appointment with patient ID ${notificationData.patient_id} has been updated`,
                }),
              }),
            ]);
          } else {
            console.warn("Required notification fields missing:", notificationData);
          }
        }

        if (
          (typeof sendEmailEndSession === 'function') &&
          (endsession_by_admin_patient_email || endsession_by_admin_doctor_email)
        ) {
          await sendEmailEndSession();
        }

        return response.data;
      }

    } catch (error) {
      console.error('Error ending appointment session:', error.response || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const updateendsessionStatus = async () => {

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
          patient: installDetails?.patient ?? false,
          servicetype: installDetails?.servicetype ?? false,
          uom: installDetails?.uom ?? false,
          category: installDetails?.category ?? false,
          brand: installDetails?.brand ?? false,
          medicine: installDetails?.medicine ?? false,
          paymodemaster: installDetails?.paymodemaster ?? false,
          makeappointment: installDetails?.makeappointment ?? false,
          endsession: 1,
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
        if (installDetails?.endsession !== 1) {
          setIsModalpop(true);
        }
        fetchinstalldata(); // Open modal only on success
      } else {
        console.error("Failed to update installation:", responseText);
      }

    } catch (err) {
      console.error("Error updating techstaff:", err);
    }
  };








  //send email for rebook
  const sendEmailEndSession = async () => {

    const toemails = [];

    if (endsession_by_admin_patient_email && selectedAppointment?.patient_email) {
      toemails.push(selectedAppointment.patient_email);
    }

    if (endsession_by_admin_doctor_email && selectedAppointment?.doctor_email) {
      toemails.push(selectedAppointment.doctor_email);
    }

    if (toemails.length > 0) {
      // await sendEndSessionEmail(toemails);

      // Prepare the request body
      const requestData = {
        to: toemails,
        subject: "Appointment End Session",
        text: "Your appointment has been ended.",
      };

      try {
        const response = await axios.post(
          `${var_api}email-notify/apt-endsession/${selectedAppointment?.id}/admin`,
          requestData
        );
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  };



  // const endAppointmentSession = async () => {
  //   setLoading(true);
  //   const currentedTime = new Date().toLocaleTimeString('en-US', { hour12: false });

  //   const appointmentData = {
  //     ...selectedAppointment,
  //     status: "3", // Mark as completed
  //     apt_end_time: currentedTime,
  //   };

  //   try {
  //     const response = await axios.put(
  //       `${var_api}appointment/end-session/${selectedAppointment?.id}`,
  //       appointmentData,
  //       {
  //         headers: {
  //           Authorization: token,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     if (response.status == 200) {
  //       // Clear all relevant data
  //       // setMedications([]);
  //       // setRows([]);
  //       setIsEndSessionModalVisible(false);
  //       setRows([{
  //         id: Date.now(), // Unique identifier for each row
  //           service_type_id: null,
  //           service_type: 0,
  //           price: 0,
  //           qty: 1,
  //           final_price: 0,
  //           remarks: '',
  //           discount:0
  //       }]);
  //       setMedications([{ id: Date.now(),sub_cat_id: null, unit_price: null, is_before_food: 0, cycle: 0, remarks: '',  is_morning:0, is_evening:0, is_noon:0, is_night:0}])
  //       fetchData(startDate, endDate, selectedDoctorsId);
  //       notification.success({
  //         message: "Success",
  //         description: "Appointment session ended successfully.",
  //       });

  //       // Refresh data to push completed appointments to the bottom
  //       setTimeout(() => {
  //         fetchData(startDate, endDate, selectedDoctorsId);
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     console.error("Error ending appointment session:", error);
  //     notification.error({
  //       message: "Error",
  //       description: "Failed to end the appointment session. Please try again.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };




  //tooth post
  const handleToothPost = async () => {

    const payload = {
      hospital_id: parseInt(localStorage.getItem('hospital_id')),
      tech_id: selectedAppointment?.tech_id,
      patient_id: selectedAppointment?.patient_id || 1,
      appointment_id: selectedAppointment?.id,
      cdc_id: selectedTooth?.id,
      description: toothDescription,
      remark: toothRemark
    }
    console.log(payload);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${var_api}dentalhistorychart/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
      console.log("Update Success:", result);
      setIsOpenToothModal(false);
      notification.success({
        message: "Successful",
        description: "The Tooth has been Added.",
      });
      fetchToothDirections(selectedAppointment.id);
      setToothDescription('');
      setToothRemark('');

    } catch (error) {
      console.error("Error updating data:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update the patient medical history. Please try again.",
      });
    }
  }

  const handleOpenModalTooth = (tooth) => {
    console.log("motooth", tooth);
    setSelectedTooth(tooth);
    setIsOpenToothModal(true);
    if (tooth.dental_chart_description) {
      setToothDescription(tooth.dental_chart_description);
    } else {
      setToothDescription('');
    }
    if (tooth.dental_chart_remark) {
      setToothRemark(tooth.dental_chart_remark);
    } else {
      setToothRemark('');
    }
  }


  // Handle delete tooth
  const handleDeleteTooth = async () => {
    const token = localStorage.getItem("token");
    try {
      // Call DELETE API endpoint
      const response = await axios.delete(`${var_api}dentalhistorychart/delete/${selectedTooth?.dental_chart_id}`, {
        headers: {
          Authorization: token, // Pass token in the Authorization header
        },
      });

      if (response.status === 200) {
        fetchToothDirections(selectedAppointment.id);
        setIsOpenToothModal(false);
        notification.success({
          message: "Successful",
          description: "The Tooth has been deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to delete the patient medical history. Please try again.",
      });

    }
  };


  const columnsHistory = [
    {
      title: "S.No", // Serial number column
      key: "sno", // Unique key for the column
      render: (_, __, index) => index + 1, // Calculate serial number based on index
    },
    {
      title: "App.Id",
      dataIndex: "token_no",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "App.Date",
      dataIndex: "appointment_day",
      render: (text) => (
        text ? text : "N/A"
      ),
    },
    {
      title: " App.Time",
      dataIndex: "slot_time",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      render: (text) => (text === 0 ? "Not Paid" : text === 1 ? "Paid" : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const statusOption = options.find((option) => option.value === status);
        return statusOption ? statusOption.label : "N/A";
      },
    },
    {
      title: "Detal History", // New column for vital details
      dataIndex: "dental_medical_chart_count", // Key for the new column
      render: (text, record) => (
        <p onClick={() => handleDentalHistoryModal(record)} className="text-success text-md">{text}</p>
        // <Button
        //   icon={<EyeOutlined />}
        //   type="primary"
        //   onClick={() => handleDentalHistoryModal(record)} // Opens modal with row data
        // />
      ),
    },
  ];



  const columnspatientHistory = [
    {
      title: "S.No", // Serial number column
      key: "sno", // Unique key for the column
      render: (_, __, index) => index + 1, // Calculate serial number based on index
    },
    {
      title: "Appt Id",
      dataIndex: "token_no",
      render: (text) => (text ? `#${appointmentPrefix}${text}` : "N/A"),
    },
    {
      title: "Appt Date",
      dataIndex: "appointment_day",
      render: (text) => (
        text ? text : "N/A"
      ),
    },
    {
      title: " Appt Time",
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
        let badgeColor = text === 0 ? "red" : text === 1 ? "green" : "gray";

        return (
          <span style={{
            backgroundColor: badgeColor,
            color: "white",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
          }}>
            {statusText}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => getStatusBadge(status),
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


  const handleOpenSeriveHistory = (reco) => {
    console.log("reco", reco);
    setPatientServicedetails(reco);
    setIsOpenPatientServiceHistory(true);
  }

  const handleOpenOutsideHistory = () => {
    setIsOpenHistoryChart(true);
    fetchHistoryToothDirections(selectedAppointment?.id)
    console.log("vv", historytoothDirections, toothDirections);
  }


  const shouldHideVitals = (settings) => {
    if (!settings || typeof settings !== "object") {
      console.warn("Settings object is invalid:", settings);
      return true; // Hide vitals by default
    }

    // Specify vital fields
    const vitalFields = [
      "after_sugar",
      "before_sugar",
      "bmi_value",
      "bp",
      "height",
      "pulse",
      "spo2",
      "temp",
      "weight",
    ];

    // Check only vital fields
    const areVitalsHidden = vitalFields.every((field) => settings[field] == 0);

    console.log("Vital fields are hidden:", areVitalsHidden);
    return areVitalsHidden;
  };

  //delete doctor invocie
  const handleDeleteHistoryRow = async (id) => {
    try {
      // Get token from storage (adjust based on your auth implementation)
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch(`${var_api}invoicebillingdetail/delete-detail/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }


      notification.success({ message: 'Item deleted successfully!' });
      handleServiceTypesHistotry(selectedAppointment?.id);

    } catch (error) {
      console.error('Delete error:', error);
      notification.error({ message: error.message || 'Error deleting item' });
    }
  };



  //delete medical invoice
  const handleDeleteHistoryMedicalInvoice = async (id) => {
    try {
      // Get token from storage (adjust based on your auth implementation)
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch(`${var_api}medicalbillingdetail/delete-history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }


      notification.success({ message: 'Item deleted successfully!' });
      handelMedicationsHistory();

    } catch (error) {
      console.error('Delete error:', error);
      notification.error({ message: error.message || 'Error deleting item' });
    }
  };

  useEffect(() => {
    if (selectedCard !== null) {
      setIsPlusButtonVisible(true);
    }
  }, [selectedCard]);


  const handleGetpatientAptistotry = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const hospital_id = localStorage.getItem('hospital_id');

      // Call First API
      const response = await fetch(`${var_api}appointment/get-appointment-list/by-patient/${hospital_id}/${selectedAppointment.patient_id}`, {
        method: "GET",
        headers: { "Authorization": `${token}` }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      setPatientAptHistory(data || []);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching data:", error);

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  const handleOpenAptHistory = () => {
    setPatientAptHistory([]);
    setIsOpenAptHistory(true);
    handleGetpatientAptistotry();
  }


  const handleDeleteLastRow = () => {
    setRows((prevRows) => prevRows.slice(0, -1));
    console.log("Updated Rows:", rows);
    setIsEnable(false);
  }


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

  useEffect(() => {
    if (selectedCard !== null) {
      // This will run every time selectedCard changes
      console.log(`Selected card: ${selectedCard}`);
    }
  }, [selectedCard]);  // Depend on selectedCard to track changes


  // const handleClearDateRange = () => {
  //   setSelectedFilterDate(""); // Clear the displayed date range
  //   setStartDate(null); // Reset start date
  //   setEndDate(null); // Reset end date

  //   // Fetch data with empty date range (optional)
  //   fetchData(null, null, selectedDoctorsId, selectedPatientsId);
  // };

  useEffect(() => {
    const start = initialSettingsApt.startDate;
    const end = initialSettingsApt.endDate;
    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);
    setSelectedDatepic(`${formattedStart} - ${formattedEnd}`);
     fetchData(formattedStart, formattedEnd);
  }, []);


  const handleApply = (event, picker) => {
    // Ensure the dates are valid before formatting
    const startDate = picker.startDate?._d ?? null;
    const endDate = picker.endDate?._d ?? null;

    if (!startDate || !endDate) {
      console.error("Invalid date range selected");
      return;
    }

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const dateRange = `${formattedStartDate} - ${formattedEndDate}`;

    setSelectedDatepic(dateRange); // Update the input field
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);

    // if (selectedDoctorsId) {
    fetchData(formattedStartDate, formattedEndDate, selectedPatientsId);
    // } else {
    //   notification.warning({
    //     message: "Doctor Not Selected",
    //     description: "Please select a doctor before filtering by date.",
    //   });
    // }
  };


  //update the sub total for services
  // Calculate sum of final_price whenever rows change
  useEffect(() => {
    const total = rows.reduce((sum, row) => sum + (parseFloat(row.final_price) || 0), 0);
    setSubTotal((parseFloat(total) || 0).toFixed(2));
  }, [rows]); // Runs whenever `sortedRows` change

  const fetchpaymode = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}paymodemaster/get-by-active/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/admin/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return
      }


      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setpaymode(result || []);
      setmodeFilteredData(result || []);
      setLoading(false);
      console.log("paymodes", result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setpaymode([]);
      // notification.error({
      //   message: "Fetch Failed",
      //   description: "Unable to retrieve data. Please try again later.",
      // });
    } finally {
      setLoading(false);
    }
  };


  const fetchInvoice = async (id) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}invoicePaymode/get/${hospital_id}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/admin/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setInvoice(result || []);
      setInvoicefiltereddata(result || []); // Set initial filtered data
      setLoading(false);
      // Update modefiltereddata based on fetched result
      const filteredpayData = modefiltereddata.map(item => {
        const matchingResult = result.find(r => r.paymode_id == item.id);

        if (matchingResult) {
          return {
            ...item,
            paid_amount: matchingResult.paid_amount,
            appointment_id: matchingResult.appointment_id
          };
        } else {
          return {
            ...item,
            paid_amount: 0
          };
        }
      });
      console.log("textafter", filteredpayData);
      // Calculate total paid amount
      const totalPaidAmount = filteredpayData.reduce((total, item) => total + item.paid_amount, 0);

      setmodeFilteredData(filteredpayData);
      setTotalPayAmount(totalPaidAmount);

    } catch (error) {
      console.error("Error fetching data:", error);
      // notification.error({
      //   message: "Fetch Failed",
      //   description: "Unable to retrieve data. Please try again later.",
      // });
      console.log("textafter", modefiltereddata)
    } finally {
      setLoading(false);
    }
  };


  // onchnage for paymode text field
  const handlePayInputChange = (index, value) => {
    // Debug: Log the input value and its type
    console.log("Input Value:", value, "Type:", typeof value);

    // Ensure the value is converted to a valid number or default to 0
    const numericValue = parseFloat(value);
    const validatedValue = !isNaN(numericValue) && numericValue >= 0 ? numericValue : 0;

    // Debug: Log the validated numeric value
    console.log("Validated Numeric Value:", validatedValue);

    // Update the specific item's `paid_amount` in modefiltereddata
    const updatedModefilteredData = modefiltereddata.map((item, idx) => {
      if (idx === index) {
        return { ...item, paid_amount: validatedValue }; // Update `paid_amount`
      }
      return item; // Keep other items unchanged
    });

    // Debug: Log the updated modefiltereddata
    console.log("Updated ModefilteredData:", updatedModefilteredData);

    // Calculate the total paid amount
    const updatedTotal = updatedModefilteredData.reduce((acc, item) => {
      // Ensure each `paid_amount` is treated as a number
      const amount = parseFloat(item.paid_amount) || 0;
      return acc + amount;
    }, 0);

    // Debug: Log the calculated total
    console.log("Calculated Total Amount:", updatedTotal);

    // Update the payment details for the specific item
    const updatedPaymentInfo = {
      paymode_id: updatedModefilteredData[index]?.paymode_id || null, // Get paymode_id
      paidAmount: validatedValue, // Updated paid amount
    };

    // Debug: Log the updated payment info
    console.log("Updated Payment Info:", updatedPaymentInfo);

    // Update the state for payment details and filtered data
    const updatedPaymentDetails = [...paymentDetails];
    updatedPaymentDetails[index] = updatedPaymentInfo; // Update payment details at the index

    // Update states
    setPaymentDetails(updatedPaymentDetails);
    setCalculatatedpaymode(updatedModefilteredData);
    setTotalPayAmount(updatedTotal);


    // Debug: Final state logs
    console.log("Final Payment Details:", updatedPaymentDetails);
    console.log("Final Total Amount:", updatedTotal);
  };


  //onchange function for paymode card
  const handlePaymodeClick = (index) => {
    const updatedData = modefiltereddata.map((item, idx) => ({
      ...item,
      paid_amount: idx === index ? invoiceData?.final_charge : 0, // Assign final_amount to clicked paymode, others get 0
    }));
    console.log("paymos", invoiceData, totalPayAmount);
    setTotalPayAmount(0);
    setTotalPayAmount(invoiceData?.final_charge);

    setmodeFilteredData(updatedData);
    // Also update `paymentDetails`
    const updatedPaymentDetails = updatedData.map((item, idx) => ({
      id: item.id,
      paid_amount: item.paid_amount,
    }));

    console.log("up", updatedPaymentDetails, invoiceData);

    setCalculatatedpaymode(updatedPaymentDetails);
    // handlePayInputChange(index, existingServices?.final_amount); // Update calculations
  };


  //open the paymode list
  const handleOpenPay = () => {
    setIsPayModalVisible(true);
    fetchInvoice(selectedAppointment?.id);
  }



  const handlePayFormSubmit = async () => {
    let paidStatus;
    if (invoiceData && totalPayAmount) {
      if (parseFloat(totalPayAmount) < invoiceData.final_charge) {
        console.log(2); // Less than final_amount
        paidStatus = 2
      } else {
        console.log(1); // Greater than or equal to final_amount
        paidStatus = 1
      }
    } else {
      console.log("Please enter a valid amount"); // Handle edge cases
    }

    const payload = {
  paid_status: paidStatus
};

if (paidStatus === 1) {
  payload.paid_amount = totalAmount;
  payload.balance_amount = invoiceData?.final_charge - totalAmount;
}


    try {
      const token = localStorage.getItem("token");

      // Convert payload to a JSON string
      const jsonPayload = JSON.stringify(payload);
      const response = await fetch(`${var_api}gos-invoice-billing/update-payment/${invoiceData?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: jsonPayload
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
      console.log("Update Success:", result);

      notification.success({
        message: "Update Successful",
        description: "The paid has been updated.",
      });
      await handlecalculate();
      handleServiceTypesHistotry(selectedAppointment?.id);
      setIsPayModalVisible(false); // Close the modal on success
    } catch (error) {
      console.error("Error updating data:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update the patient medical history. Please try again.",
      });
    }
  };


  const handlecalculate = async () => {
    try {
      // Retrieve the hospital_id from localStorage
      const hospital_id = localStorage.getItem("hospital_id");
      const token = localStorage.getItem("token");
      // Prepare the data for the POST request
      const formData = calculatatedpaymode
        .filter((item) => item.paid_amount > 0) // Include only items with currentValue > 0
        .map((item) => ({
          paymode_id: item.id,
          paid_amount: item.paid_amount,
          hospital_id: hospital_id,
          appointment_id: invoiceData?.appointment_id || selectedAppointment?.id,
        }));
      // Determine the URL and HTTP method based on whether it's an update or create operation
      const url =
        `${var_api}invoicePaymode/post`;
      const method = "POST";
      // Send the request
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Make sure `token` is set correctly
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Error saving data");
      }
      const deleteformData = calculatatedpaymode
        .filter((item) => item.paid_amount === 0 || isNaN(item.paid_amount)) // Check for 0 or NaN
        .map((item) => ({
          paymode_id: item.id,
          appointment_id: invoiceData?.appointment_id,
        }));
      console.log("delete", deleteformData);
      if (deleteformData.length > 0) {
        await handleDelete(deleteformData);
      }
      handleServiceTypesHistotry(selectedAppointment?.id);
      setIsPayModalVisible(false);
    } catch (error) {
      console.error("Error saving data:", error);

      // Show an error notification if something goes wrong
      notification.error({
        message: "Operation Failed",
        description: "There was an error while saving the data.",
      });
    }
  };


  const handleDelete = async (deleteformData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${var_api}invoicePaymode/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(deleteformData), // Pass the payload here
      });
      handleServiceTypesHistotry(selectedAppointment?.id);

      if (!response.ok) throw new Error("Error deleting record");
    } catch (error) {
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    }
  };

  useEffect(() => {
    if (specializationCloneDetails.length > 0) {
      setSelectedCloneDoctorId(specializationCloneDetails[0].id);
      console.log("Updated selected doctor ID:", specializationCloneDetails[0].id);
    }
  }, [specializationCloneDetails]);


  //opens the edit for dicount
  const handleOpenEditDiscount = () => {
    setIsEditDiscount(true);
    setEditDiscount(existingServices?.discount);
  }

  // Handle input change
  const handleDiscountChange = (e) => {
    let newDiscount = e.target.value;

    // Convert to number (or keep it as 0 if empty)
    newDiscount = newDiscount === "" ? 0 : Number(newDiscount);
    setEditDiscount(newDiscount);
    // If newDiscount is 0 or empty, use existing final amount
    // const calculatedFinalAmount = newDiscount === 0 
    // ? existingServices?.sub_total 
    // : existingServices?.sub_total - newDiscount;
    //   setEditFinalAmount(calculatedFinalAmount);
    // };

    const calculatedFinalAmount = newDiscount === 0
      ? existingServices?.final_charge
      : existingServices?.final_charge - newDiscount;
    setEditFinalAmount(calculatedFinalAmount);
  };


  //cancel discount update
  const handleCancelDiscount = () => {
    setEditDiscount(existingServices?.discount);
    setEditFinalAmount(existingServices?.final_charge);
    setIsEditDiscount(false);
  }


  // Handle update
  const handleUpdateDiscount = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      // Example calculation: Adjust final_amount & final_sub_total based on discount
      const subto = existingServices?.medical_total + existingServices?.consultation
      const calculatedFinalAmount = subto - editDiscount;

      // Call API to update discount
      await axios.put(`${var_api}api/gosmain/update/${existingServices?.gos_id}`, {
        discount: editDiscount,
        final_charge: calculatedFinalAmount,
      },
        {
          headers: {
            Authorization: `${token}`, // Add Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      // Update the state with new value
      setExistingServices((prev) => ({
        ...prev,
        discount: editDiscount,
        final_charge: calculatedFinalAmount,
      }));

      // Hide input field after updating
      setIsEditDiscount(false);
    } catch (error) {
      console.error("Error updating discount:", error);
    }
  };


  const handleClearDateRange = () => {
    setSelectedDatepic(""); // Clears the displayed date
    setStartDate(null);
    setEndDate(null);

    // Fetch data without date filters
    fetchData(null, null, selectedPatientsId);
  };



  const upsertMedicalBillingDetails = async () => {
    setLoading(true);
    const hospital_id = localStorage.getItem("hospital_id");
    const updatedMedications = medications.map((medication) => {
      const totalDosages =
        parseInt(medication.is_morning) +
        parseInt(medication.is_noon) +
        parseInt(medication.is_evening) +
        parseInt(medication.is_night);

      const qty = totalDosages * medication.cycle;
      const total_amount = qty * medication.unit_price;

      return {
        ...medication,
        qty,
        total_amount,
        medical_billing_id: existingMedicalInvoice.invoice_id
      };
    });


    const payload = {
      hospital_id: parseInt(hospital_id),
      appointment_id: selectedAppointment.id,
      billing_details: updatedMedications,
    };
    console.log("m payload", payload);

    try {
      const response = await axios.put(`${var_api}medicalbilling/update-medical-details`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const result = response.data; // Return API response
      notification.success({
        message: "Success",
        description: "Update Successfully!",
      });
      handelMedicationsHistory();

    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      notification.error({
        message: "Failed",
        description: "Update Failed!",
      });
      throw error;
    }
    finally {
      setLoading(false);
    }
  }


  const handleFileSelect = (files) => {
  if (files.length > 0) {
    processFiles(Array.from(files));
  }
};

const handleFileDrop = (files) => {
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


const deleteFile = async (file) => {
  try {
    await axios.delete(`${var_api}cash_sheet/delete/${file.id}`);
    setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
  } catch (err) {
    console.error("Delete failed", err);
    alert("Failed to delete file.");
  }
};


  const handleAppointmentSubmit = async (e) => {
     setLoading(true);
  e.preventDefault();

    // Convert date to dd-mm-yyyy format
  const formattedDate = new Date(appointmentPrivateDate)
    .toLocaleDateString('en-GB') // 'en-GB' gives dd/mm/yyyy
    .split('/')
    .join('-'); // convert to dd-mm-yyyy


  const payload = {
    hospital_id: selectedAppointment.hospital_id,  // use your actual hospital ID
    apt_id: selectedAppointment.id,
    date: formattedDate, // formatted date here
    slot: selectedPrivateSlot,
    remark: remarkPrivate,
    status: 0,  // or default value
  };

  try {
    const response = await axios.post(`${var_api}private-appointemnt/post`, payload, {
      headers: {
        Authorization: token, // replace with actual token if required
      },
    });

    if (response.status === 200 || response.status === 201) {
       notification.success({
      message: 'Success',
      description: "Appointment booked successfully!"
    });
      setAppointmentPrivateDate('');
      setSelectedPrivateSlot('');
      setRemarkPrivate('');
    } else {
    //   notification.error({
    //   message: 'Error',
    //   description: "Failed to book appointment. Please try again."
    // });
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    // notification.error({
    //   message: 'Error',
    //   description: "Failed to book appointment. Please try again."
    // });
    
  } finally{
    setLoading(false); 
  }
};


const fetchUploadedFiles = async () => {
  try {
    const response = await axios.get(`${var_api}cash_sheet/list/${hospital_id}/${selectedAppointment.id}`);
    const data = response.data.data;

    const formattedFiles = data.map(file => ({
      id: file.cash_sheet_id,
      name: file.image_url.split('/').pop(),
      size: 0, // You can get size if needed
      extension: file.image_url.split('.').pop(),
      url: file.image_url,
      key: file.image_url.split('.amazonaws.com/')[1],
    }));

    setUploadedFiles(formattedFiles);
  } catch (error) {
    console.error("Error fetching uploaded documents:", error);
     notification.error({
      message: 'Error',
      description: "Failed to fetch uploaded documents."
    });
    // alert("Failed to fetch uploaded documents.");
  }
};

useEffect(() => {
  if (hospital_id && selectedAppointment?.id) {
    fetchUploadedFiles();
  }
}, [hospital_id, selectedAppointment]);



const FileIcon = ({ extension }) => {
  // render based on extension: jpg, png, pdf
};

const EyeIcon = () => <i className="bi bi-eye"></i>; // or use a library
const TrashIcon = () => <i className="bi bi-trash"></i>;

const previewFile = (url) => {
  if (url) {
    window.open(url, '_blank');
  } else {
    alert('Preview unavailable');
  }
};



const updateAppointmentStatus = async (appointmentId, newStatus) => {
  // Show confirmation dialog
  Modal.confirm({
    title: 'Confirm Status Change',
    content: `Are you sure you want to change this appointment to Completed?`,
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      const token = localStorage.getItem("token");
      try {
        const currentAppointment = selectedAppointment;
        
        const payload = {
          apt_id: appointmentId,
          date: currentAppointment.Private_date,
          slot: currentAppointment.private_slot,
          remark: currentAppointment.private_remark,
          status: newStatus
        };

        const response = await fetch(`${var_api}private-appointemnt/update/${currentAppointment.private_apt_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const updatedAppointment = await response.json();
          
          setSelectedAppointment(prev => ({
            ...prev,
            private_status: newStatus,
          }));

        const start_date = startDate ? formatDate(startDate) : formatDate(initialSettingsApt.startDate);
        const end_date = endDate ? formatDate(endDate) : formatDate(initialSettingsApt.endDate);

        await fetchData(start_date, end_date, selectedPatientsId);


          notification.success({
            message: 'Success',
            description: "Status updated successfully!"
          });
        } else {
          throw new Error('Failed to update status');
        }
      } catch (error) {
        console.error('Error:', error);
        notification.error({
          message: 'Error',
          description: "Failed to update status."
        });
      }
    }
  });
};

const renderSection = (sectionData, label) => {
  if (!sectionData) return <p>No data for {label}</p>;

  console.log("lable", label);
  
  return (
    <div>
      <table className="table" style={{ maxWidth: "80%" }}>
        <tbody>
          <tr>
            <td><strong>Subtotal:</strong></td>
            <td className="text-end">₹{sectionData.subtotal ?? 0}</td>
          </tr>
          <tr>
            <td>
              <strong>Discount:</strong>
            </td>
            <td className="text-end d-flex justify-content-end align-items-center">
              {editing ? (
                <>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="form-control form-control-sm w-50 me-2"
                    min="0"
                    max={sectionData.subtotal || 0}
                  />
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleDiscountSave(label)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setEditing(false);
                      setDiscountValue(sectionData.discount ?? 0);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  ₹{sectionData.discount ?? 0}
                  <button
                    className="btn btn-sm btn-link text-primary"
                    onClick={() => {
                      setEditing(true);
                      setDiscountValue(sectionData.discount ?? 0);
                    }}
                  >
                    <i className="fe fe-pencil text-danger" />
                  </button>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td><strong>Total:</strong></td>
            <td className="text-end" style={{ fontSize: "18px" }}>
              ₹{sectionData.total ?? 0}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Rest of your component remains the same */}
      <h6 className="mt-3">Service Details</h6>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Service</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {sectionData?.items?.length > 0 ? (
            sectionData.items.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{(Number(item.amount) || 0).toFixed(2)}</td>
                <td title={item?.remark || "No remark"}
                    style={{ cursor: "pointer" }}>
                  {(item?.remark?.slice(0, 10) || "No ")}
                  {item?.remark && item.remark.length > 3 ? "..." : ""}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No services available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


const handleDiscountSave = async (tabKey) => {
  const fieldMap = {
    op: "op_discount",
    scan: "scan_discount",
    investigation: "investigation_discount",
    review: "review_discount"
  };

  const fieldName = fieldMap[tabKey];
  console.log("fff", fieldName,tabKey, fieldMap[tabKey])

  if (!fieldName) return;

  try {
    const payload = { [fieldName]: Number(discountValue) };

    const response = await fetch(`${var_api}gos-invoice-billing/update-service-discount/${invoiceData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    await handleServiceTypesHistotry(selectedAppointment?.id)

    if (response.ok) {
      setEditing(false);
      notification.success({ message: `${label} Discount updated.` });
    } else {
      // notification.error({ message: result.error || "Update failed." });
    }
  } catch (error) {
    console.error(error);
    // notification.error({ message: "Something went wrong!" });
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
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                <h3 className="page-title">Registrations</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Registrations</li>
                </ul>
              </div>


              <div className="row align-items-center px-3 mt-3 gy-2 gx-3">

                {/* Doctor Select */}
                {/* {isapptdashboarddoctorfilterEnabled && (
                  <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                    <Select
                      className="select-social-img w-100"
                      placeholder="Select Doctor"
                      isSearchable
                      isClearable
                      options={doctorList.map((doctor) => ({
                        value: doctor.id,
                        label: `${doctor.name} (${doctor.specialization})`,
                      }))}
                      onChange={handleDoctorChangeFilter}
                      value={
                        selectedDoctorsId
                          ? {
                            value: selectedDoctorsId,
                            label: `${doctorList.find((d) => d.id === selectedDoctorsId)?.name} (${doctorList.find((d) => d.id === selectedDoctorsId)?.specialization})`,
                          }
                          : null
                      }
                    />
                  </div>
                )} */}

                 {/* <div className="col-12 col-sm-6 col-md-3 col-lg-2">
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      id="privateAppointmentsCheckbox"
      checked={showPrivateOnly}
      onChange={() => setShowPrivateOnly(!showPrivateOnly)}
      style={{
        width: "18px",
        height: "18px",
        marginTop: "0",
        cursor: "pointer"
      }}
    />
    <label 
      className="form-check-label" 
      htmlFor="privateAppointmentsCheckbox"
      style={{
        marginLeft: "5px",
        cursor: "pointer",
        userSelect: "none"
      }}
    >
      Show Appointment
    </label>
  </div>
</div> */}

                {/* Patient Select */}
                <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                  <Select
                    className="select-social-img w-100"
                    placeholder="Select Patient"
                    isSearchable
                    isClearable
                    options={patientList.map((p) => ({
                      value: p.id,
                      label: `${p.name}-(${p.running_no}) (${p.mobile_no})`,
                    }))}
                    onChange={handlePatientChangeFilter}
                    value={
                      selectedPatientsId
                        ? {
                          value: selectedPatientsId,
                          label: `${patientList.find((p) => p.id === selectedPatientsId)?.name}-(${patientList.find((p) => p.id === selectedPatientsId)?.running_no}) (${patientList.find((p) => p.id === selectedPatientsId)?.mobile_no})`,
                        }
                        : null
                    }
                  />
                </div>

                {/* Status Filter */}
                {isapptdashboardstatusfilterEnabled && (
                  <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                    <Select
                      className="select-social-img w-100"
                      placeholder="Select Status harinii"
                      isClearable
                      value={
                        selectedStatus
                          ? options.find((option) => option.value == selectedStatus)
                          : null
                      }
                      onChange={handleStatusChange}
                      options={options}
                      isSearchable={false}
                    />
                  </div>
                )}

                {/* Date Range Picker */}
                <div className="col-auto">
                  <div className="position-relative w-100">
                    <DateRangePicker initialSettings={initialSettingsApt} onApply={handleApply}>
                      <div style={{ position: "relative" }}>
                        <input
                          className="form-control date-range bookingrange"
                          type="text"
                          value={selectedDatepic}
                          placeholder="dd-mm-yyyy - dd-mm-yyyy"
                          readOnly
                          style={{
                            maxWidth: "100%",
                            fontSize: "14px",
                            padding: "5px 8px",
                            background: "white",
                            paddingRight: "30px",
                          }}
                        />
                        {selectedDatepic && (
                          <button
                            onClick={handleClearDateRange}
                            style={{
                              position: "absolute",
                              right: "8px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                              color: "#000",
                              padding: "2px",
                            }}
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    </DateRangePicker>
                  </div>
                </div>

                {/* Buttons */}
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 d-flex justify-content-end gap-2">
                  {/* <button
      type="button"
      className="btn btn-warning"
      onClick={() => {
        setSelectedDoctorsId(null);
        setSelectedDate("");
        setSelectedPatientsId(null);
        fetchData(null, null, null, null);
      }}
    >
      Clear
    </button> */}
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      setSelectedDoctorsId(null);
                      setSelectedPatientsId(null);
                      setSelectedStatus(null); // add this line
                      setSelectedDatepic(""); // add this line
                      setSelectedDate(""); // already present
                      fetchData(null, null, null);
                    }}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      handleModalOpen();
                      document.body.classList.add("mini-sidebar");
                    }}
                  >
                    Add New
                  </button>
                </div>
              </div>


            </div>
          </div>


          {/*<form>
   <div className="social-media-links d-flex justify-content-between align-items-center">
    
  <div className="d-flex align-items-center">
  <div className="filter-head">
      <div className="position-relative daterange-wraper me-2">
        <div className="input-groupicon calender-input">
          <DateRangePicker 
            initialSettings={initialSettings}
            onCallback={(start, end) => {
            const formattedStartDate = formatDate(new Date(start));
            const formattedEndDate = formatDate(new Date(end));
            if (selectedDoctorsId) {
              // Call fetchData with both the selected dates and doctor ID
              fetchData(formattedStartDate, formattedEndDate, selectedDoctorsId);
            } else {
              console.error("No doctor selected.");
              notification.warning({
                message: "Doctor Not Selected",
                description: "Please select a doctor before filtering by date.",
              });
            }
            }}
          >
          <input
            className="form-control  date-range bookingrange"
            type="text"
          />
          </DateRangePicker>
        </div>
          <i className="fa-solid fa-calendar-days" />
        </div>
       </div>
  <div className="col-auto" style={{marginBottom:'20px',marginRight:'10px'}}>
  <Select
  className="select-social-img"
  placeholder="Select Doctor"
  isSearchable={true}
  styles={{
    container: (provided) => ({
      ...provided,
      width: '200px', // Adjust width as needed
    }),
  }}
  options={doctorList.map((doctor) => ({
    value: doctor.id,
    label: `${doctor.name} (${doctor.specialization})`,
  }))}
  onChange={handleDoctorChangeFilter}
  value={
    selectedDoctorsId
        ? {
            value: selectedDoctorsId,
            label: `${doctorList.find((doctor) => doctor.id === selectedDoctorsId)?.name} (${doctorList.find((doctor) => doctor.id === selectedDoctorsId)?.specialization})`,
          }
        : null
  }
/>
</div>

<div className="col-auto" style={{marginBottom:'20px',marginRight:'10px'}}>
        <Select
        className="select-social-img"
        defaultValue={options.find((doctor) => doctor.value == localStorage.getItem('selectedStatus'))}
        onChange={handleStatusChange}
        options={options}
        placeholder="Select Platform"
        isSearchable={false}
        styles={{
          container: (provided) => ({
            ...provided,
            width: '200px', // Adjust width as needed
          }),
        }}
      /></div>

       </div>

        <div className="col-auto">
          <button type="button" className="btn btn-primary mx-1" style={{marginBottom:"20px"}} onClick={() => handleModalOpen()}>
            Add Appointment
          </button>
        </div>
      </div> 
    </form> */}





          {/* /Page Header */}
          <div className="row">
            {/* 1st card */}
            <div className={columns.firstCol}

              style={{
                position: "relative",
                borderRadius: "2px",      // Optional: Rounded corners
                padding: "10px",          // Add spacing inside the big card
                backgroundColor: "#f8f8f8", // Light gray background
              }}
            >
              {/* {isadmindashboardotherappointmentEnabled && (
                <div className="responsive-others-button">
                  <button onClick={handleOthersClick}>
                    Others
                  </button>
                </div>
              )} */}

              {/* {isPlusButtonVisible && selectedCard !== null && (
                <button
                  className="responsive-plus-button"
                  onClick={handleAddModal}
                >
                  +
                </button>
              )} */}


              {/* <h4>Appointments</h4> */}
              <div className="create-details-card"
                style={{
                  maxHeight: "1000px",
                  overflowY: "auto",
                  paddingRight: "5px",
                }}
              >
                {filteredData.length > 0 ? (
                  filteredData
      .filter(apt => !showPrivateOnly || (apt?.private_apt_id && apt.private_apt_id > 0))
      .map((apt, index) => (
                    <div
                      className="appointment-wrap appointment-grid-wrap p-1"
                      key={index}
                      style={{
                        padding: "10px",
                        borderRadius: "5px",
                        backgroundColor: selectedCard === index ? "rgba(170, 235, 240, 0.15)" : "#fff",
                        border: selectedCard === index ? "1px solid skyblue" : "none",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                      }}
                      onClick={() => {
                        console.log("🔥 Button Clicked!");

                        setIsPlusButtonVisible((prev) => !prev); // Toggle visibility
                        setSelectedCard(index);
                        handleEyeClick(apt);
                        handleGetpatientAptistotry(apt?.patient_id);
                        fetchToothDirections(apt?.id);
                        setSelectedCardData(apt);
                        setTabRows({
  op: [createEmptyServiceRow(0)],
  scan: [createEmptyServiceRow(1)],
  investigation: [createEmptyServiceRow(2)],
  review: [createEmptyServiceRow(3)]
})

                        setTimeout(() => {
                          console.log("After 100ms:", isPlusButtonVisible); // Check if it updates
                        }, 100);
                      }}
                    >

                        {/* Private Appointment Ribbon */}
 
                      <ul>
                        <li>
                          <div className="appointment-grid-head">
                            <div className="patinet-information">
                              <Link to="#">
                                <img
                                  src={
                                    apt?.patient_profile_image &&
                                      typeof apt.patient_profile_image === "string" &&
                                      apt.patient_profile_image.trim() !== "" &&
                                      /\.(jpeg|jpg|png|webp)$/i.test(apt.patient_profile_image)
                                      ? `${image_api}${apt.patient_profile_image}`
                                      : doctor_thumb_21
                                  }
                                  alt="User Image"
                                />
                              </Link>
                              <div className="patient-info">
                                <p style={{ fontSize: "18px" }}>#{appointmentPrefix}{apt?.token_no}</p>
                                <h6>
                                  <Link to="#">{apt?.patient_name} <span
                                    style={{
                                      color: '#1d7ed8',
                                      cursor: 'pointer',
                                      fontSize: '12px'  // Adjust size as needed
                                    }}

                                  >
                                    #{apt?.patient_running_no || ""}{text}
                                  </span>
                                  </Link>
                                </h6>
                                <p className="visit">{apt?.patient_mobile_no}</p>
                              </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                              {/* Time & Date Row (Responsive) */}
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                                flexWrap: "wrap", // ✅ Makes it responsive
                                justifyContent: "center" // ✅ Centers content on small screens
                              }}>

                                {/* Date */}
                                <p className="time-no-shape" style={{ fontWeight: "bold", marginBottom: "5px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                                  <i className="fe fe-calendar" style={{ color: "#007bff" }} /> {apt?.appointment_day}
                                </p>
                                {/* Time */}
                                <p className="time-no-shape" style={{ fontWeight: "bold", marginBottom: "5px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                                  <i className="fe fe-clock" /> {apt?.appointment_time}
                                </p>
                              </div>

                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                                flexWrap: "wrap", // ✅ Makes it responsive
                                justifyContent: "center" // ✅ Centers content on small screens
                              }}>


                              {/* Status Below */}
                              <span className="status-no-shape" style={{ fontWeight: "bold", marginTop: "5px" }}>
                                {getStatusBadge(apt.status)}
                              </span>

                              
 {apt?.private_apt_id && apt.private_apt_id > 0 && (
    <div style={{
      // position: "absolute",
      // top: "10px",
      // right: "10px",
     backgroundColor: apt.private_status === 0 ? "#ff6b6b" : "#28a745",
      color: "white",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "bold",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginRight:"5px"
    }}>
      <i className="fe fe-lock" style={{ fontSize: "10px" }} />
      <span>Private</span>
    </div>
  )}
                            </div>

                            </div>



                            <div className="grid-user-msg">
                              <span
                                className="video-icon"
                                onClick={(e) => {
                                  e.stopPropagation(); // ✅ Prevents parent div click event
                                  setSelectedCard(index);
                                  setIsPlusButtonVisible(true);
                                  setSelectedCardData(apt);
                                  handleEyeClick(apt);
                                  handleGetpatientAptistotry(apt?.patient_id);
                                  fetchToothDirections(apt?.id);
                                  setTabRows({
  op: [createEmptyServiceRow(0)],
  scan: [createEmptyServiceRow(1)],
  investigation: [createEmptyServiceRow(2)],
  review: [createEmptyServiceRow(3)]
})
                                }}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: "#007bff",
                                  display: "inline-block",
                                  padding: "8px",
                                }}
                              >
                                <Link to="#">
                                  <i className="fe fe-arrow-right" />
                                </Link>
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))
                ) : (
                  // Show No Data Message When There Are No Appointments
                  <div style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}>
                    <img src={noDataImage} alt="No Appointments" style={{ maxWidth: "100%", height: "auto" }} />
                  </div>
                )}
              </div>


            </div>



            {/* 2nd card */}
            {filteredData && Object.keys(filteredData).length > 0 && (
              <div className={columns.secondCol}>
                <div className="create-details-card">
                  <div className="create-details-card-head">
                    <div className="card-title-text d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center justify-content-between m-2">
                        {/* <ul
                          className="nav nav-tabs nav-tabs-solid"
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            flexWrap: "wrap", // Allow items to wrap on smaller screens
                            padding: "10px", // Add padding for better spacing
                          }}
                        >
                          <li className="nav-item">
                            <Link
                              className={`nav-link ${activefourthTab === "patientinfo" ? "active" : ""}`}
                              onClick={() => setActivefourthTab("patientinfo")}
                              to="#"
                            >
                              Patient Info
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className={`nav-link ${activefourthTab === "medicalhistory" ? "active" : ""}`}
                              onClick={() => setActivefourthTab("medicalhistory")}
                              to="#"
                            >
                              Medical History
                            </Link>
                          </li>

                          <li className="nav-item">
                            <button
                              onClick={
                                selectedAppointment?.doctor_specialization === "Dental"
                                  ? handleOpenOutsideHistory
                                  : handleOpenAptHistory
                              }
                              style={{
                                backgroundColor: "skyblue",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "auto", // Push the button to the right
                              }}
                            >
                              <Eye size={16} />
                            </button>
                          </li>
                        </ul> */}





                        {/* <div className="d-flex align-items-center">
 <span 
 onClick={() => {
   document.body.classList.add("mini-sidebar");
   handleEditClick();
 }} 
 style={{ cursor: "pointer", fontSize: "18px", display: "inline-flex", alignItems: "center" }}
>
 <ArrowRight size={24} color="green" />
</span>
   <FaTrash 
     className="text-danger" 
     onClick={showDeleteModal} 
     style={{ cursor: "pointer", fontSize: "15px" }} 
   />
 </div> */}
                      </div>

                      {/* <span className="text-right">
 <button className="btn btn-primary mx-1" onClick={handleOpenAptHistory}>
       Apt history
     </button>
   {
     selectedAppointment?.doctor_specialization === "Dental" &&
     <button type="submit" className="btn btn-success mx-1" onClick={handleOpenOutsideHistory}>
     Dental History
                   </button>
   }
 </span> */}

                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-success mx-1"
                          onClick={() => {
                            document.body.classList.add("mini-sidebar");
                            handleEditClick();
                          }}
                          style={{ fontSize: "14px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "5px" }}
                        >
                          <ArrowRight size={18} />
                        </button>
                        {/* <FaTrash
                          className="text-danger"
                          onClick={showDeleteModal}
                          style={{ cursor: "pointer", fontSize: "15px" }}
                        /> */}
                      </div>
                    </div>

                    {/* {activefourthTab === "patientinfo" && ( */}
                      <div className="patient-info-box">
                        {/* Row 1: APT ID, Name, Gender */}
                        <div className="row">
                          <div className="col-xl-3 col-md-4">
                            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <IdCard size={18} color="pink" />
                              <span style={{ color: "#1d7ed8" }}>#{appointmentPrefix}{selectedAppointment?.token_no || "-"}</span>
                            </p>
                          </div>

                          <div className="col-xl-3 col-md-6">
                            <label className="mt-2 fw-bolder" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <Calendar size={18} color="skyblue" />
                              <span className="fw-normal">{selectedAppointment?.appointment_day || "No date selected"}</span>
                            </label>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <label className="mt-2 fw-bolder" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <Clock size={18} color="black" />
                              <span className="fw-normal">{selectedAppointment?.appointment_time}</span>
                            </label>
                          </div>

                          <div className="col-xl-3 col-md-4">
                            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <User size={18} color="black" />
                              <span style={{ color: "black" }}>{selectedAppointment?.patient_name || "-"}</span>
                            </p>
                          </div>

                         
                        </div>

                        {/* Row 2: Age, Address */}
                        <div className="row">

                           <div className="col-xl-4 col-md-4">
                            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Users size={18} color="green" />
                              <span>{selectedAppointment?.patient_gender || "-"}</span>
                            </p>
                          </div>
                          <div className="col-xl-4 col-md-6">
                            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Cake size={18} color="orange" />
                              <span>{selectedAppointment?.patient_age || "-"}</span>
                            </p>
                          </div>

                          <div className="col-xl-4 col-md-6">
                            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <MapPin size={18} color="blue" />
                              <span>{selectedAppointment?.patient_full_address || "-"}</span>
                            </p>
                          </div>
                        </div>
                        <hr/>

<div className="start-appointment-set">
  <div className="form-bg-title">
    <h5>Appointment Details</h5>
  </div>

  <div className="row g-3">
    {/* Appointment Date */}
    <div className="col-xl-3 col-md-6">
      <label className="mt-2 fw-semibold d-flex align-items-center gap-2">
        <FaCalendarAlt color="#0dcaf0" />
        <span>{selectedAppointment?.Private_date || "No date selected"}</span>
      </label>
    </div>

    {/* Appointment Slot */}
    <div className="col-xl-3 col-md-6">
      <label className="mt-2 fw-semibold d-flex align-items-center gap-2">
        <FaClock color="#000" />
        <span>{selectedAppointment?.private_slot || "No slot selected"}</span>
      </label>
    </div>

    {/* Remarks */}
    <div className="col-xl-3 col-md-6">
      <label className="mt-2 fw-semibold d-flex align-items-center gap-2">
        <FaStickyNote color="#198754" />
        <span
              title={selectedAppointment?.private_remark || "No remark"}
      style={{ cursor: "pointer" }}
        >
          {(selectedAppointment?.private_remark?.slice(0, 10) || "No ")}
      {selectedAppointment?.private_remark && selectedAppointment.private_remark.length > 3 ? "..." : ""}
          </span>
      </label>
    </div>

    {/* Status */}
    <div className="col-xl-3 col-md-6">
  <label className="mt-2 fw-semibold d-flex align-items-center gap-2">
    <FaInfoCircle color="#6c757d" />
    <span 
      className={`badge rounded-pill px-3 py-1 ${
        selectedAppointment?.private_status == 0 ? "bg-warning text-dark" :
        selectedAppointment?.private_status == 1 ? "bg-success" :
        "bg-secondary"
      }`}
      style={{ 
        cursor: selectedAppointment?.private_status == 0 ? 'pointer' : 'not-allowed',
        opacity: selectedAppointment?.private_status == 0 ? 1 : 0.7
      }}
      onClick={() => {
        // Only allow action if status is pending (0)
        if (selectedAppointment?.private_status == 0) {
          updateAppointmentStatus(selectedAppointment.id, 1);
        }
      }}
    >
      {selectedAppointment?.private_status == 0
        ? "Pending"
        : selectedAppointment?.private_status == 1
        ? "Completed"
        : "No Appointments"}
    </span>
  </label>
</div>
  </div>
</div>
                       
                      </div>




                    {/* // )} */}

                    {/* {activefourthTab === "medicalhistory" && (
                      <div className="create-details-card-body">
                        <div className="start-appointment-set">
                          <div className="form-bg-title">
                            <h5>
                              Medical History{" "}
                              <i className="fe fe-pencil text-danger" onClick={handleEditswtich}></i>
                            </h5>
                          </div>

                      
                          <Row gutter={16}>
                            <Col span={8}>
                              <p>
                                Asthma:{" "}
                                <strong style={{ color: switchStates.asthma ? "green" : "red" }}>
                                  {switchStates.asthma ? "Yes" : "No"}
                                </strong>
                              </p>
                            </Col>
                            <Col span={8}>
                              <p>
                                Diabetes:{" "}
                                <strong style={{ color: switchStates.diabetes ? "green" : "red" }}>
                                  {switchStates.diabetes ? "Yes" : "No"}
                                </strong>
                              </p>
                            </Col>
                            <Col span={8}>
                              <p>
                                Drug Allergy:{" "}
                                <strong style={{ color: switchStates.drug_allergy ? "green" : "red" }}>
                                  {switchStates.drug_allergy ? "Yes" : "No"}
                                </strong>
                              </p>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={8}>
                              <p>
                                Pregnancy:{" "}
                                <strong style={{ color: switchStates.pregnancy ? "green" : "red" }}>
                                  {switchStates.pregnancy ? "Yes" : "No"}
                                </strong>
                              </p>
                            </Col>
                            <Col span={8}>
                              <p>
                                Blood Pressure (BP):{" "}
                                <strong style={{ color: switchStates.bp ? "green" : "red" }}>
                                  {switchStates.bp ? "Yes" : "No"}
                                </strong>
                              </p>
                            </Col>
                            <Col span={8}>
                              <p>
                                Cardiac:{" "}
                                <strong style={{ color: switchStates.cardiac ? "green" : "red" }}>
                                  {switchStates.cardiac ? "Yes" : "No"}
                                </strong>
                              </p>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={8}>
                              <p>
                                Others: <strong>-</strong>
                              </p>
                            </Col>
                            <Col span={8}>
                              <p>
                                Chief Complaints: <strong>-</strong>
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </div>

                    )} */}


                  </div>
                  <div className="create-details-card-body">
                    <div className="start-appointment-set">
                      <div className="appointment-details">


                        <div className="create-details-card-body">
                          <form>
                       
                             <div className="start-appointment-set">
  <div className="form-bg-title">
    <h5>
      Eye Details{" "}
      <i
        className="fe fe-pencil text-danger"
        onClick={handleEditClickvital} // You'll need to create this handler
      ></i>
    </h5>
  </div>
  <div className="row">
    {[
      { label: "Corrected OD", name: "corrected_od", unit: "", icon: <Eye size={18} color="blue" /> },
      { label: "Corrected OS", name: "corrected_os", unit: "", icon: <Eye size={18} color="blue" /> },
      { label: "Uncorrected OD", name: "uncorrected_od", unit: "", icon: <EyeOff size={18} color="red" /> },
      { label: "Uncorrected OS", name: "uncorrected_os", unit: "", icon: <EyeOff size={18} color="red" /> },
      { label: "IOP OD", name: "iop_od", unit: "mmHg", icon: <Gauge size={18} color="green" /> },
      { label: "IOP OS", name: "iop_os", unit: "mmHg", icon: <Gauge size={18} color="green" /> },
      { label: "Remarks", name: "remarks", unit: "", icon: <MessageCircle size={18} color="orange" /> }
    ].map((field) => (
      <div key={field.name} className="col-xl-4 col-md-6 col-sm-12">
        <label className="mt-2 fw-bolder" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {field.icon}
          <span className="fw-normal">{formVitalData[field.name] || "-"} {field.unit}</span>
        </label>
      </div>
    ))}

  </div>
</div>



                            
                          </form>

                        </div>
                        {/* <hr />
                        <div className="form-bg-title">
                          <h5>
                            Appointment Details{" "}

                            <i className="fe fe-pencil text-danger" onClick={toggleEditModal}></i>

                          </h5>
                        </div> */}
                        {/* <div className="row">
                          <div className="col-md-6">
                            <label className="mt-2 fw-bolder" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <Stethoscope size={18} color="blue" />
                              <span className="fw-normal">{selectedAppointment?.doctor_name}-{selectedAppointment?.doctor_specialization}</span>
                            </label>
                          </div>
                          <div className="col-md-6"> */}
                            {/* <label className="mt-2 fw-bolder" style={{ display: "flex", alignItems: "center", gap: "5px" }}>

 Referral   
 <span className="fw-normal">
   {selectedAppointment?.is_other_referal
     ? `${selectedAppointment?.other_referal_name} (${selectedAppointment?.other_referal_mobile})`
     : selectedAppointment?.referal_person_name || "Without Referral"}
 </span>
</label> */}
                          {/* </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="mt-2 fw-bolder" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <Calendar size={18} color="skyblue" />
                              <span className="fw-normal">{selectedAppointment?.appointment_day || "No date selected"}</span>
                            </label>
                          </div>
                          <div className="col-md-6">
                            <label className="mt-2 fw-bolder" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <Clock size={18} color="black" />
                              <span className="fw-normal">{selectedAppointment?.appointment_time}</span>
                            </label>
                          </div>
                        </div> */}


                        <hr />
                        <div className="form-bg-title d-flex justify-content-between align-items-center">
                          <h5>
                            Service Details{" "}
                          </h5>
                          <div>
                            {
                              invoiceData &&
                              <span className={`badge me-2 ${invoiceData?.payment_status == 0 ? "bg-danger" : invoiceData?.payment_status == 1 ? "bg-success" : invoiceData?.payment_status == 2 ? "bg-warning" : "bg-danger"}`} onClick={handleOpenPay}>
                                {invoiceData?.payment_status == 0 ? "Unpaid" : invoiceData?.payment_status == 1 ? "Paid" : invoiceData?.payment_status == 2 ? "Partial" : "UnPaid"}
                              </span>
                            }
                            {
                              invoiceData?.payment_status == 1 &&
                              // <Link
                              //                   // to={`/admin/doctor-invoice-report?id=${existingServices?.id}`} // Pass token as a query parameter
                              //                   to={{
                              //                     pathname: `/admin/doctor-invoice-report?id=${existingServices?.id}`,
                              //                     state: { from: "appointment-list" }
                              //                   }}
                              //                   className="btn btn-warning more-item mb-0"  
                              //                 ><PrinterIcon style={{ width: "16px", height: "16px" }}/></Link>
                                <Link
                                // to={{
                                //   pathname: `/admin/medical-invoice-report`,
                                //   state: { data: existingServices },
                                // }}
                                 to={{
                                                  pathname: `/admin/doctor-invoice-report`,
                                                  state: { from: "appointment-list", data: existingServices }
                                                }}
                                className="btn btn-warning more-item mb-0"
                              >
                                <PrinterIcon style={{ width: "16px", height: "16px" }} />
                              </Link>

                            }

                            {/* <button className="btn btn-primary" onClick={handleOpenPay}>Pay Now</button> */}
                          </div>
                        </div>
                        {invoiceData && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Grand Summary</h5>
            <table className="table" style={{ maxWidth: "80%" }}>
              <tbody>
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td className="text-end">₹{invoiceData.consultation + invoiceData.medical_total}</td>
                </tr>
                <tr>
                  <td><strong>Discount:</strong></td>
                  <td className="text-end">
                    ₹{invoiceData.discount}
                  </td>
                </tr>
                <tr>
                  <td><strong>Grand Total:</strong></td>
                  <td className="text-end" style={{ fontSize: "20px" }}>
                    ₹{(invoiceData.final_charge ?? 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Sections */}
      <Tabs defaultActiveKey="op" type="card" className="mb-4">
        {sectionTypes.map((type) => (
          <TabPane tab={type.toUpperCase()} key={type}>
            {renderSection(invoiceData?.[type], type)}
          </TabPane>
        ))}
      </Tabs>




                        {/* <div className="row">
       <div className="col-md-6">
       <label className="mt-2 fw-bolder" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
 <UserCheck size={18} color="black" />
 <span className="fw-normal">
   {selectedAppointment?.is_other_referal
     ? ${selectedAppointment?.other_referal_name} (${selectedAppointment?.other_referal_mobile})
     : selectedAppointment?.referal_person_name || "Without Referral"}
 </span>
</label>
       </div>
     </div> */}


                        {/* Edit Modal
     <AppointmentEditModal
       isOpen={isEditModalOpen}
       onClose={handleCloseModal}
       appointmentData={selectedAppointment}
     /> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* review col */}
                {/* <div className="create-details-card">
                  <div>
                    <div className="card-title-text m-2">
                      <h5>Review</h5>
                      <div className="star-container">
                        {datareview.length > 0 && datareview[0]?.rating_count ? (
                          <span className="custom-stars">
                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className={`fe ${index < datareview[0]?.rating_count ? "fe-star text-warning" : "fe-star-o text-secondary"}`}
                              ></i>
                            ))}
                          </span>
                        ) : (
                          <p className="text-muted">Not Yet Reviewed</p>
                        )}
                      </div>

                      <hr />

                    
                      <h5 className="mt-3">Patient Review</h5>

                      <div className="card p-3 mt-2">
                        <p className="mb-0">
                          {datareview.length > 0 && datareview[0]?.review_note
                            ? datareview[0].review_note
                            : "No review available."}
                        </p>
                      </div>

                      {isreviewreplyadminEnabled && datareview.length > 0 && (
                        <div className="review-card">
                          <textarea
                            className="form-control mt-3"
                            rows="2"
                            placeholder="Write a non-technical reply..."
                            value={reply} // ✅ Controlled input, now properly managed
                            onChange={(e) => setReply(e.target.value)}
                          ></textarea>
                          <div className="text-end mt-2">
                            <button className="btn btn-primary mt-2" onClick={() => handleFormSubmitReview(datareview[0]?.id)}>
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div> */}





              </div>


            )}











            {/* 3rd card */}

            <div className={columns.thirdCol}>

            </div>





            {/* <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-reeeeeesponsive">
                    <Table
                      pagination={{
                        total: filteredData.length,
                        pageSize: 10, // Limit to 2 rows per page
                        showSizeChanger: false,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      loading={loading}
                      columns={columns}
                      dataSource={filteredData}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <Modal
          title="Add Appointment"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          size="xxl"
          width={1000}
        >
          <Form onFinish={handleBookNowClick}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Left Side: Patient Details */}
              <div style={{ width: '48%' }}>
                <label className="mt-2 fw-bolder">
                  Phone No <span style={{ color: 'red' }}>*</span>
                </label>
                <CreatableSelect
                  inputId="mobile"
                  placeholder="Enter Mobile No"
                  maxLength={10}
                  required
                  value={
                    customerMobile
                      ? { label: customerMobile, value: customerMobile }
                      : null
                  }
                  onChange={handleMobileChange}
                  onInputChange={handleInputChange}
                  options={mobileOptions}
                  isSearchable
                  isClearable
                  noOptionsMessage={() => 'No mobile number found'}
                  formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                  getOptionLabel={(option) => option.label}
                />
                {loading && <p>Loading patient details...</p>}
                {patientDetails ? (
                  <div className="mt-3">
                    <h4>Patient Details</h4>

                    <div className="d-flex align-items-center mb-2 gap-2">
                      <img
                        src={
                          patientDetails.profile_image && /\.(jpeg|jpg|png|webp)$/i.test(patientDetails.profile_image)
                            ? `${image_api}${patientDetails.profile_image}`
                            : pat_dummy
                        }
                        alt="Profile"
                        height="70"
                        width="70"
                        className="mr-2"
                        style={{ borderRadius: '30%' }}
                      />
                      <p className="mb-0">{patientDetails.name}</p>
                    </div>

                    {/* Add space between this section and the next one */}
                    <div className="mb-3"></div>

                    <div className="d-flex flex-wrap gap-3 mb-2">
                      <p className="mb-0">{`DOB: ${patientDetails.dob}`}</p>
                      <p className="mb-0">{`Address: ${patientDetails.full_address}`}</p>
                    </div>

                    <div className="d-flex flex-wrap gap-3">
                      <p className="mb-0">{`Gender: ${patientDetails.gender}`}</p>
                      <p className="mb-0">{`Blood Group: ${patientDetails.blood_group}`}</p>
                    </div>
                  </div>
                ) : (
                  customerMobile.length === 10 && (
                    <div>
                      <p>Patient not found. Would you like to <strong>add a new patient?</strong></p>
                      {/* <Button type="dark" onClick={handleAddPatientClick}>Add Patient</Button> */}
                      <button type="button" className="btn btn-primary mx-1" onClick={handleAddPatientClick}>
                        Add Patient
                      </button>
                    </div>
                  )
                )}

                <div>
                  {/* <label className="mt-3 fw-bolder">
     Referal Person

  </label> */}

                  {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Form.Item style={{ marginBottom: 0 }}>
          <Checkbox checked={isOthers} onChange={(e) => setIsOthers(e.target.checked)}>
            Others
          </Checkbox>
        </Form.Item>
      </div> */}
                  {/* {
    !isOthers  ? (
      // <>
      //  <Form.Item
      //           label="Name"
      //           name="others_name"
      //           rules={[{ required: true, message: "Please input the name!" }]}
      //         >
      //           <Input  value={otherReferalName}
      //         onChange={(e) => setOtherReferalName(e.target.value)}/>
      //         </Form.Item>
      //         <Form.Item
      //           label="Phone No"
      //           name="others_phone"
      //           rules={[{ required: true, message: "Please input the name!" }]}
      //         >
      //           <Input value={otherReferalMobile}
      //         onChange={(e) => setOtherReferalMobile(e.target.value)}/>
      //         </Form.Item>
      // </>
      <CreatableSelect
      inputId="referal_person"
      placeholder="Enter referal person"
      // maxLength={10}
      required
      // value={
      //   customerMobile
      //     ? { label: customerMobile, value: customerMobile }
      //     : null
      // }
      onChange={handleReferalChange}
      // onInputChange={handleInputChange}
      options={referalPersons}
       value={referalPersons.find(option => option.value === referalPersonId) || null}
      isSearchable
      isClearable
      noOptionsMessage={() => 'Not found'}
      // formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
      // getOptionLabel={(option) => option.label}
    />

    ) : (
      <>
          <Form.Item
            label="Name"
            name="others_name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input
              value={otherReferalName}
              onChange={(e) => setOtherReferalName(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            label="Phone No"
            name="others_phone"
            rules={[{ required: true, message: "Please input the phone number!" }]}
          >
            <Input
              value={otherReferalMobile}
              onChange={(e) => setOtherReferalMobile(e.target.value)}
            />
          </Form.Item>
        </>
    )
  } */}

                </div>
                {/* <div style={{ textAlign: 'left', marginTop:"10px"}}>
        <label className="mt-2 fw-bolder">
      Appoitment Date <span style={{ color: 'red' }}>*</span>
    </label>
        <DatePicker
                                          className="form-control"
                                          selected={selectedDate}
                                          onChange={handleDateChange}
                                          dateFormat="dd/MM/yyyy"
                                          showDayMonthYearPicker />
                                          <br/>
        <p>
          <strong>Current Time:</strong> {currentTime}
        </p>
      </div> */}
              </div>

              {/* Right Side: Doctor Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* <div>
                  <label className="mt-2 fw-bolder">
                    Specialization <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Form.Item
                    name="specialization"
                    initialValue={specialization.length > 0 ? specialization[0].value : ""}
                    rules={[{ required: true, message: 'Please select a specialization!' }]}
                  >
                    <select
                      className="form-control"
                      required
                      value={selectedSpecializationId || (specialization.length > 0 ? specialization[0].value : "")}
                      onChange={(e) => handleSpecializationChange({ value: e.target.value })}
                    >
                      <option value="">Select Specialization</option>
                      {specialization.map((specialization) => (
                        <option key={specialization.value} value={specialization.value}>
                          {specialization.label}
                        </option>
                      ))}
                    </select>
                  </Form.Item>
                </div> */}

                {/* <div>
                  <label className="mt-2 fw-bolder">
                    Doctor <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Form.Item
                    name="doctor"
                    rules={[{ required: true, message: 'Please select a doctor!' }]}
                  >
                    <select
                      className="form-control"
                      required
                      value={selectedDoctorId || ""}
                      onChange={handleDoctorChange}
                    >
                      <option value="">Select Doctor</option>
                      {specializationDetails &&
                        Array.isArray(specializationDetails) &&
                        specializationDetails.length > 0 ? (
                        specializationDetails.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No doctors available</option>
                      )}
                    </select>
                  </Form.Item>
                </div> */}

                <div>
                  <label className="mt-2 fw-bolder">
                    Appoitment Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <DatePicker
                    className="form-control"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown  // Enables year selection dropdown
                    showMonthDropdown // Enables month selection dropdown
                    dropdownMode="select" // Ensures dropdown selection only
                    minDate={new Date(2000, 0, 1)}  // Set minimum allowed year
                    maxDate={new Date(2030, 11, 31)} // Set maximum allowed year
                  // onKeyDown={(e) => e.preventDefault()} // Disables manual typing
                  />
                </div>

                <ul className="time-slots" style={{
                  display: 'flex',
                  flexWrap: 'wrap', // Ensures wrapping for multiple rows
                  listStyleType: 'none',
                  padding: 0,
                  justifyContent: 'space-between' // Distributes slots evenly
                }}>
                  {dayTimings.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectTime(item.id, item.from_time)}
                      style={{
                        width: 'calc(33.33% - 8px)', // Ensures exactly 3 items per row
                        marginRight: index % 3 !== 2 ? '8px' : '0', // No right margin for every 3rd item
                        marginBottom: '8px', // Space between rows
                        backgroundColor: selectedTime && selectedTime.id === item.id ? '#007bff' : '#f0f0f0',
                        padding: '6px 10px', // Adjusted padding for better fit
                        borderRadius: '6px', // Rounded edges
                        fontSize: '14px', // Ensures readability
                        textAlign: 'center',
                        color: selectedTime && selectedTime.id === item.id ? '#fff' : '#333',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = selectedTime && selectedTime.id === item.id ? '#0056b3' : '#ddd')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = selectedTime && selectedTime.id === item.id ? '#007bff' : '#f0f0f0')}
                    >
                      {item.from_time}-{item.to_time}
                    </li>
                  ))}
                </ul>

              </div>




            </div>
            {/* Submit Button */}
            <div className="text-end mt-3">


              <Form.Item>

                <button
                  type="button"
                  className="btn btn-danger custom-btn"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                {/* <Button  type="primary" htmlType="submit" onClick={handleBookNowClick}>
            Book Now
          </Button> */}

                <button
                  type="button"
                  className="btn btn-primary mx-1 book-now-btn"
                  // onClick={handleBookNowClick}
                  onClick={handleConfirmAppointment}
                  disabled={!customerMobile || customerMobile.length !== 10} // Disable if no number or not 10 digits
                >
                  Book Now
                </button>

              </Form.Item>
            </div>
          </Form>
        </Modal>


        {modals.map((modal) => (
          <Modal
            key={modal.id}
            title="Add Appointment"
            visible={true} // Keep it always visible for now
            onCancel={() => setModals(modals.filter(m => m.id !== modal.id))} // Close only the clicked modal
            footer={null}
            size="xxl"
            width={1000}
          >
            {/* Place your form contents here */}
            <Form onFinish={handleBookNowClick}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Left Side: Patient Details */}
                <div style={{ width: '48%' }}>
                  <label className="mt-2 fw-bolder">
                    Phone No <span style={{ color: 'red' }}>*</span>
                  </label>
                  <CreatableSelect
                    inputId="mobile"
                    placeholder="Enter Mobile No"
                    maxLength={10}
                    required
                    value={
                      modal.data?.patient_mobile_no
                        ? { label: modal.data.patient_mobile_no, value: modal.data.patient_mobile_no }
                        : null
                    }
                    onChange={handleMobileChange}
                    onInputChange={handleInputChange}
                    options={mobileOptions}
                    isSearchable
                    isClearable
                    noOptionsMessage={() => 'No mobile number found'}
                    formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                    getOptionLabel={(option) => option.label}
                  />
                  {loading && <p>Loading patient details...</p>}
                  {modal.data ? (
                    <div className="mt-3">
                      <h4>Patient Details</h4>
                      <div className="d-flex align-items-center mb-2 gap-2">
                        <img
                          src={
                            modal.data.patient_profile_image && /\.(jpeg|jpg|png|webp)$/i.test(modal.data.patient_profile_image)
                              ? `${image_api}${modal.data.patient_profile_image}`
                              : pat_dummy
                          }
                          alt="Profile"
                          height="60"
                          width="60"
                          className="mr-2"
                        />
                        <p className="mb-0">{modal.data.patient_name}</p>
                      </div>

                      {/* Add space between this section and the next one */}
                      <div className="mb-3"></div>
                      <div className="d-flex flex-wrap gap-3 mb-2">
                        <p className="mb-0">{`DOB: ${modal.data.patient_dob}`}</p>
                        <p className="mb-0">{`Address: ${modal.data.patient_full_address}`}</p>
                      </div>
                      <div className="d-flex flex-wrap gap-3">
                        <p className="mb-0">{`Gender: ${modal.data.patient_gender}`}</p>
                        <p className="mb-0">{`Blood Group: ${modal.data.patient_blood_group}`}</p>
                      </div>
                    </div>
                  ) : (
                    customerMobile.length === 10 && (
                      <div>
                        <p>Patient not found. Would you like to <strong>add a new patient?</strong></p>
                        {/* <Button type="dark" onClick={handleAddPatientClick}>Add Patient</Button> */}
                        <button type="button" className="btn btn-primary mx-1" onClick={handleAddPatientClick}>
                          Add Patient
                        </button>
                      </div>
                    )
                  )}

                  <div>
                    {/* <label className="mt-3 fw-bolder">
     Referal Person
     
     <Form.Item style={{marginLeft: "20px"}}>
        <Checkbox
         checked={isOthers}
         onChange={(e) => setIsOthers(e.target.checked)}
        >
         Others
        </Checkbox>
        </Form.Item>

  </label> */}

                    {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Form.Item style={{ marginBottom: 0 }}>
          <Checkbox checked={isOthers} onChange={(e) => setIsOthers(e.target.checked)}>
            Others
          </Checkbox>
        </Form.Item>
      </div> */}
                    {/* {
    !isOthers  ? (
      // <>
      //  <Form.Item
      //           label="Name"
      //           name="others_name"
      //           rules={[{ required: true, message: "Please input the name!" }]}
      //         >
      //           <Input  value={otherReferalName}
      //         onChange={(e) => setOtherReferalName(e.target.value)}/>
      //         </Form.Item>
      //         <Form.Item
      //           label="Phone No"
      //           name="others_phone"
      //           rules={[{ required: true, message: "Please input the name!" }]}
      //         >
      //           <Input value={otherReferalMobile}
      //         onChange={(e) => setOtherReferalMobile(e.target.value)}/>
      //         </Form.Item>
      // </>
      <CreatableSelect
      inputId="referal_person"
      placeholder="Enter referal person"
      // maxLength={10}
      required
      // value={
      //   customerMobile
      //     ? { label: customerMobile, value: customerMobile }
      //     : null
      // }
      onChange={handleReferalChange}
      // onInputChange={handleInputChange}
      options={referalPersons}
       value={referalPersons.find(option => option.value === referalPersonId) || null}
      isSearchable
      isClearable
      noOptionsMessage={() => 'Not found'}
      // formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
      // getOptionLabel={(option) => option.label}
    />

    ) : (
      <>
          <Form.Item
            label="Name"
            name="others_name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input
              value={otherReferalName}
              onChange={(e) => setOtherReferalName(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            label="Phone No"
            name="others_phone"
            rules={[{ required: true, message: "Please input the phone number!" }]}
          >
            <Input
              value={otherReferalMobile}
              onChange={(e) => setOtherReferalMobile(e.target.value)}
            />
          </Form.Item>
        </>
    )
  } */}

                  </div>
                  {/* <div style={{ textAlign: 'left', marginTop:"10px"}}>
        <label className="mt-2 fw-bolder">
      Appoitment Date <span style={{ color: 'red' }}>*</span>
    </label>
        <DatePicker
                                          className="form-control"
                                          selected={selectedDate}
                                          onChange={handleDateChange}
                                          dateFormat="dd/MM/yyyy"
                                          showDayMonthYearPicker />
                                          <br/>
        <p>
          <strong>Current Time:</strong> {currentTime}
        </p>
      </div> */}
                </div>

                {/* Right Side: Doctor Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="mt-2 fw-bolder">
                      Specialization <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Form.Item
                      name="specialization"
                      initialValue={specializationClone.length > 0 ? specializationClone[0].value : ""}
                      rules={[{ required: true, message: 'Please select a specialization!' }]}
                    >
                      <select
                        className="form-control"
                        required
                        value={selectedCloneSpecializationId || ""}
                        onChange={(e) => handleCloneSpecializationChange({ value: e.target.value })}
                      >
                        <option value="">Select Specialization</option>
                        {specializationClone.map((spec) => (
                          <option key={spec.value} value={spec.value}>
                            {spec.label}
                          </option>
                        ))}
                      </select>

                    </Form.Item>
                  </div>



                  <div>
                    <label className="mt-2 fw-bolder">
                      Doctor <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Form.Item
                      name="doctor"
                      rules={[{ required: true, message: 'Please select a doctor!' }]}
                    >
                      <select
                        className="form-control"
                        required
                        value={selectedCloneDoctorId || ""} // Ensure it picks up the selected doctor ID
                        onChange={handleCloneDoctorChange}
                      >
                        {/* <option value="">Select Doctor</option> */}
                        {specializationCloneDetails.length > 0 ? (
                          specializationCloneDetails.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.name}
                            </option>
                          ))
                        ) : (
                          <option value="">No doctors available</option>
                        )}
                      </select>


                    </Form.Item>
                  </div>

                  <div>
                    <label className="mt-2 fw-bolder">
                      Appoitment Date <span style={{ color: 'red' }}>*</span>
                    </label>
                    <DatePicker
                      className="form-control"
                      selected={selectedCloneDate}
                      onChange={handleCloneDateChange}
                      dateFormat="dd/MM/yyyy"
                      showDayMonthYearPicker
                    />
                  </div>

                  <ul className="time-slots" style={{
                    display: 'flex',
                    flexWrap: 'wrap', // Ensures wrapping for multiple rows
                    listStyleType: 'none',
                    padding: 0,
                    justifyContent: 'space-between' // Distributes slots evenly
                  }}>
                    {dayCloneTimings.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleCloneSelectTime(item.id, item.available_from_time)}
                        style={{
                          width: 'calc(33.33% - 8px)', // Ensures exactly 3 items per row
                          marginRight: index % 3 !== 2 ? '8px' : '0', // No right margin for every 3rd item
                          marginBottom: '8px', // Space between rows
                          backgroundColor: selectedCloneTime && selectedCloneTime.id === item.id ? '#007bff' : '#f0f0f0',
                          padding: '6px 10px', // Adjusted padding for better fit
                          borderRadius: '6px', // Rounded edges
                          fontSize: '14px', // Ensures readability
                          textAlign: 'center',
                          color: selectedCloneTime && selectedCloneTime.id === item.id ? '#fff' : '#333',
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'all 0.2s ease-in-out',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = selectedCloneTime && selectedCloneTime.id === item.id ? '#0056b3' : '#ddd')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = selectedCloneTime && selectedCloneTime.id === item.id ? '#007bff' : '#f0f0f0')}
                      >
                        {item.available_from_time}-{item.available_to_time}
                      </li>
                    ))}
                  </ul>

                </div>




              </div>
              {/* Submit Button */}
              <div className="text-end mt-3">


                <Form.Item>

                  <button
                    type="button"
                    className="btn btn-danger custom-btn"
                    onClick={() => setModals(modals.filter(m => m.id !== modal.id))}
                  >
                    Cancel
                  </button>
                  {/* <Button  type="primary" htmlType="submit" onClick={handleBookNowClick}>
            Book Now
          </Button> */}

                  <button
                    type="button"
                    className="btn btn-primary mx-1 book-now-btn"
                    onClick={() => handleCloneConfirmAppointment(modal.id)}
                  //disabled={!customerMobile || customerMobile.length !== 10} // Disable if no number or not 10 digits
                  >
                    Book Now
                  </button>

                </Form.Item>
              </div>
            </Form>
          </Modal>
        ))}

        <Modal
          title="Confirm Appointment"
          visible={isConfirmationModalVisible}
          onCancel={() => setIsConfirmationModalVisible(false)}
          footer={null}
        >
          <h6>Appointment Details</h6>
          <div className="container">
            <div className="row align-items-center mb-3">
              <div className="col-auto">
                <img
                  src={
                    appointmentDetails.profile_image && /\.(jpeg|jpg|png|webp)$/i.test(appointmentDetails.profile_image)
                      ? `${image_api}${appointmentDetails.profile_image}`
                      : pat_dummy
                  }
                  alt={`${appointmentDetails.patientName}'s profile`}
                  style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                />
              </div>
              <div className="col">
                <p><strong>{appointmentDetails.patientName}</strong></p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <p><strong>DOB:</strong> {appointmentDetails.dob}</p>
              </div>
              <div className="col-6">
                <p><strong>Address:</strong> {appointmentDetails.address}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <p><strong>Gender:</strong> {appointmentDetails.gender}</p>
              </div>
              <div className="col-6">
                <p><strong>Blood Group:</strong> {appointmentDetails.bloodGroup}</p>
              </div>
            </div>
          </div>
          {/* <div>
    <p>
      <strong>Specialization:</strong> {appointmentDetails.specialization || "N/A"}
    </p>
    <p>
      <strong>Doctor:</strong> {appointmentDetails.doctor || "N/A"}
    </p>
  </div> */}
          <div className="container">
            <div className="row mb-3">
              <div className="col-md-6">
                <p>
                  <strong>Specialization:</strong> {
                    specialization.find(spec => spec.value == selectedSpecializationId)?.label || "N/A"
                  }
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Doctor:</strong> {
                    specializationDetails.find(doctor => doctor.id == selectedDoctorId)?.name || "N/A"
                  }
                </p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Button type="button" className="btn btn-danger" onClick={() => setIsConfirmationModalVisible(false)} style={{ marginRight: "10px" }}>
              Cancel
            </Button>

            <Button
              type="button"
              className="btn btn-primary mx-1"
              onClick={handleConfirmAppointment}>

              Confirm

            </Button>
          </div>
        </Modal>

        <Modal
          title="Vital Details"
          visible={isModal}
          onCancel={closeModal}
          footer={null} // Remove default footer if not needed
        >
          {selectedRecord && (
            <div>
              {/* First Row: Weight and Height */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                {/* Input for Weight */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Weight:</label>
                  <Input
                    value={formData.weight}
                    onChange={(e) => handlevitalInputChange(e, 'weight')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
                {/* Input for Height */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Height:</label>
                  <Input
                    value={formData.height}
                    onChange={(e) => handlevitalInputChange(e, 'height')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
              </div>

              {/* Second Row: Before Sugar and After Sugar */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                {/* Input for Before Sugar */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Before Sugar:</label>
                  <Input
                    value={formData.before_sugar}
                    onChange={(e) => handlevitalInputChange(e, 'before_sugar')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
                {/* Input for After Sugar */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>After Sugar:</label>
                  <Input
                    value={formData.after_sugar}
                    onChange={(e) => handlevitalInputChange(e, 'after_sugar')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                {/* Input for Before Sugar */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>BMI value:</label>
                  <Input
                    value={formData.bmi_value}
                    onChange={(e) => handlevitalInputChange(e, 'bmi_value')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
                {/* Input for After Sugar */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Blood Pressure:</label>
                  <Input
                    value={formData.bp}
                    onChange={(e) => handlevitalInputChange(e, 'bp')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                {/* Input for Before Sugar */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Pulse:</label>
                  <Input
                    value={formData.pulse}
                    onChange={(e) => handlevitalInputChange(e, 'pulse')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
                {/* Input for After Sugar */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>SPO2:</label>
                  <Input
                    value={formData.spo2}
                    onChange={(e) => handlevitalInputChange(e, 'spo2')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                {/* Input for Before Sugar */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Temperature:</label>
                  <Input
                    value={formData.temp}
                    onChange={(e) => handlevitalInputChange(e, 'temp')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Diagonosis:</label>
                  <Input
                    value={formData.diagnosis}
                    onChange={(e) => handlevitalInputChange(e, 'diagonosis')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                {/* Input for Before Sugar */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Problem:</label>
                  <Input
                    value={formData.problem}
                    onChange={(e) => handlevitalInputChange(e, 'problem')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: "bold" }}>Note:</label>
                  <Input
                    value={formData.note}
                    onChange={(e) => handlevitalInputChange(e, 'note')}
                  // readOnly // Make it readonly if you don't want it editable
                  />
                </div>
              </div>
            </div>

          )}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button type="button" className="btn btn-primary mx-1" onClick={handleUpdate}>
              Update{" "}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </Modal>



        {/* medical history dental chart */}
        <Modal
          title="History"

          visible={isOpenHistoryChart}
          onCancel={() => setIsOpenHistoryChart(false)}
          footer={null}
          width="90vw" // Responsive width
          style={{ maxWidth: "1150px" }} // Maximum width limit
          bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }} // Scrollable content

        >

          <>
            <div className="col-auto ml-auto">
              <ul className="nav nav-tabs nav-tabs-solid">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activethirdTab === "Apthistory" ? "active" : ""}`}
                    onClick={() => setActivethirdTab("Apthistory")}
                    to="#"
                  >
                    Apt History
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activethirdTab === "DentalHistory" ? "active" : ""}`}
                    onClick={() => setActivethirdTab("DentalHistory")}
                    to="#"
                  >
                    Dental History
                  </Link>
                </li>
              </ul>
            </div>

            {activethirdTab === "DentalHistory" && (

              <ul className="nav nav-tabs nav-tabs-solid m-2">
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
            )}
            {activeSecondTab === "current_appointment" && activethirdTab === "DentalHistory" && (
              <>

                <span style={{ color: '#1d7ed8' }}>
                  #{appointmentPrefix}{selectedToothHistory?.token_no || selectedAppointment?.token_no || "N/A"}
                </span>
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
            {activeSecondTab === "history" && activethirdTab === "DentalHistory" && (
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

            {activethirdTab === "Apthistory" && (
              <>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span></span>
                  <span className="text-muted small" style={{ marginLeft: "-30px" }}>
                    Total Appointments: <strong>{totalAppointments}</strong> |
                    Total Cost: <strong>{(parseFloat(totalAmount) || 0).toFixed(2)}</strong>
                  </span>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <Table
                        pagination={{
                          total: patientAptHistory.length,
                          pageSize: 10, // Limit to 10 rows per page
                          showSizeChanger: false,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
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
              </>
            )}


            {/* <>
             <div className="row">
             <div className="col-md-6 col-xl-6 col-sm-12">
  <div className="create-details-card">
    {
      historytoothDirections['Upper Left'] && historytoothDirections['Upper Left'].length > 0 ? (
        [...Array(Math.ceil(historytoothDirections['Upper Left'].length / 4))].map((_, rowIndex) => (
          <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px'}}>
            {
              historytoothDirections['Upper Left']
                .slice(rowIndex * 4, (rowIndex + 1) * 4)
                .map((dir, index) => (
                  <Col
                    key={index}
                    lg={6}
                  
                    style={{ paddingLeft: '8px', paddingRight: '8px'}} // Horizontal gap between columns
                    onClick={() => handleOpenModalTooth(dir)}
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
      historytoothDirections['Upper Right'] && historytoothDirections['Upper Right'].length > 0 ? (
        [...Array(Math.ceil(historytoothDirections['Upper Right'].length / 4))].map((_, rowIndex) => (
          <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px'}}> 
            {
              historytoothDirections['Upper Right']
                .slice(rowIndex * 4, (rowIndex + 1) * 4)
                .map((dir, index) => (
                  <Col
                    key={index}
                    lg={6}
                    style={{ paddingLeft: '8px', paddingRight: '8px'}} // Horizontal gap between columns
                    onClick={() => handleOpenModalTooth(dir)}
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
      historytoothDirections['Lower Left'] && historytoothDirections['Lower Left'].length > 0 ? (
        [...Array(Math.ceil(historytoothDirections['Lower Left'].length / 4))].map((_, rowIndex) => (
          <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px'}}> 
            {
              historytoothDirections['Lower Left']
                .slice(rowIndex * 4, (rowIndex + 1) * 4)
                .map((dir, index) => (
                  <Col
                    key={index}
                    lg={6}
                    // className="d-flex justify-content-center"
                    style={{ paddingLeft: '8px', paddingRight: '8px'}} // Horizontal gap between columns
                    onClick={() => handleOpenModalTooth(dir)}
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
      historytoothDirections['Lower Right'] && historytoothDirections['Lower Right'].length > 0 ? (
        [...Array(Math.ceil(historytoothDirections['Lower Right'].length / 4))].map((_, rowIndex) => (
          <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px'}}> 
            {
              historytoothDirections['Lower Right']
                .slice(rowIndex * 4, (rowIndex + 1) * 4)
                .map((dir, index) => (
                  <Col
                    key={index}
                    lg={6}
                   
                    style={{ paddingLeft: '8px', paddingRight: '8px'}} // Horizontal gap between columns
                    onClick={() => handleOpenModalTooth(dir)}
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
           </> */}
          </>
          <div style={{ textAlign: "right" }}>
            <Button onClick={() => setIsOpenHistoryChart(false)} style={{ marginRight: "10px" }}>
              Cancel
            </Button>
          </div>
        </Modal>




        <Modal
          title="Confirm Tooth"
          visible={isOpenToothModal}
          onCancel={() => setIsOpenToothModal(false)}
          footer={null}
        >
          <div>
            <p><strong>FDI:</strong> <span style={{ fontSize: "18px", color: "green" }}> {selectedTooth?.fdi}</span></p>
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            {/* Input for Weight */}
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold" }}>Description:</label>
              <Input
                value={toothDescription}
                onChange={(e) => setToothDescription(e.target.value)}
              // readOnly // Make it readonly if you don't want it editable
              />
            </div>
            {/* Input for Height */}
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold" }}>Remark:</label>
              <Input
                value={toothRemark}
                onChange={(e) => setToothRemark(e.target.value)}
              // readOnly // Make it readonly if you don't want it editable
              />
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <Button onClick={() => setIsOpenToothModal(false)} style={{ marginRight: "10px" }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleToothPost} style={{ marginRight: "10px" }}>
              {
                selectedTooth?.dental_chart_id ? "Update" : "Confirm"
              }
            </Button>
            {
              selectedTooth?.dental_chart_id && <a
                href="#"
                className="me-1 btn btn-sm bg-danger-light" onClick={handleDeleteTooth}>
                Delete
              </a>
            }
          </div>
        </Modal>




        {/* end session button */}

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
  className={`nav-link ${activeTab === "documents" ? "active" : ""}`}
  onClick={() => setActiveTab("documents")}
  to="#"
>
  Documents
</Link>
            </li>

              <li className="nav-item">
            <Link
  className={`nav-link ${activeTab === "appointments" ? "active" : ""}`}
  onClick={() => setActiveTab("appointments")}
  to="#"
>
  Appointments
</Link>
            </li>
            

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
              <div style={{ textAlign: "right", marginTop:"10px" }}>
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
            )}
            <br/>

          {/* Content */}
        {['op', 'scan', 'investigation', 'review'].map(tab => (
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

                   {/* <div className="input-block input-block-new">
  <label className="form-label">Price</label>
  <input 
    type="number" 
    className="form-control" 
    value={row.price || ''}
    readOnly
  />
</div> */}

  {/* Quantity Field */}
          {/* <div className="input-block input-block-new">
            <label className="form-label">Quantity</label>
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleQtyChange(row.id, -1)}
                disabled={row.qty <= 1} // Disable if quantity would go below 1
              >
                -
              </button>
              <input
                type="number"
                className="form-control mx-2"
                value={row.qty || 1}
                min="1"
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  handleDirectQtyChange(row.id, Math.max(1, value));
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleQtyChange(row.id, 1)}
              >
                +
              </button>
            </div>
          </div> */}

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
          <div className="file-list">
            {uploadedFiles.map((file, index) => (
              <div key={index}  className="d-flex justify-content-between align-items-center border rounded p-2 mb-2 file-item">
                <div className="file-info">
                  <FileIcon extension={file.extension} />
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    {/* <span className="file-size">{formatFileSize(file.size)}</span> */}
                    <span className="file-status text-success">
                      <CheckCircleIcon /> Uploaded
                    </span>
                  </div>
                </div>
                <div className="file-actions">
                 <button 
  className="btn btn-sm btn-outline-primary"
  onClick={() => handlePreview(file.url)}  // Pass file.url directly
>
  <EyeIcon /> View
</button>
                  <button 
                    className="btn btn-sm btn-outline-danger ml-2"
                    onClick={() => deleteFile(file)}
                  >
                    <TrashIcon /> Delete
                  </button>
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

          {/* {activeTab === "medications" && (
            <div className="start-appointment-set">
              <div className="form-bg-title">
                <h5>Medications</h5>
              </div>
              {selectedAppointment?.status == 3 && (
                <button className="btn btn-warning" onClick={upsertMedicalBillingDetails}>update</button>
              )}
              <div className="row meditation-row">
                <div className="col-md-12">
                  <div className="add-new-med text-end mb-4">
                    <Link
                      to="#"
                      className="add-medical more-item mb-0"
                      onClick={handleAddNewMedication}
                    >
                      Add New
                    </Link>
                  </div>

                  {sortedMedications?.map((medication) => (
                    <div className="d-flex flex-wrap medication-wrap align-items-center p-3" key={medication.id}>
                      <div className="input-block input-block-new">
                        <label className="form-label">Name</label>
                        {selectedAppointment?.status == 3 ? (
                          <Select
                            placeholder="Select"
                            options={meditions}
                            value={meditions.find(option => option.value == medication.sub_cat_id) || null}
                            onChange={(selectedOption) => handleMedicationSelect(medication.id, selectedOption)}
                          />
                        ) : (
                          <Select
                            placeholder="Select"
                            options={meditions}
                            value={meditions.find(option => option.value === medication.sub_cat_id) || null}
                            onChange={(selectedOption) => handleMedicationSelect(medication.id, selectedOption)}
                          />
                        )}
                      </div>

                      <div className="input-block input-block-new">
                        <label className="form-label">Duration</label>
                        {selectedAppointment?.status == 3 ? (
                          <input
                            type="text"
                            className="form-control"
                            placeholder="0000"
                            onChange={(e) => handleInputDurationUpdateChange(medication.id, e)}
                            onKeyDown={handleKeyPress}
                            maxLength={4}
                            value={
                              (medications.find(med => med.id === medication.id)?.is_morning ?? "0").toString() +
                              (medications.find(med => med.id === medication.id)?.is_noon ?? "0").toString() +
                              (medications.find(med => med.id === medication.id)?.is_evening ?? "0").toString() +
                              (medications.find(med => med.id === medication.id)?.is_night ?? "0").toString()
                            }
                          />
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            placeholder="0000"
                            onChange={(e) => handleInputDurationChange(medication.id, e)}
                            onKeyDown={handleKeyPress}
                            maxLength={4}
                          />
                        )}
                      </div>

                      <div className="input-block input-block-new">
                        <label className="form-label">Duration (in days)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={medication.cycle}
                          required
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || Number(value) >= 0) {
                              handleMedicationChange(medication.id, 'cycle', value);
                            }
                          }}
                        />

                      </div>

                      <div className="input-block input-block-new">
                        <label className="form-label">Instruction</label>
                        <input
                          type="text"
                          className="form-control"
                          value={medication.remarks}
                          onChange={(e) => handleMedicationChange(medication.id, 'remarks', e.target.value)}
                        />
                      </div>

                      <div className="input-block input-block-new">
                        <label className="form-label">Before / After Food</label>
                        <Select
                          placeholder="Select"
                          options={beforeAfter}
                          value={beforeAfter.find(option => option.value == medication.is_before_food) || null}
                          onChange={(selectedOption) => handleMedicationChange(medication.id, 'is_before_food', selectedOption.value)}
                        />
                      </div>

                      <div className="delete-row">
                        {selectedAppointment?.status == 3 ? (
                          sortedMedications.length > 1 && (
                            <Link
                              to="#"
                              className="delete-btn delete-medication trash text-danger"
                              onClick={() => handleDeleteHistoryMedicalInvoice(medication.mbd_id)}
                            >
                              <i className="fe fe-trash" />
                            </Link>
                          )
                        ) : (
                          <Link
                            to="#"
                            className="delete-btn delete-medication trash text-danger"
                            onClick={() => handleDeleteMedication(medication.id)}
                          >
                            <i className="fe fe-trash" />
                          </Link>
                        )}
                      </div>
                   
                    </div>
                  ))}
 <div className="row mt-4">
  <div className="col-md-4">
    <div className="input-block">
      <label className="form-label">Doctor Consultation Fee</label>
      <input
        type="number"
        className="form-control"
        placeholder="Enter fee"
        value={consultationFee}
        onChange={(e) => setConsultationFee(parseFloat(e.target.value) || 0)}
      />
    </div>
  </div>

  <div className="col-md-4">
    <div className="input-block">
      <label className="form-label">Discount</label>
      <input
        type="number"
        className="form-control"
        placeholder="Enter discount"
        value={discount}
        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
      />
    </div>
  </div>

  <div className="col-md-4">
    <div className="input-block">
      <label className="form-label">Final Amount</label>
      <input
        type="number"
        className="form-control"
        value={consultationFee - discount}
        readOnly
      />
    </div>
  </div>
</div>

                </div>
              </div>
            </div>
          )} */}


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


          {/* <div className="col-md-12">
                                                   <div className="form-set-button">
                                                       <button className="btn btn-light" type="button">
                                                           Cancel
                                                       </button>
                                                       <button
                                                           className="btn btn-primary"
                                                           type="button"
                                                           data-bs-toggle="modal"
                                                           data-bs-target="#end_session"
                                                           // onClick={endAppointmentSession}
                                                       >
                                                          End session
                                                       </button>
                                                   </div>
                                               </div> */}

         
        </Modal>


        <Modal
          title={
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>Appointment History</span>
              <span className="text-muted small" style={{ marginLeft: "-30px" }}>
                Total Appointments: <strong>{totalAppointments}</strong> |
                Total Cost: <strong>{(parseFloat(totalAmount) || 0).toFixed(2)}</strong>

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
                    total: patientAptHistory.length,
                    pageSize: 10, // Limit to 2 rows per page
                    showSizeChanger: false,
                    onShowSizeChange: onShowSizeChange,
                    itemRender: itemRender,
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
                Total Cost: <strong>{(parseFloat(finalAmount) || 0).toFixed(2)}</strong>
              </span>
            </div>
          }
          visible={isOpenPatientServiceHistory}
          onCancel={() => setIsOpenPatientServiceHistory(false)}
          footer={null}
          width={800}
        >
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <Table
                  pagination={{
                    total: PatientServicedetails.length,
                    pageSize: 10, // Limit to 2 rows per page
                    showSizeChanger: false,
                    onShowSizeChange: onShowSizeChange,
                    itemRender: itemRender,
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
          title={"Select Paymode"}
          visible={isPayModalVisible}
          onCancel={() => setIsPayModalVisible(false)}
          footer={null}
        >
          {invoiceData && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px' }}>Final Amount: <span style={{ fontSize: '18px' }}>{invoiceData?.final_charge}</span></h4>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontSize: '16px' }}>Receive Amount: <span style={{ fontSize: '18px', color: 'green' }}>{totalPayAmount}</span></h4>
                <h4 style={{ fontSize: '16px' }}>
                  Balance Amount:
                  <span style={{ fontSize: '18px', color: invoiceData?.final_amount - totalAmount < 0 ? 'red' : 'black' }}>
                    {Math.max((invoiceData?.final_charge - totalPayAmount).toFixed(2), 0)}
                  </span>
                </h4>
              </div>
            </div>
          )}
          <div>

            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: "center" }}>Paymode</th>
                  <th scope="col" style={{ textAlign: "center" }}>Bill</th>
                </tr>
              </thead>
              <tbody>
                {modefiltereddata.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div
                        className={`card ${item.paid_amount > 0 ? 'bg-success text-light' : 'bg-light text-dark'}`}
                        style={{
                          width: "auto",
                          height: "auto",
                          margin: "0px",
                          maxWidth: "120px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => handlePaymodeClick(index)}
                      // onClick={() => {
                      //   // When clicked, update the input field with the paymode_name
                      //   const updatedData = [...modefiltereddata];
                      //   updatedData[index].paid_amount = item.paid_amount; // Keeps the same paid amount, just highlights the paymode
                      //   setmodeFilteredData(updatedData); // Update state with new array
                      // }}
                      >
                        <div className="card-body p-1" style={{ textAlign: "center", padding: "4px" }}>
                          {item.paymode_name}
                        </div>
                      </div>
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={item.paid_amount}
                        style={{ width: "80px" }}
                        marginRight={"10px"}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);

                          // Prevent negative input
                          if (value < 0) return;

                          const updatedData = [...modefiltereddata];
                          updatedData[index].paid_amount = value; // Update the specific item in the array

                          setmodeFilteredData(updatedData); // Update state with new array
                          handlePayInputChange(index, value); // Pass the index or value based on your use case
                        }}
                        onKeyDown={(e) => {
                          // Prevent using '-' key
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <button
                className="btn btn-primary mx-1"
                style={{
                  color: "white",
                  border: "none",
                  padding: "5px 5px",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={handlePayFormSubmit}
              >
                {invoiceData?.payment_status === 0 ? "Submit" : "Update"}  {/* Change button text based on paid status */}
              </button>
              <button
                className="btn btn-danger mx-1"
                style={{
                  color: "white",
                  border: "none",
                  padding: "5px 5px",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={() => setIsPayModalVisible(false)}
              >
                Close
              </button>
            </div>

          </div>
        </Modal>

       <Modal
  visible={showModal}
  onRequestClose={handleCancelEdit}
  onCancel={handleCloseModal}
  footer={null}
  contentLabel="Edit Vitals"
>
  <h5>Edit Eye Details</h5>
  <form onSubmit={handleEditVitalClick}>
    <div className="row">
      {[
        { label: "Corrected OD", name: "corrected_od", unit: "", type: "text" },
        { label: "Corrected OS", name: "corrected_os", unit: "", type: "text" },
        { label: "Uncorrected OD", name: "uncorrected_od", unit: "", type: "text" },
        { label: "Uncorrected OS", name: "uncorrected_os", unit: "", type: "text" },
        { label: "IOP OD", name: "iop_od", unit: "mmHg", type: "text" },
        { label: "IOP OS", name: "iop_os", unit: "mmHg", type: "text" },
        { label: "Remarks", name: "remarks", unit: "", type: "textarea" }
      ].map((field) => (
        <div key={field.name} className="col-lg-6 col-md-6 col-sm-12">
          <div className="input-block input-block-new">
            <label className="form-label">{field.label}</label>
            <div className="input-text-field">
              {field.type === "textarea" ? (
                <textarea
                  className="form-control"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  name={field.name}
                  value={formVitalData[field.name] || ""}
                  onChange={handleInputVitalChange}
                  rows={3}
                />
              ) : (
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    name={field.name}
                    value={formVitalData[field.name] || ""}
                    onChange={handleInputVitalChange}
                  />
                  {field.unit && (
                    <span className="input-group-text">{field.unit}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="text-end mt-3">
      <Form.Item>
        <button
          type="button"
          className="btn btn-danger custom-btn"
          onClick={handleCancelVitalEdit}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary mx-1"
          onClick={handleEditVitalClick}
        >
          Update
        </button>
      </Form.Item>
    </div>
  </form>
</Modal>



        <Modal
          title="Edit Appointment"
          visible={isEditModalVisible}
          onCancel={toggleEditModal}
          footer={null}
          size="lg"
          width={800}
        >
          <Form

            onFinish={handleUpdateAppointment}
            initialValues={{
              specialization: selectedAppointment?.doctor_specialization_id,
              doctor: selectedAppointment?.tech_id,
              others_name: selectedAppointment?.other_referal_name || "", // Use referal_person_name if available
              others_phone: selectedAppointment?.other_referal_mobile || "", // Use other_referal_mobile if available
              appointment_day: selectedAppointment?.appointment_day,
              appointment_time: selectedAppointment?.appointment_time, // Add appointment_time for the time field
              slot_time: selectedAppointment?.slot_time // Add slot_time for time options
            }}
          >
            {/* Specialization & Doctor in one row */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '48%' }}>
                <label className="mt-2 fw-bolder">
                  Specialization <span style={{ color: 'red' }}>*</span>
                </label>
                <Form.Item
                  name="specialization"
                  rules={[{ required: true, message: 'Please select a specialization!' }]}
                >
                  <select
                    className="form-control"
                    value={selectedSpecializationupdateId || ""}
                    onChange={handleSpecializationChangeupdate}
                  >
                    <option value="">Select Specialization</option>
                    {specialization.map((spec) => (
                      <option key={spec.value} value={spec.value}>
                        {spec.label}
                      </option>
                    ))}
                  </select>
                </Form.Item>
              </div>
              <div style={{ width: '48%' }}>
                <label className="mt-2 fw-bolder">Doctor <span style={{ color: 'red' }}>*</span></label>
                <Form.Item name="doctor" rules={[{ required: true, message: 'Please select a doctor!' }]}>
                  <select className="form-control" required value={selectedDoctorupdateId} onChange={handleDoctorChangeupdate}>
                    <option value="">Select Doctor</option>
                    {specializationupdateDetails?.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                </Form.Item>
              </div>
            </div>

            {/* Appointment Date & Time in one row */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '48%' }}>
                <label className="mt-2 fw-bolder">Appointment Date <span style={{ color: 'red' }}>*</span></label>
                <DatePicker
                  className="form-control"
                  selected={selectedDateupdate}
                  onChange={handleDateChangeupdate}
                  dateFormat="dd/MM/yyyy"
                  showDayMonthYearPicker
                />
              </div>
              <div style={{ width: '48%' }}>
                <label className="mt-2 fw-bolder">Time</label>
                <ul className="time-slots" style={{ display: 'flex', flexWrap: 'wrap', listStyleType: 'none', padding: 0, justifyContent: 'space-between' }}>
                  {dayTimingsupdate.map((item, index) => {
                    const isSelected = selectedTimeupdate?.id === item.id;
                    const isPreselected = selectedAppointment?.slot_time === item.available_from_time;
                    return (
                      <li
                        key={index}
                        onClick={() => handleSelectTimeupdate(item.id, item.available_from_time)}
                        style={{
                          width: 'calc(50% - 8px)',
                          marginBottom: '8px',
                          backgroundColor: isSelected || isPreselected ? '#007bff' : '#f0f0f0',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          textAlign: 'center',
                          color: isSelected || isPreselected ? '#fff' : '#333',
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {item.available_from_time}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Referral Person in one row */}
            <div>
              {/* <label className="mt-3 fw-bolder">Referral Person</label> */}
              {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Form.Item style={{ marginBottom: 0 }}>
        <Checkbox checked={isOthers} onChange={(e) => setIsOthers(e.target.checked)}>Others</Checkbox>
      </Form.Item>
    </div> */}
              {/* {!isOthers ? (
      <CreatableSelect 
        inputId="referal_person" 
        placeholder="Enter referral person" 
        required 
        onChange={handleReferalChangeupdate} 
        options={referalPersonsupdate} 
        value={referalPersonsupdate.find(option => option.value == referalPersonupdateId) || null} 
        isSearchable 
        isClearable 
        noOptionsMessage={() => 'Not found'} 
      />
    ) : (
      <>
        <Form.Item label="Name" name="others_name" rules={[{ required: true, message: "Please input the name!" }]}>
          <Input value={otherReferalNameupdate} onChange={(e) => setOtherReferalNameupdate(e.target.value)} />
        </Form.Item>
        <Form.Item label="Phone No" name="others_phone" rules={[{ required: true, message: "Please input the phone number!" }]}>
          <Input value={otherReferalMobileupdate} onChange={(e) => setOtherReferalMobileupdate(e.target.value)} />
        </Form.Item>
      </>
    )} */}
            </div>

            {/* Submit Button */}
            <div className="text-end mt-3">
              <Form.Item>
                <button type="button" className="btn btn-danger custom-btn" onClick={toggleEditModal}>Cancel</button>
                <button type="submit" className="btn btn-primary mx-1" disabled={!selectedTimeupdate}>Edit</button>
              </Form.Item>
            </div>
          </Form>

        </Modal>

        {/* Modal for Editing */}
        <Modal
          title="Edit Medical History"
          open={isModalOpen}
          onCancel={handleModalCancel}
          footer={null}
        >
          <Form form={form} onFinish={handleMedFormSubmit} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="asthma" valuePropName="checked">
                  <label>
                    Asthma:{" "}
                    <Switch
                      checked={switchStates.asthma}
                      onChange={(checked) => handleSwitchChange("asthma", checked)}
                    />
                  </label>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="diabetes" valuePropName="checked">
                  <label>
                    Diabetes:{" "}
                    <Switch
                      checked={switchStates.diabetes}
                      onChange={(checked) => handleSwitchChange("diabetes", checked)}
                    />
                  </label>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="drug_allergy" valuePropName="checked">
                  <label>
                    Drug Allergy:{" "}
                    <Switch
                      checked={switchStates.drug_allergy}
                      onChange={(checked) => handleSwitchChange("drug_allergy", checked)}
                    />
                  </label>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="pregnancy" valuePropName="checked">
                  <label>
                    Pregnancy:{" "}
                    <Switch
                      checked={switchStates.pregnancy}
                      onChange={(checked) => handleSwitchChange("pregnancy", checked)}
                    />
                  </label>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="bp" valuePropName="checked">
                  <label>
                    Blood Pressure (BP):{" "}
                    <Switch
                      checked={switchStates.bp}
                      onChange={(checked) => handleSwitchChange("bp", checked)}
                    />
                  </label>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="cardiac" valuePropName="checked">
                  <label>
                    Cardiac:{" "}
                    <Switch
                      checked={switchStates.cardiac}
                      onChange={(checked) => handleSwitchChange("cardiac", checked)}
                    />
                  </label>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Others:" name="others">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item label="Chief Complaints:" name="chief_complaints">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item>
              <div style={{ textAlign: "center" }}>
                <button type="submit" className="btn btn-primary mx-1">
                  Update
                </button>
                <button type="button" className="btn btn-danger" onClick={handleModalCancel}>
                  Cancel
                </button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Delete Confirmation"
          visible={isDeleteConfirmVisible}
          onCancel={handleDeleteCancel} // Close modal when clicking Cancel
          footer={null} // Remove default buttons
        >
          <p>
            Are you sure you want to delete this Appointments{" "}
            <span
              style={{ color: '#1d7ed8', cursor: 'pointer' }}
            >
              #{appointmentPrefix}{selectedAppointment?.token_no}{text}
            </span>?
          </p>
          <Form.Item>
            <div className="d-flex justify-content-center">
              <button type="button" className="btn btn-primary mx-1" onClick={handleConfirmCancel}>
                Delete
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteCancel}>
                Cancel
              </button>
            </div>
          </Form.Item>
        </Modal>

      </div>
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
              history.push('/admin/invoicelist')// Call the switch case function here
            }}
          >
            continoue
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
  title="Document Preview"
  visible={previewModalVisible}
  onCancel={() => setPreviewModalVisible(false)}
  footer={null}
  width="80vw"
  style={{ maxWidth: '900px' }}
>
  <div className="document-preview-container">
    {previewFiles.length > 0 ? (
      <>
        <div style={{ position: 'relative' }}>
          <Carousel
            key={`carousel-${currentPreviewIndex}`}
            ref={carouselRef}
            afterChange={current => setCurrentPreviewIndex(current)}
            initialSlide={currentPreviewIndex}
            dots={false}
            infinite={false}
          >
            {previewFiles.map((file, idx) => (
              <div key={idx} className="preview-item">
                <img 
                  src={file.url} 
                  alt={file.name}
                  style={{ maxHeight: '70vh', width: '100%', objectFit: 'contain' }}
                />
              </div>
            ))}
          </Carousel>
          
          {/* Navigation Arrows */}
          {currentPreviewIndex > 0 && (
            <button 
              className="carousel-nav-button left"
              onClick={() => carouselRef.current.prev()}
            >
              <LeftOutlined />
            </button>
          )}
          
          {currentPreviewIndex < previewFiles.length - 1 && (
            <button 
              className="carousel-nav-button right"
              onClick={() => carouselRef.current.next()}
            >
              <RightOutlined />
            </button>
          )}
        </div>
        
        <div className="preview-footer mt-3 d-flex align-items-center">
          <span
            className={`carousel-arrow ${currentPreviewIndex === 0 ? 'disabled' : ''}`}
            onClick={() => currentPreviewIndex !== 0 && carouselRef.current.prev()}
            style={{ cursor: currentPreviewIndex === 0 ? 'not-allowed' : 'pointer', fontSize: '1.5rem' }}
            title="Previous"
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 1L3 8l8 7" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="mx-3">
            {currentPreviewIndex + 1} of {previewFiles.length}
          </span>
          <span
            className={`carousel-arrow ${currentPreviewIndex === previewFiles.length - 1 ? 'disabled' : ''}`}
            onClick={() => currentPreviewIndex !== previewFiles.length - 1 && carouselRef.current.next()}
            style={{ cursor: currentPreviewIndex === previewFiles.length - 1 ? 'not-allowed' : 'pointer', fontSize: '1.5rem' }}
            title="Next"
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 1l8 7-8 7" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="file-name ml-3">{previewFiles[currentPreviewIndex]?.name}</span>
        </div>
      </>
    ) : (
      <div className="unsupported-preview">
        <FileIcon size={48} />
        <p>Preview not available for this file type</p>
      </div>
    )}
  </div>
</Modal>

<style>
  {
    `
    /* Add to your CSS */
.carousel-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.carousel-nav-button.left {
  left: 15px;
}

.carousel-nav-button.right {
  right: 15px;
}

.carousel-nav-button:hover {
  background: rgba(0,0,0,0.7);
}

.preview-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.file-name {
  font-weight: 500;
  margin-left: 10px;
  flex-grow: 1;
  text-align: center;
}
   `
  }
</style>

    </>
  );
};

export default Appointments;
