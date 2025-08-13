import React, { useState, useEffect } from "react";
import SidebarNav from "../ultrasidebar";
import { Table, Button, Modal, Form, Input, notification, Checkbox } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import { Link } from "react-router-dom";
import { var_api } from "../../../constant";
import { useHistory } from "react-router-dom";

const RollMaster = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [deletename, setDeletename] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const history = useHistory();

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('ultratoken');
    try {
      const response = await fetch(`${var_api}rollmaster/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []);
      setFilteredData(result || []);
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
        item.roll_name.toLowerCase().includes(value) ||
        item.roll_description.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleModalOpen = (record) => {
    setEditData(record);
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        ...record,
        is_nontech: record.is_nontech === 1 // Convert 1/0 to true/false
      });
    } else {
      form.setFieldsValue({
        is_nontech: false // Default for new records
      });
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem('ultratoken');
      
      const formData = {
        ...values,
        is_nontech: values.is_nontech ? 1 : 0, // Convert boolean to 1/0
        roll_description: values.roll_description || "-",
      };

      const url = editData
        ? `${var_api}rollmaster/update/${editData.id}`
        : `${var_api}rollmaster/post`;
      const method = editData ? "PUT" : "POST";

      setLoading(true);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 400) {
        const errorData = await response.json();
        notification.warning({
          message: "Duplicate Entry",
          description: errorData.message || "Duplicate role name.",
        });
        return;
      }

      if (!response.ok) throw new Error("Error saving data");

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
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleDeleteConfirm = (id, roll_name) => {
    setDeleteId(id);
    setDeletename(roll_name);
    setIsDeleteConfirmVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setIsDeleteConfirmVisible(false);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ultratoken');
      const response = await fetch(
        `${var_api}rollmaster/delete/${deleteId}`,
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
      handleDeleteCancel();
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Delete Failed",
        description: "There was an error while deleting the record.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "S No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Role Name",
      dataIndex: "roll_name",
      render: (text) => text || "N/A",
      sorter: (a, b) => a.roll_name?.localeCompare(b.roll_name),
    },
    {
      title: "Role Description",
      dataIndex: "roll_description",
      render: (text) => text || "N/A",
    },
    {
      title: "Role For",
      dataIndex: "is_nontech",
      render: (text) => {
        if (text === 0) return "Tech";
        if (text === 1) return "Non-Tech";
        return "N/A";
      },
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="text-start">
          <a
            href="#"
            className="me-1 btn btn-sm bg-success-light"
            onClick={() => handleModalOpen(record)}
          >
            <i className="fe fe-pencil"></i> Edit
          </a>
          <a
            href="#"
            className="me-1 btn btn-sm bg-danger-light"
            onClick={() => handleDeleteConfirm(record.id, record.roll_name)}
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
                <h3 className="page-title">Role Master Tables</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Role Master Tables</li>
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
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Role Master</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      pagination={{
                        total: filteredData.length,
                        pageSize: pageSize,
                        current: currentPage,
                        showSizeChanger: false,
                        onChange: handlePaginationChange,
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

      {/* Add/Edit Modal */}
      <Modal
        title={editData ? "Edit Rollmaster" : "Add New Rollmaster"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            label={<span>Role Name <span style={{ color: "red" }}>*</span></span>}
            name="roll_name"
            rules={[{ required: true, message: "Please input the Role Name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role Description"
            name="roll_description"
          >
            <Input />
          </Form.Item>

          <Form.Item name="is_nontech" valuePropName="checked">
            <Checkbox>
              {form.getFieldValue("is_nontech") ? "is_nontech" : "is_nontech"}
            </Checkbox>
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
        onCancel={handleDeleteCancel}
        footer={null}
      >
        <p>Are you sure you want to delete this Role master "<span style={{fontWeight:"bold"}}>{deletename}</span>"?</p>
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

export default RollMaster;