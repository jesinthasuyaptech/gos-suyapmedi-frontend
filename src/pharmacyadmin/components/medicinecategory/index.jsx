import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, Upload, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons"; // For the upload icon
import { image_api, var_api } from "../../../constant";
import { useHistory } from "react-router-dom";
//import "../styles/Loader.css";

const Medicinecategory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState('');
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [form] = Form.useForm();
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [seatImage, setseatImage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const history = useHistory(); 
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";//your_token_here"; // Update with actual token


  const fetchData = async () => {
    const token = localStorage.getItem('pres_token');
    const hospital_id = localStorage.getItem('pres_hospital_id');
    setLoading(true);
    try {
      const response = await fetch(`${var_api}medicinecategory/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.status === 401) {
        history.push("/pharmacyadmin/pharmacyLogin"); // Redirect to login page
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
        item.category_name.toLowerCase().includes(value) ||
        item.cat_description.toLowerCase().includes(value)
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

  const handleFileChangeSeat = (e) => {
    setseatImage(e.target.files[0]);
    console.log("seat", seatImage);
  };
  
  
  
  const handleFormSubmit = async (values) => {
    setLoading(true); // Set loading state to true
    try {
      const hospital_id = localStorage.getItem("pres_hospital_id");
      const token = localStorage.getItem("pres_token");
  
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }
  
      const formData = new FormData();
      formData.append("category_name", values.category_name);
      formData.append("cat_description", values.cat_description || "-");
      formData.append("hospital_id", hospital_id);
      formData.append('cat_image', seatImage ? seatImage : values.cat_image);
  
      // Set URL and method based on edit state
      const url = editData 
        ? `${var_api}medicinecategory/update/${editData.id}` 
        : `${var_api}medicinecategory/post`;
  
      const method = editData ? "PUT" : "POST";
  
      // Perform fetch request
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: token,
        },
        body: formData,
      });
  
      if (response.status === 401) {
        // Redirect to login if unauthorized
        history.push("/pharmacyadmin/pharmacyLogin"); 
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
  
      if (response.status === 400) {
        const errorData = await response.json(); // Parse the error response
        if (errorData.error === "Category name already exists for this hospital") {
          notification.error({
            message: "Duplicate Entry",
            description: "Category name already exists for this hospital.",
          });
          setLoading(false);
          return; // Exit early if a duplicate is found
        }
      }
  
      // Check if the response is not OK, for other errors
      if (!response.ok) {
        throw new Error("Failed to save data");
      }
  
      // Success notification
      notification.success({
        message: editData ? "Update Successful" : "Creation Successful",
        description: editData 
          ? "The record has been successfully updated." 
          : "A new record has been successfully created.",
      });
  
      fetchData(); // Reload data
      handleModalClose(); // Close modal
  
    } catch (error) {
      // Check if the error is an instance of Error and has a message
      const errorMessage = error instanceof Error ? error.message : "There was an error while saving the data.";
      
      console.error("Error submitting form:", errorMessage); // Log the error message
  
      setLoading(false); // Set loading state to false
  
      // Show the error notification
      notification.error({
        message: "Operation Failed",
        description: errorMessage,
      });
    }
  };
  
  
  
  

  const handleReset = () => {
    // Reset form fields to their initial values
    form.resetFields();
    setseatImage("");
    setFile2("");
    setFile1("");
    setFile3("");
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);                // Set the ID of the specialization to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('pres_token');
    try {
      const response = await fetch(
        `${var_api}medicinecategory/delete/${deleteId}`,
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

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };


  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.category_name?.localeCompare(b.category_name),
    },
    {
      title: "Image",
      dataIndex: "cat_image",
      render: (text) => (text ? <img src={`${image_api}${text}`} alt="cat_image" width="50" /> : "-"),
    },
    {
      title: "Description",
      dataIndex: "cat_description",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Action",
      render: (_, text) => (
          <div className="text-start">
      <a
        href="#"
        className="me-1 btn btn-sm bg-success-light"
        // data-bs-toggle="modal"
        data-bs-target="#edit_specialities_details"
        onClick={() => handleModalOpen(text)}
      >
        <i className="fe fe-pencil"></i> Edit
      </a>
      <a
        href="#"
        className="me-1 btn btn-sm bg-danger-light"
        // data-bs-toggle="modal"
        data-bs-target="#delete_modal"
        onClick={() => handleDeleteConfirm(text.id, text.category_name)}
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
                <h3 className="page-title">Medicine Category Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/pharmacyadmin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Medicine Category</li>
                </ul>
              </div>
              <div className="col-auto">
                <button type="button" className="btn btn-primary mx-1"  onClick={() => handleModalOpen()}>
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
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={filteredData}
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
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Modal */}
          <Modal
            visible={isModalVisible}
            title={editData ? "Edit Medicine Category" : "Add Medicine Category"}
            onCancel={handleModalClose}
            footer={null}
            destroyOnClose
          >
            <Form form={form} onFinish={handleFormSubmit} layout="vertical">
              <Form.Item
                name="category_name"
                label="Category Name"
                rules={[{ required: true, message: "Please enter Category Name" }]}
              >
                                   <input
  className="form-control"
  type="text"
  style={{ width: '480px' }} // Adjust the width as needed
/>
              </Form.Item>
              <Form.Item
                name="cat_description"
                label="Category Description"
                rules={[{ required: false, message: "Please enter Category Description" }]}
              >
                                    <input
  className="form-control"
  type="text"
  style={{ width: '480px' }} // Adjust the width as needed
/>
              </Form.Item>
              {/* <Form.Item
                name="cat_image"
                label="Category Image"
                rules={[{ required: false, message: "Please enter Category Description" }]}
              >
                <Input type="file" placeholder="Select File"  onChange={handleFileChangeSeat} id="seatImageInput" />
              </Form.Item> */}
              <Form.Item
                name="cat_image"
                label="Category Image"
                rules={[{ required: false, message: "Please upload a category image!" }]}
              >
                <div>
                <input
      type="file"
      className="form-control"
      accept="image/*"
      onChange={handleFileChangeSeat} // Ensure this function processes the file correctly
    />
                  {/* {seatImage ? (
                    <p>Selected File: {seatImage.name}</p>
                  ) : editData?.cat_image ? (
                    <p>Current File: {editData.cat_image}</p>
                  ) : (
                    <p>No file selected</p>
                  )} */}
                </div></Form.Item>

              <Form.Item>
              <div className="d-flex justify-content-center">
                  <button type="submit"className="btn btn-primary mx-1" >
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

          <Modal
            title="Delete Confirmation"
            visible={isDeleteConfirmVisible}
            onCancel={handleDeleteCancel} 
            footer={null} 
          >
          <p>Are you sure you want to delete this <span style={{fontWeight:"bold"}}>"{deleteName}"</span> Category?</p>
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
        </div>
      </div>
    </>
  );
};

export default Medicinecategory;
