import { lazy } from "react";
import PageEdit from "../pages/edit/[slug]";
import View from "../pages/view";
const Index = lazy(() => import("../pages/Index"));
const History = lazy(() => import("../pages/history"));

const Login = lazy(() => import("../pages/authenication/login"));
const Logout = lazy(() => import("../pages/logout"));

const routes = [
  // dashboard
  {
    path: "/",
    element: <Index />,
    layout: "default",
  },

  {
    path: "/history",
    element: <History />,
    layout: "default",
  },
  // dashboard
  {
    path: "/view/:id",
    element: <View />,
    layout: "default",
  },
];

export { routes };
