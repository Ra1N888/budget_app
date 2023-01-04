import React, { useState } from 'react';
import './style.css'; // used to set logo style
import {
  EditOutlined,
  SettingOutlined,
  LineChartOutlined,
  DollarCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { Link } from "react-router-dom";


const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="logo">processBar</div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
      </Sider>
  );
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const link_1 = <Link to='/'>Home</Link>
const link_2 = <Link to='/records'>Record</Link>
const link_3 = <Link to='/analysis'>Analysis</Link>
const link_4 = <Link to='/setting'>Setting</Link>

const items: MenuItem[] = [
  getItem(link_1, '1', <EditOutlined /> ),
  getItem('Transactions', 'sub1', <DollarCircleOutlined />, [
    getItem(link_2, '2', <UnorderedListOutlined />),
    getItem(link_3, '3', <LineChartOutlined />),
  ]),
  getItem(link_4, '4', <SettingOutlined />),
];

export default Sidebar;