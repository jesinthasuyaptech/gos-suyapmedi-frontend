import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, Radio, Select, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import moment from "moment"; // For handling date format
import { useLocation } from "react-router-dom";
import { var_api } from "../../../constant";
import { Checkbox } from "antd";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"; 
import { useHistory } from "react-router-dom";


const InvoiceList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [paymode, setpaymode] = useState([]);
  const [invoice,setInvoice] = useState([]);
  const [invoicefiltereddata,setInvoicefiltereddata]=useState([]);
  const [modefiltereddata, setmodeFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const hospital_id = localStorage.getItem("hospital_id");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBillingId, setCurrentBillingId] = useState(null);
  const [selectedPaymentModes, setSelectedPaymentModes] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedamount,setSelectedamount]= useState(null)
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState(0); 
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedstatus] = useState(3);
  const [installationDeleted, setInstallationDeleted] = useState(false);
  const [calculatatedpaymode,setCalculatatedpaymode]=useState([]);
  const[status,setStatus]=useState(0);
    const history = useHistory(); 
    const [isModalInsta, setIsModalInsta] = useState(false);
    const [isModalpop, setIsModalpop] = useState(false);
    const formattedDate = moment(selectedDate).format("DD-MM-YYYY");
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
 
  
 

  

  // const handleInputChange = (index, value) => {
  //   // Convert the value to a number and ensure it's non-negative
  //   const numericValue = Number(value) >= 0 ? Number(value) : 0;

  //   // Update the total by summing all input values
  //   const updatedTotal = modefiltereddata.reduce((acc, item, idx) => {
  //     if (index === idx) {
  //       return acc + numericValue; // Add the current input's updated value
  //     }
  //     return acc + (Number(item.currentValue) || 0); // Add the existing value for other inputs
  //   }, 0);

  //   // Update the `currentValue` for the specific item
  //   modefiltereddata[index].currentValue = numericValue;

  //   // Update the total amount
  //   setTotalAmount(updatedTotal);
  // };

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
              console.log("availabletime value:", firstItem?.payment);
          
              // ✅ Save installation_id in localStorage if it exists
              if (result?.id) {
                localStorage.setItem("installation_id", result.id);
                console.log("Saved installation_id:", result.id); // ✅ confirm this
              }
            
          
              setData(result || []);
              if (firstItem?.payment === 0) {
                console.log("Modal should show: availabletime is 0");
                setIsModalInsta(true);
              } else {
                console.log("Modal not triggered: availabletime is not 0");
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


   useEffect(() => {
      fetchinstalldata();
    }, []);
  


  const balanceAmount = selectedRecord ? selectedRecord.balance_amount : 0;
  const showModal = (record) => {
    setCurrentBillingId(record.id); // Set the current billing ID
    setIsModalVisible(true);
    setSelectedRecord(record); // Pass the record to the modal
    setSelectedamount(record);
    fetchpaymode();
    fetchInvoice(record.appointment_id);
    setStatus(record.paid_status);
    
  };
  const options = [
    { value: 3, label: "All" },
    { value: 0, label: "Notpaid" },
    { value: 1, label: "paid" },
    { value: 2, label: "partial" },
  ];




const fetchData = async (date) => {
  // ✅ Check if date is valid (Date object or string)
  if (!date || (typeof date === 'object' && isNaN(date.getTime()))) {
    console.error("Invalid date provided:", date);
    return;
  }

  // ✅ Format the date correctly (DD-MM-YYYY)
  let formattedDate;
  if (date instanceof Date) {
    formattedDate = moment(date).format("DD-MM-YYYY");
  } else if (typeof date === 'string') {
    // If already a string, validate format (optional)
    formattedDate = moment(date, "DD-MM-YYYY").format("DD-MM-YYYY");
    if (formattedDate === "Invalid date") {
      console.error("Invalid date string format:", date);
      return;
    }
  } else {
    console.error("Unsupported date type:", typeof date);
    return;
  }

  const token = localStorage.getItem("token");
  setLoading(true);

  try {
    const response = await fetch(
      `${var_api}invoicebilling/invoices-by-today/${hospital_id}/${formattedDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        setData([]);
        setFilteredData([]);
      }
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    setData(result || []);
    setFilteredData(result || []);
  } catch (error) {
    console.error("Error fetching data:", error);
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


    const deleteInstallation = async () => {
      const token = localStorage.getItem("token");
      const hospital_id = localStorage.getItem("hospital_id");
    
      try {
        const response = await fetch(`${var_api}installation/delete/${hospital_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
    
        // Log status code and response
        console.log("Response Status:", response.status);
        const responseText = await response.text();
        console.log("Response Text:", responseText);
    
        if (response.ok) {
          console.log("Installation deleted successfully.");
          setInstallationDeleted(true); // Set the success state
          setIsModalpop(true);
          fetchinstalldata(); // Open modal only on success
        } else {
          console.error("Failed to delete installation:", responseText);
          setInstallationDeleted(false); // Set failure state
        }
    
      } catch (err) {
        console.error("Error deleting installation:", err);
        setInstallationDeleted(false); // Set failure state on error
      }
    };



    const handleFormSubmit = async () => {
      setLoading(true);
      let paidStatus;
      if (selectedRecord && totalAmount) {
        if (parseFloat(totalAmount) < selectedRecord.final_amount) {
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
        invoice_token: selectedRecord?.invoice_token,
        hospital_id: selectedRecord?.hospital_id,
        appointment_id: selectedRecord?.appointment_id,
        patient_id: selectedRecord?.patient_id,
        tech_id: selectedRecord?.tech_id,
        sub_total: selectedRecord?.sub_total,
        any_discount: selectedRecord?.any_discount,
        tax_value: selectedRecord?.tax_value,
        tax_amount: selectedRecord?.tax_amount,
        final_amount: selectedRecord?.final_amount,
        paid_status: paidStatus,
        paid_amount: totalAmount,
        balance_amount: selectedRecord?.final_amount - totalAmount,
        remarks: selectedRecord?.remarks
    }
    
     
      try {
        const token = localStorage.getItem("token");
        const paid_status = localStorage.getItem("paid_status");
        
      // Convert payload to a JSON string
      const jsonPayload = JSON.stringify(payload);
        const response = await fetch(`${var_api}invoicebilling/update-status/${currentBillingId}`, {
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

        deleteInstallation();
    
        const result = await response.json();
        console.log("Update Success:", result);
    
        notification.success({
          message: "Update Successful",
          description: "The patient medical history has been updated.",
        });


        fetchData(selectedDate);
       await handlecalculate();
        handleModalClose(); // Close the modal on success
      } catch (error) {
        console.error("Error updating data:", error);
        notification.error({
          message: "Update Failed",
          description: "Failed to update the patient medical history. Please try again.",
        });
      } finally{
        setLoading(false);
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

    useEffect(() => {
      // Calculate the current date inside useEffect to avoid hoisting issues
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0'); // Get day, ensure 2 digits
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so +1), ensure 2 digits
      const year = today.getFullYear(); // Get full year
      const currentDate = `${day}-${month}-${year}`; // Return in dd-mm-yyyy format
  
      // Call API with the current date
         setSelectedDate(today);
      fetchData(currentDate); 
      fetchpaymode();
    }, []);
    useEffect(() => {
      // Reset totalAmount when selectedRecord changes
      if (selectedRecord) {
        setTotalAmount(0);
      }
    }, [selectedRecord]); // Runs whenever selectedRecord changes

    
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
          appointment_id: selectedRecord.appointment_id,
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
  
      // Show a success notification
      // notification.success({
      //   message:  "Creation Successful",
      //   // description:"A new record has been successfully created.",
      // });
      // Fetch the updated data (if needed)
      fetchData(selectedDate);
      const deleteformData = calculatatedpaymode
      .filter((item) => item.paid_amount === 0 || isNaN(item.paid_amount)) // Check for 0 or NaN
      .map((item) => ({
        paymode_id: item.id,
        appointment_id: selectedRecord.appointment_id,
      }));
      console.log("delete",deleteformData);

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

  
  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = data.filter((item) => {
      return (
        (item.invoice_token && item.invoice_token.toLowerCase().includes(value)) ||
        (item.tech_details && item.tech_details.name && item.tech_details.name.toLowerCase().includes(value)) ||
        (item.patient_details && item.patient_details.name && item.patient_details.name.toLowerCase().includes(value)) ||
        (item.appointment_day && item.appointment_day.toLowerCase().includes(value)) ||
        (item.appointment_time && item.appointment_time.toLowerCase().includes(value)) ||
        (item.final_amount && item.final_amount.toString().includes(value)) ||
        (item.paid_amount && item.paid_amount.toString().includes(value)) ||
        (item.balance_amount && item.balance_amount.toString().includes(value)) ||
        (item.paid_status !== undefined && item.paid_status.toString().includes(value))
      );
    });
  
    setFilteredData(filtered);
  };
  
  

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };


  const handleStatusChange = (value) => {
    console.log(value);
    setSelectedstatus(value);
    
  };
  const filterData = selectedStatus == 3 ? filteredData : filteredData.filter((item) => item.paid_status == selectedStatus);

  const columns = [
    
      {
        title: "Invoice",
        dataIndex: "invoice_token",
        render: (text, record) => (
          // <Link
          //           // to={`/admin/doctor-invoice-report?id=${record.id}`} // Pass token as a query parameter
          //           to={{
          //             pathname: `/admin/doctor-invoice-report?id=${record.id}`,
          //             state: { from: "invoicelist" }
          //           }}
          //           className="text-decoration-none"
          //         >
          //            {text ? `#INV-${text}` : "N/A"}
          //         </Link>
          <a
          href={`/admin/doctor-invoice-report?id=${record.id}&from=invoicelist`} 
          className="text-decoration-none"
        >
          {text ? `#INV-${text}` : "N/A"}
        </a>
         
        ),
      },      
      // {
      //   title: "Doctor",
      //   dataIndex: "tech_details",
      //   render: (text, record) => (
      //     <div>
      //       {record.profile_image ? (
      //         <img src={record.tech_details.profile_image} alt="Profile" style={{ width: 30, height: 30, borderRadius: '50%' }} />
      //       ) : (
      //         <span>No Image</span>
      //       )}
      //       {/* <span style={{ marginLeft: 10 }}>{record.tech_details.name || "N/A"}</span> */}
      //     </div>
      //   ),
      // },
      // {
      //   title: "Patient",
      //   dataIndex: "patient_details",
      //   render: (text, record) => (
      //     <div>
      //       {record.profile_image ? (
      //         <img src={record.patient_details.profile_image} alt="Profile" style={{ width: 30, height: 30, borderRadius: '50%' }} />
      //       ) : (
      //         <span>No Image</span>
      //       )}
      //       {/* <span style={{ marginLeft: 10 }}>{record.patient_details.name || "N/A"}</span> */}
      //     </div>
      //   ),
      // },      
    // {
    //   title: "Appointment Date",
    //   dataIndex: "appointment_day",
    //   render: (text) => (text ? text : "N/A"),
    // },
    {
      title: "Slot Time",
      dataIndex: "appointment_time",
      render: (text) => (text ? text : "N/A"),
    },
   {
  title: "Final Amount",
  dataIndex: "final_amount",
  render: (text) => (text ? Number(text).toFixed(2) : "0.00"),
},
{
  title: "Paid",
  dataIndex: "paid_amount",
  render: (text) => (text ? Number(text).toFixed(2) : "0.00"),
},
{
  title: "Balance",
  dataIndex: "balance_amount",
  render: (text) => (text ? Number(text).toFixed(2) : "0.00"),
},

    {
      title: "Status",
      dataIndex: "paid_status",
      render: (text, record) => {
        const getStatusButton = (status) => {
          const statusConfig = {
            1: { label: "Paid", color: "green" },
            0: { label: "Not Paid", color: "red" },
            2: { label: "Partial", color: "orange" },
          };
    
          if (statusConfig[status]) {
            const { label, color } = statusConfig[status];
            return (
              <button
                style={{
                  backgroundColor: color,
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => showModal(record)}
              >
                {label}
              </button>
            );
          }
          return "N/A";
        };
    
        return getStatusButton(text);
      },
    }
      // {
      //   title: "Action",
      //   dataIndex: "status",
      //   render: (text, record) => (
      //     <div className="d-flex justify-content-center align-items-center">
      //       {/* Always show Pay button */}
      //       {record.paid_status !== 1 && (
      //       <Button type="primary" onClick={() => showModal(record)}>
      //         Pay
      //       </Button>
      //         )}
      //     </div>
      //   ),
      // },
      
    // {
    //   title: "Mobile No",
    //   dataIndex: "mobile_no",
    //   render: (text) => (text ? text : "N/A"),
    // },
    // {
    //   title: "Full Address",
    //   dataIndex: "full_address",
    //   render: (text) => (text ? text : "N/A"),
    // },
    // {
    //   title: "Date of Birth",
    //   dataIndex: "dob",
    //   render: (text) => (text ? text : "N/A"),
    // },
    // {
    //   title: "Gender",
    //   dataIndex: "gender",
    //   render: (text) => (text ? text : "N/A"),
    // },
    // {
    //   title: "Blood Group",
    //   dataIndex: "blood_group",
    //   render: (text) => (text ? text : "N/A"),
    // },
    // {
    //   title: "Action",
    //   render: (_, record) => (
    //     <div className="text-end">
    //       <Button
    //         className="me-1"
    //         type="primary"
    //         onClick={() => handleModalOpen(record)}
    //       >
    //         Edit
    //       </Button>
    //       <Button
    //         type="danger"
    //         onClick={() => handleDeleteConfirm(record.id)}
    //       >
    //         Delete
    //       </Button>
    //     </div>
    //   ),
    // },
  ];


  const handleOk = () => {
    const token = localStorage.getItem('token');
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
  
     // Create the payload
  const payload = {
    paid_status: 1,
    balanceAmount: balanceAmount,
  };
  console.log("Payload to send:", payload);


    axios
      .put(`${var_api}invoicebilling/update-status/${currentBillingId.id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("Payment processed:", response.data);
        fetchData();
  
        // // Update the local billing data
        // const updatedData = billingData.map((billing) =>
        //   billing.id === currentBillingId
        //     ? { ...billing, paid_status: 1,pay_mode: selectedPaymentModes }
        //     : billing
        // );
      
        setIsModalVisible(false);
        setSelectedPaymentModes([])
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
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };
  // const handlePayment = () => {
  //   console.log('Payment made for:', selectedRecord); // Handle payment logic
  // };

  const handlePayment = () => {
    // Form.validateFields().then((values) => handleFormSubmit(values));
    form.validateFields();
    if (selectedRecord && totalAmount) {
      if (parseFloat(totalAmount) < selectedRecord.final_amount) {
        console.log(2); // Less than final_amount
      } else {
        console.log(1); // Greater than or equal to final_amount
      }
    } else {
      console.log("Please enter a valid amount"); // Handle edge cases
    }
  };
  // const handleDateChange = (date) => {
   
  //   console.log("Selected date:", date);
  
  //   // Format date as 'DD-MM-YYYY' using native JavaScript
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  //   const year = date.getFullYear();
  
  //   const formattedDate = `${day}-${month}-${year}`;
  
  //   // Call fetchData with the formatted date
  //   fetchData(formattedDate);
  //   setSelectedDate(formattedDate);
  //   console.log("Formatted date:", formattedDate);
  // };


const handleDateChange = (date) => {
  if (!date || isNaN(date.getTime())) {
    console.error("Invalid date selected");
    return;
  }
  setSelectedDate(date);
  const formattedDate = moment(date).format("DD-MM-YYYY");
  fetchData(formattedDate); // Pass formatted string instead of Date object
};


useEffect(() => {
  const today = new Date();
  setSelectedDate(today); // Initialize with today's date
  const formattedDate = moment(today).format("DD-MM-YYYY");
  fetchData(formattedDate);
}, []);



  // const handleDateChange = (date) => {
  //   if (date) {
  //     const formattedDate = date.toISOString().split('T')[0]; // Ensure yyyy-MM-dd format
  //     setSelectedDate(new Date(formattedDate)); // Update the state with the correctly formatted date
  //   } else {
  //     setSelectedDate(null);
  //   }
  // };


//   const handlePayment = () => {
//     // Use the form instance to validate the fields
//     form.validateFields().then(() => {
//         if (selectedRecord && totalAmount) {
//             if (parseFloat(totalAmount) < selectedRecord.final_amount) {
//                 console.log(2); // Less than final_amount
//             } else {
//                 console.log(1); // Greater than or equal to final_amount
//             }
//         } else {
//             console.log("Please enter a valid amount"); // Handle edge cases
//         }
//     }).catch((error) => {
//         console.log("Validation failed:", error);
//     });
// };
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
                <h3 className="page-title">Invoice Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Invoice Tables</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
            <input
  className="form-control"
  type="text"
  placeholder="Search"
  value={searchTerm}
  onChange={handleSearch}
  style={{ width: "300px" }} // Adjust the width as needed
/>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Invoice Details</h4>

                  <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
      className="form-control datetimepicker"
      style={{
        width: "150px",
        fontSize: "12px",
        padding: "5px",
      }}
    />


          <Select
        className="select-social-img"
        defaultValue={options[0]}
        onChange={handleStatusChange}
        options={options}
        placeholder="Select Platform"
        isSearchable={false}
        style={{ width: '100px',marginLeft:'10px',height:'45px' }}
      />
      
                </div>
                <div className="card-body">
                  <div className="table-responsive">
       
                    <Table
                     pagination={{
                        total: filteredData.length,
                        pageSize: pageSize, // Limit to 2 rows per page
                        current: currentPage,
                        showSizeChanger: false,
                        onShowSizeChange: (current, size) => handlePaginationChange(current, size),
                        onChange: handlePaginationChange,
                        itemRender: itemRender,
                      }}
                      loading={loading}
                      columns={columns}
                      dataSource={filterData || []}
                      rowKey={(record) => record?.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={"Select Paymode"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
{selectedRecord && (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
    <h4 style={{ fontSize: '16px' }}>Final Amount: <span style={{ fontSize: '18px' }}>{selectedRecord.final_amount}</span></h4>
    <div style={{ textAlign: 'right' }}>
      <h4 style={{ fontSize: '16px' }}>Receive Amount: <span style={{ fontSize: '18px', color: 'green' }}>{totalAmount}</span></h4>
      <h4 style={{ fontSize: '16px' }}>
  Balance Amount:
  <span style={{ fontSize: '18px', color: selectedRecord.final_amount - totalAmount < 0 ? 'red' : 'black' }}>
    {Math.max((selectedRecord.final_amount - totalAmount).toFixed(2), 0)}
  </span>
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
                    //  setIsModalVisible(true); // Show the second modal
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
    // <Button
    //   key="close"
    //   type="primary"
    //   onClick={() => {
    //     setIsModalpop(false);
    //     history.push('/admin'); // Navigate to another page
    //   }}
    // >
    //   Continue
    // </Button>
  ]}
>
  {/* Display success or error message */}
  {installationDeleted ? (
    <p> congradulation Installation completed  successfully.</p>
  ) : (
    <p>Failed to delete the installation. Please try again.</p>
  )}
</Modal>
    </>
  );
};

export default InvoiceList;







