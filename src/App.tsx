import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/auth_context";
import { RecoilRoot } from "recoil";

export default function App() {
  return (
    <RecoilRoot>
      <MantineProvider
        theme={{
          colors: {
            primary: [
              "#f0f9ff",
              "#e0f2fe",
              "#bae6fd",
              "#7dd3fc",
              "#60a5fa",
              "#3b82f6",
              "#2563eb",
              "#1d4ed8",
              "#1e40af",
              "#1e3a8a",
            ],
          },
          primaryColor: "blue",
          fontFamily: "Readex Pro, sans-serif",
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <Notifications />
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </RecoilRoot>
  );
}
