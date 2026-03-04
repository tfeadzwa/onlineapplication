import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect from "@/components/ui/searchable-select";
import { CountrySelect } from "@/components/ui/country-select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { GENDERS, MARITAL_STATUSES } from "@/lib/form-options";
import FormWrapper from "./FormWrapper";

const ZW_ID_REGEX = /^\d{2}-\d{6}[A-Za-z]\d{2}$/;

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
    hasMiddleName: data.hasMiddleName || false,
    middleName: data.middleName || "",
    dateOfBirth: data.dateOfBirth || "",
    gender: data.gender || "",
    country: data.country || "zimbabwe",
    nationalId: data.nationalId || "",
    maritalStatus: data.maritalStatus || "",
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.country === "zimbabwe" && !ZW_ID_REGEX.test(form.nationalId)) {
      toast.error("Invalid Zimbabwean National ID. Expected format: 45-202231J45");
      return;
    }
    onNext(form);
  };

  return (
    <FormWrapper
      title="Student Information"
      description="Provide your personal details as they appear on your official documents."
      onSubmit={handleSubmit}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name *</Label>
          <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Enter your first name" required />
        </div>
        <div className="space-y-2">
          <Label>Last Name *</Label>
          <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Enter your last name" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasMiddleNameInfo"
              checked={form.hasMiddleName}
              onCheckedChange={(v) => { update("hasMiddleName", !!v); if (!v) update("middleName", ""); }}
            />
            <Label htmlFor="hasMiddleNameInfo" className="cursor-pointer text-muted-foreground">I have a middle name</Label>
          </div>
          {form.hasMiddleName && (
            <Input value={form.middleName} onChange={(e) => update("middleName", e.target.value)} placeholder="Enter your middle name" />
          )}
        </div>
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <SearchableSelect options={GENDERS} value={form.gender} onValueChange={(v) => update("gender", v)} placeholder="Select gender" searchPlaceholder="Search gender..." />
        </div>
        <div className="space-y-2">
          <Label>Country *</Label>
          <CountrySelect value={form.country} onValueChange={(v) => { update("country", v); update("nationalId", ""); }} />
        </div>
        <div className="space-y-1">
          <Label>National ID *</Label>
          <Input
            value={form.nationalId}
            onChange={(e) => update("nationalId", e.target.value)}
            placeholder={form.country === "zimbabwe" ? "e.g. 45-202231J45" : "Enter your national ID number"}
            required
          />
          {form.country === "zimbabwe" && (
            <p className="text-xs text-muted-foreground">Format: XX-XXXXXXAXX (e.g. 45-202231J45)</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Marital Status</Label>
          <SearchableSelect options={MARITAL_STATUSES} value={form.maritalStatus} onValueChange={(v) => update("maritalStatus", v)} placeholder="Select marital status" searchPlaceholder="Search..." />
        </div>
      </div>
    </FormWrapper>
  );
};

export default StudentInfoForm;
