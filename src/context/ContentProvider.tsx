import React, { createContext, useEffect, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useParams } from "react-router";
import { EventAct, useEventStore } from "../stores/EventStore";
import {
  aylikEtkinlikleriGetir,
  tumEtkinlikleriGetir,
} from "../stores/CalendarStore";

export interface ContentContextType {
  selectedDay: Dayjs;
  setSelectedDay: React.Dispatch<React.SetStateAction<Dayjs>>;
  showEventModal: boolean;
  setShowEventModal: React.Dispatch<React.SetStateAction<boolean>>;
  isSelectModal: boolean;
  setIsSelectModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  desc: string;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  startDate: Dayjs | null;
  setStartDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  endDate: Dayjs | null;
  setEndDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  startTime: Dayjs | null;
  setStartTime: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  endTime: Dayjs | null;
  setEndTime: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  eventType: number;
  setEventType: React.Dispatch<React.SetStateAction<number>>;
  eventData: EventAct[];
  setEventData: React.Dispatch<React.SetStateAction<EventAct[]>>;
  modalDay: Dayjs | null;
  setModalDay: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  handleSelect: (date: Dayjs) => void;
  dateCellRender: (value: Dayjs) => JSX.Element;
  openModal: () => void;
  closeModal: () => void;
  addEvent: (event: EventAct) => Promise<void>;
  updateEvent: (event: EventAct) => Promise<void>;
  deleteEvent: (eventId: number) => Promise<void>;
  getToday: () => void;
  handleNextMonth: () => void;
  handlePrevMonth: () => void;
  fetchEvents: () => void;
  username: string | undefined;
}

export const ContentContext = createContext<ContentContextType | undefined>(
  undefined
);

const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [isSelectModal, setIsSelectModal] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [desc, setDesc] = useState("");
  const [eventType, setEventType] = useState<number>(0);
  const [eventData, setEventData] = useState<EventAct[]>([]);
  const [modalDay, setModalDay] = useState<Dayjs | null>(dayjs());
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const { username } = useParams<{ username: string }>();

  const {
    addEvent: addEventToStore,
    updateEvent: updateEventInStore,
    deleteEvent: deleteEventFromStore,
  } = useEventStore();

  // Load event data from API when the component mounts
  const fetchEvents = async () => {
    try {
      const savedEvents = await tumEtkinlikleriGetir();
      if (Array.isArray(savedEvents)) {
        setEventData(savedEvents);
        console.log('savedEvents :>> ', savedEvents); 
      } else {
        setEventData([]);
        console.log('No events found for the user.');
      }
    } catch (error) {
      console.error("Etkinlikler getirilirken hata oluştu:", error);
    }
  };

  
  
  useEffect(() => {
    fetchEvents();
  }, [username]);

  useEffect(() => {
    if (modalDay && isFirstOpen) {
      openModal();
    }
    setIsFirstOpen(true);
  }, [modalDay]);

  /* Calendar Header Function Start */
  const getToday = () => {
    const now = dayjs();
    setSelectedDay(now);
  };

  const handleNextMonth = () => {
    if (selectedDay) {
      const nextMonthDate = selectedDay.add(1, "month");
      setSelectedDay(nextMonthDate);
    }
  };

  const handlePrevMonth = () => {
    if (selectedDay) {
      const nextMonthDate = selectedDay.subtract(1, "month");
      setSelectedDay(nextMonthDate);
    }
  };

  /* Calendar Header Function End */

  /* Calendar Context Function Start */
  const handleSelect = (date: Dayjs) => {
    setSelectedDay(date);
    setModalDay(date);
  };

  const dateCellRender = (value: Dayjs) => {
    if (!eventData) {
      return <ul style={{ padding: "0px 4px" }}></ul>;
    }

    const dayEvents = eventData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(value, "day")
    );
    return (
      <ul style={{ padding: "0px 4px" }}>
        {dayEvents.map((event) => (
          <li className="cell-style" key={event.id}>
            {event.baslik}
          </li>
        ))}
      </ul>
    );
  };

  const openModal = () => {
    const dayEvents = eventData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(modalDay, "day")
    );

    if (dayEvents.length > 0) {
      setIsSelectModal(false); /* update butonunun açılması için */
      setTitle(dayEvents[0].baslik);
      setDesc(dayEvents[0].aciklama);
    } else {
      setTitle("");
      setDesc("");
      setIsSelectModal(true);
    }

    setShowEventModal(true);
  };

  const closeModal = () => {
    setShowEventModal(false);
  };

  const addEvent = async (event: EventAct) => {
    try {
      await addEventToStore(event);
      await fetchEvents();
    } catch (error) {
      console.error("Etkinlik eklenirken hata oluştu:", error);
    }

    closeModal();
    setTitle("");
    setDesc("");
  };

  const updateEvent = async (event: EventAct) => {
    try {
      await updateEventInStore(event);
      await fetchEvents();
    } catch (error) {
      console.error("Etkinlik güncellenirken hata oluştu:", error);
    }

    closeModal();
    setTitle("");
    setDesc("");
  };

  const deleteEvent = async (eventId: number) => {
    try {
      await deleteEventFromStore(eventId);
      await fetchEvents();
    } catch (error) {
      console.error("Etkinlik silinirken hata oluştu:", error);
    }

    closeModal();
    setTitle("");
    setDesc("");
  };

  /* Calendar Context Function End */

  const contextValue = {
    selectedDay,
    setSelectedDay,
    showEventModal,
    setShowEventModal,
    isSelectModal,
    setIsSelectModal,
    title,
    setTitle,
    desc,
    setDesc,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    eventType,
    setEventType,
    eventData,
    setEventData,
    modalDay,
    setModalDay,
    handleSelect,
    dateCellRender,
    openModal,
    closeModal,
    addEvent,
    updateEvent,
    deleteEvent,
    getToday,
    handleNextMonth,
    handlePrevMonth,
    username,
    fetchEvents,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;
