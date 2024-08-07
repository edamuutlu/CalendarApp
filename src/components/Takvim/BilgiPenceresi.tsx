import { useEffect, useState } from "react";
import Etkinlik from "../../tipler/Etkinlik";
import {
  Input,
  Modal,
  Select,
  Space,
  TimePicker,
  Form,
  DatePicker,
} from "antd";
import {
  MdAccessTime,
  MdDateRange,
  MdEventRepeat,
  MdNotes,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { UserOutlined } from "@ant-design/icons";
import Kullanici from "../../tipler/Kullanici";
import { etkinligeDavetliKullanicilariGetir } from "../../yonetimler/KullaniciYonetimi";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

interface BilgiPenceresiProps {
  etkinlik: Etkinlik[];
}

const BilgiPenceresi = (props: BilgiPenceresiProps) => {
  const {
    etkinlik
  } = props;

  const [modalAcikMi, setModalAcikMi] = useState(false);
  const [secilenKullaniciIsimleri, setSecilenKullaniciIsimleri] = useState<string[]>([]);

  console.log('etkinlik', etkinlik)

  useEffect(() => {
    const fetchDavetliKullanicilar = async () => {
      try {
        const davetliKullanicilar: Kullanici[] =
          await etkinligeDavetliKullanicilariGetir(Number(etkinlik[0].id));
        const secilenKullaniciIsimleri = davetliKullanicilar.map((user) => user.isim);
        setSecilenKullaniciIsimleri(secilenKullaniciIsimleri);
      } catch (error) {
        console.error("Davetli kullanıcıları getirirken hata oluştu:", error);
      }
    };

    fetchDavetliKullanicilar();
  }, [etkinlik]); // etkinlik.id değiştiğinde effect tetiklenir

  const bilgiPenceresiniKapat = () => {
    setModalAcikMi(false);
  };

  return (
    <Modal
      title={"Etkinlik Detayı"}
      open={modalAcikMi}
      onCancel={bilgiPenceresiniKapat}
      className="modal"
    >
      <Form>
        <Form.Item name="title">
          <div className="event-input">
            <MdOutlineModeEditOutline className="event-icon" />
            <Input
              placeholder="Etkinlik Başlığı"
              value={etkinlik[0].baslik}
              style={{
                borderStartStartRadius: "0",
                borderEndStartRadius: "0",
              }}
            />
          </div>
        </Form.Item>

        <Form.Item name="dateRange">
          <div className="event-input">
            <MdDateRange className="event-icon" />
            <RangePicker
              format={dateFormat}
              value={[
                dayjs(etkinlik[0].baslangicTarihi),
                dayjs(etkinlik[0].bitisTarihi),
              ]}
              disabled={true}
              className="range-picker"
              style={{
                borderStartStartRadius: "0",
                borderEndStartRadius: "0",
              }}
            />
          </div>
        </Form.Item>

        <Form.Item name="timeRange">
          <div className="event-input">
            <MdAccessTime className="event-icon" />
            <TimePicker.RangePicker
              needConfirm={false}
              format={"HH:mm"}
              value={[
                dayjs(etkinlik[0].baslangicTarihi),
                dayjs(etkinlik[0].bitisTarihi),
              ]}
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
              value={etkinlik[0].aciklama}
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
            />
          </Space>
        </div>

        <div className="event-input">
          <MdEventRepeat className="event-icon" />
          <Input
            placeholder="Tekrar Tipi"
            value={etkinlik[0].tekrarDurumu}
            style={{
              borderStartStartRadius: "0",
              borderEndStartRadius: "0",
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default BilgiPenceresi;
