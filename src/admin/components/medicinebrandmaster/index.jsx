import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import "../styles/Loader.css";
import { useHistory } from "react-router-dom";
import { image_api, var_api } from "../../../constant";

const MedicineBrandMaster = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [imageName, setImageName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [seatImage, setseatImage] = useState('');
  const [deleteName , setDeletename] = useState(null);
  const history = useHistory(); 
    const [isModalInsta, setIsModalInsta] = useState(false);
      const [isModalpop, setIsModalpop] = useState(false);
      const [installDetails, setInstallDetails] = useState(null);
      const datatech = {
        techstaff: false,
        availabletime: false,
        patient: false,
        servicetype: false,
        uom: false,
        category: false,
        brand: false,
        medicine: false,
        paymodemaster: false,
        makeappointment: false,
        endsession: false,
        payment: false,
      };

  // const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";
    // Replace with your actual API token

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const hospital_id = localStorage.getItem("hospital_id")
    try {
      const response = await fetch(`${var_api}medicinebrandmaster/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
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
    fetchinstalldata();
    fetchData();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(
      (item) =>
        item.brand_name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Open modal for add/edit
  const handleModalOpen = (record = null) => {
    setEditData(record);  // Set record data for editing (if any)
    form.resetFields();    // Reset the form fields
    if (record) {
      form.setFieldsValue(record); // Set initial values for the edit form
    }
    setIsModalVisible(true); // Show the modal
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null); // Clear the edit data
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name); // Set the file name
    }
  };

  const handleFileChangeSeat = (e) => {
    setseatImage(e.target.files[0]);
    console.log("seat", seatImage);
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      // Retrieve the hospital_id and token from localStorage
      const hospital_id = localStorage.getItem("hospital_id");
      const token = localStorage.getItem("token");
  
      // Ensure that hospital_id is available
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }
  
      // Create a FormData object
      const formData = new FormData();
  
      // Append the hospital_id
      formData.append("hospital_id", hospital_id);
      formData.append('brand_image', seatImage ? seatImage : values.brand_image);
      formData.append('brand_name', values.brand_name);
      formData.append('description', values.description || "-");
  
      // Determine the URL and HTTP method
      const url = editData
        ? `${var_api}medicinebrandmaster/update/${editData.id}`
        : `${var_api}medicinebrandmaster/post`;
      const method = editData ? "PUT" : "POST";
  
      // Send the request
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: token, // Include token in the headers
        },
        body: formData, // Use FormData as the body
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

      if (!editData && (response.status === 200 || response.status === 201)) {
        console.log("Calling updateTechstaffStatus");
        updateTechstaffStatus();
      }
  
      // Fetch the updated data (if needed)
      fetchData();
  
      // Close the modal after successful operation
      handleModalClose();
      handleReset();
    } catch (error) {
      console.error("Error saving data:", error);
  
      // Show an error notification if something goes wrong
      notification.error({
        message: "Operation Failed",
        description: error.message || "There was an error while saving the data.",
      });
    }
  };

       const fetchinstalldata = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            const hospital_id = localStorage.getItem('hospital_id');
          
            try {
              const response = await fetch(`${var_api}installation/get-by-hospital/${hospital_id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              });
          
              if (response.status === 401) {
                history.push("/admin/login");
                notification.warning({
                  message: "Unauthorized",
                  description: "Your session has expired. Please log in again.",
                });
                return;
              }
          
              if (!response.ok) throw new Error("Failed to fetch data");
          
              const result = await response.json();
              const firstItem = result[0];
              if (firstItem) {
                setInstallDetails(firstItem); // Save the full object
              }
              console.log("availabletime value:", firstItem?.brand);
          
          
              // ✅ Save installation_id in localStorage if it exists
              if (result?.id) {
                localStorage.setItem("installation_id", result.id);
                console.log("Saved installation_id:", result.id); // ✅ confirm this
              }
            
          
              setData(result || []);
              if (firstItem?.brand === 0) {
                console.log("Modal should show: availabletime is 0");
                setIsModalInsta(true);
              } else {
                console.log("Modal not triggered: availabletime is not 0");
                setIsModalInsta(false);
              }
              
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


    const updateTechstaffStatus = async () => {
        
            const token = localStorage.getItem("token");
            const hospital_id = localStorage.getItem("hospital_id");
        
          
            try {
              const response = await fetch(`${var_api}installation/update-hospital/${hospital_id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: token,
                },
                body: JSON.stringify({
                  techstaff:  installDetails?.techstaff ?? false,
                  availabletime:installDetails?.availabletime ?? false ,
                  patient: installDetails?.patient ?? false,
                  servicetype: installDetails?.servicetype ?? false,
                  uom: installDetails?.uom ?? false,
                  category: installDetails?.category ?? false,
                  brand: 1,
                  medicine: installDetails?.medicine ?? false,
                  paymodemaster: installDetails?.paymodemaster ?? false,
                  makeappointment: installDetails?.makeappointment ?? false,
                  endsession: installDetails?.endsession ?? false,
                  payment: installDetails?.payment ?? false,
                  hospital_id: parseInt(hospital_id),
                }),
              });
          
              // Log status code and response
              console.log("Response Status:", response.status);
              const responseText = await response.text();
              console.log("Response Text:", responseText);
          
              if (response.ok) {
                console.log("Installation techstaff updated successfully.");
                     if (installDetails?.brand !== 1) {
        setIsModalpop(true);
      }
                fetchinstalldata(); // Open modal only on success
              } else {
                console.error("Failed to update installation:", responseText);
              }
             
            } catch (err) {
              console.error("Error updating techstaff:", err);
            }
          };
  
  
  
  
  const handleReset = () => {
    // Reset form fields to their initial values
    form.resetFields();
    setImageName("");
    setseatImage("");
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = (id,name) => {
    setDeleteId(id);  // Set the ID of the record to delete
    setDeletename(name);
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);  // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  // Handle record deletion
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${var_api}medicinebrandmaster/delete/${deleteId}`,
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

  // Define table columns
  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Brand Name",
      dataIndex: "brand_name",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.brand_name?.localeCompare(b.brand_name),
    },
    {
      title: "Brand Image",
      dataIndex: "brand_image",
      render: (text) =>
        text ? (
          <img
            src={`${image_api}${text}`}
            alt="Brand"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (text ? text : "-"),
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
        onClick={() => handleDeleteConfirm(record.id, record.brand_name)}
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
                <h3 className="page-title">Medicine Brandmaster Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Medicine Brandmaster Tables</li>
                </ul>
              </div>
              <div className="col-auto">
                {/* <Button type="primary" onClick={() => handleModalOpen()}>
                  Add New
                </Button> */}
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
                  <h4 className="card-title">Medicine Brandmaster</h4>
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
        title={editData ? "Edit Medicine Brandmaster" : "Add New Medicine Brandmaster"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item
            label="Brand Name"
            name="brand_name"
            rules={[{ required: true, message: "Please input the brand name!" }]}
          >
                                 <input
  className="form-control"
  type="text"
  style={{ width: '380px' }} // Adjust the width as needed
/>
          </Form.Item>
          <Form.Item
                name="brand_image"
                label="Brand Image"
                rules={[{ required: false, message: "Please upload a category image!" }]}
              >
                <div>
                <input
      type="file"
      className="form-control"
      accept="image/*"
      onChange={handleFileChangeSeat} // Ensure this function handles file selection
    />
                  {/* {seatImage ? (
                    <p>Selected File: {seatImage.name}</p>
                  ) : editData?.brand_image ? (
                    <p>Current File: {editData.brand_image}</p>
                  ) : (
                    <p>No file selected</p>
                  )} */}
                </div></Form.Item>
          <Form.Item
            label="Description"
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
        type="submit"
        className="btn btn-primary mx-1"
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
  <p>Are you sure you want to delete this <span style={{fontWeight:"bold"}}>"{deleteName}"</span> medicine brand?</p>
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
  <Modal
                  title="Installation Info"
                  visible={isModalInsta}
                  onCancel={() => setIsModalInsta(false)}
                  footer={[
                   <Button
                   key="close"
                   type="primary"
                   onClick={() => {
                     setIsModalInsta(false);
                     setIsModalVisible(true); // Show the second modal
                   }}
                 >
                   Okay
                 </Button>
                  ]}
                >
                  {/* Your modal content goes here */}
                  <div style={{ fontSize: '16px', fontWeight: '500', lineHeight: '1.6' }}>
  <div><strong>Step 1:</strong> Click the <strong>Add New</strong> button to initiate the process.</div>
  <div><strong>Step 2:</strong> Complete the form after clicking the <strong>Okay</strong> button to proceed.</div>
  <div><strong>Step 3:</strong> Click the <strong>Submit</strong> button to finalize the process.</div>
</div>
                </Modal>
                 <Modal
                  title="Installation Info"
                  visible={isModalpop}
                  onCancel={() => setIsModalpop(false)}
                  footer={[
                    <Button
                    key="close"
                    type="primary"
                    onClick={() => {
                      setIsModalpop(false);
                      history.push('/admin/medicinesubCategory'); // Call the switch case function here
                    }}
                  >
                    Continue
                  </Button>
                  ]}
                >
                  {/* Your modal content goes here */}
                  <h3 style={{ color: 'green', fontWeight: '600' }}>Submission Successful</h3>
<div style={{ fontSize: '16px', lineHeight: '1.6' }}>
  <p>Click the <strong>Continue</strong> button to move to the next step.</p>
</div>
                </Modal>

    </>
  );
};

export default MedicineBrandMaster;
