import { useState, useEffect } from 'react';
import { Table, Input, Space, Button, Card, message, Form } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { getUserList, freezeUser } from '@services/user';

export interface UserData {
  id: string;
  username: string;
  email: string;
  nickName: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

interface SearchParams {
  username?: string;
  email?: string;
  nickName?: string;
  phoneNumber?: string;
  page?: number;
  pageSize?: number;
}

export function UserList() {
  const [form] = Form.useForm<SearchParams>();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  });

  const handleSearch = async (values: SearchParams = {}) => {
    setLoading(true);
    try {
      const response = await getUserList({
        ...values,
        page: tableParams.pagination?.current,
        pageSize: tableParams.pagination?.pageSize
      });
      const { data, total } = response.data;
      setUserData(data);
      setTableParams(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total
        }
      }));
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(form.getFieldsValue());
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const handleFreeze = async (id: string) => {
    try {
      await freezeUser(id);
      message.success('用户已冻结');
      handleSearch(); // 刷新列表
    } catch (error) {
      console.error(error);
      message.error('冻结失败');
    }
  };

  const columns: ColumnsType<UserData> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'user' },
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleFreeze(record.id)}>冻结</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="用户列表">
      <Form<SearchParams>
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="username">
          <Input
            placeholder="用户名"
            allowClear
          />
        </Form.Item>
        <Form.Item name="email">
          <Input
            placeholder="邮箱"
            allowClear
          />
        </Form.Item>
        <Form.Item name="nickName">
          <Input
            placeholder="昵称"
            allowClear
          />
        </Form.Item>
        <Form.Item name="phoneNumber">
          <Input
            placeholder="手机号"
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
            >
              搜索
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                handleSearch();
              }}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table<UserData>
        columns={columns}
        dataSource={userData}
        rowKey="id"
        loading={loading}
        pagination={tableParams.pagination}
      />
    </Card>
  );
}
