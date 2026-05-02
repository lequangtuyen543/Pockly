import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { FullscreenLayout } from '@/components/layouts/FullscreenLayout';

// Placeholder components - will be implemented later
const Home = () => <div>Home Page</div>;
const AddTransaction = () => <div>Add Transaction</div>;
const Stats = () => <div>Stats Page</div>;
const Settings = () => <div>Settings Page</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><Home /></AppLayout>,
  },
  {
    path: '/add',
    element: <FullscreenLayout><AddTransaction /></FullscreenLayout>,
  },
  {
    path: '/stats',
    element: <AppLayout><Stats /></AppLayout>,
  },
  {
    path: '/settings',
    element: <AppLayout><Settings /></AppLayout>,
  },
]);