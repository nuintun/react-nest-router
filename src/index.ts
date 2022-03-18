/**
 * @module index
 */

export type {
  IRoute,
  Location,
  Navigate,
  NavigateOptions,
  NavigateProps,
  Navigator,
  NavigatorListener,
  OutletProps,
  Params,
  Route,
  RouteMatch,
  RouterProps
} from './types';
export * from './hooks/useMatch';
export * from './hooks/useRouter';
export * from './hooks/useOutlet';
export * from './hooks/useParams';
export * from './hooks/useResolve';
export * from './hooks/useMatches';
export * from './components/Router';
export * from './components/Outlet';
export * from './hooks/useNavigate';
export * from './hooks/useLocation';
export * from './hooks/useOutletContext';
