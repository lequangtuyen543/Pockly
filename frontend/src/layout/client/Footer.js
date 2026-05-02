import { FacebookFilled, GithubFilled, TwitterCircleFilled, InstagramFilled, LinkedinFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { Avatar } from 'antd';

export const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              {settings.siteLogo ? (
                <Avatar 
                  src={settings.siteLogo} 
                  shape="square" 
                  size={32}
                  className="bg-indigo-600 p-1"
                />
              ) : (
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {settings.siteName ? settings.siteName.charAt(0) : 'C'}
                </div>
              )}
              <span className="text-xl font-bold text-white tracking-tight">
                {settings.siteName || 'CleanBlog'}
              </span>
            </Link>
            <p className="max-w-sm leading-relaxed">
              {settings.siteDescription || 'Nền tảng chia sẻ kiến thức công nghệ và đời sống hàng đầu. Mang lại giá trị qua từng bài viết chất lượng.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Khám phá</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/posts" className="hover:text-indigo-400 transition-colors">Bài viết mới</Link></li>
              <li><Link to="/categories" className="hover:text-indigo-400 transition-colors">Danh mục</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">Về chúng tôi</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-6">Kết nối</h4>
            <div className="flex gap-4 text-2xl">
              {settings.socialFacebook && (
                <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors"><FacebookFilled /></a>
              )}
              {settings.socialTwitter && (
                <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors"><TwitterCircleFilled /></a>
              )}
              {settings.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors"><InstagramFilled /></a>
              )}
              {settings.socialGithub && (
                <a href={settings.socialGithub} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors"><GithubFilled /></a>
              )}
              {settings.socialLinkedin && (
                <a href={settings.socialLinkedin} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors"><LinkedinFilled /></a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>{settings.siteCopyright || `© ${new Date().getFullYear()} Clean Blog. All rights reserved.`}</p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};