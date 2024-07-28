import React, { useEffect, useState } from "react";
import { Calendar } from "antd";
import "../../assets/css/Takvim.css";
import dayjs, { Dayjs } from "dayjs";
import {
  eklendigimEtkinlikleriGetir,
  tumKullanicilariGetir,
} from "../../yonetimler/KullaniciYonetimi";
import UstMenu from "./UstMenu";
import YanMenu from "./YanMenu";
import Etkinlik from "../../types/Etkinlik";
import Kullanici from "../../types/Kullanici";
import { tumEtkinlikleriGetir } from "../../yonetimler/TakvimYonetimi";
import EtkinlikPenceresi from "./EtkinlikPenceresi";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { TekrarEnum } from "../../yonetimler/EtkinlikYonetimi";
import BilgiPenceresi from "./BilgiPenceresi";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Takvim: React.FC = () => {
  const [seciliGun, setSeciliGun] = useState(dayjs());
  const [etkinlikPenceresiniGoster, setEtkinlikPenceresiniGoster] =
    useState(false);
  const [dahaOncePencereSecilmediMi, setDahaOncePencereSecilmediMi] =
    useState(false);
  const [etkinlikData, setEtkinlikData] = useState<Etkinlik[]>([]);
  const [eklendigimEtkinlikler, setEklendigimEtkinlikler] = useState<
    Etkinlik[]
  >([]);
  const [acilanEtkinlikPencereTarihi, setAcilanEtkinlikPencereTarihi] =
    useState<Dayjs>(dayjs());
  const [tumKullanicilar, setTumKullanicilar] = useState<Kullanici[]>([]);

  const etkinlikleriCek = async (): Promise<Etkinlik[]> => {
    try {
      const kayitliEtkinlikler: Etkinlik[] = await tumEtkinlikleriGetir();
      const eklendigimEtkinlikler: Etkinlik[] =
        await eklendigimEtkinlikleriGetir();
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
    etkinlikleriCek();
    console.log("eklendigimEtkinlikler", eklendigimEtkinlikler);
  }, [seciliGun]);

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
    setSeciliGun(date);
    setAcilanEtkinlikPencereTarihi(date);
  };

  const renderDateCell = (value: Dayjs, info: any) => {
    return dateCellRender(value, info);
  };

  return (
    <div>
      <UstMenu seciliGun={seciliGun} setSeciliGun={setSeciliGun} />
      <div className="hero">
        <YanMenu
          etkinlikData={etkinlikData}
          acilanEtkinlikPencereTarihi={acilanEtkinlikPencereTarihi}
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          setDahaOncePencereSecilmediMi={setDahaOncePencereSecilmediMi}
        />
        <Calendar
          onSelect={tarihSec}
          cellRender={(date, info) => renderDateCell(date, info)}
          value={seciliGun}
        />
        <EtkinlikPenceresi
          seciliGun={seciliGun}
          etkinlikPenceresiniGoster={etkinlikPenceresiniGoster}
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          etkinlikleriCek={etkinlikleriCek}
          dahaOncePencereSecilmediMi={dahaOncePencereSecilmediMi}
          etkinlikData={etkinlikData}
          acilanEtkinlikPencereTarihi={acilanEtkinlikPencereTarihi}
          setDahaOncePencereSecilmediMi={setDahaOncePencereSecilmediMi}
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
