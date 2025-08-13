import React, { useState, useEffect } from "react";
import { Table, Input, notification, Button } from "antd";
import { Link } from "react-router-dom";
import DateRangePicker from "react-bootstrap-daterangepicker";
import SidebarNav from "../sidebar";
import { var_api } from "../../../constant";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-datepicker/dist/react-datepicker.css";

const getCurrentDateFormatted = () => {
  const currentDate = new Date();
  return `${currentDate.getDate().toString().padStart(2, "0")}-${
    (currentDate.getMonth() + 1).toString().padStart(2, "0")
  }-${currentDate.getFullYear()}`;
};

const MedicineReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState("01-01-2024");
  const [endDate, setEndDate] = useState(getCurrentDateFormatted());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (startDate = "01-01-2024", endDate = getCurrentDateFormatted()) => {
    setLoading(true);
    const token = localStorage.getItem("pres_token");
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredData(data.filter((item) => item.medicine_name.toLowerCase().includes(value)));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Medicine Report", 20, 10);
    doc.autoTable({
      head: [["S.No", "Medicine Name", "Total Received Qty", "Total Given Qty"]],
      body: filteredData.map((item, index) => [
        index + 1,
        item.medicine_name,
        item.total_received_qty,
        item.total_given_qty,
      ]),
    });
    doc.save("Medicine_Report.pdf");
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

  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize },
    { title: "Medicine Name", dataIndex: "medicine_name", sorter: (a, b) => a.medicine_name.localeCompare(b.medicine_name) },
    { title: "Total Received Qty", dataIndex: "total_received_qty", sorter: (a, b) => a.total_received_qty - b.total_received_qty },
    { title: "Total Given Qty", dataIndex: "total_given_qty", sorter: (a, b) => a.total_given_qty - b.total_given_qty },
  ];

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <h3 className="page-title">Medicine Report</h3>
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/pharmacyadmin">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/pharmacyadmin/report">Report</Link></li>
              <li className="breadcrumb-item active">Medicine Report</li>
            </ul>
          </div>
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
                <input className="form-control" type="text" placeholder="Select Date Range" />
              </DateRangePicker>
            </div>
            <div className="col-md-4 text-end">
              {/* <Button type="primary" onClick={exportPDF} className="me-2">Download PDF</Button> */}
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
        </div>
      </div>
    </>
  );
};

export default MedicineReport;
