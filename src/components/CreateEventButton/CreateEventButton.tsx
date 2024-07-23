import React, { useContext, useEffect, useState } from "react";
import plusImg from "../../assets/plus.svg";
import "./CreateEventButton.css";
import { ContentContext } from "../../context/ContentProvider";
import dayjs from "dayjs";

export default function CreateEventButton() {
  const context = useContext(ContentContext);
  const [isFirstOpen, setIsFirstOpen] = useState(false);

  if (!context) {
    throw new Error("CalendarContext must be used within a ContentProvider");
  }

  const { selectedDay, eventData, modalDay, setTitle, setDesc, setStartDate, setEndDate, setShowEventModal, isSelectModal, setIsSelectModal} = context;

  useEffect(() => {
    if (modalDay && isFirstOpen) {
      openModal();
    }
    setIsFirstOpen(true);
  }, [modalDay]);

  const openModal = () => {
    const dayEvents = eventData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(modalDay, "day")
    );

    if (dayEvents.length > 0) {
      setIsSelectModal(false); /* update butonunun açılması için */
      setTitle(dayEvents[0].baslik);
      setDesc(dayEvents[0].aciklama);
      setStartDate(convertToDayjs(dayEvents[0].baslangicTarihi));
      setEndDate(convertToDayjs(dayEvents[0].bitisTarihi));
    } else {
      setTitle("");
      setDesc("");
      setStartDate(selectedDay);
      setIsSelectModal(true);
    }

    setShowEventModal(true);
  };

  const convertToDayjs = (date: Date): dayjs.Dayjs => {
    return date ? dayjs(date) : dayjs();
  };


  return (
    <button onClick={() => openModal()} className="create-event-button">
      <img src={plusImg} alt="create_event" className="button-img" />
      <span className="button-text">Create Event</span>
    </button>
  );
}
