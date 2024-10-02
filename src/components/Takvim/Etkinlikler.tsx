import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import Etkinlik from "../../tipler/Etkinlik";
import dayjs, { Dayjs } from "dayjs";
import { Modal } from "antd";
import { TekrarEnum } from "../../yonetimler/EtkinlikYonetimi";

interface EtkinliklerProps {
  seciliGun: dayjs.Dayjs;
  setSeciliGun: Dispatch<SetStateAction<dayjs.Dayjs>>;
  tumEtkinlikler: Etkinlik[];
  onEventClick: (event: Etkinlik) => void;
  etkinlikTekrarKontrolu: (etkinlik: Etkinlik, date: Dayjs) => boolean;
  kalanGenislik: number;
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

const Etkinlikler = (props: EtkinliklerProps) => {
  const {
    seciliGun,
    setSeciliGun,
    tumEtkinlikler,
    onEventClick,
    etkinlikTekrarKontrolu,
    kalanGenislik,
  } = props;

  const [hoveredEtkinlikId, setHoveredEtkinlikId] = useState<string | null>(null);
  const [dahaFazlaPenceresiniAc, setDahaFazlaPenceresiniAc] = useState(false);

  const oncekiAySonGun = useMemo(
    () =>
      dayjs(seciliGun)
        .subtract(1, "month")
        .endOf("month")
        .add(1, "day")
        .format("ddd"),
    [seciliGun]
  );
  // Ay görünümünde önceki aydan gelen günlerin sayısını hesaplar
  const oncekiAydanGelenGunSayisi = useMemo(
    () => DAY_OFFSET[oncekiAySonGun as DayName] || 0,
    [oncekiAySonGun]
  );

  // Bir tarihin, haftanın hangi gününe denk geldiğini hesaplar
  const solUzunluk = (date: dayjs.Dayjs) =>
    DAY_OFFSET[date.format("ddd") as DayName] || 0;

  // Bir tarihin hangi hafta sırasında olduğunu hesaplar
  const ustUzunluk = useMemo(
    () => (date: dayjs.Dayjs) => {
      const ayinIlkHaftadakiGunSayisi = 7 - oncekiAydanGelenGunSayisi;
      const etkinlikBaslangicGunSayisi = date.date();

      if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi) return 1;
      if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi + 7) return 2;
      if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi + 14)
        return 3;
      if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi + 21)
        return 4;
      if (etkinlikBaslangicGunSayisi <= ayinIlkHaftadakiGunSayisi + 28)
        return 5;
      return 6;
    },
    [oncekiAydanGelenGunSayisi]
  );

  const minDate = (date1: dayjs.Dayjs, date2: dayjs.Dayjs) => {
    return date1.isBefore(date2) ? date1 : date2;
  };

  const etkinlikParcalari = useMemo(
  () =>
    tumEtkinlikler.flatMap((etkinlik) => {
      const ayinIlkGunu = seciliGun.startOf("year");
      const ayinSonGunu = seciliGun.endOf("year");
      const gunFarki = dayjs(etkinlik.bitisTarihi).diff(
        dayjs(etkinlik.baslangicTarihi),
        "day"
      );
      const parcalar = [];

      for (
        let gun = ayinIlkGunu;
        gun.isSameOrBefore(ayinSonGunu);
        gun = gun.add(1, "day")
      ) {
        if (etkinlikTekrarKontrolu(etkinlik, gun)) {
          // Etkinlik parçasının başlangıç ve bitiş tarihlerini saat ile birlikte ayarla
          const etkinlikBaslangicSaatli = gun
            .hour(dayjs(etkinlik.baslangicTarihi).hour())
            .minute(dayjs(etkinlik.baslangicTarihi).minute());
          const parcaBitis = etkinlikBaslangicSaatli
            .add(gunFarki, "day")
            .hour(dayjs(etkinlik.bitisTarihi).hour())
            .minute(dayjs(etkinlik.bitisTarihi).minute());

          // Etkinliği haftalara böler ve her parçayı listeye ekler
          let guncelBaslangic = etkinlikBaslangicSaatli;
          while (
            guncelBaslangic.isBefore(parcaBitis) ||
            guncelBaslangic.isSame(parcaBitis, "day")
          ) {
            const haftaninSonGunu = guncelBaslangic.endOf("week");
            const etkinlikSonParca = minDate(haftaninSonGunu, parcaBitis);

            parcalar.push({
              ...etkinlik,
              etkinlikParcaBaslangic: guncelBaslangic,
              etkinlikParcaBitis: etkinlikSonParca,
            });

            // Bir sonraki haftaya geçer
            guncelBaslangic = haftaninSonGunu.add(1, "day");
          }

          // Bir sonraki tekrar gününe geçiş yap
          if (etkinlik.tekrarDurumu !== TekrarEnum.hic) {
            gun = gun.add(gunFarki, "day");
          } else {
            break;
          }
        }
      }

      return parcalar;
    }),
  [seciliGun, tumEtkinlikler]
);

  // Etkinlikleri belirli bir aya göre filtreleyip, tarih sırasına göre sıralar
  const ayinEtkinlikleri = useMemo(
    () =>
      etkinlikParcalari
        .filter((etkinlik) => {
          const etkinlikBaslangic = dayjs(etkinlik.etkinlikParcaBaslangic);
          const etkinlikBitis = dayjs(etkinlik.etkinlikParcaBitis);
          const seciliGunIlkGunu = dayjs(seciliGun).startOf("month");
          const seciliGunSonGunu = dayjs(seciliGun).endOf("month");

          // Eğer etkinlikParcaBaslangic seciliGun Ayı ile aynı değilse, ilk gününü atayın
          if (!etkinlikBaslangic.isSame(seciliGun, "month")) {
            etkinlik.etkinlikParcaBaslangic = seciliGunIlkGunu;
          }

          // Eğer etkinlikParcaBitis seciliGun Ayı ile aynı değilse, son gününü atayın
          if (!etkinlikBitis.isSame(seciliGun, "month")) {
            etkinlik.etkinlikParcaBitis = seciliGunSonGunu;
          }

          return (
            etkinlikBaslangic.isBefore(seciliGunSonGunu.add(1, "day"), "day") && // Son günü dahil etmek için 1 gün ekledik
            etkinlikBaslangic.isSameOrBefore(seciliGunSonGunu, "day") &&
            etkinlikBitis.isAfter(seciliGunIlkGunu.subtract(1, "day"), "day") && // İlk günü dahil etmek için 1 gün çıkardık
            etkinlikBitis.isSameOrAfter(seciliGunIlkGunu, "day")
          );
        })
        .sort((a, b) =>
          dayjs(a.baslangicTarihi).diff(dayjs(b.baslangicTarihi))
        ),
    [etkinlikParcalari, seciliGun]
  );

  // Şimdi, etkinlik parçalarının index değerlerini güncelleyelim
  const indeksliEtkinlikler = useMemo(() => {
    return ayinEtkinlikleri.reduce((acc, parca) => {
      const cakisanParcalar = acc.filter(
        (e) =>
          dayjs(e.etkinlikParcaBaslangic).isSame(
            dayjs(parca.etkinlikParcaBaslangic),
            "day"
          ) ||
          dayjs(e.etkinlikParcaBitis).isSame(
            dayjs(parca.etkinlikParcaBitis),
            "day"
          ) ||
          (dayjs(e.etkinlikParcaBaslangic).isBefore(
            dayjs(parca.etkinlikParcaBitis),
            "day"
          ) &&
            dayjs(e.etkinlikParcaBitis).isAfter(
              dayjs(parca.etkinlikParcaBaslangic),
              "day"
            )) ||
          dayjs(e.etkinlikParcaBitis).isSame(
            dayjs(parca.etkinlikParcaBaslangic),
            "day"
          ) ||
          dayjs(e.etkinlikParcaBaslangic).isSame(
            dayjs(parca.etkinlikParcaBitis),
            "day"
          )
      );

      const kullanilmisIndeksler = new Set(cakisanParcalar.map((p) => p.index));
      let index = 0;
      while (kullanilmisIndeksler.has(index)) {
        index++;
      }

      acc.push({ ...parca, index });
      return acc;
    }, [] as ((typeof etkinlikParcalari)[0] & { index: number })[]);
  }, [ayinEtkinlikleri, etkinlikParcalari]);

  const DahaFazlaEtkinlikPenceresi = () => {
    if (!seciliGun) return null;

    const gunEtkinlikleri = indeksliEtkinlikler.filter((etkinlik) =>
      dayjs(seciliGun).isBetween(
        etkinlik.etkinlikParcaBaslangic,
        etkinlik.etkinlikParcaBitis,
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
        {gunEtkinlikleri
          .slice()
          .sort(
            (a, b) =>
              dayjs(a.baslangicTarihi).hour() - dayjs(b.baslangicTarihi).hour()
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
              {dayjs(event.baslangicTarihi).format("HH:mm")} - {event.baslik}
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
                "day"
              ) &&
              etk.etkinlikParcaBitis.isSameOrAfter(baslangicTarihi, "day") &&
              etk.index >= 2
          ).length;
        };
        const baslangicSaati = dayjs(parca.baslangicTarihi);
        const start = parca.etkinlikParcaBaslangic;
        const end = parca.etkinlikParcaBitis;
        const gunFarki =
          parseInt(end.format("D")) - parseInt(start.format("D")) + 1;

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
                  width: `${
                    gunFarki * (kalanGenislik / 7) - 40
                  }px`,
                  left: `${
                    Math.floor(kalanGenislik / 7.1) * solUzunluk(start) + 12
                  }px`,
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
                {baslangicSaati.format("HH:mm")} - {parca.baslik}
              </div>
            )}

            {[...Array(gunFarki)].map((_, dayIndex) => {
              const guncelTarih = start.add(dayIndex, "day");
              const guncelEtkinlikSayisi = etkinlikSayisi(guncelTarih);

              // Check if "Daha fazla göster" has already been rendered for this date
              if (
                guncelEtkinlikSayisi > 0 &&
                !renderedDays.has(guncelTarih.format("YYYY-MM-DD"))
              ) {
                renderedDays.add(guncelTarih.format("YYYY-MM-DD")); // Mark the day as rendered

                return (
                  <div
                    key={`more-${parca.id}-${dayIndex}`}
                    className="daha-fazla-goster"
                    style={{
                      position: "absolute",
                      width: `${kalanGenislik / 7 - 40}px`,
                      left: `calc(${
                        (kalanGenislik / 7) * solUzunluk(guncelTarih) + 5
                      }px)`,
                      top: `${ustUzunluk(guncelTarih) * 118 + 50}px`,
                      zIndex: 50,
                    }}
                    onClick={() => {
                      setSeciliGun(guncelTarih);
                      setDahaFazlaPenceresiniAc(true);
                    }}
                  >
                    Daha fazla göster ({guncelEtkinlikSayisi})
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

export default Etkinlikler;
