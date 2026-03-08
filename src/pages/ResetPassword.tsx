import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, X, ShieldCheck } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const resetData = JSON.parse(localStorage.getItem("gz_reset_token") || "null");
  const isValid = resetData && resetData.expiresAt > Date.now();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("gz_users") || "[]");
      const updated = users.map((u: any) =>
        u.id === resetData.userId ? { ...u, password } : u
      );
      localStorage.setItem("gz_users", JSON.stringify(updated));
      localStorage.removeItem("gz_reset_token");
      setDone(true);
      setLoading(false);
      toast.success("Password reset successfully!");
    }, 600);
  };

  if (!isValid) {
    return (
      <AuthLayout title="Link expired" subtitle="This reset link is no longer valid">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">
            The password reset link has expired or is invalid. Please request a new one.
          </p>
          <Link to="/forgot-password">
            <Button className="w-full" size="lg">Request New Reset</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password updated" subtitle="Your password has been changed successfully">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            You can now sign in with your new password.
          </p>
          <Button className="w-full" size="lg" onClick={() => navigate("/login")}>
            Go to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password" subtitle={`Resetting password for ${resetData.email}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {password.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Password requirements</p>
            {[
              { label: "At least 6 characters", met: password.length >= 6 },
              { label: "Contains a number", met: /\d/.test(password) },
              { label: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
              { label: "Contains a lowercase letter", met: /[a-z]/.test(password) },
            ].map((req) => (
              <div key={req.label} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${req.met ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/10 text-destructive"}`}>
                  {req.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </div>
                <span className={`text-xs transition-colors ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}>{req.label}</span>
              </div>
            ))}
            {confirmPassword.length > 0 && (
              <div className="flex items-center gap-2 pt-1 border-t border-border/50 mt-1.5">
                <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${password === confirmPassword ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/10 text-destructive"}`}>
                  {password === confirmPassword ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </div>
                <span className={`text-xs transition-colors ${password === confirmPassword ? "text-emerald-600" : "text-muted-foreground"}`}>Passwords match</span>
              </div>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
