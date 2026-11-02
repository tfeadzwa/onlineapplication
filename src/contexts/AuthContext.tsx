import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export type ApplicationStatus = "draft" | "submitted" | "under_review" | "accepted" | "rejected";

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  data: Record<string, any>;
  offeredProgramme?: string | null;
  offeredFaculty?: string | null;
  adminNotes?: string | null;
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

type Result = { ok: boolean; error?: string };

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  applications: Application[];
  login: (email: string, password: string) => Promise<Result>;
  register: (data: RegisterData) => Promise<Result & { needsConfirmation?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<Result>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<Result>;
  createApplication: () => Promise<Application | null>;
  updateApplication: (id: string, step: number, data: Record<string, any>) => Promise<void>;
  submitApplication: (id: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  cancelApplication: (id: string) => Promise<void>;
  reopenApplication: (id: string) => Promise<void>;
  refreshApplications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const mapApplication = (row: any): Application => ({
  id: row.id,
  userId: row.user_id,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  currentStep: row.current_step,
  data: row.data || {},
  offeredProgramme: row.offered_programme,
  offeredFaculty: row.offered_faculty,
  adminNotes: row.admin_notes,
});

export const mapProfile = (p: any): User => ({
  id: p.id,
  email: p.email,
  firstName: p.first_name,
  lastName: p.last_name,
  middleName: p.middle_name ?? undefined,
  fullName: p.full_name || [p.first_name, p.middle_name, p.last_name].filter(Boolean).join(" "),
  nationalId: p.national_id,
  country: p.country,
  phone: p.phone ?? undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  const loadUser = useCallback(async (uid: string | null) => {
    if (!uid) {
      setUser(null); setIsAdmin(false); setApplications([]); setLoading(false);
      return;
    }
    const [{ data: profile }, { data: roles }, { data: apps }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
      supabase.from("applications").select("*").eq("user_id", uid).order("created_at", { ascending: true }),
    ]);
    if (profile) setUser(mapProfile(profile));
    setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    setApplications((apps || []).map(mapApplication));
    setLoading(false);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => loadUser(session?.user?.id ?? null), 0);
    });
    supabase.auth.getSession().then(({ data }) => loadUser(data.session?.user?.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, [loadUser]);

  const refreshApplications = async () => {
    if (!user) return;
    const { data } = await supabase.from("applications").select("*").eq("user_id", user.id).order("created_at");
    setApplications((data || []).map(mapApplication));
  };

  const login: AuthContextType["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message === "Invalid login credentials" ? "Invalid email or password." : error.message };
    return { ok: true };
  };

  const register: AuthContextType["register"] = async (d) => {
    const { data, error } = await supabase.auth.signUp({
      email: d.email,
      password: d.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          first_name: d.firstName, last_name: d.lastName, middle_name: d.middleName ?? "",
          full_name: d.fullName, national_id: d.nationalId, country: d.country,
        },
      },
    });
    if (error) return { ok: false, error: error.message };
    if (data.user && data.user.identities?.length === 0) return { ok: false, error: "An account with this email already exists." };
    return { ok: true, needsConfirmation: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile: AuthContextType["updateProfile"] = async (d) => {
    if (!user) return { ok: false, error: "Not signed in" };
    const { error } = await supabase.from("profiles").update({
      first_name: d.firstName ?? user.firstName,
      last_name: d.lastName ?? user.lastName,
      middle_name: d.middleName ?? user.middleName ?? null,
      full_name: d.fullName ?? user.fullName,
      phone: d.phone ?? user.phone ?? null,
    }).eq("id", user.id);
    if (error) return { ok: false, error: error.message };
    setUser({ ...user, ...d });
    return { ok: true };
  };

  const changePassword: AuthContextType["changePassword"] = async (currentPassword, newPassword) => {
    if (!user) return { ok: false, error: "Not signed in" };
    const { error: authErr } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
    if (authErr) return { ok: false, error: "Current password is incorrect" };
    const { error } = await supabase.auth.updateUser({ password: newPassword, current_password: currentPassword } as any);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const createApplication = async () => {
    if (!user) return null;
    const { data, error } = await supabase.from("applications").insert({ user_id: user.id }).select().single();
    if (error || !data) return null;
    const app = mapApplication(data);
    setApplications((prev) => [...prev, app]);
    return app;
  };

  const patchLocal = (id: string, patch: Partial<Application>) =>
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a)));

  const updateApplication = async (id: string, step: number, data: Record<string, any>) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const nextStep = Math.max(app.currentStep, step);
    const nextData = { ...app.data, ...data };
    patchLocal(id, { currentStep: nextStep, data: nextData });
    await supabase.from("applications").update({ current_step: nextStep, data: nextData }).eq("id", id);
  };

  const setStatus = async (id: string, status: ApplicationStatus) => {
    patchLocal(id, { status });
    await supabase.from("applications").update({ status }).eq("id", id);
  };

  const submitApplication = (id: string) => setStatus(id, "submitted");
  const cancelApplication = (id: string) => setStatus(id, "draft");
  const reopenApplication = (id: string) => setStatus(id, "draft");

  const deleteApplication = async (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("applications").delete().eq("id", id);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, applications, login, register, logout, updateProfile, changePassword, createApplication, updateApplication, submitApplication, deleteApplication, cancelApplication, reopenApplication, refreshApplications }}>
      {children}
    </AuthContext.Provider>
  );
};
