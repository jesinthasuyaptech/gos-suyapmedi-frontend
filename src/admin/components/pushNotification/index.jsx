import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input,Spin, notification, Select, Checkbox } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
import "../styles/Loader.css";
// import { Table, Input, Button, DatePicker, Spin } from 'antd';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"; 
import { Filter, labinitialSettings } from "../../../client/components/common/filter";
import { Calendar,Eye, Clock, Stethoscope, User } from "lucide-react";
import axios from "axios";

const pushNotification = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblesum, setIsModalVisiblesum] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletename , setDeletename] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const history = useHistory(); 
  const [tableData, setTableData] = useState([]);
  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
  const [selectedLabServices, setSelectedLabServices] = useState([]);
  const appointmentPrefix = localStorage.getItem("admin_appointment_prefix");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { RangePicker } = DatePicker;
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");


  const [labList, setLabList] = useState('');
  const [labpageSize, setLabPageSize] = useState(10);
  const [labcurrentPage, setLabCurrentPage] = useState(1);
  const [labloading, setLabLoading] = useState(false);
  const [selectedLabId, SetSelectedLabId] = useState(null);
  const [selectedLabName, setSelectedLabName] = useState(null);
  const [showSecondCol, setShowSecondCol] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [aptDetails, setAptDetails] = useState(null);
  console.log("jesi",filteredData);


  const { TextArea } = Input;
  const { Option } = Select;
  const [form] = Form.useForm();
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const hospital_id = localStorage.getItem('hospital_id');
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState("serviceType");

  useEffect(() => {
    if (selectAll) {
      setSelectedPatients(patientList.map((p) => p.id));
    } else {
      setSelectedPatients([]);
    }
  }, [selectAll, patientList]);


  const handleSend = async() => {
    setLoading(true);
    // form.validateFields().then((values) => {
    //   const payload = {
    //     title: values.title,
    //     description: values.description,
    //     patients: selectedPatients,
    //   };
    //   onSend(payload); // send to backend
    // });

      try {

          // Get selected tokens from patientList
    const selectedTokens = patientList
    .filter(patient => selectedPatients.includes(patient.id))
    .map(patient => patient.fcm_token)
    .filter(Boolean); // Filter out any null or undefined tokens

  const values = await form.validateFields(); // validate form fields

        const data = {
            tokens: selectedTokens,
            title: values.title,
            body: values.description,
          };
        const response = await fetch(`${var_api}firebase-notify/bulk-post`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log("Bulk Notification Result:", result);
        await handleMessageSubmit()
      } catch (error) {
        console.error('Error sending notification:', error.response?.data || error.message);
      } finally{
        setLoading(false);
      }
  };


 //push notification message post
  const handleMessageSubmit = async () => {
    const user_id = localStorage.getItem("user_id");
    const values = await form.getFieldsValue(); 

    const formData = {
        hospital_id: parseInt(hospital_id),
        posted_by: parseInt(user_id),
        title:  values.title,
        body: values.description,
        patient_count: selectedPatients.length
    }
    try {
      const token = localStorage.getItem('token'); // token stored after login
      const res = await axios.post(
        `${var_api}push-notification-message/post`, // adjust base URL
        formData,
        {
          headers: {
            Authorization: token
          }
        }
      );
      console.log(res.data.message);
      notification.success({
        message: "Success",
        description: "Notification sent!",
      });
      setSelectedPatients([]);
      setSelectAll(false);
      form.resetFields();

    } catch (err) {
      console.log(err.response?.data?.message || 'Something went wrong');
    }
  };


  //get doctors list by hospital id
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${var_api}patientdetails/getby-hospital/${hospital_id}`, {
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
        setPatientList(result || []);
        setLoading(false);
          // Set the first doctor as selected
    
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
  


  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const handleLabPaginationChange = (page, pageSize) => {
    setLabCurrentPage(page);
    setLabPageSize(pageSize);
  };

  const handleClose = () => setIsModalVisiblesum(false);

  const handleShow = () => setIsModalVisiblesum(true);

  const serviceCountMap = {};

//   filteredData?.forEach((appointment) => {
//     appointment.lab_service_details.forEach((service) => {
//       serviceCountMap[service.service_id] = {
//         count: (serviceCountMap[service.service_id]?.count || 0) + 1,
//         service_name: service.service_name, // Store service_name along with count
//       };
//     });
//   });
  
//   const serviceCounts = Object.keys(serviceCountMap).map((service_id) => ({
//     service_id: parseInt(service_id),
//     service_name: serviceCountMap[service_id].service_name, // Correctly extract service_name
//     count: serviceCountMap[service_id].count,
//   }));
  
  

  //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0aW1lc3RhbXAiOjE3MzUzNzU0MjQ2MzAsImlhdCI6MTczNTM3NTQyNH0.jkA7TNIJzIPxyrmigzrLmVmPz1ZiTDpHf5eTyMvoqjA";
//   const fetchData = async (fromDate = null, toDate = null) => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     const hospital_id = localStorage.getItem('hospital_id');
//     try {
//       const response = await fetch(`${var_api}labservicetype/get-details/${hospital_id}}`, {
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

//       let filteredResult = result;
// console.log("priya",filteredResult)
//       if (fromDate && toDate) {
//         const from = new Date(fromDate);
//         const to = new Date(toDate);
//         filteredResult = result.filter(item => {
//           const appointmentDate = new Date(item.appointment_day);
//           console.log("harini",appointmentDate)
//           return appointmentDate >= from && appointmentDate <= to;
//         });
//       } else {
//         const currentMonth = new Date().getMonth() + 1;
//         filteredResult = result.filter(item => {
//           const appointmentDate = new Date(item.appointment_day);
//           console.log("harini",appointmentDate)
//           return appointmentDate.getMonth() + 1 === currentMonth;
//         });
//       }
//       console.log("priya1",filteredResult)
//       setData(filteredResult || []);
//       console.log("priya2",filteredResult)
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

// const fetchData = async (startDate, endDate) => {
//   setLoading(true);
//   const token = localStorage.getItem('token');
//   const hospital_id = localStorage.getItem('hospital_id');

//   // Function to format date as "dd-mm-yyyy"
//   // function formatDate(date) {
//   //   const day = String(date.getDate()).padStart(2, '0');
//   //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//   //   const year = date.getFullYear();
//   //   return `${day}-${month}-${year}`;
//   // }

//   // Set default dates if not provided
//   const now = new Date();
//   if (!startDate) {
//     startDate = formatDate(new Date(now.getFullYear(), now.getMonth(), 1)); // First day of the current month
//   }
//   if (!endDate) {
//     endDate = formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)); // Last day of the current month
//   }

//   try {
//     const response = await fetch(`${var_api}labservicetype/get-details/${hospital_id}/${startDate}/${endDate}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${token}`,
//       },
//     });

//     if (response.status === 401) {
//       history.push("/admin/login");
//       notification.warning({
//         message: "Unauthorized",
//         description: "Your session has expired. Please log in again.",
//       });
//       return;
//     }

//     if (!response.ok) throw new Error("Failed to fetch data");

//     const result = await response.json();
//     setData(result || []);
//     setFilteredData(result || []);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     notification.error({
//       message: "Fetch Failed",
//       description: "Unable to retrieve data. Please try again later.",
//     });
//   } finally {
//     setLoading(false);
//   }
// };



const fetchData = async (id, date) => {
  setLoading(true);
  const token = localStorage.getItem('token');
  const hospital_id = localStorage.getItem('hospital_id');
// Convert date to 'dd-mm-yyyy' format
const formattedDate = date
  ? date
  : "";

   // Construct API URL based on whether date is provided
   const apiUrl = `${var_api}push-notification-message/getby-hospital/${hospital_id}`;


  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
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
    setFilteredData(result || []);
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


const fetchLabData = async () => {
  setLabLoading(true);
  const token = localStorage.getItem('token');
  const hospital_id = localStorage.getItem('hospital_id');

  try {
    const response = await fetch(`${var_api}labmaster/get-lab-services-by-hospital/${hospital_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
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
    setLabList(result || []);
  } catch (error) {
    console.error("Error fetching data:", error);
    notification.error({
      message: "Fetch Failed",
      description: "Unable to retrieve data. Please try again later.",
    });
  } finally {
    setLabLoading(false);
  }
};


