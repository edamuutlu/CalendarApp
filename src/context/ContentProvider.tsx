import React, { createContext, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  aylikEtkinlikleriGetir,
  tumEtkinlikleriGetir,
} from "../stores/CalendarStore";
import EventAct from "../types/EventAct";

export interface ContentContextType {
  seciliGun: Dayjs;
  setSeciliGun: React.Dispatch<React.SetStateAction<Dayjs>>;
  etkinlikPenceresiniGoster: boolean;
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  dahaOncePencereSecilmediMi: boolean;
  setDahaOncePencereSecilmediMi: React.Dispatch<React.SetStateAction<boolean>>;
  baslik: string;
  setBaslik: React.Dispatch<React.SetStateAction<string>>;
  aciklama: string;
  setAciklama: React.Dispatch<React.SetStateAction<string>>;
  baslangicTarihi: Dayjs;
  setBaslangicTarihi: React.Dispatch<React.SetStateAction<Dayjs>>;
  bitisTarihi: Dayjs;
  setBitisTarihi: React.Dispatch<React.SetStateAction<Dayjs>>;
  tekrarTipi: number;
  setTekrarTipi: React.Dispatch<React.SetStateAction<number>>;
  etkinlikData: EventAct[];
  modalDay: Dayjs;
  setModalDay: React.Dispatch<React.SetStateAction<Dayjs>>;
  setEtkinlikData: React.Dispatch<React.SetStateAction<EventAct[]>>;
  handleSelect: (date: Dayjs) => void;
  etkinlikPencereKapat: () => void;
  fetchEvents: () => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(
  undefined
);

const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [seciliGun, setSeciliGun] = useState(dayjs());
  const [etkinlikPenceresiniGoster, setEtkinlikPenceresiniGoster] = useState(false);
  const [dahaOncePencereSecilmediMi, setDahaOncePencereSecilmediMi] = useState(false);
  const [baslik, setBaslik] = useState("");
  const [baslangicTarihi, setBaslangicTarihi] = useState<Dayjs>(dayjs());
  const [bitisTarihi, setBitisTarihi] = useState<Dayjs>(dayjs());
  const [aciklama, setAciklama] = useState(""); 
  const [tekrarTipi, setTekrarTipi] = useState<number>(0);
  const [etkinlikData, setEtkinlikData] = useState<EventAct[]>([]);
  const [modalDay, setModalDay] = useState<Dayjs>(dayjs());

  // Load event data from API when the component mounts
  const fetchEvents = async () => {
    try {
      const savedEvents = await tumEtkinlikleriGetir();
      setEtkinlikData(savedEvents);
    } catch (error) {
      setEtkinlikData([]);
      console.error("Etkinlikler getirilirken hata oluştu:", error);
    }
  };

  const handleSelect = (date: Dayjs) => {
    setSeciliGun(date);
    setModalDay(date);
  };

  const etkinlikPencereKapat = () => {
    setBaslik("");
    setAciklama("");
    setBaslangicTarihi(dayjs());
    setBitisTarihi(dayjs());
    setEtkinlikPenceresiniGoster(false);
  };


  const contextValue = {
    seciliGun,
    setSeciliGun,
    etkinlikPenceresiniGoster,
    setEtkinlikPenceresiniGoster,
    dahaOncePencereSecilmediMi,
    setDahaOncePencereSecilmediMi,
    baslik,
    setBaslik,
    aciklama,
    setAciklama,
    baslangicTarihi,
    setBaslangicTarihi,
    bitisTarihi,
    setBitisTarihi,
    tekrarTipi,
    setTekrarTipi,
    etkinlikData,
    setEtkinlikData,
    modalDay,
    setModalDay,
    handleSelect,
    etkinlikPencereKapat,
    fetchEvents,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;
