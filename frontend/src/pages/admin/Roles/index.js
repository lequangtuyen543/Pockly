import { useEffect, useState } from "react";
import { Button, Tooltip, Form, message, Space, Select, Tag, Popconfirm, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SafetyCertificateOutlined, PlusOutlined } from "@ant-design/icons";
import { getRoles, createRole, updateRole, deleteRole } from "../../../services/rolesServices";
import { DataTable } from "../../../components/DataTable";
import { DataToolbar } from "../../../components/DataToolbar";
import { CustomModal } from "../../../components/CustomModal";

export const RolesIndex = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await getRoles({ keyword });
      if (res?.data) setData(res.data);
    } catch (error) {
      messageApi.error("Không thể tải danh sách vai trò");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showModal = (role = null) => {
    setEditingRole(role);
    if (role) {
      form.setFieldsValue(role);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRole) {
        const res = await updateRole(editingRole._id, values);
        if (res?.code === 200) {
          messageApi.success("Cập nhật thành công!");
          handleModalClose();
          fetchData();
        } else {
          messageApi.error(res?.message || "Lỗi cập nhật");
        }
      } else {
        const res = await createRole(values);
        if (res?.code === 200) {
          messageApi.success("Tạo mới thành công!");
          handleModalClose();
          fetchData();
        } else {
          messageApi.error(res?.message || "Lỗi tạo mới");
        }
      }
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteRole(id);
      if (res?.code === 200) {
        message.success("Xóa thành công!");
        fetchData();
      } else {
        message.error(res?.message || "Lỗi xóa");
      }
    } catch (error) {
      message.error("Không thể xóa vai trò");
    }
  };

  const columns = [
    {
      title: 'Tên vai trò',
      key: 'title',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-[#005daa]">
            <SafetyCertificateOutlined />
          </div>
          <span className="font-semibold text-gray-900">{record.title}</span>
        </div>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span className="text-gray-500 text-sm">{text || 'Chưa có mô tả'}</span>
    },
    {
      title: 'Quyền hạn',
      key: 'permissions',
      render: (_, record) => (
        <Tag color="blue" className="border-none px-3 py-0.5 rounded-full font-medium">
          {record.permissions?.length || 0} quyền
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
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa vai trò"
              description="Hành động này không thể hoàn tác. Tiếp tục?"
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-8 rounded shadow-sm border border-gray-100 animate-fade-in">
      {contextHolder}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Quản lý Phân quyền</h2>
        <p className="text-sm text-gray-500 m-0">Quản lý các nhóm vai trò và quyền truy cập chi tiết trong hệ thống.</p>
      </div>

      <DataToolbar 
        onSearch={fetchData}
        showCreate={false}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            className="bg-[#005daa] hover:bg-[#004785] h-10 px-6 rounded font-semibold"
          >
            Thêm vai trò
          </Button>
        }
      />

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <CustomModal
        title={editingRole ? "Chỉnh sửa Vai trò" : "Tạo Vai trò mới"}
        open={isModalOpen}
        onCancel={handleModalClose}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-2" size="large">
          <Form.Item label="Tên vai trò" name='title' rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}>
            <Input placeholder="Ví dụ: Biên tập viên" />
          </Form.Item>

          <Form.Item label="Mô tả" name='description'>
            <Input.TextArea rows={2} placeholder="Mô tả quyền hạn của vai trò này" />
          </Form.Item>

          <Form.Item label="Quyền hạn (Permissions)" name='permissions'>
            <Select 
              mode="multiple" 
              placeholder="Chọn các quyền cho vai trò này"
              options={[
                { label: "Hệ thống", options: [
                  { label: "Truy cập Dashboard", value: "dashboard_view" },
                  { label: "Cài đặt hệ thống", value: "settings_edit" }
                ]},
                { label: "Người dùng", options: [
                  { label: "Xem danh sách", value: "users_view" },
                  { label: "Chỉnh sửa tài khoản", value: "users_edit" }
                ]},
                { label: "Phân quyền", options: [
                  { label: "Xem vai trò", value: "roles_view" },
                  { label: "Thêm vai trò", value: "roles_create" },
                  { label: "Sửa vai trò", value: "roles_edit" },
                  { label: "Xóa vai trò", value: "roles_delete" }
                ]},
                { label: "Bài viết", options: [
                  { label: "Xem danh sách", value: "posts_view" },
                  { label: "Tạo bài mới", value: "posts_create" },
                  { label: "Sửa bài viết", value: "posts_edit" },
                  { label: "Xóa bài viết", value: "posts_delete" }
                ]},
                { label: "Danh mục", options: [
                  { label: "Xem danh mục", value: "categories_view" },
                  { label: "Thêm danh mục", value: "categories_create" },
                  { label: "Sửa danh mục", value: "categories_edit" },
                  { label: "Xóa danh mục", value: "categories_delete" }
                ]}
              ]}
              style={{ width: '100%' }}
              listHeight={350}
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-10">
            <Button onClick={handleModalClose} className="h-11 px-8 rounded font-medium">Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-[#005daa] hover:bg-[#004785] h-11 px-8 rounded font-semibold">
              {editingRole ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </CustomModal>
    </div>
  );
};