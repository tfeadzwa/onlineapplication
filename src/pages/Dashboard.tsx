import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, LogOut, FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  draft: { label: "Draft", icon: FileText, className: "bg-muted text-muted-foreground" },
  submitted: { label: "Submitted", icon: Clock, className: "bg-accent/20 text-accent-foreground" },
  under_review: { label: "Under Review", icon: Eye, className: "bg-accent/30 text-accent-foreground" },
  accepted: { label: "Accepted", icon: CheckCircle, className: "bg-success/20 text-success" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-destructive/20 text-destructive" },
};

const Dashboard = () => {
  const { user, applications, createApplication, logout } = useAuth();
  const navigate = useNavigate();

  const handleNewApplication = () => {
    const app = createApplication();
    navigate(`/apply/${app.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold hidden sm:inline">Great Zimbabwe University</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">Hi, {user?.fullName?.split(" ")[0]}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 sm:px-6 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-heading font-bold">My Applications</h1>
            <p className="text-muted-foreground mt-1">Manage and track your admission applications</p>
          </div>
          <Button onClick={handleNewApplication} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        {applications.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Start your journey to Great Zimbabwe University by creating your first application.
              </p>
              <Button onClick={handleNewApplication}>
                <Plus className="w-4 h-4 mr-2" />
                Start Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const config = statusConfig[app.status];
              const StatusIcon = config.icon;
              return (
                <Card key={app.id} className="animate-fade-in hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/apply/${app.id}`)}>
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Application #{app.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          Created {format(new Date(app.createdAt), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={config.className}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
