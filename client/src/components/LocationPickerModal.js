import React, { useEffect, useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { Container, Row, Col, Button } from "react-bootstrap";

import BackButton from "./BackButton";

const mapsApiKey = process.env.REACT_APP_MAPS_API_KEY;

const LocationPickerModal = ({
  handleClose,
  open,
  defaultPosition,
  onSet,
  title,
}) => {
  const defaultLat = parseFloat(defaultPosition.lat);
  const defaultLng = parseFloat(defaultPosition.lng);

  const [markerPosition, setMarkerPosition] = useState({
    lat: defaultLat,
    lng: defaultLng,
  });

  const mapStyles = {
    height: "60%",
    width: "100%",
    position: "absolute",
    left: "0",
    bottom: "112px",
  };

  // Adjust the number of meters for the boundary
  const boundaryMeters = 7000; // 1 km

  const handleMarkerChange = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPosition = { lat, lng };
    setMarkerPosition(newPosition);
  };

  // Calculate latitude and longitude bounds for the square
  const latLngBounds = {
    north: defaultLat + boundaryMeters / 111000, // Approx. 1 degree latitude is approximately 111000 meters
    south: defaultLat - boundaryMeters / 111000,
    west:
      defaultLng -
      boundaryMeters / (111000 * Math.cos((defaultLat * Math.PI) / 180)),
    east:
      defaultLng +
      boundaryMeters / (111000 * Math.cos((defaultLat * Math.PI) / 180)),
  };

  useEffect(() => {
    const handleBodyScroll = () => {
      if (open) {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }
    };

    handleBodyScroll();

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  return (
    <div
      className={`write-review-modal location-pick-modal ${open ? "" : "hide"}`}
    >
      <Container>
        <BackButton customNav={handleClose} />
        <h1 className="body-bold-s text-center blue-text mb-4">
          <img src="images/direction-icon.svg" /> {title}
        </h1>
        <GoogleMap
          options={{
            streetViewControl: false,
            minZoom: 1,
            restriction: {
              latLngBounds: latLngBounds,
            },
          }}
          mapContainerStyle={mapStyles}
          zoom={14}
          center={markerPosition} // Pass latitude and longitude as floats
          onClick={(e) => handleMarkerChange(e)}
          restriction={{ latLngBounds }}
          apiKey={mapsApiKey}
        >
          <MarkerF
            draggable={true}
            position={markerPosition}
            onDragEnd={handleMarkerChange}
          />
        </GoogleMap>
        <Row className="submission-bottom-bar modal-bottom-bar text-center">
          <Col xs={12}>
            <Button
              type="submit"
              className="col-12 mt-4 dark-button body-bold-medium"
              onClick={() => onSet(markerPosition)}
            >
              Предложи
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LocationPickerModal;
