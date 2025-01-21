
import { Button, Form, Input, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '@services/auth';

interface LoginForm {
  username: string;
  password: string;
}

export function Login() {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    try {
      await login(values);
      message.success('登录成功！');
      navigate('/');
    } catch (error) {
      console.error('登录失败，请重试！', error);
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">会议室预定系统</h2>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>
          <div className="flex justify-between mt-4">
            <Button
              type="link"
              onClick={() => navigate('/register')}
            >
              创建账号
            </Button>
            <Button
              type="link"
              onClick={() => navigate('/update_password')}
            >
              忘记密码
            </Button>
          </div>
        </Form>

      </Card>
    </div>
  );
}
