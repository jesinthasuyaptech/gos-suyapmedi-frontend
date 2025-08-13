import { image_api, var_api } from "../../../constant";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Form, notification, Switch, Row,Button ,Col,Input } from "antd";
import "react-datepicker/dist/react-datepicker.css"; 
import "../styles/Loader.css";
import axios from "axios";
import { CheckOutlined } from "@ant-design/icons";


const HospitalSettings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [activeKey, setActiveKey] = useState(null); 
  const [payload, setPayload] = useState({
    hospital_id: null,
    prescription: 0,
    medical_billing: 0,
    weight: 0,
    height: 0,
    bmi_value: 0,
    bp: 0,
    temp: 0,
    before_sugar: 0,
    after_sugar: 0,
    pulse: 0,
    spo2: 0,
    tax_master: 0,
    created_by_admin:0, 
    created_by_tech :0,
    created_by_patient : 0, 
    list_by_admin : 0, list_by_tech : 0,
   list_by_patient : 0, 
                delete_by_admin :0, delete_by_tech : 0, delete_by_patient : 0, 
                patient_review :0, patient_change_password : 0, patient_email:0,
                appt_dashboard_doctor_filter : 0,appt_dashboard_status_filter :0,updated_by_admin:0,updated_by_patient:0,updated_by_tech :0,
                admin_dashboard_otherappointment :0,
                submit_review_bypatient : 0,
                review_reply_tech :0,
                review_reply_admin : 0,
                cancel_appt_bypatient : 0,
                booked_by_admin_patient_email : 0,
                booked_by_admin_doctor_email : 0,
                booked_by_patient_email : 0,
                cancelled_by_admin_email : 0,
                cancelled_by_doctor_email : 0,
                cancelled_by_patient_email : 0,
                rebooked_by_doctor_email : 0,
                rescheduled_by_admin_doctor_email : 0,
                rescheduled_by_admin_patient_email : 0,
                endsession_by_admin_patient_email : 0,
                endsession_by_doctor_email : 0,
                endsession_by_admin_doctor_email : 0,
                endsession_by_doctor_patient_email : 0,
                medicine_dispatch_patient_email : 0,
                medicine_dispatch_pharmacy_email : 0,
                future_booking_daterange : 0
  });
  const [inputValue, setInputValue] = useState(0);

  
