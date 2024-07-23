import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button } from "antd";
import "./Login.css";
import { handleLogin } from "../../stores/AuthStore";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const token = await handleLogin(username, password);
    if(token){
      navigate(`/home`);
    }else{
      alert("Username or password wrong.")
    } 
  };

  return (
    <div className="login-container">
      <Card title="LOGIN" bordered={true} className="login-card">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username:"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="default"
              onClick={() => navigate("/register")}
              htmlType="button"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
