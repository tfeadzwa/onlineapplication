import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect from "@/components/ui/searchable-select";
import { FACULTIES, PROGRAMMES } from "@/lib/form-options";
import FormWrapper from "./FormWrapper";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ProgrammeChoiceForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [form, setForm] = useState({
    faculty1: data.faculty1 || "",
    programme1: data.programme1 || "",
    faculty2: data.faculty2 || "",
    programme2: data.programme2 || "",
    faculty3: data.faculty3 || "",
    programme3: data.programme3 || "",
    intakeYear: data.intakeYear || new Date().getFullYear().toString(),
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const renderChoice = (num: number) => {
    const fKey = `faculty${num}` as keyof typeof form;
    const pKey = `programme${num}` as keyof typeof form;
    const required = num === 1;
    const programmeOptions = PROGRAMMES[form[fKey]] || [];
    return (
      <div key={num} className="p-4 rounded-lg border bg-card space-y-4">
        <h3 className="font-heading font-semibold text-sm">Choice {num} {required ? "*" : "(Optional)"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Faculty</Label>
            <SearchableSelect options={FACULTIES} value={form[fKey]} onValueChange={(v) => { update(fKey, v); update(pKey, ""); }} placeholder="Select faculty" searchPlaceholder="Search faculty..." />
          </div>
          <div className="space-y-2">
            <Label>Programme</Label>
            <SearchableSelect options={programmeOptions} value={form[pKey]} onValueChange={(v) => update(pKey, v)} placeholder="Select programme" searchPlaceholder="Search programme..." />
          </div>
        </div>
      </div>
    );
  };

  return (
    <FormWrapper
      title="Programme Choice"
      description="Select up to 3 programme choices in order of preference."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-2 max-w-xs">
        <Label>Intake Year *</Label>
        <Input value={form.intakeYear} onChange={(e) => update("intakeYear", e.target.value)} placeholder="e.g. 2026" required />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(renderChoice)}
      </div>
    </FormWrapper>
  );
};

export default ProgrammeChoiceForm;
