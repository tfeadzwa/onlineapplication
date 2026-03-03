import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, CheckCircle2, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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
    paymentMethod: "ecocash",
    referenceNumber: data.referenceNumber || "",
    accountName: data.accountName || "",
    paymentDate: data.paymentDate || "",
    phoneNumber: data.phoneNumber || "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleContinue = () => {
    onNext(form);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        {/* Animated success circle */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
                <CheckCircle2 className="w-8 h-8 text-success-foreground animate-[scale-in_0.3s_ease-out_0.3s_both]" />
              </div>
            </div>
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-success/30 animate-ping" />
        </div>

        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground text-center max-w-sm mb-2">
          Your EcoCash payment of <span className="font-semibold text-foreground">USD $25.00</span> has been confirmed.
        </p>
        <p className="text-sm text-muted-foreground mb-1">Reference: <span className="font-mono font-semibold text-foreground">{form.referenceNumber}</span></p>
        <p className="text-sm text-muted-foreground mb-8">Phone: <span className="font-semibold text-foreground">{form.phoneNumber}</span></p>

        <Badge className="bg-success/10 text-success border-success/20 mb-8 px-4 py-2 text-sm">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Payment Verified
        </Badge>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button size="lg" onClick={handleContinue}>
            Continue to Summary
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormWrapper
      title="Application Fee Payment"
      description="Pay the non-refundable application processing fee via EcoCash to proceed."
      onSubmit={handlePayment}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
      customSubmit={
        <Button type="submit" size="lg" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4 mr-2" />
              Confirm EcoCash Payment
            </>
          )}
        </Button>
      }
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

      {/* EcoCash selected by default */}
      <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-primary bg-primary/5 shadow-sm">
        <Smartphone className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <p className="font-medium text-sm">EcoCash Mobile Money</p>
          <p className="text-xs text-muted-foreground">Pay instantly via your EcoCash wallet</p>
        </div>
        <CheckCircle2 className="w-5 h-5 text-primary" />
      </div>

      {/* EcoCash Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm font-heading font-semibold mb-2">How to Pay</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>1. Dial <span className="font-mono font-semibold text-foreground">*151*2*1#</span> on your EcoCash line</p>
            <p>2. Enter Merchant Code: <span className="font-mono font-semibold text-foreground">123456</span></p>
            <p>3. Enter amount: <span className="font-semibold text-foreground">$25.00</span></p>
            <p>4. Confirm payment and enter your reference below</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment details */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>EcoCash Phone Number *</Label>
            <Input
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
              placeholder="e.g. 0771234567"
              required
            />
            <p className="text-xs text-muted-foreground">The number you used to make the payment</p>
          </div>
          <div className="space-y-2">
            <Label>EcoCash Reference Number *</Label>
            <Input
              value={form.referenceNumber}
              onChange={(e) => update("referenceNumber", e.target.value)}
              placeholder="e.g. MP230415.1234.A12345"
              required
            />
            <p className="text-xs text-muted-foreground">From your EcoCash confirmation SMS</p>
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
    </FormWrapper>
  );
};

export default PaymentForm;
