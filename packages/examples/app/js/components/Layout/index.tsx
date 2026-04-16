import { Space } from 'antd';
import { memo, useEffect } from 'react';
import { Outlet } from 'react-nest-router';

export default memo(function Layout() {
  useEffect(() => {
    console.log('Layout Mounted');

    return () => {
      console.log('Layout Unmounted');
    };
  }, []);

  return (
    <Space orientation="vertical">
      <div>Layout</div>
      <Outlet />
    </Space>
  );
});
