import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { notification } from "antd";
import { useLocation,Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { hoslogo, logo } from "../imagepath";
import { image_api } from "../../../constant";

const PrescriptionListReport = () => {
  const [appointmentData, setAppointmentData] = useState(null);
  const appointmentPrefix = localStorage.getItem("admin_prescription_prefix");

  const location = useLocation();


  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4", // A4 format
    });

    const content = document.querySelector(".invoice-container");

    // Using html2canvas to capture the content
    html2canvas(content, {
      scale: 1,  // Change scale if content is too large or too small
      useCORS: true,  // Make sure external images are loaded
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // A4 page dimensions in px (for 72 DPI)
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Get the image width and height
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate scaling factor to fit the page
      const scaleX = (pageWidth - 20) / imgWidth;  // Deducting 20px from the page width for margin
      const scaleY = pageHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY); // Fit the content proportionally

      // Add image to PDF (adjust position and size with space to the right)
      doc.addImage(imgData, "PNG", 10, 10, imgWidth * scale, imgHeight * scale);
      
      // Save the PDF
      doc.save(`Appointment_${appointment_id}.pdf`);
    });
};

const printReport = () => {
  const content = document.querySelector(".invoice-container");
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write("<html><head><title>Prescription Report</title></head><body>");
  printWindow.document.write(content.innerHTML);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
};
  // Get appointment data passed from the previous page
  useEffect(() => {
    if (location.state?.appointmentData) {
      setAppointmentData(location.state.appointmentData);
    }
  }, [location]);
  console.log("jesi",appointmentData);

  if (!appointmentData) return null;

  const {
    appointment_id,
    patient_name,
    patient_mobile_no,
    patient_city,
    patient_address,
    patient_dob,
    patient_gender,
    patient_blood_group,
    appointment_day,
    appointment_time,
    prescriptions,
    tech_name,
    tech_primary_mobile,
    hospital_image,
    hospital_country,
    hospital_state,
    hospital_mobile,hospital_name,hospital_address,
    tech_email
  } = appointmentData;

  return (
    <div>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
        <div className="d-flex justify-content-between mb-4">
            <Link to='/admin/prescriptionlist'>
            <button className="btn btn-secondary" onClick={()=>{}}>
              Back Home
            </button></Link>
            <button className="btn btn-primary" onClick={downloadPDF}>
              Download PDF
            </button>
            <button className="btn btn-success ml-2" onClick={printReport}>
                Print Now
              </button>
          </div>
{/* Invoice Container */}
<div className="invoice-container">


<div className="row d-flex align-items-center justify-content-between">
  {/* Hospital Image & Details */}
  <div className="col d-flex align-items-center pe-5">
    {/* Hospital Image */}
    <div className="col-auto">
      <img
        alt={hoslogo}
        className="inv-logo img-fluid"
        src={
          appointmentData?.hospital_image && /\.(jpeg|jpg|png|webp)$/i.test(appointmentData.hospital_image)
            ? `${image_api}hospital_image/${appointmentData?.hospital_image}`
            : hoslogo
        }
        style={{ maxWidth: "100px", height: "auto" }}
      />
    </div>

    {/* Hospital Details */}
    <div className="col">
      <ul className="list-unstyled mb-0">
        <li><h5 className="mb-0">{appointmentData?.hospital_name}</h5></li>
        <li>{appointmentData?.hospital_address}</li>
        <li>{appointmentData?.hospital_mobile}</li>
      </ul>
    </div>
  </div>

  {/* Invoice Details (Prefix aligned right) */}
  <div className="col-auto text-end ms-auto">
    <div className="invoice-details">
      <h3 className="text-uppercase">
        #{appointmentPrefix}{prescriptions[0]?.prescription_token}
      </h3>
      <ul className="list-unstyled mb-0">
        <li><span>{appointment_day}</span></li>
        <li><span>{appointment_time}</span></li>
      </ul>
    </div>
  </div>
</div>






  {/* Address */}
  {/* <div className="row">
    <div className="col-sm-12 mb-4">
      <ul className="list-unstyled mb-0">
        <li>SuyapDoc Hospital</li>
        <li>3864 Quiet Valley Lane,</li>
        <li>Sherman Oaks, CA, 91403</li>
        <li>GST No:</li>
      </ul>
    </div>
  </div> */}

  {/* Patient and Doctor Details */}
  <br/> <br/> <br/>
  <div className="row">
    {/* Patient Details */}
    <div className="col-sm-6 col-lg-6 col-xl-6 mb-4">
      <h6>Patient Details</h6>
      <ul className="list-unstyled mb-0">
        <li><h5>{patient_name}</h5></li>
        <li>Mobile: {patient_mobile_no}</li>
        <li>City: {patient_city}</li>
      </ul>
    </div>
    {/* Doctor Details */}
    <div className="col-sm-6 col-lg-6 col-xl-6 mb-4">
      <h6>Doctor Details</h6>
      <ul className="list-unstyled mb-0">
        <li><h5><strong>{tech_name}</strong></h5></li>
        <li>Phone: {tech_primary_mobile}</li>
        <li>Email: <a href={`mailto:${tech_email}`}>{tech_email}</a></li>
      </ul>
    </div>
  </div>

  {/* Prescription Table */}
  <div className="table-responsive">
  <table className="table table-borderless hover-table">
    <thead>
      <tr>
        <th>#</th>
        <th>ITEM</th>
        <th className="text-Left">
          DOSAGE TIME <br />(M-A-E-N)
        </th>
        <th>FOOD</th>
      </tr>
    </thead>
    <tbody>
      {prescriptions && prescriptions.length > 0 && prescriptions.map((prescription, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{prescription.subcat_name || 'N/A'}</td>
          <td className="text-Left">
            {prescription.is_morning ? "1" : "0"}-
            {prescription.is_noon ? "1" : "0"}-
            {prescription.is_evening ? "1" : "0"}-
            {prescription.is_night ? "1" : "0"}
          </td>
          <td>{prescription.is_before_food === 1 ? "Before " : "After "}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>




  {/* Payment Details */}
  <div className="row invoice-payment">
    <div className="col-sm-7"></div>
    <div className="col-sm-5">
      <div className="m-b-20">
        {/* <h6 className="mt-3">Total due</h6> */}
        <div className="table-responsive no-border">
          <table className="table mb-0">
            <tbody>
              {/* <tr>
                <th>Subtotal:</th>
                <td className="text-end">₹{prescriptions.total_amount || 0}</td>
              </tr> */}
              {/* <tr>
                <th>Tax: <span className="text-regular">(25%)</span></th>
                <td className="text-end">$50</td>
              </tr> */}
              {/* <tr>
                <th>Total:</th>
                <td className="text-end text-primary">
                  <h5>₹0</h5>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

</div>

        </div>
      </div>
    </div>
  );
};

export default PrescriptionListReport;
