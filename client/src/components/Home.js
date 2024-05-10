import React from "react";
import { Container } from "react-bootstrap";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import SearchRideCard from "./SearchRideCard";

const Home = () => {
  return (
    <div className="home-background">
      <NavBar type="blue" />
      <BottomBar />
      <Container className="home-container">
        <div className="d-flex align-items-center justify-content-center h-100">
          <SearchRideCard />
        </div>
      </Container>
    </div>
  );
};

export default Home;
