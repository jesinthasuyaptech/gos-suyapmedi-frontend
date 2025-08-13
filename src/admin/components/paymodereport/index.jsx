import React, { useState, useEffect } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Filter, initialSettings } from "../../../client/components/common/filter";
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

const paymodereport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedstatus, setSelectedstatus]=useState(0);
  const [pageSize, setPageSize] = useState(10);
  const[options, setoptions]=useState([]);
  const[slotOptions, setSlotOptions]=useState([]);
  const [selectedSlot, setSelectedSlot] = useState("ALL");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filterData = selectedstatus === 0 ? filteredData : filteredData.filter((item) => item.paymode_id == selectedstatus);


  const getCurrentDateFormatted = () => {
    const currentDate = new Date();
    return `${currentDate.getDate().toString().padStart(2, "0")}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getFullYear()}`;
  };


  const formatDateToDDMMYYYY = (date) => {
  // If date is already in dd-mm-yyyy format, return as is
  if (typeof date === 'string' && date.match(/^\d{2}-\d{2}-\d{4}$/)) {
    return date;
  }
  
  // If date is a Date object or string that can be parsed to Date
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

  const fetchData = async (startDate = initialSettings.startDate, endDate = initialSettings.endDate, fromTime = "ALL") => {
    setLoading(true);
  
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");

     // Format dates to dd-mm-yyyy
  const formattedStart = formatDateToDDMMYYYY(startDate);
  const formattedEnd = formatDateToDDMMYYYY(endDate);


     // Construct the URL dynamically
  let url = `${var_api}paymodemaster/gos-get-payreport/${hospital_id}/${formattedStart}/${formattedEnd}`;
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

    const fetchpaymode = async () => {
      setLoading(true);
    
      const token = localStorage.getItem("token");
      const hospital_id = localStorage.getItem("hospital_id");
    
      try {
        const response = await fetch(
          `${var_api}paymodemaster/get-by-hospital/${hospital_id}`,
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
          { value: 0, label: 'All' }, // Add "All" as the first option
          ...result.map((paymode) => ({
            value: paymode.id,
            label: paymode.paymode_name,
          })),
        ];
  setoptions(options);
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
  

    const handleSlotChange = (selectedOption) => {
  setSelectedSlot(selectedOption.value);

  const fromTime = selectedOption.value; // value can be "ALL" or "HH:mm"

  fetchData(undefined, undefined, fromTime);
};

  

  useEffect(() => {
    fetchData();
    fetchpaymode();
    fetchSlots();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = data.filter((item) => {
      const paymodeMatch = item.paymode_name.toLowerCase().includes(value);
      const amountMatch = item.total_paid_amount.toString().toLowerCase().includes(value);
      const appointmentsMatch = item.total_appointments.toString().toLowerCase().includes(value);
  
      return  paymodeMatch || amountMatch || appointmentsMatch;
    });
  
    setFilteredData(filtered);
  };

  const handleStatus = (value) => {
    console.log(value);
    setSelectedstatus(value);
  };
const handleSlot = (value) => {
  setSelectedSlot(value);
  fetchData(startDate, endDate, value); // Pass slot time to fetchData
};


  const filtered = selectedstatus == 3 ? filteredData : filteredData.filter((item) => item.paid_status == selectedstatus);

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
        title: "Name",
        dataIndex: "paymode_name",
        render: (text) => (text ? text : "-"),
         
      },      
    {
      title: "Total Amount",
      dataIndex: "total_paid_amount",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Total Appoinments",
      dataIndex: "total_appointments",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
      
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
    
      const headers = ["S.No", "Paymode Name", "Total Amount", "Total Appoinments"];
    
      const rows = filteredData.map((item, index) => [
        index + 1,
        item.paymode_name || "-",
        item.total_paid_amount || "-",
        item.total_appointments || "-"
      ]);
    
      rows.unshift(headers);
    
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Paymode Report");
    
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    
      saveAs(file, `paymode_report(${startDate}_to_${endDate}).xlsx`);
    };

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">PayMode Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    PayMode Report Tables
                  </li>
                </ul>
              </div>
            </div>
          </div>

         <div className="row mb-3 g-3"> {/* Added g-3 for consistent gutter spacing */}
  {/* Search Input - takes 2 columns */}
  <div className="col-lg-2">
    <Input 
      placeholder="Search" 
      value={searchTerm} 
      onChange={handleSearch} 
      className="w-100" // Make input full width of its column
    />
  </div>

  {/* Paymode Select - takes 2 columns */}
  <div className="col-lg-2">
    <div className="d-flex flex-column h-100">
      {/* <label htmlFor="paymode-select" className="form-label mb-1">Paymode</label> */}
      <Select
        inputId="paymode-select"
        className="select-social-img w-100" // Full width
        defaultValue={0}
        onChange={handleStatus}
        options={options}
        placeholder="Select Paymode"
        isSearchable={false}
      />
    </div>
  </div>

  {/* Slot Select - takes 2 columns */}
  <div className="col-lg-2">
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
  
  {/* Date Range Picker - takes 3 columns */}
  <div className="col-lg-3">
    <div className="d-flex flex-column h-100">
      {/* <label className="form-label mb-1">Date Range</label> */}
      <div className="position-relative">
        <DateRangePicker
          initialSettings={initialSettings}
          onCallback={(start, end) => {
            const formatDate = (date) =>
              `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear()}`;
            
            const formattedStartDate = formatDate(new Date(start));
            const formattedEndDate = formatDate(new Date(end));
            setStartDate(start);
            setEndDate(end);
            fetchData(formattedStartDate, formattedEndDate, selectedSlot);
          }}
        >
          <input
            className="form-control date-range bookingrange w-100"
            type="text"
            placeholder="Select Date Range"
          />
        </DateRangePicker>
      </div>
    </div>
  </div>

  {/* Download Button - takes 1 column */}
  <div className="col-lg-1 d-flex align-items-end">
    <button 
      className="btn btn-primary w-100" // Full width
      onClick={downloadExcel}
    >
      Export 
    </button>
  </div>
</div>
                        

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Paymode Report</h4>
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

    </>
  );
};

export default paymodereport;
