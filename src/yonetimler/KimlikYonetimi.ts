import axios from "axios";

export interface User {
  KullaniciAdi: string;
  Isim: string;
  Soyisim: string;
  KullaniciSifresi: string;
  KullaniciSifresiTekrar: string;
}

export const girisYap = async (username: string, password: string) => {

  try {
    const response = await axios.post(
      "http://localhost:5011/api/OturumYonetimi/GirisYap",
      { KullaniciAdi: username, KullaniciSifresi: password }
    );
    console.log(response.data);
    const accessToken = response.data.accessToken;
    localStorage.setItem("token", accessToken);
    return accessToken;
  } catch (error) {
    console.log('error', error)
  }
};

export const kayitOl  = async (FormData: User) => {
  try {
    const response = await axios.post(
      "http://localhost:5011/api/OturumYonetimi/KayitOl",
      FormData
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
