import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";

const problemmaster = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState(""); // To store search term

  // Use environment variable for API token
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0"
  

  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${var_api}problemmaster/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []); // Initialize filteredData with all data
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter the data based on the search term
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      // If search term is empty, show all data
      setFilteredData(data);
    } else {
      // Filter data by `problem_name` or `description`
      const filtered = data.filter(
        (item) =>
          item.problem_name.toLowerCase().includes(value.toLowerCase()) ||
          item.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // Handle Modal Open/Close
  const handleModalOpen = (record = null) => {
    setEditData(record);
    form.resetFields();
    if (record) {
      form.setFieldsValue(record);
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  // Handle Form Submit
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
        ? `${var_api}problemmaster/update/${editData.id}`
        : `${var_api}problemmaster/post`;
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
    setDeleteId(id);                // Set the ID of the rollmaster to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  // Close Delete Confirmation Modal
  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${var_api}problemmaster/delete/${deleteId}`,
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

  // Define columns for the table
  const columns = [
    {
      title: "Problem Name",
      dataIndex: "problem_name",
      sorter: (a, b) => a.problem_name.localeCompare(b.problem_name), // Fix sorting to use the correct field
    },
    {
      title: "Description",
      dataIndex: "description",
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
                <h3 className="page-title">Problem Master Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Problem Tables</li>
                </ul>
              </div>
              <div className="col-auto">
                <Button type="primary" onClick={() => handleModalOpen()}>
                  Add New
                </Button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Problem Master</h4>
                </div>
                <div className="card-body">
                  {/* Search Input */}
                  <div className="mb-3">
                    <Input
                      placeholder="Search by Problem Name or Description"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>

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
                      dataSource={filteredData}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editData ? "Edit Record" : "Add New Record"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={false}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="problem_name"
            label="Problem Name"
            rules={[{ required: true, message: "Problem Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editData ? "Update" : "Add"}
          </Button>
        </Form>
      </Modal>
            <Modal
              title="Delete Confirmation"
              visible={isDeleteConfirmVisible}
              onOk={handleDelete}
              onCancel={handleDeleteCancel}
              okText="Delete"
              cancelText="Cancel"
            >
              <p>Are you sure you want to delete this problemmaster?</p>
            </Modal>
    </>
  );
};

export default problemmaster;
