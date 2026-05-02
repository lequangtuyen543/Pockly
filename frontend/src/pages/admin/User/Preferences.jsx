import { Button, Card, Col, Form, Input, message, Row, Switch, Divider, Alert } from "antd";
import { useState } from "react";
import { changePassword } from "../../../services/usersService";
import { LockOutlined, SafetyOutlined, BellOutlined, EyeOutlined, InsuranceOutlined, SaveOutlined } from "@ant-design/icons";

export const UserPreferences = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      messageApi.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setSaving(true);
    try {
      const res = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      if (res.code === 200) {
        messageApi.success("Đổi mật khẩu thành công!");
        form.resetFields();
      } else {
        messageApi.error(res.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      messageApi.error("Đã có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      {contextHolder}
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Thiết lập tài khoản</h2>
        <p className="text-gray-500 m-0">Quản lý bảo mật, thông báo và các tùy chọn cá nhân khác.</p>
      </div>

      <Row gutter={[24, 24]}>
        {/* Security Section */}
        <Col span={24} lg={16}>
          <Card 
            title={<span className="flex items-center gap-2"><LockOutlined className="text-indigo-600" /> Bảo mật & Mật khẩu</span>}
            className="shadow-sm border-gray-100 rounded-2xl overflow-hidden"
          >
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleSubmit}
              size="large"
              className="font-inter"
            >
              <Alert 
                message="Mật khẩu của bạn nên dài ít nhất 8 ký tự và bao gồm chữ cái, số và ký tự đặc biệt để đảm bảo an toàn."
                type="info"
                showIcon
                className="mb-6 rounded-lg"
              />

              <Row gutter={20}>
                <Col span={24}>
                  <Form.Item 
                    label="Mật khẩu hiện tại" 
                    name='oldPassword' 
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                  >
                    <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={12}>
                  <Form.Item 
                    label="Mật khẩu mới" 
                    name='newPassword' 
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                  >
                    <Input.Password prefix={<SafetyOutlined className="text-gray-400" />} placeholder="••••••••" />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={12}>
                  <Form.Item 
                    label="Xác nhận mật khẩu mới" 
                    name='confirmPassword' 
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<SafetyOutlined className="text-gray-400" />} placeholder="••••••••" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex justify-end mt-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={saving}
                  icon={<SaveOutlined />}
                  className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 rounded-lg font-semibold shadow-md shadow-indigo-100"
                >
                  Cập nhật mật khẩu
                </Button>
              </div>
            </Form>
          </Card>

          <Card 
            title={<span className="flex items-center gap-2"><BellOutlined className="text-indigo-600" /> Thông báo</span>}
            className="shadow-sm border-gray-100 rounded-2xl mt-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-gray-800 mb-1">Thông báo qua Email</h5>
                  <p className="text-xs text-gray-500 mb-0">Nhận thông báo về các bài viết mới và hoạt động hệ thống.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Divider className="my-0" />
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-gray-800 mb-1">Cập nhật tin tức</h5>
                  <p className="text-xs text-gray-500 mb-0">Nhận bản tin hàng tuần về các xu hướng công nghệ mới.</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </Col>

        {/* Side Info */}
        <Col span={24} lg={8}>
          <Card 
            title={<span className="flex items-center gap-2"><InsuranceOutlined className="text-indigo-600" /> Tình trạng bảo mật</span>}
            className="shadow-sm border-gray-100 rounded-2xl"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <SafetyOutlined />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-gray-800 mb-1">Xác thực 2 yếu tố (2FA)</h5>
                  <p className="text-xs text-gray-500 mb-2">Tăng cường bảo mật cho tài khoản của bạn.</p>
                  <Button size="small" type="link" className="p-0 text-indigo-600 h-auto">Thiết lập ngay</Button>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <EyeOutlined />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-gray-800 mb-1">Thiết bị đã đăng nhập</h5>
                  <p className="text-xs text-gray-500 mb-2">Bạn đang đăng nhập trên 2 thiết bị khác nhau.</p>
                  <Button size="small" type="link" className="p-0 text-indigo-600 h-auto">Quản lý thiết bị</Button>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="mt-6 p-6 bg-amber-50 border border-amber-100 rounded-2xl">
            <h5 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
              <InsuranceOutlined /> Quyền riêng tư
            </h5>
            <p className="text-xs text-amber-700 leading-relaxed mb-0">
              Dữ liệu của bạn được mã hóa và bảo vệ theo tiêu chuẩn quốc tế. Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn.
            </p>
          </div>
        </Col>
      </Row>


    </div>
  );
}