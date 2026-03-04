import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";
import SearchableSelect from "@/components/ui/searchable-select";
import { A_LEVEL_SUBJECTS, GRADES, EXAM_BOARDS } from "@/lib/form-options";
import FormWrapper from "./FormWrapper";

interface Subject {
  name: string;
  grade: string;
  year: string;
  board: string;
}

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const AdvancedLevelForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [subjects, setSubjects] = useState<Subject[]>(
    data.subjects || [{ name: "", grade: "", year: "", board: "zimsec" }]
  );
  const [certificateFile, setCertificateFile] = useState<string>(data.certificateFile || "");

  const addSubject = () => setSubjects([...subjects, { name: "", grade: "", year: "", board: "zimsec" }]);
  const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const updateSubject = (i: number, key: keyof Subject, value: string) => {
    const updated = [...subjects];
    updated[i] = { ...updated[i], [key]: value };
    setSubjects(updated);
  };

  return (
    <FormWrapper
      title="Advanced Level Results"
      description="Enter your A-Level subjects and grades."
      onSubmit={(e) => { e.preventDefault(); onNext({ subjects, certificateFile }); }}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-3">
        {subjects.map((s, i) => (
          <div key={i} className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Subject {i + 1}</span>
              {subjects.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSubject(i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <Label className="text-xs">Subject</Label>
                <SearchableSelect options={A_LEVEL_SUBJECTS} value={s.name} onValueChange={(v) => updateSubject(i, "name", v)} placeholder="Select subject" searchPlaceholder="Search subject..." allowCustom />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Grade</Label>
                <SearchableSelect options={GRADES} value={s.grade} onValueChange={(v) => updateSubject(i, "grade", v)} placeholder="Grade" searchPlaceholder="Search..." />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Year</Label>
                <Input value={s.year} onChange={(e) => updateSubject(i, "year", e.target.value)} placeholder="e.g. 2022" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Board</Label>
                <SearchableSelect options={EXAM_BOARDS} value={s.board} onValueChange={(v) => updateSubject(i, "board", v)} placeholder="Board" searchPlaceholder="Search..." />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addSubject} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Subject
        </Button>
      </div>

      <div className="pt-4 border-t mt-4">
        <Label className="font-medium">Upload A-Level Certificate</Label>
        <p className="text-sm text-muted-foreground mb-3">Upload a scanned copy (PDF, JPG, PNG)</p>
        <label className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{certificateFile || "Click to upload file"}</span>
          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && setCertificateFile(e.target.files[0].name)} />
        </label>
      </div>
    </FormWrapper>
  );
};

export default AdvancedLevelForm;
