// import React, { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import axios from "axios";
// // import { hoslogo, logo } from "../imagepath";
// import hoslogo from "../../assets/img/hoslogo.png";
// import SidebarNav from "../sidebar";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { var_api } from "../../../constant";
// import { image_api } from "../../../constant";

// const ReportDoctorInvoice = () => {
//   const location = useLocation();
//   const [billingData, setBillingData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const queryParams = new URLSearchParams(location.search);
//   const id = queryParams.get("id");
//    const existingServices = location.state?.data;
//   console.log("id", id, existingServices);
//   console.log("Discount Value:", billingData?.any_discount);
//   // const token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";
// const token1 = localStorage.getItem('token');
//   // useEffect(() => {
//   //   if (id) {
//   //     setLoading(true);
//   //     axios
//   //       .get(`${var_api}invoicebilling/get-details/invoice/${id}`, {
//   //         headers: {
//   //           Authorization: token1,
//   //         },
//   //       })
//   //       .then((response) => {
//   //         setBillingData(response.data);
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error fetching data:", error);
//   //       })
//   //       .finally(() => {
//   //         setLoading(false);
//   //       });
//   //   }
//   // }, [id]);

//   if (!billingData) {
//     return <div>Loading...</div>;
//   }

//   const {
//     invoice_id,
//     token,
//     invoice_date,
//     tax_value,
//     paymode,
//     tax_amount,
//     total_amount,
//     subtotal,
//     patient_name,
//     patient_address,
//     patient_phone,
//     hospital_name,
//     hospital_address,
//     hospital_mobile,
//     hospital_image,
//     tech_name,
//     tech_emailid,
//     pay_modes,
//     final,
//     medicines,
//   } = existingServices;

//   const formattedDate = new Date(invoice_date).toLocaleDateString();
//   const invoicebilling = localStorage.getItem("admin_invoiced_prefix");

//   const downloadPDF = () => {
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "px",
//       format: "a4", // A4 format
//     });

//     const content = document.querySelector(".invoice-container");

//     html2canvas(content, {
//       scale: 1,
//       useCORS: true,
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pageWidth = doc.internal.pageSize.width;
//       const pageHeight = doc.internal.pageSize.height;

//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;

//       const scaleX = (pageWidth - 20) / imgWidth;
//       const scaleY = pageHeight / imgHeight;
//       const scale = Math.min(scaleX, scaleY);

//       doc.addImage(imgData, "PNG", 10, 10, imgWidth * scale, imgHeight * scale);
//       doc.save(`Invoice_${billingData?.invoice_token}.pdf`);
//     });
//   };

//   const getStatusLabel = (status) => {
//     const statusConfig = {
//       1: { label: "Paid", color: "green" },
//       0: { label: "Not Paid", color: "red" },
//       2: { label: "Partial", color: "orange" },
//     };
  
//     if (statusConfig[status]) {
//       const { label, color } = statusConfig[status];
//       return (
//         <span
//           style={{
//             color: color,
//             fontWeight: "bold",
//           }}
//         >
//           {label}
//         </span>
//       );
//     }
//     return "N/A";
//   };


//   // const printReport = () => {
//   //   const content = document.querySelector(".invoice-container");
//   //   const printWindow = window.open("", "", "width=800,height=600");
//   //   printWindow.document.write("<html><head><title>Prescription Report</title></head><body>");
//   //   printWindow.document.write(content.innerHTML);
//   //   printWindow.document.write("</body></html>");
//   //   printWindow.document.close();
//   //   printWindow.print();
//   // };

//   return (
//     <>
//       {/* <SidebarNav /> */}
//       {/* Page Wrapper */}
//       <div className="page-wrapper">
//       {loading && (
//         <div className="loader-overlay">
//           <div className="loader"></div>
//         </div>
//       )}
//         <div className="content container-fluid">
//           <div className="d-flex justify-content-between mb-4">
//             <Link 
//             // to={`/admin/${fromPage}`}
//             to={`/admin/invoicelist`}
//             >
//               <button className="btn btn-secondary">
//                 Back Home
//               </button>
//             </Link>
//             <button className="btn btn-primary" 
//             // onClick={downloadPDF}
//             >
//               Download PDF
//             </button>
//           </div>
          
//           {/* Invoice Container */}
//           <div className="invoice-container">
//             <div className="row">
//            <div className="col-sm-6 mb-4">
//   {/* <img
//     alt="Hospital Logo"
//     className="inv-logo img-fluid"
//     src={
//       billingData?.hospital_image && /\.(jpeg|jpg|png|webp)$/i.test(billingData.hospital_image)
//         ? `${image_api}${billingData.hospital_image}`
//         : hoslogo
//     }
//   /> */}
// </div>

