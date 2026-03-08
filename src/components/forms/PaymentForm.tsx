import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/ui/phone-input";
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
      <div className="flex flex-col items-center py-10 animate-fade-in">
        {/* Success icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
              <CheckCircle2 className="w-7 h-7 text-success-foreground animate-[scale-in_0.3s_ease-out_0.3s_both]" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-heading font-bold text-foreground mb-1">Payment Successful!</h2>
        <p className="text-sm text-muted-foreground mb-6">Your application fee has been received</p>

        {/* Receipt Card */}
        <Card className="w-full max-w-md border-2 border-success/20 shadow-lg shadow-success/5 overflow-hidden">
          {/* Receipt header */}
          <div className="bg-success/5 px-6 py-4 flex items-center justify-between border-b border-success/10">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-success" />
              <span className="font-heading font-semibold text-sm">Payment Receipt</span>
            </div>
            <Badge className="bg-success/10 text-success border-success/20 text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Paid
            </Badge>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Amount */}
            <div className="text-center py-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount Paid</p>
              <p className="text-3xl font-heading font-bold text-foreground">USD $25.00</p>
            </div>

            <Separator />

            {/* Details grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Hash className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Transaction Reference</p>
                  <p className="text-sm font-mono font-semibold text-foreground truncate">{txRef}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">EcoCash Number</p>
                  <p className="text-sm font-semibold text-foreground">{phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Payment Method</p>
                  <p className="text-sm font-semibold text-foreground">EcoCash Mobile Money</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold text-foreground">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-semibold text-foreground">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm font-semibold text-foreground">Application Processing Fee</p>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Receipt footer */}
          <div className="bg-muted/30 px-6 py-3 border-t text-center">
            <p className="text-xs text-muted-foreground">Keep this receipt for your records</p>
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Button variant="outline" onClick={handleDownloadReceipt}>
            <Download className="w-4 h-4 mr-2" /> Download Receipt
          </Button>
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
