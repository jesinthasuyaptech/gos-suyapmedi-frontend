import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";

const diogonosismaster = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0"


  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${var_api}diogonosismaster/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      
      // Process the result to handle any complex data types like Date or RegExp
      const sanitizedResult = result.map((item) => ({
        ...item,
        dob: item.dob ? new Date(item.dob).toLocaleDateString() : "", 
        joining_date: item.joining_date
          ? new Date(item.joining_date).toLocaleDateString()
          : "",
        leaving_date: item.leaving_date
          ? new Date(item.leaving_date).toLocaleDateString()
          : "",
      }));

      setData(sanitizedResult);
      setFilteredData(sanitizedResult); // Initialize filteredData with the same values as data
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
        ? `${var_api}diogonosismaster/update/${editData.id}`
        : `${var_api}diogonosismaster/post`;
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
  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${var_api}diogonosismaster/delete/${deleteId}`,
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

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(lowercasedValue) ||
      item.description.toLowerCase().includes(lowercasedValue)
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
                <h3 className="page-title">Diagnosis Master Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Diagnosis Tables</li>
                </ul>
              </div>
              <div className="col-auto">
                <Button type="primary" onClick={() => handleModalOpen()}>
                  Add New
                </Button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <Input.Search
              placeholder="Search by Name or Description"
              onSearch={handleSearch}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Diagnosis Master</h4>
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
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
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
              <p>Are you sure you want to delete this Diogonosismaster?</p>
            </Modal>
    </>
  );
};

export default diogonosismaster;