//               <div className="col-sm-6 mb-4">
//                 <div className="invoice-details text-right">
//                   <h3 className="text-uppercase">
//                     {/* {billingData?.invoice_token ? `#${invoicebilling}${billingData.invoice_token}` : "N/A"} */}
//                   </h3>
//                   {/* <ul className="list-unstyled mb-0">
//                     <li>{billingData?.appointment_day}</li>
//                     <li>{billingData?.appointment_time}</li>
//                   </ul> */}
//                 </div>
//               </div>
//             </div>
            
//             <div className="row">
//               <div className="col-sm-12 mb-4">
//                 {/* <ul className="list-unstyled mb-0">
//                   <li><h5>{billingData?.hospital_name}</h5></li>
//                   <li>{billingData?.hospital_address}</li>
//                   <li>{billingData?.hospital_mobile}</li>
//                 </ul> */}
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-sm-6 mb-4">
//                 <h6>Invoice to</h6>
//                 {/* <ul className="list-unstyled mb-0">
//                   <li><h5><strong>{billingData?.patient_details?.name}</strong></h5></li>
//                   <li>{billingData?.patient_details?.full_address}</li>
//                   <li>{billingData?.patient_details?.mobile_no}</li>
//                 </ul> */}
//               </div>
//               <div className="col-sm-6 mb-4">
//                 <h6>Payment Details</h6>
//                 <ul className="list-unstyled invoice-payment-details text-right mb-0">
//                   {/* <li><h5>Total: <span className="text-primary">{billingData?.final}</span></h5></li>
//                   <li>Pay Mode: <span>{pay_modes}</span></li>
//                   <li>Status: {getStatusLabel(billingData?.paid_status)}</li> */}
//                 </ul>
//               </div>
//             </div>

//             <div className="table-responsive">
//               <table className="table table-borderless hover-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>ITEM</th>
//                     <th className="text-nowrap">UNIT COST</th>
//                     <th>QTY</th>
//                     <th>TOTAL</th>
//                   </tr>
//                 </thead>
//                 {/* <tbody>
//                   {billingData?.details.map((item, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{item.service_name}</td>
//                       <td>{item.unit_price}</td>
//                       <td>{item.quantity}</td>
//                       <td>{item.final_amount}</td>
//                     </tr>
//                   ))}
//                 </tbody> */}
//               </table>
//             </div>

//             <div className="row invoice-payment">
//               <div className="col-sm-7"></div>
//               <div className="col-sm-5">
//                 <div className="m-b-20">
//                   <h6 className="mt-3">Total Due</h6>
//                   <div className="table-responsive no-border">
//                     <table className="table mb-0">
//                       <tbody>
//                         <tr>
//                           <th>Subtotal:</th>
//                           {/* <td className="text-end">Rs:{billingData?.sub_total}</td> */}
//                         </tr>
//                         {/* {billingData?.tax_amount > 0 && (
//                           <tr>
//                             <th>Tax:</th>
//                             <td className="text-end">Rs:{billingData?.tax_amount}</td>
//                           </tr>
//                         )} */}
//                    {/* <tr style={{ display: billingData?.any_discount > 0 ? "table-row" : "none" }}>
//   <td><strong>Discount:</strong></td>
//   <td>Rs: {billingData.any_discount}</td>
// </tr> */}
//                         {/* <tr>
//                           <th>Total:</th>
//                           <td className="text-end text-primary">
//                             <h5>Rs:{billingData?.final}</h5>
//                           </td>
//                         </tr> */}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="invoice-info">
//               <h5>Other information</h5>
//               <p className="text-muted mb-0">
//                 {/* Additional notes can be added here */}
//               </p>
//             </div>
//           </div>
//           {/* /Invoice Container */}
//         </div>
//       </div>
//       {/* /Page Wrapper */}
//     </>
//   );
// };

// export default ReportDoctorInvoice;


import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import hoslogo from "../../assets/img/hoslogo.png";
import SidebarNav from "../sidebar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { var_api } from "../../../constant";
import { image_api } from "../../../constant";

const ReportDoctorInvoice = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const existingServices = location.state?.data;
  const from = location.state?.from;
  
  // Use existingServices directly since you're getting it from location.state
  const billingData = existingServices;

  console.log("id", id, existingServices, from);
  console.log("Billing Data:", billingData);

  const token1 = localStorage.getItem('token');

  if (!billingData) {
    return <div>Loading...</div>;
  }

  const {
    invoice_id,
    token,
    invoice_date,
    tax_value,
    paymode,
    tax_amount,
    total_amount,
    subtotal,
    name,
   address,
   mobile_no,
   invoice_token,
    hospital_name,
    hospital_address,
    hospital_mobile,
    hospital_image,
    tech_name,
    tech_emailid,
    paid_status,
    appointment_time,
    paymodes,
    final,
    investigation_total,
    op_total,
    scan_total,
    review_total,
    pay_modes,
     services: {
    investigation = [],
    scan = [],
    op = [],
    review = []
  } = {},
    appointment_day,
    token_no,
    final_charge,
    discount,
    consultation,
    medical_total,
    payment_status,
    grand_discount,
    grand_total
  } = billingData;

  // Combine all services into one array
