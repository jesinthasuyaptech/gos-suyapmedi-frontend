import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, DatePicker, Select, Card, Row, Col, Modal } from "antd";
import { itemRender } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import "../styles/Loader.css";
import { useHistory } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const Ledger = () => {
  const [slots, setSlots] = useState([]); // For slot filter options
  const [invoiceData, setInvoiceData] = useState([]); // For table data
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

  // Fetch GOS invoice data for TABLE
  const fetchGosInvoice = async (slotId = "ALL", date = moment().format('DD-MM-YYYY')) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");

    try {
      const response = await fetch(
        `${var_api}gos-invoice-billing/gos-invoice/${hospital_id}/${slotId}/${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch invoice data");

      const result = await response.json();

      // Transform data for AntD Table
      const transformed = result.map((item) => {
        const appointment = item?.appointment || {};
        const gos_invoice_billing = item?.gos_invoice_billing || {};
        const customer_details = item?.customer_details || {};

        // Collect services into comma-separated string
        const serviceList = [
          ...(gos_invoice_billing.services?.op || []),
          ...(gos_invoice_billing.services?.scan || []),
          ...(gos_invoice_billing.services?.investigation || []),
          ...(gos_invoice_billing.services?.review || [])
        ]
          .map((s) => s?.service_name || "")
          .filter(Boolean)
          .join(", ");

        return {
          id: gos_invoice_billing.id || null,
          appointment_id: appointment.appointment_id || null,
          slot_id: appointment.slot_id || null,
          date: appointment.appointment_day || "-",
          token_no: appointment.token_no || "-",
          patient_name: customer_details.patient_name || "Unknown",
          total_amount: gos_invoice_billing.grand_total || 0,
          service: serviceList || "-",
          paymode: gos_invoice_billing.doctor_invoice_paymode?.map((p) => p.paymode_id).join(", ") || "N/A",
          
          // For modal
          appointment: appointment,
          gos_invoice_billing: gos_invoice_billing,
          customer_details: customer_details
        };
      });

      setInvoiceData(transformed);
      setFilteredData(transformed); // Initially show all data
    } catch (error) {
      console.error("Error fetching GOS invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots for filter dropdown
  const fetchSlots = async () => {
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

      if (!response.ok) throw new Error("Failed to fetch slot data");
      const result = await response.json();
      setSlots(result || []);
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchGosInvoice("ALL", moment().format('DD-MM-YYYY'));
  }, []);

  // Handle date filter
  const handleDateFilter = (date) => {
    setSelectedDate(date);
    applyFilters(date, slotFilter, invoiceData);
  };

  // Handle slot filter
  const handleSlotFilter = (value) => {
    setSlotFilter(value);
    applyFilters(selectedDate, value, invoiceData);
  };

  // Apply filters to data
  const applyFilters = (date, slot, dataToFilter) => {
    let filtered = [...dataToFilter];

    // Apply date filter
    if (date) {
      const selectedDateFormatted = date.format('DD-MM-YYYY');
      filtered = filtered.filter((item) => item.date === selectedDateFormatted);
    }

    // Apply slot filter
    if (slot !== "ALL") {
      filtered = filtered.filter((item) => item.slot_id == slot);
    }

    setFilteredData(filtered);
  };

  // Reset filters to default values
  const resetFilters = () => {
    const today = moment();
    setSelectedDate(today);
    setSlotFilter("ALL");
    fetchGosInvoice("ALL", today.format('DD-MM-YYYY'));
  };

  // Handle view invoice
  const handleViewInvoice = (record) => {
    setSelectedInvoice(record);
    setInvoiceModalVisible(true);
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
        // Handle multiple paymodes (comma-separated)
        if (text && text.includes(",")) {
          return text.split(",").map(id => paymodes[id.trim()] || id.trim()).join(", ");
        }
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
  const renderInvoiceDetails = (invoiceRecord) => {
    if (!invoiceRecord) return null;

    const appointment = invoiceRecord?.appointment || {};
    const gos_invoice_billing = invoiceRecord?.gos_invoice_billing || {};
    const customer_details = invoiceRecord?.customer_details || {};

    // Flatten services for the table
    const flattenedServices = [
      ...(gos_invoice_billing.services?.op || []),
      ...(gos_invoice_billing.services?.scan || []),
      ...(gos_invoice_billing.services?.investigation || []),
      ...(gos_invoice_billing.services?.review || [])
    ];

    return (
      <div>
         <h3>Payment Details</h3>
        <p>
          <strong>Total Amount:</strong> ₹{gos_invoice_billing.grand_total || "0.00"}
        </p>
        <p>
          <strong>Paid Amount:</strong> ₹{gos_invoice_billing.paid_amount || "0.00"}
        </p>
        <p>
          <strong>Balance Amount:</strong> ₹{gos_invoice_billing.balance_amount || "0.00"}
        </p>
        <p>
          <strong>Payment Mode:</strong>{" "}
          {gos_invoice_billing.doctor_invoice_paymode &&
          gos_invoice_billing.doctor_invoice_paymode.length > 0
            ? gos_invoice_billing.doctor_invoice_paymode.map(p => {
                const paymodes = {1: "Cash", 2: "Card", 3: "UPI", 4: "Net Banking", 5: "Wallet"};
                return paymodes[p.paymode_id] || p.paymode_id;
              }).join(", ")
            : "N/A"}
        </p>

        <h3>Services</h3>
        {flattenedServices.length > 0 ? (
          <Table
            dataSource={flattenedServices}
            pagination={false}
            columns={[
              { 
                title: "Service", 
                dataIndex: "service_name", 
                key: "service_name",
                render: (text) => text || "N/A"
              },
              { 
                title: "Type", 
                dataIndex: "service_type", 
                key: "service_type",
                render: (type) => {
                  const types = {0: "OP", 1: "Scan", 2: "Investigation", 3: "Review"};
                  return types[type] || "N/A";
                }
              },
              {
                title: "Price",
                dataIndex: "final_amount",
                key: "price",
                render: (text) => `₹${text || "0.00"}`
              },
            ]}
            rowKey={(record, index) => index}
          />
        ) : (
          <p>No services found</p>
        )}
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
                      {slots.length > 0 ? (
                        slots.map((slot) => (
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
                      rowKey={(record) => record.id || record.appointment_id}
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
          {selectedInvoice ? (
            renderInvoiceDetails(selectedInvoice)
          ) : (
            <div className="text-center">No invoice data available</div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Ledger;