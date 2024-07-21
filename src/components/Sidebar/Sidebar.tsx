import { Menu, MenuProps } from "antd";
import CreateEventButton from "../CreateEventButton/CreateEventButton";
import "./Sidebar.css";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'sub2',
    label: 'My Events',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: 'Settings',
    icon: <SettingOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
    ],
  },
  {
    key: 'grp',
    label: 'All Users',
    type: 'group',
    children: [
      { key: '13', label: 'User 1' },
      { key: '14', label: 'User 2' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <CreateEventButton />
      <Menu
        /* onClick={onClick} */
        style={{ width: 256 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </aside>
  );
}
