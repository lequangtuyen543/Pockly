import { Button, Card, Col, Form, Input, message, Row, Avatar, Tag, Skeleton, Space, Divider } from "antd";
import { useEffect, useState } from "react";
import { updateUserInfo, getUserInfo } from "../../../services/usersService";
import { UserOutlined, MailOutlined, IdcardOutlined, CrownOutlined, EditOutlined, SaveOutlined, CloseOutlined, PictureOutlined } from "@ant-design/icons";

export const UserProfile = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUserInfo();
      if (res?.code === 200) {
        setData(res.data);
        setAvatarPreview(res.data.avatar || "");
        form.setFieldsValue(res.data);
      }
    } catch (error) {
      messageApi.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const res = await updateUserInfo(data._id, values);
      if (res.code === 200) {
        messageApi.success("Cập nhật thông tin thành công!");
        setData(res.data);
        setIsEdit(false);
      } else {
        messageApi.error(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      messageApi.error("Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    form.setFieldsValue(data);
    setAvatarPreview(data.avatar || "");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton active avatar paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      {contextHolder}
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ của tôi</h2>
          <p className="text-gray-500 m-0">Quản lý thông tin cá nhân và cách hiển thị của bạn trên hệ thống.</p>
        </div>
        {!isEdit ? (
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
            className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 rounded-lg font-semibold"
          >
            Chỉnh sửa hồ sơ
          </Button>
        ) : (
          <Space>
            <Button 
              icon={<CloseOutlined />} 
              onClick={handleCancel}
              className="h-10 px-6 rounded-lg font-medium"
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={() => form.submit()}
              loading={saving}
              className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 rounded-lg font-semibold"
            >
              Lưu thay đổi
            </Button>
          </Space>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Profile Card */}
        <Col span={24} md={8}>
          <Card className="text-center shadow-sm border-gray-100 rounded-2xl overflow-hidden pt-8">
            <div className="relative inline-block mb-4">
              <Avatar 
                size={120} 
                src={avatarPreview} 
                icon={<UserOutlined />} 
                className="border-4 border-white shadow-md bg-indigo-50"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-1">{data?.fullName}</h3>
            <p className="text-gray-500 mb-4">@{data?.username}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Tag color="blue" className="rounded-full px-4 py-0.5 border-none font-medium flex items-center gap-1">
                <CrownOutlined /> {data?.role?.title || 'User'}
              </Tag>
              <Tag color={data?.status === 'active' ? 'green' : 'orange'} className="rounded-full px-4 py-0.5 border-none font-medium">
                {data?.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}
              </Tag>
            </div>
            
            <Divider className="my-6" />
            
            <div className="text-left space-y-4 px-2">
              <div className="flex items-center gap-3 text-gray-600">
                <MailOutlined className="text-indigo-500" />
                <span className="text-sm truncate">{data?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <IdcardOutlined className="text-indigo-500" />
                <span className="text-sm font-medium">ID: {data?._id?.substring(0, 8)}...</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Edit Form */}
        <Col span={24} md={16}>
          <Card className="shadow-sm border-gray-100 rounded-2xl p-4">
            <Form 
              form={form} 
              layout="vertical" 
              disabled={!isEdit} 
              onFinish={handleSubmit}
              size="large"
              className="font-inter"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <EditOutlined className="text-indigo-600" /> Thông tin cá nhân
              </h4>
              
              <Row gutter={20}>
                <Col span={24} md={12}>
                  <Form.Item 
                    label="Họ và tên" 
                    name='fullName' 
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                  >
                    <Input placeholder="Nguyễn Văn A" prefix={<IdcardOutlined className="text-gray-400" />} />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={12}>
                  <Form.Item 
                    label="Tên đăng nhập" 
                    name='username' 
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                  >
                    <Input placeholder="admin" prefix={<UserOutlined className="text-gray-400" />} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item 
                    label="Email" 
                    name='email' 
                    extra="Email hiện tại chỉ có thể thay đổi bởi Quản trị viên hệ thống."
                  >
                    <Input disabled prefix={<MailOutlined className="text-gray-400" />} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item 
                    label="Đường dẫn ảnh đại diện (Avatar URL)" 
                    name='avatar'
                  >
                    <Input 
                      placeholder="https://example.com/avatar.png" 
                      prefix={<PictureOutlined className="text-gray-400" />}
                      onChange={(e) => setAvatarPreview(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <p className="text-sm text-indigo-700 m-0">
                  <strong>Lưu ý:</strong> Một số thông tin như Email và Vai trò được khóa để đảm bảo tính bảo mật. Vui lòng liên hệ Admin nếu cần thay đổi các thông tin này.
                </p>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>


    </div>
  );
}