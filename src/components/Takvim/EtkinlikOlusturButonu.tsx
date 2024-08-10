import { FaRegCalendarPlus } from "react-icons/fa";
import "../../assets/css/EtkinlikOlusturButonu.css";
import Etkinlik from "../../tipler/Etkinlik";

interface EtkinlikOlusturButonuProps {
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  setseciliEtkinlik: React.Dispatch<React.SetStateAction<Etkinlik | null>>
}

const EtkinlikOlusturButonu = (props: EtkinlikOlusturButonuProps) => {
  const {
    setEtkinlikPenceresiniGoster,
    setseciliEtkinlik
  } = props;

  const etkinlikPenceresiniAc = () => {
    setseciliEtkinlik(null);
    setEtkinlikPenceresiniGoster(true);
  };

  return (
    <button
      onClick={() => {
        etkinlikPenceresiniAc();
      }}
      className="create-event-button"
    >
      <FaRegCalendarPlus className="button-img" />
      <span className="button-text">Etkinlik Oluştur</span>
    </button>
  );
}

export default EtkinlikOlusturButonu;