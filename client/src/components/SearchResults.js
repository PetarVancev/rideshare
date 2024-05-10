import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import RideCard from "./RideCard";
import SearchBar from "./SearchBar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SearchResults = () => {
  const location = useLocation();

  const [rides, setRides] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const fromLoc = queryParams.get("from");
  const toLoc = queryParams.get("to");
  const date = queryParams.get("date");
  const seats = queryParams.get("seats");
  const sortBy = queryParams.get("sortBy");
  const timeRange = queryParams.get("timeRange");

  const [options, setOptions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make API request using Axios
        let searchApi = `${backendUrl}/rides/search?from_loc_id=${fromLoc}&to_loc_id=${toLoc}&date_time=${date}&seats=${seats}`;
        if (sortBy) {
          searchApi += `&sortBy=${sortBy}`;
        }

        if (timeRange) {
          searchApi += `&timeRange=${timeRange}`;
        }

        const getLocationNameApi = (loc_id) => {
          return `${backendUrl}/locations/get-location?locationId=${loc_id}`;
        };
        const response = await axios.get(searchApi);
        const responseFromLocation = await axios.get(
          getLocationNameApi(fromLoc)
        );
        const responseToLocation = await axios.get(getLocationNameApi(toLoc));
        setOptions({
          fromId: fromLoc,
          fromLocName: responseFromLocation.data.name,
          toId: toLoc,
          toLocName: responseToLocation.data.name,
          date: date,
          seats: seats,
        });
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.search]);

  return (
    <div className="has-bottom-bar">
      <NavBar />
      <BottomBar />
      <Container>
        <SearchBar
          options={options}
          initialSortBy={sortBy}
          initialTimeRange={timeRange}
        />
        <p className="text-center rides-count body-bold-xs mt-3">
          {rides.length > 0
            ? `${rides.length} превозници`
            : "Нема превозници за избраните критериуми"}
        </p>
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} seats={seats} />
        ))}
      </Container>
    </div>
  );
};

export default SearchResults;
