import { Link } from "react-router-dom";
import Header from "../../../header";
import DoctorFooter from "../../../common/doctorFooter/index.jsx";
import DoctorSidebar from "../../../doctors/sidebar/index.jsx";
import {doctorthumb02,logo} from "../../../imagepath";
import React, { useState, useEffect } from "react";
import {useHistory } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { var_api, image_api } from "../../../../../constant.js";
import patientdashboardprofile01 from "../../../../assets/img/patients/pat_dummy.png";


const Invoices = (props) => {
  const [invoicebilling, setinvoicebilling] = useState([]);
  const doc_id = localStorage.getItem("doctor_id");
  const token = localStorage.getItem("doc_token");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;  // Number of items per page
  const history = useHistory();
  const [selectedinvoicebillingdetails, setselectedinvoicebillingdetails] = useState([]);
  const [selectedinvoicebilling, setselectedinvoicebilling] = useState(null);
  const hospital_profile =  localStorage.getItem("hospital_profile");
  const appointment_prefix = localStorage.getItem("admin_appointment_prefix");
  const invoiced_prefix = localStorage.getItem("admin_invoiced_prefix");
  const invoicem_prefix = localStorage.getItem("invoicem_prefix");
  const prescription_prefix = localStorage.getItem("prescription_prefix");
  const patient_prefix = localStorage.getItem("patient_prefix");
  const [profileDetails, setProfileDetails] = useState(null);


  const fetchDoctorDetails = async () => {
    const token = localStorage.getItem("doc_token");
    const doc_id = localStorage.getItem("doctor_id");
    try {
      setLoading(true);
      const response = await axios.get(`${var_api}technicalstaff/get/${doc_id}`, {
        headers: {
          Authorization: token,
        },
      });
      setProfileDetails(response.data);
      localStorage.setItem("doctor_name", response.data?.name);
      localStorage.setItem("doctor_profile", response.data?.profile_image);
      localStorage.setItem("doctor_available", response.data?.is_available);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching doctor details:", err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleinvoicebillingdetailsClick = (id) => {
    const invoice = invoicebilling.find(
      (invc) => invc.id === id
    );

    if (invoice && invoice.details) {
      setselectedinvoicebillingdetails(invoice.details);
      setselectedinvoicebilling(invoice);
    } else {
      setselectedinvoicebillingdetails([]);
      setselectedinvoicebilling(null);
    }
  };

  const handleDownloadPDF = () => {
    const pdfName = `${selectedinvoicebilling?.patient_details?.name || "Patient"}-${
      selectedinvoicebilling?.invoice_token || "INV000"
    }-${formatDate(selectedinvoicebilling?.appointment_day || "")}.pdf`;
  
    // Select the modal content to download
    const invoiceContent = document.querySelector(".invoice-content");
  
    if (invoiceContent) {
      html2canvas(invoiceContent, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
  
        // Set PDF dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(pdfName);
      });
    } else {
      alert("Invoice content not found.");
    }
  };
  useEffect(() => {
        fetchData();
        fetchDoctorDetails();
      }, [doc_id, token]);
  
    //listing the appointments
    const fetchData = async () => {
      setLoading(true);
      try {
       
        const response = await fetch(`${var_api}invoicebilling/get-doctor-invoices/${doc_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
  
        if (response.status === 401) {
          setLoading(false);
          // history.push("/login");
          return; 
        }
  
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setinvoicebilling(result || []);
        setLoading(false);
       // setFilteredData(result || []); // Set initial filtered data
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      //  notification.error({
       //   message: "Fetch Failed",
       //   description: "Unable to retrieve data. Please try again later.",
       // });
      } finally {
        setLoading(false);
      }
    };
    function formatDate(dateString) {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
    
      // Validate the input
      if (!dateString || typeof dateString !== "string") {
        console.error("Invalid or missing date string:", dateString);
        return "Invalid Date"; // Return a default value for invalid input
      }
    
      // Try parsing as an ISO date first
      const date = new Date(dateString);
    
      if (!isNaN(date.getTime())) {
        // Valid ISO date
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      }
    
      // Handle custom 'dd-mm-yyyy' format
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
      }
    
      // If all parsing attempts fail
      console.error("Unexpected date format:", dateString);
      return "Invalid Date";
    }
    



    const filteredinvoicebilling = invoicebilling.filter((invc) => {
      const searchString = searchTerm.toLowerCase();
      return (
        invc.patient_details.name?.toLowerCase().includes(searchString) ||
        (`#${invc.invoice_token}`.toLowerCase().includes(searchString)) ||
        invc.final_amount?.toString().toLowerCase().includes(searchString) ||
        formatDate(invc.appointment_day).toLowerCase().includes(searchString) ||
        formatDate(invc.created_at).toLowerCase().includes(searchString)
      );
    });
     // Pagination logic
     const totalPages = Math.ceil(filteredinvoicebilling.length / itemsPerPage);
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = filteredinvoicebilling.slice(indexOfFirstItem, indexOfLastItem);
   
     // Handle page change
     const paginate = (pageNumber) => setCurrentPage(pageNumber);
    

  return (
    <div>
      <Header profileDetails={profileDetails}  />
         {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Invoices</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Invoices
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
             <DoctorSidebar
             profileDetails={profileDetails}
             setProfileDetails={setProfileDetails}
             />
              {/* /Profile Sidebar */}
            </div>
            {/* Invoices */}
            <div className="col-lg-8 col-xl-9">
              <div className="dashboard-header">
                <h3>Invoices</h3>
              </div>
              <div className="search-header">
                <div className="search-field">
                <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                  <span className="search-icon">
                    <i className="fa-solid fa-magnifying-glass" />
                  </span>
                </div>
              </div>
              <div className="custom-table">
  {loading ? (
    <div className="text-center">
      <span>Loading...</span>
    </div>
  ) : (
    <div className="table-responsive">
      <table className="table table-center mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Appointment Date</th>
            <th>Booked on</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((invc, index) => (
              <tr key={index}>
                <td>
                  <Link
                    to="#"
                    className="text-blue-600"
                    data-bs-toggle="modal"
                    data-bs-target="#invoice_view"
                  >
                    #{invoiced_prefix}{invc.invoice_token || "N/A"}
                  </Link>
                </td>
                <td>
                  <h2 className="table-avatar">
                    <Link
                      to="/patient/doctor-profile"
                      className="avatar avatar-sm me-2"
                    >
                      <img
                        className="avatar-img rounded-3"
                        src={
                          invc.patient_details?.profile_image &&
                          /\.(jpeg|jpg|png|webp)$/i.test(
                            invc.patient_details.profile_image
                          )
                            ? `${image_api}${invc.patient_details.profile_image}`
                            : patientdashboardprofile01
                        }
                        alt="User"
                      />
                    </Link>
                    <Link to="/patient/doctor-profile">
                      {invc.patient_details?.name || "Unknown Patient"}
                    </Link>
                  </h2>
                </td>
                <td>{formatDate(invc.appointment_day) || "N/A"}</td>
                <td>{formatDate(invc.created_at) || "N/A"}</td>
                <td>{invc.final_amount || "N/A"}</td>
                <td>
                  <div className="action-item">
                    <Link
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#invoice_view"
                      onClick={() => handleinvoicebillingdetailsClick(invc.id)}
                    >
                      <i className="fa-solid fa-link" />
                    </Link>
                    {/* <Link to="#">
                      <i className="fa-solid fa-print" />
                    </Link> */}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</div>

              {/* Pagination */}
                <div className="pagination dashboard-pagination">
                    <ul>
                      <li>
                        <Link
                          to="#"
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        >
                          <i className="fa-solid fa-chevron-left" />
                        </Link>
                      </li>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index + 1}>
                          <Link
                            to="#"
                            className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                            onClick={() => paginate(index + 1)}
                          >
                            {index + 1}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="#"
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        >
                          <i className="fa-solid fa-chevron-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
              {/* /Pagination */}
            </div>
            {/* /Invoices */}
          </div>
        </div>
      </div>
      {/* /Page Content */}
       {/*View Invoice */}
       <div
  className="modal fade custom-modals"
  id="invoice_view"
  tabIndex="-1"
  aria-labelledby="invoice_viewLabel"
  aria-hidden="true"
  style={{ marginTop: '40px' }}
>
  <div
    className="modal-dialog modal-dialog-centered modal-lg"
    role="document"
  >
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">View Invoice</h3>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
      <div className="modal-body pb-0">
        <div className="prescribe-download">
        <h5>{formatDate(selectedinvoicebilling ? selectedinvoicebilling.appointment_day : "")}</h5>
        <ul>
            <li>
              <Link to="#" className="print-link">
                <i className="fa-solid fa-print" />
             </Link>
            </li>
            <li>
              <Link to="#" className="btn btn-primary prime-btn"  onClick={handleDownloadPDF}>
                Download
             </Link>
            </li>
          </ul>
        </div>
        <div className="view-prescribe invoice-content">
  <div className="invoice-item">
    <div className="row">
      <div className="col-md-6">
        <div className="invoice-logo">
          <img src={hospital_profile&&
                                          /\.(jpeg|jpg|png|webp)$/i.test(hospital_profile) ? `${image_api}hospital_image/${hospital_profile}` : logo} alt="logo" />
        </div>
      </div>
      <div className="col-md-6">
        <p className="invoice-details">
        <strong>Invoice No : </strong> {invoiced_prefix}{selectedinvoicebilling?.invoice_token||"N/A"}
          <br />
          <strong>Issued:</strong>
          {formatDate(selectedinvoicebilling?.appointment_day || "")}
        </p>
      </div>
    </div>
  </div>

  <div className="invoice-item">
    <div className="row">
      <div className="col-md-4">
        <div className="invoice-info">
          <h6 className="customer-text">Billing From</h6>
          <p className="invoice-details invoice-details-two">
            {selectedinvoicebilling?.tech_details?.name || "Unknown Technician"}
            <br />
            {selectedinvoicebilling?.hospital_details?.name || "N/A"},<br />
            {selectedinvoicebilling?.hospital_details?.address || "N/A"},<br />
            {selectedinvoicebilling?.hospital_details?.state || "N/A"},{" "}
            {selectedinvoicebilling?.hospital_details?.country || "N/A"}
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="invoice-info">
          <h6 className="customer-text">Billing To</h6>
          <p className="invoice-details invoice-details-two">
            {selectedinvoicebilling?.patient_details?.name || "N/A"} <br />
            {selectedinvoicebilling?.patient_details?.full_address || "N/A"}
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="invoice-info invoice-info2">
          <h6 className="customer-text">Payment Method</h6>
          <p className="invoice-details">
            {selectedinvoicebilling?.pay_modes || "N/A"} <br />
            {/* XXXXXXXXXXXX-2541
            <br />
            HDFC Bank */}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div className="invoice-item invoice-table-wrap">
    <div className="row">
      <div className="col-md-12">
        <h6>Invoice Details</h6>
        <div className="table-responsive">
          <table className="invoice-table table table-bordered">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedinvoicebillingdetails?.length > 0 ? (
                selectedinvoicebillingdetails.map((details, index) => (
                  <tr key={index}>
                    <td>{details?.service_details?.service_name || "N/A"}</td>
                    <td>{details?.quantity || 0}</td>
                    <td>{details?.unit_price || 0}</td>
                    <td>{details?.total_amount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Invoice billing details available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-md-6 col-xl-4 ms-auto">
        <div className="table-responsive">
          <table className="invoice-table-two table">
            <tbody>
              <tr>
                <th>Subtotal:</th>
                <td>
                  <span>{selectedinvoicebilling?.sub_total || 0}</span>
                </td>
              </tr>
              <tr>
                <th>Discount:</th>
                <td>
                  <span>{selectedinvoicebilling?.any_discount || 0}%</span>
                </td>
              </tr>
              <tr>
                <th>Total Amount:</th>
                <td>
                  <span>{selectedinvoicebilling?.final_amount || 0}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div className="other-info mb-0">
    <h4>Other information</h4>
    <p className="text-muted mb-0">
      {selectedinvoicebilling?.clinical_notes || "No clinical notes available."}
    </p>
  </div>
</div>

      </div>
    </div>
  </div>
</div>
{/* /View Invoice */}
      <DoctorFooter />

    </div>
  );
};

export default Invoices;
