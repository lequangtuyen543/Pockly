import { useEffect, useState } from 'react';
import { getPostDetail } from '../../../services/postsService';

import { useParams, Link } from 'react-router-dom';
import postBg from '../../../assets/img/post-bg.jpg';
import { HeroItem } from '../../../components/HeroItem';
import { Skeleton, Breadcrumb, Tag, Divider, Avatar } from 'antd';
import { CalendarOutlined, UserOutlined, ArrowLeftOutlined, ShareAltOutlined } from '@ant-design/icons';

export const PostDetail = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPostDetail(id);
        if (res && res.code === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch post detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Skeleton active paragraph={{ rows: 15 }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy bài viết</h2>
        <Link to="/posts" className="text-indigo-600 mt-4 inline-block">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      <HeroItem 
        title={data.title} 
        subtitle={data.subtitle} 
        thumbnail={postBg} 
        createdBy={data.createdBy?.fullName} 
        createdAt={new Date(data.createdAt).toLocaleDateString('vi-VN')}
      />

      <div className="container mx-auto px-4 max-w-4xl py-12">
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-8">
          <Breadcrumb items={[
            { title: <Link to="/"><ArrowLeftOutlined /> Trang chủ</Link> },
            { title: <Link to="/posts">Bài viết</Link> },
            { title: 'Chi tiết' }
          ]} />
          
          <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
            <ShareAltOutlined /> Chia sẻ
          </button>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-10">
            <Avatar size={64} icon={<UserOutlined />} className="bg-indigo-100 text-indigo-600" />
            <div>
              <div className="font-bold text-lg text-gray-900">{data.createdBy?.fullName || 'Anonymous'}</div>
              <div className="text-sm text-gray-500 flex items-center gap-3">
                <span>Tác giả</span>
                <Divider type="vertical" />
                <span className="flex items-center gap-1"><CalendarOutlined /> {new Date(data.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <div 
            className="prose prose-indigo prose-lg max-w-none text-gray-800 leading-relaxed"
            style={{ whiteSpace: "pre-line" }}
          >
            {data.content}
          </div>

          {/* Tags / Meta */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
            <Tag color="indigo">#cleanblog</Tag>
            <Tag color="blue">#webdevelopment</Tag>
            <Tag color="purple">#tech</Tag>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 text-center">
          <Link 
            to="/posts" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-full hover:bg-indigo-100 transition-all"
          >
            <ArrowLeftOutlined /> Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    </article>
  );
};