import { TekrarEnum } from "../yonetimler/EtkinlikYonetimi";


interface Etkinlik {
  id?: string | undefined;
  date?: Date;

  baslik: string;
  aciklama: string;
  baslangicTarihi: Date;
  bitisTarihi: Date;
  tekrarDurumu?: TekrarEnum;

  ekleyenKullaniciId?: string;
  ekleyenKullaniciAdi?: string;
  isRecurring?: boolean;
}
export default Etkinlik;
