import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, Select, TimePicker, Switch, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"; 
import dayjs from 'dayjs';
import "../styles/Loader.css";
import { var_api } from "../../../constant";



const AvailableDayAndTime = () => {
  const [data, setData] = useState([]);
  const[datainsta,setDatainsta] =useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletename , setDeletename] = useState(null);
  const [Technicalstaff, setTechnicalstaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const history = useHistory(); // useNavigate for navigation
  const [startTime, setStartTime] = useState("");
  const [formatstartTime, setFormatStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formatendTime, setFormatEndTime] = useState("");
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalpop, setIsModalpop] = useState(false);
  const [installDetails, setInstallDetails] = useState(null);
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
  

  // Fetch data from the backend
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem("hospital_id");

    try {
      const response = await fetch(`${var_api}gos-slot/getby-hospital/${hospital_id}`, {
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
                    return;
                  }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result.map(item => ({
        ...item,
        active_status: item.active_status === 1 ? "Active" : "Inactive", // Convert active_status
      })));
      setFilteredData(result);
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
  const fetchDoctor = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}technicalstaff/get-by-doctor/${hospital_id}/doctor`, {
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
                    return;
                  }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result.map(item => ({
        ...item,
        active_status: item.active_status === 1 ? "Active" : "Inactive", // Convert active_status
      })));
      setTechnicalstaff(result || []);
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
        if (firstItem) {
          setInstallDetails(firstItem); // Save the full object
        }

        console.log("availabletime value:", firstItem?.availabletime);
    
        // ✅ Save installation_id in localStorage if it exists
        if (result?.id) {
          localStorage.setItem("installation_id", result.id);
          console.log("Saved installation_id:", result.id); // ✅ confirm this
        }
      
    
        setDatainsta(result || []);
        if (!firstItem.availabletime && firstItem?.availabletime === 0) {
          console.log("Modal should show: availabletime is 0");
          setIsModalOpen(true);
        } else {
          console.log("Modal not triggered: availabletime is not 0");
        }
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




  // const handleSwitchChange = (e, recordId) => {
  //   const isChecked = e.target.checked; // true if checked, false if unchecked
  
  //   const newStatus = isChecked ? 1 : 0; // If checked, pass 1, else pass 0
  // console.log(recordId);
  //   // Optionally, update the backend or local state
  //   updateSlotStatus(recordId, newStatus);
  // };

  const handleSwitchChange = (record, slot) => {
    const newStatus = slot.is_active === 1 ? 0 : 1;
    updateSlotStatus(record, newStatus, slot);
    console.log("harinik",slot)
  };

  


  const updateSlotStatus = (record, newStatus,slot) => {
    const token = localStorage.getItem('token');
  
    // const firstSlot = record.time_slots?.[0];
  
    // if (!firstSlot) {
    //   console.error("No time slot found for the record");
    //   return;
    // }
    const payload = {
      // tec_staff_id: record.tec_staff_id,
      // available_day: record.available_day,
      from_time: slot.from_time,
      to_time: slot.to_time,
      is_active: newStatus,
    };
    // Include time_slot id in the API endpoint
    fetch(`${var_api}gos-slot/update/${slot.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json().then((data) => ({ data, status: response.status }));
      })
      .then(({ data, status }) => {
        console.log('Update successful:', data);
        if (status === 200) {
          fetchData(); // Refresh updated records
        }
      })
      .catch((error) => {
        console.error('Error updating slot:', error);
      });
  };
  
  


  const handleTimeChangeEnd = (time) => {
    console.log("Time passed to handleTimeChangeEnd:", time);

    if (!time || !time.isValid()) {
      setError("Please select a valid time.");
      return;
    }
    const formattedTime = time.format("HH:mm:ss");
    setFormatEndTime(formattedTime); // Update the state with the formatted time
    setError(""); // Clear any previous errors
    setEndTime(time);
  };
  const handleTimeChange = (time) => {
    // Ensure time is a valid Day.js object
if (!time || !time.isValid()) {
  setError("Please select a valid time.");
  return;
}
// Extract time in HH:mm:ss format
const formattedTime = time.format("HH:mm:ss");
console.log("Formatted Time:", formattedTime);
setFormatStartTime(formattedTime); // Update the state with the formatted time
setError(""); // Clear any previous errors
setStartTime(time);
  };

  // Effect hook to load data on component mount
  useEffect(() => {
    // fetchinstalldata();
    fetchData();
    // fetchDoctor();
  }, []);


  // Handle search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = data.filter((item) => {
      const doctor = item.from_time?.toLowerCase() || "";
      const day = item.to_time?.toLowerCase() || "";
     
      return (
        doctor.includes(value) ||
        day.includes(value)
      );
    });
  
    setFilteredData(filtered);
  };
  
  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };


  const parseTime = (time) => {
  if (!time) return null;
  return dayjs(time, time.includes(':') && time.split(':').length === 3 ? 'HH:mm:ss' : 'HH:mm');
};


  // Open modal for adding/editing
  const handleModalOpen = (record = null) => {
    setEditData(record);
    form.resetFields();
    // if (record) {
    //   form.setFieldsValue(record);
    // }
   if (record) {
  form.setFieldsValue({
  available_from_time: parseTime(record.from_time),
  available_to_time: parseTime(record.to_time),
});

}

    setIsModalVisible(true);
  };


  // Close modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null);
  };
  const handleReset = () => {
    // Reset form fields to their initial values
    form.resetFields();
  };

  // Handle form submission for adding/editing
