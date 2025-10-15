import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import SearchRideCard from "./SearchRideCard";

const Home = () => {
  const today = new Date();
  const initials = {
    fromId: null,
    fromLocName: null,
    toId: null,
    toLocName: null,
    date: today,
    seats: 1,
  };

  return (
    <>
      <div className="home-background">
        <NavBar type="blue" />
        <BottomBar />
        <Container className="home-container d-flex flex-column align-items-center">
          <Row className="mt-5 home-search-row">
            <Col xs={12} xl={6} className="home-cta">
              <h2 className="heading-s white-text">
                What is your next destination?
              </h2>
              <p className="body-xs white-text">
                Find your cheapest and fastest ride to your desired destination
              </p>
              <img
                src="images/cta-underline-green.svg"
                className="cta-underline"
              />
            </Col>
            <Col xs={12} xl={5}>
              <SearchRideCard initials={initials} />
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="home-container1">
        <Row>
          <Col xs={12} xl={4} className="mb-4">
            <img src="images/divide-icon.svg" className="mb-1 icon" />
            <h4 className="heading-xxs">
              Share rides, travel at the lowest prices
            </h4>
            <p className="body-s blue-text">
              With us, traveling is cheaper and more efficient. Post your ride
              or join an already posted ride and save money. Our app allows you
              to easily find transportation to your destination and share costs
              with other passengers. It's time to reduce travel expenses and
              enjoy the comfort of shared rides.
            </p>
          </Col>
          <Col xs={12} xl={4} className="mb-4">
            <img src="images/shield-icon.svg" className="mb-1 icon" />
            <h4 className="heading-xxs">Safety is our top priority</h4>
            <p className="body-s blue-text">
              Your safety and security are our priority. All our drivers and
              passengers are verified and rated to ensure the highest level of
              security. With our app, you can check the profile and rating of
              drivers and passengers before joining a ride. We encourage you to
              leave feedback about your experience to keep the community safe
              and trustworthy.
            </p>
          </Col>
          <Col xs={12} xl={4} className="mb-4">
            <img src="images/dollar-icon.svg" className="mb-1 icon" />
            <h4 className="heading-xxs">Pay by card or cash</h4>
            <p className="body-s blue-text">
              Our platform allows you to choose between paying by card or cash.
              If you prefer fast and secure payment, use your card through our
              app. For those who prefer cash, you can arrange payment directly
              with the driver. We make every transaction easy and secure for all
              users.
            </p>
          </Col>
        </Row>
      </Container>
      <div className="pt-5 pb-5 blue-background">
        <div className="text-center desktop-hide">
          <img src="images/home-photo1.png" className="home-section-img" />
        </div>
        <Container>
          <Row>
            <Col xs={12} xl={6}>
              <h4 className="heading-m white-text mt-4 mb-3">
                Save while you drive
              </h4>
              <p className="body-s white-text mb-4">
                Every seat in your car is an opportunity for savings and a new
                friendship. With each passenger who joins your ride, your costs
                decrease, and the trip becomes more pleasant and interesting.
              </p>
              <button
                className="green-button"
                onClick={() => (window.location.href = "/post-ride")}
              >
                Post a ride
              </button>
            </Col>
            <Col xs={12} xl={6} className="d-flex mobile-hide">
              <img
                src="images/home-photo1-desktop.png"
                className="home-section-img2"
              />
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="pt-5 pb-5">
        <Row>
          <Col xs={12} xl={6}>
            <div className="home-img-container">
              <img src="images/home-photo2.jpg" className="home-section-img" />
            </div>
          </Col>
          <Col xs={12} xl={6}>
            <h4 className="heading-m mt-4 mb-3">About us</h4>
            <p className="body-s blue-text mb-4">
              We are a team passionate and dedicated to making travel cheaper,
              more comfortable, and more enjoyable for everyone. Our idea is to
              allow you to share travel costs with other passengers going in the
              same direction, creating a more economical and sustainable way of
              transportation. <br /> <br /> Behind this project is our team of
              three founders and a large support team. Special thanks to all our
              supporters, who with their dedication and belief in our idea
              contributed to what we are today. <br /> <br /> We invite you to
              become part of our community and experience the benefits of
              ride-sharing.
            </p>
            <button
              className="green-button"
              onClick={() => (window.location.href = "/about-us")}
            >
              Read more
            </button>
          </Col>
        </Row>
      </Container>
      <footer className="text-center card-payment-info pt-4 pb-4">
        <img src="images/visa-secure-icon.png" className="me-2" />
        <img src="images/mastercard-secure-icon.png" className="ms-2" />
        <p className="text-center body-xs mt-2">
          All your transactions are secure with our protection, and the same
          applies to the data you enter when booking.
        </p>
        <div className="text-center body-xs mt-2">
          <a href="/privacy-policy">Privacy Policy</a> | © rideshare 2024
        </div>
      </footer>
    </>
  );
};

export default Home;
