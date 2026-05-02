import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="text-center py-6 bg-transparent">
      <div className="text-gray-400 text-xs font-inter flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
        <span>© {new Date().getFullYear()} Clean Blog Management System.</span>
        <div className="flex gap-4 opacity-70 hover:opacity-100 transition-opacity">
          <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600">Help Center</a>
          <a href="#" className="hover:text-indigo-600">API Status</a>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;