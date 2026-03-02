import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormWrapper from "./FormWrapper";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const StudentInfoForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [form, setForm] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    middleName: data.middleName || "",
    dateOfBirth: data.dateOfBirth || "",
    gender: data.gender || "",
    nationalId: data.nationalId || "",
    maritalStatus: data.maritalStatus || "",
    nationality: data.nationality || "Zimbabwean",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <FormWrapper
      title="Student Information"
      description="Provide your personal details as they appear on your official documents."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name *</Label>
          <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Last Name *</Label>
          <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Middle Name</Label>
          <Input value={form.middleName} onChange={(e) => update("middleName", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>National ID *</Label>
          <Input value={form.nationalId} onChange={(e) => update("nationalId", e.target.value)} placeholder="e.g. 63-123456-A-78" required />
        </div>
        <div className="space-y-2">
          <Label>Marital Status</Label>
          <Select value={form.maritalStatus} onValueChange={(v) => update("maritalStatus", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nationality *</Label>
          <Input value={form.nationality} onChange={(e) => update("nationality", e.target.value)} required />
        </div>
      </div>
    </FormWrapper>
  );
};

export default StudentInfoForm;
