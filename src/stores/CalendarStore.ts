import axios from "axios";
import dayjs from "dayjs";
import EventAct from "../types/EventAct";

export const aylikEtkinlikleriGetir = async (seciliGun: dayjs.Dayjs) => {
  const response = await axios.get(
    `http://localhost:5011/api/Etkinlik/KullaniciAylikEtkinlikGetir?tarih=${seciliGun}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data as EventAct[];
};

export const tumEtkinlikleriGetir = async () => {
  const response = await axios.get(
    "http://localhost:5011/api/Etkinlik/KullaniciEtkinlikleriGetir",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data as EventAct[];
};
