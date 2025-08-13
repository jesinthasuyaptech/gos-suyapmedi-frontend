import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import loginBanner from "../../assets/images/login-banner.png";
import loginBanner from "../../assets/images/logo-03.png";
import header_logo from "../../../admin/assets/img/header_logo.png";
import Header from "../header";
import Footer from "../footer";
import axios from "axios";
import { notification } from "antd";
import { var_api } from "../../../constant";

const Register = (props) => {
  // const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    referal: "",
    isPrivate: false,  // Added for the checkbox state
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("account-page");

    return () => document.body.classList.remove("account-page");
  }, []);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // setFormData({ ...formData, [name]: value });
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox input
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("📨 Submitting hospital form with data:", formData);
  
    try {
      const response = await axios.post(`${var_api}hospital/post`, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        profile_image: "",
        address: "",
        website: "",
        state: "",
        country: "",
        created_by: 0,
        created_at: "",
        updated_at: "",
        is_private: 0,
        referal: formData.referal || "-",
      });
  
      console.log("✅ Hospital created response:", response.data);
  
      if (response.status === 200 || response.status === 201) {
        const createdHospitalId = response.data?.hospital_id || response.data?.hospitalId;
  
        if (createdHospitalId) {
          localStorage.setItem("hospital_id", createdHospitalId.toString());
          console.log("✅ Stored hospital_id in localStorage:", createdHospitalId);
  
          // ✅ Pass hospital_id as part of an object
          await installationpost({ hospital_id: createdHospitalId });
        }
  
        notification.success({
          message: "Success",
          description: "Hospital Created Successfully. Use entered credentials for Admin.",
          placement: "bottomRight",
        });
  
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          isPrivate: false,
          referal: "",
        });
      }
  
    } catch (error) {
      console.error("❌ Error during hospital creation:", error);
  
      if (error.response && error.response.data && error.response.data.error) {
        notification.error({
          message: "Error",
          description: error.response.data.err?.sqlMessage || error.response.data.error,
          placement: "bottomRight",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  
  const installationpost = async ({
    hospital_id,
    techstaff = 0,
    availabletime = 0,
    patient = 0,
    servicetype = 0,
    uom = 0,
    category = 0,
    brand = 0,
    medicine = 0,
    paymodemaster = 0,
    makeappointment = 0,
    endsession = 0,
    payment = 0,
    
  }) => {
    try {
      const payload = {
        techstaff,
        availabletime,
        patient,
        servicetype,
        uom,
        category,
        brand,
        medicine,
        paymodemaster,
        makeappointment,
        endsession,
        payment,
        hospital_id,
      };
  
      console.log("📤 Payload being sent to installation/post:", payload);
  
      const response = await fetch(`${var_api}installation/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("📥 Response from installation/post:", data);

      // ✅ Redirect after successful post
    if (response.ok) {
      window.location.href = "/admin/login";
    }

    } catch (error) {
      console.error("❌ Error:", error);
    }
  };
  
  
  
  
  
  
  
  
  
  
  

  return (
    <>
      <Header {...props} />

      <>
        {/* Page Content */}
        <div className="content top-space">
        {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                {/* Register Content */}
                <div className="account-content">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-md-7 col-lg-6 login-left">
                      <img
                        src={header_logo}
                        className="img-fluid"
                        alt="SuyapDoc Register"
                        width="300" height="300"
                      />
                    </div>
                    <div className="col-md-12 col-lg-6 login-right">
                      <div className="login-header">
                        <h3>
                          Hospital Register{" "}
                          {/* <Link to="/doctor/doctor-register"> */}
                          {/* <Link to="/login">
                            Are you a Doctor?
                          </Link> */}
                        </h3>
                      </div>
                      {/* Register Form */}
                      <form onSubmit={handleSubmit}>
                        <div className="form-group form-focus">
                          <input
                            type="text"
                            className="form-control floating"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                          <label className="focus-label">Name</label>
                        </div>
                        <div className="form-group form-focus">
                          <input
                            type="number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="form-control floating"
                            required
                          />
                          <label className="focus-label">Mobile</label>
                        </div>
                        <div className="form-group form-focus">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control floating"
                            required
                          />
                          <label className="focus-label">Email</label>
                        </div>
                        <div className="form-group form-focus">
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-control floating"
                            required
                          />
                          <label className="focus-label">Password</label>
                        </div>
                        <div className="form-group form-focus">
                          <input
                            type="text"
                            name="referal"
                            value={formData.referal}
                            onChange={handleInputChange}
                            className="form-control floating"
                          />
                          <label className="focus-label">Enter Your referal person phone number</label>
                        </div>

                        <div className="form-group form-check-box">
                        {/* <div className="form-group-flex">
                          <label className="custom_check d-inline-flex">
                            {" "}
                            Is Private
                            <input
                              type="checkbox"
                              name="isPrivate"
                              checked={formData.isPrivate} // This will reflect the checkbox state
                              onChange={handleInputChange} // Handle checkbox change
                            />
                            <span className="checkmark" />
                          </label>
                          <label className="custom_check d-inline-flex">
                            {" "}
                            Login with OTP
                            <input
                              type="checkbox"
                              name="login"
                              defaultChecked="true"
                            />
                            <span className="checkmark" />
                          </label>
                        </div> */}
                      </div>
                        {/* <div className="text-end">
                          <Link className="forgot-link" to="/login">
                            Already have an account?
                          </Link>
                        </div> */}
                        <button
        className="btn btn-primary w-100 btn-lg login-btn"
        type="submit"
      >
        Signup
      </button>
                        <div className="login-or">
                          <span className="or-line" />
                          <span className="span-or">or</span>
                        </div>
                        <div className="text-center dont-have">
                        <span className="highlight-text">
                          <strong>GO TO</strong>{" "}
                          <Link to="/" className="home-link">
                            <i className="fa fa-home"></i> HOME
                          </Link>
                        </span>
                      </div>
                        {/* <div className="row form-row social-login">
                          <div className="col-6">
                            <Link to="#" className="btn btn-facebook w-100">
                              <i className="fab fa-facebook-f me-1" /> Login
                            </Link>
                          </div>
                          <div className="col-6">
                            <Link to="#" className="btn btn-google w-100">
                              <i className="fab fa-google me-1" /> Login
                            </Link>
                          </div>
                        </div> */}
                      </form>
                      {/* /Register Form */}
                    </div>
                  </div>
                </div>
                {/* /Register Content */}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </>

      <Footer {...props} />
    </>
  );
};

export default Register;
