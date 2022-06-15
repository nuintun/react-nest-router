/**
 * @module index
 */

export type {
  Action,
  IRoute,
  Location,
  Navigate,
  NavigateOptions,
  NavigateProps,
  Navigator,
  OutletProps,
  Params,
  Route,
  RouteMatch,
  RouterProps,
  To
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
export { parseURL, resolveURL } from './url';
export { join, normalize, resolve } from './path';
