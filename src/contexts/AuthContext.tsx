import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  nationalId: string;
  country: string;
  phone?: string;
}

export interface Application {
  id: string;
  userId: string;
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  data: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  applications: Application[];
  login: (email: string, password: string) => boolean;
  register: (data: RegisterData) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  createApplication: () => Application;
  updateApplication: (id: string, step: number, data: Record<string, any>) => void;
  submitApplication: (id: string) => void;
  deleteApplication: (id: string) => void;
  cancelApplication: (id: string) => void;
  reopenApplication: (id: string) => void;
  createTestAcceptedApplication: () => Application;
}

export interface RegisterData {
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  nationalId: string;
  country: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("gz_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem("gz_applications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) localStorage.setItem("gz_user", JSON.stringify(user));
    else localStorage.removeItem("gz_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("gz_applications", JSON.stringify(applications));
  }, [applications]);

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("gz_users") || "[]");
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      const allApps = JSON.parse(localStorage.getItem("gz_all_applications") || "[]");
      setApplications(allApps.filter((a: Application) => a.userId === userData.id));
      return true;
    }
    return false;
  };

  const register = (data: RegisterData) => {
    const users = JSON.parse(localStorage.getItem("gz_users") || "[]");
    if (users.find((u: any) => u.email === data.email)) return false;
    const newUser = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      email: data.email,
      nationalId: data.nationalId,
      country: data.country,
      password: data.password,
    };
    users.push(newUser);
    localStorage.setItem("gz_users", JSON.stringify(users));
    const { password: _, ...userData } = newUser;
    setUser(userData as User);
    setApplications([]);
    return true;
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    const users = JSON.parse(localStorage.getItem("gz_users") || "[]");
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      localStorage.setItem("gz_users", JSON.stringify(users));
    }
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    const users = JSON.parse(localStorage.getItem("gz_users") || "[]");
    const found = users.find((u: any) => u.id === user.id && u.password === currentPassword);
    if (!found) return false;
    found.password = newPassword;
    localStorage.setItem("gz_users", JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    setApplications([]);
  };

  const createApplication = () => {
    const app: Application = {
      id: crypto.randomUUID(),
      userId: user!.id,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStep: 0,
      data: {},
    };
    const updated = [...applications, app];
    setApplications(updated);
    const allApps = JSON.parse(localStorage.getItem("gz_all_applications") || "[]");
    allApps.push(app);
    localStorage.setItem("gz_all_applications", JSON.stringify(allApps));
    return app;
  };

  const updateApplication = (id: string, step: number, data: Record<string, any>) => {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, currentStep: Math.max(a.currentStep, step), data: { ...a.data, ...data }, updatedAt: new Date().toISOString() } : a
    );
    setApplications(updated);
    const allApps = JSON.parse(localStorage.getItem("gz_all_applications") || "[]");
    const allUpdated = allApps.map((a: Application) =>
      a.id === id ? updated.find((u) => u.id === id)! : a
    );
    localStorage.setItem("gz_all_applications", JSON.stringify(allUpdated));
  };

  const submitApplication = (id: string) => {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, status: "submitted" as const, updatedAt: new Date().toISOString() } : a
    );
    setApplications(updated);
    const allApps = JSON.parse(localStorage.getItem("gz_all_applications") || "[]");
    const allUpdated = allApps.map((a: Application) =>
      a.id === id ? updated.find((u) => u.id === id)! : a
    );
    localStorage.setItem("gz_all_applications", JSON.stringify(allUpdated));
  };

  const deleteApplication = (id: string) => {
    const updated = applications.filter((a) => a.id !== id);
    setApplications(updated);
    const allApps = JSON.parse(localStorage.getItem("gz_all_applications") || "[]");
    localStorage.setItem("gz_all_applications", JSON.stringify(allApps.filter((a: Application) => a.id !== id)));
  };

  const cancelApplication = (id: string) => {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, status: "draft" as const, updatedAt: new Date().toISOString() } : a
    );
    setApplications(updated);
    const allApps = JSON.parse(localStorage.getItem("gz_all_applications") || "[]");
    const allUpdated = allApps.map((a: Application) =>
      a.id === id ? updated.find((u) => u.id === id)! : a
    );
    localStorage.setItem("gz_all_applications", JSON.stringify(allUpdated));
  };

  const reopenApplication = (id: string) => {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, status: "draft" as const, updatedAt: new Date().toISOString() } : a
    );
    setApplications(updated);
    const allApps = JSON.parse(localStorage.getItem("gz_all_applications") || "[]");
    const allUpdated = allApps.map((a: Application) =>
      a.id === id ? updated.find((u) => u.id === id)! : a
    );
    localStorage.setItem("gz_all_applications", JSON.stringify(allUpdated));
  };

  return (
    <AuthContext.Provider value={{ user, applications, login, register, logout, updateProfile, changePassword, createApplication, updateApplication, submitApplication, deleteApplication, cancelApplication, reopenApplication }}>
      {children}
    </AuthContext.Provider>
  );
};
