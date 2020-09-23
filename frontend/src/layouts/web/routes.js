// core components for layout
import Dashboard from 'pages/web/Dashboard';
import Devices from 'pages/web/Devices';

const MainRoutes = [
  {
    path: "/dashboard",
    name: "Symphony",
    icon: "",
    component: Dashboard,
    layout: "/pages",
    root: true,
  },
  {
    path: "/devices",
    name: "Devices",
    icon: "",
    component: Devices,
    layout: "/pages",
    root: true,
  },
]

export default MainRoutes;