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
  const { token, userType, logoutUser } = useAuth();

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

  const [depositAmount, setDepositAmount] = useState(50);

  const handleDepositChange = (value) => {
    value = parseInt(value, 10);
    if (!isNaN(value)) {
      setDepositAmount(value);
    }
  };

  const depositValues = [];
  let denomination = 300;
  depositValues.push(50);
  if (userType == "passenger") {
    for (let i = 1; i < 8; i++) {
      depositValues.push(denomination);
      denomination += 300;
    }
  }

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
  }, [location.search, selectedTransactionType, currModal]);

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
  }, [showSuccess, location.search]);

  useEffect(() => {
    if (currModal) {
      window.scrollTo(0, 0);
      document.body.style.overflowY = "hidden";
      document.documentElement.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    };
  }, [currModal]);

  const getWallet = async () => {
    try {
      let url = `${backendUrl}/wallet/get-wallet`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data[0];
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
      console.error("Error fetching wallet:", error);
    }
  };

  const getRides = async () => {
    try {
      let url = `${backendUrl}/reservations/${userType}/get-my?status=C`;
      if (userType == "driver") {
        url = `${backendUrl}/rides/get-my?status=C`;
      }
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
        if (transactions && transactions.length > 0) {
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
      setSuccessMessage("Your money has been successfully transferred");
      setNextStepsMessage(
        "*Your funds will be available the next day after transfer"
      );
      setShowSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
      toast.dismiss();
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeButton: true,
      });
    }
  };

  const handleDeposit = async () => {
    try {
      let url = `${backendUrl}/wallet/start-deposit`;
      const response = await axios.post(
        url,
        { amount: depositAmount },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const paymentData = response.data;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://epay.halkbank.mk/fim/est3Dgate";
      for (const key in paymentData) {
        if (paymentData.hasOwnProperty(key)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = paymentData[key];
          form.appendChild(input);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
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
      setError("Enter the same bank account in both fields");
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
        if (error.response && error.response.status === 401) {
          logoutUser();
        }
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div
      className={`${
        currModal === null && !showSuccess ? "has-bottom-bar" : ""
      }`}
    >
      {/* Modals */}
      <SubmissionSuccess
        className={`wallet-success-message ${showSuccess && "show"}`}
        statusMessage={successMessage}
        nextStepsMessage={nextStepsMessage}
        buttonText="Wallet"
        customButtonAction={() => {
          setShowSuccess(false);
        }}
      />
      <div
        className={`withdraw-container ${
          currModal === "withdraw" ? "show" : ""
        }`}
      >
        <Container>
          <h2 className="heading-xs mt-5 text-center mb-5">
            <img src="images/bank-icon.svg" /> Transfer to Bank
          </h2>
          <div className="bottom-border-gray">
            <h4 className=" heading-xxs">Bank Account</h4>
            <div className="bank-acc-number d-flex align-items-center">
              {bankAcc}
            </div>
          </div>
          <div className="amount-container mt-4">
            <h4 className="heading-xxs">Amount to Transfer</h4>
            <div class="input-container2">
              <div class="left-corner-div heading-xs d-flex justify-content-center align-items-center">
                MKD
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
                Cancel
              </Button>
            </Col>
            <Col xs={6} className="text-end">
              <Button variant="outline-success" onClick={requestWithdraw}>
                Transfer
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <div
        className={`withdraw-container ${currModal === "bank" ? "show" : ""}`}
      >
        <Container>
          <h2 className="heading-xs mt-5 text-center mb-5">
            <img src="images/card-icon.svg" className="me-1" />
            Bank Account
          </h2>
          <div className="bank-acc-input-container">
            <h4 className="heading-xxs">Enter Bank Account</h4>
            <input
              className="withdrawal-input bank-input mb-4"
              type="number"
              value={bankAcc}
              onChange={(event) => setBankAcc(event.target.value)}
            />
            <h4 className="heading-xxs">Confirm Bank Account</h4>
            <input
              className="withdrawal-input bank-input "
              type="number"
              value={bankAccConfirm}
              onChange={(event) => setBankAccConfirm(event.target.value)}
            />
          </div>
          <p className="body-bold-s blue-text mt-2">
            Payments will be sent to the above account
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
                Cancel
              </Button>
            </Col>
            <Col xs={6} className="text-end">
              <Button
                variant="outline-success"
                onClick={handleBankAccountChange}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Deposit modal */}
      <div
        className={`withdraw-container deposit-container ${
          currModal === "deposit" ? "show" : ""
        }`}
      >
        <Container>
          <h2 className="heading-xs mt-5 text-center mb-5">
            <img src="images/plus-icon.svg" /> Add Funds
          </h2>
          <div className="amount-container">
            <h4 className="heading-xxs">Amount to Add</h4>
            <div class="input-container2">
              <div class="left-corner-div heading-xs d-flex justify-content-center align-items-center">
                MKD
              </div>
              <input
                className="withdrawal-input"
                type="text"
                value={depositAmount}
                readOnly
              />
            </div>
          </div>
          <Row className="deposit-values-container text-center">
            <h4 className="heading-xxs text-start">Select Amount to Add</h4>
            {depositValues.map((value, index) => (
              <Col
                key={index}
                xs={3}
                className={`deposit-values ${
                  depositAmount === value ? "selected" : ""
                }`}
                onClick={() => handleDepositChange(value)}
              >
                <div className="heading-xs deposit-amount">{value}</div>
                MKD
              </Col>
            ))}
          </Row>
          <Row className="withdraw-actions deposit-actions">
            <Col xs={6}>
              <Button
                variant="outline-primary"
                onClick={() => setCurrModal(null)}
              >
                Cancel
              </Button>
            </Col>
            <Col xs={6} className="text-end">
              <Button variant="outline-success" onClick={handleDeposit}>
                Add Funds
              </Button>
            </Col>
            <div className="text-center card-payment-info mt-2">
              <img src="images/visa-secure-icon.png" className="me-2" />
              <img src="images/mastercard-secure-icon.png" className="ms-2" />
              <p className="text-center body-xs blue-text">
                All your transactions are secure, including the data entered
                during booking.
              </p>
            </div>
          </Row>
        </Container>
      </div>

      {/* Main */}
      <div className="wallet-background"></div>
      <NavBar type="blue" />
      <BottomBar />
      <Container>
        <Row className="balance-row">
          <Col xs={8}>
            <p className="green-text heading-xs">
              MKD <strong className="heading-m">{balance}</strong>
            </p>
            <span className="sub-text body-s">Available Balance</span>
          </Col>
        </Row>
        <Row className="wallet-actions-row text-center">
          {userType === "driver" ? (
            <>
              <Col
                xs={6}
                className="right-border"
                onClick={() => setCurrModal("withdraw")}
              >
                <div>
                  <img src="images/bank-icon.svg" />
                </div>
                Transfer to Bank
              </Col>
              <Col xs={6} onClick={() => setCurrModal("bank")}>
                <div>
                  <img src="images/card-icon.svg" />
                </div>
                Bank Account
              </Col>
            </>
          ) : (
            <Col
              className="deposit-open"
              xs={12}
              onClick={() => setCurrModal("deposit")}
            >
              <img src="images/plus-icon.svg" /> Add Funds
            </Col>
          )}
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            <h3 className="heading-s text-blue">Recent Transactions</h3>
          </Col>
          <Col xs={6}>
            <button
              className={`choose-transaction-type ${
                selectedTransactionType === "income" ? "selected" : ""
              }`}
              onClick={() => {
                setData(null);
                setSelectedTransactionType("income");
              }}
            >
              {userType == "driver" ? "Recent Incomes" : "Paid Rides"}
            </button>
          </Col>
          <Col xs={6}>
            <button
              className={`choose-transaction-type ${
                selectedTransactionType === "bank" ? "selected" : ""
              }`}
              onClick={() => {
                setData(null);
                setSelectedTransactionType("bank");
              }}
            >
              {userType == "driver" ? "Bank Transfers" : "Top-ups"}
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
                        <span>MKD {entity.amount}</span>
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
