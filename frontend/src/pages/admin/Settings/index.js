import { useEffect, useState } from "react";
import { Button, Form, Input, message, Skeleton, Tabs, Switch, Card, Row, Col, Image } from 'antd';
import {
  SaveOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
  FacebookOutlined,
  InstagramOutlined,
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  CopyrightOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { getSettings, updateSettings } from "../../../services/settingsService";

export const SettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // State for image previews
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await getSettings();
      if (res?.data) {
        // Convert maintenanceMode to boolean for Switch
        const formData = { ...res.data };
        if (formData.maintenanceMode) {
          formData.maintenanceMode = formData.maintenanceMode === 'true';
        }
        form.setFieldsValue(formData);
        setLogoUrl(formData.siteLogo || '');
        setFaviconUrl(formData.siteFavicon || '');
      }
    } catch (error) {
      messageApi.error("Không thể tải cài đặt hệ thống");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      // Convert boolean to string for backend storage
      const submitValues = { ...values };
      if (submitValues.maintenanceMode !== undefined) {
        submitValues.maintenanceMode = String(submitValues.maintenanceMode);
      }

      const res = await updateSettings(submitValues);
      if (res?.code === 200) {
        messageApi.success("Đã lưu cài đặt hệ thống!");
      } else {
        messageApi.error(res?.message || "Lỗi khi lưu cài đặt");
      }
    } catch (error) {
      messageApi.error("Đã có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <GlobalOutlined /> Tổng quan
        </span>
      ),
      children: (
        <div className="space-y-8">
          <Row gutter={24}>
            <Col span={24} md={12}>
              <Form.Item label="Tên Website" name='siteName' rules={[{ required: true, message: 'Vui lòng nhập tên website!' }]}>
                <Input placeholder="Clean Blog" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="Copyright" name='siteCopyright'>
                <Input prefix={<CopyrightOutlined className="text-gray-400" />} placeholder="© 2024 Clean Blog. All rights reserved." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả Website (SEO)" name='siteDescription'>
                <Input.TextArea rows={2} placeholder="Mô tả ngắn gọn về blog để hiển thị trên công cụ tìm kiếm" />
              </Form.Item>
            </Col>

            <Col span={24} md={12}>
              <Form.Item label="Đường dẫn Logo (URL)" name='siteLogo'>
                <Input
                  prefix={<LinkOutlined className="text-gray-400" />}
                  placeholder="https://example.com/logo.png"
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </Form.Item>
              {logoUrl && (
                <div className="mt-2 p-4 border border-dashed border-gray-200 rounded-lg flex flex-col items-center bg-gray-50">
                  <span className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Xem trước Logo</span>
                  <Image height={60} src={logoUrl} fallback="https://placehold.co/200x60?text=Logo+Error" alt="Logo Preview" className="object-contain" />
                </div>
              )}
            </Col>

            <Col span={24} md={12}>
              <Form.Item label="Đường dẫn Favicon (URL)" name='siteFavicon'>
                <Input
                  prefix={<LinkOutlined className="text-gray-400" />}
                  placeholder="https://example.com/favicon.ico"
                  onChange={(e) => setFaviconUrl(e.target.value)}
                />
              </Form.Item>
              {faviconUrl && (
                <div className="mt-2 p-4 border border-dashed border-gray-200 rounded-lg flex flex-col items-center bg-gray-50">
                  <span className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Xem trước Favicon</span>
                  <Image height={32} width={32} src={faviconUrl} fallback="https://placehold.co/32x32?text=F" alt="Favicon Preview" className="object-contain" />
                </div>
              )}
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <MailOutlined /> Liên hệ
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Row gutter={24}>
            <Col span={24} md={12}>
              <Form.Item label="Email liên hệ" name='contactEmail' rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="contact@example.com" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="Số điện thoại" name='contactPhone'>
                <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="+84 123 456 789" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Địa chỉ" name='contactAddress'>
                <Input.TextArea rows={3} prefix={<PushpinOutlined className="text-gray-400" />} placeholder="123 Đường ABC, Quận XYZ, TP.HCM" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Google Maps Embed URL" name='contactGoogleMaps'>
                <Input.TextArea rows={2} placeholder="<iframe>...</iframe>" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <LinkOutlined /> Mạng xã hội
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Row gutter={24}>
            <Col span={24} md={12}>
              <Form.Item label="Facebook" name='socialFacebook'>
                <Input prefix={<FacebookOutlined className="text-[#1877F2]" />} placeholder="https://facebook.com/yourpage" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="Instagram" name='socialInstagram'>
                <Input prefix={<InstagramOutlined className="text-[#E4405F]" />} placeholder="https://instagram.com/yourprofile" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="Twitter / X" name='socialTwitter'>
                <Input prefix={<TwitterOutlined className="text-black" />} placeholder="https://twitter.com/yourhandle" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="GitHub" name='socialGithub'>
                <Input prefix={<GithubOutlined className="text-[#181717]" />} placeholder="https://github.com/yourrepo" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="LinkedIn" name='socialLinkedin'>
                <Input prefix={<LinkedinOutlined className="text-[#0A66C2]" />} placeholder="https://linkedin.com/in/yourprofile" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <SettingOutlined /> Nâng cao
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Card className="bg-gray-50 border-none">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <SecurityScanOutlined className="text-amber-500" /> Chế độ bảo trì
                </h4>
                <p className="text-sm text-gray-500 mb-0">Khi bật, khách truy cập sẽ thấy thông báo bảo trì thay vì nội dung blog.</p>
              </div>
              <Form.Item name="maintenanceMode" valuePropName="checked" noStyle>
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>
            </div>
          </Card>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="Google Analytics ID (G-XXXXXXX)" name='googleAnalyticsId'>
                <Input placeholder="G-XXXXXXXXXX" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Custom Scripts (Header)" name='headerScripts'>
                <Input.TextArea rows={4} placeholder="Thêm scripts tùy chỉnh vào thẻ <head>" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-8 rounded shadow-sm border border-gray-100 animate-fade-in">
      {contextHolder}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Cài đặt Hệ thống</h2>
          <p className="text-sm text-gray-500 m-0">Quản lý cấu hình, thông tin liên hệ và các tùy chỉnh nâng cao cho website.</p>
        </div>
        <Button
          type="primary"
          onClick={() => form.submit()}
          icon={<SaveOutlined />}
          loading={saving}
          size="large"
          className="bg-[#005daa] hover:bg-[#004785] h-11 px-8 rounded font-semibold"
        >
          Lưu tất cả thay đổi
        </Button>
      </div>

      <div>
        {loading ? (
          <div className="py-8">
            <Skeleton active paragraph={{ rows: 12 }} />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="font-inter"
            size="large"
          >
            <Tabs
              defaultActiveKey="1"
              items={tabItems}
              className="settings-tabs"
              tabBarStyle={{ marginBottom: 0 }}
              contentStyle={{ paddingTop: '32px' }}
            />
          </Form>
        )}
      </div>
    </div>
  );
};

