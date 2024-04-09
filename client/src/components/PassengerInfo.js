import React from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const PassengerInfo = ({ key, reservation, location, token }) => {
  const confirmAtPickup = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const url =
              backendUrl +
              `/reservations/driver/confirm-pickup?reservationId=${reservation.id}`;
            await axios.post(
              url,
              { latitude, longitude },
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );
            window.location.reload();
          } catch (error) {
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

  return (
    <div>
      <div
        className="d-flex justify-content-between mx-3 blue-text pt-4"
        key={key}
      >
        <span className="body-bold-medium">{reservation.name}</span>
        <div className="d-flex">
          {location === "custom" && (
            <a
              href={`https://www.google.com/maps/dir/Current+Location/${reservation.pick_up_lat},${reservation.pick_up_lon}`}
              className="body-s blue-text"
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
                  fill="#4ac777"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.44476 23.8317C9.44505 23.8319 9.4453 23.8321 10 23L9.44476 23.8317C9.78066 24.0556 10.2188 24.056 10.5547 23.8321L10 23C10.5547 23.8321 10.5544 23.8322 10.5547 23.8321L10.5581 23.8298L10.5648 23.8253L10.5877 23.8098C10.6072 23.7966 10.6349 23.7776 10.6704 23.753C10.7415 23.7038 10.8435 23.6321 10.9722 23.5392C11.2295 23.3534 11.5936 23.0822 12.0292 22.7354C12.8987 22.043 14.0606 21.0428 15.226 19.8127C17.5157 17.3958 20 13.9019 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 13.9019 2.48426 17.3958 4.77405 19.8127C5.93939 21.0428 7.10133 22.043 7.97082 22.7354C8.40636 23.0822 8.77055 23.3534 9.02779 23.5392C9.15646 23.6321 9.25853 23.7038 9.32956 23.753C9.36508 23.7776 9.39285 23.7966 9.41232 23.8098L9.43524 23.8253L9.4419 23.8298L9.44476 23.8317ZM4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10C18 13.0981 15.9843 16.1042 13.774 18.4373C12.6894 19.5822 11.6013 20.5195 10.7833 21.1708C10.4789 21.4133 10.213 21.6152 10 21.7726C9.78702 21.6152 9.52111 21.4133 9.21668 21.1708C8.39867 20.5195 7.31061 19.5822 6.22595 18.4373C4.01574 16.1042 2 13.0981 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315Z"
                  fill="#4ac777"
                />
              </svg>
              Локација
            </a>
          )}
          <a
            href={`tel:${reservation.phone_num}`}
            className="body-s ms-4 blue-text"
          >
            <img src="images/phone-icon.svg" />
            Јави се
          </a>
        </div>
      </div>
      {location === "custom" && (
        <div className="text-center">
          <Button
            className="dark-button col-12 mt-4 arrived-button body-bold-medium"
            onClick={confirmAtPickup}
            disabled={reservation.driver_arrived === 1}
          >
            {reservation.driver_arrived === 1
              ? "Стигање потврдено"
              : "Стигнав на локацијата"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PassengerInfo;
