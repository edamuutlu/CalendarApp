import React, { useContext, useEffect } from "react";
import {
  Calendar,
} from "antd";
import "./MyCalendar.css";
import { ContentContext } from "../../context/ContentProvider";
import dayjs, { Dayjs } from "dayjs";
import {
  tumKullanicilariGetir,
} from "../../stores/UserStore";
import ModalForm from "../ModalForm/ModalForm";

const MyCalendar: React.FC = () => {

  const context = useContext(ContentContext);

  if (!context) {
    throw new Error("CalendarContext must be used within a ContentProvider");
  }

  const { etkinlikData, eklendigimEtkinlikler, setTumKullanicilar } = context;

  const {
    seciliGun,
    setSeciliGun,
    setAcilanEtkinlikPencereTarihi,
    etkinlikleriCek,
  } = context;

  useEffect(() => {
    const kullanicilariCek = async () => {
      const kullanicilar = await tumKullanicilariGetir();
      setTumKullanicilar(kullanicilar);
    };

    kullanicilariCek();
    etkinlikleriCek();
  }, [seciliGun]);

  const dateCellRender = (value: Dayjs) => {
    if (!etkinlikData || !eklendigimEtkinlikler) {
      return <ul style={{ padding: "0px 4px" }}></ul>;
    }

    const gununEtkinlikleri = etkinlikData.filter((etkinlik) =>
      dayjs(etkinlik.baslangicTarihi).isSame(value, "day")
    );

    const eklenenEtkinlikler = eklendigimEtkinlikler.filter((etkinlik) =>
      dayjs(etkinlik.baslangicTarihi).isSame(value, "day")
    );

    return (
      <ul style={{ padding: "0px 4px" }}>
        {gununEtkinlikleri.map((etkinlik) => (
          <li className="cell-style" key={etkinlik.id}>
            {etkinlik.baslik}
          </li>
        ))}
        {eklenenEtkinlikler.map((etkinlik) => (
          <li className="guest-cell-style" key={etkinlik.id}>
            {etkinlik.baslik}
          </li>
        ))}
      </ul>
    );
  };

  const tarihSec = (date: Dayjs) => {
    setSeciliGun(date);
    setAcilanEtkinlikPencereTarihi(date);
  };

  return (
    <div>
      <Calendar
        onSelect={tarihSec}
        cellRender={dateCellRender}
        value={seciliGun}
      />
      <ModalForm />
    </div>
  );
};

export default MyCalendar;
