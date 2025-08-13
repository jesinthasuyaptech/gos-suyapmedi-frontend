import React from "react";
import config from 'config';
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./assets/css/bootstrap.min.css";
import "./assets/css/bootstrap.min.css"
import Header from "./components/header/index";
import Dashboard from "./components/dashboard";
import Products from "./components/Products/product";
import AddProduct from "./components/Products/addproduct";
import EditProduct from "./components/Products/editproduct";
import OutStock from "./components/Products/outstock";
import Expired from "./components/Products/expired";
import Categories from "./components/categories";
import Purchase from "./components/purchase/purchase";
import Order from "./components/purchase/order";
import AddPurchase from "./components/purchase/addpurchase";
import EditPurchase from "./components/purchase/editpurchase";
import Sales from "./components/Sales";
import Supplier from "./components/supplier/supplier";
import AddSupplier from "./components/supplier/addsupplier";
import EditSupplier from "./components/supplier/editsupplier";
import TransactionList from "./components/transaction/transaction-list";
import Invoice from "./components/transaction/invoice";
// import InvoiceReport from "./components/report/invoicelist";
import Settings from "./components/settings";
import Profile from "./components/profile";
import ProductList from "./components/productlist/index.jsx";
// import ReportInvoice from "./components/report/ReportInvoice.jsx";
import LatestCustomer from "./components/dashboard/LastestCustomer.jsx";
import PharmacyLogin from "./components/login/index.jsx";
import ParmacyForgotPassword from "./components/forgotPassword/index.jsx";
import ParmacyRegsiter from "./components/register/index..jsx";
import medicinebrandmaster from "./components/medicinebrandmaster/index.jsx";
import medicinecategory from "./components/medicinecategory/index.jsx";
import medicinesubcategory from "./components/medicinesubcategory/index.jsx";
import taxmaster from "./components/taxmaster/index.jsx";
import MedicalInvoiceReport from "./components/medicalbilling/medicalinvoicelist";
import medicalbilling from "./components/medicalbilling";
import paymode from "./components/paymodereport";
import MedicienReport from "./components/medicienreport/index.jsx";
import Report from "./components/report/index.jsx";
import paymodemaster from "./components/paymodemaster/index.jsx";


const PharmacyadminApp = function () {
  return (
    <BrowserRouter basename={`${config.publicPath}`}>

    <div className="main-wrapper">
        {/* <Route render={(props) => <Header {...props} />} /> */}
        <Route render={(props) => <Header {...props} />} />
        <Switch>
          <Route path="/pharmacyadmin" exact component={Dashboard} />
          <Route
            path="/pharmacyadmin/register"
            exact
            component={ParmacyRegsiter}
          />
          <Route
            path="/pharmacyadmin/forgotPassword"
            exact
            component={ParmacyForgotPassword}
          />
          <Route
            path="/pharmacyadmin/pharmacyLogin"
            exact
            component={PharmacyLogin}
          />
          <Route
            path="/pharmacyadmin/categories"
            exact
            component={Categories}
          />
          <Route path="/pharmacyadmin/products" exact component={Products} />
          <Route
            path="/pharmacyadmin/add-product"
            exact
            component={AddProduct}
          />
          <Route
            path="/pharmacyadmin/edit-product"
            exact
            component={EditProduct}
          />
          <Route path="/pharmacyadmin/outstock" exact component={OutStock} />
          <Route path="/pharmacyadmin/expired" exact component={Expired} />
          <Route path="/pharmacyadmin/purchase" exact component={Purchase} />
          <Route path="/pharmacyadmin/order" exact component={Order} />
          <Route
            path="/pharmacyadmin/add-purchase"
            exact
            component={AddPurchase}
          />
          <Route
            path="/pharmacyadmin/edit-purchase"
            exact
            component={EditPurchase}
          />
          <Route path="/pharmacyadmin/sales" exact component={Sales} />
          <Route path="/pharmacyadmin/supplier" exact component={Supplier} />
          <Route
            path="/pharmacyadmin/add-supplier"
            exact
            component={AddSupplier}
          />
          <Route
            path="/pharmacyadmin/edit-supplier"
            exact
            component={EditSupplier}
          />
          <Route
            path="/pharmacyadmin/transactions-list"
            exact
            component={TransactionList}
          />
          <Route path="/pharmacyadmin/invoice" exact component={Invoice} />
          {/* <Route
            path="/pharmacyadmin/invoice-report"
            exact
            component={InvoiceReport}
          /> */}
          {/* <Route
            path="/pharmacyadmin/ReportInvoice"
            exact
            component={ReportInvoice}
          /> */}
          <Route path="/pharmacyadmin/profile" exact component={Profile} />
          <Route path="/pharmacyadmin/settings" exact component={Settings} />
          <Route
            path="/pharmacyadmin/product-list"
            exact
            component={ProductList}
          />
          <Route
            path="/pharmacyadmin/LatestCustomer"
            exact
            component={LatestCustomer}
          />
          <Route path="/pharmacyadmin/medicinebrandmaster" exact component={medicinebrandmaster} />
          <Route path="/pharmacyadmin/medicineCategory" exact component={medicinecategory} />
          <Route path="/pharmacyadmin/medicinesubCategory" exact component={medicinesubcategory} />
          <Route path="/pharmacyadmin/taxmaster" exact component={taxmaster} />
          <Route
          path="/pharmacyadmin/medical-invoice-report"
          exact
          component={MedicalInvoiceReport}
        />
          <Route
            path="/pharmacyadmin/medicalbilling"
            exact
            component={medicalbilling}
          />
          <Route
            path="/pharmacyadmin/medicalbilling"
            exact
            component={medicalbilling}
          />
           <Route
                      path="/pharmacyadmin/paymode"
                      exact
                      component={paymode}
                    />  
           <Route
                      path="/pharmacyadmin/medicienreport"
                      exact
                      component={MedicienReport}
                    />  
           <Route
                      path="/pharmacyadmin/report"
                      exact
                      component={Report}
                    />  
           <Route
                      path="/pharmacyadmin/paymodemaster"
                      exact
                      component={paymodemaster}
                    />  

        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default PharmacyadminApp;