const handleAccordionToggle = (key) => {
  setActiveKey(activeKey === key ? null : key);
};


  //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0aW1lc3RhbXAiOjE3MzUzNzU0MjQ2MzAsImlhdCI6MTczNTM3NTQyNH0.jkA7TNIJzIPxyrmigzrLmVmPz1ZiTDpHf5eTyMvoqjA";
  const fetchsData = async () => {
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
      setData(result || {});
       // Store each key-value pair in localStorage
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value)); // Store as JSON string
      });
    }
      setPayload({
        hospital_id: result?.hospital_id,
        prescription: result?.prescription,
        medical_billing: result?.medical_billing,
        weight: result?.weight,
        height: result?.height,
        bmi_value: result?.bmi_value,
        bp: result?.bp,
        temp: result?.temp,
        before_sugar: result?.before_sugar,
        after_sugar: result?.after_sugar,
        pulse: result?.pulse,
        spo2: result?.spo2,
        tax_master: result?.tax_master,
        created_by_admin : result?.created_by_admin,
         created_by_tech : result?.created_by_tech, 
         created_by_patient : result?.created_by_patient, 
                list_by_admin : result?.list_by_admin,
                 list_by_tech : result?.list_by_tech,
                 list_by_patient : result?.list_by_patient, 
                delete_by_admin : result?.delete_by_admin,
                 delete_by_tech:result?.delete_by_tech, 
                 delete_by_patient : result?.delete_by_patient, 
                patient_review :result?.patient_review, 
                patient_change_password : result?.patient_change_password,
                 patient_email:result?.patient_email,
                 appt_dashboard_doctor_filter :result?.appt_dashboard_doctor_filter,
                 appt_dashboard_status_filter : result?.appt_dashboard_status_filter,
                 updated_by_admin : result?.updated_by_admin,
                 updated_by_patient :result?.updated_by_patient,
                 updated_by_tech : result?.updated_by_tech,
                 admin_dashboard_otherappointment :result?.admin_dashboard_otherappointment,
                 submit_review_bypatient :result?.submit_review_bypatient,
                 review_reply_tech : result?.review_reply_tech,
                 review_reply_admin : result?.review_reply_admin,
                 cancel_appt_bypatient : result?.cancel_appt_bypatient,
                 booked_by_admin_patient_email : result?.booked_by_admin_patient_email,
      booked_by_admin_doctor_email : result?.booked_by_admin_doctor_email,
      booked_by_patient_email :result?.booked_by_patient_email,
      cancelled_by_admin_email :result?.cancelled_by_admin_email,
      cancelled_by_doctor_email :result ?.cancelled_by_doctor_email,
      cancelled_by_patient_email : result?.cancelled_by_patient_email,
      rebooked_by_doctor_email : result?.rebooked_by_doctor_email,
      rescheduled_by_admin_doctor_email :result ?.rescheduled_by_admin_doctor_email,
      rescheduled_by_admin_patient_email : result?.rescheduled_by_admin_patient_email,
      endsession_by_admin_patient_email :result?.endsession_by_admin_patient_email,
      endsession_by_doctor_email :result?.endsession_by_doctor_email,
      endsession_by_admin_doctor_email :result?.endsession_by_admin_doctor_email,
      endsession_by_doctor_patient_email :result?.endsession_by_doctor_patient_email,
      medicine_dispatch_patient_email:result?.medicine_dispatch_patient_email ,
      medicine_dispatch_pharmacy_email :result?.medicine_dispatch_pharmacy_email,
      future_booking_daterange : result?.future_booking_daterange


      })
      console.log("oa", payload, data, result, result?.height == 1, result?.after_sugar == 1 )
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

  useEffect(() => {
    fetchsData();
  }, []);

 useEffect(() => {
  console.log("🔥 Payload updated:", payload);
}, [payload]);
  // useEffect(() => {
  //   console.log("Payload updated:", payload);
  // }, [payload]);

  // useEffect(() => {
  //   if (data) {
  //     setPayload({
  //       hospital_id: data.hospital_id,
  //       prescription: data.prescription,
  //       medical_billing: data.medical_billing,
  //       weight: data.weight,
  //       height: data.height,
  //       bmi_value: data.bmi_value,
  //       bp: data.bp,
  //       temp: data.temp,
  //       before_sugar: data.before_sugar,
  //       after_sugar: data.after_sugar,
  //       pulse: data.pulse,
  //       spo2: data.spo2,
  //     });
  //   }
  // }, [data]);  // Only runs when `data` is updated
  

  // const handleSwitchChange = async (key, value) => {
  //   setLoading(true);
  //   const token = localStorage.getItem("token");
  
  //   // Update payload locally
  //   const updatedPayload = { ...payload, [key]: value ? 1 : 0 };
  //   setPayload(updatedPayload);
  //   console.log("oap", updatedPayload, data.hospital_id)
  
  //   // Make API call
  //   try {
  //     await axios.put(
  //       `${var_api}settings/update/${data?.id}`,
  //       updatedPayload,
  //       {
  //         headers: {
  //           Authorization: `${token}`, // Include the token in the Authorization header
  //         },
  //       }
  //     );
  //     fetchsData();
  //     notification.success({
  //       message: "Success",
  //       description: `${key} updated successfully`,
  //     });
  //   } catch (error) {
  //     notification.warning({
  //       message: "Error",
  //       description: `Failed to update ${key}`,
  //     });
  //   } finally {
  //     setLoading(false); // Ensure loading is stopped after the API call
  //   }
  // };
  const handleSwitchChange = async (key, value) => {
    setLoading(true);
    const token = localStorage.getItem("token");
  
    // Ensure `data` exists and has an `id`
    if (!data || !data.id) {
      notification.error({
        message: "Error",
        description: "Invalid data. Cannot update settings.",
      });
      setLoading(false);
      return;
    }
    console.log("value",value, typeof value)

    const isBoolean = typeof value == "boolean";
    const actualValue = isBoolean ? (value ? 1 : 0) : value;
    // Update payload locally
    setPayload((prevState) => {
      const updatedPayload = { ...prevState, [key]: actualValue };
      console.log("hari",updatedPayload)
      localStorage.setItem("tax_master", JSON.stringify(updatedPayload.tax_master));
      localStorage.setItem("appt_dashboard_status_filter",JSON.stringify(updatedPayload.appt_dashboard_status_filter));
      localStorage.setItem("appt_dashboard_doctor_filter",JSON.stringify(updatedPayload.appt_dashboard_doctor_filter));
      localStorage.setItem("delete_by_admin",JSON.stringify(updatedPayload.delete_by_admin));
      localStorage.setItem("admin_dashboard_otherappointment",JSON.stringify(updatedPayload.admin_dashboard_otherappointment));
      localStorage.setItem("review_reply_admin",JSON.stringify(updatedPayload.review_reply_admin));
      localStorage.setItem("booked_by_admin_patient_email",JSON.stringify(updatedPayload.booked_by_admin_patient_email));
      localStorage.setItem("cancelled_by_admin_email",JSON.stringify(updatedPayload.cancelled_by_admin_email));
      localStorage.setItem("booked_by_admin_doctor_email",JSON.stringify(updatedPayload.booked_by_admin_doctor_email));
      localStorage.setItem("rescheduled_by_admin_doctor_email",JSON.stringify(updatedPayload.rescheduled_by_admin_doctor_email));
      localStorage.setItem("rescheduled_by_admin_patient_email",JSON.stringify(updatedPayload.rescheduled_by_admin_patient_email));
      localStorage.setItem("endsession_by_admin_doctor_email",JSON.stringify(updatedPayload.endsession_by_admin_doctor_email));
      localStorage.setItem("endsession_by_admin_patient_email",JSON.stringify(updatedPayload.endsession_by_admin_patient_email));
      localStorage.setItem("medicine_dispatch_pharmacy_email",JSON.stringify(updatedPayload.medicine_dispatch_pharmacy_email));
      localStorage.setItem("booked_by_patient_email",JSON.stringify(updatedPayload.booked_by_patient_email));
      localStorage.setItem("cancelled_by_patient_email",JSON.stringify(updatedPayload.cancelled_by_patient_email));
      localStorage.setItem("rebooked_by_doctor_email",JSON.stringify(updatedPayload.rebooked_by_doctor_email));
      localStorage.setItem("cancelled_by_doctor_email",JSON.stringify(updatedPayload.cancelled_by_doctor_email));
      localStorage.setItem("endsession_by_doctor_email",JSON.stringify(updatedPayload.endsession_by_doctor_email));
      localStorage.setItem("endsession_by_doctor_patient_email",JSON.stringify(updatedPayload.endsession_by_doctor_patient_email));
      localStorage.setItem("medicine_dispatch_patient_email",JSON.stringify(updatedPayload.medicine_dispatch_patient_email));
      localStorage.setItem("future_booking_daterange",JSON.stringify(updatedPayload.future_booking_daterange));


      
      // Call API after state update
      axios.put(`${var_api}settings/update/${data?.id}`, updatedPayload, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then(() => {
        notification.success({
          message: "Success",
          description: `${key} updated successfully`,
        });
        fetchsData(); // Refresh data after update
      })
      .catch((error) => {
        setLoading(false);
        notification.warning({
          message: "Error",
          description: `Failed to update ${key}`,
        });
        console.error("API error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  
      return updatedPayload;
    });
  };

  // const handleSwitchChange = async (key, value) => {
  //   const token = localStorage.getItem("token");
  //   setLoading(true);
  //   const updatedPayload = { ...payload, [key]: value ? 1 : 0 };
  //   setPayload(updatedPayload); // Update state first
  
  //   try {
  //     await axios.put(`${var_api}settings/update/${data?.id}`, updatedPayload, {
  //       headers: { Authorization: `${token}` },
  //     });
  //     notification.success({ message: "Success", description: `${key} updated successfully` });
  //     fetchsData(); // Refresh data after update
  //   } catch (error) {
  //     notification.error({ message: "Error", description: `Failed to update ${key}` });
  //     console.error("API error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  console.log("tax_master type:", typeof payload?.tax_master, "value:", payload?.tax_master);
  console.log("payload:", payload);
 

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
                <h3 className="page-title">Settings</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">settings</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="accordions clinic-infos" id="list-accord">

          <div className="user-accordion-item">
  <Link
    to="#"
    className="collapsed accordion-wrap"
    onClick={() => handleAccordionToggle('clinic3')}
    // data-bs-toggle="collapse"
    // data-bs-target="#clinic3"
  >
    Vitals
  </Link>
</div>

<div
       className={`accordion-collapse collapse ${activeKey === 'clinic3' ? 'show' : ''}`}
  id="clinic3"
  data-bs-parent="#list-accord"
>
  <div className="create-details-card container" style={{ padding: "1rem" }}>
    {payload ? (
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                  Height:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.height ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.height ? "Yes" : "No"}
                  </span>
                </>
              }
              name="height"
            >
              <Switch
                checked={payload?.height === 1}
                onChange={(checked) => handleSwitchChange("height", checked)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                  Weight:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.weight ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.weight ? "Yes" : "No"}
                  </span>
                </>
              }
              name="weight"
            >
              <Switch
                checked={payload?.weight == 1}
                onChange={(checked) => handleSwitchChange("weight", checked)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                  BMI value:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.bmi_value ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.bmi_value ? "Yes" : "No"}
                  </span>
                </>
              }
              name="bmi_value"
            >
              <Switch
                checked={payload?.bmi_value == 1}
                onChange={(checked) => handleSwitchChange("bmi_value", checked)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                  BP:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.bp ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.bp ? "Yes" : "No"}
                  </span>
                </>
              }
              name="bp"
            >
              <Switch
                checked={payload?.bp == 1}
                onChange={(checked) => handleSwitchChange("bp", checked)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                  Temperature:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.temp ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.temp ? "Yes" : "No"}
                  </span>
                </>
              }
              name="temp"
            >
              <Switch
                checked={payload?.temp == 1}
                onChange={(checked) => handleSwitchChange("temp", checked)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                Heart Rate:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.pulse ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.pulse ? "Yes" : "No"}
                  </span>
                </>
              }
              name="pulse"
            >
              <Switch
                checked={payload?.pulse == 1}
                onChange={(checked) => handleSwitchChange("pulse", checked)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                  SPO2:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.spo2 ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.spo2 ? "Yes" : "No"}
                  </span>
                </>
              }
              name="spo2"
            >
              <Switch
                checked={payload?.spo2 == 1}
                onChange={(checked) => handleSwitchChange("spo2", checked)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                  Before Sugar:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.before_sugar ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.before_sugar ? "Yes" : "No"}
                  </span>
                </>
              }
              name="before_sugar"
            >
              <Switch
                checked={payload?.before_sugar == 1}
                onChange={(checked) => handleSwitchChange("before_sugar", checked)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={
                <>
                  After Sugar:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.after_sugar ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.after_sugar ? "Yes" : "No"}
                  </span>
                </>
              }
              name="after_sugar"
            >
              <Switch
                checked={payload?.after_sugar == 1}
                onChange={(checked) => handleSwitchChange("after_sugar", checked)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    ) : (
      <p>Loading...</p>
    )}
  </div>
