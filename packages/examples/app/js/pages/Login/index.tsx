import * as styles from '/css/login/index.module.scss';

import { memo, useEffect } from 'react';

export default memo(function Login() {
  useEffect(() => {
    console.log('Login Mounted');

    return () => {
      console.log('Login Unmounted');
    };
  }, []);

  return <div className={styles.main}>Login</div>;
});
