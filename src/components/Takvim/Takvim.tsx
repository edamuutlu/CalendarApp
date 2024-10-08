import React, { useEffect, useRef, useState } from "react";
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
import {
  aylikEtkinlikleriGetir,
  tumEtkinlikleriGetir,
} from "../../yonetimler/TakvimYonetimi";
import EtkinlikPenceresi from "./EtkinlikPenceresi";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { TekrarEnum } from "../../yonetimler/EtkinlikYonetimi";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import BilgiPenceresi from "./BilgiPenceresi";
import Etkinlikler from "./Etkinlikler";
import { useOgeGenislik } from "../../assets/GenislikHesapla";
import YillikEtkinlikler from "./YillikEtkinlikler";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Takvim: React.FC = () => {
  const [seciliGun, setSeciliGun] = useState(dayjs());
  const [etkinlikPenceresiniGoster, setEtkinlikPenceresiniGoster] = useState(false);
  const [kayitliEtkinlikler, setKayitliEtkinlikler] = useState<Etkinlik[]>([]);
  const [aylikEtkinlikler, setAylikEtkinlikler] = useState<Etkinlik[]>([]);
  const [eklendigimEtkinlikler, setEklendigimEtkinlikler] = useState<Etkinlik[]>([]);
  const [seciliEtkinlik, setseciliEtkinlik] = useState<Etkinlik | null>(null);
  const [acilanEtkinlikPencereTarihi, setAcilanEtkinlikPencereTarihi] = useState<Dayjs>(dayjs());
  const [tumKullanicilar, setTumKullanicilar] = useState<Kullanici[]>([]);
  const [bilgiPenceresiGorunurluk, setBilgiPenceresiGorunurluk] = useState(false);
  const [takvimModu, setTakvimModu] = useState<"month" | "year">("month");

  const tumEtkinlikler = [...kayitliEtkinlikler, ...eklendigimEtkinlikler];

  const etkinlikleriAl = async (): Promise<Etkinlik[]> => {
    try {
      const kayitliEtkinlikler: Etkinlik[] = await tumEtkinlikleriGetir();
      const aylikEtkinlikler: Etkinlik[] = await aylikEtkinlikleriGetir(seciliGun);
      const eklendigimEtkinlikler: Etkinlik[] = await eklendigimEtkinlikleriGetir();
      setEklendigimEtkinlikler(eklendigimEtkinlikler);
      setAylikEtkinlikler(aylikEtkinlikler);
      setKayitliEtkinlikler(kayitliEtkinlikler);
      return kayitliEtkinlikler;
    } catch (error) {
      setKayitliEtkinlikler([]);
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
  }, []);

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
          date.year() >= startDate.year() &&
          date.month() >= startDate.month()
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
    const gununEtkinlikleri = aylikEtkinlikler.filter((etkinlik) =>
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

  const mainRef = useRef(null);
  const mainGenislik = useOgeGenislik(mainRef);
  const yanMenuGenislik = 256;
  const kalanGenislik = mainGenislik - yanMenuGenislik;

  return (
    <div ref={mainRef}>
      <UstMenu />
      <div className="hero">
        <YanMenu
          etkinlikPenceresiniGoster={etkinlikPenceresiniGoster}
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          setBilgiPenceresiGorunurluk={setBilgiPenceresiGorunurluk}
          setseciliEtkinlik={setseciliEtkinlik}
          seciliGun={seciliGun}
          takvimModu={takvimModu}
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
          {takvimModu === "month" ? (
            <Etkinlikler
              seciliGun={seciliGun}
              setSeciliGun={setSeciliGun}
              tumEtkinlikler={tumEtkinlikler}
              onEventClick={(etkinlik) => {
                setseciliEtkinlik(etkinlik);
                tarihSec(dayjs(etkinlik.baslangicTarihi), true);
              }}
              etkinlikTekrarKontrolu={etkinlikTekrarKontrolu}
              kalanGenislik={kalanGenislik}
            />
          ) : (
            <YillikEtkinlikler
              seciliYil={seciliGun}
              setSeciliGun={setSeciliGun}
              tumEtkinlikler={tumEtkinlikler}
              onEventClick={(etkinlik) => {
                setseciliEtkinlik(etkinlik);
                tarihSec(dayjs(etkinlik.baslangicTarihi), true);
              }}
              kalanGenislik={kalanGenislik}
            />
          )}

          <Calendar
            onSelect={(date) => tarihSec(date, false)}
            value={seciliGun}
            mode={takvimModu}
            onPanelChange={(_, mode) => setTakvimModu(mode)}
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
          etkinligiSeciliYap={(event: Etkinlik) => {
            setseciliEtkinlik(event);
            setBilgiPenceresiGorunurluk(false);
            setEtkinlikPenceresiniGoster(true);
          }}
        />
      </div>
    </div>
  );
};

export default Takvim;