const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = data.filter((item) =>
      (item.title?.toLowerCase().includes(value) ||
       item.body?.toLowerCase().includes(value) ||
       item.created_at?.toLowerCase().includes(value))
    );
    
    setFilteredData(filtered);
  };
  


  useEffect(() => {
    fetchPatientData();
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);
  


  // const handleDateRangeChange = (dates) => {
  //   if (dates && dates.length === 2) {
  //     const fromDate = dates[0].format('DD-MM-YYYY');
  //     const toDate = dates[1].format('DD-MM-YYYY');
  //     fetchData(fromDate, toDate);
  //   } else {
  //     fetchData();
  //   }
  // };

  // const handleServiceClick = (details) => {
  //   console.log('Service Details:', details);
  // };
  

  // useEffect(() => {
  //   // Flatten the data to match the columns
  //   const formattedData = data.flatMap((item, index) =>
  //     item.lab_service_details.map((service, subIndex) => ({
  //       key: `${item.appointment_id}-${subIndex}`, // Unique key
  //       serialNo: index + 1,
  //       appointment_id: item.appointment_id,
  //       appointment_day: item.appointment_day,
  //       appointment_time: item.appointment_time,
  //       patient_name: item.patient_name,
  //       technician_name: item.technician_name,
  //       lab_name: service.lab_name,
  //       lab_address: service.lab_address,
  //       service_amt: service.service_amt,
  //       service_name: service.service_name,
  //       lab_service_count: item.lab_service_count,
  //       service_current_status: item.service_current_status
  //     }))
  //   );

  //   setTableData(formattedData);
  // }, [data]);

  // Handle search input change
//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);
  
//     const filtered = data.filter((item) =>{
//       const prefixedTokenNo = `${appointmentPrefix}${item.token_no}`; // Include prefix in search
//     return (
//       item.patient_name.toLowerCase().includes(value) ||
//       item.technician_name.toLowerCase().includes(value) ||
//       prefixedTokenNo.toLowerCase().includes(value) ||  // Convert to string for searching
//       item.lab_service_count.toString().includes(value) ||  // Convert to string for searching
//       item.service_current_status.toLowerCase().includes(value)
//     );
  
//   });
//     setFilteredData(filtered);
//   };
  

  const handleModalOpen = (record = null) => {
    setEditData(record); // Set record data for editing (if any)
    form.resetFields();   // Reset the form fields
    if (record) {
      form.setFieldsValue(record); // Set initial values for the edit form
    }
    setIsModalVisible(true);  // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setEditData(null);         // Clear the edit data
  };

  const handleServiceModalClose = () => {
    setIsServiceModalVisible(false);
    setSelectedLabServices([]);
  };

  const handleServiceClick = (labServices) => {
    setSelectedLabServices(labServices);
    setIsServiceModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      // Retrieve the hospital_id from localStorage
      const hospital_id = localStorage.getItem("hospital_id");
      const token = localStorage.getItem('token');
  
      // Ensure that hospital_id is available
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }
  setLoading(true);
  
      // Include the hospital_id dynamically in the form data
      const formData = { ...values, hospital_id, description: values.description || "-", };
  
      // Determine the URL and HTTP method based on whether it's an update or create operation
      const url = editData
        ? `${var_api}medicineuom/update/${editData.id}`
        : `${var_api}medicineuom/post`;
      const method = editData ? "PUT" : "POST";
  
      // Send the request
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Make sure `token` is set correctly
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 401) {
        history.push("/admin/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Error saving data");
      }
    setLoading(false);
      // Show a success notification
      notification.success({
        message: editData ? "Update Successful" : "Creation Successful",
        description: editData
          ? "The record has been successfully updated."
          : "A new record has been successfully created.",
      });
  
      // Fetch the updated data (if needed)
      fetchData();
  
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

  const handleDeleteConfirm = (id,uom_name) => {
    setDeleteId(id);
    setDeletename(uom_name)                // Set the ID of the rollmaster to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  // Close Delete Confirmation Modal
  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Handle delete action
  const handleDelete = async () => {
  setLoading(false);
  const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${var_api}medicineuom/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error deleting record");

      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });

      fetchData();
      handleDeleteCancel(); // Close the delete confirmation modal
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    }
  };


  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };


  const handleReset = () => {
    // Reset form fields to their initial values
    form.resetFields();
  };

  const handleOpenApt = (record) =>{
    setAptDetails(record);
    setIsShowDetails(true);
    console.log("record", record);
  }

  

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1,
    },
    // {
    //   title: "Patient",
    //   dataIndex: "patient_name",
    //   render: (text) => text || "-",
    // },
    // {
    //   title: "Doctor",
    //   dataIndex: "technician_name",
    //   render: (text) => text || "-",
    // },
    {
        title: "Date",
        dataIndex: "created_at",
        render: (text) => {
            if (!text) return "-";
            const date = new Date(text);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          },
      },
    {
        title: "Title",
        dataIndex: "title",
        render: (text) => text || "-",
      },
     {
      title: "Body",
      dataIndex: "body",
      render: (text) => text || "-",
    },
    {
        title: "Patient Count",
        dataIndex: "patient_count",
        render: (text) => text || "-",
      },
      
    // {
    //   title: "Action",
    //   dataIndex: "id",
    //   render: (id, record) => {
    //     return (
    //       <button
    //         onClick={() => handleServiceClick(record.lab_service_details)}
    //        className="btn btn-danger"
    //       >
    //         ➜
    //       </button>
    //     );
    //   },
    // }
    // {
    //   title: "Status",
    //   dataIndex: "service_current_status",
    //   render: (text) => {
    //     let backgroundColor = "#000";
    //     let textColor = "#fff"; // White text for better contrast
    
    //     if (text === "completed") backgroundColor = "green";
    //     else if (text === "partial") backgroundColor = "orange";
    //     else if (text === "pending") backgroundColor = "red";
    
    //     const statusStyle = {
    //       backgroundColor,
    //       color: textColor,
    //       padding: "5px 10px",
    //       borderRadius: "5px",
    //       fontWeight: "bold",
    //       display: "inline-block",
    //       textAlign: "center",
    //       minWidth: "100px",
    //     };
    
    //     return <span style={statusStyle}>{text || "-"}</span>;
    //   },
    // }
  ];
  const columnssum = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Service Name",
      dataIndex: "service_name",
      key: "service_name",
      align: "left", // Keeps service name aligned to the left
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      align: "right", // Aligns the count column properly to the right
    }
  ];


  const handleAction = (id, record) => {
      setShowSecondCol(true);
      fetchData(record.id, null);
      setSelectedLabName(record.lab_name);
      SetSelectedLabId(record.id);  
      setSelectedDate(null);
  }



  const labListColumns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Lab Name",
      dataIndex: "lab_name",
      render: (text) => text || "-",
    },
    // {
    //   title: "Action",
    //   dataIndex: "id",
    //   render: (id, record) => {
    //     return (
    //       <button
    //         onClick={() => handleAction(id, record )}
    //        className="btn btn-success"
    //       >
    //         ➜
    //       </button>
    //     );
    //   },
    // },
    // {
    //   title: "Contact Person",
    //   dataIndex: "contact_person",
    //   render: (text) => text || "-",
    // },
    {
      title: "Total Service",
      dataIndex: "service_count",
      render: (text) =>
        text ? text : 0,
    }
    
  ];


    // Maintain status state at the component level
    const [serviceStatuses, setServiceStatuses] = useState(() => {
      const initialStatuses = {};
      selectedLabServices.forEach((service) => {
        initialStatuses[service.id] = Number(service.status);
      });
      return initialStatuses;
    });


    const updateStatusAPI = async (id, newStatus) => {
  const token = localStorage.getItem("token");
  setLoading(true);
  try {
    const response = await fetch(`${var_api}labservicetype/update-status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      setServiceStatuses((prevStatuses) => ({
        ...prevStatuses,
        [id]: newStatus,
      }));
      console.log(`Status updated successfully to ${newStatus}`);
      setIsServiceModalVisible(false);
      fetchData(selectedLabId);
      setIsServiceModalVisible(true);
      setLoading(false);
    } else {
      console.error("Failed to update status");
      setLoading(false);
    }
  } catch (error) {
    console.error("Error updating status:", error);
    setLoading(false);
  }
};
  
const statusMap = {
  0: { label: "New", backgroundColor: "blue" },
  1: { label: "In Progress", backgroundColor: "orange" },
  2: { label: "Completed", backgroundColor: "green" },
};

const buttonStyle = (color) => ({
  backgroundColor: color,
  color: "white",
  padding: "5px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
});
  
    const columnss = [
      { title: "Service Name", dataIndex: "service_name", key: "service_name" },
      { title: "Units", dataIndex: "quantity", key: "quantity" },
      { title: "Amount", dataIndex: "service_amt", key: "service_amt" },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text, record) => {
          const status = serviceStatuses[record.id] ?? Number(record.status);
    
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Status Label */}
              <span
                style={{
                  color: statusMap[status]?.backgroundColor || "black",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  minWidth: "100px",
                  textAlign: "center",
                }}
              >
                {statusMap[status]?.label || "Unknown"}
              </span>
    
              {/* Status Update Buttons */}
              {status === 0 && (
                <button onClick={() => updateStatusAPI(record.id, 1)} style={buttonStyle("orange")}>
                  Start
                </button>
              )}
              {status === 1 && (
                <button onClick={() => updateStatusAPI(record.id, 2)} style={buttonStyle("green")}>
                  Complete
                </button>
              )}
              {status === 2 && (
                <button style={buttonStyle("gray")} disabled>
                  Completed
                </button>
              )}
            </div>
          );
        },
      },
    ];

    const handleClearDate = () =>{
      setSelectedDate("");
      fetchData(selectedLabId);
    }


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
                <h3 className="page-title">Push Notification</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Push Notification</li>
                </ul>
              </div>

              <div className="col d-flex justify-content-end">
                   <ul className="nav nav-tabs nav-tabs-solid">
                           <li className="nav-item">
                             <Link
                               className={`nav-link ${activeTab === "serviceType" ? "active" : ""}`}
                               onClick={() => setActiveTab("serviceType")}
                               to="#"
                             >
                               Send Notification
                             </Link>
                           </li>
                            <li className="nav-item">
                            <Link
                              className={`nav-link ${activeTab === "medications" ? "active" : ""}`}
                              onClick={() => setActiveTab("medications")}
                              to="#"
                            >
                              Notification Details
                            </Link>
                          </li>
                         </ul>
              </div>
              </div>
            </div>
          </div>
          
          <div className="row" style={{marginTop:"-80px", padding:"5px 20px"}}>
          {activeTab === "serviceType" && (
            <div className="col-md-12 col-lg-12">
              <div className="card">
              <div className="card-header">
          <h4 className="card-title">Send Notification</h4>
        </div>
        <div className="card-body">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <input placeholder="Enter notification title"  className="form-control"/>
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter a description" }]}
            >
             <input placeholder="Enter notification Description"  className="form-control"/>
            </Form.Item>

            <Form.Item label="Select Patients">
              <Checkbox
                checked={selectAll}
                onChange={(e) => setSelectAll(e.target.checked)}
              >
                Select All
              </Checkbox>
              <Select
                mode="multiple"
                value={selectedPatients}
                onChange={(value) => {
                  setSelectAll(value.length === patientList.length);
                  setSelectedPatients(value);
                }}
                showSearch
                optionFilterProp="children"
                style={{ width: "100%", marginTop: "10px" }}
                placeholder="Select patients"
                maxTagCount={2} // Show only 2 names, rest will be "+n"
                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
              >
                {patientList.map((patient) => (
                  <Option key={patient.id} value={patient.id}>
                    {patient.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Button type="primary" onClick={handleSend}>
              Send Notification
            </Button>
          </Form>
                  {/* <div className="table-responsive">
                    <Table
                        pagination={{
                        total: labList.length,
                        pageSize: labpageSize, // Limit to 2 rows per page
                        current: labcurrentPage,
                        showSizeChanger: false,
                        onShowSizeChange: (current, size) => handleLabPaginationChange(current, size),
                        onChange: handleLabPaginationChange,
                        itemRender: itemRender,
                                                                                    
                        }}
                      loading={labloading}
                      columns={labListColumns}
                      dataSource={labList || []}
                      rowKey="id"
                    />
                  </div> */}
                </div>
              </div>
            </div>
          )}


      {activeTab === "medications" && (
            <div className="col-sm-12 col-md-12 col-lg-12">
                <div className="card">
                <div className="card-header">
                  <h4 className="card-title" style={{textTransform:"uppercase"}}>Notification List</h4>
                </div>
                <div className="card-body">

                <div className="row mb-3 d-flex justify-content-end">
 
 
  <div className="col-auto">
    {/* Eye Icon */}
    {/* <span
      style={{
        cursor: "pointer",
        padding: "8px",
        color: "blue",
        fontSize: "18px",
      }}
      onClick={handleShow}
    >
      <Eye size={20} color="blue" />
    </span> */}
   
    {/* Search Input */}
    
    <input
      className="form-control"
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={handleSearch}
    />
  </div>

 
</div>

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
                      dataSource={filteredData || []}
                      rowKey="appointment_id"
                    />
                
                  </div>
                </div>
              </div>
            </div>
      )}
          </div>
        </div>


<Modal
      title="Lab Service Details"
      visible={isServiceModalVisible}
      onCancel={handleServiceModalClose}
      footer={null}
      width={700}
    >
      <Table columns={columnss} dataSource={selectedLabServices} rowKey="id" pagination={false} />
    </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
  title="Apt Details"
  visible={isShowDetails}
  onCancel={() => setIsShowDetails(false)}
  footer={null}
>
  <div className="container mt-3">
    {/* Row 1: Doctor & Patient */}
    <div className="row mb-3">
      <div className="col-6 d-flex align-items-center gap-2">
        <Stethoscope className="w-5 h-5 text-blue-500" />
        <span className="fw-semibold">Doctor:</span> {aptDetails?.technician_name}
      </div>
      <div className="col-6 d-flex align-items-center gap-2">
        <User className="w-5 h-5 text-green-500" />
        <span className="fw-semibold">Patient:</span> {aptDetails?.patient_name}
      </div>
    </div>

    {/* Row 2: Appointment Date & Time */}
    <div className="row">
      <div className="col-6 d-flex align-items-center gap-2">
        <Calendar className="w-5 h-5 text-red-500" />
        <span className="fw-semibold">Date:</span> {aptDetails?.appointment_day}
      </div>
      <div className="col-6 d-flex align-items-center gap-2">
        <Clock className="w-5 h-5 text-purple-500" />
        <span className="fw-semibold">Time:</span> {aptDetails?.appointment_time}
      </div>
    </div>
  </div>
</Modal>


    </>
  );
};

export default pushNotification;