</div>


<div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        onClick={() => handleAccordionToggle('clinic2')}
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic2"
                                                    >
                                                        Medical History
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
       className={`accordion-collapse collapse ${activeKey === 'clinic2' ? 'show' : ''}`}
  id="clinic2"
  data-bs-parent="#list-accord"
>
  <div className="create-details-card">
    <Form>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={
              <>
                Prescription:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: payload?.prescription ? "green" : "red",
                    marginLeft: "10px",
                  }}
                >
                  {payload?.prescription ? "Yes" : "No"}
                </span>
              </>
            }
            name="prescription"
          >
            <Switch
              checked={payload?.prescription}
              onChange={(checked) =>
                handleSwitchChange("prescription", checked)
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={
              <>
                Medical Billing:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: payload?.medical_billing ? "green" : "red",
                    marginLeft: "10px",
                  }}
                >
                  {payload?.medical_billing ? "Yes" : "No"}
                </span>
              </>
            }
            name="medical_billing"
          >
            <Switch
              checked={payload?.medical_billing == 1}
              onChange={(checked) =>
                handleSwitchChange("medical_billing", checked)
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </div>
</div>

<div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        onClick={() => handleAccordionToggle('clinic4')}
                                                    >
                                                        Master
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                  className={`accordion-collapse collapse ${activeKey === 'clinic4' ? 'show' : ''}`}
id="clinic4"
                                            data-bs-parent="#list-accord">
                             <div className="create-details-card">
                             <Form>
  <Form.Item
    label={
      <>
        Tax master:{" "}
        <span
          style={{
            fontWeight: "bold",
            color: payload?.tax_master ? "green" : "red",
            marginLeft: "10px",
          }}
        >
          {payload?.tax_master ? "Yes" : "No"}
        </span>
      </>
    }
    name="tax_master"
  >
<Switch
  checked={Boolean(payload?.tax_master ?? 0)} // Ensure a default value of 0 if undefined
  onChange={(checked) => handleSwitchChange("tax_master", checked ? 1 : 0)}
/>
  </Form.Item>
</Form>
   </div>
</div>
<div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic5"
                                                        onClick={() => handleAccordionToggle('clinic5')}

                                                    >
                                                        Patient
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                 className={`accordion-collapse collapse ${activeKey === 'clinic5' ? 'show' : ''}`}
                                            id="clinic5"
                                            data-bs-parent="#list-accord">
 <div className="create-details-card">
  <Row gutter={[16, 16]}>
    {/* Patient Review */}
    <Col xs={24} sm={12} md={8}>
      <Form>
        <Form.Item
          label={
            <>
              Patient Review:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.patient_review ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.patient_review ? "Yes" : "No"}
              </span>
            </>
          }
          name="patient_review"
        >
          <Switch
            checked={Boolean(payload?.patient_review ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("patient_review", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>

    {/* Patient Change Password */}
    <Col xs={24} sm={12} md={8}>
      <Form>
        <Form.Item
          label={
            <>
              Patient Change Password:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.patient_change_password ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.patient_change_password ? "Yes" : "No"}
              </span>
            </>
          }
          name="patient_change_password"
        >
          <Switch
            checked={Boolean(payload?.patient_change_password ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("patient_change_password", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>

    {/* Patient Email */}
    <Col xs={24} sm={12} md={8}>
      <Form>
        <Form.Item
          label={
            <>
              Patient Email:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.patient_email ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.patient_email ? "Yes" : "No"}
              </span>
            </>
          }
          name="patient_email"
        >
          <Switch
            checked={Boolean(payload?.patient_email ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("patient_email", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>

    <Col xs={24} sm={12} md={8}>
      <Form>
      <Form.Item
  label={`Patient future booking: ${payload.future_booking_daterange}`}
  name="future_booking_daterange"
>
  <Input
    type="number"
    min={0}
    max={1}
    value={inputValue}
    onChange={(e) => {
    const value = Number(e.target.value); // This will now log the correct value
    setInputValue(value);
  }}
    addonAfter={
      <Button
      icon={<CheckOutlined />}
      onClick={() => {
        setPayload((prev) => ({
          ...prev,
          future_booking_daterange: inputValue, // ← This line updates the payload!
        }));
        handleSwitchChange("future_booking_daterange", inputValue);
      }}
      
    />
    
    }
  />
</Form.Item>

      </Form>
    </Col>
  </Row>
</div>
   </div>

   <div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic6"
                                                        onClick={() => handleAccordionToggle('clinic6')}

                                                    >
                                                        Medical Record
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                 className={`accordion-collapse collapse ${activeKey === 'clinic6' ? 'show' : ''}`}

                                            id="clinic6"
                                            data-bs-parent="#list-accord">
<div className="create-details-card" style={{ display: "flex", gap: "20px" }}>
  {["Created", "List", "Delete", "Updated"].map((category) => (
    <div key={category} style={{ flex: 1, minWidth: "250px" }}>
      <h3>{category}</h3>
      {[
        { key: "created_by_admin", label: "Created by Admin", category: "Created" },
        { key: "created_by_tech", label: "Created by Tech", category: "Created" },
        { key: "created_by_patient", label: "Created by Patient", category: "Created" },
        { key: "list_by_admin", label: "List by Admin", category: "List" },
        { key: "list_by_tech", label: "List by Tech", category: "List" },
        { key: "list_by_patient", label: "List by Patient", category: "List" },
        { key: "delete_by_admin", label: "Delete by Admin", category: "Delete" },
        { key: "delete_by_tech", label: "Delete by Tech", category: "Delete" },
        { key: "delete_by_patient", label: "Delete by Patient", category: "Delete" },
        { key: "updated_by_admin", label: "Update by Admin", category: "Updated" },
        { key: "updated_by_patient", label: "Update by Patient", category: "Updated" },
        { key: "updated_by_tech", label: "Update by Tech", category: "Updated" },
      ]
        .filter((item) => item.category === category)
        .map(({ key, label }) => (
          <Form key={key}>
            <Form.Item
              label={
                <>
                  {label}:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: payload?.[key] ? "green" : "red",
                      marginLeft: "10px",
                    }}
                  >
                    {payload?.[key] ? "Yes" : "No"}
                  </span>
                </>
              }
              name={key}
            >
              <Switch
                checked={Boolean(payload?.[key] ?? 0)}
                onChange={(checked) => handleSwitchChange(key, checked ? 1 : 0)}
              />
            </Form.Item>
          </Form>
        ))}
    </div>
  ))}
</div>


</div>

<div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic7"
                                                        onClick={() => handleAccordionToggle('clinic7')}

                                                    >
                                                        Appointment
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                 className={`accordion-collapse collapse ${activeKey === 'clinic7' ? 'show' : ''}`}

                                            id="clinic7"
                                            data-bs-parent="#list-accord">
<div className="create-details-card">
  <Row gutter={[16, 16]}>
    {/* Appt Dashboard Doctor Filter */}
    <Col xs={24} sm={12}>
      <Form>
        <Form.Item
          label={
            <>
              Appt Dashboard Doctor Filter:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.appt_dashboard_doctor_filter ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.appt_dashboard_doctor_filter ? "Yes" : "No"}
              </span>
            </>
          }
          name="appt_dashboard_doctor_filter"
        >
          <Switch
            checked={Boolean(payload?.appt_dashboard_doctor_filter ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("appt_dashboard_doctor_filter", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>

    {/* Appt Dashboard Status Filter */}
    <Col xs={24} sm={12}>
      <Form>
        <Form.Item
          label={
            <>
              Appt Dashboard Status Filter:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.appt_dashboard_status_filter ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.appt_dashboard_status_filter ? "Yes" : "No"}
              </span>
            </>
          }
          name="appt_dashboard_status_filter"
        >
          <Switch
            checked={Boolean(payload?.appt_dashboard_status_filter ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("appt_dashboard_status_filter", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>

    {/* Other Appt Dashboard */}
    <Col xs={24} sm={12}>
      <Form>
        <Form.Item
          label={
            <>
              Other Appt Dashboard:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.admin_dashboard_otherappointment ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.admin_dashboard_otherappointment ? "Yes" : "No"}
              </span>
            </>
          }
          name="admin_dashboard_otherappointment"
        >
          <Switch
            checked={Boolean(payload?.admin_dashboard_otherappointment ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("admin_dashboard_otherappointment", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>

    {/* Cancel Appt by Patient */}
    <Col xs={24} sm={12}>
      <Form>
        <Form.Item
          label={
            <>
              Cancel Appt by Patient:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.cancel_appt_bypatient ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.cancel_appt_bypatient ? "Yes" : "No"}
              </span>
            </>
          }
          name="cancel_appt_bypatient"
        >
          <Switch
            checked={Boolean(payload?.cancel_appt_bypatient ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("cancel_appt_bypatient", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>
  </Row>
</div>
   </div>

   <div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic8"
                                                        onClick={() => handleAccordionToggle('clinic8')}

                                                    >
                                                        Review
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                  className={`accordion-collapse collapse ${activeKey === 'clinic8' ? 'show' : ''}`}

                                            id="clinic8"
                                            data-bs-parent="#list-accord">
  <div className="create-details-card">
  <Row gutter={[16, 16]}>
    {/* Submit Review By Patient */}
    <Col xs={24} sm={12} md={8}>
      <Form>
        <Form.Item
          label={
            <>
              Submit Review By Patient:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.submit_review_bypatient ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.submit_review_bypatient ? "Yes" : "No"}
              </span>
            </>
          }
          name="submit_review_bypatient"
        >
          <Switch
            checked={Boolean(payload?.submit_review_bypatient ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("submit_review_bypatient", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>

    {/* Review Reply Tech */}
    <Col xs={24} sm={12} md={8}>
      <Form>
        <Form.Item
          label={
            <>
              Review Reply Tech:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.review_reply_tech ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.review_reply_tech ? "Yes" : "No"}
              </span>
            </>
          }
          name="review_reply_tech"
        >
          <Switch
            checked={Boolean(payload?.review_reply_tech ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("review_reply_tech", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>

    {/* Review Reply Admin */}
    <Col xs={24} sm={12} md={8}>
      <Form>
        <Form.Item
          label={
            <>
              Review Reply Admin:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: payload?.review_reply_admin ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {payload?.review_reply_admin ? "Yes" : "No"}
              </span>
            </>
          }
          name="review_reply_admin"
        >
          <Switch
            checked={Boolean(payload?.review_reply_admin ?? 0)}
            onChange={(checked) =>
              handleSwitchChange("review_reply_admin", checked ? 1 : 0)
            }
          />
        </Form.Item>
      </Form>
    </Col>
  </Row>
</div>
   </div>

   <div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic9"
                                                        onClick={() => handleAccordionToggle('clinic9')}

                                                    >
                                                        Email for booking
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                 className={`accordion-collapse collapse ${activeKey === 'clinic9' ? 'show' : ''}`}

                                            id="clinic9"
                                            data-bs-parent="#list-accord">
                             <div className="create-details-card">
                             <Form layout="vertical">
  <Row gutter={16}>
    <Col span={8}>
      <Form.Item
        label={
          <>
            Booked by admin patient email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.booked_by_admin_patient_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.booked_by_admin_patient_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="booked_by_admin_patient_email"
      >
        <Switch
          checked={Boolean(payload?.booked_by_admin_patient_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("booked_by_admin_patient_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>

    <Col span={8}>
      <Form.Item
        label={
          <>
            Booked by admin doctor email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.booked_by_admin_doctor_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.booked_by_admin_doctor_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="booked_by_admin_doctor_email"
      >
        <Switch
          checked={Boolean(payload?.booked_by_admin_doctor_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("booked_by_admin_doctor_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>

    <Col span={8}>
      <Form.Item
        label={
          <>
            Booked by patient email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.booked_by_patient_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.booked_by_patient_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="booked_by_patient_email"
      >
        <Switch
          checked={Boolean(payload?.booked_by_patient_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("booked_by_patient_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>
  </Row>
</Form>
   </div>
   </div>

   <div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic10"
                                                        onClick={() => handleAccordionToggle('clinic10')}

                                                    >
                                                        Email for cancelled
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                  className={`accordion-collapse collapse ${activeKey === 'clinic10' ? 'show' : ''}`}

                                            id="clinic10"
                                            data-bs-parent="#list-accord">
                             <div className="create-details-card">
                             <Form layout="vertical">
  <Row gutter={16}>
    <Col span={8}>
      <Form.Item
        label={
          <>
            Cancelled by admin email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.cancelled_by_admin_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.cancelled_by_admin_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="cancelled_by_admin_email"
      >
        <Switch
          checked={Boolean(payload?.cancelled_by_admin_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("cancelled_by_admin_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>

    <Col span={8}>
      <Form.Item
        label={
          <>
            Cancelled by doctor email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.cancelled_by_doctor_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.cancelled_by_doctor_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="cancelled_by_doctor_email"
      >
        <Switch
          checked={Boolean(payload?.cancelled_by_doctor_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("cancelled_by_doctor_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>

    <Col span={8}>
      <Form.Item
        label={
          <>
            Cancelled by patient email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.cancelled_by_patient_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.cancelled_by_patient_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="cancelled_by_patient_email"
      >
        <Switch
          checked={Boolean(payload?.cancelled_by_patient_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("cancelled_by_patient_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>
  </Row>
</Form>
   </div>
   </div>

   <div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic11"
                                                        onClick={() => handleAccordionToggle('clinic11')}

                                                    >
                                                        Email for Rebooked
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                 className={`accordion-collapse collapse ${activeKey === 'clinic11' ? 'show' : ''}`}

                                            id="clinic11"
                                            data-bs-parent="#list-accord">
                             <div className="create-details-card">
                             <Form>
  <Form.Item
    label={
      <>
       Rebooked by doctor email:{" "}
        <span
          style={{
            fontWeight: "bold",
            color: payload?.rebooked_by_doctor_email ? "green" : "red",
            marginLeft: "10px",
          }}
        >
          {payload?.rebooked_by_doctor_email ? "Yes" : "No"}
        </span>
      </>
    }
    name="rebooked_by_doctor_email"
  >
<Switch
  checked={Boolean(payload?.rebooked_by_doctor_email ?? 0)} // Ensure a default value of 0 if undefined
  onChange={(checked) => handleSwitchChange("rebooked_by_doctor_email", checked ? 1 : 0)}
/>
  </Form.Item>
</Form>
   </div>
   </div>

   <div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic12"
                                                        onClick={() => handleAccordionToggle('clinic12')}

                                                    >
                                                        Email for Rescheduled
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                  className={`accordion-collapse collapse ${activeKey === 'clinic12' ? 'show' : ''}`}

                                            id="clinic12"
                                            data-bs-parent="#list-accord">
                             <div className="create-details-card">
                             <Form layout="vertical">
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        label={
          <>
            Rescheduled by admin patient email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.rescheduled_by_admin_patient_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.rescheduled_by_admin_patient_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="rescheduled_by_admin_patient_email"
      >
        <Switch
          checked={Boolean(payload?.rescheduled_by_admin_patient_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("rescheduled_by_admin_patient_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item
        label={
          <>
            Rescheduled by admin doctor email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.rescheduled_by_admin_doctor_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.rescheduled_by_admin_doctor_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="rescheduled_by_admin_doctor_email"
      >
        <Switch
          checked={Boolean(payload?.rescheduled_by_admin_doctor_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("rescheduled_by_admin_doctor_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>
  </Row>
</Form>
   </div>
   </div>

   <div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic13"
                                                        onClick={() => handleAccordionToggle('clinic13')}

                                                    >
                                                        Email for Endsession
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                              className={`accordion-collapse collapse ${activeKey === 'clinic13' ? 'show' : ''}`}

                                            id="clinic13"
                                            data-bs-parent="#list-accord">
                             <div className="create-details-card">
                             <Form layout="vertical">
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        label={
          <>
           Endsession by admin patient email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.endsession_by_admin_patient_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.endsession_by_admin_patient_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="endsession_by_admin_patient_email"
      >
        <Switch
          checked={Boolean(payload?.endsession_by_admin_patient_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("endsession_by_admin_patient_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item
        label={
          <>
            Endsession by admin doctor_email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.endsession_by_admin_doctor_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.endsession_by_admin_doctor_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="endsession_by_admin_doctor_email"
      >
        <Switch
          checked={Boolean(payload?.endsession_by_admin_doctor_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("endsession_by_admin_doctor_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        label={
          <>
            Endsession by doctor email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.endsession_by_doctor_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.endsession_by_doctor_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="endsession_by_doctor_email"
      >
        <Switch
          checked={Boolean(payload?.endsession_by_doctor_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("endsession_by_doctor_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        label={
          <>
            Endsession by doctor patient email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.endsession_by_doctor_patient_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.endsession_by_doctor_patient_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="endsession_by_doctor_patient_email"
      >
        <Switch
          checked={Boolean(payload?.endsession_by_doctor_patient_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("endsession_by_doctor_patient_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>
  </Row>
</Form>
   </div>
   </div>

   
   <div className="user-accordion-item">
                                                    <Link
                                                        to="#"
                                                        className="collapsed accordion-wrap"
                                                        // data-bs-toggle="collapse"
                                                        // data-bs-target="#clinic14"
                                                        onClick={() => handleAccordionToggle('clinic14')}

                                                    >
                                                        Email for Medicine Dispatch
                                                        {/* <span>Delete</span> */}
                                                    </Link>
                                                    </div>
                                                    <div
                                                  className={`accordion-collapse collapse ${activeKey === 'clinic14' ? 'show' : ''}`}

                                            id="clinic14"
                                            data-bs-parent="#list-accord">
                             <div className="create-details-card">
                             <Form layout="vertical">
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        label={
          <>
          Medicine Dispatch Patient Email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.medicine_dispatch_patient_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.medicine_dispatch_patient_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="medicine_dispatch_patient_email"
      >
        <Switch
          checked={Boolean(payload?.medicine_dispatch_patient_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("medicine_dispatch_patient_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item
        label={
          <>
           Medicine dispatch pharmacy email:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: payload?.medicine_dispatch_pharmacy_email ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              {payload?.medicine_dispatch_pharmacy_email ? "Yes" : "No"}
            </span>
          </>
        }
        name="medicine_dispatch_pharmacy_email"
      >
        <Switch
          checked={Boolean(payload?.medicine_dispatch_pharmacy_email ?? 0)}
          onChange={(checked) =>
            handleSwitchChange("medicine_dispatch_pharmacy_email", checked ? 1 : 0)
          }
        />
      </Form.Item>
    </Col>
  </Row>
</Form>
   </div>
   </div>
  
   

                                                    

          </div>


        </div>
      </div>

   
    </>
  );
};

export default HospitalSettings;


// import { image_api, var_api } from "../../../constant";
// import { Link, useHistory } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import SidebarNav from "../sidebar";
// import { Form, notification, Switch, Row, Col } from "antd";
// import axios from "axios";
// import "react-datepicker/dist/react-datepicker.css";
// import "../styles/Loader.css";

// const HospitalSettings = () => {
//   const history = useHistory();
//   const [loading, setLoading] = useState(false);
//   const [payload, setPayload] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     const hospital_id = localStorage.getItem("hospital_id");
//     try {
//       const response = await fetch(`${var_api}settings/getby-hospital/${hospital_id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${token}`,
//         },
//       });
//       if (response.status === 401) {
//         history.push("/admin/login");
//         notification.warning({
//           message: "Unauthorized",
//           description: "Your session has expired. Please log in again.",
//         });
//         return;
//       }
//       if (!response.ok) throw new Error("Failed to fetch data");
//       const result = await response.json();
//       setPayload(result);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       notification.error({
//         message: "Fetch Failed",
//         description: "Unable to retrieve data. Please try again later.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSwitchChange = async (key, value) => {
//     if (!payload) return;
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     const updatedPayload = { ...payload, [key]: value ? 1 : 0 };
//     setPayload(updatedPayload);
//     try {
//       await axios.put(`${var_api}settings/update/${payload.id}`, updatedPayload, {
//         headers: {
//           Authorization: `${token}`,
//         },
//       });
//       notification.success({
//         message: "Success",
//         description: `${key.replace("_", " ")} updated successfully`,
//       });
//     } catch (error) {
//       notification.warning({
//         message: "Error",
//         description: `Failed to update ${key.replace("_", " ")}`,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <SidebarNav />
//       <div className="page-wrapper">
//         <div className="content container-fluid">
//           <div className="page-header">
//             <h3 className="page-title">Settings</h3>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
//               <li className="breadcrumb-item active">Settings</li>
//             </ul>
//           </div>

//           <div className="create-details-card" style={{ maxWidth: "75%", margin: "auto" }}>
//             {payload ? (
//               <Form layout="vertical">
//                 <Row gutter={16}>
//                   {["height", "weight", "bmi_value", "bp", "temp", "pulse", "spo2", "before_sugar", "after_sugar"].map((key) => (
//                     <Col span={8} key={key}>
//                       <Form.Item
//                         label={
//                           <>
//                             {key.replace("_", " ").toUpperCase()}: {" "}
//                             <span style={{ fontWeight: "bold", color: payload[key] ? "green" : "red", marginLeft: "10px" }}>
//                               {payload[key] ? "Yes" : "No"}
//                             </span>
//                           </>
//                         }
//                         name={key}
//                         valuePropName="checked"
//                       >
//                         <Switch checked={payload[key] === 1} onChange={(checked) => handleSwitchChange(key, checked)} />
//                       </Form.Item>
//                     </Col>
//                   ))}
//                 </Row>

//                 <Row gutter={16}>
//                   {["prescription", "medical_billing"].map((key) => (
//                     <Col span={12} key={key}>
//                       <Form.Item
//                         label={
//                           <>
//                             {key.replace("_", " ").toUpperCase()}: {" "}
//                             <span style={{ fontWeight: "bold", color: payload[key] ? "green" : "red", marginLeft: "10px" }}>
//                               {payload[key] ? "Yes" : "No"}
//                             </span>
//                           </>
//                         }
//                         name={key}
//                         valuePropName="checked"
//                       >
//                         <Switch checked={payload[key] === 1} onChange={(checked) => handleSwitchChange(key, checked)} />
//                       </Form.Item>
//                     </Col>
//                   ))}
//                 </Row>
//               </Form>
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HospitalSettings;
