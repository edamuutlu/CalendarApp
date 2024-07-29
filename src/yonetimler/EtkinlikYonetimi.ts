import { message } from "antd";
import axios from "axios";
import Etkinlik from "../tipler/Etkinlik";

export enum TekrarEnum {
  hic = 0,
  herGun = 1,
  herHafta = 2,
  herAy = 3,
  herYil = 4,
}

export const etkinlikEkle = async (event: Etkinlik) => {
    try {
      await axios.post(
        "http://localhost:5011/api/Etkinlik/EtkinlikOlustur",
        event,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Etkinlik başarıyla eklendi.");
    } catch (error) {
      /* message.error("Aynı tarih ve saat aralığında etkinlik eklenemez.");
      console.log("error", error); */
    }
  };

export const etkinlikGuncelle = async (event: Etkinlik) => {
    try {
      await axios.put(
        "http://localhost:5011/api/Etkinlik/EtkinlikGuncelle",
        event,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Etkinlik başarıyla güncellendi.");
    } catch (error) {
      /* message.error("Güncelleme işlemi sırasında bir hata oluştu:");
      console.error("Güncelleme sırasında bir hata oluştu:", error); */
    }
  };

export const etkinlikSil = async (eventId: number) => {
    try {
      await axios.delete(
        `http://localhost:5011/api/Etkinlik/EtkinlikSil?EtkinlikId=${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Etkinlik başarıyla silindi.");
    } catch (error) {
     /*  message.error("Silme işlemi sırasında bir hata oluştu:");
      console.error("Silme işlemi sırasında bir hata oluştu:", error); */
    }
  };

