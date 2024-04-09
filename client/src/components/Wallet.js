import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";

const Wallet = () => {
  return (
    <div className="">
      <div className="wallet-background"></div>
      <NavBar type="blue" />
      <BottomBar />
      <Container>
        <Row className="balance-row">
          <Col xs={8}>
            <p className="green-text heading-xs">
              ден <strong className="heading-m">1,200</strong>
            </p>
            <span className="sub-text body-s">Расположливи средства</span>
          </Col>
        </Row>
        <Row className="wallet-actions-row text-center">
          <Col xs={6} className="right-border">
            <div>
              <img src="images/bank-icon.svg" />
            </div>
            Префрли во банка
          </Col>
          <Col xs={6}>
            <div>
              <img src="images/card-icon.svg" />
            </div>
            Трансакциска
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Wallet;
