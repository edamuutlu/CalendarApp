import React, { createContext, useEffect, useState, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  aylikEtkinlikleriGetir,
  tumEtkinlikleriGetir,
} from "../stores/CalendarStore";
import EventAct from "../types/EventAct";

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
  startDate: Dayjs;
  setStartDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  endDate: Dayjs;
  setEndDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  startTime: Dayjs;
  setStartTime: React.Dispatch<React.SetStateAction<Dayjs>>;
  endTime: Dayjs;
  setEndTime: React.Dispatch<React.SetStateAction<Dayjs>>;
  eventType: number;
  setEventType: React.Dispatch<React.SetStateAction<number>>;
  eventData: EventAct[];
  setEventData: React.Dispatch<React.SetStateAction<EventAct[]>>;
  modalDay: Dayjs;
  setModalDay: React.Dispatch<React.SetStateAction<Dayjs>>;
  handleSelect: (date: Dayjs) => void;
  closeModal: () => void;
  fetchEvents: () => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(
  undefined
);

const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [isSelectModal, setIsSelectModal] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [startTime, setStartTime] = useState<Dayjs>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs>(dayjs());
  const [desc, setDesc] = useState("");
  const [eventType, setEventType] = useState<number>(0);
  const [eventData, setEventData] = useState<EventAct[]>([]);
  const [modalDay, setModalDay] = useState<Dayjs>(dayjs());

  // Load event data from API when the component mounts
  const fetchEvents = async () => {
    try {
      const savedEvents = await tumEtkinlikleriGetir();
      if (Array.isArray(savedEvents)) {
        setEventData(savedEvents);
        console.log("savedEvents :>> ", savedEvents);
      } else {
        setEventData([]);
        console.log("No events found for the user.");
      }
    } catch (error) {
      console.error("Etkinlikler getirilirken hata oluştu:", error);
    }
  };

  /* Calendar Context Function Start */
  const handleSelect = (date: Dayjs) => {
    setSelectedDay(date);
    setModalDay(date);
  };

  const closeModal = () => {
    setTitle("");
    setDesc("");
    setStartDate(dayjs());
    setEndDate(dayjs());
    setShowEventModal(false);
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
    closeModal,
    fetchEvents,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;
