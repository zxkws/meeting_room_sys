import { Button, Result } from 'antd';
import { useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="error"
        title="出错了！"
        subTitle={error?.toString() || '发生了一些错误'}
        extra={[
          <Button type="primary" key="back" onClick={() => window.history.back()}>
            返回上一页
          </Button>,
        ]}
      />
    </div>
  );
}
