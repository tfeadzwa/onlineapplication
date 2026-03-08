import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/ui/searchable-select";
import PhoneInput from "@/components/ui/phone-input";
import { CountrySelect } from "@/components/ui/country-select";
import { ZW_PROVINCES, ZW_CITIES, RELATIONSHIPS } from "@/lib/form-options";
import FormWrapper from "./FormWrapper";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ContactDetailsForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [form, setForm] = useState({
    phone: data.phone || "",
    altPhone: data.altPhone || "",
    email: data.email || "",
    address: data.address || "",
    city: data.city || "",
    province: data.province || "",
    country: data.country || "zimbabwe",
    nextOfKinName: data.nextOfKinName || "",
    nextOfKinPhone: data.nextOfKinPhone || "",
    nextOfKinRelation: data.nextOfKinRelation || "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <FormWrapper
      title="Contact Details"
      description="Provide your contact information and next of kin details."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone Number *</Label>
          <PhoneInput value={form.phone} onChange={(v) => update("phone", v)} placeholder="7X XXX XXXX" required />
        </div>
        <div className="space-y-2">
          <Label>Alternative Phone</Label>
          <Input value={form.altPhone} onChange={(e) => update("altPhone", e.target.value)} placeholder="e.g. +263 7X XXX XXXX" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Email Address *</Label>
          <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="e.g. john.doe@example.com" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Residential Address *</Label>
          <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} required rows={2} placeholder="e.g. 123 Main Street, Masvingo" />
        </div>
        <div className="space-y-2">
          <Label>Country *</Label>
          <CountrySelect value={form.country} onValueChange={(v) => { update("country", v); update("province", ""); update("city", ""); }} />
        </div>
        <div className="space-y-2">
          <Label>Province</Label>
          {form.country === "zimbabwe" ? (
            <SearchableSelect options={ZW_PROVINCES} value={form.province} onValueChange={(v) => update("province", v)} placeholder="Select province" searchPlaceholder="Search province..." />
          ) : (
            <Input value={form.province} onChange={(e) => update("province", e.target.value)} placeholder="Enter province/state" />
          )}
        </div>
        <div className="space-y-2">
          <Label>City/Town *</Label>
          {form.country === "zimbabwe" ? (
            <SearchableSelect options={ZW_CITIES} value={form.city} onValueChange={(v) => update("city", v)} placeholder="Select city" searchPlaceholder="Search city..." allowCustom />
          ) : (
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Enter city/town" required />
          )}
        </div>
      </div>

      <div className="pt-4 border-t mt-6">
        <h3 className="font-heading font-semibold mb-4">Next of Kin</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input value={form.nextOfKinName} onChange={(e) => update("nextOfKinName", e.target.value)} placeholder="e.g. Jane Doe" required />
          </div>
          <div className="space-y-2">
            <Label>Phone *</Label>
            <Input value={form.nextOfKinPhone} onChange={(e) => update("nextOfKinPhone", e.target.value)} placeholder="e.g. +263 7X XXX XXXX" required />
          </div>
          <div className="space-y-2">
            <Label>Relationship *</Label>
            <SearchableSelect options={RELATIONSHIPS} value={form.nextOfKinRelation} onValueChange={(v) => update("nextOfKinRelation", v)} placeholder="Select relationship" searchPlaceholder="Search..." allowCustom />
          </div>
        </div>
      </div>
    </FormWrapper>
  );
};

export default ContactDetailsForm;
