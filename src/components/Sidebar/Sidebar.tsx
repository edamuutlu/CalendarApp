import { useContext, useEffect, useState } from "react";
import { Menu, MenuProps } from "antd";
import CreateEventButton from "../CreateEventButton/CreateEventButton";
import "./Sidebar.css";
import { AppstoreOutlined } from "@ant-design/icons";
import Etkinlik from "../../types/Etkinlik";
import { tumEtkinlikleriGetir } from "../../stores/CalendarStore";
import { tümKullanicilariGetir } from "../../stores/UserStore";
import Kullanici from "../../types/Kullanici";
import { ContentContext } from "../../context/ContentProvider";

type MenuItem = Required<MenuProps>['items'][number];

const initialItems: MenuItem[] = [
  {
    key: 'sub2',
    label: 'Etkinliklerim',
    icon: <AppstoreOutlined />,
    children: [], // Etkinlikler burada listelenecek
  },
  {
    type: 'divider',
  },
  {
    key: 'grp',
    label: 'Tüm Kullanıcılar',
    type: 'group',
    children: [], // Kullanıcılar burada listelenecek
  },
];

export default function Sidebar() {
  const [etkinlikler, setEtkinlikler] = useState<Etkinlik[]>([]);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [items, setItems] = useState<MenuItem[]>(initialItems);

  const context = useContext(ContentContext);

  if (!context) {
    throw new Error("CalendarContext must be used within a ContentProvider");
  }

  const { etkinlikPenceresiniGoster } = context;

  useEffect(() => {
    const etkinlikleriCek = async () => {
      try {
        const fetchedEvents = await tumEtkinlikleriGetir();
        setEtkinlikler(fetchedEvents);
        setMyEventsMenuItems(fetchedEvents);
      } catch (error) {
        console.error("Etkinlikler getirilirken hata oluştu:", error);
      }
    };

    const kullanicilariCek = async () => {
      try {
        const fetchedUsers = await tümKullanicilariGetir();
        setKullanicilar(fetchedUsers);
        setUsersMenuItems(fetchedUsers);
      } catch (error) {
        console.error("Kullanıcılar getirilirken hata oluştu:", error);
      }
    };

    etkinlikleriCek();
    kullanicilariCek();
  }, [etkinlikPenceresiniGoster]);

  const setMyEventsMenuItems = (events: Etkinlik[]) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const myEventsItem = newItems.find(item => item?.key === 'sub2');
      if (myEventsItem && 'children' in myEventsItem) {
        myEventsItem.children = events.map((event) => {
          const key = event.id ? event.id.toString() : "";
          return {
            key,
            label: event.baslik,
          };
        });
      }
      return newItems;
    });
  };

  const setUsersMenuItems = (users: Kullanici[]) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const usersItem = newItems.find(item => item?.key === 'grp');
      if (usersItem && 'children' in usersItem) {
        usersItem.children = users.map((user) => {
          const key = user.id ? user.id.toString() : "";
          return {
            key,
            label: user.kullaniciAdi,
          };
        });
      }
      return newItems;
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
