import React, { useEffect, useState } from "react";
import { Button, Calendar } from "antd";
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
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import BilgiPenceresi from "./BilgiPenceresi";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Takvim: React.FC = () => {
  const [seciliGun, setSeciliGun] = useState(dayjs());
  const [etkinlikPenceresiniGoster, setEtkinlikPenceresiniGoster] =
    useState(false);
  const [etkinlikData, setEtkinlikData] = useState<Etkinlik[]>([]);
  const [eklendigimEtkinlikler, setEklendigimEtkinlikler] = useState<
    Etkinlik[]
  >([]);
  const [seciliEtkinlik, setseciliEtkinlik] = useState<Etkinlik | null>(null);
  const [acilanEtkinlikPencereTarihi, setAcilanEtkinlikPencereTarihi] =
    useState<Dayjs>(dayjs());
  const [tumKullanicilar, setTumKullanicilar] = useState<Kullanici[]>([]);
  const [bilgiPenceresiGorunurluk, setBilgiPenceresiGorunurluk] =
    useState(false);

  const etkinlikleriAl = async (): Promise<Etkinlik[]> => {
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
    etkinlikleriAl();
  }, [etkinlikPenceresiniGoster]);

  const etkinligiSeciliYap = (event: Etkinlik) => {
    setseciliEtkinlik(event);
    setBilgiPenceresiGorunurluk(false); // BilgiPenceresi'ni kapat
    setEtkinlikPenceresiniGoster(true); // EtkinlikPenceresi'ni aç
  };

  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const cellRender = (value: Dayjs) => {
    if (!etkinlikData || !eklendigimEtkinlikler) {
      return <ul style={{ padding: "0px 4px" }}></ul>;
    }

    const allEvents = [...etkinlikData, ...eklendigimEtkinlikler];

    const indexedEvents = allEvents.map((event) => {
      const overlappingEvents = allEvents.filter(
        (e) =>
          (dayjs(e.baslangicTarihi).isBefore(dayjs(event.bitisTarihi)) &&
            dayjs(e.bitisTarihi).isAfter(dayjs(event.baslangicTarihi))) ||
          (dayjs(e.baslangicTarihi).isSame(dayjs(event.baslangicTarihi)) &&
            dayjs(e.bitisTarihi).isSame(dayjs(event.bitisTarihi)))
      );
      console.log("overlappingEvents", overlappingEvents);
      const index = overlappingEvents.indexOf(event);
      return { ...event, index };
    });

    console.log('indexedEvents', indexedEvents)

    /* const relevantEvents = indexedEvents
      .filter((etkinlik) => etkinlikTekrarKontrolu(etkinlik, value))
      .map((event, index) => ({ ...event, index }))
      .sort((a, b) => dayjs(a.baslangicTarihi).diff(dayjs(b.baslangicTarihi))); */

      const relevantEvents = indexedEvents.filter((etkinlik) =>
        etkinlikTekrarKontrolu(etkinlik, value)
      );
  
      relevantEvents.sort((a, b) => a.index - b.index);

    const renderEventItem = (etkinlik: Etkinlik & { index: number }) => {
      const start = dayjs(etkinlik.baslangicTarihi);
      const end = dayjs(etkinlik.bitisTarihi);
      const isStart = value.isSame(start, "day");
      const isEnd = value.isSame(end, "day");

      let classes = "event-item";

      if (etkinlik.ekleyenKullaniciAdi) {
        classes += " guest";
      }
      if (isStart && isEnd) {
        classes += " start-end";
      } else if (isStart) {
        classes += " start";
      } else if (isEnd) {
        classes += " end";
      }

      return (
        <div
          key={etkinlik.id}
          className={`${classes} ${
            hoveredEventId === String(etkinlik.id) ? "active" : ""
          }`}
          style={{
            top: `${etkinlik.index * 25}px`,
            width: isEnd ? "calc(100% - 12px)" : "calc(100% - 4px)",
            left: "0",
            right: isEnd ? "0" : "0",
            position: "absolute",
          }}
          onMouseEnter={() => setHoveredEventId(String(etkinlik.id))}
          onMouseLeave={() => setHoveredEventId(null)}
          onClick={(e) => {
            e.stopPropagation();
            setseciliEtkinlik(etkinlik);
            tarihSec(value, true);
          }}
        >
          {isStart
            ? `${dayjs(etkinlik.baslangicTarihi).format("HH:mm")} - ${
                etkinlik.baslik
              }`
            : ""}
        </div>
      );
    };

    const maxIndex = Math.max(...relevantEvents.map((e) => e.index), 0);

    return (
      <div
    style={{
      position: "relative",
      height: `${(maxIndex + 1) * 30}px`, // Burada `${}` ile bir template literal kullanmalısınız
      overflow: "hidden",
      width: "100%",
      zIndex: 10,
    }}
  >
    {relevantEvents.map(renderEventItem)}
  </div>

    );
  };

  const etkinlikTekrarKontrolu = (etkinlik: Etkinlik, date: Dayjs) => {
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

  const tarihSec = (date: Dayjs, isEventClick: boolean = false) => {
    const gununEtkinlikleri = etkinlikData.filter((etkinlik) =>
      etkinlikTekrarKontrolu(etkinlik, date)
    );
    const eklenenEtkinlikler = eklendigimEtkinlikler.filter((etkinlik) =>
      etkinlikTekrarKontrolu(etkinlik, date)
    );
    setSeciliGun(date);

    if (isEventClick) {
      // Etkinliğe tıklandıysa sadece BilgiPenceresi'ni aç
      setBilgiPenceresiGorunurluk(true);
      setEtkinlikPenceresiniGoster(false);
    } else if (gununEtkinlikleri.length || eklenenEtkinlikler.length) {
      // Etkinlik olan bir günün boş alanına tıklandıysa EtkinlikPenceresi'ni aç
      setEtkinlikPenceresiniGoster(true);
      setBilgiPenceresiGorunurluk(false);
    } else {
      // Boş bir güne tıklandıysa EtkinlikPenceresi'ni aç
      setseciliEtkinlik(null);
      setAcilanEtkinlikPencereTarihi(date);
      setEtkinlikPenceresiniGoster(true);
      setBilgiPenceresiGorunurluk(false);
    }
  };

  return (
    <div>
      <UstMenu />
      <div className="hero">
        <YanMenu
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          setseciliEtkinlik={setseciliEtkinlik}
        />
        <div className="main">
          <div className="takvim-baslik-container">
            <div className="takvim-baslik">
              <Button
                onClick={() => {
                  /* önceki aya git */
                  if (seciliGun) {
                    const nextMonthDate = seciliGun.subtract(1, "month");
                    setSeciliGun(nextMonthDate);
                  }
                }}
                className="calendar-button"
              >
                <LeftOutlined />
              </Button>
              <Button
                onClick={() => {
                  /* bugüne git */
                  const now = dayjs();
                  setSeciliGun(now);
                }}
                className="calendar-button"
              >
                Bugün
              </Button>

              <Button
                onClick={() => {
                  /* sonraki aya git */
                  if (seciliGun) {
                    const nextMonthDate = seciliGun.add(1, "month");
                    setSeciliGun(nextMonthDate);
                  }
                }}
                className="calendar-button"
              >
                <RightOutlined />
              </Button>
              <h2 className="calendar-month">{seciliGun.format("MMM YYYY")}</h2>
            </div>
          </div>
          <Calendar
            onSelect={(date) => tarihSec(date, false)} // isEventClick parametresini false olarak gönder
            cellRender={cellRender}
            value={seciliGun}
          />
        </div>
        <EtkinlikPenceresi
          seciliGun={seciliGun}
          etkinlikPenceresiniGoster={etkinlikPenceresiniGoster}
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          etkinlikleriAl={etkinlikleriAl}
          acilanEtkinlikPencereTarihi={acilanEtkinlikPencereTarihi}
          tumKullanicilar={tumKullanicilar}
          seciliEtkinlikForm={seciliEtkinlik}
          setseciliEtkinlik={setseciliEtkinlik}
        />
        <BilgiPenceresi
          bilgiPenceresiGorunurluk={bilgiPenceresiGorunurluk}
          setBilgiPenceresiGorunurluk={setBilgiPenceresiGorunurluk}
          seciliEtkinlikForm={seciliEtkinlik}
          setseciliEtkinlik={setseciliEtkinlik}
          etkinligiSeciliYap={etkinligiSeciliYap} // Yeni prop olarak ekliyoruz
        />
        {/* {eklendigimEtkinlikler.length > 0 ? (
          <BilgiPenceresi eklendigimEtkinlikler={eklendigimEtkinlikler} />
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
};

export default Takvim;
