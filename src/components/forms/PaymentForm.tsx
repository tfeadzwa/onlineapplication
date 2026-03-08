import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Smartphone, CheckCircle2, ArrowLeft, ArrowRight, Loader2, Phone,
  Receipt, Calendar, Hash, User, CreditCard, Clock, Download, RefreshCw,
} from "lucide-react";
import FormWrapper from "./FormWrapper";

interface PaymentRecord {
  referenceNumber: string;
  phoneNumber: string;
  paymentDate: string;
  paymentTime: string;
  amount: number;
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

const generateRef = () => `EC${Date.now().toString(36).toUpperCase()}`;

const downloadReceiptPdf = async (record: PaymentRecord) => {
  const { default: jsPDF } = await import("jspdf");
  const QRCode = await import("qrcode");

  const date = new Date(record.paymentDate);
  const formattedDate = date.toLocaleDateString("en-ZW", { year: "numeric", month: "long", day: "numeric" });

  const qrDataUrl = await QRCode.toDataURL(
    `GZU-RECEIPT|${record.referenceNumber}|USD${record.amount}.00|${record.phoneNumber}|${record.paymentDate}`,
    { width: 120, margin: 1 }
  );

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  doc.setFillColor(22, 78, 99);
  doc.rect(0, 0, w, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Great Zimbabwe University", w / 2, 18, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Online Application Payment Receipt", w / 2, 28, { align: "center" });

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
    ["Transaction Reference", record.referenceNumber],
    ["Amount", `USD $${record.amount}.00`],
    ["Payment Method", "EcoCash Mobile Money"],
    ["Phone Number", record.phoneNumber],
    ["Date", formattedDate],
    ["Time", record.paymentTime],
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

  doc.save(`GZU-Receipt-${record.referenceNumber}.pdf`);
};

// ── Receipt row component ──
const ReceiptDetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground truncate">{value}</p>
    </div>
  </div>
);

// ── Single receipt card ──
const ReceiptCard = ({ record, index, total }: { record: PaymentRecord; index: number; total: number }) => {
  const date = new Date(record.paymentDate);
  const formattedDate = date.toLocaleDateString("en-ZW", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Card className="w-full max-w-md border-2 border-success/20 shadow-lg shadow-success/5 overflow-hidden">
      <div className="bg-success/5 px-6 py-4 flex items-center justify-between border-b border-success/10">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-success" />
          <span className="font-heading font-semibold text-sm">
            Payment Receipt {total > 1 && `#${total - index}`}
          </span>
        </div>
        <Badge className="bg-success/10 text-success border-success/20 text-xs">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="text-center py-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount Paid</p>
          <p className="text-3xl font-heading font-bold text-foreground">USD ${record.amount}.00</p>
        </div>

        <Separator />

        <div className="space-y-3">
          <ReceiptDetailRow icon={Hash} label="Transaction Reference" value={record.referenceNumber} />
          <ReceiptDetailRow icon={Phone} label="EcoCash Number" value={record.phoneNumber} />
          <ReceiptDetailRow icon={CreditCard} label="Payment Method" value="EcoCash Mobile Money" />
          <ReceiptDetailRow icon={Calendar} label="Date" value={formattedDate} />
          <ReceiptDetailRow icon={Clock} label="Time" value={record.paymentTime} />
          <ReceiptDetailRow icon={User} label="Description" value="Application Processing Fee" />
        </div>
      </CardContent>

      <div className="bg-muted/30 px-6 py-3 border-t flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Keep this receipt for your records</p>
        <Button variant="ghost" size="sm" onClick={() => downloadReceiptPdf(record)}>
          <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
        </Button>
      </div>
    </Card>
  );
};

// ── Main component ──
const PaymentForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const payments: PaymentRecord[] = data.payments || [];
  const hasPaid = payments.length > 0;

  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");
  const [stage, setStage] = useState<PaymentStage>(hasPaid ? "success" : "input");
  const [countdown, setCountdown] = useState(0);
  const [currentPayments, setCurrentPayments] = useState<PaymentRecord[]>(payments);

  const latestRef = useMemo(() => generateRef(), []);

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
      const now = new Date();
      const newRecord: PaymentRecord = {
        referenceNumber: latestRef,
        phoneNumber,
        paymentDate: now.toISOString(),
        paymentTime: now.toLocaleTimeString("en-ZW", { hour: "2-digit", minute: "2-digit" }),
        amount: APPLICATION_FEE,
      };
      setCurrentPayments((prev) => [newRecord, ...prev]);
      setStage("success");
    }, 5000);
  };

  const handleContinue = () => {
    onNext({
      phoneNumber,
      paymentMethod: "ecocash",
      referenceNumber: currentPayments[0]?.referenceNumber || latestRef,
      paymentDate: currentPayments[0]?.paymentDate || new Date().toISOString().split("T")[0],
      payments: currentPayments,
    });
  };

  // ── Waiting ──
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
          <Button variant="ghost" size="sm" onClick={() => setStage(hasPaid ? "success" : "input")} className="text-muted-foreground">
            Cancel & go back
          </Button>
        </div>
      </div>
    );
  }

  // ── Success / Records view ──
  if (stage === "success") {
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
        <p className="text-sm text-muted-foreground mb-6">
          {currentPayments.length === 1
            ? "Your application fee has been received"
            : `You have ${currentPayments.length} payment records`}
        </p>

        {/* All receipt cards */}
        <div className="w-full max-w-md space-y-4">
          {currentPayments.map((record, i) => (
            <ReceiptCard key={record.referenceNumber} record={record} index={i} total={currentPayments.length} />
          ))}
        </div>

        {/* Retry payment */}
        <Card className="w-full max-w-md border border-dashed border-muted-foreground/30 bg-muted/30 mt-4">
          <CardContent className="p-4 flex items-start gap-3">
            <RefreshCw className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Payment didn't reach GZU?</p>
              <p className="text-xs text-muted-foreground mb-3">
                If your EcoCash was debited but the payment wasn't received by the university, you can retry with a new transaction.
              </p>
              <Button variant="outline" size="sm" onClick={() => setStage("input")}>
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Pay Again
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
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

      {/* Previous payments notice */}
      {currentPayments.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Receipt className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                You have {currentPayments.length} previous payment{currentPayments.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                You can view your existing receipts or make a new payment below.
              </p>
              <Button variant="outline" size="sm" onClick={() => setStage("success")}>
                <Receipt className="w-3.5 h-3.5 mr-2" />
                View Payment Records
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
