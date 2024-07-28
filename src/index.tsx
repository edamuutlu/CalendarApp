import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from 'antd';
import tr_TR from 'antd/locale/tr_TR';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ConfigProvider locale={tr_TR}>
        <App />
    </ConfigProvider>
  </React.StrictMode>
);
