import React from "react";
import { Container } from "react-bootstrap";

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
    <div className="home-background">
      <NavBar type="blue" />
      <BottomBar />
      <Container className="home-container d-flex flex-column align-items-center">
        <div className="mt-5">
          <h2 className="heading-s white-text">
            Која е твојата следна дестинација?
          </h2>
          <p className="body-xs white-text">
            Најди го твојот најевтин и најбрз превоз до посакуваната дестинација
          </p>
          <img src="images/cta-underline-green.svg" className="cta-underline" />
        </div>
        <SearchRideCard initials={initials} />
        <div className="text-center card-payment-info">
          <img src="images/visa-secure-icon.png" className="me-2" />
          <img src="images/mastercard-secure-icon.png" className="ms-2" />
          <p className="text-center body-xs blue-text mt-2">
            Сите ваши трансакции се сигурни со нашата заштита, а истото важи и
            за податоците што ги внесувате при резервирање.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Home;
