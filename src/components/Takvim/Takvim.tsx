import React, { useEffect, useState } from "react";
import { Button, Calendar, Typography } from "antd";
import "../../assets/css/Takvim.css";
import dayjs, { Dayjs } from "dayjs";
import {
  eklendigimEtkinlikleriGetir,
  tumKullanicilariGetir,
} from "../../yonetimler/KullaniciYonetimi";
import UstMenu from "../UstMenu/UstMenu";
import YanMenu from "./YanMenu";
import Etkinlik from "../../tipler/Etkinlik";
import Kullanici from "../../tipler/Kullanici";
import { tumEtkinlikleriGetir } from "../../yonetimler/TakvimYonetimi";
import EtkinlikPenceresi from "./EtkinlikPenceresi";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { TekrarEnum } from "../../yonetimler/EtkinlikYonetimi";
import BilgiPenceresi from "./BilgiPenceresi";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Takvim: React.FC = () => {
  const [varsayilanGun, setVarsayilanGun] = useState(dayjs());
  const [etkinlikPenceresiniGoster, setEtkinlikPenceresiniGoster] = useState(false);
  const [dahaOncePencereSecildiMi, setDahaOncePencereSecildiMi] = useState(false);
  const [etkinlikData, setEtkinlikData] = useState<Etkinlik[]>([]);
  const [eklendigimEtkinlikler, setEklendigimEtkinlikler] = useState<Etkinlik[]>([]);
  const [acilanEtkinlikPencereTarihi, setAcilanEtkinlikPencereTarihi] = useState<Dayjs>(dayjs());
  const [tumKullanicilar, setTumKullanicilar] = useState<Kullanici[]>([]);

  const etkinlikleriAl = async (): Promise<Etkinlik[]> => {
    try {
      const kayitliEtkinlikler: Etkinlik[] = await tumEtkinlikleriGetir();
      const eklendigimEtkinlikler: Etkinlik[] = await eklendigimEtkinlikleriGetir();
      setEklendigimEtkinlikler(eklendigimEtkinlikler);
      setEtkinlikData(kayitliEtkinlikler);
      return kayitliEtkinlikler;
    } catch (error) {
      setEtkinlikData([]);
      console.error("Etkinlikler getirilirken hata oluştu:", error);
      return [];
    }
  };

  useEffect(() => {
    const kullanicilariCek = async () => {
      const kullanicilar = await tumKullanicilariGetir();
      setTumKullanicilar(kullanicilar);
    };

    kullanicilariCek();
    etkinlikleriAl();
    console.log("eklendigimEtkinlikler", eklendigimEtkinlikler);
  }, [varsayilanGun]);

  const dateCellRender = (value: Dayjs, info: any) => {
    if (!etkinlikData || !eklendigimEtkinlikler) {
      return <ul style={{ padding: "0px 4px" }}></ul>;
    }

    const gununEtkinlikleri = etkinlikData.filter((etkinlik) =>
      isEtkinlikOnDate(etkinlik, value)
    );
    const eklenenEtkinlikler = eklendigimEtkinlikler.filter((etkinlik) =>
      isEtkinlikOnDate(etkinlik, value)
    );

    return (
      <ul className="etkinlik-listesi">
        {gununEtkinlikleri.map((etkinlik) => (
          <li className="cell-style" key={etkinlik.id}>
            {dayjs(etkinlik.baslangicTarihi).format("HH:mm")} -{" "}
            {etkinlik.baslik}
          </li>
        ))}
        {eklenenEtkinlikler.map((etkinlik) => (
          <li className="guest-cell-style" key={etkinlik.id}>
            {dayjs(etkinlik.baslangicTarihi).format("HH:mm")} -{" "}
            {etkinlik.baslik}
          </li>
        ))}
      </ul>
    );
  };

  const isEtkinlikOnDate = (etkinlik: Etkinlik, date: Dayjs) => {
    const { baslangicTarihi, bitisTarihi, tekrarDurumu } = etkinlik;
    const startDate = dayjs(baslangicTarihi);
    const endDate = dayjs(bitisTarihi);

    switch (tekrarDurumu) {
      case TekrarEnum.hic:
        return date.isBetween(startDate, endDate, "day", "[]");
      case TekrarEnum.herGun:
        return date.isSameOrAfter(startDate, "day");
      case TekrarEnum.herHafta:
        return (
          date.isSameOrAfter(startDate, "day") &&
          date.day() >= startDate.day() &&
          date.day() <= endDate.day() &&
          date.diff(startDate, "week") >= 0
        );
      case TekrarEnum.herAy:
        return (
          date.isSameOrAfter(startDate, "day") &&
          date.date() >= startDate.date() &&
          date.date() <= endDate.date() &&
          date.diff(startDate, "month") >= 0
        );
      case TekrarEnum.herYil:
        return (
          date.isSameOrAfter(startDate, "day") &&
          date.month() >= startDate.month() &&
          date.month() <= endDate.month() &&
          date.date() >= startDate.date() &&
          date.date() <= endDate.date() &&
          date.diff(startDate, "year") >= 0
        );

      default:
        return false;
    }
  };

  const tarihSec = (date: Dayjs) => {
    setVarsayilanGun(date);
    setAcilanEtkinlikPencereTarihi(date);
  };

  const renderDateCell = (value: Dayjs, info: any) => {
    return dateCellRender(value, info);
  };

  const bugunuGetir = () => {
    const now = dayjs();
    setVarsayilanGun(now);
  };

  const sonrakiAyaGec = () => {
    if (varsayilanGun) {
      const nextMonthDate = varsayilanGun.add(1, "month");
      setVarsayilanGun(nextMonthDate);
    }
  };

  const oncekiAyaGec = () => {
    if (varsayilanGun) {
      const nextMonthDate = varsayilanGun.subtract(1, "month");
      setVarsayilanGun(nextMonthDate);
    }
  };


  const üstMenuRender = () => {
    return (
      <div>
        <button onClick={oncekiAyaGec} className="calendar-button">
          <LeftOutlined />
        </button>
        <button onClick={bugunuGetir} className="calendar-button">
          Bugün
        </button>
        <button onClick={sonrakiAyaGec} className="calendar-button">
          <RightOutlined />
        </button>
        <h2 className="calendar-month">{varsayilanGun.format("MMM YYYY")}</h2>
      </div>
    );
  };

  return (
    <div>
      <UstMenu varsayilanGun={varsayilanGun} setVarsayilanGun={setVarsayilanGun} />
      <div className="hero">
        <YanMenu
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          setDahaOncePencereSecildiMi={setDahaOncePencereSecildiMi}
        />
         <div className="takvim-baslik">
          <Button onClick={oncekiAyaGec} className="calendar-button">
            <LeftOutlined />
          </Button>
          <Button onClick={bugunuGetir} className="calendar-button">
            Bugün
          </Button>
          <Button onClick={sonrakiAyaGec} className="calendar-button">
            <RightOutlined />
          </Button>
          <Typography.Title level={4} className="calendar-month">
            {varsayilanGun.format("MMM YYYY")}
          </Typography.Title>
        </div>
        <Calendar
          onSelect={tarihSec}
          cellRender={(date, info) => renderDateCell(date, info)}
          value={varsayilanGun}
        />
        <EtkinlikPenceresi
          varsayilanGun={varsayilanGun}
          etkinlikPenceresiniGoster={etkinlikPenceresiniGoster}
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          etkinlikleriAl={etkinlikleriAl}
          dahaOncePencereSecildiMi={dahaOncePencereSecildiMi}
          acilanEtkinlikPencereTarihi={acilanEtkinlikPencereTarihi}
          setDahaOncePencereSecildiMi={setDahaOncePencereSecildiMi}
          tumKullanicilar={tumKullanicilar}
        />
        {eklendigimEtkinlikler.length > 0 ? (
          <BilgiPenceresi eklendigimEtkinlikler={eklendigimEtkinlikler} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Takvim;
