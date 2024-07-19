import React from "react";
import CreateEventButton from "../CreateEventButton/CreateEventButton";
import "./Sidebar.css"
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <CreateEventButton />     
    </aside>
  );
}