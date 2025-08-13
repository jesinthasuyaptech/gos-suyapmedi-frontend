import React, { useState, useEffect } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import SidebarNav from "../sidebar";
import { Table, Input, notification, Button } from "antd";
import { itemRender } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-datepicker/dist/react-datepicker.css";
const getCurrentDateFormatted = () => {
  const currentDate = new Date();
  return `${currentDate.getDate().toString().padStart(2, "0")}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getFullYear()}`;
};
const PaymodeReport = () => {
  const [datapaymode, setDatapaymode] = useState([]);
  const [filteredDatapaymode, setFilteredDatapaymode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTermpaymode, setSearchTermpaymode] = useState("");
  const [currentPagepaymode, setCurrentPagepaymode] = useState(1);
  const [pageSizepaymode, setPageSizepaymode] = useState(10);
  const [startDatepaymode, setStartDatepaymode] = useState("01-01-2024");
  const [endDatepaymode, setEndDatepaymode] = useState(getCurrentDateFormatted());
  const [activeTab, setActiveTab] = useState("PayModeReport");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [startDate, setStartDate] = useState("01-01-2024");
    const [endDate, setEndDate] = useState(getCurrentDateFormatted());

 
  
  // Now use it
  //const [endDate, setEndDate] = useState(getCurrentDateFormatted());
  

  const fetchDatapaymode = async (startDatepaymode = "01-01-2024", endDatepaymode = getCurrentDateFormatted()) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");

    try {
      const response = await fetch(
        `${var_api}paymodemaster/get-paymode-medical-report/${hospital_id}/${startDatepaymode}/${endDatepaymode}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setDatapaymode(result || []);
      setFilteredDatapaymode(result || []);
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
    const fetchData = async (startDate = "01-01-2024", endDate = getCurrentDateFormatted()) => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${var_api}medicinesubcategory/get-received-qty/${startDate}/${endDate}`,
          {
            headers: { "Content-Type": "application/json", Authorization: `${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result || []);
        setFilteredData(result || []);
      } catch (error) {
        notification.error({ message: "Fetch Failed", description: "Unable to retrieve data." });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDatapaymode();
    fetchData();
  }, []);

  const handleSearchpaymode = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermpaymode(value);
    const filtered = datapaymode.filter((item) => {
      return (
        (item.paymode_name?.toLowerCase().includes(value) || false) ||
        (item.total_paid_amount?.toString().includes(value) || false) ||
        (item.total_appointments?.toString().includes(value) || false)
      );
    });
    setFilteredDatapaymode(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredData(data.filter((item) => item.medicine_name.toLowerCase().includes(value)));
  };


  const handlePaginationChangepaymode = (page, size) => {
    setCurrentPagepaymode(page);
    setPageSizepaymode(size);
  };

  const exportExcelpaymode = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredDatapaymode);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paymode Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = `Paymode_Report_${startDatepaymode}_to_${endDatepaymode}.xlsx`;
    saveAs(data, fileName);
  };

    const exportExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Medicine Report");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fileName = `Medicine_Report_${startDate}_to_${endDate}.xlsx`;
      saveAs(data, fileName);
    };

  const columnspaymode = [
    {
      title: "#",
      render: (_, __, index) => index + 1 + (currentPagepaymode - 1) * pageSizepaymode,
    },
    {
      title: "Name",
      dataIndex: "paymode_name",
      render: (text) => text || "-",
    },
    {
      title: "Total Amount",
      dataIndex: "total_paid_amount",
      sorter: (a, b) => a.total_paid_amount - b.total_paid_amount,
      render: (text) => text || "-",
    },
  ];

  
  const columns = [
    { title: "#", render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize },
    { title: "Medicine Name", dataIndex: "medicine_name", sorter: (a, b) => a.medicine_name.localeCompare(b.medicine_name) },
    { title: "Total Given Qty", dataIndex: "total_given_qty", sorter: (a, b) => a.total_given_qty - b.total_given_qty },
    { title: "Total Received Qty", dataIndex: "total_received_qty", sorter: (a, b) => a.total_received_qty - b.total_received_qty },
    
  ];

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
            {activeTab === "PayModeReport" && (
              <div className="col">
                <h3 className="page-title">PayMode Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/pharmacyadmin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/pharmacyadmin/report">Report</Link>
                  </li>
                  <li className="breadcrumb-item active">PayMode Report Tables</li>
                </ul>
              </div>
              )}
 {activeTab === "MedicineReport" && (
    <div className="col">
                   <div className="page-header">
                          <h3 className="page-title">Medicine Report</h3>
                          <ul className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/pharmacyadmin">Dashboard</Link></li>
                            <li className="breadcrumb-item"><Link to="/pharmacyadmin/report">Report</Link></li>
                            <li className="breadcrumb-item active">Medicine Report</li>
                          </ul>
                        </div>
                        </div>
 )}
              <div className="col-auto ml-auto">
                <ul className="nav nav-tabs nav-tabs-solid">
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${activeTab === "PayModeReport" ? "active" : ""}`}
                      onClick={() => setActiveTab("PayModeReport")}
                      to="#"
                    >
                      PayMode Report
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${activeTab === "MedicineReport" ? "active" : ""}`}
                      onClick={() => setActiveTab("MedicineReport")}
                      to="#"
                    >
                      Medicine Report
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
  
          {activeTab === "PayModeReport" && (
            <>
         <div className="row mb-3 align-items-center">
  <div className="col-md-8 d-flex gap-3">
    <input
      className="form-control"
      type="text"
      placeholder="Search"
      value={searchTermpaymode}
      onChange={handleSearchpaymode}
      style={{ width: "200px" }}
    />
    <DateRangePicker
      onCallback={(start, end) => {
        const formatDate = (date) =>
          `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
        setStartDatepaymode(formatDate(new Date(start)));
        setEndDatepaymode(formatDate(new Date(end)));
        fetchData(formatDate(new Date(start)), formatDate(new Date(end)));
      }}
    >
      <input className="form-control date-range bookingrange" type="text" placeholder="Select Date Range" style={{ width: "200px" }} />
    </DateRangePicker>
  </div>
  <div className="col-md-4 text-end">
    <button className="btn btn-primary" onClick={exportExcelpaymode}>
      Download Excel
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
                            total: filteredDatapaymode.length,
                            pageSizepaymode: pageSizepaymode,
                            currentPagepaymode: currentPagepaymode,
                            showSizeChanger: true,
                            onShowSizeChange: handlePaginationChangepaymode,
                            onChange: handlePaginationChangepaymode,
                            itemRender: itemRender,
                          }}
                          loading={loading}
                          columns={columnspaymode}
                          dataSource={filteredDatapaymode}
                          rowKey={(record) => record?.id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "MedicineReport" && (
            <>
   <div className="row mb-3 align-items-center">
  <div className="col-md-8 d-flex gap-3 align-items-center">
    <input
      className="form-control"
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={handleSearch}
      style={{ width: "200px" }}
    />
    <DateRangePicker
      onCallback={(start, end) => {
        const formattedStart = start.format("DD-MM-YYYY");
        const formattedEnd = end.format("DD-MM-YYYY");
        setStartDate(formattedStart);
        setEndDate(formattedEnd);
        fetchData(formattedStart, formattedEnd);
      }}
    >
      <input 
        className="form-control" 
        type="text" 
        placeholder="Select Date Range"  
        style={{ width: "200px" }} 
      />
    </DateRangePicker>
  </div>
  <div className="col-md-4 text-end">
    <button className="btn btn-primary" onClick={exportExcel}>
      Download Excel
    </button>
  </div>
</div>
                      <Table
                        pagination={{ total: filteredData.length, pageSize, current: currentPage, onChange: setCurrentPage }}
                        loading={loading}
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                      />
            </>
          )}

        </div>
      </div>
    </>
  );
}  

export default PaymodeReport;
