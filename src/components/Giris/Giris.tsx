import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message } from "antd";
import "../../assets/css/Giris.css";
import { girisYap } from "../../yonetimler/KimlikYonetimi";

const Giris = () => {
  const [kullaniciAdi, setKullaniciAdi] = useState<string>("");
  const [sifre, setSifre] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const token = await girisYap(kullaniciAdi, sifre);
      if (token) {
        navigate(`/anasayfa`);
      } else {
        message.error("Kullanıcı adı veya şifre hatalı.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        message.error("Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
      } else if (error.message.includes("Network Error")) {
        message.error("Ağ hatası. İnternet bağlantınızı kontrol ediniz.");
      } else {
        message.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyiniz.");
      }
    }
  };


  return (
    <div className="login-container">
      <Card title="Giriş Yap" bordered={true} className="login-card">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Kullanıcı Adı:"
            name="kullaniciAdi"
            rules={[{ required: true, message: "Lütfen kullanıcı adınızı giriniz." }]}
          >
            <Input
              placeholder="Kullanıcı Adı"
              onChange={(e) => setKullaniciAdi(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Şifre:"
            name="sifre"
            rules={[{ required: true, message: "Lütfen şifrenizi giriniz." }]}
          >
            <Input.Password
              placeholder="Şifre"
              onChange={(e) => setSifre(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Giriş Yap
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="default"
              onClick={() => navigate("/kayit")}
              htmlType="button"
            >
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Giris;
