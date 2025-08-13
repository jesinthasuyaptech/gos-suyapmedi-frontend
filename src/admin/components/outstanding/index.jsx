import React, { useState, useEffect } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Filter, initialSettings } from "../../../client/components/common/filter";
import SidebarNav from "../sidebar";
import {Table,Button,Select,Modal,DatePicker,Form,Input,notification, Tag} from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const outstandingreport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [aptdata, setAptData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [parsedDate, setParsedDate] = useState(null);
  const [selectedStatus, setSelectedstatus] = useState(3);
  const history = useHistory();
  const [appoinments, setAppoinments] = useState(null);
  const adminappointmentp = localStorage.getItem("admin_appointment_prefix");
  const options = [
    { value: 3, label: "All" },
    { value: 0, label: "Notpaid" },
    { value: 2, label: "partial" },
  ];

  //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0aW1lc3RhbXAiOjE3MzUzNzU0MjQ2MzAsImlhdCI6MTczNTM3NTQyNH0.jkA7TNIJzIPxyrmigzrLmVmPz1ZiTDpHf5eTyMvoqjA";
  // const fetchData = async () => {
  //   setLoading(true);
  
  //   const token = localStorage.getItem("token");
  //   const hospital_id = localStorage.getItem("hospital_id");
  
  //   // Get the current date and format it as 'dd-mm-yyyy'
  //   const currentDate = new Date();
  //   const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}-${(currentDate.getMonth() + 1)
  //     .toString()
  //     .padStart(2, "0")}-${currentDate.getFullYear()+1}`;
  
  //   try {
  //     const response = await fetch(
  //       `${var_api}referralmaster/get-referal/${hospital_id}/${"01-01-2024"}/${formattedDate}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `${token}`,
  //         },
  //       }
  //     );
  
  //     if (!response.ok) throw new Error("Failed to fetch data");
  
  //     const result = await response.json();
  //     setData(result || []);
  //     setFilteredData(result || []); // Set initial filtered data
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

  const handleStatus = (value) => {
    console.log(value);
    setSelectedstatus(value);
    
  };

  const filterData = selectedStatus == 3 ? filteredData : filteredData.filter((item) => item.paid_status == selectedStatus);

  const getCurrentDateFormatted = () => {
    const currentDate = new Date();
    return `${currentDate.getDate().toString().padStart(2, "0")}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getFullYear()}`;
  };

  const fetchData = async (startDate = "01-01-2024", endDate = getCurrentDateFormatted()) => {
    setLoading(true);
  
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
  
    try {
      const response = await fetch(
        `${var_api}appointment/appointments-outstanding-report/${startDate}/${endDate}/${hospital_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
  
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
  
  

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = data.filter((item) => {
      // Safely check each field for existence and convert to string if it exists
      const finalAmountMatch = item.final_amount?.toString().toLowerCase().includes(value) || false;
      const balanceAmountMatch = item.balance_amount?.toString().toLowerCase().includes(value) || false;
      const paidAmountMatch = item.paid_amount?.toString().toLowerCase().includes(value) || false;
      const appointmentDayMatch = item.appointment_day?.toString().toLowerCase().includes(value) || false;
      const tokenNoMatch = item.token_no?.toString().toLowerCase().includes(value) || false;
  
      // Return true if any field matches
      return (
        finalAmountMatch ||
        balanceAmountMatch ||
        paidAmountMatch ||
        appointmentDayMatch ||
        tokenNoMatch
      );
    });
  
    setFilteredData(filtered);
  };

  const handleClick =(record)=>{
    setAppoinments(record);
    setIsModalVisible(true);
  }

  const handleModalOpen = () => {
    setIsModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };


  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Date",
      dataIndex: "appointment_day",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Appt.No",
      dataIndex: "token_no",
      render: (text) => (text ? <span style={{ color: 'blue' }}>#{adminappointmentp}{text}</span> : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Final Amount",
      dataIndex: "final_amount",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
        title: "Paid Amount",
        dataIndex: "paid_amount",
        render: (text) => (text ? text : "-"),
        // render: (text, record) => (
        //   <span
        //     onClick={() => handleClick(record.appointments)}
        //     style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        //   >
        //     {text ? text : "-"}
        //   </span>
        // ),
        sorter: (a, b) => a.name?.localeCompare(b.name),
      },
      {
        title: "Balance Amount",
        dataIndex: "balance_amount",
        render: (text) => (text ? text : "-"),
        // render: (text, record) => (
        //   <span
        //     onClick={() => handleClick(record.appointments)}
        //     style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        //   >
        //     {text ? text : "-"}
        //   </span>
        // ),
        sorter: (a, b) => a.name?.localeCompare(b.name),
      },
      {
        title: "Status",
        dataIndex: "paid_status",
        render: (text, record) => {
          const getStatusTag = (status) => {
            const statusConfig = {
              0: { label: "Not Paid", color: "red" }, // Red for Not Paid
              2: { label: "Partial", color: "orange" },
            };
            return <Tag color={statusConfig[status].color}>{statusConfig[status].label}</Tag>;
          };
      
          return getStatusTag(text);
        },
      }
      
  ];

  console.log("jesi",filterData)

  const appointment = [
      {
        title: "Day",
        dataIndex: "appointment_day",
        render: (text) => text || "-",
      },
      {
        title: "Name",
        dataIndex: "patient_name",
        render: (text) => text || "-",
      },
      {
        title: "Number",
        dataIndex: "patient_mobile",
        render: (text) => text || "-",
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
                <h3 className="page-title">Outstanding Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">
                  Outstanding Report Tables
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mb-3">
  <div className="col-md-4">
    <Input 
      placeholder="Search" 
      value={searchTerm} 
      onChange={handleSearch} 
    />
  </div>
  
  <div className="col-md-4">
    <div className="filter-head">
      <div className="position-relative daterange-wraper me-2">
        <div className="input-groupicon calender-input">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            
            {/* Date Range Picker */}
            <div className="col-md-4">
              <DateRangePicker
                initialSettings={initialSettings}
                onCallback={(start, end) => {
                  const formatDate = (date) =>
                    `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${date.getFullYear()}`;
                  
                  const formattedStartDate = formatDate(new Date(start));
                  const formattedEndDate = formatDate(new Date(end));

                  fetchData(formattedStartDate, formattedEndDate);
                }}
              >
                <input
                  className="form-control date-range bookingrange"
                  type="text"
                  placeholder="Select Date Range"
                  style={{ width: "200px" }} // Adjust the width here
                />
              </DateRangePicker>
            </div>

            {/* Select Platform Dropdown */}
            <div className="col-md-4">
              <Select
                className="select-social-img"
                defaultValue={options[0]}
                onChange={handleStatus}
                options={options}
                placeholder="Select Platform"
                isSearchable={false}
                style={{
                  width: '100px',
                  marginLeft: '150px',
                  height: '45px',
                }}
              />
            </div>
            
          </div>
          <i className="fa-solid fa-calendar-days" />
        </div>
      </div>
    </div>
  </div>
</div>
<div style={{
  display: 'flex',
  height: 'auto', // Adjust height dynamically based on content
  justifyContent: 'flex-start', // Align card to the left
  alignItems: 'center', // Center vertically (optional, adjust as needed)
  background: '#f8f8f8',
  padding: '20px',
}}>
  <div className="create-details-card" style={{
    width: '80%', // Adjust width as needed
    maxWidth: '1000px', // Optional: set a max width
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  }}>
    <h3 style={{ textAlign: 'left', marginBottom: '20px', fontSize: '24px', color: '#333333' }}>Outstanding Summary</h3>
    <div className="details-container">
      {/* Total Outstanding Amount */}
      <div className="detail-row row" style={{ marginBottom: '15px', padding: '10px', borderBottom: '1px solid #eeeeee' }}>
        <div className="col-6" style={{ fontSize: '16px', color: '#555555' }}>
          Total Appointments: <span style={{ color: '#000000', fontWeight: 'bold' }}>{filterData.length}</span>
        </div>
        <div className="col-6 text-right" style={{ fontSize: '16px', color: '#555555' }}>
          Total Outstanding Amount: <span style={{ color: '#007BFF' }}>{filterData.reduce((total, item) => total + (parseFloat(item.balance_amount) || 0), 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Partial Amount */}
      <div className="detail-row row" style={{ marginBottom: '15px', padding: '10px', borderBottom: '1px solid #eeeeee' }}>
        <div className="col-6" style={{ fontSize: '16px', color: '#555555' }}>
          Partial Appointments: <span style={{ color: '#000000', fontWeight: 'bold' }}>{filterData.filter(item => item.paid_status == 2).length}</span>
        </div>
        <div className="col-6 text-right" style={{ fontSize: '16px', color: '#555555' }}>
          Partial Amount: <span style={{ color: '#FFA500' }}>{filterData.filter(item => item.paid_status == 2).reduce((total, item) => total + item.balance_amount, 0)}</span>
        </div>
      </div>

      {/* NotPaid Amount */}
      <div className="detail-row row" style={{ marginBottom: '15px', padding: '10px' }}>
        <div className="col-6" style={{ fontSize: '16px', color: '#555555' }}>
          NotPaid Appointments: <span style={{ color: '#000000', fontWeight: 'bold' }}>{filterData.filter(item => item.paid_status == 0).length}</span>
        </div>
        <div className="col-6 text-right" style={{ fontSize: '16px', color: '#555555' }}>
          NotPaid Amount:  <span style={{ color: '#FF0000' }}>
    {filterData
      .filter(item => item.paid_status === 0)
      .reduce((total, item) => total + item.balance_amount, 0)
      .toFixed(2)}
  </span>
        </div>
      </div>
    </div>
  </div>
</div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Outstanding Report</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      pagination={{
                        total: filterData.length,
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
                      dataSource={filterData}
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
  title="Referral List"
  visible={isModalVisible}
  onCancel={handleModalClose}
  footer={null} // Remove default footer buttons
  width={800}
>
  <div className="table-responsive">
    <Table
      pagination={{
        total: appoinments ? appoinments.length : 0, // Null check
        pageSize: pageSize,
        current: currentPage <= Math.ceil((appoinments?.length || 0) / pageSize) ? currentPage : 1,
        showSizeChanger: false,
        onChange: handlePaginationChange,
      }}
      loading={loading}
      columns={appointment}
      dataSource={appoinments || []} // Fallback to an empty array if appoinments is null
      rowKey={(record) => record?.id || Math.random().toString()} // Fallback for rowKey
    />
  </div>
</Modal>

    </>
  );
};

export default outstandingreport;
