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
import "./CalendarContext.css";
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
import { EventAct } from "../../stores/EventStore";
import { tümKullanicilariGetir } from "../../stores/UserStore";
import UserAct from "../../types/UserAct";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

interface MenuItem {
  label: string;
  key: string;
}

const CalendarContext: React.FC = () => {
  const context = useContext(ContentContext);
  const [selectType, setSelectType] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserAct[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [baslangicSaati, setBaslangicSaati] = useState<Date | null>(null);
  const [bitisSaati, setBitisSaati] = useState<Date | null>(null);

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

  const handleGuestMenuClick = (e: { key: string; }) => {
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

  const {
    selectedDay,
    showEventModal,
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
    const fetchUsers = async () => {
      const allUsers = await tümKullanicilariGetir();
      setUsers(allUsers);
    };

    fetchUsers();
    fetchEvents();
  }, []);

  const handleFormSubmit = (values: {
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    timeRange: [dayjs.Dayjs, dayjs.Dayjs];
    text: string;
    title: string;
  }) => {
    console.log("values :>> ", values);
    const baslangicSaatiDate = values.timeRange[0].toDate();
    const bitisSaatiDate = values.timeRange[1].toDate();

    console.log("baslangicSaatiDate :>> ", baslangicSaatiDate);
    console.log("bitisSaatiDate :>> ", bitisSaatiDate);

    const startDate = selectedDay.toDate();
    const endDate = selectedDay.toDate();
    const startDateTime = new Date(startDate);
    console.log("startDate :>> ", startDate);
    console.log("endDate :>> ", endDate);
    console.log("startDateTime :>> ", startDateTime);
    startDateTime.setHours(
      baslangicSaatiDate.getHours(),
      baslangicSaatiDate.getMinutes(),
      baslangicSaatiDate.getSeconds()
    );
    const endDateTime = new Date(endDate);
    endDateTime.setHours(
      bitisSaatiDate.getHours(),
      bitisSaatiDate.getMinutes(),
      bitisSaatiDate.getSeconds()
    );

    const startDateTimeUTC = new Date(
      startDateTime.getTime() - startDateTime.getTimezoneOffset() * 60000
    );
    const endDateTimeUTC = new Date(
      endDateTime.getTime() - endDateTime.getTimezoneOffset() * 60000
    );

    const event: EventAct = {
      date: selectedDay.toDate(),
      baslik: values.title,
      aciklama: values.text,
      baslangicTarihi: startDateTimeUTC,
      bitisTarihi: endDateTimeUTC,
    };
    addEvent(event);
    closeModal();

    form.resetFields();
  };

  const handleFormUpdate = (values: {
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    timeRange: [dayjs.Dayjs, dayjs.Dayjs];
    text: string;
    title: string;
  }) => {
    const baslangicSaatiDate = values.timeRange[0].toDate();
    const bitisSaatiDate = values.timeRange[1].toDate();

    const startDate = selectedDay.toDate();
    const endDate = selectedDay.toDate();
    const startDateTime = new Date(startDate);
    startDateTime.setHours(
      baslangicSaatiDate.getHours(),
      baslangicSaatiDate.getMinutes(),
      baslangicSaatiDate.getSeconds()
    );
    const endDateTime = new Date(endDate);
    endDateTime.setHours(
      bitisSaatiDate.getHours(),
      bitisSaatiDate.getMinutes(),
      bitisSaatiDate.getSeconds()
    );

    const startDateTimeUTC = new Date(
      startDateTime.getTime() - startDateTime.getTimezoneOffset() * 60000
    );
    const endDateTimeUTC = new Date(
      endDateTime.getTime() - endDateTime.getTimezoneOffset() * 60000
    );
    const event: EventAct = {
      baslik: values.title,
      aciklama: values.text,
      baslangicTarihi: startDateTimeUTC,
      bitisTarihi: endDateTimeUTC,
    };
    updateEvent(event);
    closeModal();

    form.resetFields();
  };

  const tarihleriAl = (baslangıcTarihi: any, bitisTarihi: any) => {
    console.log("baslangıcTarihi :>> ", baslangıcTarihi);
    console.log("baslangıcTarihi :>> ", bitisTarihi);
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
    const baslangicSaatiDate = DayjsToDate(baslangıcSaati);
    const bitisSaatiDate = DayjsToDate(bitisSaati);
    setBaslangicSaati(baslangicSaatiDate);
    setBitisSaati(bitisSaatiDate);

    return {
      baslangicSaatiDate,
      bitisSaatiDate,
    };
  };

  const DayjsToDate = (dayjsObject: Dayjs): Date => {
    return dayjsObject.toDate();
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
            /* onClick={() => deleteEvent()} */
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
            initialValue={isSelectModal ? "" : title}
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <div className="event-input">
              <MdOutlineModeEditOutline className="event-icon" />
              <Input
                placeholder="Event Title"
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="dateRange"
            initialValue={[selectedDay, selectedDay]} /* isSelectModal ? [today,today] :  */
            rules={[
              { required: true, message: "Please select the date range!" },
            ]}
          >
            <div className="event-input">
              <MdDateRange className="event-icon" />
              <RangePicker
                format={dateFormat}
                onChange={(values) => tarihleriAl(values?.[0], values?.[1])}
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
          >
            <div className="event-input">
              <MdAccessTime className="event-icon" />
              <TimePicker.RangePicker
                defaultValue={isSelectModal ? [today,today] : [today, today]}
                format="HH:mm"
                needConfirm={false}
                onChange={(values) => saatleriAl(values?.[0], values?.[1])}
                className="time-picker"
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="text"
            initialValue={desc}
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <div className="event-input">
              <MdNotes className="desc-icon" />
              <Input.TextArea
                placeholder="Event Description"
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
                  {/* {isSelectModal ? "Select Repeat Type" : selectType} */}
                  {"Select Repeat Type"}
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
