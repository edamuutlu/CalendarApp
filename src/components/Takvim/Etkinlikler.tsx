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
  etkinlikTekrarKontrolu,
}) => {
  // Hover edilen etkinliğin ID'sini tutan state
  const [hoveredEtkinlikId, setHoveredEtkinlikId] = useState<string | null>(null);

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
  const ayinEtkinlikleri = useMemo(() => 
    tumEtkinlikler
      .filter(etkinlik =>
        dayjs(etkinlik.baslangicTarihi).format("MMM") === seciliGunAy
      )
      .sort((a, b) => dayjs(a.baslangicTarihi).diff(dayjs(b.baslangicTarihi))),
    [tumEtkinlikler, seciliGunAy]
  );

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

  // İlk olarak, etkinlik parçalarını oluşturuyoruz
  const TekrarEtkinlik = ayinEtkinlikleri.flatMap((etkinlik) => {
    const ayinIlkGunu = seciliGun.startOf("month");
    const ayinSonGunu = seciliGun.endOf("month");
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
      if (
        etkinlikTekrarKontrolu(etkinlik, gun) &&
        etkinlik.tekrarDurumu !== TekrarEnum.hic
      ) {
        // Etkinlik parçasının başlangıç ve bitiş tarihlerini saat ile birlikte ayarla
        const etkinlikBaslangicSaatli = gun
          .hour(dayjs(etkinlik.baslangicTarihi).hour())
          .minute(dayjs(etkinlik.baslangicTarihi).minute());
        const parcaBitis = etkinlikBaslangicSaatli
          .add(gunFarki, "day")
          .hour(dayjs(etkinlik.bitisTarihi).hour())
          .minute(dayjs(etkinlik.bitisTarihi).minute());

        parcalar.push({
          ...etkinlik,
          etkinlikParcaBaslangic: etkinlikBaslangicSaatli,
          etkinlikParcaBitis: parcaBitis,
        });

        // Bir sonraki güne geçiş yap
        gun = gun.add(gunFarki, "day");
      }
    }

    if (etkinlik.tekrarDurumu === TekrarEnum.hic) {
      const baslangic = dayjs(etkinlik.baslangicTarihi);
      const bitis = dayjs(etkinlik.bitisTarihi);

      let guncelBaslangic = baslangic;
      // Etkinliği haftalara böler ve her parçayı listeye ekler
      while (
        guncelBaslangic.isBefore(bitis) ||
        guncelBaslangic.isSame(bitis, "day")
      ) {
        guncelBaslangic
          .hour(dayjs(etkinlik.baslangicTarihi).hour())
          .minute(dayjs(etkinlik.baslangicTarihi).minute());
        const haftaninSonGunu = guncelBaslangic.endOf("week");
        const etkinlikSonParca = minDate(haftaninSonGunu, bitis)
          .hour(dayjs(etkinlik.bitisTarihi).hour())
          .minute(dayjs(etkinlik.bitisTarihi).minute());

        parcalar.push({
          ...etkinlik,
          etkinlikParcaBaslangic: guncelBaslangic,
          etkinlikParcaBitis: etkinlikSonParca,
        });

        // Bir sonraki haftaya geçer
        guncelBaslangic = haftaninSonGunu.add(1, "day");
      }
    }

    return parcalar;
  });

  // Şimdi, etkinlik parçalarının index değerlerini güncelleyelim
  const guncellenmisTekrarEtkinlik = TekrarEtkinlik.reduce((acc, parca) => {
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
  }, [] as ((typeof TekrarEtkinlik)[0] & { index: number })[]);

  const DahaFazlaEtkinlikPenceresi = () => {
    if (!seciliGun) return null;

    const gunEtkinlikleri = guncellenmisTekrarEtkinlik.filter((etkinlik) =>
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
      {guncellenmisTekrarEtkinlik.map((parca, index) => {
        const etkinlikSayisi = (baslangicTarihi: dayjs.Dayjs) => {
          const etkinlikSayisi = guncellenmisTekrarEtkinlik.filter(
            (etk) =>
              etk.etkinlikParcaBaslangic.isSameOrBefore(baslangicTarihi, "day") &&
              etk.etkinlikParcaBitis.isSameOrAfter(baslangicTarihi, "day") &&
              etk.index >= 2
          ).length;

          return etkinlikSayisi;
        };

        const start = parca.etkinlikParcaBaslangic;
        const end = parca.etkinlikParcaBitis;
        const gunFarki =
          parseInt(end.format("D")) - parseInt(start.format("D")) + 1; // etkinlik butonunun genişliği için
        /* console.log(`${start} - ${end} - ${gunFarki}`); */
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
                  width: `${gunFarki * 200 + (gunFarki - 1) * 32}px`,
                  left: `calc(${(1630 / 7) * solUzunluk(start) + 15}px)`,
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
            {[...Array(gunFarki)].map((_, dayIndex) => {
              const currentDate = start.add(dayIndex, "day");
              const currentEtkinlikSayisi = etkinlikSayisi(currentDate);
              if (currentEtkinlikSayisi > 0) {
                return (
                  <div
                    key={`more-${parca.id}-${dayIndex}`}
                    className="daha-fazla-goster"
                    style={{
                      position: "absolute",
                      left: `calc(${
                        (1630 / 7) * solUzunluk(currentDate) + 5
                      }px)`,
                      top: `${ustUzunluk(currentDate) * 118 + 50}px`,
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

export default Etkinlikler;
