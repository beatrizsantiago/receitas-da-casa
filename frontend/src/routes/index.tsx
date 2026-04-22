import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import RecipeList from '../features/recipes/pages/List';
import RecipeDetail from '../features/recipes/pages/Detail';
import RecipeForm from '../features/recipes/pages/Form';

const PublicLayout = () => (
  <PublicRoute>
    <Outlet />
  </PublicRoute>
);

const PrivateLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Login /> },
      { path: '/registro', element: <Register /> },
    ],
  },
  {
    element: <PrivateLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/receitas', element: <RecipeList /> },
      { path: '/receitas/nova', element: <RecipeForm /> },
      { path: '/receitas/:id', element: <RecipeDetail /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
