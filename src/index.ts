/**
 * @module index
 */

// Types
export type {
  Action,
  IRoute,
  Location,
  Navigate,
  NavigateOptions,
  NavigateProps,
  Navigator,
  NavigatorEvent,
  OutletProps,
  Params,
  Route,
  RouteMatch,
  RouterProps,
  To
} from './types';

// Hooks
export * from './hooks/useMatch';
export * from './hooks/useRouter';
export * from './hooks/useOutlet';
export * from './hooks/useParams';
export * from './hooks/useResolve';
export * from './hooks/useMatches';
export * from './hooks/useNavigate';
export * from './hooks/useLocation';
export * from './hooks/useMatchIndex';
export * from './hooks/useOutletContext';

// Components
export * from './components/Router';
export * from './components/Outlet';
export * from './components/Navigate';

// Utils
export { join, normalize, resolve } from './path';
