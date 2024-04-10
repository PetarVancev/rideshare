import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import RideIncomeCard from "./RideIncomeCard";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Wallet = () => {
  const location = useLocation();
  const { token, userType } = useAuth();

  const [selectedTransactionType, setSelectedTransactionType] =
    useState("income");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (selectedTransactionType === "income") {
      setRideWithTransactions();
    } else {
      getAndSetWithdrawals();
    }
  }, [location.search, selectedTransactionType]);

  const getRides = async () => {
    try {
      let url = `${backendUrl}/reservations/${userType}/get-my?status=C`;
      if (userType == "driver") {
        url = `${backendUrl}/rides/get-my?status=C`;
      }
      const response = await axios.get(
        url, // Using userType directly here
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching ride data:", error);
    }
  };

  const getRideTransactions = async (rideId) => {
    try {
      let url = `${backendUrl}/wallet/get-ride-transactions?rideId=${rideId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching ride data:", error);
    }
  };

  const setRideWithTransactions = async () => {
    try {
      const rides = await getRides();
      const ridesWithTransactions = [];

      for (let ride of rides) {
        const transactions = await getRideTransactions(ride.id);
        if (transactions.length > 0) {
          ridesWithTransactions.push({
            ...ride,
            transactions,
          });
        }
      }

      setData(ridesWithTransactions);
    } catch (error) {
      console.error("Error fetching ride with transactions data:", error);
      setData(null);
    }
  };

  const getAndSetWithdrawals = async () => {
    try {
      let url = `${backendUrl}/wallet/get-withdrawals`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ride data:", error);
      setData([]);
    }
  };

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
        <Row className="mt-4">
          <Col xs={12}>
            <h3 className="heading-s text-blue">Последни трансакции</h3>
          </Col>
          <Col xs={6}>
            <button
              className={`choose-transaction-type ${
                selectedTransactionType === "income" ? "selected" : ""
              }`}
              onClick={() => setSelectedTransactionType("income")}
            >
              Последни приливи
            </button>
          </Col>
          <Col xs={6}>
            <button
              className={`choose-transaction-type ${
                selectedTransactionType === "bank" ? "selected" : ""
              }`}
              onClick={() => setSelectedTransactionType("bank")}
            >
              Префрлања во банка
            </button>
          </Col>
        </Row>

        <div className="transactions-container">
          {data &&
            data.length > 0 &&
            selectedTransactionType == "income" &&
            data.map((entity) => (
              <RideIncomeCard key={entity.id} data={entity} />
            ))}
          {data &&
            data.length > 0 &&
            selectedTransactionType == "bank" &&
            data.map((entity) => {
              return (
                <Card className="income-card mb-4" key={entity.id}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span>{entity.date_time}</span>
                      </div>
                      <div className="withdrawal-amount d-flex align-items-center justify-content-center">
                        <span>ден{entity.amount}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
        </div>
      </Container>
    </div>
  );
};

export default Wallet;
