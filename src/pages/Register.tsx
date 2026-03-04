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

  return (
    <AuthLayout title="Create an account" subtitle="Register to start your application">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="hasMiddleName" checked={hasMiddleName} onCheckedChange={(v) => { setHasMiddleName(!!v); if (!v) setMiddleName(""); }} />
            <Label htmlFor="hasMiddleName" className="cursor-pointer text-muted-foreground">I have a middle name</Label>
          </div>
          {hasMiddleName && (
            <Input id="middleName" placeholder="Enter your middle name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="e.g. john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <CountrySelect value={country} onValueChange={(v) => { setCountry(v); setNationalId(""); }} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="nationalId">National ID Number</Label>
          <Input
            id="nationalId"
            placeholder={country === "zimbabwe" ? "e.g. 45-202231J45" : "Enter your national ID number"}
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            required
          />
          {country === "zimbabwe" && (
            <p className="text-xs text-muted-foreground">Format: XX-XXXXXXAXX (e.g. 45-202231J45)</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
