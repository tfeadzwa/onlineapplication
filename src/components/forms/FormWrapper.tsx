import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface FormWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const FormWrapper = ({ title, description, children, onSubmit, onBack, isFirst, isLast }: FormWrapperProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold">{title}</h2>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
      <div className="flex items-center justify-between pt-4 border-t">
        {!isFirst ? (
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
        ) : <div />}
        <Button type="submit" size="lg">
          {isLast ? (
            <><Send className="w-4 h-4 mr-2" /> Submit Application</>
          ) : (
            <>Save & Continue <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormWrapper;
