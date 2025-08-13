import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, Radio, Upload, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { var_api, image_api } from "../../../constant";

const DentalHistory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const history = useHistory();
  const token = localStorage.getItem("token");


  const fetchData = async () => {
    // const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzcwMDE3NzU3MjUsImlhdCI6MTczNzAwMTc3NX0.ejBZS6Bl1Gv5iJl_W6tae2Bexb0JCjC7r6PgAQ9JrM0";
    const hospital_id = localStorage.getItem("hospital_id");
    setLoading(true);
    try {
      const response = await fetch(`${var_api}dentalhistorychart/getbyhospital/${hospital_id}`, {
        headers: { "Content-Type": "application/json", Authorization: token},
      });
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
  
    const filtered = data.filter(
      (item) =>
        item.appointment_id?.toString().toLowerCase().includes(value) || // Safely handles Appointment ID (e.g., numbers)
        item.cdc_id?.toString().toLowerCase().includes(value) || // Safely handles CDC ID (e.g., numbers)
        item.remark?.toLowerCase().includes(value) || // Handles Remark
        item.staff_name?.toLowerCase().includes(value) || // Handles Doctor name
        item.patient_name?.toLowerCase().includes(value)||// Handles Patient name
        item.description?.toLowerCase().includes(value)
    );
  
    setFilteredData(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleModalOpen = (record = null) => {
    setEditData(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null);
  };


  const handleFileChange = (info) => {
    setFile(info.file.originFileObj);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${var_api}dentalhistorychart/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!response.ok) throw new Error("Error deleting record");

      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });

      fetchData();
    } catch (error) {
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    const hospital_id = localStorage.getItem("hospital_id");

    try {
      const payload = {
        hospital_id: hospital_id,
        ...values// Include only the image name if a file is uploaded
      };
  
      const url = editData
        ? `${var_api}dentalhistorychart/put/${editData.id}`
        : `${var_api}dentalhistorychart/post`;
      const method = editData ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(payload), // Convert the payload to JSON
      });
  
      if (!response.ok) throw new Error("Error saving data");
  
      notification.success({
        message: editData ? "Update Successful" : "Creation Successful",
        description: "The dental history record has been saved successfully.",
      });
  
      form.resetFields();
      setFile(null); // Reset file state after submission
      fetchData(); // Refresh the table data
      handleModalClose(); // Close the modal
    } catch (error) {
      notification.error({
        message: "Operation Failed",
        description: error.message || "There was an error while saving the data.",
      });
    }
  };
  

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Doctor",
      dataIndex: "staff_name", // Added Tech ID column
    },
    {
      title: "Patient",
      dataIndex: "patient_name", // Added Patient ID column
    },
    {
      title: "Appointment ID",
      dataIndex: "appointment_id", // Added Appointment ID column
    },
    {
      title: "CDC ID",
      dataIndex: "cdc_id", // Added CDC ID column
    },
    {
      title: "Description",
      dataIndex: "description", // Added CDC ID column
    },
    {
      title: "Remark",
      dataIndex: "remark", // Added CDC ID column
    },
    {
      title: "Action",
      className: "text-start",
      render: (_, record) => (
        <div className="text-start">
        <a
          href="#"
          className="me-1 btn btn-sm bg-success-light"
          // data-bs-toggle="modal"
          data-bs-target="#edit_specialities_details"
          onClick={() => handleModalOpen(record)}
        >
          <i className="fe fe-pencil"></i> Edit
        </a>
        <a
          href="#"
          className="me-1 btn btn-sm bg-danger-light"
          // data-bs-toggle="modal"
          data-bs-target="#delete_modal"
          onClick={() => handleDelete(record.id)}
        >
          <i className="fe fe-trash"></i> Delete
        </a>
      </div>
      ),
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
                <h3 className="page-title">Dental History</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Dental History</li>
                </ul>
              </div>
              <div className="col-auto">
                <Button type="primary" onClick={() => handleModalOpen()}>
                  Add New
                </Button>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Input placeholder="Search" value={searchTerm} onChange={handleSearch} />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <Table
                    pagination={{
                      total: filteredData.length,
                      pageSize,
                      current: currentPage,
                      onChange: handlePaginationChange,
                      itemRender,
                    }}
                    loading={loading}
                    columns={columns}
                    dataSource={filteredData || []}
                    rowKey={(record) => record.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
  title={editData ? "Edit Dental History" : "Add New Dental History"}
  visible={isModalVisible}
  onCancel={handleModalClose}
  footer={null}
>
  <Form form={form} onFinish={handleFormSubmit}>
    <Form.Item name="tech_id" label="Tech ID">
      <Input />
    </Form.Item>
    <Form.Item name="patient_id" label="Patient ID">
      <Input />
    </Form.Item>
    <Form.Item name="appointment_id" label="Appointment ID">
      <Input />
    </Form.Item>
    <Form.Item name="cdc_id" label="CDC ID">
      <Input />
    </Form.Item>
    <Form.Item name="description" label="Description">
      <Input />
    </Form.Item>
    <Form.Item name="remark" label="Remark">
      <Input />
    </Form.Item>
    <Button type="button" className="btn btn-primary mx-4" htmlType="submit">
      {editData ? "Update" : "Create"}
    </Button>
  </Form>
</Modal>

    </>
  );
};

export default DentalHistory;
