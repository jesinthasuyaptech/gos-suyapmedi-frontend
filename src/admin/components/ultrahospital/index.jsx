import React, { useState, useEffect } from "react";
import SidebarNav from "../ultrasidebar";
import { Table, Button, Modal, Form, Input, Select,DatePicker, InputNumber,notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { image_api } from "../../../constant";
import "../styles/Loader.css";
import dayjs from "dayjs";
import axios from "axios";


const ultrahospital = () => {
  const [data, setData] = useState([]);
  const [isModalOpensub, setIsModalOpensub] = useState(false);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletename , setDeletename] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalpatient, settotalpatient] = useState(false);
  const [totalappointment, settotalappointment] = useState(false);
  const [totalappt, settotalappt] = useState(0);
  const [totalpatie,settotalpatie] = useState(0);
  const [invoprofit, setinvoprofit] = useState(false);
  const [invoiceprofit, setinvoiceprofit] = useState(false);
  const [totaldoctor, settotaldoctor]= useState(false);
  const [totalnontech, settotalnontech]= useState(false);
  const [totaltech, settotaltech]= useState(false);
  const [hospitalName, setHospitalName] = useState("Hospital Name");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedStatus, setSelectedstatus] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [count, setCount] = useState(0);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [FilteredDatasub,setFilteredDatasub] = useState([]);
  const [Datasub,setDatasub] = useState([]);
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
  const [hospitalId, setHospitalId] = useState(null);
  const [hospitalDetailId, setHospitalDetailId] = useState(null);
  const [packageType, setPackageType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editingData, setEditingData] = useState(null);

  const history = useHistory(); 
  console.log("selectedId",selectedId)
  const options = [
    { value: 3, label: "Today" },    // value: 3
    { value: 0, label: "Weekly" },   // value: 0
    { value: 1, label: "Monthly" },  // value: 1
    { value: 2, label: "Yearly" },   // value: 2
  ];
 const [selectedOption, setSelectedOption] = useState(options[0]);
const [isModalVisiblearrow, setIsModalVisiblearrow] = useState(false);
const [selectedRecord, setSelectedRecord] = useState(null);
const [stats, setStats] = useState({ totaldoctor: 0, totalpatient: 0, totalappointment: 0 });
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);

console.log("hospitalId:", hospitalId);
console.log("hospitalDetailId:", hospitalDetailId);

const handleModalOpenarrow = (record) => {
  setSelectedRecord(record);
  setIsModalVisiblearrow(true);
};


const handleAddSubscription = () => {
  setIsModalOpensub(false); // Close the main modal
  setIsAddSubscriptionOpen(true); // Open the "+ Subscription" modal
};

const handleOpenModal = (record) => {
  setSelectedData(record); // Store selected row data
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setSelectedData(null);
};

const handleButtonClick = (id,name,details_id) => {
  setSelectedRowId(id); // Set the clicked row's ID
  setSelectedId(id);
  setSelectedName(name);
  setHospitalId(id);
  setHospitalDetailId(details_id)
  fetchappointmentData(id); // Call immediately after setting the state
  fetchpatientData(id);
  fetchinvoiceData(id);
  fetchtechData(id);
  fetchnontechData(id);
  handleStatusChange();
  fetchDatasub(id);

  const filteredCount = data.filter((item) => item.id === id).length;
  setCount(filteredCount);
};


const handlePackageChange = (value) => {
  const today = dayjs(); // use dayjs for date handling
  let end;

  if (value === "Trail") {
    end = today.add(30, "day");
  } else if (value === "Yearly") {
    end = today.add(365, "day");
  }

  setStartDate(today);
  setEndDate(end);

  // Set values to form fields
  form.setFieldsValue({
    start_date: today,
    end_date: end,
  });
};


const handleEditPackageChange = (value) => {
  let start = editForm.getFieldValue("start_date"); // Get existing start_date from form
  let end;

  // Use the existing start date instead of today's date
  if (value === "Trail") {
    end = dayjs(start).add(30, "day");
  } else if (value === "Yearly") {
    end = dayjs(start).add(365, "day");
  }

  setEndDate(end); // Only update end date based on existing start
  editForm.setFieldsValue({
    end_date: end,
  });
};




