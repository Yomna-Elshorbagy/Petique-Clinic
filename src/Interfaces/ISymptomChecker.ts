export interface ISymptomCheck {
  _id: string;
  user: string;
  pet: {
    _id: string;
    name: string;
    category?: {
      _id: string;
      name: string;
    };
    age?: string;
    image?: {
      secure_url: string;
      public_id: string;
    };
  };
  symptoms: {
    appetite: "normal" | "decreased" | "none" | "increased";
    energy: "normal" | "low" | "very_low" | "high";
    vomiting: boolean;
    age: string;
    additionalNotes?: string;
  };
  aiAnalysis: {
    recommendation: "emergency" | "appointment" | "home_care";
    urgency: "low" | "medium" | "high" | "critical";
    explanation: string;
    suggestedActions: string[];
  };
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISymptomCheckStats {
  totalChecks: number;
  emergency: number;
  appointment: number;
  homeCare: number;
}

export interface ISymptomCheckFormData {
  petId: string;
  appetite: "normal" | "decreased" | "none" | "increased";
  energy: "normal" | "low" | "very_low" | "high";
  vomiting: boolean;
  age: string;
  additionalNotes?: string;
}
