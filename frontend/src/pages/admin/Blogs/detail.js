import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Switch, Card, Row, Col, Skeleton } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, Link, useParams } from "react-router-dom";
import { updatePost, getPostDetail } from "../../../services/postsService";
import { getCategories } from "../../../services/categoriesService";

export const DetailBlog = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setFetching(true);
      try {
        const [categoriesRes, postRes] = await Promise.all([
          getCategories(),
          getPostDetail(id)
        ]);

        if (categoriesRes?.data) {
          setCategories(categoriesRes.data);
        }

        if (postRes?.data) {
          const post = postRes.data;
          form.setFieldsValue({
            ...post,
            status: post.status === 'active'
          });
        } else {
          messageApi.error("Không tìm thấy bài viết");
          navigate('/admin/posts');
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
        messageApi.error("Đã có lỗi xảy ra");
      } finally {
        setFetching(false);
      }
    };
    if (id) {
      fetchInitialData();
    }
  }, [id, form, navigate, messageApi]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        status: values.status ? 'active' : 'inactive'
      };

      const res = await updatePost(id, payload);
      if (res?.code === 200) {
        messageApi.success("Cập nhật bài viết thành công!");
        setTimeout(() => navigate('/admin/posts'), 1000);
      } else {
        messageApi.error(res?.message || "Lỗi cập nhật bài viết");
      }
    } catch (error) {
      messageApi.error("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 max-w-5xl mx-auto"><Skeleton active paragraph={{ rows: 15 }} /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in">
      {contextHolder}
      
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/posts">
          <Button icon={<ArrowLeftOutlined />} shape="circle" className="border-gray-200" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-0">Chỉnh sửa bài viết</h2>
        </div>
      </div>

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
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
                  Lưu thay đổi
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};