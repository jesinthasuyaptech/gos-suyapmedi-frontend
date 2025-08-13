import React, { useState, useEffect } from "react";
import SidebarNav from "../ultrasidebar";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api ,image_api} from "../../../constant";
import { useHistory } from "react-router-dom";


const Specialization = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletename, setDeletename] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [seatImage, setseatImage] = useState('');
  const [imageName, setImageName] = useState(""); // Image filename
  const history = useHistory(); 

  // const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0"

  
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('ultratoken');
    const hospital_id = localStorage.getItem('hospital_id');
    try {
      // const response = await fetch(`${var_api}specialization/getby-hospital/${hospital_id}`, {
        const response = await fetch(`${var_api}specialization/get-ultra`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      // if (response.status === 401) {
      //   history.push("/admin/superultraadmin"); // Redirect to login page
      //   notification.warning({
      //     message: "Unauthorized",
      //     description: "Your session has expired. Please log in again.",
      //   });
      // return;
      // }
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


  useEffect(() => {
    if (editData?.image) {
      setImageName(editData.image); // Set existing image name from API
    }
  }, [editData]);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleModalOpen = (record = null) => {
    setEditData(record);
    setseatImage(null);     // Clear previously selected image
    setImageName("");       // Clear image name
  
    form.resetFields();
  
    if (record) {
      form.setFieldsValue(record);
      setImageName(record.image || "");  // Show existing image name
    }
  
    setIsModalVisible(true);
  };
  

  
  // const handleFileChangeSeat = (e) => {
  //   setseatImage(e.target.files[0]);
  //   console.log("seat", seatImage);
  // };

  const handleFileChangeSeat = (e) => {
    const file = e.target.files[0];
    if (file) {
      setseatImage(file);
      setImageName(file.name); // Store new image name
    }
  };
  

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null);
    setseatImage(null);
    setImageName("");
  };
  
  const handleFormSubmit = async (values) => {
    try {
      const hospital_id = localStorage.getItem("hospital_id");
      const token = localStorage.getItem("ultratoken");
  
      setLoading(true);
  
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "-");
  
      if (editData) {
        // Update: If a new image is selected, use it; otherwise use the old one
        if (seatImage) {
          formData.append("image", seatImage, seatImage.name);
        } else if (editData.image) {
          formData.append("image", editData.image); // Reuse existing filename
        } else {
          formData.append("image", "-"); // fallback if nothing exists
        }
      } else {
        // For create
        if (seatImage) {
          formData.append("image", seatImage, seatImage.name);
        } else {
          formData.append("image", "-"); // fallback
        }
      }
  
      const url = editData
        ? `${var_api}specialization/update/${editData.id}`
        : `${var_api}specialization/post`;
  
      const method = editData ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        if (response.status === 409) {
          notification.error({
            message: "Validation Error",
            description: "This name already exists.",
          });
          return;
        }
        throw new Error("Error saving data.");
      }
  
      setLoading(false);
      notification.success({
        message: editData ? "Update Successful" : "Creation Successful",
        description: editData
          ? "The record has been successfully updated."
          : "A new record has been successfully created.",
      });
  
      fetchData();
      handleModalClose();
    } catch (error) {
      console.error("Error saving data:", error);
      notification.error({
        message: "Operation Failed",
        description: "There was an error while saving the data.",
      });
    }
  };
  
  

  

  


  const handleReset = () => {
    form.resetFields();         // Reset text fields
    setseatImage(null);         // Clear image state
    setImageName("");           // Clear filename display if shown
  };
  
  const handleDeleteConfirm = (id,name) => {
    setDeleteId(id); 
    setDeletename(name);               // Set the ID of the specialization to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('ultratoken');
    setLoading(true);
    try {
      const response = await fetch(
        `${var_api}specialization/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error deleting record");
      setLoading(false);
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
      title: "S No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (text ? text : "N/A"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (text) => (text ? <img src={`${image_api}${text}`} alt="image" width="50" /> : "-"),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Action",
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
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Specialization Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Specialization Tables</li>
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
                  <h4 className="card-title">Specialization</h4>
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
        title={editData ? "Edit Specialization" : "Add New Specialization"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
       <Form form={form} onFinish={handleFormSubmit} requiredMark={false}
>
  <Form.Item
    label={
      <span>
        Name <span style={{ color: 'red' }}>*</span>
      </span>
    }
    name="name"
    rules={[{ required: true, message: "Please input the name!" }]}
  >
                                     <input
  className="form-control"
  type="text"
  style={{ width: '400px' }} // Adjust the width as needed
/>
  </Form.Item>
          <Form.Item
                name="image"
                label="Image"
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
  <Form.Item
    label={
      <span>
        Description       </span>
    }
    name="description"
    rules={[{ required: false, message: "Please input the description!" }]}
  >
                                      <input
  className="form-control"
  type="text"
  style={{ width: '400px' }} // Adjust the width as needed
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
  <p>Are you sure you want to delete this Specialization "<span style={{fontWeight:"bold"}}>{deletename}</span>"?</p>
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

export default Specialization;
