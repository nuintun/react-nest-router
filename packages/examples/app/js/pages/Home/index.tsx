import { memo, useEffect } from 'react';

export default memo(function Home() {
  useEffect(() => {
    console.log('Home Mounted');

    return () => {
      console.log('Home Unmounted');
    };
  }, []);

  return <div>Home</div>;
});
