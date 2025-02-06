import { getBookingList } from '@/services/booking';
import { Button, Table } from 'antd';

import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

interface BookingSearchResult {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
}

const columns: ColumnsType<BookingSearchResult> = [
  {
    title: '会议室名称',
    dataIndex: 'room',
    render: (record) => record.room.name,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    render: (record) => record.startTime,
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    render: (record) => record.endTime,
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (record) => record.status,
  },
  {
    title: '备注',
    dataIndex: 'note',
    render: (record) => record.note,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    render: (record) => record.createTime,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    render: (record) => record.updateTime,
  },
  {
    title: '操作',
    render: (record) => (
      <Button type="primary" onClick={() => handleEdit(record)}>
        编辑
      </Button>
    ),
  },
];

export const BookingManage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState<BookingSearchResult[]>([]);

  const changePage = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    getBookingList({
      page,
      pageSize,
    }).then((res) => {
      setDataSource(res.data.data.list);
      setTotal(res.data.data.total);
    });
  }, [page, pageSize]);

  return (
    <div>
      <div className="flex justify-evenly items-center">
        <div>111</div>
        <div>2222</div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: changePage,
        }}
      />
    </div>
  );
};
function handleEdit(record: BookingSearchResult): void {
  console.log(record);
}
