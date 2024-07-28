import React, { useContext } from "react";
import logo from "../../assets/images/logo.jpg";
import "../../assets/css/UstMenu.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "dayjs/locale/tr"; // Import the Turkish locale
import dayjs, { Dayjs } from "dayjs";

dayjs.locale("tr"); // Set the global locale to Turkish

interface UstMenuProps {
  seciliGun: Dayjs;
  setSeciliGun: React.Dispatch<React.SetStateAction<Dayjs>>;
}

const UstMenu: React.FC<UstMenuProps> = ({seciliGun, setSeciliGun}) => {

  const bugunuGetir = () => {
    const now = dayjs();
    setSeciliGun(now);
  };

  const sonrakiAyaGec = () => {
    if (seciliGun) {
      const nextMonthDate = seciliGun.add(1, "month");
      setSeciliGun(nextMonthDate);
    }
  };

  const oncekiAyaGec = () => {
    if (seciliGun) {
      const nextMonthDate = seciliGun.subtract(1, "month");
      setSeciliGun(nextMonthDate);
    }
  };

  return (
    <header className="calendar-header">
      <div className="calendar-header-operations">
        <img src={logo} alt="calendar" className="calendar-logo" />
        <h1 className="calendar-title">Baykar Takvim</h1>
        <button onClick={oncekiAyaGec} className="calendar-button">
          <LeftOutlined />
        </button>
        <button onClick={bugunuGetir} className="calendar-button">
          Bugün
        </button>
        <button onClick={sonrakiAyaGec} className="calendar-button">
          <RightOutlined />
        </button>
        <h2 className="calendar-month">{seciliGun.format("MMM YYYY")}</h2>
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
