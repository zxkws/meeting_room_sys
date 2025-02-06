import { Button, Form, Input, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { getCaptcha, register } from '@services/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface RegisterFormValues {
  username: string;
  nickName: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}

export function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sendingCaptcha, setSendingCaptcha] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const onFinish = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      await register(values);
      message.success('注册成功！');
      navigate('/login');
    } catch (error: unknown) {
      console.error('注册错误:', error);
      message.error('注册失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const sendCaptcha = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        message.error('请先输入邮箱！');
        return;
      }
      setSendingCaptcha(true);
      await getCaptcha(email);
      message.success('验证码已发送！');
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
      console.error('验证码发送失败:', error);
      message.error('验证码发送失败，请重试！');
    } finally {
      setSendingCaptcha(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">注册账号</h2>
        </div>

        <Form form={form} name="register" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 6, message: '用户名长度至少6位！' },
              { max: 20, message: '用户名长度不能超过20位！' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>

          <Form.Item
            name="nickName"
            rules={[
              { required: true, message: '请输入昵称！' },
              { min: 6, message: '昵称长度至少6位！' },
              { max: 20, message: '昵称长度不能超过20位！' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="昵称" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码长度至少6位！' },
              { max: 20, message: '密码长度不能超过20位！' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码！' },
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
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" size="large" />
          </Form.Item>

          <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码！' }]}>
            <div className="flex gap-4">
              <Input placeholder="验证码" size="large" />
              <Button type="primary" onClick={sendCaptcha} loading={sendingCaptcha} disabled={countdown > 0} size="large">
                {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              注册
            </Button>
          </Form.Item>

          <div className="text-center">
            <Button type="link" onClick={() => navigate('/login')}>
              已有账号？去登录
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
