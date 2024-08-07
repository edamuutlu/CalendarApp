import { DownOutlined } from "@ant-design/icons";
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
  Popconfirm,
  Menu,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
  MdDateRange,
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
import "../../assets/css/Takvim.css";

const { RangePicker } = DatePicker;

interface MenuItem {
  label: string;
  key: TekrarEnum;
}

interface EtkinlikPenceresiProps {
  seciliGun: Dayjs;
  etkinlikPenceresiniGoster: boolean;
  setEtkinlikPenceresiniGoster: React.Dispatch<React.SetStateAction<boolean>>;
  etkinlikleriAl: () => Promise<Etkinlik[]>;
  acilanEtkinlikPencereTarihi: Dayjs;
  setDahaOncePencereSecildiMi: React.Dispatch<React.SetStateAction<boolean>>;
  tumKullanicilar: Kullanici[];
  seciliEtkinlikForm: Etkinlik | null;
}

const EtkinlikPenceresi = (props: EtkinlikPenceresiProps) => {
  const {
    seciliGun,
    etkinlikPenceresiniGoster,
    setEtkinlikPenceresiniGoster,
    etkinlikleriAl,
    acilanEtkinlikPencereTarihi,
    setDahaOncePencereSecildiMi,
    tumKullanicilar,
    seciliEtkinlikForm,
  } = props;

  const [form] = Form.useForm();
  const [ilkAcilisMi, setIlkAcilisMi] = useState(false);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [secilenKullanicilar, setSecilenKullanicilar] = useState<Kullanici[]>([]);
  const [secilenKullaniciIsimleri, setSecilenKullaniciIsimleri] = useState<string[]>([]);

  useEffect(() => {
    if (seciliEtkinlikForm) {
      console.log("Selected Event:", seciliEtkinlikForm);
      form.setFieldsValue({
        title: seciliEtkinlikForm.baslik,
        text: seciliEtkinlikForm.aciklama,
        dateRange: [
          dayjs(seciliEtkinlikForm.baslangicTarihi),
          dayjs(seciliEtkinlikForm.bitisTarihi),
        ],
        timeRange: [
          dayjs(seciliEtkinlikForm.baslangicTarihi),
          dayjs(seciliEtkinlikForm.bitisTarihi),
        ],
      });
    } else {
      form.setFieldsValue({
        dateRange: [dayjs(seciliGun), dayjs(seciliGun)],
        timeRange: [dayjs(seciliGun), dayjs(seciliGun).add(1, "hour")],
      });
    }
  }, [seciliEtkinlikForm, form, etkinlikPenceresiniGoster]);

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

  const tekrarTipiSec: MenuProps["onClick"] = (e) => {
    const keyAsNumber = Number(e.key);
    const selectedItem = items.find((item) => item.key === keyAsNumber);

    if (selectedItem) {
      message.info(`Selected: ${selectedItem.label}`);
      form.setFieldValue("tekrarDurumu", keyAsNumber as TekrarEnum);
    }
  };

  const menuProps = {
    items: items.map((item) => ({ key: item.key, label: item.label })),
    onClick: tekrarTipiSec,
  };

  const options: SelectProps["options"] = [];

  kullanicilar.map((kullanici) => {
    options.push({
      label: kullanici.isim,
      value: kullanici.isim,
    });
  });

  const katilimciEkle = (value: string[]) => {
    const selectedUsers = value
      .map((user) => kullanicilar.find((item) => item.isim === user))
      .filter((user): user is Kullanici => user !== undefined);
    setSecilenKullanicilar(selectedUsers);
    const secilenKullaniciIsimleri = selectedUsers.map((user) => user.isim);
    setSecilenKullaniciIsimleri(secilenKullaniciIsimleri);
  };

  const gununEtkinlikleri = async (): Promise<Etkinlik[]> => {
    const data: Etkinlik[] = await etkinlikleriAl();
    return data.filter((event) => {
      const startDate = dayjs(event.baslangicTarihi);
      const endDate = dayjs(event.bitisTarihi);
      const currentDate = dayjs(acilanEtkinlikPencereTarihi);

      return (
        currentDate.isSame(startDate, "day") ||
        currentDate.isSame(endDate, "day") ||
        currentDate.isBetween(startDate, endDate, "day", "[]")
      );
    });
  };

  const etkinlikPenceresiniAc = async () => {
    const etkinlikler: Etkinlik[] = await gununEtkinlikleri();

    if (etkinlikler.length > 0) {
      for (const etkinlik of etkinlikler) {
        const startDate = dayjs(etkinlik.baslangicTarihi);
        const endDate = dayjs(etkinlik.bitisTarihi);

        const isInBetween =
          acilanEtkinlikPencereTarihi.isSame(startDate, "day") ||
          acilanEtkinlikPencereTarihi.isSame(endDate, "day") ||
          (acilanEtkinlikPencereTarihi.isAfter(startDate, "day") &&
            acilanEtkinlikPencereTarihi.isBefore(endDate, "day"));

        if (isInBetween) {
          const davetliKullanicilar: Kullanici[] =
            await etkinligeDavetliKullanicilariGetir(Number(etkinlik.id));
          const secilenKullaniciIsimleri = davetliKullanicilar.map(
            (user) => user.isim
          );
          setSecilenKullaniciIsimleri(secilenKullaniciIsimleri);
          form.setFieldValue("tekrarDurumu", etkinlik.tekrarDurumu);
          setDahaOncePencereSecildiMi(false);
        } else {
          setDahaOncePencereSecildiMi(true);
        }
      }
    } else {
      setDahaOncePencereSecildiMi(true);
    }
    setEtkinlikPenceresiniGoster(true);
  };

  useEffect(() => {
    setKullanicilar(tumKullanicilar);
    if (acilanEtkinlikPencereTarihi && ilkAcilisMi && etkinlikPenceresiniAc) {
      etkinlikPenceresiniAc();
    }
    setIlkAcilisMi(true);
  }, [acilanEtkinlikPencereTarihi]);

  const etkinlikKaydet = async (values: any) => {
    const baslangicTarihi = values.dateRange[0];
    const bitisTarihi = values.dateRange[1];

    let etkinlik: Etkinlik = {
      date: seciliGun.toDate(),
      baslangicTarihi: DayjsToDate(baslangicTarihi),
      bitisTarihi: DayjsToDate(bitisTarihi),
      baslik: values.title,
      aciklama: values.text,
      tekrarDurumu: values.tekrarDurumu,
    };

    try {
      console.log('seciliEtkinlikForm :>> ', seciliEtkinlikForm);
      console.log('etkinlik :>> ', etkinlik);
      if (seciliEtkinlikForm) {
        const etkinlikler: Etkinlik[] = await gununEtkinlikleri();
        etkinlik = { ...etkinlik, id: etkinlikler[0].id };
      
        // İd'yi number'a çevirme veya uygun tipi kullanma
        const etkinlikId = Number(etkinlikler[0].id);
        if (secilenKullanicilar) {
          const selectedUserIds = secilenKullanicilar.map((user) => user.id);
          const request: EtkinliktenDavetliKullanicilariSilRequest = {
            /*const request: EtkinligeDavetliKullanicilariGuncelleRequest = { */
            etkinlikId: etkinlikId,
            kullaniciIds: selectedUserIds, // `davetliKullanici`'yı `string` olarak belirtme
          };
          await etkinliktenKullaniciSil(request);
          await etkinlikGuncelle(etkinlik);
          await etkinligeKullaniciEkle(request);
          /* await etkinligeDavetliKullanicilariGuncelle(request); */
          await etkinlikleriAl();
        } else {
          console.error("Davetli kullanıcı null veya undefined.");
        }
      } else {
        await etkinlikEkle(etkinlik);
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
      }

      const etkinlikler = await etkinlikleriAl();
      console.log("Events:", etkinlikler);
    } catch (error) {
      console.error("Error adding/updating event:", error);
      message.error("Etkinlik eklenirken/güncellenirken hata oluştu.");
    }

    setEtkinlikPenceresiniGoster(false);
  };

  const DayjsToDate = (dayjsObject: Dayjs): Date => {
    return dayjsObject.add(3, "hour").toDate();
  };

  const etkinlikPencereKapat  = () => {
    form.resetFields();
    setSecilenKullaniciIsimleri([]);
    setEtkinlikPenceresiniGoster(false);
  };

  return (
    <Modal
      title={seciliEtkinlikForm ? "Etkinliği Düzenle" : "Etkinlik Ekle"}
      open={etkinlikPenceresiniGoster}
      onCancel={etkinlikPencereKapat }
      className="modal"
      footer={[
        <Button
          key="save"
          type="primary"
          onClick={() => {form.submit();}}
          style={{ backgroundColor: "green", borderColor: "green" }}
        >
          Kaydet
        </Button>,
        seciliEtkinlikForm && (
          <Popconfirm
            key="delete"
            title="Etkinliği silmek istediğinizden emin misiniz?"
            onConfirm={async () => {
              if (seciliEtkinlikForm) {
                await etkinlikSil(Number(seciliEtkinlikForm.id));
                message.success("Etkinlik silindi.");
                setEtkinlikPenceresiniGoster(false);
                await etkinlikleriAl();
              }
            }}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="primary"
              style={{ backgroundColor: "red", borderColor: "red" }}
            >
              Sil
            </Button>
          </Popconfirm>
        ),
      ].filter(Boolean)}

    >
      <Form form={form} onFinish={etkinlikKaydet} layout="vertical">
        <Form.Item
          name="title"
          label={
            <span>
              <MdOutlineModeEditOutline /> Başlık
            </span>
          }
          style={{
            borderStartStartRadius: "0",
            borderEndStartRadius: "0",
          }}
          rules={[{ required: true, message: "Başlık giriniz" }]}
        >
          <Input placeholder="Etkinlik Başlığı" />
        </Form.Item>
        <Form.Item
          name="text"
          label={
            <span>
              <MdNotes /> Açıklama
            </span>
          }
        >
          <Input.TextArea placeholder="Etkinlik Açıklaması" />
        </Form.Item>
        <Form.Item
          name="dateRange"
          label={
            <span>
              <MdDateRange /> Tarih Aralığı
            </span>
          }
          rules={[{ required: true, message: "Tarih aralığını seçiniz" }]}
        >
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current.isBefore(dayjs().startOf("day"))
            }
          />
        </Form.Item>
        <Form.Item label="Katılımcılar">
          <Select
            mode="multiple"
            placeholder="Katılımcı seçiniz"
            options={options}
            onChange={katilimciEkle}
            value={secilenKullaniciIsimleri}
          />
        </Form.Item>
        <Form.Item
          name="tekrarDurumu"
          label="Tekrar Durumu"
          rules={[{ required: true, message: "Lütfen tekrar durumunu seçin" }]}
        >
          <Dropdown overlay={<Menu {...menuProps} />}>
            <Button>
              {items.find(
                (item) => item.key === form.getFieldValue("tekrarDurumu")
              )?.label || "Tekrar Durumu Seçin"}{" "}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EtkinlikPenceresi;
