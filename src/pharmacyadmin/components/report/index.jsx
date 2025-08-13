import React, { useState } from "react";
import SidebarNav from "../sidebar";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const buttonStyle = {
  marginTop: "12px",
  display: "inline-block",
  padding: "8px 16px",
  textDecoration: "none",
  borderRadius: "4px",
  background: "#007bff",
  color: "#fff",
  cursor: "pointer",
};

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  padding: "16px",
  justifyContent: "center",
};

const Card = ({ title, description, path }) => {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={path} style={buttonStyle}>
        View More
      </Link>
    </div>
  );
};

const Page = ({ title }) => {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>{title}</h1>
      <p>This is the {title} page.</p>
      <Link to="/pharmacyadmin" style={buttonStyle}>
        Back to Home
      </Link>
    </div>
  );
};

const report = () => {
  const cards = [
    { title: "Card 1", description: "This is Card 1.", path: "/card-1" },
    { title: "Card 2", description: "This is Card 2.", path: "/card-2" },
    { title: "Card 3", description: "This is Card 3.", path: "/card-3" },
    { title: "Card 4", description: "This is Card 4.", path: "/card-4" },
    { title: "Card 5", description: "This is Card 5.", path: "/card-5" },
  ];

  const pathname = location.pathname;

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid pb-0">
           <div className="page-header">
                     <div className="row">
                       <div className="col">
                         <h3 className="page-title">Reports</h3>
                         <ul className="breadcrumb">
                           <li className="breadcrumb-item">
                             <Link to="/pharmacyadmin">Dashboard</Link>
                           </li>
                            
                           <li className="breadcrumb-item active">
                              Reports
                           </li>
                         </ul>
                       </div>
                     </div>
                   </div>
          <div className="row">
           
            <div className="col-xl-3 col-sm-6 col-12">
              <Link
            to="/pharmacyadmin/paymode"
                className={pathname?.includes("paymode") ? "active" : ""}
              >
                {" "}
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-danger border-danger">
                        <i className="fe fe-money" />
                      </span>
                      <div className="dash-count">
                        {/* <h3>{totalappointment}</h3> */}
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Paymode</h6>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <Link
                to="/pharmacyadmin/medicienreport"
                className={pathname?.includes("medicienreport") ? "active" : ""}
              >
                {" "}
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-danger border-danger">
                        <i className="fe fe-money" />
                      </span>
                      <div className="dash-count">
                        {/* <h3>{totalappointment}</h3> */}
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Medicien Report</h6>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

          






          </div>
      
        </div>
      </div>
    </>
  );
};

export default report;
