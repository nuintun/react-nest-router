import { Space } from 'antd';
import React, { memo, useCallback, useEffect } from 'react';
import { useNavigate, useResolve } from 'react-nest-router';

export default memo(function NoMatch() {
  const resolve = useResolve();

  useEffect(() => {
    console.log('No Match Mounted');

    return () => {
      console.log('No Match Unmounted');
    };
  }, []);

  const navigate = useNavigate();

  const go = useCallback((href: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();

      navigate(href);
    };
  }, []);

  return (
    <Space orientation="vertical">
      <div>No Match</div>
      <a href={resolve('/')} onClick={go('/')}>
        Home
      </a>
    </Space>
  );
});
