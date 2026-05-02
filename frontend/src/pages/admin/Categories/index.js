import { useEffect, useState } from "react";
import { Button, Tooltip, Form, message, Space, Switch, Tag, Popconfirm, Input } from 'antd';
import { EditOutlined, DeleteOutlined, AppstoreOutlined, PlusOutlined } from "@ant-design/icons";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../../services/categoriesService";
import { DataTable } from "../../../components/DataTable";
import { DataToolbar } from "../../../components/DataToolbar";
import { CustomModal } from "../../../components/CustomModal";

export const CategoryList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await getCategories({ keyword });
      if (res?.data) setData(res.data);
    } catch (error) {
      messageApi.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue({
        ...category,
        status: category.status === 'active'
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        status: values.status ? 'active' : 'inactive'
      };

      if (editingCategory) {
        const res = await updateCategory(editingCategory._id, payload);
        if (res?.code === 200) {
          messageApi.success("Cập nhật thành công!");
          handleModalClose();
          fetchData();
        } else {
          messageApi.error(res?.message || "Lỗi cập nhật");
        }
      } else {
        const res = await createCategory(payload);
        if (res?.code === 200 || res?.code === 201) {
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
      const res = await deleteCategory(id);
      if (res?.code === 200) {
        message.success("Xóa thành công!");
        fetchData();
      } else {
        message.error(res?.message || "Lỗi xóa");
      }
    } catch (error) {
      message.error("Không thể xóa danh mục");
    }
  };

  const columns = [
    {
      title: 'Tên danh mục',
      key: 'title',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-[#005daa]">
            <AppstoreOutlined />
          </div>
          <span className="font-semibold text-gray-900">{record.title}</span>
        </div>
      )
    },
    {
      title: 'Đường dẫn (Slug)',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => <span className="text-gray-500 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{text || 'N/A'}</span>
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === "active" ? "green" : "red"} className="capitalize border-none px-3 py-0.5 rounded-full font-medium">
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
            <Button type="text" icon={<EditOutlined className="text-blue-600" />} onClick={() => showModal(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa danh mục"
              description="Bạn có chắc chắn muốn xóa danh mục này?"
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

  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const currentSlug = form.getFieldValue('slug');
    if (!currentSlug || currentSlug === convertToSlug(form.getFieldValue('title') || '')) {
      form.setFieldsValue({ slug: convertToSlug(title) });
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-sm border border-gray-100 animate-fade-in">
      {contextHolder}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Quản lý Danh mục</h2>
        <p className="text-sm text-gray-500 m-0">Tổ chức và phân loại các bài viết trên hệ thống.</p>
      </div>

      <DataToolbar 
        onSearch={fetchData}
        createLabel="Thêm danh mục"
        createPath="#" // We use modal instead of page
        showCreate={false}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            className="bg-[#005daa] hover:bg-[#004785] h-10 px-6 rounded font-semibold"
          >
            Thêm danh mục
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
        title={editingCategory ? "Chỉnh sửa Danh mục" : "Tạo Danh mục mới"}
        open={isModalOpen}
        onCancel={handleModalClose}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-2" size="large">
          <Form.Item label="Tên danh mục" name='title' rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
            <Input placeholder="Ví dụ: Công nghệ" onChange={handleTitleChange} />
          </Form.Item>

          <Form.Item label="Đường dẫn (Slug)" name='slug' rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}>
            <Input placeholder="cong-nghe" />
          </Form.Item>

          <Form.Item label="Trạng thái hiển thị" name='status' valuePropName='checked'>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Switch />
              <span className="text-sm font-medium text-gray-700">Hiển thị công khai</span>
            </div>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-10">
            <Button onClick={handleModalClose} className="h-11 px-8 rounded font-medium">Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-[#005daa] hover:bg-[#004785] h-11 px-8 rounded font-semibold">
              {editingCategory ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </CustomModal>
    </div>
  );
};

