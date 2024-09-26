import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import MainPage from "./pages/main/main.tsx";
import Dashboard from "./pages/main/dashboard/dashboard.tsx";
import Users from "./pages/main/user/user.tsx";
import ProjectPage from "./pages/main/project/project.tsx";
import TaskPage from "./pages/main/task/task.tsx";
import LoginPage from "./pages/login/login.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route index element={<LoginPage />} />
      <Route path="/" element={<MainPage />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/project" element={<Outlet />}>
          <Route path="" element={<ProjectPage />} />
          <Route path=":id" element={<TaskPage />} />
        </Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);
