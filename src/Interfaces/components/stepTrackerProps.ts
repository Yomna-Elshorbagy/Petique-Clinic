export type StepStatus = "complete" | "current" | "upcoming";

export interface StepItem {
  id: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: StepStatus;
}

export interface StepTrackerProps {
  steps: StepItem[];
}