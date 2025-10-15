import React, { useState, useEffect } from "react";
import { Row, Button, Container, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { toast } from "react-toastify";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import BackButton from "./BackButton";
import ReviewCard from "./ReviewCard";
import SubmissionSuccess from "./SubmissionSuccess";
import LocationPickerModal from "./LocationPickerModal";

import "swiper/css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RideInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userType, token, logoutUser } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const rideId = queryParams.get("rideId");
  const initialSeats = queryParams.get("seats");

  const [balance, setBalance] = useState(0);
  const [ride, setRide] = useState(null);
  const [seats, setSeats] = useState(parseInt(initialSeats));
  const [loading, setLoading] = useState(true);

  const [departureSuggestOpen, setDepartureSuggestOpen] = useState(false);
  const [departureSuggestCord, setDepartureSuggestCord] = useState(null);
  const [arrivalSuggestOpen, setArrivalSuggestOpen] = useState(false);
  const [arrivalSuggestCord, setArrivalSuggestCord] = useState(null);

  const [reserved, setReserved] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "You have successfully made a reservation"
  );
  const [nextStepsMessage, setNextStepsMessage] = useState(
    "*You can view your reservation in the active trips section"
  );

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const searchApi = backendUrl + `/rides/get-ride?rideId=${rideId}`;
        const response = await axios.get(searchApi);
        setRide(response.data);
      } catch (error) {
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchRide();
    getWallet();
  }, [location.search]);

  const getWallet = async () => {
    try {
      let url = `${backendUrl}/wallet/get-wallet`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const fetchedWallet = response.data[0];
      setBalance(fetchedWallet.balance);
    } catch (error) {
      console.error("Error fetching ride data:", error);
    }
  };

  if (loading) {
    return <>{/* Render loading indicator here */}</>;
  }

  if (!ride) {
    return (
      <>
        <NavBar />
        <BottomBar />
        <Container>
          <p className="text-center rides-count body-bold-xs mt-2">
            The requested ride does not exist
          </p>
        </Container>
      </>
    );
  }

  if (!seats || seats == 0 || seats > ride.free_seats) {
    return (
      <>
        <NavBar />
        <BottomBar />
        <Container>
          <p className="text-center rides-count body-bold-xs mt-2">
            You have an error in the number of seats
          </p>
        </Container>
      </>
    );
  }

  const departureDateTime = new Date(ride.date_time);
  const departureDate = departureDateTime.toLocaleDateString("en-GB");
  const departureTime = departureDateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let arrivalDateTime = new Date(departureDateTime); // Initialize with departure datetime
  let arrivalDate = ""; // Initialize arrival date string
  let arrivalTime = ""; // Initialize arrival time string
  let rideDuration = ""; // Initialize ride duration string

  if (ride.ride_duration) {
    const [rideDurationHours, rideDurationMinutes] = ride.ride_duration
      .split(":")
      .map(Number);

    // Calculate total minutes for ride duration
    const totalRideMinutes = rideDurationHours * 60 + rideDurationMinutes;

    // Calculate total minutes for arrival time
    let totalArrivalMinutes =
      departureDateTime.getHours() * 60 +
      departureDateTime.getMinutes() +
      totalRideMinutes;

    // Adjust date if arrival time exceeds 24 hours
    if (totalArrivalMinutes >= 24 * 60) {
      arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
      totalArrivalMinutes -= 24 * 60;
    }

    // Set arrival time
    arrivalDateTime.setHours(Math.floor(totalArrivalMinutes / 60));
    arrivalDateTime.setMinutes(totalArrivalMinutes % 60);

    // Format arrival date
    arrivalDate = arrivalDateTime.toLocaleDateString("en-GB");

    // Format arrival time
    arrivalTime = arrivalDateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format ride duration
    rideDuration = `${rideDurationHours
      .toString()
      .padStart(2, "0")}:${rideDurationMinutes.toString().padStart(2, "0")}`;
  }

  const handleReserve = async () => {
    if (isLoggedIn && userType == "passenger") {
      let isSuggestion = false;
      let custom_pick_up;
      let custom_drop_off;

      if (departureSuggestCord != null) {
        custom_pick_up = {
          location_lat: departureSuggestCord.lat,
          location_lon: departureSuggestCord.lng,
        };
        isSuggestion = true;
      }
      if (arrivalSuggestCord != null) {
        custom_drop_off = {
          location_lat: arrivalSuggestCord.lat,
          location_lon: arrivalSuggestCord.lng,
        };
        isSuggestion = true;
      }

      try {
        const url =
          backendUrl +
          `/reservations/${userType}/reserve?rideId=${ride.id}&seats=${seats}`;
        const response = await axios.post(
          url,
          { custom_drop_off: custom_drop_off, custom_pick_up: custom_pick_up },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        toast.dismiss();
        if (isSuggestion) {
          setSuccessMessage(
            "You have successfully submitted a reservation request"
          );
          setNextStepsMessage(
            "*You will receive a notification when your reservation is confirmed."
          );
        }
        setReserved(true);
      } catch (error) {
        console.log(error);
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
    } else {
      navigate("/login");
    }
  };

  const changeSeatsNumber = (val) => {
    const newSeats = seats + val;
    if (newSeats >= 1 && newSeats <= ride.free_seats) {
      setSeats(newSeats);
    }
  };

  return (
    <>
      <NavBar />
      {reserved ? (
        <SubmissionSuccess
          statusMessage={successMessage}
          nextStepsMessage={nextStepsMessage}
          goTo={"/my-rides"}
          buttonText={"Trips"}
        />
      ) : (
        <>
          {/* Modals */}
          <LocationPickerModal
            title="Suggest pick-up location"
            open={departureSuggestOpen}
            defaultPosition={
              departureSuggestCord !== null
                ? departureSuggestCord
                : ride.from_location_cord
            }
            isChildLocation={ride.from_location_parent}
            handleClose={() => setDepartureSuggestOpen(false)}
            onSet={(location) => {
              setDepartureSuggestCord(location);
              setDepartureSuggestOpen(false);
            }}
          />
          <LocationPickerModal
            title="Suggest drop-off location"
            open={arrivalSuggestOpen}
            defaultPosition={
              arrivalSuggestCord !== null
                ? arrivalSuggestCord
                : ride.to_location_cord
            }
            isChildLocation={ride.to_location_parent}
            handleClose={() => setArrivalSuggestOpen(false)}
            onSet={(location) => {
              setArrivalSuggestCord(location);
              setArrivalSuggestOpen(false);
            }}
          />
          <Container
            className={"ride-info" + (userType === "driver" ? " mb-0" : "")}
          >
            <BackButton />
            <div className="driver-info text-center">
              <h3 className="body-bold-medium heading-xs">
                {ride.driver_name}
              </h3>
              <a className="body-xs mx-auto">{ride.average_rating}/5</a>
            </div>
            <div className="d-flex destination-info justify-content-between px">
              <div className="d-flex flex-column">
                <h4 className="heading-xs">{ride.from_location_name}</h4>
                <span className="body-bold-xs">{departureTime}</span>
              </div>
              <div className="d-flex flex-column">
                <span className="text-center body-bold-xs">{rideDuration}</span>
                <img
                  src="/images/journey-indicator-horizontal.svg"
                  className="journey-indicator"
                />
              </div>
              <div className="d-flex flex-column">
                <h4 className="heading-xs">{ride.to_location_name}</h4>
                <span className="body-bold-xs">{arrivalTime}</span>
              </div>
            </div>
            <div className="pt-0">
              <h4 className="text-center mt-4 body-bold-l">Required seats</h4>
              <div className="d-flex justify-content-center mt-4 mb-4 ">
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
              {!!ride.flexibleDeparture && (
                <div
                  className="body-bold-s text-center blue-text mb-4"
                  onClick={() => setDepartureSuggestOpen(true)}
                >
                  <img src="images/direction-icon.svg" className="me-2" />
                  {departureSuggestCord == null
                    ? "Suggest pick-up location"
                    : "Change pick-up location"}
                </div>
              )}
              {!!ride.flexibleArrival && (
                <div
                  className="body-bold-s text-center blue-text"
                  onClick={() => setArrivalSuggestOpen(true)}
                >
                  <img src="images/direction-icon.svg" className="me-2" />
                  {arrivalSuggestCord == null
                    ? "Suggest drop-off location"
                    : "Change drop-off location"}
                </div>
              )}
            </div>
            <div className="d-flex">
              <div className="icon-div">
                <img src="images/danger-icon.svg" />
              </div>
              <span>
                <h4>Message for passengers</h4>
                <p>
                  {!!ride.additional_info
                    ? ride.additional_info
                    : "The carrier has not specified any information you might need."}
                </p>
              </span>
            </div>
            <div className="info-box2">
              {ride.type == "C" ? (
                <div className="d-flex reservation-info">
                  <div className="icon-div">
                    <img src="images/group-icon.svg" />
                  </div>
                  <div>
                    <h4>{`The reservation is instant. If you suggest a location, the reservation needs to be confirmed by the carrier`}</h4>
                    <p>
                      You will receive a notification when your reservation is
                      confirmed
                    </p>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <span>
                <img src="images/group-icon.svg" />
                <h4>{`Maximum ${ride.total_seats - 1} in the back seats`}</h4>
              </span>
              {ride.car_color && (
                <span className="mb-0">
                  <img src="images/car-icon.svg" />
                  <h4>{`${ride.car_model} - ${ride.car_color}`}</h4>
                </span>
              )}
            </div>
            <Row className="reviews-preview d-flex justify-content-between no-border">
              <Col xs={6}>
                <h4>Experiences</h4>
                <p className="heading-xxs mx-auto review-average">
                  {ride.average_rating}/5
                </p>
              </Col>
              <Col xs={6} className="text-end">
                <span>{ride.driver_reviews.length} Reviews</span>
              </Col>
              <Col xs={12} className="reviews-preview-container">
                <Swiper
                  spaceBetween={25}
                  slidesPerView={"auto"}
                  navigation
                  scrollbar={{ draggable: true }}
                  centeredSlides={ride.driver_reviews.length === 1}
                  className="reviews-swiper"
                >
                  {ride.driver_reviews.map((review, index) => (
                    <SwiperSlide key={index}>
                      <ReviewCard key={index} review={review} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Col>
              <Col xs={12}>
                <Button
                  className="col-12 mt-4 white-button body-bold-xs"
                  onClick={() =>
                    navigate(`/reviews?driverId=${ride.driver_id}`)
                  }
                >
                  See all
                </Button>
              </Col>
            </Row>
            {userType != "driver" && (
              <Row className="reserve-bottom-bar">
                <Col>
                  <strong className="body-bold-l">
                    {ride.price * seats}mkd
                  </strong>
                  <p className="body-xs">Total for {seats} seats</p>
                </Col>
                <Col>
                  <button
                    className="buy-button body-bold-xs"
                    onClick={handleReserve}
                  >
                    {departureSuggestCord != null || arrivalSuggestCord != null
                      ? "Suggest"
                      : "Reserve"}
                  </button>
                </Col>
              </Row>
            )}
          </Container>
        </>
      )}
    </>
  );
};

export default RideInfo;
