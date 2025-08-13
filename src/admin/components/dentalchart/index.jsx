import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { Table, Button, Modal, Form, Input, Upload, notification, Switch, Select } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link, useHistory } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { var_api, image_api } from "../../../constant";
import { tooth } from "../imagepath";

const DentalChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const history = useHistory();
  const [seatImage, setseatImage] = useState('');

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${var_api}commondentalchart/get`, {
        headers: { "Content-Type": "application/json",Authorization: token },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []);
    } catch (error) {
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
        item.universal?.toLowerCase().includes(value) ||
        item.palmer?.toLowerCase().includes(value) ||
        item.fdi?.toLowerCase().includes(value) ||
        item.tooth_direction?.toLowerCase().includes(value) ||
        item.description?.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleModalOpen = (record = null) => {
    setEditData(record);
    setIsActive(record ? record.is_active : true); // Default to true for new entries
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null);
    setFile(null);
  };

  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
  
  
      // Create FormData
      const formData = new FormData();
      const sanitizedValues = Object.fromEntries(
  Object.entries(values).filter(([key, value]) => value !== undefined && value !== null)
);

  
      // Add form fields to FormData
      Object.entries(sanitizedValues).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      console.log("Is active",values.is_active)
      formData.append("is_active", values.is_active == 1 ? "true" : "false");
  
      // Handle image upload if a file is selected
      if (file) {
        formData.append("image", file);  // Append the image file
      }
  
      // Determine the URL and HTTP method for the request
      const url = editData
        ? `${var_api}commondentalchart/put/${editData.id}`  // Update if edit
        : `${var_api}commondentalchart/post`;               // Create new if no edit data
  
      const method = editData ? "PUT" : "POST";  // Choose the method based on edit status
  
      // Send the request with the FormData
      const response = await fetch(url, {
        method,
        headers: { Authorization: token },
        body: formData,  // Send the form data with the image file
      });
  
      if (!response.ok) {
        throw new Error("Error saving data");
      }
  
      // Success notification
      notification.success({
        message: editData ? "Update Successful" : "Creation Successful",
        description: "The dental chart has been saved successfully.",
      });
  
      // Reset the form and states after submission
      form.resetFields();
      setFile(null);  // Clear file state
      fetchData();    // Refresh data to show updated list
      handleModalClose();  // Close the modal
  
    } catch (error) {
      // Error notification if something goes wrong
      notification.error({
        message: "Operation Failed",
        description: error.message || "There was an error while saving the data.",
      });
    }
  };  
  

  const handleFileChangeSeat = (file) => {
    setFile(file); // Correctly store the selected file
    return false; // Prevent the default upload behavior
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${var_api}commondentalchart/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!response.ok) throw new Error("Error deleting record");

      notification.success({
        message: "Delete Successful",
        description: "The record has been successfully deleted.",
      });

      fetchData();
    } catch (error) {
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    }
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    { title: "Universal", dataIndex: "universal" },
    { title: "Palmer", dataIndex: "palmer" },
    { title: "FDI", dataIndex: "fdi" },
    { title: "Tooth Direction", dataIndex: "tooth_direction" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Image",
      dataIndex: "image",
      render: (text) =>
        text ? (
          <img
            // src={`${image_api}image/dental_image/${text}`}
            src={`${image_api}dental_image/${text}`}
            alt="Tooth"
            style={{ width: "50px" }}
            onError={(e) => (e.target.src = {tooth})}
          />
        ) : (
          <img
            src={tooth}
            alt="Default Tooth"
            style={{ width: "50px" }}
          />
        ),
    },    
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) => (
        <span>
          <span
            className={`badge rounded-pill ${
              text === 1 ? "bg-success" : "bg-danger"
            } inv-badge`}
          >
            {text === 1 ? "Active" : "InActive"}
          </span>
        </span>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div>
          <Switch
            checked={record.is_active}
            onChange={(checked) => handleToggleActive(record.id, checked)}
            style={{ marginLeft: "8px" }}
          />
          <Button type="link" onClick={() => handleModalOpen(record)}>
            Edit
          </Button>
          
        </div>
      ),
    },
  ];

  const handleToggleActive = async (id, checked) => {
    try {
      const response = await fetch(`${var_api}commondentalchart/is_active/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: checked }),
      });
      if (!response.ok) throw new Error("Failed to update status");

      notification.success({
        message: "Update Successful",
        description: "The status has been updated successfully.",
      });

      fetchData();
    } catch (error) {
      notification.error({
        message: "Operation Failed",
        description: "There was an error while updating the status.",
      });
    }
  };

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Dental Chart</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Dental Chart</li>
                </ul>
              </div>
              <div className="col-auto">
                <Button type="primary" onClick={() => handleModalOpen()}>
                  Add New
                </Button>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Input placeholder="Search" value={searchTerm} onChange={handleSearch} />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <Table
                    pagination={{
                      total: filteredData.length,
                      pageSize,
                      current: currentPage,
                      onChange: handlePaginationChange,
                      itemRender,
                    }}
                    loading={loading}
                    columns={columns}
                    dataSource={filteredData || []}
                    rowKey={(record) => record.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={editData ? "Edit Dental Chart" : "Add New Dental Chart"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          initialValues={{
            universal: editData?.universal || "",
            palmer: editData?.palmer || "",
            fdi: editData?.fdi || "",
            tooth_direction: editData?.tooth_direction || "",
            description: editData?.description || "",
            isActive
          }}
        >
          <Form.Item
            label="Universal"
            name="universal"
            rules={[{ required: true, message: "Please input the universal code!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Palmer"
            name="palmer"
            rules={[{ required: true, message: "Please input the palmer code!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="FDI"
            name="fdi"
            rules={[{ required: true, message: "Please input the FDI code!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Tooth Direction" name="tooth_direction">
          <Select placeholder="Select Tooth Direction">
            <Select.Option value="Top-Left">Top-Left</Select.Option>
            <Select.Option value="Top-Right">Top-Right</Select.Option>
            <Select.Option value="Bottom-Left">Bottom-Left</Select.Option>
            <Select.Option value="Bottom-Right">Bottom-Right</Select.Option>
          </Select>
        </Form.Item>


          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

          <Form.Item label="Image" name="image">
          <Upload
            beforeUpload={(file) => {
              handleFileChangeSeat(file);  // Store the file in state
              return false;  // Prevent automatic upload
            }}
            showUploadList={false} // Hide default upload list
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>

          </Form.Item>

          <Form.Item>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
         <button htmlType="submit" className="btn btn-primary mx-1">
         {editData ? "Update" : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleModalClose}
                >
                  {editData ? "Cancel" : "Reset"}
                </button>
                </div>
            {/* <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button type="primary" htmlType="submit">
                {editData ? "Update" : "Submit"}
              </Button>
              <Button
                class = "btn btn-danger"
                onClick={handleModalClose}
                type="default"
              >
                {editData ? "Cancel" : "Reset"}
              </Button>
            </div> */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DentalChart;
