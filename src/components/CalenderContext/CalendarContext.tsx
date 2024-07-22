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
    fetchEvents();
  }, []);

  const handleFormSubmit = (values: {
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    timeRange: [dayjs.Dayjs, dayjs.Dayjs];
    text: string;
    title: string;
  }) => {
    console.log('values :>> ', values);
    const baslangicSaatiDate = values.timeRange[0].toDate();
    const bitisSaatiDate = values.timeRange[1].toDate();

    console.log('baslangicSaatiDate :>> ', baslangicSaatiDate);
    console.log('bitisSaatiDate :>> ', bitisSaatiDate);

    const startDate = values.dateRange[0].toDate();
    const endDate = values.dateRange[1].toDate();
    const startDateTime = new Date(startDate);
    console.log('startDate :>> ', startDate);
    console.log('endDate :>> ', endDate);
    console.log('startDateTime :>> ', startDateTime);
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

    const startDate = values.dateRange[0].toDate();
    const endDate = values.dateRange[1].toDate();
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

  /* const tarihleriAl = (baslangıcTarihi: any, bitisTarihi: any) => {
    console.log('baslangıcTarihi :>> ', baslangıcTarihi);
    const baslangicTarihDate = DayjsToDate(baslangıcTarihi);
    const bitisTarihDate = DayjsToDate(bitisTarihi);

    return {
      baslangicTarihDate,
      bitisTarihDate,
    };
  };
  const saatleriAl = (baslangıcSaati: any, bitisSaati: any) => {
    const baslangicSaatiDate = DayjsToDate(baslangıcSaati);
    const bitisSaatiDate = DayjsToDate(bitisSaati);

    return {
      baslangicSaatiDate,
      bitisSaatiDate,
    };
  };

  const DayjsToDate = (dayjsObject: Dayjs): Date => {
    return dayjsObject.toDate();
  }; */

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
            /* onClick={deleteEvent()} */
            >
              Delete
            </Button>
          ),
        ].filter(Boolean)}
      >
        <Form form={form} onFinish={isSelectModal ? handleFormSubmit : handleFormUpdate}>
          <div className="event-input">
            <MdOutlineModeEditOutline className="event-icon" />
            <Form.Item
              name="title"
              initialValue={title}
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input
                placeholder="Event Title"
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </Form.Item>
          </div>
          <div className="event-input">
            <MdDateRange className="event-icon" />
            <Form.Item
              name="dateRange"
              initialValue={isSelectModal ? [today, today] : [startDate, endDate]}
              rules={[{ required: true, message: "Please select the date range!" }]}
            >
              <RangePicker
                format={dateFormat}
                /* onChange={(values) =>
                  tarihleriAl(values?.[0], values?.[1])
                } */
                className="range-picker"
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </Form.Item>
          </div>
          <div className="event-input">
            <MdAccessTime className="event-icon" />
            <Form.Item
              name="timeRange"
              initialValue={[today, today]}
              rules={[{ required: true, message: "Please select the time range!" }]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                /* onChange={(values) =>
                  saatleriAl(values?.[0], values?.[1])
                } */
                className="time-picker"
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </Form.Item>
          </div>

          <div className="event-input">
            <MdNotes className="desc-icon" />
            <Form.Item
              name="text"
              initialValue={desc}
              rules={[{ required: true, message: "Please input the description!" }]}
            >
              <Input.TextArea
                placeholder="Event Description"
                style={{
                  borderStartStartRadius: "0",
                  borderEndStartRadius: "0",
                }}
              />
            </Form.Item>
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
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarContext;
