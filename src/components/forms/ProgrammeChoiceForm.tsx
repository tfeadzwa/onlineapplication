import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormWrapper from "./FormWrapper";

const faculties = [
  "Faculty of Arts and Humanities",
  "Faculty of Commerce",
  "Faculty of Education",
  "Faculty of Law",
  "Faculty of Natural Sciences",
  "Faculty of Social Sciences",
  "Faculty of Agriculture and Environmental Sciences",
];

const programmes: Record<string, string[]> = {
  "Faculty of Arts and Humanities": ["BA English", "BA History", "BA Linguistics", "BA Religious Studies"],
  "Faculty of Commerce": ["B.Com Accounting", "B.Com Marketing", "B.Com Finance", "B.Com Business Management"],
  "Faculty of Education": ["B.Ed Primary", "B.Ed Secondary", "B.Ed Early Childhood"],
  "Faculty of Law": ["LLB Honours"],
  "Faculty of Natural Sciences": ["BSc Mathematics", "BSc Computer Science", "BSc Biology", "BSc Chemistry", "BSc Physics"],
  "Faculty of Social Sciences": ["BSc Psychology", "BSc Sociology", "BSc Economics", "BSc Political Science"],
  "Faculty of Agriculture and Environmental Sciences": ["BSc Agriculture", "BSc Environmental Science", "BSc Geography"],
};

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
    return (
      <div key={num} className="p-4 rounded-lg border bg-card space-y-4">
        <h3 className="font-heading font-semibold text-sm">Choice {num} {required ? "*" : "(Optional)"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Faculty</Label>
            <Select value={form[fKey]} onValueChange={(v) => { update(fKey, v); update(pKey, ""); }}>
              <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
              <SelectContent>
                {faculties.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Programme</Label>
            <Select value={form[pKey]} onValueChange={(v) => update(pKey, v)} disabled={!form[fKey]}>
              <SelectTrigger><SelectValue placeholder="Select programme" /></SelectTrigger>
              <SelectContent>
                {(programmes[form[fKey]] || []).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
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
        <Input value={form.intakeYear} onChange={(e) => update("intakeYear", e.target.value)} required />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(renderChoice)}
      </div>
    </FormWrapper>
  );
};

export default ProgrammeChoiceForm;
