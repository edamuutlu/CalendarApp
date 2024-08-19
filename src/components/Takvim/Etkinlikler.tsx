import React, { Dispatch, SetStateAction, useState } from "react";
import Etkinlik from "../../tipler/Etkinlik";
import dayjs from "dayjs";
import { Modal } from "antd";

interface EtkinliklerProps {
  seciliGun: dayjs.Dayjs;
  setSeciliGun: Dispatch<SetStateAction<dayjs.Dayjs>>;
  tumEtkinlikler: Etkinlik[];
  onEventClick: (event: Etkinlik) => void;
}

type DayName = "Pts" | "Sal" | "Çar" | "Per" | "Cum" | "Cts" | "Paz";

// Haftanın günlerini sayılarla eşleştiren sabit
const DAY_OFFSET = {
  Pts: 0,
  Sal: 1,
  Çar: 2,
  Per: 3,
  Cum: 4,
  Cts: 5,
  Paz: 6,
};

const Etkinlikler: React.FC<EtkinliklerProps> = ({
  seciliGun,
  setSeciliGun,
  tumEtkinlikler,
  onEventClick,
}) => {
  // Hover edilen etkinliğin ID'sini tutan state
  const [hoveredEtkinlikId, setHoveredEtkinlikId] = useState<string | null>(
    null
  );
  const [dahaFazlaPenceresiniAc, setDahaFazlaPenceresiniAc] = useState(false);

  // Seçili günün hangi ayda olduğunu bulan değişken
  const seciliGunAy = seciliGun.format("MMM");

  const oncekiAySonGun = dayjs(seciliGun)
    .subtract(1, "month")
    .endOf("month")
    .add(1, "day")
    .format("ddd");

  // Ay görünümünde önceki aydan gelen günlerin sayısını hesaplar
  const oncekiAydanGelenGunSayisi = () =>
    DAY_OFFSET[oncekiAySonGun as DayName] || 1;

  // Etkinlikleri belirli bir aya göre filtreleyip, tarih sırasına göre sıralar
  const ayinEtkinlikleri = tumEtkinlikler
    .filter(
      (etkinlik) =>
        dayjs(etkinlik.baslangicTarihi).format("MMM") === seciliGunAy
    )
    .sort((a, b) => dayjs(a.baslangicTarihi).diff(dayjs(b.baslangicTarihi)));

  // Her etkinlik için çakışan diğer etkinlikleri bulur ve etkinliği bu listeye göre sıralar
  const indeksliEtkinlikler = ayinEtkinlikleri.reduce((acc, event) => {
    const cakisanEtkinlikler = acc.filter(
      (e) =>
        dayjs(e.baslangicTarihi).isSame(dayjs(event.baslangicTarihi), "day") ||
        dayjs(e.bitisTarihi).isSame(dayjs(event.bitisTarihi), "day") ||
        (dayjs(e.baslangicTarihi).isBefore(dayjs(event.bitisTarihi), "day") &&
          dayjs(e.bitisTarihi).isAfter(dayjs(event.baslangicTarihi), "day"))
    );

    const kullanilmisIndeksler = new Set(
      cakisanEtkinlikler.map((e) => e.index)
    );
    let index = 0;
    while (kullanilmisIndeksler.has(index)) {
      index++;
    }

    acc.push({ ...event, index });
    return acc;
  }, [] as (Etkinlik & { index: number })[]);

  // Bir tarihin hangi haftanın hangi gününe denk geldiğini hesaplar
  const solUzunluk = (date: dayjs.Dayjs) =>
    DAY_OFFSET[date.format("ddd") as DayName] || 0;

  // Bir tarihin hangi hafta sırasında olduğunu hesaplar
  const ustUzunluk = (date: dayjs.Dayjs) => {
    const ayinIlkHaftadakiGunSayisi = 7 - oncekiAydanGelenGunSayisi();
    const etkinlikBaslangicGunSayisi = date.date();

    // Etkinliğin hangi hafta sırasına denk geldiğini belirler
    if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi) return 1;
    if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi + 7) return 2;
    if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi + 14) return 3;
    if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi + 21) return 4;
    if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi + 28) return 5;
    return 6;
  };

  // İki tarih arasından en küçük olanı döndürür
  const minDate = (date1: dayjs.Dayjs, date2: dayjs.Dayjs) => {
    return date1.isBefore(date2) ? date1 : date2;
  };

  // Etkinlikleri parçalara ayırarak, haftalara bölünmüş bir şekilde döndürür
  const etkinlikParcalari = indeksliEtkinlikler.flatMap((etkinlik) => {
    const baslangic = dayjs(etkinlik.baslangicTarihi);
    const bitis = dayjs(etkinlik.bitisTarihi);
    const parcalar = [];

    let guncelBaslangic = baslangic;
    // Etkinliği haftalara böler ve her parçayı listeye ekler
    while (
      guncelBaslangic.isBefore(bitis) ||
      guncelBaslangic.isSame(bitis, "day")
    ) {
      const haftaninSonGunu = guncelBaslangic.endOf("week");
      const parceEnd = minDate(haftaninSonGunu, bitis);

      parcalar.push({
        ...etkinlik,
        etkinlikParcaBaslangic: guncelBaslangic,
        etkinlikParcaBitis: parceEnd,
      });

      // Bir sonraki haftaya geçer
      guncelBaslangic = haftaninSonGunu.add(1, "day");
    }

    return parcalar;
  });

  const DahaFazlaEtkinlikPenceresi = () => {
    if (!seciliGun) return null;

    const gunEtkinlikleri = indeksliEtkinlikler.filter((etkinlik) =>
      dayjs(seciliGun).isBetween(
        etkinlik.baslangicTarihi,
        etkinlik.bitisTarihi,
        "day",
        "[]"
      )
    );

    return (
      <Modal
        open={dahaFazlaPenceresiniAc}
        onCancel={() => setDahaFazlaPenceresiniAc(false)}
        footer={null}
      >
        <h2>{seciliGun.format("DD MMMM YYYY")} Etkinlikleri</h2>
        {gunEtkinlikleri.map((event) => (
          <div
            className="daha-fazla-etkinlik"
            onClick={() => {
              onEventClick(event);
              setDahaFazlaPenceresiniAc(false);
            }}
            key={event.id}
          >
            {dayjs(event.baslangicTarihi).format("HH:mm")} - {event.baslik}
          </div>
        ))}
      </Modal>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%", zIndex: 10 }}>
      {etkinlikParcalari.map((parca, index) => {
        const etkinlikSayisiHesapla = (date: dayjs.Dayjs) => {
          return indeksliEtkinlikler.filter((etkinlik) =>
            dayjs(date).isBetween(
              etkinlik.baslangicTarihi,
              etkinlik.bitisTarihi,
              "day",
              "[]"
            )
          ).length;
        };
        const start = parca.etkinlikParcaBaslangic;
        const end = parca.etkinlikParcaBitis;
        const gunFarki =
          parseInt(end.format("D")) - parseInt(start.format("D")) + 1; // etkinlik butonunun genişliği için
        /* console.log(`${start} - ${end} - ${gunFarki}`); */
        let classes = "event-item";
        if (parca.ekleyenKullaniciAdi) classes += " guest";
        return (
          <>
            {parca.index < 2 && (
              <div
                key={`${parca.id}-${index}`}
                className={`${classes} ${
                  hoveredEtkinlikId === String(parca.id) ? "active" : ""
                }`}
                style={{
                  width: `${gunFarki * 200 + (gunFarki - 1) * 32}px`,
                  left: `calc(${(1630 / 7) * solUzunluk(start) + 5}px)`,
                  top: `${
                    ustUzunluk(start) * 118 + (parca.index as number) * 25
                  }px`,
                  height: "auto",
                }}
                onMouseEnter={() => setHoveredEtkinlikId(String(parca.id))}
                onMouseLeave={() => setHoveredEtkinlikId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(parca);
                }}
              >
                {start.format("HH:mm")} - {parca.baslik}
              </div>
            )}
            {etkinlikSayisiHesapla(dayjs(parca.baslangicTarihi)) > 2 && (
              <div
                className="daha-fazla-goster"
                style={{
                  position: "absolute",
                  left: `calc(${
                    (1630 / 7) * solUzunluk(dayjs(parca.baslangicTarihi)) + 5
                  }px)`,
                  top: `${
                    ustUzunluk(dayjs(parca.baslangicTarihi)) * 118 + 50
                  }px`,
                  zIndex: 50,
                }}
                onClick={() => {
                  setSeciliGun(dayjs(dayjs(parca.baslangicTarihi)));
                  setDahaFazlaPenceresiniAc(true);
                }}
              >
                Daha fazla göster (
                {etkinlikSayisiHesapla(dayjs(parca.baslangicTarihi)) - 2})
              </div>
            )}
          </>
        );
      })}
      {dahaFazlaPenceresiniAc && DahaFazlaEtkinlikPenceresi()}
    </div>
  );
};

export default Etkinlikler;
