import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import SidebarNav from "../sidebar";
import { Table, Modal, Button,Form,notification,Input,Checkbox, Select  } from "antd"; // Import Checkbox
import axios from "axios";
import moment from "moment";
import { FaFileInvoice } from "react-icons/fa";
import {
  itemRender,
  onShowSizeChange,
} from "../../../pharmacyadmin/components/paginationfunction";
import { var_api } from "../../../constant";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"; 


const Billing = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [billingData, setBillingData] = useState([]); // State to store fetched data
  const [billingDatamedi, setBillingDatamedi] = useState([]); // State to store fetched data
  const [selectedPaymentModes, setSelectedPaymentModes] = useState([]); // State for selected payment modes
  const [currentBillingId, setCurrentBillingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modefiltereddata, setmodeFilteredData] = useState([]);
  const [selectedamount,setSelectedamount]= useState(null)
  const[status,setStatus]=useState(0);
  const [selectedStatus, setSelectedstatus] = useState(3);
   const [paymode, setpaymode] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalVisibleInv, setIsModalVisibleInv] = useState(false);
  const [pageSize, setPageSize] = useState(10); 
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [invoice,setInvoice] = useState([]);
  const [invoicefiltereddata,setInvoicefiltereddata]=useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [calculatatedpaymode,setCalculatatedpaymode]=useState([]);   
  const [showPaymode, setShowPaymode] = useState(false);
  const mediPrefix = localStorage.getItem("pres_invoicem_prefix"); 
  const [editedItems, setEditedItems] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const medicine_dispatch_pharmacy_email = localStorage.getItem("medicine_dispatch_pharmacy_email") === "1";
  const medicine_dispatch_patient_email = localStorage.getItem("medicine_dispatch_patient_email") === "1";
  const doctorEmailFromStorage = localStorage.getItem("email");

  const userData = {
    email_id: "ejsi67@gmail.com",
    password: "1234"
  };
  localStorage.setItem("email", userData.email_id);
  
  const options = [
    { value: 3, label: "All" },
    { value: 0, label: "Notpaid" },
    { value: 1, label: "paid" },
    { value: 2, label: "partial" },
  ];

  const getStatusLabel = (value) => {
    switch (value) {
      case 0:
        return "Not Paid";
      case 1:
        return "Paid";
      case 2:
        return "Partial";
      default:
        return "Unknown";
    }
  };
 
  
