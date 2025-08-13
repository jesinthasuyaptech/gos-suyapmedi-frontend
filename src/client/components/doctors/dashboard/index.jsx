/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useRef, useState } from "react";
import DoctorSidebar from "../sidebar";
import Header from "../../header";
import { doctordashboardclient01, doctordashboardclient02, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile3 } from "../../imagepath";
import doctordashboardprofile01 from "../../../assets/img/patients/pat_dummy.png";
import Chart from 'react-apexcharts';
import DoctorFooter from "../../common/doctorFooter";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ApexCharts from  "apexcharts";
import {Card} from "antd";
import { var_api, image_api } from "../../../../constant";
import "../../style/Loader.css";


const DoctorDashboard = (props) => {
  
// revenue chart
  const chartRef1 = useRef(null);
  const[data,setData] =useState([]);
  const [totalPatient, setTotalPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [todayPatient, setTodayPatient] = useState(null);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(null);
  const hospital_id = localStorage.getItem("doc_hospital_id");
  const doc_id = localStorage.getItem("doctor_id");
  const [lastAppointments, setLastAppointments] = useState([]);
  const [invoicebilling, setinvoicebilling] = useState([]);
  const [availableTimings, setAvailableTimings] = useState([]);
  const history = useHistory(); // React Router v5 navigation
  const [chartData, setChartData] = useState({ days: [], counts: [] });
  const [chartDataamount, setChartDataAmount] = useState({ days: [], totalPaidAmount: [] });
  const chartRef3 = useRef(null);//invoice weekly payment count
  const chartRef2 = useRef(null);//appointment weekly count
  const hospital_profile =  localStorage.getItem("hospital_profile");
  const appointment_prefix = localStorage.getItem("appointment_prefix");
  const invoiced_prefix = localStorage.getItem("admin_invoiced_prefix");
  const invoicem_prefix = localStorage.getItem("invoicem_prefix");
  const prescription_prefix = localStorage.getItem("prescription_prefix");
  const patient_prefix = localStorage.getItem("patient_prefix");
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
  const [tech, setTech] = useState(null);
  const [nontech, setNontech] = useState(null);

  const [profileDetails, setProfileDetails] = useState(null);

  useEffect(() => {
  fetchTotalPatients();
  fetchTodayPatients();
  fetchTodayAppointments();
  fetchLastFiveAppointments();
  fetchInvoiceData();
  fetchAvailableFetch();
  fetchWeeklyAppointments();
  fetchWeeklyinvoice();

  //doctor details
  fetchDoctorDetails();
  fetchData();
}, []);

  //total patient count
  const fetchTotalPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get(
        // `${var_api}patientdetails/get-bypatient-length/${hospital_id}`, // Replace with your API endpoint
        `${var_api}appointment/appointments-by-length/${hospital_id}/${doc_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // Map API data to Select component options
      const options = response.data;
      setTotalPatient(options);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        history.push("/login"); // or history.push("/login");
      } else {
        console.error("Error fetching patients tital:", err);
      }
    }
    finally {
      setLoading(false);
    }
  };


  
  const fetchData = async () => {
    const token = localStorage.getItem("doc_token");
    try {
      setLoading(true);
      const response = await fetch(`${var_api}hospital/get/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();

      // Save values to localStorage if needed
      localStorage.setItem("admin_appointment_prefix", result.appointment_prefix);
      localStorage.setItem("admin_invoiced_prefix", result.doctorinvoice_prefix);
      localStorage.setItem("admin_invoicem_prefix", result.medicalinvoice_prefix);
      localStorage.setItem("admin_prescription_prefix", result.prescriptionid_prefix);
      localStorage.setItem("admin_patient_prefix", result.patentid_prefix);

      // Set state for condition check
      setTech(result.tech_count);
      setNontech(result.nontech_count);

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchinstalldata = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    
    try {
      const response = await fetch(`${var_api}installation/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // or just token if your API expects that
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
      setData(result || []);
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
  



  


  //today patient count
  const fetchTodayPatients = async () => {
    try {
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }
      const response = await axios.get(
        `${var_api}appointment/appointments-by-newpatient/${hospital_id}/${doc_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // Map API data to Select component options
      const options = response.data;
      setTodayPatient(options[0]);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        history.push("/login"); // or history.push("/login");
      } else {
        console.error("Error fetching patients count:", err);
      }
    }
  };

   //today appointments count
   const fetchTodayAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }
      const response = await axios.get(
        `${var_api}appointment/appointments-by-todayappointment-tech/${hospital_id}/${doc_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // Map API data to Select component options
      const options = response.data;
      setTodayAppointmentsCount(options);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        history.push("/login"); // or history.push("/login");
      } else {
        console.error("Error fetching appointments count:", err);
      }

    
    }
    finally {
      setLoading(false);
    }
  };

   //today appointments count 5 only
   const fetchLastFiveAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }
      const response = await axios.get(
        `${var_api}appointment/appointment-list-dashboard/${hospital_id}/${doc_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // Map API data to Select component options
      const options = response.data;
      setLastAppointments(options);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        history.push("/login"); // or history.push("/login");
      } else {
        console.error("Error fetching appointments count:", err);
      }
    
    }
    finally {
      setLoading(false);
    }
  };


   //listing the appointments invoices
   const fetchInvoiceData = async () => {
    setLoading(true);
    const token = localStorage.getItem("doc_token");
    try {
     
      const response = await fetch(`${var_api}invoicebilling/get-doctor-invoices/${doc_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

    
      if (response.status === 401) {
        history.push("/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
        // Sort by id in descending order and take the first 5
    const sortedData = result.sort((a, b) => b.id - a.id).slice(0, 5);

      setinvoicebilling(sortedData || []);
      // setLoading(false);
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


  function formatDate(dateString) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Validate the input
    if (!dateString || typeof dateString !== "string") {
      // console.error("Invalid or missing date string:", dateString);
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


  //my availbale fetch
  const fetchAvailableFetch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }
      const response = await axios.get(
        `${var_api}availabledaytime/get-all-doc-days/${hospital_id}/${doc_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // Map API data to Select component options
      const options = response.data;
      setAvailableTimings(options);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        history.push("/login"); // or history.push("/login");
      } else {
        console.error("Error fetching appointments count:", err);
      }
    
    }
    finally {
      setLoading(false);
    }
  };
//weekly appointment count
 const fetchWeeklyAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get(
        `${var_api}appointment/appointments-by-currentweek/${hospital_id}/${doc_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const appointments = response.data; // Assuming backend sends [{date, day, count}]
      
      // Extract days and counts for the chart
      const days = appointments.map((item) => item.day);
      const counts = appointments.map((item) => item.count);

      setChartData({ days, counts });
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        history.push("/login"); // Redirect to login if unauthorized
      } else {
        console.error("Error fetching appointments count:", err);
      }
    }
    finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (chartData.days?.length && chartData.counts?.length && chartRef2.current) {
    // Find the highest count value and its index
    const highestCountIndex = chartData.counts.indexOf(Math.max(...chartData.counts));

    // Chart options configuration
    const chartOptions = {
      chart: {
        height: 220,
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          endingShape: "rounded",
          borderRadius: 5,
          colors: {
            ranges: [
              {
                from: 0,
                to: Math.max(...chartData.counts), // Maximum count
                color: "#B0C4DE", // Light blue for all bars
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
      },
      series: [
        {
          name: "Appointments",
          data: chartData.counts.map((count, index) => {
            // Dynamically changing color for the highest count
            return {
              x: chartData.days[index],
              y: count,
              fillColor: index === highestCountIndex ? "#0E82FD" : "#B0C4DE", // Set color to blue for the highest count
            };
          }),
        },
      ],
      xaxis: {
        categories: chartData.days, // Days of the week from API
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " appointments";
          },
        },
      },
    };

    // Initialize chart
    const chart = new ApexCharts(chartRef2.current, chartOptions);
    chart.render();

    // Cleanup chart on component unmount or data change
    return () => {
      chart.destroy();
    };
  }
}, [chartData]);

///weekly invoice totalpaidamount
 const fetchWeeklyinvoice = async () => {
  setLoading(true);
    try {
      const token = localStorage.getItem("doc_token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get(
        `${var_api}invoicebilling/weekly-paid-amount/${hospital_id}/${doc_id}`, // Replace with your API endpoint
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const invoicebilling = response.data.data; // Assuming backend sends [{date, day, count}]
      console.log(invoicebilling)
      // Extract days and totalPaidAmount for the chart
      const days = invoicebilling.map((item) => item.day);
      const totalPaidAmount = invoicebilling.map((item) => item.totalPaidAmount);

      setChartDataAmount({ days, totalPaidAmount });
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        history.push("/login"); // Redirect to login if unauthorized
      } else {
        console.error("Error fetching appointments count:", err);
      }
    }
    finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (chartDataamount.days?.length && chartDataamount.totalPaidAmount?.length && chartRef3.current) {
    // Find the highest count value and its index
    const highestCountIndex = chartDataamount.totalPaidAmount.indexOf(Math.max(...chartDataamount.totalPaidAmount));

    // Chart options configuration
    const chartOptions = {
      chart: {
        height: 220,
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          endingShape: "rounded",
          borderRadius: 5,
          colors: {
            ranges: [
              {
                from: 0,
                to: Math.max(...chartDataamount.totalPaidAmount), // Maximum totalPaidAmount
                color: "#B0C4DE", // Light blue for all bars
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
      },
      series: [
        {
          name: "Appointments",
          data: chartDataamount.totalPaidAmount.map((totalPaidAmount, index) => {
            // Dynamically changing color for the highest totalPaidAmount
            return {
              x: chartDataamount.days[index],
              y: totalPaidAmount,
              fillColor: index === highestCountIndex ? "#0E82FD" : "#B0C4DE", // Set color to blue for the highest count
            };
          }),
        },
      ],
      xaxis: {
        categories: chartDataamount.days, // Days of the week from API
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " Total Paid Amount ";
          },
        },
      },
    };

    // Initialize chart
    const chart = new ApexCharts(chartRef3.current, chartOptions);
    chart.render();

    // Cleanup chart on component unmount or data change
    return () => {
      chart.destroy();
    };
  }
}, [chartDataamount]);


//update status 2
const handleStartNow = async (appointment) => {
  setLoading(true);
  const token = localStorage.getItem('doc_token');
  // Update status to 'In Progress' (status 2)  // Get the current time
  const updatedAppointment = {  status: 2, apt_start_time: currentTime  };
  setLastAppointments(updatedAppointment);
 
  try {
    // API call to update the status in the backend (adjust URL and method as needed)
    const response = await fetch(`${var_api}appointment/status-update/${appointment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // Add token in Authorization header
      },
      body: JSON.stringify({ status: 2, apt_start_time: currentTime, apt_end_time:'00:00:00' }), // Pass the updated status
    });


    if (response.status === 401) {
      history.push("/login");
      return;
    }


    if (response.ok) {
      // You can update local state here to reflect the change immediately
      console.log('Status updated successfully');
    } else {
      console.error('Failed to update the status');
    }
  } catch (error) {
    setLoading(false);
    console.error('Error updating the status:', error);
  }
  finally {
    setLoading(false);
  }
};



