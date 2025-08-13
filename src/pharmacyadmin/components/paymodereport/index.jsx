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
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState("01-01-2024");
  const [endDate, setEndDate] = useState(getCurrentDateFormatted());

 
  
  // Now use it
  //const [endDate, setEndDate] = useState(getCurrentDateFormatted());
  

  const fetchData = async (startDate = "01-01-2024", endDate = getCurrentDateFormatted()) => {
    setLoading(true);
    const token = localStorage.getItem("pres_token");
    const hospital_id = localStorage.getItem("pres_hospital_id");

    try {
      const response = await fetch(
        `${var_api}paymodemaster/get-paymode-medical-report/${hospital_id}/${startDate}/${endDate}`,
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
      return (
        (item.paymode_name?.toLowerCase().includes(value) || false) ||
        (item.total_paid_amount?.toString().includes(value) || false) ||
        (item.total_appointments?.toString().includes(value) || false)
      );
    });
    setFilteredData(filtered);
  };

  const handlePaginationChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paymode Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = `Paymode_Report_${startDate}_to_${endDate}.xlsx`;
    saveAs(data, fileName);
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
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
                    <Link to="/pharmacyadmin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/pharmacyadmin/report">Report</Link>
                  </li>
                  <li className="breadcrumb-item active">PayMode Report Tables</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mb-3 align-items-center">
          <div className="col-md-8 d-flex gap-3">
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
                  const formatDate = (date) =>
                    `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${date.getFullYear()}`;

                  setStartDate(formatDate(new Date(start)));
                  setEndDate(formatDate(new Date(end)));
                  fetchData(formatDate(new Date(start)), formatDate(new Date(end)));
                }}
              >
                <input className="form-control date-range bookingrange" type="text" placeholder="Select Date Range" style={{ width: "200px" }} />

              </DateRangePicker>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-primary" onClick={exportExcel}>
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
                        total: filteredData.length,
                        pageSize: pageSize,
                        current: currentPage,
                        showSizeChanger: false,
                        onShowSizeChange: handlePaginationChange,
                        onChange: handlePaginationChange,
                        itemRender: itemRender,
                      }}
                      loading={loading}
                      columns={columns}
                      dataSource={filteredData}
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

export default PaymodeReport;
