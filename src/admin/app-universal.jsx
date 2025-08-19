/* eslint-disable react/prop-types */
import React, { useState, useContext, useMemo , useEffect} from "react";
import config from "config";

import { Route, BrowserRouter, Switch } from "react-router-dom";
import Header from "./components/header/index";
import Dashboard from "./components/dashboard";
import Appointments from "./components/appointments";
import Specialities from "./components/specialities";
import Specialization from "./components/specialization";
import problemmaster from "./components/problemmaster";
import diagonosismaster from "./components/diagonosismaster";
import taxmaster from "./components/taxmaster";
import rollmaster from "./components/rollmaster";
import medicineuom from "./components/medicineuom";
import medicinebrandmaster from "./components/medicinebrandmaster";
import complaintsmaster from "./components/complaintsmaster";
import servicetypemaster from "./components/servicetypemaster";
import medicinecategory from "./components/medicinecategory";
import medicinesubcategory from "./components/medicinesubcategory";
import patientdetails from "./components/patientdetails";
import invoicelist from "./components/invoicelist";
import prescriptionlist from "./components/prescriptionlist";
import technical from "./components/technical";
import nontechnical from "./components/nontechnical";
import Doctors from "./components/doctors";
import Patients from "./components/patients";
import Reviews from "./components/reviews";
import Transaction from "./components/transaction";
import Settings from "./components/settings";
import InvoiceReport from "./components/Reports/InvoiceReport/InvoiceReport";
import ProductList from "./components/productlist";
import PharmacyList from "./components/pharmacylist";
import Categories from "./components/pharmacylist/Categories";
import Blog from "./components/Blog/blog";
import BlogDetails from "./components/Blog/blogdetails";
import AddBlog from "./components/Blog/addblog";
import EditBlog from "./components/Blog/editblog";
import PendingBlog from "./components/Blog/pendingblog";
import Profile from "./components/profile/Profile";
import Login from "./components/login";
import Register from "./components/register";
import ForgotPassword from "./components/forgotpassword";
import Lockscreen from "./components/lockscreen";
import Error from "./components/error404";
import ErrorPage from "./components/error500";
import BasicInput from "./components/forms/baiscinput";
import FormInput from "./components/forminput";
import FormHorizontal from "./components/formhorizontal";
import FormVertical from "./components/formvertical";
import FormMask from "./components/formask";
import FormValidation from "./components/formvalidation";
import BlankPage from "./components/blankpage";
import Components from "./components/component";
import DataTables from "./components/datatables";
import BasicTables from "./components/basictables";
import ProductCategories from "./components/productlist/ProductCategories";
import { Appcontext } from "../approuter";
import InvoiceReportList from "./components/Reports/InvoiceReport/InvoiceReportList";
import PrescriptionListReport from "./components/prescriptionlist/prescriptionlist";
import availabledaytime from "./components/availabledaytime";
import MedicalInvoiceReport from "./components/medicalbilling/medicalinvoicelist";
import medicalbilling from "./components/medicalbilling";
import ReportDoctorInvoice from "./components/invoicelist/doctorinvoicelist";
import DentalChart from "./components/dentalchart";
import DentalHistory from "./components/dentalhistory";
import TechAttendance from "./components/techattendance";
import NonTechAttendance from "./components/nontechattendance";
import paymodemaster from "./components/paymodemaster";
import referralmaster from "./components/referralmaster";
import othersappoint from "./components/appointments/othersappoint";
//settings
import HospitalSettings from "./components/hospitalsettings";
import report from "./components/report";
import referralreport from "./components/referalreport";
import outstanding from "./components/outstanding";
import attendancereport from "./components/attendancereport";
import paymode from "./components/paymodereport";
import labmaster from "./components/labmaster";
import LabTest from "./components/lab";
import serviceTypeReport from "./components/servicetypereport";
import labServiceReport from "./components/labservicereport";
import superultraAdmin from "./components/superultraadmin";
import superultradashboard from "./components/superultradashboard";
import ultrasidebar from "./components/ultrasidebar";
import ultrahospital from "./components/ultrahospital";
// import ultrahospitaldetails from "./components/ultrahospital/ultrahospitaldetails";
import others from "./components/others";
import medicalrecord from "./components/medicalrecord";
 import patientlogin from "../Patient/components/loginpatient/loginpatient.jsx";
 import registerpatient from "../Patient/components/registerpatient/register.jsx";
 import hospitallist from "../Patient/components/hospitallist/index.jsx";  
 import PrivacyPolicy from "./components/privacyPolicy/privacypolicy.jsx";
