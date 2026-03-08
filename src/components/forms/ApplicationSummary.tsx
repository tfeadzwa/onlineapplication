import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Send,
  User,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  CreditCard,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Edit,
  School,
  ShieldCheck,
} from "lucide-react";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  onGoToStep?: (step: number) => void;
}

const SectionCard = ({
  icon: Icon,
  title,
  stepIndex,
  onEdit,
  filled,
  children,
  highlight,
}: {
  icon: any;
  title: string;
  stepIndex: number;
  onEdit?: (step: number) => void;
  filled: boolean;
  children: React.ReactNode;
  highlight?: boolean;
}) => (
  <Card className={`group transition-all duration-200 hover:shadow-md ${highlight ? "border-primary/30 bg-primary/[0.02]" : ""}`}>
    <CardContent className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${filled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm">{title}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {filled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] text-primary font-medium">Complete</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Incomplete</span>
                </>
              )}
            </div>
          </div>
        </div>
        {onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
            onClick={() => onEdit(stepIndex)}
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </Button>
        )}
      </div>
      <Separator />
      {children}
    </CardContent>
  </Card>
);

const Field = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

const SubjectRow = ({ name, grade, year, board }: { name: string; grade: string; year?: string; board?: string }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 text-sm border border-border/50">
    <span className="font-medium text-foreground">{name || "—"}</span>
    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="font-semibold">{grade}</Badge>
      {year && <span className="text-xs text-muted-foreground">{year}</span>}
      {board && <span className="text-xs text-muted-foreground">{board}</span>}
    </div>
  </div>
);

