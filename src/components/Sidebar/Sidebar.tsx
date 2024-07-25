import React, { useEffect, useState } from "react";
import { Menu, MenuProps } from "antd";
import CreateEventButton from "../CreateEventButton/CreateEventButton";
import "./Sidebar.css";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import EventAct from "../../types/EventAct";
import { tumEtkinlikleriGetir } from "../../stores/CalendarStore";
import { tümKullanicilariGetir } from "../../stores/UserStore";
import UserAct from "../../types/UserAct";

type MenuItem = Required<MenuProps>['items'][number];

const initialItems: MenuItem[] = [
  {
    key: 'sub2',
    label: 'My Events',
    icon: <AppstoreOutlined />,
    children: [], // Etkinlikler burada listelenecek
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: 'Settings',
    icon: <SettingOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
    ],
  },
  {
    key: 'grp',
    label: 'All Users',
    type: 'group',
    children: [], // Kullanıcılar burada listelenecek
  },
];

export default function Sidebar() {
  const [events, setEvents] = useState<EventAct[]>([]);
  const [users, setUsers] = useState<UserAct[]>([]);
  const [items, setItems] = useState<MenuItem[]>(initialItems);

  useEffect(() => {
    const etkinlikleriCek = async () => {
      try {
        const fetchedEvents = await tumEtkinlikleriGetir();
        setEvents(fetchedEvents);
        setMyEventsMenuItems(fetchedEvents);
      } catch (error) {
        console.error("Etkinlikler getirilirken hata oluştu:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const fetchedUsers = await tümKullanicilariGetir();
        setUsers(fetchedUsers);
        setUsersMenuItems(fetchedUsers);
      } catch (error) {
        console.error("Kullanıcılar getirilirken hata oluştu:", error);
      }
    };

    etkinlikleriCek();
    fetchUsers();
  }, []);

  const setMyEventsMenuItems = (events: EventAct[]) => {
    setItems((prevItems) => {
      const myEventsItem = prevItems.find(item => item?.key === 'sub2');
      if (myEventsItem && 'children' in myEventsItem) {
        myEventsItem.children = events.map((event) => {
          const key = event.id ? event.id.toString() : "";
          return {
            key,
            label: event.baslik,
          };
        });
      }
      return [...prevItems];
    });
  };

  const setUsersMenuItems = (users: UserAct[]) => {
    setItems((prevItems) => {
      const usersItem = prevItems.find(item => item?.key === 'grp');
      if (usersItem && 'children' in usersItem) {
        usersItem.children = users.map((user) => {
          const key = user.id ? user.id.toString() : "";
          return {
            key,
            label: user.kullaniciAdi,
          };
        });
      }
      return [...prevItems];
    });
  };

  return (
    <aside className="sidebar">
      <CreateEventButton />
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub2", "grp"]}
        mode="inline"
        items={items}
      />
    </aside>
  );
}