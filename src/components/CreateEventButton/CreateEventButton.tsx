import { useContext, useEffect, useState } from "react";
import plusImg from "../../assets/plus.svg";
import "./CreateEventButton.css";
import { ContentContext } from "../../context/ContentProvider";
import dayjs from "dayjs";

export default function CreateEventButton() {
  const context = useContext(ContentContext);
  const [ilkAcilisMi, setIlkAcilisMi] = useState(false);

  if (!context) {
    throw new Error("CalendarContext must be used within a ContentProvider");
  }

  const { seciliGun, etkinlikData, acilanEtkinlikPencereTarihi, setBaslik, setAciklama, setBaslangicTarihi, setBitisTarihi, setEtkinlikPenceresiniGoster, setDahaOncePencereSecilmediMi} = context;

  useEffect(() => {
    if (acilanEtkinlikPencereTarihi && ilkAcilisMi) {
      etkinlikPenceresiniAc();
    }
    setIlkAcilisMi(true);
  }, [acilanEtkinlikPencereTarihi]);

  const etkinlikPenceresiniAc = () => {
    const gununEtkinlikleri = etkinlikData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(acilanEtkinlikPencereTarihi, "day")
    );

    if (gununEtkinlikleri.length > 0) {
      setDahaOncePencereSecilmediMi(false); /* update butonunun açılması için */
      setBaslik(gununEtkinlikleri[0].baslik);
      setAciklama(gununEtkinlikleri[0].aciklama);
      setBaslangicTarihi(DayjsCevir(gununEtkinlikleri[0].baslangicTarihi));
      setBitisTarihi(DayjsCevir(gununEtkinlikleri[0].bitisTarihi));
    } else {
      setBaslik("");
      setAciklama("");
      setBaslangicTarihi(seciliGun);
      setDahaOncePencereSecilmediMi(true);
    }

    setEtkinlikPenceresiniGoster(true); 
  };

  const DayjsCevir = (date: Date): dayjs.Dayjs => {
    return date ? dayjs(date) : dayjs();
  };


  return (
    <button onClick={() => etkinlikPenceresiniAc()} className="create-event-button">
      <img src={plusImg} alt="create_event" className="button-img" />
      <span className="button-text">Etkinlik Oluştur</span>
    </button>
  );
}
