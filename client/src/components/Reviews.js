import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import BackButton from "./BackButton";
import ReviewBox from "./ReviewBox";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Reviews = () => {
  const location = useLocation();

  const [reviewsData, setReviewsData] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const driverId = queryParams.get("driverId");

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        let url = `${backendUrl}/reviews/get-all?driverId=${driverId}`;
        const response = await axios.get(
          url // Using userType directly here
        );
        setReviewsData(response.data);
        console.log(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviewsData();
  }, []);

  return (
    <>
      <div className="reviews-top-bar">
        <Container>
          <div className="back-button-bar">
            <BackButton />
          </div>
          <div className="d-flex space-between reviews-results-info">
            <div className="all-reviews-info">
              <div className="mb-2 green-text heading-s">
                <i className="fas fa-star me-1" />
                {reviewsData.averageScore}/5
              </div>
              {reviewsData.reviews && (
                <h4>{reviewsData.reviews.length} Рецензии</h4>
              )}
            </div>
          </div>
        </Container>
      </div>
      <Container className="reviews-container">
        <Container className="reviews-container">
          {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
            reviewsData.reviews.map((reviewData) => (
              <ReviewBox key={reviewData.id} reviewData={reviewData} />
            ))
          ) : (
            <p className="text-center rides-count body-bold-xs mt-4">
              Возачот сеуште нема рецензии
            </p>
          )}
        </Container>
      </Container>
    </>
  );
};

export default Reviews;
