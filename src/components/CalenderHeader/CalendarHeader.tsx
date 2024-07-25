import React, { useContext } from "react";
import logo from "../../assets/logo.jpg";
import "./CalendarHeader.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ContentContext } from "../../context/ContentProvider";
import { Button } from "antd";
import dayjs from "dayjs";

const CalendarHeader: React.FC = () => {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error("CalendarContext must be used within a ContentProvider");
  }

  const { seciliGun, setSeciliGun } = context;

  const getToday = () => {
    const now = dayjs();
    setSeciliGun(now);
  };

  const handleNextMonth = () => {
    if (seciliGun) {
      const nextMonthDate = seciliGun.add(1, "month");
      setSeciliGun(nextMonthDate);
    }
  };

  const handlePrevMonth = () => {
    if (seciliGun) {
      const nextMonthDate = seciliGun.subtract(1, "month");
      setSeciliGun(nextMonthDate);
    }
  };

  return (
    <header className="calendar-header">
      <div className="calendar-header-operations">
        <img src={logo} alt="calendar" className="calendar-logo" />
        <h1 className="calendar-title">Baykar Calendar</h1>
        <button onClick={handlePrevMonth} className="calendar-button">
          <LeftOutlined />
        </button>
        <button onClick={getToday} className="calendar-button">
          Today
        </button>
        <button onClick={handleNextMonth} className="calendar-button">
          <RightOutlined />
        </button>
        <h2 className="calendar-month">{seciliGun.format("MMM YYYY")}</h2>
      </div>
      <div className="right-buttons">
        <Button href="/" className="calendar-button">
          Login
        </Button>
        <Button href="/register" className="calendar-button">
          Register
        </Button>
      </div>
    </header>
  );
};

export default CalendarHeader;
