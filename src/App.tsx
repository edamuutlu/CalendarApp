import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import CalendarHeader from "./components/CalenderHeader/CalendarHeader";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import MyCalendar from "./components/MyCalendar/MyCalendar"

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <>
              <CalendarHeader/>
              <div className="hero">
                <Sidebar />
                <MyCalendar />
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
