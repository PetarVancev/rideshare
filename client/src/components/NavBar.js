import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const NavBar = ({ type }) => {
  const navigate = useNavigate();
  const { isLoggedIn, userType } = useAuth();

  const [sidebarOpen, setSideBarOpen] = useState(false);

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

  return (
    <>
      <Navbar bg="white" variant="light" expand={false} className={colorClass}>
        <Container>
          <Navbar.Toggle onClick={() => setSideBarOpen(true)} />
          <Navbar.Brand href="/">
            <img
              src={"/images/logo" + logoColor + ".svg"}
              alt="Logo"
              className="logo"
            />
          </Navbar.Brand>
          <Nav className="ml-auto">
            {/* <Nav.Link>
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
            </Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>
      <div
        className={
          "side-bar white-text d-flex flex-column" +
          (sidebarOpen ? " open" : "")
        }
      >
        <div className="text-end">
          <button
            className="close-button mt-5 mb-4 text-center p-0"
            onClick={() => setSideBarOpen(false)}
          >
            X
          </button>
        </div>
        <div>
          <h4 className="white-text mb-3 heading-s">MENU</h4>
          <a href="/about-us">
            <img src="images/group-icon-white.svg" /> About Us
          </a>
          <a href="/how-to-use">
            <img src="images/book-icon.svg" /> How to use rideshare
          </a>
          {/* <a>
            <img src="images/question-icon.svg" /> Frequently Asked Questions
          </a> */}
          <a href="/contact">
            <img src="images/message-bubble-icon.svg" /> Contact
          </a>
        </div>
        <div className="mt-auto">
          <a href="https://www.instagram.com/ridesharemk/">Instagram</a>
          <a
            className="mb-4"
            href="https://www.facebook.com/people/Rideshare/61558760050670/"
          >
            Facebook
          </a>
          <a href="/privacy-policy">Policy and terms of use</a>
          <div className="text-center mb-5 mt-4">
            <img src="images/logo-white.svg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