const handleFormSubmitsub= async (values) => {
  try {
  
    const token = localStorage.getItem("ultratoken");

    setLoading(true);

    // Ensure all required fields are present
    const formData = {
      hospital_id: hospitalId,
      hospitaldetail_id: hospitalDetailId,
      start_date: values.start_date ? values.start_date.format("DD-MM-YYYY") : null,
      end_date: values.end_date ? values.end_date.format("DD-MM-YYYY") : null,
      package_name: values.package_name,
      amount: values.amount,
    };
    
    console.log("FormData being sent:", formData);
    const url = `${var_api}subscription/post`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 401) {
      history.push("/admin/login");
      notification.warning({
        message: "Unauthorized",
        description: "Your session has expired. Please log in again.",
      });
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error("Error saving data");
    }

    setLoading(false);

    notification.success({
      message: "Subscription Saved",
      description: "The subscription details have been successfully saved.",
    });

    fetchDatasub(selectedId); 
    setIsAddSubscriptionOpen(false);       // Refresh your table or data
    setIsModalOpensub(true); // Close modal or form
  } catch (error) {
    console.error("Error saving subscription:", error);

    notification.error({
      message: "Save Failed",
      description: `There was an error while saving the subscription data: ${error.message}`,
    });

    setLoading(false); // Ensure loading spinner stops even on error
  }
};



// const handleStatusChange = async (selectedValue) => {
//   // Find the full object using the selected value
//   const selectedOption = options.find(option => option.value === selectedValue);

//   console.log("Raw Selected Value:", selectedValue);
//   console.log("Processed Selected Option:", selectedOption);

//   if (!selectedOption) {
//     console.error("No valid option selected");
//     return;
//   }

//   // Store selected option in state
//   setSelectedOption(selectedOption);
//   setLoading(true);

//   const hospital_id = localStorage.getItem('hospital_id');
//   const ultratoken = localStorage.getItem('ultratoken');

//   let apiEndpoint = '';
//   switch (selectedOption.value) {
//     case 3: // Today
//       apiEndpoint = `appointment/appointmentsbyhos-overall-count-today/${hospital_id}`;
//       break;
//     case 0: // Weekly
//       apiEndpoint = `appointment/appointmentsbyhos-overall-count-week/${hospital_id}`;
//       break;
//     case 1: // Monthly
//       apiEndpoint = `appointment/appointmentsbyhos-overall-count-month/${hospital_id}`;
//       break;
//     case 2: // Yearly
//       apiEndpoint = `appointment/appointmentsbyhos-overall-count-year/${hospital_id}`;
//       break;
//     default:
//       console.error("Invalid option selected:", selectedOption.value);
//       return;
//   }

//   try {
//     const response = await fetch(`${var_api}${apiEndpoint}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${ultratoken}`,
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch data");

//     const result = await response.json();

//     // Dynamically set the correct count based on the selected option
//     let appointmentCount = 0;

//     switch (selectedOption.value) {
//       case 0: // Weekly
//         appointmentCount = result.week_count || 0;
//         break;
//       case 1: // Monthly
//         appointmentCount = result.month_count || 0;
//         break;
//       case 2: // Yearly
//         appointmentCount = result.year_count || 0;
//         break;
//       case 3: // Today
//       default:
//         appointmentCount = result.total_appointments || 0;
//         break;
//     }

//     settotalappt(appointmentCount);
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




// const handleNavigate = (id) => {
//   history.push(`/hospital-details/${id}`);
// };

