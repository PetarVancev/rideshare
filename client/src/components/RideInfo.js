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

import "swiper/css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RideInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userType, token } = useAuth();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const rideId = queryParams.get("rideId");

        const searchApi = backendUrl + `/rides/get-ride?rideId=${rideId}`;
        const response = await axios.get(searchApi);
        setRide(response.data);
      } catch (error) {
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchRide();
  }, [location.search]);

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
            Бараниот превоз не постои
          </p>
        </Container>
      </>
    ); // or any other loading indicator
  }

  const departureDateTime = new Date(ride.date_time);
  const departureHours = departureDateTime
    .getHours()
    .toString()
    .padStart(2, "0");
  const departureMinutes = departureDateTime
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const departureTime = `${departureHours}:${departureMinutes}`;

  let arrivalTime = "";
  let rideDuration = "";

  if (ride.ride_duration) {
    const [rideDurationHours, rideDurationMinutes] = ride.ride_duration
      .split(":")
      .map(Number);
    const arrivalDateTime = new Date(departureDateTime);
    arrivalDateTime.setHours(departureDateTime.getHours() + rideDurationHours);
    arrivalDateTime.setMinutes(
      departureDateTime.getMinutes() + rideDurationMinutes
    );
    const arrivalHours = arrivalDateTime.getHours().toString().padStart(2, "0");
    const arrivalMinutes = arrivalDateTime
      .getMinutes()
      .toString()
      .padStart(2, "0");
    arrivalTime = `${arrivalHours}:${arrivalMinutes}`;
    rideDuration = `${rideDurationHours
      .toString()
      .padStart(2, "0")}:${rideDurationMinutes.toString().padStart(2, "0")}`;
  }

  const handleReserve = async () => {
    if (isLoggedIn && userType == "passenger") {
      try {
        const url =
          backendUrl +
          `/reservations/${userType}/instant-reserve?rideId=${ride.id}&seats=1`;
        const response = await axios.post(url, null, {
          headers: {
            Authorization: `${token}`,
          },
        });
        toast.dismiss();
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeButton: true,
          onClose: () => navigate("/my-rides"),
        });
      } catch (error) {
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

  return (
    <>
      <NavBar />
      <Container className="ride-info">
        <BackButton />
        <div className="driver-info text-center">
          <h3 className="body-bold-medium heading-xs">{ride.driver_name}</h3>
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
        <div className="d-flex">
          <div className="icon-div">
            <img src="images/danger-icon.svg" />
          </div>
          <span>
            <h4>Порака за патниците</h4>
            <p>
              {!!ride.additional_info
                ? ride.additional_info
                : "Превозникот нема наведено информации кои би ви биле потребни."}
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
                <h4>{`Резервацијата е инстантна. Доколку предложите локација, резервацијаат треба да биде потврдена од превозникот`}</h4>
                <p>
                  Ќе добиете известување кога вашата резервација ќе биде
                  потврдена
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          <span>
            <img src="images/group-icon.svg" />
            <h4>{`Најмногу ${ride.total_seats - 2} на задните седишта`}</h4>
          </span>
          <span className="mb-0">
            <img src="images/car-icon.svg" />
            <h4>{`${ride.car_model} - ${ride.car_color}`}</h4>
          </span>
        </div>
        <Row className="reviews-preview d-flex justify-content-between">
          <Col xs={6}>
            <h4>Искуства</h4>
            <p className="heading-xxs mx-auto review-average">
              {ride.average_rating}/5
            </p>
          </Col>
          <Col xs={6} className="text-end">
            <span>{ride.driver_reviews.length} Рецензии</span>
          </Col>
          <Col xs={12} className="reviews-preview-container">
            <Swiper
              spaceBetween={25}
              slidesPerView={"auto"}
              navigation
              scrollbar={{ draggable: true }}
              centeredSlides={ride.driver_reviews.length === 1}
            >
              {ride.driver_reviews.map((review) => (
                <SwiperSlide>
                  <ReviewCard key={review.id} review={review} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
          <Col xs={12}>
            <Button className="col-12 mt-4 white-button body-bold-xs">
              Повеќе
            </Button>
          </Col>
        </Row>
        <Row className="reserve-bottom-bar">
          <Col>
            <strong className="body-bold-l">{ride.price} мкд</strong>
            <p className="body-xs">Вкупно за плаќање</p>
            <p className="body-bold-xs">
              {departureDateTime.toLocaleDateString("en-GB")}
            </p>
          </Col>
          <Col>
            <button className="buy-button body-bold-xs" onClick={handleReserve}>
              Резервирај
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RideInfo;
