/**
 * 导航组件
 */
import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  BuildOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/compile',
      icon: <BuildOutlined />,
      label: '编译管理',
    },
    {
      key: '/contract-comparison',
      icon: <FileTextOutlined />,
      label: '合同对比',
    },
    {
      key: '/contract-records',
      icon: <ProfileOutlined />,
      label: '合同记录',
    },
    {
      key: '/test',
      icon: <FileTextOutlined />,
      label: '测试',
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      onClick={handleMenuClick}
      items={menuItems}
      style={{ borderBottom: '1px solid #f0f0f0' }}
    />
  );
};

export default Navigation;
