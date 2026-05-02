import { useEffect, useState } from "react";
import { Button, Tag, Tooltip, Space, message, Form, Input, Select, Switch } from 'antd';
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { getUsers, updateUserInfo } from "../../../services/usersService";
import { getRoles } from "../../../services/rolesServices";
import { DataTable } from "../../../components/DataTable";
import { DataToolbar } from "../../../components/DataToolbar";
import { CustomModal } from "../../../components/CustomModal";

export const UserList = () => {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async (keyword = '') => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([getUsers({ keyword }), getRoles()]);
      if (usersRes?.data) setData(usersRes.data);
      if (rolesRes?.data) setRoles(rolesRes.data);
    } catch (error) {
      messageApi.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        ...user,
        status: user.status === 'active'
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        status: values.status ? 'active' : 'inactive'
      };

      const res = await updateUserInfo(editingUser._id, payload);
      if (res?.code === 200) {
        messageApi.success("Cập nhật thành công!");
        handleModalClose();
        fetchData();
      } else {
        messageApi.error(res?.message || "Lỗi cập nhật");
      }
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#005daa] font-bold">
            {record.avatar ? <img src={record.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : <UserOutlined />}
          </div>
          <div>
            <div className="font-bold text-gray-900">{record.fullName || record.username}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <span className="font-medium text-gray-700">@{text}</span>
    },
    {
      title: 'Vai trò',
      key: 'role',
      render: (_, record) => {
        const roleInfo = roles.find(r => r._id === record.roleId) || record.role;
        const isAdmin = roleInfo?.title?.toLowerCase() === 'admin';
        return <Tag color={isAdmin ? 'purple' : 'blue'} className="border-none px-3 py-0.5 rounded-full font-medium">
          {roleInfo?.title || 'Unknown'}
        </Tag>;
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === "active" ? "green" : "red"} className="border-none px-3 py-0.5 rounded-full font-medium">
          {record.status === "active" ? "Hoạt động" : "Tạm khóa"}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined className="text-[#005daa]" />} onClick={() => showModal(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-8 rounded shadow-sm border border-gray-100 animate-fade-in">
      {contextHolder}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Quản lý Người dùng</h2>
        <p className="text-sm text-gray-500 m-0">Quản lý tài khoản, phân quyền và trạng thái hoạt động của thành viên.</p>
      </div>

      <DataToolbar 
        onSearch={fetchData}
        showCreate={false}
        searchPlaceholder="Tìm theo tên, email, username..."
      />

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <CustomModal
        title="Chỉnh sửa Người dùng"
        open={isModalOpen}
        onCancel={handleModalClose}
        width={550}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-2" size="large">
          <Form.Item label="Họ và tên" name='fullName' rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item label="Tên đăng nhập" name='username' rules={[{ required: true, message: 'Vui lòng nhập username!' }]}>
            <Input placeholder="nguyenvana" disabled={!!editingUser} />
          </Form.Item>

          <Form.Item label="Email" name='email' rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item label="Vai trò" name='roleId' rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
            <Select placeholder="Chọn vai trò">
              {roles.map(r => (
                <Select.Option key={r._id} value={r._id}>{r.title}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái hoạt động" name='status' valuePropName='checked'>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Switch />
              <span className="text-sm font-medium text-gray-700">Cho phép truy cập hệ thống</span>
            </div>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-10">
            <Button onClick={handleModalClose} className="h-11 px-8 rounded font-medium">Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-[#005daa] hover:bg-[#004785] h-11 px-8 rounded font-semibold">
              Cập nhật
            </Button>
          </div>
        </Form>
      </CustomModal>
    </div>
  );
};