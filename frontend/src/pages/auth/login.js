import { Button, Form, Input, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { login as authLogin } from '../../services/authService';
import { checkLogin } from '../../actions/login';
import { setUser } from '../../actions/user';

const { Title, Text, Paragraph } = Typography;

export const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await authLogin(values);

      if (res.code === 200) {
        // Lưu token vào localStorage (đồng bộ với api.js)
        localStorage.setItem('token', res.token);

        // Lưu thông tin vào Redux
        dispatch(checkLogin(true));
        if (res.user) {
          dispatch(setUser(res.user));
        }

        messageApi.success('Đăng nhập thành công!');
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        messageApi.error(res.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {contextHolder}
      <div className="text-center mb-8">
        <Title level={2} className="m-0 text-indigo-600">Chào mừng trở lại</Title>
        <Paragraph className="text-gray-500">Vui lòng đăng nhập để quản lý blog của bạn</Paragraph>
      </div>

      <Form
        name="login-form"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Tên đăng nhập hoặc Email"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input placeholder="admin / user@example.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item className="mt-8">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block 
            className="h-12 bg-indigo-600 hover:bg-indigo-700"
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text className="text-gray-500">
            Chưa có tài khoản? <a href="/register" className="text-indigo-600 font-semibold">Đăng ký ngay</a>
          </Text>
        </div>
      </Form>
    </div>
  );
}