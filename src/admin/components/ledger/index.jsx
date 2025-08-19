import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, DatePicker, Select, Card, Row, Col, Modal } from "antd";
import { Filter, initialSettingsApt } from "../../../client/components/common/filter";
import { itemRender } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import "../styles/Loader.css";
import { useHistory } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const Ledger = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [slotFilter, setSlotFilter] = useState("ALL");
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const history = useHistory();

  // Fetch GOS invoice data with default values
  const fetchGosInvoice = async (slotId = "ALL", date = moment().format('YYYY-MM-DD')) => {
    setInvoiceLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${var_api}gos-invoice-billing/gos-invoice/${slotId}/${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch invoice data");
      const result = await response.json();
      setSelectedInvoice(result);
    } catch (error) {
      console.error("Error fetching GOS invoice:", error);
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Fetch ledger data
  const fetchData = async () => {
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

      if (!response.ok) throw new Error("Failed to fetch ledger data");
      const result = await response.json();
      setData(result || []);
      
      // Apply initial filters with default values
      applyFilters(moment(), "ALL", result || []);
      
      // Fetch initial invoice data with default values
      fetchGosInvoice("ALL", moment().format('YYYY-MM-DD'));
    } catch (error) {
      console.error("Error fetching ledger data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle date filter
  const handleDateFilter = (date) => {
    setSelectedDate(date);
    applyFilters(date, slotFilter, data);
    
    // Fetch new invoice data when date changes
    if (date) {
      fetchGosInvoice(slotFilter, date.format('YYYY-MM-DD'));
    }
  };

  // Handle slot filter
  const handleSlotFilter = (value) => {
    setSlotFilter(value);
    applyFilters(selectedDate, value, data);
    
    // Fetch new invoice data when slot changes
    fetchGosInvoice(value, selectedDate.format('YYYY-MM-DD'));
  };

  // Apply filters to data
  const applyFilters = (date, slot, dataToFilter) => {
    let filtered = [...dataToFilter];

    // Apply date filter
    if (date) {
      const selectedDateStart = moment(date).startOf("day");
      const selectedDateEnd = moment(date).endOf("day");

      filtered = filtered.filter((item) => {
        const itemDate = moment(item.date);
        return itemDate.isBetween(selectedDateStart, selectedDateEnd, null, "[]");
      });
    }

    // Apply slot filter
    if (slot !== "ALL") {
      filtered = filtered.filter((item) => item.slot === slot);
    }

    setFilteredData(filtered);
  };

  // Reset filters to default values
  const resetFilters = () => {
    const today = moment();
    setSelectedDate(today);
    setSlotFilter("ALL");
    applyFilters(today, "ALL", data);
    fetchGosInvoice("ALL", today.format('YYYY-MM-DD'));
  };

  // Handle view invoice
  const handleViewInvoice = (record) => {
    if (record.appointment_id && record.slot_id && record.date) {
      fetchGosInvoice(record.slot_id, record.date);
      setInvoiceModalVisible(true);
    } else {
      console.error("Missing appointment data for invoice");
    }
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
      width: 80,
    },
    {
      title: "Token no",
      dataIndex: "token_no",
      render: (text) => text || "N/A",
      sorter: (a, b) => (a.token_no || "").localeCompare(b.token_no || ""),
    },
    {
      title: "Patient Name",
      dataIndex: "patient_name",
      render: (text) => text || "N/A",
      sorter: (a, b) =>
        (a.patient_name || "").localeCompare(b.patient_name || ""),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (text) => `₹${text ? parseFloat(text).toFixed(2) : "0.00"}`,
      sorter: (a, b) =>
        parseFloat(a.total_amount || 0) - parseFloat(b.total_amount || 0),
    },
    {
      title: "Service",
      dataIndex: "service",
      render: (text) => text || "N/A",
      sorter: (a, b) => (a.service || "").localeCompare(b.service || ""),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymode",
      render: (text) => {
        const paymodes = {
          1: "Cash",
          2: "Card",
          3: "UPI",
          4: "Net Banking",
          5: "Wallet",
        };
        return paymodes[text] || "N/A";
      },
      sorter: (a, b) => (a.paymode || "").localeCompare(b.paymode || ""),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewInvoice(record)}
          disabled={!record.appointment_id || !record.slot_id || !record.date}
        >
          View Invoice
        </Button>
      ),
    },
  ];

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Render invoice details
  const renderInvoiceDetails = () => {
    if (!selectedInvoice) return null;

    const { appointment, gos_invoice_billing } = selectedInvoice;

    return (
      <div>
        <h3>Appointment Details</h3>
        <p>
          <strong>Token No:</strong> {appointment.token_no}
        </p>
        <p>
          <strong>Patient:</strong> {gos_invoice_billing.patient_name}
        </p>
        <p>
          <strong>Appointment Date:</strong> {appointment.appointment_day}
        </p>
        <p>
          <strong>Time:</strong> {appointment.appointment_time}
        </p>

        <h3>Services</h3>
        <Table
          dataSource={gos_invoice_billing.services}
          pagination={false}
          columns={[
            { title: "Service", dataIndex: "service_name" },
            { title: "Type", dataIndex: "service_type" },
            {
              title: "Price",
              dataIndex: "price",
              render: (text) => `₹${text}`,
            },
          ]}
        />

        <h3>Payment Details</h3>
        <p>
          <strong>Total Amount:</strong> ₹{gos_invoice_billing.total_amount}
        </p>
        <p>
          <strong>Payment Mode:</strong>{" "}
          {gos_invoice_billing.doctor_invoice_paymode &&
          gos_invoice_billing.doctor_invoice_paymode.length > 0
            ? gos_invoice_billing.doctor_invoice_paymode[0].paymode_id
            : "N/A"}
        </p>
      </div>
    );
  };

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
                <h3 className="page-title">Ledger</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Ledger</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <Card title="Filters" style={{ width: "100%" }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <div className="mb-2">
                    <label>Date</label>
                    <DatePicker
                      value={selectedDate}
                      onChange={handleDateFilter}
                      format="DD-MM-YYYY"
                      style={{ width: "100%" }}
                      placeholder="Select Date"
                      allowClear
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <div className="mb-2">
                    <label>Time Slot</label>
                    <Select
                      value={slotFilter}
                      onChange={handleSlotFilter}
                      style={{ width: "100%" }}
                      placeholder="Select Slot"
                    >
                      <Option value="ALL">All Slots</Option>
                      {data.length > 0 ? (
                        data.map((slot) => (
                          <Option key={slot.id} value={slot.id}>
                            {slot.from_time} - {slot.to_time}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No Slots Available</Option>
                      )}
                    </Select>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={6}>
                  <div className="mb-2" style={{ paddingTop: "29px" }}>
                    <Button onClick={resetFilters}>Reset Filters</Button>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Ledger</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      pagination={{
                        total: filteredData.length,
                        pageSize: pageSize,
                        current: currentPage,
                        showSizeChanger: true,
                        onShowSizeChange: (current, size) =>
                          handlePaginationChange(current, size),
                        onChange: handlePaginationChange,
                        itemRender: itemRender,
                      }}
                      loading={loading}
                      columns={columns}
                      dataSource={filteredData}
                      rowKey={(record) => record.id}
                      scroll={{ x: 1000 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
        <Modal
          title="GOS Invoice Details"
          visible={invoiceModalVisible}
          onCancel={() => setInvoiceModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setInvoiceModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          {invoiceLoading ? (
            <div className="text-center">Loading invoice details...</div>
          ) : (
            renderInvoiceDetails()
          )}
        </Modal>
      </div>
    </>
  );
};

export default Ledger;