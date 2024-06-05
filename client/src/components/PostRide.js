import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Row,
  Col,
  Collapse,
} from "react-bootstrap";
import axios from "axios";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import FormProgressIndicator from "./FormProgressIndicator";
import LocationAutocomplete from "./LocationAutocomplete";
import BackButton from "./BackButton";
import SubmissionSuccess from "./SubmissionSuccess";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const mapsApiKey = process.env.REACT_APP_MAPS_API_KEY;

const PostRide = () => {
  const { token, logoutUser } = useAuth();

  const [step, setStep] = useState(1);
  const [fromName, setFromName] = useState("");
  const [fromId, setFromId] = useState("");
  const [flexibleDeparture, setFlexibleDeparture] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [departureHours, setDepartureHours] = useState("00");
  const [departureMinutes, setDepartureMinutes] = useState("00");

  const [toName, setToName] = useState("");
  const [toId, setToId] = useState("");
  const [flexibleArrival, setFlexibleArrival] = useState(false);
  const [travelHours, setTravelHours] = useState("00");
  const [travelMinutes, setTravelMinutes] = useState("00");

  const [seats, setSeats] = useState(1);
  const [carModel, setCarModel] = useState("");
  const [carColor, setCarColor] = useState("");

  const [ridePrice, setRidePrice] = useState(300);
  const [feeBreakdownOpen, setFeeBreakdownOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("card");
  let taxForState;
  let transactionFee;
  let fee;
  let carrierServiceFee;
  let totalPrice;
  if (paymentType == "card") {
    taxForState = parseInt(ridePrice * 0.1);
    transactionFee = Math.max(1, Math.ceil(ridePrice * 0.025));
    fee = parseInt(ridePrice * 0.2);
    carrierServiceFee = parseInt(fee - taxForState - transactionFee);
  } else {
    fee = 40;
    transactionFee = Math.max(1, Math.ceil(fee * 0.025));
    carrierServiceFee = parseInt(fee - transactionFee);
  }
  totalPrice = parseInt(ridePrice) + fee;
  const [cashNoticeOpen, setCashNoticeOpen] = useState(false);

  const [rideNotice, setRideNotice] = useState("");
  const [policyCheck, setPolicyCheck] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const errorMessageRef = useRef(null);

  const [success, setSuccess] = useState(false);
  const successMessage = "Успешно објавивте превоз";
  const nextStepsMessage =
    "*Вашата резервација можете да ја погледнете во делот активни патувања";

  useEffect(() => {
    if (cashNoticeOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [cashNoticeOpen]);

  const currentDateTime = new Date();
  const currentDate = currentDateTime.toISOString().split("T")[0];

  const changeSeatsNumber = (val) => {
    const newSeats = seats + val;
    if (newSeats >= 1 && newSeats <= 15) {
      setSeats(newSeats);
    }
  };

  const goBack = () => {
    if (step != 1) {
      setStep(step - 1);
    }
  };

  const getTravelTime = async () => {
    try {
      const fromResponse = await fetch(
        `${backendUrl}/locations/get-location?locationId=${fromId}`
      );
      const toResponse = await fetch(
        `${backendUrl}/locations/get-location?locationId=${toId}`
      );

      const fromCord = await fromResponse.json();
      const toCord = await toResponse.json();

      const service = new window.google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: [
            new window.google.maps.LatLng(
              fromCord.location_lat,
              fromCord.location_lon
            ),
          ],
          destinations: [
            new window.google.maps.LatLng(
              toCord.location_lat,
              toCord.location_lon
            ),
          ],
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status === "OK") {
            const durationText = response.rows[0].elements[0].duration.text;
            const durationParts = durationText.split(" ");

            let hours = 0;
            let minutes = 0;

            for (let i = 0; i < durationParts.length; i += 2) {
              const value = parseInt(durationParts[i], 10);
              const unit = durationParts[i + 1];

              if (unit.includes("hour")) {
                hours = value;
              } else if (unit.includes("min")) {
                minutes = value;
              }
            }

            if (hours > 0) {
              setTravelHours(hours);
            } else {
              setTravelHours(0);
            }
            setTravelMinutes(minutes);
          } else {
            console.error("Error:", status);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  useEffect(() => {
    if (fromId && toId) {
      getTravelTime();
    }
  }, [fromId, toId]);

  const handleSubmit1 = (e) => {
    e.preventDefault();
    const selectedDateTime = new Date(departureDate);
    selectedDateTime.setHours(departureHours);
    selectedDateTime.setMinutes(departureMinutes);
    const currentDateTime = new Date();

    if (!fromId) {
      setErrorMessage("Изберете од каде патувате");
      setTimeout(() => {
        errorMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else if (selectedDateTime <= currentDateTime) {
      setErrorMessage(
        "Времето мора да биде покасно од моменталното време " +
          currentDateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
      );
      setTimeout(() => {
        errorMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else {
      setErrorMessage("");
      setStep(2);
    }
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    if (!toId) {
      setErrorMessage("Изберете до каде патувате");
      setTimeout(() => {
        errorMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else if (fromId == toId) {
      setErrorMessage("Неможи да патувате до истата локација од која тргате");
      setTimeout(() => {
        errorMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else {
      setErrorMessage("");
      setStep(3);
    }
  };

  const handleSubmit3 = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setStep(4);
  };

  const handleSubmit4 = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setStep(5);
  };

  const postRide = async () => {
    try {
      const departureDateTimeString = `${departureDate} ${departureHours}:${departureMinutes}`;

      const rideDuration = `${travelHours
        .toString()
        .padStart(2, "0")}:${travelMinutes.toString().padStart(2, "0")}:00`;
      if (carModel == "") {
        setCarModel(null);
      }
      if (carColor == "") {
        setCarColor(null);
      }

      const cashPayment = paymentType === "cash";
      const response = await axios.post(
        `${backendUrl}/rides/create`,
        {
          from_loc_id: fromId,
          to_loc_id: toId,
          date_time: departureDateTimeString,
          ride_duration: rideDuration,
          flexible_departure: flexibleDeparture,
          flexible_arrival: flexibleArrival,
          total_seats: seats,
          price: totalPrice,
          additional_info: rideNotice,
          car_model: carModel,
          car_color: carColor,
          cash_payment: cashPayment,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSubmit5 = (e) => {
    e.preventDefault();
    if (!policyCheck) {
      setErrorMessage(
        "Морате да се согласите со политиката и правилата за користење на платформата"
      );
      setTimeout(() => {
        errorMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else {
      postRide();
    }
  };

  return (
    <div className="bottom-bar-margin post-ride-container pb-4">
      <NavBar type={step == 1 && !success ? "green" : ""} />
      {!success && <BottomBar />}
      {success && (
        <SubmissionSuccess
          statusMessage={successMessage}
          nextStepsMessage={nextStepsMessage}
          goTo={"/my-rides"}
          buttonText={"Патувања"}
        />
      )}
      {step === 1 && !success && (
        <div className="post-ride-cta">
          <Container>
            <h2 className="heading-s">
              Објавете превоз и поделете ги трошоците за патувањето!
            </h2>
            <p className="body-xs">
              Патниците чекаат на вас! Објавете превоз и намалете ги трошоците
              за вашето патување
            </p>
            <img src="images/cta-underline.svg" alt="cta underline" />
          </Container>
        </div>
      )}
      {step != 1 && !success && (
        <Container>
          <BackButton customNav={goBack} />
        </Container>
      )}
      {!success && (
        <>
          {" "}
          <FormProgressIndicator step={step} />
          <Container className="post-ride-fillable pt-3">
            {step === 1 && (
              <form onSubmit={handleSubmit1}>
                <section className="bottom-border mb-3">
                  <div className="mb-2">
                    <h4 className="heading-xxs">Избери локација на поаѓање</h4>
                    <LocationAutocomplete
                      placeholder="Од каде патувате"
                      name={fromName}
                      onSelect={(id, name) => {
                        setFromId(id);
                        setFromName(name);
                      }}
                      onChange={(name) => setFromName(name)}
                      className="post-input"
                      required
                    />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between accept-location-suggestions">
                      <h4 className="heading-xxs">
                        <img src="images/direction-icon.svg" /> Добивај предлог
                        локација
                      </h4>
                      <Form>
                        <Form.Switch
                          id="custom-switch"
                          checked={flexibleDeparture}
                          onChange={() =>
                            setFlexibleDeparture(!flexibleDeparture)
                          }
                          className="switch"
                        />
                      </Form>
                    </div>
                    <p className="body-xs">
                      Доколку се согласите на оваа опција ќе добивате локација
                      од која би сакале да бидат земени патниците.
                      <strong>
                        Ќе имате можност да ја прифатите или одбиете.
                      </strong>
                    </p>
                  </div>
                </section>
                <section>
                  <h4 className="heading-xxs">Одберете датум на поаѓање</h4>
                  <div className="input-container mb-3">
                    <img src="images/date-icon.svg" alt="date icon" />
                    <input
                      className="post-input"
                      type="date"
                      min={currentDate}
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                  <h4 className="heading-xxs">Внесете време на поаѓање</h4>
                  <div className="d-flex justify-content-center time-input">
                    <div className="d-flex flex-column align-items-center me-2">
                      <input
                        className="heading-s"
                        type="text"
                        value={departureHours}
                        onChange={(event) => {
                          let inputValue = event.target.value;
                          // Limit the length of input to 2 characters
                          inputValue = inputValue.slice(0, 2);
                          // Ensure the input value is within the valid range
                          if (
                            !isNaN(inputValue) &&
                            inputValue >= 0 &&
                            inputValue <= 24
                          ) {
                            setDepartureHours(inputValue);
                          }
                        }}
                      />
                      <span>Час</span>
                    </div>
                    <div className="d-flex align-items-center seperator heading-s">
                      :
                    </div>
                    <div className="d-flex flex-column align-items-center ms-2">
                      <input
                        className="heading-s"
                        type="text"
                        value={departureMinutes}
                        onChange={(event) => {
                          let inputValue = event.target.value;
                          // Limit the length of input to 2 characters
                          inputValue = inputValue.slice(0, 2);
                          // Ensure the input value is within the valid range
                          if (
                            !isNaN(inputValue) &&
                            inputValue >= 0 &&
                            inputValue <= 59
                          ) {
                            setDepartureMinutes(inputValue);
                          }
                        }}
                      />
                      <span>Минути</span>
                    </div>
                  </div>
                  {/* <div className="input-container mb-4">
                    <img src="images/clock-icon.svg" alt="clock icon" />
                    <input
                      className="post-input"
                      type="text"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      placeholder="hh:mm"
                      maxLength="5"
                      required
                      pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                    />
                  </div> */}
                </section>
                <Button
                  className="col-12 mt-4 dark-button body-bold-medium"
                  type="submit"
                >
                  Продолжи
                </Button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleSubmit2}>
                <section className="bottom-border mb-3">
                  <div className="mb-2">
                    <h4 className="heading-xxs">
                      Избери локација на пристигање
                    </h4>
                    <LocationAutocomplete
                      placeholder="До каде патувате"
                      name={toName}
                      onSelect={(id, name) => {
                        setToId(id);
                        setToName(name);
                      }}
                      onChange={(name) => setToName(name)}
                      className="post-input"
                      required
                    />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between accept-location-suggestions">
                      <h4 className="heading-xxs">
                        <img src="images/direction-icon.svg" />
                        Добивај предлог локација
                      </h4>
                      <Form>
                        <Form.Switch
                          id="custom-switch"
                          checked={flexibleArrival}
                          onChange={() => setFlexibleArrival(!flexibleArrival)}
                          className="switch"
                        />
                      </Form>
                    </div>
                    <p className="body-xs">
                      Доколку се согласите на оваа опција ќе добивате локација
                      до која би сакале да бидат оставени патниците.
                      <strong>
                        Ќе имате можност да ја прифатите или одбиете.
                      </strong>
                    </p>
                  </div>
                </section>
                <section>
                  <h4 className="heading-xxs">Внесете време на патување</h4>
                  <div className="d-flex justify-content-center time-input">
                    <div className="d-flex flex-column align-items-center me-2">
                      <input
                        className="heading-s"
                        type="text"
                        value={travelHours}
                        onChange={(event) => {
                          let inputValue = event.target.value;
                          // Limit the length of input to 2 characters
                          inputValue = inputValue.slice(0, 2);
                          // Ensure the input value is within the valid range
                          if (
                            !isNaN(inputValue) &&
                            inputValue >= 0 &&
                            inputValue <= 24
                          ) {
                            setTravelHours(inputValue);
                          }
                        }}
                      />
                      <span>Час</span>
                    </div>
                    <div className="d-flex align-items-center seperator heading-s">
                      :
                    </div>
                    <div className="d-flex flex-column align-items-center ms-2">
                      <input
                        className="heading-s"
                        type="text"
                        value={travelMinutes}
                        onChange={(event) => {
                          let inputValue = event.target.value;
                          // Limit the length of input to 2 characters
                          inputValue = inputValue.slice(0, 2);
                          // Ensure the input value is within the valid range
                          if (
                            !isNaN(inputValue) &&
                            inputValue >= 0 &&
                            inputValue <= 59
                          ) {
                            setTravelMinutes(inputValue);
                          }
                        }}
                      />
                      <span>Минути</span>
                    </div>
                  </div>
                </section>
                <Button
                  className="col-12 mt-4 dark-button body-bold-medium"
                  type="submit"
                >
                  Продолжи
                </Button>
              </form>
            )}
            {step == 3 && (
              <>
                <section className="bottom-border mb-4">
                  <h4 className="heading-xxs mb-0">
                    Колку слободни места имате
                  </h4>
                  <div className="d-flex justify-content-center mt-4 mb-4">
                    <button
                      className="seats-change-button heading-s"
                      onClick={() => changeSeatsNumber(-1)}
                    >
                      -
                    </button>
                    <div className="seats-choose-indicator heading-s">
                      {seats}
                    </div>
                    <button
                      className="seats-change-button heading-s"
                      onClick={() => changeSeatsNumber(+1)}
                    >
                      +
                    </button>
                  </div>
                </section>
                <form onSubmit={handleSubmit3}>
                  <section>
                    <h4 className="heading-xxs">Марка и модел на автомобил</h4>
                    <input
                      className="post-input mb-4"
                      type="text"
                      value={carColor}
                      onChange={(e) => setCarColor(e.target.value)}
                      placeholder="Пр. Шкода Фабиа "
                    />
                    <h4 className="heading-xxs">Боја на автомобил</h4>
                    <input
                      className="post-input"
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="Пр. Бела"
                    />
                  </section>
                  <Button
                    className="col-12 mt-4 dark-button body-bold-medium"
                    type="submit"
                  >
                    Продолжи
                  </Button>
                </form>
              </>
            )}
            {step == 4 && (
              <form onSubmit={handleSubmit4}>
                <section className="mb-3">
                  <div
                    className={`cash-payment-notice-container ${
                      cashNoticeOpen ? "open" : ""
                    }`}
                  >
                    <div className="cash-payment-notice-modal body-bold-s">
                      <img
                        src="/images/x-round-icon.svg"
                        className="close-modal"
                        onClick={() => setCashNoticeOpen(false)}
                      />
                      Доколку го изберете овој начин на плаќање, сте согласени
                      дека патникот ќе ви плати во автомобил за време на
                      патувањето и rideshare не е должен да исплати никаква сума
                      доколку не се појави патникот
                    </div>
                  </div>
                  <div className="d-flex payment-types-container">
                    <div
                      className={`${paymentType === "cash" ? "selected" : ""}`}
                      onClick={() => setPaymentType("cash")}
                    >
                      <div className="body-s">
                        <h5 className="text-center">Плаќање во кеш</h5>
                        патникот ќе ви плати во авомобил
                        <svg
                          className="cash-payment-notice-icon"
                          src="/images/status-icon.svg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCashNoticeOpen(true);
                          }}
                          width="24"
                          height="24"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 10C11.5523 10 12 10.4477 12 11V15C12 15.5523 11.5523 16 11 16C10.4477 16 10 15.5523 10 15V11C10 10.4477 10.4477 10 11 10Z"
                            fill={paymentType == "cash" ? "#FFFFFF" : "#022C66"}
                          />
                          <path
                            d="M11 6C10.4477 6 10 6.44772 10 7C10 7.55228 10.4477 8 11 8H11.01C11.5623 8 12.01 7.55228 12.01 7C12.01 6.44772 11.5623 6 11.01 6H11Z"
                            fill={paymentType == "cash" ? "#FFFFFF" : "#022C66"}
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11ZM11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2Z"
                            fill={paymentType == "cash" ? "#FFFFFF" : "#022C66"}
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`${paymentType === "card" ? "selected" : ""}`}
                      onClick={() => setPaymentType("card")}
                    >
                      <div className="body-s">
                        <h5 className="text-center">Плаќање онлајн</h5>
                        патникот ќе ви плати онлајн
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <h4 className="heading-xxs">Сума надоместок за превозот</h4>
                    <div className="input-container2 mb-3">
                      <div class="left-corner-div heading-xs d-flex justify-content-center align-items-center">
                        ден
                      </div>
                      <input
                        className="post-input currency-box"
                        type="number"
                        required
                        value={ridePrice}
                        onChange={(e) => setRidePrice(e.target.value)}
                      />
                    </div>
                    <p>* Износот што ќе го добиете по таксите</p>
                  </div>
                  <Row className="d-flex">
                    <Col xs={12} className="d-flex justify-content-between">
                      <h4 className="heading-xxs">Данок и такса за услуги</h4>
                      <span
                        onClick={() => setFeeBreakdownOpen(!feeBreakdownOpen)}
                        aria-controls="fee-breakdown-collapsible"
                        aria-expanded={feeBreakdownOpen}
                        className="collapse-button"
                      >
                        {feeBreakdownOpen ? (
                          <i class="fa-solid fa-angle-up"></i>
                        ) : (
                          <i class="fa-solid fa-angle-down"></i>
                        )}{" "}
                      </span>
                    </Col>
                    <Col className="d-flex align-items-center" xs={12}>
                      <div class="input-container2 mb-3 price-info">
                        <div class="left-corner-div heading-xs d-flex justify-content-center align-items-center">
                          ден
                        </div>
                        <div
                          className="post-input currency-box d-flex justify-content-end
                    align-items-center gray-text"
                        >
                          {fee}
                        </div>
                      </div>
                    </Col>
                    <Collapse in={feeBreakdownOpen}>
                      <div id="fee-breakdown-collapsible">
                        <div className="px-3">
                          <div className="d-flex justify-content-between">
                            {paymentType == "card" && (
                              <>
                                <p>10% Данок за државата</p>
                                <span>мкд {taxForState}</span>
                              </>
                            )}
                          </div>
                          <div className="d-flex justify-content-between">
                            <p>Надоместок за трансакција</p>
                            <span>мкд {transactionFee}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p>Такса за услуги за превозник</p>
                            <span>мкд {carrierServiceFee}</span>
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </Row>
                  <Row className="d-flex">
                    <Col xs={12}>
                      <h4 className="heading-xxs">
                        Сума која ќе биде прикажана на патниците
                      </h4>
                    </Col>
                    <Col className="d-flex align-items-center" xs={12}>
                      <div className="input-container2 mb-3 price-info">
                        <div class="left-corner-div heading-xs d-flex justify-content-center align-items-center">
                          ден
                        </div>
                        <div
                          className="post-input currency-box d-flex justify-content-end
                    align-items-center green-text"
                        >
                          {totalPrice}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </section>
                <Button
                  className="col-12 mt-4 dark-button body-bold-medium"
                  type="submit"
                >
                  Продолжи
                </Button>
              </form>
            )}
            {step == 5 && (
              <form onSubmit={handleSubmit5}>
                <section className="mb-3">
                  <div className="mb-2">
                    <h4 className="heading-xxs">
                      Дали имате напомена/порака за патниците?
                    </h4>
                    <textarea
                      className="post-input text-start p-2"
                      placeholder="Пр. Мала торба по патник. Паузи по договор. Превоз на миленици со доплата."
                      value={rideNotice}
                      onChange={(e) => setRideNotice(e.target.value)}
                      maxLength={500}
                    />
                  </div>
                  <div className="d-flex">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="myCheckbox"
                      checked={policyCheck}
                      onChange={(e) => setPolicyCheck(!policyCheck)}
                    />{" "}
                    <label
                      className="form-check-label d-inline"
                      htmlFor="myCheckbox"
                    >
                      Се согласувам на политиката и правилата за користење на
                      апликацијата{" "}
                    </label>
                  </div>
                </section>
                <Button
                  className="col-12 mt-4 dark-button body-bold-medium"
                  type="submit"
                >
                  Објави го превозот
                </Button>
              </form>
            )}
            <div ref={errorMessageRef}></div>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          </Container>
        </>
      )}
    </div>
  );
};

export default PostRide;