//  import hospitallist from "../Patient/components/hospitallist/index.jsx";
 import paymodereport from "./components/pharmasypaymodereport/index.jsx"  
 import UltraHeader from "./headerultra/index.jsx";
 import ultraCredentials from "./components/ultraAdminCredential/index.jsx";

 import pushNotification from "./components/pushNotification/index.jsx";
 import ledger from "./components/ledger/index.jsx";

const AppUniversal = function (props) {
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
  const { isAuth, setIsAuth } = useContext(Appcontext);

  
  const location = props?.location || window.location; // Fallback to `window.location`

  console.log("Current Path:", location.pathname); // Debugging
  const userRole = localStorage.getItem('admin_role');

  // useMemo(() => {
  //   if (
  //     location?.pathname == "/admin/login" ||
  //     location?.pathname == "/admin/register" ||
  //     location?.pathname == "/admin/forgotPassword" ||
  //     location?.pathname == "/admin/lockscreen" ||
  //     location?.pathname == "/admin/conform-email" ||
  //     location?.pathname == "/admin/404" ||
  //     location?.pathname == "/admin/500"
  //   ) {
  //     setIsAuth("admin");
  //   } else {
  //     setIsAuth("user");
  //   }
  // }, [location]);

  useEffect(() => {
    const adminRoutes = [
      "/admin/login",
      "/admin/register",
      "/admin/forgotPassword",
      "/admin/lockscreen",
      "/admin/conform-email",
      "/admin/404",
      "/admin/500",
    ];

    if (adminRoutes.includes(location?.pathname)) {
      setIsAuth("admin");
    } else {
      setIsAuth("user");
    }
  }, [location, setIsAuth]);

  console.log("setisauth", isAuth);
  const isPrivacyPolicy = location.pathname === "/admin/privacy-policy";
  const isSuperUltraPage =
  location.pathname === "/admin/superultraadmin" || // ✅ Add this
  location.pathname === "/admin/superultradashboard" ||
  location.pathname === "/superultraadmin/ultrahospital"||
  location.pathname === "/admin/rollmaster"||
  location.pathname ===  "/admin/Specialization";

console.log("Super Ultra Page",isSuperUltraPage)
console.log("jesi",isAuth);
  return (
    <BrowserRouter basename={`${config.publicPath}`}>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
      {!isPrivacyPolicy && isAuth !== "admin" && !isSuperUltraPage && (
          <Route
            render={(props) => (
              <Header {...props} onMenuClick={() => toggleMobileMenu()} />
            )}
          />
        )}
          {isSuperUltraPage && (
          <Route render={(props) => <UltraHeader {...props} />} />
        )}
        <Switch>
          <Route path="/admin/login" exact component={Login} />
          <Route path="/admin/register" exact component={Register} />
          <Route
            path="/admin/forgotPassword"
            exact
            component={ForgotPassword}
          />
          <Route path="/admin/lockscreen" exact component={Lockscreen} />
          <Route path="/admin" exact component={Dashboard} />
          <Route
            path="/admin/appointment-list"
            exact
            component={Appointments}
          />
          <Route path="/admin/specialities" exact component={Specialities} />
          <Route path="/admin/Specialization" exact component={Specialization} />
          <Route path="/admin/problemmaster" exact component={problemmaster} />
          <Route path="/admin/diagonosismaster" exact component={diagonosismaster} />
          <Route path="/admin/taxmaster" exact component={taxmaster} />
          <Route path="/admin/rollmaster" exact component={rollmaster} />
          <Route path="/admin/medicineuom" exact component={medicineuom} />
          <Route path="/admin/medicinebrandmaster" exact component={medicinebrandmaster} />
          <Route path="/admin/complaintsmaster" exact component={complaintsmaster} />
          <Route path="/admin/servicetypemaster" exact component={servicetypemaster} />
          <Route path="/admin/medicineCategory" exact component={medicinecategory} />
          <Route path="/admin/medicinesubCategory" exact component={medicinesubcategory} />
          <Route path="/admin/patientdetails" exact component={patientdetails} />
          <Route path="/admin/invoicelist" exact component={invoicelist} />
          <Route path="/admin/prescriptionlist" exact component={prescriptionlist} />
          <Route path="/admin/technical" exact component={technical} />
          <Route path="/admin/nontechnical" exact component={nontechnical} />
          <Route path="/admin/doctor-list" exact component={Doctors} />
          <Route path="/admin/patient-list" exact component={Patients} />
          <Route path="/admin/reviews" exact component={Reviews} />
          <Route path="/admin/ledger" exact component={ledger} />
        
          <Route path="/admin/availabledaytime" exact component={availabledaytime} />
          <Route path="/admin/superultraadmin" component={superultraAdmin} />
         <Route path="/admin/superultradashboard" exact component={superultradashboard} />
         <Route path="/admin/ultracredential" exact component={ultraCredentials} />
          <Route
            path="/admin/transactions-list"
            exact
            component={Transaction}
          />

           <Route
            path="/admin/Specialization"
            exact
            component={Specialization}
          />
            <Route
            path="/admin/medicalrecord"
            exact
            component={medicalrecord}
          />
             <Route
            path="/admin/problemmaster"
            exact
            component={problemmaster}
          />
               <Route
            path="/admin/diagonosismaster"
            exact
            component={diagonosismaster}
          />
                  <Route
            path="/admin/taxmaster"
            exact
            component={taxmaster}
          />
                     <Route
            path="/admin/rollmaster"
            exact
            component={rollmaster}
          />
                      <Route
            path="/admin/medicineuom"
            exact
            component={medicineuom}
          />
                      <Route
            path="/admin/medicinebrandmaster"
            exact
            component={medicinebrandmaster}
          />
                         <Route
            path="/admin/complaintsmaster"
            exact
            component={complaintsmaster}
          />
                        <Route
            path="/admin/servicetypemaster"
            exact
            component={servicetypemaster}
          />
                           <Route
            path="/admin/medicineCategory"
            exact
            component={medicinecategory}
          />
                          <Route
            path="/admin/medicinesubCategory"
            exact
            component={medicinesubcategory}
          />
                          <Route
            path="/admin/patientdetails"
            exact
            component={patientdetails}
          />
                           <Route
            path="/admin/invoicelist"
            exact
            component={invoicelist}
          />
          <Route
            path="/admin/prescriptionlist"
            exact
            component={prescriptionlist}
          />
                          <Route
            path="/admin/technical"
            exact
            component={technical}
          />
                            <Route
            path="/admin/others"
            exact
            component={others}
          />
                         <Route
            path="/admin/nontechnical"
            exact
            component={nontechnical}
          />
                          <Route
            path="/superultraadmin/ultrahospital"
            exact
            component={ultrahospital}
          />
          <Route path="/admin/settings" exact component={Settings} />
          <Route path="/admin/invoicerepot" exact component={InvoiceReport} />
          <Route path="/admin/invoice" exact component={InvoiceReportList} />
          <Route path="/admin/blog" exact component={Blog} />
          <Route path="/admin/blog-details" exact component={BlogDetails} />
          <Route path="/admin/add-blog" exact component={AddBlog} />
          <Route path="/admin/edit-blog" exact component={EditBlog} />
          <Route path="/admin/pending-blog" exact component={PendingBlog} />
          <Route path="/admin/profile" exact component={Profile} />
          <Route path="/admin/product-list" exact component={ProductList} />
          <Route path="/admin/pharmacy-list" exact component={PharmacyList} />
          <Route path="/admin/pharmacy-category" exact component={Categories} />
          <Route path="/admin/prescriptionreport" exact component={PrescriptionListReport} />

          <Route path="/admin/404" exact component={Error} />
          <Route path="/admin/500" exact component={ErrorPage} />
          <Route path="/admin/blank-page" exact component={BlankPage} />
          <Route path="/admin/components" exact component={Components} />
          <Route path="/admin/basic-input" exact component={BasicInput} />
          <Route path="/admin/form-input-group" exact component={FormInput} />
          <Route
            path="/admin/form-horizontal"
            exact
            component={FormHorizontal}
          />
          <Route path="/admin/form-vertical" exact component={FormVertical} />
          <Route path="/admin/form-mask" exact component={FormMask} />
          <Route
            path="/admin/form-validation"
            exact
            component={FormValidation}
          />
          <Route path="/admin/tables-basic" exact component={BasicTables} />
          <Route path="/admin/data-tables" exact component={DataTables} />
          <Route
            path="/admin/product-category"
            exact
            component={ProductCategories}
          />
          <Route
            path="/admin/medical-invoice-report"
            exact
            component={MedicalInvoiceReport}
          />
          <Route
            path="/admin/medicalbilling"
            exact
            component={medicalbilling}
          />
            <Route
            path="/admin/ultrasidebar"
            exact
            component={ultrasidebar}
          />

          <Route
            path="/admin/doctor-invoice-report"
            exact
            component={ReportDoctorInvoice}
          /> 
       <Route path="/admin/othersappoint"
        exact 
        component={othersappoint} />

          <Route
            path="/admin/dentalchart"
            exact
            component={DentalChart}
          />     
          <Route
            path="/admin/dentalhistory"
            exact
            component={DentalHistory}
          /> 


          <Route
            path="/admin/techattendance"
            exact
            component={TechAttendance}
          />    
          <Route
            path="/admin/nontechattendance"
            exact
            component={NonTechAttendance}
          />
          <Route
            path="/admin/labtest"
            exact
            component={LabTest}
          />    
          {/* <Route
            path="/admin/patientlogin"
            exact
            component={patientlogin}
          />     */}
          <Route
            path="/admin/registerpatient"
            exact
            component={registerpatient}
          />    
          <Route
            path="/admin/hospitallist"
            exact
            component={hospitallist}
          />    

            
          


{/* <Route path="/admin/paymodemaster" exact component={paymodemaster} />
 <Route path="/admin/referralmaster" exact component={referralmaster}/> */}

            <Route
            path="/admin/paymodemaster"
            exact
            component={paymodemaster}
          />
                        <Route
            path="/admin/referralmaster"
            exact
            component={referralmaster}
          />

<Route
            path="/admin/hospital-settings"
            exact
            component={HospitalSettings}
          />   


          <Route
            path="/admin/referralreport"
            exact
            component={referralreport}
          />  
           <Route
            path="/admin/outstanding"
            exact
            component={outstanding}
          />  
          <Route
            path="/admin/report"
            exact
            component={report}
          />
          <Route
            path="/admin/attendancereport"
            exact
            component={attendancereport}
          />
            <Route
            path="/admin/pharmasypaymode"
            exact
            component={paymodereport}
          />
          <Route
            path="/admin/paymode"
            exact
            component={paymode}
          />  
          <Route path="/admin/labmaster" exact component={labmaster} />
              <Route
            path="/admin/labmaster"
            exact
            component={labmaster}
          />

          <Route path="/admin/servicetypereport" exact component={serviceTypeReport} />
          <Route path="/admin/labservicereport" exact component={labServiceReport} /> 

          <Route path="/admin/privacy-policy" exact component={PrivacyPolicy} />
          <Route path="/admin/push-notification" exact component={pushNotification} />    
             
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default AppUniversal;
