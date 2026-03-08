import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/ui/phone-input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, CheckCircle2, ArrowLeft, ArrowRight, Loader2, Phone, Receipt, Calendar, Hash, User, CreditCard, Clock, Download, RefreshCw } from "lucide-react";
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
  const alreadyPaid = !!(data.referenceNumber && data.paymentDate);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");
  const [stage, setStage] = useState<PaymentStage>(alreadyPaid ? "success" : "input");
  const [countdown, setCountdown] = useState(0);
  const [retryOpen, setRetryOpen] = useState(false);
  const [retryPhone, setRetryPhone] = useState(data.phoneNumber || "");

  const txRef = useMemo(() => data.referenceNumber || `EC${Date.now().toString(36).toUpperCase()}`, [data.referenceNumber]);
  const txTime = useMemo(() => data.paymentDate ? new Date(data.paymentDate) : new Date(), [data.paymentDate]);

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
      referenceNumber: txRef,
      paymentDate: txTime.toISOString().split("T")[0],
    });
  };

  const handleDownloadReceipt = async () => {
    const { default: jsPDF } = await import("jspdf");
    const QRCode = await import("qrcode");

    const formattedDate = txTime.toLocaleDateString("en-ZW", { year: "numeric", month: "long", day: "numeric" });
    const formattedTime = txTime.toLocaleTimeString("en-ZW", { hour: "2-digit", minute: "2-digit" });

    const qrDataUrl = await QRCode.toDataURL(
      `GZU-RECEIPT|${txRef}|USD25.00|${phoneNumber}|${txTime.toISOString()}`,
      { width: 120, margin: 1 }
    );

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();

    // Header band
    doc.setFillColor(22, 78, 99); // primary-ish teal
    doc.rect(0, 0, w, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Great Zimbabwe University", w / 2, 18, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Online Application Payment Receipt", w / 2, 28, { align: "center" });

    // Status badge
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(w / 2 - 18, 44, 36, 10, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PAID ✓", w / 2, 51, { align: "center" });

    // Receipt details
    const startY = 68;
    const labelX = 25;
    const valueX = 90;
    const lineH = 12;

    const rows = [
      ["Transaction Reference", txRef],
      ["Amount", "USD $25.00"],
      ["Payment Method", "EcoCash Mobile Money"],
      ["Phone Number", phoneNumber],
      ["Date", formattedDate],
      ["Time", formattedTime],
      ["Description", "Application Processing Fee"],
    ];

    // Alternating row backgrounds
    rows.forEach((_, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(245, 247, 250);
        doc.rect(20, startY + i * lineH - 4, w - 40, lineH, "F");
      }
    });

    // Border around table
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, startY - 4, w - 40, rows.length * lineH, "S");

    rows.forEach(([label, value], i) => {
      const y = startY + i * lineH + 4;
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(label, labelX, y);
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(value, valueX, y);
    });

    // QR Code
    const qrY = startY + rows.length * lineH + 15;
    doc.addImage(qrDataUrl, "PNG", w / 2 - 20, qrY, 40, 40);
    doc.setTextColor(140, 140, 140);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Scan to verify this receipt", w / 2, qrY + 45, { align: "center" });

    // Footer
    const footerY = qrY + 58;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY, w - 20, footerY);
    doc.setTextColor(160, 160, 160);
    doc.setFontSize(7);
    doc.text("This is a computer-generated receipt and does not require a signature.", w / 2, footerY + 6, { align: "center" });
    doc.text(`© ${new Date().getFullYear()} Great Zimbabwe University. All rights reserved.`, w / 2, footerY + 11, { align: "center" });

    doc.save(`GZU-Receipt-${txRef}.pdf`);
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
    const formattedDate = txTime.toLocaleDateString("en-ZW", {
      year: "numeric", month: "long", day: "numeric",
    });
    const formattedTime = txTime.toLocaleTimeString("en-ZW", {
      hour: "2-digit", minute: "2-digit",
    });

    return (
      <FormWrapper
        title="Application Fee Payment"
        description="Your payment has been received successfully."
        onSubmit={(e) => { e.preventDefault(); handleContinue(); }}
        onBack={onBack}
        isFirst={isFirst}
        isLast={isLast}
        customSubmit={
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={handleDownloadReceipt}>
              <Download className="w-4 h-4 mr-2" /> Download Receipt
            </Button>
            <Button type="submit" size="lg">
              Continue to Summary <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        }
      >
        {/* Retry payment - collapsible at top */}
        <Collapsible open={retryOpen} onOpenChange={setRetryOpen}>
          <Card className={`border transition-colors ${retryOpen ? "border-primary/40 bg-primary/5" : "border-dashed border-muted-foreground/30 bg-muted/30"}`}>
            <CollapsibleTrigger asChild>
              <button type="button" className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/20 transition-colors rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${retryOpen ? "bg-primary/15" : "bg-muted"}`}>
                  <RefreshCw className={`w-4 h-4 transition-transform ${retryOpen ? "text-primary rotate-180" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Payment didn't reach GZU?</p>
                  <p className="text-xs text-muted-foreground">
                    {retryOpen ? "Fill in the details below to retry" : "Click here to retry with a new transaction"}
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 text-muted-foreground transition-transform ${retryOpen ? "rotate-90" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4 animate-fade-in">
                {/* Inline fee card */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">EcoCash Mobile Money</span>
                  </div>
                  <span className="text-sm font-heading font-bold text-primary">USD $25.00</span>
                </div>

                {/* How it works - compact */}
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-primary">1.</span>
                    <span>Enter your <span className="font-medium text-foreground">EcoCash registered number</span> below</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-primary">2.</span>
                    <span>Click <span className="font-medium text-foreground">"Pay via EcoCash"</span></span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-primary">3.</span>
                    <span>Authorize the payment by entering your <span className="font-medium text-foreground">EcoCash PIN</span> on the USSD prompt</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">⚠ Ensure your account has at least <span className="font-medium text-foreground">USD $25.00</span> balance. Do not close this page during processing.</p>

                {/* Phone input */}
                <div className="space-y-2">
                  <Label className="text-sm">EcoCash Phone Number *</Label>
                  <PhoneInput
                    value={retryPhone}
                    onChange={setRetryPhone}
                    placeholder="77 123 4567"
                  />
                </div>

                <Button
                  type="button"
                  className="w-full"
                  disabled={!retryPhone}
                  onClick={() => {
                    setPhoneNumber(retryPhone);
                    setRetryOpen(false);
                    setStage("waiting");
                    setCountdown(30);
                    const interval = setInterval(() => {
                      setCountdown((prev) => {
                        if (prev <= 1) { clearInterval(interval); return 0; }
                        return prev - 1;
                      });
                    }, 1000);
                    setTimeout(() => { clearInterval(interval); setStage("success"); }, 5000);
                  }}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Pay USD $25.00 via EcoCash
                </Button>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Success banner */}
        <div className="flex flex-col items-center py-4 animate-fade-in">
          <div className="relative mb-3">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
                <CheckCircle2 className="w-5 h-5 text-success-foreground" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-heading font-bold text-foreground mb-1">Payment Successful!</h3>
          <p className="text-sm text-muted-foreground">Your application fee has been received</p>
        </div>

        {/* Receipt Card */}
      </FormWrapper>
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
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-heading font-semibold">How It Works</p>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <p>Enter your <span className="font-semibold text-foreground">EcoCash registered mobile number</span> in the field below</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <p>Click the <span className="font-semibold text-foreground">"Pay USD $25.00 via EcoCash"</span> button</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <p>A <span className="font-semibold text-foreground">USSD prompt</span> will appear on your phone asking you to authorize the payment</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
              <p>Enter your <span className="font-semibold text-foreground">EcoCash PIN</span> to confirm and complete the payment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important notes */}
      <Card className="bg-muted/50 border-destructive/20">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-heading font-semibold flex items-center gap-2">
            <span className="text-destructive">⚠</span> Important Notes
          </p>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
            <li>Ensure your EcoCash account has a <span className="font-medium text-foreground">minimum balance of USD $25.00</span></li>
            <li>The phone number must be <span className="font-medium text-foreground">registered with EcoCash</span></li>
            <li>Do <span className="font-medium text-foreground">not close this page</span> while the payment is being processed</li>
            <li>If you do not receive a prompt within 30 seconds, try again or contact EcoCash support at <span className="font-medium text-foreground">*151#</span></li>
            <li>This is a <span className="font-medium text-foreground">non-refundable</span> application processing fee</li>
            <li>You will receive an <span className="font-medium text-foreground">SMS confirmation</span> from EcoCash once the payment is successful</li>
          </ul>
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
        <p className="text-xs text-muted-foreground">The EcoCash number that will be charged USD $25.00. Must be a registered EcoCash number.</p>
      </div>
    </FormWrapper>
  );
};

export default PaymentForm;
