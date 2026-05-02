import { Layout, Button, Input, Dropdown, message } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  SearchOutlined, 
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin } from '../../actions/login';

const { Header: AntHeader } = Layout;

export const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.userReducer);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(checkLogin(false));
    message.success("Đăng xuất thành công!");
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/admin/profile">Thông tin cá nhân ({user?.fullName || 'Admin'})</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: <Link to="/admin/preferences">Cài đặt</Link>,
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout
    },
  ];

  // Helper function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/users')) return 'User Management';
    if (path.includes('/posts')) return 'Post Management';
    if (path.includes('/roles')) return 'Role Management';
    if (path.includes('/dashboard')) return 'Dashboard';
    return 'Management';
  };

  return (
    <AntHeader className="bg-white sticky top-0 z-40 border-b border-gray-200 px-6 h-16 flex items-center justify-between p-0">
      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-lg hover:bg-gray-100 text-gray-500"
          style={{ width: 40, height: 40 }}
        />
        <h2 className="text-[18px] font-bold text-[#1c1b1b] m-0 leading-none">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Input 
            placeholder="Search..." 
            prefix={<SearchOutlined className="text-gray-400 text-lg mr-1" />}
            className="w-64 rounded-lg border-gray-300 focus:border-[#005daa] focus:ring-1 focus:ring-[#005daa] py-1.5 transition-all text-[14px]"
          />
        </div>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="bg-[#005daa] hover:bg-[#0075d5] border-none rounded-lg font-semibold px-4 hidden sm:flex items-center"
        >
          Create New
        </Button>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-colors text-gray-500 hover:text-[#005daa]">
            <UserOutlined className="text-[20px]" />
          </div>
        </Dropdown>

        <Link to="/admin/preferences">
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-colors text-gray-500 hover:text-[#005daa]">
            <SettingOutlined className="text-[20px]" />
          </div>
        </Link>
      </div>
    </AntHeader>
  );
};