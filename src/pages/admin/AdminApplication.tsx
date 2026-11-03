import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/ui/searchable-select";
import { FACULTIES, PROGRAMMES } from "@/lib/form-options";
import DocumentViewer, { DocItem } from "@/components/admin/DocumentViewer";
import { SECTIONS, collectDocuments, humanize, applicantName } from "@/lib/admin";
import { toast } from "sonner";
import { ArrowLeft, FileText, FileImage, Eye, CheckCircle, XCircle, Loader2, Mail, User, Phone, IdCard, Globe, ChevronDown } from "lucide-react";

const STATUS_LABEL: Record<string, string> = { draft: "Draft", submitted: "Submitted", under_review: "Under Review", accepted: "Accepted", rejected: "Rejected" };

const isEmpty = (v: any) => v === "" || v == null || (Array.isArray(v) && v.length === 0);

const Value = ({ v }: { v: any }) => {
  if (typeof v === "boolean") return <span>{v ? "Yes" : "No"}</span>;
  if (Array.isArray(v)) {
    return (
      <div className="space-y-2 w-full">
        {v.map((item, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3">
            {typeof item === "object" ? <Fields obj={item} /> : String(item)}
          </div>
        ))}
      </div>
    );
  }
  if (typeof v === "object") return <Fields obj={v} />;
  return <span className="break-words">{String(v)}</span>;
};

const Fields = ({ obj }: { obj: Record<string, any> }) => {
  const entries = Object.entries(obj).filter(([k, v]) => !k.endsWith("Path") && !isEmpty(v));
  if (!entries.length) return <p className="text-sm text-muted-foreground italic">Not provided</p>;
  return (
    <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 w-full">
      {entries.map(([k, v]) => (
        <div key={k} className={Array.isArray(v) || typeof v === "object" ? "sm:col-span-2" : ""}>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{humanize(k)}</dt>
          <dd className="text-sm mt-0.5"><Value v={v} /></dd>
        </div>
      ))}
    </dl>
  );
};

