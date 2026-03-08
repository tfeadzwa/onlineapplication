import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap, Plus, LogOut, FileText, Clock, CheckCircle, XCircle, Eye,
  Trash2, Edit, RotateCcw, TrendingUp, Send, Layers, CalendarDays, ArrowRight,
  Sparkles, MoreHorizontal, UserCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const statusConfig = {
  draft: { label: "Draft", icon: FileText, className: "bg-muted text-muted-foreground border-border" },
  submitted: { label: "Submitted", icon: Send, className: "bg-accent/15 text-accent-foreground border-accent/30" },
  under_review: { label: "Under Review", icon: Eye, className: "bg-accent/20 text-accent-foreground border-accent/40" },
  accepted: { label: "Accepted", icon: CheckCircle, className: "bg-success/15 text-success border-success/30" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-destructive/15 text-destructive border-destructive/30" },
};

const Dashboard = () => {
  const { user, applications, createApplication, logout, deleteApplication, cancelApplication, reopenApplication, createTestAcceptedApplication } = useAuth();
  const navigate = useNavigate();

  const handleNewApplication = () => {
    const app = createApplication();
    navigate(`/apply/${app.id}`);
  };

  const handleTestAccepted = () => {
    const app = createTestAcceptedApplication();
    toast.success("Test accepted application created!");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteApplication(id);
    toast.success("Application draft deleted.");
  };

  const handleCancel = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    cancelApplication(id);
    toast.info("Application withdrawn and moved back to draft.");
  };

  const handleReopen = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    reopenApplication(id);
    toast.info("Application reopened as draft for editing.");
  };

  const drafts = applications.filter((a) => a.status === "draft").length;
  const submitted = applications.filter((a) => a.status === "submitted" || a.status === "under_review").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;

  const stats = [
    { label: "Total", value: applications.length, icon: Layers, color: "text-primary" },
    { label: "Drafts", value: drafts, icon: FileText, color: "text-muted-foreground" },
    { label: "In Progress", value: submitted, icon: Clock, color: "text-accent-foreground" },
    { label: "Accepted", value: accepted, icon: CheckCircle, color: "text-success" },
  ];

  const firstName = user?.fullName?.split(" ")[0] || "Student";
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

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
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="text-muted-foreground hover:text-foreground">
              <UserCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 sm:px-6 py-8 max-w-5xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{greeting},</p>
              <h1 className="text-3xl font-heading font-bold tracking-tight">{firstName} 👋</h1>
              <p className="text-muted-foreground mt-1">Here's an overview of your applications.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleTestAccepted} className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Test Accepted
              </Button>
              <Button onClick={handleNewApplication} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 animate-fade-in">
          {stats.map((stat) => (
            <Card key={stat.label} className="overflow-hidden group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-2xl font-heading font-bold">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Action - if no applications */}
        {applications.length === 0 ? (
          <Card className="animate-fade-in border-dashed border-2 hover:border-primary/40 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-scale-in">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Start your journey</h3>
              <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                Apply for admission to Great Zimbabwe University. The process takes about 15 minutes to complete.
              </p>
              <Button onClick={handleNewApplication} size="lg" className="px-8 shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading font-semibold text-lg">Your Applications</h2>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">{applications.length} total</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => {
                const config = statusConfig[app.status];
                const StatusIcon = config.icon;
                const isDraft = app.status === "draft";
                const isSubmitted = app.status === "submitted";
                const isAccepted = app.status === "accepted";
                const progress = Math.round((app.currentStep / 10) * 100);

                return (
                  <Card
                    key={app.id}
                    className={`animate-fade-in group relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                      isAccepted ? "border-success/30 bg-gradient-to-br from-card to-success/5" : "hover:border-primary/30"
                    }`}
                    onClick={() => isAccepted ? navigate(`/accepted/${app.id}`) : navigate(`/apply/${app.id}`)}
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 w-full ${
                      isAccepted ? "bg-success" : isSubmitted ? "bg-accent" : isDraft ? "bg-primary/40" : "bg-muted"
                    }`} />

                    <CardContent className="p-5 pt-4">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isAccepted ? "bg-success/15 text-success" : "bg-primary/10 text-primary group-hover:bg-primary/20"
                        }`}>
                          {isAccepted ? <CheckCircle className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                        </div>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {isDraft && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/apply/${app.id}`)}>
                                  <Edit className="w-4 h-4 mr-2" /> Continue Editing
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                      <Trash2 className="w-4 h-4 mr-2" /> Delete Draft
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
                                      <AlertDialogDescription>This will permanently delete this application draft.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Keep</AlertDialogCancel>
                                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={(e) => handleDelete(e, app.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          {isSubmitted && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <Edit className="w-4 h-4 mr-2" /> Withdraw & Edit
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Edit Submitted Application?</AlertDialogTitle>
                                      <AlertDialogDescription>This will withdraw your submission and move it back to draft.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Keep Submitted</AlertDialogCancel>
                                      <AlertDialogAction onClick={(e) => { handleReopen(e, app.id); navigate(`/apply/${app.id}`); }}>Withdraw & Edit</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                      <XCircle className="w-4 h-4 mr-2" /> Cancel Application
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Application?</AlertDialogTitle>
                                      <AlertDialogDescription>This will withdraw your submitted application and move it back to draft.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Keep</AlertDialogCancel>
                                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={(e) => handleCancel(e, app.id)}>Cancel Application</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>

                      {/* App ID & Status */}
                      <p className="font-heading font-bold text-base mb-1 tracking-tight">
                        #{app.id.slice(0, 8).toUpperCase()}
                      </p>
                      <Badge variant="outline" className={`text-[10px] px-2.5 py-0.5 h-5 mb-3 ${config.className}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {format(new Date(app.createdAt), "dd MMM yyyy")}
                        </span>
                        {app.currentStep > 0 && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Step {app.currentStep}/10
                          </span>
                        )}
                      </div>

                      {/* Progress or CTA */}
                      {isDraft && app.currentStep > 0 ? (
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1.5">
                            <span className="text-muted-foreground font-medium">Progress</span>
                            <span className="font-semibold text-primary">{progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      ) : isAccepted ? (
                        <Button variant="outline" size="sm" className="w-full border-success/30 text-success hover:bg-success/10 hover:text-success font-semibold text-xs">
                          View Offer <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      ) : isDraft ? (
                        <Button variant="outline" size="sm" className="w-full text-xs text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                          Continue Application <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Clock className="w-3 h-3 animate-pulse" />
                          <span>Awaiting review</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
