import React, {useState}from "react";
import { Link, useHistory } from "react-router-dom";
// import Header from "../../header";
import { googleicon, shape01, shape02 } from "./img";
// import FeatherIcon from "feather-icons-react/build/FeatherIcon";
// import config from "config";
import AuthenticationHeader from "../../authiticationHeader";
import axios from "axios";
import { var_api } from "../../../../constant";
import { logo } from "../../imagepath";
import { notification } from "antd";


const LoginEmailOtp = () => {
  const config = "/react/template";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const history = useHistory();



   const handleSubmit = async (e) => {
    e.preventDefault();
      setLoading(true);
      if (!email) {
        notification.error({
              message: "Email is required",
              description: "Please enter Email.",
            });
            setLoading(false);
           return;
      }
  
      // if (!validateEmail(email)) {
      //   notification.error({
      //     message: "Valid Email",
      //     description: "Please enter a valid email address",
      //   });
      
      //   return;
      // }
  
      try {
        const response = await axios.post(`${var_api}otp/send-allpatientids`, {
          email: email,
        });
  
        if (response.data?.success === false) {
          notification.error({
            message: "Error",
            description: response.data.message || "Unable to send email.",
          });
        } else {
          notification.success({
            message: "Email Sent",
            description: "Patient ID sent to your email",
          });
          history.push("/patient/patientlogin");
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.response?.data?.message || "Something went wrong",
        });
      } finally{
        setLoading(false);
      }
    };


      const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      history.push('/patient/patientlogin');
    }, 1000); // 1-second delay
  };
  

  return (
    <>
      {/* <Header {...props} /> */}
      {/* <AuthenticationHeader /> */}
      <>
        {/* Page Content */}
        {/* <div className="login-content-info">
          <div className="container"> */}
            {/* Login Email Otp */}
            {/* <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6">
                <div className="account-content">
                  <div className="login-shapes">
                    <div className="shape-img-left">
                      <img src={shape01} alt="" />
                    </div>
                    <div className="shape-img-right">
                      <img src={shape02} alt="" />
                    </div>
                  </div>
                  <div className="account-info">
                    <div className="login-back">
                      <Link to="/pages/login-email">
                        <i className="fa-solid fa-arrow-left-long" /> Back
                      </Link>
                    </div>
                    <div className="login-title">
                      <h3>Sign in</h3>
                      <p>Well send a confirmation code to your email.</p>
                      <span>
                        Sign in with{" "}
                        <Link to="/pages/login-phone">Phone Number</Link>
                      </span>
                    </div>
                    <form action={`${config}/pages/eotp`}>
                      <div className="form-group">
                        <label>E-mail</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="example@email.com"
                        />
                      </div>
                      <div className="form-group form-check-box">
                        <div className="form-group-flex">
                          <label className="custom_check d-inline-flex">
                            {" "}
                            Remember Me
                            <input
                              type="checkbox"
                              name="login"
                              defaultChecked="true"
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
                        </div>
                      </div>
                      <div className="form-group">
                        <button className="btn btn-block" type="submit">
                          Sign in
                        </button>
                      </div>
                      <div className="login-or">
                        <span className="or-line" />
                        <span className="span-or">or</span>
                      </div>
                      <div className="social-login-btn">
                        <Link to="#" className="btn btn-block">
                          <img src={googleicon} alt="" /> Log in with Google
                        </Link>
                      </div>
                      <div className="account-signup">
                        <p>
                          Dont have an account ?{" "}
                          <Link to="/signup">Sign up</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div> */}
              <div className="login-content-info">
                    { loading && (
                        <div className="loader-overlay">
                        <div className="loader"></div>
                      </div>
                    )}
                      <div className="container">
                        {/* Login Email Otp */}
                        <div className="row justify-content-center">
                          <div className="col-lg-4 col-md-6">
                            <div className="account-content"
                             style={{
                              border: '1px solid #e0e0e0',
                              padding: '30px',
                              borderRadius: '12px',
                              backgroundColor: '#fff',
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
                            }}
                            >
                              <div className="login-shapes">
                             <div style={{ display: 'flex', justifyContent: 'center' }}>
  <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
</div>
                                {/* <div className="shape-img-right">
                                  <img src={logo} alt="" />
                                </div> */}
                              </div>
                              <div className="account-info">
                                {/* <div className="login-back">
                                  <Link to="/pages/email-otp">
                                    <i className="fa-solid fa-arrow-left-long" /> Back
                                  </Link>
                                </div> */}
                                {/* <div className="login-verify-img">
                                  <img src={emailicon} alt="" />
                                </div> */}
                                <div className="login-title" style={{ textAlign: 'center', marginTop: '20px' }}>
                                 <h3>Forgot Patient Id</h3>
                                  <p className="mb-0">
                                   Enter your Email for send patient id {" "}
                                    {/* <strong>{patientEmail}</strong> */}
                                  </p>
                                </div>
                                <form
                                  method="get"
                                  className="digit-group login-form-control"
                                  data-group-name="digits"
                                  data-autosubmit="false"
                                  autoComplete="off"
                                  // action="/doctor/doctor-dashboard"
                                >
                                  {/* <div className="otp-box"> */}
                                    <div className="form-group">
                                    <label>E-mail</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                                    {/* </div> */}
                                  </div>
                                  {/* <div className="form-group">
                                    <div className="otp-info">
                                      <div className="otp-code">
                                        <p>Didn't receive OTP code?</p>
                                        <Link to="#">Resend Code</Link>
                                      </div>
                                      <div className="otp-sec">
                                        <p>
                                          <i className="feather-clock" /> 00:25 secs
                                        </p>
                                      </div>
                                    </div>
                                  </div> */}
                                  <div className="reset-btn">
                                    <button className="btn btn-block" onClick={handleSubmit}>
                                    Send
                                    </button>
                                  </div>
                                </form>
                                <div className="otp-code text-center" style={{
    textDecoration: "none",
    marginTop:"10px"
  }}>
             <>
      <span onClick={handleClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        <i className="fas fa-arrow-left"></i> I know my Patient ID (Back)
      </span>
      {loading && <p>Loading...</p>}
    </>
</div>
                              </div>
                            </div>
                          </div>
                        </div>
            {/* /Login Email Otp */}
          </div>
        </div>
        {/* /Page Content */}
      </>
    </>
  );
};

export default LoginEmailOtp;