const AdminApplication = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<DocItem | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({ "student-info": true, programme: true });
  const [faculty, setFaculty] = useState("");
  const [programme, setProgramme] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("applications").select("*").eq("id", id!).maybeSingle();
      if (data) {
        setApp(data);
        const pc = (data.data as any)?.programme || {};
        setFaculty(data.offered_faculty || pc.faculty1 || "");
        setProgramme(data.offered_programme || pc.programme1 || "");
        setNotes(data.admin_notes || "");
        const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user_id).maybeSingle();
        setProfile(p);
      }
      setLoading(false);
    })();
  }, [id]);

  const decide = async (status: "accepted" | "rejected" | "under_review") => {
    if (status === "accepted" && !programme) { toast.error("Choose the programme to offer."); return; }
    setSaving(true);
    const patch: any = { status, admin_notes: notes || null, reviewed_by: user?.id, reviewed_at: new Date().toISOString() };
    if (status === "accepted") { patch.offered_programme = programme; patch.offered_faculty = faculty || null; }
    const { data, error } = await supabase.from("applications").update(patch).eq("id", id!).select().single();
    setSaving(false);
    if (error) { toast.error("Could not save the decision."); return; }
    setApp(data);
    toast.success(status === "accepted" ? "Offer issued" : status === "rejected" ? "Application rejected" : "Marked as under review");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!app) return <div className="min-h-screen flex flex-col items-center justify-center gap-3"><p>Application not found.</p><Button onClick={() => navigate("/admin")}>Back</Button></div>;

  const data = app.data || {};
  const docs = collectDocuments(data);
  const name = applicantName(profile, data);
  const pc = data.programme || {};
  const choices = [1, 2, 3].map((n) => ({ n, f: pc[`faculty${n}`], p: pc[`programme${n}`] })).filter((c) => c.p);
  const programmeOptions = (faculty && (PROGRAMMES as any)[faculty]) || Object.values(PROGRAMMES as any).flat();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <button onClick={() => navigate("/admin")} className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />All applications
          </button>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/15 font-heading text-2xl font-bold flex items-center justify-center">{name.charAt(0).toUpperCase()}</div>
              <div>
                <h1 className="font-heading text-2xl font-bold">{name}</h1>
                <p className="text-sm text-primary-foreground/75">Ref {app.id.slice(0, 8).toUpperCase()} · updated {format(new Date(app.updated_at), "dd MMM yyyy, HH:mm")}</p>
              </div>
            </div>
            <Badge className="bg-accent text-accent-foreground hover:bg-accent self-start sm:self-auto">{STATUS_LABEL[app.status]}</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="space-y-4 min-w-0">
          {SECTIONS.map((s) => {
            const sec = data[s.key];
            const filled = sec && Object.values(sec).some((v) => !isEmpty(v));
            return (
              <div key={s.key} className="rounded-2xl border bg-card overflow-hidden">
                <button onClick={() => setOpen((o) => ({ ...o, [s.key]: !o[s.key] }))} className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${filled ? "bg-success" : "bg-muted-foreground/30"}`} />
                    <span className="font-heading font-semibold">{s.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open[s.key] ? "rotate-180" : ""}`} />
                </button>
                {open[s.key] && <div className="px-5 pb-5 pt-1 border-t">{filled ? <Fields obj={sec} /> : <p className="text-sm text-muted-foreground italic pt-3">Not provided</p>}</div>}
              </div>
            );
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <h2 className="font-heading font-semibold">Applicant</h2>
            {[
              { icon: Mail, v: profile?.email },
              { icon: IdCard, v: profile?.national_id },
              { icon: Globe, v: profile?.country },
              { icon: Phone, v: profile?.phone },
              { icon: User, v: profile?.created_at && `Joined ${format(new Date(profile.created_at), "dd MMM yyyy")}` },
            ].filter((r) => r.v).map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm"><r.icon className="w-4 h-4 text-muted-foreground shrink-0" /><span className="truncate">{r.v}</span></div>
            ))}
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-heading font-semibold mb-3">Documents <span className="text-muted-foreground font-normal">({docs.length})</span></h2>
            {docs.length === 0 ? <p className="text-sm text-muted-foreground">No documents uploaded.</p> : (
              <ul className="space-y-2">
                {docs.map((d) => {
                  const img = /\.(png|jpe?g|gif|webp)$/i.test(d.name);
                  const Icon = img ? FileImage : FileText;
                  return (
                    <li key={d.path}>
                      <button onClick={() => setViewing(d)} className="w-full flex items-center gap-3 rounded-xl border p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.section}</p>
                        </div>
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <h2 className="font-heading font-semibold">Decision</h2>
            {choices.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Applicant's choices (click to use)</Label>
                {choices.map((c) => (
                  <button key={c.n} onClick={() => { setFaculty(c.f || ""); setProgramme(c.p); }} className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors ${programme === c.p ? "border-primary bg-primary/5" : "hover:bg-muted/40"}`}>
                    <span className="text-xs text-muted-foreground mr-1.5">#{c.n}</span>{c.p}
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Faculty</Label>
              <SearchableSelect options={FACULTIES as any} value={faculty} onValueChange={(v) => { setFaculty(v); setProgramme(""); }} placeholder="Select faculty" searchPlaceholder="Search..." allowCustom />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Programme to offer</Label>
              <SearchableSelect options={programmeOptions} value={programme} onValueChange={setProgramme} placeholder="Select programme" searchPlaceholder="Search..." allowCustom />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes to applicant (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="e.g. Conditional on submitting certified copies" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button disabled={saving} onClick={() => decide("accepted")} className="rounded-full bg-success hover:bg-success/90 text-success-foreground"><CheckCircle className="w-4 h-4 mr-1.5" />Accept</Button>
              <Button disabled={saving} onClick={() => decide("rejected")} variant="outline" className="rounded-full text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"><XCircle className="w-4 h-4 mr-1.5" />Reject</Button>
            </div>
            {app.status === "submitted" && (
              <Button disabled={saving} variant="ghost" size="sm" className="w-full" onClick={() => decide("under_review")}>Mark as under review</Button>
            )}
          </div>
        </aside>
      </main>

      <DocumentViewer doc={viewing} onClose={() => setViewing(null)} />
    </div>
  );
};

export default AdminApplication;
