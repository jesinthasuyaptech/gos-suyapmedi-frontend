import React from "react";
import IMG01  from "../../../../assets/img/doctors/doc_dummy.png";
import Header from "../../../header";
import Footer from "../../../footer";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { image_api } from "../../../../../constant";
import doc_dummy from "../../../../../admin/assets/img/doctors/doc_dummy.png";

const InvoiceView = (props) => {
  const location = useLocation();
  const invoice = location.state?.invc;
  console.log("inv",invoice);
  const hospital_profile =  localStorage.getItem("hospital_profile");
  const appointment_prefix = localStorage.getItem("appointment_prefix");
  const invoiced_prefix = localStorage.getItem("invoiced_prefix");
  const invoicem_prefix = localStorage.getItem("invoicem_prefix");
  const prescription_prefix = localStorage.getItem("prescription_prefix");
  const patient_prefix = localStorage.getItem("patient_prefix");

  return (
    <div>
      <Header {...props} />
      <>
        {/* Breadcrumb */}
        <div className="breadcrumb-bar-two">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <h2 className="breadcrumb-title">Invoice View</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home-2">Home</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Invoice View
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* /Breadcrumb */}

        {/* Page Content */}
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="invoice-content">
                  <div className="invoice-item">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="invoice-logo">
                        <img
  src={
    invoice.tech_details?.profile_image &&
    /\.(jpe?g|png|webp)$/i.test(invoice.tech_details.profile_image)
      ? `${image_api}${invoice.tech_details.profile_image}`
      : doc_dummy
  }
  alt="Doctor Profile"
/>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <p className="invoice-details">
                          <strong>Order:</strong> #{invoiced_prefix}{invoice?.invoice_token} <br />
                          <strong>Issued:</strong> {invoice?.appointment_day}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Invoice Item */}
                  <div className="invoice-item">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="invoice-info">
                          <strong className="customer-text">
                            Invoice From
                          </strong>
                          <p className="invoice-details invoice-details-two">
                            Dr. {invoice?.tech_details?.name}<br />
                            {invoice?.tech_details?.qualification}
                            <br />
                            {invoice?.tech_details?.specialization}<br />
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="invoice-info invoice-info2">
                          <strong className="customer-text">Invoice To</strong>
                          <p className="invoice-details">
                            {invoice?.patient_details?.name} <br />
                            {invoice?.patient_details?.full_address}  <br />
                            {invoice?.patient_details?.mobile_no}  <br />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Invoice Item */}
                  {/* Invoice Item */}
                  <div className="invoice-item">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="invoice-info">
                          <strong className="customer-text">
                            Payment Method
                          </strong>
                          <p className="invoice-details invoice-details-two">
                            {invoice?.pay_modes}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Invoice Item */}
                  {/* Invoice Item */}
                  <div className="invoice-item invoice-table-wrap">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive">
                          <table className="invoice-table table table-bordered">
                            <thead style={{ borderBottom: "none" }}>
                              <tr>
                                <th>Description</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Unit Price</th>
                                <th className="text-end">Total</th>
                              </tr>
                            </thead>
                            <tbody style={{ borderTop: "none" }}>
                            {invoice?.details?.length > 0 ? (
                invoice?.details?.map((details, index) => (
                              <tr key={index}>
                                <td>{details?.service_details?.service_name || "N/A"}</td>
                                <td className="text-center">{details?.quantity || 0}</td>
                                <td className="text-center">{details?.unit_price || 0}</td>
                                <td className="text-end">{details?.total_amount || 0}</td>
                              </tr>
                               ))
                              ) : (
                                <tr>
                                  <td colSpan="4">No Invoice billing details available.</td>
                                </tr>
                              )}
                              {/* <tr>
                                <td>Video Call Booking</td>
                                <td className="text-center">1</td>
                                <td className="text-center">$0</td>
                                <td className="text-end">$250</td>
                              </tr> */}
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
                                  <span>{invoice?.sub_total || 0}</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Discount:</th>
                                <td>
                                  <span>{invoice?.any_discount || 0}%</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Tax Amount:</th>
                                <td>
                                  <span>{invoice?.tax_amount || 0}</span>
                                </td>
                              </tr>
                              <tr>
                                <th>Total Amount:</th>
                                <td>
                                  <span>{invoice?.final_amount || 0}</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Invoice Item */}
                  {/* Invoice Information */}
                  <div className="other-info">
                    <h4>Other information</h4>
                    <p className="text-muted mb-0">
                    {invoice?.clinical_notes || "No clinical notes available."}
                    </p>
                  </div>
                  {/* /Invoice Information */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </>
      <Footer {...props} />
    </div>
  );
};

export default InvoiceView;
