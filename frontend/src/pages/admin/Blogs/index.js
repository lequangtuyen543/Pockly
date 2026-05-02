import { useEffect, useState } from "react";
import { Button, Tag, Tooltip, Modal, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getPosts, deletePost } from "../../../services/postsService";
import { DataTable } from "../../../components/DataTable";
import { DataToolbar } from "../../../components/DataToolbar";

export const BlogList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const fetchData = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await getPosts({ keyword });
      if (res?.data) {
        setData(res.data);
      }
    } catch (error) {
      messageApi.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa bài viết?',
      content: 'Bài viết sẽ được chuyển vào thùng rác. Bạn có thể khôi phục sau này.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await deletePost(id);
          if (res?.code === 200) {
            messageApi.success("Đã xóa bài viết");
            fetchData();
          } else {
            messageApi.error(res?.message || "Lỗi xóa bài viết");
          }
        } catch (error) {
          messageApi.error("Không thể xóa bài viết");
        }
      }
    });
  };

  const columns = [
    {
      title: 'Bài viết',
      key: 'title',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
            {record.thumbnail ? (
              <img src={record.thumbnail} alt="" className="w-full h-full object-cover" />
            ) : (
              <FileTextOutlined className="text-gray-300 text-xl" />
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900 line-clamp-1 max-w-xs" title={record.title}>
              {record.title}
            </div>
            <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider">
              {record.category?.title || 'Uncategorized'} • {record.user?.fullName || 'Admin'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      render: (views) => <span className="font-medium text-gray-600">{views || 0}</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === "active" ? "green" : "orange"} className="border-none px-3 py-0.5 rounded-full font-medium">
          {record.status === "active" ? "Đã xuất bản" : "Bản nháp"}
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
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Link to={`/posts/${record._id}`} target="_blank">
              <Button type="text" icon={<EyeOutlined className="text-green-600" />} />
            </Link>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined className="text-[#005daa]" />} 
              onClick={() => navigate(`/admin/posts/edit/${record._id}`)} 
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-8 rounded shadow-sm border border-gray-100 animate-fade-in">
      {contextHolder}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Quản lý Bài viết</h2>
        <p className="text-sm text-gray-500 m-0">Danh sách bài viết đã đăng và các bản nháp đang chờ xử lý.</p>
      </div>

      <DataToolbar 
        onSearch={fetchData}
        createLabel="Viết bài mới"
        createPath="/admin/posts/create"
        searchPlaceholder="Tìm tiêu đề bài viết..."
      />

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};