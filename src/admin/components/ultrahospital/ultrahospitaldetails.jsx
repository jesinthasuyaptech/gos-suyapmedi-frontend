import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Button, notification } from "antd";
import { var_api } from "../../../constant";

const UltraHospitalDetails = () => {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);



  const fetchData = async () => {
    setLoading(true);
    const ultratoken = localStorage.getItem("ultratoken");

    try {
      const response = await fetch(`${var_api}hospital/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${ultratoken}`,
        },
      });

      if (response.status === 401) {
        notification.warning({
          message: "Unauthorized",
          description: "Your session has expired. Please log in again.",
        });
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result || []);
      setFilteredData(result);
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

  if (!hospital) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-4">
      
      </div>

      <div className="hospital-details">
        <h2>{hospital.name}</h2>
        <p>
          <strong>Address:</strong> {hospital.address}
        </p>
        <p>
          <strong>Mobile:</strong> {hospital.mobile}
        </p>
        <p>
          <strong>Email:</strong> {hospital.email}
        </p>
      </div>

      {/* Table for hospital-related data */}
     
    </div>
  );
};

export default UltraHospitalDetails;
