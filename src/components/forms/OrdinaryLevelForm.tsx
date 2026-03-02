import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";
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

const OrdinaryLevelForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [subjects, setSubjects] = useState<Subject[]>(
    data.subjects || [{ name: "", grade: "", year: "", board: "ZIMSEC" }]
  );
  const [certificateFile, setCertificateFile] = useState<string>(data.certificateFile || "");

  const addSubject = () => setSubjects([...subjects, { name: "", grade: "", year: "", board: "ZIMSEC" }]);
  const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const updateSubject = (i: number, key: keyof Subject, value: string) => {
    const updated = [...subjects];
    updated[i] = { ...updated[i], [key]: value };
    setSubjects(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCertificateFile(file.name);
  };

  return (
    <FormWrapper
      title="Ordinary Level Results"
      description="Enter your O-Level subjects and grades, and upload your certificate."
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
                <Input value={s.name} onChange={(e) => updateSubject(i, "name", e.target.value)} placeholder="e.g. Mathematics" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Grade</Label>
                <Input value={s.grade} onChange={(e) => updateSubject(i, "grade", e.target.value)} placeholder="e.g. A" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Year</Label>
                <Input value={s.year} onChange={(e) => updateSubject(i, "year", e.target.value)} placeholder="e.g. 2020" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Board</Label>
                <Input value={s.board} onChange={(e) => updateSubject(i, "board", e.target.value)} placeholder="ZIMSEC" />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addSubject} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Subject
        </Button>
      </div>

      <div className="pt-4 border-t mt-4">
        <Label className="font-medium">Upload O-Level Certificate</Label>
        <p className="text-sm text-muted-foreground mb-3">Upload a scanned copy of your O-Level certificate (PDF, JPG, PNG)</p>
        <label className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{certificateFile || "Click to upload file"}</span>
          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
        </label>
      </div>
    </FormWrapper>
  );
};

export default OrdinaryLevelForm;
