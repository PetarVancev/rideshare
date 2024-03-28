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
          <Route path="/my-rides" element={<MyRides />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
