import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import FormWrapper from "./FormWrapper";

interface Qualification {
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  yearCompleted: string;
  certificateFile: string;
}

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const PostSchoolForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [qualifications, setQualifications] = useState<Qualification[]>(
    data.qualifications || [{ institution: "", qualification: "", fieldOfStudy: "", yearCompleted: "", certificateFile: "" }]
  );

  const add = () => setQualifications([...qualifications, { institution: "", qualification: "", fieldOfStudy: "", yearCompleted: "", certificateFile: "" }]);
  const remove = (i: number) => setQualifications(qualifications.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof Qualification, value: string) => {
    const updated = [...qualifications];
    updated[i] = { ...updated[i], [key]: value };
    setQualifications(updated);
  };

  return (
    <FormWrapper
      title="Post-School Qualifications"
      description="List any qualifications obtained after secondary school (diplomas, certificates, degrees)."
      onSubmit={(e) => { e.preventDefault(); onNext({ qualifications }); }}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-4">
        {qualifications.map((q, i) => (
          <div key={i} className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Qualification {i + 1}</span>
              {qualifications.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Institution</Label>
                <Input value={q.institution} onChange={(e) => update(i, "institution", e.target.value)} placeholder="e.g. Harare Polytechnic" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Qualification</Label>
                <Input value={q.qualification} onChange={(e) => update(i, "qualification", e.target.value)} placeholder="e.g. National Diploma" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Field of Study</Label>
                <Input value={q.fieldOfStudy} onChange={(e) => update(i, "fieldOfStudy", e.target.value)} placeholder="e.g. Information Technology" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Year Completed</Label>
                <Input value={q.yearCompleted} onChange={(e) => update(i, "yearCompleted", e.target.value)} placeholder="e.g. 2023" />
              </div>
            </div>
            <label className="flex items-center gap-3 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{q.certificateFile || "Upload certificate"}</span>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && update(i, "certificateFile", e.target.files[0].name)} />
            </label>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={add} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Qualification
        </Button>
      </div>
    </FormWrapper>
  );
};

export default PostSchoolForm;
