import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, notification, Select, Checkbox, Switch } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import "../styles/Loader.css";
import { useHistory } from "react-router-dom"; 

const servicetypemaster = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteservicename , setDeleteservicename] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [form] = Form.useForm();
   const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLabChecked, setIsLabChecked] = useState(false);
  const [isModalInsta, setIsModalInsta] = useState(false);
  const [isModalpop, setIsModalpop] = useState(false);
  const [installDetails, setInstallDetails] = useState(null);
  const [selectedType, setSelectedType] = useState("ALL");

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

 

  //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ0aW1lc3RhbXAiOjE3MzYxODMwMjc5MzIsImlhdCI6MTczNjE4MzAyN30.VwM3LCuBbZkJlzHQC0QOmaxiZEOfGh6Fa6kNMQsa2MY";

  const handleCheckboxChange = (e) => {
    setIsLabChecked(e.target.checked);
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); 
    const hospital_id = localStorage.getItem("hospital_id");

    try {
      const response = await fetch(`${var_api}gos-service-master/getby-hospital/${hospital_id}`, {
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
              servicetype: 1,
              uom: installDetails?.uom ?? false,
              category: installDetails?.category ?? false,
              brand: installDetails?.brand ?? false,
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
           if (installDetails?.servicetype !== 1) {
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

  useEffect(() => {
    fetchinstalldata();
    fetchData();
  }, []);

  

  // Handle search input change
const handleSearch = (e) => {
  const newSearchTerm = e.target.value.toLowerCase();
  setSearchTerm(newSearchTerm);
  applyFilters(newSearchTerm, selectedType);
};

const handleServiceTypeChange = (e) => {
  const newType = e.target.value;
  setSelectedType(newType);
  applyFilters(searchTerm, newType);
};


const applyFilters = (searchText, typeFilter) => {
  const value = searchText.toLowerCase();

  const serviceTypeMap = {
    0: "op",
    1: "scan",
    2: "investigation",
    3: "review",
  };

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.service_name?.toLowerCase().includes(value) ||
      item.description?.toLowerCase().includes(value) ||
      serviceTypeMap[item.service_type]?.toLowerCase().includes(value) ||
      item.price?.toString().toLowerCase().includes(value);

    const matchesType =
      typeFilter === "ALL" || String(item.service_type) === typeFilter;

    return matchesSearch && matchesType;
  });

  setFilteredData(filtered);
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
          console.log("availabletime value:", firstItem?.servicetype);
      
          // ✅ Save installation_id in localStorage if it exists
          if (result?.id) {
            localStorage.setItem("installation_id", result.id);
            console.log("Saved installation_id:", result.id); // ✅ confirm this
          }
        
      
          setData(result || []);
          if (firstItem?.servicetype === 0) {
            console.log("Modal should show: availabletime is 0");
            setIsModalInsta(true);
          } else {
            console.log("Modal not triggered: availabletime is not 0");
            setIsModalInsta(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          // notification.error({
          //   message: "Fetch Failed",
          //   description: "Unable to retrieve data. Please try again later.",
          // });
        } finally {
          setLoading(false);
        }
      };

  const handleModalOpen = (record = null) => {
    setEditData(record); // Set record data for editing (if any)
    form.resetFields();   // Reset the form fields
    if (record) {
      form.setFieldsValue(record); // Set initial values for the edit form
      setIsLabChecked(record.is_lab === 1);
    } else {
      setIsLabChecked(false);
    }
    setIsModalVisible(true);  // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setEditData(null);         // Clear the edit data
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      // Retrieve the hospital_id and token from localStorage
      const hospital_id = localStorage.getItem("hospital_id");
      const token = localStorage.getItem('token');
  
      // Ensure that hospital_id is available
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }
  
      // Include the hospital_id dynamically in the form data
      const formData = { ...values, 
        hospital_id: parseInt(hospital_id), 
        description: values.description || "-", 
        active: 1};
  
      // Determine the URL and HTTP method based on whether it's an update or create operation
      const url = editData
        ? `${var_api}gos-service-master/update/${editData.id}`
        : `${var_api}gos-service-master/post`;
      const method = editData ? "PUT" : "POST";
  
      // Send the request
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Ensure token is correct
        },
        body: JSON.stringify(formData),
      });
  
      // Parse the response body
      const responseData = await response.json();
  
      // Check if the response is not OK
      if (!response.ok) {
        // If it's a 400 status, show the specific error message
        if (response.status === 400) {
          notification.error({
            message: "Validation Error",
            description: responseData.message || "This name is already exist.",
          });
          return;
        }
  
        // For other errors, throw a generic error
        throw new Error(responseData.message || "Error saving data.");
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
      setLoading(false);
    } catch (error) {
      console.error("Error saving data:", error);
      setLoading(false);
      // Show an error notification if something goes wrong
      notification.error({
        message: "Operation Failed",
        description: error.message || "There was an error while saving the data.",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleReset = () => {
    // Manually reset the form fields and the checkbox state
    form.setFieldsValue({
      service_name: "",  // Reset service name field
      service_type: "",  // Reset service type field
      charge_amount: "", // Reset charge amount field
      description: "",   // Reset description field
      is_lab: false,     // Reset the checkbox field (unchecked)
    });
    
    setIsLabChecked(false);  // Reset the checkbox state
  };

  const handleDeleteConfirm = (id,service_name) => {
    setDeleteId(id); 
    setDeleteservicename(service_name);              // Set the ID of the specialization to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${var_api}gos-service-master/delete/${deleteId}`,
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
  const columns = [
    {
      title: "S No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    // {
    //   title: "Hospital Id",
    //   dataIndex: "hospital_id",
    //   render: (text) => (text ? text : "N/A"),
    //   sorter: (a, b) => a.name?.localeCompare(b.name),
    // },
    {
      title: "Service Name",
      dataIndex: "service_name",
      render: (text) => (text ? text : "N/A"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Service Type",
      dataIndex: "service_type",
      render: (text) => {
        // Check the value of 'text' (service_type) and return the corresponding label
        if (text == 0) {
          return "OP";
        } else if (text == 1) {
          return "Scan";
        } else if (text == 2) {
          return "Investigation";
        } else if (text === 3) {
          return "Review";
        } else if (text === 4) {
          return "Laser";
        }
        return "-"; // Return '-' if the value is undefined or not 0 or 1
      },
      // sorter: (a, b) => a.name?.localeCompare(b.name),
    },    
      {
        title: "Charge Amount",
        dataIndex: "price",
        render: (text) => (text ? text : "N/A"),
        sorter: (a, b) => a.name?.localeCompare(b.name),
      },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (text ? text : "N/A"),
    },
   {
  title: 'Status',
  dataIndex: 'active',
  render: (text, record) => (
    <Switch
      checked={record.active === 1}
      onChange={(checked) => handleToggleStatus(record, checked)}
      checkedChildren="Yes"
      unCheckedChildren="No"
    />
  )
},
    {
      title: "Action",
      render: (_, record) => (
        <div className="text-end">
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
            onClick={() => handleDeleteConfirm(record.id, record.service_name)}
          >
            <i className="fe fe-trash"></i> Delete
          </a>
        </div>
      ),
    },
  ];

  const handleToggleStatus = async (item, isActive) => {
     const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${var_api}gos-service-master/update/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        service_name: item.service_name,
        service_type: item.service_type,
        price: item.price,
        active: isActive ? 1 : 0,
        description: item.description
      }),
    });

    const result = await response.json();

    if (response.ok) {
       notification.success({
        message: "Success",
        description: "Status updated successfully.",
      });
      fetchData(); // reload or refetch data
    } else {
       notification.error({
        message: "Error",
        description: "There was an error while update the record.",
      });
    }
  } catch (err) {
    console.error('Error updating status:', err);
     notification.error({
        message: "Error",
        description: "Something went wrong.",
      });
  }
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
                <h3 className="page-title">ServicetypeMaster Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">ServicetypeMaster Tables</li>
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
            <div className="col-md-3">
            <input
  className="form-control"
  type="text"
  placeholder="Search"
  value={searchTerm}
  onChange={handleSearch}
  style={{ width: "300px" }} // Adjust the width as needed
/>
            </div>
            <div className="col-md-3">
 <select
  className="form-select"
  value={selectedType}
  onChange={handleServiceTypeChange}
  style={{ width: "300px", height:"45px" }}
>
  <option value="ALL">All</option>
  <option value="0">OP</option>
  <option value="1">Scan</option>
  <option value="2">Investigation</option>
  <option value="3">Review</option>
  <option value="4">Laser</option>
</select>

</div>

          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Servicetype Master</h4>
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
        title={editData ? "Edit servicetypemaster" : "Add New servicetypemaster"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
<Form form={form} onFinish={handleFormSubmit}
  requiredMark={false}  // Disable the default asterisk
>
{/* <Form.Item
  label={
    <span>
      Hospital Id <span style={{ color: 'red' }}>*</span>
    </span>
  }
  name="hospital_id"
  rules={[{ required: true, message: "Please input the HospitalId!" }]}
>
    <Input />
  </Form.Item> */}
  
  <Form.Item
    label={
      <span>
        Service Name <span style={{ color: 'red' }}>*</span>
      </span>
    }
    name="service_name"
    rules={[{ required: true, message: "Please input the ServiceName!" }]}
  >
                 <input
  className="form-control"
  placeholder="Enter service name"
  type="text"
  style={{ width: "350px" }} // Adjust the width as needed
/>
  </Form.Item>
  <Form.Item
  label={
    <span>
      Service Type <span style={{ color: 'red' }}>*</span>
    </span>
  }
  name="service_type"
  rules={[{ required: true, message: "Please select the Service Type!" }]}
>
  <select
    className="form-select form-control" // Apply the same Bootstrap classes
    name="service_type"
    style={{ width: "380px" }} // Matching the width to the input field
    required
    defaultValue="" // Default value for placeholder
  >
    <option value="" disabled hidden>Select Service Type</option> {/* Placeholder option */}
    <option value={0}>OP</option>
    <option value={1}>Scan</option>
    <option value={2}>Investigation</option>
    <option value={3}>Reviews</option>
    <option value={4}>Laser</option>
  </select>
</Form.Item>

          <Form.Item
    label={
      <span>
       Price <span style={{ color: 'red' }}>*</span>
      </span>
    }
    name="price"
    rules={[{ required: true, message: "Please input the Price!" },
    ]}
  >
 <input
  className="form-control"
  type="number"
  placeholder="Enter price"
  style={{ width: "350px" }} // Adjust the width as needed
  min="0" // Prevents negative numbers in the input field
  step="0.01" // Allows decimal values
/>
          </Form.Item> 
          <Form.Item
    label={
      <span>
        Description  
      </span>
    }
    name="description"
    rules={[{ required: false, message: "Please input the Description!" }]}
  >
                 <input
  className="form-control"
  type="text"
  placeholder="Enter description"
  style={{ width: "350px" }} // Adjust the width as needed
/>
          </Form.Item> 

          {/* <Form.Item>
    <Checkbox checked={isLabChecked} onChange={handleCheckboxChange}>
      Is Lab
    </Checkbox>
  </Form.Item> */}
 
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
       <p>Are you sure you want to delete this servicetypemaster "<span style={{fontWeight:"bold"}}>{deleteservicename}</span>"?</p>
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
                     <div style={{ fontSize: '16px', fontWeight: '500', lineHeight: '1.6' }}>
  <div><strong>Step 1:</strong> Click the <strong>Add New</strong> button to initiate the process.</div>
  <div><strong>Step 2:</strong> Complete the form after clicking the <strong>Okay</strong> button to proceed.</div>
  <div><strong>Step 3:</strong> Click the <strong>Submit</strong> button to finalize the process.</div>
</div>
            {/* Your modal content goes here */}
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
                history.push('/admin/medicineuom'); // Call the switch case function here
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

export default servicetypemaster;
