import { useState } from 'react';
import { Form, Input, Button, Upload, message, Space } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { getCaptcha } from '@services/auth';
import { updateUserInfo } from '@services/user';

export const UpdateUserInfo = () => {
  const [form] = Form.useForm();
  const [headPic, setHeadPic] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadProps: UploadProps = {
    name: 'headPic',
    showUploadList: false,
    beforeUpload: beforeUpload,
    onChange: (info) => {
      if (info.file.status === 'done') {
        setHeadPic(info.file.response.url);
        message.success('头像上传成功！');
      }
    },
  };

  const onFinish = async (values: { nickname: string; email: string; phoneNumber: string; captcha: string }) => {
    try {
      await updateUserInfo({
        ...values,
        headPic,
      });
      message.success('更新成功！');
      window.location.reload();
    } catch (error) {
      console.error(error);
      message.error('更新失败，请重试！');
    }
  };

  const handleGetVerificationCode = async () => {
    const email = form.getFieldValue('email');
    if (!email) {
      message.error('请先输入邮箱地址！');
      return;
    }
    try {
      await getCaptcha(email);
      message.success('验证码已发送到您的邮箱！');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      message.error('验证码发送失败，请重试！');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <h2>个人信息更新</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ...JSON.parse(localStorage.getItem('userInfo') || '{}')
        }}
      >
        <Form.Item label="头像">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>更换头像</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ required: false, message: '请输入昵称！' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入昵称" />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱！' },
            { type: 'email', message: '请输入有效的邮箱地址！' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          name="captcha"
          label="验证码"
          rules={[{ required: true, message: '请输入验证码！' }]}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="请输入验证码"
            />
            <Button
              disabled={countdown > 0}
              onClick={handleGetVerificationCode}
            >
              {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="手机号"
          rules={[
            { required: false, message: '请输入手机号！' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号！' }
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            保存修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
