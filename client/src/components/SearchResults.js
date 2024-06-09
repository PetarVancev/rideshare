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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const fromLoc = queryParams.get("from");
  const toLoc = queryParams.get("to");
  const date = queryParams.get("date");
  const seats = queryParams.get("seats");
  const sortBy = queryParams.get("sortBy");
  const timeRange = queryParams.get("timeRange");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      setError(null); // Reset error state when fetching starts
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
        setError(
          "Грешка при пребарувањето. Напомена: Локациите морате да ги изберете од опциите што се појавуваат."
        );
      } finally {
        setLoading(false); // Set loading to false once fetching is done
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
        {loading ? (
          <p className="text-center body-bold-xs rides-count mt-3">
            Почекајте...
          </p>
        ) : error ? (
          <p className="text-center body-bold-xs rides-count mt-3">{error}</p>
        ) : (
          <>
            <p className="text-center rides-count body-bold-xs mt-3">
              {rides.length > 0
                ? `${rides.length} превозници`
                : "Нема превозници за избраните критериуми"}
            </p>
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} seats={seats} />
            ))}
          </>
        )}
      </Container>
    </div>
  );
};

export default SearchResults;
