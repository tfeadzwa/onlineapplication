import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap, ArrowLeft, Download, CheckCircle, BookOpen,
  DollarSign, Home, HeartPulse, Calendar, ClipboardList, PartyPopper,
  ChevronRight, Building2, MapPin, Clock, AlertTriangle, ScrollText, Eye,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useRef, useCallback } from "react";
import jsPDF from "jspdf";

const AcceptedOffer = () => {
  const { id } = useParams();
  const { user, applications } = useAuth();
  const navigate = useNavigate();

  const app = applications.find((a) => a.id === id);

  if (!app || app.status !== "accepted") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-heading font-bold text-lg mb-2">Application Not Found</h2>
            <p className="text-sm text-muted-foreground mb-6">This application doesn't exist or hasn't been accepted yet.</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const data = app.data || {};
  const offeredProgramme = data.programme1 || "BSc Computer Science";
  const offeredFaculty = data.faculty1 || "Faculty of Natural Sciences";
  const intakeYear = data.intakeYear || new Date().getFullYear().toString();
  const studentName = user?.fullName || "Student";
  const regNumber = `GZU/${intakeYear.slice(-2)}/${app.id.slice(0, 6).toUpperCase()}`;

  const programmeChoices = [
    { choice: 1, faculty: data.faculty1, programme: data.programme1 },
    { choice: 2, faculty: data.faculty2, programme: data.programme2 },
    { choice: 3, faculty: data.faculty3, programme: data.programme3 },
  ].filter((c) => c.programme);

  const nextSteps = [
    {
      icon: DollarSign,
      title: "Pay Tuition Fees",
      deadline: "Before Registration",
      description: "Pay your initial semester tuition fees via EcoCash, bank transfer, or at the university cashier. Minimum deposit of 50% is required before registration.",
      details: [
        "EcoCash Merchant Code: 45892 (GZU Fees)",
        "Bank: CBZ Bank | Acc: 01234567890 | Branch: Masvingo",
        "Reference: Your Registration Number",
        "Bring proof of payment to registration",
      ],
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: HeartPulse,
      title: "Medical Aid & Health Check",
      deadline: "2 weeks before registration",
      description: "All students must have valid medical aid cover and complete a medical examination before registration.",
      details: [
        "Approved providers: CIMAS, First Mutual, PSMAS",
        "Medical examination at GZU Health Centre or approved clinic",
        "Bring medical certificate and medical aid card",
        "Cost: ~$50/semester for student medical aid",
      ],
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      icon: Home,
      title: "Residence & Accommodation",
      deadline: "Apply early — limited spaces",
      description: "On-campus accommodation is available on a first-come, first-served basis. Apply early to secure a room.",
      details: [
        "Apply online via the Student Portal",
        "Residence fee: $150–$250/semester depending on room type",
        "Bring bedding, toiletries, and personal effects",
        "Off-campus accommodation available in Masvingo CBD",
      ],
      color: "text-accent-foreground",
      bgColor: "bg-accent/10",
    },
    {
      icon: ClipboardList,
      title: "Registration Day",
      deadline: `${intakeYear} Semester 1 Opening`,
      description: "Attend registration with all required documents. The process takes approximately 2–3 hours.",
      details: [
        "Original & certified copies of certificates",
        "National ID or passport",
        "Proof of fee payment",
        "2x passport-sized photographs",
        "Medical examination report",
      ],
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: BookOpen,
      title: "Prepare for Classes",
      deadline: "Week 1 of semester",
      description: "Get your student ID, course outline, and start attending lectures. Welcome week orientation is mandatory for all first-year students.",
      details: [
        "Collect student ID from Admin Block",
        "Attend faculty orientation",
        "Purchase required textbooks from GZU Bookshop",
        "Set up your student email and e-learning portal",
      ],
      color: "text-accent-foreground",
      bgColor: "bg-accent/10",
    },
  ];

  const generateAcceptanceLetter = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(0, 100, 80);
    doc.rect(0, 0, pageW, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("GREAT ZIMBABWE UNIVERSITY", pageW / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Office of the Registrar — Admissions Division", pageW / 2, 28, { align: "center" });
    doc.text("P.O. Box 1235, Masvingo, Zimbabwe", pageW / 2, 34, { align: "center" });

    // Gold accent line
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 40, pageW, 2, "F");

    // Body
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.text(`Date: ${format(new Date(), "dd MMMM yyyy")}`, 20, 56);
    doc.text(`Ref: ADM/${intakeYear}/${app.id.slice(0, 8).toUpperCase()}`, 20, 62);

    doc.setFontSize(11);
    doc.text(`Dear ${studentName},`, 20, 76);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 80);
    doc.text("OFFER OF ADMISSION", pageW / 2, 90, { align: "center" });

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const body = `We are pleased to inform you that you have been offered a place at Great Zimbabwe University for the ${intakeYear} academic year.`;
    doc.text(body, 20, 104, { maxWidth: pageW - 40 });

    // Details box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, 116, pageW - 40, 40, 3, 3, "F");
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(20, 116, pageW - 40, 40, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ADMISSION DETAILS", 28, 128);
    doc.setFont("helvetica", "normal");
    doc.text(`Programme: ${offeredProgramme}`, 28, 136);
    doc.text(`Faculty: ${offeredFaculty}`, 28, 144);
    doc.text(`Registration Number: ${regNumber}`, 28, 152);

    // Conditions
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Conditions of Offer:", 20, 172);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const conditions = [
      "1. Payment of prescribed tuition and other fees before registration.",
      "2. Presentation of original certificates and national identification.",
      "3. Completion of medical examination and valid medical aid coverage.",
      "4. Registration within the prescribed registration period.",
      "5. This offer is valid for the stated intake year only.",
    ];
    conditions.forEach((c, i) => {
      doc.text(c, 24, 182 + i * 8, { maxWidth: pageW - 48 });
    });

    // Closing
    doc.setFontSize(11);
    doc.text("We look forward to welcoming you to Great Zimbabwe University.", 20, 228);
    doc.text("Yours faithfully,", 20, 244);
    doc.setFont("helvetica", "bold");
    doc.text("Prof. R. Mupfumira", 20, 260);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("University Registrar", 20, 266);
    doc.text("Great Zimbabwe University", 20, 272);

    // Footer
    doc.setFillColor(0, 100, 80);
    doc.rect(0, 284, pageW, 13, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("This is a computer-generated document and is valid without a signature.", pageW / 2, 291, { align: "center" });

    doc.save(`GZU_Acceptance_Letter_${regNumber.replace(/\//g, "_")}.pdf`);
  };

  // Track which next-step sections have been viewed
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set());
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const allStepsViewed = viewedSteps.size === nextSteps.length;
  const readProgress = Math.round((viewedSteps.size / nextSteps.length) * 100);

  const handleStepIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = Number(entry.target.getAttribute("data-step-index"));
        if (!isNaN(idx)) {
          setViewedSteps((prev) => new Set([...prev, idx]));
        }
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleStepIntersection, {
      threshold: 0.5,
      rootMargin: "0px",
    });
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [handleStepIntersection]);

  useEffect(() => {
    if (!bottomRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasScrolledToBottom(true); },
      { threshold: 0.5 }
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-accent/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-primary/[0.02] blur-3xl" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm">Acceptance Details</span>
          </div>
        </div>
      </header>

      {/* Reading progress sticky bar */}
      {!allStepsViewed && (
        <div className="sticky top-14 z-40 bg-accent/10 border-b border-accent/20 backdrop-blur-sm">
          <div className="container px-4 sm:px-6 py-2.5 max-w-6xl">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <ScrollText className="w-3.5 h-3.5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-accent-foreground">
                    Please read all {nextSteps.length} steps below
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground">{viewedSteps.size}/{nextSteps.length} read</span>
                </div>
                <Progress value={readProgress} className="h-1.5 bg-accent/20 [&>div]:bg-accent" />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container px-4 sm:px-6 py-8 max-w-6xl relative z-10">
        {/* Congratulations Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 mb-8 p-8 sm:p-10 text-primary-foreground animate-fade-in shadow-xl shadow-primary/10">
          {/* Decorative shapes in banner */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <PartyPopper className="w-full h-full" />
          </div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-accent/20 blur-2xl" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-primary-foreground/5 blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5" />
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs">
                Accepted
              </Badge>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-2">
              Congratulations, {user?.firstName || "Student"}! 🎉
            </h1>
            <p className="text-primary-foreground/80 max-w-lg leading-relaxed">
              You have been offered admission to Great Zimbabwe University. Welcome to the GZU family!
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                onClick={generateAcceptanceLetter}
                variant="secondary"
                className="bg-primary-foreground/15 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/25 shadow-lg shadow-primary/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Acceptance Letter
              </Button>
            </div>
          </div>
        </div>

        {/* Reading reminder alert */}
        {!allStepsViewed && (
          <div className="mb-6 animate-fade-in rounded-xl border border-accent/30 bg-accent/5 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
              <Eye className="w-4 h-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-accent-foreground mb-0.5">Read all information carefully</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scroll through each of the next steps below to ensure you don't miss any important deadlines or requirements. 
                Your reading progress is tracked above.
              </p>
            </div>
          </div>
        )}

        {/* All read confirmation */}
        {allStepsViewed && (
          <div className="mb-6 animate-fade-in rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-0.5">You've reviewed all the steps!</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Great job! Make sure to follow each step before your registration date. Download your acceptance letter for your records.
              </p>
            </div>
          </div>
        )}

        {/* Offered Programme */}
        <div className="grid gap-6 mb-8 animate-fade-in">
          <Card className="border-2 border-primary/20 shadow-md bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-base">Offered Programme</h2>
                    <p className="text-xs text-muted-foreground">Your admitted programme of study</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Programme</p>
                      <p className="font-heading font-bold text-lg text-foreground">{offeredProgramme}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{offeredFaculty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Intake {intakeYear}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Masvingo Campus</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground">Registration Number: <span className="font-mono font-semibold text-foreground">{regNumber}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applied Programmes */}
          {programmeChoices.length > 0 && (
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-heading font-semibold text-sm">Your Programme Choices</h3>
                  <p className="text-xs text-muted-foreground">Programmes you applied for in order of preference</p>
                </div>
                <div className="divide-y">
                  {programmeChoices.map((choice, idx) => (
                    <div key={idx} className="px-6 py-3.5 flex items-center gap-4">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        choice.programme === offeredProgramme
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {choice.choice}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${choice.programme === offeredProgramme ? "text-primary" : ""}`}>
                          {choice.programme}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{choice.faculty}</p>
                      </div>
                      {choice.programme === offeredProgramme && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] shrink-0">
                          Offered
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Next Steps */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="font-heading font-bold text-lg">Next Steps</h2>
            <Badge variant="outline" className="text-[10px]">{nextSteps.length} steps</Badge>
            {!allStepsViewed && (
              <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent-foreground border-accent/20 ml-auto">
                <Eye className="w-3 h-3 mr-1" />
                {viewedSteps.size}/{nextSteps.length} read
              </Badge>
            )}
          </div>
          <div className="space-y-3">
            {nextSteps.map((step, idx) => {
              const isViewed = viewedSteps.has(idx);
              return (
                <div
                  key={idx}
                  ref={(el) => (stepRefs.current[idx] = el)}
                  data-step-index={idx}
                >
                  <Card className={`group hover:shadow-md transition-all duration-300 bg-card/80 backdrop-blur-sm ${
                    isViewed ? "border-primary/15" : "border-border"
                  }`}>
                    <CardContent className="p-0">
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-xl ${step.bgColor} flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300`}>
                              <step.icon className={`w-5 h-5 ${step.color}`} />
                            </div>
                            {isViewed && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                                <CheckCircle className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-muted-foreground/60 font-mono">0{idx + 1}</span>
                              <h3 className="font-heading font-semibold text-sm">{step.title}</h3>
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                <Clock className="w-3 h-3 mr-1" />
                                {step.deadline}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                            <div className="bg-muted/40 rounded-lg p-3 space-y-1.5">
                              {step.details.map((detail, dIdx) => (
                                <div key={dIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-primary/60" />
                                  <span>{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Notice */}
        <Card className="border-primary/20 bg-primary/5 animate-fade-in backdrop-blur-sm" ref={bottomRef}>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading font-semibold text-sm mb-1">Important Notice</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This offer is conditional upon presentation of original qualifying certificates. Failure to register within the prescribed period
                  will result in the offer being withdrawn. For enquiries, contact the Admissions Office at admissions@gzu.ac.zw or call +263 39 252 226.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AcceptedOffer;
