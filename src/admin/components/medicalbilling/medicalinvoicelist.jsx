import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { hoslogo } from "../imagepath";
import SidebarNav from "../sidebar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { var_api } from "../../../constant";

const ReportInvoice = () => {
  const location = useLocation();
  const [billingData, setBillingData] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const existingServices = location.state?.data;
  console.log("jesi",existingServices);
  const medicinePrefix = localStorage.getItem("admin_invoicem_prefix");

  // const token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";
  const tokenad = localStorage.getItem('token');

  // useEffect(() => {
  //   if (id) {
  //     axios
  //       .get(`${var_api}medicalbilling/getdetails/${id}`, {
  //         headers: {
  //           Authorization: tokenad,
  //         },
  //       })
  //       .then((response) => {
  //         setBillingData(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   }
  // }, [id]);

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
    patient_name,
    patient_address,
    patient_phone,
    hospital_name,
    hospital_address,
    hospital_mobile,
    hospital_image,
    tech_name,
    tech_emailid,
    appointment_day,  // Add appointment_day here
    appointment_time,  // Add appointment_time here
    pay_modes,
    medicines,
  } = existingServices;

  console.log("existingServices", existingServices);

  const formattedDate = new Date(invoice_date).toLocaleDateString();

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4", // A4 format
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
      
      doc.save(`Invoice_${token}.pdf`);
    });
  };

  // Function to print the invoice with cleaner layout
  const printInvoice = () => {
    const content = document.querySelector(".invoice-container");
  
    // Create a printable layout in a new window
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice Print</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
              margin: 0;
              background-color: #fff;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
            }
            h3 {
              text-align: center;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
            }
            .invoice-header .left {
              text-align: left;
            }
            .invoice-header .right {
              text-align: right;
            }
            .invoice-header img {
              max-width: 100px;
              max-height: 100px;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
            }
            .invoice-to {
              flex: 1;
            }
            .payment-details {
              flex: 1;
              text-align: right;
            }
            .items-table table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .items-table th, .items-table td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            .items-table th {
              background-color: #f4f4f4;
            }
            .items-table td {
              text-align: right;
            }
            .totals {
              text-align: right;
              margin-top: 20px;
            }
            .totals div {
              margin: 5px 0;
            }
            @media print {
              .no-print {
                display: none;
              }
              body {
                margin: 0;
                padding: 0;
                font-size: 12px;
              }
              .invoice-container {
                width: 100%;
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Invoice Header -->
            <div class="invoice-header">
              <!-- Left side (Hospital Info and Image) -->
              <div class="left">
                <img src="path_to_your_image.jpg" alt="Hospital Logo"> <!-- Replace with your image path -->
                <p>Super Hospital</p>
                <p>123 Hospital St, City, Country</p>
                <p>1234567890</p>
              </div>
              <!-- Right side (Invoice # and Date) -->
              <div class="right">
                <p>Invoice #27</p>
                <p>Date: 1/12/25</p>
              </div>
            </div>
  
            <!-- Invoice Details (Invoice to & Payment Details on the same line) -->
            <div class="invoice-details">
              <div class="invoice-to">
                <p><strong>Invoice to:</strong></p>
                <p>Harini</p>
                <p>asdfghjkl</p>
                <p>4567890987</p>
              </div>
              <div class="payment-details">
                <p><strong>Payment Details:</strong></p>
                <p>Total: 165</p>
                <p>Pay Mode: Cash, GPay</p>
              </div>
            </div>
  
            <!-- Items Table -->
            <div class="items-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ITEM</th>
                    <th>UNIT COST</th>
                    <th>QTY</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Paracetamol</td>
                    <td>12.5</td>
                    <td>2</td>
                    <td>25</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Ibuprofen</td>
                    <td>15</td>
                    <td>2</td>
                    <td>30</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Amoxicillin</td>
                    <td>25</td>
                    <td>3</td>
                    <td>75</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Dolo 650</td>
                    <td>20</td>
                    <td>1</td>
                    <td>20</td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- Totals -->
            <div class="totals">
              <div><strong>Subtotal:</strong> 150</div>
              <div><strong>Tax: (10%):</strong> 15</div>
              <div><strong>Total:</strong> 165</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="d-flex justify-content-between mb-4">
            <Link to="/admin/medicalbilling">
              <button className="btn btn-secondary">Back Home</button>
            </Link>
            <button className="btn btn-primary" 
            // onClick={downloadPDF}
            >
              Download PDF
            </button>
            <button className="btn btn-success no-print" 
            // onClick={printInvoice}
            >
              Print Invoice
            </button>
          </div>

          <div className="invoice-container">
            <div className="row">
              <div className="col-sm-6 mb-4">
                <img 
                // alt={hoslogo} 
                className="inv-logo img-fluid" 
                // src={hoslogo}
                 />
              </div>
              <div className="col-sm-6 m-b-20">
                <div className="invoice-details">
                <h3 className="text-uppercase">
  {/* #{medicinePrefix}{token} */}
</h3>
                  <ul className="list-unstyled mb-0">
                    {/* <li> <span>{appointment_day}</span></li> 
                    <li> <span>{appointment_time}</span></li>  */}
                  </ul>
                </div>
              </div>
            </div>

            {/* Hospital and Patient Information */}
            <div className="row">
              <div className="col-sm-12 mb-4">
                <ul className="list-unstyled mb-0">
                  {/* <li><h5 className="mb-0">{hospital_name}</h5></li>
                  <li>{hospital_address}</li>
                  <li>{hospital_mobile}</li> */}
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 mb-4">
                <h6>Invoice to</h6>
                <ul className="list-unstyled mb-0">
                  <li>
                    {/* <h5 className="mb-0"><strong>{patient_name}</strong></h5> */}
                  </li>
                  {/* <li>{patient_address}</li>
                  <li>{patient_phone}</li> */}
                </ul>
              </div>
              <div className="col-sm-6 mb-4">
                <h6>Payment Details</h6>
                <ul className="list-unstyled mb-0">
                  {/* <li>Total: <span>{total_amount}</span></li>
                  <li>Pay Mode: <span>{pay_modes}</span></li> */}
                </ul>
              </div>
            </div>

            {/* Items Table */}
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ITEM</th>
                    <th className="text-nowrap">UNIT COST</th>
                    <th>QTY</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.medicine_Name}</td>
                      <td>{item.unit_price}</td>
                      <td>{item.qty}</td>
                      <td>{item.item_total}</td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>

            {/* Payment Details */}
            <div className="invoice-payment">
              <div className="row">
                <div className="col-sm-7"></div>
                <div className="col-sm-5">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Subtotal:</th>
                        {/* <td className="text-end">{subtotal}</td> */}
                      </tr>
                      <tr>
                        <th>Tax: ({tax_value}%)</th>
                        {/* <td className="text-end">{tax_amount}</td> */}
                      </tr>
                      <tr>
                        <th>Total:</th>
                        {/* <td className="text-end text-primary">{total_amount}</td> */}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportInvoice;












// import React, { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import axios from "axios";
// import { hoslogo } from "../imagepath";
// import SidebarNav from "../sidebar";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { var_api } from "../../../constant";

// const ReportInvoice = () => {
//   const location = useLocation();
//   const [billingData, setBillingData] = useState(null);
//   const queryParams = new URLSearchParams(location.search);
//   const id = queryParams.get("id");
//   const medicinePrefix = localStorage.getItem("admin_invoicem_prefix");

//   // const token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0aW1lc3RhbXAiOjE3MzU1NTIxNDMyMzksImlhdCI6MTczNTU1MjE0M30.LfJggqzWSg20CAv5VpbhFQ91XOpnjeSWZICsTYt23r0";
//   const tokenad = localStorage.getItem('token');
//   console.log("jesi",billingData)

//   useEffect(() => {
//     if (id) {
//       axios
//         .get(`${var_api}medicalbilling/getdetails/${id}`, {
//           headers: {
//             Authorization: tokenad,
//           },
//         })
//         .then((response) => {
//           setBillingData(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     }
//   }, [id]);

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
//     appointment_day,  // Add appointment_day here
//     appointment_time,  // Add appointment_time here
//     pay_modes,
//     items,
//   } = billingData;

//   const formattedDate = new Date(invoice_date).toLocaleDateString();

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
      
//       doc.save(`Invoice_${token}.pdf`);
//     });
//   };

//   // Function to print the invoice with cleaner layout
//   const printInvoice = () => {
//     const content = document.querySelector(".invoice-container");
  
//     // Create a printable layout in a new window
//     const printWindow = window.open("", "_blank", "width=800,height=600");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice Print</title>
//           <style>
//             body {
//               font-family: 'Arial', sans-serif;
//               padding: 20px;
//               margin: 0;
//               background-color: #fff;
//             }
//             .invoice-container {
//               max-width: 800px;
//               margin: 0 auto;
//             }
//             h3 {
//               text-align: center;
//             }
//             .invoice-header {
//               display: flex;
//               justify-content: space-between;
//               align-items: flex-start;
//               margin-bottom: 30px;
//             }
//             .invoice-header .left {
//               text-align: left;
//             }
//             .invoice-header .right {
//               text-align: right;
//             }
//             .invoice-header img {
//               max-width: 100px;
//               max-height: 100px;
//             }
//             .invoice-details {
//               display: flex;
//               justify-content: space-between;
//               margin-top: 20px;
//             }
//             .invoice-to {
//               flex: 1;
//             }
//             .payment-details {
//               flex: 1;
//               text-align: right;
//             }
//             .items-table table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 20px;
//             }
//             .items-table th, .items-table td {
//               padding: 8px;
//               text-align: left;
//               border-bottom: 1px solid #ddd;
//             }
//             .items-table th {
//               background-color: #f4f4f4;
//             }
//             .items-table td {
//               text-align: right;
//             }
//             .totals {
//               text-align: right;
//               margin-top: 20px;
//             }
//             .totals div {
//               margin: 5px 0;
//             }
//             @media print {
//               .no-print {
//                 display: none;
//               }
//               body {
//                 margin: 0;
//                 padding: 0;
//                 font-size: 12px;
//               }
//               .invoice-container {
//                 width: 100%;
//                 padding: 10px;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="invoice-container">
//             <!-- Invoice Header -->
//             <div class="invoice-header">
//               <!-- Left side (Hospital Info and Image) -->
//               <div class="left">
//                 <img src="path_to_your_image.jpg" alt="Hospital Logo"> <!-- Replace with your image path -->
//                 <p>Super Hospital</p>
//                 <p>123 Hospital St, City, Country</p>
//                 <p>1234567890</p>
//               </div>
//               <!-- Right side (Invoice # and Date) -->
//               <div class="right">
//                 <p>Invoice #27</p>
//                 <p>Date: 1/12/25</p>
//               </div>
//             </div>
  
//             <!-- Invoice Details (Invoice to & Payment Details on the same line) -->
//             <div class="invoice-details">
//               <div class="invoice-to">
//                 <p><strong>Invoice to:</strong></p>
//                 <p>Harini</p>
//                 <p>asdfghjkl</p>
//                 <p>4567890987</p>
//               </div>
//               <div class="payment-details">
//                 <p><strong>Payment Details:</strong></p>
//                 <p>Total: 165</p>
//                 <p>Pay Mode: Cash, GPay</p>
//               </div>
//             </div>
  
//             <!-- Items Table -->
//             <div class="items-table">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>ITEM</th>
//                     <th>UNIT COST</th>
//                     <th>QTY</th>
//                     <th>TOTAL</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>1</td>
//                     <td>Paracetamol</td>
//                     <td>12.5</td>
//                     <td>2</td>
//                     <td>25</td>
//                   </tr>
//                   <tr>
//                     <td>2</td>
//                     <td>Ibuprofen</td>
//                     <td>15</td>
//                     <td>2</td>
//                     <td>30</td>
//                   </tr>
//                   <tr>
//                     <td>3</td>
//                     <td>Amoxicillin</td>
//                     <td>25</td>
//                     <td>3</td>
//                     <td>75</td>
//                   </tr>
//                   <tr>
//                     <td>4</td>
//                     <td>Dolo 650</td>
//                     <td>20</td>
//                     <td>1</td>
//                     <td>20</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
  
//             <!-- Totals -->
//             <div class="totals">
//               <div><strong>Subtotal:</strong> 150</div>
//               <div><strong>Tax: (10%):</strong> 15</div>
//               <div><strong>Total:</strong> 165</div>
//             </div>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };
  
  

//   return (
//     <>
//       <SidebarNav />
//       <div className="page-wrapper">
//         <div className="content container-fluid">
//           <div className="d-flex justify-content-between mb-4">
//             <Link to="/admin/medicalbilling">
//               <button className="btn btn-secondary">Back Home</button>
//             </Link>
//             <button className="btn btn-primary" onClick={downloadPDF}>
//               Download PDF
//             </button>
//             <button className="btn btn-success no-print" onClick={printInvoice}>
//               Print Invoice
//             </button>
//           </div>

//           <div className="invoice-container">
//             <div className="row">
//               <div className="col-sm-6 mb-4">
//                 <img alt={hoslogo} className="inv-logo img-fluid" src={hoslogo} />
//               </div>
//               <div className="col-sm-6 m-b-20">
//                 <div className="invoice-details">
//                 <h3 className="text-uppercase">
//   #{medicinePrefix}{token}
// </h3>
//                   <ul className="list-unstyled mb-0">
//                     <li> <span>{appointment_day}</span></li> 
//                     <li> <span>{appointment_time}</span></li> 
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Hospital and Patient Information */}
//             <div className="row">
//               <div className="col-sm-12 mb-4">
//                 <ul className="list-unstyled mb-0">
//                   <li><h5 className="mb-0">{hospital_name}</h5></li>
//                   <li>{hospital_address}</li>
//                   <li>{hospital_mobile}</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-sm-6 mb-4">
//                 <h6>Invoice to</h6>
//                 <ul className="list-unstyled mb-0">
//                   <li>
//                     <h5 className="mb-0"><strong>{patient_name}</strong></h5>
//                   </li>
//                   <li>{patient_address}</li>
//                   <li>{patient_phone}</li>
//                 </ul>
//               </div>
//               <div className="col-sm-6 mb-4">
//                 <h6>Payment Details</h6>
//                 <ul className="list-unstyled mb-0">
//                   <li>Total: <span>{total_amount}</span></li>
//                   <li>Pay Mode: <span>{pay_modes}</span></li>
//                 </ul>
//               </div>
//             </div>

//             {/* Items Table */}
//             <div className="table-responsive">
//               <table className="table table-borderless">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>ITEM</th>
//                     <th className="text-nowrap">UNIT COST</th>
//                     <th>QTY</th>
//                     <th>TOTAL</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {items.map((item, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{item.medicine_Name}</td>
//                       <td>{item.unit_price}</td>
//                       <td>{item.qty}</td>
//                       <td>{item.item_total}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Payment Details */}
//             <div className="invoice-payment">
//               <div className="row">
//                 <div className="col-sm-7"></div>
//                 <div className="col-sm-5">
//                   <table className="table">
//                     <tbody>
//                       <tr>
//                         <th>Subtotal:</th>
//                         <td className="text-end">{subtotal}</td>
//                       </tr>
//                       <tr>
//                         <th>Tax: ({tax_value}%)</th>
//                         <td className="text-end">{tax_amount}</td>
//                       </tr>
//                       <tr>
//                         <th>Total:</th>
//                         <td className="text-end text-primary">{total_amount}</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ReportInvoice;
