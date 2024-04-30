import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import ChangePhoneModal from "./ChangePhoneModal";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MyProfile = () => {
  const { userType, token, logoutUser } = useAuth();
  const [user, setUser] = useState(null);
  const [changePhoneOpen, setChangePhoneOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const url = backendUrl + "/auth/get-profile-info";
        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logoutUser();
        }
        console.error("Error fetching user information:", error);
      }
    };
    fetchUserInfo();
  }, [changePhoneOpen]);

  return (
    <div className="has-bottom-bar my-profile-wrapper">
      <NavBar type="blue" />
      <BottomBar />
      {user && (
        <>
          <Container>
            <div className="text-center pb-4">
              <h3 className="heading-m white-text mb-0">{user.name}</h3>
              <p className="heading-xs green-text">
                {user.averageReviewScore}/5.0
              </p>
            </div>
          </Container>
          <div className="profile-info">
            <Container>
              <div className="d-flex justify-content-between profile-field-rectangle">
                <div className="d-flex">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="me-2"
                  >
                    <path
                      fill="#022C66"
                      clip-rule="evenodd"
                      d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2ZM9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7Z"
                    ></path>
                    <path
                      fill="#022C66"
                      d="M8 14C6.67392 14 5.40215 14.5268 4.46447 15.4645C3.52678 16.4021 3 17.6739 3 19V21C3 21.5523 3.44772 22 4 22C4.55228 22 5 21.5523 5 21V19C5 18.2043 5.31607 17.4413 5.87868 16.8787C6.44129 16.3161 7.20435 16 8 16H16C16.7956 16 17.5587 16.3161 18.1213 16.8787C18.6839 17.4413 19 18.2044 19 19V21C19 21.5523 19.4477 22 20 22C20.5523 22 21 21.5523 21 21V19C21 17.6739 20.4732 16.4021 19.5355 15.4645C18.5979 14.5268 17.3261 14 16 14H8Z"
                    ></path>
                  </svg>
                  Име
                </div>
                <span>{user.name}</span>
              </div>
              <div className="d-flex justify-content-between profile-field-rectangle">
                <div className="d-flex">
                  <img src="images/email-icon.svg" className="me-2" /> Е-Пошта
                </div>
                <span>{user.email}</span>
              </div>
              {/* <div className="d-flex justify-content-between profile-field-rectangle">
                <div className="d-flex">
                  <img src="images/lock-icon.svg" className="me-2" /> Лозинка
                </div>
                <img src="images/right-arrow.svg" />
              </div> */}
              <div
                className="d-flex justify-content-between profile-field-rectangle"
                onClick={() => setChangePhoneOpen(true)}
              >
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
                  Телефон
                </div>
                <span>
                  {user.phone_num}
                  <img src="images/right-arrow.svg" className="ms-2" />
                </span>
              </div>
              <div className="d-flex justify-content-between profile-field-rectangle">
                <div className="d-flex">
                  <img src="images/status-icon.svg" className="me-2" />
                  Статус на профил
                </div>
                <span>{userType === "passenger" ? "Патник" : "Возач"}</span>
              </div>
            </Container>
            <div className="d-flex justify-content-between profile-actions text-center">
              <button
                className="profile-action-button log-out-button mx-auto"
                onClick={logoutUser}
              >
                <img src="images/log-out-icon.svg" className="me-2" />
                Одјави се
              </button>
            </div>
            <ChangePhoneModal
              close={() => setChangePhoneOpen(false)}
              isOpen={changePhoneOpen}
              intialPhone={user.phone_num}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyProfile;
