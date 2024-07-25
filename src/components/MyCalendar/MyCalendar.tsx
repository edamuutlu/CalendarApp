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
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import {
  MdOutlineModeEditOutline,
  MdDateRange,
  MdAccessTime,
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

const TekrarEnumToString = {
  [TekrarEnum.hic]: "Does not repeat",
  [TekrarEnum.herGun]: "Daily",
  [TekrarEnum.herHafta]: "Every Week",
  [TekrarEnum.herAy]: "Every month",
  [TekrarEnum.herYil]: "Every year",
};

const CalendarContext: React.FC = () => {
  const context = useContext(ContentContext);
  
  const [startTime, setStartTime] = useState<Dayjs>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs>(dayjs());
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
    const keyAsNumber = Number(e.key);
    const selectedItem = items.find((item) => item.key === keyAsNumber);

    if (selectedItem) {
      message.info(`Selected: ${selectedItem.label}`);
      setSelectType(keyAsNumber as TekrarEnum); // Type assertion
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

  const { dahaOncePencereSecilmediMi, etkinlikData } = context;

  const {
    seciliGun,
    setSeciliGun,
    etkinlikPenceresiniGoster,
    setEtkinlikPenceresiniGoster,
    baslik,
    setBaslik,
    aciklama,
    setAciklama,
    baslangicTarihi,
    setBaslangicTarihi,
    bitisTarihi,
    setBitisTarihi,
    handleSelect,
    etkinlikPencereKapat,
    fetchEvents,
  } = context;

  const {
    etkinlikEkle: addEventToStore,
    etkinlikGuncelle: updateEventInStore,
    etkinlikSil: deleteEventFromStore,
  } = useEventStore();

  const etkinlikEkle = async (event: EventAct) => {
    try {
      await addEventToStore(event);
      await fetchEvents();
    } catch (error) {
      console.error("Etkinlik eklenirken hata oluştu:", error);
    }

    etkinlikPencereKapat();
    setBaslik("");
    setAciklama("");
  };

  const etkinlikGuncelle = async (event: EventAct) => {
    try {
      await updateEventInStore(event);
      await fetchEvents();
    } catch (error) {
      console.error("Etkinlik güncellenirken hata oluştu:", error);
    }

    etkinlikPencereKapat();
    setBaslik("");
    setAciklama("");
  };

  const etkinlikSil = async (eventId: number) => {
    try {
      await deleteEventFromStore(eventId);
      await fetchEvents();
    } catch (error) {
      console.error("Etkinlik silinirken hata oluştu:", error);
    }

    etkinlikPencereKapat();
    setBaslik("");
    setAciklama("");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await tümKullanicilariGetir();
      setUsers(allUsers);
    };

    fetchUsers();
    fetchEvents();
  }, [seciliGun]);

  const dateCellRender = (value: Dayjs) => {
    if (!etkinlikData) {
      return <ul style={{ padding: "0px 4px" }}></ul>;
    }

    const dayEvents = etkinlikData.filter((event) =>
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
    const startDateFormat = DayjsToDate(baslangicTarihi);
    const endDateFormat = DayjsToDate(bitisTarihi);
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
      date: seciliGun.toDate(),
      baslik: baslik,
      aciklama: aciklama,
      baslangicTarihi: startDateFormat,
      bitisTarihi: endDateFormat,
      tekrarDurumu: selectType ?? TekrarEnum.hic,
    };

    // Call addEvent or any relevant function
    etkinlikEkle(event);
    etkinlikPencereKapat();

    // Reset the form
    form.resetFields();
  };

  const handleFormUpdate = () => {
    const dayEvents = etkinlikData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(seciliGun, "day")
    );
    const startDateFormat = DayjsToDate(baslangicTarihi);
    const endDateFormat = DayjsToDate(bitisTarihi);
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
      date: seciliGun.toDate(),
      baslik: baslik,
      aciklama: aciklama,
      baslangicTarihi: startDateFormat,
      bitisTarihi: endDateFormat,
      tekrarDurumu: selectType ?? TekrarEnum.hic,
    };
    etkinlikGuncelle(event);
    etkinlikPencereKapat();

    form.resetFields();
  };

  const handleEventDelete = () => {
    const dayEvents = etkinlikData.filter((event) =>
      dayjs(event.baslangicTarihi).isSame(seciliGun, "day")
    );
    etkinlikSil(Number(dayEvents[0].id));
    etkinlikPencereKapat();

    form.resetFields();
  };

  const DayjsToDate = (dayjsObject: Dayjs): Date => {
    return dayjsObject.toDate();
  };

  const tarihleriAl = (baslangıcTarihi: any, bitisTarihi: any) => {
    console.log("baslangıcTarihi :>> ", baslangıcTarihi);
    console.log("bitisTarihi :>> ", bitisTarihi);
    setBaslangicTarihi(baslangıcTarihi);
    setBitisTarihi(bitisTarihi);
    console.log("startT", baslangicTarihi);
    console.log("endT", bitisTarihi);
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
        value={seciliGun}
      />
      <Modal
        title={dahaOncePencereSecilmediMi ? "Add Event" : "Update Event"}
        open={etkinlikPenceresiniGoster}
        onCancel={etkinlikPencereKapat}
        className="modal"
        footer={[
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "green", borderColor: "green" }}
            onClick={() => form.submit()}
          >
            {dahaOncePencereSecilmediMi ? "Add" : "Update"}
          </Button>,
          !dahaOncePencereSecilmediMi && (
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
          onFinish={dahaOncePencereSecilmediMi ? handleFormSubmit : handleFormUpdate}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <div className="event-input">
              <MdOutlineModeEditOutline className="event-icon" />
              <Input
                placeholder="Event Title"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
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
              dahaOncePencereSecilmediMi ? [seciliGun, dayjs()] : [baslangicTarihi, bitisTarihi]
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
                  dahaOncePencereSecilmediMi ? [seciliGun, dayjs()] : [baslangicTarihi, bitisTarihi]
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
              dahaOncePencereSecilmediMi ? [dayjs(), dayjs()] : [startTime, endTime]
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
                  dahaOncePencereSecilmediMi ? [dayjs(), dayjs()] : [startTime, endTime]
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
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </div>
          </Form.Item>

          <div className="event-input">
            <UserOutlined className="event-icon" />
            <Dropdown menu={guestMenuProps} className="dropdown">
              <Button>
                <Space>
                  {dahaOncePencereSecilmediMi ? "Add Guests" : selectedGuest }
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
                  {dahaOncePencereSecilmediMi
                    ? "Select Repeat Type"
                    : TekrarEnumToString[selectType ?? TekrarEnum.hic]}
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
