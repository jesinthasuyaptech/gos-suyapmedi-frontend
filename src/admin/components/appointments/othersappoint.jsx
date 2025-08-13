import React from "react";
//import { Table } from "antd";
import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-daterangepicker/daterangepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Table, Button, Modal, Form, Input, notification, Row, Col, Switch, Checkbox } from "antd";
import { Filter, initialSettingsApt } from "../../../client/components/common/filter";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import SidebarNav from "../sidebar";
import Select from "react-select";
import { Link } from 'react-router-dom';
import  { useState,useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { EyeOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import axios from "axios";
import { var_api } from "../../../constant";
import { Tooltip,Tag} from 'antd';
import { doctor_thumb_21 } from "../../../client/components/imagepath";
import { image_api } from "../../../constant";
import pat_dummy from "../../assets/img/patients/pat_dummy.png";
import "../styles/Loader.css";
import { text } from "@fortawesome/fontawesome-svg-core";
import { FaTrash } from "react-icons/fa"; 
import noDataImage from "../../assets/img/nodata/nodata_image.png";
import { ArrowRight,Eye,Phone,User,Cake,Clock,Calendar,Thermometer, HeartPulse, Droplet, Ruler, Weight, Scale, Activity, ShieldCheck, Candy,Stethoscope,UserCheck,BriefcaseMedical,IdCard, CandyOff,Users, FileText,  MessageSquare, File, Briefcase, MapPin} from "lucide-react";
import FormItem from "antd/es/form/FormItem";


const othersappoint = () => {
  const today = new Date();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isEditModalVisibleplus, setEditModalVisibleplus] = useState(false);
  const[specializationCloneDetails,setSpecializationCloneDetails] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [specializationDetails, setSpecializationDetails] = useState([]);
  const [specializationupdateDetails, setSpecializationupdateDetails] = useState([]);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState();
  const [selectedSpecializationupdateId, setSelectedSpecializationupdateId] = useState("");
  const token =localStorage.getItem("token"); 
  const hospital_id = localStorage.getItem("hospital_id");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctorupdateId, setSelectedDoctorupdateId] = useState("");
  const [customerMobile, setCustomerMobile] = useState('');
  const [mobileOptions, setMobileOptions] = useState([]);
  const [existingOrder, setExistingOrder] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [othersDetails, setothersDetails] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [isModal, setIsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const history = useHistory(); // React Router v5 navigation
  // const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateupdate, setSelectedDateupdate] = useState(today);
  const [dayTimings, setDayTimings] = useState([]);
  const [dayTimingsupdate, setDayTimingsupdate] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeupdate, setSelectedTimeupdate] = useState(null);
  const [activeTab, setActiveTab] = useState("serviceType");
  const [activeSecondTab, setActiveSecondTab] = useState("current_appointment");
  const [activethirdTab, setActivethirdTab] = useState("Apthistory");
  const [activefourthTab, setActivefourthTab] = useState("patientinfo");
  const [selectedSpecializationLabel, setSelectedSpecializationLabel] = useState(""); 
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [modals, setModals] = useState([]);
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
    const localSelectedValue = localStorage.getItem('selectedStatus') || 7;
    console.log("status", localSelectedValue);
     // Filter the data based on the selected status
  const filterData = localSelectedValue == 7 ? data : data.filter((item) => item.status == localSelectedValue);
  console.log("appliedstatus",filterData)
  const [selectedStatus, setSelectedStatus] = useState(localSelectedValue || 7); // Default to "All"
  const [filteredData, setFilteredData] = useState(filterData||[]);  // Assuming dataSource is the full data
  console.log("appliedstatus",filteredData)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedotherAppointment, setSelectedotherAppointment] = useState(null);
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
  const [selectedFile, setSelectedFile] = useState(null);

  const [switchStates, setSwitchStates] = useState({
    asthma: false,
    diabetes: false,
    drug_allergy: false,
    pregnancy: false,
    bp: false,
    cardiac: false,
  });
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [updatedAppointment, setUpdatedAppointment] = useState({});
  const [labDropdowns, setLabDropdowns] = useState({});
  const [patientAptHistory, setPatientAptHistory] = useState([]);
  const [isOpenAptHistory, setIsOpenAptHistory] = useState(false);
  const [isOpenPatientServiceHistory, setIsOpenPatientServiceHistory] = useState(false);
  const [PatientServicedetails,setPatientServicedetails] = useState([]);
  const [existingServices,setExistingServices] = useState(null);
  const [isEnable, setIsEnable] = useState(false);
  const [isOthers, setIsOthers] = useState(false);
  const [otherReferalName, setOtherReferalName] = useState("");
  const [otherReferalNameupdate, setOtherReferalNameupdate] = useState("");
  const [otherReferalMobile, setOtherReferalMobile] = useState("");
  const [otherReferalMobileupdate, setOtherReferalMobileupdate] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [diagnosis, setDiagnosis] = useState("");
  const [isPlusButtonVisible, setIsPlusButtonVisible] = useState(false);
  const [othersList, setothersList] = useState([]);
  const [isPatient, setIsPatient] = useState(true); // Default: Show patient list
  const totalAppointments = patientAptHistory ? patientAptHistory.length : 0;
  const [selectedotherTime, setSelectedotherTime] = useState("");
  const totalAmount = patientAptHistory
  ? patientAptHistory.reduce((sum, record) => sum + (parseFloat(record.bill_amount) || 0), 0)
  : 0;
  
  const [formValues, setFormValues] = useState({
    description: "",
    company: "",
    role: "",
  });



  const finalAmount = PatientServicedetails.reduce(
    (sum, record) => sum + (record.final_amount || 0),
    0
  );
    
  const uniqueServiceTypes = new Set(
    PatientServicedetails.map((record) => record.master_service_name)
  ).size;

