import { Card, Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./Register.css";
import { handleRegister } from "../../stores/AuthStore";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    const newUserData = {
      KullaniciAdi: username,
      Isim: firstName,
      Soyisim: lastName,
      KullaniciSifresi: password,
      KullaniciSifresiTekrar: confirmPassword
    };

    await handleRegister(newUserData);

    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="login-container">
      <Card title="REGISTER" bordered={true} className="login-card">
        <Form layout="vertical">
          <Form.Item label="Username:" name="username">
            <Input
              placeholder="Username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="First Name" name="firstname">
            <Input
              placeholder="First Name"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Last Name:" name="lastname">
            <Input
              placeholder="Last Name"
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Confirm Password" name="confirmPassword">
            <Input.Password
              placeholder="Confirm Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
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
