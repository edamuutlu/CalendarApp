import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import Etkinlik from "../../tipler/Etkinlik";
import dayjs, { Dayjs } from "dayjs";
import { Modal } from "antd";
import { TekrarEnum } from "../../yonetimler/EtkinlikYonetimi";

interface EtkinliklerProps {
  seciliYil: dayjs.Dayjs;
  setSeciliGun: Dispatch<SetStateAction<dayjs.Dayjs>>;
  tumEtkinlikler: Etkinlik[];
  onEventClick: (event: Etkinlik) => void;
  kalanGenislik: number;
}

const YillikEtkinlikler = (props: EtkinliklerProps) => {
  const {
    seciliYil,
    setSeciliGun,
    tumEtkinlikler,
    onEventClick,
    kalanGenislik,
  } = props;

  const [hoveredEtkinlikId, setHoveredEtkinlikId] = useState<string | null>(
    null
  );
  const [dahaFazlaPenceresiniAc, setDahaFazlaPenceresiniAc] = useState(false);

  const etkinlikTekrarKontrolu = (etkinlik: Etkinlik, date: Dayjs) => {
    const { baslangicTarihi, bitisTarihi, tekrarDurumu } = etkinlik;
    const startDate = dayjs(baslangicTarihi);
    const endDate = dayjs(bitisTarihi);

    switch (tekrarDurumu) {
      case TekrarEnum.hic:
        return date.isBetween(startDate, endDate, "day", "[]");
      case TekrarEnum.herAy:
        return (
          date.isSameOrAfter(startDate, "day") &&
          date.date() >= startDate.date() &&
          date.date() <= endDate.date() &&
          date.year() >= startDate.year() &&
          date.month() >= startDate.month()
        );
      case TekrarEnum.herYil:
        return (
          date.isSameOrAfter(startDate, "day") &&
          date.month() >= startDate.month() &&
          date.month() <= endDate.month() &&
          date.date() >= startDate.date() &&
          date.date() <= endDate.date() &&
          date.diff(startDate, "year") >= 0
        );

      default:
        return false;
    }
  };

  // Bir tarihin hangi aya denk geldiğini hesaplar (0-11 arası)
  const solUzunluk = useMemo(
    () => (date: dayjs.Dayjs) => {
      const etkinlikBaslangicGunSayisi = date.month() % 3;
      return etkinlikBaslangicGunSayisi;
    },
    []
  );

  // Bir tarihin hangi hafta sırasında olduğunu hesaplar (1-5 arası)
  const ustUzunluk = useMemo(
    () => (date: dayjs.Dayjs) => {
      const etkinlikBaslangicGunSayisi = date.month() + 1;
      if (etkinlikBaslangicGunSayisi <= 3) return 1;
      if (etkinlikBaslangicGunSayisi <= 6) return 2;
      if (etkinlikBaslangicGunSayisi <= 9) return 3;
      return 4;
    },
    []
  );

  // İki tarih arasından en küçük olanı döndürür
  const minDate = (date1: dayjs.Dayjs, date2: dayjs.Dayjs) => {
    return date1.isBefore(date2) ? date1 : date2;
  };

  // Etkinlik parçalarını oluştur
  const etkinlikParcalari = useMemo(
    () =>
      tumEtkinlikler.flatMap((etkinlik) => {
        const yilBaslangic = seciliYil.startOf("year");
        const yilBitis = seciliYil.endOf("year");
        const gunFarki = dayjs(etkinlik.bitisTarihi).diff(
          dayjs(etkinlik.baslangicTarihi),
          "day"
        );
        const parcalar = [];

        for (
          let gun = yilBaslangic;
          gun.isSameOrBefore(yilBitis);
          gun = gun.add(1, "day")
        ) {
          if (
            etkinlikTekrarKontrolu(etkinlik, gun) ||
            (dayjs(etkinlik.baslangicTarihi).isSameOrBefore(gun) &&
              dayjs(etkinlik.bitisTarihi).isSameOrAfter(gun))
          ) {
            const etkinlikBaslangicSaatli = gun
              .hour(dayjs(etkinlik.baslangicTarihi).hour())
              .minute(dayjs(etkinlik.baslangicTarihi).minute());
            const parcaBitis = minDate(
              etkinlikBaslangicSaatli.add(gunFarki, "day"),
              yilBitis
            )
              .hour(dayjs(etkinlik.bitisTarihi).hour())
              .minute(dayjs(etkinlik.bitisTarihi).minute());

            parcalar.push({
              ...etkinlik,
              etkinlikParcaBaslangic: etkinlikBaslangicSaatli,
              etkinlikParcaBitis: parcaBitis,
            });

            if (etkinlik.tekrarDurumu === TekrarEnum.hic) {
              gun = gun.add(gunFarki, "day");
            }
          }
        }

        return parcalar;
      }),
    [seciliYil, tumEtkinlikler, etkinlikTekrarKontrolu]
  );

  // Etkinlikleri yıla göre filtrele ve tarih sırasına göre sırala
  const yilEtkinlikleri = useMemo(
    () =>
      etkinlikParcalari
        .filter((etkinlik) => {
          const etkinlikBaslangic = dayjs(etkinlik.etkinlikParcaBaslangic);
          const etkinlikBitis = dayjs(etkinlik.etkinlikParcaBitis);
          return (
            etkinlikBaslangic.isSame(seciliYil, "year") ||
            etkinlikBitis.isSame(seciliYil, "year") ||
            (etkinlikBaslangic.isBefore(seciliYil.endOf("year")) &&
              etkinlikBitis.isAfter(seciliYil.startOf("year")))
          );
        })
        .sort((a, b) =>
          dayjs(a.etkinlikParcaBaslangic).diff(dayjs(b.etkinlikParcaBaslangic))
        ),
    [etkinlikParcalari, seciliYil]
  );

  // Etkinlik parçalarının index değerlerini güncelle
  const indeksliEtkinlikler = useMemo(() => {
    const sortedEvents = yilEtkinlikleri.sort((a, b) =>
      dayjs(a.etkinlikParcaBaslangic).diff(dayjs(b.etkinlikParcaBaslangic))
    );
  
    const result: (typeof sortedEvents[0] & { index: number })[] = [];
    const indexMap = new Map<string, number>();
  
    sortedEvents.forEach((parca) => {
        const cakisanParcalar = result.filter((e) => {
          const sameMonthCondition =
            dayjs(e.etkinlikParcaBaslangic).isSame(dayjs(parca.etkinlikParcaBaslangic), "month") ||
            dayjs(e.etkinlikParcaBitis).isSame(dayjs(parca.etkinlikParcaBitis), "month") ||
            (dayjs(e.etkinlikParcaBaslangic).isBefore(dayjs(parca.etkinlikParcaBitis), "month") &&
              dayjs(e.etkinlikParcaBitis).isAfter(dayjs(parca.etkinlikParcaBaslangic), "month"));
      
          return (
            sameMonthCondition && e.id !== parca.id 
          );
        });
      
        if (!parca.id) return; 
      
        const kullanilmisIndeksler = new Set(cakisanParcalar.map((p) => p.index));
        
        let index: number;
        if (indexMap.has(parca.id)) {
          index = indexMap.get(parca.id)!; 
        } else {
          index = 0;
          while (kullanilmisIndeksler.has(index)) {
            index++;
          }
          indexMap.set(parca.id, index);
        }
        
        result.push({ ...parca, index });
      });
      
  
    return result;
  }, [yilEtkinlikleri]);
  

  console.log("indeksliEtkinlikler :>> ", indeksliEtkinlikler);

  const DahaFazlaEtkinlikPenceresi = () => {
    if (!seciliYil) return null;

    const ayEtkinlikleri = indeksliEtkinlikler.filter((etkinlik) =>
      dayjs(seciliYil).isBetween(
        etkinlik.etkinlikParcaBaslangic,
        etkinlik.etkinlikParcaBitis,
        "month",
        "[]"
      )
    );
    return (
      <Modal
        open={dahaFazlaPenceresiniAc}
        onCancel={() => setDahaFazlaPenceresiniAc(false)}
        footer={null}
      >
        <h2>{seciliYil.format("DD MMMM YYYY")} Etkinlikleri</h2>
        {ayEtkinlikleri
          .slice()
          .sort(
            (a, b) =>
              dayjs(a.baslangicTarihi).date() - dayjs(b.baslangicTarihi).date()
          )
          .map((event) => (
            <div
              className="daha-fazla-etkinlik"
              onClick={() => {
                onEventClick(event);
                setDahaFazlaPenceresiniAc(false);
              }}
              key={event.id}
            >
              {dayjs(event.baslangicTarihi).format("D MMMM YYYY")} -{" "}
              {event.baslik}
            </div>
          ))}
      </Modal>
    );
  };

  // Create a Set to track which days have already displayed "Daha fazla göster"
  const renderedDays = new Set<string>();

  return (
    <div style={{ position: "relative", width: "100%", zIndex: 10 }}>
      {indeksliEtkinlikler.map((parca, index) => {
        const etkinlikSayisi = (baslangicTarihi: dayjs.Dayjs) => {
          return indeksliEtkinlikler.filter(
            (etk) =>
              etk.etkinlikParcaBaslangic.isSameOrBefore(
                baslangicTarihi,
                "month"
              ) &&
              etk.etkinlikParcaBitis.isSameOrAfter(baslangicTarihi, "month") &&
              etk.index >= 2
          ).length;
        };

        const start = parca.etkinlikParcaBaslangic;
        const end = parca.etkinlikParcaBitis;
        const ayFarki = parseInt(end.format("M")) - parseInt(start.format("M")) + 1;
        console.log('ayFarki :>> ', ayFarki);

        let classes = "event-item";
        if (parca.ekleyenKullaniciAdi) classes += " guest";

        return (
          <React.Fragment key={`${parca.id}-${index}`}>
            {parca.index < 2 && (
              <div
                className={`${classes} ${
                  hoveredEtkinlikId === String(parca.id) ? "active" : ""
                }`}
                style={{
                  width: `${(Math.floor(kalanGenislik) / 3) - 50}px`,
                  left: `${
                    Math.floor(kalanGenislik / 3.1) * solUzunluk(start) + 15
                  }px`,
                  top: `${
                    ustUzunluk(start) * 112 + (parca.index as number) * 25
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
                {start.format("DD MMM")} - {parca.baslik}
              </div>
            )}

            {[...Array(ayFarki)].map((_, dayIndex) => {
              const currentDate = start.add(dayIndex, "day");
              const currentEtkinlikSayisi = etkinlikSayisi(currentDate);

              if (
                currentEtkinlikSayisi > 0 &&
                !renderedDays.has(currentDate.format("YYYY-MM-DD"))
              ) {
                renderedDays.add(currentDate.format("YYYY-MM-DD"));

                return (
                  <div
                    key={`more-${parca.id}-${dayIndex}`}
                    className="daha-fazla-goster"
                    style={{
                      position: "absolute",
                      width: `${(Math.floor(kalanGenislik) / 3) - 50}px`,
                      left: `${
                        Math.floor(kalanGenislik / 3.1) * solUzunluk(start) + 15
                      }px`,
                      top: `${ustUzunluk(currentDate) * 112 + 50}px`,
                      zIndex: 50,
                    }}
                    onClick={() => {
                      setSeciliGun(currentDate);
                      setDahaFazlaPenceresiniAc(true);
                    }}
                  >
                    Daha fazla göster ({currentEtkinlikSayisi})
                  </div>
                );
              }

              return null;
            })}
          </React.Fragment>
        );
      })}
      {dahaFazlaPenceresiniAc && DahaFazlaEtkinlikPenceresi()}
    </div>
  );
};

export default YillikEtkinlikler;
