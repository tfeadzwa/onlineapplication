import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import FormWrapper from "./FormWrapper";

interface Job {
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  duties: string;
}

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const EmploymentHistoryForm = ({ data, onNext, onBack, isFirst, isLast }: Props) => {
  const [jobs, setJobs] = useState<Job[]>(
    data.jobs || [{ employer: "", position: "", startDate: "", endDate: "", duties: "" }]
  );

  const add = () => setJobs([...jobs, { employer: "", position: "", startDate: "", endDate: "", duties: "" }]);
  const remove = (i: number) => setJobs(jobs.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof Job, value: string) => {
    const updated = [...jobs];
    updated[i] = { ...updated[i], [key]: value };
    setJobs(updated);
  };

  return (
    <FormWrapper
      title="Employment History"
      description="List your work experience, starting with the most recent. Leave blank if not applicable."
      onSubmit={(e) => { e.preventDefault(); onNext({ jobs }); }}
      onBack={onBack}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-4">
        {jobs.map((j, i) => (
          <div key={i} className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Position {i + 1}</span>
              {jobs.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Employer</Label>
                <Input value={j.employer} onChange={(e) => update(i, "employer", e.target.value)} placeholder="Company name" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Position/Title</Label>
                <Input value={j.position} onChange={(e) => update(i, "position", e.target.value)} placeholder="e.g. Accountant" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start Date</Label>
                <Input type="month" value={j.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End Date</Label>
                <Input type="month" value={j.endDate} onChange={(e) => update(i, "endDate", e.target.value)} placeholder="Leave blank if current" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Key Duties</Label>
                <Textarea value={j.duties} onChange={(e) => update(i, "duties", e.target.value)} rows={2} placeholder="Brief description of responsibilities" />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={add} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Position
        </Button>
      </div>
    </FormWrapper>
  );
};

export default EmploymentHistoryForm;
