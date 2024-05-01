import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const NavBar = ({ type }) => {
  const navigate = useNavigate();
  const { isLoggedIn, userType } = useAuth();

  let colorClass = "";
  let iconsColor = "#022C66";
  let logoColor = "-bg";
  if (type == "blue") {
    colorClass = "blue";
    iconsColor = "#FFFFFF";
    logoColor = "-wg";
  }
  if (type == "green") {
    colorClass = "green";
    iconsColor = "#FFFFFF";
    logoColor = "-white";
  }

  const handleClick = () => {
    if (isLoggedIn() && userType == "driver") {
      navigate("/post-ride");
    } else {
      navigate("/login");
    }
  };
  return (
    <Navbar bg="white" variant="light" expand="lg" className={colorClass}>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand href="/">
          <img
            src={"/images/logo" + logoColor + ".svg"}
            alt="Logo"
            className="logo"
          />
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link>
            <svg
              width="26"
              height="27"
              viewBox="0 0 26 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleClick}
            >
              <rect
                x="1"
                y="1.76282"
                width="24"
                height="24"
                rx="12"
                stroke={iconsColor}
                stroke-width="2"
              />
              <path
                d="M14 6.76282C14 6.21053 13.5523 5.76282 13 5.76282C12.4477 5.76282 12 6.21053 12 6.76282V12.7628H6C5.44772 12.7628 5 13.2105 5 13.7628C5 14.3151 5.44772 14.7628 6 14.7628H12V20.7628C12 21.3151 12.4477 21.7628 13 21.7628C13.5523 21.7628 14 21.3151 14 20.7628V14.7628H20C20.5523 14.7628 21 14.3151 21 13.7628C21 13.2105 20.5523 12.7628 20 12.7628H14V6.76282Z"
                fill={iconsColor}
              />
            </svg>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
