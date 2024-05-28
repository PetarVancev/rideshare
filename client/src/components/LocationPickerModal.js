import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import BackButton from "./BackButton";

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
    height: "100%",
    width: "100%",
  };

  let boundaryMeters = 3000; // 7 km
  if (defaultLat == 41.9961 && defaultLng == 21.4317) {
    boundaryMeters = 6000;
  }

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
        window.scrollTo(0, 0);
      } else {
        document.body.classList.remove("modal-open");
      }
    };

    handleBodyScroll();

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  const handleMarkerChange = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPosition = { lat, lng };
    setMarkerPosition(newPosition);
  };

  const handleUseCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentPosition = { lat: latitude, lng: longitude };

          // Check if current position is within bounds
          const withinBounds =
            currentPosition.lat >= latLngBounds.south &&
            currentPosition.lat <= latLngBounds.north &&
            currentPosition.lng >= latLngBounds.west &&
            currentPosition.lng <= latLngBounds.east;

          if (withinBounds) {
            setMarkerPosition(currentPosition);
            onSet(currentPosition);
          } else {
            console.log("Current position is outside the bounds.");
          }
        },
        (error) => {
          console.error("Error getting current position:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const renderMap = () => {
    return (
      <div className="custom-map-wrapper">
        <GoogleMap
          options={{
            streetViewControl: false,
            minZoom: 1,
            restriction: {
              latLngBounds: latLngBounds,
            },
            mapTypeControl: false,
          }}
          mapContainerStyle={mapStyles}
          zoom={15}
          center={markerPosition}
          onClick={(e) => handleMarkerChange(e)}
          className="google-map"
        >
          <MarkerF
            draggable={true}
            position={markerPosition}
            onDragEnd={handleMarkerChange}
          />
        </GoogleMap>
      </div>
    );
  };

  return (
    <div
      className={`write-review-modal location-pick-modal ${open ? "" : "hide"}`}
    >
      <Container>
        <BackButton customNav={handleClose} />
        <h1 className="body-bold-s text-center blue-text mb-1">
          <img src="images/direction-icon.svg" /> {title}
        </h1>
        <h1
          className="body-bold-xs text-center blue-text current-position-button"
          onClick={handleUseCurrentPosition}
        >
          <span className="mx-auto">
            <img src="images/location-icon.svg" className="me-2" /> Користи
            моментална локација
          </span>
        </h1>
        {renderMap()}
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
