import { Card, Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./Register.css";
import { handleRegister } from "../../stores/AuthStore";

const Register = () => {
  const [kullaniciAdi, setKullaniciAdi] = useState<string>("");
  const [isim, setIsim] = useState<string>("");
  const [soyisim, setSoyisim] = useState<string>("");
  const [sifre, setSifre] = useState<string>("");
  const [sifreTekrar, setSifreTekrar] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (sifre !== sifreTekrar) {
      message.error("Passwords do not match");
      return;
    }

    const newUserData = {
      KullaniciAdi: kullaniciAdi,
      Isim: isim,
      Soyisim: soyisim,
      KullaniciSifresi: sifre,
      KullaniciSifresiTekrar: sifreTekrar
    };

    await handleRegister(newUserData);

    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="login-container">
      <Card title="Kayıt Ol" bordered={true} className="login-card">
        <Form layout="vertical">
          <Form.Item label="Kullanıcı Adı:" name="kullaniciAdi">
            <Input
              placeholder="Kullanıcı Adı"
              required
              onChange={(e) => setKullaniciAdi(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="İsim" name="isim">
            <Input
              placeholder="İsim"
              required
              onChange={(e) => setIsim(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Soyisim:" name="soyisim">
            <Input
              placeholder="Soyisim"
              required
              onChange={(e) => setSoyisim(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Şifre:" name="sifre">
            <Input.Password
              placeholder="Şifre"
              required
              onChange={(e) => setSifre(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Şifre Tekrar:" name="sifreTekrar">
            <Input.Password
              placeholder="Şifre Tekrar"
              required
              onChange={(e) => setSifreTekrar(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              onClick={handleSubmit}
              htmlType="button"
            >
              Register
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="default"
              onClick={() => navigate("/")}
              htmlType="button"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
