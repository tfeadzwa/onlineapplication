import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, CheckCircle2, ArrowLeft, ArrowRight, Loader2, Phone, Receipt, Calendar, Hash, User, CreditCard, Clock } from "lucide-react";
import FormWrapper from "./FormWrapper";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const APPLICATION_FEE = 25;

type PaymentStage = "input" | "waiting" | "success";

const PaymentForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");
  const [stage, setStage] = useState<PaymentStage>("input");
  const [countdown, setCountdown] = useState(0);

  const txRef = useMemo(() => `EC${Date.now().toString(36).toUpperCase()}`, []);
  const txTime = useMemo(() => new Date(), []);
  const [countdown, setCountdown] = useState(0);

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("waiting");
    setCountdown(30);

    // Simulate countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate EcoCash API callback after ~5 seconds
    setTimeout(() => {
      clearInterval(interval);
      setStage("success");
    }, 5000);
  };

  const handleContinue = () => {
    onNext({
      phoneNumber,
      paymentMethod: "ecocash",
      referenceNumber: `EC${Date.now().toString(36).toUpperCase()}`,
      paymentDate: new Date().toISOString().split("T")[0],
    });
  };

  // ── Waiting for phone confirmation ──
  if (stage === "waiting") {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="relative mb-8">
          {/* Pulsing phone icon */}
          <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Phone className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
          </div>
          {/* Rotating ring */}
          <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>

        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Check Your Phone</h2>
        <p className="text-muted-foreground text-center max-w-sm mb-2">
          An EcoCash payment prompt has been sent to
        </p>
        <p className="font-mono font-semibold text-lg text-foreground mb-4">{phoneNumber}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your EcoCash PIN on your phone to confirm the payment of{" "}
          <span className="font-semibold text-foreground">USD $25.00</span>
        </p>

        <div className="flex items-center gap-2 mb-8">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Waiting for confirmation… {countdown > 0 && `(${countdown}s)`}
          </span>
        </div>

        <div className="space-y-3 text-center">
          <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 max-w-sm">
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>A USSD prompt will appear on your phone. Enter your PIN to authorize the payment.</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setStage("input")} className="text-muted-foreground">
            Cancel & go back
          </Button>
        </div>
      </div>
    );
  }

  // ── Payment successful ──
  if (stage === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
                <CheckCircle2 className="w-8 h-8 text-success-foreground animate-[scale-in_0.3s_ease-out_0.3s_both]" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-success/30 animate-ping" />
        </div>

        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground text-center max-w-sm mb-2">
          Your EcoCash payment of <span className="font-semibold text-foreground">USD $25.00</span> has been confirmed.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Phone: <span className="font-semibold text-foreground">{phoneNumber}</span>
        </p>

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

  // ── Input stage ──
  return (
    <FormWrapper
      title="Application Fee Payment"
      description="Pay the non-refundable application fee via EcoCash mobile money."
      onSubmit={handleInitiatePayment}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
      customSubmit={
        <Button type="submit" size="lg">
          <Smartphone className="w-4 h-4 mr-2" />
          Pay USD $25.00 via EcoCash
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

      {/* EcoCash badge */}
      <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-primary bg-primary/5 shadow-sm">
        <Smartphone className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <p className="font-medium text-sm">EcoCash Mobile Money</p>
          <p className="text-xs text-muted-foreground">A payment prompt will be sent to your phone</p>
        </div>
        <CheckCircle2 className="w-5 h-5 text-primary" />
      </div>

      {/* How it works */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm font-heading font-semibold mb-2">How It Works</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>1. Enter your EcoCash mobile number below</p>
            <p>2. Click <span className="font-semibold text-foreground">"Pay via EcoCash"</span></p>
            <p>3. A payment prompt will appear on your phone</p>
            <p>4. Enter your EcoCash PIN to confirm the payment</p>
          </div>
        </CardContent>
      </Card>

      {/* Phone number input */}
      <div className="space-y-2 pt-2">
        <Label>EcoCash Phone Number *</Label>
        <PhoneInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          placeholder="77 123 4567"
          required
        />
        <p className="text-xs text-muted-foreground">The EcoCash number that will be charged USD $25.00</p>
      </div>
    </FormWrapper>
  );
};

export default PaymentForm;
