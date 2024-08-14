import React from "react";
import dayjs, { Dayjs } from "dayjs";
import Etkinlik from "../../tipler/Etkinlik";

interface EtkinlikListeleProps {
  tumEtkinlikler: Etkinlik[];
  value: Dayjs;
  onEventClick: (event: Etkinlik) => void;
  etkinlikTekrarKontrolu: (etkinlik: Etkinlik, date: Dayjs) => boolean;
  hoveredEventId: string | null;
  setHoveredEventId: (id: string | null) => void;
}

const EtkinlikListele: React.FC<EtkinlikListeleProps> = ({
  tumEtkinlikler,
  value,
  onEventClick,
  etkinlikTekrarKontrolu,
  hoveredEventId,
  setHoveredEventId
}) => {

  const indeksliEtkinlikler  = tumEtkinlikler .map((event) => {
    const cakisanEtkinlikler  = tumEtkinlikler .filter(
      (e) =>
        dayjs(e.baslangicTarihi).isSame(
          dayjs(event.baslangicTarihi),
          "day"
        ) ||
        dayjs(e.bitisTarihi).isSame(dayjs(event.bitisTarihi), "day") ||
        (dayjs(e.baslangicTarihi).isBefore(dayjs(event.bitisTarihi), "day") &&
          dayjs(e.bitisTarihi).isAfter(dayjs(event.baslangicTarihi), "day"))
    );
    const index = cakisanEtkinlikler .indexOf(event);
    return { ...event, index };
  });

  const relevantEvents = indeksliEtkinlikler .filter((etkinlik) =>
    etkinlikTekrarKontrolu(etkinlik, value)
  );

  relevantEvents.sort((a, b) => a.index - b.index);

  const renderEventItem = (etkinlik: Etkinlik & { index: number }) => {
    const start = dayjs(etkinlik.baslangicTarihi);
    const end = dayjs(etkinlik.bitisTarihi);
    const isStart = value.isSame(start, "day");
    const isEnd = value.isSame(end, "day");

    let classes = "event-item";

    if (etkinlik.ekleyenKullaniciAdi) {
      classes += " guest";
    }
    if (isStart && isEnd) {
      classes += " start-end";
    } else if (isStart) {
      classes += " start";
    } else if (isEnd) {
      classes += " end";
    }

    return (
      <div
        key={etkinlik.id}
        className={`${classes} ${
          hoveredEventId === String(etkinlik.id) ? "active" : ""
        }`}
        style={{
          top: `${etkinlik.index * 25}px`,
          width: isEnd ? "calc(100% - 12px)" : "calc(100% - 4px)",
          left: "0",
          right: isEnd ? "0" : "0",
        }}
        onMouseEnter={() => setHoveredEventId(String(etkinlik.id))}
        onMouseLeave={() => setHoveredEventId(null)}
        onClick={(e) => {
          e.stopPropagation();
          onEventClick(etkinlik);
        }}
      >
        {isStart
          ? `${dayjs(etkinlik.baslangicTarihi).format("HH:mm")} - ${
              etkinlik.baslik
            }`
          : etkinlik.baslik}
      </div>
    );
  };

  const maxIndex = Math.max(...relevantEvents.map((e) => e.index), 0);

  return (
    <div
      style={{
        position: "relative",
        height: `${(maxIndex + 1) * 30}px`,
        overflow: "hidden",
        width: "100%",
        zIndex: "10",
      }}
    >
      {relevantEvents.map(renderEventItem)}
    </div>
  );
};

export default EtkinlikListele;
