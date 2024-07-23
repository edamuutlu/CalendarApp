import { TekrarEnum } from "../stores/EventStore";


interface EventAct {
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
export default EventAct;
