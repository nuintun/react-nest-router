import { memo, useEffect } from 'react';

export default memo(function CoursesIndex() {
  useEffect(() => {
    console.log('Courses Index Mounted');

    return () => {
      console.log('Courses Index Unmounted');
    };
  }, []);

  return <div>Courses Index</div>;
});
