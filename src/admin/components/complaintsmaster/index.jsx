import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";

const complaintsmaster = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [form] = Form.useForm();

  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${var_api}complaints/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []); // Set initial filtered data
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

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(
      (item) =>
        item.complaint_name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleModalOpen = (record = null) => {
    setEditData(record); // Set record data for editing (if any)
    form.resetFields();   // Reset the form fields
    if (record) {
      form.setFieldsValue(record); // Set initial values for the edit form
    }
    setIsModalVisible(true);  // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setEditData(null);         // Clear the edit data
  };

  const handleFormSubmit = async (values) => {
    try {
      // Retrieve the hospital_id from localStorage
      const hospital_id = localStorage.getItem("hospital_id");
  
      // Ensure that hospital_id is available
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }
  
      // Include the hospital_id dynamically in the form data
      const formData = { ...values, hospital_id };
  
      // Determine the URL and HTTP method based on whether it's an update or create operation
      const url = editData
        ? `${var_api}complaints/update/${editData.id}`
        : `${var_api}complaints/post`;
      const method = editData ? "PUT" : "POST";
  
      // Send the request
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Make sure `token` is set correctly
        },
        body: JSON.stringify(formData),
      });
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Error saving data");
      }
  
      // Show a success notification
      notification.success({
        message: editData ? "Update Successful" : "Creation Successful",
        description: editData
          ? "The record has been successfully updated."
          : "A new record has been successfully created.",
      });
  
      // Fetch the updated data (if needed)
      fetchData();
  
      // Close the modal after successful operation
      handleModalClose();
    } catch (error) {
      console.error("Error saving data:", error);
  
      // Show an error notification if something goes wrong
      notification.error({
        message: "Operation Failed",
        description: "There was an error while saving the data.",
      });
    }
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);                // Set the ID of the specialization to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${var_api}complaints/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error deleting record");

      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });

      fetchData();
      handleDeleteCancel(); // Close the delete confirmation modal
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    }
  };

  const columns = [
    {
      title: "Hospital Id",
      dataIndex: "hospital_id",
      render: (text) => (text ? text : "N/A"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Complaint Name",
      dataIndex: "complaint_name",
      render: (text) => (text ? text : "N/A"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="text-end">
          <Button
            className="me-1"
            type="primary"
            onClick={() => handleModalOpen(record)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            onClick={() => handleDeleteConfirm(record.id)}
          >
            Delete
          </Button>
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
                <h3 className="page-title">complaints Master Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">complaints Master Tables</li>
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
              <Input
                placeholder="Search by complaint_name or Description"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Complaints Master</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      pagination={{
                        total: filteredData.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
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

      {/* Modal for Add / Edit */}
      <Modal
        title={editData ? "Edit complaintsmaster" : "Add New complaintsmaster"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item
            label="Hospital Id"
            name="hospital_id"
            rules={[{ required: true, message: "Please input the HospitalId!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Complaint Name"
            name="complaint_name"
            rules={[{ required: true, message: "Please input the HospitalId!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editData ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Confirmation"
        visible={isDeleteConfirmVisible}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this complaintsmaster?</p>
      </Modal>
    </>
  );
};

export default complaintsmaster;