const handleStatusChange = async (selectedValue) => {
  // Find the full object using the selected value
  const selectedOption = options.find(option => option.value === selectedValue);

  console.log("Raw Selected Value:", selectedValue);
  console.log("Processed Selected Option:", selectedOption);

  if (!selectedOption) {
    console.error("No valid option selected");
    return;
  }

  // Store selected option in state
  setSelectedOption(selectedOption);
  setLoading(true);

  const hospital_id = localStorage.getItem('hospital_id');
  const ultratoken = localStorage.getItem('ultratoken');

  let appointmentApi = "";
  let patientApi = "";
  let invoiceApi = "";

  switch (selectedOption.value) {
    case 3: // Today
      appointmentApi = `appointment/appointmentsbyhos-overall-count-today/${selectedId}`;
      patientApi = `patientdetails/getByHos-overall-count-today/${selectedId}`;
      invoiceApi = `invoicebilling/getByHos-overall-profit-today/${selectedId}`;
      break;
    case 0: // Weekly
      appointmentApi = `appointment/appointmentsbyhos-overall-count-week/${selectedId}`;
      patientApi = `patientdetails/getByHos-overall-count-week/${selectedId}`;
      invoiceApi = `invoicebilling/getByHos-overall-profit-week/${selectedId}`;
      break;
    case 1: // Monthly
      appointmentApi = `appointment/appointmentsbyhos-overall-count-month/${selectedId}`;
      patientApi = `patientdetails/getByHos-overall-count-month/${selectedId}`;
      invoiceApi = `invoicebilling/getByHos-overall-profit-month/${selectedId}`;
      break;
    case 2: // Yearly
      appointmentApi = `appointment/appointmentsbyhos-overall-count-year/${selectedId}`;
      patientApi = `patientdetails/getByHos-overall-count-year/${selectedId}`;
      invoiceApi = `invoicebilling/getByHos-overall-profit-year/${selectedId}`;
      break;
    default:
      console.error("Invalid option selected:", selectedOption.value);
      return;
  }

  try {
    // Fetch all data in parallel
    const [appointmentResponse, patientResponse, invoiceResponse] = await Promise.all([
      fetch(`${var_api}${appointmentApi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${ultratoken}`,
        },
      }),
      fetch(`${var_api}${patientApi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${ultratoken}`,
        },
      }),
      fetch(`${var_api}${invoiceApi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${ultratoken}`,
        },
      }),
    ]);

    if (!appointmentResponse.ok || !patientResponse.ok || !invoiceResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const [appointmentResult, patientResult, invoiceResult] = await Promise.all([
      appointmentResponse.json(),
      patientResponse.json(),
      invoiceResponse.json(),
    ]);

    // Dynamically set the correct values based on the selected option
    let appointmentCount = 0;
    let patientCount = 0;
    let invoiceProfit = 0;

    switch (selectedOption.value) {
      case 0: // Weekly
        appointmentCount = appointmentResult.week_count || 0;
        patientCount = patientResult.week_count || 0;
        invoiceProfit = invoiceResult.total_profit ?? 0; // Convert null to 0
        break;
      case 1: // Monthly
        appointmentCount = appointmentResult.month_count || 0;
        patientCount = patientResult.month_count || 0;
        invoiceProfit = invoiceResult.total_profit ?? 0; // Convert null to 0
        break;
      case 2: // Yearly
        appointmentCount = appointmentResult.year_count || 0;
        patientCount = patientResult.year_count || 0;
        invoiceProfit = invoiceResult.total_profit ?? 0; // Convert null to 0
        break;
      case 3: // Today
      default:
        appointmentCount = appointmentResult.total_appointments || 0;
        patientCount = patientResult.total_patients || 0;
        invoiceProfit = invoiceResult.total_profit ?? 0; // Convert null to 0
        break;
    }

    settotalappt(appointmentCount);
    settotalpatie(patientCount);
    setinvoprofit(invoiceProfit);
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
console.log("hhhh",filteredData);
const handleNavigate = (id) => {
  history.push(`/admin/ultrahospitaldetails`);
};

// setStats({
//     totaldoctor: Math.floor(Math.random() * 100),
//     totalpatient: Math.floor(Math.random() * 500),
//     totalappointment: Math.floor(Math.random() * 300),
//   });

//   setIsModalVisiblearrow(true);
// };



  //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0aW1lc3RhbXAiOjE3MzUzNzU0MjQ2MzAsImlhdCI6MTczNTM3NTQyNH0.jkA7TNIJzIPxyrmigzrLmVmPz1ZiTDpHf5eTyMvoqjA";
  const fetchData = async () => {
    setLoading(true);
    const ultratoken = localStorage.getItem('ultratoken');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}hospital/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${ultratoken}`,
        },
      });
      if (response.status === 401) {
        // history.push("/admin/superultraadmin"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []); // Set initial filtered data
      setLoading(false);
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

    const fetchpatientData = async (id) => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}appointment/appointmentsbyhos-overall-count/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotalappointment(result.total_appointments);// Set initial filtered data
        
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
    const fetchappointmentData = async (id) => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}patientdetails/getByHos-overall-count/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotalpatient(result.patients_count);// Set initial filtered data
        
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
    const fetchnontechData = async (id) => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}nontechnicalstaff/getByHos-overall-count/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotalnontech(result.nontech_count);// Set initial filtered data
        
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
    const fetchtechData = async (id) => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}technicalstaff/getByHos-overall-count/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        settotaltech(result.technical_count);// Set initial filtered data
        
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
    const fetchinvoiceData = async (id) => {
      setLoading(true);
      const hospital_id = localStorage.getItem('hospital_id');
      const ultratoken = localStorage.getItem('ultratoken');
      try {
        const response = await fetch(`${var_api}invoicebilling/getByHos-overall-profit/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`, 
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setinvoiceprofit(result.total_profit);// Set initial filtered data
        
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
 


    const fetchDatasub = async (id) => {
      setLoading(true);
      const ultratoken = localStorage.getItem('ultratoken');
      const hospital_id = localStorage.getItem('hospital_id');
      try {
        const response = await fetch(`${var_api}subscription/getby-hospital/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${ultratoken}`,
          },
        });
        if (response.status === 401) {
          // history.push("/admin/superultraadmin"); // Redirect to login page
          notification.warning({
            message: "Unauthorized",
            description: "Your session has expired. Please log in again.",
          });
        return;
        }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setDatasub(result || []);
        setFilteredDatasub(result || []); // Set initial filtered data
        setLoading(false);
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

  // useEffect(() => {
  //   fetchData();
  //   fetchpatientData();
  //   fetchappointmentData();
  //   fetchnontechData();
  //   fetchtechData();
  //   fetchinvoiceData();
  //   fetchDatasub();
  // }, []);

  useEffect(() => {
    fetchData();
  
      // fetchDatasub();

  }, []); // Ensure it runs when selectedId changes
  



  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(
      (item) =>
        item.uom_name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

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
        // history.push("/admin/superultraadmin"); // Redirect to login page
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

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
      width: 70,
      fixed: "left", // Fix S.No to the left if needed
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => handleOpenModal(record)}
        >
          {text ? text : "-"}
        </span>
      ),
      sorter: (a, b) => a.name?.localeCompare(b.name),
      width: 150,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (text) => (text ? text : "-"),
      width: 150,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="primary"
          style={{
            backgroundColor: selectedRowId === record.id ? "darkblue" : "skyblue",
            color: "#fff",
            borderColor: selectedRowId === record.id ? "darkblue" : "skyblue",
          }}
          icon={<RightOutlined />}
          onClick={() => handleButtonClick(record.id, record.name, record.details_id)}
        />
      ),
      width: 100,
      fixed: "right", // Fix Action column to the right if needed
    },
  ];


  const columnssub = [
    {
      title: "S.No",
      key: "serialNo",
      render: (_, __, index) => index + 1, // Generates S.No dynamically
    },
    {
      title: "Package Name",
      dataIndex: "package_name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "email",
    },
    {
      title: "Action",
      className: "text-start",
      render: (_, record) => (
        <div className="text-start">
          <a
            // href="#"
            className="me-1 btn btn-sm bg-success-light"
            // data-bs-toggle="modal"
            // data-bs-target="#edit_specialities_details"
            onClick={() => handleEditClick(record)}
          >
            <i className="fe fe-pencil"></i> Edit
          </a>
        </div>
      ),
    },
    
  ];


  //edit subscription modal
  const handleEditClick = (record) => {
    setEditingData(record); // store selected row
    editForm.setFieldsValue({
      package_name: record.package_name,
      start_date: dayjs(record.start_date), // use dayjs for date formatting
      end_date: dayjs(record.end_date),
      amount: record.amount,
    });
    setIsEditModalOpen(true);
    console.log("record", record);
  };
  

  //update through api
  const handleUpdateSubmit = async (values) => {
    const token = localStorage.getItem("ultratoken");
    setLoading(true);
    try {
      const payload = {
        ...values,
        start_date: values.start_date.format("DD-MM-YYYY") ,
        end_date: values.end_date.format("DD-MM-YYYY"),
        hospital_id : editingData?.hospital_id,
        hospitaldetail_id: editingData?.hospitaldetail_id,
      };
  
      // Replace with your API endpoint and method
      await axios.put(`${var_api}subscription/update/${editingData?.id}`, payload,  {
        headers: {
          Authorization: `${token}`, // ⬅️ Pass token here
          "Content-Type": "application/json",
        },
      });
      notification.success({
        message: "Update Successful",
        description: "Subscription updated successfully!",
      });
      setIsEditModalOpen(false);
      fetchDatasub(selectedId); 
      setIsModalOpensub(true);
    } catch (error) {
      console.error("Update failed", error);
      notification.error({
        message: "Update Failed",
        description: "Update failed. Please try again.",
      });
    } finally{
      setLoading(false);
    }
  };
   



  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        {loading && <div className="loader-overlay"><div className="loader"></div></div>}
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Hospital</h3>
                <div className="d-flex justify-content-between align-items-center mb-3">
  <ul className="breadcrumb m-0">
    <li className="breadcrumb-item"><Link to="/superultraadmin">Dashboard</Link></li>
    <li className="breadcrumb-item active">Hospital Tables</li>
  </ul>
</div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header"><h4 className="card-title">Hospital</h4></div>
                <div className="card-body" style={{ overflowX: "auto" }}>
  <Table
    columns={columns}
    dataSource={filteredData}
    pagination={{
      total: filteredData.length,
      pageSize,
      current: currentPage,
      onChange: handlePaginationChange,
      itemRender: itemRender,
    }}
    rowKey={(record) => record.id}
    loading={loading}
    scroll={{ x: "max-content" }} // Enables horizontal scrolling
  />
</div>
              </div>
            </div>
            
            <div className="col-md-4">
  <div className="card h-100">
  <div className="card-header"><h4 className="card-title">
  <div className="d-flex justify-content-between align-items-center"> {/* Flex container with space between */}
  <p style={{ 
    fontWeight: "bold", 
    padding: "4px", 
    borderRadius: "4px", 
    fontSize: "20px",
    margin: 0 // remove default margin
  }}>
    {selectedName}
  </p>
  {
    selectedName && (
      <Button 
      type="primary" 
      onClick={() => setIsModalOpensub(true)} 
      style={{ backgroundColor: "green", borderColor: "green" }}
    >
      Subscription
    </Button>
    )
  }
 
</div>

    </h4></div>
    <div className="card-body p-2">
     
      {/* <div className="d-flex justify-content-left"> 
      <p style={{ 
  fontWeight: "bold", 
  //backgroundColor: "yellow", 
  padding: "4px", 
  borderRadius: "4px", 
  fontSize: "20px" // Increase text size
}}>
  {selectedName}
</p>
<Button type="primary" onClick={() => setIsModalOpensub(true)} style={{ backgroundColor: "green", borderColor: "green" }}>
        Subscription
      </Button>
      </div> */}
      {/* <hr/> */}
                <ul className="nav nav-tabs nav-tabs-solid">
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${activeTab === "All" ? "active" : ""}`}
                        onClick={() => setActiveTab("All")}
                        to="#"
                      >
                        All
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${activeTab === "timeline" ? "active" : ""}`}
                        onClick={() => setActiveTab("timeline")}
                        to="#"
                      >
                        Time Line
                      </Link>
                    </li>
                  </ul>
                  <br/>
                  
    
                  {activeTab === "All" && (
  <div>
    <div className="row">
      <div className="col-md-6 col-12">
        <div className="card h-100" style={{ minHeight: "150px" }}>
          <div className="card-body text-center p-2">
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
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${Math.min(totalpatient, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-12">
        <div className="card h-100" style={{ minHeight: "150px" }}>
          <div className="card-body p-2">
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
                <div
                  className="progress-bar bg-danger"
                  style={{ width: `${Math.min(totalappointment, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Additional Rows */}
    <div className="row mt-2">
      <div className="col-md-6 col-12">
        <div className="card h-100" style={{ minHeight: "150px" }}>
          <div className="card-body p-2">
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
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${Math.min(totalnontech, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-12">
        <div className="card h-100" style={{ minHeight: "150px" }}>
          <div className="card-body p-2">
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
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${Math.min(totaltech, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-12">
        <div className="card h-100" style={{ minHeight: "150px" }}>
          <div className="card-body p-2">
            <div className="dash-widget-header">
              <span className="dash-widget-icon text-success border-success">
                <i className="fas fa-file-invoice" />
              </span>
              <div className="dash-count">
                <h3>₹{invoiceprofit || 0}</h3>
              </div>
            </div>
            <div className="dash-widget-info">
              <h6 className="text-muted">Invoice Profit</h6>
              <div className="progress progress-sm">
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${Math.min(invoiceprofit, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{activeTab === "timeline" && ( 
  <div>
           <div style={{ display: "flex", justifyContent: "flex-end" }}>
<Select
  className="select-social-img"
  value={selectedOption?.value} // Use `.value` since Select expects a primitive
  onChange={handleStatusChange} // onChange now receives the value only
  options={options}
  placeholder="Select Platform"
  style={{ width: '100px', marginLeft: '10px', height: '45px' }}
/>
    </div>
      <hr/>
  <div className="row">
    {/* First Card */}
    <div className="col-md-6 col-12">
      <div className="card h-100" style={{ minHeight: "150px" }}>
        <div className="card-body p-2">
          <div className="dash-widget-header">
            <span className="dash-widget-icon text-danger border-danger">
              <i className="fe fe-money" />
            </span>
            <div className="dash-count">
              <h3>{totalappt}</h3>
            </div>
          </div>
          <div className="dash-widget-info">
            <h6 className="text-muted">Appointment</h6>
            <div className="progress progress-sm">
              <div
                className="progress-bar bg-danger"
                style={{ width: `${Math.min(totalappt, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Second Card */}
    <div className="col-md-6 col-12">
      <div className="card h-100" style={{ minHeight: "150px" }}>
        <div className="card-body text-center p-2">
          <div className="dash-widget-header">
            <span className="dash-widget-icon text-success">
              <i className="fe fe-credit-card" />
            </span>
            <div className="dash-count">
              <h3>{totalpatie}</h3>
            </div>
          </div>
          <div className="dash-widget-info">
            <h6 className="text-muted">Patients</h6>
            <div className="progress progress-sm">
              <div
                className="progress-bar bg-success"
                style={{ width: `${Math.min(totalpatie, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Second Row */}
  <div className="row mt-2">
    {/* Third Card */}
    <div className="col-md-6 col-12">
      <div className="card h-100" style={{ minHeight: "150px" }}>
        <div className="card-body p-2">
          <div className="dash-widget-header">
            <span className="dash-widget-icon text-success border-success">
              <i className="fas fa-file-invoice" />
            </span>
            <div className="dash-count">
              <h3>₹{invoprofit || 0}</h3>
            </div>
          </div>
          <div className="dash-widget-info">
            <h6 className="text-muted">Invoice Profit</h6>
            <div className="progress progress-sm">
            <div
  className="progress-bar bg-success"
  style={{ width: `${Math.min(invoprofit, 100).toFixed(2)}%` }}
/>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Fourth Card (Placeholder for additional card) */}
  </div>
</div>

)}

<Modal
        title="Hospital Details"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
{selectedData && (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
    {/* Profile Image Section */}
    {selectedData.profile_image && (
      <div style={{ width: "100%", textAlign: "center" }}>
        <img
          src={`${image_api}${selectedData.profile_image}`} 
          alt="Profile"
          style={{
            width: "120px", // Adjust size as needed
            height: "120px",
            borderRadius: "50%", // Circular image
            objectFit: "cover",
            border: "2px solid #ccc",
            padding: "5px"
          }}
        />
      </div>
    )}

    {/* User Details Section */}
    <div style={{ width: "48%" }}><strong>Name:</strong> {selectedData.name}</div>
    <div style={{ width: "48%" }}><strong>Address:</strong> {selectedData.address}</div>
    <div style={{ width: "48%" }}><strong>Mobile:</strong> {selectedData.mobile}</div>
    <div style={{ width: "48%" }}><strong>Email :</strong> {selectedData.email}</div>
    <div style={{ width: "48%" }}><strong>Password:</strong> {selectedData.password}</div>
    <div style={{ width: "48%" }}><strong>Website :</strong> {selectedData.website}</div>
    <div style={{ width: "48%" }}><strong>State :</strong> {selectedData.state}</div>
    <div style={{ width: "48%" }}><strong>Country :</strong> {selectedData.country}</div>
  </div>
)}


      </Modal>
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
      <Modal
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left' }}>
              <span>Subscription Plan</span>
              <Button type="primary" onClick={handleAddSubscription} style={{marginRight:"30px"}}>Add</Button>
            </div>
          }
        open={isModalOpensub}
        onCancel={() => setIsModalOpensub(false)}
        width={800} // Adjust width for better table display
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpensub(false)}>
            Close
          </Button>,
        ]}
      >
        <Table
          dataSource={FilteredDatasub}
          columns={columnssub}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      <Modal
  title="Add Subscription"
  open={isAddSubscriptionOpen}
  onCancel={() => setIsAddSubscriptionOpen(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsAddSubscriptionOpen(false)}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={() => form.submit()}>
      Submit
    </Button>,
  ]}
>
<Form
  form={form}
  layout="vertical"
  onFinish={handleFormSubmitsub} // make sure this is defined
  onCancel={() => setIsModalOpensub(false)}
  destroyOnClose
>
  <Form.Item
    label="Package"
    name="package_name"
    rules={[{ required: true, message: 'Please enter package name' }]}
  >
    <Select placeholder="Select package" onChange={handlePackageChange}>
      <Select.Option value="Trail">Trail</Select.Option>
      <Select.Option value="Yearly">Yearly</Select.Option>
    </Select>
  </Form.Item>

  <Form.Item
    label="Start Date"
    name="start_date"
    rules={[{ required: true, message: 'Please select start date' }]}
  >
    <DatePicker style={{ width: '100%' }}  disabled 
    value={startDate} />
  </Form.Item>

  <Form.Item
    label="End Date"
    name="end_date"
    rules={[{ required: true, message: 'Please select end date' }]}
  >
    <DatePicker style={{ width: '100%' }}  disabled 
    value={endDate} />
  </Form.Item>

  <Form.Item
    label="Amount"
    name="amount"
    rules={[{ required: true, message: 'Please enter amount' }]}
  >
    <InputNumber
      style={{ width: '100%' }}
      min={0}
      placeholder="Enter amount"
      formatter={(value) => `₹ ${value}`}
      parser={(value) => value.replace(/₹\s?|(,*)/g, '')}
    />
  </Form.Item>

  {/* <Form.Item>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item> */}
</Form>

</Modal>


<Modal
  title="Edit Subscription"
  open={isEditModalOpen}
  onCancel={() => setIsEditModalOpen(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={() => editForm.submit()}>
      Update
    </Button>,
  ]}
>
  <Form
    form={editForm}
    layout="vertical"
    onFinish={handleUpdateSubmit}
    destroyOnClose
  >
    <Form.Item
      label="Package"
      name="package_name"
      rules={[{ required: true, message: "Please select package" }]}
    >
      <Select placeholder="Select package" onChange={handleEditPackageChange}>
        <Select.Option value="Trail">Trail</Select.Option>
        <Select.Option value="Yearly">Yearly</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="Start Date"
      name="start_date"
      rules={[{ required: true, message: "Please select start date" }]}
    >
      <DatePicker style={{ width: "100%" }} disabled />
    </Form.Item>

    <Form.Item
      label="End Date"
      name="end_date"
      rules={[{ required: true, message: "Please select end date" }]}
    >
      <DatePicker style={{ width: "100%" }} disabled />
    </Form.Item>

    <Form.Item
      label="Amount"
      name="amount"
      rules={[{ required: true, message: "Please enter amount" }]}
    >
      <InputNumber
        style={{ width: "100%" }}
        min={0}
        placeholder="Enter amount"
        formatter={(value) => `₹ ${value}`}
        parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
      />
    </Form.Item>
  </Form>
</Modal>

    </>
  );
};

export default ultrahospital;
