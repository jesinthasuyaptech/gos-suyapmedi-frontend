import React, {useState, useEffect}from "react";
import Header from "../../header";
import DoctorSidebar from "../sidebar";
import DoctorFooter from "../../common/doctorFooter";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile3, doctorprofileimg } from "../../imagepath";
import { Link } from "react-router-dom";
import { initialSettings } from "../../common/filter";
import DateRangePicker from "react-bootstrap-daterangepicker/dist";
import { notification } from "antd";
import { var_api, image_api } from "../../../../constant";
import { pat_dummy, doc_dummy } from "../../imagepath";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";


const Review = (props) => {
  const [reviewList, setReviewList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [overallRating, setoverallRating] = useState(0);
  const [profileDetails, setProfileDetails] = useState(null);
  const reviewsPerPage = 10; // Show 10 reviews per page
  
  
  const handleReplyClick = (review) => {
    setShowModal(true);
    setSelectedReview(review);
    setReply(review.reply_tech);
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setReply(""); // Reset input
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmitReply = async () => {
    setLoading(true);
    const token =  localStorage.getItem('doc_token');
    console.log("re", selectedReview);
    const headers = {
      headers: {
        Authorization: token, // Pass the token in Authorization header
        "Content-Type": "application/json",
      },
    };
    try {
      const payload = {
        hos_id: selectedReview?.hos_id,
        doc_id: selectedReview?.doc_id,
        patient_id: selectedReview?.patient_id,
        review_note: selectedReview?.review_note,
        rating_count: selectedReview?.rating_count,
        nontech_id:0,
        reply: new Date(),
        reply_tech: reply,
        reply_nontech: "",
      };

      await axios.put(`${var_api}review/update/${selectedReview?.id}`, payload, headers);
      alert("Reply submitted successfully");
      handleCloseModal();
      fetchDoctorsReview();
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to submit reply");
    }
    setLoading(false);
  };

   //doctors review list
      const fetchDoctorsReview = async () => {
        setLoading(true);
        const token =  localStorage.getItem('doc_token');
        const hospital_id = localStorage.getItem('doc_hospital_id');
        const doctor_id = localStorage.getItem('doctor_id');
       
    
        try {
          const response = await fetch(`${var_api}review/get-doctor/${hospital_id}/${doctor_id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, 
            },
          });
          if (response.status === 401) {
                  // history.push("/admin/login"); // Redirect to login page
                  notification.warning({
                    message: "Unauthorized",
                    description: "Your session has expired. Please log in again.",
                  });
                return;
                }
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setReviewList(result || null);
          setTotalPages(Math.ceil(result.length / reviewsPerPage)); // Calculate total pages
        } catch (error) {
          console.error("Error fetching data:", error);
          notification.error({
            message: "Fetch Failed",
            description: "Unable to retrieve data. Please try again later.",
          });
        } finally {
          setLoading(false);
        }
      };


      //doctors review list
      const fetchOverallRatings = async () => {
        setLoading(true);
        const token =  localStorage.getItem('doc_token');
        const hospital_id = localStorage.getItem('doc_hospital_id');
        const doctor_id = localStorage.getItem('doctor_id');
       
       
    
        try {
          const response = await fetch(`${var_api}review/get/overall-rating/${hospital_id}/${doctor_id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, 
            },
          });
          if (response.status === 401) {
                  // history.push("/admin/login"); // Redirect to login page
                  notification.warning({
                    message: "Unauthorized",
                    description: "Your session has expired. Please log in again.",
                  });
                return;
                }
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setoverallRating(parseFloat(result.overall_rating));
        } catch (error) {
          console.error("Error fetching data:", error);
          notification.error({
            message: "Fetch Failed",
            description: "Unable to retrieve data. Please try again later.",
          });
        } finally {
          setLoading(false);
        }
      };

        const fetchDoctorDetails = async () => {
          const token = localStorage.getItem("doc_token");
          const doc_id = localStorage.getItem("doctor_id");
          try {
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
            console.error("Error fetching doctor details:", err);
          }
        };


       useEffect(() => {
            fetchDoctorsReview();
            fetchOverallRatings();
            fetchDoctorDetails();
          }, []);

          // Get current page reviews (Frontend Pagination)
const indexOfLastReview = currentPage * reviewsPerPage;
const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
const currentReviews = reviewList.slice(indexOfFirstReview, indexOfLastReview);

// Handle Page Change
const handlePageChange = (newPage) => {
  if (newPage > 0 && newPage <= totalPages) {
    setCurrentPage(newPage);
  }
};

// Pagination Logic (Show only 3 pages at a time)
const startPage = Math.max(1, currentPage - 1);
const endPage = Math.min(totalPages, startPage + 2);
const pageNumbers = [];
for (let i = startPage; i <= endPage; i++) {
  pageNumbers.push(i);
}

  return (
    <>
       <Header profileDetails={profileDetails}  />
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
              <h2 className="breadcrumb-title">Reviews</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home-1">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Reviews
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
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
              <DoctorSidebar
             profileDetails={profileDetails}
             setProfileDetails={setProfileDetails}
             />
              {/* /Profile Sidebar */}
            </div>
            <div className="col-lg-8 col-xl-9">
            <div className="doc-review">
              <div className="dashboard-header">
                <div className="header-back">
                  <h3>Reviews</h3>
                </div>
              </div>
              {/* Review Listing */}
              <ul className="comments-list">
                <li className="over-all-review">
                  <div className="review-content">
                  <div className="review-rate">
    <h5>Overall Rating</h5>
    <div className="star-rated">
        <span>{overallRating.toFixed(1)}</span>
        {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
            <i
                key={index}
                className={ starValue <= Math.floor(overallRating)
                  ? "fa-solid fa-star filled" // Full star
                  : starValue - 0.5 <= overallRating
                  ? "fa-solid fa-star-half-alt filled" // Half star
                  : "fa-regular fa-star"}
            />
                );
        })}
    </div>
