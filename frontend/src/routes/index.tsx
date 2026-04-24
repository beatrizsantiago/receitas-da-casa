import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import PrivateLayout from './PrivateLayout';
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import RecipeList from '@/features/recipes/pages/List';
import RecipeDetail from '@/features/recipes/pages/Detail';
import RecipeForm from '@/features/recipes/pages/Form';
import TagsPage from '@/features/tags/pages/Tags';

const PublicLayout = () => (
  <PublicRoute>
    <Outlet />
  </PublicRoute>
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Login /> },
      { path: '/cadastro', element: <Register /> },
    ],
  },
  {
    element: <PrivateLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/receitas', element: <RecipeList /> },
      { path: '/receitas/nova', element: <RecipeForm /> },
      { path: '/receitas/:id', element: <RecipeDetail /> },
      { path: '/tags', element: <TagsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
