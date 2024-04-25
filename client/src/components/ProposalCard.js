import React from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const mapsApiKey = process.env.REACT_APP_MAPS_API_KEY;

const ProposalCard = ({ proposal, token }) => {
  const { logoutUser } = useAuth();
  const declineProposal = async () => {
    try {
      const url =
        backendUrl +
        `/reservations/driver/decline-proposal?reservationId=${proposal.id}`;
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.dismiss();
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
      window.location.reload();
    }
  };

  const acceptProposal = async () => {
    try {
      const url =
        backendUrl +
        `/reservations/driver/accept-proposal?reservationId=${proposal.id}`;
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.dismiss();
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
      window.location.reload();
    }
  };

  return (
    <Card className="proposal-card pb-3">
      <Card.Header className="d-flex justify-content-between">
        <div className="body-bold-medium">{proposal.name}</div>
      </Card.Header>
      <Card.Body className="px-0">
        {!!!proposal.custom_pick_up && (
          <h1 className="body-bold-s text-center blue-text mt-3 mb-3">
            <img src="images/direction-icon.svg" className="me-2" />
            Нема предложено локација на Подигање
          </h1>
        )}
        {!!proposal.custom_pick_up && (
          <div>
            <h1 className="body-bold-s text-center blue-text mb-3">
              <img src="images/direction-icon.svg" className="me-2" />
              Локација на подигање
            </h1>
            <iframe
              className="mb-3"
              title="Google Maps"
              width="100%"
              height="200px"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${proposal.pick_up_lat},${proposal.pick_up_lon}&zoom=15`}
              allowFullScreen
            ></iframe>
          </div>
        )}
        {!!proposal.custom_drop_off && (
          <div>
            <h1 className="body-bold-s text-center blue-text mt-3 mb-3">
              <img src="images/direction-icon.svg" className="me-2" />
              Локација на оставање
            </h1>
            <iframe
              className="mb-3"
              title="Google Maps"
              width="100%"
              height="200px"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${proposal.drop_off_lat},${proposal.drop_off_lon}&zoom=15`}
              allowFullScreen
            ></iframe>
          </div>
        )}

        {!!!proposal.custom_drop_off && (
          <h1 className="body-bold-s text-center blue-text mt-3 mb-3">
            <img src="images/direction-icon.svg" className="me-2" />
            Нема предложено локација на оставање
          </h1>
        )}
        <div className="d-flex justify-content-center">
          <Button variant="outline-danger" onClick={declineProposal}>
            Одбиј
          </Button>
          <Button
            variant="success"
            className="accept-proposal"
            onClick={acceptProposal}
          >
            Прифати
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProposalCard;
