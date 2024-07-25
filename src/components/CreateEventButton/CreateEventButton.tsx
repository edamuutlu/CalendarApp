import React, { useContext, useEffect, useState } from "react";
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

  const { seciliGun, etkinlikData, acilanEtkinlikPencereTarihi, setBaslik, setAciklama, setBaslangicTarihi, setBitisTarihi, setEtkinlikPenceresiniGoster, dahaOncePencereSecilmediMi, setDahaOncePencereSecilmediMi} = context;

  useEffect(() => {
    if (acilanEtkinlikPencereTarihi && ilkAcilisMi) {
      openModal();
    }
    setIlkAcilisMi(true);
  }, [acilanEtkinlikPencereTarihi]);

  const openModal = () => {
    const dayEvents = etkinlikData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(acilanEtkinlikPencereTarihi, "day")
    );

    if (dayEvents.length > 0) {
      setDahaOncePencereSecilmediMi(false); /* update butonunun açılması için */
      setBaslik(dayEvents[0].baslik);
      setAciklama(dayEvents[0].aciklama);
      setBaslangicTarihi(DayjsCevir(dayEvents[0].baslangicTarihi));
      setBitisTarihi(DayjsCevir(dayEvents[0].bitisTarihi));
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
    <button onClick={() => openModal()} className="create-event-button">
      <img src={plusImg} alt="create_event" className="button-img" />
      <span className="button-text">Create Event</span>
    </button>
  );
}
