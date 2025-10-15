import React from "react";
import { Container } from "react-bootstrap";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";

const HowToUse = () => {
  return (
    <div className="has-bottom-bar">
      <NavBar type="white" />
      <BottomBar />
      <Container className="blue-text how-to-use-container">
        <h1 className="heading-m pt-4 pb-1 mb-0">For the Driver</h1>
        <p className="heading-subtext">
          Post where you are traveling from and to, and reduce your costs to 0!
        </p>
        <div className="text-center pb-4">
          <img src="/images/how-to-use-hero.jpg" />
        </div>
        <h3 className="heading-xxs">1. Post a ride</h3>
        <p>
          Click on the plus and follow the steps, don't forget to enable the
          option <strong>"Receive location suggestion"</strong>, if you would
          like to receive suggestions with concrete addresses for picking up and
          dropping off passengers. (Example: the passenger wants you to pick
          them up from their home)
        </p>
        <h3 className="heading-xxs">2. Passengers book online</h3>
        <p>
          After passengers book, in the <strong>"Trips"</strong> section you can
          view the locations for picking up and dropping off passengers as well
          as their phone number. You can also view and accept/reject passenger
          suggestions here.
        </p>
        <h3 className="heading-xxs">
          3. Confirm when you arrive at the passenger pickup location.
        </h3>
        <p>
          When you arrive at the pickup location for the passengers/passenger,
          don't forget to press the <strong>"I've arrived"</strong> button next
          to the corresponding passenger/location. This step is especially
          important if you receive payments online so that we can protect you
          and you can receive the money even if the passenger does not show up.
        </p>
        <h3 className="heading-xxs">4. Travel together</h3>
        <p>
          After you've found passengers, we wish you a happy journey and a
          million worry-free trips.
        </p>

        <h3 className="heading-xxs">5. Payout</h3>
        <p>
          You can choose to have passengers pay you in the car during the trip
          or online through our application. If you choose online, your money
          will be available when the passenger confirms that they have arrived
          at their destination or within 1-2 business days if the passenger
          forgot to confirm their arrival at their location or did not show up
          at all.
        </p>
        <h1 className="heading-m pt-4 pb-1 mb-0">For the Passenger</h1>
        <p className="mb-4 heading-subtext">
          Enter where you are traveling from and to and travel most comfortably
          for a minimal amount!
        </p>
        <h3 className="heading-xxs">1. Search for a ride</h3>
        <p>
          Enter the city of departure and the city of arrival as well as the day
          you need the ride. Click search. Now you can choose the trip that
          suits you best. Don't forget to select{" "}
          <strong>"SUGGESTED PICKUP LOCATION"</strong> and{" "}
          <strong>"SUGGESTED DROPOFF LOCATION"</strong> if you have specific
          requests for where the driver should pick you up/drop you off. If you
          send a suggestion, the driver must first accept your suggestion for
          your reservation to be confirmed.
        </p>
        <h3 className="heading-xxs">2. Payment</h3>
        <p>
          First, you need to top up your wallet in the application. The
          topped-up funds are used for paying for the reservation or paying the
          driver. You can pay during the trip in cash or online through our
          application, depending on the payment method chosen by the driver.
        </p>
        <h3 className="heading-xxs">3. After you've booked</h3>
        <p>
          After you've booked, you can view your reservation in the{" "}
          <strong>"Trips"</strong> section where you can send a message to the
          driver.
        </p>
        <h3 className="heading-xxs">
          4. Confirm when you arrive at your destination.
        </h3>
        <p>
          When you arrive at your destination, don't forget to press the{" "}
          <strong>"I've arrived"</strong> button next to the corresponding trip.
          This step is especially important if you are paying online, as the
          money will be transferred to the driver after you complete this step
          or after 24 hours have passed since your arrival.
        </p>
        <h3 className="heading-xxs">5. Travel together</h3>
        <p>
          After the driver has picked you up, we wish you a happy journey and a
          million worry-free trips.
        </p>
        <h3 className="heading-xxs">6. The trip does not take place</h3>
        <p>
          If the driver does not show up or the trip does not take place, click
          the button <strong>"The ride did not take place"</strong>. Where you
          write the reasons why the ride did not take place and if the reasons
          are justified (Example: the driver does not show up), the money will
          be returned to you within a few business days. You have a deadline of{" "}
          <strong>24h</strong> after the completion of the trip to do this.
        </p>
      </Container>
    </div>
  );
};

export default HowToUse;
