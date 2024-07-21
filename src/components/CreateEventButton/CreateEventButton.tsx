import React, { useContext } from "react";
import plusImg from "../../assets/plus.svg";
import "./CreateEventButton.css";
import { ContentContext } from "../../context/ContentProvider";

export default function CreateEventButton() {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error("CalendarContext must be used within a ContentProvider");
  }

  const { openModal } = context;

  return (
    <button onClick={() => openModal()} className="create-event-button">
      <img src={plusImg} alt="create_event" className="button-img" />
      <span className="button-text">Create Event</span>
    </button>
  );
}
