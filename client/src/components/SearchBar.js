import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import SearchRideCard from "./SearchRideCard";

const SearchBar = ({ options, initialSortBy, initialTimeRange }) => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(0);
  const [sortBy, setSortBy] = useState(
    initialSortBy === "price" ? "price" : "time"
  );
  const [payment, setPayment] = useState(null);
  const [departureTime, setDepartureTime] = useState(initialTimeRange);

  const resetFilters = () => {
    setSortBy("time");
    setPayment(null);
    setDepartureTime(null);
  };

  let initials = {};

  if (!options) {
    return null; // Or display a loading indicator
  }

  const applyFilters = (e) => {
    let url = `/results?from=${options.fromId}&to=${options.toId}&date=${options.date}&seats=${options.seats}`;
    if (sortBy && sortBy != "time") {
      url += `&sortBy=${sortBy}`;
    }
    if (departureTime) {
      url += `&timeRange=${departureTime}`;
    }
    navigate(url);
    window.location.reload();
  };

  return (
    <div>
      <div className={`search-change-modal ${modal === 1 ? "open" : ""}`}>
        <Container>
          <div className="d-flex flex-column align-items-center justify-content-center h-100 search-change-modal-container">
            <div className="d-flex title align-items-center">
              <button onClick={() => setModal(0)}>X</button>
              <div>
                <h2 className="heading-s mb-0 white-text">Направи измена</h2>
                <p className="mb-0 white-text">
                  Од каде, до каде, кога и колку
                </p>
              </div>
            </div>
            <SearchRideCard initials={options} />
          </div>
        </Container>
      </div>
      <div className={`search-filters-modal ${modal === 2 ? "open" : ""}`}>
        <Container>
          <div className="pt-4 pb-4 bottom-border">
            <button
              className="close-button text-center"
              onClick={() => setModal(0)}
            >
              X
            </button>
            <h3 className="text-center heading-xs mb-0">Филтри</h3>
          </div>
          <div className="pt-4 pb-4 bottom-border">
            <h3 className="text-left heading-xs mb-3">Подредете по</h3>
            <div className="mb-2">
              <label className="d-flex justify-content-between">
                <span>
                  <img src="images/clock-icon-blue.svg" /> Најрано поаѓање
                </span>
                <input
                  type="radio"
                  name="sorting"
                  value="time"
                  checked={sortBy === "time"}
                  onChange={(e) => setSortBy(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-2">
              <label className="d-flex justify-content-between">
                <span>
                  <img src="images/bar-chart-icon.svg" /> Најниска цена
                </span>
                <input
                  type="radio"
                  name="sorting"
                  value="price"
                  checked={sortBy === "price"}
                  onChange={(e) => setSortBy(e.target.value)}
                />
              </label>
            </div>
            {/* <div className="mb-2">
              <label className="d-flex justify-content-between">
                <span>
                  <img src="images/accept-location-icon.svg" /> Прифаќа предлог
                  локација
                </span>
                <input
                  type="radio"
                  name="sorting"
                  value="option3"
                  checked={sortBy === "option3"}
                  onChange={(e) => setSortBy(e.target.value)}
                />
              </label>
            </div> */}
          </div>
          <div className="pt-4 pb-4 bottom-border">
            <h3 className="text-left heading-xs mb-3">Плаќање</h3>
            <div className="mb-2">
              <label className="d-flex justify-content-between">
                <span>
                  <img src="images/card-icon-blue.svg" /> Со картица
                </span>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={payment === "card"}
                  onChange={(e) => setPayment(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-2">
              <label className="d-flex justify-content-between">
                <span>
                  <img src="images/dollar-icon.svg" /> Во кеш
                </span>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={payment === "cash"}
                  onChange={(e) => setPayment(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="pt-4 pb-4 margin-bottom">
            <h3 className="text-left heading-xs mb-3">Поагање</h3>
            <div className="mb-2">
              <label className="d-flex justify-content-between">
                <span>00:00 - 06:00</span>
                <input
                  type="radio"
                  name="time"
                  value="00:00-06:00"
                  checked={departureTime === "00:00-06:00"}
                  onChange={(e) => setDepartureTime(e.target.value)}
                />
              </label>
            </div>
            {[...Array(5)].map((_, index) => {
              const startTime = index * 3 + 6; // Starting from 06:00 for subsequent options
              const formattedStartTime = `${
                startTime < 10 ? "0" : ""
              }${startTime}:00`;
              const endTime = startTime + 3;
              const formattedEndTime = `${
                endTime < 10 ? "0" : ""
              }${endTime}:00`;

              return (
                <div key={index + 1} className="mb-2">
                  <label className="d-flex justify-content-between">
                    <span>{`${formattedStartTime} - ${formattedEndTime}`}</span>
                    <input
                      type="radio"
                      name="time"
                      value={`${formattedStartTime}-${formattedEndTime}`}
                      checked={
                        departureTime ===
                        `${formattedStartTime}-${formattedEndTime}`
                      }
                      onChange={(e) => setDepartureTime(e.target.value)}
                    />
                  </label>
                </div>
              );
            })}
            <div className="mb-2">
              <label className="d-flex justify-content-between">
                <span>21:00 - 00:00</span>
                <input
                  type="radio"
                  name="time"
                  value="21:00-00:00"
                  checked={departureTime === "21:00-00:00"}
                  onChange={(e) => setDepartureTime(e.target.value)}
                />
              </label>
            </div>
          </div>
        </Container>
        <div className="container-fluid">
          <div className="filter-actions-wrapper">
            <Row className="filter-actions-row">
              <Col xs={6} className="reset-filters ps-0" onClick={resetFilters}>
                Ресетирај филтри
              </Col>
              <Button
                className="col-6 dark-button body-bold-medium"
                onClick={applyFilters}
              >
                Прикажи
              </Button>
            </Row>
          </div>
        </div>
      </div>
      <Container>
        <Row className="d-flex search-bar-container mt-4">
          <Col
            xs={10}
            className="search-bar d-flex"
            onClick={() => setModal(1)}
          >
            <img src="images/search-icon.svg" className="me-3" />
            <div>
              <p className="bold">
                {options.fromLocName} - {options.toLocName}
              </p>
              <p>
                {options.date} | {options.seats} место
              </p>
            </div>
          </Col>
          <Col xs={2} className="text-end pe-0">
            <button className="text-center p-0" onClick={() => setModal(2)}>
              <img src="images/filter-icon.svg" className="filter-icon" />
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchBar;
