import Header from '../../header'
import { Link } from "react-router-dom";
import { doctor_thumb_01, doctor_thumb_02, doctor_thumb_03, doctor_thumb_05, 
  doctor_thumb_07, doctor_thumb_08, doctor_thumb_09, logo } from '../../imagepath';
import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import { var_api, image_api } from "../../../../constant.js";
import Footer from '../../footer';
import DashboardSidebar from '../dashboard/sidebar/sidebar';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { doc_dummy } from '../../imagepath';

const PatientInvoice = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedpatientdetails, setPatientdetails] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const invoicedprefix = localStorage.getItem("admin_invoiced_prefix");
  const [loading, setLoading] = useState(false);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.patient_details?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.invoice_token.toLowerCase().includes(searchQuery.toLowerCase())
  );



  
  const itemsPerPage = 5;


   // Format date function
   const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  
  console.log("Current Invoices:", currentInvoices);
  console.log("Filtered Invoices Length:", filteredInvoices.length);
  useEffect(() => {
    fetchPatientInvoice();
    fetchpatientdetails();
  }, []);

 
  const fetchPatientInvoice = async () => {
    setLoading(true);
    const token = localStorage.getItem("patient_token");
    const patient_id = localStorage.getItem("patient_id");
    const hospital_id = localStorage.getItem("Patient_HospitalId");

    try {
      const response = await axios.get(
        `${var_api}invoicebilling/get-patient-invoices/${hospital_id}/${patient_id}`,
        //`${var_api}invoicebilling/get-patient-invoices/${hospital_id}/${patient_id}`,
        {
          headers: { Authorization: `${token}` }, // Ensure proper format
        }
      );
      setInvoices(response.data); // Store the fetched data
    } catch (err) {
      console.error("Error fetching patient invoices:", err);
    }
  };
   const fetchpatientdetails = async () => {
      const token = localStorage.getItem("patient_token");
      const patient_id = localStorage.getItem("patient_id");
      // if (!token || !patient_id || !hospital_id) {
      //   console.warn("Missing authentication details.");
      //   return;
      // }
      try {
        const response = await axios.get(
          `${var_api}patientdetails/get/${patient_id}`,
          {
            headers: {
              Authorization: `${token}`, // Ensure proper format
            },
            
          }
        );
        setPatientdetails(response.data);
  
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching doctor details:", err);
        }
      } finally{
        setLoading(false);
      }
    };


    const openInvoiceModal = (invoice) => {
      setSelectedInvoice(invoice); // Set the selected invoice data
     
    };
    
    const handleDownloadPDF = () => {
      const input = document.getElementById("invoice_view_data");
    
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
    
        // Calculate best height to fit everything on one page
        const imgWidth = 210; // A4 width
        const imgHeight = (canvas.height * imgWidth) / canvas.width; 
    
        // If height exceeds A4 page, scale down
        if (imgHeight > 297) {
          pdf.addImage(imgData, "PNG", 0, 10, imgWidth, 280); // Adjust height
        } else {
          pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
        }
    
        pdf.save(`INV-${selectedInvoice.invoice_token}_${formatDate(selectedInvoice.created_at)}.pdf`);      });
    };
  return (
    <>
    <div className='main-wrapper'>
      <Header {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
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
             <DashboardSidebar/>
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
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
                  <span className="search-icon">
                    <i className="fa-solid fa-magnifying-glass" />
                  </span>
                </div>
              </div>
              <div className="custom-table">
      <div className="table-responsive">
        <table className="table table-center mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Appointment Date</th>
              <th>Booked on</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <Link
                      to="#"
                      className="text-blue-600"
                      data-bs-toggle="modal"
                      data-bs-target="#invoice_view"
                    >
                      #{invoicedprefix}{invoice.invoice_token}
                    </Link>
                  </td>
                  <td>
                    <h2 className="table-avatar">
                      <Link to="/patient/doctor-profile" className="avatar avatar-sm me-2">
                        <img
                                               className="avatar-img rounded-3"
                                               src={
                                                invoice.tech_details?.profile_image &&
                                                 /\.(jpeg|jpg|png|webp)$/i.test(
                                                  invoice.tech_details.profile_image
                                                 )
                                                   ? `${image_api}${invoice.tech_details.profile_image}`
                                                   : doc_dummy
                                               }
                                               alt="doctor"
                                             />
                      </Link>
                      <Link to="/patient/doctor-profile">
                        {invoice.tech_details?.name || ""}
                      </Link>
                    </h2>
                  </td>
                  <td>{invoice.appointment_day}</td>
                  <td>{formatDate(invoice.created_at)}</td>
                  <td>{invoice.final_amount || "0"}</td>
                  <td>
                    <div className="action-item">
                    <Link
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#invoice_view"
                      onClick={() => openInvoiceModal(invoice)}
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
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination dashboard-pagination">
          <ul>
            <li>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-link"
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-link"
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
              {/* /Pagination */}
            </div>
            {/* /Invoices */}
          </div>
        </div>
      </div>
      {/* /Page Content */}
      
<Footer {...props} />

    </div>
     {/*View Invoice */}
     <div className="modal fade custom-modals" id="invoice_view" >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">View Invoice</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body pb-0">
              {selectedInvoice && (
                  <div className="prescribe-download">
                  <h5>{formatDate(selectedInvoice.created_at)}</h5>
                  <ul>
                    {/* <li>
                      <Link to="#" className="print-link">
                        <i className="fa-solid fa-print" />
                     </Link>
                    </li> */}
                   <li>
                    <Link to="#" className="btn btn-primary prime-btn" onClick={handleDownloadPDF}>
                      Download
                    </Link>
                  </li>
          </ul>
        </div>
         )}
         {selectedInvoice && (
                <div className="view-prescribe invoice-content" id="invoice_view_data">
                  <div className="invoice-item">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="invoice-logo">
                        <img src={logo} alt="logo" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <p className="invoice-details">
                          <strong>#{invoicedprefix}</strong>-{selectedInvoice.invoice_token}
                          <br />
                          <strong>Issued:</strong> {formatDate(selectedInvoice.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

   {/* Invoice Item */}
   <div className="invoice-item">
            <div className="row">
              <div className="col-md-4">
                <div className="invoice-info">
                  <h6 className="customer-text">Billing From</h6>
                  <p className="invoice-details invoice-details-two">
                  {selectedInvoice.tech_details ? selectedInvoice.tech_details.name : "N/A"} <br />
                  {selectedInvoice.hospital_details ? selectedInvoice.hospital_details.name : "N/A"} <br />
                   {selectedInvoice.hospital_details ? selectedInvoice.hospital_details.address : "N/A"} <br />
                   {selectedInvoice.hospital_details ? selectedInvoice.hospital_details.state : "N/A"} <br />
                   {selectedInvoice.hospital_details ? selectedInvoice.hospital_details.country : "N/A"} <br />
                
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="invoice-info">
                  <h6 className="customer-text">Billing To</h6>
                  <p className="invoice-details invoice-details-two">
                  {selectedInvoice.patient_details ? selectedInvoice.patient_details.name : "N/A"} <br />
                  {selectedpatientdetails.full_address},
                  {selectedpatientdetails.city}<br/>
                  {selectedpatientdetails.state},
                  {selectedpatientdetails.country}<br/>
                  {selectedpatientdetails.pincode}
                         
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="invoice-info invoice-info2">
                  <h6 className="customer-text">Payment Method</h6>
                  {
                    selectedInvoice.paid_status == 0 ? "Not Paid" : (
<p className="invoice-details">
                    {selectedInvoice.pay_modes ? selectedInvoice.pay_modes : "-"}
                    {/* Debit Card <br />
                    XXXXXXXXXXXX-2541
                    <br />
                    HDFC Bank
                    <br /> */}
                  </p>
                    )
                  }
                  
                </div>
              </div>
            </div>
          </div>
          {/* /Invoice Item */}
          {/* Invoice Item */}
                  {/* Invoice Details Table */}
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
                              {selectedInvoice.details.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.service_details?.service_name || "N/A"}</td>
                                  <td>{item.quantity}</td>
                                  <td>${item.unit_price.toFixed(2)}</td>
                                  <td>${item.final_amount.toFixed(2)}</td>
                                </tr>
                              ))}
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
      <td><span>{selectedInvoice?.sub_total ? selectedInvoice.sub_total.toFixed(2) : "0.00"}</span></td>
    </tr>
    {selectedInvoice?.tax_amount > 0 && (
      <tr>
        <th>Tax:</th>
        <td><span>{selectedInvoice.tax_amount?.toFixed(2) ?? "0.00"}</span></td>
      </tr>
    )}
    <tr>
      <th>Total Amount:</th>
      <td><span>{selectedInvoice?.final_amount ? selectedInvoice.final_amount.toFixed(2) : "0.00"}</span></td>
    </tr>
  </tbody>
</table>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Information */}
                  <div className="other-info mb-0">
                    <h4>Other Information</h4>
                    <p className="text-muted mb-0">
                      {selectedInvoice.clinical_notes || "No additional information provided."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
{/* /View Invoice */}
</>
  )
}

export default  PatientInvoice