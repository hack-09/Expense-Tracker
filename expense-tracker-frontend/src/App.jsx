import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Expenses from "./pages/Expenses";
import Landing from "./pages/Landing";
import Placeholder from "./pages/Placeholder";
import PreviewDashboard from "./pages/PreviewDashboard";
import "./App.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Expenses />
            </PrivateRoute>
          }
        />
        
        <Route path="/about" element={<Placeholder title="About Us" />} />
        <Route path="/blog" element={<Placeholder title="Blog" />} />
        <Route path="/careers" element={<Placeholder title="Careers" />} />
        <Route path="/contact" element={<Placeholder title="Contact Us" />} />
        <Route path="/features" element={<Placeholder title="Features" />} />
        <Route path="/pricing" element={<Placeholder title="Pricing" />} />
        <Route path="/api" element={<Placeholder title="API Documentation" />} />
        <Route path="/integrations" element={<Placeholder title="Integrations" />} />
        <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
        <Route path="/terms" element={<Placeholder title="Terms of Service" />} />
        <Route path="/cookies" element={<Placeholder title="Cookie Policy" />} />
        <Route path="/gdpr" element={<Placeholder title="GDPR Compliance" />} />
        <Route path="/preview" element={<PreviewDashboard />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
