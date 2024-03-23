import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import Login from "./components/LoginForm";
import Registration from "./components/Registration";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />{" "}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
