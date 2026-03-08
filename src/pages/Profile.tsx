import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  GraduationCap, ArrowLeft, User, Mail, CreditCard, Globe, Phone, Lock,
  Check, X, Shield, Save, Eye, EyeOff,
} from "lucide-react";

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [middleName, setMiddleName] = useState(user?.middleName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleSaveProfile = () => {
    setSaving(true);
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");
    setTimeout(() => {
      updateProfile({ firstName, lastName, middleName, phone, fullName });
      toast.success("Profile updated successfully");
      setSaving(false);
    }, 400);
  };

  const passwordRequirements = [
    { label: "At least 6 characters", met: newPassword.length >= 6 },
    { label: "Contains a number", met: /\d/.test(newPassword) },
    { label: "Contains uppercase", met: /[A-Z]/.test(newPassword) },
    { label: "Contains lowercase", met: /[a-z]/.test(newPassword) },
  ];
  const allMet = passwordRequirements.every((r) => r.met);

  const handleChangePassword = () => {
    if (!allMet) { toast.error("Password doesn't meet all requirements"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setChangingPw(true);
    setTimeout(() => {
      if (changePassword(currentPassword, newPassword)) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Current password is incorrect");
      }
      setChangingPw(false);
    }, 400);
  };

  const initials = `${(user?.firstName || "U")[0]}${(user?.lastName || "")[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm">GZU Admissions</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container px-4 sm:px-6 py-8 max-w-5xl">
        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-8 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-2xl font-heading font-bold text-primary">{initials}</span>
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight">{user?.fullName}</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Account settings & security
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Personal Information */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">First Name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Middle Name</Label>
                <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className="pl-10" />
                </div>
              </div>

              <Separator />

              {/* Read-only fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </Label>
                  <Input value={user?.email || ""} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> National ID
                  </Label>
                  <Input value={user?.nationalId || ""} disabled className="bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Country
                </Label>
                <Input value={user?.country ? user.country.charAt(0).toUpperCase() + user.country.slice(1) : "—"} disabled className="bg-muted/50" />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="pl-10 pr-10"
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              {newPassword.length > 0 && (
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
                      <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${newPassword === confirmPassword ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
                        {newPassword === confirmPassword ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </div>
                      <span className={`text-xs transition-colors ${newPassword === confirmPassword ? "text-success" : "text-muted-foreground"}`}>Passwords match</span>
                    </div>
                  )}
                </div>
              )}

              <Button onClick={handleChangePassword} disabled={changingPw || !currentPassword || !newPassword} variant="outline" className="w-full sm:w-auto">
                <Shield className="w-4 h-4 mr-2" />
                {changingPw ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