const ApplicationSummary = ({ data, onNext, onBack, isFirst, isLast, onGoToStep }: Props) => {
  const si = data["student-info"] || {};
  const cd = data["contact"] || {};
  const me = data["mature-entry"] || {};
  const pc = data["programme"] || {};
  const ol = data["o-level"] || {};
  const al = data["a-level"] || {};
  const ps = data["post-school"] || {};
  const eh = data["employment"] || {};
  const py = data["payment"] || {};

  const hasData = (obj: Record<string, any>) => Object.values(obj).some((v) => v && (typeof v === "string" ? v.trim() : true));
  const fullName = [si.firstName, si.hasMiddleName ? si.middleName : "", si.lastName].filter(Boolean).join(" ");

  const sections = [
    { filled: hasData(si) },
    { filled: hasData(cd) },
    { filled: me.isMatureEntry },
    { filled: hasData(pc) },
    { filled: !!ol.subjects?.length },
    { filled: !!al.subjects?.length },
    { filled: !!ps.qualifications?.length },
    { filled: !!eh.jobs?.length },
    { filled: hasData(py) },
  ];
  const completedCount = sections.filter((s) => s.filled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Application Summary</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Review all your information before submitting. Hover over any section to edit.
          </p>
        </div>

        {/* Completion overview */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/15">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{completedCount} of {sections.length} sections completed</p>
            <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / sections.length) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-lg font-heading font-bold text-primary">
            {Math.round((completedCount / sections.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Student Information */}
        <SectionCard icon={User} title="Student Information" stepIndex={0} onEdit={onGoToStep} filled={hasData(si)}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Full Name" value={fullName} />
            <Field label="Date of Birth" value={si.dateOfBirth} />
            <Field label="Gender" value={si.gender ? si.gender.charAt(0).toUpperCase() + si.gender.slice(1) : undefined} />
            <Field label="Country" value={si.country ? si.country.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : undefined} />
            <Field label="National ID" value={si.nationalId} />
            <Field label="Marital Status" value={si.maritalStatus ? si.maritalStatus.charAt(0).toUpperCase() + si.maritalStatus.slice(1) : undefined} />
          </div>
        </SectionCard>

        {/* Contact Details */}
        <SectionCard icon={Phone} title="Contact Details" stepIndex={1} onEdit={onGoToStep} filled={hasData(cd)}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Phone" value={cd.phone} />
            <Field label="Alt Phone" value={cd.altPhone} />
            <Field label="Email" value={cd.email} />
            <Field label="Address" value={cd.address} />
            <Field label="City" value={cd.city} />
            <Field label="Province" value={cd.province} />
          </div>
          {cd.nextOfKinName && (
            <>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Next of Kin</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Name" value={cd.nextOfKinName} />
                <Field label="Phone" value={cd.nextOfKinPhone} />
                <Field label="Relationship" value={cd.nextOfKinRelation} />
              </div>
            </>
          )}
        </SectionCard>

        {/* Mature Entry */}
        {me.isMatureEntry && (
          <SectionCard icon={School} title="Mature Entry" stepIndex={2} onEdit={onGoToStep} filled={me.isMatureEntry}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Years of Experience" value={me.yearsOfExperience} />
              <Field label="Current Occupation" value={me.currentOccupation} />
              <Field label="Employer" value={me.employer} />
            </div>
            <Field label="Motivation" value={me.motivationStatement} />
          </SectionCard>
        )}

        {/* Programme Choice */}
        <SectionCard icon={BookOpen} title="Programme Choice" stepIndex={3} onEdit={onGoToStep} filled={hasData(pc)}>
          <Field label="Intake Year" value={pc.intakeYear} />
          <div className="space-y-2 pt-1">
            {[1, 2, 3].map((n) => {
              const fac = pc[`faculty${n}`];
              const prog = pc[`programme${n}`];
              if (!fac && !prog) return null;
              return (
                <div key={n} className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/50 border border-border/50">
                  <Badge className="mt-0.5 shrink-0 bg-primary/10 text-primary border-0 font-semibold">Choice {n}</Badge>
                  <div>
                    <p className="text-sm font-medium text-foreground">{prog || "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{fac || "—"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* O-Level */}
        <SectionCard icon={GraduationCap} title="O-Level Results" stepIndex={4} onEdit={onGoToStep} filled={!!ol.subjects?.length}>
          {ol.subjects?.length > 0 ? (
            <div className="space-y-2">
              {ol.subjects.map((s: any, i: number) => (
                <SubjectRow key={i} name={s.name} grade={s.grade} year={s.year} board={s.board} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No subjects entered</p>
          )}
          <Field label="Certificate" value={ol.certificateFile} />
        </SectionCard>

        {/* A-Level */}
        <SectionCard icon={Award} title="A-Level Results" stepIndex={5} onEdit={onGoToStep} filled={!!al.subjects?.length}>
          {al.subjects?.length > 0 ? (
            <div className="space-y-2">
              {al.subjects.map((s: any, i: number) => (
                <SubjectRow key={i} name={s.name} grade={s.grade} year={s.year} board={s.board} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No subjects entered</p>
          )}
          <Field label="Certificate" value={al.certificateFile} />
        </SectionCard>

        {/* Post-School */}
        <SectionCard icon={GraduationCap} title="Post-School Qualifications" stepIndex={6} onEdit={onGoToStep} filled={!!ps.qualifications?.length}>
          {ps.qualifications?.length > 0 ? (
            <div className="space-y-2">
              {ps.qualifications.map((q: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-muted/50 border border-border/50 text-sm space-y-1">
                  <p className="font-medium text-foreground">{q.qualification || "—"} — {q.fieldOfStudy || "—"}</p>
                  <p className="text-xs text-muted-foreground">{q.institution} • {q.yearCompleted}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No qualifications entered</p>
          )}
        </SectionCard>

        {/* Employment */}
        <SectionCard icon={Briefcase} title="Employment History" stepIndex={7} onEdit={onGoToStep} filled={!!eh.jobs?.length}>
          {eh.jobs?.length > 0 ? (
            <div className="space-y-2">
              {eh.jobs.map((j: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-muted/50 border border-border/50 text-sm space-y-1">
                  <p className="font-medium text-foreground">{j.position || "—"} at {j.employer || "—"}</p>
                  <p className="text-xs text-muted-foreground">{j.startDate || "?"} – {j.endDate || "Present"}</p>
                  {j.duties && <p className="text-xs text-muted-foreground">{j.duties}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No employment history entered</p>
          )}
        </SectionCard>

        {/* Payment */}
        <SectionCard icon={CreditCard} title="Payment" stepIndex={8} onEdit={onGoToStep} filled={hasData(py)} highlight>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Method" value={py.paymentMethod ? py.paymentMethod.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : undefined} />
            <Field label="Reference" value={py.referenceNumber} />
            <Field label="Account Name" value={py.accountName} />
            <Field label="Payment Date" value={py.paymentDate} />
          </div>
        </SectionCard>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Previous
        </Button>
        <Button size="lg" onClick={() => onNext({})} className="gap-2 px-8 shadow-lg shadow-primary/20">
          <Send className="w-4 h-4" /> Submit Application
        </Button>
      </div>
    </div>
  );
};

export default ApplicationSummary;
