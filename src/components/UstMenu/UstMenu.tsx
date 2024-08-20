import React from "react";
import logo from "../../assets/images/logo.jpg";
import "../../assets/css/UstMenu.css";
import { Button } from "antd";
import "dayjs/locale/tr"; // Import the Turkish locale
import dayjs from "dayjs";

dayjs.locale("tr"); // Set the global locale to Turkish

const UstMenu: React.FC = () => {

  return (
    <header className="calendar-header">
      <div className="calendar-header-operations">
        <img src={logo} alt="calendar" className="calendar-logo" />
        <h1 className="calendar-title">Baykar Takvim</h1>
      </div>
      <div className="right-buttons">
        <Button href="/" className="calendar-button">
          Giriş Yap
        </Button>
        <Button href="/kayit" className="calendar-button">
          Kayıt Ol
        </Button>
      </div>
    </header>
  );
};

export default UstMenu;
