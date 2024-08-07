import React, { useEffect, useState } from "react";
import { Button, Calendar, Popover } from "antd";
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
import { MdDateRange, MdNotes, MdOutlineModeEditOutline } from "react-icons/md";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Takvim: React.FC = () => {
  const [seciliGun, setSeciliGun] = useState(dayjs());
  const [etkinlikPenceresiniGoster, setEtkinlikPenceresiniGoster] = useState(false);
  const [dahaOncePencereSecildiMi, setDahaOncePencereSecildiMi] = useState(false);
  const [etkinlikData, setEtkinlikData] = useState<Etkinlik[]>([]);
  const [eklendigimEtkinlikler, setEklendigimEtkinlikler] = useState<Etkinlik[]>([]);
  const [seciliEtkinlik, setseciliEtkinlik] = useState<Etkinlik | null>(null);
  const [acilanEtkinlikPencereTarihi, setAcilanEtkinlikPencereTarihi] = useState<Dayjs>(dayjs());
  const [tumKullanicilar, setTumKullanicilar] = useState<Kullanici[]>([]);
  const [acilanPopoverId, setAcilanPopoverId] = useState<number | null>(null);

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
  }, [seciliGun]);

  const etkinligiSeciliYap = (event: Etkinlik) => {
    setseciliEtkinlik(event);
    setEtkinlikPenceresiniGoster(true);
  };

  const popoverAc = (id: number) => {
    setAcilanPopoverId(id);
  };

  const popoverKapat = () => {
    setAcilanPopoverId(null);
  };

  const hucreyeVeriIsle = (value: Dayjs, info: any) => {
    if (!etkinlikData || !eklendigimEtkinlikler) {
      return <ul style={{ padding: "0px 4px" }}></ul>;
    }

    const gununEtkinlikleri = etkinlikData.filter((etkinlik) =>
      etkinlikTarihiKontrol(etkinlik, value)
    );
    const eklenenEtkinlikler = eklendigimEtkinlikler.filter((etkinlik) =>
      etkinlikTarihiKontrol(etkinlik, value)
    );

    const renderEventItem = (etkinlik: Etkinlik) => (
      <li key={etkinlik.id}>
        <Popover
          content={
            <div>
              <p className="popup-item">
                <MdOutlineModeEditOutline />
                <strong> Başlık:</strong> {etkinlik.baslik}
              </p>
              <p className="popup-item">
                <MdNotes />
                <strong> Açıklama:</strong> {etkinlik.aciklama}
              </p>
              <p className="popup-item">
                <MdDateRange /> <strong> Tarih:</strong>{" "}
                {dayjs(etkinlik.baslangicTarihi).format("YYYY/MM/DD HH:mm")} | {dayjs(etkinlik.bitisTarihi).format("YYYY/MM/DD HH:mm")}
              </p>
              {/* <p className="popup-item">
                <UserOutlined />
                <strong> Kullanıcı Adı:</strong> {etkinlik.ekleyenKullaniciAdi}
              </p> */}
              <Button onClick={() => etkinligiSeciliYap(etkinlik)}>
                Etkinliği Düzenle
              </Button>
            </div>
          }
          title="Event Details"
          trigger="click"
          open={acilanPopoverId === Number(seciliEtkinlik?.id)}
          onOpenChange={(open) => {
            if (open) {
              popoverAc(Number(seciliEtkinlik?.id));
            } else {
              popoverKapat();
            }
          }}
        >
          <Button className="cell-style">
            {dayjs(etkinlik.baslangicTarihi).format("HH:mm")} - {etkinlik.baslik}
          </Button>
        </Popover>
      </li>
    );

    return (
      <ul className="etkinlik-listesi">
        {gununEtkinlikleri.map((etkinlik) =>
          renderEventItem(etkinlik)
        )}
        {eklenenEtkinlikler.map((etkinlik) =>
          renderEventItem(etkinlik) /* guest için style vermelisin */
        )}
      </ul>
    );
  };

  const etkinlikTarihiKontrol = (etkinlik: Etkinlik, date: Dayjs) => {
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
    const gununEtkinlikleri = etkinlikData.filter((etkinlik) =>
      etkinlikTarihiKontrol(etkinlik, date)
    );
    const eklenenEtkinlikler = eklendigimEtkinlikler.filter((etkinlik) =>
      etkinlikTarihiKontrol(etkinlik, date)
    );
    setSeciliGun(date);
    if (gununEtkinlikleri.length || eklenenEtkinlikler.length) {
      const selectedEvent = gununEtkinlikleri.length ? gununEtkinlikleri[0] : (eklenenEtkinlikler.length ? eklenenEtkinlikler[0] : null);
      setseciliEtkinlik(selectedEvent);
    } else {
      setAcilanEtkinlikPencereTarihi(date);
      setEtkinlikPenceresiniGoster(true); // Open the event window
    }
  };

  return (
    <div>
      <UstMenu />
      <div className="hero">
        <YanMenu
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          setDahaOncePencereSecildiMi={setDahaOncePencereSecildiMi}
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
            onSelect={tarihSec}
            cellRender={hucreyeVeriIsle}
            value={seciliGun}
          />
        </div>
        <EtkinlikPenceresi
          seciliGun={seciliGun}
          etkinlikPenceresiniGoster={etkinlikPenceresiniGoster}
          setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
          etkinlikleriAl={etkinlikleriAl}
          acilanEtkinlikPencereTarihi={acilanEtkinlikPencereTarihi}
          setDahaOncePencereSecildiMi={setDahaOncePencereSecildiMi}
          tumKullanicilar={tumKullanicilar}
          seciliEtkinlikForm={seciliEtkinlik}
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
