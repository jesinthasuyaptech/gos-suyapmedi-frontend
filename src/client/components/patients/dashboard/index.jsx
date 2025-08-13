/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { DashboardSidebar } from "./sidebar/sidebar.jsx";
// import { Tab, Tabs } from "react-bootstrap";
import StickyBox from "react-sticky-box";
import {
  IMG01,
  IMG02,
  IMG03,
  IMG04,
  IMG05,
  IMG06,
  IMG07,
  IMG08,
  IMG09,
  IMG10,
} from "./img";
import Dashboard1 from "../../../assets/images/specialities/pt-dashboard-01.png";
import Dashboard2 from "../../../assets/images/specialities/pt-dashboard-02.png";
import Dashboard3 from "../../../assets/images/specialities/pt-dashboard-03.png";
import Dashboard4 from "../../../assets/images/specialities/pt-dashboard-04.png";
import Graph1 from "../../../assets/images/shapes/graph-01.png";
import Graph2 from "../../../assets/images/shapes/graph-02.png";
import Graph3 from "../../../assets/images/shapes/graph-03.png";
import Graph4 from "../../../assets/images/shapes/graph-04.png";

import Footer from "../../footer";
import Header from "../../header.jsx";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import { doctor_14, doctor_15, doctor_17, doctor_thumb_01, doctor_thumb_03, doctor_thumb_05, doctor_thumb_07, doctor_thumb_08, doctor_thumb_09, doctor_thumb_13, doctor_thumb_21, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctorprofileimg, doctorthumb02, doctorthumb11, patient20, patient21, logo} from "../../imagepath.jsx";
import Chart from 'react-apexcharts';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { CircularProgressbar , buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { notification, Dropdown, Menu, Button } from 'antd';
import { var_api, image_api } from '../../../../constant.js';
import "../../style/Loader.css";
import doc_dummy from "../../../assets/img/doctors/doc_dummy.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { pat_dummy } from '../../imagepath.jsx';



const Dashboard = (props) => {
  const TextContent = () => <p>Last Visit 25 Mar 2024</p>;

  const [count, setCount] = useState(1, 2, 3, 4);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [latestVital, setLatestVital] = useState(null);
  const [doctorfavs, setDoctorfavs] = useState([]);
  const [upcomingApts, setUpcomingApts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bpData, setBpData] = useState([]);
  const [pulseData, setPulseData] = useState([]);
  const [pulseOptions, setPulseOptions] = useState(null);
  const [bpOptions, setBpOptions] = useState(null);
  const [pastApt, setPastApt] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredpresData, setfilteredpresData] = useState([]);
  const [patientNotifications, setPatientNotifications] = useState([]);
  const [Datarecord,setDatarecord] = useState([]);
  const [datainvoice,setDatainovoice] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null); 
  const appointmentPrefix = localStorage.getItem("appointment_prefix");
  const prescription_prefix = localStorage.getItem("prescription_prefix");
  const patient_mobile_no =  localStorage.getItem("patient_mobile_no");
  const patient_name = localStorage.getItem("patient_name");
  const patient_email = localStorage.getItem("patient_email");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const dependantId = localStorage.getItem('dependant_id');
  const [selectedpatientdetails, setPatientdetails] = useState(null); 
  const is_private = localStorage.getItem('is_private');
   const [dependantList, setDependantList] = useState([]);
   const [selectedUser, setSelectedUser] = useState({
    id: localStorage.getItem("patient_id"),
    name: localStorage.getItem("patient_name") || "Main User",
    profile_image: localStorage.getItem("patient_profile") 
  });
  const patientEmail = localStorage.getItem("patient_email");
  console.log("patient_email", patientEmail);
 
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     key: 1,
  //   };
  //   this.handleSelect = this.handleSelect.bind(this);
  // }
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);

  // console.log("harini",localStorage.getItem("appointment_prefix"));
  
  // console.log("Retrieved from localStoragedash:", localStorage.getItem("Patient_HospitalId"));

  //latest vital details
  const fetchVitalData = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId') ;
    const patient_id = localStorage.getItem('patient_id');

    try {
      const response = await fetch(`${var_api}vitaldetails/get-latest/${hospital_id}/${patient_id}`, {
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
            return;
            }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setLatestVital(result || null);
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




  const fetchpatientdetails = async () => {
    const token = localStorage.getItem("patient_token");
    const patient_id = localStorage.getItem("patient_id");
    // if (!token || !patient_id || !hospital_id) {
    //   console.warn("Missing authentication details.");
    //   return;
    // }
    try {
      const response = await axios.get(
        `${var_api}patientdetails/get/${patient_id}`,
        {
          headers: {
            Authorization: `${token}`, // Ensure proper format
          },
          
        }
      );
      setPatientdetails(response.data);

    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching doctor details:", err);
      }
    }
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  
  const handleDownloadPDF = () => {
    const input = document.getElementById("prescription-content");
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      // Calculate best height to fit everything on one page
      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width; 
  
      // If height exceeds A4 page, scale down
      if (imgHeight > 297) {
        pdf.addImage(imgData, "PNG", 0, 10, imgWidth, 280); // Adjust height
      } else {
        pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      }
  
      pdf.save(`${prescription_prefix}-${selectedPrescription.prescription_token}_${selectedPrescription.appointment_day}.pdf`);
    });
  };

      const openInvoiceModal = (invoice) => {
        setSelectedInvoice(invoice); // Set the selected invoice data
       
      };
      
      const handleDownloadPDFinv = () => {
        const input = document.getElementById("invoice_view_data");
      
        html2canvas(input, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
      
          // Calculate best height to fit everything on one page
          const imgWidth = 210; // A4 width
          const imgHeight = (canvas.height * imgWidth) / canvas.width; 
      
          // If height exceeds A4 page, scale down
          if (imgHeight > 297) {
            pdf.addImage(imgData, "PNG", 0, 10, imgWidth, 280); // Adjust height
          } else {
            pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
          }
      
          pdf.save(`INV-${selectedInvoice.invoice_token}_${formatDate(selectedInvoice.created_at)}.pdf`);      });
      };


   const fetchappointData = async () => {
      setLoading(true);
      const token = localStorage.getItem('patient_token');
      const hospital_id = localStorage.getItem('Patient_HospitalId');
      const patient_id = localStorage.getItem('patient_id');
      try {
        const response = await fetch(`${var_api}appointment/patients-appointments-latestfive/${hospital_id}/${patient_id}`, {

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
        return;
        }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setFilteredData(result || []); // Set initial filtered data
        setLoading(false);
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


    const fetchpresData = async () => {
      setLoading(true);
      const token = localStorage.getItem('patient_token');
      const hospital_id = localStorage.getItem('Patient_HospitalId');
      const patient_id = localStorage.getItem('patient_id');
      try {
        const response = await fetch(`${var_api}prescription/patients-prescriptions-latestfive/1/${hospital_id}`, {
    
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
        return;
        }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setfilteredpresData(result || []); // Set initial filtered data
        setLoading(false);
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

  //get patients' fav doctor
  const fetchFavouritesDoctor = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');

    try {
      const response = await fetch(`${var_api}doctofavourite/doctor-favourites/get-patients/${hospital_id}/${patient_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, 
        },
      });
      if (response.status === 401) {
        history.push("/patient/patientlogin");
              notification.warning({
                message: "Unauthorized",
                description: "Your session has expired. Please log in again.",
              });
            return;
            }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setDoctorfavs(result.data || []);
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

  const formatDateToDDMon = (dateStr) => {
    const [year, month, day] = dateStr.split("-"); // Fix extraction order
    const monthIndex = parseInt(month, 10) - 1; // Convert "03" to 2 (March)
  
    // ✅ Correct Date creation
    const dateObj = new Date(parseInt(year, 10), monthIndex, parseInt(day, 10));
  
    // ✅ Ensure the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date:", dateStr);
      return "Invalid Date"; // Handle error case
    }
  
    // Convert to "18 Mar"
    return `${parseInt(day, 10)} ${dateObj.toLocaleString("en-US", { month: "short" })}`;
  };
  
  


  //get upcoming appointments
  const fetchupcomingAppointments = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');

    try {
      const response = await fetch(`${var_api}appointment/upcoming-appointment-list/${hospital_id}/${patient_id}`, {
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
            return;
            }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setUpcomingApts(result || []);
      // Set the selected date to today's date initially
      setSelectedDate(formatDateToDDMon(getTodayDate()));
      console.log("da", formatDateToDDMon(getTodayDate()), getTodayDate())
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
  
   // Function to get today's date in 'DD-MM-YYYY' format
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-GB").split("/").reverse().join("-");
  };

  const generateMonthDates = () => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const dates = [];
  
    for (let d = today; d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
      const month = d.toLocaleString("en-US", { month: "short" }); // Get first 3 letters of month
      dates.push(`${day} ${month}`); // Format as "15 Jul"
    }
  
    return dates;
  };


  // Get all dates from today to the month's end
const uniqueDates = generateMonthDates();
// console.log(upcomingApts);



  // Filter appointments based on selected date
  const filteredAppointments = upcomingApts.filter((item) => {
    // Extract day, month, and year from "DD-MM-YYYY"
    const [day, month, year] = item.appointment_day.split("-");
    
    // Convert month number (03) to short month name (Mar)
    const monthName = new Date(`${year}-${month}-01`).toLocaleString("en-US", { month: "short" });
  
    // Format as "18 Mar"
    const appointmentFormatted = `${day} ${monthName}`;
  
    // console.log(`Comparing: ${appointmentFormatted} with ${selectedDate}`);
    
    return appointmentFormatted === selectedDate;
  });



   //latest BP details
   const fetchBPData = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');

    try {
      const response = await fetch(`${var_api}vitaldetails/get-latest-bp/${hospital_id}/${patient_id}`, {
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
            return;
            }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setBpData(result || null);
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

//past apppointments data
  const fetchPastAppointmentData = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');

    try {
      const response = await fetch(`${var_api}appointment/past-patients-appointment/${hospital_id}/${patient_id}`, {
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
            return;
            }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setPastApt(result[0] || null);
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

  //past apppointments data
  const fetchNotification = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token');
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');

    try {
      const response = await fetch(`${var_api}patientnotification/get-by-patient/${patient_id}/${hospital_id}`, {
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
            return;
            }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setPatientNotifications(result || []);
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


   //latest Pulse details
   const fetchPulseData = async () => {
    setLoading(true);
    const token = localStorage.getItem('patient_token') ;
    const hospital_id = localStorage.getItem('Patient_HospitalId');
    const patient_id = localStorage.getItem('patient_id');

    try {
      const response = await fetch(`${var_api}vitaldetails/get-latest-pulse/${hospital_id}/${patient_id}`, {
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
            return;
            }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setPulseData(result || null);
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

      const fetchDatamedi = async () => {
          console.log("🔄 Fetching updated data...");
          const token = localStorage.getItem('patient_token');
          const hospital_id = localStorage.getItem('Patient_HospitalId');
          const patient_id = localStorage.getItem("patient_id");
          
          setLoading(true);
          try {
              const response = await fetch(`${var_api}medicalrecords/get-latestfive-patient-hospital-dashboard/${hospital_id}/${patient_id}`, {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: token,
                  },
              });
      
              console.log("📡 Fetch Response Status:", response.status);
              if (response.status === 401) {
                  history.push("/patient/patientlogin");
                  notification.warning({
                      message: "Unauthorized",
                      description: "Your session has expired. Please log in again.",
                  });
                  return;
              }
      
              if (!response.ok) throw new Error("Failed to fetch data");
      
              const result = await response.json();
              console.log("📥 Fetched Data:", result); // Debugging log
              setDatarecord(result);
          } catch (error) {
              console.error("❌ Error fetching data:", error);
          } finally {
              setLoading(false);
          }
      };
  
      const fetchDatainvoice = async () => {
        console.log("🔄 Fetching updated data...");
        const token = localStorage.getItem('patient_token');
        const hospital_id = localStorage.getItem('Patient_HospitalId');
        const patient_id = localStorage.getItem("patient_id");
        
        setLoading(true);
        try {
            const response = await fetch(`${var_api}invoicebilling/get-patient-invoices-latestfive/${hospital_id}/1`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
    
            console.log("📡 Fetch Response Status:", response.status);
            if (response.status === 401) {
              history.push("/patient/patientlogin");
                notification.warning({
                    message: "Unauthorized",
                    description: "Your session has expired. Please log in again.",
                });
                return;
            }
    
            if (!response.ok) throw new Error("Failed to fetch data");
    
            const result = await response.json();
            console.log("📥 Fetched Data:", result); // Debugging log
            setDatainovoice(result);
        } catch (error) {
            console.error("❌ Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

  


 // Transform data for charts
 const bpValues = bpData.map((item) => item.bp);
 const pulseValues = pulseData.map((item) => Number(item.pulse));
 const categories = bpData.map((item) =>
   new Date(item.created_at).toLocaleDateString("en-US", {
     month: "short",
     day: "numeric",
   })
 );

 useEffect(() => {
   if (chartRef.current) {
     const options = {
       series: [{ name: "Pulse", data: pulseValues }],
       chart: {
         height: 300,
         type: "bar",
       },
       fill: {
         colors: ["#E8F1FF"],
       },
       plotOptions: {
         bar: {
           columnWidth: "45%",
         },
       },
       dataLabels: {
         enabled: false,
       },
       legend: {
         show: false,
       },
       xaxis: {
         categories,
       },
       crosshairs: {
         show: false,
       },
     };

      // Store chart instance in the ref
      chartInstance.current = new ApexCharts(chartRef.current, options);
      chartInstance.current.render();
  
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
          chartInstance.current = null;
        }
      };
    }
  }, [pulseValues]);
  

 const [options1, setOptions1] = useState(null);

 useEffect(() => {
   const options = {
     series: [{ name: "BP", data: bpValues }],
     chart: {
       type: "bar",
       height: 350,
     },
     plotOptions: {
       bar: {
         horizontal: false,
         columnWidth: "55%",
         endingShape: "rounded",
       },
     },
     dataLabels: {
       enabled: false,
     },
     legend: {
       show: false,
     },
     stroke: {
       show: true,
       width: 2,
       colors: ["transparent"],
     },
     xaxis: {
       categories,
     },
     fill: {
       opacity: 1,
       colors: ["#F1F5F9"],
     },
   };

   setOptions1(options);
 }, [bpValues]);


 useEffect(() => {
  if (!pulseData || pulseData.length === 0) return; // Ensure data exists

  const formattedData = pulseData.map((item) => ({
    pulse: parseInt(item.pulse, 10), 
    date: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }));

  const pulseDatas = {
    series: [{ name: "Pulse", data: formattedData.map((item) => item.pulse) }],
    chart: { height: 300, type: "bar" },
    plotOptions: { bar: { columnWidth: "45%" } },
    fill: { colors: ["#E8F1FF"] },
    xaxis: { categories: formattedData.map((item) => item.date) },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { show: true, width: 2, colors: ["transparent"] }
  };

  setPulseOptions(pulseDatas);
}, [pulseData]); // Dependency array updated

  const specialitysettings = {
    items: 5,
    loop: false,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: ".slide-nav-patient",
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],

    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 1,
      },
      575: {
        items: 2,
      },
      768: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1300: {
        items: 5,
      },
    },
  };

  const specialitysettings1 = {
    items: 1,
    loop: true,
    margin: 25,
    dots: false,
    nav: true,
    navContainer: ".slide-nav-1",
    navText: [
      '<i class="fas fa-chevron-left custom-arrow"></i>',
      '<i class="fas fa-chevron-right custom-arrow"></i>',
    ],

    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 1,
      },
      575: {
        items: 1,
      },
      768: {
        items: 1,
      },
      1000: {
        items: 1,
      },
      1300: {
        items: 1,
      },
    },
  };


  const [animate, setAnimate] = useState(false);
  const circleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (circleRef.current) {
        const elementPos = circleRef.current.getBoundingClientRect().top;
        const topOfWindow = window.scrollY;
        const percent = parseFloat(circleRef.current.getAttribute('data-percent'));
        const animate = circleRef.current.dataset.animate === 'true';

        if (elementPos < topOfWindow + window.innerHeight - 30 && !animate) {
          circleRef.current.dataset.animate = 'true';
          setAnimate(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on initial load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect (()=>{
    const fetchAllData = async () => {
    await fetchVitalData();
    await fetchFavouritesDoctor();
    await fetchupcomingAppointments();
    await fetchBPData();
    await fetchPulseData();
    await fetchPastAppointmentData();
    await fetchNotification();
    await fetchDependantListData();
    fetchappointData();
    fetchpresData();
    fetchDatamedi();
    fetchDatainvoice();
    fetchpatientdetails();
  };

  fetchAllData(); // Call the async function inside useEffect
  }, [])

  function getStatusBadge(status) {
    switch (status) {
      case 0:
      case 1:
        return <span className="badge bg-warning text-white">Upcoming</span>; // Yellow with white text
      case 2:
        return <span className="badge bg-primary text-white">In Progress</span>; // Blue
      case 3:
        return <span className="badge bg-success text-white">Completed</span>; // Green
      case 4:
      case 5:
        return <span className="badge bg-danger text-white">Cancelled</span>; // Red
      case 6:
        return <span className="badge bg-purple text-white">Revisit</span>; // Purple (Custom)
      default:
        return <span className="badge bg-secondary text-white">Unknown</span>; // Gray
    }
  }
  
  const handleGoToDoctorList = () => {
    history.push('/patient/doctor-list');
  } 


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
      // Get main user details from localStorage
      const mainUser = {
        id: localStorage.getItem("dependant_id") || "main_user_id",
        name: localStorage.getItem("dependant_name") || "Main User",
        profile_image: localStorage.getItem("dependant_profile"),
        email_id: localStorage.getItem("dependant_email"),
        mobile_no: localStorage.getItem("dependant_mobile_no"),
        is_private: localStorage.getItem("dependant_is_private"),
        running_no: localStorage.getItem("dependant_token_no")
      };
      const finalList = [mainUser, ...(result || [])];
      setDependantList(finalList || []);

     
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


  const handleDependantSelect = (dependant) => {
    setSelectedUser({
      name: dependant.name,
      profile_image: dependant.profile_image 
    });
  
    localStorage.setItem("patient_id", dependant.id);
    localStorage.setItem("patientname", dependant.name); // spelling corrected here
    localStorage.setItem("patient_email", dependant.email_id);
    localStorage.setItem("patient_mobile_no", dependant.mobile_no);
    localStorage.setItem("is_private", dependant.is_private);
    localStorage.setItem("patient_token_no", dependant.running_no);
    localStorage.setItem("patient_profile", dependant.profile_image);
    localStorage.setItem("patient_gender", dependant.gender);
    localStorage.setItem("patient_age", dependant.age);
  
    // Dispatch a custom event
    window.dispatchEvent(new Event("patientDataUpdated"));
  
    // Fetch other data
    fetchVitalData();
    fetchFavouritesDoctor();
    fetchupcomingAppointments();
    fetchpatientdetails();
    fetchDatainvoice();
    fetchPulseData();
    fetchBPData();
    fetchNotification();
    fetchDatamedi();
    fetchappointData();
    fetchpresData();
    fetchPastAppointmentData();
    fetchDependantListData();
    fetchpatientdetails();
  };
  



  const menu = (
    <Menu>
      {/* Add Current User as the First Dropdown Option */}
      <Menu.Item key="current-user" onClick={() => handleDependantSelect(selectedUser)}>
        <img
          src={`${image_api}${selectedUser.profile_image}`}
          style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
          alt="Current User"
          onError={(e) => (e.target.src = pat_dummy)}
        />
        {selectedUser.name} <span style={{ fontSize: 12, color: "#999" }}> (You)</span>
      </Menu.Item>
  
      <Menu.Divider />
  
      {/* Map through dependant list */}
      {dependantList.map((dependant, index) => (
        <Menu.Item key={index} onClick={() => handleDependantSelect(dependant)}>
          <img
            src={`${image_api}${dependant.profile_image}`}
            style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
            alt="Dependant"
            onError={(e) => (e.target.src = pat_dummy)}
          />
          {dependant.name}
        </Menu.Item>
      ))}
    </Menu>
  );
  
  

  return (
    <>
      <Header {...props} />
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
              <h2 className="breadcrumb-title">Patient Dashboard</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Patient Dashboard
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
            {/* Profile Sidebar */}
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              <div className="stickybar">
                {/* Profile Sidebar */}
                <DashboardSidebar />
                {/* /Profile Sidebar */}
              </div>
            </div>
            {/* / Profile Sidebar */}
            <div className="col-lg-8 col-xl-9">
            <div className="dashboard-header" style={{ display: "flex", alignItems: "center" }}>
            <h3 style={{ marginBottom: "20px" }}>Dashboard</h3>
<div style={{ marginBottom: "20px" }}>
  <Dropdown overlay={menu} placement="bottomRight">
    <Button className="d-flex align-items-center">
      <img
        src={`${image_api}${selectedUser.profile_image}`}
        alt="User"
        style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
        onError={(e) => (e.target.src = pat_dummy)}
      />
      {selectedUser.name}
    </Button>
  </Dropdown>
</div>



      {
        is_private == 0 && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "25px", fontWeight: "bold", color: "darkblue" }}>
            {localStorage.getItem("patient_Hospital_Name")}
          </span>
          <button 
            onClick={() => history.push("/admin/hospitallist")} 
            style={{
              padding: "5px 10px",
              fontSize: "14px",
              fontWeight: "bold",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Change
          </button>
        </div>
        )

      }
     
    </div>
              <div className="row">
                <div className="col-xl-8 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Health Records</h5>
                      </div>
                      {/* <div className="dropdown header-dropdown">
                        <Link
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <img
                            src={doctordashboardprofile06}
                            className="avatar dropdown-avatar"
                            alt="Img"
                          />
                          Hendrita
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            <img
                              src={doctordashboardprofile06}
                              className="avatar dropdown-avatar"
                              alt="Img"
                            />
                            Hendrita
                          </Link>
                          <Link to="#" className="dropdown-item">
                            <img
                              src={doctordashboardprofile08}
                              className="avatar dropdown-avatar"
                              alt="Img"
                            />
                            Laura
                          </Link>
                          <Link to="#" className="dropdown-item">
                            <img
                              src={doctordashboardprofile07}
                              className="avatar dropdown-avatar"
                              alt="Img"
                            />
                            Mathew
                          </Link>
                        </div>
                      </div> */}
                    </div>
                    <div className="dashboard-card-body">
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="health-records icon-orange">
                                <span>
                                  <i className="fa-solid fa-heart" />
                                  Heart Rate
                                </span>
                                <h3>
  {latestVital?.pulse && latestVital.pulse !== "" ? `${latestVital.pulse} Bpm` : "Nil"} 
                                  {/* <sup> 2%</sup> */}
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-amber">
                                <span>
                                  <i className="fa-solid fa-temperature-high" />
                                  Body Temprature
                                </span>
                                <h3>{latestVital?.temp && latestVital.temp !== "" ? `${latestVital.temp} C` : "Nil"} </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-dark-blue">
                                <span>
                                  <i className="fa-solid fa-notes-medical" />
                                  Sugar Level (before-after food)
                                </span>
                                <h3>
                                  {latestVital?.before_sugar && latestVital.before_sugar !== "" ? latestVital.before_sugar : "Nil"} -   {latestVital?.after_sugar && latestVital.after_sugar !== "" ? latestVital.after_sugar : "Nil"}
                                  {/* <sup> 6%</sup> */}
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-blue">
                                <span>
                                  <i className="fa-solid fa-highlighter" />
                                  SPo2
                                </span>
                                <h3>{latestVital?.spo2 && latestVital.spo2 !== "" ? `${latestVital.spo2} %` : "Nil"}</h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-red">
                                <span>
                                  <i className="fa-solid fa-syringe" />
                                  Blood Pressure
                                </span>
                                <h3>
                                  {latestVital?.bp && latestVital.bp !== "" ? `${latestVital.bp} mg/dl`: "Nil"} 
                                  {/* <sup> 2%</sup> */}
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-purple">
                                <span>
                                  <i className="fa-solid fa-user-pen" />
                                  BMI{" "}
                                </span>
                                <h3>{latestVital?.bmi_value && latestVital.bmi_value !== "" ? `${latestVital.bmi_value} kg/m2` : "Nil"} </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-blue">
                                <span>
                                  <i className="fa-solid fa-ruler-vertical"  />
                                  height
                                </span>
                                <h3>
                                {latestVital?.height != null ? `${latestVital.height} cm` : "Nil"}
                                  {/* <sup> 2%</sup> */}
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="health-records icon-red">
                                <span>
                                  <i className="fa-solid fa-weight-scale" />
                                  Weight{" "}
                                </span>
                                <h3> {latestVital?.weight != null ? `${latestVital.weight} kg` : "Nil"}</h3>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="report-gen-date">
                                <p>
                                  Report generated on last visit : {latestVital?.updated_at
  ? new Date(latestVital.updated_at).toLocaleDateString("en-US", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    })
  : "Nil"}
{" "}
                                  {/* <span>
                                    <i className="fa-solid fa-copy" />
                                  </span> */}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-sm-5">
                          <div className="chart-over-all-report">
                            <h5>Overall Report</h5>
                            <div className="circle-bar circle-bar3 report-chart">
                            <div className="circle-bar3" ref={circleRef} data-animate="false" data-percent="50">
                            {animate && (
                              <CircularProgressbar
                                value={parseFloat(circleRef.current.getAttribute('data-percent'))}
                                text="Last Visit 25 Mar 2024"
                                strokeWidth={7}
                                styles={buildStyles({
                                  textColor: '#000000', // Black color
                                  pathColor: '#65A30D',
                                  textSize: '7px', // Adjust font size here
                                })}
                                className="health-percentage" // Add the class name here
                              />
                            )}
                          </div>
                            </div>
                            <span className="health-percentage">
                              Your health is 95% Normal
                            </span>
                            <Link
                              to="/patient/medicaldetails"
                              className="btn btn-dark w-100"
                            >
                              View Details
                              <i className="fa-solid fa-chevron-right ms-2" />
                            </Link>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 d-flex">
                  <div className="favourites-dashboard w-100">
                    <div className="book-appointment-head" onClick={handleGoToDoctorList}>
                      <h3>
                        <span>Book a new</span>Appointment
                      </h3>
                      <span className="add-icon">
                        <Link to="/patient/doctor-list">
                          <i className="fa-solid fa-circle-plus" />
                        </Link>
                      </span>
                    </div>
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Favourites</h5>
                        </div>
                        <div className="card-view-link">
                          <a href="/patient/favourites">View All</a>
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                      {doctorfavs.length > 0 ? (
                      doctorfavs.map((doctor) => (
                        <div className="doctor-fav-list">
                          <div className="doctor-info-profile" key={doctor.favourites_id}>
                            <Link to="#" className="table-avatar">
                              <img
                               src={ typeof doctor?.profile_image === 'string' && 
                                doctor?.profile_image.trim() !== '' && 
                                /\.(jpeg|jpg|png|webp)$/i.test(doctor?.profile_image) 
                                  ? `${image_api}${doctor?.profile_image}` : doc_dummy}
                              
                                alt="Doctor"
                                onError={(e) => e.target.src = doc_dummy} 
                              />
                            </Link>
                            <div className="doctor-name-info">
                              <h5>
                                <Link to="#">Dr. {doctor.name}</Link>
                              </h5>
                              <span>{doctor.specialization || "General"}</span>
                            </div>
                            </div>
                          {/* <Link to="#" className="cal-plus-icon">
                            <i className="fa-solid fa-calendar-plus" />
                          </Link>
                        */}
                        </div>
                        
                      ))
                    ) : (
                      <div className="text-center p-3">No data available</div>
                    )}
                        
                        {/* <div className="doctor-fav-list">
                          <div className="doctor-info-profile">
                            <Link to="#" className="table-avatar">
                              <img
                                src={doctorthumb11}
                                alt="Img"
                              />
                            </Link>
                            <div className="doctor-name-info">
                              <h5>
                                <Link to="#">Dr. Maloney</Link>
                              </h5>
                              <span>Cardiologist</span>
                            </div>
                          </div>
                          <Link to="#" className="cal-plus-icon">
                            <i className="fa-solid fa-calendar-plus" />
                          </Link>
                        </div>
                        <div className="doctor-fav-list">
                          <div className="doctor-info-profile">
                            <Link to="#" className="table-avatar">
                              <img
                                src={doctor_14}
                                alt="Img"
                              />
                            </Link>
                            <div className="doctor-name-info">
                              <h5>
                                <Link to="#">Dr. Wayne&nbsp;</Link>
                              </h5>
                              <span>Dental Specialist</span>
                            </div>
                          </div>
                          <Link to="#" className="cal-plus-icon">
                            <i className="fa-solid fa-calendar-plus" />
                          </Link>
                        </div> */}
                        {/* <div className="doctor-fav-list">
                          <div className="doctor-info-profile">
                            <Link to="#" className="table-avatar">
                              <img
                                src={doctor_15}
                                alt="Img"
                              />
                            </Link>
                            <div className="doctor-name-info">
                              <h5>
                                <Link to="#">Dr. Marla</Link>
                              </h5>
                              <span>Endodontists</span>
                            </div>
                          </div>
                          <Link to="#" className="cal-plus-icon">
                            <i className="fa-solid fa-calendar-plus" />
                          </Link>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 d-flex">
                  <div className="dashboard-main-col w-100">
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>
                            <span className="card-head-icon">
                              <i className="fa-solid fa-calendar-days" />
                            </span>
                            Appointment
                          </h5>
                        </div>
                        <div className="card-view-link">
                          <div className="owl-nav slide-nav-patient text-end nav-control" />
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                        <div className="apponiment-dates">

                          <ul className="appointment-calender-slider">
                          <OwlCarousel {...specialitysettings}>
                          {uniqueDates.map((date, index) => (
                            <li key={index}>
                                <Link to="#" className={date == selectedDate ? "available-date" : ""} onClick={() => setSelectedDate(date)}>
                  <h5>{date}</h5>
                </Link>
                            </li>
                          ))}
                            {/* <li>
                              <Link to="#">
                                <h5>
                                  20 <span>Mon</span>
                                </h5>
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="available-date">
                                <h5>
                                  21 <span>Tue</span>
                                </h5>
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="available-date">
                                <h5>
                                  22 <span>Wed</span>
                                </h5>
                              </Link>
                            </li>
                            <li>
                              <Link to="#">
                                <h5>
                                  23 <span>Thu</span>
                                </h5>
                              </Link>
                            </li>
                            <li>
                              <Link to="#">
                                <h5>
                                  24 <span>Fri</span>
                                </h5>
                              </Link>
                            </li>
                            <li>
                              <Link to="#">
                                <h5>
                                  25 <span>Sat</span>
                                </h5>
                              </Link>
                            </li> */}
                            </OwlCarousel>
                          </ul>
                          {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
                       
                          <div className="appointment-dash-card" key={index}>
                            <div className="doctor-fav-list">
                              <div className="doctor-info-profile">
                                <Link to="#" className="table-avatar">
                                  <img
                                    src={
                                      appointment.profile_image
                                        ? `${image_api}${appointment.profile_image}` // Assuming images are stored in '/uploads/'
                                        : doctorprofileimg // Default image if profile_image is null
                                    }
                                    alt="Img"
                                  />
                                </Link>
                                <div className="doctor-name-info">
                                  <h5>
                                    <Link to="#">Dr.{appointment.doctor_name}</Link>
                                  </h5>
                                  <span>{appointment.doctor_specialization}</span>
                                </div>
                              </div>
                              <Link to="#" className="cal-plus-icon">
                                <i className="fa-solid fa-hospital" />
                              </Link>
                            </div>
                            <div className="date-time">
                              <p>
                                <i className="fa-solid fa-clock" />
                                {appointment.appointment_day} - {appointment.slot_time}{" "}
                              </p>
                            </div>
                            <div className="card-btns">
                              {/* <Link to="/patient/patient-chat" className="btn btn-gray">
                                <i className="fa-solid fa-comment-dots" />
                                Chat Now
                              </Link> */}
                              <Link
                                to="/patient/patient-appointments"
                                className="btn btn-outline-primary"
                              >
                                <i className="fa-solid fa-calendar-check" />
                                Go to appointments
                              </Link>
                            </div>
                          </div>

))
) : (
  <p>No appointments </p>
)}
                          {/* <div className="appointment-dash-card">
                            <div className="doctor-fav-list">
                              <div className="doctor-info-profile">
                                <Link to="#" className="table-avatar">
                                  <img
                                    src={doctor_17}
                                    alt="Img"
                                  />
                                </Link>
                                <div className="doctor-name-info">
                                  <h5>
                                    <Link to="#">Dr.Juliet Gabriel</Link>
                                  </h5>
                                  <span>Cardiologist</span>
                                </div>
                              </div>
                              <Link to="#" className="cal-plus-icon">
                                <i className="fa-solid fa-video" />
                              </Link>
                            </div>
                            <div className="date-time">
                              <p>
                                <i className="fa-solid fa-clock" />
                                22 Mar 2024 - 10:30 PM
                              </p>
                            </div>
                            <div className="card-btns">
                              <Link to="/patient/patient-chat" className="btn btn-gray">
                                <i className="fa-solid fa-comment-dots" />
                                Chat Now
                              </Link>
                              <Link
                                to="/patient/patient-appointments"
                                className="btn btn-outline-primary"
                              >
                                <i className="fa-solid fa-calendar-check" />
                                Attend
                              </Link>
                            </div>
                          </div> */}


                        </div>
                      </div>
                    </div>
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Notifications</h5>
                        </div>
                        <div className="card-view-link">
                          <Link to="#">View All</Link>
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                        <div className="table-responsive">
                          <table className="table dashboard-table">
                            <tbody>
                            {patientNotifications.length > 0 ? (
                                patientNotifications.map((noti, index) => (
                                  <tr key={index}>
                                  <td>
                                    <div className="table-noti-info">
                                      <div className="table-noti-icon color-violet">
                                        <i className="fa-solid fa-bell" />
                                      </div>
                                      <div className="table-noti-message">
                                        <h6>
                                          <Link to="#">
                                            {/* Booking Confirmed on{" "}
                                            <span> 21 Mar 2024 </span> 10:30 AM */}
                                            {noti.title}
                                          </Link>
                                        </h6>
                                        <span className="message-time"> {noti.description}</span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="2" className="text-center">
                                  <i className="fa-solid fa-bell-slash" /> No notifications available
                                  </td>
                                </tr>
                              )}
                             
                              {/* <tr>
                                <td>
                                  <div className="table-noti-info">
                                    <div className="table-noti-icon color-blue">
                                      <i className="fa-solid fa-star" />
                                    </div>
                                    <div className="table-noti-message">
                                      <h6>
                                        <Link to="#">
                                          You have a <span> New </span> Review for
                                          your Appointment{" "}
                                        </Link>
                                      </h6>
                                      <span className="message-time">
                                        5 Days ago
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="table-noti-info">
                                    <div className="table-noti-icon color-red">
                                      <i className="fa-solid fa-calendar-check" />
                                    </div>
                                    <div className="table-noti-message">
                                      <h6>
                                        <Link to="#">
                                          You have Appointment with{" "}
                                          <span> Ahmed </span> by 01:20 PM{" "}
                                        </Link>
                                      </h6>
                                      <span className="message-time">12:55 PM</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="table-noti-info">
                                    <div className="table-noti-icon color-yellow">
                                      <i className="fa-solid fa-money-bill-1-wave" />
                                    </div>
                                    <div className="table-noti-message">
                                      <h6>
                                        <Link to="#">
                                          Sent an amount of <span> $200 </span> for
                                          an Appointment by 01:20 PM{" "}
                                        </Link>
                                      </h6>
                                      <span className="message-time">
                                        2 Days ago
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="table-noti-info">
                                    <div className="table-noti-icon color-blue">
                                      <i className="fa-solid fa-star" />
                                    </div>
                                    <div className="table-noti-message">
                                      <h6>
                                        <Link to="#">
                                          You have a <span> New </span> Review for
                                          your Appointment{" "}
                                        </Link>
                                      </h6>
                                      <span className="message-time">
                                        5 Days ago
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr> */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-7 d-flex">
                  <div className="dashboard-main-col w-100">
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Analytics</h5>
                        </div>
                        {/* <div className="dropdown-links d-flex align-items-center flex-wrap">
                          <div className="dropdown header-dropdown">
                            <Link
                              className="dropdown-toggle"
                              data-bs-toggle="dropdown"
                              to="#"
                            >
                              <img
                                src={doctordashboardprofile06}
                                className="avatar dropdown-avatar"
                                alt="Img"
                              />
                              Hendrita
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end">
                              <Link
                                to="#"
                                className="dropdown-item"
                              >
                                <img
                                  src={doctordashboardprofile06}
                                  className="avatar dropdown-avatar"
                                  alt="Img"
                                />
                                Hendrita
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                              >
                                <img
                                  src={doctordashboardprofile08}
                                  className="avatar dropdown-avatar"
                                  alt="Img"
                                />
                                Laura
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                              >
                                <img
                                  src={doctordashboardprofile07}
                                  className="avatar dropdown-avatar"
                                  alt="Img"
                                />
                                Mathew
                              </Link>
                            </div>
                          </div>
                          <div className="dropdown header-dropdown header-dropdown-two">
                            <Link
                              className="dropdown-toggle border-0"
                              data-bs-toggle="dropdown"
                              to="#"
                            >
                              This Week
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end">
                              <Link
                                to="#"
                                className="dropdown-item"
                              >
                                This Week
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                              >
                                This Month
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                              >
                                This Year
                              </Link>
                            </div>
                          </div>
                        </div> */}


                      </div>
                      <div className="dashboard-card-body">
                        <div className="chart-tabs patient-dash-tab">
                          <ul className="nav" role="tablist">
                            <li className="nav-item" role="presentation">
                              <Link
                                className="nav-link active"
                                to="#"
                                data-bs-toggle="tab"
                                data-bs-target="#heart-rate"
                                aria-selected="false"
                                role="tab"
                                tabIndex={-1}
                              >
                                Pulse
                              </Link>
                            </li>
                            <li className="nav-item" role="presentation">
                              <Link
                                className="nav-link "
                                to="#"
                                data-bs-toggle="tab"
                                data-bs-target="#blood-pressure"
                                aria-selected="true"
                                role="tab"
                              >
                                Blood Pressure
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className="tab-content pt-0">
                          {/* Chart */}
                          <div
                            className="tab-pane fade active show"
                            id="heart-rate"
                            role="tabpanel"
                          >

                            {/* <div ref={chartRef} id="heart-rate-chart" /> */}
                            <div className="tab-pane fade active show" id="heart-rate" role="tabpanel">
  {pulseOptions && <Chart options={pulseOptions} series={pulseOptions.series} type="bar" height={300} />}
</div>

                          </div>
                          {/* /Chart */}
                          {/* Chart */}
                          <div
                            className="tab-pane fade"
                            id="blood-pressure"
                            role="tabpanel"
                          >
                            <div id="blood-pressure-chart" ref={chartContainerRef}>
                              {options1 && <Chart options={options1} series={options1.series} type="bar" height={350} />}
                            </div>

                          </div>
                          {/* /Chart */}
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Past Appointments</h5>
                        </div>
                        
                        <div className="card-view-link">
                          <div className="owl-nav slide-nav2 text-end nav-control" />
                        </div>
                      </div>
                      
                      <div className="dashboard-card-body">
                        <div className="past-appointments-slider">
                        <OwlCarousel {...specialitysettings1}>

                          <div className="appointment-dash-card past-appointment">
                          {pastApt && Object.keys(pastApt).length > 0 ? (
                             <>
                            <div className="appointment-date-info">
                              <h4>  {pastApt?.appointment_day
    ? new Date(pastApt.appointment_day.split('-').reverse().join('-')).toLocaleDateString('en-US', {
        weekday: 'long', // "Wednesday"
        month: 'short',  // "Mar"
        year: 'numeric', // "2025"
      })
    : ''}</h4>
                              <ul>

                                <li>
                                  <span>
                                    <i className="fa-solid fa-clock" />
                                  </span>
                                  Time : {pastApt?.apt_start_time} - {pastApt?.apt_end_time} 
                                </li>
                                
                                <li>
                                  <span>
                                    <i className="fa-solid fa-location-dot" />
                                  </span>
                                  {pastApt?.hospital_state}, {pastApt?.hospital_country}
                                </li>
                              </ul>
                            </div>
                            <div className="doctor-fav-list">
                              <div className="doctor-info-profile">
                                <Link to="#" className="table-avatar">
                                  <img
                                    src={ typeof pastApt?.doctor_profile_image === 'string' && 
                                      pastApt?.doctor_profile_image.trim() !== '' && 
                                      /\.(jpeg|jpg|png|webp)$/i.test(pastApt?.doctor_profile_image) 
                                        ? `${image_api}${pastApt?.doctor_profile_image}` : doc_dummy}
                                    alt="Img"
                                    onError={(e) => e.target.src = doc_dummy} 
                                  />
                                </Link>
                                <div className="doctor-name-info">
                                  <h5>
                                    <Link to="#">Dr.{pastApt?.doctor_name}</Link>
                                  </h5>
                                  <span>{pastApt?.doctor_specialization}</span>
                                </div>
                              </div>
                            </div>
                            <div className="card-btns">
                              {/* <Link
                                to="/patient/patient-appointments"
                                className="btn btn-outline-primary ms-0 me-3"
                              >
                                Reschedule
                              </Link> */}
                              <Link
                                to="/patient/patient-appointments"
                                className="btn btn-primary prime-btn"
                              >
                                View Details
                              </Link>
                            </div>
                            </>
  ) : (
    <div className="text-center p-3">No data available</div>
  )}
                          </div>
                          <div className="appointment-dash-card past-appointment">
                            <div className="appointment-date-info">
                              <h4>Friday, Mar 2024</h4>
                              <ul>
                                <li>
                                  <span>
                                    <i className="fa-solid fa-clock" />
                                  </span>
                                  Time : 03:00 PM - 03:30 PM (30 Min)
                                </li>
                                <li>
                                  <span>
                                    <i className="fa-solid fa-location-dot" />
                                  </span>
                                  Newyork, United States
                                </li>
                              </ul>
                            </div>
                            <div className="doctor-fav-list">
                              <div className="doctor-info-profile">
                                <Link to="#" className="table-avatar">
                                  <img
                                    src={doctor_17}
                                    alt="Img"
                                  />
                                </Link>
                                <div className="doctor-name-info">
                                  <h5>
                                    <Link to="#">Dr.Juliet Gabriel</Link>
                                  </h5>
                                  <span>Cardiologist</span>
                                </div>
                              </div>
                            </div>
                            <div className="card-btns">
                              <Link
                                to="patient-appointments.html"
                                className="btn btn-outline-primary ms-0 me-3"
                              >
                                Reschedule
                              </Link>
                              <Link
                                to="medical-details.html"
                                className="btn btn-primary prime-btn"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                          </OwlCarousel>
                        </div>
                      </div>
                    </div>
                    {/* <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Dependant</h5>
                        </div>
                        <div className="card-view-link">
                          <Link
                            to="#"
                            className="add-new"
                            data-bs-toggle="modal"
                            data-bs-target="#add_dependent"
                          >
                            <i className="fa-solid fa-circle-plus me-2" />
                            Add New
                          </Link>
                          <Link to="dependent.html">View All</Link>
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                        <div className="doctor-fav-list">
                          <div className="doctor-info-profile">
                            <Link to="#" className="table-avatar">
                              <img
                                src={patient20}
                                alt="Img"
                              />
                            </Link>
                            <div className="doctor-name-info">
                              <h5>
                                <Link to="#">Laura</Link>
                              </h5>
                              <span>Mother - 58 years 20 days</span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <Link to="#" className="cal-plus-icon me-2">
                              <i className="fa-solid fa-calendar-plus" />
                            </Link>
                            <Link to="dependent.html" className="cal-plus-icon">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </div>
                        </div>
                        <div className="doctor-fav-list">
                          <div className="doctor-info-profile">
                            <Link to="#" className="table-avatar">
                              <img
                                src={patient21}
                                alt="Img"
                              />
                            </Link>
                            <div className="doctor-name-info">
                              <h5>
                                <Link to="#">Mathew</Link>
                              </h5>
                              <span>Father - 59 years 15 days</span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <Link to="#" className="cal-plus-icon me-2">
                              <i className="fa-solid fa-calendar-plus" />
                            </Link>
                            <Link to="dependent.html" className="cal-plus-icon">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="col-xl-12 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Reports</h5>
                      </div>
                      {/* <div className="dropdown header-dropdown">
                        <Link
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <img
                            src={doctordashboardprofile06}
                            className="avatar dropdown-avatar"
                            alt="Img"
                          />
                          Hendrita
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            <img
                              src={doctordashboardprofile06}
                              className="avatar dropdown-avatar"
                              alt="Img"
                            />
                            Hendrita
                          </Link>
                          <Link to="#" className="dropdown-item">
                            <img
                              src={doctordashboardprofile08}
                              className="avatar dropdown-avatar"
                              alt="Img"
                            />
                            Laura
                          </Link>
                          <Link to="#" className="dropdown-item">
                            <img
                              src={doctordashboardprofile07}
                              className="avatar dropdown-avatar"
                              alt="Img"
                            />
                            Mathew
                          </Link>
                        </div>
                      </div> */}
                    </div>
                    <div className="dashboard-card-body">
                      <div className="account-detail-table">
                        {/* Tab Menu */}
                        <nav className="patient-dash-tab border-0 pb-0 mb-3 mt-3">
                          <ul className="nav nav-tabs-bottom">
                            <li className="nav-item">
                              <Link
                                className="nav-link active"
                                to="#appoint-tab"
                                data-bs-toggle="tab"
                              >
                                Appointments
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                to="#medical-tab"
                                data-bs-toggle="tab"
                              >
                                Medical Records
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                to="#prsc-tab"
                                data-bs-toggle="tab"
                              >
                                Prescriptions
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                to="#invoice-tab"
                                data-bs-toggle="tab"
                              >
                                Invoices
                              </Link>
                            </li>
                          </ul>
                        </nav>
                        {/* /Tab Menu */}
                        {/* Tab Content */}
                        <div className="tab-content pt-0">
                          {/* Appointments Tab */}
                          <div
                            id="appoint-tab"
                            className="tab-pane fade show active"
                          >
                            <div className="custom-new-table">
                              <div className="table-responsive">
                              <table className="table table-hover table-center mb-0">
  <thead>
    <tr>
      <th>#</th>
      <th>Appt No</th>
      <th>Date</th>
      <th>Slot Time</th>
      <th>Doctor Name</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {filteredData.length > 0 ? (
      filteredData.map((appointment, index) => (
        <tr key={index}>
          <td>{index + 1}</td> {/* Serial Number */}
          <td>
            <Link to="#">
              <span className="text-blue">#{appointmentPrefix}{appointment.token_no}</span>
            </Link>
          </td>
          
          <td>{appointment.appointment_day || "N/A"}</td>
          <td>{appointment.slot_time || "0"}</td>
          <td>{appointment.doctor_name || "N/A"}</td>
          <td>{getStatusBadge(appointment.status)}</td>
          {/* <td>
            <div className="d-flex align-items-center">
              <Link to="#" className="account-action me-2">
                <i className="fa-solid fa-prescription" />
              </Link>
              <Link to="#" className="account-action">
                <i className="fa-solid fa-file-invoice-dollar" />
              </Link>
            </div>
          </td> */}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="9" className="text-center">
          No Appointments Found
        </td>
      </tr>
    )}
  </tbody>
</table>

                              </div>
                            </div>
                          </div>


                          <div className="tab-pane fade" id="medical-tab">
                            <div className="custom-table">
                              <div className="table-responsive">
                              <table className="table table-center mb-0">
  <thead>
    <tr>
      <th>#</th> {/* Serial Number Column */}
      <th>Date</th>
      <th>Doctor Name</th>
      {/* <th>Lab Report</th> */}
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {Datarecord.length > 0 ? (
      Datarecord.map((record, index) => (
        <tr key={index}>
          <td>{index + 1}</td> {/* Serial Number */}
          <td>{record.date}</td>
          <td>{record.tech_name}</td>
          {/* <td>
  {record?.report_file ? (
    <Link to={`${image_api.replace(/\/$/, "")}/${record.report_file.replace(/^\//, "").replace("patient/", "")}`} className="lab-icon">
      <span>
        <i className="fa-solid fa-paperclip" />
      </span>
      Lab Report
    </Link>
  ) : (
    <span className="text-gray-400">No Report</span>
  )}
</td> */}


         
          
          <td>
          <div className="action-item flex gap-2">
  <a
    href={record?.report_file ? `${image_api}/${record.report_file}` : "#"}
    target={record?.report_file ? "_blank" : "_self"}
    rel="noopener noreferrer"
    className={record?.report_file ? "" : "text-gray-400 cursor-not-allowed"}
    onClick={(e) => !record?.report_file && e.preventDefault()} // Prevent click if no report
  >
    <i className="fa-solid fa-link" />
  </a>
</div>

          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center">No records found</td>
      </tr>
    )}
  </tbody>
</table>

                              </div>
                            </div>
                          </div>
                          {/* /Medical Records Tab */}
                          {/* Prescriptions Tab */}
                          <div className="tab-pane fade" id="prsc-tab">
  <div className="custom-table">
    <div className="table-responsive">
      <table className="table table-center mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Apt Date</th>
            <th>Prescribed By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {filteredpresData.length > 0 ? (
    filteredpresData.map((prescription, index) => (
      <tr key={index}>
        <td>{index + 1}</td> {/* Serial Number Column */}
        {/* <td className="text-blue-600">
          <Link to="#" data-bs-toggle="modal" data-bs-target="#view_prescription">
            {prescription.prescription_token}
          </Link>
        </td> */}
        {/* <td>
          <Link to="#" className="lab-icon prescription">
            <span>
              <i className="fa-solid fa-prescription" />
            </span>
            {prescription.medicine_name || "Prescription"}
          </Link>
        </td> */}
        <td>
          {prescription.appointment_day}
        </td>
        <td>
          <h2 className="table-avatar">
            <Link to="/patient/doctor-profile" className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-3"
                   src={prescription?.tech_profile_image && /\.(jpeg|jpg|png|webp)$/i.test(prescription.tech_profile_image) 
                      ? `${image_api}${prescription.tech_profile_image}` 
                      : doc_dummy}
                alt="Doctor Image"
                onError={(e) => e.target.src = doc_dummy} 
              />
            </Link>
            <Link to="/patient/doctor-profile">
              {prescription.tech_name || "Unknown"}
            </Link>
          </h2>
        </td>
        <td>
          <div className="action-item">
          <Link to="#" data-bs-toggle="modal" onClick={() => handleViewPrescription(prescription)} data-bs-target="#view_prescription">
                          <i className="fa-solid fa-link" />
                        </Link>



            {/* <Link to="#">
              <i className="fa-solid fa-download" />
            </Link>
            <Link to="#">
              <i className="fa-solid fa-trash-can" />
            </Link> */}
            
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center">No prescriptions found.</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  </div>
</div>

                          {/* Prescriptions Tab */}
                          {/*Invoices Tab */}
                          <div className="tab-pane fade" id="invoice-tab">
                            <div className="custom-table">
                              <div className="table-responsive">
                                <table className="table table-center mb-0">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th> Date</th>
                                      <th>Doctor</th>
                                      <th>Amount</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
  {datainvoice && datainvoice.length > 0 ? (
    datainvoice.map((invoice, index) => (
      <tr key={invoice.id}>
        <td>{index + 1}</td> {/* Serial Number Column */}
        {/* <td className="text-blue-600">
          <Link to="#" data-bs-toggle="modal" data-bs-target="#invoice_view">
            #{invoice.invoice_token}
          </Link>
        </td> */}
        <td>{invoice.appointment_day}</td>
        <td>
          <h2 className="table-avatar">
          <Link to="/patient/doctor-profile" className="avatar avatar-sm me-2">
  <img
    className="avatar-img rounded-3"
     src={invoice?.profile_image && /\.(jpeg|jpg|png|webp)$/i.test(invoice.profile_image) 
          ? `${image_api}/${invoice.profile_image}` 
          : doc_dummy}
    alt="Doctor Image"
    onError={(e) => e.target.src = doc_dummy} 
  />
</Link>

            <Link to="/patient/doctor-profile">
              {invoice.tech_details?.name || "N/A"}
            </Link>
          </h2>
        </td>
      
        <td>{invoice.final_amount ? invoice.final_amount.toFixed(2) : "N/A"}</td>
        <td>
          <div className="action-item">
             <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#invoice_view"
                                onClick={() => openInvoiceModal(invoice)}
                              >
                                <i className="fa-solid fa-link" />
                              </Link>
            {/* <Link to="#">
              <i className="fa-solid fa-print" />
            </Link> */}
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center"> {/* Updated colSpan to match new column count */}
        No invoices available.
      </td>
    </tr>
  )}
</tbody>


                                </table>
                              </div>
                            </div>
                          </div>
                          {/* Invoices Tab */}
                        </div>
                        {/* Tab Content */}
                      </div>

                      <div
        className="modal fade custom-modals"
        id="view_prescription"
        tabIndex="-1"
        aria-hidden="true"
        style={{marginTop:"50px"}}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
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
            <div className="modal-body pb-0" >
            <div className="prescribe-download">
            {selectedPrescription && (
        <h5>{selectedPrescription.appointment_day}        
        </h5>
            )}
        <ul>
          {/* <li>
            <Link to="#" className="print-link">
              <i className="fa-solid fa-print" onClick={() => window.print()} />
            </Link>
          </li> */}
          <li>
            <Link href="#" className="btn btn-primary prime-btn" onClick={handleDownloadPDF}>
              Download
            </Link>
          </li>
        </ul>
      </div>
              {selectedPrescription && (
                <div className="view-prescribe invoice-content " id="prescription-content">
                  <div className="invoice-item">
          <div className="row">
            <div className="col-md-6">
              <div className="invoice-logo">
                <img src={logo} alt="logo" />
              </div>
            </div>
            <div className="col-md-6">
              <p className="invoice-details">
                <strong>Prescription ID :#{prescription_prefix}-{selectedPrescription.prescription_token}</strong> <br />
                <strong>Issued:</strong> {selectedPrescription.appointment_day}
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
                          {selectedPrescription.tech_name} <br />
                          {selectedPrescription.hospital_name}<br />
                          {selectedPrescription.hospital_address}<br />
                          {selectedPrescription.hospital_state}<br />
                          {selectedPrescription.hospital_country}

                        </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                      <div className="invoice-info invoice-info2">
                        <h6 className="customer-text">Patient Details</h6>
                        <p className="invoice-details">
                          {patient_name} <br />
                          {selectedpatientdetails?.full_address},
                          {selectedpatientdetails?.city}<br/>
                          {selectedpatientdetails?.state},
                          {selectedpatientdetails?.country}<br/>
                          {selectedpatientdetails?.pincode}
                         
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                  {/* Prescription Details */}
                  <div className="invoice-item invoice-table-wrap">
                    <h6>Prescription Details</h6>
                    <div className="table-responsive">
                      <table className="invoice-table table table-bordered">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Medicine Name</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Timings</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPrescription.prescriptions.map((med, index) => (
                            <tr key={index}>
                              <td>{index+1}</td>
                              <td>{med.medicine_name}</td>
                              <td>{med.qty}</td>
                              <td>{med.is_morning}-{med.is_noon}-{med.is_evening}-{med.is_night}</td>
                              <td>{med.cycle}</td>
                              <td>{med.is_before_food=0?"After Food":"Before Food"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="other-info">
          <h4>Other information</h4>
          <p className="text-muted mb-0">
           {selectedPrescription.advice}
          </p>
        </div>
        <div className="other-info">
          <h4>Follow Up</h4>
          <p className="text-muted mb-0">
          {selectedPrescription.follow_up}
          </p>
          </div>

                  <div className="prescriber-info">
                    <h6>Dr. {selectedPrescription.tech_name}</h6>
                    <p>{selectedPrescription.tech_specialization}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

          <div className="modal fade custom-modals" id="invoice_view"  style={{marginTop:"50px"}} >
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title">View Invoice</h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                  <div className="modal-body pb-0">
                    {selectedInvoice && (
                        <div className="prescribe-download">
                        <h5>{formatDate(selectedInvoice.created_at)}</h5>
                        <ul>
                          {/* <li>
                            <Link to="#" className="print-link">
                              <i className="fa-solid fa-print" />
                           </Link>
                          </li> */}
                         <li>
                          <Link to="#" className="btn btn-primary prime-btn" onClick={handleDownloadPDFinv}>
                            Download
                          </Link>
                        </li>
                </ul>
              </div>
               )}
               {selectedInvoice && (
                      <div className="view-prescribe invoice-content" id="invoice_view_data">
                        <div className="invoice-item">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="invoice-logo">
                              <img src={logo} alt="logo" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <p className="invoice-details">
                                <strong>Invoice No : </strong> #INV-{selectedInvoice.invoice_token}
                                <br />
                                <strong>Issued:</strong> {formatDate(selectedInvoice.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
      
         {/* Invoice Item */}
         <div className="invoice-item">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="invoice-info">
                        <h6 className="customer-text">Billing From</h6>
                        <p className="invoice-details invoice-details-two">
                        {selectedInvoice.tech_details ? selectedInvoice.tech_details.name : "N/A"} <br />
                        {selectedInvoice.hospital_details ? selectedInvoice.hospital_details.name : "N/A"} <br />
                         {selectedInvoice.hospital_details ? selectedInvoice.hospital_details.address : "N/A"} <br />
                         {selectedInvoice.hospital_details ? selectedInvoice.hospital_details.state : "N/A"} <br />
                         {selectedInvoice.hospital_details ? selectedInvoice.hospital_details.country : "N/A"} <br />
                      
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="invoice-info">
                        <h6 className="customer-text">Billing To</h6>
                        <p className="invoice-details invoice-details-two">
                        {selectedInvoice.patient_details ? selectedInvoice.patient_details.name : "N/A"} <br />
                        {selectedpatientdetails.full_address},
                        {selectedpatientdetails.city}<br/>
                        {selectedpatientdetails.state},
                        {selectedpatientdetails.country}<br/>
                        {selectedpatientdetails.pincode}
                               
                        </p>
                      </div>
                    </div>
                    {/* <div className="col-md-4">
                      <div className="invoice-info invoice-info2">
                        <h6 className="customer-text">Payment Method</h6>
                        <p className="invoice-details">
                          Debit Card <br />
                          XXXXXXXXXXXX-2541
                          <br />
                          HDFC Bank
                          <br />
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Item */}
                        {/* Invoice Details Table */}
                        <div className="invoice-item invoice-table-wrap">
                          <div className="row">
                            <div className="col-md-12">
                              <h6>Invoice Details</h6>
                              <div className="table-responsive">
                                <table className="invoice-table table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Description</th>
                                      <th>Quantity</th>
                                      <th>Unit Price</th>
                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedInvoice.details.map((item, index) => (
                                      <tr key={index}>
                                        <td>{item.service_details?.service_name || "N/A"}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unit_price?.toFixed(2)}</td>
                                        <td>{item.final_amount?.toFixed(2)}</td>
                                      </tr>
                                    ))}
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
                                      <td><span>{selectedInvoice.sub_total?.toFixed(2)}</span></td>
                                    </tr>
                                    {selectedInvoice.tax_amount > 0 && (
                                      <tr>
                                        <th>Tax:</th>
                                        <td><span>{selectedInvoice.tax_amount?.toFixed(2)}</span></td>
                                      </tr>
                                    )}
                                    <tr>
                                      <th>Total Amount:</th>
                                      <td><span>{selectedInvoice.final_amount?.toFixed(2)}</span></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
      
                        {/* Invoice Information */}
                        <div className="other-info mb-0">
                          <h4>Other Information</h4>
                          <p className="text-muted mb-0">
                            {selectedInvoice.clinical_notes || "No additional information provided."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          



                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter {...props} />
    </>
  );
};

export default Dashboard;
