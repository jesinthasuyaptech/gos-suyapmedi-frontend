import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarNav from '../sidebar';
import { var_api } from "../../../constant";
import LatestCustomer from './LastestCustomer';
import Header from '../header';

const Dashboard = () => {
  const [billCount, setBillCount] = useState(0);
  const [newbillCount, setNewBillCount] = useState(0);
  const [billdeliveryCount, setDeliveryCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    fetchBillCounts();
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("user_data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserName(parsedData.name);
    }
  }, []);

  const fetchBillCounts = async () => {
    const token = localStorage.getItem("pres_token");
    const hospital_id = localStorage.getItem("pres_hospital_id");
    setLoading(true);
    try {
      const todayBillResponse = await axios.get(`${var_api}medicalbilling/today-bill-count/${hospital_id}`, {
        headers: { Authorization: token },
      });
      setBillCount(todayBillResponse.data.today_bill_count || 0);

      const newBillResponse = await axios.get(`${var_api}medicalbilling/bill-new-count/${hospital_id}`, {
        headers: { Authorization: token },
      });
      setNewBillCount(newBillResponse.data.new_bill_count || 0);

      const deliveryBillResponse = await axios.get(`${var_api}medicalbilling/bill-delivery-count/${hospital_id}`, {
        headers: { Authorization: token },
      });
      setDeliveryCount(deliveryBillResponse.data.delivery_bill_count || 0);

    } catch (err) {
      console.error("Error fetching bill counts:", err);
    }
    setLoading(false);
  };

  const maxCount = Math.max(billCount, newbillCount, billdeliveryCount, 1);

  return (
    <div className="page-wrapper">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <SidebarNav />
      <Header />
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Welcome {userName ? userName : "Guest"}!!</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item active">Dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-primary border-primary">
                    <i className="fe fe-money" />
                  </span>
                  <div className="dash-count">
                    <h3>{billCount}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Bill Count Today</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-primary" style={{ width: `${(billCount / maxCount) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-success">
                    <i className="fe fe-credit-card" />
                  </span>
                  <div className="dash-count">
                    <h3>{newbillCount}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">New Count Today</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success" style={{ width: `${(newbillCount / maxCount) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-danger border-danger">
                    <i className="fe fe-folder" />
                  </span>
                  <div className="dash-count">
                    <h3>{billdeliveryCount}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Delivery Count Today</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-danger" style={{ width: `${(billdeliveryCount / maxCount) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LatestCustomer />
      </div>
    </div>
  );
};

export default Dashboard;
