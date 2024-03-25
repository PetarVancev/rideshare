import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import RideCard from "./RideCard";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SearchResults = () => {
  const location = useLocation();
  const [rides, setRides] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const fromLoc = queryParams.get("from");
        const toLoc = queryParams.get("to");
        const date = queryParams.get("date");

        // Make API request using Axios
        const searchApi =
          backendUrl +
          `/rides/search?from_loc_id=${fromLoc}&to_loc_id=${toLoc}&date_time=${date}`;
        const response = await axios.get(searchApi);
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.search]);
  return (
    <div>
      <NavBar />
      <BottomBar />
      <Container>
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </Container>
    </div>
  );
};

export default SearchResults;
