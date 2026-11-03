import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, LogOut, Search, Inbox, Send, Eye, CheckCircle, XCircle, Paperclip, ChevronRight, Loader2 } from "lucide-react";
import { applicantName, collectDocuments } from "@/lib/admin";

const STATUS: Record<string, { label: string; cls: string }> = {
  submitted: { label: "Submitted", cls: "bg-accent/15 text-accent-foreground border-accent/30" },
  under_review: { label: "Under Review", cls: "bg-primary/10 text-primary border-primary/30" },
  accepted: { label: "Accepted", cls: "bg-success/15 text-success border-success/30" },
  rejected: { label: "Rejected", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground border-border" },
};

const FILTERS = ["all", "submitted", "under_review", "accepted", "rejected", "draft"] as const;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("submitted");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data: apps } = await supabase.from("applications").select("*").order("updated_at", { ascending: false });
      const ids = [...new Set((apps || []).map((a) => a.user_id))];
      const { data: profs } = ids.length ? await supabase.from("profiles").select("*").in("id", ids) : { data: [] };
      setProfiles(Object.fromEntries((profs || []).map((p) => [p.id, p])));
      setRows(apps || []);
      setLoading(false);
    })();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    rows.forEach((r) => (c[r.status] = (c[r.status] || 0) + 1));
    return c;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (!q) return true;
    const p = profiles[r.user_id];
    const hay = `${applicantName(p, r.data)} ${p?.email} ${p?.national_id} ${r.id}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const stats = [
    { key: "submitted", label: "Awaiting Review", icon: Send },
    { key: "under_review", label: "Under Review", icon: Eye },
    { key: "accepted", label: "Accepted", icon: CheckCircle },
    { key: "rejected", label: "Rejected", icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <p className="font-heading font-bold leading-tight">GZU Admissions</p>
              <p className="text-xs text-primary-foreground/70">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={async () => { await logout(); navigate("/admin/login"); }}>
            <LogOut className="w-4 h-4 mr-1.5" />Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">Review applicants, inspect documents and issue offers.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <button key={s.key} onClick={() => setFilter(s.key as any)} className={`text-left rounded-2xl border bg-card p-5 transition-all hover:shadow-md ${filter === s.key ? "ring-2 ring-primary" : ""}`}>
              <s.icon className="w-5 h-5 text-primary mb-3" />
              <p className="font-heading text-3xl font-bold">{counts[s.key] || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {f === "all" ? "All" : STATUS[f].label} <span className="opacity-70">({counts[f] || 0})</span>
                </button>
              ))}
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, ID..." className="pl-9 rounded-full" />
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
          ) : visible.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Inbox className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No applications here</p>
            </div>
          ) : (
            <ul className="divide-y">
              {visible.map((r) => {
                const p = profiles[r.user_id];
                const name = applicantName(p, r.data);
                const first = r.offered_programme || r.data?.programme?.programme1;
                const docs = collectDocuments(r.data).length;
                const st = STATUS[r.status] || STATUS.draft;
                return (
                  <li key={r.id}>
                    <button onClick={() => navigate(`/admin/applications/${r.id}`)} className="w-full text-left px-4 sm:px-6 py-4 flex items-center gap-4 hover:bg-muted/40 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-heading font-bold flex items-center justify-center shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p?.email} {p?.national_id && `· ${p.national_id}`}</p>
                        {typeof first === "string" && first && <p className="text-xs text-muted-foreground truncate mt-0.5">{first}</p>}
                      </div>
                      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground"><Paperclip className="w-3.5 h-3.5" />{docs}</div>
                      <div className="hidden sm:block text-xs text-muted-foreground w-24 text-right">{format(new Date(r.updated_at), "dd MMM yyyy")}</div>
                      <Badge variant="outline" className={`${st.cls} shrink-0`}>{st.label}</Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
