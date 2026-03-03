import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Building2, CheckCircle2 } from "lucide-react";
import FormWrapper from "./FormWrapper";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const APPLICATION_FEE = 25;

const PaymentForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [form, setForm] = useState({
    paymentMethod: data.paymentMethod || "",
    referenceNumber: data.referenceNumber || "",
    accountName: data.accountName || "",
    paymentDate: data.paymentDate || "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const methods = [
    { value: "ecocash", label: "EcoCash", icon: Smartphone, desc: "Pay via EcoCash mobile money" },
    { value: "bank_transfer", label: "Bank Transfer", icon: Building2, desc: "Direct bank deposit or transfer" },
    { value: "zipit", label: "ZIPIT", icon: CreditCard, desc: "Interbank transfer via ZIPIT" },
  ];

  return (
    <FormWrapper
      title="Application Fee Payment"
      description="Pay the non-refundable application processing fee to complete your application."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Fee breakdown */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-semibold text-lg">Application Fee</p>
              <p className="text-sm text-muted-foreground">Non-refundable processing fee</p>
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-2xl text-primary">USD ${APPLICATION_FEE}.00</p>
              <Badge variant="secondary" className="mt-1">Required</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment method selection */}
      <div className="space-y-3">
        <Label className="font-heading font-semibold">Select Payment Method *</Label>
        <RadioGroup value={form.paymentMethod} onValueChange={(v) => update("paymentMethod", v)} className="space-y-3">
          {methods.map((m) => (
            <label
              key={m.value}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                form.paymentMethod === m.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <RadioGroupItem value={m.value} />
              <m.icon className={`w-5 h-5 ${form.paymentMethod === m.value ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <p className="font-medium text-sm">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
              {form.paymentMethod === m.value && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Payment details */}
      {form.paymentMethod && (
        <div className="space-y-4 pt-2">
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm font-heading font-semibold mb-2">Payment Instructions</p>
              {form.paymentMethod === "ecocash" && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>1. Dial *151*2*1# on your EcoCash line</p>
                  <p>2. Enter Merchant Code: <span className="font-mono font-semibold text-foreground">123456</span></p>
                  <p>3. Enter amount: <span className="font-semibold text-foreground">$25.00</span></p>
                  <p>4. Confirm payment and note your reference number</p>
                </div>
              )}
              {form.paymentMethod === "bank_transfer" && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Bank: <span className="font-semibold text-foreground">CBZ Bank</span></p>
                  <p>Account Name: <span className="font-semibold text-foreground">Great Zimbabwe University</span></p>
                  <p>Account No: <span className="font-mono font-semibold text-foreground">01234567890</span></p>
                  <p>Branch: <span className="font-semibold text-foreground">Masvingo</span></p>
                </div>
              )}
              {form.paymentMethod === "zipit" && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Use ZIPIT to transfer to:</p>
                  <p>Bank: <span className="font-semibold text-foreground">CBZ Bank</span></p>
                  <p>Account: <span className="font-mono font-semibold text-foreground">01234567890</span></p>
                  <p>Reference: Use your National ID number</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Reference / Receipt Number *</Label>
              <Input
                value={form.referenceNumber}
                onChange={(e) => update("referenceNumber", e.target.value)}
                placeholder="e.g. MP230415.1234.A12345"
                required
              />
              <p className="text-xs text-muted-foreground">Enter the reference number from your payment confirmation</p>
            </div>
            <div className="space-y-2">
              <Label>Account / Sender Name *</Label>
              <Input
                value={form.accountName}
                onChange={(e) => update("accountName", e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Date *</Label>
              <Input
                type="date"
                value={form.paymentDate}
                onChange={(e) => update("paymentDate", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  );
};

export default PaymentForm;
