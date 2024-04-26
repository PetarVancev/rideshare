import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
          <Route
            path="/my-rides"
            element={<PrivateRoute element={<MyRides />} />}
          />
          <Route
            path="/post-ride"
            element={<DriverRoute element={<PostRide />} />}
          />
          <Route
            path="/wallet"
            element={<PrivateRoute element={<Wallet />} />}
          />
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
