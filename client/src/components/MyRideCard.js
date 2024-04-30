import React, { useState } from "react";
import { Card, Button, Col, Collapse } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import ProposalCard from "./ProposalCard";
import PassengerInfo from "./PassengerInfo";
import { useAuth } from "./AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MyRideCard = ({
  token,
  userType,
  rideData,
  category,
  openReviewModal,
  openComplaintModal,
}) => {
  const { logoutUser } = useAuth();
  const [passengersListOpen, setPassengersListOpen] = useState(false);

  let ride = null;
  let reservation = null;
  let driver = null;
  let proposals = null;
  let reservations = null;
  if (userType === "passenger") {
    ride = rideData.ride;
    reservation = rideData.reservation;
    driver = rideData.driver;
  } else {
    ride = rideData;
    proposals = rideData.reservations.filter((item) => item.status === "P");
    reservations = {
      custom_location: rideData.reservations.filter((item) => {
        const customLocations = !!item.custom_pick_up || !!item.custom_drop_off;
        return item.status === "R" && customLocations;
      }),
      original_location: rideData.reservations.filter((item) => {
        const customLocations = !!item.custom_pick_up || !!item.custom_drop_off;
        return item.status === "R" && !customLocations;
      }),
    };
  }

  const currentDateTime = new Date();

  const departureDateTime = new Date(ride.date_time);
  const departureDate = departureDateTime.toLocaleDateString("en-GB");
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

  const confirmArrival = async () => {
    try {
      const url =
        backendUrl +
        `/reservations/passenger/confirm-arrival?reservationId=${reservation.id}`;
      const response = await axios.post(url, null, {
        headers: {
          Authorization: token,
        },
      });
      toast.dismiss();
      openReviewModal();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeButton: true,
      });
    }
  };

  const deleteProposal = async () => {
    try {
      const url =
        backendUrl +
        `/reservations/passenger/delete-proposal?proposalId=${reservation.id}`;
      const response = await axios.post(url, null, {
        headers: {
          Authorization: token,
        },
      });
      toast.dismiss();
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeButton: true,
      });
    }
  };

  const confirmAtPickup = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const url =
              backendUrl +
              `/reservations/driver/confirm-pickup?rideId=${ride.id}`;
            await axios.post(
              url,
              { latitude, longitude },
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );
            toast.success("Успешно потврдивте локација на подигање", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeButton: true,
            });
            window.location.reload();
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
        },
        (error) => {
          toast.dismiss();
          toast.error(
            "Ве молиме овозможете пристап до локација и пробајте повторно",
            {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeButton: true,
            }
          );
        }
      );
    } else {
      toast.dismiss();
      toast.error(
        "Вашиот пребарувач не дозволува пристап до вашата локација, пробајте преку Google Chrome",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeButton: true,
        }
      );
    }
  };

  return userType === "passenger" ? (
    <Card className="my-ride-card">
      <Card.Header className="d-flex justify-content-between">
        <div className="driver-info">
          <h3 className="body-bold-medium">{driver.name}</h3>
          <a className="body-xs">{driver.reviews_average}/5</a>
        </div>
        <div className="ride-price-box body-bold-medium">
          {reservation.price}мкд
        </div>
      </Card.Header>
      <Card.Body>
        <div className="d-flex destination-info justify-content-between">
          <div className="d-flex flex-column">
            <h4 className="heading-xs">{ride.from_location_name}</h4>
            <span className="body-bold-xs">{departureTime}</span>
          </div>
          <div className="d-flex flex-column pb-2">
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
        <div className="date-info justify-content-center d-flex">
          <Col xs={6} className="first d-flex justify-content-end px-3">
            <div>
              <span>Датум</span>
              <h4 className="body-bold-xs">{departureDate}</h4>
            </div>
          </Col>
          <Col xs={6} className="px-3">
            <span>Резервирани места</span>
            <h4 className="body-bold-xs">{reservation.num_seats} Место</h4>
          </Col>
        </div>

        {category === "R" && (
          <>
            <a
              href={`sms:${driver.phone_num}`}
              className="d-flex justify-content-between additional-actions"
            >
              <span className="body-bold-s">Пиши му на димитар</span>
              <img src="images/message-icon.svg" />
            </a>
            {departureDateTime < currentDateTime && (
              <div className="d-flex flex-column align-items-center confirmation-actions">
                <Button
                  className="dark-button col-12 mt-4 arrived-button body-bold-medium"
                  onClick={confirmArrival}
                >
                  Стигнав
                </Button>
                <a className="body-bold-s" onClick={openComplaintModal}>
                  Превозот не се реализира
                </a>
              </div>
            )}
          </>
        )}
        {category === "P" && (
          <div className="text-center">
            <Button
              className="dark-button col-12 mt-4 arrived-button body-bold-medium"
              onClick={deleteProposal}
            >
              Избриши
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  ) : (
    <div className="drivers-ride-wrapper mt-3 mb-3">
      <Card
        className={`my-ride-card mt-0 ${category !== "R" ? "mb-0" : "mb-2"}`}
      >
        <Card.Body className="pb-0">
          <div className="d-flex destination-info justify-content-between">
            <div className="d-flex flex-column">
              <h4 className="heading-xs">{ride.from_location_name}</h4>
              <span className="body-bold-xs">{departureTime}</span>
            </div>
            <div className="d-flex flex-column pb-2">
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
          <div className="date-info justify-content-center d-flex">
            <Col xs={6} className="first d-flex justify-content-end px-3">
              <div>
                <span>Датум</span>
                <h4 className="body-bold-xs">{departureDate}</h4>
              </div>
            </Col>
            <Col xs={6} className="px-3">
              <span>Пополнетост</span>
              <h4 className="body-bold-xs">
                {ride.total_seats - ride.free_seats}/{ride.total_seats}
              </h4>
            </Col>
          </div>
          {category != "R" && (
            <div className="d-flex justify-content-between">
              <h5 className="body-bold-xs blue-text">Надоместок по патник</h5>
              <strong className="body-bold-medium green-text">
                мкд {ride.price}
              </strong>
            </div>
          )}
        </Card.Body>
      </Card>

      {proposals && category == "R" && (
        <>
          <span className="body-bold-medium blue-text">
            <img src="images/direction-icon.svg" /> Предлог локации од патници
          </span>
          <Swiper
            slidesPerView={1}
            pagination={{ dynamicBullets: true }}
            modules={[Pagination]}
            className="proposals-swiper mt-1"
          >
            {proposals.map((proposal, index) => (
              <SwiperSlide key={index}>
                <ProposalCard proposal={proposal} token={token} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}

      {category == "R" && (
        <Card className="my-ride-card mt-3">
          <Card.Body className="pb-0">
            <div className="d-flex justify-content-between">
              <h5 className="body-bold-xs blue-text">Надоместок по патник</h5>
              <strong className="body-bold-medium green-text">
                мкд {ride.price}
              </strong>
            </div>
            <div
              className="d-flex justify-content-between"
              onClick={() => setPassengersListOpen(!passengersListOpen)}
              aria-expanded={passengersListOpen}
            >
              <h5 className="body-bold-xs blue-text">Патници</h5>
              <img src="images/down-arrow.svg" />
            </div>
            <Collapse in={passengersListOpen}>
              <div className="passengers-list">
                {reservations.custom_location && (
                  <div className="pb-4">
                    <div className="heading body-bold-xs">
                      Кои предложиле локација
                    </div>
                    {reservations.custom_location.map((reservation) => {
                      return (
                        <PassengerInfo
                          reservation={reservation}
                          location="custom"
                          token={token}
                          key={reservation.id}
                          isBeforeNow={departureDateTime < currentDateTime}
                        />
                      );
                    })}
                  </div>
                )}
                {reservations.original_location && category == "R" && (
                  <div className="pb-4">
                    <div className="heading d-flex justify-content-between body-bold-xs">
                      Од вашата локација
                      {/* <a
                      href={`https://www.google.com/maps/dir/Current+Location/${reservation.pick_up_lat},${reservation.pick_up_lon}`}
                      className="body-s ms-4 blue-text"
                    >
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="me-2"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14C12.2091 14 14 12.2091 14 10C14 7.79086 12.2091 6 10 6ZM8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10Z"
                          fill="white"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.44476 23.8317C9.44505 23.8319 9.4453 23.8321 10 23L9.44476 23.8317C9.78066 24.0556 10.2188 24.056 10.5547 23.8321L10 23C10.5547 23.8321 10.5544 23.8322 10.5547 23.8321L10.5581 23.8298L10.5648 23.8253L10.5877 23.8098C10.6072 23.7966 10.6349 23.7776 10.6704 23.753C10.7415 23.7038 10.8435 23.6321 10.9722 23.5392C11.2295 23.3534 11.5936 23.0822 12.0292 22.7354C12.8987 22.043 14.0606 21.0428 15.226 19.8127C17.5157 17.3958 20 13.9019 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 13.9019 2.48426 17.3958 4.77405 19.8127C5.93939 21.0428 7.10133 22.043 7.97082 22.7354C8.40636 23.0822 8.77055 23.3534 9.02779 23.5392C9.15646 23.6321 9.25853 23.7038 9.32956 23.753C9.36508 23.7776 9.39285 23.7966 9.41232 23.8098L9.43524 23.8253L9.4419 23.8298L9.44476 23.8317ZM4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10C18 13.0981 15.9843 16.1042 13.774 18.4373C12.6894 19.5822 11.6013 20.5195 10.7833 21.1708C10.4789 21.4133 10.213 21.6152 10 21.7726C9.78702 21.6152 9.52111 21.4133 9.21668 21.1708C8.39867 20.5195 7.31061 19.5822 6.22595 18.4373C4.01574 16.1042 2 13.0981 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315Z"
                          fill="white"
                        />
                      </svg>
                      Локација
                    </a> */}
                    </div>
                    {reservations.original_location.map(
                      (reservation, index) => {
                        return (
                          <PassengerInfo
                            reservation={reservation}
                            key={index}
                            location="original"
                          />
                        );
                      }
                    )}
                    <div className="text-center">
                      {reservations.original_location.length > 0 &&
                        departureDateTime < currentDateTime && (
                          <Button
                            className="dark-button col-12 mt-4 arrived-button body-bold-medium"
                            onClick={confirmAtPickup}
                            disabled={ride.driver_arrived === 1}
                          >
                            {ride.driver_arrived === 1
                              ? "Стигање потврдено"
                              : "Стигнав на локацијата"}
                          </Button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </Collapse>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MyRideCard;
