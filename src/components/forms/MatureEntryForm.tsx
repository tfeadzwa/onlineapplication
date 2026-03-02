import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import FormWrapper from "./FormWrapper";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const MatureEntryForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [form, setForm] = useState({
    isMatureEntry: data.isMatureEntry || false,
    yearsOfExperience: data.yearsOfExperience || "",
    currentOccupation: data.currentOccupation || "",
    employer: data.employer || "",
    motivationStatement: data.motivationStatement || "",
    relevantTraining: data.relevantTraining || "",
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <FormWrapper
      title="Mature Entry"
      description="If you are 25 years or older and applying through mature entry, provide the required details."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
        <Switch checked={form.isMatureEntry} onCheckedChange={(v) => update("isMatureEntry", v)} />
        <div>
          <Label className="font-medium">I am applying as a mature entry candidate</Label>
          <p className="text-sm text-muted-foreground">For applicants aged 25 and above without standard entry qualifications</p>
        </div>
      </div>

      {form.isMatureEntry && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="space-y-2">
            <Label>Years of Work Experience *</Label>
            <Input type="number" value={form.yearsOfExperience} onChange={(e) => update("yearsOfExperience", e.target.value)} required min={0} />
          </div>
          <div className="space-y-2">
            <Label>Current Occupation *</Label>
            <Input value={form.currentOccupation} onChange={(e) => update("currentOccupation", e.target.value)} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Current Employer</Label>
            <Input value={form.employer} onChange={(e) => update("employer", e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Relevant Training / Certifications</Label>
            <Textarea value={form.relevantTraining} onChange={(e) => update("relevantTraining", e.target.value)} rows={2} placeholder="List any relevant training or certifications" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Motivation Statement *</Label>
            <Textarea value={form.motivationStatement} onChange={(e) => update("motivationStatement", e.target.value)} required rows={4} placeholder="Explain why you are pursuing further education and how your experience prepares you..." />
          </div>
        </div>
      )}
    </FormWrapper>
  );
};

export default MatureEntryForm;
