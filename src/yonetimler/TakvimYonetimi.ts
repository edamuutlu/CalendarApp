import axios from "axios";
import dayjs from "dayjs";
import Etkinlik from "../tipler/Etkinlik";

export const aylikEtkinlikleriGetir = async (varsayilanGun: dayjs.Dayjs) => {
  const response = await axios.get(
    `http://localhost:5011/api/Etkinlik/KullaniciAylikEtkinlikGetir?tarih=${varsayilanGun}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data as Etkinlik[];
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
  return response.data as Etkinlik[];
};
