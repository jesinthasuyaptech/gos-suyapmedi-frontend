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

const AppointmentReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const history = useHistory();

  const getCurrentDateFormatted = () => {
    const currentDate = new Date();
    return `${currentDate.getDate().toString().padStart(2, "0")}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getFullYear()}`;
  };

  const fetchData = async (startDate = getCurrentDateFormatted(), endDate = getCurrentDateFormatted()) => {
    setLoading(true);
  
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
  
    try {
      const response = await fetch(
        `${var_api}appointment/report/${hospital_id}/${startDate}/${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const result = await response.json();
      setData(result.data || []);
      setFilteredData(result.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve appointment data. Please try again later.",
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
      const nameMatch = item.patient_name?.toLowerCase().includes(value);
      const mobileMatch = item.patient_mobile?.toLowerCase().includes(value);
      const techMatch = item.tech_name?.toLowerCase().includes(value);

      return nameMatch || mobileMatch || techMatch;
    });

    setFilteredData(filtered);
  };

  const handleViewDetails = (record) => {
    setSelectedAppointment(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAppointment(null);
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
      title: "Appointment Date",
      dataIndex: "appointment_day",
      render: (text) => text || "-",
      sorter: (a, b) => a.appointment_day?.localeCompare(b.appointment_day),
    },
    {
      title: "Patient Name",
      dataIndex: "patient_name",
      render: (text) => text || "-",
      sorter: (a, b) => a.patient_name?.localeCompare(b.patient_name),
    },
    {
      title: "Patient Mobile",
      dataIndex: "patient_mobile",
      render: (text) => text || "-",
    },
    {
      title: "Doctor",
      dataIndex: "tech_name",
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status_text",
      render: (text) => text || "-",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => text ? `₹${text}` : "-",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const detailColumns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (text) => text || "-",
    },
  ];

  const appointmentDetails = selectedAppointment
    ? [
        { field: "Appointment ID", value: selectedAppointment.id },
        { field: "Token No", value: selectedAppointment.token_no },
        { field: "Appointment Date", value: selectedAppointment.appointment_day },
        { field: "Appointment Time", value: selectedAppointment.appointment_time },
        { field: "Patient Name", value: selectedAppointment.patient_name },
        { field: "Patient Mobile", value: selectedAppointment.patient_mobile },
        { field: "Technician", value: selectedAppointment.tech_name },
        { field: "Status", value: selectedAppointment.status_text },
        { field: "Slot Time", value: `${selectedAppointment.slot_time} mins` },
        { field: "Amount", value: `₹${selectedAppointment.amount}` },
        { field: "Diagnosis", value: selectedAppointment.diagnosis },
        { field: "Payment Status", value: selectedAppointment.payment_status === 0 ? "Unpaid" : "Paid" },
      ]
    : [];

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Appointment Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Appointment Report
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Input
                placeholder="Search by patient, mobile, or technician"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="col-sm-3">
              <div className="filter-head">
                <div className="position-relative daterange-wraper me-2">
                  <div className="input-groupicon calender-input">
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
                      />
                    </DateRangePicker>
                  </div>
                  <i className="fa-solid fa-calendar-days" />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Appointment Report</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      pagination={{
                        total: filteredData.length,
                        pageSize: pageSize,
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
        title="Appointment Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={700}
      >
        {selectedAppointment && (
          <Table
            columns={detailColumns}
            dataSource={appointmentDetails}
            pagination={false}
            showHeader={false}
            bordered
          />
        )}
      </Modal>
    </>
  );
};

export default AppointmentReport;