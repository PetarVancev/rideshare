import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const DriverRoute = ({ element, ...rest }) => {
  const { isLoggedIn, userType } = useAuth();

  if (isLoggedIn() && userType === "driver") {
    return element;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default DriverRoute;
