import { Button, Menu } from "@mantine/core";

import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowDownBar,
  Folder,
  LayoutDashboard,
  Logout,
  User,
} from "tabler-icons-react";
import { AuthContext } from "../context/auth_context";

export default function Navbar() {
  const authContext = useContext(AuthContext);

  function logout() {
    authContext?.logout();
  }

  const navLinkClass = ({ isActive }: any) =>
    isActive ? "nav-link-active" : "nav-link";

  return (
    <div className="w-full flex flex-col fixed bg-gradient-to-b from-sky-400 to-sky-500 z-50">
      <div className="w-full flex justify-between items-center px-8">
        <div className="flex flex-row items-center space-x-2">
          <div className="text-white text-xl font-medium tracking-wide">
            <span className="">Task Tracker</span>
          </div>
        </div>
        <Menu position="bottom-start" shadow="md" width={200}>
          <Menu.Target>
            <Button
              variant="subtle"
              className="text-white hover:bg-accent-light text-base"
              rightIcon={<ArrowDownBar size={16} />}
            >
              Welcome {localStorage.getItem("userName")}{" "}
              {localStorage.getItem("lastName")}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={logout} color="red" icon={<Logout size={14} />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div className="bg-white w-full h-full flex items-end justify-start pl-8 space-x-6 shadow-soft">
        <NavLink to="/dashboard" className={navLinkClass}>
          <div className="flex items-center space-x-1">
            <LayoutDashboard size={18} />
            <div>Dashboard</div>
          </div>
        </NavLink>
        <NavLink to="/project" className={navLinkClass}>
          <div className="flex items-center space-x-1">
            <Folder size={18} />
            <div>Project</div>
          </div>
        </NavLink>
        <NavLink to="/users" className={navLinkClass}>
          <div className="flex items-center space-x-1">
            <User size={18} />
            <div>Users</div>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
