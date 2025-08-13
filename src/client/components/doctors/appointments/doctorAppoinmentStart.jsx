/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect,useRef} from 'react'
import DoctorSidebar from '../sidebar'
import Header from '../../header'
import DoctorFooter from '../../common/doctorFooter'
// import { doctordashboardprofile02 } from '../../imagepath'
import  doctordashboardprofile02  from "../../../assets/img/patients/pat_dummy.png"
import { Link } from 'react-router-dom'
import { TagsInput } from "react-tag-input-component";
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { image_api, var_api } from '../../../../constant';
import CreatableSelect from 'react-select/creatable';
import { Form, Input, notification, Row, Col, Switch } from "antd";

const DoctorAppoinmentStart = (props) => {
    const [owner, setOwner] = useState(["Skin Allergy"]);
    const [lab, setLab] = useState(["Hemoglobin A1c (HbA1c) , Liver Function Tests (LFTs)"]);
    const history = useHistory(); // React Router v5 navigation
    const [labDropdowns, setLabDropdowns] = useState({});
    
    const handleLabChange = (value) => {
        setLab(value);
    };
    const labsArray = lab && lab[0] ? lab[0].split(' , ') : [];
    const hospital_id = localStorage.getItem("doc_hospital_id");
    // const handleLabChange1 = (value) => {
    //     setComplaint(value);
    // };
    // Splitting the string into separate items whenever a comma is encountered
    // const complaintsArray = complaint && complaint[0] ? complaint[0].split(' , ') : [];

  
    // const addMedication = () => {
    //     setMedications([...medications, { id: medications.length + 1 }]);
    // };

    // const removeMedication = (id) => {
    //     setMedications(medications.filter(medication => medication.id !== id));
    // };
    // const type = [
    //     { value: 'Direct Visit', label: 'Direct Visit' },
    //     { value: 'Video Call', label: 'Video Call' },
    //   ];
    // const duration = [
    //     { value: 'Selectt', label: 'Select' },
    //     { value: 'Not Available', label: 'Not Available' },
    //   ];
      const beforeAfter = [
        { value: 1, label: 'Before food' },
        { value: 0, label: 'After food' },
      ];
      const [form] = Form.useForm();
      const token = localStorage.getItem("doc_token");
      const [duration, setDuration] = useState("0-0-0-0");
      const location = useLocation();
      const { state } = location; // Extract the state object
      console.log("st", state);
      const [currentDetail, setCurrentDetail] = useState(state);
      const [loading,setLoading]=useState(false);
      const [formData, setFormData] = useState({
        temp: state?.temp || "",
        pulse: state?.pulse || "",
        spo2: state?.spo2 || "",
        height: state?.height || "",
        weight: state?.weight || "",
        bmi_value: state?.bmi_value || "",
        bp: state?.bp || "",
        before_sugar: state?.before_sugar || "",
        after_sugar: state?.after_sugar || "",
        clinical_notes: state?.clinical_notes || "",
        complaints: state?.complaints || "",
        advice: state?.advice || "",
        follow_up: state?.follow_up || "",
        previous_history: state?.previous_history || "",
        note: state?.note || ""
    });
    
      const[meditions, setMeditions] = useState([]);
      const [serviceTypes, setServiceTypes] = useState([]);

      const [medications, setMedications] = useState([{sub_cat_id: null, unit_price: null, is_before_food: 0, cycle: 0, remarks: '',  is_morning:0, is_evening:0, is_noon:0, is_night:0}]);
      const [services, setServices] = useState([{id: Date.now(),service_type_id: null, service_type: 0, remarks: '',  qty:0, final_price: 0, price:0, discount:0}]);
      const [referalPersons, setReferalPersons] = useState([]);
      const [referalPersonId, setReferalPersonId] = useState( state?.referal_person_id || 0);
      const [settings, setSettings] = useState(null);
      const endsession_by_doctor_email = localStorage.getItem("endsession_by_doctor_email") === "1";
      const endsession_by_doctor_patient_email = localStorage.getItem("endsession_by_doctor_patient_email") === "1";
      const [isMedEditing, setIsMedEditing] = useState(false);
      const handleMedEditClick = () => setIsMedEditing(true);
      const endSessionModalRef = useRef(null);


       // Handles form submission
   const handleMedFormSubmit = async (values) => {
    console.log("Form Submitted:", values);
    
        try {
          const token = localStorage.getItem("doc_token");
      
          const response = await fetch(`${var_api}patientmedicalhistory/update/${selectedAppointment?.patient_id}`, {
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

          setIsMedEditing(false); // Exit edit mode after submission
      
         
        } catch (error) {
          console.error("Error updating data:", error);
          notification.error({
            message: "Update Failed",
            description: "Failed to update the patient medical history. Please try again.",
          });
        }
   
  };


  const [switchStates, setSwitchStates] = useState({
    asthma: false,
    diabetes: false,
    drug_allergy: false,
    pregnancy: false,
    bp: false,
    cardiac: false,
  });



    //fetch service list
    const fetchPatientMedicalHistory= async () => {
        try {
          const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
          if (!token) {
            throw new Error("Token not found. Please log in again.");
          }
  
          const response = await axios.get(
            `${var_api}patientmedicalhistory/get-by-patient/${state.patient_id}`, // Replace with your API endpoint
            {
              headers: {
                Authorization: token,
              },
            }
          );
  
          // Map API data to Select component options
          const options = response.data;
          setSwitchStates({
            asthma: options?.asthma == 1,
            diabetes: options?.diabetes == 1,
            drug_allergy: options?.drug_allergy == 1,
            pregnancy: options?.pregnancy == 1,
            bp: options?.bp == 1,
            cardiac: options?.cardiac == 1,
          });
  
        } catch (err) {
          console.error("Error fetching medicine subcategories:", err);
        //   setError(err.message || "An error occurred.");
        }
      };

   

     

        // Handles switch changes
  const handleSwitchChange = (key, checked) => {
    setSwitchStates((prevState) => ({
      ...prevState,
      [key]: checked,
    }));
  };



       // Add a new medication object to the medications state
       const addMedication = () => {
          console.log("hospital_id add medi1", state, currentDetail)
          setMedications([
              ...medications,
              { sub_cat_id: null, unit_price: null, is_before_food: 0, cycle: 0, remarks: '',  is_morning:0, is_evening:0, is_noon:0, is_night:0 }
          ]);
          console.log("hospital_id add medi2", state, currentDetail)
      };
  
  
       // Add a new servcies object to the medications state
       const addServices= () => {
          console.log("hospital_id add1", state, currentDetail)
          setServices([
              ...services,
              { service_type_id: null, service_type: 0, remarks: '', qty:0, final_price: 0, price:0 , discount:0}
          ]);
          console.log("hospital_id add2", state, currentDetail)
      };
  
  
        // Handle changes in medication details
        const handleMedicationChange = (index, field, value) => {
          const updatedMedications = [...medications];
          updatedMedications[index] = { ...updatedMedications[index], [field]: value };
          setMedications(updatedMedications);
          console.log("medi", medications);
      };
  
       // Handle when a medication is selected
       const handleMedicationSelect = (index, selectedOption) => {
          // Update the sub_cat_id and unit_price based on the selected option
          const updatedMedications = [...medications];
          updatedMedications[index] = {
              ...updatedMedications[index],
              sub_cat_id: selectedOption.value,
              unit_price: selectedOption.price,
          };
          setMedications(updatedMedications);
          console.log("medications", medications);
      };
  
      // Remove medication by index
      const removeMedication = (currentIndex) => {
          console.log("in",currentIndex);
          setMedications((prevMedications) => prevMedications.filter((_, i) => i !== currentIndex));
          console.log("inm",medications);
      };
  

      //gettting referal master
          const fetchReferalDetails = async () => {
            setLoading(true);
            const hospitalid = localStorage.getItem("doc_hospital_id")
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
                  // Add the "Without Referral" option
                options.unshift({ label: "Without Referral", value: 0 });
                setReferalPersons(options);

                  // Set the initial value based on apt.referal_person_id
      if (state.referal_person_id !== null) {
        const selectedOption = options.find(
          (opt) => opt.value === state.referal_person_id
        );
        setReferalPersonId(selectedOption ? selectedOption.value : 0);
      }
            } catch (error) {
              console.error('Error fetching patient details:', error);
            } finally {
              setLoading(false);
            }
          };

          //onchange function for  referal person
          const handleReferalChange = (selectedOption) => {
            const newReferalId = selectedOption ? selectedOption.value : 0;
    setReferalPersonId(newReferalId);

    // Save the new referral ID (you can add your API logic here)
    console.log("Selected Referral ID:", newReferalId);
          };
  
      // Remove services by index
      const removeServices= (currentIndex) => {
          console.log("in",currentIndex);
          setServices((prevMedications) => prevMedications.filter((_, i) => i !== currentIndex));
          console.log("inm",services);
      };
      

      function getStatusBadge(status) {
        switch (status) {
          case 0:
          case 1:
            return <span className="badge badge-yellow status-badge">Upcoming</span>;
          case 2:
            return <span className="badge badge-yellow status-badge">Inprogress</span>;
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


      useEffect(() => {
            fetchMedicineSubcategories();
            fetchServicesSubcategories();
            fetchReferalDetails();
            fetchSettingDetails();
            console.log("apt", state);
            fetchPatientMedicalHistory();
          }, []);


           // Split complaints string into an array using commas
  const initialComplaintsArray = state?.complaints
  ? state.complaints.split(",").map((item) => item.trim()) // Trim spaces around items
  : [];
  const [complaintsArray, setComplaintsArray] = useState(initialComplaintsArray);
    // Handle changes in the TagsInput
    const handleLabChange1 = (newComplaintsArray) => {
        console.log("hospital_id complaint1", state)
         // Update the complaints array state
  setComplaintsArray(newComplaintsArray);

  // Update the formData complaint as a single string
  const complaintsString = newComplaintsArray.map((item) => item.trim()).join(",");
  setFormData((prev) => ({ ...prev, complaints: complaintsString }));

  console.log("Updated complaint string:", complaintsString);
  console.log("hospital_id complaint2", state)
      };

      const handleInputChange = (e) => {
        console.log("hospital_id vital1", state)
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        console.log("hospital_id vital2", state)
      };

    
    // Call this function after updating `medications`
    

      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });


      //send email for rebook
        const sendEmailEndSession = async () => {
      
          const toemails = [];

          if (endsession_by_doctor_patient_email && state?.patient_email) {
            toemails.push(state.patient_email);
          }
          
          if (endsession_by_doctor_email && state?.doctor_email) {
            toemails.push(state.doctor_email);
          }
          // Prepare the request body
          const requestData = {
            to: toemails,
            subject: "Appointment End Session",
            text: "Your appointment has been ended.",
          };
      
          try {
            const response = await axios.post(
              `${var_api}email-notify/apt-endsession/${state?.id}/doctor`,
              requestData
            );
            console.log('Email sent successfully:', response.data);
          } catch (error) {
            console.error('Error sending email:', error);
          }
        };
        
      


        const endAppointmentSession = async () => {

          console.log("update", state, currentDetail );
        
          const isValid = medications.every(
            (med) => typeof med.cycle === "number" && med.cycle > 0
          );
        
          if (!isValid) {
            notification.error({
              message: 'Validation Error',
              description: 'Please enter duration (in days) for all medications.',
              placement: 'topRight',
            });
            return;
          }
        
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
        
          // Calculate the total final_price
          const totalFinalPrice = services.reduce((sum, service) => sum + service.final_price, 0);
        
          const appointmentData = {
            hospital_id: state?.hospitalID || currentDetail?.hospitalID || hospital_id,
            patient_id: state?.patient_id || currentDetail?.patient_id,
            tech_id: state?.tech_id || currentDetail?.tech_id,
            appointment_day: state?.appointment_day || currentDetail?.appointment_day,
            appointment_time: state?.appointment_time || currentDetail?.appointment_time,
            payment_status: 0,
            status: 3,
            apt_start_time: state?.apt_start_time || currentDetail?.apt_start_time,
            apt_end_time: currentTime,
            amount: totalFinalPrice,
            referal_person: referalPersonId,
            vital_details: {
              id: state?.vital_id || currentDetail?.vital_id || state?.id || currentDetail?.id,
              appointment_id : state?.id || currentDetail?.id,
              weight: formData.weight || 0,
              height: formData.height || 0,
              bmi_value: formData.bmi_value || 0,
              bp: formData.bp || 0,
              temp: formData.temp || 0,
              before_sugar: formData.before_sugar || 0,
              after_sugar: formData.after_sugar || 0,
              pulse: formData.pulse || 0,
              spo2: formData.spo2 || 0,
              note: formData.note
            },
            clinical_notes: formData.clinical_notes,
            complaints: formData.complaints,
            advice: formData.advice,
            follow_up: formData.follow_up,
            previous_history: formData.previous_history,
            medicines: updatedMedications,
            newInvoiceBilling:{
              hospital_id: state?.hospitalID || currentDetail?.hospitalID,
              appointment_id: state?.id || currentDetail?.id,
              patient_id: state?.patient_id || currentDetail?.patient_id,
              tech_id: state?.tech_id || currentDetail?.tech_id,
              sub_total: totalFinalPrice,
              any_discount: 0,
              final_amount: totalFinalPrice,
              paid_status: 0,
              paid_amount: 0,
              balance_amount: totalFinalPrice,
              pay_mode: 0,
              remarks: "-",
              services: services
            }
          };
        
          console.log("xyz", appointmentData, updatedMedications);
          const appointment_id = state?.id || currentDetail?.id;
        
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
        
            if (response.status === 200) {
              // Clear all relevant data
              setMedications([]);
              setServices([]);
              setFormData({});
              
              if (endsession_by_doctor_patient_email || endsession_by_doctor_email) {
                await sendEmailEndSession();
              }
        
              console.log("Appointment session ended successfully, data cleared.");
        
              // Send notification if medications are present
              if (updatedMedications.length > 0 && response.status === 200) {
                const updatedAppointment = response.data?.data || response.data || {};
              
                const notificationData = {
                  hospital_id: updatedAppointment.hospital_id || state?.hospitalID || currentDetail?.hospitalID,
                  patient_id: updatedAppointment.patient_id || state?.patient_id || currentDetail?.patient_id || null,
                  doc_id: updatedAppointment.doc_id || state?.tech_id || currentDetail?.tech_id || null,
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
              
        
              if (endSessionModalRef.current) {
                const modal = new window.bootstrap.Modal(endSessionModalRef.current);
                modal.show();
              }
        
              history.push("/doctor/appointments");
              return response.data;
            }
        
          } catch (error) {
            console.error('Error ending appointment session:', error.response || error.message);
            throw error;
          }
        };
        


    //fetch medicines list
    const fetchMedicineSubcategories = async () => {
        try {
          const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
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


      //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0aW1lc3RhbXAiOjE3MzUzNzU0MjQ2MzAsImlhdCI6MTczNTM3NTQyNH0.jkA7TNIJzIPxyrmigzrLmVmPz1ZiTDpHf5eTyMvoqjA";
  const fetchSettingDetails = async () => {
    setLoading(true);
    const token = localStorage.getItem('doc_token');
    const hospital_id = localStorage.getItem('doc_hospital_id');
    try {
      const response = await fetch(`${var_api}settings/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/login"); // Redirect to login page
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



      //fetch service list
      const fetchServicesSubcategories = async () => {
        try {
          const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
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


      //onchange function for duration 0-1-0-0
    //   const handleInputDurationChange = (index, e) => {
    //     const value = e.target.value; // Ensure `e` is passed correctly
    
    //     // Allow only 0 or 1 in specific positions (0-0-0-0 format)
    //     const regex = /^[01]-[01]-[01]-[01]$/;
    
    //     // If the value doesn't match, do nothing
    //     if (!regex.test(value)) {
    //         return;
    //     }
    
    //     const [morning, noon, evening, night] = value.split('-').map(Number);
    
    //     // Update the specific medication
    //     setMedications((prevMedications) =>
    //         prevMedications.map((medication, i) =>
    //             i === index
    //                 ? {
    //                       ...medication,
    //                       is_morning: morning,
    //                       is_noon: noon,
    //                       is_evening: evening,
    //                       is_night: night,
    //                   }
    //                 : medication
    //         )
    //     );
    //     console.log("medi", medications);
    // };
    const handleInputDurationChange = (index, e) => {
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
            i === index
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
      
    


    //onkey press function for duration 0-1-0-0
        // const handleKeyPress = (e) => {
        //     // Prevent invalid input
        //     const allowedKeys = ["0", "1", "Backspace", "ArrowLeft", "ArrowRight", "Tab"];
        //     if (!allowedKeys.includes(e.key) && e.key !== "-") {
        //         e.preventDefault();
        //     }
        // };

        const handleKeyPress = (e) => {
            const allowedKeys = ["0", "1", "Backspace", "ArrowLeft", "ArrowRight", "Tab"];
            
            if (!allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
          };
          
        


        //handle onchange for service change
        const handleServiceChange = async (id, selectedOption) => {
            console.log("hospital_id service1", state, currentDetail);
            if (!selectedOption.hasOwnProperty("is_lab")) {
              console.error("is_lab is missing in selectedOption!", selectedOption);
              return;
            }
            setServices((prevServices) =>
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

             if (selectedOption.is_lab == 1) {
                  // setLoading(true);
                  const hospital_id = localStorage.getItem("doc_hospital_id");
                  const token = localStorage.getItem('doc_token');
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
                      setServices((prevServices) =>
                        prevServices.map((service) =>
                          service.id === id
                            ? {
                                ...service,
                                lab_id: service.lab_id ||  data[0].id, // Default to first lab if none selected
                              }
                            : service
                        )
                      );
            
                      console.log("uyes comign", services, labDropdowns);
                    }
                  } catch (error) {
                    console.error("Error fetching lab dropdown data:", error);
                  } finally {
                    // setLoading(false);
                  }
                }

            console.log("hospital_id service2", state, currentDetail, services);
          };


         //Handle Quantity
          const handleQtyChange = (index, change) => {
            setServices((prevServices) =>
              prevServices.map((service, i) =>
                i === index
                  ? {
                      ...service,
                      qty: Math.max(service.qty + change, 0), // Prevent negative qty
                      final_price: Math.max(service.qty + change, 0) * service.price, // Recalculate final price
                    }
                  : service
              )
            );
          };
        

          const isVisible = (fieldName) => {
            return settings?.[fieldName] !== 0; // Only show the field if the setting is not 0
        };
        
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
        
        // // Set default values for hidden fields
        // useEffect(() => {
        //     if (!settings || typeof settings !== "object") {
        //         console.warn("Settings object is invalid or undefined:", settings);
        //         return;
        //     }
        
        //     const updatedFormData = { ...formData };
        //     Object.keys(settings).forEach((key) => {
        //         if (settings[key] === 0) {
        //             updatedFormData[key] = "0"; // Set hidden fields to 0
        //         }
        //     });
        //     setFormData(updatedFormData);
        // }, [settings]);
        
          
     
      
    return (
        <div>
        <div className='main-wrapper'>
            <Header {...props} />
            {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
            {/* Breadcrumb */}
            <div className="breadcrumb-bar-two">
                <div className="container">
                    <div className="row align-items-center inner-banner">
                        <div className="col-md-12 col-12 text-center">
                            <h2 className="breadcrumb-title">Appointment Detail</h2>
                            <nav aria-label="breadcrumb" className="page-breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/home-1">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item" aria-current="page">
                                        Appointment Detail
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Breadcrumb */}
            {/* Page Content */}
            <div className="content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-xl-3 theiaStickySidebar">
                            <div className='stickybar'>

                                {/* Profile Sidebar */}
                                <DoctorSidebar />
                                {/* /Profile Sidebar */}
                            </div>
                        </div>
                        <div className="col-lg-8 col-xl-9">
                            <div className="dashboard-header">
                                <div className="header-back">
                                    <Link to="/doctor/appointments" className="back-arrow">
                                        <i className="fa-solid fa-arrow-left" />
                                    </Link>
                                    <h3>Appointment Details</h3>
                                </div>
                            </div>
                            <div className="appointment-details-wrap">
                                {/* Appointment Detail Card */}
                                <div className="appointment-wrap appointment-detail-card">
                                    <ul>
                                        <li>
                                            <div className="patinet-information">
                                            <Link to="/doctor/patient-profile">
  <img
    src={state?.patient_profile_image && /\.(jpeg|jpg|png|webp)$/i.test(state.patient_profile_image) 
      ? `${image_api}${state.patient_profile_image}` 
      : doctordashboardprofile02}
    alt="User Image"
  />
</Link>

                                                <div className="patient-info">
                                                    <p>#Apt{state?.token_no}</p>
                                                    <h6>
                                                        <Link to="/doctor/patient-profile">{state?.patient_name}</Link>
                                                    </h6>
                                                    <div className="mail-info-patient">
                                                        <ul>
                                                            <li>
                                                                <i className="fa-solid fa-envelope" />
                                                                {state?.email_id}
                                                            </li>
                                                            <li>
                                                                <i className="fa-solid fa-phone" />
                                                                {state?.patient_mobile_no}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="appointment-info">
                                            {/* <div className="person-info">
                                                <p>Person with patient</p>
                                                <ul className="d-flex apponitment-types">
                                                    <li>Andrew (45)</li>
                                                </ul>
                                            </div> */}
                                            <div className="person-info">
                                                <p>Type of Appointment</p>
                                                <ul className="d-flex apponitment-types">
                                                    <li>
                                                        <i className="fa-solid fa-hospital text-green" />
                                                        Direct Visit
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="appointment-action">
                                            <div className="detail-badge-info">
                                                {getStatusBadge(state?.status)}
                                            </div>
                                            {/* <div className="consult-fees">
                                                <h6>Consultation Fees : ${state?.amount}</h6>
                                            </div> */}
                                            {/* <ul>
                                                <li>
                                                    <Link to="#">
                                                        <i className="fa-solid fa-comments" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="#">
                                                        <i className="fa-solid fa-xmark" />
                                                    </Link>
                                                </li>
                                            </ul> */}
                                        </li>
                                    </ul>
                                    <ul className="detail-card-bottom-info">
                                        <li>
                                            <h6>Appointment Date &amp; Time</h6>
                                            <span>{state?.appointment_day} - {state?.appointment_time}</span>
                                        </li>
                                        <li>
                                            <h6>Clinic Location</h6>
                                            <span>{state?.hospital_address} {state?.hospital_country}</span>
                                        </li>
                                        <li>
                                            <h6>Location</h6>
                                            <span>{state?.patient_full_address}</span>
                                        </li>
                                        <li>
                                            <h6>Visit Type</h6>
                                            <span>General</span>
                                        </li>
                                        {/* <li>
                                            <div className="start-btn">
                                                <Link to="#" className="btn btn-secondary">
                                                    Inprogress
                                                </Link>
                                            </div>
                                        </li> */}
                                    </ul>
                                </div>
                                {/* /Appointment Detail Card */}
                                <div className="create-appointment-details">
                                    <div className="session-end-head">
                                        <h6>
                                            <span>Session Started at</span>{state?.apt_start_time}
                                        </h6>
                                    </div>
                                    <h5 className="head-text">Create Appointment Details</h5>
                                    <div className="create-details-card">
                                        <div className="create-details-card-head">
                                            <div className="card-title-text">
                                                <h5>Patient Information</h5>
                                            </div>
                                            <div className="patient-info-box">
                                                <div className="row">
                                                    <div className="col-xl-3 col-md-6">
                                                        <ul className="info-list">
                                                            <li>DOB / Gender</li>
                                                            <li>
                                                                <h6>{state?.patient_dob} / {state?.patient_gender}</h6>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-xl-3 col-md-6">
                                                        <ul className="info-list">
                                                            <li>Address</li>
                                                            <li>
                                                                <h6>{state?.patient_full_address}</h6>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-xl-3 col-md-6">
                                                        <ul className="info-list">
                                                            <li>Blood Group</li>
                                                            <li>
                                                                <h6>{state?.patient_blood_group}</h6>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-xl-3 col-md-6">
                                                        <ul className="info-list">
                                                            <li>No of Visit</li>
                                                            <li>
                                                                <h6>0</h6>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>




                                        <div className="create-details-card-body">
                                                <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Medical History <i className="fe fe-pencil" onClick={handleMedEditClick}></i></h5>
                                                    </div>
                                                    <Form
          form={form}
          onFinish={(values) =>handleMedFormSubmit(values)}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
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
          disabled={!isMedEditing}
          onChange={(checked) => handleSwitchChange("asthma", checked)}
        />
      </Form.Item>
            </Col>
            <Col span={12}>
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
          disabled={!isMedEditing}
          onChange={(checked) => handleSwitchChange("diabetes", checked)}
        />
      </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
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
                  disabled={!isMedEditing}
                  onChange={(checked) =>
                    handleSwitchChange("drug_allergy", checked)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  disabled={!isMedEditing}
                  onChange={(checked) =>
                    handleSwitchChange("pregnancy", checked)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
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
                  disabled={!isMedEditing}
                  onChange={(checked) => handleSwitchChange("bp", checked)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  disabled={!isMedEditing}
                  onChange={(checked) =>
                    handleSwitchChange("cardiac", checked)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Others:" name="others">
    <Input.TextArea rows={3} disabled={!isMedEditing} />
  </Form.Item>
  <Form.Item label="Chief Complaints:" name="cheif_complaints"> {/* Match the key */}
    <Input.TextArea rows={3} disabled={!isMedEditing} />
  </Form.Item>
          {isMedEditing && (
            <Form.Item>
              <div style={{ textAlign: "center" }}>
                <button type="submit" className="btn btn-primary mx-1">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleMedCancelClick}
                >
                  Cancel
                </button>
              </div>
            </Form.Item>
          )}
        </Form>
                                                </div>
                                              
                                        </div>

                                        <hr/>


                                        <div className="create-details-card-body">
                                            <form>
                                            {!shouldHideVitals(settings) && (
                                                <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Vitals</h5>
                                                    </div>
                                                    <div className="row">
                                                    {isVisible('temp') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">Temprature</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg : 97.8"
                                                                        value={formData.temp || ""}
                                                                        onChange={handleInputChange}
                                                                        name='temp'
                                                                    />
                                                                    <span className="input-group-text">F</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                          )}
                                                           {isVisible('pulse') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">Pulse</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder={454}
                                                                        value={formData.pulse}
                                                                        onChange={handleInputChange}
                                                                        name='pulse'
                                                                    />
                                                                    <span className="input-group-text">mmHg</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                           )}
                                                        {/* <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">
                                                                    Respiratory Rate
                                                                </label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg : 97.8"
                                                                        value={state.respiratory_rate || ""}
                                                                    />
                                                                    <span className="input-group-text">rpm</span>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                         {isVisible('spo2') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">SPO2</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg :  98"
                                                                        value={formData.spo2 || ""}
                                                                        onChange={handleInputChange}
                                                                        name='spo2'
                                                                    />
                                                                    <span className="input-group-text">%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                         )}
                                                          {isVisible('height') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">Height</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg : 97.8"
                                                                        value={formData.height || ""}
                                                                        onChange={handleInputChange}
                                                                        name='height'
                                                                    />
                                                                    <span className="input-group-text">cm</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                          )}
                                                           {isVisible('weight') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">Weight</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg : 97.8"
                                                                        value={formData.weight || ""}
                                                                        onChange={handleInputChange}
                                                                        name='weight'
                                                                    />
                                                                    <span className="input-group-text">Kg</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                           )}
                                                            {isVisible('bmi_value') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">BMI</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg : 454"
                                                                        value={formData.bmi_value || ""}
                                                                        onChange={handleInputChange}
                                                                        name='bmi_value'
                                                                    />
                                                                    <span className="input-group-text">kg/cm</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                            )}
                                                             {isVisible('bp') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">BP</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg : 97.8	"
                                                                        value={formData.bp || ""}
                                                                        onChange={handleInputChange}
                                                                        name='bp'
                                                                    />
                                                                    <span className="input-group-text">cm</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                             )}
                                                              {isVisible('before_sugar') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">BEFORE SUGAR</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg : 54"
                                                                        value={formData.before_sugar || ""}
                                                                        onChange={handleInputChange}
                                                                        name='before_sugar'
                                                                    />
                                                                    <span className="input-group-text">M</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                              )}
                                                               {isVisible('after_sugar') && (
                                                        <div className="col-xl-3 col-md-6">
                                                            <div className="input-block input-block-new">
                                                                <label className="form-label">AFTER SUGAR</label>
                                                                <div className="input-text-field">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Eg : 54"
                                                                        value={formData.after_sugar || ""}
                                                                        onChange={handleInputChange}
                                                                        name='after_sugar'
                                                                    />
                                                                    <span className="input-group-text">M</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                               )}
                                                    </div>
                                                </div>
                                                )}
                                                {/* <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Previous Medical History</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <textarea
                                                                    className="form-control"
                                                                    rows={3}
                                                                    defaultValue={""}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                 <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Referal Person</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                            <CreatableSelect
    inputId="referal_person"
    placeholder="Enter referal person"
    value={
        referalPersons.find((opt) => opt.value === referalPersonId) || null
      }
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
    isSearchable
    isClearable
    noOptionsMessage={() => 'Not found'}
    // formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
    // getOptionLabel={(option) => option.label}
  />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Clinical Notes</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <textarea
                                                                    className="form-control"
                                                                    rows={3}
                                                                    name='note'
                                                                    // defaultValue={state?.clinical_notes || ""} // Set the value from state.clinical_notes
                                                                    value={formData.note}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Clinical Notes</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">

                                                                <TagsInput
                                                                    // className="input-tags form-control"
                                                                    value={owner}
                                                                    onChange={setOwner}
                                                                    placeHolder="Type New" // This sets the placeholder value

                                                                />
                                                                <Link to="#" className="input-text save-btn">
                                                                    Save
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                {/* <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Laboratory Tests</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <TagsInput
                                                                    // className="input-tags form-control"
                                                                    value={labsArray}
                                                                    onChange={handleLabChange}
                                                                // placeHolder="Type New" // This sets the placeholder value
                                                                />
                                                                <Link to="#" className="input-text save-btn">
                                                                    Save
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Complaints</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">

                                                                <TagsInput
                                                                    // className="input-tags form-control"
                                                                    value={complaintsArray}
                                                                    onChange={handleLabChange1}
                                                                    placeHolder="Type New" // This sets the placeholder value
                                                                />
                                                                <Link to="#" className="input-text save-btn">
                                                                    Save
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Diagonosis</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <div className="input-field-set">
                                                                    <label className="form-label">Fever</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Diagnosis"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <div className="input-field-set">
                                                                    <label className="form-label">Headache</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Diagnosis"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <div className="input-field-set">
                                                                    <label className="form-label">Stomach Pain</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Diagnosis"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                  <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Service Types</h5>
                                                    </div>
                                                    <div className="row meditation-row">
                                                        <div className="col-md-12">
                                                            {services.map((service, index) => (
                                                                <div className="d-flex flex-wrap medication-wrap align-items-center" key={index}>
                                                                    {/* <div className="input-block input-block-new">
                                                                        <label className="form-label">Name</label>
                                                                        <input type="text" className="form-control" />
                                                                    </div> */}
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Name</label>
                                                                       
                                                                        <Select
                                                                        // className="select form-control"
                                                                        placeholder="Select"
                                                                        options={serviceTypes}
                                                                        onChange={(selectedOption) => handleServiceChange(service.id, selectedOption)}

                                                                      />
                                                                    </div>
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Price</label>
                                                                        <input type="number" className="form-control" value={service.price} readOnly/>
                                                                    </div>
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Qunatity</label>
                                                                        <div className="d-flex align-items-center">
              {service.service_type === 1 && (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleQtyChange(index, -1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control mx-2"
                    value={service.qty}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleQtyChange(index, 1)}
                  >
                    +
                  </button>
                </>
              )}
              {service.service_type === 0 && (
                <input type="number" className="form-control" value={service.qty} readOnly />
              )}
            </div>
                                                                    </div>
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Final Price</label>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            value={service.final_price}
                                                                            onChange={(e) => {
                                                                                const value = parseFloat(e.target.value) || 0;
                                                                                if (value >= 0) { // Restrict negative values
                                                                                  setServices((prevServices) =>
                                                                                    prevServices.map((s, i) =>
                                                                                      i === index
                                                                                        ? { ...s, final_price: value }
                                                                                        : s
                                                                                    )
                                                                                  );
                                                                                }
                                                                              }}
                                                                        />
                                                                        {/* <Select
                                                                        // className="select form-control"
                                                                        placeholder="Select"
                                                                        options={duration}
                                                                      /> */}
                                                                    </div>
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Instruction</label>
                                                                        <input type="text" className="form-control"   value={service.remarks}
              onChange={(e) =>
                setServices((prevServices) =>
                  prevServices.map((s, i) => (i === index ? { ...s, remarks: e.target.value } : s))
                )
              } />
                                                                    </div>

                                                                    {/* lab details */}

                                                                     <div className="input-block input-block-new">
    <label className="form-label">Lab : {service.is_lab == 1 ? service.lab_service_name : "No"}</label>
    {service.is_lab == 1 && labDropdowns[service.id] && (
    <Select
      // placeholder={labDropdowns[row.id][0]?.lab_name || "Select Lab Test"} // Use first item name
      // options={labDropdowns[row.id].map((item) => ({ value: item.id, label: item.lab_name }))}
      placeholder={ labDropdowns[service.id][0]?.lab_name || "Select Lab"} 
          // options={ selectedAppointment?.status == 3
          //   ? labDropdowns[row.lab_id]?.map(item => ({ value: item.id, label: item.lab_name })) ?? [] : labDropdowns[row.id].map((item) => ({ value: item.id, label: item.lab_name })) ?? []}
          options={labDropdowns[service.id].map((item) => ({ value: item.id, label: item.lab_name })) ?? []}
      onChange={(selectedOption) => {
        setServices((prevServices) =>
          prevServices.map((s) =>
            s.id === service.id ? { ...s, lab_id: selectedOption.value } : s
          )
        );
      }}
    />
  )}
  </div>
                                                                    <div className="delete-row">
                                                                        <Link
                                                                            to="#"
                                                                            className="delete-btn delete-medication trash text-danger"
                                                                            onClick={() => removeServices(index)}
                                                                        >
                                                                            <i className="fa-solid fa-trash-can" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="add-new-med text-end mb-4">
                                                                <Link to="#" className="add-medical more-item mb-0" onClick={addServices}>
                                                                    Add New
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Medications</h5>
                                                    </div>
                                                    <div className="row meditation-row">
                                                        <div className="col-md-12">
                                                            {medications.map((medication, index) => (
                                                                <div className="d-flex flex-wrap medication-wrap align-items-center" key={index}>
                                                                    {/* <div className="input-block input-block-new">
                                                                        <label className="form-label">Name</label>
                                                                        <input type="text" className="form-control" />
                                                                    </div> */}
                                                                     <div className="input-block input-block-new">
                                                                        <label className="form-label">Name</label>
                                                                       
                                                                        <Select
                                                                        // className="select form-control"
                                                                        placeholder="Select"
                                                                        options={meditions}
                                                                        onChange={(selectedOption) => handleMedicationSelect(index, selectedOption)}
                                                                      />
                                                                    </div>
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Duration</label>
                                                                        {/* <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="1-0-0-0"
                                                                            value={`${medication.is_morning}-${medication.is_noon}-${medication.is_evening}-${medication.is_night}`} // Correct interpolation
                                                                            onChange={(e) => handleInputDurationChange(index, e)} // Pass both index and event
                                                                            onKeyDown={handleKeyPress}
                                                                        /> */}
                                                                         <input
  type="text"
  className="form-control"
  placeholder="0000"
//   value={`${medication.is_morning}${medication.is_noon}${medication.is_evening}${medication.is_night}`} // Concatenated value
  onChange={(e) => handleInputDurationChange(index, e)} // Handles updates
  onKeyDown={handleKeyPress} // Handles validation
  maxLength={4} // Enforce only 4 characters
/>

                                                                    </div>
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Duration(in days)</label>
                                                                      <input
  type="number"
  className={`form-control ${medication.cycle === "" ? "is-invalid" : ""}`}
  required
  min="1"
  value={medication.cycle === null ? "" : medication.cycle}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
      handleMedicationChange(index, "cycle", value === "" ? "" : Number(value));
    }
  }}
/>
{medication.cycle === "" && (
  <div className="invalid-feedback">Please enter duration in days.</div>
)}




                                                                       
                                                                    </div>
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Instruction</label>
                                                                        <input type="text" className="form-control" value={medication.remarks}
                                    onChange={(e) => handleMedicationChange(index, 'remarks', e.target.value)}/>
                                                                    </div>
                                                                    
                                                                    <div className="input-block input-block-new">
                                                                        <label className="form-label">Before / After Food</label>
                                                                        <Select
                                                                        // className="select form-control"
                                                                        placeholder="Select"
                                                                        options={beforeAfter}
                                                                        onChange={(selectedOption) => handleMedicationChange(index, 'is_before_food', selectedOption.value)}
                                                                      />
                                                                    </div>
                                                                    <div className="delete-row">
                                                                        <Link
                                                                            to="#"
                                                                            className="delete-btn delete-medication trash text-danger"
                                                                            onClick={() => removeMedication(index)}
                                                                        >
                                                                            <i className="fa-solid fa-trash-can" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="add-new-med text-end mb-4">
                                                                <Link to="#" className="add-medical more-item mb-0" onClick={addMedication}>
                                                                    Add New
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Advice</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <textarea
                                                                    name="advice"
                                                                    className="form-control"
                                                                    rows={3}
                                                                    // defaultValue={state?.advice || ""}
                                                                    value={formData.advice}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Previous History</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <textarea
                                                                    name="previous_history"
                                                                    className="form-control"
                                                                    rows={3}
                                                                    // defaultValue={state?.follow_up || ""}
                                                                    value={formData.previous_history}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="start-appointment-set">
                                                    <div className="form-bg-title">
                                                        <h5>Follow Up</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="input-block input-block-new">
                                                                <textarea
                                                                    name="follow_up"
                                                                    className="form-control"
                                                                    rows={3}
                                                                    // defaultValue={state?.follow_up || ""}
                                                                    value={formData.follow_up}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-set-button">
                                                        <button className="btn btn-light" type="button">
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="btn btn-primary"
                                                            type="button"
                                                            // data-bs-toggle="modal"
                                                            // data-bs-target="#end_session"
                                                            onClick={endAppointmentSession}
                                                        >
                                                            Save &amp; End Appointment
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Page Content */}
           
            <DoctorFooter />
        </div>
        <div className="modal fade info-modal" id="end_session"  tabIndex="-1"    aria-hidden="true"    ref={endSessionModalRef}>
        <div className="modal-dialog modal-dialog-centered">
          
            <div className="modal-content">
                <div className="modal-body">
                    <div className="success-wrap">
                        <div className="success-info">
                            <div className="text-center">
                                <span className="icon-success bg-blue">
                                    <i className="fa-solid fa-calendar-check" />
                                </span>
                                <h3>Session Ended</h3>
                                <p>Your Appointment has been Ended</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-btn text-center">
                        {/* <Link
                            to="#"
                            className="btn btn-gray me-1"
                            data-bs-dismiss="modal"
                        >
                            Go to Appointments
                        </Link> */}
                        <Link
                            to="/doctor/appointments"
                            className="btn btn-primary prime-btn"
                            data-bs-dismiss="modal"
                        >
                            Go to Appointments
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </div>

    )
}

export default DoctorAppoinmentStart
