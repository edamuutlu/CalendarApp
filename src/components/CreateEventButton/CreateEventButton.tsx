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

  const {
    etkinlikData,
    acilanEtkinlikPencereTarihi,
    setEtkinlikPenceresiniGoster,
    setDahaOncePencereSecilmediMi,
  } = context;

  /*  useEffect(() => {
    if (acilanEtkinlikPencereTarihi && ilkAcilisMi) {
      etkinlikPenceresiniAc();
    }
    setIlkAcilisMi(true);
  }, [acilanEtkinlikPencereTarihi]); */

  const etkinlikPenceresiniAc = () => {
    setDahaOncePencereSecilmediMi(true);
    setEtkinlikPenceresiniGoster(true);
  };

  return (
    <button
      onClick={() => etkinlikPenceresiniAc()}
      className="create-event-button"
    >
      <img src={plusImg} alt="create_event" className="button-img" />
      <span className="button-text">Etkinlik Oluştur</span>
    </button>
  );
}
