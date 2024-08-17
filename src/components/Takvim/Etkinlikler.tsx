import React, { useState } from "react";
import Etkinlik from "../../tipler/Etkinlik";
import dayjs from "dayjs";

interface EtkinliklerProps {
  ay: string;
  oncekiAySonGun: string;
  tumEtkinlikler: Etkinlik[];
  onEventClick: (event: Etkinlik) => void;
  etkinlikTekrarKontrolu: (etkinlik: Etkinlik, date: dayjs.Dayjs) => boolean;
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
  tumEtkinlikler,
  ay,
  oncekiAySonGun,
  onEventClick,
  etkinlikTekrarKontrolu,
}) => {
  // Hover edilen etkinliğin ID'sini tutan state
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Ayın ilk gününün hangi güne denk geldiğini hesaplar
  const ayinIlkGunleri = () => DAY_OFFSET[oncekiAySonGun as DayName] || 1;

  // Etkinlikleri belirli bir aya göre filtreleyip, tarih sırasına göre sıralar
  const filteredEtkinlikler = tumEtkinlikler
    .filter((etkinlik) => dayjs(etkinlik.baslangicTarihi).format("MMM") === ay)
    .sort((a, b) => dayjs(a.baslangicTarihi).diff(dayjs(b.baslangicTarihi)));

  // Her etkinlik için çakışan diğer etkinlikleri bulur ve etkinliği bu listeye göre sıralar
  const indeksliEtkinlikler = filteredEtkinlikler.reduce((acc, event) => {
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
    const ayinIlkHaftadakiGunSayisi = 7 - ayinIlkGunleri();
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
    const start = dayjs(etkinlik.baslangicTarihi);
    const end = dayjs(etkinlik.bitisTarihi);
    const parcalar = [];

    let currentStart = start;
    // Etkinliği haftalara böler ve her parçayı listeye ekler
    while (currentStart.isBefore(end) || currentStart.isSame(end, "day")) {
      const weekEnd = currentStart.endOf("week");
      const parceEnd = minDate(weekEnd, end);

      parcalar.push({
        ...etkinlik,
        parceStart: currentStart,
        parceEnd: parceEnd,
      });

      // Bir sonraki haftaya geçer
      currentStart = weekEnd.add(1, "day");
    }

    return parcalar;
  });

  return (
    <div style={{ position: "relative", width: "100%", zIndex: 10 }}>
      {etkinlikParcalari.map((parca, index) => {
        const start = parca.parceStart;
        const end = parca.parceEnd;
        const gunFarki = end.diff(start, "day") + 1;
        const topOffset =
          ustUzunluk(start) * 118 + (parca.index as number) * 25;
        /*         console.log(`${start} - ${end} - ${gunFarki}`);*/
        let classes = "event-item";
        if (parca.ekleyenKullaniciAdi) classes += " guest";

        return (
          <div
            key={`${parca.id}-${index}`}
            className={`${classes} ${
              hoveredEventId === String(parca.id) ? "active" : ""
            }`}
            style={{
              // Etkinliğin genişliği, gün farkına göre hesaplanır
              width: `${gunFarki * 200 + (gunFarki - 1) * 32}px`,
              // Etkinliğin sol pozisyonu haftadaki gün sırasına göre belirlenir
              left: `calc(${(1630 / 7) * solUzunluk(start) + 5}px)`,
              // Etkinliğin üst pozisyonu hafta sırası ve çakışan etkinlik sayısına göre ayarlanır
              top: `${topOffset}px`,
              height: "auto",
            }}
            // Etkinliğin üzerine gelindiğinde hover state'i değiştirir
            onMouseEnter={() => setHoveredEventId(String(parca.id))}
            onMouseLeave={() => setHoveredEventId(null)}
            // Etkinliğe tıklanıldığında callback fonksiyonunu tetikler
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(parca);
            }}
          >
            {/* Etkinliğin başlangıç saati ve başlığı */}
            {start.format("HH:mm")} - {parca.baslik}
          </div>
        );
      })}
    </div>
  );
};

export default Etkinlikler;
