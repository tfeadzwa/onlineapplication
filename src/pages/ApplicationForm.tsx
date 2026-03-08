import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft, Check, User, Phone, BookOpen, GraduationCap as GradCap, Award, Briefcase, CreditCard, FileText, ClipboardList, School } from "lucide-react";
import StudentInfoForm from "@/components/forms/StudentInfoForm";
import ContactDetailsForm from "@/components/forms/ContactDetailsForm";
import ProgrammeChoiceForm from "@/components/forms/ProgrammeChoiceForm";
import OrdinaryLevelForm from "@/components/forms/OrdinaryLevelForm";
import AdvancedLevelForm from "@/components/forms/AdvancedLevelForm";
import PostSchoolForm from "@/components/forms/PostSchoolForm";
import EmploymentHistoryForm from "@/components/forms/EmploymentHistoryForm";
import MatureEntryForm from "@/components/forms/MatureEntryForm";
import PaymentForm from "@/components/forms/PaymentForm";
import ApplicationSummary from "@/components/forms/ApplicationSummary";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
  { id: "student-info", label: "Student Information", icon: User },
  { id: "contact", label: "Contact Details", icon: Phone },
  { id: "mature-entry", label: "Mature Entry", icon: School },
  { id: "programme", label: "Programme Choice", icon: BookOpen },
  { id: "o-level", label: "Ordinary Level", icon: ClipboardList },
  { id: "a-level", label: "Advanced Level", icon: GradCap },
  { id: "post-school", label: "Post-School", icon: Award },
  { id: "employment", label: "Employment History", icon: Briefcase },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "summary", label: "Summary", icon: FileText },
];

const ApplicationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, updateApplication, submitApplication } = useAuth();
  const app = applications.find((a) => a.id === id);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!app) navigate("/dashboard");
  }, [app, navigate]);

  if (!app) return null;

  const handleNext = (data: Record<string, any>) => {
    updateApplication(app.id, currentStep + 1, { [steps[currentStep].id]: data });
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (data: Record<string, any>) => {
    updateApplication(app.id, currentStep + 1, { [steps[currentStep].id]: data });
    submitApplication(app.id);
    toast.success("Application submitted successfully!");
    navigate("/dashboard");
  };

  const handleGoToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const goToStep = (i: number) => {
    if (i <= app.currentStep) {
      setCurrentStep(i);
      window.scrollTo(0, 0);
    }
  };

  const isLastFormStep = currentStep === steps.length - 1;
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const formProps = {
    data: currentStep === steps.length - 1 ? app.data : (app.data[steps[currentStep].id] || {}),
    onNext: isLastFormStep ? handleSubmit : handleNext,
    onBack: handleBack,
    isFirst: currentStep === 0,
    isLast: isLastFormStep,
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center h-14 px-4 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold text-sm sm:text-base">Application Form</span>
          </div>
          <div className="ml-auto text-xs text-muted-foreground font-medium">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Side Stepper - Desktop */}
        <aside className="hidden lg:flex w-72 border-r bg-card flex-col shrink-0 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
          <div className="p-4 border-b">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</p>
            <p className="text-2xl font-heading font-bold text-primary mt-1">{progress}%</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isCompleted = i < currentStep || (i < app.currentStep && i !== currentStep);
              const isAccessible = i <= app.currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(i)}
                  disabled={!isAccessible}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left group",
                    isActive && "bg-primary text-primary-foreground shadow-md",
                    !isActive && isCompleted && "text-primary hover:bg-primary/10 cursor-pointer",
                    !isActive && !isCompleted && isAccessible && "text-foreground hover:bg-muted cursor-pointer",
                    !isAccessible && "text-muted-foreground/50 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all",
                    isActive && "bg-primary-foreground/20 text-primary-foreground",
                    !isActive && isCompleted && "bg-primary/15 text-primary",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium block truncate">{step.label}</span>
                    {isCompleted && !isActive && (
                      <span className="text-xs opacity-70">Completed</span>
                    )}
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Top Stepper */}
          <div className="lg:hidden overflow-x-auto border-b bg-card/50">
            <div className="flex items-center p-3 gap-1 min-w-max">
              {steps.map((step, i) => {
                const isActive = i === currentStep;
                const isCompleted = i < currentStep || (i < app.currentStep && i !== currentStep);
                const isAccessible = i <= app.currentStep;

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => goToStep(i)}
                      disabled={!isAccessible}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                        isActive && "bg-primary text-primary-foreground",
                        !isActive && isCompleted && "bg-primary/10 text-primary",
                        !isActive && !isCompleted && isAccessible && "bg-muted text-muted-foreground",
                        !isAccessible && "text-muted-foreground/40"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                        isActive && "bg-primary-foreground/20",
                        isCompleted && !isActive && "bg-primary text-primary-foreground",
                        !isActive && !isCompleted && "bg-muted-foreground/20"
                      )}>
                        {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
                      </span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                    {i < steps.length - 1 && <div className="w-3 h-px bg-border mx-0.5" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
            {currentStep === 0 && <StudentInfoForm {...formProps} />}
            {currentStep === 1 && <ContactDetailsForm {...formProps} />}
            {currentStep === 2 && <MatureEntryForm {...formProps} />}
            {currentStep === 3 && <ProgrammeChoiceForm {...formProps} />}
            {currentStep === 4 && <OrdinaryLevelForm {...formProps} />}
            {currentStep === 5 && <AdvancedLevelForm {...formProps} />}
            {currentStep === 6 && <PostSchoolForm {...formProps} />}
            {currentStep === 7 && <EmploymentHistoryForm {...formProps} />}
            {currentStep === 8 && <PaymentForm {...formProps} />}
            {currentStep === 9 && <ApplicationSummary {...formProps} onGoToStep={handleGoToStep} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationForm;
