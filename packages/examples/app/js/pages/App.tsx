import '/css/global.scss';
import * as styles from '/css/App.module.scss';

import { Button, Result, Space } from 'antd';
import { Route, Router } from 'react-nest-router';
import React, { lazy, memo, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import react from '/images/react.svg?url';

const Home = lazy(() => import('/js/pages/Home'));
const Login = lazy(() => import('/js/pages/Login'));
const Layout = lazy(() => import('/js/components/Layout'));
const Courses = lazy(() => import('/js/components/Courses'));
const CoursesIndex = lazy(() => import('/js/pages/Courses'));
const NoMatch = lazy(() => import('/js/components/NoMatch'));
const Navigation = lazy(() => import('/js/components/Navigation'));
const CoursesDetails = lazy(() => import('/js/pages/Courses/Details'));

const routes: Route<{ id: number }, 'id'>[] = [
  {
    element: <Navigation />,
    children: [
      {
        path: '/login',
        meta: { id: 1 },
        element: <Login />
      },
      {
        path: '/',
        meta: { id: 2 },
        element: <Layout />,
        children: [
          {
            index: true,
            meta: { id: 6 },
            element: <Home />
          },
          {
            path: 'courses',
            meta: { id: 3 },
            element: <Courses />,
            children: [
              { index: true, meta: { id: 4 }, element: <CoursesIndex /> },
              { path: ':id', meta: { id: 5 }, element: <CoursesDetails /> }
            ]
          }
        ]
      }
    ]
  }
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const { stack, message } = error;

    if (stack != null) {
      return stack?.replace(/(\r?\n)\s{2,}/gm, '$1  ');
    }

    return message;
  }

  return `${error}`;
}

const ErrorFallback = memo(function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (__DEV__) {
    return (
      <Result
        status="error"
        title="页面错误"
        extra={
          <Button type="primary" onClick={resetErrorBoundary}>
            重试页面
          </Button>
        }
        subTitle={
          <div style={{ display: 'flex', margin: '24px 0 0', justifyContent: 'center' }}>
            <pre style={{ fontFamily: 'monospace', color: '#f00', padding: 0, margin: 0, textAlign: 'left' }}>
              {getErrorMessage(error)}
            </pre>
          </div>
        }
      />
    );
  }

  return (
    <Result
      status="error"
      title="页面错误"
      extra={
        <Button type="primary" onClick={resetErrorBoundary}>
          重试页面
        </Button>
      }
      subTitle="抱歉，发生错误，无法渲染页面，请联系系统管理员或者重试页面！"
    />
  );
});

export default memo(function App(): React.ReactElement {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Space className={styles.app} orientation="vertical">
        <img className={styles.react} src={react} alt="react" />
        <Suspense fallback="loading...">
          <Router routes={routes} context={{ message: 'Outlet Context' }} basename={__DEV__ ? '/' : '/react-nest-router'}>
            <NoMatch />
          </Router>
        </Suspense>
      </Space>
    </ErrorBoundary>
  );
});
