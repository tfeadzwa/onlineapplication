import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { CountrySelect } from "@/components/ui/country-select";
import { Check, X, ArrowRight, Mail, Lock, User, CreditCard } from "lucide-react";

const ZW_ID_REGEX = /^\d{2}-\d{6}[A-Za-z]\d{2}$/;

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasMiddleName, setHasMiddleName] = useState(false);
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("zimbabwe");
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
    if (country === "zimbabwe" && !ZW_ID_REGEX.test(nationalId)) {
      toast.error("Invalid Zimbabwean National ID. Expected format: 45-202231J45");
      return;
    }
    const fullName = [firstName, hasMiddleName ? middleName : "", lastName].filter(Boolean).join(" ");
    setLoading(true);
    setTimeout(() => {
      if (register(fullName, email, nationalId, password)) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.error("An account with this email already exists");
      }
      setLoading(false);
    }, 500);
  };

  const passwordRequirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains a lowercase letter", met: /[a-z]/.test(password) },
  ];

  return (
    <AuthLayout title="Create an account" subtitle="Register to start your application">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Names */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="firstName" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
            <Input id="lastName" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        {/* Middle name toggle */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="hasMiddleName" checked={hasMiddleName} onCheckedChange={(v) => { setHasMiddleName(!!v); if (!v) setMiddleName(""); }} />
            <Label htmlFor="hasMiddleName" className="cursor-pointer text-sm text-muted-foreground">I have a middle name</Label>
          </div>
          {hasMiddleName && (
            <Input id="middleName" placeholder="Enter your middle name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium">Country</Label>
          <CountrySelect value={country} onValueChange={(v) => { setCountry(v); setNationalId(""); }} />
        </div>

        {/* National ID */}
        <div className="space-y-1">
          <Label htmlFor="nationalId" className="text-sm font-medium">National ID Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="nationalId"
              placeholder={country === "zimbabwe" ? "e.g. 45-202231J45" : "Enter your national ID number"}
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
              className="pl-10"
            />
          </div>
          {country === "zimbabwe" && (
            <p className="text-xs text-muted-foreground pl-1">Format: XX-XXXXXXAXX (e.g. 45-202231J45)</p>
          )}
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</Label>
            <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
        </div>

        {/* Password Requirements */}
        {password.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Password requirements</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {passwordRequirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${req.met ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {req.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </div>
                  <span className={`text-xs transition-colors ${req.met ? "text-success" : "text-muted-foreground"}`}>{req.label}</span>
                </div>
              ))}
            </div>
            {confirmPassword.length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/50 mt-2">
                <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${password === confirmPassword ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {password === confirmPassword ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </div>
                <span className={`text-xs transition-colors ${password === confirmPassword ? "text-success" : "text-muted-foreground"}`}>Passwords match</span>
              </div>
            )}
          </div>
        )}

        <Button type="submit" className="w-full rounded-full font-semibold" size="lg" disabled={loading}>
          {loading ? "Creating account..." : (
            <>Create Account <ArrowRight className="w-4 h-4 ml-1" /></>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
