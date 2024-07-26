import React, { createContext, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  aylikEtkinlikleriGetir,
  tumEtkinlikleriGetir,
} from "../stores/CalendarStore";
import Etkinlik from "../types/Etkinlik";
import { eklendigimEtkinlikleriGetir } from "../stores/UserStore";
import Kullanici from "../types/Kullanici";

export interface ContentContextType {
  seciliGun: Dayjs;
  setSeciliGun: React.Dispatch<React.SetStateAction<Dayjs>>;
  etkinlikPenceresiniGoster: boolean;
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  dahaOncePencereSecilmediMi: boolean;
  setDahaOncePencereSecilmediMi: React.Dispatch<React.SetStateAction<boolean>>;
  acilanEtkinlikPencereTarihi: Dayjs;
  setAcilanEtkinlikPencereTarihi: React.Dispatch<React.SetStateAction<Dayjs>>;
  etkinlikData: Etkinlik[];
  setEtkinlikData: React.Dispatch<React.SetStateAction<Etkinlik[]>>;
  eklendigimEtkinlikler: Etkinlik[];
  etkinlikleriCek: () => Promise<Etkinlik[]>;
  tumKullanicilar: Kullanici[];
  setTumKullanicilar: React.Dispatch<React.SetStateAction<Kullanici[]>>;
}

export const ContentContext = createContext<ContentContextType | undefined>(
  undefined
);

const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [seciliGun, setSeciliGun] = useState(dayjs());
  const [etkinlikPenceresiniGoster, setEtkinlikPenceresiniGoster] = useState(false);
  const [dahaOncePencereSecilmediMi, setDahaOncePencereSecilmediMi] = useState(false);
  const [etkinlikData, setEtkinlikData] = useState<Etkinlik[]>([]);
  const [eklendigimEtkinlikler, setEklendigimEtkinlikler] = useState<Etkinlik[]>([]);
  const [acilanEtkinlikPencereTarihi, setAcilanEtkinlikPencereTarihi] = useState<Dayjs>(dayjs());
  const [tumKullanicilar, setTumKullanicilar] = useState<Kullanici[]>([]);

  const etkinlikleriCek = async (): Promise<Etkinlik[]> => {
    try {
      const kayitliEtkinlikler: Etkinlik[] = await tumEtkinlikleriGetir();
      const eklendigimEtkinlikler: Etkinlik[] = await eklendigimEtkinlikleriGetir();
      setEklendigimEtkinlikler(eklendigimEtkinlikler);
      setEtkinlikData(kayitliEtkinlikler);
      return kayitliEtkinlikler;
    } catch (error) {
      setEtkinlikData([]);
      console.error("Etkinlikler getirilirken hata oluştu:", error);
      return [];
    }
  };

  const contextValue = {
    seciliGun,
    setSeciliGun,
    etkinlikPenceresiniGoster,
    setEtkinlikPenceresiniGoster,
    dahaOncePencereSecilmediMi,
    setDahaOncePencereSecilmediMi,
    etkinlikData,
    eklendigimEtkinlikler,
    setEtkinlikData,
    acilanEtkinlikPencereTarihi,
    setAcilanEtkinlikPencereTarihi,
    etkinlikleriCek,
    tumKullanicilar,
    setTumKullanicilar,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;
