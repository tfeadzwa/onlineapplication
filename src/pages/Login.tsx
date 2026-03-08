import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your application">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Link to="/forgot-password" className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
          </div>
        </div>
        <Button type="submit" className="w-full rounded-full font-semibold" size="lg" disabled={loading}>
          {loading ? "Signing in..." : (
            <>Sign In <ArrowRight className="w-4 h-4 ml-1" /></>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground pt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
