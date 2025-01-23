import { Outlet } from "react-router-dom";
import { Layout, Menu as AntMenu } from "antd";
import { CalendarOutlined, HomeOutlined, BarChartOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider, Content } = Layout;

export const Menu = () => {
  return (
    <Layout className="min-h-screen">
      <Sider
        theme="light"
        className="shadow-md"
        width={220}
      >
        <AntMenu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: <Link to="/">会议室管理</Link>,
            },
            {
              key: '2',
              icon: <CalendarOutlined />,
              label: <Link to="/meeting">预定管理</Link>,
            },
            {
              key: '3',
              icon: <UserOutlined />,
              label: <Link to="/userList">用户管理</Link>,
            },
            {
              key: '4',
              icon: <BarChartOutlined />,
              label: <Link to="/statistics">统计</Link>,
              disabled: true,
            },
          ]}
        />
      </Sider>
      <Layout className="bg-gray-50">
        <Content className="p-6">
          <div className="bg-white rounded-lg shadow-sm min-h-[calc(100vh-48px)] p-6">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
