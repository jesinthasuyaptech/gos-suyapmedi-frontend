import React, { useState, useEffect } from 'react';
import { client_01, client_02, client_03, client_04 } from '../../imagepath';
import { Link } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";
import { var_api } from '../../../../constant';
import { notification } from 'antd';


function Notification() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [patientNotifications, setPatientNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Adjust as needed
  const totalPages = Math.ceil(patientNotifications.length / itemsPerPage);

  useEffect (()=>{
    fetchNotification();
  }, [])

  //patient notification data
    const fetchNotification = async () => {
      setLoading(true);
      const token = localStorage.getItem('patient_token');
      const hospital_id = localStorage.getItem('Patient_HospitalId');
      const patient_id = localStorage.getItem('patient_id');
  
      try {
        const response = await fetch(`${var_api}patientnotification/get-by-patient/${patient_id}/${hospital_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, 
          },
        });
        if (response.status === 401) {
                history.push("/patient/patientlogin"); // Redirect to login page
                notification.warning({
                  message: "Unauthorized",
                  description: "Your session has expired. Please log in again.",
                });
              return;
              }
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setPatientNotifications(result || []);
        if (response.status === 404) {
          setPatientNotifications([]);
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

 // Filter notifications based on search query
 const filteredNotifications = patientNotifications.filter((notification) =>
  notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  notification.description.toLowerCase().includes(searchQuery.toLowerCase())
);

 // Paginate the filtered notifications
 const currentItems = filteredNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 // Determines the pagination range to display
 const getPaginationRange = () => {
   let start = Math.max(1, currentPage - 1);
   let end = Math.min(totalPages, start + 2);

   // Ensure we always show exactly 3 pages
   if (end - start < 2) {
     start = Math.max(1, end - 2);
   }
   
   return Array.from({ length: end - start + 1 }, (_, index) => start + index);
 };

 // Handle page change
 const handlePageChange = (page) => {
   if (page >= 1 && page <= totalPages) {
     setCurrentPage(page);
   }
 };


 // Mark as read API integration
 const markAsRead = async (notificationId) => {
  const token = localStorage.getItem('patient_token');
  setLoading(true);
  
  try {
    const response = await fetch(`${var_api}patientnotification/update/${notificationId.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        title: notificationId.title, 
        description: notificationId.description, 
        read_status: 1, // Update read_status to 1 (read)
      }),
    });

    if (!response.ok) throw new Error('Failed to update read status');
    
    // Update the local state to reflect the change
    // setPatientNotifications((prevNotifications) =>
    //   prevNotifications.map((notification) =>
    //     notification.id === notificationId
    //       ? { ...notification, read_status: 1 } // Set read_status to 1 for the updated notification
    //       : notification
    //   )
    // );
    
    // Optionally, you can show a success notification
    notification.success({
      message: "Success",
      description: "Notification marked as read.",
    });

    fetchNotification();

  } catch (error) {
    console.error("Error marking as read:", error);
    notification.error({
      message: "Error",
      description: "Failed to mark the notification as read.",
    });
  } finally {
    setLoading(false);
  }
};



  return (
  <>
      {/* Notification Icon */}
    
      <li className="nav-item noti-nav me-3 pe-0 position-relative">
  <Link to="#" className="nav-link p-0" onClick={handleShow}>
    <span className="badge position-absolute top-0 start-100 translate-middle bg-danger rounded-pill">
      {patientNotifications?.length}
    </span>
    <i className="fa-solid fa-bell" />
  </Link>
</li>


      {/* Modal for Notifications */}
      <Modal show={show} onHide={handleClose} centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
          
        </Modal.Header>
        <Modal.Body>

        <div style={{ marginLeft: "auto", width: "250px" }}>
    <div className="input-block dash-search-input" style={{ position: "relative" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
        style={{ width: "100%" }}
      />
      <span className="search-icon" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}>
        <i className="fa-solid fa-magnifying-glass" />
      </span>
    </div>
  </div>
      

          <div className="custom-new-table mt-2">
                                        <div className="table-responsive">
                                        <table className="table table-hover table-center mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="position-relative">
  {loading ? (
    <tr>
      <td colSpan="9" className="text-center position-relative">
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      </td>
    </tr>
  ) : currentItems.length > 0 ? (
    currentItems.map((appointment, index) => {
      // Calculate serial number based on the page and items per page
      const serialNumber = (currentPage - 1) * itemsPerPage + (index + 1);
      
      return (
        <tr key={appointment.id}>
          <td>{serialNumber}</td> {/* Updated Serial Number */}
        <td>{appointment.title || "N/A"}</td>
        <td>{appointment.description || "0"}</td>
        <td>{appointment.read_status == 0 ?  <button type="submit" className="btn-sm btn-primary prime-btn" onClick={() => markAsRead(appointment)}>
                   Mark as read
                  </button> : "Read"}</td>
      </tr>
      );
})
  ) : (
    <tr>
      <td colSpan="9" className="text-center">No Appointments Found</td>
    </tr>
  )}
</tbody>

          </table>
          
                                        </div>
                                      </div>
                                       {/* Pagination */}
                                       <div className="pagination dashboard-pagination">
            <ul>
              <li>
                <Link
                  to="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`page-link ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <i className="fa-solid fa-chevron-left" />
                </Link>
              </li>

              {getPaginationRange().map((pageNumber) => (
                <li key={pageNumber}>
                  <Link
                    to="#"
                    onClick={() => handlePageChange(pageNumber)}
                    className={`page-link ${currentPage === pageNumber ? "active" : ""}`}
                  >
                    {pageNumber}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  to="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`page-link ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <i className="fa-solid fa-chevron-right" />
                </Link>
              </li>
            </ul>
          </div>
                                                                                    {/* /Pagination */}
          {/* <ul className="notification-list">
            <li className="notification-message">
              <Link to="#">
                <div className="media d-flex">
                  <span className="avatar">
                    <img className="avatar-img" alt="" src={client_01} />
                  </span>
                  <div className="media-body">
                    <h6>
                      Travis Tremble <span className="notification-time">18.30 PM</span>
                    </h6>
                    <p className="noti-details">
                      Sent a payment of $210 for his appointment{" "}
                      <span className="noti-title">Dr. Ruby Perin</span>
                    </p>
                  </div>
                </div>
              </Link>
            </li>
            <li className="notification-message">
              <Link to="#">
                <div className="media d-flex">
                  <span className="avatar">
                    <img className="avatar-img" alt="" src={client_02} />
                  </span>
                  <div className="media-body">
                    <h6>
                      Travis Tremble <span className="notification-time">12 Min Ago</span>
                    </h6>
                    <p className="noti-details">
                      has booked an appointment with{" "}
                      <span className="noti-title">Dr. Hendry Watt</span>
                    </p>
                  </div>
                </div>
              </Link>
            </li>
            <li className="notification-message">
              <Link to="#">
                <div className="media d-flex">
                  <span className="avatar">
                    <img className="avatar-img" alt="" src={client_03} />
                  </span>
                  <div className="media-body">
                    <h6>
                      Travis Tremble <span className="notification-time">6 Min Ago</span>
                    </h6>
                    <p className="noti-details">
                      Sent a payment of $210 for his appointment{" "}
                      <span className="noti-title">Dr. Maria Dyen</span>
                    </p>
                  </div>
                </div>
              </Link>
            </li>
            <li className="notification-message">
              <Link to="#">
                <div className="media d-flex">
                  <span className="avatar">
                    <img className="avatar-img" alt="" src={client_04} />
                  </span>
                  <div className="media-body">
                    <h6>
                      Travis Tremble <span className="notification-time">8.30 AM</span>
                    </h6>
                    <p className="noti-details">Sent a message to his doctor</p>
                  </div>
                </div>
              </Link>
            </li>
          </ul> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Notification;