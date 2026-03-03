import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  onGoToStep?: (step: number) => void;
}

const SectionHeader = ({
  icon: Icon,
  title,
  stepIndex,
  onEdit,
  filled,
}: {
  icon: any;
  title: string;
  stepIndex: number;
  onEdit?: (step: number) => void;
  filled: boolean;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${filled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-heading font-semibold text-sm">{title}</h3>
      {filled ? (
        <CheckCircle2 className="w-4 h-4 text-primary" />
      ) : (
        <AlertCircle className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
    {onEdit && (
      <Button type="button" variant="ghost" size="sm" className="text-xs gap-1" onClick={() => onEdit(stepIndex)}>
        <Edit className="w-3 h-3" /> Edit
      </Button>
    )}
  </div>
);

const Field = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
};

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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold">Application Summary</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Review all your information before submitting. Click "Edit" on any section to make changes.
        </p>
      </div>

      <div className="space-y-4">
        {/* Student Information */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <SectionHeader icon={User} title="Student Information" stepIndex={0} onEdit={onGoToStep} filled={hasData(si)} />
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Full Name" value={fullName} />
              <Field label="Date of Birth" value={si.dateOfBirth} />
              <Field label="Gender" value={si.gender ? si.gender.charAt(0).toUpperCase() + si.gender.slice(1) : undefined} />
              <Field label="Country" value={si.country ? si.country.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : undefined} />
              <Field label="National ID" value={si.nationalId} />
              <Field label="Marital Status" value={si.maritalStatus ? si.maritalStatus.charAt(0).toUpperCase() + si.maritalStatus.slice(1) : undefined} />
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <SectionHeader icon={Phone} title="Contact Details" stepIndex={1} onEdit={onGoToStep} filled={hasData(cd)} />
            <Separator />
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
                <p className="text-xs font-heading font-semibold text-muted-foreground pt-2">Next of Kin</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Field label="Name" value={cd.nextOfKinName} />
                  <Field label="Phone" value={cd.nextOfKinPhone} />
                  <Field label="Relationship" value={cd.nextOfKinRelation} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Mature Entry */}
        {me.isMatureEntry && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <SectionHeader icon={ClipboardList} title="Mature Entry" stepIndex={2} onEdit={onGoToStep} filled={me.isMatureEntry} />
              <Separator />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Years of Experience" value={me.yearsOfExperience} />
                <Field label="Current Occupation" value={me.currentOccupation} />
                <Field label="Employer" value={me.employer} />
              </div>
              <Field label="Motivation" value={me.motivationStatement} />
            </CardContent>
          </Card>
        )}

        {/* Programme Choice */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <SectionHeader icon={BookOpen} title="Programme Choice" stepIndex={3} onEdit={onGoToStep} filled={hasData(pc)} />
            <Separator />
            <Field label="Intake Year" value={pc.intakeYear} />
            <div className="space-y-3 pt-1">
              {[1, 2, 3].map((n) => {
                const fac = pc[`faculty${n}`];
                const prog = pc[`programme${n}`];
                if (!fac && !prog) return null;
                return (
                  <div key={n} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge variant="secondary" className="mt-0.5 shrink-0">Choice {n}</Badge>
                    <div>
                      <p className="text-sm font-medium">{prog || "—"}</p>
                      <p className="text-xs text-muted-foreground">{fac || "—"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* O-Level */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <SectionHeader icon={GraduationCap} title="O-Level Results" stepIndex={4} onEdit={onGoToStep} filled={!!ol.subjects?.length} />
            <Separator />
            {ol.subjects?.length > 0 ? (
              <div className="space-y-2">
                {ol.subjects.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                    <span className="font-medium">{s.name || "—"}</span>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs">
                      <span>Grade: <span className="font-semibold text-foreground">{s.grade}</span></span>
                      <span>{s.year}</span>
                      <span>{s.board}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No subjects entered</p>
            )}
            <Field label="Certificate" value={ol.certificateFile} />
          </CardContent>
        </Card>

        {/* A-Level */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <SectionHeader icon={Award} title="A-Level Results" stepIndex={5} onEdit={onGoToStep} filled={!!al.subjects?.length} />
            <Separator />
            {al.subjects?.length > 0 ? (
              <div className="space-y-2">
                {al.subjects.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                    <span className="font-medium">{s.name || "—"}</span>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs">
                      <span>Grade: <span className="font-semibold text-foreground">{s.grade}</span></span>
                      <span>{s.year}</span>
                      <span>{s.board}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No subjects entered</p>
            )}
            <Field label="Certificate" value={al.certificateFile} />
          </CardContent>
        </Card>

        {/* Post-School */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <SectionHeader icon={GraduationCap} title="Post-School Qualifications" stepIndex={6} onEdit={onGoToStep} filled={!!ps.qualifications?.length} />
            <Separator />
            {ps.qualifications?.length > 0 ? (
              <div className="space-y-2">
                {ps.qualifications.map((q: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                    <p className="font-medium">{q.qualification || "—"} — {q.fieldOfStudy || "—"}</p>
                    <p className="text-xs text-muted-foreground">{q.institution} • {q.yearCompleted}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No qualifications entered</p>
            )}
          </CardContent>
        </Card>

        {/* Employment */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <SectionHeader icon={Briefcase} title="Employment History" stepIndex={7} onEdit={onGoToStep} filled={!!eh.jobs?.length} />
            <Separator />
            {eh.jobs?.length > 0 ? (
              <div className="space-y-2">
                {eh.jobs.map((j: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                    <p className="font-medium">{j.position || "—"} at {j.employer || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {j.startDate || "?"} – {j.endDate || "Present"}
                    </p>
                    {j.duties && <p className="text-xs text-muted-foreground">{j.duties}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No employment history entered</p>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="border-primary/20">
          <CardContent className="p-5 space-y-4">
            <SectionHeader icon={CreditCard} title="Payment" stepIndex={8} onEdit={onGoToStep} filled={hasData(py)} />
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Method" value={py.paymentMethod ? py.paymentMethod.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : undefined} />
              <Field label="Reference" value={py.referenceNumber} />
              <Field label="Account Name" value={py.accountName} />
              <Field label="Payment Date" value={py.paymentDate} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button size="lg" onClick={() => onNext({})}>
          <Send className="w-4 h-4 mr-2" /> Submit Application
        </Button>
      </div>
    </div>
  );
};

export default ApplicationSummary;
