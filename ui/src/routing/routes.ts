import Dashboard from "../components/Dashboard/Dashboard";
import Login from "../components/Login/Login";

export default [
    {name: "dashboard", path: "/", exact: true, component: Dashboard},
    {name: "login", path: "/login", exact: true, component: Login},
];
