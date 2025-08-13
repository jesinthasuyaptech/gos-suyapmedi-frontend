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
  Row, Col, Card
} from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

const MedicineReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const history = useHistory();
  const [dataSummary, setDataSummary] = useState(null);
  const[slotOptions, setSlotOptions]=useState([]);
  const [selectedSlot, setSelectedSlot] = useState("ALL");

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB").split("/").join("-");
  };
  
  const todays = new Date();
  const startOfMonth = new Date(todays.getFullYear(), todays.getMonth(), 1);
  const endOfMonth = new Date(todays.getFullYear(), todays.getMonth() + 1, 0);
  
  const formatDates = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };
  
  const formattedStartDate = formatDates(startOfMonth);
  const formattedEndDate = formatDates(endOfMonth);
  
  const [startDate, setStartDate] = useState(formattedStartDate);
  const [endDate, setEndDate] = useState(formattedEndDate);

  const fetchData = async (startDate = formattedStartDate, endDate = formattedEndDate, fromTime = "ALL") => {
    setLoading(true);
  
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");

    
         // Construct the URL dynamically
      let url = `${var_api}gos-invoice-billing/service-report/${hospital_id}/${startDate}/${endDate}`;
      if (fromTime !== "ALL" && fromTime != 0) {
        url += `?apt_start_time=${fromTime}`;
      }
  
    try {
      const response = await fetch(
        url,
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


  const fetchDataSummary = async (startDate = formattedStartDate, endDate = formattedEndDate) => {
    setLoading(true);
  
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
  
    try {
      const response = await fetch(
        `${var_api}gos-invoice-billing/service-report-summary/${hospital_id}/${startDate}/${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const result = await response.json();
      console.log("Re", result)
      setDataSummary(result || null);
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
    fetchDataSummary();
    fetchSlots();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = data.filter((item) => {
      const nameMatch = item.service_name.toLowerCase().includes(value);
      const countMatch = String(item.used_count).toLowerCase().includes(value);
      const amountMatch = String(item.total_amount).toLowerCase().includes(value);
  
      return nameMatch || countMatch || amountMatch ;
    });
  
    setFilteredData(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Service Name",
      dataIndex: "service_name",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
   {
  title: "Service Type",
  dataIndex: "service_type",
  render: (text) => {
    const serviceTypes = {
      0: "OP",
      1: "Scan",
      2: "Investigation",
      3: "Review",
    };
    return serviceTypes[text] || "-";  // Return corresponding label or "-" if unknown value
  },
},
    {
      title: "Service Count",
      dataIndex: "used_count",
      render: (text) => (text ? text : "-"),
      // sorter: (a, b) => a.count - b.count,
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      render: (text) => (text ? text : "-"),
      // sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (text) => (text ? text : "-"),
      // sorter: (a, b) => a.total_amount - b.total_amount,
    }
  ];

  const downloadExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      console.error("No data available for export!");
      notification.warning({
        message: "No Data",
        description: "There is no data to export.",
      });
      return;
    }
  
    const headers = ["S.No", "Service Name", "Service Type", "Used Count", "Unit Price", "Total Amount"];
  
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.service_name || "-",
       item.service_type !== undefined 
    ? { 
        0: "OP", 
        1: "Scan", 
        2: "Investigation", 
        3: "Review" 
      }[item.service_type] || "-" 
    : "-",  // Map service_type to its label or "-" if undefined
      item.used_count || "-",
      item.unit_price || "-",
      item.total_amount || "-"
    ]);
  
    rows.unshift(headers);
  
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Medicine Report");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    saveAs(file, `service_report(${startDate}_to_${endDate}).xlsx`);
  };


   const fetchSlots = async () => {
        setLoading(true);
      
        const token = localStorage.getItem("token");
        const hospital_id = localStorage.getItem("hospital_id");
      
        try {
          const response = await fetch(
            `${var_api}gos-slot/getby-hospital/${hospital_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            }
          );
      
          if (!response.ok) throw new Error("Failed to fetch data");
      
          const result = await response.json();
           // Map paymode data to the format required by react-select
         const options = [
    { value: 0, label: "All" }, // All option
    ...result.map((slot) => ({
      value: slot.from_time, // use from_time as filter value
      label: `${slot.from_time} - ${slot.to_time}`, // display both times
    })),
  ];
    setSlotOptions(options);
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
    


  const handleSlot = (value) => {
  setSelectedSlot(value);
  fetchData(startDate, endDate, value); // Pass slot time to fetchData
};


  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Service Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Service Report Tables
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
              <div className="col-lg-3">
              <div className="d-flex flex-column h-100">
                {/* <label htmlFor="slot-select" className="form-label mb-1">Slot</label> */}
                <Select
                  inputId="slot-select"
                  className="select-social-img w-100" // Full width
                  defaultValue={0}
                  onChange={handleSlot}
                  options={slotOptions}
                  placeholder="Select Slot"
                  isSearchable={false}
                />
              </div>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary" onClick={downloadExcel}>
                Download Excel
              </button>
            </div>

             <div className="col-sm-3">
            <div className="filter-head">
              <div className="position-relative daterange-wraper me-2">
                <div className="input-groupicon calender-input">
                  <DateRangePicker
                    initialSettings={labinitialSettings}
                    onCallback={(start, end) => {
                      const formattedStartDate = formatDates(new Date(start));
                      const formattedEndDate = formatDates(new Date(end));
                      setStartDate(formattedStartDate);
                      setEndDate(formattedEndDate);
                      fetchData(formattedStartDate, formattedEndDate);
                      fetchDataSummary(formattedStartDate, formattedEndDate);
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

         
          </div>
{dataSummary && (
  <Row gutter={[16, 16]} className="mb-4" wrap={false}>
    {/* OP Total */}
    <Col flex="1 1 20%">
      <Card
        bordered
        className="shadow-sm"
        style={{ borderLeft: "5px solid #1677ff" }}
      >
        <h5>OP Total</h5>
        <p style={{ fontSize: "20px", margin: 0, color: "#1677ff" }}>
          ₹ {dataSummary.op_total || 0}
        </p>
        <small>Discount: ₹ {dataSummary.op_discount || 0}</small>
      </Card>
    </Col>

    {/* Scan Total */}
    <Col flex="1 1 20%">
      <Card
        bordered
        className="shadow-sm"
        style={{ borderLeft: "5px solid #13c2c2" }}
      >
        <h5>Scan Total</h5>
        <p style={{ fontSize: "20px", margin: 0, color: "#13c2c2" }}>
          ₹ {dataSummary.scan_total || 0}
        </p>
        <small>Discount: ₹ {dataSummary.scan_discount || 0}</small>
      </Card>
    </Col>

    {/* Investigation Total */}
    <Col flex="1 1 20%">
      <Card
        bordered
        className="shadow-sm"
        style={{ borderLeft: "5px solid #52c41a" }}
      >
        <h5>Investigation Total</h5>
        <p style={{ fontSize: "20px", margin: 0, color: "#52c41a" }}>
          ₹ {dataSummary.investigation_total || 0}
        </p>
        <small>Discount: ₹ {dataSummary.investigation_discount || 0}</small>
      </Card>
    </Col>

    {/* Review Total */}
    <Col flex="1 1 20%">
      <Card
        bordered
        className="shadow-sm"
        style={{ borderLeft: "5px solid #faad14" }}
      >
        <h5>Review Total</h5>
        <p style={{ fontSize: "20px", margin: 0, color: "#faad14" }}>
          ₹ {dataSummary.review_total || 0}
        </p>
        <small>Discount: ₹ {dataSummary.review_discount || 0}</small>
      </Card>
    </Col>

    {/* Grand Total */}
    <Col flex="1 1 20%">
      <Card
        bordered
        className="shadow-sm"
        style={{
          borderLeft: "5px solid #000",
          backgroundColor: "#f0f2f5",
        }}
      >
        <h5 style={{ fontWeight: "bold" }}>Grand Total</h5>
        <p style={{ fontSize: "22px", margin: 0, color: "#000" }}>
          ₹ {dataSummary.grand_total || 0}
        </p>
        <small style={{ fontWeight: "500" }}>
          Grand Discount: ₹ {dataSummary.grand_discount || 0}
        </small>
      </Card>
    </Col>
  </Row>
)}


          
         

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Service Report</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive service-container">
                    <Table
                      loading={loading}
                      columns={columns}
                      dataSource={filteredData || []}
                      rowKey={(record) => record?.name || Math.random().toString()}
                      pagination={{
                        total: filteredData.length,
                        pageSize: pageSize,
                        current: currentPage,
                        showSizeChanger: true,
                        onChange: handlePaginationChange,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineReport;