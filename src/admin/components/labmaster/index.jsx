import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import "../styles/Loader.css";
import { useHistory } from "react-router-dom";

const labmaster = () => {
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



  //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0aW1lc3RhbXAiOjE3MzUzNzU0MjQ2MzAsImlhdCI6MTczNTM3NTQyNH0.jkA7TNIJzIPxyrmigzrLmVmPz1ZiTDpHf5eTyMvoqjA";
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      const response = await fetch(`${var_api}labmaster/getby-hospital/${hospital_id}`, {
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
        item.lab_name.toLowerCase().includes(value) ||
        item.contact_person.toLowerCase().includes(value) ||
        item.contact_no.toLowerCase().includes(value) ||
        item.address.toLowerCase().includes(value) ||
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
      const token = localStorage.getItem('token');
  
      // Ensure that hospital_id is available
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }
  setLoading(true);
  
      // Include the hospital_id dynamically in the form data
      const formData = { ...values, hospital_id, description: values.description || "-",is_active: values.is_active || 1 };
  
      // Determine the URL and HTTP method based on whether it's an update or create operation
      const url = editData
        ? `${var_api}labmaster/update/${editData.id}`
        : `${var_api}labmaster/post`;
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

      if (response.status === 500) {
        const errorData = await response.json(); // Parse error response
        throw new Error(errorData.message || "Server error occurred");
      }

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
          description: error.message || "An unexpected error occurred.",
        });
      }
  };

  const handleDeleteConfirm = (id,lab_name) => {
    setDeleteId(id);
    setDeletename(lab_name)                // Set the ID of the rollmaster to delete
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
        `${var_api}labmaster/delete/${deleteId}`,
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

  const handleSwitchChange = (e, recordId) => {
    const isChecked = e.target.checked; // true if checked, false if unchecked
  
    const newStatus = isChecked ? 1 : 0; // If checked, pass 1, else pass 0
  console.log(recordId);
    // Optionally, update the backend or local state
    updateSlotStatus(recordId, newStatus);
  };

    const updateSlotStatus = (recordId, newStatus) => {
      // You can make an API call to update the status or update the local state here
      console.log(`recordId: ${recordId}, New Status: ${newStatus}`);
      const token = localStorage.getItem('token');
     
      // Example of making an API call (you would replace this with your actual API call):
      fetch(`${var_api}labmaster/update/${recordId.id}`, {
        method: 'PUT',
        //body: JSON.stringify({ recordId, newStatus }),
       // body: JSON.stringify(recordId, newStatus),
     
        body : JSON.stringify({
        ...recordId, is_active :newStatus  // Spread the properties of recordId into the new object
    }),
  
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));
    };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Lab Name",
      dataIndex: "lab_name",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      render: (text) => (text ? text : "-"),
    },
    {
        title: "Contact No",
        dataIndex: "contact_no",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Address ",
        dataIndex: "address",
        render: (text) => (text ? text : "-"),
      },
    {
        title: "Description",
        dataIndex: "description",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Active",
        dataIndex: "is_active",
        render: (text, record) => {
          return (
            <div className="status-toggle">
              <input
                id={`rating${record?.id}`}
                className="check"
                type="checkbox"
                defaultChecked={record.is_active === 1}
                onChange={(e) => handleSwitchChange(e, record)}
              />
              <label
                htmlFor={`rating${record?.id}`}
                className="checktoggle checkbox-bg"
              >
                checkbox
              </label>
            </div>
          );
        },
        sorter: (a, b) => a.Status.length - b.Status.length,
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
          onClick={() => handleDeleteConfirm(record.id, record.lab_name)}
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
                <h3 className="page-title">Lab Master Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Lab Master  Tables</li>
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
                  <h4 className="card-title">Lab Master </h4>
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
        title={editData ? "Edit Labmaster" : "Add New Labmaster"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item
            label="Lab Name"
            name="lab_name"
            rules={[{ required: true, message: "Please input the lab name!" }]}
          >
                                 <input
  className="form-control"
  type="text"
  style={{ width: "400px" }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
            label="Contact Person"
            name="contact_person"
            rules={[{ required: false, message: "Please input the contact person!" }]}
          >
                                <input
  className="form-control"
  type="text"
  style={{ width: "380px" }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
  label="Contact No"
  name="contact_no"
  rules={[
    { 
      required: false, 
      message: "Please input the contact no!" 
    },
    {
      pattern: /^[0-9]*$/,  // Ensures only numbers are allowed
      message: "Please enter a valid contact number!"
    }
  ]}
>
  <input
    className="form-control"
    type="tel"  // "tel" is a good choice for phone numbers
    style={{ width: "400px" }}
    pattern="[0-9]*"  // Restricts to numeric input for mobile
    onKeyPress={(e) => {
      // Only allow numeric keys
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault(); // Prevent input if not a number
      }
    }}
  />
</Form.Item>


                   <Form.Item
            label="Address"
            name="address"
            rules={[{ required: false, message: "Please input the address!" }]}
          >
                                  <input
  className="form-control"
  type="text"
  style={{ width: "420px" }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: false, message: "Please input the description!" }]}
          >
                               <input
  className="form-control"
  type="text"
  style={{ width: "400px" }} // Adjust the width as needed
/>
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
  <p>Are you sure you want to delete this Lab Master  "<span style={{fontWeight:"bold"}}>{deletename}</span>"?</p>
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

export default labmaster;
