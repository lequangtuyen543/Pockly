import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Avatar } from 'antd';
import { useSettings } from '../../context/SettingsContext';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Trang chủ', path: '/' },
    { title: 'Bài viết', path: '/posts' },
    { title: 'Về chúng tôi', path: '/about' },
    { title: 'Liên hệ', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          {settings.siteLogo ? (
            <Avatar 
              src={settings.siteLogo} 
              shape="square" 
              size={40}
              className="group-hover:rotate-12 transition-transform bg-indigo-600 p-1"
            />
          ) : (
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
              {settings.siteName ? settings.siteName.charAt(0) : 'C'}
            </div>
          )}
          <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            {settings.siteName || 'CleanBlog'}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `text-sm font-semibold transition-colors hover:text-indigo-600 ${
                  isActive 
                    ? 'text-indigo-600' 
                    : (scrolled ? 'text-gray-600' : 'text-gray-200')
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
          <div className="h-4 w-px bg-gray-300/30 mx-2" />
          <Link to="/login">
            <Button 
              type="primary" 
              shape="round" 
              icon={<UserOutlined />}
              className="bg-indigo-600 hover:bg-indigo-700 border-none px-6 h-10 flex items-center"
            >
              Đăng nhập
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-900' : 'text-white'}`}
          onClick={() => setOpen(true)}
        >
          <MenuOutlined style={{ fontSize: '20px' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={280}
      >
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-lg font-medium ${isActive(link.path) ? 'text-indigo-600' : 'text-gray-600'}`}
              onClick={() => setOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          <hr className="border-gray-100" />
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button type="primary" block size="large" className="bg-indigo-600">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </Drawer>
    </header>
  );
};
