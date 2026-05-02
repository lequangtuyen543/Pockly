import { Button, Form, Input, message, Typography, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register as authRegister } from '../../services/authService';

const { Title, Text, Paragraph } = Typography;

export const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await authRegister(values);

      if (res.code === 200) {
        messageApi.success('Đăng ký tài khoản thành công!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        messageApi.error(res.message || 'Đăng ký không thành công, vui lòng thử lại.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đã có lỗi xảy ra trong quá trình đăng ký.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {contextHolder}
      <div className="text-center mb-8">
        <Title level={2} className="m-0 text-indigo-600">Tạo tài khoản</Title>
        <Paragraph className="text-gray-500">Tham gia cộng đồng Clean Blog ngay hôm nay</Paragraph>
      </div>

      <Form
        name="register-form"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input placeholder="ví dụ: quangtuyen" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không đúng định dạng!' }
          ]}
        >
          <Input placeholder="name@example.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản')),
            },
          ]}
        >
          <Checkbox>
            Tôi đồng ý với <a href="/" className="text-indigo-600">điều khoản & điều kiện</a>
          </Checkbox>
        </Form.Item>

        <Form.Item className="mt-8">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block 
            className="h-12 bg-indigo-600 hover:bg-indigo-700"
          >
            Đăng ký tài khoản
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text className="text-gray-500">
            Đã có tài khoản? <a href="/login" className="text-indigo-600 font-semibold">Đăng nhập</a>
          </Text>
        </div>
      </Form>
    </div>
  );
}