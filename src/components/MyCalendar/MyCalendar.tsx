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
  Form,
} from "antd";
import "./MyCalendar.css";
import { ContentContext } from "../../context/ContentProvider";
import dayjs, { Dayjs } from "dayjs";
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
import { TekrarEnum, useEventStore } from "../../stores/EventStore";
import { tümKullanicilariGetir } from "../../stores/UserStore";
import UserAct from "../../types/UserAct";
import EventAct from "../../types/EventAct";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

interface MenuItem {
  label: string;
  key: TekrarEnum;
}

const CalendarContext: React.FC = () => {
  const context = useContext(ContentContext);
  const [selectType, setSelectType] = useState<TekrarEnum | undefined>(
    undefined
  );
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserAct[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);

  const items: MenuItem[] = [
    {
      label: "Does not repeat",
      key: TekrarEnum.hic,
    },
    {
      label: "Daily",
      key: TekrarEnum.herGun,
    },
    {
      label: `Weekly on ${dayjs().format("dddd")}`,
      key: TekrarEnum.herHafta,
    },
    {
      label: `Monthly on the ${dayjs().format("Do")}`,
      key: TekrarEnum.herAy,
    },
    {
      label: `Annually on ${dayjs().format("MMM DD")}`,
      key: TekrarEnum.herYil,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    // Convert e.key to a number if it's a string
    const keyAsNumber = Number(e.key);
    const selectedItem = items.find((item) => item.key === keyAsNumber);

    if (selectedItem) {
      message.info(`Selected: ${selectedItem.label}`);
      setSelectType(keyAsNumber as TekrarEnum); // Type assertion
    }
  };

  const handleGuestMenuClick = (e: { key: string }) => {
    const selectedUser = users.find((user) => user.id === e.key);
    if (selectedUser) {
      message.info(`Selected: ${selectedUser.isim}`);
      setSelectedGuest(selectedUser.isim);
    }
  };

  const menuProps = {
    items: items.map((item) => ({ key: item.key, label: item.label })),
    onClick: handleMenuClick,
  };

  const guestMenuProps = {
    items: users.map((user) => ({ key: user.id, label: user.isim })),
    onClick: handleGuestMenuClick,
  };
  if (!context) {
    throw new Error("CalendarContext must be used within a ContentProvider");
  }

  const { isSelectModal, eventData } = context;

  const {
    addEvent: addEventToStore,
    updateEvent: updateEventInStore,
    deleteEvent: deleteEventFromStore,
  } = useEventStore();

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


  const {
    selectedDay,
    showEventModal,
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
    handleSelect,
    closeModal,
    fetchEvents,
  } = context;

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await tümKullanicilariGetir();
      setUsers(allUsers);
    };

    fetchUsers();
    fetchEvents();
  }, [selectedDay]);

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

  const handleFormSubmit = () => {
    const startDateFormat = DayjsToDate(startDate);
    const endDateFormat = DayjsToDate(endDate);
    const startTimeFormat = DayjsToDate(startTime);
    const endTimeFormat = DayjsToDate(endTime);

    startDateFormat.setHours(
      startTimeFormat.getHours(),
      startTimeFormat.getMinutes(),
      startTimeFormat.getSeconds()
    );

    endDateFormat.setHours(
      endTimeFormat.getHours(),
      endTimeFormat.getMinutes(),
      endTimeFormat.getSeconds()
    );

    // Create event object
    const event: EventAct = {
      date: selectedDay.toDate(),
      baslik: title,
      aciklama: desc,
      baslangicTarihi: startDateFormat,
      bitisTarihi: endDateFormat,
      tekrarDurumu: selectType ?? TekrarEnum.hic,
    };

    // Call addEvent or any relevant function
    addEvent(event);
    closeModal();

    // Reset the form
    form.resetFields();
  };

  const handleFormUpdate = () => {
    const dayEvents = eventData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(selectedDay, "day")
    );
    const startDateFormat = DayjsToDate(startDate);
    const endDateFormat = DayjsToDate(endDate);
    const startTimeFormat = DayjsToDate(startTime);
    const endTimeFormat = DayjsToDate(endTime);

    startDateFormat.setHours(
      startTimeFormat.getHours(),
      startTimeFormat.getMinutes(),
      startTimeFormat.getSeconds()
    );

    endDateFormat.setHours(
      endTimeFormat.getHours(),
      endTimeFormat.getMinutes(),
      endTimeFormat.getSeconds()
    );

    const event: EventAct = {
      id: dayEvents[0].id,
      date: selectedDay.toDate(),
      baslik: title,
      aciklama: desc,
      baslangicTarihi: startDateFormat,
      bitisTarihi: endDateFormat,
      tekrarDurumu: selectType ?? TekrarEnum.hic,
    };
    updateEvent(event);
    closeModal();

    form.resetFields();
  };

  const handleEventDelete = () => {
    const dayEvents = eventData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(selectedDay, "day")
    );
    deleteEvent(Number(dayEvents[0].id));
    closeModal();

    form.resetFields();
  };

  const DayjsToDate = (dayjsObject: Dayjs): Date => {
    return dayjsObject.toDate();
  };

  const tarihleriAl = (baslangıcTarihi: any, bitisTarihi: any) => {
    console.log("baslangıcTarihi :>> ", baslangıcTarihi);
    console.log("baslangıcTarihi :>> ", bitisTarihi);
    setStartDate(baslangıcTarihi);
    setEndDate(bitisTarihi);
    console.log("startT", startDate);
    console.log("endT", endDate);
    const baslangicTarihDate = DayjsToDate(baslangıcTarihi);
    const bitisTarihDate = DayjsToDate(bitisTarihi);

    return {
      baslangicTarihDate,
      bitisTarihDate,
    };
  };

  const saatleriAl = (baslangıcSaati: any, bitisSaati: any) => {
    console.log("baslangicSaati", baslangıcSaati);
    console.log("bitisSaati", bitisSaati);
    setStartTime(baslangıcSaati);
    setEndTime(bitisSaati);
    console.log("startT", startTime);
    console.log("endT", endTime);
    const baslangicSaatiDate = DayjsToDate(baslangıcSaati);
    const bitisSaatiDate = DayjsToDate(bitisSaati);

    return {
      baslangicSaatiDate,
      bitisSaatiDate,
    };
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
            onClick={() => form.submit()}
          >
            {isSelectModal ? "Add" : "Update"}
          </Button>,
          !isSelectModal && (
            <Button
              key="delete"
              type="primary"
              style={{ backgroundColor: "red", borderColor: "red" }}
              onClick={() => handleEventDelete()}
            >
              Delete
            </Button>
          ),
        ].filter(Boolean)}
      >
        <Form
          form={form}
          onFinish={isSelectModal ? handleFormSubmit : handleFormUpdate}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <div className="event-input">
              <MdOutlineModeEditOutline className="event-icon" />
              <Input
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="dateRange"
            initialValue={
              isSelectModal ? [selectedDay, dayjs()] : [startDate, endDate]
            }
            rules={[
              { required: true, message: "Please select the date range!" },
            ]}
          >
            <div className="event-input">
              <MdDateRange className="event-icon" />
              <RangePicker
                format={dateFormat}
                onChange={(values) => tarihleriAl(values?.[0], values?.[1])}
                defaultValue={
                  isSelectModal ? [selectedDay, dayjs()] : [startDate, endDate]
                }
                className="range-picker"
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="timeRange"
            initialValue={
              isSelectModal ? [dayjs(), dayjs()] : [startTime, endTime]
            }
            rules={[
              { required: true, message: "Please select the time range!" },
            ]}
          >
            <div className="event-input">
              <MdAccessTime className="event-icon" />
              <TimePicker.RangePicker
                needConfirm={false}
                onChange={(values) => saatleriAl(values?.[0], values?.[1])}
                defaultValue={
                  isSelectModal ? [dayjs(), dayjs()] : [startTime, endTime]
                }
                className="range-picker"
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="text"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <div className="event-input">
              <MdNotes className="desc-icon" />
              <Input.TextArea
                placeholder="Event Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </div>
          </Form.Item>

          <div className="event-input">
            <MdEventRepeat className="event-icon" />
            <Dropdown menu={guestMenuProps} className="dropdown">
              <Button>
                <Space>
                  {/* {isSelectModal ? "Add Guests" : selectedGuest } */}
                  {"Add Guests"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>

          <div className="event-input">
            <MdEventRepeat className="event-icon" />
            <Dropdown menu={menuProps} className="dropdown">
              <Button>
                <Space>
                  {isSelectModal
                    ? "Select Repeat Type"
                    : TekrarEnum[selectType ?? TekrarEnum.hic]}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarContext;