const handleFormSubmit = async (values) => {
  try {
    setLoading(true);
    const hospital_id = localStorage.getItem("hospital_id");
    const token = localStorage.getItem("token");

    if (!hospital_id || !token) {
      notification.error({
        message: "Authentication Error",
        description: "Missing required information for authentication.",
      });
      return;
    }

    // Format times using Day.js
    const formatstartTime = startTime ? dayjs(startTime).format("HH:mm") : (editData?.available_from_time || null);
    const formatendTime = endTime ? dayjs(endTime).format("HH:mm") : (editData?.available_to_time || null);

    const formData = {
      ...values,
      from_time: formatstartTime,
      to_time: formatendTime,
      is_active: editData ? editData.is_active : 1,
      hospital_id: parseInt(hospital_id),
    };

    console.log(formData);

    const url = editData
      ? `${var_api}gos-slot/update/${editData.id}`
      : `${var_api}gos-slot/post`;

    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 400) {
      const errorData = await response.json();
      notification.error({
        message: "Validation Error",
        description: errorData.error || "Time slot conflict. Please select another time.",
      });
      return;
    }

    if (response.status === 401) {
      history.push("/admin/login");
      notification.warning({
        message: "Unauthorized",
        description: "Your session has expired. Please log in again.",
      });
      return;
    }

    if (response.status === 400 || response.status === 409) {
  const errorData = await response.json();
  notification.error({
    message: "Slot Conflict",
    description: errorData.error || "Time slot conflict. Please select another time.",
  });
  setLoading(false);
  return;
}


    if (!response.ok) {
      throw new Error("Error saving data");
    }

    // Wait for the installation data to be fetched
    const installationData = await fetchinstalldata(); // Ensure data is fetched
    if (installationData && installationData.length > 0) {
      // Data exists, now open the modal
      setIsModalOpen(true);
    } else {
      console.log("Installation data is empty or unavailable.");
    }

    setLoading(false);
    notification.success({
      message: editData ? "Update Successful" : "Creation Successful",
      description: editData
        ? "The record has been successfully updated."
        : "A new record has been successfully created.",
    });

    fetchData();
    // fetchDoctor();
    handleModalClose();

    updateTechstaffStatus();
    // Do not open modal here until installation data is confirmed
  } catch (error) {
    console.error("Error saving data:", error);
    notification.error({
      message: "Operation Failed",
      description: "There was an error while saving the data.",
    });
  }
};



    const updateTechstaffStatus = async () => {
  
      const token = localStorage.getItem("token");
      const hospital_id = localStorage.getItem("hospital_id");
  
    
      try {
        const response = await fetch(`${var_api}installation/update-hospital/${hospital_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
       body: JSON.stringify({
  techstaff: installDetails?.techstaff ?? false,
  availabletime: 1, // force update this as 1
  patient: installDetails?.patient ?? false,
  servicetype: installDetails?.servicetype ?? false,
  uom: installDetails?.uom ?? false,
  category: installDetails?.category ?? false,
  brand: installDetails?.brand ?? false,
  medicine: installDetails?.medicine ?? false,
  paymodemaster: installDetails?.paymodemaster ?? false,
  makeappointment: installDetails?.makeappointment ?? false,
  endsession: installDetails?.endsession ?? false,
  payment: installDetails?.payment ?? false,
  hospital_id: parseInt(hospital_id),
}),

        });
    
        // Log status code and response
        console.log("Response Status:", response.status);
        const responseText = await response.text();
        console.log("Response Text:", responseText);
    
        if (response.ok) {
          console.log("Installation techstaff updated successfully.");
          setIsModalpop(true); // Open modal only on success
        } else {
          console.error("Failed to update installation:", responseText);
        }
       
      } catch (err) {
        console.error("Error updating techstaff:", err);
      }
    };
  

const handleSlotClick = (slot) => {
  const fromTime = dayjs(slot.from_time, "HH:mm");
  const toTime = dayjs(slot.to_time, "HH:mm");

  form.setFieldsValue({
    available_from_time: fromTime,
    available_to_time: toTime,
  });
  setSelectedSlot(slot);
  setStartTime(fromTime);
  setEndTime(toTime);
};


  // Handle delete confirmation
  const handleDeleteConfirm = (id, slot) => {
    setDeleteId(id);
    setDeletename(slot); // or maybe setSelectedSlot(slot)
    setIsDeleteConfirmVisible(true);
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteId(null);
    setIsDeleteConfirmVisible(false);
  };
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };



  // Handle deletion of record
  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${var_api}availabledaytime/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error deleting record");
      setLoading(false);
      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });
      fetchData();
      fetchDoctor();
      handleDeleteCancel();
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
      setLoading(true);
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "S No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "From Time",
      dataIndex: "from_time",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "To Time",
      dataIndex: "to_time",
      render: (text) => (text ? text : "N/A"),
    },
    
   {
      title: "Active",
      dataIndex: "is_active",
      render: (text, record) => {
        return (
          <div className="status-toggle">
            <input
              id={`rating${record?.id}`}
              className="check"
              type="checkbox"
              defaultChecked={record.is_active === 1}
              onChange={(e) => handleSwitchChange(e, record)}
            />
            <label
              htmlFor={`rating${record?.id}`}
              className="checktoggle checkbox-bg"
            >
              checkbox
            </label>
          </div>
        );
      },
      sorter: (a, b) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="text-start">
        <a
          href="#"
          className="me-1 btn btn-sm bg-success-light"
          // data-bs-toggle="modal"
          data-bs-target="#edit_specialities_details"
          onClick={() => handleModalOpen(record)}
        >
          <i className="fe fe-pencil"></i> Edit
        </a>
        {/* <a
          href="#"
          className="me-1 btn btn-sm bg-danger-light"
          // data-bs-toggle="modal"
          data-bs-target="#delete_modal"
          onClick={() => handleDeleteConfirm(record.id, record.available_day)}
        >
          <i className="fe fe-trash"></i> Delete
        </a> */}
      </div>
      ),
    },
  ];

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
                <h3 className="page-title">Available Day and Time</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Available Day and Time</li>
                </ul>
              </div>
              <div className="col-auto">
              <button
        type="button"
        className="btn btn-primary mx-1"
        onClick={() => handleModalOpen()}
      >
        Add New
      </button>
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
                  <h4 className="card-title">Available Day and Time</h4>
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
                      dataSource={filteredData || []}
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
        title={editData ? "Edit Available Day and Time" : "Add New Available Day and Time"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
{editData && editData.time_slots && editData.time_slots.length > 0 && (
  <div style={{ marginBottom: "16px" }}>
    <h5 style={{ marginBottom: "10px" }}>Time Slots</h5>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        maxWidth: "100%",
      }}
    >
      {editData.time_slots.map((slot, idx) => {
        const isSelected =
          selectedSlot &&
          selectedSlot.from_time === slot.from_time &&
          selectedSlot.to_time === slot.to_time;

        return (
          <div
            key={idx}
            onClick={() => handleSlotClick(slot)}
            style={{
              flex: "0 0 calc(33.33% - 8px)",
              backgroundColor: isSelected ? "#f0f8ff" : "#ffffff",
              color: isSelected ? "#007bff" : "#000000",
              borderRadius: "6px",
              padding: "6px 10px",
              fontWeight: 500,
              fontSize: "13px",
              textAlign: "center",
              cursor: "pointer",
              transition: "0.2s",
              border: "1px solid #ccc",
            }}
          >
            {slot.from_time} - {slot.to_time}
          </div>
        );
      })}
    </div>
  </div>
)}


        <Form form={form} onFinish={handleFormSubmit}>
        {/* <Form.Item
            label={<span>Hospital Id <span style={{ color: 'red' }}>*</span></span>}
            name="hospital_id"
            rules={[{ required: true, message: "Please input the Hospital Id!" }]}
          >
            <Input />
          </Form.Item> */}
{/* <Form.Item
  label="Doctor"
  name="tec_staff_id"
  rules={[{ required: true, message: "Please select a Doctor Name!" }]}
>
  <select
    className="form-select form-control"
    name="tec_staff_id"
    style={{ width: "400px" }}
    required
    defaultValue="" // Ensures the placeholder is selected initially
    disabled={loading}
  >
    <option value="" disabled hidden>
      {loading ? "Loading..." : "Select Technical Staff"}
    </option>
    {Technicalstaff.length > 0 ? (
      Technicalstaff.map((technical) => (
        <option key={technical.id} value={technical.id}>
          {technical.name}
        </option>
      ))
    ) : (
      <option value="" disabled>
        No Data 
      </option>
    )}
  </select>
</Form.Item> */}


{/* <Form.Item
  label="Available Day"
  name="available_day"
  rules={[{ required: true, message: "Please select a day!" }]}
>
  <select
    className="form-select form-control"
    name="available_day"
    style={{ width: "360px" }} // Adjust width as needed
    required
    defaultValue="" // Ensuring placeholder is selected initially
  >
    <option value="" disabled hidden>
      Select Day
    </option>
    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
      (day) => (
        <option key={day} value={day}>
          {day}
        </option>
      )
    )}
  </select>
</Form.Item> */}


          <Form.Item
            label="Available From Time"
            name="available_from_time"
            rules={[{ required: true, message: "Please select the from time!" }]}
          >
            
            <TimePicker
                       value={startTime}
                       onChange={handleTimeChange}
                       className={`form-control timepicker1 ${error ? 'is-invalid' : ''}`}
                       placeholder="Time"
                     />
          </Form.Item>

          <Form.Item
            label="Available To Time"
            name="available_to_time"
            rules={[{ required: true, message: "Please select the to time!" }]}
          >
             <TimePicker
                       value={endTime}
                       onChange={handleTimeChangeEnd}
                       className={`form-control timepicker1 ${error ? 'is-invalid' : ''}`}
                       placeholder="Time"
                     />
          </Form.Item>

       <Form.Item>
                          <div className="d-flex justify-content-center">
                   <button
               className="btn btn-primary mx-1"
               type="submit"d
             >
               {editData ? "Update" : "Submit"}
             </button>
             <button
               type="button"
               className="btn btn-danger"
               onClick={editData ? handleModalClose : handleReset}
             >
                {editData ? "Cancel" : "Reset"}
             </button>
             </div>
                          </Form.Item>
        </Form>
      </Modal>

         <Modal
       title="Delete Confirmation"
       visible={isDeleteConfirmVisible}
       onCancel={handleDeleteCancel} // Keep the onCancel function to close the modal when the Cancel button is clicked
       footer={null} // Remove the default OK and Cancel buttons
     >
      <p>Are you sure you want to delete the time slot <b>{deletename?.from_time} - {deletename?.to_time}</b>?</p>

       <Form.Item>
         <div className="d-flex justify-content-center">
           <button
             type="button"
             className="btn btn-primary mx-1"
             onClick={handleDelete}
           >
             Delete
           </button>
           <button
             type="button"
             className="btn btn-danger"
             onClick={handleDeleteCancel}
           >
             Cancel
           </button>
         </div>
       </Form.Item>
     </Modal>

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
          setIsModalVisible(true); // Show the second modal
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
        <Button
        key="close"
        type="primary"
        onClick={() => {
          setIsModalpop(false);
          history.push('/admin/patientdetails');
        }}
      >
        continoue
      </Button>
       ]}
     >
       {/* Your modal content goes here */}
       <h3 style={{ color: 'green', fontWeight: '600' }}>Submission Successful</h3>
<div style={{ fontSize: '16px', lineHeight: '1.6' }}>
  <p>Click the <strong>Continue</strong> button to move to the next step.</p>
</div>
     </Modal>
    </>
  );
};

export default AvailableDayAndTime;
