import { DownOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  Modal,
  Space,
  Form,
  Select,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
  MdDateRange,
  MdEventRepeat,
  MdNotes,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import {
  etkinlikEkle,
  etkinlikGuncelle,
  etkinlikSil,
  TekrarEnum,
} from "../../yonetimler/EtkinlikYonetimi";
import Kullanici from "../../tipler/Kullanici";
import { MenuProps } from "antd/lib";
import Etkinlik from "../../tipler/Etkinlik";
import {
  etkinligeDavetliKullanicilariGetir,
  etkinligeKullaniciEkle,
  EtkinligeKullaniciEkleRequest,
  EtkinliktenDavetliKullanicilariSilRequest,
  etkinliktenKullaniciSil,
} from "../../yonetimler/KullaniciYonetimi";
import type { SelectProps } from "antd";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";
import "../../assets/css/Takvim.css";
const { RangePicker } = DatePicker;

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

interface MenuItem {
  label: string;
  key: TekrarEnum;
}

interface EtkinlikPenceresiProps {
  seciliGun: Dayjs;
  etkinlikPenceresiniGoster: boolean;
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  etkinlikleriAl: () => Promise<Etkinlik[]>;
  dahaOncePencereSecildiMi: boolean;
  acilanEtkinlikPencereTarihi: Dayjs;
  setDahaOncePencereSecildiMi: React.Dispatch<React.SetStateAction<boolean>>;
  tumKullanicilar: Kullanici[];
  /* seciliEtkinlikForm: Etkinlik | null; */
}

const EtkinlikPenceresi = (props: EtkinlikPenceresiProps) => {
  const {
    seciliGun,
    etkinlikPenceresiniGoster,
    setEtkinlikPenceresiniGoster,
    etkinlikleriAl,
    dahaOncePencereSecildiMi,
    acilanEtkinlikPencereTarihi,
    setDahaOncePencereSecildiMi,
    tumKullanicilar,/* 
    seciliEtkinlikForm, */
  } = props;
  
  const [form] = Form.useForm();
  const [ilkAcilisMi, setIlkAcilisMi] = useState(false);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [secilenKullanicilar, setSecilenKullanicilar] = useState<Kullanici[]>([]);
  const [secilenKullaniciIsimleri, setSecilenKullaniciIsimleri] = useState<string[]>([]);

  const [baslik, setBaslik] = useState("");
  const [tekrarTipi, setTekrarTipi] = useState<TekrarEnum | undefined>(undefined);
  const [baslangicTarihi, setBaslangicTarihi] = useState<Dayjs>(dayjs());
  const [bitisTarihi, setBitisTarihi] = useState<Dayjs>(dayjs());
  const [aciklama, setAciklama] = useState("");

  // Tekrar Durumu Ayarları Başlangıç
  const items: MenuItem[] = [
    {
      label: "Tekrar Yok",
      key: TekrarEnum.hic,
    },
    {
      label: "Her Gün",
      key: TekrarEnum.herGun,
    },
    {
      label: `Her Hafta`,
      key: TekrarEnum.herHafta,
    },
    {
      label: `Her Ay`,
      key: TekrarEnum.herAy,
    },
    {
      label: `Her Yıl`,
      key: TekrarEnum.herYil,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const keyAsNumber = Number(e.key);
    const selectedItem = items.find((item) => item.key === keyAsNumber);

    if (selectedItem) {
      message.info(`Selected: ${selectedItem.label}`);
      setTekrarTipi(keyAsNumber as TekrarEnum);
    }
  };

  const menuProps = {
    items: items.map((item) => ({ key: item.key, label: item.label })),
    onClick: handleMenuClick,
  };
  // Tekrar Durumu Ayarları Bitiş

  // Davetli Kullanıcı Durumu Ayarları Başlangıç
  const options: SelectProps["options"] = [];

  kullanicilar.map((kullanici) => {
    options.push({
      label: kullanici.isim,
      value: kullanici.isim,
    });
  });

  const handleChange = (value: string[]) => {
    const selectedUsers = value
      .map((user) => kullanicilar.find((item) => item.isim === user))
      .filter((user): user is Kullanici => user !== undefined);
    setSecilenKullanicilar(selectedUsers);
    const secilenKullaniciIsimleri = selectedUsers.map((user) => user.isim);
    setSecilenKullaniciIsimleri(secilenKullaniciIsimleri);
  };
  // Davetli Kullanıcı Durumu Ayarları Bitiş

  const gununEtkinlikleri = async():  Promise<Etkinlik[]> => {
    const data: Etkinlik[] = await etkinlikleriAl();
    return data.filter((event) => {
      const startDate = dayjs(event.baslangicTarihi);
      const endDate = dayjs(event.bitisTarihi);
      const currentDate = dayjs(acilanEtkinlikPencereTarihi);

      return currentDate.isSame(startDate, "day") ||
        currentDate.isSame(endDate, "day") ||
        currentDate.isBetween(startDate, endDate, "day", "[]");
    });
  };

  const etkinlikPenceresiniAc = async () => {
    const etkinlikler: Etkinlik[] = await gununEtkinlikleri();

    if (etkinlikler.length > 0) {
      for (const etkinlik of etkinlikler) {

        const startDate = dayjs(etkinlik.baslangicTarihi);
        const endDate = dayjs(etkinlik.bitisTarihi);

        // Tarih karşılaştırma işlemi
        const isInBetween = acilanEtkinlikPencereTarihi.isSame(startDate, 'day') ||
          acilanEtkinlikPencereTarihi.isSame(endDate, 'day') ||
          (acilanEtkinlikPencereTarihi.isAfter(startDate, 'day') && acilanEtkinlikPencereTarihi.isBefore(endDate, 'day'));

        if (isInBetween) {
          const davetliKullanicilar: Kullanici[] =
            await etkinligeDavetliKullanicilariGetir(Number(etkinlik.id));
          const secilenKullaniciIsimleri = davetliKullanicilar.map(
            (user) => user.isim
          );
          setSecilenKullaniciIsimleri(secilenKullaniciIsimleri);
          setBaslik(etkinlik.baslik);
          setBaslangicTarihi(dayjs(etkinlik.baslangicTarihi));
          setBitisTarihi(dayjs(etkinlik.bitisTarihi));
          setAciklama(etkinlik.aciklama);
          setTekrarTipi(etkinlik.tekrarDurumu);
          setDahaOncePencereSecildiMi(false); /* update butonunun açılması için */
        } else {
          setBaslangicTarihi(dayjs(seciliGun));
          setDahaOncePencereSecildiMi(true);
        }
      }
    } else {
      setBaslangicTarihi(dayjs(seciliGun));
      setDahaOncePencereSecildiMi(true);
    }
    setEtkinlikPenceresiniGoster(true);
  };

  useEffect(() => {
    setKullanicilar(tumKullanicilar);
    if (acilanEtkinlikPencereTarihi && ilkAcilisMi) {
      etkinlikPenceresiniAc();
    }
    setIlkAcilisMi(true);
  }, [acilanEtkinlikPencereTarihi]);
  
  const etkinlikEkleyeBas = async () => {
    // Etkinlik nesnesini oluştur
    const event: Etkinlik = {
      date: seciliGun.toDate(),
      baslik: baslik,
      aciklama: aciklama,
      baslangicTarihi: DayjsToDate(baslangicTarihi),
      bitisTarihi: DayjsToDate(bitisTarihi),
      tekrarDurumu: tekrarTipi ?? TekrarEnum.hic,
    };

    try {
      await etkinlikEkle(event);
      const etkinlikler: Etkinlik[] = await gununEtkinlikleri();
      // İd'yi number'a çevirme veya uygun tipi kullanma
      const etkinlikId = Number(etkinlikler[0].id);
      // davetliKullanici'nın null olmadığından emin olma
      if (secilenKullanicilar) {
        const selectedUserIds = secilenKullanicilar.map((user) => user.id);
        const request: EtkinligeKullaniciEkleRequest = {
          etkinlikId: etkinlikId,
          kullaniciIds: selectedUserIds,
        };
        await etkinligeKullaniciEkle(request);
      } else {
        console.error("Davetli kullanıcı null veya undefined.");
      }
    } catch (error) {
      console.error("Etkinlik eklenirken hata oluştu:", error);
    }

    // Etkinlik penceresini kapat ve formu sıfırla
    etkinlikPencereKapat();
  };
  
  const etkinlikGuncelleyeBas = async () => {
    const etkinlikler: Etkinlik[] = await gununEtkinlikleri();

    const event: Etkinlik = {
      id: etkinlikler[0].id,
      date: seciliGun.toDate(),
      baslik: baslik,
      aciklama: aciklama,
      baslangicTarihi: DayjsToDate(baslangicTarihi),
      bitisTarihi: DayjsToDate(bitisTarihi),
      tekrarDurumu: tekrarTipi ?? TekrarEnum.hic,
    };
    try {
      const etkinlikler: Etkinlik[] = await gununEtkinlikleri();

      // İd'yi number'a çevirme veya uygun tipi kullanma
      const etkinlikId = Number(etkinlikler[0].id);
      // davetliKullanici'nın null olmadığından emin olma
      if (secilenKullanicilar) {
        const selectedUserIds = secilenKullanicilar.map((user) => user.id);
          const request: EtkinliktenDavetliKullanicilariSilRequest = {
          /*const request: EtkinligeDavetliKullanicilariGuncelleRequest = { */
          etkinlikId: etkinlikId,
          kullaniciIds: selectedUserIds, // `davetliKullanici`'yı `string` olarak belirtme
        };
        await etkinliktenKullaniciSil(request);
        await etkinlikGuncelle(event);
        await etkinligeKullaniciEkle(request);
        /* await etkinligeDavetliKullanicilariGuncelle(request); */
        await etkinlikleriAl();
      } else {
        console.error("Davetli kullanıcı null veya undefined.");
      }
    } catch (error) {
      console.error("Etkinlik eklenirken hata oluştu:", error);
    }

    etkinlikPencereKapat();
  };

  const etkinlikSileBas = async () => {
    try {
      const data: Etkinlik[] = await etkinlikleriAl();
      const etkinlikler: Etkinlik[] = await gununEtkinlikleri();

      // İd'yi number'a çevirme veya uygun tipi kullanma
      const etkinlikId = Number(etkinlikler[0].id);

      // davetliKullanici'nın null olmadığından emin olma
      if (secilenKullanicilar) {
        const selectedUserIds = secilenKullanicilar.map((user) => user.id);
        const request: EtkinliktenDavetliKullanicilariSilRequest = {
          etkinlikId: etkinlikId,
          kullaniciIds: selectedUserIds, // `davetliKullanici`'yı `string` olarak belirtme
        };
        await etkinliktenKullaniciSil(request);
        await etkinlikSil(Number(etkinlikler[0].id));
        await etkinlikleriAl();
      } else {
        console.error("Davetli kullanıcı null veya undefined.");
      }
    } catch (error) {
      console.error("Etkinlik eklenirken hata oluştu:", error);
    }

    etkinlikPencereKapat();
  };

  const tarihleriAl = (baslangıcTarihi: any, bitisTarihi: any) => {
    setBaslangicTarihi(baslangıcTarihi);
    setBitisTarihi(bitisTarihi);
  };

  const DayjsToDate = (dayjsObject: Dayjs): Date => {
    return dayjsObject.add(3, "hour").toDate();
  };

  const etkinlikPencereKapat = () => {
    setBaslik("");
    setAciklama("");
    setBaslangicTarihi(dayjs());
    setBitisTarihi(dayjs());
    setSecilenKullaniciIsimleri([]);
    setTekrarTipi(0);
    setEtkinlikPenceresiniGoster(false);
  };

  return (
    <Modal
      title={
        dahaOncePencereSecildiMi ? " Etkinlik Ekle" : "Etkinlik Güncelle"
      }
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
          {dahaOncePencereSecildiMi ? "Ekle" : "Güncelle"}
        </Button>,
        !dahaOncePencereSecildiMi && (
          <Button
            key="delete"
            type="primary"
            style={{ backgroundColor: "red", borderColor: "red" }}
            onClick={() => etkinlikSileBas()}
          >
            Sil
          </Button>
        ),
      ].filter(Boolean)}
    >
      <Form
        form={form}
        onFinish={
          dahaOncePencereSecildiMi ? etkinlikEkleyeBas : etkinlikGuncelleyeBas
        }
      >
        <Form.Item name="title">
          <div className="event-input">
            <MdOutlineModeEditOutline className="event-icon" />
            <Input
              placeholder="Etkinlik Başlığı"
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              style={{
                borderStartStartRadius: "0",
                borderEndStartRadius: "0",
              }}
            />
          </div>
        </Form.Item>

        <div className="event-input-wrapper">
          <div className="event-input">
            <MdEventRepeat className="event-icon" />
            <Dropdown menu={menuProps} className="dropdown">
              <Button>
                <Space>
                {items.find((item) => item.key === (tekrarTipi ?? TekrarEnum.hic))?.label ?? "Tekrar Yok"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>

        <Form.Item
          name="dateRange"
          initialValue={
            dahaOncePencereSecildiMi 
              ? [seciliGun, seciliGun]
              : [baslangicTarihi, bitisTarihi]
          }
          rules={[
            { required: true, message: "Lütfen tarih aralığını giriniz!" },
          ]}
        >
          <div className="event-input">
            <MdDateRange className="event-icon" />
            <RangePicker
              showTime
              format="YYYY/MM/DD HH:mm"
              /* needConfirm={false} */
              onChange={(values) => tarihleriAl(values?.[0], values?.[1])}
              minDate={
                dahaOncePencereSecildiMi
                  ? dayjs(seciliGun, "YYYY/MM/DD")
                  : dayjs(baslangicTarihi, "YYYY/MM/DD")
              }
              maxDate={
                tekrarTipi === 2
                  ? dayjs(seciliGun).add(6, "day")
                  : tekrarTipi === 3
                    ? dayjs(seciliGun).add(29, "day")
                    : tekrarTipi === 4
                      ? dayjs(seciliGun).add(364, "day")
                      : dayjs(baslangicTarihi, "YYYY/MM/DD")
              }
              value={[baslangicTarihi, bitisTarihi]}
              disabled={tekrarTipi === 1}
              className="range-picker"
              style={{
                borderStartStartRadius: "0",
                borderEndStartRadius: "0",
              }}
            />
          </div>
        </Form.Item>

        <Form.Item name="text">
          <div className="event-input">
            <MdNotes className="desc-icon" />
            <Input.TextArea
              placeholder="Etkinlik Açıklaması"
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
          <Space style={{ width: "100%" }} direction="vertical">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Please select"
              value={secilenKullaniciIsimleri}
              onChange={handleChange}
              options={options}
            />
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default EtkinlikPenceresi;