const fetchDoctorDetails = async () => {
  setLoading(true);
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
      setLoading(false);
  
    console.error("Error fetching doctor details:", err);
  }
  finally {
    setLoading(false);
  }
};



  return (
    <div>
      {/* <Header {...props} /> */}
      <Header profileDetails={profileDetails} />
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
              <h2 className="breadcrumb-title">Dashboard</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Dashboard
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

        {tech === 1 && nontech === 2 && (
          <Card
            bordered={true}
            style={{
              width: 'auto',
              height: 50,
              backgroundColor: '#fdecea', // light red background
              color: '#d32f2f', // red text
              border: '1px solid #f44336', // red border
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              fontWeight: 'bold',
            }}
          >
            <h6>You are using a trial pack</h6>
          </Card>
        )}
        <br/>
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              <div className="stickybar">
                {/* Profile Sidebar */}
                <DoctorSidebar 
                 profileDetails={profileDetails}
                 setProfileDetails={setProfileDetails}
                />
                {/* /Profile Sidebar */}
              </div>
            </div>
            <div className="col-lg-8 col-xl-9">
              <div className="row">
                <div className="col-xl-4 d-flex">
                  <div className="dashboard-box-col w-100">
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Total Patient</h6>
                        <h4>{totalPatient?.totalPatient}</h4>
                        {/* <span className="text-success">
                          <i className="fa-solid fa-arrow-up" />
                          15% From Last Week
                        </span> */}
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-user-injured" />
                        </span>
                      </div>
                    </div>
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Patients Today</h6>
                        <h4>{todayPatient?.today_newpatient
}</h4>
                        {/* <span className="text-danger">
                          <i className="fa-solid fa-arrow-up" />
                          15% From Yesterday
                        </span> */}
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-user-clock" />
                        </span>
                      </div>
                    </div>
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Appointments Today</h6>
                        <h4>{todayAppointmentsCount?.today_appointments_count}</h4>
                        {/* <span className="text-success">
                          <i className="fa-solid fa-calendar-days" />
                          20% From Yesterday
                        </span> */}
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-calendar-days" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-8 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Appointment</h5>
                      </div>
                      {/* <div className="dropdown header-dropdown">
                        <Link
                          className="dropdown-toggle nav-tog"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Last 7 Days
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Today
                          </Link>
                          <Link to="#" className="dropdown-item">
                            This Month
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 7 Days
                          </Link>
                        </div>
                      </div> */}
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                          {lastAppointments.length > 0 ? (
                  lastAppointments.map((appt, index) => (
                            <tr key={index}>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="#"
                                    className="table-avatar"
                                  >
                                    
                                    <img
                                      src={
                                        typeof appt.patient_profile_image === 'string' && 
                                        appt.patient_profile_image.trim() !== '' && 
                                        /\.(jpeg|jpg|png|webp)$/i.test(appt.patient_profile_image) 
                                          ? `${image_api}${appt.patient_profile_image}`
                                          : doctordashboardprofile01
                                      }
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#{appt?.appointment_prefix}{appt?.token_no}</span>
                                    <h5>
                                      <Link to="/doctor/appointments">
                                        {appt.patient_name}
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>{formatDate(appt.appointment_day)} {appt.appointment_time}</h6>
                                  {getStatusBadge(appt.status)}
                                </div>
                              </td>
                              <td>
                                <div className="appointment-start">
                                <Link
                          to={{
                            pathname: "/doctor/doctor-appointment-start",
                            state: { ...appt, status: 2, apt_start_time: currentTime },
                          }}
                          onClick={() => handleStartNow(appt)}
                          className="start-link"
                        >
                          Start Now
                        </Link>
                                  {/* <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link> */}
                                </div>
                              </td>
                            </tr>
                             ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center">No appointments found</td>
                              </tr>
                            )}
                            {/* <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="/doctor/appointments"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile02}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#Apt0002</span>
                                    <h5>
                                      <Link to="/doctor/appointments">Kaviya</Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>10 Nov 2024 11.00 AM</h6>
                                  <span className="badge table-badge">
                                    Clinic Consulting
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="/doctor/appointments"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile3}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#Apt0003</span>
                                    <h5>
                                      <Link to="/doctor/appointments">
                                        Kumaran
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>03 Nov 2024 02.00 PM</h6>
                                  <span className="badge table-badge">General</span>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="/doctor/appointments"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile04}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#Apt0004</span>
                                    <h5>
                                      <Link to="/doctor/appointments">
                                        Preethi
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>01 Nov 2024 04.00 PM</h6>
                                  <span className="badge table-badge">
                                    Clinic Consulting
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="/doctor/appointments"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile05}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#Apt0005</span>
                                    <h5>
                                      <Link to="/doctor/appointments">
                                        Deva
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>28 Oct 2024 05.30 PM</h6>
                                  <span className="badge table-badge">General</span>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link>
                                </div>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                   <div className="col-xl-5 d-flex">
                                 <div className="dashboard-chart-col w-100">
                                   <div className="dashboard-card w-100">
                                     <div className="dashboard-card-head border-0">
                                       <div className="header-title">
                                         <h5>Weekly Overview</h5>
                                       </div>
                                       <div className="chart-create-date">
                                         <h6>last 7 Days</h6>
                                       </div>
                                     </div>
                                     <div className="dashboard-card-body">
                                       <div className="chart-tab">
                                         <ul
                                           className="nav nav-pills product-licence-tab"
                                           id="pills-tab2"
                                           role="tablist"
                                         >
                                           <li className="nav-item" role="presentation">
                                             <button
                                               className="nav-link active"
                                               id="pills-revenue-tab"
                                               data-bs-toggle="pill"
                                               data-bs-target="#pills-revenue"
                                               type="button"
                                               role="tab"
                                               aria-controls="pills-revenue"
                                               aria-selected="false"
                                             >
                                               Revenue
                                             </button>
                                           </li>
                                           <li className="nav-item" role="presentation">
                                             <button
                                               className="nav-link"
                                               id="pills-appointment-tab"
                                               data-bs-toggle="pill"
                                               data-bs-target="#pills-appointment"
                                               type="button"
                                               role="tab"
                                               aria-controls="pills-appointment"
                                               aria-selected="true"
                                             >
                                               Appointments
                                             </button>
                                           </li>
                                         </ul>
                                         <div
                                           className="tab-content w-100"
                                           id="v-pills-tabContent"
                                         >
                                           <div
                                             className="tab-pane fade show active"
                                             id="pills-revenue"
                                             role="tabpanel"
                                             aria-labelledby="pills-revenue-tab"
                                           >
                                           <div ref={chartRef3} id="revenue-chart" />
                                           </div>
                                           <div
                                             className="tab-pane fade"
                                             id="pills-appointment"
                                             role="tabpanel"
                                             aria-labelledby="pills-appointment-tab"
                                           >
                                           <div ref={chartRef2} id="appointment-chart" />
                                           </div>
                                         </div>
                                       </div>
                                     </div>
                                   </div>
                                   {/* <div className="dashboard-card w-100">
                                     <div className="dashboard-card-head">
                                       <div className="header-title">
                                         <h5>Recent Patients</h5>
                                       </div>
                                       <div className="card-view-link">
                                         <Link to="/doctor/my-patients">View All</Link>
                                       </div>
                                     </div>
                                     <div className="dashboard-card-body">
                                       <div className="d-flex recent-patient-grid-boxes">
                                         <div className="recent-patient-grid">
                                           <Link to="pages/patient-details" className="patient-img">
                                             <img
                                               src={doctordashboardprofile01}
                                               alt="Img"
                                             />
                                           </Link>
                                           <h5>
                                             <Link to="pages/patient-details">Rajesh</Link>
                                           </h5>
                                           <span>Patient ID :&nbsp;P0001</span>
                                           <div className="date-info">
                                             <p>Last Appointment 15 Mar 2024</p>
                                           </div>
                                         </div>
                                         <div className="recent-patient-grid">
                                           <Link to="pages/patient-details" className="patient-img">
                                             <img
                                               src={doctordashboardprofile02}
                                               alt="Img"
                                             />
                                           </Link>
                                           <h5>
                                             <Link to="pages/patient-details">Kaviya</Link>
                                           </h5>
                                           <span>Patient ID :&nbsp;P0002</span>
                                           <div className="date-info">
                                             <p>Last Appointment 13 Mar 2024</p>
                                           </div>
                                         </div>
                                       </div>
                                     </div>
                                   </div> */}
                                 </div>
                               </div>
                <div className="col-xl-7 d-flex">
                  <div className="dashboard-main-col w-100">
                    {/* <div className="upcoming-appointment-card">
                      <div className="title-card">
                        <h5>Upcoming Appointment</h5>
                      </div>
                      <div className="upcoming-patient-info">
                        <div className="info-details">
                          <span className="img-avatar">
                            <img
                              src={doctordashboardprofile01}
                              alt="Img"
                            />
                          </span>
                          <div className="name-info">
                            <span>#Apt0001</span>
                            <h6>Rajesh</h6>
                          </div>
                        </div>
                        <div className="date-details">
                          <span>General visit</span>
                          <h6>Today, 10:45 AM</h6>
                        </div>
                      </div>
                      <div className="appointment-card-footer">
                        <h5>
                          <i className="fa-solid fa-video" />
                          Video Appointment
                        </h5>
                        <div className="btn-appointments">
                          <Link to="/doctor/chat-doctor" className="btn">
                            Chat Now
                          </Link>
                          <Link to="/doctor/doctor-appointment-start" className="btn">
                            Start Appointment
                          </Link>
                        </div>
                      </div>
                    </div> */}
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Recent Invoices</h5>
                        </div>
                        <div className="card-view-link">
                          <Link to="/doctor/invoices">View All</Link>
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                        <div className="table-responsive">
                          <table className="table dashboard-table">
                            <tbody>
                            {invoicebilling.length > 0 ? (
            invoicebilling.map((invc, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="patient-info-profile">
                                    <Link
                                      to="/doctor/invoices"
                                      className="table-avatar"
                                    >
                                      <img
                                        src={
                                          typeof invc.patient_details?.profile_image === 'string' && 
                                          invc.patient_details?.profile_image.trim() !== '' && 
                                          /\.(jpeg|jpg|png|webp)$/i.test(invc.patient_details?.profile_image) 
                                            ? `${image_api}${invc.patient_details.profile_image}`
                                            :doctordashboardprofile01}
                                        alt="Img"
                                      />
                                      
                                    </Link>
                                    <div className="patient-name-info">
                                      <h5>
                                        <Link to="/doctor/invoices"> {invc.patient_details?.name || "Unknown Patient"}</Link>
                                      </h5>
                                      <span>#{invoiced_prefix}{invc.invoice_token}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Amount</span>
                                    <h6>{invc.final_amount || "N/A"}</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Paid On</span>
                                    <h6>{formatDate(invc?.appointment_day )|| "N/A"}</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="apponiment-view d-flex align-items-center">
                                    <Link  to={{
                            pathname: "/pages/invoice-view",
                            state: { invc },
                          }} >
                                      
                                      <i className="fa-solid fa-eye" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center">
                                    No appointments found
                                  </td>
                                </tr>
                              )}
                              {/* <tr>
                                <td>
                                  <div className="patient-info-profile">
                                    <Link to="#" className="table-avatar">
                                      <img
                                        src={doctordashboardprofile02}
                                        alt="Img"
                                      />
                                    </Link>
                                    <div className="patient-name-info">
                                      <h5>
                                        <Link to="#">Jaya Priya</Link>
                                      </h5>
                                      <span>#Apt0002</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Paid On</span>
                                    <h6>10 Nov 2024</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Amount</span>
                                    <h6>$500</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="apponiment-view d-flex align-items-center">
                                    <Link to="#">
                                      <i className="fa-solid fa-eye" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="patient-info-profile">
                                    <Link to="#" className="table-avatar">
                                      <img
                                        src={doctordashboardprofile3}
                                        alt="Img"
                                      />
                                    </Link>
                                    <div className="patient-name-info">
                                      <h5>
                                        <Link to="#">Saran</Link>
                                      </h5>
                                      <span>#Apt0003</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Paid On</span>
                                    <h6>03 Nov 2024</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Amount</span>
                                    <h6>$320</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="apponiment-view d-flex align-items-center">
                                    <Link to="#">
                                      <i className="fa-solid fa-eye" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="patient-info-profile">
                                    <Link to="#" className="table-avatar">
                                      <img
                                        src={doctordashboardprofile04}
                                        alt="Img"
                                      />
                                    </Link>
                                    <div className="patient-name-info">
                                      <h5>
                                        <Link to="#">Janani</Link>
                                      </h5>
                                      <span>#Apt0004</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Paid On</span>
                                    <h6>01 Nov 2024</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Amount</span>
                                    <h6>$240</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="apponiment-view d-flex align-items-center">
                                    <Link to="#">
                                      <i className="fa-solid fa-eye" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="patient-info-profile">
                                    <Link to="#" className="table-avatar">
                                      <img
                                        src={doctordashboardprofile05}
                                        alt="Img"
                                      />
                                    </Link>
                                    <div className="patient-name-info">
                                      <h5>
                                        <Link to="#">Durai</Link>
                                      </h5>
                                      <span>#Apt0005</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Paid On</span>
                                    <h6>28 Oct 2024</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Amount</span>
                                    <h6>$380</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="apponiment-view d-flex align-items-center">
                                    <Link to="#">
                                      <i className="fa-solid fa-eye" />
                                    </Link>
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
                {/*  <div className="dashboard-card w-100">
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
                            <tr>
                              <td>
                                <div className="table-noti-info">
                                  <div className="table-noti-icon color-violet">
                                    <i className="fa-solid fa-bell" />
                                  </div>
                                  <div className="table-noti-message">
                                    <h6>
                                      <Link to="#">
                                        Booking Confirmed on{" "}
                                        <span> 21 Mar 2024 </span> 10:30 AM
                                      </Link>
                                    </h6>
                                    <span className="message-time">Just Now</span>
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
                                    <span className="message-time">5 Days ago</span>
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
                                        Sent an amount of <span> $200 </span> for an
                                        Appointment by 01:20 PM{" "}
                                      </Link>
                                    </h6>
                                    <span className="message-time">2 Days ago</span>
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
                                    <span className="message-time">5 Days ago</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="col-xl-12 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        {/* <h5>Clinics &amp; Availability</h5> */}
                        <h5>My Availability</h5>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      
                    {availableTimings.length > 0 ? (
            availableTimings.map((time, index) => ( 
            <div className="clinic-available" key={index}>
                        <div className="clinic-head" >
                          <div className="clinic-info">
                            <span className="clinic-img">
                              {/* <img
                                src={doctordashboardclient02}
                                alt="Img"
                              /> */}
                            </span>
                            <h6>{time.available_day}</h6>
                          </div>
                          {/* <div className="clinic-charge">
                            <span>$900</span>
                          </div> */}
                        </div>
                        {time?.timing_details?.length > 0 ? (
            time?.timing_details?.map((invc, index) => (
                        <div className="available-time" key={index}>
                          <ul>
                            <li>
                              <span>From Time :</span>
                              {invc.start_time}
                            </li>
                            <li>
                              <span>To Time : </span>
                              {invc.end_time}
                            </li>
                          </ul>
                          <div className="change-time">
                            <Link to="/doctor/available-timings">Change </Link>
                          </div>
                        </div>
                         ))
                        ) : (
                          <p>
                              No Timings found
                          </p>
                        )}
                      </div>
                       ))
                      ) : (
                        <p>
                            No Timings found
                        </p>
                      )}
                      {/* <div className="clinic-available mb-0">
                        <div className="clinic-head">
                          <div className="clinic-info">
                            <span className="clinic-img">
                              <img
                                src={doctordashboardclient01}
                                alt="Img"
                              />
                            </span>
                            <h6>The Family Dentistry Clinic</h6>
                          </div>
                          <div className="clinic-charge">
                            <span>$600</span>
                          </div>
                        </div>
                        <div className="available-time">
                          <ul>
                            <li>
                              <span>Sat :</span>
                              07:00 AM - 09:00 PM
                            </li>
                            <li>
                              <span>Tue : </span>
                              07:00 AM - 09:00 PM
                            </li>
                          </ul>
                          <div className="change-time">
                            <Link to="#">Change </Link>
                          </div>
                        </div>
                      </div> */}
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
    </div>
  );
};

export default DoctorDashboard;
