import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

export const aylikEtkinlikleriGetir = async (selectedDay: dayjs.Dayjs) => {
  try {
    const response = await axios.get(
      `http://localhost:5011/api/Etkinlik/KullaniciAylikEtkinlikGetir?tarih=${selectedDay}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {}
};

export const tumEtkinlikleriGetir = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5011/api/Etkinlik/KullaniciEtkinlikleriGetir",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
  }
};
