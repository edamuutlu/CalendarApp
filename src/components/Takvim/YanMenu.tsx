import { useEffect, useState } from "react";
import { Menu, MenuProps } from "antd";
import "../../assets/css/YanMenu.css";
import { AppstoreAddOutlined } from "@ant-design/icons";
import Etkinlik from "../../tipler/Etkinlik";
import { tumEtkinlikleriGetir } from "../../yonetimler/TakvimYonetimi";
import { tumKullanicilariGetir } from "../../yonetimler/KullaniciYonetimi";
import Kullanici from "../../tipler/Kullanici";
import EtkinlikOlusturButonu from "./EtkinlikOlusturButonu";

type MenuItem = Required<MenuProps>["items"][number];

const initialItems: MenuItem[] = [
  {
    key: "sub2",
    label: "Etkinliklerim",
    icon: <AppstoreAddOutlined />,
    children: [], // Etkinlikler burada listelenecek
  },
  {
    type: "divider",
  },
  {
    key: "grp",
    label: "Tüm Kullanıcılar",
    type: "group",
    children: [], // Kullanıcılar burada listelenecek
  },
];

interface YanMenuProps {
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  setDahaOncePencereSecildiMi: React.Dispatch<React.SetStateAction<boolean>>;
}

const YanMenu = (props: YanMenuProps) => {
  const {
    setEtkinlikPenceresiniGoster,
    setDahaOncePencereSecildiMi,
  } = props;

  const [etkinlikler, setEtkinlikler] = useState<Etkinlik[]>([]);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [items, setItems] = useState<MenuItem[]>(initialItems);

  useEffect(() => {
    const etkinlikleriAl = async () => {
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
        const fetchedUsers = await tumKullanicilariGetir();
        setKullanicilar(fetchedUsers);
        setUsersMenuItems(fetchedUsers);
      } catch (error) {
        console.error("Kullanıcılar getirilirken hata oluştu:", error);
      }
    };

    etkinlikleriAl();
    kullanicilariCek();
  }, [etkinlikler]);

  const setMyEventsMenuItems = (events: Etkinlik[]) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const myEventsItem = newItems.find((item) => item?.key === "sub2");
      if (myEventsItem && "children" in myEventsItem) {
        myEventsItem.children = events.length > 0
          ? events.map((event) => {
            const key = event.id ? event.id.toString() : "";
            return {
              key,
              label: event.baslik,
            };
          })
          : [{ key: "no-events", label: "Etkinlik yok" }];
      }
      return newItems;
    });
  };

  const setUsersMenuItems = (users: Kullanici[]) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const usersItem = newItems.find((item) => item?.key === "grp");
      if (usersItem && "children" in usersItem) {
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
      <EtkinlikOlusturButonu
        setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
        setDahaOncePencereSecildiMi={setDahaOncePencereSecildiMi}
      />
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub2", "grp"]}
        mode="inline"
        items={items}
      />
    </aside>
  );
};

export default YanMenu;
