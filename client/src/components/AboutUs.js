import React from "react";
import { Container } from "react-bootstrap";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";

const AboutUs = () => {
  return (
    <div className="has-bottom-bar">
      <NavBar type="white" />
      <BottomBar />
      <Container className="blue-text about-us-container">
        <h1 className="heading-s pt-4 pb-4 mb-0">About us</h1>
        <p>
          Welcome to our ridesharing platform! We are a team that is passionate
          and dedicated to making travel cheaper, more convenient and more
          enjoyable for everyone. Our idea is to enable you to share the cost of
          your trip with other passengers traveling in the same direction,
          creating a more economical and sustainable way of transportation.
        </p>
        <div className=" pb-4 pt-4">
          <h3 className="heading-xxs mb-3">Mission</h3>
          <p>
            Our mission is to listen and care for our users. You are the ones
            who help us grow and improve. Any feedback, suggestion or criticism
            from you is invaluable to us. We believe that together we can build
            a platform that will benefit everyone, offering security,
            convenience and flexibility in travel.
          </p>
        </div>
        <div className=" pb-4 pt-4">
          <h3 className="heading-xxs mb-3">Team</h3>
          <p>
            Behind this project are us, a team of three founders and a large
            team of supporters. We express special gratitude to all our
            supporters, who, with their dedication and belief in our idea,
            contributed to making us what we are today. The founders of this
            platform are Adrian Zareski and Petar Vanchev, with the help of our
            advisor Jordan Aiko Deja. Together, we put a lot of effort and
            enthusiasm into making your adventure simpler and cheaper. <br />
            <br /> We invite you to become part of our community and see for
            yourself the benefits of ridesharing. With your support and
            participation, we believe that we can achieve even greater successes
            and offer you even better services. We thank you for your trust and
            look forward to your every new journey with us! <br /> <br />
            Rideshare team
          </p>
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;
