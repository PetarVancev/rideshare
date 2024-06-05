import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import Login from "./components/LoginForm";
import Registration from "./components/Registration";
import PasswordResetForm from "./components/PasswordResetForm";
import PasswordResetRequest from "./components/PasswordResetRequestForm";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import MyRides from "./components/MyRides";
import RideInfo from "./components/RideInfo";
import PostRide from "./components/PostRide";
import Wallet from "./components/Wallet";
import MyProfile from "./components/MyProfile";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import HowToUse from "./components/HowToUse";
import SubmissionSuccess from "./components/SubmissionSuccess";

import DriverRoute from "./components/DriverRoute";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/request-password-reset"
            element={<PasswordResetRequest />}
          />
          <Route path="/reset-password" element={<PasswordResetForm />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="/ride-info" element={<RideInfo />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route
            path="/my-rides"
            element={<PrivateRoute element={<MyRides />} />}
          />
          <Route
            path="/post-ride"
            element={<DriverRoute element={<PostRide />} />}
          />

          <Route path="/wallet" element={<Outlet />}>
            <Route index element={<PrivateRoute element={<Wallet />} />} />
            <Route
              path="deposit-success"
              element={
                <SubmissionSuccess
                  statusMessage={"Успешно е надополнета вашата сметка"}
                  nextStepsMessage={
                    "*Вашата моментална состојба можете да ја погледнете во делот паричник"
                  }
                  buttonText={"Паричник"}
                  goTo={"/wallet"}
                  hasNavBar={true}
                />
              }
            />
            <Route
              path="deposit-failed"
              element={
                <SubmissionSuccess
                  statusMessage={
                    "Дојде до грешка при надополнување на вашата сметка"
                  }
                  nextStepsMessage={
                    "Ве молиме обидете се повторно подоцна и доколку сеуште има проблем контактирајте не"
                  }
                  buttonText={"Паричник"}
                  goTo={"/wallet"}
                  hasNavBar={true}
                  isError={true}
                />
              }
            />
          </Route>
          <Route
            path="/my-profile"
            element={<PrivateRoute element={<MyProfile />} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
