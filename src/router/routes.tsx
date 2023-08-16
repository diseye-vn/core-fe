import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Login = lazy(() => import('../pages/authenication/login'));
const Logout = lazy(() => import('../pages/logout'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },

    // dashboard
    {
        path: '/login',
        element: <Login />,
        layout: 'blank',
    },
    {
        path: '/logout',
        element: <Logout />,
        layout: 'blank',
    }

];

export { routes };
