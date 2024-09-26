import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export type AuthUser = {
  token: string;
  userName: string;
  lastName: string;
  role: string;
  id: number;
  message: string;
};

export type AuthUserRole = {
  id: number;
};

export type AuthContextType = {
  isUserAuthenticated: () => boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  getUser: () => AuthUser | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const navLink = useNavigate();
  const login = (data: any) => {
    localStorage.setItem("userName", data?.lastName);
    localStorage.setItem("role", data?.Role?.role);
    localStorage.setItem("token", data?.token);
    localStorage.setItem("userId", String(data?.id));
    setAuthUser(data);
  };

  const logout = async () => {
    localStorage.clear();
    setAuthUser(null);
    await navLink("/");
  };

  const getUser = () => authUser;

  const isUserAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ isUserAuthenticated, login, logout, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
