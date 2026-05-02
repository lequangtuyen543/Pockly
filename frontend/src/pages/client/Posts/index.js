import { useEffect, useState } from 'react';
import { getPosts } from '../../../services/postsService';
import { getCategories } from '../../../services/categoriesService';
import homeBg from '../../../assets/img/home-bg.jpg';
import { HeroItem } from '../../../components/HeroItem';
import { Skeleton, Empty, Input, Pagination, Select, Tag } from 'antd';
import { CalendarOutlined, UserOutlined, ArrowRightOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const Posts = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({
    page: 1,
    limit: 6,
    keyword: '',
    categoryId: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 6
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsRes, categoriesRes] = await Promise.all([
        getPosts(params),
        getCategories()
      ]);

      if (postsRes && postsRes.code === 200) {
        setData(postsRes.data);
        if (postsRes.pagination) {
          setPagination({
            total: postsRes.pagination.totalItems,
            current: postsRes.pagination.currentPage,
            pageSize: postsRes.pagination.limit
          });
        }
      }
      if (categoriesRes && categoriesRes.code === 200) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (value) => {
    setParams(prev => ({ ...prev, keyword: value, page: 1 }));
  };

  const handleCategoryChange = (value) => {
    setParams(prev => ({ ...prev, categoryId: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setParams(prev => ({ ...prev, page }));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <HeroItem 
        title="Blog Community" 
        subtitle="Khám phá những câu chuyện thú vị và kiến thức bổ ích từ cộng đồng" 
        thumbnail={homeBg} 
      />
      
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Search & Filter Bar */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Input.Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="custom-search"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <FilterOutlined className="text-gray-400" />
              <Select
                placeholder="Tất cả danh mục"
                className="w-full md:w-48 h-10"
                onChange={handleCategoryChange}
                allowClear
                size="large"
              >
                {categories.map(cat => (
                  <Select.Option key={cat._id} value={cat._id}>{cat.title}</Select.Option>
                ))}
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              ))}
            </div>
          ) : data.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map((post) => (
                  <article key={post._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                    <Link to={`/posts/${post._id}`} className="block h-52 overflow-hidden relative">
                      {post.thumbnail ? (
                        <img 
                          src={post.thumbnail} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-50 flex items-center justify-center text-4xl">
                          📝
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Tag color="blue" className="border-none px-3 py-1 rounded-full font-bold shadow-sm">
                          {post.category?.title || 'General'}
                        </Tag>
                      </div>
                    </Link>

                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarOutlined />
                          <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UserOutlined />
                          <span>{post.createdBy?.fullName || 'Admin'}</span>
                        </div>
                      </div>
                      
                      <Link to={`/posts/${post._id}`} className="block mb-3">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#005daa] transition-colors leading-tight line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-500 line-clamp-3 mb-6 text-sm leading-relaxed">
                        {post.subtitle || "Khám phá chi tiết bài viết này để tìm hiểu thêm thông tin thú vị..."}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-50">
                        <Link to={`/posts/${post._id}`} className="flex items-center gap-2 text-[#005daa] font-bold text-sm group/link">
                          Đọc chi tiết
                          <ArrowRightOutlined className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-16 flex justify-center">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  className="premium-pagination"
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Empty description="Không tìm thấy bài viết nào phù hợp." />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};