import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import RideIncomeCard from "./RideIncomeCard";
import SubmissionSuccess from "./SubmissionSuccess";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Wallet = () => {
  const location = useLocation();
  const { token, userType } = useAuth();

  const [selectedTransactionType, setSelectedTransactionType] =
    useState("income");
  const [data, setData] = useState(null);
  const [currModal, setCurrModal] = useState(null);
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(null);

  const [bankAcc, setBankAcc] = useState("");
  const [bankAccConfirm, setBankAccConfirm] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [nextStepsMessage, setNextStepsMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedTransactionType === "income") {
      if (userType === "driver") {
        setRideWithTransactions();
      } else {
        setTransactionWithRide();
      }
    } else {
      if (userType === "driver") {
        getAndSetWithdrawals();
      } else {
        getAndSetDeposits();
      }
    }
  }, [location.search, selectedTransactionType]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const fetchedWallet = await getWallet();
        setBalance(fetchedWallet.balance);
        setBankAcc(fetchedWallet.bank_acc_num);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchWallet();
  }, [successMessage, location.search]);

  useEffect(() => {
    if (showSuccess || currModal) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSuccess, currModal]);

  const getWallet = async () => {
    try {
      let url = `${backendUrl}/wallet/get-wallet`;
      const response = await axios.get(
        url, // Using userType directly here
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data[0];
    } catch (error) {
      console.error("Error fetching ride data:", error);
    }
  };

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
      console.error("Error fetching ride transactions:", error);
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

  const setTransactionWithRide = async () => {
    try {
      let url = `${backendUrl}/wallet/get-passenger-transactions`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ride transactions:", error);
      setData([]);
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
      console.error("Error fetching withdrawal data:", error);
      setData([]);
    }
  };

  const getAndSetDeposits = async () => {
    try {
      let url = `${backendUrl}/wallet/get-deposits`;
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

  const requestWithdraw = async () => {
    try {
      let url = `${backendUrl}/wallet/withdraw`;
      const response = await axios.post(
        url,
        { amount: withdrawAmount },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSuccessMessage("Успешно ги префрливте вашите пари");
      setNextStepsMessage(
        "*Вашите пари ќе ви бидат на располагање следниот ден откако сте ги префрлиле"
      );
      setShowSuccess(true);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeButton: true,
      });
    }
  };

  const handleWithAmountChange = (event) => {
    let inputValue = event.target.value;

    inputValue = inputValue.replace(/^0+/, "");

    const newWithdrawAmount = parseInt(inputValue);

    if (!isNaN(newWithdrawAmount)) {
      if (newWithdrawAmount <= balance) {
        setWithdrawAmount(newWithdrawAmount);
      }
    } else {
      setWithdrawAmount(0);
    }
  };

  const handleBankAccountChange = async (e) => {
    e.preventDefault();
    if (bankAcc != bankAccConfirm) {
      console.log(bankAcc);
      console.log(bankAccConfirm);
      setError("Внесете ја истата трансакциска сметка во двете полиња");
    } else {
      try {
        let url = `${backendUrl}/wallet/change-bank-acc`;
        const response = await axios.post(
          url,
          { bankAcc: bankAcc },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setError(null);
        setCurrModal(null);
      } catch (error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div
      className={`${
        currModal === null && !showSuccess ? "has-bottom-bar" : "no-scroll"
      }`}
    >
      {/* Modals */}
      <SubmissionSuccess
        className={`wallet-success-message ${showSuccess && "show"}`}
        statusMessage={successMessage}
        nextStepsMessage={nextStepsMessage}
        buttonText="Паричник"
        customButtonAction={() => {
          setShowSuccess(false);
        }}
      />
      <Container
        className={`withdraw-container ${
          currModal === "withdraw" ? "show" : ""
        }`}
      >
        <h2 className="heading-xs mt-5 text-center mb-5">
          <img src="images/bank-icon.svg" /> Префрли во банка
        </h2>
        <div className="bottom-border-gray">
          <h4 className=" heading-xxs">Трансакциска сметка</h4>
          <div className="bank-acc-number d-flex align-items-center">
            {bankAcc}
          </div>
        </div>
        <div className="amount-container">
          <h4 className="heading-xxs">Сума која ќе биде префрлена</h4>
          <div class="input-container2">
            <div class="left-corner-div heading-xs d-flex justify-content-center align-items-center">
              ден
            </div>
            <input
              className="withdrawal-input"
              type="text"
              value={withdrawAmount}
              onChange={handleWithAmountChange}
            />
          </div>
        </div>
        <Row className="withdraw-actions">
          <Col xs={6}>
            <Button
              variant="outline-primary"
              onClick={() => setCurrModal(null)}
            >
              Откажи
            </Button>
          </Col>
          <Col xs={6} className="text-end">
            <Button variant="outline-success" onClick={requestWithdraw}>
              Префрли
            </Button>
          </Col>
        </Row>
      </Container>

      <Container
        className={`withdraw-container ${currModal === "bank" ? "show" : ""}`}
      >
        <h2 className="heading-xs mt-5 text-center mb-5">
          <img src="images/card-icon.svg" />
          Трансакциска
        </h2>
        <form onSubmit={handleBankAccountChange}>
          <div className="bank-acc-input-container">
            <h4 className="heading-xxs">Внесете трансакциска сметка</h4>
            <input
              className="withdrawal-input bank-input mb-4"
              type="text"
              value={bankAcc}
              onChange={(event) => setBankAcc(event.target.value)}
            />
            <h4 className="heading-xxs">Повторете ја трансакциската сметка</h4>
            <input
              className="withdrawal-input bank-input "
              type="text"
              value={bankAccConfirm}
              onChange={(event) => setBankAccConfirm(event.target.value)}
            />
          </div>
          <p className="body-bold-s blue-text mt-2">
            На горе наведената сметка ќе ги примате плаќањата
          </p>
          {error && (
            <Alert className="mt-2" variant="danger">
              {error}
            </Alert>
          )}
          <Row className="withdraw-actions">
            <Col xs={6}>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setCurrModal(null);
                  setError(null);
                }}
              >
                Откажи
              </Button>
            </Col>
            <Col xs={6} className="text-end">
              <Button variant="outline-success" type="submit">
                Зачувај
              </Button>
            </Col>
          </Row>
        </form>
      </Container>

      {/* Main */}
      <div className="wallet-background"></div>
      <NavBar type="blue" />
      <BottomBar />
      <Container>
        <Row className="balance-row">
          <Col xs={8}>
            <p className="green-text heading-xs">
              ден <strong className="heading-m">{balance}</strong>
            </p>
            <span className="sub-text body-s">Расположливи средства</span>
          </Col>
        </Row>
        <Row className="wallet-actions-row text-center">
          <Col
            xs={6}
            className="right-border"
            onClick={() => setCurrModal("withdraw")}
          >
            <div>
              <img src="images/bank-icon.svg" />
            </div>
            Префрли во банка
          </Col>
          <Col xs={6} onClick={() => setCurrModal("bank")}>
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
              {userType == "driver" ? "Последни приливи" : "Платени превози"}
            </button>
          </Col>
          <Col xs={6}>
            <button
              className={`choose-transaction-type ${
                selectedTransactionType === "bank" ? "selected" : ""
              }`}
              onClick={() => setSelectedTransactionType("bank")}
            >
              {userType == "driver" ? "Префрлања во банка" : "Надополнувања"}
            </button>
          </Col>
        </Row>

        <div className="transactions-container">
          {data &&
            data.length > 0 &&
            selectedTransactionType == "income" &&
            data.map((entity) => (
              <RideIncomeCard
                key={entity.id}
                data={entity}
                userType={userType}
              />
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
                        <span className="btn-text-m blue-text">
                          {new Date(entity.date_time).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </div>
                      <div className="withdrawal-amount d-flex align-items-center justify-content-center btn-text-l">
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
