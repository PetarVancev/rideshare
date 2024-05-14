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

  const [depositAmount, setDepositAmount] = useState(300);

  const handleDepositChange = (value) => {
    value = parseInt(value, 10);
    if (!isNaN(value)) {
      setDepositAmount(value);
    }
  };

  const depositValues = [];
  let denomination = 300;
  if (userType == "passenger") {
    for (let i = 0; i < 8; i++) {
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
      let url = `${backendUrl}/wallet/deposit`;
      const response = await axios.post(
        url,
        { amount: depositAmount },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSuccessMessage("Успешно ја надополнивте вашата сметка");
      setNextStepsMessage("");
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
        buttonText="Паричник"
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
      </div>

      <div
        className={`withdraw-container ${currModal === "bank" ? "show" : ""}`}
      >
        <Container>
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
              <h4 className="heading-xxs">
                Повторете ја трансакциската сметка
              </h4>
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
      </div>
      {/* Deposit modal */}
      <div
        className={`withdraw-container deposit-container ${
          currModal === "deposit" ? "show" : ""
        }`}
      >
        <Container>
          <h2 className="heading-xs mt-5 text-center mb-5">
            <img src="images/plus-icon.svg" /> Надополни средства
          </h2>
          <div className="amount-container">
            <h4 className="heading-xxs">Сума која ќе биде надополнета</h4>
            <div class="input-container2">
              <div class="left-corner-div heading-xs d-flex justify-content-center align-items-center">
                ден
              </div>
              <input
                className="withdrawal-input"
                type="text"
                value={depositAmount}
                onChange={(event) => handleDepositChange(event.target.value)}
              />
            </div>
          </div>
          <Row className="deposit-values-container text-center">
            <h4 className="heading-xxs text-start">
              Одберете износ за надополнување
            </h4>
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
                ден
              </Col>
            ))}
          </Row>
          <Row className="withdraw-actions deposit-actions">
            <Col xs={6}>
              <Button
                variant="outline-primary"
                onClick={() => setCurrModal(null)}
              >
                Откажи
              </Button>
            </Col>
            <Col xs={6} className="text-end">
              <Button variant="outline-success" onClick={handleDeposit}>
                Префрли
              </Button>
            </Col>
            <div className="text-center card-payment-info mt-2">
              <img src="images/visa-secure-icon.png" className="me-2" />
              <img src="images/mastercard-secure-icon.png" className="ms-2" />
              <p className="text-center body-xs blue-text">
                Сите ваши трансакции се сигурни со нашата заштита, а истото важи
                и за податоците што ги внесувате при резервирање.
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
              ден <strong className="heading-m">{balance}</strong>
            </p>
            <span className="sub-text body-s">Расположливи средства</span>
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
                Префрли во банка
              </Col>
              <Col xs={6} onClick={() => setCurrModal("bank")}>
                <div>
                  <img src="images/card-icon.svg" />
                </div>
                Трансакциска
              </Col>
            </>
          ) : (
            <Col
              className="deposit-open"
              xs={12}
              onClick={() => setCurrModal("deposit")}
            >
              <img src="images/plus-icon.svg" /> Надополни средства
            </Col>
          )}
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
