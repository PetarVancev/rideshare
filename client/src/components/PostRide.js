import React, { useState, useRef } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import FormProgressIndicator from "./FormProgressIndicator";
import LocationAutocomplete from "./LocationAutocomplete";
import BackButton from "./BackButton";

const PostRide = () => {
  const [step, setStep] = useState(1);
  const [fromId, setFromId] = useState("");
  const [flexibleDeparture, setFlexibleDeparture] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const [toId, setToId] = useState("");
  const [flexibleArrival, setFlexibleArrival] = useState(false);
  const [arrivalTime, setArrivalTime] = useState("");

  const [seats, setSeats] = useState(1);

  const [ridePrice, setRidePrice] = useState(300);

  const [rideNotice, setRideNotice] = useState("");
  const [policyCheck, setPolicyCheck] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const errorMessageRef = useRef(null);

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

  const handleSubmit1 = (e) => {
    e.preventDefault();
    const [hours, minutes] = departureTime.split(":");
    const selectedTime = new Date();
    selectedTime.setHours(hours);
    selectedTime.setMinutes(minutes);

    const currentDateTime = new Date();

    if (!fromId) {
      setErrorMessage("Изберете од каде патувате");
      setTimeout(() => {
        errorMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else if (selectedTime <= currentDateTime) {
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

  const handleSubmit3 = () => {
    setErrorMessage("");
    setStep(4);
  };

  const handleSubmit4 = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setStep(5);
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
      setErrorMessage("");
    }
    // Post to API endpoint
  };

  return (
    <div className="bottom-bar-margin post-ride-container pb-4">
      <NavBar type={step == 1 ? "green" : ""} />
      <BottomBar />
      {step === 1 && (
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
      {step != 1 && (
        <Container>
          <BackButton customNav={goBack} />
        </Container>
      )}
      <FormProgressIndicator step={step} />
      <Container className="post-ride-fillable pt-3">
        {step === 1 && (
          <form onSubmit={handleSubmit1}>
            <section className="bottom-border mb-3">
              <div className="mb-2">
                <h4 className="heading-xxs">Избери локација на поаѓање</h4>
                <LocationAutocomplete
                  placeholder="Од каде патувате"
                  onSelect={setFromId}
                  onChange={(value) => setFromId(value.id)}
                  className="post-input"
                  required
                />
              </div>
              <div>
                <div className="d-flex justify-content-between accept-location-suggestions">
                  <h4 className="heading-xxs">Добивај предлог локација</h4>
                  <Form>
                    <Form.Switch
                      id="custom-switch"
                      checked={flexibleDeparture}
                      onChange={() => setFlexibleDeparture(!flexibleDeparture)}
                      className="switch"
                    />
                  </Form>
                </div>
                <p className="body-xs">
                  Доколку се согласите на оваа опција ќе добивате локација од
                  која би сакале да бидат земени патниците.
                  <strong>Ќе имате можност да ја прифатите или одбиете.</strong>
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
              <h4 className="heading-xxs">Одберете време на поаѓање</h4>
              <div className="input-container mb-4">
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
        {step === 2 && (
          <form onSubmit={handleSubmit2}>
            <section className="bottom-border mb-3">
              <div className="mb-2">
                <h4 className="heading-xxs">Избери локација на пристигање</h4>
                <LocationAutocomplete
                  placeholder="До каде патувате"
                  onSelect={setToId}
                  className="post-input"
                  required
                />
              </div>
              <div>
                <div className="d-flex justify-content-between accept-location-suggestions">
                  <h4 className="heading-xxs">Добивај предлог локација</h4>
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
                  Доколку се согласите на оваа опција ќе добивате локација до
                  која би сакале да бидат оставени патниците.
                  <strong>Ќе имате можност да ја прифатите или одбиете.</strong>
                </p>
              </div>
            </section>
            <section>
              <h4 className="heading-xxs">Одберете време на пристигање</h4>
              <div className="input-container mb-4">
                <img src="images/clock-icon.svg" alt="clock icon" />
                <input
                  className="post-input"
                  type="text"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  placeholder="hh:mm"
                  maxLength="5"
                  required
                  pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                />
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
            <section className="bottom-border">
              <h4 className="heading-xxs mb-0">Колку слободни места имате</h4>
              <div className="d-flex justify-content-center mt-4 mb-4">
                <button
                  className="seats-change-button heading-s"
                  onClick={() => changeSeatsNumber(-1)}
                >
                  -
                </button>
                <div className="seats-choose-indicator heading-s">{seats}</div>
                <button
                  className="seats-change-button heading-s"
                  onClick={() => changeSeatsNumber(+1)}
                >
                  +
                </button>
              </div>
            </section>
            <Button
              className="col-12 mt-4 dark-button body-bold-medium"
              onClick={handleSubmit3}
            >
              Продолжи
            </Button>
          </>
        )}
        {step == 4 && (
          <form onSubmit={handleSubmit4}>
            <section className="mb-3">
              <div className="mb-2">
                <h4 className="heading-xxs">Сума надоместок за превозот</h4>
                <div className="input-container mb-3">
                  <span className="body-bold-medium">мкд</span>
                  <input
                    className="post-input currency-box"
                    type="number"
                    required
                    value={ridePrice}
                    onChange={(e) => setRidePrice(e.target.value)}
                  />
                </div>
              </div>
              <Row className="d-flex">
                <Col xs={8}>
                  <h4 className="heading-xxs">
                    25% такса за услуги за превозник
                  </h4>
                </Col>
                <Col className="d-flex align-items-center" xs={4}>
                  <div className="input-container mb-3 price-info">
                    <span className="body-bold-medium">мкд</span>
                    <div
                      className="post-input currency-box d-flex justify-content-end
                    align-items-center"
                    >
                      {ridePrice * 0.25}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="d-flex">
                <Col xs={8}>
                  <h4 className="heading-xxs">
                    Сума која ќе биде прикажана на патниците
                  </h4>
                </Col>
                <Col className="d-flex align-items-center" xs={4}>
                  <div className="input-container mb-3 price-info">
                    <span className="body-bold-medium">мкд</span>
                    <div
                      className="post-input currency-box d-flex justify-content-end
                    align-items-center"
                    >
                      {ridePrice * 0.25}
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
    </div>
  );
};

export default PostRide;
