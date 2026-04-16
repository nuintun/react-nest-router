import { Space } from 'antd';
import { memo, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-nest-router';

export default memo(function Courses() {
  const context = useOutletContext();

  useEffect(() => {
    console.log('Courses Mounted');

    return () => {
      console.log('Courses Unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('Courses Context:', context);
  });

  return (
    <Space orientation="vertical">
      <div>Courses</div>
      <Outlet />
    </Space>
  );
});
