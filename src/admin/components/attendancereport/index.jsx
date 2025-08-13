import React, { useState, useEffect } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import SidebarNav from "../sidebar";
import { Table, Button, Input, notification, DatePicker} from "antd";
import { itemRender } from "../paginationfunction";
import { Link } from "react-router-dom";
import { image_api, var_api } from "../../../constant";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";


const AttendanceReport = () => {
    const getFirstDayOfMonth = () => {
        const currentDate = new Date();
        return `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-01`;
      };
    
      const getLastDayOfMonth = () => {
        const currentDate = new Date();
        const lastDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        return `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${lastDay.getDate().toString().padStart(2, "0")}`;
      };
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isTechData, setIsTechData] = useState(true); // Toggle between tech and non-tech data
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getLastDayOfMonth());
  const [selectedDate, setSelectedDate] = useState(null);
 

  const fetchTechData = async (startDate, endDate) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");

    const endpoint = `${var_api}techstaffattendance/getdetailsbtw/${hospital_id}/${startDate}/${endDate}`;

    try {
      const response = await fetch(endpoint, {
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

  const fetchNonData = async (startDate, endDate) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const hospital_id = localStorage.getItem("hospital_id");

    const endpoint =`${var_api}nontechstaffattendance/getdetailsbtw/${hospital_id}/${startDate}/${endDate}`;

    try {
      const response = await fetch(endpoint, {
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

//   useEffect(() => {
//     fetchTechData(startDate, endDate);
//   }, [startDate, endDate]);

useEffect(() => {
  // Set the default selected date to the current date when the component mounts
  setSelectedDate(new Date());
}, []);


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter((item) => {
      const nameMatch = item.tech_name
        ?.toLowerCase()
        .includes(value);
        const specializationmatch = item.specialization
        ?.toLowerCase()
        .includes(value);
        const rollmatch = item.roll
        ?.toLowerCase()
        .includes(value);

      return nameMatch || specializationmatch || rollmatch;
    });

    setFilteredData(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // const handleDateRange = (event, picker) => {
  //   setStartDate(moment(picker.startDate).format("YYYY-MM-DD"));
  //   setEndDate(moment(picker.endDate).format("YYYY-MM-DD"));
  //   isTechData ? fetchTechData(startDate, endDate) : fetchNonData(startDate, endDate);
  // };

  
  const handleDateChange = (date) => {
    // Check if the date is valid using moment
    if (!date || !date.isValid()) return;
  
    // Log the selected date (use moment's formatted string)
    console.log("Selected date:", date.format("YYYY-MM-DD"));
  
    // Update state with the moment object, not a Date object
    setSelectedDate(date);
    
  
    // Call fetchData with the formatted date
    // type={!isTechData ? "primary" : "default"}
    !isTechData ? fetchNonData(date.format("YYYY-MM-DD")) : fetchTechData(date.format("YYYY-MM-DD")) ;
  };

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };


  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Name",
      dataIndex: "tech_name",
      render: (text) => text || "-",
    },
    {
      title: "Profile",
      dataIndex: "profile_image",
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
    // {
    //   title: "Specialization",
    //   render: (_, record) =>
    //     record.roll === "doctor" ? record.specialization || "-" : "-",
    // },
    {
      title: "Roll",
      dataIndex: "roll",
      render: (text) => text || "-",
    },
    {
      title: "Present Days",
      dataIndex: "present_days",
      render: (text) => text || "-",
    },
    {
      title: "OverAll Time",
      dataIndex: "total_work_minutes",
      render: (text) => {
        if (!text) return "-";
        const hours = Math.floor(text / 60);
        const minutes = text % 60;
        return `${text} (${hours} hrs ${minutes} min)`;
      },
    },
    {
      title: "Break Time ",
      dataIndex: "total_break_minutes",
      render: (text) => {
        if (!text) return "-";
        const hours = Math.floor(text / 60);
        const minutes = text % 60;
        return `${text} (${hours} hrs ${minutes} min)`;
      },
    },
    {
      title: "Actual Working Time ",
      dataIndex: "total_without_break_minutes",
      render: (text) => {
        if (!text) return "-";
        const hours = Math.floor(text / 60);
        const minutes = text % 60;
        return `${text} (${hours} hrs ${minutes} min)`;
      },
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
                <h3 className="page-title">Attendance Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Attendance Report</li>
                </ul>
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
            <div className="col-md-4">
            <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
      className="form-control datetimepicker"
      style={{
        width: "150px",
        fontSize: "12px",
        padding: "5px",
      }}
    />
            </div>
            <div className="col-md-4 text-end">
  <Button
    type={isTechData ? "primary" : "default"}
    onClick={() => {
      setIsTechData(true);
      fetchTechData(startDate, endDate);
    }}
    style={{ marginRight: "10px" }}
  >
    Technical Staff
  </Button>
  <Button
    type={!isTechData ? "primary" : "default"}
    onClick={() => {
      setIsTechData(false);
      fetchNonData(startDate, endDate);
    }}
  >
    Non-Technical Staff
  </Button>
</div>

          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">
                    {isTechData ? "Tech Staff" : "Non-Tech Staff"} Report
                  </h4>
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
    </>
  );
};

export default AttendanceReport;
