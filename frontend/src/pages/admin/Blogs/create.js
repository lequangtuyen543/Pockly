import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Switch, Card, Row, Col } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { createPost } from "../../../services/postsService";
import { getCategories } from "../../../services/categoriesService";

export const CreateBlog = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res?.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Backend automatically sets userId, deleted=false
      const payload = {
        ...values,
        status: values.status ? 'active' : 'inactive'
      };

      const res = await createPost(payload);
      if (res?.code === 200 || res?.code === 201) {
        messageApi.success("Tạo bài viết thành công!");
        setTimeout(() => navigate('/admin/posts'), 1000);
      } else {
        messageApi.error(res?.message || "Lỗi tạo bài viết");
      }
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in">
      {contextHolder}
      
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/posts">
          <Button icon={<ArrowLeftOutlined />} shape="circle" className="border-gray-200" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-0">Viết bài mới</h2>
        </div>
      </div>

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        initialValues={{ status: true }}
        className="font-inter"
      >
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card className="rounded-2xl border border-gray-100 shadow-sm mb-6" bordered={false}>
              <Form.Item 
                label="Tiêu đề bài viết" 
                name="title" 
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="Nhập tiêu đề hấp dẫn..." size="large" className="rounded-xl font-semibold text-lg" />
              </Form.Item>

              <Form.Item 
                label="Đường dẫn tĩnh (Slug)" 
                name="slug" 
                extra="Để trống để tự động tạo từ tiêu đề."
              >
                <Input placeholder="vi-du-bai-viet-moi" className="rounded-lg" />
              </Form.Item>

              <Form.Item 
                label="Nội dung bài viết" 
                name="content" 
                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
              >
                <Input.TextArea 
                  rows={15} 
                  placeholder="Bắt đầu viết nội dung ở đây..." 
                  className="rounded-xl font-mono text-sm leading-relaxed" 
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="rounded-2xl border border-gray-100 shadow-sm sticky top-24" bordered={false}>
              <h3 className="font-semibold text-gray-800 mb-4">Cấu hình xuất bản</h3>

              <Form.Item 
                label="Trạng thái xuất bản" 
                name="status" 
                valuePropName="checked"
              >
                <Switch checkedChildren="Public" unCheckedChildren="Draft" />
              </Form.Item>

              <Form.Item 
                label="Danh mục" 
                name="categoryId" 
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn một danh mục" size="large" className="rounded-lg">
                  {categories.map(c => (
                    <Select.Option key={c._id} value={c._id}>{c.title}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                label="Ảnh bìa (URL)" 
                name="thumbnail" 
              >
                <Input placeholder="https://example.com/image.jpg" size="large" className="rounded-lg" />
              </Form.Item>

              <div className="pt-4 border-t border-gray-100 mt-6">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />} 
                  loading={loading}
                  className="w-full bg-[#005daa] hover:bg-[#0075d5] rounded-xl h-11 font-semibold text-base"
                >
                  Đăng bài
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};