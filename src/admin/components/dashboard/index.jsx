import React,{ useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import DoctorListDesboard from "./DoctorList";
import PatientsListDesboard from "./PatientsList";
import AppointmentList from "./AppointmentList";
import LineChart from "./LineChart";
import StatusCharts from "./StatusCharts";
import { Table, Button, Modal, Form, Input, Select, TimePicker, Switch, notification,Card } from "antd";
import { var_api } from "../../../constant";
import "../styles/Loader.css";
import { useHistory } from 'react-router-dom';
// import React, { useEffect } from 'react'



const Dashboard = () => {
const [loading, setLoading] = useState(false);
const [totalpatient, settotalpatient] = useState(false);
const [totalappointment, settotalappointment] = useState(false);
const [totaldoctor, settotaldoctor]= useState(false);
const adminnamep = localStorage.getItem("admin_name");
const [tech, setTech] = useState(null);
const [nontech, setNontech] = useState(null);
const history = useHistory();
const [isModalOpen, setIsModalOpen] = useState(false);
const [data, setData] = useState({
  techstaff: 0,
  availabletime: 0,
  patient: 0,
  servicetype: 0,
  uom: 0,
  category: 0,
  brand: 0,
  medicine: 0,
  paymodemaster: 0,
  makeappointment: 0,
  endsession: 0,
  payment: 0,
});

const navigateToRoute = () => {
  console.log("dataaa",data);
  switch (true) {
    case data.techstaff === 0:
      history.push('/admin/technical');
      break;
    case data.availabletime === 0:
      history.push('/admin/availabledaytime');
      break;
    case data.patient === 0:
      history.push('/admin/patientdetails');
      break;
    case data.servicetype === 0:
      history.push('/admin/servicetypemaster');
      break;
    case data.uom === 0:
      history.push('/admin/medicineuom');
      break;
    case data.category === 0:
      history.push('/admin/medicineCategory');
      break;
    case data.brand === 0:
      history.push('/admin/medicinebrandmaster');
      break;
    case data.medicine === 0:
      history.push('/admin/medicinesubCategory');
      break;
    case data.paymodemaster === 0:
      history.push('/admin/paymodemaster');
      break;
    case data.makeappointment === 0:
      history.push('/admin/appointment-list');
      break;
    case data.endsession === 0:
      history.push('/admin/appointment-list');
      break;
    case data.payment === 0:
      history.push('/admin/invoicelist');
      break;
    default:
      history.push('/admin');
      break;
  }
};



const fetchData = async () => {
  const token = localStorage.getItem("token");
  const hospital_id = localStorage.getItem("hospital_id");
  try {
    const response = await fetch(`${var_api}hospital/get/${hospital_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    // if (response.status === 401) {
    //   history.push("/admin/login"); // Redirect to login page
    //   notification.warning({
    //     message: "Unauthorized",
    //     description: "Your session has expired. Please log in again.",
    //   });
    //   return;
    // }

    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    // localStorage.setItem("hospital_profile", result.profile_image);
    localStorage.setItem("admin_appointment_prefix", result.appointment_prefix);
    localStorage.setItem("admin_invoiced_prefix", result.doctorinvoice_prefix);
    localStorage.setItem("admin_invoicem_prefix", result.medicalinvoice_prefix);
    localStorage.setItem("admin_prescription_prefix", result.prescriptionid_prefix);
    localStorage.setItem("admin_patient_prefix", result.patentid_prefix);
    localStorage.setItem("is_private", result.is_private);
    setTech(result.tech_count);
    setNontech(result.nontech_count);
  } catch (error) {
    console.error("Error fetching data:", error);
   
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
    console.log("Fetched Result: ", result);

    // If no data (empty array), don't show the modal
    if (!Array.isArray(result) || result.length === 0) {
      setIsModalOpen(false);  // Ensure the modal is closed
      return;
    }

    const dataItem = result[0];

    // Set state with fetched data
    const newData = {
      techstaff: dataItem.techstaff || 0,
      availabletime: dataItem.availabletime || 0,
      patient: dataItem.patient || 0,
      servicetype: dataItem.servicetype || 0,
      uom: dataItem.uom || 0,
      category: dataItem.category || 0,
      brand: dataItem.brand || 0,
      medicine: dataItem.medicine || 0,
      paymodemaster: dataItem.paymodemaster || 0,
      makeappointment: dataItem.makeappointment || 0,
      endsession: dataItem.endsession || 0,
      payment: dataItem.payment || 0,
    };
    setData(newData);

    // Show modal only if any field is 0
    const hasZero = Object.values(newData).some(value => value === 0);
    if (hasZero) {
      setIsModalOpen(true); // Show modal only if required
    } else {
      setIsModalOpen(false); // Close modal if no fields are 0
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







  const fetchpatientData = async () => {
    setLoading(true);
    const hospital_id = localStorage.getItem('hospital_id');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${var_api}patientdetails/get-bypatient-length/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, 
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      settotalpatient(result.total_patients);// Set initial filtered data
      
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

    const fetchappointmentData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${var_api}appointment/appointments-by-todayappointment/${hospital_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotalappointment(result.today_appointments_count); // Set initial filtered data
        
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "Fetch Failed",
          description: "Unable to retrieve data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }   
    const fetchdoctorData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${var_api}technicalstaff/get-by-doctor-count/${hospital_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotaldoctor(result["doctor-count"]); // Correctly access the property
        console.log("Doctor Count:", result["doctor-count"]);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "Fetch Failed",
          description: "Unable to retrieve data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }   
  useEffect(() => {
    fetchinstalldata();
    fetchpatientData();
    fetchappointmentData();
    fetchdoctorData();
    fetchData();
    // console.log("Loading state:", loading);
  }, []);




  return (
    <>
      <div className="main-wrapper">
        <SidebarNav />
        {/* Page Wrapper */}
        {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
        <div className="page-wrapper">
          <div className="content container-fluid pb-0">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Welcome {adminnamep}!</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">Dashboard</li>
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
            <div className="row">
              {/* <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-primary border-primary">
                        <i className="fe fe-users" />
                      </span>
                      <div className="dash-count">
                        <h3>{totaldoctor}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Doctors</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-primary" style={{ width: `${Math.min(totaldoctor, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <>
                <div className="col-xl-3 col-sm-6 col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="dash-widget-header">
                        <span className="dash-widget-icon text-success">
                          <i className="fe fe-credit-card" />
                        </span>
                        <div className="dash-count">
                          <h3>{totalpatient}</h3>
                        </div>
                      </div>
                      <div className="dash-widget-info">
                        <h6 className="text-muted">Patients</h6>
                        <div className="progress progress-sm">
                          <div className="progress-bar bg-success" style={{ width: `${Math.min(totalpatient, 100)}%` }}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="dash-widget-header">
                        <span className="dash-widget-icon text-danger border-danger">
                          <i className="fe fe-money" />
                        </span>
                        <div className="dash-count">
                          <h3>{totalappointment}</h3>
                        </div>
                      </div>
                      <div className="dash-widget-info">
                        <h6 className="text-muted">Appointment</h6>
                        <div className="progress progress-sm">
                          <div className="progress-bar bg-danger"  style={{ width: `${Math.min(totalappointment, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="col-xl-3 col-sm-6 col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="dash-widget-header">
                        <span className="dash-widget-icon text-warning border-warning">
                          <i className="fe fe-folder" />
                        </span>
                        <div className="dash-count">
                          <h3>$62523</h3>
                        </div>
                      </div>
                      <div className="dash-widget-info">
                        <h6 className="text-muted">Revenue</h6>
                        <div className="progress progress-sm">
                          <div className="progress-bar bg-warning w-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </>
            </div>
            {/* <div className="row">
              <div className="col-md-12 col-lg-6">
                <div className="card card-chart">
                  <div className="card-header">
                    <h4 className="card-title">Revenue</h4>
                  </div>
                  <div className="card-body">
                    <LineChart />
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-6">
                <div className="card card-chart">
                  <div className="card-header">
                    <h4 className="card-title">Status</h4>
                  </div>
                  <div className="card-body">
                    <div id="morrisLine" />
                    <StatusCharts />
                  </div>
                </div>
              </div>
            </div> */}

            <div className="row">
              {/* <DoctorListDesboard /> */}
              <PatientsListDesboard />
            </div>
            {/* Today’s  Appointment */}
            <div className="row">
              <AppointmentList />
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
      </div>
      <Modal
  title="Installation Info"
  visible={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={[
    <Button
    key="close"
    type="primary"
    onClick={() => {
      setIsModalOpen(false);
      navigateToRoute(); // Call the switch case function here
    }}
  >
    Continue
  </Button>
  ]}
>
  {/* Your modal content goes here */}
  <div>Installation is in progress. Please follow the steps to complete it.</div>
</Modal>

    </>
  );
};

export default Dashboard;
