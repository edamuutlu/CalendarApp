import { FaRegCalendarPlus } from "react-icons/fa";
import "../../assets/css/EtkinlikOlusturButonu.css";

interface EtkinlikOlusturButonuProps {
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  setDahaOncePencereSecildiMi: React.Dispatch<React.SetStateAction<boolean>>;
}

const EtkinlikOlusturButonu = (props: EtkinlikOlusturButonuProps) => {
  const {
    setEtkinlikPenceresiniGoster,
    setDahaOncePencereSecildiMi
  } = props;

  const etkinlikPenceresiniAc = () => {
    setDahaOncePencereSecildiMi(true);
    setEtkinlikPenceresiniGoster(true);
  };

  return (
    <button
      onClick={() => etkinlikPenceresiniAc()}
      className="create-event-button"
    >
      <FaRegCalendarPlus className="button-img" />
      <span className="button-text">Etkinlik Oluştur</span>
    </button>
  );
}

export default EtkinlikOlusturButonu;