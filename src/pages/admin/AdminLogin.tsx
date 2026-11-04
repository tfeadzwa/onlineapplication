import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import campusAdmin from "@/assets/campus-graduation.jpg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) { setLoading(false); setError("Invalid email or password."); return; }
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    if (!isAdmin) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("This account does not have administrator access.");
      return;
    }
    // Let the auth listener load the role before entering
    setTimeout(() => navigate("/admin"), 300);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Campus photo backdrop */}
      <div className="absolute inset-0">
        <img src={campusAdmin} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl p-8 sm:p-10 border border-border/40">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Admissions Office</h1>
          <p className="text-sm text-muted-foreground mt-1">Great Zimbabwe University — staff sign in</p>
        </div>
        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}
          </div>
        )}
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Staff Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="admissions@gzu.ac.zw" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" placeholder="••••••••" />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full font-semibold" disabled={loading}>
            {loading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4 ml-1" /></>}
          </Button>
          <Button type="button" variant="outline" size="lg" className="w-full rounded-full" onClick={() => { setEmail("admissions@gzu.ac.zw"); setPassword("GzuAdmissions#2026"); }}>
            Use Demo Admin Credentials
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Applicant? <Link to="/login" className="text-primary font-semibold hover:underline">Go to student sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
