import { useEffect, useState } from 'react';
import { getPosts } from '../../../services/postsService';

import homeBg from '../../../assets/img/home-bg.jpg';
import { HeroItem } from '../../../components/HeroItem';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined, RocketOutlined, ReadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

export const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPosts({ limit: 5 }); // Chỉ lấy 5 bài mới nhất cho trang chủ
        if (res && res.code === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Home fetch error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-50">
      <HeroItem 
        title="Clean Blog" 
        subtitle="Nơi chia sẻ kiến thức và cảm hứng sáng tạo mỗi ngày" 
        thumbnail={homeBg} 
      />

      {/* Features Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-[#005daa] rounded-lg flex items-center justify-center text-2xl mb-6">
                <RocketOutlined />
              </div>
              <h3 className="text-xl font-bold mb-4">Tốc độ & Hiệu năng</h3>
              <p className="text-gray-500">Trải nghiệm đọc blog mượt mà và nhanh chóng trên mọi thiết bị.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <ReadOutlined />
              </div>
              <h3 className="text-xl font-bold mb-4">Nội dung chất lượng</h3>
              <p className="text-gray-500">Những bài viết được tuyển chọn kỹ lưỡng về công nghệ và đời sống.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <SafetyCertificateOutlined />
              </div>
              <h3 className="text-xl font-bold mb-4">An toàn & Bảo mật</h3>
              <p className="text-gray-500">Hệ thống quản lý tin cậy, bảo vệ thông tin người dùng tối đa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Bài viết mới nhất</h2>
              <div className="w-20 h-1.5 bg-[#005daa] rounded-full"></div>
            </div>
            <Link to="/posts" className="text-indigo-600 font-bold hover:underline">
              Xem tất cả bài viết <ArrowRightOutlined />
            </Link>
          </div>

          <div className="space-y-12">
            {data && data.length > 0 ? (
              data.map((post) => (
                <article key={post._id} className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                  <Link to={`/posts/${post._id}`} className="block">
                    <h2 className="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-4">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-lg font-light line-clamp-2 mb-6">
                      {post.subtitle || "Nhấn để đọc thêm về nội dung bài viết này..."}
                    </p>
                  </Link>
                  <div className="flex items-center text-sm text-gray-400 font-medium">
                    <span>Bởi <Link to="/" className="text-gray-900 hover:text-indigo-600">{post.createdBy?.fullName || 'Admin'}</Link></span>
                    <span className="mx-3 text-gray-200">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">Đang tải bài viết...</p>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/posts" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#005daa] text-white font-bold rounded hover:bg-[#004785] hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              Khám phá thêm bài viết <ArrowRightOutlined />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};