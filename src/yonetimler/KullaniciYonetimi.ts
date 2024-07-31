import axios from "axios";
import { message } from "antd";
import Etkinlik from "../tipler/Etkinlik";
import Kullanici from "../tipler/Kullanici";

const apiUrletkinligeKullaniciEkle =
  "http://localhost:5011/api/Etkinlik/EtkinligeKullaniciEkle";
const apiUrletkinliktenKullaniciSil =
  "http://localhost:5011/api/Etkinlik/EtkinliktenDavetliKullanicilariSil";
const apiUrlEklendigimEtkinlikler =
  "http://localhost:5011/api/Etkinlik/EklenilenEtkinlikleriGetir";
const apiUrlEtkinligeDavetliKullanicilariGetir =
  "http://localhost:5011/api/Etkinlik/EtkinligeDavetliKullanicilariGetir";
const apiUrlKullaniciEtkinligiGetir =
  "http://localhost:5011/api/Etkinlik/KullaniciEtkinligiGetir";
const apiUrlEtkinligeDavetliKullanicilariGuncelle =
  "http://localhost:5011/api/Etkinlik/EtkinligeDavetliKullanicilariGuncelle";

const apiUrlMevcutKullaniciGetir =
  "http://localhost:5011/api/Kullanici/MevcutKullaniciGetir";
const apiUrlTumKullanicilariGetir =
  "http://localhost:5011/api/Kullanici/TumKullanicilariGetir";

export interface EtkinligeKullaniciEkleRequest {
  etkinlikId: number;
  kullaniciIds: string[];
}

export interface EtkinliktenDavetliKullanicilariSilRequest {
  etkinlikId: number;
  kullaniciIds: string[];
}

export interface EtkinligeDavetliKullanicilariGuncelleRequest {
  etkinlikId: number;
  kullaniciIds: string[];
}

export const etkinligeKullaniciEkle = async (
  request: EtkinligeKullaniciEkleRequest
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token bulunamadı. Lütfen tekrar giriş yapın.");
    }

    const response = await axios.post(apiUrletkinligeKullaniciEkle, request, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      message.success("Kullanıcı ekleme işlemi başarıyla tamamlandı.");
    } else {
    }
  } catch (error) {
    /* console.error("Kullanıcı ekleme işlemi sırasında bir hata oluştu:", error); */
  }
};

export const etkinliktenKullaniciSil = async (
  request: EtkinliktenDavetliKullanicilariSilRequest
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token bulunamadı. Lütfen tekrar giriş yapın.");
    }

    await axios.delete(apiUrlEtkinligeDavetliKullanicilariGuncelle, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: request,
    });

    message.success("Kullanıcı silme işlemi başarıyla tamamlandı.");
  } catch (error) {
    /* console.error("Kullanıcı silme işlemi sırasında bir hata oluştu:", error); */
  }
};

export const etkinligeDavetliKullanicilariGuncelle = async (
  request: EtkinligeDavetliKullanicilariGuncelleRequest
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token bulunamadı. Lütfen tekrar giriş yapın.");
    }

    await axios.put(apiUrletkinliktenKullaniciSil, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: request,
    });

    message.success("Davetli kullanıcı güncelleme işlemi başarıyla tamamlandı.");
  } catch (error) {
    /* console.error("Kullanıcı silme işlemi sırasında bir hata oluştu:", error); */
  }
};

export const eklendigimEtkinlikleriGetir = async () => {
  try {
    const response = await axios.get(apiUrlEklendigimEtkinlikler, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const etkinligeDavetliKullanicilariGetir = async (id: Number): Promise<Kullanici[]> => {
  try {
    const response = await axios.get(
      `http://localhost:5011/api/Etkinlik/EtkinligeDavetliKullanicilariGetir?etkinlikId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      "Etkinlikleri alma işlemi sırasında bir hata oluştu: " + error
    );
  }
};

export const tumKullanicilariGetir = async () => {
  try {
    const response = await axios.get(`${apiUrlTumKullanicilariGetir}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {

  }
};

export const MevcutKullaniciGetir = async () => {
  try {
    const response = await axios.get(apiUrlMevcutKullaniciGetir, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    /* throw new Error(
      "Etkinlikleri alma işlemi sırasında bir hata oluştu: " + error
    ); */
  }
};

export const kullaniciEtkinligiGetir = async (id: Number) => {
  const response = await axios.get(`${apiUrlKullaniciEtkinligiGetir}?etkinlikId=${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
  return response.data as Etkinlik;
}