import React, { useContext, useState } from "react";
import plusImg from "../../assets/plus.svg";
import "./CreateEventButton.css";

export default function CreateEventButton() {
  const [ showEventModal, setShowEventModal ] = useState(false);

  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="create-event-button"
    >
      <img src={plusImg} alt="create_event" className="button-img" />
      <span className="button-text"> Create</span>
    </button>
  );
}
