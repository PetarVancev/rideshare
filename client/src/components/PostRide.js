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
  const [paymentType, setPaymentType] = useState("cash");
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
  const successMessage = "You have successfully posted a ride";
  const nextStepsMessage =
    "*You can view your reservation in the active trips section";

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
      setErrorMessage("Select your departure location");
      setTimeout(() => {
        errorMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else if (selectedDateTime <= currentDateTime) {
      setErrorMessage(
        "The time must be later than the current time " +
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
      setErrorMessage("Select your arrival location");
      setTimeout(() => {
        errorMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } else if (fromId == toId) {
      setErrorMessage(
        "You cannot travel to the same location you are starting from"
      );
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
          price: ridePrice,
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
        "You must agree to the platform's policy and terms of use"
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
          buttonText={"Trips"}
        />
      )}
      {step === 1 && !success && (
        <div className="post-ride-cta">
          <Container>
            <h2 className="heading-s">
              Post a ride and share the travel costs!
            </h2>
            <p className="body-xs">
              Passengers are waiting for you! Post a ride and reduce your travel
              costs
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
                    <h4 className="heading-xxs">Select departure location</h4>
                    <LocationAutocomplete
                      placeholder="From where you are traveling"
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
                        <img src="images/direction-icon.svg" /> Receive location
                        suggestion
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
                      If you agree to this option you will receive a location
                      from where passengers would like to be picked up.
                      <strong>
                        You will have the option to accept or decline.
                      </strong>
                    </p>
                  </div>
                </section>
                <section>
                  <h4 className="heading-xxs">Select departure date</h4>
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
                  <h4 className="heading-xxs">Enter departure time</h4>
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
                      <span>Hour</span>
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
                      <span>Minutes</span>
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
                  Continue
                </Button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleSubmit2}>
                <section className="bottom-border mb-3">
                  <div className="mb-2">
                    <h4 className="heading-xxs">Select arrival location</h4>
                    <LocationAutocomplete
                      placeholder="To where you are traveling"
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
                        Receive location suggestion
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
                      If you agree to this option you will receive a location
                      where passengers would like to be dropped off.
                      <strong>
                        You will have the option to accept or decline.
                      </strong>
                    </p>
                  </div>
                </section>
                <section>
                  <h4 className="heading-xxs">Enter travel duration</h4>
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
                      <span>Hour</span>
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
                      <span>Minutes</span>
                    </div>
                  </div>
                </section>
                <Button
                  className="col-12 mt-4 dark-button body-bold-medium"
                  type="submit"
                >
                  Continue
                </Button>
              </form>
            )}
            {step == 3 && (
              <>
                <section className="bottom-border mb-4">
                  <h4 className="heading-xxs mb-0">
                    How many free seats do you have
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
                    <h4 className="heading-xxs">Car make and model</h4>
                    <input
                      className="post-input mb-4"
                      type="text"
                      value={carColor}
                      onChange={(e) => setCarColor(e.target.value)}
                      placeholder="E.g. Škoda Fabia "
                    />
                    <h4 className="heading-xxs">Car color</h4>
                    <input
                      className="post-input"
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="E.g. White"
                    />
                  </section>
                  <Button
                    className="col-12 mt-4 dark-button body-bold-medium"
                    type="submit"
                  >
                    Continue
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
                      If you choose this payment method, you agree that the
                      passenger will pay you in the car during the trip and
                      rideshare is not obligated to pay any amount if the
                      passenger does not show up
                    </div>
                  </div>
                  <div className="d-flex payment-types-container justify-content-center">
                    <div
                      className={`${paymentType === "cash" ? "selected" : ""}`}
                      onClick={() => setPaymentType("cash")}
                    >
                      <div className="body-s">
                        <h5 className="text-center">Cash Payment</h5>
                        The passenger will pay you in the car
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <h4 className="heading-xxs">Ride compensation amount</h4>
                    <div className="input-container2 mb-3">
                      <div class="left-corner-div heading-xs d-flex justify-content-center align-items-center">
                        den
                      </div>
                      <input
                        className="post-input currency-box"
                        type="number"
                        required
                        value={ridePrice}
                        onChange={(e) => setRidePrice(e.target.value)}
                      />
                    </div>
                  </div>
                </section>
                <Button
                  className="col-12 mt-4 dark-button body-bold-medium"
                  type="submit"
                >
                  Continue
                </Button>
              </form>
            )}
            {step == 5 && (
              <form onSubmit={handleSubmit5}>
                <section className="mb-3">
                  <div className="mb-2">
                    <h4 className="heading-xxs">
                      Do you have a note/message for the passengers?
                    </h4>
                    <textarea
                      className="post-input text-start p-2"
                      placeholder="E.g. Small bag per passenger. Breaks by agreement. Pet transport with extra charge."
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
                      I agree to the policy and terms of use of the application{" "}
                    </label>
                  </div>
                </section>
                <Button
                  className="col-12 mt-4 dark-button body-bold-medium"
                  type="submit"
                >
                  Post the ride
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
