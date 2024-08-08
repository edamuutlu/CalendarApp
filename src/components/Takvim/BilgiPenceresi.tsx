import React from "react";
import { Modal, Descriptions, Button } from "antd";
import Etkinlik from "../../tipler/Etkinlik";
import dayjs from "dayjs";

interface BilgiPenceresiProps {
  bilgiPenceresiGorunurluk: boolean;
  setBilgiPenceresiGorunurluk: (visible: boolean) => void;
  seciliEtkinlikForm: Etkinlik | null;
  etkinligiSeciliYap: (event: Etkinlik) => void; // Yeni prop olarak etkinliği düzenleme fonksiyonu
}

const BilgiPenceresi: React.FC<BilgiPenceresiProps> = ({
  bilgiPenceresiGorunurluk,
  setBilgiPenceresiGorunurluk,
  seciliEtkinlikForm,
  etkinligiSeciliYap,
}) => {
  if (!seciliEtkinlikForm) return null;

  const { baslik, aciklama, baslangicTarihi, bitisTarihi, tekrarDurumu } = seciliEtkinlikForm;

  const handleOk = () => {
    setBilgiPenceresiGorunurluk(false);
  };

  const handleCancel = () => {
    setBilgiPenceresiGorunurluk(false);
  };

  return (
    <Modal
      title="Etkinlik Bilgileri"
      visible={bilgiPenceresiGorunurluk}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null} // Kapat butonu eklemek istemiyorsanız bu satırı ekleyin
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
      <Button onClick={() => etkinligiSeciliYap(seciliEtkinlikForm)}>
        Etkinliği Düzenle
      </Button>
    </Modal>
  );
};

export default BilgiPenceresi;
