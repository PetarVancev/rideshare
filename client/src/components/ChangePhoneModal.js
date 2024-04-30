import React, { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import axios from "axios";

import { useAuth } from "./AuthContext";
import BackButton from "./BackButton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ChangePhoneModal = ({ close, isOpen, intialPhone }) => {
  const { token, logoutUser } = useAuth();

  const [phone, setPhone] = useState(intialPhone);
  const [error, setError] = useState("");

  const changePhone = async () => {
    try {
      const url = backendUrl + `/auth/change-phone`;
      const response = await axios.post(url, null, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
      setError(error.response.data.error);
    }
  };

  return (
    <div
      className={
        "profile-info change-phone-container " + (isOpen ? "show" : "")
      }
    >
      <Container>
        <BackButton className="custom-back-button" customNav={close} />
        <div className="title mt-5">
          <h2 className="heading-xs text-center">
            <svg
              width="25"
              height="25"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
            >
              <path
                d="M19.5455 14.8051V17.4301C19.5465 17.6738 19.4942 17.915 19.3919 18.1383C19.2897 18.3615 19.1397 18.562 18.9515 18.7267C18.7634 18.8915 18.5413 19.0169 18.2995 19.095C18.0577 19.173 17.8014 19.202 17.5471 19.1801C14.7264 18.8875 12.0169 17.9675 9.6363 16.4938C7.42148 15.1504 5.5437 13.358 4.1363 11.2438C2.58712 8.96114 1.62303 6.3622 1.32214 3.65758C1.29923 3.41562 1.32936 3.17175 1.4106 2.94151C1.49184 2.71126 1.62241 2.49969 1.79401 2.32025C1.9656 2.14082 2.17446 1.99746 2.40728 1.89929C2.6401 1.80113 2.89178 1.75031 3.1463 1.75008H5.8963C6.34117 1.74591 6.77245 1.89628 7.10975 2.17318C7.44706 2.45007 7.66738 2.8346 7.72964 3.25508C7.84571 4.09514 8.06097 4.91997 8.3713 5.71383C8.49464 6.02702 8.52133 6.36738 8.44822 6.6946C8.37511 7.02182 8.20526 7.32218 7.9588 7.56008L6.79464 8.67133C8.09956 10.8619 9.99972 12.6757 12.2946 13.9213L13.4588 12.8101C13.708 12.5748 14.0227 12.4127 14.3655 12.3429C14.7083 12.2731 15.0649 12.2986 15.393 12.4163C16.2246 12.7126 17.0887 12.918 17.9688 13.0288C18.4141 13.0888 18.8208 13.3029 19.1115 13.6304C19.4022 13.9579 19.5566 14.376 19.5455 14.8051Z"
                stroke="#022c66"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Промена на телефонски број
          </h2>
        </div>
        <div className="d-flex profile-field-rectangle">
          <div className="d-flex">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5455 14.8051V17.4301C19.5465 17.6738 19.4942 17.915 19.3919 18.1383C19.2897 18.3615 19.1397 18.562 18.9515 18.7267C18.7634 18.8915 18.5413 19.0169 18.2995 19.095C18.0577 19.173 17.8014 19.202 17.5471 19.1801C14.7264 18.8875 12.0169 17.9675 9.6363 16.4938C7.42148 15.1504 5.5437 13.358 4.1363 11.2438C2.58712 8.96114 1.62303 6.3622 1.32214 3.65758C1.29923 3.41562 1.32936 3.17175 1.4106 2.94151C1.49184 2.71126 1.62241 2.49969 1.79401 2.32025C1.9656 2.14082 2.17446 1.99746 2.40728 1.89929C2.6401 1.80113 2.89178 1.75031 3.1463 1.75008H5.8963C6.34117 1.74591 6.77245 1.89628 7.10975 2.17318C7.44706 2.45007 7.66738 2.8346 7.72964 3.25508C7.84571 4.09514 8.06097 4.91997 8.3713 5.71383C8.49464 6.02702 8.52133 6.36738 8.44822 6.6946C8.37511 7.02182 8.20526 7.32218 7.9588 7.56008L6.79464 8.67133C8.09956 10.8619 9.99972 12.6757 12.2946 13.9213L13.4588 12.8101C13.708 12.5748 14.0227 12.4127 14.3655 12.3429C14.7083 12.2731 15.0649 12.2986 15.393 12.4163C16.2246 12.7126 17.0887 12.918 17.9688 13.0288C18.4141 13.0888 18.8208 13.3029 19.1115 13.6304C19.4022 13.9579 19.5566 14.376 19.5455 14.8051Z"
                stroke="#022c66"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <input
            className="change-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
      </Container>

      <div className="d-flex justify-content-between profile-actions text-center">
        <Button className="dark-button body-bold-medium save-profile-changes mx-auto">
          Зачувај
        </Button>
      </div>
    </div>
  );
};

export default ChangePhoneModal;
