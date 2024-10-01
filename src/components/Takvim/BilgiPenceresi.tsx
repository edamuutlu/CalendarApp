import React, { useState, useEffect } from "react";
import { Modal, Descriptions, Button } from "antd";
import Etkinlik from "../../tipler/Etkinlik";
import dayjs from "dayjs";
import { eklendigimEtkinlikleriGetir } from "../../yonetimler/KullaniciYonetimi";
import "../../assets/css/Takvim.css";
import { ConfigProvider } from "antd/lib";

interface BilgiPenceresiProps {
  bilgiPenceresiGorunurluk: boolean;
  setBilgiPenceresiGorunurluk: (visible: boolean) => void;
  seciliEtkinlikForm: Etkinlik | null;
  setseciliEtkinlik: React.Dispatch<React.SetStateAction<Etkinlik | null>>;
  etkinligiSeciliYap: (event: Etkinlik) => void;
}

const BilgiPenceresi = (props: BilgiPenceresiProps) => {
  const {
    bilgiPenceresiGorunurluk,
    setBilgiPenceresiGorunurluk,
    seciliEtkinlikForm,
    setseciliEtkinlik,
    etkinligiSeciliYap,
  } = props;

  const [eklendigimEtkinlikler, setEklendigimEtkinlikler] = useState<
    Etkinlik[]
  >([]);

  useEffect(() => {
    const fetchEklendigimEtkinlikler = async () => {
      const etkinlikler = await eklendigimEtkinlikleriGetir();
      setEklendigimEtkinlikler(etkinlikler);
    };

    fetchEklendigimEtkinlikler();
  }, []);

  if (!seciliEtkinlikForm) return null;

  const { baslik, aciklama, baslangicTarihi, bitisTarihi, tekrarDurumu, id } =
    seciliEtkinlikForm;

  const handleOk = () => {
    setBilgiPenceresiGorunurluk(false);
  };

  const handleCancel = () => {
    setBilgiPenceresiGorunurluk(false);
    setseciliEtkinlik(null);
  };

  const etkinlikEklendi = eklendigimEtkinlikler.some(
    (etkinlik) => etkinlik.id === id
  );

  return (
    <Modal
      title="Etkinlik Bilgileri"
      visible={bilgiPenceresiGorunurluk}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Başlık">{baslik}</Descriptions.Item>
        <Descriptions.Item label="Açıklama">{aciklama}</Descriptions.Item>
        <Descriptions.Item label="Başlangıç Tarihi">
          {dayjs(baslangicTarihi).format("YYYY-MM-DD HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Bitiş Tarihi">
          {dayjs(bitisTarihi).format("YYYY-MM-DD HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Tekrar Durumu">
          {tekrarDurumu || "Tekrar Yok"}
        </Descriptions.Item>
      </Descriptions>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}
      >
        {!etkinlikEklendi && (
          <Button
            type="primary"
            className="duzenle-buton"
            onClick={() => etkinligiSeciliYap(seciliEtkinlikForm)}
          >
            Etkinliği Düzenle
          </Button>        
        )}
      </div>
    </Modal>
  );
};

export default BilgiPenceresi;