console.log("kumaruu",othersDetails);
  
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

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Store the selected file
  };
  const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  const handleAddAppointment = () => {
    if (!selectedCard) {
      // alert("Please select a card first!"); // Prevent opening modal without selection
      return;
    }
    setIsModal(true); // Open modal
  };

  const handleEditClickvital = () => {
    console.log("harini");
    setShowModal(true); // Open the modal
  };

  const handleOthersClick = () => {
    history.push("/admin/appointment-list"); // Use push() instead of navigate()
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

    const filtered = data.filter(
      (item) =>
        item.patient_name.toLowerCase().includes(value) ||
        item.patient_mobile_no.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };
  const handleInputChangeother = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

console.log("haru",patientAptHistory);
  console.log("Selected Appointment:", selectedotherAppointment);

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



  const toggleEditModal = () => {
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
    } else {
      setSelectedDateupdate(null);
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
        console.log("jjj",matchedDoctor)
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

console.log("mokey",selectedAppointment)


  // Fetch lab options from API
  const fetchLabOptions = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await axios.get(`${var_api}labmaster/get-active-by-hospital/${hospital_id}`,{
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
  useEffect(() => {
    if (selectedAppointment) {
      const initialDate = selectedAppointment?.appointment_day
        ? new Date(selectedAppointment.appointment_day)
        : null;
  
      if (!initialDate || isNaN(initialDate)) {
        console.error("Invalid initial date:", selectedAppointment?.appointment_day);
        return;
      }
  
      setUpdatedAppointment(prev => ({
        ...prev,
        appointment_day: initialDate,
      }));
    }
  }, [selectedAppointment]);


  function getStatusBadge(status) {
    switch (status) {
      case 0:
        return <span className="badge status-badge badge-upcoming">New</span>;
      case 1:
        return <span className="badge status-badge badge-inprogress">Completed</span>;
      case 2:
        return <span className="badge status-badge badge-completed">Cancel</span>;
      case 3:
        return <span className="badge status-badge badge-revisit">Revisit</span>;
      default:
        return <span className="badge status-badge badge-unknown">Unknown</span>;
    }
  }
  
  


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

     console.log("for",formattedDate);
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
      setDayTimings([]);
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
      setDayTimings([]); // Clear the timings in case of an error
    }
    finally{
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

const handleAppointmentChangeupdate = async (dayOfWeek) => {
  const doc_id = selectedDoctorupdateId || selectedAppointment.tech_id;

  console.log("gh", doc_id,selectedDoctorupdateId,selectedAppointment.tech_id)

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
    const formattedAppointmentDay = updatedAppointment.appointment_day 
      ? new Date(updatedAppointment.appointment_day)
          .toLocaleDateString("en-GB")
          .split('/')
          .join('-') 
      : updatedAppointment.appointment_day;

    const payload = {
      ...updatedAppointment,
      appointment_day: formattedAppointmentDay,
      appointment_time: updatedAppointment.slot_time,
      slot_time: updatedAppointment.slot_time, // Ensure slot_time is included
      hospital_id: localStorage.getItem("hospital_id"),
      tech_id: selectedAppointment.tech_id || updatedAppointment.tech_id, // Ensure tech_id is included
      referal_person: updatedAppointment.referal_person || "Default Referral Name",
    };

    console.log("Payload being sent:", payload); // Debugging

    const response = await fetch(`${var_api}appointment/re-update/${selectedAppointment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Update failed');
    
    notification.success({ message: "Update Successful" });

    setSelectedAppointment((prev) => ({
      ...prev,
      appointment_day: formattedAppointmentDay,
      appointment_time: updatedAppointment.slot_time,
      doctor: updatedAppointment.doctor,
      hospital_id: updatedAppointment.hospital_id,
      referal_person: updatedAppointment.referal_person,
      slot_time: updatedAppointment.slot_time,
      specialization_id: updatedAppointment.specialization_id,
    }));

    setIsApptEditing(false);
    setUpdatedAppointment(null);
  } catch (error) {
    console.error("Update Failed:", error);
    notification.error({ message: "Update Failed", description: error.message });
  } finally {
    setLoading(false);
  }
};


const handleSelectTime = (id, fromTime) => {
  if (!id || !fromTime) {
    console.error("Invalid slot time selection:", { id, fromTime });
    return;
  }
  setSelectedTime({ id, fromTime });
  handleAppointmentChange('slot_time', fromTime);
};




   // Handles form submission
   const handleMedFormSubmit = async (values) => {
    setLoading(true);
    console.log("Form Submitted:", values);

      // Prepare payload with conditional values
      const payload = {
        ...values,
        others: values.others ? values.others : ''  ,
        cheif_complaints: values.cheif_complaints  ?  values.cheif_complaints:'' ,
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
        finally{
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
      discount:0
  }]); 

  const [medications, setMedications] = useState([{ id: Date.now(),sub_cat_id: null, unit_price: null, is_before_food: 0, cycle: 0, remarks: '',  is_morning:0, is_evening:0, is_noon:0, is_night:0}]);
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



  // Handle adding a new row
  const handleAddNewRow = () => {
    const newRow = {
      id: Date.now(), // Unique identifier for each row
      service_type_id: null,
      service_type: 0,
      price: 0,
      qty: 1,
      final_price: 0,
      remarks: '',
      discount:0
    };
    setRows([...rows, newRow]); // Add the new row at the top
    console.log("rw", rows)
  };


  const handleExistingAddNewRow = () => {
    const newRow = {
      id: Date.now(), // Unique identifier for each row
      service_type_id: null,
      service_type: 0,
      price: 0,
      qty: 1,
      final_price: 0,
      remarks: '',
      discount:0
    };
    setRows([...rows, newRow]); // Add the new row at the top
    console.log("rw", rows)
    setIsEnable(true);

  }

    // Sort rows by descending ID
    const sortedRows = [...rows].sort((a, b) => b.id - a.id);


   // Handle deleting a row
   const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id)); // Remove the row by ID
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmVisible(false);
  };

  const showDeleteModal = () => {
    setDeleteConfirmVisible(true);
  };

  const handleDeleteclick = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${var_api}appointment/delete/${selectedAppointment.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Replace with actual token if needed
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      //alert("Appointment deleted successfully!");
      setDeleteConfirmVisible(false); // Close the modal after successful deletion
      fetchData(startDate, endDate, selectedDoctorsId, selectedPatientsId);

      // Optionally, update the UI or refresh the list here
    } catch (error) {
      console.error("Error deleting appointment:", error);
      //alert("An error occurred while deleting the appointment.");
    }
  };

  

   //handle onchange for service change
   const handleServiceChange = async (id, selectedOption) => {
    console.log("ddd", id, selectedOption);
    if (!selectedOption.hasOwnProperty("is_lab")) {
      console.error("is_lab is missing in selectedOption!", selectedOption);
      return;
    }
    setRows((prevServices) =>
      prevServices.map((service, i) =>
        service.id === id
          ? {
              ...service,
              service_type_id: selectedOption.value,
              price: selectedOption.price,
              service_type: selectedOption.service_type,
              qty: selectedOption.service_type === 0 ? 1 : service.qty, // Set qty to 1 if service_type is 0
              final_price: selectedOption.service_type === 0 ? selectedOption.price : service.qty * selectedOption.price,
              is_lab: selectedOption.is_lab,
              lab_id: selectedOption.is_lab == 1 ? (service.lab_id || null) : 0,
              service_name: selectedOption.label
            }
          : service
      )
    );

    console.log("yesh", selectedOption.is_lab);

    if (selectedOption.is_lab == 1) {
      setLoading(true);
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
          setLabDropdowns((prev) => ({
            ...prev,
            [id]: data, // Ensure id is correctly mapped
          }));

          // Set the selected lab to the first item if no lab is selected yet
          setRows((prevServices) =>
            prevServices.map((service) =>
              service.id === id
                ? {
                    ...service,
                    lab_id: service.lab_id ||  data[0].id, // Default to first lab if none selected
                  }
                : service
            )
          );

          console.log("uyes comign", rows, labDropdowns);
        }
      } catch (error) {
        console.error("Error fetching lab dropdown data:", error);
      } finally {
        setLoading(false);
      }
    }
    console.log("hospital_id service2", rows);
  };



  //Handle Quantity
  const handleQtyChange = (id, change) => {
    setRows((prevServices) =>
      prevServices.map((service, i) =>
        service.id === id
          ? {
              ...service,
              qty: Math.max(service.qty + change, 0), // Prevent negative qty
              final_price: Math.max(service.qty + change, 0) * service.price, // Recalculate final price
            }
          : service
      )
    );
  };


  const handleDateChange = async (date) => {
    if (!date) {
      setSelectedDate(null);
      setDayTimings([]); // Clear available timings when date is cleared
      return;
    }
  
    if (!selectedDoctorId) {
      notification.error({
        message: "Error",
        description: "Please select a doctor.",
      });
      return;
    }
  
    setSelectedDate(date); // Update the selected date in state
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
      const activeDayTimings = response.data.filter((timing) => timing.is_active === 1);
      setDayTimings(activeDayTimings);
  
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayTimings([]); // Clear response in case of an error
    }
  };
  

  
  const handleDateChangeupdate = async (date) => {

    console.log("hhh",selectedDoctorupdateId)
    if (!selectedDoctorupdateId) {
      notification.error({
        message: "Error",
        description: "Please select a doctor.",
      });
      return;
    }
  
   
    setSelectedDateupdate(date); // Update the selected date in state
    console.log("Selected date:", date); // Log the selected date

     // Get the day of the week for the selected date
     const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'long' });
     const token =localStorage.getItem("token"); 
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
    const activeDayTimings = response.data.filter((timing) => timing.is_active == 1);
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
  
  
  useEffect(() => {
    fetchDoctorData();
  
  }, [selectedDoctorId]);


  useEffect(() => {
    fetchDoctorData();
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
  }, []);

  const fetchData = async (start_date, end_date, doctor_id, patient_id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${var_api}appointment/appointments-status/${hospital_id}/${start_date}/${end_date}/${doctor_id}/${patient_id}`,
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
  
      filterData.sort((a, b) => {
        const statusOrder = { "0": 1, "3": 3 }; // 0 (Upcoming) first, 3 (Completed) last
        const aStatus = statusOrder[a.status] || 2; // Default 2 for other statuses
        const bStatus = statusOrder[b.status] || 2;
  
        if (aStatus !== bStatus) return aStatus - bStatus; // Sort by status order
  
        // Sort by time if status is the same
        return a.appointment_time.localeCompare(b.appointment_time);
      });
  
      console.log("Sorted Data:", filterData);
      setFilteredData(filterData);
      setIsPlusButtonVisible(false);
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
      // const start_date = startDate || formatDate(initialSettingsApt.startDate);
      // const end_date = endDate || formatDate(initialSettingsApt.endDate);
      const start_date = startDate ? formatDate(startDate) : null;
const end_date = endDate ? formatDate(endDate) : null;

      await fetchData(start_date, end_date, selectedDoctorsId || null); // Fetch data for the first doctor
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
      const response = await fetch(`${var_api}othersAppointment/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        return;
      }
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const result = await response.json();
      setothersList(result || []);
  
      // **Set first appointment as selected**
      if (result?.length > 0) {
        setSelectedotherAppointment(result[0]);  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPatientData();
  }, [hospital_id]); // Fetch when hospital_id changes


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
      const formattedSpecialization =  result.map(specialization => ({
        label: specialization.name, // Use 'name' as the label
        value: specialization.id, // Use 'id' as the value
      })) || []
      setSpecialization(
        formattedSpecialization
      );

       // Fetch details for the first specialization
    if (formattedSpecialization.length > 0) {
      const firstSpecializationId = formattedSpecialization[0].value;
      setSelectedSpecializationId(firstSpecializationId);
      fetchSpecializationDetails(firstSpecializationId); // Fetch doctor list for the first specialization
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
  
  

  const handleSpecializationChange = (event) => {
    const selectedSpecializationId = event.target.value;
    fetchSpecializationDetails(selectedSpecializationId); // Fetch doctors based on specialization
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


//   const handleSpecializationChange = (selectedOption) => {
//     const specializationId = selectedOption.value;
//     console.log("Selected Specialization ID:", specializationId); // Debugging
  
//     setSelectedSpecializationId(specializationId); // Update selected specialization ID
//     fetchSpecializationDetails(specializationId); // Fetch doctors for the selected specialization
//   };
const handleSpecializationChangeupdate = (event) => {
  const selectedValue = event.target.value; // Extract value from event
  setSelectedSpecializationupdateId(selectedValue); // Store specialization ID
  fetchSpecializationDetails(selectedValue); // Fetch doctors based on specialization
  console.log("Selected Specialization ID:", selectedValue);
};




    const handleModalOpen = () => {
      setIsModalVisible(true); // Show the modal
    };
  
    // Close the modal
    const handleModalClose = () => {
      setIsModalVisible(false);
    };


    // Close the modal
    const handleModalCloseUdpate = () => {
      setIsModalVisibleUpdate(false);
    };

     // Close the modal
     const handleModalOpenUdpate = () => {
      setIsModalVisibleUpdate(true);
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
        setothersDetails(null); // Clear patient details when the input changes
        if (inputValue.length >= 2) {
          // Fetch matching mobile numbers for partial input
          fetchPatientDetailsByNumber(inputValue);
        }
      }
    };
    
    const handleMobileChange = (selectedOption) => {
      const mobile = selectedOption ? selectedOption.value : '';
      setCustomerMobile(mobile);
      setothersDetails(null); // Clear patient details when the selection changes
      
      if (mobile.length === 10) {
        // Fetch full details on valid mobile number selection
        // fetchPatientDetailsByNumber(mobileNumber, selectedOption.label); // Pass the name along with the number
        const name = selectedOption.label.split(" (")[0];  // Extract only the name part before the parentheses
        fetchPatientDetailsByNumber(mobile, name);
        console.log("abcdef",mobile, name);
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
    };
   
    const fetchPatientDetailsByNumber = async (number, name = "") => {
        setLoading(true);
        const hospital_id = localStorage.getItem("hospital_id");
      
        try {
          const response = await fetch(`${var_api}others/others-by-number/${hospital_id}/${number}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          });
      
          if (response.status === 401) return;
          if (!response.ok) throw new Error('Failed to fetch patient details');
      
          const result = await response.json();
          console.log("API Response:", result);
      
          // ✅ Step 1: Filter by name if provided
          let filteredPatients = result;
          if (name.trim() !== "") {
            filteredPatients = result.filter(patient =>
              patient.name.toLowerCase().includes(name.toLowerCase())
            );
          }
      
          console.log("Filtered Patients:", filteredPatients);
      
          if (number.length === 10) {
            // ✅ Step 2: Find exact match
            const matchedPatient = filteredPatients.find(patient => patient.mobile === number);
            console.log("Matched Patient:", matchedPatient);
      
            setothersDetails(matchedPatient || null);
      
            if (!matchedPatient) {
              const options = filteredPatients.map((item) => ({
                label: `${item.name} (${item.mobile})`,
                value: item.mobile,
              }));
              console.log("Dropdown Options:", options);
              setMobileOptions(options);
            }
          } else {
            // ✅ Step 3: Populate dropdown for partial matches
            const options = filteredPatients.map((item) => ({
              label: `${item.name} (${item.mobile})`,
              value: item.mobile,
            }));
            console.log("Dropdown Options (Partial Match):", options);
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
    { value: 0, label: "Upcoming" },
    { value: 1, label: "Reached Hospital" },
    { value: 2, label: "Inprogress" },
    { value: 3, label: "Completed" },
    { value: 4, label: "Cancel by Hospital" },
    { value: 5, label: "Cancel by Patient" },
    { value: 6, label: "Revisit For Report" },
  ];

 
 
  const handleStatusChange = (value) => {
    console.log(value);
    if (value) {
      setSelectedStatus(value);
      localStorage.setItem('selectedStatus', value.value);
      const filterData = value.value === 7 ? data : data.filter((item) => item.status === value.value);
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
  



  const handleDoctorChange = async (event) => {
    const doctorId = event.target.value;
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
      const activeDayTimings = response.data.filter((timing) => timing.is_active === 1);
      setDayTimings(activeDayTimings); // Update state with active timings
  
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDayTimings([]); // Clear day timings in case of an error
    }
  };
  

  const handleDoctorChangeupdate = async (event) => {
    setSelectedDoctorupdateId(event.target.value); // Update state when a doctor is selected
    // handleDateChange(selectedDate);


     // Get the day of the week for the selected date
     const dayOfWeek = selectedDateupdate.toLocaleDateString('en-GB', { weekday: 'long' });
     const token =localStorage.getItem("token"); 
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
    const activeDayTimings = response.data.filter((timing) => timing.is_active == 1);
       setDayTimingsupdate(activeDayTimings);
 
       console.log("API Response:", response.data);
     } catch (error) {
       console.error("Error fetching data:", error);
       setDayTimingsupdate([]); // Clear the response in case of an error
     }
  };

//   const handleBookNowClick = (values) => {
//     // Find selected doctor
//     const selectedDoctor = specializationDetails.find((doc) => doc.id == selectedDoctorId);
//     if (!selectedDoctor) {
//       console.error("Doctor not found with the selected ID:", selectedDoctorId);
//       return;
//     }
  
//     // Check if patientDetails is null or undefined
//     if (!patientDetails) {
//       console.error("Patient details are missing!");
//       return;
//     }
  
//     // Check if specialization is valid
//     const selectedSpecialization = specialization.find((spec) => spec.value === selectedSpecializationId);
    
//     // Construct details object safely
//     const details = {
//       mobile: customerMobile || "Unknown",
//       specialization: selectedSpecialization?.label || "Not Selected",
//       doctor: selectedDoctor.name || "Unknown",
//       patientName: patientDetails?.name || "Unknown",
//       dob: patientDetails?.dob || "Not Available",
//       address: patientDetails?.full_address || "Not Available",
//       gender: patientDetails?.gender || "Not Specified",
//       bloodGroup: patientDetails?.blood_group || "Not Specified",
//       ...values,
//     };
  
//     console.log("Booking appointment details:", details); // Debugging
  
//     setAppointmentDetails(details);
//     setIsConfirmationModalVisible(true);
  
//     // Wait for modal confirmation, then refresh the list
//     setTimeout(() => {
//       fetchData(startDate, endDate, selectedDoctorId, selectedPatientsId);
//     }, 1000);
//   };
// const handleBookNowClick = () => {
//     if (!customerMobile || customerMobile.length !== 10) {
//       alert("Please enter a valid 10-digit mobile number.");
//       return;
//     }
  
//     if (!selectedDoctorId) {
//       alert("Please select a doctor.");
//       return;
//     }
  
//     if (!selectedDate) {
//       alert("Please select an appointment date.");
//       return;
//     }
  
//     if (!selectedTime) {
//       alert("Please select an appointment time.");
//       return;
//     }
  
//     // Correctly formatted appointment data
//     const appointmentData = {
//       mobile: customerMobile,
//       doctorId: selectedDoctorId,
//       date: selectedDate.toLocaleDateString("en-CA"), // Correct format: YYYY-MM-DD
//       time: selectedTime,
//     };
  
//     console.log("Appointment booked:", appointmentData);
//     setIsConfirmationModalVisible(true);
  
//     handleModalClose();
//   };

const handleBookNowClick = () => {
    if (!customerMobile || customerMobile.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    if (!selectedDoctorId) {
        alert("Please select a doctor.");
        return;
    }

    if (!selectedDate) {
        alert("Please select an appointment date.");
        return;
    }

    if (!selectedTime) {
        alert("Please select an appointment time.");
        return;
    }

    // Open the confirmation modal
    setIsConfirmationModalVisible(true);
};


const handleConfirmotherAppointment = async () => { 
  setIsConfirmationModalVisible(false);

  let formattedDate = selectedDate ? selectedDate.toLocaleDateString("en-CA") : "";

  const formData = new FormData();
  formData.append("hospital_id", hospital_id ? parseInt(hospital_id) : 0);
  formData.append("tech_id", selectedDoctorId ? parseInt(selectedDoctorId) : 0);
  formData.append("others_id", othersDetails?.id || 0);
  formData.append("appointment_date", formattedDate || "");
  formData.append("appointment_time", selectedTime?.trim() || "00:00 AM");
  formData.append("status", 0);
  formData.append("token_no", 1);
  formData.append("booked_by", 1);

  // ✅ Append form input values
  formData.append("description", formValues.description || "");
  formData.append("company", formValues.company || "");
  formData.append("role", formValues.role || "");

  // ✅ Handle File Upload (if file exists)
  if (selectedFile) {
    formData.append("any_file", selectedFile);
  }

  console.log("📢 Sending appointment data:", Object.fromEntries(formData.entries()));

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in. Please log in and try again.");
      return;
    }

    const response = await fetch(`${var_api}othersAppointment/post`, {
      method: "POST",
      headers: {
        "Authorization": `${token}`,
      },
      body: formData,
    });

    console.log("🟢 Response Status:", response.status);
    const responseText = await response.text();
    console.log("🔍 Raw API Response:", responseText);

    try {
      const responseData = JSON.parse(responseText);
      console.log("✅ Parsed Response Data:", responseData);

      if (response.ok) {
        fetchPatientData();
        handleModalClose();
        notification.success({
          message: "Appointment Booked!",
          description: `Token No: ${responseData.token_no} - ${responseData.tech_name} at ${responseData.appointment_time} on ${responseData.appointment_date}`,
        });
      } else {
        notification.error('Failed to book appointment or post vital details.');
      }
    } catch (jsonError) {
      console.error("❌ Failed to parse JSON response:", jsonError);
      alert("Unexpected response from server. Please check console logs.");
    }
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    alert("An error occurred. Please try again.");
  }
};








  
    
  
  
  

  const handleConfirmAppointment = async () => {
    try {
      await bookAppointment(); // Call your API
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
  
  
  const bookAppointment = async () => {
  
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      notification.error({
        message: "Error",
        description: "please select Doctor and Date.",
      });
      return;
    }
  
    const appointmentDate = new Date(); // Get current date and time
    // const formattedDate = `${appointmentDate.getDate().toString().padStart(2, '0')}-${(appointmentDate.getMonth() + 1)
    //   .toString()
    //   .padStart(2, '0')}-${appointmentDate.getFullYear()}`;
    const payload = {
      hospital_id: parseInt(hospital_id),
      patient_id: patientDetails?.id , // From fetched patient details
      tech_id: parseInt(selectedDoctorId), // Doctor selected in dropdown
      payment_status: 0,
      booked_by: 0,
      status: 0, // Define appropriate status
      slot_time: selectedTime.fromTime,
      appointment_time: selectedTime.fromTime,
      appointment_day: formatDateToDDMMYYYY(selectedDate),
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

      setSelectedDate(null);
      setSelectedTime(null);

    
  
      // Post the vital details API
      const vitalDetailsResponse = await fetch(`${var_api}vitaldetails/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`, // Ensure the token is set
        },
        body: JSON.stringify(vitalDetailsPayload),
      });

   
    
      setIsConfirmationModalVisible(false);
      // fetchSpecializationDetails();
     
      if (!vitalDetailsResponse.ok) {
        throw new Error('Failed to post vital details');
      }
    
      const vitalDetailsResult = await vitalDetailsResponse.json();
      console.log('Vital details posted successfully:', vitalDetailsResult);
      // notification.success('Vital details posted successfully!');
      }

      handleModalClose();
      // const start_date = formatDate(initialSettings.startDate);
      // const end_date = formatDate(initialSettings.endDate);
      // fetchData(start_date, end_date, selectedDoctorsId);
     
      fetchSpecialization();
      setSelectedDoctorId(specializationDetails[0].id);
      setSelectedTime(null);
      setReferalPersonId(null);
      setCustomerMobile("");
      setothersDetails(null);
      setSelectedDate(today);
      setIsOthers(false);
      setOtherReferalMobile("");
      setOtherReferalName("");
      setSelectedSpecializationId(specialization[0].value);

      console.log("Selected date:", today); // Log the selected date

      // Get the day of the week for the selected date
      const dayOfWeek = today.toLocaleDateString('en-GB', { weekday: 'long' });
      // const token =localStorage.getItem("token"); 
      const doc_id = selectedDoctorId;
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
     const activeDayTimings = response.data.filter((timing) => timing.is_active == 1);
        setDayTimings(activeDayTimings);
  
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDayTimings([]); // Clear the response in case of an error
      }
      fetchData(startDate, endDate, selectedDoctorsId, selectedPatientsId);
      console.log("")
    } catch (error) {
      console.error('Error booking appointment or posting vital details:', error);
      notification.error('Failed to book appointment or post vital details.');
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
        note: formData.note,
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
        const start_date = formatDate(initialSettings.startDate);
    const end_date = formatDate(initialSettings.endDate);
    fetchData(start_date, end_date, selectedDoctorsId);
      } else {
        // Handle error (e.g., show error message)
        alert('Failed to update vital details');
      }
    } catch (error) {
      console.error('Error updating vital details:', error);
      alert('An error occurred while updating vital details');
    }
  };
 
  
  const handleEyeClick = (apt) => {

    console.log("apt.appointment_day:", apt.appointment_day, apt.tech_id, apt.patient_id, apt);
    setPatientId(apt.patient_id);
    console.log("k",selectedCard)

      // Validate and parse the date
  const isValidDate = (dateString) => {
    return !isNaN(new Date(dateString).getTime());
  };
  const parsedDate = isValidDate(apt.appointment_day) ? new Date(apt.appointment_day) : new Date();
  console.log("parsedDate:", parsedDate);

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
    setSelectedDoctorId(apt.tech_id);
    console.log("filer3", filteredData);
      // Check if the selected doctor exists
  const selectedDoctor = doctorList.find(doctor => doctor.id === apt.tech_id);
  console.log("Selected Doctor:", selectedDoctor, doctorList);
  console.log("filer4", filteredData);

    setReferalPersonId(apt.referal_person);
    setFormVitalData({
      temp: apt.temp || 0,
      pulse: apt.pulse || 0,
      spo2: apt.spo2 || 0,
      height: apt.height || 0,
      weight: apt.weight || 0,
      bmi_value: apt.bmi_value || 0,
      bp: apt.bp || 0,
      before_sugar: apt.before_sugar || 0,
      after_sugar: apt.after_sugar || 0,
      appointment_id:apt?.id
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
    others: apt?.others ,
    cheif_complaints: apt?.cheif_complaints ,
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
  


  const handleEditClick = async() => {
    
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
        discount:0
    }])
  };
    if (selectedAppointment.status == 3) {
      await handleServiceTypesHistotry();
      await handelMedicationsHistory();
  };
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
      console.log("cjh", rows,labDropdowns, data);
    }
  } catch (error) {
    console.error("Error fetching lab data:", error);
  }
};



  const handleServiceTypesHistotry = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
  
      // Call First API
      const response = await fetch(`${var_api}invoicebilling/invoice-list/by-appointment/${selectedAppointment.id}`, {
        method: "GET",
        headers: { "Authorization": `${token}` }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const data = await response.json();
      setExistingServices(data);
  
      if (data && data.details && Array.isArray(data.details)) {
        const mappedRows = data.details.map(item => ({
         
          // const labServiceName = labId && labDropdowns[labId] ? labDropdowns[labId][0].lab_name : "";
  
          // // Fetch lab data if it's a lab service and lab data is missing
          // if (item.service_details?.is_lab === 1 && !labServiceName) {
          //   fetchLabData(item.invoice_billing_id); // Fetch lab data for the specific service
          // }
  
       
            id: item.id,
            service_type_id: item.service_type_id,
            service_name: item.service_name || "Unknown",
            price: item.unit_price,
            qty: item.quantity,
            final_price: item.final_amount,
            remarks: item.remark,
            discount: item.discount,
            is_lab: item.is_lab || 0,
            lab_id: item.lab_id || null,
            service_type: item.service_type,
            lab_service_name: item.lab_name || "", // Initially empty or default to first lab name
          
        }));
  
        setRows(Array.isArray(mappedRows) ? mappedRows : []); // Update state with API data
        console.log("mappedRows", mappedRows);
      } else {
        console.error("Error: data.details is missing or not an array", data);
      }
  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally{
      setLoading(false);
    }
  };



  const handelMedicationsHistory = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // Call First API
      await fetch(`${var_api}medicalbilling/get-medical-invoice/by-appointment/${selectedAppointment.id}`, {
        method: "GET",
        headers: { "Authorization": `${token}` }
      });
  
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  



   // Handle input change
   const handleInputVitalChange = (e) => {
    const { name, value } = e.target;
    setFormVitalData((prevState) => ({
      ...prevState,
      [name]: parseFloat(value),
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
  
    const start_date = startDate || formatDate(initialSettingsApt.startDate) || null;
    const end_date = endDate || formatDate(initialSettingsApt.endDate) || null;
  
    // Ensure API is called even when doctor is cleared
    setTimeout(() => {
      fetchData(start_date, end_date, doctorId, selectedPatientsId); // Always call API
    }, 100);
  };



  const handlePatientChangeFilter = (selectedOption) => {
    const patientId = selectedOption ? selectedOption.value : null;
    setSelectedPatientsId(patientId); // Update state
  
    const start_date = startDate || formatDate(initialSettingsApt.startDate) || null;
    const end_date = endDate || formatDate(initialSettingsApt.endDate) || null;
  
    // Always call API, even when selection is cleared
    setTimeout(() => {
      fetchData(start_date, end_date, selectedDoctorsId, patientId);
    }, 100);
  };
  



// Handle Update
const handleEditVitalClick = async () => {
  console.log("Updated Vitals:", formVitalData);

  try {
    // Construct the API URL
    const apiUrl = `${var_api}vitaldetails/update/${selectedAppointment?.vital_id}`;

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
  } catch (error) {
    console.error("Error updating vitals:", error);
    notification.success({
      message: "Error Occured",
      description: "Failed to update vitals. Please try again.!",
    });
  }
};


const handlevitalEdit = () =>{
 setIsEditing(true);
}


const handleCancelVitalEdit = () => {
  setIsEditing(false);
}



const handleCancelApptEdit = () => {
  setIsApptEditing(false);
}



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




const endAppointmentSession = async () => {
  if (subTotal <= 0) {
    notification.error({
      message: "Error",
      description: "Subtotal must be greater than 0.",
    });
    return; // Stop execution if subtotal is invalid
  }
  setLoading(true);
  const currentedTime = new Date().toLocaleTimeString('en-US', { hour12: false });

  console.log("update", selectedAppointment, formVitalData, rows, medications, patientId);
 // Calculate the updated medications with qty and total_amount
const updatedMedications = medications.map(medication => {
  const totalDosages = parseInt(medication.is_morning) +
  parseInt(medication.is_noon) +
  parseInt(medication.is_evening) +
  parseInt(medication.is_night);
                       
  const qty = totalDosages * medication.cycle;
  const total_amount = qty * medication.unit_price;

  return {
      ...medication,
      qty,
      total_amount
  };
});

   //Calculate the total final_price
 const totalFinalPrice = rows.reduce((sum, service) => sum + service.final_price, 0);
 const isDiscount = totalFinalPrice - subTotal;

  const appointmentData = {
      hospital_id: selectedAppointment?.hospital_id || hospital_id,
      patient_id: selectedAppointment?.patient_id || patientId || 1,
      tech_id: selectedAppointment?.tech_id || 0,
      appointment_day: selectedAppointment?.appointment_day || 0,
      appointment_time: selectedAppointment?.appointment_time || 0,
      payment_status: 0,
      status: 3,
      apt_start_time: selectedAppointment?.apt_start_time || 0,
      apt_end_time: currentedTime,
      amount: totalFinalPrice,
      referal_person: selectedAppointment?.referal_person,
      vital_details: {
        id: selectedAppointment?.vital_id || formVitalData?.vital_id,
        appointment_id : selectedAppointment?.id || 0,
        weight: formVitalData.weight || 0,
        height: formVitalData.height || 0,
        bmi_value: formVitalData.bmi_value || 0,
        bp: formVitalData.bp || 0,
        temp: formVitalData.temp || 0,
        before_sugar: formVitalData.before_sugar || 0,
        after_sugar: formVitalData.after_sugar || 0,
        pulse: formVitalData.pulse || 0,
        spo2: formVitalData.spo2 || 0,
        note: formVitalData.note || "",
      },
      clinical_notes: selectedAppointment?.clinical_notes,
      complaints: selectedAppointment?.complaints,
      advice: selectedAppointment?.advice,
      follow_up: selectedAppointment?.follow_up,
      previous_history: selectedAppointment?.previous_history,
      medicines: updatedMedications,
      newInvoiceBilling:{
          hospital_id:selectedAppointment?.hospital_id || hospital_id,
          appointment_id: selectedAppointment?.id || 0 ,
          patient_id: selectedAppointment?.patient_id || 0,
          tech_id: selectedAppointment?.tech_id || 0,
          sub_total:totalFinalPrice.toFixed(2),
          any_discount:isDiscount,
          final_sub_total: parseFloat(subTotal),
          final_amount:totalFinalPrice,
          paid_status:0,
          paid_amount:0,
          balance_amount:totalFinalPrice.toFixed(2),
          pay_mode:0,
          remarks:"-",
          services:rows
      }
    };
    

    console.log("xyz",appointmentData, updatedMedications);
    const appointment_id = selectedAppointment?.id || 0;

  try {
    const response = await axios.put(
      `${var_api}appointment/end-session/${appointment_id}`, 
      appointmentData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status == 200) {
      // Clear all relevant data
      // setMedications([]);
      // setRows([]);
      setIsEndSessionModalVisible(false);
      setRows([{
        id: Date.now(), // Unique identifier for each row
          service_type_id: null,
          service_type: 0,
          price: 0,
          qty: 1,
          final_price: 0,
          remarks: '',
          discount:0
      }]);
      setMedications([{ id: Date.now(),sub_cat_id: null, unit_price: null, is_before_food: 0, cycle: 0, remarks: '',  is_morning:0, is_evening:0, is_noon:0, is_night:0}])
      fetchData(startDate, endDate, selectedDoctorsId, selectedPatientsId);
      setColumns({
        firstCol: 'col-md-6 col-xl-6 col-sm-12', // Default to 50%
        secondCol: 'd-none', // Hidden initially
        thirdCol: 'd-none',  // Hidden initially
      })
      notification.success({
        message: "Success",
        description: "Appointment session ended successfully.",
      });
      console.log("Appointment session ended successfully, data cleared.");
     
  }
    return response.data;
  } catch (error) {
    console.error('Error ending appointment session:', error.response || error.message);
    setLoading(false);
    throw error;
  } finally{
    setLoading(false);
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

const handleOpenModalTooth =(tooth) =>{
  console.log("motooth", tooth);
  setSelectedTooth(tooth);
  setIsOpenToothModal(true);
 if(tooth.dental_chart_description){
  setToothDescription(tooth.dental_chart_description);
 }else{
  setToothDescription('');
 }
 if(tooth.dental_chart_remark){
  setToothRemark(tooth.dental_chart_remark);
 }else{
  setToothRemark('');
 }
}


 // Handle delete tooth
 const handleDeleteTooth = async () => {
  const token = localStorage.getItem("token");
  try {
    // Call DELETE API endpoint
    const response = await axios.delete(`${var_api}dentalhistorychart/delete/${selectedTooth?.dental_chart_id}`,{
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

  const handleOpenOutsideHistory = () =>{
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


const handleDeleteHistoryRow = async (id) => {
  try {
    // Get token from storage (adjust based on your auth implementation)
    const token = localStorage.getItem('token') ;
    
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

   
    notification.success({message:'Item deleted successfully!'});
    handleServiceTypesHistotry();

  } catch (error) {
    console.error('Delete error:', error);
    notification.error({message: error.message || 'Error deleting item'});
  }
};


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
  } finally{
    setLoading(false);
  }
};


const handleOpenAptHistory = () =>{
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
    service_type: lastRow. service_type, 
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
    await handleServiceTypesHistotry();
    notification.success({message:"Invoice billing details submitted successfully!"});
  } catch (error) {
    console.error("Error submitting invoice details:", error);
    notification.error({message:"Failed to submit invoice billing details!"});
  } finally{
    setLoading(false);
  }
}

useEffect(() => {
  if (selectedCard !== null) {
    // This will run every time selectedCard changes
    console.log(`Selected card: ${selectedCard}`);
  }
}, [selectedCard]);  // Depend on selectedCard to track changes

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

  setSelectedDate(dateRange); // Update the input field
  setStartDate(formattedStartDate);
  setEndDate(formattedEndDate);

  // if (selectedDoctorsId) {
    fetchData(formattedStartDate, formattedEndDate, selectedDoctorsId, selectedPatientsId);
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
  setSubTotal(total.toFixed(2));
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
          console.log("textafter",filteredpayData);
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
      console.log("textafter",modefiltereddata)
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
      paid_amount: idx === index ? existingServices?.final_amount : 0, // Assign final_amount to clicked paymode, others get 0
    }));
    console.log("paymos",updatedData, totalPayAmount);
    setTotalPayAmount(0);
    setTotalPayAmount(existingServices?.final_amount);
  
    setmodeFilteredData(updatedData);
    // handlePayInputChange(index, existingServices?.final_amount); // Update calculations
  };
  

//open the paymode list
const handleOpenPay = () => {
  setIsPayModalVisible(true);
  fetchInvoice(selectedAppointment?.id);
}



 const handlePayFormSubmit = async () => {
      let paidStatus;
      if (existingServices && totalPayAmount) {
        if (parseFloat(totalPayAmount) < existingServices.final_amount) {
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
        invoice_token: existingServices?.invoice_token,
        hospital_id: existingServices?.hospital_id,
        appointment_id: existingServices?.appointment_id || selectedAppointment?.id,
        patient_id: existingServices?.patient_id,
        tech_id: existingServices?.tech_id,
        sub_total: existingServices?.sub_total,
        any_discount: existingServices?.any_discount,
        tax_value: existingServices?.tax_value,
        tax_amount: existingServices?.tax_amount,
        final_amount: existingServices?.final_amount,
        paid_status: paidStatus,
        paid_amount: totalAmount,
        balance_amount: existingServices?.final_amount - totalAmount,
        remarks: existingServices?.remarks
    }
    
     
      try {
        const token = localStorage.getItem("token");
        
      // Convert payload to a JSON string
      const jsonPayload = JSON.stringify(payload);
        const response = await fetch(`${var_api}invoicebilling/update-status/${existingServices?.id}`, {
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
          description: "The patient medical history has been updated.",
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
              appointment_id: existingServices?.appointment_id || selectedAppointment?.id,
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
            appointment_id: existingServices?.appointment_id,
          }));
          console.log("delete",deleteformData);
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
        const handleOpenEditDiscount = () =>{
          setIsEditDiscount(true);
          setEditDiscount(existingServices?.any_discount);
        }

         // Handle input change
  const handleDiscountChange = (e) => {
    let newDiscount = e.target.value;

    // Convert to number (or keep it as 0 if empty)
    newDiscount = newDiscount === "" ? 0 : Number(newDiscount);
    setEditDiscount(newDiscount);
     // If newDiscount is 0 or empty, use existing final amount
  const calculatedFinalAmount = newDiscount === 0 
  ? existingServices?.sub_total 
  : existingServices?.sub_total - newDiscount;
    setEditFinalAmount(calculatedFinalAmount);
  };

  //cancel discount update
  const handleCancelDiscount = () => {
    setEditDiscount(existingServices?.any_discount);
    setEditFinalAmount(existingServices?.final_amount);
    setIsEditDiscount(false);
  }


   // Handle update
  const handleUpdateDiscount = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      // Example calculation: Adjust final_amount & final_sub_total based on discount
    const calculatedFinalAmount = existingServices?.sub_total - editDiscount;
    const calculatedFinalSubTotal = existingServices?.sub_total - editDiscount;

      // Call API to update discount
      await axios.put(`${var_api}invoicebilling/update-discount/${existingServices?.id}`, {
        any_discount: editDiscount,
        final_amount: calculatedFinalAmount,
        final_sub_total: calculatedFinalSubTotal
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
        any_discount: editDiscount,
        final_amount: calculatedFinalAmount,
        final_sub_total: calculatedFinalSubTotal
      }));

      // Hide input field after updating
      setIsEditDiscount(false);
    } catch (error) {
      console.error("Error updating discount:", error);
    }
  };
  const handleClearDateRange = () => {
    setSelectedDate(""); // Clears the displayed date
    setStartDate(null);
    setEndDate(null);
  
    // Fetch data without date filters
    fetchData(null, null, selectedDoctorsId, selectedPatientsId);
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
  <h3 className="page-title">Appointments</h3>
  <ul className="breadcrumb">
    <li className="breadcrumb-item">
      <Link to="/admin">Dashboard</Link>
    </li>
    <li className="breadcrumb-item active">Appointments</li>
  </ul>
</div>

<div className="row d-flex flex-wrap">
  <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-3">
  <Select
      className="select-social-img w-100"
      placeholder="Select Doctor"
      isSearchable={true}
      isClearable={true} // Enables the clear option
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
      styles={{
        container: (provided) => ({
          ...provided,
          width: "100%", // Full width
        }),
      }}
    />
  
  </div>

  <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-3">
  <Select
  className="select-social-img w-100"
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

</div>


  <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-3">
  <Select
  className="select-social-img w-100"
  defaultValue={options.find((option) => option.value == localStorage.getItem('selectedStatus')) || null}
  onChange={handleStatusChange}
  options={options}
  placeholder="Select Platform"
  isSearchable={false}
  isClearable={true} // Enables the clear option
  styles={{
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
  }}
/>
  </div>

  <div className="col-12 col-sm-12 col-md-6 col-lg-4 mt-3">
    <div className="filter-head">
      <div className="position-relative daterange-wraper d-flex justify-content-between w-100">
        <div className="input-groupicon calender-input w-100 position-relative">
  
<DateRangePicker
  initialSettings={initialSettingsApt}
  onApply={handleApply}
>
  <div style={{ position: "relative", display: "inline-block" }}>
    <input
      className="form-control date-range bookingrange"
      type="text"
      value={selectedDate}
      placeholder="dd-mm-yyyy - dd-mm-yyyy"
      readOnly
      style={{ maxWidth: "200px", fontSize: "14px", padding: "5px 8px",  background: "white", paddingRight: "30px" }} // Space for clear button
    />
    {/* Clear Button */}
    {selectedDate && (
     <button
     onClick={handleClearDateRange} // Now it is defined
     style={{
       position: "absolute",
       right: "8px",
       top: "50%",
       transform: "translateY(-50%)",
       background: "transparent",
       border: "none",
       cursor: "pointer",
       fontSize: "12px", // Reduced size
       color: "#000", // Changed to black
       padding: "2px", // Small padding
     }}
   >
     ✖
   </button>
   
    )}
  </div>
</DateRangePicker>


        </div>
        {/* <i className="fa-solid fa-calendar-days" /> */}
      </div>
    </div>
  </div>

  <div className="col-12 col-sm-12 col-md-6 col-lg-2 mt-3 d-flex justify-content-end">
  <button
      type="button"
      className="btn btn-warning mb-3"
      onClick={() => {
        setSelectedDoctorsId(null); // Clear doctor selection
        setSelectedDate(""); // Clear date selection
        setSelectedPatientsId(null);
        fetchData(null, null, null, null);
        // setSelectedStatus(7);
        // const filterData = 7 === 7 ? data : data.filter((item) => item.status === 7);
        // setFilteredData(filterData);
        // localStorage.setItem('selectedStatus', 7);
      }}
    >
      Clear
    </button>
    <button
      type="button"
      className="btn btn-primary mb-3"
      style={{marginLeft:"5px"}}
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
          <div     className={columns.firstCol} 
          
    style={{
      position: "relative",
      borderRadius: "2px",      // Optional: Rounded corners
      padding: "10px",          // Add spacing inside the big card
      backgroundColor: "#f8f8f8", // Light gray background
    }}
  >
  <div style={{ position: "absolute", top: "-30px", left: "10px", display: "flex", gap: "10px" }}>
    <button 
      style={{
        backgroundColor: "#28a745", 
        color: "white", 
        border: "none", 
        borderRadius: "5px", 
        padding: "6px 10px", 
        fontSize: "16px", 
        cursor: "pointer"
      }}
      onClick={handleOthersClick} // Define this function for the "Others" button
    >
      Go to patient
    </button>
</div> 

   {/* {isPlusButtonVisible && selectedCard !== null && (
  <button 
    style={{
      position: "absolute", 
      top: "-30px", // Adjust position for better visibility
      right: "10px", 
      backgroundColor: "#007bff", 
      color: "white", 
      border: "none", 
      borderRadius: "5px", 
      padding: "6px 10px", // Smaller padding
      fontSize: "16px", // Smaller font size
      cursor: "pointer",
      // Responsive adjustments for smaller screens
      '@media (max-width: 768px)': {
        top: "-20px", // Adjust position for tablets
        right: "5px", 
        padding: "4px 8px", // Even smaller padding
        fontSize: "14px", // Smaller font size
      },
      '@media (max-width: 480px)': {
        top: "-15px", // Adjust position for mobile phones
        right: "2px", 
        padding: "3px 6px", // Minimal padding
        fontSize: "12px", // Smallest font size
      }
    }}
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
  {othersList.length > 0 ? (
    othersList.map((apt, index) => (
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
        onClick={() => {  // ✅ Move onClick here inside the .map() function
          setSelectedCard(index);
          handleEyeClick(apt);
          setIsPlusButtonVisible(true);
          handleGetpatientAptistotry(apt?.patient_id);
          fetchToothDirections(apt?.id);
          setSelectedCardData(apt);
          setSelectedotherAppointment(apt)
        }}
      >
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
                    <Link to="#">{apt?.others_name} <span 
  style={{ 
    color: '#1d7ed8', 
    cursor: 'pointer', 
    fontSize: '12px'  // Adjust size as needed
  }} 

>
 
</span>
</Link>
                  </h6>
                  <p className="visit">{apt?.mobile}</p>
                </div>
              </div>

              <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  }}
>
  {/* Time & Date Row (Responsive) */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
      justifyContent: "center", // Centers content on small screens
    }}
  >
    {/* Date */}
    <p
      className="time-no-shape"
      style={{
        fontWeight: "bold",
        marginBottom: "5px",
        padding: "5px 10px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <i className="fe fe-calendar" style={{ color: "#007bff" }} />{" "}
      {apt?.appointment_date}
    </p>
    {/* Time */}
    <p
      className="time-no-shape"
      style={{
        fontWeight: "bold",
        marginBottom: "5px",
        padding: "5px 10px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <i className="fe fe-clock" /> {apt?.appointment_time}
    </p>
  </div>

  {/* Status Below */}
  <span className="status-no-shape" style={{ fontWeight: "bold", marginTop: "5px" }}>
    {getStatusBadge(apt.status)}
  </span>

  {/* Additional Info (Company, Role, Description) */}
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
                    setSelectedotherAppointment(apt)
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
       <img src={noDataImage} alt="No Appointments" style={{maxWidth: "100%", height: "auto"}} />
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
          <div className="d-flex align-items-center justify-content-between m-2"></div>
        </div>

        <div className="patient-info-box">
          {/* Row 1: APT ID, Name, Mobile */}
          <div className="row">
            <div className="col-xl-4 col-md-4">
              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <IdCard size={18} color="pink" />
                <span style={{ color: "#1d7ed8" }}>
                  #{selectedotherAppointment?.token_no || "-"}
                </span>
              </p>
            </div>

            <div className="col-xl-4 col-md-4">
              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={18} color="black" />
                <span style={{ color: "black" }}>
                  {selectedotherAppointment?.others_name || "-"}
                </span>
              </p>
            </div>

            <div className="col-xl-4 col-md-4">
              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={18} color="green" />
                <span>{selectedotherAppointment?.mobile || "-"}</span>
              </p>
            </div>
          </div>

          {/* Row 2: Appointment Date, Time */}
          <div className="row">
            <div className="col-xl-6 col-md-6">
              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} color="orange" />
                <span>{selectedotherAppointment?.appointment_date || "-"}</span>
              </p>
            </div>

            <div className="col-xl-6 col-md-6">
              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={18} color="blue" />
                <span>{selectedotherAppointment?.appointment_time || "-"}</span>
              </p>
            </div>

            <div className="col-xl-6 col-md-6">
              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={18} color="blue" />
                <span>{selectedotherAppointment?.role || "-"}</span>
              </p>
            </div>

            <div className="col-xl-6 col-md-6">
              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={18} color="blue" />
                <span>{selectedotherAppointment?.company || "-"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Horizontal line before the next card */}
    <div className="create-details-card">
      <div className="create-details-card-head">
      <div className="form-bg-title">
      <h5>Other Appointment Details {" "}<i className="fe fe-pencil text-danger" onClick={handleModalOpenUdpate}></i></h5>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "15px",
        }}
      >
        {/* Description - Green */}
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={18} style={{ color: "green" }} />
          <span>{selectedotherAppointment?.description || "-"}</span>
        </p>

        {/* Remarks - Red (Fixed property name) */}
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MessageSquare size={18} style={{ color: "red" }} />
          <span>{selectedotherAppointment?.remarks || "-"}</span> {/* Fixed key */}
        </p>

        {/* Any File - Purple */}
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <File size={18} style={{ color: "purple" }} />

  {selectedotherAppointment?.any_file ? (
    (() => {
      const fileUrl = selectedotherAppointment.any_file;
      const fileExtension = fileUrl.split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
        // Display image file
        return <img src={fileUrl} alt="Uploaded File" style={{ width: "100px", height: "100px", objectFit: "cover" }} />;
      } else if (["pdf", "csv", "docx", "xlsx", "txt"].includes(fileExtension)) {
        // Show download link for documents
        return (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "blue" }}>
            View File
          </a>
        );
      } else {
        // Unknown file type, show a generic message
        return <span>File Uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download</a></span>;
      }
    })()
  ) : (
    <span>-</span>
  )}
</p>

        {/* Technician Name - Blue */}
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <User size={18} style={{ color: "blue" }} />
          <span>{selectedotherAppointment?.tech_name ?? "Not Assigned"}</span>
        </p>

        {/* Appointment Date - Orange (Ensure correct date format) */}
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={18} style={{ color: "orange" }} />
          <span>
            {selectedotherAppointment?.appointment_date
              ? new Date(selectedotherAppointment.appointment_date).toLocaleDateString()
              : "-"}
          </span>
        </p>

        {/* Appointment Time - Teal */}
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock size={18} style={{ color: "teal" }} />
          <span>{selectedotherAppointment?.appointment_time || "-"}</span>
        </p>
      </div>
    </div>
  </div>
  </div>
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
    <div className="container">
      <div className="row">
        {/* Left Side: Patient Details */}
        <div className="col-md-6">
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
                ? mobileOptions.find(opt => opt.value === customerMobile) ||
                  { label: customerMobile, value: customerMobile }
                : null
            }
            onChange={(selectedOption) => {
              if (selectedOption) {
                setCustomerMobile(selectedOption.value);
                fetchPatientDetailsByNumber(selectedOption.value);
              } else {
                setCustomerMobile("");
                setothersDetails(null);
              }
            }}
            onInputChange={(inputValue) => {
              if (inputValue.length >= 3) {
                fetchPatientDetailsByNumber(inputValue);
              }
            }}
            options={mobileOptions}
            isSearchable
            isClearable
            noOptionsMessage={() => "No mobile number found"}
            formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
            getOptionLabel={(option) => option.label}
          />
          

          {loading && <p>Loading others details...</p>}

          {othersDetails ? (
            <div className="mt-3">
              <h3>Other Details</h3>
              <div className="d-flex flex-wrap gap-3 mb-2">
                <p className="mb-0">{`City: ${othersDetails.city}`}</p>
                <p className="mb-0">{`Address: ${othersDetails.address}`}</p>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <p className="mb-0">{`Gender: ${othersDetails.gender}`}</p>
                <p className="mb-0">{`Role: ${othersDetails.role}`}</p>
              </div>
            </div>
          ) : (
            customerMobile.length === 10 && (
              <div>
                <p>
                  Others not found. Would you like to <strong>add a new Others?</strong>
                </p>
                <button type="button" className="btn btn-primary mx-1" onClick={handleAddPatientClick}>
                  Add Others
                </button>
              </div>
            )
          )}
          

          {/* Form Inputs */}
          <Form.Item label="Description" name="description" className="mt-3">
  <input
    className="form-control w-100"
    type="text"
    name="description"
    value={formValues.description}
    onChange={handleInputChangeother}
  />
