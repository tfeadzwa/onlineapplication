import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft, Check } from "lucide-react";
import StudentInfoForm from "@/components/forms/StudentInfoForm";
import ContactDetailsForm from "@/components/forms/ContactDetailsForm";
import ProgrammeChoiceForm from "@/components/forms/ProgrammeChoiceForm";
import OrdinaryLevelForm from "@/components/forms/OrdinaryLevelForm";
import AdvancedLevelForm from "@/components/forms/AdvancedLevelForm";
import PostSchoolForm from "@/components/forms/PostSchoolForm";
import EmploymentHistoryForm from "@/components/forms/EmploymentHistoryForm";
import MatureEntryForm from "@/components/forms/MatureEntryForm";
import { toast } from "sonner";

const steps = [
  { id: "student-info", label: "Student Information" },
  { id: "contact", label: "Contact Details" },
  { id: "mature-entry", label: "Mature Entry" },
  { id: "programme", label: "Programme Choice" },
  { id: "o-level", label: "Ordinary Level" },
  { id: "a-level", label: "Advanced Level" },
  { id: "post-school", label: "Post-School" },
  { id: "employment", label: "Employment History" },
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

  const formProps = {
    data: app.data[steps[currentStep].id] || {},
    onNext: currentStep === steps.length - 1 ? handleSubmit : handleNext,
    onBack: handleBack,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center h-16 px-4 sm:px-6 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold text-sm sm:text-base">Application Form</span>
          </div>
        </div>
      </header>

      <div className="container px-4 sm:px-6 py-8 max-w-4xl">
        {/* Stepper */}
        <div className="mb-8 overflow-x-auto animate-fade-in">
          <div className="flex items-center min-w-max gap-1">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => i <= (app.currentStep) && setCurrentStep(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    i === currentStep
                      ? "bg-primary text-primary-foreground"
                      : i < currentStep || i <= app.currentStep
                      ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                  disabled={i > app.currentStep}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < currentStep || (i <= app.currentStep && i !== currentStep)
                      ? "bg-primary text-primary-foreground"
                      : i === currentStep
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted-foreground/20"
                  }`}>
                    {i < currentStep || (i < app.currentStep) ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="hidden md:inline">{step.label}</span>
                </button>
                {i < steps.length - 1 && <div className="w-4 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form content */}
        <div className="animate-fade-in">
          {currentStep === 0 && <StudentInfoForm {...formProps} />}
          {currentStep === 1 && <ContactDetailsForm {...formProps} />}
          {currentStep === 2 && <MatureEntryForm {...formProps} />}
          {currentStep === 3 && <ProgrammeChoiceForm {...formProps} />}
          {currentStep === 4 && <OrdinaryLevelForm {...formProps} />}
          {currentStep === 5 && <AdvancedLevelForm {...formProps} />}
          {currentStep === 6 && <PostSchoolForm {...formProps} />}
          {currentStep === 7 && <EmploymentHistoryForm {...formProps} />}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
