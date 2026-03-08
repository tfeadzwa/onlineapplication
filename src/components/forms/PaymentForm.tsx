import { useState, useMemo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/ui/phone-input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, CheckCircle2, ArrowRight, Loader2, Phone, Receipt, Calendar, Hash, CreditCard, Clock, Download, RefreshCw, ChevronDown } from "lucide-react";
import FormWrapper from "./FormWrapper";
import ecocashLogo from "@/assets/ecocash-logo.png";

interface PaymentRecord {
  referenceNumber: string;
  phoneNumber: string;
  amount: number;
  method: string;
  date: string;
  time: string;
  timestamp: string;
}

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const APPLICATION_FEE = 25;

type PaymentStage = "input" | "waiting" | "success";

const generateReceiptPdf = async (payment: PaymentRecord) => {
  const { default: jsPDF } = await import("jspdf");
  const QRCode = await import("qrcode");

  const qrDataUrl = await QRCode.toDataURL(
    `GZU-RECEIPT|${payment.referenceNumber}|USD${payment.amount}.00|${payment.phoneNumber}|${payment.timestamp}`,
    { width: 120, margin: 1 }
  );

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(22, 78, 99);
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

  const startY = 68;
  const labelX = 25;
  const valueX = 90;
  const lineH = 12;

  const rows = [
    ["Transaction Reference", payment.referenceNumber],
    ["Amount", `USD $${payment.amount}.00`],
    ["Payment Method", "EcoCash Mobile Money"],
    ["Phone Number", payment.phoneNumber],
    ["Date", payment.date],
    ["Time", payment.time],
    ["Description", "Application Processing Fee"],
  ];

  rows.forEach((_, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(20, startY + i * lineH - 4, w - 40, lineH, "F");
    }
  });

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

  const qrY = startY + rows.length * lineH + 15;
  doc.addImage(qrDataUrl, "PNG", w / 2 - 20, qrY, 40, 40);
  doc.setTextColor(140, 140, 140);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Scan to verify this receipt", w / 2, qrY + 45, { align: "center" });

  const footerY = qrY + 58;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, footerY, w - 20, footerY);
  doc.setTextColor(160, 160, 160);
  doc.setFontSize(7);
  doc.text("This is a computer-generated receipt and does not require a signature.", w / 2, footerY + 6, { align: "center" });
  doc.text(`© ${new Date().getFullYear()} Great Zimbabwe University. All rights reserved.`, w / 2, footerY + 11, { align: "center" });

  doc.save(`GZU-Receipt-${payment.referenceNumber}.pdf`);
};

const PaymentForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  // Build payments array from stored data
  const existingPayments: PaymentRecord[] = useMemo(() => data.payments || [], [data.payments]);
  const alreadyPaid = existingPayments.length > 0;

  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");
  const [stage, setStage] = useState<PaymentStage>(alreadyPaid ? "success" : "input");
  const [countdown, setCountdown] = useState(0);
  const [retryOpen, setRetryOpen] = useState(false);
  const [retryPhone, setRetryPhone] = useState(data.phoneNumber || "");
  const [payments, setPayments] = useState<PaymentRecord[]>(existingPayments);

  const createPaymentRecord = useCallback((phone: string): PaymentRecord => {
    const now = new Date();
    return {
      referenceNumber: `EC${Date.now().toString(36).toUpperCase()}`,
      phoneNumber: phone,
      amount: APPLICATION_FEE,
      method: "EcoCash Mobile Money",
      date: now.toLocaleDateString("en-ZW", { year: "numeric", month: "long", day: "numeric" }),
      time: now.toLocaleTimeString("en-ZW", { hour: "2-digit", minute: "2-digit" }),
      timestamp: now.toISOString(),
    };
  }, []);

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("waiting");
    setCountdown(30);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      const newPayment = createPaymentRecord(phoneNumber);
      setPayments((prev) => [newPayment, ...prev]);
      setStage("success");
    }, 5000);
  };

  const handleRetryPayment = (phone: string) => {
    setPhoneNumber(phone);
    setRetryOpen(false);
    setStage("waiting");
    setCountdown(30);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      const newPayment = createPaymentRecord(phone);
      setPayments((prev) => [newPayment, ...prev]);
      setStage("success");
    }, 5000);
  };

  const handleContinue = () => {
    const latestPayment = payments[0];
    onNext({
      phoneNumber: latestPayment?.phoneNumber || phoneNumber,
      paymentMethod: "ecocash",
      referenceNumber: latestPayment?.referenceNumber,
      paymentDate: latestPayment?.timestamp?.split("T")[0],
      payments,
    });
  };

  // ── Waiting for phone confirmation ──
  if (stage === "waiting") {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Phone className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
          </div>
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
          <Button variant="ghost" size="sm" onClick={() => setStage(payments.length > 0 ? "success" : "input")} className="text-muted-foreground">
            Cancel & go back
          </Button>
        </div>
      </div>
    );
  }

  // ── Payment successful ──
  if (stage === "success" && payments.length > 0) {
    return (
      <FormWrapper
        title="Application Fee Payment"
        description="Your payment has been received successfully."
        onSubmit={(e) => { e.preventDefault(); handleContinue(); }}
        onBack={onBack}
        isFirst={isFirst}
        isLast={isLast}
        customSubmit={
          <Button type="submit" size="lg">
            Continue to Summary <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
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
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${retryOpen ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4 animate-fade-in">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <img src={ecocashLogo} alt="EcoCash" className="h-5 w-auto" />
                    <span className="text-sm font-medium">Mobile Money</span>
                  </div>
                  <span className="text-sm font-heading font-bold text-primary">USD $25.00</span>
                </div>

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
                  onClick={() => handleRetryPayment(retryPhone)}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Pay USD $25.00 via EcoCash
                </Button>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Payment Records */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-heading font-semibold text-foreground">Payment Records</h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              {payments.length} {payments.length === 1 ? "payment" : "payments"}
            </Badge>
          </div>

          <Accordion type="single" collapsible defaultValue="payment-0" className="space-y-2">
            {payments.map((payment, index) => (
              <AccordionItem
                key={payment.referenceNumber}
                value={`payment-${index}`}
                className="border rounded-lg overflow-hidden bg-card shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 [&[data-state=open]]:bg-success/5">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">USD ${payment.amount}.00</span>
                        <Badge className="bg-success/10 text-success border-success/20 text-[10px] px-1.5 py-0">
                          Paid
                        </Badge>
                        {index === 0 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                            Latest
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="font-mono">{payment.referenceNumber}</span>
                        <span>•</span>
                        <span>{payment.date}</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <div className="border-t">
                    <div className="p-4 space-y-3">
                      {/* Amount highlight */}
                      <div className="text-center py-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Amount Paid</p>
                        <p className="text-2xl font-heading font-bold text-foreground">USD ${payment.amount}.00</p>
                      </div>

                      <Separator />

                      {/* Details */}
                      <div className="grid gap-2.5">
                        {[
                          { icon: Hash, label: "Transaction Reference", value: payment.referenceNumber, mono: true },
                          { icon: Phone, label: "EcoCash Number", value: payment.phoneNumber },
                          { icon: CreditCard, label: "Payment Method", value: payment.method },
                          { icon: Calendar, label: "Date", value: payment.date },
                          { icon: Clock, label: "Time", value: payment.time },
                        ].map(({ icon: Icon, label, value, mono }) => (
                          <div key={label} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-muted-foreground leading-none mb-0.5">{label}</p>
                              <p className={`text-sm font-semibold text-foreground truncate ${mono ? "font-mono" : ""}`}>{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Download footer */}
                    <div className="bg-muted/30 px-4 py-3 border-t flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Keep this receipt for your records</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => generateReceiptPdf(payment)}
                        className="gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Receipt
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
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
        <img src={ecocashLogo} alt="EcoCash" className="h-6 w-auto" />
        <div className="flex-1">
          <p className="font-medium text-sm">Mobile Money</p>
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
