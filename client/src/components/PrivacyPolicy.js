import React from "react";
import { Container } from "react-bootstrap";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";

const PrivacyPolicy = () => {
  return (
    <div className="has-bottom-bar">
      <NavBar type="white" />
      <BottomBar />
      <Container className="blue-text">
        <h1 className="heading-s pt-4 pb-4 mb-0">
          Terms and Conditions of Use
        </h1>
        <div className="privacy-policy-container">
          <div>
            <h3 className="heading-xs">1. Terms of Use</h3>
            <h4 className="heading-xxs">1.1 Purpose and Definitions</h4>
          </div>
          <p>
            The general terms of use apply to all services provided by RAJD SHER
            import-export LLC Prilep (a company registered in North Macedonia
            with official headquarters at Sasho Kitanoski 89, Prilep,
            "rideshare"). <br />
            <br /> Rideshare owns and operates the website www.rideshare.mk,
            referred to as the "Site". <br />
            <br /> Definitions <br />
            <br />
            <ul>
              <li>
                "Ride sharing" means a shared trip, i.e., sharing a vehicle with
                a driver in exchange for a contribution to the travel costs;
              </li>
              <li>
                "rideshare" is RAJD SHER import-export LLC Prilep, the company
                that maintains the ride-sharing platform and all its partners or
                affiliated companies;
              </li>
              <li>
                "Terms" mean the General Terms, including the Code of Conduct
                and Privacy Policy;
              </li>
              <li>
                "Cost contribution" is the amount agreed between the Driver and
                Passenger that the Passenger pays for the ride;
              </li>
              <li>
                "Driver" is a person using the Site to post a ride offer to
                transport a Passenger to a destination in exchange for cost
                contribution;
              </li>
              <li>
                "Segment" is the part of the trip that a Passenger specifically
                books in accordance with the Terms;
              </li>
              <li>
                "Member" means a passenger, driver, or any other user of the
                Site;
              </li>
              <li>
                "Passenger" means a person who has accepted a Driver’s ride
                offer;
              </li>
              <li>
                "Service" means any service provided by the Site to any Member;
              </li>
              <li>
                "Site" means rideshare.mk and other applications, including all
                microsites or subpages provided by any of these websites;
              </li>
              <li>
                "Ride" is a shared trip arranged between the driver and
                passenger through the Site, including Qualification Rides;
              </li>
              <li>
                "User Account" is an account on the Site opened by a member to
                access the Service;
              </li>
              <li>
                "Vehicle" is the vehicle offered by the Driver for a shared
                ride.
              </li>
            </ul>
          </p>
          <p>
            <h4 className="heading-xxs">1.2 Acceptance of Terms</h4>
            These terms apply to all types of use of the Site. By using the
            Site, the member fully accepts the Terms, even without opening a
            user account.
            <br /> <br />
            Access to the Services will not be possible unless the Terms are
            fully accepted. Members cannot accept only part of the Terms. All
            members agree to comply with the Code of Conduct and accept that
            their personal data is processed according to the Privacy Policy.
            <br />
            <br />
            The service provision agreement for ride sharing is between the
            Driver and Passenger, and rideshare is not a party to these
            arrangements or their agreement.
            <br />
            <br />
            If a member fails to comply with any of the Terms, rideshare
            reserves the right to suspend the member's account and deny or
            suspend any Services without prior notice.
            <br />
            <br />
            The purpose of these Terms is to create binding rights and
            obligations between members.
          </p>
          <p>
            <h4 className="heading-xxs">
              1.3 Changes to Terms, Site, and Services
            </h4>
            Rideshare reserves the right to modify the Terms at any time.
            Additionally, rideshare may change or supplement the Terms, Site
            functionality, and/or the look and feel of the Site without prior
            notice and is not liable for the consequences of such changes to
            members.
            <br />
            <br />
            All changes become effective immediately upon posting on the Site.
            <br />
            <br />
            By using any Service after the updated Terms are posted, members
            automatically accept the modified Terms. Changes do not apply to
            reservations made before the new Terms were posted.
          </p>
          <p>
            <h3 className="heading-xs">2. Use of Services</h3>
            <h4 className="heading-xxs">2.1 User Account and Data Accuracy</h4>
            To use the services, every member must open a user account and
            provide all personal information requested by rideshare. Members
            must provide full name, age, title, valid phone number, and email
            address. Only persons over 18 years old may register.
            <br />
            <br />
            Members agree that all information provided to rideshare at account
            creation or any other time is true, complete, and accurate.
            Rideshare is not responsible for incomplete, inaccurate, or false
            information provided by any member.
            <br />
            <br />
            Unless otherwise agreed with rideshare, members may only have one
            account. No one may open an account on behalf of someone else or
            impersonate another person.
          </p>

          {/* Continue translating the rest of sections in the same way... */}
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
