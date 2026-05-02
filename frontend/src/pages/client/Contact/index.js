import contactBg from '../../../assets/img/contact-bg.jpg';
import { Button, Form, Input, message } from 'antd';
import { HeroItem } from '../../../components/HeroItem';
import { MailOutlined, UserOutlined, PhoneOutlined, MessageOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export const Contact = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    console.log('Success:', values);
    messageApi.success('Your message has been sent successfully!');
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <HeroItem title="Contact Me" subtitle="Have questions? I have answers." thumbnail={contactBg} />

      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-inter">Get In Touch</h2>
          <p className="text-lg text-gray-600 font-inter">
            Want to get in touch? Fill out the form below to send me a message and I will get back to you as soon as possible!
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <Form
            form={form}
            name="contact_form"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="font-inter"
          >
            <Form.Item
              label={<span className="font-semibold text-gray-700">Name</span>}
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="John Doe" className="rounded-lg" />
            </Form.Item>

            <Form.Item 
              name="email" 
              label={<span className="font-semibold text-gray-700">Email Address</span>} 
              rules={[
                { type: 'email', message: 'Please enter a valid email!' },
                { required: true, message: 'Please input your Email!' }
              ]}
            >
              <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="john@example.com" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="font-semibold text-gray-700">Phone Number</span>}
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="+1 (555) 000-0000" className="rounded-lg" />
            </Form.Item>

            <Form.Item 
              name="message" 
              label={<span className="font-semibold text-gray-700">Message</span>} 
              rules={[{ required: true, message: 'Please input your message!' }]}
            >
              <TextArea 
                rows={5} 
                placeholder="How can I help you today?" 
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-0 mt-8">
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<MessageOutlined />}
                className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 border-none rounded-lg shadow-sm"
              >
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};