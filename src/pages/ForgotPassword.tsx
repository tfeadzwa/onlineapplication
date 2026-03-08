import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/ui/country-select";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

const ZW_ID_REGEX = /^\d{2}-\d{6}[A-Za-z]\d{2}$/;

const ForgotPassword = () => {
  const [step, setStep] = useState<"form" | "sent">("form");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("zimbabwe");
  const [nationalId, setNationalId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (country === "zimbabwe" && !ZW_ID_REGEX.test(nationalId)) {
      toast.error("Invalid Zimbabwean National ID. Expected format: 45-202231J45");
      return;
    }

    setLoading(true);

    // Simulate verification against stored users
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("gz_users") || "[]");
      const found = users.find(
        (u: any) => u.email === email && u.nationalId === nationalId
      );

      if (found) {
        // Store reset token
        const token = crypto.randomUUID();
        localStorage.setItem(
          "gz_reset_token",
          JSON.stringify({ token, userId: found.id, email: found.email, expiresAt: Date.now() + 15 * 60 * 1000 })
        );
        setStep("sent");
      } else {
        toast.error("No account found with these details. Please check your email and national ID.");
      }
      setLoading(false);
    }, 800);
  };

  if (step === "sent") {
    return (
      <AuthLayout title="Check your details" subtitle="Password reset is ready">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your identity has been verified for <span className="font-medium text-foreground">{email}</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              Click below to set a new password.
            </p>
          </div>
          <Link to="/reset-password">
            <Button className="w-full" size="lg">
              Set New Password
            </Button>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="Verify your identity to reset your password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <CountrySelect
            value={country}
            onValueChange={(v) => {
              setCountry(v);
              setNationalId("");
            }}
          />
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
            <p className="text-xs text-muted-foreground">
              Format: XX-XXXXXXAXX (e.g. 45-202231J45)
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Verifying..." : "Verify Identity"}
        </Button>
        <p className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
