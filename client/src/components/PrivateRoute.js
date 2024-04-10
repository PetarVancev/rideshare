import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn()) {
    return element;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
