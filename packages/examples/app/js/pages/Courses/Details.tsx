import { memo, useEffect } from 'react';
import { useLocation, useParams } from 'react-nest-router';

export default memo(function CoursesDetails() {
  useEffect(() => {
    console.log('Courses Details Mounted');

    return () => {
      console.log('Courses Details Unmounted');
    };
  }, []);

  const location = useLocation();
  const params = useParams<'id'>();

  useEffect(() => {
    console.log('Courses Details State:', location.state);
  });

  return <div>Courses Details {params.id}</div>;
});
