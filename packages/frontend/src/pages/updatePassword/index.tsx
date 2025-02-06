import { Button, Form, Input, Card, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { getCaptcha, updatePassword } from '@services/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UpdatePasswordFormValues {
  captcha: string;
  password: string;
}

export function UpdatePassword() {
  const [form] = Form.useForm();
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    form.setFieldsValue({
      email: userInfo?.email,
    });
  }, []);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const sendVerificationCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        message.error('请先输入邮箱地址！');
        return;
      }
      await getCaptcha(email);
      message.success('验证码已发送到您的邮箱！');
      setCountdown(60);
    } catch (error) {
      console.error('发送验证码错误:', error);
      message.error('验证码发送失败，请重试！');
    }
  };

  const onFinish = async (values: UpdatePasswordFormValues) => {
    try {
      await updatePassword(values);
      message.success('密码重置成功！');
      navigate('/login');
    } catch (error: unknown) {
      console.error('重置密码错误:', error);
      message.error('密码重置失败，请重试！');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">重置密码</h2>
        </div>

        <Form form={form} name="updatePassword" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址！' },
              { type: 'email', message: '请输入有效的邮箱地址！' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱地址" size="large" />
          </Form.Item>

          <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码！' }]}>
            <div className="flex gap-2">
              <Input placeholder="验证码" size="large" />
              <Button size="large" onClick={sendVerificationCode} disabled={countdown > 0}>
                {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入新密码！' },
              { min: 6, message: '密码长度至少6位！' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密码" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认新密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              重置密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
