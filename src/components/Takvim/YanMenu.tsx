import { useEffect, useState } from "react";
import { Menu, MenuProps } from "antd";
import "../../assets/css/YanMenu.css";
import { AppstoreAddOutlined } from "@ant-design/icons";
import Etkinlik from "../../tipler/Etkinlik";
import EtkinlikOlusturButonu from "./EtkinlikOlusturButonu";
import dayjs from "dayjs";
import { aylikEtkinlikleriGetir } from "../../yonetimler/TakvimYonetimi";

type MenuItem = Required<MenuProps>["items"][number];

const initialItems: MenuItem[] = [
  {
    key: "sub2",
    label: "Etkinliklerim",
    icon: <AppstoreAddOutlined />,
    children: [],
  },
  {
    type: "divider",
  },
];

interface YanMenuProps {
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  setBilgiPenceresiGorunurluk: (visible: boolean) => void;
  setseciliEtkinlik: React.Dispatch<React.SetStateAction<Etkinlik | null>>;
  seciliGun: dayjs.Dayjs;
}

const YanMenu = (props: YanMenuProps) => {
  const { setEtkinlikPenceresiniGoster, setseciliEtkinlik, setBilgiPenceresiGorunurluk, seciliGun } = props;

  const [items, setItems] = useState<MenuItem[]>(initialItems);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const aylikEtkinlikler = await aylikEtkinlikleriGetir(seciliGun);
        setMyEventsMenuItems(aylikEtkinlikler);
      } catch (error) {
        console.error("Error fetching events:", error);
        setMyEventsMenuItems([]); 
      }
    };

    fetchEvents();
  }, [seciliGun]); 

  const setMyEventsMenuItems = (events: Etkinlik[]) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const myEventsItem = newItems.find((item) => item?.key === "sub2");
      if (myEventsItem && "children" in myEventsItem) {
        myEventsItem.children =
          events.length > 0
            ? events.map((event) => {
                const key = event.id ? event.id.toString() : "";
                return {
                  key,
                  label: (
                    <div>
                      <div className="event-title">{event.baslik}</div>
                      <div className="event-details">
                        {dayjs(event.baslangicTarihi).format("DD MMM HH:mm")} | {dayjs(event.bitisTarihi).format("DD MMM HH:mm")}
                        <br />
                        {event.aciklama}
                      </div>
                    </div>
                  ),
                  onClick: () => {
                    setseciliEtkinlik(event);
                    setBilgiPenceresiGorunurluk(true);
                  },
                };
              })
            : [{ key: "no-events", label: "Etkinlik yok" }];
      }
      return newItems;
    });
  };

  return (
    <aside className="sidebar">
      <EtkinlikOlusturButonu
        setEtkinlikPenceresiniGoster={setEtkinlikPenceresiniGoster}
        setseciliEtkinlik={setseciliEtkinlik}
      />
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub2", "grp"]}
        mode="inline"
        items={items}
        className="scrollable-menu"
      />
    </aside>
  );
};

export default YanMenu;