console.log("hert",billingData)
  const handleInputChange = (index, value) => {
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
    setTotalAmount(updatedTotal);
  
    // Debug: Final state logs
    console.log("Final Payment Details:", updatedPaymentDetails);
    console.log("Final Total Amount:", updatedTotal);
  };


  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const handleInvoiceClick = (record) => {
    setSelectedInvoice(record);
    setEditedItems(record.items || []);  // Initialize editable data
    setIsModalVisibleInv(true); // Open modal
  };

  const handleModalCloseInv = () => {
    setIsModalVisibleInv(false);
    setSelectedInvoice(null);
  };
  
  // Handle input change for given and received qty
  const handleInputChangeInv = (index, field, value) => {
    const updatedItems = [...billingDatamedi];
    updatedItems[index][field] = value;

    // Check qty_status condition
    updatedItems[index].qty_status = updatedItems[index].qty === Number(value) ? 1 : 0;
    setBillingDatamedi(updatedItems);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("pres_token");

    const payload = {
      medical_billing_id: selectedInvoice.invoice_id,
      items: billingDatamedi.map((item) => ({
        id: item.id,
        received_qty: item.received_qty,
        qty_status: item.qty_status,
      })),
    };

    try {
      await axios.put(`${var_api}medicalbillingdetail/update-medicine-adjustment`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },      });
        notification.success({
          message: "Update Successful",
          description: "Medicine adjustment updated successfully.",
        });
  
      setIsEditing(false);
      setIsModalVisibleInv(false); // Close modal after success
    } catch (error) {
      console.error("Error updating data:", error);

      // Show error notification
      notification.error({
        message: "Update Failed",
        description: "Something went wrong while updating.",
      });
    }
  };

  const fetchDatapre = async () => {
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
      console.log("pres_invoicem_prefix",pres_invoicem_prefix)
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
  

  const getMedicineData = async (id) => {
    const token = localStorage.getItem("pres_token");

    setLoading(true);
    try {
      const response = await axios.get(`${var_api}medicalbilling/getdetails/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setBillingDatamedi(response.data.items || []);
      setSelectedInvoice(response.data);
      setIsModalVisibleInv(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const fetchData = async (date) => {
    const token = localStorage.getItem("pres_token");
    setLoading(true);
    // Format the date to YYYY-MM-DD using moment
const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
try {
  const response = await fetch(`${var_api}medicalbilling/medical-invoices-by-today/${hospital_id}/${formattedDate}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!response.ok) {
    // Check for 404 status code
    if (response.status === 404) {
      // Reset the data and filtered data if 404 is encountered
      setData([]);  // Clear the data
      setBillingData([]);  // Clear the filtered data
    }
    throw new Error("Failed to fetch data");
  }

  const result = await response.json();
  setData(result || []);  // Set the fetched data
  setBillingData(result || []);  // Set the filtered data
  setLoading(false);
}
 catch (error) {
      console.error("Error fetching data:", error);
      // notification.error({
      //   message: "Fetch Failed",
      //   description: "Unable to retrieve data. Please try again later.",
      // });
      setBillingData([]); 
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoice = async (id) => {
    setLoading(true);
    const token = localStorage.getItem('pres_token');
    const hospital_id = localStorage.getItem('pres_hospital_id');
    try {
      const response = await fetch(`${var_api}medicalbillingPaymode/get/${hospital_id}/${id}`, {
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
     console.log("harini",  selectedRecord) 

      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setInvoice([]);
      setInvoice(result || []);
      setInvoicefiltereddata(result || []); // Set initial filtered data
      setLoading(false);
      // Iterate over filteredData and match paymode_id with result
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
setTotalAmount(totalPaidAmount);



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





      const fetchpaymode = async () => {
        setLoading(true);
        const token = localStorage.getItem('pres_token');
        const hospital_id = localStorage.getItem('pres_hospital_id');
        try {
          const response = await fetch(`${var_api}paymodemaster/get-by-active/${hospital_id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          });
          if (response.status === 401) {
            history.push("/pharmacyadmin/pharmacyLogin");
            notification.warning({
              message: "Unauthorized",
              description: "Your session has expired. Please log in again.",
            });
          return
          }
         
    
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
           setpaymode(result || []);
          setmodeFilteredData(result || []); // Set initial filtered data
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
           setmodeFilteredData([]);
          // notification.error({
          //   message: "Fetch Failed",
          //   description: "Unable to retrieve data. Please try again later.",
          // });
        } finally {
            setLoading(false);
        }
      };

  const showModal = (billingId) => {
    console.log("billing", billingId);
    setCurrentBillingId(billingId);
    //setIsModalVisible(true);
    setShowPaymode(true);
    setSelectedRecord(billingId); // Pass the record to the modal
    setSelectedamount(billingId);
    setpaymode();
    setInvoice(billingId.appointment_id);
    fetchInvoice(billingId.appointment_id);
    setStatus(billingId.paid_status);
  };

  const handleOk = () => {
    if (!currentBillingId) {
      console.error("No billing ID selected.");
      return;
    }
  
    if (selectedPaymentModes.length === 0) {
      alert("Please select at least one payment mode.");
      return;
    }
  
    const paymentModesString = selectedPaymentModes.join(", ");
    console.log("Selected Payment Modes:", paymentModesString);
  
    axios
      .put(`${var_api}medicalbilling/updatepayment/${currentBillingId}/1/${selectedPaymentModes}`)
      .then((response) => {
        console.log("Payment processed:", response.data);
  
        // Update the local billing data
        const updatedData = billingData.map((billing) =>
          billing.id === currentBillingId
            ? { ...billing, paid_status: 1,pay_mode: selectedPaymentModes }
            : billing
        );
        setBillingData(updatedData);
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Error processing payment:", error);
      });
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePaymentModeChange = (mode, checked) => {
    if (checked) {
      setSelectedPaymentModes([...selectedPaymentModes, mode]);
    } else {
      setSelectedPaymentModes(
        selectedPaymentModes.filter((item) => item !== mode)
      );
    }
  };

  const handleModalClose = () => {
   // setIsModalVisible(false);
   setShowPaymode(false);
    setSelectedRecord(null);
  };


   //send email for rebook
    const sendEmailMedicine = async () => {
  
      const toemails = [
        currentBillingId?.patient_email,
        doctorEmailFromStorage // instead of currentBillingId?.doctor_email
      ];
      // Prepare the request body
      const requestData = {
        to: toemails,
        subject: "Medicine Dispatch",
        text: "Your Medicine has been dispatched.",
      };
  
      try {
        const response = await axios.post(
          `${var_api}email-notify/medicine-dispatch/${currentBillingId?.appointment_id}`,
          requestData
        );
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };
    

    const handleFormSubmit = async () => {
      let paidStatus;
      if (selectedRecord && totalAmount) {
        if (parseFloat(totalAmount) < selectedRecord.total_amount) {
          console.log(2); // Less than final_amount
          paidStatus = 2;
        } else {
          console.log(1); // Greater than or equal to final_amount
          paidStatus = 1;
        }
      } else {
        console.log("Please enter a valid amount"); // Handle edge cases
      }
    
      const payload = {
        invoice_token: selectedRecord?.invoice_token,
        hospital_id: selectedRecord?.hospital_id,
        appointment_id: selectedRecord?.appointment_id,
        patient_id: selectedRecord?.patient_id,
        tech_id: selectedRecord?.tech_id,
        sub_total: selectedRecord?.sub_total,
        any_discount: selectedRecord?.any_discount,
        tax_value: selectedRecord?.tax_value,
        tax_amount: selectedRecord?.tax_amount,
        total_amount: selectedRecord?.total_amount,
        paid_status: paidStatus,
        paid_amount: totalAmount,
        balance_amount: selectedRecord?.total_amount - totalAmount,
        remarks: selectedRecord?.remarks,
      };
    
      try {
        const token = localStorage.getItem("pres_token");
        const paid_status = localStorage.getItem("paid_status");
        console.log("hii", currentBillingId);
    
        // Convert payload to a JSON string
        const jsonPayload = JSON.stringify(payload);
    
        const response = await fetch(`${var_api}medicalbilling/medical-billing/update-status/${currentBillingId.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: jsonPayload,
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
    
        // Call handleClick to send notification after successful update
        await handleClick(paidStatus);  // Pass the correct status here
    
        fetchData(selectedDate);
        await handlecalculate();
    
        if (medicine_dispatch_patient_email || medicine_dispatch_pharmacy_email) {
          await sendEmailMedicine();
        }
    
        fetchMedical();
        handleModalClose(); // Close the modal on success
        handleClick(paidStatus); // Trigger handleClick for notification
      } catch (error) {
        console.error("Error updating data:", error);
        notification.error({
          message: "Update Failed",
          description: "Failed to update the patient medical history. Please try again.",
        });
      }
    };
    
    const handleClick = async (paidStatus) => {
      if (!selectedRecord) {
        console.error("No selected record found.");
        return;
      }
    
      if (!paidStatus) {
        console.error("Paid Status is not defined or invalid.");
        return;
      }
    
      console.log("haa", paidStatus); // Log the status to confirm it's passed correctly
    
      const payload = {
        hospital_id: selectedRecord.hospital_id,
        patient_id: selectedRecord.patient_id,
        doc_id: selectedRecord.tech_id,
        title: ` Payment Status - ${getStatusLabel(paidStatus)}`,
        description: `Your medicine has been dispatched, and the payment status has been updated to ${getStatusLabel(paidStatus)}.`,
        read_status: 0, // Unread status
      };
    
      const token = localStorage.getItem("pres_token");
    
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
          throw new Error("Failed to send notification");
        }
    
        const result = await response.json();
        console.log("Notification sent:", result);
        notification.success({
          message: "Update Successful",
          description: "Notification sent successfully!",
        });
      } catch (error) {
        console.error("Error:", error);
    
        notification.error({
          message: "Update Failed",
          description: "Failed to send notification. Please try again.",
        });
      }
    };
    
    
      
      
      


         const handleDelete = async (deleteformData) => {
            try {
              const token = localStorage.getItem("pres_token");
              const response = await fetch(`${var_api}medicalbillingPaymode/delete`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify(deleteformData), // Pass the payload here
              });
          
              if (!response.ok) throw new Error("Error deleting record");
          
              // notification.success({
              //   message: "Delete Successful",
              //   // description: "The record has been successfully deleted.",
              // });
          
              fetchData(selectedDate);
            } catch (error) {
              // notification.error({
              //   message: "Delete Failed",
              //   description: "There was an error while deleting the record.",
              // });
            }
          };



  const handleDateChange = (date) => {
    // Ensure the date is valid
    if (!date) return;

    console.log("Selected date:", date);

    // Format date as 'DD-MM-YYYY' using native JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    // Update state with the raw Date object
    setSelectedDate(date);

    // Call fetchData with the formatted date
    fetchData(formattedDate);

    console.log("Formatted date:", formattedDate);
  };

  useEffect(() => {
    const today = new Date();
      const day = String(today.getDate()).padStart(2, '0'); // Get day, ensure 2 digits
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so +1), ensure 2 digits
      const year = today.getFullYear(); // Get full year
      const currentDate = `${day}-${month}-${year}`; // Return in dd-mm-yyyy format
  
      // Call API with the current date
         setSelectedDate(new Date());
      fetchData(currentDate); 
      fetchpaymode();
      fetchMedical();
      fetchDatapre();
  }, []);


  const fetchMedical = async (id) => {
    const token = localStorage.getItem("pres_token");
    const hospital_id = localStorage.getItem("pres_hospital_id");
  axios
    .get(`${var_api}medicalbilling/get-hospital/${hospital_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    .then((response) => {
      setBillingData(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  };
  
  const handleStatusChange = (billingId, currentStatus, paid_status) => {
    // Validate status change
    if (currentStatus === 3) {
      alert("Cannot update beyond 'Delivery' status.");
      return;
    }
  
    if (currentStatus === 2 && paid_status != 1) {
      alert("Cannot set status to 'Delivery' unless the payment is completed.",console.log(paid_status));
      return;
    }
  
    // Determine the next status
    const newStatus = currentStatus + 1;
    axios
  .put(`${var_api}medicalbilling/updatestatus/${billingId}/${newStatus}`, {
    headers: {
          Authorization: token,
    },
  })
  .then((response) => {
    const updatedData = billingData.map((billing) =>
      billing.id === billingId ? { ...billing, status: newStatus } : billing
    );
    setBillingData(updatedData);
  })
  .catch((error) => {
    console.error("Error updating status:", error);
  });
  };
  

   const handlecalculate = async () => {
      try {
        // Retrieve the hospital_id from localStorage
        const hospital_id = localStorage.getItem("pres_hospital_id");
        const token = localStorage.getItem("pres_token");
          // Prepare the data for the POST request
          
          const formData = calculatatedpaymode
          .filter((item) => item.paid_amount > 0) // Include only items with currentValue > 0
          .map((item) => ({
            paymode_id: item.id,
            paid_amount: item.paid_amount,
            hospital_id: hospital_id,
            appointment_id: selectedRecord.appointment_id,
          }));
          console.log("hello",selectedRecord)
          
        // Determine the URL and HTTP method based on whether it's an update or create operation
        const url = 
           `${var_api}medicalbillingPaymode/post`;
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
    
        // Show a success notification
        // notification.success({
        //   message:  "Creation Successful",
        //   // description:"A new record has been successfully created.",
        // });
        // Fetch the updated data (if needed)
        fetchData(selectedDate);
        const deleteformData = calculatatedpaymode
        .filter((item) => item.paid_amount == 0|| isNaN(item.paid_amount)) // Check for 0 or NaN // Include only items with paid_amount === 0
        .map((item) => ({
          paymode_id: item.id,
          appointment_id: selectedRecord.appointment_id,
        }));
  
      // If there are items to delete, call the handleDelete function
      if (deleteformData.length > 0) {
        await handleDelete(deleteformData);
      }
  
        // Close the modal after successful operation
        handleModalClose();
      } catch (error) {
        console.error("Error saving data:", error);
    
        // Show an error notification if something goes wrong
        notification.error({
          message: "Operation Failed",
          description: "There was an error while saving the data.",
        });
      }
    };

  
  const handleStatus = (value) => {
    console.log(value);
    setSelectedstatus(value);
    
  };

  const filterData = selectedStatus == 3 ? billingData : billingData.filter((item) => item.paid_status == selectedStatus);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1, // Generates row numbers starting from 1
    },
    {
      title: "Patient Id",
      dataIndex: "patient_running_no", // Changed to total_amount from API response
    },
    {
      title: "Patient Name",
      dataIndex: "patient_name", // Changed to total_amount from API response
    },

    {
      title: "Invoice No",
      dataIndex: "",
      render: (record) => (
        // <Link
        //   to={`/pharmacyadmin/medical-invoice-report?id=${record.id}`} // Pass token as a query parameter
        //   className="text-decoration-none"
        // >
        //   #{mediPrefix}{record.token}
        // </Link>
      //   <button className="btn btn-link" onClick={() => handleInvoiceClick(record)}>
      //   #{mediPrefix}{record.token}
      // </button>
         <Button type="link" onClick={() => getMedicineData(record.id)}>
        #{mediPrefix}{record.token}
       </Button>
      ),
      sorter: (a, b) => a.token_no - b.token_no,
    },    
    {
      title: "Date",
      dataIndex: "appointment_created_at",
      render: (text) => {
        if (!text) return "N/A"; // Handle empty values
    
        const date = new Date(text);
        const formattedDate = date
          .toLocaleDateString("en-GB") // "en-GB" gives dd/mm/yyyy format
          .replace(/\//g, "-"); // Replace / with -
    
        return formattedDate;
      },
      sorter: (a, b) => new Date(a.appointment_created_at) - new Date(b.appointment_created_at),
    },
    // {
    //   title: "Doctor",
    //   dataIndex: "doctor_name", // Changed to doctor_name from API response
    //   sorter: (a, b) => a.doctor_name.localeCompare(b.doctor_name),
    // },
    // {
    //   title: "Patient",
    //   dataIndex: "", // No specific dataIndex since we're combining fields
    //   render: (record) => (
    //     <div>
    //       <div>{record.patient_name}</div>
    //       <div className="text-muted">{record.mobile_no || "N/A"}</div>
    //     </div>
    //   ),
    //   sorter: (a, b) => a.patient_name.localeCompare(b.patient_name), // Sort by patient_name
    // },
    // {
    //   title: "Items",
    //   dataIndex: "medi_count", // New field
    //   render: (text) => text || 0, // Default to 0 if empty
    // }, 
    // {
    //   title: "Subtotal",
    //   dataIndex: "subtotal", // Changed to subtotal from API response
    //   render: (text) => `${text.toFixed(2)}`, // Formatting to currency
    //   sorter: (a, b) => a.subtotal - b.subtotal,
    // },
    // {
    //   title: "Tax Amt",
    //   dataIndex: "tax_amount", // Changed to tax_amount from API response
    //   render: (text) => `${text.toFixed(2)}`, // Formatting to currency
    //   sorter: (a, b) => a.tax_amount - b.tax_amount,
    // },
    // {
    //   title: "Total Amt",
    //   dataIndex: "total_amount", // Changed to total_amount from API response
    //   render: (text) => `${text.toFixed(2)}`, // Formatting to currency
    //   sorter: (a, b) => a.total_amount - b.total_amount,
    // },
    // {
    //   title: "Pay Mode",
    //   dataIndex: "pay_mode", // New field
    //   render: (text) => text || 0, 
    // },
    {
      title: "Final Amt",
      dataIndex: "total_amount", // Changed to total_amount from API response
      render: (text) => `${(text || 0).toFixed(2)}`, // Formatting to currency
      sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      title: "Paid",
      dataIndex: "paid_amount", // Changed to subtotal from API response
      render: (text) => `${(text || 0).toFixed(2)}`, // Formatting to currency
      // sorter: (a, b) => a.subtotal - b.subtotal, 
    },
    {
      title: "Balance",
      dataIndex: "balance_amount", // Changed to subtotal from API response
      render: (text) => `${(text || 0).toFixed(2)}`, // Formatting to currency
      // sorter: (a, b) => a.subtotal - b.subtotal, 
    },
    {
      title: "Status",
      dataIndex: "paid_status",
      render: (text, record) => {
        const statusConfig = {
          1: { label: "Paid", color: "green" },
          0: { label: "Not Paid", color: "red" },
          2: { label: "Partial", color: "orange" },
        };
    
        if (statusConfig[text]) {
          const { label, color } = statusConfig[text];
          return (
            <button
              style={{
                backgroundColor: color,
                color: "white",
                border: "none",
                padding: "8px 16px",  // Ensures uniform padding
                borderRadius: "5px",
                cursor: "pointer",
                width: "100px", // Fixed width to maintain consistency
                textAlign: "center",
                fontWeight: "bold",
              }}
              onClick={() => showModal(record)}
            >
              {label}
            </button>
          );
        }
        return "N/A";
      },
    },
    
    
    
  
    {
      title: "Bills",
      dataIndex: "",
      render: (record) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => window.open(`/pharmacyadmin/medical-invoice-report?id=${record.id}`, "_blank")}
        >
             <FaFileInvoice className="me-1" />     

          {/* #{mediPrefix}{record.token} */}
        </button>
        
      ),
      sorter: (a, b) => a.token_no - b.token_no,
    },

    
    // {
    //   title: "Action",
    //   dataIndex: "status",
    //   render: (text, record) => {
    //     // Define status text and button styles
    //     let statusText = "";
    //     let buttonStyle = {};
    
    //     switch (text) {
    //       case 0:
    //         statusText = "New";
    //         buttonStyle = { backgroundColor: "#FF6347", color: "white" };
    //         break;
    //       case 1:
    //         statusText = "In Progress";
    //         buttonStyle = { backgroundColor: "#FFD700", color: "white" };
    //         break;
    //       case 2:
    //         statusText = "Ready";
    //         buttonStyle = { backgroundColor: "#8A2BE2", color: "white" };
    //         break;
    //       case 3:
    //         statusText = "Delivered";
    //         buttonStyle = { backgroundColor: "#32CD32", color: "white" };
    //         break;
    //       default:
    //         statusText = "Unknown";
    //         buttonStyle = { backgroundColor: "#D3D3D3", color: "white" };
    //         break;
    //     }
    
    //     return (
    //       <div className="d-flex justify-content-between align-items-center">
    //         {/* Status Button */}
    //         <Button
    //           style={buttonStyle}
    //           onClick={() => handleStatusChange(record.id, text, record.paid_status)}
    //         >
    //           {statusText}
    //         </Button>
    
    //         {/* Only show Pay button if the status is not paid */}
    //         {record.paid_status !== 1 && (
    //           <Button type="primary" onClick={() => showModal(record.id)}>
    //             Pay
    //           </Button>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title mb-0">Medical Billing</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/pharmacyadmin">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Billing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className={showPaymode ? "col-md-8" : "col-md-12"}>            
            <div className="card">
              <div className="card-body p-3">
                <div className="table-responsive">
                  {/* <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                   //dateFormat="yyyy-MM-dd"
                    dateFormat="dd-MM-yyyy"
                    className="form-control datetimepicker"
                    style={{ width: "150px", fontSize: "12px", padding: "5px" }}
                  /> */}
                  <Select
                    className="select-social-img"
                    defaultValue={options[0]}
                    onChange={handleStatus}
                    options={options}
                    placeholder="Select Platform"
                    isSearchable={false}
                    style={{ width: "100px", marginLeft: "10px", height: "45px" }}
                  />
                </div>
                <div className="table-responsive mt-3">
                  <Table
                    pagination={{
                      total: filterData.length,
                      pageSize: pageSize,
                      current: currentPage,
                      showSizeChanger: false,
                      onShowSizeChange: handlePaginationChange,
                      onChange: handlePaginationChange,
                    }}
                    style={{ overflowX: "auto" }}
                    loading={loading}
                    columns={columns}
                    dataSource={filterData || []}
                    rowKey={(record) => record.token_no}
                  />
                </div>
              </div>
            </div>
          </div>
          {showPaymode && (
          <div className="col-md-4">
            <div className="card" style={{ height: "100%" }}>
              <div className="card-body">
                {selectedRecord && (
                  <>
                  {/* <h5>Add New Paymode Master</h5> */}
                <h5> <font color="blue" class="mb-4"><b>#{mediPrefix}{selectedRecord.token}</b></font> </h5>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                      <h4 style={{ fontSize: "16px" }}>
                        Final Amount: <span style={{ fontSize: "18px" }}>{selectedRecord.total_amount}</span>
                      </h4>
                      <div style={{ textAlign: "right" }}>
                        <h4 style={{ fontSize: "16px" }}>
                          Receive Amount: <span style={{ fontSize: "18px", color: "green" }}>{totalAmount}</span>
                        </h4>
                        <h4 style={{ fontSize: "16px" }}>
                          Balance Amount: <span style={{ fontSize: "18px", color: "red" }}>{(selectedRecord.total_amount - totalAmount).toFixed(2)}</span>
                        </h4>
                      </div>
                    </div>
                    <Form form={form}>
                      {/* {modefiltereddata.map((item, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span>{item.paymode_name}</span>
                          <Input
                            type="number"
                            value={item.paid_amount}
                            style={{ width: "80px" }}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (value < 0) return;
                              const updatedData = [...modefiltereddata];
                              updatedData[index].paid_amount = value;
                              setmodeFilteredData(updatedData);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                      ))} */}
                    </Form>
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
            onClick={() => {
              // When clicked, update the input field with the paymode_name
              const updatedData = [...modefiltereddata];
              updatedData[index].paid_amount = item.paid_amount; // Keeps the same paid amount, just highlights the paymode
              setmodeFilteredData(updatedData); // Update state with new array
            }}
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
            marginRight= {"10px"}
            onChange={(e) => {
              const value = parseFloat(e.target.value);

              // Prevent negative input
              if (value < 0) return;

              const updatedData = [...modefiltereddata];
              updatedData[index].paid_amount = value; // Update the specific item in the array

              setmodeFilteredData(updatedData); // Update state with new array
              handleInputChange(index, value); // Pass the index or value based on your use case
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
    onClick={handleFormSubmit}
  >
    {status === 0 ? "Submit" : "Update"}  {/* Change button text based on paid status */}
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
    onClick={handleModalClose}
  >
    Close
  </button>
</div>
                    {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <button className="btn btn-primary mx-1" onClick={handleFormSubmit}>Submit</button>
                    </div> */}
                  </>
                )}
              </div>
            </div>
          </div>
           )}
        </div>
      </div>
    </div>

      {/* <Modal
        title="Payment Mode"
        visible={isModalVisible}
        onOk={() => handleOk(currentBillingId)}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Select Payment Mode">
            <Checkbox
              onChange={(e) =>
                handlePaymentModeChange("Cash", e.target.checked)
              }
            >
              Cash
            </Checkbox>
            <Checkbox
              onChange={(e) =>
                handlePaymentModeChange("Online", e.target.checked)
              }
            >
              Online
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal> */}
           <Modal
        title={"Add New Paymode Master"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
{selectedRecord && (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
    <h4 style={{ fontSize: '16px' }}>Final Amount: <span style={{ fontSize: '18px' }}>{selectedRecord.total_amount}</span></h4>
    <div style={{ textAlign: 'right' }}>
      <h4 style={{ fontSize: '16px' }}>Receive Amount: <span style={{ fontSize: '18px', color: 'green' }}>{totalAmount}</span></h4>
      <h4 style={{ fontSize: '16px' }}>
        Balance Amount: <span style={{ fontSize: '18px', color: 'red' }}>{(selectedRecord.total_amount - totalAmount).toFixed(2)}</span>
      </h4>
    </div>
  </div>
)}
        <Form form={form}> {/* Pass the form prop here */}
    {/* Add your form fields here */}
  </Form>

        {/* Paymode List */}
        <div>
          
  {/* <h4>Paymode List</h4> */}
  {/* <ul>
    {modefiltereddata.map((item, index) => (
      <li  style={{ display: 'flex', alignItems: 'center' }}>
      
        <span>{item.paymode_name}</span> */}

        {/* Input field for numbers only, default value 0 */}
        {/* <Input 
  type="number" 
  value={item.paid_amount} 
  onChange={(e) => {
    const value = e.target.value;
    handleInputChange(index, value);
  }}
  onInput={(e) => {
    // Remove non-numeric characters
    e.target.value = e.target.value.replace(/[^0-9]/g, '');

    // Check if the value is greater than 0 and trigger handleInputChange
    const value = e.target.value;
    if (parseInt(value) > 0) {
      handleInputChange(index, value); // Pass the ID or value based on your use case
    }
  }}
/> */}

{/* <Input 
  type="number" 
  value={item.paid_amount} 
  onChange={(e) => {
    const value = e.target.value;
    const updatedData = [...modefiltereddata];
    updatedData[index].paid_amount = value; // Update the specific item in the array

    setmodeFilteredData(updatedData); // Update state with new array
    handleInputChange(index, value); // Pass the index or value based on your use case
  }}
/>
      </li>
    ))}
  </ul> */}




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
            onClick={() => {
              // When clicked, update the input field with the paymode_name
              const updatedData = [...modefiltereddata];
              updatedData[index].paid_amount = item.paid_amount; // Keeps the same paid amount, just highlights the paymode
              setmodeFilteredData(updatedData); // Update state with new array
            }}
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
            marginRight= {"10px"}
            onChange={(e) => {
              const value = parseFloat(e.target.value);

              // Prevent negative input
              if (value < 0) return;

              const updatedData = [...modefiltereddata];
              updatedData[index].paid_amount = value; // Update the specific item in the array

              setmodeFilteredData(updatedData); // Update state with new array
              handleInputChange(index, value); // Pass the index or value based on your use case
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
    onClick={handleFormSubmit}
  >
    {status === 0 ? "Submit" : "Update"}  {/* Change button text based on paid status */}
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
    onClick={handleModalClose}
  >
    Close
  </button>
</div>
{/* 
  <div className="d-flex justify-content-center">
                                      <button
                                  className="btn btn-primary mx-1"
                                  type="submit"
                                >
                                  {editData ? "Update" : "Submit"}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={editData ? handleFormSubmit : handleReset}
                                >
                                   {editData ? "Cancel" : "close"}
                                </button>
                                </div> */}
</div>
      </Modal>
       {/* Invoice Modal */}
       <Modal
          title="Invoice Details"
          open={isModalVisibleInv}
          onCancel={() => setIsModalVisibleInv(false)}
          footer={[
            isEditing && (
              <Button key="update"  className="btn btn-success mx-1"  onClick={handleUpdate}>
                Update
              </Button>
            ),
          ]}
          width={750}
        >
          {selectedInvoice && (
            <div>
              <p><b>Patient Name:</b> {selectedInvoice.patient_name}</p>
              <p><b>Invoice ID:</b><font color="blue">#{mediPrefix}{selectedInvoice.invoice_id}</font></p>

              {/* Edit Button */}
              <Button
  className={`btn mx-1 ${isEditing ? "btn-danger" : "btn-primary"}`} // Dynamically change class
  onClick={() => setIsEditing(!isEditing)}
>
  {isEditing ? "Cancel" : "Edit"}
</Button>

              {/* Table Wrapper */}
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table
                  columns={[
                    {
                      title: "#",
                      dataIndex: "index",
                      key: "index",
                      render: (_, __, index) => index + 1, // Generates row numbers starting from 1
                    },
                    { title: "Medicine Name", dataIndex: "medicine_Name", key: "medicine_Name" },
                    { title: "Unit Cost", dataIndex: "unit_price", key: "unit_price" },
                    { title: "Total", dataIndex: "item_total", key: "item_total" },
                    { title: "Given Qty", dataIndex: "qty", key: "qty" },
                    {
                      title: "Received Qty",
                      dataIndex: "received_qty",
                      key: "received_qty",
                      render: (_, record, index) => (
                        <Input
                          type="number"
                          value={record.received_qty || ""}
                          onChange={(e) => handleInputChangeInv(index, "received_qty", e.target.value)}
                          style={{ width: "80px" }}
                          marginRight= {"10px"}
                          disabled={!isEditing}
                        />
                      ),
                    },
                    {
                      title: "Qty Status",
                      dataIndex: "qty_status",
                      key: "qty_status",
                      render: (qty_status) => {
                        const statusConfig = {
                          1: { label: "Fully", color: "green" },
                          0: { label: "Partial", color: "orange" },
                        };
                    
                        const { label, color } = statusConfig[qty_status] || { label: "Unknown", color: "gray" };
                    
                        return (
                          <span
                            style={{
                              backgroundColor: color,
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              display: "inline-block",
                              minWidth: "70px", // Ensures consistent button size
                              textAlign: "center",
                            }}
                          >
                            {label}
                          </span>
                        );
                      },
                    },
                    
                  ]}
                  dataSource={billingDatamedi}
                  rowKey="medicine_Name"
                  loading={loading}
                  pagination={false}
                />
              </div>
            </div>
          )}
        </Modal>
    </>
  );
};

export default Billing;