import { Layout, Avatar } from 'antd';
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SiderApp } from "./SiderApp";
import { Header } from "./Header";
import Footer from "./Footer";
import './LayoutAdmin.scss';
import { useSettings } from '../../context/SettingsContext';

const { Sider, Content } = Layout;

export const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { settings } = useSettings();

  return (
    <Layout className="min-h-screen bg-[#f0f2f5]">
      {/* Sidebar Navigation */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={260}
        className="fixed left-0 top-0 h-full z-50 shadow-2xl border-r border-gray-800"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="flex flex-col h-full bg-[#001529]">
          <div className="px-6 py-8">
            <div className="flex items-center gap-3">
              {settings.siteLogo ? (
                <Avatar 
                  src={settings.siteLogo} 
                  shape="square" 
                  size={collapsed ? 32 : 40}
                  className="bg-[#005daa] p-1"
                />
              ) : (
                <div className="w-10 h-10 bg-[#005daa] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {settings.siteName ? settings.siteName.charAt(0) : 'C'}
                </div>
              )}
              {!collapsed && (
                <div className="overflow-hidden">
                  <div className="text-white font-bold text-lg tracking-tight truncate">
                    {settings.siteName || 'Clean Blog'}
                  </div>
                  <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest opacity-60">
                    Admin Panel
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <SiderApp collapsed={collapsed} />
          </div>
        </div>
      </Sider>
      
      {/* Main Content Area */}
      <Layout 
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : 260 }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <Content className="p-8 max-w-[1400px] w-full mx-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </Content>
        
        <Footer />
      </Layout>
    </Layout>
  );
};