import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, notification, Select, Radio } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { image_api, var_api } from "../../../constant";
import DatePicker from 'react-datepicker';
import doc_dummy from '../../assets/img/doctors/doc_dummy.png';
import { useHistory } from 'react-router-dom';

const technical = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const history = useHistory();
  const [form] = Form.useForm();
    const [fileidproof, setFileidproof] = useState(null);
    const [file, setFile] = useState(null);
    const [specialization, setSpecialization] = useState([]);
    const [role, setRole] = useState([]);
      const [seatImage, setseatImage] = useState('');
      const [seatImageproof, setseatImageproof] = useState('');
      const { Option } = Select;
        const [selectedDate, setSelectedDate] = useState('');
        const [previewProfileImage, setPreviewProfileImage] = useState(null);
        const [previewIdProof, setPreviewIdProof] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [isModalInsta, setIsModalInsta] = useState(false);
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


        
        // const navigateToRoute = () => {
        //   history.push('/admin/availabledaytime');
        // };
        
      


  // const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";
  

  useEffect(() => {
    fetchinstalldata();
    fetchData();
    fetchDataSpecialization();
    fetchDataRole();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");
    setLoading(true);
    try {
      const response = await fetch(`${var_api}technicalstaff/getby-hospital/${hospital_id}`, {
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

    // Log the full response
    console.log("Installation data:", result);

  
    const firstItem = result?.[0];
    if (firstItem) {
      setInstallDetails(firstItem); // Save the full object
    }

    // Save installation_id if available
    if (firstItem?.id) {
      localStorage.setItem("installation_id", firstItem.id);
      console.log("Saved installation_id:", firstItem.id);
    }

    setData(result || []);

    // Check techstaff === 0 to show modal
    if (!firstItem.techstaff && firstItem?.techstaff === 0) {
      console.log("techstaff is 0 — showing modal");
      setIsModalInsta(true);
    } else {
      console.log("techstaff is NOT 0 — not showing modal");
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

  

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase(); // Convert search term to lowercase
    setSearchTerm(value);
  
    // Filter the data based on the search term in any column
    const filtered = data.filter((item) =>
      Object.keys(item).some((key) => {
        const fieldValue = item[key];
        return (
          fieldValue &&
          fieldValue.toString().toLowerCase().includes(value) // Convert field value to a string and check if it includes the search term
        );
      })
    );
  
    setFilteredData(filtered); // Update filtered data state
  };
  
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleModalOpen = (record = null) => {
    setEditData(record); // Set record data for editing (if any)
    form.resetFields();   // Reset the form fields
    if (record) {
       // Convert roll name to ID
  const rollId = role.find(r => r.roll_name === record.roll)?.id;
  
  // Convert specialization name to ID
  const specId = specialization.find(s => s.name === record.specialization)?.id;
      form.setFieldsValue({
        // Set all other fields EXCEPT file inputs
        name: record.name,
        email_id: record.email_id,
        is_verify_email: record.is_verify_email,
        password: record.password,
        primary_mobile: record.primary_mobile,
        secondary_mobile: record.secondary_mobile,
        gender: record.gender,
        dob: record.dob,
        blood_group: record.blood_group,
        joining_date: record.joining_date,
        leaving_date: record.leaving_date,
        roll: rollId,
        specialization: record.specialization,
        specialization_id: specId,
        qualification: record.qualification,
        is_available: record.is_available,
       
        // Skip profile_image and id_proof fields
      });
       // Set preview URLs in state instead
    setPreviewProfileImage(record.profile_image);
    setPreviewIdProof(record.id_proof);
      // form.setFieldsValue(record); // Set initial values for the edit form
    }
    setIsModalVisible(true);  // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setEditData(null);         // Clear the edit data
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

     // Format the date and set in form
  if (date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    // Set formatted date in your form
    form.setFieldsValue({
      dob: formattedDate
    });
    console.log("d", date, formattedDate);
  }
  };

  const handleReset = () => {
    // Reset form fields to their initial values
    form.resetFields();
    setFileidproof("");
    setFile("");
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
  };

  const handleFileChangeSeat = (e) => {
    setseatImage(e.target.files[0]);
    console.log("seat", seatImage);
  };

  const handleFileChangeIDproof = (e) => {
    setseatImageproof(e.target.files[0]);
    console.log("seat", seatImageproof);
  };

  const handleFileChangeidproof = (e) => {
    setFileidproof(e.target.files[0]); // Store the selected file
  };

  
  // const handleFormSubmit = async (values) => {
  //   try {
  //     // Retrieve the hospital_id from localStorage
  //     const hospital_id = localStorage.getItem("hospital_id");
  //     const token = localStorage.getItem("token"); // Make sure token is retrieved from localStorage
  
  //     // Ensure that hospital_id is available
  //     if (!hospital_id) {
  //       throw new Error("Hospital ID is not available in localStorage.");
  //     }
  
  //     // Create a FormData object
  //     const formData = new FormData();
  
  //     // Append hospital_id to FormData
  //     formData.append("hospital_id", hospital_id);
  //     formData.append("is_verify_email", 1);
  //     formData.append('profile_image', seatImage || "-");
      
  
  //     // Determine the URL and HTTP method
  //     const url = editData
  //     ? `${var_api}technicalstaff/update/${editData.id}`
  //     : `${var_api}technicalstaff/post`;
  //   const method = editData ? "PUT" : "POST";
  
  //     // Send the request
  //     const response = await fetch(url, {
  //       method,
  //       headers: {
  //         Authorization: token, // Include token in the headers
  //       },
  //       body: formData, // Use FormData as the body
  //     });
  
  //     // Check if the response is OK
  //     if (!response.ok) {
  //       throw new Error("Error saving data");
  //     }
  
  //     // Show a success notification
  //     notification.success({
  //       message: editData ? "Update Successful" : "Creation Successful",
  //       description: editData
  //         ? "The record has been successfully updated."
  //         : "A new record has been successfully created.",
  //     });
  
  //     // Fetch the updated data (if needed)
  //     fetchData();
  
  //     // Close the modal after successful operation
  //     handleModalClose();
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  
  //     // Show an error notification if something goes wrong
  //     notification.error({
  //       message: "Operation Failed",
  //       description: error.message || "There was an error while saving the data.",
  //     });
  //   }
  // };

  // const handleFormSubmit = async (values) => {
  //   try {
  //     // Retrieve the hospital_id and token from localStorage
  //     const hospital_id = localStorage.getItem("hospital_id");
  //     const token = localStorage.getItem("token");
  
  //     // Ensure that hospital_id is available
  //     if (!hospital_id) {
  //       throw new Error("Hospital ID is not available in localStorage.");
  //     }
  
  //     // Replace undefined or empty values with "-"
  //     const sanitizedValues = Object.fromEntries(
  //       Object.entries(values).map(([key, value]) => [key, value || "-"])
  //     );
  
  //     // Create a FormData object
  //     const formData = new FormData();
  
  //     // Append sanitized values and other necessary data to FormData
  //     formData.append("hospital_id", hospital_id);
  //     formData.append("is_verify_email", 1); 
  //     formData.append('profile_image', seatImage ? seatImage : "");
  //     formData.append('id_proof', seatImageproof ? seatImageproof : "");
  //     Object.entries(sanitizedValues).forEach(([key, value]) => {
  //       formData.append(key, value);
  //     });
  
  //     // Determine the URL and HTTP method
  //     const url = editData
  //       ? `${var_api}technicalstaff/update/${editData.id}`
  //       : `${var_api}technicalstaff/post`;
  //     const method = editData ? "PUT" : "POST";
  
  //     // Send the request
  //     const response = await fetch(url, {
  //       method,
  //       headers: {
  //         Authorization: token, // Include token in the headers
  //       },
  //       body: formData, // Use FormData as the body
  //     });
  
  //     // Check if the response is OK
  //     if (!response.ok) {
  //       throw new Error("Error saving data");
  //     }
  
  //     // Show a success notification
  //     notification.success({
  //       message: editData ? "Update Successful" : "Creation Successful",
  //       description: editData
  //         ? "The record has been successfully updated."
  //         : "A new record has been successfully created.",
  //     });
  
  //     // Fetch the updated data (if needed)
  //     fetchData();
  
  //     // Close the modal after successful operation
  //     handleModalClose();
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  
  //     // Show an error notification if something goes wrong
  //     notification.error({
  //       message: "Operation Failed",
  //       description: error.message || "There was an error while saving the data.",
  //     });
  //   }
  // };
  
  const formatToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };


 const handleFormSubmit = async (values) => {
    try {
        const hospital_id = localStorage.getItem("hospital_id");
        const token = localStorage.getItem("token");

        if (!hospital_id) {
            throw new Error("Hospital ID is not available in localStorage.");
        }

        const today = formatToDDMMYYYY(new Date());

        const formData = new FormData();

        // Append files if available
        if (seatImage) {
            formData.append("profile_image", seatImage);
        } else if (previewProfileImage) {
            formData.append("profile_image", previewProfileImage);
        }

        if (seatImageproof) {
            formData.append("id_proof", seatImageproof);
        } else if (previewIdProof) {
            formData.append("id_proof", previewIdProof);
        }

        // Find names based on selected IDs
        const selectedRoll = role.find((r) => r.id === values.roll);
        const selectedSpecialization = specialization.find(
            (s) => parseInt(s.id, 10) === parseInt(values.specialization_id, 10)
        );

        const sanitizedValues = {
            ...values,
            roll: selectedRoll?.roll_name,
            specialization_id: selectedSpecialization?.id
                ? parseInt(selectedSpecialization.id, 10)
                : 0,
            specialization: selectedSpecialization?.name || "-",
            is_available: values.is_available || 1,
            joining_date: values.joining_date || today,
            leaving_date: values.leaving_date || "00-00-0000",
            secondary_mobile: values.secondary_mobile || "-",
        };

        // Append values to FormData
        formData.append("hospital_id", hospital_id);
        formData.append("is_verify_email", 1);
        Object.keys(sanitizedValues).forEach((key) => {
            if (key !== "profile_image" && key !== "id_proof") {
                formData.append(key, sanitizedValues[key]);
            }
        });

        const url = editData
            ? `${var_api}technicalstaff/update/${editData.id}`
            : `${var_api}technicalstaff/post`;
        const method = editData ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                Authorization: token,
            },
            body: formData,
        });

        // Success check
        if (!editData && (response.status === 200 || response.status === 201)) {
            updateTechstaffStatus(); 
            const responseData = await response.json();
            console.log("POST Success:", responseData);

            notification.success({
                message: "Creation Successful",
                description: "A new record has been successfully created.",
            });
            console.log("Calling updateTechstaffStatus now...");

            // Wait for the installation data to be fetched and checked
            // const installationData = await fetchinstalldata(); // Ensure the data is fetched

            // if (installationData && installationData.length > 0) {
            //     // Data exists, now open the modal
            //     setIsModalOpen(true);
            // } else {
            //     console.log("Installation data is empty or unavailable.");
            // }

        } else if (editData && (response.status === 200 || response.status === 201)) {
            notification.success({
                message: "Update Successful",
                description: "The record has been successfully updated.",
            });
        } else {
            throw new Error("Error saving data");
        }

        // Shared after success (both POST and PUT)
        fetchData();
        form.resetFields();
        setFileidproof("");
        setFile("");
        setPreviewProfileImage(null);
        setPreviewIdProof(null);
        handleModalClose();

    } catch (error) {
        console.error("Error saving data:", error);

        notification.error({
            message: "Operation Failed",
            description: error.message || "There was an error while saving the data.",
        });
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
          techstaff: 1,
          availabletime: installDetails?.availabletime ?? false,
          patient: installDetails?.patient ?? false,
          servicetype: installDetails?.servicetype ?? false,
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
  
      const responseText = await response.text();
      console.log("Response Status:", response.status);
      console.log("Response Text:", responseText);
  
        if (response.ok) {
              console.log("Installation techstaff updated successfully.");
                   if (installDetails?.techstaff !== 1) {
        setIsModalOpen(true);
      }
              fetchinstalldata(); // Open modal only on success
            } else {
              console.error("Failed to update installation:", responseText);
            }
  
    } catch (err) {
      console.error("Error updating techstaff:", err);
    }
  };
  
  
  
  
  
  
  

  const handleDeleteConfirm = (id,name) => {
    setDeleteId(id);    
    setDeleteName(name);            // Set the ID of the specialization to delete
    setIsDeleteConfirmVisible(true); // Show the delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);                // Reset the delete ID
    setIsDeleteConfirmVisible(false); // Hide the delete confirmation modal
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${var_api}technicalstaff/delete/${deleteId}`,
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

   const fetchDataSpecialization = async () => {
      const hospital_id = localStorage.getItem('hospital_id');
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        // const response = await fetch(`${var_api}specialization/getby-hospital/${hospital_id}`, {
          const response = await fetch(`${var_api}specialization/get`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if (response.status === 401) {
          history.push("/admin/login"); // Redirect to login page on 401
          notification.warning({
            message: "Unauthorized",
            description: "Your session has expired. Please log in again.",
          });
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json();
        setSpecialization(result || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        notification.error({
          message: "Fetch Failed",
          description: "Unable to retrieve categories. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchDataRole = async () => {
      const hospital_id = localStorage.getItem('hospital_id');
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${var_api}rollmaster/get-gos`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if (response.status === 401) {
          history.push("/admin/login"); // Redirect to login page on 401
          notification.warning({
            message: "Unauthorized",
            description: "Your session has expired. Please log in again.",
          });
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json();

        const filtered = (result || []).filter((item) =>
  ["doctor", "nurse"].includes(item.roll_name?.toLowerCase())
);

        setRole(filtered || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        notification.error({
          message: "Fetch Failed",
          description: "Unable to retrieve categories. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };



  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (text ? text : "-"),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Role",
      dataIndex: "roll",
      render: (text) => (text ? text : "-"),
    },
    {
        title: "Email Id",
        dataIndex: "email_id",
        render: (text) => (text ? text : "-"),
        sorter: (a, b) => a.name?.localeCompare(b.name),
      },
      // {
      //   title: "Password",
      //   dataIndex: "password",
      //   render: (text) => (text ? text : "-"),
      //   sorter: (a, b) => a.name?.localeCompare(b.name),
      // },
      {
        title: "Mobile 1",
        dataIndex: "primary_mobile",
        render: (text) => (text ? text : "-"),
        sorter: (a, b) => a.name?.localeCompare(b.name),
      },
      {
        title: "Mobile 2",
        dataIndex: "secondary_mobile",
        render: (text) => (text ? text : "-"),
        sorter: (a, b) => a.name?.localeCompare(b.name),
      },
      {
        title: "Profile",
        dataIndex: "profile_image",
        render: (text) =>
            <img
            src={
              text?.trim() && /\.(jpeg|jpg|png|webp)$/i.test(text.trim())
                ? `${image_api}technical/${text.trim()}`
                : doc_dummy
            }
            alt="Profile"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
         
        
      },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (text) => (text ? text : "-"),
    },
    {
        title: "Dob",
        dataIndex: "dob",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Blood Group",
        dataIndex: "blood_group",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Joining",
        dataIndex: "joining_date",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Leaving",
        dataIndex: "leaving_date",
        render: (text) => (text ? text : "-"),
      },
     
      {
        title: "Specialization",
        dataIndex: "specialization",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Qualification",
        dataIndex: "qualification",
        render: (text) => (text ? text : "-"),
      }, 
      {
        title: "ID Proof",
        dataIndex: "id_proof",
        render: (text) =>
          text ? (
            <img
              src={`${image_api}${text}`}
              alt="Profile"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          ) : (
            "-"
          ),
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
                <h3 className="page-title">Technicalstaff Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Technicalstaff Tables</li>
                </ul>
              </div>
              <div className="col-auto">
                <button type="button"
        className="btn btn-primary mx-1" onClick={() => handleModalOpen()}>
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
                  <h4 className="card-title">Technicalstaff</h4>
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
              title={editData ? "Edit technicalstaff" : "Add New technicalstaff"}
              visible={isModalVisible}
              onCancel={handleModalClose}
              footer={null}
            >
              
              <Form form={form} onFinish={handleFormSubmit}>
              <Form.Item
                  label="Name"
                  name="name"
                  placeholder="Enter your name"
                  rules={[{ required: true, message: "Please input the name!" }]}
                >
                                               <input
  className="form-control"
  placeholder="Enter your name"
  type="text"
  style={{ width: '380px' }} // Adjust the width as needed
/>
                </Form.Item>
                <Form.Item
  label="Role"
  name="roll"
  rules={[{ required: true, message: "Please select a role!" }]}
>
  <Select
     style={{ width: "100%", height: 38 }} // 👈 smaller height
     dropdownStyle={{ maxHeight: 250 }}
     placeholder="Select a Role" 
    onChange={(value) => form.setFieldsValue({ roll: value })} // Update Form state
  >
    {role.map((category) => (
      <Select.Option key={category.id} value={category.id}>
        {category.roll_name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
<Form.Item
  label="Email Id"
  name="email_id"
  placeholder="Enter your email"
  rules={[{ required: true, message: "Please input the email Id!" }]}
>
  <input
    className="form-control"
    placeholder="Enter your Email"
    type="email"
    style={{ width: '380px' }} 
    autoComplete="off"  // Disable auto-fill
  />
</Form.Item>
                
                {/* <Form.Item
                  label="is_verify_email"
                  name="is_verify_email"
                  rules={[{ required: true, message: "Please input the Isverifyemail!" }]}
                >
                  <Input />
                </Form.Item> */}
     <Form.Item
  label="Password"
  name="password"
  rules={[{ required: true, message: 'Please input the password!' }]}
>
  <Input.Password
    placeholder="Enter your password"
    style={{ width: '380px' }} 
    autoComplete="new-password"  // Disable auto-fill
  />
</Form.Item>
                <Form.Item
                  label="Primary Mobile"
                  name="primary_mobile"
                  rules={[
                    { required: false, message: "Please input the Primary Mobile!" },
                    { pattern: /^\d+$/, message: "Only numbers are allowed!" },
                  ]}
                >
                  <input
  className="form-control"
  type="text"
  maxLength="10"
  style={{ width: "380px" }}
  placeholder="Enter 10-digit number"
  onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}
/>
                </Form.Item>
                <Form.Item
                  label="Secondary Mobile"
                  name="secondary_mobile"
                  rules={[
                    { required: false, message: "Please input the Secondary Mobile!" },
                    { pattern: /^\d+$/, message: "Only numbers are allowed!" },
                  ]}
                >
                 <input
  className="form-control"
  type="text"
  maxLength="10"
  style={{ width: "360px" }}
  placeholder="Enter 10-digit number"
  onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}
/>
                </Form.Item>
                <Form.Item
                  label="Profile Image"
                  name="profile_image"
                  rules={[{ required: false, message: "Please upload a profile image!" }]}
                >
                  <input  className="form-control" type="file"   style={{ width: '380px' }}  placeholder="Select File"  onChange={handleFileChangeSeat} id="seatImageInput" />
                  {previewProfileImage && (
    <img 
      src={`${image_api}${previewProfileImage}`} 
      alt="Current Profile" 
      style={{ width: 100, marginTop: 10 }}
    />
  )}
                </Form.Item>
                <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
              <Radio value="Other">Other</Radio>
            </Radio.Group>
          </Form.Item>
                <Form.Item
                label="Dob"
                name="dob"
                style={{ width: "300px", marginLeft: '10px' }} 
                getValueFromEvent={(date) => {
                  if (!date) return null;
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  return `${day}-${month}-${date.getFullYear()}`;
                }}
                rules={[{ required: true, message: "Please select your Date of Birth!" }]} // Set required: true for validation
                >
        <DatePicker
  className="form-control"
  selected={selectedDate}
  onChange={handleDateChange}
  dateFormat="dd/MM/yyyy"
  showDayMonthYearPicker
  showYearDropdown
  showMonthDropdown
  dropdownMode="select"

/>
                </Form.Item>
                <Form.Item
  label="Blood Group"
  name="blood_group"
  rules={[{ required: true, message: "Please select your Blood Group!" }]} // Set required: true if mandatory
>
<select
          className="form-select form-control"
          name="blood_group"
          style={{ width: "300px", marginLeft: '10px' }} // Align input to the left
          defaultValue="" // Ensures "Select Blood Group" is selected initially
        >
          <option value="" disabled>
            Select Blood Group
          </option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
</Form.Item>
                {/* <Form.Item
                  label="Joining Date"
                  name="joining_date"
                  rules={[{ required: false, message: "Please input the Joiningdate!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Leaving Date"
                  name="leaving_date"
                  rules={[{ required: false, message: "Please input the Leaving Date!" }]}
                >
               <Input />
                </Form.Item> */}
    

                <Form.Item
                  label="Specialization"
                  name="specialization_id"
                  rules={[{ required: true, message: "Please input the roll!" }]}
                >
            <select
  className="form-select form-control"
  name="specialization"
  style={{ width: "300px", marginLeft: '10px' }} // Align input to the left
  defaultValue="" // Ensures the placeholder is selected initially
  onChange={(e) => {
    // Handle the selected value here
    console.log("Selected value:", e.target.value);
  }}
>
  <option value="" disabled>
    Select Specialization
  </option>
  {specialization.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>
                </Form.Item>
                <Form.Item
                  label="Qualification"
                  name="qualification"
                  rules={[{ required: true, message: "Please input the qualification	!" }]}
                >
                                                 <input
  className="form-control"
  placeholder="Enter your Qualification"
  type="text"
  style={{ width: '380px' }} // Adjust the width as needed
/>
                </Form.Item>
                <Form.Item
                          label="Id Proof"
                          name="id_proof"
                          rules={[{ required: false, message: "Please upload a id image!" }]}
                        >
                <input  className="form-control" type="file" placeholder="Select File"  onChange={handleFileChangeIDproof} id="seatImageInput" />
                {previewIdProof && (
    <img 
      src={`${image_api}${previewIdProof}`} 
      alt="Current Profile" 
      style={{ width: 100, marginTop: 10 }}
    />
  )}

                        </Form.Item>
              
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

      {/* Delete Confirmation Modal */}
      {/* <Modal
        title="Delete Confirmation"
        visible={isDeleteConfirmVisible}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this Technical?</p>
      </Modal> */}

      <Modal
  title="Delete Confirmation"
  visible={isDeleteConfirmVisible}
  onCancel={handleDeleteCancel} // Keep the onCancel function to close the modal when the Cancel button is clicked
  footer={null} // Remove the default OK and Cancel buttons
>
<p>Are you sure you want to delete this <span style={{fontWeight:"bold"}}>"{deleteName}"</span> Technical?</p>
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
  visible={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={[
    <Button
    key="close"
    type="primary"
    onClick={() => {
      setIsModalOpen(false);
      history.push('/admin/availabledaytime'); // Call the switch case function here
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

export default technical;
