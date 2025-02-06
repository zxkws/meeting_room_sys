import { UserOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">会议室预定系统</h1>
          <Link to="/update">
            <UserOutlined className="text-xl text-gray-600 cursor-pointer hover:text-blue-500 transition-colors" />
          </Link>
        </div>
      </div>
      <div className="max-w-8xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
