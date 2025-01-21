import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Register } from '@pages/register';
import { Login } from '@pages/login';
import { UpdatePassword } from '@pages/updatePassword';
import { ErrorPage } from '@components/ErrorPage.tsx';
import { UpdateUserInfo } from '@pages/updateUserInfo';
import { Home } from '@pages/home'
import { UserList } from '@pages/UserList';
import { Menu } from './components/Menu';

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Menu />,
        children: [
          {
            path: "/",
            element: <Navigate to="/userList" />,
          },
          {
            path: "userList",
            element: <UserList />,
          },
          {
            path: "update_password",
            element: <UpdatePassword />,
          },
          {
            path: "update",
            element: <UpdateUserInfo />,
          }
        ]
      }
    ]
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },

]
const router = createBrowserRouter(routes, {basename: import.meta.env.BASE_URL});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
