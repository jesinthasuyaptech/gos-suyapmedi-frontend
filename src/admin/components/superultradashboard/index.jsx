import React,{ useState, useEffect } from "react";
import SidebarNav from "../ultrasidebar";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
//import DoctorListDesboard from "./DoctorList";
//import PatientsListDesboard from "./PatientsList";
//import AppointmentList from "./AppointmentList";
//import LineChart from "./LineChart";
//import StatusCharts from "./StatusCharts";
import { Table, Button, Modal, Form, Input, Select, TimePicker, Switch, notification } from "antd";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";

//import "feather-icons/dist/feather";




const superultradashboard = () => {
const [loading, setLoading] = useState(false);
const [totalpatient, settotalpatient] = useState(false);
const [totalappointment, settotalappointment] = useState(false);
const [invoiceprofit, setinvoiceprofit] = useState(false);
const [totaldoctor, settotaldoctor]= useState(false);
const [totalnontech, settotalnontech]= useState(false);
const [totaltech, settotaltech]= useState(false);
const adminnamep = localStorage.getItem("admin_name");
const history = useHistory();



const fetchData = async () => {
  const ultratoken = localStorage.getItem("ultratoken");
  const hospital_id = localStorage.getItem("hospital_id");
  try {
    const response = await fetch(`${var_api}hospital/get`, {
      headers: {
        "Content-Type": "application/json",
        Authorization:`${ultratoken} `,
      },
    });

    if (response.status === 401) {
      history.push("/admin/superultraadmin"); // Redirect to login page
      notification.warning({
        message: "Unauthorized",
        description: "Your session has expired. Please log in again.",
      });
      return;
    }

    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    // localStorage.setItem("hospital_profile", result.profile_image);
    localStorage.setItem("admin_appointment_prefix", result.appointment_prefix);
    localStorage.setItem("admin_invoiced_prefix", result.doctorinvoice_prefix);
    localStorage.setItem("admin_invoicem_prefix", result.medicalinvoice_prefix);
    localStorage.setItem("admin_prescription_prefix", result.prescriptionid_prefix);
    localStorage.setItem("admin_patient_prefix", result.patentid_prefix);
  
  } catch (error) {
    console.error("Error fetching data:", error);
   
  } 
};

const fetchpatientData = async () => {
  setLoading(true);
  const hospital_id = localStorage.getItem('hospital_id');
  const ultratoken = localStorage.getItem('ultratoken');

  try {
    const response = await fetch(`${var_api}patientdetails/get-overall-count`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${ultratoken}`,
      },
    });
    console.log("response.status",response.status)

    // Check for unauthorized status
    if (response.status === 401) {
      history.push("/admin/superultraadmin"); // Redirect to login page
      notification.warning({
        message: "Unauthorized",
        description: "Your session has expired. Please log in again.",
      });
      return;
    }
   

    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    settotalpatient(result.patients_count); // Set initial filtered data

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


    const fetchappointmentData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}appointment/appointments-overall-count`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotalappointment(result.total_appointments); // Set initial filtered data
        
      } catch (error) {
        console.error("Error fetching data:", error);
        // notification.error({
        //   message: "Fetch Failed",
        //   description: "Unable to retrieve data. Please try again later.",
        // });
      } finally {
        setLoading(false);
      }
    }   
    const fetchdoctorData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}hospital/get-count`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotaldoctor(result["hospital_count"]); // Correctly access the property
        console.log("Doctor Count:", result["hospital_count"]);
        

      } catch (error) {
        console.error("Error fetching data:", error);
        // notification.error({
        //   message: "Fetch Failed",
        //   description: "Unable to retrieve data. Please try again later.",
        // });
      } finally {
        setLoading(false);
      }
    }   

    const fetchnontechData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}nontechnicalstaff/get-overall-count`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotalnontech(result["nontech_count"]); // Correctly access the property
        console.log("Doctor Count:", result["hospital_count"]);
        

      } catch (error) {
        console.error("Error fetching data:", error);
        // notification.error({
        //   message: "Fetch Failed",
        //   description: "Unable to retrieve data. Please try again later.",
        // });
      } finally {
        setLoading(false);
      }
    }  
    const fetchtechData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}technicalstaff/get-overall-count`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotaltech(result["technical_count"]); // Correctly access the property
        console.log("Doctor Count:", result["hospital_count"]);
        

      } catch (error) {
        console.error("Error fetching data:", error);
        // notification.error({
        //   message: "Fetch Failed",
        //   description: "Unable to retrieve data. Please try again later.",
        // });
      } finally {
        setLoading(false);
      }
    } 
    const fetchinvoiceData = async () => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}invoicebilling/get-overall-profit`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setinvoiceprofit(result["total_profit"]); // Correctly access the property
        console.log("Doctor Count:", result["hospital_count"]);
        

      } catch (error) {
        console.error("Error fetching data:", error);
        // notification.error({
        //   message: "Fetch Failed",
        //   description: "Unable to retrieve data. Please try again later.",
        // });
      } finally {
        setLoading(false);
      }
    }   
  useEffect(() => {
    fetchpatientData();
    fetchnontechData();
    fetchtechData();
    fetchappointmentData();
    fetchdoctorData();
    fetchData();
    fetchinvoiceData();
  }, []);
  return (
    <>
      <div className="main-wrapper">
        <SidebarNav />
        {/* Page Wrapper */}
        <div className="page-wrapper">
        {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
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
            <div className="row">
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-primary border-primary">
                        <i className="fe fe-heart" />
                      </span>
                      <div className="dash-count">
                        <h3>{totaldoctor}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Hospital</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-primary" style={{ width: `${Math.min(totaldoctor, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="row">
            <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-primary border-primary">
                        <i className="fe fe-users" />
                      </span>
                      <div className="dash-count">
                        <h3>{totalnontech}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Non Tech</h6>
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-primary" style={{ width: `${Math.min(totalnontech, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                </div>
  <div className="col-xl-3 col-sm-6 col-12">
    <div className="card">
      <div className="card-body">
        <div className="dash-widget-header">
          <span className="dash-widget-icon text-success">
          <i className="fe fe-users" />
          </span>
          <div className="dash-count">
            <h3>{totaltech}</h3>
          </div>
        </div>
        <div className="dash-widget-info">
          <h6 className="text-muted">Technical</h6>
          <div className="progress progress-sm">
            <div className="progress-bar bg-success" style={{ width: `${Math.min(totaltech, 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="col-xl-3 col-sm-6 col-12">
  <div className="card">
  <div className="card-body">
    <div className="dash-widget-header">
      <span className="dash-widget-icon text-success border-success">
      <i className="fas fa-file-invoice" /> {/* Changed to a receipt icon */}
      </span>
      <div className="dash-count">
  <h3>₹{parseFloat(invoiceprofit).toFixed(2)}</h3>
</div>
    </div>
    <div className="dash-widget-info">
      <h6 className="text-muted">Invoice Profit</h6>
      <div className="progress progress-sm">
      <div
  className="progress-bar bg-success"
  style={{ width: `${Math.min(invoiceprofit, 100).toFixed(2)}%` }}
/>
      </div>
    </div>
  </div>
</div>

  </div>
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

            {/* <div className="row">
              <DoctorListDesboard />
              <PatientsListDesboard />
            </div> */}
            {/* Today’s  Appointment */}
            {/* <div className="row">
              <AppointmentList />
            </div> */}
          </div>
        </div>
        {/* /Page Wrapper */}
      </div>
    </>
  );
};

export default superultradashboard;
