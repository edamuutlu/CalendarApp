import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Calendar,
  DatePicker,
  Dropdown,
  Input,
  message,
  Modal,
  Space,
  TimePicker,
} from "antd";
import "./CalendarContext.css";
import { ContentContext } from "../../context/ContentProvider";
import dayjs from "dayjs";
import { DownOutlined } from "@ant-design/icons";
import {
  MdOutlineModeEditOutline,
  MdDateRange,
  MdAccessTime,
  MdOutlinePeopleAlt,
  MdEventRepeat,
  MdNotes,
} from "react-icons/md";

import type { MenuProps } from "antd";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

interface MenuItem {
  label: string;
  key: string;
}

const CalendarContext: React.FC = () => {
  const context = useContext(ContentContext);
  const [selectType, setSelectType] = useState<string | null>(null);

  const items: MenuItem[] = [
    {
      label: "Does not repeat",
      key: "1",
    },
    {
      label: "Daily",
      key: "2",
    },
    {
      label: `Weekly on ${dayjs().format("dddd")}`,
      key: "3",
    },
    {
      label: `Monthly on the ${dayjs().format("Do")}`,
      key: "4",
    },
    {
      label: `Annually on ${dayjs().format("MMM DD")}`,
      key: "5",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      message.info(`Selected: ${selectedItem.label}`);
      setSelectType(selectedItem.label);
    }
  };

  const menuProps = {
    items: items.map((item) => ({ key: item.key, label: item.label })),
    onClick: handleMenuClick,
  };

  if (!context) {
    throw new Error("CalendarContext must be used within a ContentProvider");
  }

  const {
    selectedDay,
    showEventModal,
    isSelectModal,
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
    handleSelect,
    dateCellRender,
    closeModal,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  } = context;

  const today = dayjs();

  useEffect(() => {
    /* fetchEvents(); */
  }, []);

  const newEvent = {
    baslik: title,
    aciklama: desc,
    baslangicTarihi: startDate,
    bitisTarihi: endDate,
    tekrarDurumu: selectType,
  };

  return (
    <div>
      <Calendar
        onSelect={handleSelect}
        cellRender={dateCellRender}
        value={selectedDay}
      />
      <Modal
        title={isSelectModal ? "Add Event" : "Update Event"}
        open={showEventModal}
        onCancel={closeModal}
        className="modal"
        footer={[
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "green", borderColor: "green" }}
            /* onClick={isSelectModal ? addEvent(newEvent) : updateEvent} */
          >
            {isSelectModal ? "Add" : "Update"}
          </Button>,
          !isSelectModal && (
            <Button
              key="delete"
              type="primary"
              style={{ backgroundColor: "red", borderColor: "red" }}
              /* onClick={deleteEvent} */
            >
              Delete
            </Button>
          ),
        ].filter(Boolean)}
      >
        <div className="event-input">
          <MdOutlineModeEditOutline className="event-icon" />
          <Input
            placeholder="Event Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ borderStartStartRadius: "0", borderEndStartRadius: "0" }}
          />
        </div>
        <div className="event-input">
          <MdDateRange className="event-icon" />
          <RangePicker
            defaultValue={isSelectModal ? [today, today] : [startDate, endDate]}
            format={dateFormat}
            className="range-picker"
            style={{ borderStartStartRadius: "0", borderEndStartRadius: "0" }}
          />
        </div>
        <div className="event-input">
          <MdAccessTime className="event-icon" />
          <TimePicker.RangePicker
            defaultValue={[today, today]}
            format="HH:mm"
            className="time-picker"
            style={{ borderStartStartRadius: "0", borderEndStartRadius: "0" }}
          />
        </div>

        <div className="event-input">
          <MdNotes className="desc-icon" />
          <Input.TextArea
            placeholder="Event Description"
            name="description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ borderStartStartRadius: "0", borderEndStartRadius: "0" }}
          />
        </div>

        <div className="event-input">
          <MdOutlinePeopleAlt className="event-icon" />
          <Input
            placeholder="Add Guests"
            name="guests"
            defaultValue={title}
            style={{ borderStartStartRadius: "0", borderEndStartRadius: "0" }}
          />
        </div>

        <div className="event-input">
          <MdEventRepeat className="event-icon" />
          <Dropdown menu={menuProps} className="dropdown">
            <Button>
              <Space>
                {selectType || "Select Repeat Type"}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarContext;
