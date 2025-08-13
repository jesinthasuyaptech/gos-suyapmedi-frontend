import React, { useState, useEffect } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Filter, labinitialSettings } from "../../../client/components/common/filter";
import SidebarNav from "../sidebar";
import {
  Table,
  Button,
  Select,
  Modal,
  DatePicker,
  Form,
  Input,
  notification,
} from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const serviceTypeReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [aptdata, setAptData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [parsedDate, setParsedDate] = useState(null);
  const history = useHistory();
  const [appoinments, setAppoinments] = useState(null);
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB").split("/").join("-");
  };
  
  const todays = new Date();
  const [startDate, setStartDate] = useState(formatDate(todays));
  const [endDate, setEndDate] = useState(formatDate(todays));

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
        `${var_api}serviceType/get-service-report/${hospital_id}/${startDate}/${endDate}`,
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = data.filter((item) => {
      const nameMatch = item.service_name.toLowerCase().includes(value);
      const remarksMatch = String(item.charge_amount).toLowerCase().includes(value);
      const camountMatch = String(item.charge_amount).toLowerCase().includes(value);
      const countMatch = String(item.service_count).toLowerCase().includes(value);
      const tamountMatch = String(item.total_amount).toLowerCase().includes(value);
  
      return nameMatch || remarksMatch || camountMatch || countMatch || tamountMatch;
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
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Service Name",
      dataIndex: "service_name",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.service_name?.localeCompare(b.service_name),
    },
    {
      title: "Charge Amount",
      dataIndex: "charge_amount",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.charge_amount?.localeCompare(b.charge_amount),
    },
    // {
    //   title: "Is Lab",
    //   dataIndex: "is_lab",
    //   render: (text) => (text == 1 ? "Yes" : "No"),

    // },
    {
        title: "Service Count",
        dataIndex: "service_count",
        render: (text, record) => (
         text? text : 0
        ),
        
      },
      {
        title: "Total Amount",
        dataIndex: "total_amount",
        render: (text, record) => (
         text ? Number(text).toFixed(2) : "0.00"
        ),
        
      }
      
  ];

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


    // const downloadPDF = () => {
    //     const doc = new jsPDF({
    //       orientation: "portrait",
    //       unit: "px",
    //       format: "a4", // A4 format
    //     });
    
    //     const content = document.querySelector(".service-container");
    
    //     html2canvas(content, {
    //       scale: 1,
    //       useCORS: true,
    //     }).then((canvas) => {
    //       const imgData = canvas.toDataURL("image/png");
    //       const pageWidth = doc.internal.pageSize.width;
    //       const pageHeight = doc.internal.pageSize.height;
    
    //       const imgWidth = canvas.width;
    //       const imgHeight = canvas.height;
    
    //       const scaleX = (pageWidth - 20) / imgWidth;
    //       const scaleY = pageHeight / imgHeight;
    //       const scale = Math.min(scaleX, scaleY);
    
    //       doc.addImage(imgData, "PNG", 10, 10, imgWidth * scale, imgHeight * scale);
    //       doc.save(`servcieType_report(${startDate}-${endDate}).pdf`);
    //     });
    //   };


    // const downloadExcel = () => {
    //     const table = document.querySelector(".service-container");
      
    //     if (!table) {
    //       console.error("Table not found!");
    //       return;
    //     }
      
    //     const rows = Array.from(table.querySelectorAll("tr")).map((row) =>
    //       Array.from(row.querySelectorAll("th, td")).map((cell) => cell.innerText)
    //     );
      
    //     const worksheet = XLSX.utils.aoa_to_sheet(rows);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Service Report");
      
    //     const excelBuffer = XLSX.write(workbook, {
    //       bookType: "xlsx",
    //       type: "array",
    //     });
      
    //     const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    //     saveAs(file, `servcieType_report(${startDate}-${endDate}).xlsx`);
    //   };


    const downloadExcel = () => {
      if (!filteredData || filteredData.length === 0) {
        console.error("No data available!");
        return;
      }
    
      // Convert full dataset to array of arrays
      const rows = [
        ["S.No", "Service Name", "Charge Amount", "Is Lab", "Service Count", "Total Amount"], // Header Row
        ...filteredData.map((item, index) => [
          index + 1, // Serial Number
          item.service_name || "-", 
          item.charge_amount || "-", 
          item.is_lab == 1 ? "Yes" : "No", 
          item.service_count || 0, 
          item.total_amount ? Number(item.total_amount).toFixed(2) : "0.00"
        ]),
      ];
    
      // Create worksheet and workbook
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Service Report");
    
      // Convert to Blob and trigger download
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
    
      const file = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(file, `serviceType_report(${startDate}-${endDate}).xlsx`);
    };
    

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Service Type Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">
                  Service Type Report Tables
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
                        <button className="btn btn-primary" onClick={downloadExcel}>
              Download Excel
            </button>
                        </div>
          </div>
          <div className="col-sm-3">
                        <div className="filter-head">
                <div className="position-relative daterange-wraper me-2">
                  <div className="input-groupicon calender-input">
                  <DateRangePicker
  initialSettings={labinitialSettings}
  onCallback={(start, end) => {
    const formatDate = (date) =>
      `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;

    const formattedStartDate = formatDate(new Date(start));
    const formattedEndDate = formatDate(new Date(end));
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);

    fetchData(formattedStartDate, formattedEndDate);
  }}
>
  <input
    className="form-control date-range bookingrange"
    type="text"
    placeholder="Select Date Range"
  />
</DateRangePicker>
                  </div>
                    <i className="fa-solid fa-calendar-days" />
                  </div>
                 </div>
                        </div>

                       

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Service Type Report</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive service-container">
                    <Table
                      // pagination={{
                      //   total: filteredData.length,
                      //   pageSize: pageSize, // Limit to 2 rows per page
                      //   current: currentPage,
                      //   showSizeChanger: false,
                      //   onShowSizeChange: (current, size) =>
                      //     handlePaginationChange(current, size),
                      //   onChange: handlePaginationChange,
                      //   itemRender: itemRender,
                      // }}
                      loading={loading}
                      columns={columns}
                      dataSource={filteredData || []}
                      rowKey={(record) => record?.id}
                      pagination={false} // Disables pagination
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

export default serviceTypeReport;
