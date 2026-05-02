import { Menu } from 'antd';
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  AppstoreOutlined, 
  SafetyCertificateOutlined,
  SettingOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

export const SiderApp = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
      type: 'divider',
      style: { margin: '16px 0', borderColor: 'rgba(255,255,255,0.05)' }
    },
    {
      key: 'posts-group',
      label: 'Nội dung',
      type: 'group',
      children: [
        {
          key: '/admin/posts',
          icon: <FileTextOutlined />,
          label: 'Quản lý bài viết',
        },
        {
          key: '/admin/posts/create',
          icon: <PlusCircleOutlined />,
          label: 'Viết bài mới',
        },
      ]
    },
    {
      key: 'system-group',
      label: 'Hệ thống',
      type: 'group',
      children: [
        {
          key: '/admin/users',
          icon: <UserOutlined />,
          label: 'Người dùng',
        },
        {
          key: '/admin/roles',
          icon: <SafetyCertificateOutlined />,
          label: 'Phân quyền',
        },
        {
          key: '/admin/categories',
          icon: <AppstoreOutlined />,
          label: 'Danh mục',
        },
        {
          key: '/admin/settings',
          icon: <SettingOutlined />,
          label: 'Thiết lập',
        },
      ]
    },
    {
      key: 'settings-group',
      label: 'Cá nhân hóa',
      type: 'group',
      children: [
        {
          key: '/admin/profile',
          icon: <UserOutlined />,
          label: 'Hồ sơ của tôi',
        },
        {
          key: '/admin/preferences',
          icon: <SettingOutlined />,
          label: 'Thiết lập',
        },
      ]
    }
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      defaultOpenKeys={['posts-group', 'system-group']}
      items={menuItems}
      onClick={(e) => navigate(e.key)}
      className="border-none bg-transparent"
      style={{
        padding: '0 12px'
      }}
    />
  );
};