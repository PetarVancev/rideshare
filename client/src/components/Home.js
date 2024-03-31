import React, { useState } from "react";
import { Card, Form, Button, Container } from "react-bootstrap";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import LocationAutocomplete from "./LocationAutocomplete";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split("T")[0];

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState();
  const [seatsNumber, setSeatsNumber] = useState(1);
  const [date, setDate] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const seats = [
    { text: "1 Место", value: 1 },
    { text: "2 Места", value: 2 },
    { text: "3 Места", value: 3 },
    { text: "4 Места", value: 4 },
    { text: "5 Места", value: 5 },
  ];

  const searchLocations = async (event) => {
    const value = event.query; // The value entered by the user
    try {
      const autoCompleteApi =
        backendUrl + "/locations/autocomplete" + `?name=${value}`;
      const response = await axios.get(autoCompleteApi);
      const data = response.data; // Assuming API response is an array of suggestions
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setLocationSuggestions([]); // Clear suggestions on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `/results?from=${fromId}&to=${toId}&date=${date}`;
    navigate(url);
  };

  return (
    <div className="home-background">
      <NavBar type="blue" />
      <BottomBar />
      <Container className="home-container">
        <div className="d-flex align-items-center justify-content-center h-100">
          <Card className="search-ride-card">
            <Card.Body>
              <Form>
                <Form.Group controlId="fromLocation">
                  <div className="search-inputs mt-1">
                    <img src="images/location-icon.svg" />
                    <LocationAutocomplete
                      placeholder="Од каде патувате"
                      onSelect={setFromId}
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="toLocation">
                  <div className="search-inputs">
                    <img src="images/location-icon2.svg" />
                    <LocationAutocomplete
                      placeholder="До каде патувате"
                      onSelect={setFromId}
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="dateTime">
                  <div className="search-inputs">
                    <img src="images/calendar-icon.svg" />
                    <Form.Control
                      className="date-pick-field"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={currentDate}
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="seatsNumber">
                  <div className="search-inputs">
                    <svg
                      width="20"
                      height="23"
                      viewBox="0 0 20 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10 0.262817C6.93175 0.262817 4.44444 2.72525 4.44444 5.76282C4.44444 8.80038 6.93175 11.2628 10 11.2628C13.0682 11.2628 15.5556 8.80038 15.5556 5.76282C15.5556 2.72525 13.0682 0.262817 10 0.262817ZM6.66667 5.76282C6.66667 3.94028 8.15905 2.46282 10 2.46282C11.841 2.46282 13.3333 3.94028 13.3333 5.76282C13.3333 7.58536 11.841 9.06282 10 9.06282C8.15905 9.06282 6.66667 7.58536 6.66667 5.76282Z"
                        fill="#022C66"
                      />
                      <path
                        d="M5.55556 13.4628C4.08213 13.4628 2.66905 14.0423 1.62718 15.0737C0.585316 16.1052 0 17.5041 0 18.9628V21.1628C0 21.7703 0.497461 22.2628 1.11111 22.2628C1.72476 22.2628 2.22222 21.7703 2.22222 21.1628V18.9628C2.22222 18.0876 2.57341 17.2482 3.19853 16.6294C3.82365 16.0105 4.6715 15.6628 5.55556 15.6628H14.4444C15.3285 15.6628 16.1763 16.0105 16.8015 16.6294C17.4266 17.2482 17.7778 18.0876 17.7778 18.9628V21.1628C17.7778 21.7703 18.2752 22.2628 18.8889 22.2628C19.5025 22.2628 20 21.7703 20 21.1628V18.9628C20 17.5041 19.4147 16.1052 18.3728 15.0737C17.3309 14.0423 15.9179 13.4628 14.4444 13.4628H5.55556Z"
                        fill="#022C66"
                      />
                    </svg>
                    <Dropdown
                      className="spaces-dropdown"
                      value={seatsNumber}
                      onChange={(e) => setSeatsNumber(e.value)}
                      options={seats}
                      optionLabel="text"
                      placeholder="Select a City"
                      panelClassName="autocomplete-dropdown"
                    />
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
            <Button
              className="dark-button col-12 mt-4 search-button"
              type="submit"
              onClick={handleSubmit}
            >
              Пребарај
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Home;
