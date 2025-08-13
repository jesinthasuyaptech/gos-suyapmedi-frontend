import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Select,
  Radio,
  TimePicker,
  DatePicker 
} from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { image_api, var_api } from "../../../constant";
import moment from "moment";


const TechAttendance = () => {
  const [data, setData] = useState([]);
  const [stafflist, setStaffList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [staffBreaklist, setStaffBreakList] = useState([]);
  const [filteredBreakData, setFilteredBreakData] = useState([]);  // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const [fileidproof, setFileidproof] = useState(null);
  const [file, setFile] = useState(null);
  const [specialization, setSpecialization] = useState([]);
  const [role, setRole] = useState([]);
  const [seatImage, setseatImage] = useState("");
  const [seatImageproof, setseatImageproof] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedAttId, setSelectedAttId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [breakModalVisible, setBreakModalVisible] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [remark, setRemark] = useState("");
  const [timer, setTimer] = useState(moment().format("HH:mm:ss"));
  // const [breakModalVisible, setBreakModalVisible] = useState(false);
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [checkbreak, setcheckbreak] = useState(null);

  const [activeTab, setActiveTab] = useState("technical");

  const handleBreakClick = (id, att_id,name,record) => {
    setSelectedTechId(id);
    setSelectedName(name);
    setSelectedAttId(att_id);
    setBreakModalVisible(true);
    setcheckbreak(record);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
    setLoading(true);
    try {
      const response = await fetch(
        `${var_api}technicalstaff/getby-hospital/${hospital_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setStaffList(result || []);
      setFilteredData(result || []); // Set initial filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
    try {
      const response = await fetch(
        `${var_api}techstaffattendance/getdetails/${hospital_id}/${selectedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []); // Set initial filtered data
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

  const fetchbreaks = async (id) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${var_api}techstaffbreak/get-attendance/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.status === 404) {
        // Handle 404 error specifically
        notification.error({
          message: "Not Found",
          description: "No breaks found for the specified ID.",
        });
        return; // Early exit to prevent further processing
      }

      if (!response.ok) throw new Error("Failed to fetch data");
      
      const breakresult = await response.json();
  
      // Ensure breakresult is always an array
      const breakArray = Array.isArray(breakresult) ? breakresult : [breakresult];
  
      setStaffBreakList(breakArray);
      setFilteredBreakData(breakArray); // Set initial filtered data
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

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase(); // Convert search term to lowercase
    setSearchTerm(value);

    // Filter the data based on the search term in any column
    const filtered = data.filter((item) =>
      Object.keys(item).some((key) => {
        const fieldValue = item[key];
        return (
          fieldValue && fieldValue.toString().toLowerCase().includes(value) // Convert field value to a string and check if it includes the search term
        );
      })
    );

    setFilteredData(filtered); // Update filtered data state
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleModalOpen = (record = null) => {
    setEditData(record); // Set record data for editing (if any)
    form.resetFields(); // Reset the form fields
    if (record) {
      form.setFieldsValue(record); // Set initial values for the edit form
    }
    setIsModalVisible(true); // Show the modal
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name); // Set the ID of the specialization to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null); // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  const handleAttendance = async (id) => {
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const login_time = now.toTimeString().split(" ")[0];

      const payload = {
        hospital_id,
        tech_id: id,
        date:selectedDate,
        login_time,
      };

      const response = await fetch(`${var_api}techstaffattendance/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        // Handle 404 error specifically
        notification.error({
          message: "Attendance Made",
          description: "Attedance Already Exists on this Date.",
        });
        return; // Early exit to prevent further processing
      }

      if (!response.ok) throw new Error("Error saving data");

      notification.success({
        message: "Attendance Marked",
        description: "The attendance record has been saved successfully.",
      });

      setAttendanceStatus((prev) => ({ ...prev, [id]: "present" }));
      fetchData();
    } catch (error) {
      notification.error({
        message: "Operation Failed",
        description:
          error.message || "There was an error while saving the data.",
      });
    }
  };

  const handleLogout = async (id,login_time) => {
    const token = localStorage.getItem("token");
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const logout_time = now.toTimeString().split(" ")[0];// Current time in hh:mm:ss format// Replace this with actual break time calculation if needed
  
      const logout_timediff = new Date().toTimeString().split(" ")[0]; // Get the current time in hh:mm:ss format

      // Convert break_start and break_end to Date objects, assuming a reference date like '1970-01-01'
      const startTime = new Date(`1970-01-01T${login_time}Z`);
      const endTime = new Date(`1970-01-01T${logout_timediff}Z`);
          
      // Calculate the difference in milliseconds
      const diffMilliseconds = endTime - startTime;
          
      // Convert milliseconds to minutes
      const diffMinutes = diffMilliseconds/ (1000 * 60);

      const payload = {
        logout_time,
        without_break:diffMinutes,
      };

      const response = await fetch(`${var_api}techstaffattendance/update-logout/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error saving data");

      notification.success({
        message: "Attendance Marked",
        description: "The attendance record has been saved successfully.",
      });

      setAttendanceStatus((prev) => ({ ...prev, [id]: "present" }));
      fetchData();
    } catch (error) {
      notification.error({
        message: "Operation Failed",
        description:
          error.message || "There was an error while saving the data.",
      });
    }
  };

  const handleBreakSubmit = async () => {
    if (!remark) {
      notification.error({
        message: "Remark Required",
        description: "Please enter a remark before submitting.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const break_start = now.toTimeString().split(" ")[0];

      const payload = {
        hospital_id,
        attendance_id: selectedAttId,
        tech_id: selectedTechId,
        break_date: date,
        break_start:timer,
        break_end: null,
        break_time: null,
        remarks: remark,
      };

      const response = await fetch(`${var_api}techstaffbreak/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error saving data");

      notification.success({
        message: "Break Recorded",
        description: "The break record has been saved successfully.",
      });

      setBreakModalVisible(false);
      setRemarkModalVisible(false);
      setRemark("");
      fetchData();
    } catch (error) {
      notification.error({
        message: "Operation Failed",
        description: error.error || "There was an error while saving the data.",
      });
    }
  };

  const handleBreakStop = async (id,break_start) => {
    const token = localStorage.getItem("token");
    const now = new Date(); // Define the `now` variable
  
    try {
      const break_end = now.toTimeString().split(" ")[0]; // Current time in hh:mm:ss format// Replace this with actual break time calculation if needed
  
      const break_enddiff = new Date().toTimeString().split(" ")[0]; // Get the current time in hh:mm:ss format

      // Convert break_start and break_end to Date objects, assuming a reference date like '1970-01-01'
      const startTime = new Date(`1970-01-01T${break_start}Z`);
      const endTime = new Date(`1970-01-01T${break_enddiff}Z`);
          
      // Calculate the difference in milliseconds
      const diffMilliseconds = endTime - startTime;
          
      // Convert milliseconds to minutes
      const diffMinutes = diffMilliseconds / (1000 * 60);

      const payload = {
        break_time:diffMinutes,
        break_end,
      };
  
      console.log("Payload for Break Stop:", payload); // Debugging payload
  
      const response = await fetch(
        `${var_api}techstaffbreak/update-breakstop/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      const payloadbreak = {
        break_time:diffMinutes,
      };

      const responsebreak = await fetch(
        `${var_api}techstaffattendance/update-break/${selectedAttId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payloadbreak),
        }
      );
  
      // Log API response details for debugging
      console.log("API Response Status:", response.status);
      console.log("API Response OK:", response.ok);
      fetchData();
  
      if (!response.ok) {
        const errorDetails = await response.json(); // Attempt to parse server error response
        console.error("Server Error Details:", errorDetails);
        throw new Error(`Server Error: ${errorDetails.message || "Unknown error"}`);
      }
  
      notification.success({
        message: "Break Stopped",
        description: "The break stop has been saved successfully.",
      });
  
      setBreakModalVisible(false);
      setRemark("");
    } catch (error) {
      // Log detailed error information for debugging
      console.error("Error Details:", error);
      notification.error({
        message: "Operation Failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date ? date.format("YYYY-MM-DD") : null);
    fetchData();
  };

  const handleStaffChange = (value) => {
    setSelectedStaffId(value);
  };

  const columns = [
    {
      title: "Serial No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => text || "-",
    },
    {
      title: "Login ",
      dataIndex: "attendance_login_time",
      render: (text) => text || "-",
    },
    {
      title: "Logout ",
      dataIndex: "attendance_logout_time",
      render: (text) => text || "-",
    },
    {
      title: "OverAll  (Min)",
      dataIndex: "attendance_without_break",
      render: (text) => text || "-",
    },
    {
      title: "OverAll Break  (Min)",
      dataIndex: "attendance_break_time",
      render: (text) => text || "-",
    },
    {
      title: "Active  (Min)", // New column for overall time - break time
      render: (_, record) =>
        record.attendance_logout_time // Check if login time is available
          ? (record.attendance_without_break || 0) -
            (record.attendance_break_time || 0)
          : "-", // Display "-" if login time is not available
    },
    {
          title: "Action",
          render: (_, record) => (
            <div style={{ display: "flex", gap: "10px" }}>
              {/* "Break" Button */}
              <Button
                onClick={() => {
                  handleBreakClick(record.id, record.attendance_id, record.name,record);
                  fetchbreaks(record.attendance_id);
                }}
                type="primary"
              >
                Break
              </Button>
        
              {/* "Logout" Button */}
              <Button
                onClick={() => {
                  // If the user is on break, stop the break first
                  if (record.break_start && !record.break_end) {
                    handleBreakStop(record.attendance_id, record.break_start);
                  }
                  // Then log them out
                  handleLogout(record.attendance_id, record.attendance_login_time);
                }}
                type="default"
              >
                Logout
              </Button>
            </div>
          ),
        },
  ];

  const breakscol = [
    {
      title: "Break Start",
      dataIndex: "break_start",
      render: (text) => text || "-",
    },
    {
      title: "Break End",
      dataIndex: "break_end",
      render: (text) => text || "-",
    },
    {
      title: "Break Time",
      dataIndex: "break_time",
      render: (text) => text || "-",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => text || "-",
    },
    {
      title: "Action",
      render: (_, record) => {
        const isDisabled = !!record.break_end;
    
        return (
          <div>
            <Button
              onClick={() => handleBreakStop(record.id, record.break_start)}
              type="danger"
              style={{
                backgroundColor: isDisabled ? '#ffcccc' : 'red',
                color: 'white', // Always white text
                borderColor: isDisabled ? '#ffcccc' : 'red',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.6 : 1,
              }}
              disabled={isDisabled}
            >
              Stop Break
            </Button>
          </div>
        );
      },
    },
    
    
    
  ];  
  

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Technicalstaff Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Technicalstaff Tables
                  </li>
                </ul>
              </div>

              <div className="col-auto ml-auto">
      <ul className="nav nav-tabs nav-tabs-solid">
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === "technical" ? "active" : ""}`}
            onClick={() => setActiveTab("technical")}
            to="/admin/techattendance"
          >
            Technical
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === "nontechnical" ? "active" : ""}`}
            onClick={() => setActiveTab("nontechnical")}
            to="/admin/nontechattendance"
          >
            Non Technical
          </Link>
        </li>
      </ul>
    </div>
              <div className="col-auto">
                {/* <button
                  type="button"
                  className="btn btn-primary mx-1"
                  onClick={() => handleModalOpen()}
                >
                  Add New
                </button> */}
              </div>
            </div>
          </div>

          <div
  style={{
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <Select
    style={{ width: "300px", marginRight: "10px" }}
    placeholder="Select a staff member"
    onChange={handleStaffChange}
    showSearch // Enable search functionality
    filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    } // Filter the options based on the search input
  >
    {stafflist.map((staff) => (
      <Option key={staff.id} value={staff.id}>
        {`${staff.name} (${staff.roll || "No Role"})`}
      </Option>
    ))}
  </Select>

  {/* <Button
    type="primary"
    onClick={() => handleAttendance(selectedStaffId)}
    disabled={attendanceStatus[selectedStaffId] === "present"}
  >
    Present
  </Button> */}
  <button type="button" className="btn btn-primary mx-1"   onClick={() => handleAttendance(selectedStaffId)}  disabled={attendanceStatus[selectedStaffId] === "present"} >
  Present
                </button>

  <div style={{ display: 'flex', alignItems: 'Left', marginLeft: "16px" }}>
  {/* <DatePicker
    onChange={handleDateChange}
    format="YYYY-MM-DD"
    placeholder="Select a date"
    disabledDate={(current) => current && current > moment().endOf("day")} // Disable future dates
  /> */}

<div className="row mb-3" style={{ marginLeft: '10px' }}>
  <div className="col-md-12">
    <Input
      placeholder="Search"
      value={searchTerm}
      onChange={handleSearch}
      style={{ width: '100%' }} // Ensures full-width
    />
  </div>
</div>
</div>
</div>


          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Technicalstaff</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      pagination={{
                        total: filteredData.length,
                        pageSize: pageSize, // Limit to 2 rows per page
                        current: currentPage,
                        showSizeChanger: false,
                        onShowSizeChange: (current, size) =>
                          handlePaginationChange(current, size),
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
  title="Staff Break List"
  visible={breakModalVisible}
  onCancel={() => setBreakModalVisible(false)}
  footer={null} // Remove default footer buttons
  width={800}
>
  {/* Display dummy name */}
  <h4 style={{ textAlign: "center", marginBottom: "10px" }}>{selectedName}</h4>

  {/* Display selected date */}
  <h5 style={{ textAlign: "center", marginBottom: "20px" }}>
    {selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : "No Date Selected"}
  </h5>

  <div className="table-responsive">
    <Table
      pagination={{
        total: staffBreaklist.length,
        pageSize: pageSize,
        current:
          currentPage <= Math.ceil(staffBreaklist.length / pageSize)
            ? currentPage
            : 1,
        showSizeChanger: false,
        onChange: handlePaginationChange,
      }}
      loading={loading}
      columns={breakscol}
      dataSource={staffBreaklist}
      rowKey={(record) => record?.id || Math.random().toString()} // Fallback for rowKey
    />
  </div>

  {/* Only show "Take Break" if no row has break_end empty */}
  {checkbreak?.attendance_logout_time == null
 && (
    <Button
      type="primary"
      style={{ marginTop: "20px" }}
      onClick={() => {
        setRemarkModalVisible(true); // Open the second modal
      }}
    >
      Take Break
    </Button>
  )}
</Modal>


      {/* Second Modal: Enter Remark and Time */}
      <Modal
        title="Enter Break Remark"
        visible={remarkModalVisible}
        onOk={handleBreakSubmit}
        onCancel={() => setRemarkModalVisible(false)}
      >
        <Form>
          {/* Remark Input */}
          <Form.Item label="Remark" required>
            <Input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter remark"
            />
          </Form.Item>

          {/* Timer Input */}
          <Form.Item label="Timer" required>
            <TimePicker
              value={timer ? moment(timer, "HH:mm:ss") : null}
              onChange={(time, timeString) => setTimer(timeString)}
              format="HH:mm:ss"
              placeholder="Select time"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TechAttendance;
