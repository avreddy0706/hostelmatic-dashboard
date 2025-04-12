
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Index from './pages/Index';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tenants = lazy(() => import('./pages/Tenants'));
const Rooms = lazy(() => import('./pages/Rooms'));
const Payments = lazy(() => import('./pages/Payments'));
const Analytics = lazy(() => import('./pages/Analytics'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const DASHBOARD_ROUTE = '/dashboard';
export const TENANTS_ROUTE = '/tenants';
export const ROOMS_ROUTE = '/rooms';
export const PAYMENTS_ROUTE = '/payments';
export const ANALYTICS_ROUTE = '/analytics';

export const ROUTES = [
  { path: '/', element: <Navigate to={DASHBOARD_ROUTE} replace /> },
  { path: DASHBOARD_ROUTE, element: <Dashboard /> },
  { path: TENANTS_ROUTE, element: <Tenants /> },
  { path: ROOMS_ROUTE, element: <Rooms /> },
  { path: PAYMENTS_ROUTE, element: <Payments /> },
  { path: ANALYTICS_ROUTE, element: <Analytics /> },
  { path: '*', element: <NotFound /> },
];
