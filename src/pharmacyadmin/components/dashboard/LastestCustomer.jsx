import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag,Form} from "antd";
import { var_api } from "../../../constant";
import Header from "../header";
import { useHistory } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";

  const LatestCustomer = () => {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hospitalform] = Form.useForm();
  const [hospitalresult, sethospitalresult] = useState([]);
  const history = useHistory();
  
 

  useEffect(() => {
    fetchLatestCustomers();
    fetchData();
  }, []);

  const fetchLatestCustomers = async () => {
    const token = localStorage.getItem("pres_token");
    const hospital_id = localStorage.getItem("pres_hospital_id");

    try {
      const response = await axios.get(
        `${var_api}medicalbilling/top-five-bills/${hospital_id}`,
        {
          headers: { Authorization: token },
        }
      );
      
    if (response.status === 401) {
      history.push("pharmacyadmin/pharmacyLogin"); // Redirect to login page
      notification.warning({
        message: "Unauthorized",
        description: "Your session has expired. Please log in again.",
      });
      return;
    }

      if (response.data && Array.isArray(response.data)) {
        setCustomers(response.data);
      }
    } catch (err) {
      console.error("Error fetching latest customers:", err);
    }
  };

   const fetchData = async () => {
     const token = localStorage.getItem("pres_token");
     const hopital_id = localStorage.getItem("pres_hospital_id");
     // const hospital_id = localStorage.getItem("hospital_id");
 
     // setLoading(true);
     try {
       const response = await fetch(`${var_api}hospital/get/${hopital_id}`, {
         headers: {
           "Content-Type": "application/json",
           Authorization: token,
         },
       });
       if (response.status === 401) {
        history.push("pharmacyadmin/pharmacyLogin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }

       if (!response.ok) throw new Error("Failed to fetch data");
       const result = await response.json();
       localStorage.setItem("pres_hospital_profile", result.profile_image);
       localStorage.setItem("pres_appointment_prefix", result.appointment_prefix || "");
    
       localStorage.setItem("pres_invoiced_prefix", result.doctorinvoice_prefix);
       localStorage.setItem("pres_invoicem_prefix", result.medicalinvoice_prefix);
       localStorage.setItem("pres_prescription_prefix", result.prescriptionid_prefix);
       localStorage.setItem("pres_patient_prefix", result.patient_prefix);
       localStorage.setItem("pres_hospital_country", result.country);
       localStorage.setItem("pres_hospital_state", result.state);
       localStorage.setItem("pres_hospital_name", result.name);
       localStorage.setItem("pres_hospital_mobile", result.mobile);
       localStorage.setItem("pres_hospital_address", result.address);
       console.log("harini",result);
       // setData(result.data || []);
       // setFilteredData(result.data || []); // Set initial filtered data
       // setLoading(false);
       sethospitalresult(result);
     } catch (error) {
       console.error("Error fetching data:", error);
       // notification.error({
       //   message: "Fetch Failed",
       //   description: "Unable to retrieve data. Please try again later.",
       // });
     } finally {
       // setLoading(false);
     }
   };


  const columns = [
    { 
      title: "#", 
      key: "sno", 
      render: (_, __, index) => index + 1 
    },
    {
      title: "Appt no",
      dataIndex: "appointment_token_no",
      key: "appointment_token_no",
      render: (text) => {
        const prefix = localStorage.getItem("pres_appointment_prefix") || "";
        return (
          <span className="text-primary">
            {`${prefix}${text}`}
          </span>
        );
      }
    },
    

    { title: "Doctor Name", dataIndex: "doctor_name", key: "doctor_name" },
    // { 
    //   title: "Doctor Image", 
    //   dataIndex: "doctor_image", 
    //   key: "doctor_image", 
    //   render: (text) => text ? <img src={text} alt="Doctor" style={{ width: 50, height: 50, borderRadius: "50%" }} /> : "N/A"
    // },
    { title: "Patient Name", dataIndex: "patient_name", key: "patient_name" },
    { title: "Patient Mobile", dataIndex: "patient_mobile", key: "patient_mobile" },
    { 
      title: "Paid Status", 
      dataIndex: "paid_status", 
      key: "paid_status", 
      render: (status) => (
        <Tag color={status === 1 ? "green" : status === 2 ? "orange" : "red"}>
          {status === 1 ? "Paid" : status === 2 ? "Partial" : "Unpaid"}
        </Tag>
      )
    },
    { title: "Subtotal (₹)", dataIndex: "subtotal", key: "subtotal" },
    { 
      title: "Tax Amount (₹)", 
      dataIndex: "tax_amount", 
      key: "tax_amount",
      render: (amount) => amount ? parseFloat(amount).toFixed(2) : "0.00"
    },
    { 
      title: "Total Amount (₹)", 
      dataIndex: "total_amount", 
      key: "total_amount",
      render: (amount) => amount ? parseFloat(amount).toFixed(2) : "0.00"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 0 ? "blue" : status === 1 ? "orange" : "green"}>
          {status === 0 ? "New" : status === 1 ? "In Progress" : "Completed"}
        </Tag>
      )
    }
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-table">
          <div className="card-header">
            <h4 className="card-title">Recent Billing Records</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={customers.map((item) => ({ ...item, key: item.id }))}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestCustomer;
