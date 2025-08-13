import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, notification, Select,DatePicker  } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"; 
//import "../styles/Loader.css";
import { var_api } from "../../../constant";
import moment from "moment";
import dayjs from "dayjs";


const Medicinesubcategory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
   const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [medicineCategories, setMedicineCategories] = useState([]);
  const [brands, setBrands] = useState([]); // State to store brands
  const [uom, setUom] = useState([]); // State to store UOMs
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [deletename , setDeletename] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const history = useHistory(); // useNavigate for navigation
  const [expirationDate, setExpirationDate] = useState(null);


  //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";
 // Replace with your actual auth token

  // Fetch Medicine Subcategories
  const fetchData = async () => {
    const token = localStorage.getItem('pres_token');
    const hospital_id = localStorage.getItem('pres_hospital_id'); 
    setLoading(true);
    try {
      const response = await fetch(`${var_api}medicinesubcategory/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 401) {
        history.push("/pharmacyadmin/pharmacyLogin"); // Redirect to login page on 401
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []);
      setLoading(false);
    }catch (err) {
      console.log ("abc",err.response , err.response.status)
      if (err.response && err.response.status === 401) {
        history.push("/pharmacyadmin/pharmacyLogin"); 
      } else {
        console.error("Error fetching patients tital:", err);
      }
    }
   finally {
      setLoading(false);
    }
  };

  // Fetch Medicine Categories
  const fetchDataMedicinecategory = async () => {
    const hospital_id = localStorage.getItem('pres_hospital_id');
    setLoading(true);
    try {
      const token = localStorage.getItem('pres_token');
      const response = await fetch(`${var_api}medicinecategory/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/pharmacyadmin/pharmacyLogin"); // Redirect to login page on 401
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch categories");
      const result = await response.json();
      setMedicineCategories(result || []);
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

  // Fetch Brands
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pres_token');
      const hospital_id = localStorage.getItem("pres_hospital_id");
      const response = await fetch(`${var_api}medicinebrandmaster/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/pharmacyadmin/pharmacyLogin"); // Redirect to login page on 401
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch brands");
      const result = await response.json();
      setBrands(result || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching brands:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve brands. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch UOM
  const fetchuom = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pres_token');
      const hospital_id = localStorage.getItem('pres_hospital_id');
      const response = await fetch(`${var_api}medicineuom/getby-hospital/${hospital_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        history.push("/pharmacyadmin/pharmacyLogin"); // Redirect to login page on 401
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch UOM");
      const result = await response.json();
      setUom(result || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching UOM:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Unable to retrieve UOM. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataMedicinecategory();
    fetchBrands(); // Fetch brands on component load
    fetchuom(); // Fetch uom on component load
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter data based on all fields
    const filtered = data.filter((item) => {
      const category = medicineCategories.find((cat) => cat.id === item.cat_id);
      const brand = brands.find((brand) => brand.id === item.brand_id);
      const uomName = uom.find((uom) => uom.uom_name === item.uom_name);
      
      return (
        item.name.toLowerCase().includes(value) ||
        (category && category.category_name.toLowerCase().includes(value)) ||
        (brand && brand.brand_name.toLowerCase().includes(value)) ||
        (item.price && item.price.toString().includes(value)) ||
        (item.remark && item.remark.toLowerCase().includes(value)) ||
        (uomName && uomName.uom_name.toLowerCase().includes(value))
      );
    });

    setFilteredData(filtered);
  };

  // const handleModalOpen = (record = null) => {
  //   setEditData(record);
  //   form.resetFields();
  //   if (record) {
  //     form.setFieldsValue(record);
  //   }
  //   setIsModalVisible(true);
  // };
  const handleModalOpen = (record = null) => {
    setEditData(record);
    form.resetFields(); // Reset form fields first
  
    if (record) {
      const sanitizedRecord = {
        ...record,
        expiration_date: record.expiration_date ? dayjs(record.expiration_date) : null, // Convert to dayjs
      };
  
      form.setFieldsValue(sanitizedRecord);
    }
  
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  // const handleFormSubmit = async (values) => {
  //   try {
  //     // Retrieve the hospital_id from localStorage
  //     const token = localStorage.getItem('token');
  //     const hospital_id = localStorage.getItem("hospital_id");
  
  //     // Ensure that hospital_id is available
  //     if (!hospital_id) {
  //       throw new Error("Hospital ID is not available in localStorage.");
  //     }
  
  //     // Include the hospital_id dynamically in the form data
  //     const formData = { ...values, hospital_id };
  
  //     // Determine the URL and HTTP method based on whether it's an update or create operation
  //     const url = editData
  //       ? `${var_api}medicinesubcategory/update/${editData.id}`
  //       : "${var_api}medicinesubcategory/post";
  //     const method = editData ? "PUT" : "POST";
  
  //     // Send the request
  //     const response = await fetch(url, {
  //       method,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `${token}`, // Make sure `token` is set correctly
  //       },
  //       body: JSON.stringify(formData),
  //     });
  
  //     // Check if the response is OK
  //     if (!response.ok) {
  //       throw new Error("Error saving data");
  //     }
  //        if (!response.ok) {
  //             // If it's a 400 status, show the specific error message
  //             if (response.status === 400) {
  //               notification.error({
  //                 message: "Validation Error",
  //                 description: response.message || "This name is already exist.",
  //               });
  //               return;
  //             }
        
  //             // For other errors, throw a generic error
  //             throw new Error(response.message || "Error saving data.");
  //           }
  
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
  //       description: "There was an error while saving the data.",
  //     });
  //   }
  // };
  const handleFormSubmit = async (values) => {
    // const formattedDate = moment(values.expiration_date).format("DD/MM/YYYY");
    // console.log("Formatted Date:", formattedDate);
    const formattedDate = values.expiration_date ? dayjs(values.expiration_date).format("DD/MM/YYYY") : null;
    console.log("Formatted Date:", formattedDate);

    setLoading(true);
    try {
      const token = localStorage.getItem('pres_token');
      const hospital_id = localStorage.getItem("pres_hospital_id");
  
      if (!hospital_id) {
        throw new Error("Hospital ID is not available in localStorage.");
      }
  
      const formData = { ...values, hospital_id, remark: values.remark || "-" };
  
      const url = editData
        ? `${var_api}medicinesubcategory/update/${editData.id}`
        : `${var_api}medicinesubcategory/post`;
      const method = editData ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.status === 401) {
        history.push("/pharmacyadmin/pharmacyLogin"); // Redirect to login page on 401
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
  
      if (!response.ok) {
        const errorResponse = await response.json(); // Parse JSON response
        if (response.status === 400 && errorResponse.message) {
          // Check for specific error message
          if (errorResponse.message === "Medicine subcategory with this name already exists for this hospital.") {
            notification.error({
              message: "Category already exists",
              description: errorResponse.message,
            });
          } else {
            notification.error({
              message: "Validation Error",
              description: errorResponse.message,
            });
          }
          return; // Exit the function if it's a 400 error
        }
        // If no specific message, throw a generic error
        throw new Error(errorResponse.message || errorResponse.error || "An error occurred.");
      }
  
      notification.success({
        message: editData ? "Update Successful" : "Creation Successful",
        description: editData
          ? "The record has been successfully updated."
          : "A new record has been successfully created.",
      });
      setLoading(false);
      fetchData();
      handleModalClose();
    } catch (error) {
      console.error("Error saving data:", error);
      setLoading(false);
      notification.error({
        message: "Operation Failed",
        description: error.message || "There was an error while saving the data.",
      });
    }
  };

  const handleDeleteConfirm = (id,name) => {
    setDeleteId(id);
    setDeletename(name);
    setIsDeleteConfirmVisible(true);
  };

  

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setIsDeleteConfirmVisible(false);
  };
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const handleReset = () => {
    // Reset form fields to their initial values
    form.resetFields();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('pres_token');
      const response = await fetch(
        `${var_api}medicinesubcategory/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 401) {
        history.push("/pharmacyadmin/pharmacyLogin"); // Redirect to login page on 401
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }
      if (!response.ok) throw new Error("Error deleting record");

      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });

      fetchData();
      handleDeleteCancel();
      setLoading(false);
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "S No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, // Dynamically calculate serial number
    },
    {
      title: "Category",
      dataIndex: "cat_id",
      render: (text) => {
        const category = medicineCategories.find((cat) => cat.id === text);
        return category ? category.category_name : "-";
      },
      sorter: (a, b) => a.cat_id - b.cat_id,
    },
    {
      title: "Brand",
      dataIndex: "brand_id",
      render: (text) => {
        const brand = brands.find((brand) => brand.id === text);
        return brand ? brand.brand_name : "-";
      },
      sorter: (a, b) => a.brand_id - b.brand_id,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "UOM",
      dataIndex: "uom",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      render: (text) => (text ? text : "-"),
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
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Medicine SubCategory Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/pharmacyadmin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Medicine SubCategory</li>
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
                  <h4 className="card-title">Medicine SubCategory</h4>
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
        title={editData ? "Edit Medicine SubCategory" : "Add New Medicine SubCategory"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit}>
        <Form.Item
  label="Category"
  name="cat_id"
  rules={[{ required: true, message: "Please select a category!" }]}
>
<select
  className="form-select form-control"
  name="cat_id"
  style={{ width: "400px" }} // Adjusting the width like your previous input field
  required
  defaultValue="" // Ensuring the placeholder is selected initially
>
  <option value="" disabled hidden>
    Select Category
  </option>
  {medicineCategories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.category_name}
    </option>
  ))}
</select>
</Form.Item>
          {/* <Form.Item
            label="Brand"
            name="brand_id"
            rules={[{ required: true, message: "Please select a brand!" }]}
          >
            <Select
              placeholder="Select Brand"
              showSearch
              optionFilterProp="children"
              className="form-select form-control"
            >
              {brands.map((brand) => (
                <Select.Option key={brand.id} value={brand.id}>
                  {brand.brand_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item
  label="Brand"
  name="brand_id"
  rules={[{ required: true, message: "Please select a brand!" }]}
><select
  className="form-select form-control"
  name="brand_id"
  style={{ width: "420px" }} // Matching the input width
  required
  defaultValue="" // Ensuring the placeholder is selected initially
>
  <option value="" disabled hidden>
    Select Brand
  </option>
  {brands.map((brand) => (
    <option key={brand.id} value={brand.id}>
      {brand.brand_name}
    </option>
  ))}
</select>
</Form.Item>


          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
                      
                      <input
  className="form-control"
  type="text"
  style={{ width: "420px" }} // Adjust the width as needed
/>
          </Form.Item>

          <Form.Item
  label="UOM"
  name="uom"
  rules={[{ required: true, message: "Please select the unit of measure!" }]}
>
<select
  className="form-select form-control"
  name="uom"
  style={{ width: "420px" }} // Matching the width to the input field
  required
  defaultValue="" // Ensuring the placeholder is selected initially
>
  <option value="" disabled hidden>
    Select UOM
  </option>
  {uom.map((unit) => (
    <option key={unit.uom_name} value={unit.uom_name}>
      {unit.uom_name}
    </option>
  ))}
</select>
</Form.Item>


          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
                                 <input
  className="form-control"
  type="text"
  style={{ width: "420px" }} // Adjust the width as needed
/>
          </Form.Item>
          
      {/* <Form.Item
        label="Expiration Date"
        name="expiration_date"
        rules={[{ required: true, message: "Please input the Expiration Date!" }]}
      >
        <DatePicker 
          format="DD/MM/YYYY" 
          onChange={(date) => setExpirationDate(date ? moment(date).format("DD/MM/YYYY") : null)}
        />
      </Form.Item> */}
            <Form.Item
        label="Expiration Date"
        name="expiration_date"
        rules={[{ required: true, message: "Please input the Expiration Date!" }]}
      >
        <DatePicker 
          format="DD/MM/YYYY" className="form-control" style={{ width: "350px" }}
          value={expirationDate ? dayjs(expirationDate) : null} 
          onChange={(date) => setExpirationDate(date ? dayjs(date).format("DD/MM/YYYY") : null)}
        />
      </Form.Item>

          <Form.Item
            label="Remark"
            name="remark"
            rules={[{ required: false, message: "Please input a remark!" }]}
          >
                               <input
  className="form-control"
  type="text"
  style={{ width: "420px" }} // Adjust the width as needed
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
                <Modal
             title="Delete Confirmation"
             visible={isDeleteConfirmVisible}
             onCancel={handleDeleteCancel} // Keep the onCancel function to close the modal when the Cancel button is clicked
             footer={null} // Remove the default OK and Cancel buttons
           >
             <p>Are you sure you want to delete this Medicinesubcategory "<span style={{fontWeight:"bold"}}>{deletename}</span>"?</p>
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

export default Medicinesubcategory;
