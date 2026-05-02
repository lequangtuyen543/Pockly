import { useEffect, useState } from "react";
import { getPosts } from "../../../services/postsService";
import { getUsers } from "../../../services/usersService";
import { Link } from "react-router-dom";
import { Skeleton, Table, Tag, Avatar, Space, Button } from "antd";
import { useSelector } from "react-redux";
import { 
  UserOutlined, 
  FileTextOutlined, 
  EyeOutlined, 
  PlusOutlined,
  RiseOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

export const Dashboard = () => {
  const user = useSelector(state => state.userReducer);
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    posts: { total: 0, active: 0, recent: [] },
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([getUsers(), getPosts()]);
        
        const usersList = usersRes?.data || [];
        const postsList = postsRes?.data || [];

        setStats({
          users: {
            total: usersList.length,
            active: usersList.filter(u => u.status === 'active').length,
          },
          posts: {
            total: postsList.length,
            active: postsList.filter(p => p.status === 'active').length,
            recent: postsList.slice(0, 5) // Get latest 5
          },
          loading: false
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchDashboardData();
  }, []);

  if (stats.loading) {
    return <div className="p-8"><Skeleton active paragraph={{ rows: 12 }} /></div>;
  }

  const columns = [
    {
      title: 'Bài viết mới nhất',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
            {record.thumbnail ? (
              <img src={record.thumbnail} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <FileTextOutlined />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900 line-clamp-1">{text}</div>
            <div className="text-xs text-gray-400 capitalize">{record.category?.title || 'Uncategorized'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'} className="rounded-full px-3">
          {status === 'active' ? 'Đã xuất bản' : 'Bản nháp'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span className="text-gray-500 text-sm">{new Date(date).toLocaleDateString('vi-VN')}</span>,
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Link to={`/posts/${record._id}`} target="_blank">
            <Button type="text" icon={<EyeOutlined className="text-gray-400 hover:text-green-600" />} />
          </Link>
          <Link to={`/admin/posts/edit/${record._id}`}>
            <Button type="text" icon={<ArrowRightOutlined className="text-gray-400 hover:text-blue-600" />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#005daa] to-[#0075d5] rounded-3xl p-8 text-white shadow-lg shadow-blue-200">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, {user?.fullName || 'Admin'}! 👋</h1>
          <p className="text-blue-100 text-lg opacity-90">Hôm nay là một ngày tuyệt vời để viết những nội dung mới.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/admin/posts/create">
              <Button 
                type="primary" 
                size="large" 
                icon={<PlusOutlined />}
                className="bg-white text-[#005daa] border-none hover:bg-blue-50 font-bold rounded-xl h-11"
              >
                Tạo bài viết mới
              </Button>
            </Link>
          </div>
        </div>
        {/* Abstract background elements */}
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng bài viết" 
          value={stats.posts.total} 
          icon={<FileTextOutlined />} 
          color="blue"
          trend="+12%"
        />
        <StatCard 
          title="Người dùng" 
          value={stats.users.total} 
          icon={<UserOutlined />} 
          color="purple"
          trend="+5%"
        />
        <StatCard 
          title="Lượt xem tuần" 
          value="1,284" 
          icon={<RiseOutlined />} 
          color="green"
          trend="+18%"
        />
        <StatCard 
          title="Bình luận mới" 
          value="42" 
          icon={<EyeOutlined />} 
          color="orange"
          trend="+2%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 m-0">Bài viết gần đây</h3>
            <Link to="/admin/posts" className="text-[#005daa] font-semibold text-sm hover:underline">
              Xem tất cả
            </Link>
          </div>
          <Table 
            columns={columns} 
            dataSource={stats.posts.recent} 
            pagination={false} 
            rowKey="_id"
            className="dashboard-table"
          />
        </div>

        {/* Quick Tips / System Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gợi ý hôm nay</h3>
            <div className="space-y-4">
              <TipItem 
                icon="💡" 
                title="Tối ưu SEO" 
                desc="Hãy nhớ thêm từ khóa chính vào tiêu đề bài viết để tăng hạng tìm kiếm." 
              />
              <TipItem 
                icon="📸" 
                title="Hình ảnh chất lượng" 
                desc="Các bài viết có hình ảnh đẹp thường có lượt xem cao hơn 40%." 
              />
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Clean Blog Pro</h3>
              <p className="text-indigo-200 text-sm mb-4">Mở khóa các tính năng nâng cao và phân tích chuyên sâu.</p>
              <Button ghost className="border-indigo-400 text-white hover:bg-indigo-800 rounded-lg">
                Nâng cấp ngay
              </Button>
            </div>
            <div className="absolute bottom-[-20px] right-[-10px] opacity-10">
              <RocketOutlined style={{ fontSize: '100px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl ${colorMap[color]} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="text-green-500 bg-green-50 px-2 py-0.5 rounded-lg text-xs font-bold">
          {trend}
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
        <div className="text-2xl font-black text-gray-900">{value}</div>
      </div>
    </div>
  );
};

const TipItem = ({ icon, title, desc }) => (
  <div className="flex gap-3">
    <span className="text-xl">{icon}</span>
    <div>
      <div className="font-bold text-gray-900 text-sm">{title}</div>
      <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
    </div>
  </div>
);

const RocketOutlined = (props) => (
  <span {...props} className="material-symbols-outlined">rocket_launch</span>
);