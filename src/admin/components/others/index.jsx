import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table,Select ,Button, Modal,Radio , Form, Input, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
import "../styles/Loader.css";

const others = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletename , setDeletename] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const history = useHistory(); 
const { Option } = Select;



  //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0aW1lc3RhbXAiOjE3MzUzNzU0MjQ2MzAsImlhdCI6MTczNTM3NTQyNH0.jkA7TNIJzIPxyrmigzrLmVmPz1ZiTDpHf5eTyMvoqjA";
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}others/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/admin/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []); // Set initial filtered data
      setLoading(false);
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
  
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(value)
      )
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
      const token = localStorage.getItem('token');
  
      // Ensure that hospital_id is available
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }
  setLoading(true);
  
      // Include the hospital_id dynamically in the form data
      const formData = {
        ...values,
        hospital_id,
        description: values.description || "-",
        type: values.type !== undefined && values.type !== '' ? parseInt(values.type) : 0, // Default to 0 if empty
      };
      
  
      // Determine the URL and HTTP method based on whether it's an update or create operation
      const url = editData
        ? `${var_api}others/update/${editData.id}`
        : `${var_api}others/post`;
      const method = editData ? "PUT" : "POST";
  
      // Send the request
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Make sure `token` is set correctly
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 401) {
        history.push("/admin/login"); // Redirect to login page
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
      return;
      }
      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Error saving data");
      }
    setLoading(false);
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

  const handleDeleteConfirm = (id,name) => {
    setDeleteId(id);
    setDeletename(name)                // Set the ID of the rollmaster to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  // Close Delete Confirmation Modal
  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  // Handle delete action
  const handleDelete = async () => {
  setLoading(false);
  const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${var_api}others/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
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
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const handleReset = () => {
    // Reset form fields to their initial values
    form.resetFields();
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "mobile",
      dataIndex: "mobile",
      render: (text) => (text ? text : "-"),
    },
    {
        title: "whatsapp",
        dataIndex: "whatsapp",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Gender",
        dataIndex: "gender",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Address",
        dataIndex: "address",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "City",
        dataIndex: "city",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Role",
        dataIndex: "role",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Type",
        dataIndex: "type",
        render: (text) => {
          if (text === 0) return "Individual";
          if (text === 1) return "Organization";
          return "-"; // Default if type is null or undefined
        },
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
          onClick={() => handleDeleteConfirm(record.id, record.name)}
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
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">others Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">others Tables</li>
                </ul>
              </div>
              <div className="col-auto">
              <button
        type="button"
        className="btn btn-primary mx-1"
        onClick={() => handleModalOpen()}
      >
        Add New
      </button>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
             
                          <input
  className="form-control"
  type="text"
  placeholder="Search"
  value={searchTerm}
  onChange={handleSearch}
  style={{ width: "300px" }} // Adjust the width as needed
/>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">others</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                        pagination={{
                                                                                     total: filteredData.length,
                                                                                     pageSize: pageSize, // Limit to 2 rows per page
                                                                                     current: currentPage,
                                                                                     showSizeChanger: false,
                                                                                     onShowSizeChange: (current, size) => handlePaginationChange(current, size),
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

      {/* Modal for Add / Edit */}
      <Modal
        title={editData ? "Edit others" : "Add New others"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the Name!" }]}
          >
                                 <input
  className="form-control"
  type="text"
  style={{ width: '380px' }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
  label="Mobile"
  name="mobile"
  rules={[{ required: false, message: "Please input the mobile!" }]}
>
  <input
    className="form-control"
    type="text"
    style={{ width: "400px" }}
    onKeyPress={(e) => {
      // Only allow numeric keys
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault(); // Prevent input if not a number
      }
    }}
  />
</Form.Item>

<Form.Item
  label="WhatsApp"
  name="whatsapp"
  rules={[{ required: false, message: "Please input the mobile!" }]}
>
  <input
    className="form-control"
    type="text"
    style={{ width: "400px" }}
    onKeyPress={(e) => {
      // Only allow numeric keys
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault(); // Prevent input if not a number
      }
    }}
  />
</Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: false, message: "Please input the mobile!" }]}
          >
                                <input
  className="form-control"
  type="text"
  style={{ width: '400px' }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
  label="Gender"
  name="gender"
  rules={[{ required: true, message: "Please select gender!" }]}
>
  <Radio.Group>
    <Radio value="Male">Male</Radio>
    <Radio value="Female">Female</Radio>
    <Radio value="Other">Other</Radio>
  </Radio.Group>
</Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: false, message: "Please input the mobile!" }]}
          >
                                <input
  className="form-control"
  type="text"
  style={{ width: '400px' }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: false, message: "Please input the mobile!" }]}
          >
                                <input
  className="form-control"
  type="text"
  style={{ width: '400px' }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
            label="Remarks"
            name="remarks"
            rules={[{ required: false, message: "Please input the mobile!" }]}
          >
                                <input
  className="form-control"
  type="text"
  style={{ width: '400px' }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: false, message: "Please input the mobile!" }]}
          >
                                <input
  className="form-control"
  type="text"
  style={{ width: '400px' }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
  label="Type"
  name="type"
  rules={[{ required: true, message: "Please select the type!" }]}
>
  <Select placeholder="Select Type" style={{ width: 400 }}>
    <Option value={0}>Individual</Option>
    <Option value={1}>Organization</Option>
  </Select>
</Form.Item>
          <Form.Item>
                
                <div className="d-flex justify-content-center">
                                      <button
                                  className="btn btn-primary mx-1"
                                  type="submit"
                                >
                                  {editData ? "Update" : "Submit"}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={editData ? handleModalClose : handleReset}
                                >
                                   {editData ? "Cancel" : "Reset"}
                                </button>
                                </div>
                                             </Form.Item>
  
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
  title="Delete Confirmation"
  visible={isDeleteConfirmVisible}
  onCancel={handleDeleteCancel} // Keep the onCancel function to close the modal when the Cancel button is clicked
  footer={null} // Remove the default OK and Cancel buttons
>
  <p>Are you sure you want to delete this others "<span style={{fontWeight:"bold"}}>{deletename}</span>"?</p>
  <Form.Item>
    <div className="d-flex justify-content-center">
      <button
        type="button"
        className="btn btn-primary mx-1"
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={handleDeleteCancel}
      >
        Cancel
      </button>
    </div>
  </Form.Item>
</Modal>
    </>
  );
};

export default others;
