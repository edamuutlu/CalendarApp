import { useState } from "react";
import plusImg from "../../assets/images/plus.svg";
import "../../assets/css/EtkinlikOlusturButonu.css";
import Etkinlik from "../../tipler/Etkinlik";
import { Dayjs } from "dayjs";

interface EtkinlikOlusturButonuProps {
  etkinlikData: Etkinlik[];
  acilanEtkinlikPencereTarihi: Dayjs;
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  setDahaOncePencereSecilmediMi: React.Dispatch<React.SetStateAction<boolean>>;
}

const EtkinlikOlusturButonu: React.FC<EtkinlikOlusturButonuProps> = ({etkinlikData, acilanEtkinlikPencereTarihi, setEtkinlikPenceresiniGoster, setDahaOncePencereSecilmediMi}) => {

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

export default EtkinlikOlusturButonu;