</Form.Item>

<Form.Item label="Company" name="company">
  <input
    className="form-control w-100"
    type="text"
    name="company"
    value={formValues.company}
    onChange={handleInputChangeother}
  />
</Form.Item>

<Form.Item label="Role" name="role">
  <input
    className="form-control w-100"
    type="text"
    name="role"
    value={formValues.role}
    onChange={handleInputChangeother}
  />
</Form.Item>
        </div>

        {/* Right Side: Doctor Details */}
        <div className="col-md-6">
          <label className="mt-2 fw-bolder">
            Doctor <span style={{ color: "red" }}>*</span>
          </label>
          <Form.Item name="doctor">
            <select className="form-control" value={selectedDoctorId || ""} onChange={(e) => setSelectedDoctorId(e.target.value)}>
              <option value="">Select Doctor</option>
              {specializationDetails.length > 0 ? (
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

          {/* Appointment Date Picker */}
          <label className="mt-2 fw-bolder">
            Appointment Date <span style={{ color: "red" }}>*</span>
          </label>
          <DatePicker
            className="form-control"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            minDate={new Date(2000, 0, 1)}
            maxDate={new Date(2030, 11, 31)}
            onKeyDown={(e) => e.preventDefault()}
          />

          {/* Appointment Time */}
          <div className="mt-3">
            <label className="fw-bolder">
              Appointment Time <span style={{ color: "red" }}>*</span>
            </label>
            <select className="form-control" value={selectedTime} onChange={handleTimeChange}>
              <option value="">Select Time</option>
              {timeSlots.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <Form.Item label="Upload File" name="any_file">
  <input
    type="file"
    className="form-control"
    onChange={handleFileChange}
  />
</Form.Item>

        </div>
      </div>

      {/* Submit Button */}
      <div className="text-end mt-3">
        <Form.Item>
          <button type="button" className="btn btn-danger custom-btn" onClick={handleModalClose}>
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary mx-1 book-now-btn"
            onClick={handleBookNowClick}
            disabled={!customerMobile || customerMobile.length !== 10}
          >
            Book Now
          </button>
        </Form.Item>
      </div>
    </div>
  </Form>
</Modal>

{/* update appointment */}
<Modal
  title="Update Appointment"
  visible={isModalVisibleUpdate}
  onCancel={handleModalCloseUdpate}
  footer={null}
  size="xxl"
  width={1000}
>
  <Form
    onFinish={handleBookNowClick}
    initialValues={{
      description: selectedAppointment?.description || "",
      company: selectedAppointment?.company || "",
      role: selectedAppointment?.role || "",
      doctor: selectedAppointment?.tech_id?.toString() || "",
      appointment_date: selectedAppointment?.appointment_date ? new Date(selectedAppointment.appointment_date) : null,
      appointment_time: selectedAppointment?.appointment_time || "",
    }}
  >
    <div className="container">
      <div className="row">
        {/* Left Side: Patient Details */}
        <div className="col-md-6">
          <label className="mt-2 fw-bolder">
            Phone No <span style={{ color: 'red' }}>*</span>
          </label>
          <CreatableSelect
            inputId="mobile"
            placeholder="Enter Mobile No"
            maxLength={10}
            required
            value={
              selectedAppointment?.mobile
                ? { label: selectedAppointment.mobile, value: selectedAppointment.mobile }
                : null
            }
            onChange={(selectedOption) => {
              if (selectedOption) {
                setCustomerMobile(selectedOption.value);
                fetchPatientDetailsByNumber(selectedOption.value);
              } else {
                setCustomerMobile("");
                setothersDetails(null);
              }
            }}
            options={mobileOptions}
            isSearchable
            isClearable
            noOptionsMessage={() => "No mobile number found"}
          />

          {loading && <p>Loading others details...</p>}

          {othersDetails ? (
            <div className="mt-3">
              <h3>Other Details</h3>
              <div className="d-flex flex-wrap gap-3 mb-2">
                <p className="mb-0">{`City: ${othersDetails.city}`}</p>
                <p className="mb-0">{`Address: ${othersDetails.address}`}</p>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <p className="mb-0">{`Gender: ${othersDetails.gender}`}</p>
                <p className="mb-0">{`Role: ${othersDetails.role}`}</p>
              </div>
            </div>
          ) : (
            selectedAppointment?.mobile && (
              <div>
                <p>
                  Others not found. Would you like to <strong>add a new Others?</strong>
                </p>
                <button type="button" className="btn btn-primary mx-1" onClick={handleAddPatientClick}>
                  Add Others
                </button>
              </div>
            )
          )}

          {/* Form Inputs */}
          <Form.Item label="Description" name="description" className="mt-3">
            <input
              className="form-control w-100"
              type="text"
              name="description"
              value={selectedAppointment?.description || ""}
              onChange={handleInputChangeother}
            />
          </Form.Item>

          <Form.Item label="Company" name="company">
            <input
              className="form-control w-100"
              type="text"
              name="company"
              value={selectedAppointment?.company || ""}
              onChange={handleInputChangeother}
            />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <input
              className="form-control w-100"
              type="text"
              name="role"
              value={selectedAppointment?.role || ""}
              onChange={handleInputChangeother}
            />
          </Form.Item>
        </div>

        {/* Right Side: Doctor Details */}
        <div className="col-md-6">
          <label className="mt-2 fw-bolder">
            Doctor <span style={{ color: "red" }}>*</span>
          </label>
          <Form.Item name="doctor">
            <select
              className="form-control"
              value={selectedAppointment?.tech_id || ""}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {specializationDetails.length > 0 ? (
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

          {/* Appointment Date Picker */}
          <label className="mt-2 fw-bolder">
            Appointment Date <span style={{ color: "red" }}>*</span>
          </label>
          <DatePicker
            className="form-control"
            selected={selectedAppointment?.appointment_date ? new Date(selectedAppointment.appointment_date) : null}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            minDate={new Date(2000, 0, 1)}
            maxDate={new Date(2030, 11, 31)}
            onKeyDown={(e) => e.preventDefault()}
          />

          {/* Appointment Time */}
          <div className="mt-3">
            <label className="fw-bolder">
              Appointment Time <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form-control"
              value={selectedAppointment?.appointment_time || ""}
              onChange={handleTimeChange}
            >
              <option value="">Select Time</option>
              {timeSlots.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <br />

          <Form.Item label="Upload File" name="any_file">
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
          </Form.Item>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-end mt-3">
        <Form.Item>
          <button type="button" className="btn btn-danger custom-btn" onClick={handleModalCloseUdpate}>
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary mx-1 book-now-btn"
            onClick={handleBookNowClick}
            disabled={!selectedAppointment?.mobile || selectedAppointment?.mobile.length !== 10}
          >
            Update
          </button>
        </Form.Item>
      </div>
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
        <label className="mt-3 fw-bolder">
     Referal Person
     
     {/* <Form.Item style={{marginLeft: "20px"}}>
        <Checkbox
         checked={isOthers}
         onChange={(e) => setIsOthers(e.target.checked)}
        >
         Others
        </Checkbox>
        </Form.Item> */}

  </label>

  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Form.Item style={{ marginBottom: 0 }}>
          <Checkbox checked={isOthers} onChange={(e) => setIsOthers(e.target.checked)}>
            Others
          </Checkbox>
        </Form.Item>
      </div>
  {
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
  }
 
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
          initialValue={specialization.length > 0 ? specialization[0].value : ""}
          rules={[{ required: true, message: 'Please select a specialization!' }]}
        >
<select
  className="form-control"
  required
  value={selectedSpecializationId || ""}
  onChange={(e) => handleSpecializationChange({ value: e.target.value })}
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
  value={selectedDoctorId || ""}
  onChange={handleDoctorChange}
>
  <option value="">Select Doctor</option>
  {specializationDetails && specializationDetails.length > 0 ? (
    specializationDetails.map((doctor) => (
      <option key={doctor.id} value={doctor.id}>
        {doctor.name} {/* Display doctor's name */}
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
  selected={selectedDate}
  onChange={handleDateChange}
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
  {dayTimings.map((item, index) => (
    <li
      key={index}
      onClick={() => handleSelectTime(item.id, item.available_from_time)}
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
      {item.available_from_time}
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
  onClick={handleBookNowClick}
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
<h4>AppointmentDetails</h4>
<div className="container">
<div className="row align-items-center mb-3">
  <div className="col">
    <p><strong>{othersDetails?.name}</strong></p>
  </div>
</div>

  <div className="row mb-3">
    <div className="col-6">
      <p><strong>DOB:</strong> {othersDetails?.city}</p>
    </div>
    <div className="col-6">
      <p><strong>Address:</strong> {othersDetails?.address}</p>
    </div>
  </div>

  <div className="row">
    <div className="col-6">
      <p><strong>Gender:</strong> {othersDetails?.gender}</p>
    </div>
    <div className="col-6">
      <p><strong>Blood Group:</strong> {othersDetails?.role}</p>
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
        <strong>Doctor:</strong> {
          specializationDetails.find(doctor => doctor.id == selectedDoctorId)?.name || "N/A"
        }
      </p>
    </div>
  </div>
</div>
  <div style={{ textAlign: "right" }}>
    <Button  type="button"   className="btn btn-danger" onClick={() => setIsConfirmationModalVisible(false)} style={{ marginRight: "10px" }}>
      Cancel
    </Button>

    <Button 
    type="button"  
    className="btn btn-primary mx-1" 
    onClick={handleConfirmotherAppointment}>

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

         {activethirdTab === "DentalHistory" &&(
          
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
         {activeSecondTab === "current_appointment" &&  activethirdTab === "DentalHistory" && (
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
                <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px'}}> {/* Add vertical gap between rows */}
                  {
                    toothDirections['Upper Left']
                      .slice(rowIndex * 4, (rowIndex + 1) * 4)
                      .map((dir, index) => (
                        <Col
                          key={index}
                          lg={6}
                          // className="d-flex justify-content-center"
                          style={{ paddingLeft: '8px', paddingRight: '8px'}} // Horizontal gap between columns
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
                <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px'}}> {/* Add vertical gap between rows */}
                  {
                    toothDirections['Upper Right']
                      .slice(rowIndex * 4, (rowIndex + 1) * 4)
                      .map((dir, index) => (
                        <Col
                          key={index}
                          lg={6}
                          // className="d-flex justify-content-center"
                          style={{ paddingLeft: '8px', paddingRight: '8px'}} // Horizontal gap between columns
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
                <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px'}}> {/* Add vertical gap between rows */}
                  {
                    toothDirections['Lower Left']
                      .slice(rowIndex * 4, (rowIndex + 1) * 4)
                      .map((dir, index) => (
                        <Col
                          key={index}
                          lg={6}
                          // className="d-flex justify-content-center"
                          style={{ paddingLeft: '8px', paddingRight: '8px'}} // Horizontal gap between columns
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
                <Row key={rowIndex} className="justify-content-center" style={{ marginBottom: '16px'}}> {/* Add vertical gap between rows */}
                  {
                    toothDirections['Lower Right']
                      .slice(rowIndex * 4, (rowIndex + 1) * 4)
                      .map((dir, index) => (
                        <Col
                          key={index}
                          lg={6}
                          // className="d-flex justify-content-center"
                          style={{ paddingLeft: '8px', paddingRight: '8px'}} // Horizontal gap between columns
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
        Total Cost: <strong>{totalAmount.toFixed(2)}</strong>
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
    <p><strong>FDI:</strong> <span style={{fontSize:"18px", color:"green"}}> {selectedTooth?.fdi}</span></p>
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
      selectedTooth?.dental_chart_id &&  <a
      href="#"
      className="me-1 btn btn-sm bg-danger-light" onClick={handleDeleteTooth}>
      Delete
    </a>
    }
  </div>
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
      Total Cost: <strong>{finalAmount.toFixed(2)}</strong>
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
  visible={showModal}
  onRequestClose={handleCancelEdit}
  onCancel={handleCloseModal}
  footer={null}
  contentLabel="Edit Vitals"
>
  <h5>Edit Vitals</h5>
  <form onSubmit={handleEditVitalClick}>  {/* Prevent form submission */}
    <div className="row">
      {[
        { label: "Temperature", name: "temp", unit: "F" },
        { label: "Pulse", name: "pulse", unit: "bpm" },
        { label: "SPO2", name: "spo2", unit: "%" },
        { label: "Height", name: "height", unit: "cm" },
        { label: "Weight", name: "weight", unit: "Kg" },
        { label: "BMI", name: "bmi_value", unit: "kg/cm" },
        { label: "BP", name: "bp", unit: "mmHg" },
        { label: "Before Sugar", name: "before_sugar", unit: "M" },
        { label: "After Sugar", name: "after_sugar", unit: "M" },
      ]
        .filter((field) => settings?.[field.name] == 1)
        .map((field) => (
          <div key={field.name} className="col-lg-4 col-md-4 col-sm-6">
            <div className="input-block input-block-new">
              <label className="form-label">{field.label}</label>
              <div className="input-text-field">
                <input
                  type="number"
                  className="form-control"
                  placeholder={`Eg: ${field.name}`}
                  name={field.name}
                  value={formVitalData[field.name] || ""}
                  onChange={handleInputVitalChange}
                />
                <span className="input-group-text">{field.unit}</span>
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
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
        <button 
          type="button"  // Ensure this is "button"
          className="btn btn-primary mx-1"
          onClick={handleEditVitalClick}
        >
          Edit
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
    others_name: selectedAppointment?.referal_person_name || "", // Use referal_person_name if available
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
        {dayTimingsupdate.map((item, index) => (
          <li 
            key={index} 
            onClick={() => handleSelectTime(item.id, item.available_from_time)}
            style={{ 
              width: 'calc(50% - 8px)', 
              marginBottom: '8px', 
              backgroundColor: selectedTimeupdate?.id === item.id ? '#007bff' : '#f0f0f0', 
              padding: '6px 10px', 
              borderRadius: '6px', 
              fontSize: '14px', 
              textAlign: 'center', 
              color: selectedTimeupdate?.id === item.id ? '#fff' : '#333', 
              cursor: 'pointer', 
              userSelect: 'none', 
              transition: 'all 0.2s ease-in-out' 
            }}
          >
            {item.available_from_time}
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Referral Person in one row */}
  <div>
    <label className="mt-3 fw-bolder">Referral Person</label>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Form.Item style={{ marginBottom: 0 }}>
        <Checkbox checked={isOthers} onChange={(e) => setIsOthers(e.target.checked)}>Others</Checkbox>
      </Form.Item>
    </div>
    {!isOthers ? (
      <CreatableSelect 
        inputId="referal_person" 
        placeholder="Enter referral person" 
        required 
        onChange={handleReferalChangeupdate} 
        options={referalPersonsupdate} 
        value={referalPersonsupdate.find(option => option.value === referalPersonupdateId) || null} 
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
    )}
  </div>

  {/* Submit Button */}
  <div className="text-end mt-3">
    <Form.Item>
      <button type="button" className="btn btn-danger custom-btn" onClick={toggleEditModal}>Cancel</button>
      <button type="submit" className="btn btn-primary mx-1" disabled={!selectedTime}>Edit</button>
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
            <button type="button" className="btn btn-primary mx-1" onClick={handleDeleteclick}>
              Delete
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDeleteCancel}>
              Cancel
            </button>
          </div>
        </Form.Item>
      </Modal>

      </div>
    
    </>
  );
};

export default othersappoint;