</div>

                    {/* <div className="position-relative daterange-wraper">
                      <div className="input-groupicon calender-input">
                      <DateRangePicker initialSettings={initialSettings}>
                        <input
                          className="form-control  date-range bookingrange"
                          type="text"
                        />
                      </DateRangePicker>
                      </div>
                      <i className="fa-solid fa-calendar-days" />
                    </div> */}
                  </div>
                </li>

                {/* <li>
                  <div className="comments">
                    <div className="comment-head">
                      <div className="patinet-information">
                        <Link to="#">
                          <img
                            src={doctordashboardprofile01}
                            alt="User Image"
                          />
                        </Link>
                        <div className="patient-info">
                          <h6>
                            <Link to="#">Naveen</Link>
                          </h6>
                          <span>15 Mar 2024</span>
                        </div>
                      </div>
                      <div className="star-rated">
                        <i className="fa-solid fa-star filled" />
                        <i className="fa-solid fa-star filled" />
                        <i className="fa-solid fa-star filled" />
                        <i className="fa-solid fa-star filled" />
                        <i className="fa-solid fa-star" />
                      </div>
                    </div>
                    <div className="review-info">
                      <p>
                        {" "}
                        Dr. Ramesh has been my family's trusted doctor for years.
                        Their genuine care and thorough approach to our health concerns
                        make every visit reassuring. Dr. Ramesh's ability to listen
                        and explain complex health issues in understandable terms is
                        exceptional. We are grateful to have such a dedicated physician by
                        our side
                      </p>
                      <div className="comment-reply">
                        <Link to="#" className="d-inline-flex align-items-center">
                          <i className="fa-solid fa-reply me-2" /> Reply
                        </Link>
                      </div>
                    </div>
                  </div>
                </li> */}
                   {currentReviews.map((review) => (
                <li key={review.id}>
                  <div className="comments">
                    <div className="comment-head">
                      <div className="patinet-information">
                        <Link to="#">
                          <img
                            src=
                            {
                              review?.profile_image &&
                                                                                                                              /\.(jpeg|jpg|png|webp)$/i.test(
                                                                                                                                review.profile_image
                                                                                                                              )
                                                                                                                                ? `${image_api}${review?.profile_image}`
                                                                                                                                :pat_dummy}
                            alt="User Image"
                          />
                        </Link>
                        <div className="patient-info">
                          <h6>
                            <Link to="#">{review.name}</Link>
                          </h6>
                          <span>{formatDate(review.created_at)}</span>
                        </div>
                      </div>
                      <div className="star-rated">
                      {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa-solid fa-star ${i < review.rating_count ? "filled" : ""}`}
                    />
                  ))}
                      </div>
                    </div>
                    <div className="review-info">
                      <p>
                      {review.review_note}
                      </p>
                      <div className="comment-reply">
                        <Link
                          to="#"
                          className="d-inline-flex align-items-center replied-text"
                          onClick={()=>handleReplyClick(review)}
                        >
                          <i className="fa-solid fa-reply me-2" /> Reply
                        </Link>
                      </div>
                    </div>
                  </div>
                  {review.reply_tech && (
                  <ul>
                    <li>
                      <div className="replied-comment">
                        <div className="patinet-information">
                          <Link to="#">
                            <img
                              src= {
                                review?.doc_profile_image &&
                                                                                                                                /\.(jpeg|jpg|png|webp)$/i.test(
                                                                                                                                  review.doc_profile_image
                                                                                                                                )
                                                                                                                                  ? `${image_api}${review?.doc_profile_image}`
                                                                                                                                  : doc_dummy}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <h6>
                              <Link to="#">me</Link>
                            </h6>
                            <span>{formatDate(review.reply)}</span>
                          </div>
                        </div>
                        <div className="review-info">
                          <p>
                           {review.reply_tech}
                          </p>
                          {/* <div className="comment-reply">
                            <Link to="#" className="d-inline-flex align-items-center">
                              <i className="fa-solid fa-reply me-2" /> Reply
                            </Link>
                          </div> */}
                        </div>
                      </div>
                    </li>
                  </ul>
                  )}
                </li>
                   ))}
                {/* <li>
                  <div className="comments">
                    <div className="comment-head">
                      <div className="patinet-information">
                        <Link to="#">
                          <img
                            src={doctordashboardprofile3}
                            alt="User Image"
                          />
                        </Link>
                        <div className="patient-info">
                          <h6>
                            <Link to="#">Saran</Link>
                          </h6>
                          <span>05 Mar 2024</span>
                        </div>
                      </div>
                      <div className="star-rated">
                        <i className="fa-solid fa-star filled" />
                        <i className="fa-solid fa-star filled" />
                        <i className="fa-solid fa-star filled" />
                        <i className="fa-solid fa-star filled" />
                        <i className="fa-solid fa-star" />
                      </div>
                    </div>
                    <div className="review-info">
                      <p>
                        From my first consultation through to the completion of my
                        treatment, Dr. Ramesh, my dentist, has been nothing short
                        of extraordinary. Dental visits have always been a source of
                        anxiety for me, but Dr. Ramesh's office provided an
                        atmosphere of calm and reassurance that I had not experienced
                        elsewhere. Highly Recommended!
                      </p>
                      <div className="comment-reply">
                        <Link to="#" className="d-inline-flex align-items-center">
                          <i className="fa-solid fa-reply me-2" /> Reply
                        </Link>
                      </div>
                    </div>
                  </div>
                </li> */}
              </ul>
              {/* /Comment List */}
              {/* Pagination */}
              <div className="pagination dashboard-pagination">
    <ul>
      {/* Previous Button */}
      <li>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="page-link"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>
      </li>

      {/* Page Numbers (Only 3 at a time) */}
      {pageNumbers.map((page) => (
        <li key={page}>
          <button
            onClick={() => handlePageChange(page)}
            className={`page-link ${currentPage === page ? "active" : ""}`}
          >
            {page}
          </button>
        </li>
      ))}

      {/* Next Button */}
      <li>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="page-link"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </li>
    </ul>
  </div>
              {/* /Pagination */}
            </div>
          </div>
          
          </div>
        </div>
        <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Enter your reply</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitReply}>
            Submit Reply
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      {/* /Page Content */}
      <DoctorFooter {...props} />
    </>
  );
};

export default Review;