const services = [
  ...investigation,
  ...scan,
  ...op,
  ...review
];

  const formattedDate = new Date(invoice_date).toLocaleDateString();
  const invoicebilling = localStorage.getItem("admin_invoiced_prefix");

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const content = document.querySelector(".invoice-container");

    html2canvas(content, {
      scale: 1,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const scaleX = (pageWidth - 20) / imgWidth;
      const scaleY = pageHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY);

      doc.addImage(imgData, "PNG", 10, 10, imgWidth * scale, imgHeight * scale);
      doc.save(`Invoice_${appointment_day}.pdf`);
    });
  };

  const getStatusLabel = (status) => {
    const statusConfig = {
      1: { label: "Paid", color: "green" },
      0: { label: "Not Paid", color: "red" },
      2: { label: "Partial", color: "orange" },
    };
  
    if (statusConfig[status]) {
      const { label, color } = statusConfig[status];
      return (
        <span style={{ color: color, fontWeight: "bold" }}>
          {label}
        </span>
      );
    }
    return "N/A";
  };

  return (
    <>
      <div className="page-wrapper">
        {loading && (
          <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        )}
        <div className="content container-fluid">
          <div className="d-flex justify-content-between mb-4">
            <Link to={from=="appointment-list" ? "/admin/appointment-list" : "/admin/invoicelist"}>
              <button className="btn btn-secondary">Back Home</button>
            </Link>
            <button className="btn btn-primary" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
          
          {/* Invoice Container */}
          <div className="invoice-container">
            <div className="row">
              <div className="col-sm-6 mb-4">
                <img
                  alt="Hospital Logo"
                  className="inv-logo img-fluid"
                  src={
                    hospital_image && /\.(jpeg|jpg|png|webp)$/i.test(hospital_image)
                      ? `${image_api}${hospital_image}`
                      : hoslogo
                  }
                />
              </div>
              <div className="col-sm-6 mb-4">
                <div className="invoice-details text-right">
                  <h3 className="text-uppercase">
                    {invoice_token ? `#GOS${invoice_token}` : "N/A"}
                  </h3>
                  <ul className="list-unstyled mb-0">
                    <li>Date: {appointment_day}</li>
                    <li>Time: {appointment_time}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-sm-12 mb-4">
                <ul className="list-unstyled mb-0">
                  <li><h5 style={{fontWeight:"bolder"}}>{hospital_name}</h5></li>
                  <li>{hospital_address}</li>
                  <li>{hospital_mobile}</li>
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 mb-4">
                <h6>Invoice to</h6>
                <ul className="list-unstyled mb-0">
                  <li><h5><strong>{name}</strong></h5></li>
                  <li>{address}</li>
                  <li>{mobile_no}</li>
                </ul>
              </div>
              <div className="col-sm-6 mb-4">
                <h6>Payment Details</h6>
                <ul className="list-unstyled invoice-payment-details text-right mb-0">
                  <li><h5>Total: <span className="fw-bolder">₹ {grand_total}</span></h5></li>
                  <li>Pay Mode: <span>{pay_modes}</span></li>
                  <li>Status: {getStatusLabel(paid_status)}</li>
                </ul>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-borderless hover-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>SERVICE</th>
                    <th>SERVICE TYPE</th>
                    <th className="text-nowrap">UNIT COST</th>
                    <th>QTY</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {services?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.service_details?.service_name}</td>
                       <td>{item.service_type == 0 ? "OP" : item.service_type == 1 ? "scan" : item.service_type == 2 ? "Investigation" : item.service_type == 3 ? "Review" : "-"}</td>
                      <td>{item.unit_price}</td>
                      <td>{item.quantity}</td>
                      <td>{item.final_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="row invoice-payment">
              <div className="col-sm-7"></div>
              <div className="col-sm-5">
                <div className="m-b-20">
                  <h6 className="mt-3">Total Due</h6>
                  <div className="table-responsive no-border">
                    <table className="table mb-0">
                      <tbody>
                        <tr>
                          <th>Subtotal:</th>
                          <td className="text-end">Rs: {review_total + scan_total + op_total + investigation_total}</td>
                        </tr>
                       
                          {/* <tr>
                            <th>Consultation:</th>
                            <td className="text-end">Rs: {consultation}</td>
                          </tr> */}
                        
                        <tr 
                        style={{ display: grand_discount > 0 ? "table-row" : "none" }}
                        >
                          <td><strong>Discount:</strong></td>
                          <td className="text-end">Rs: {grand_discount}</td>
                        </tr>
                        <tr>
                          <th>Total:</th>
                          <td className="text-end text-primary">
                            <h5>Rs: {grand_total}</h5>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="invoice-info">
              <h5>Other information</h5>
              <p className="text-muted mb-0">
                Thank you for your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportDoctorInvoice;
