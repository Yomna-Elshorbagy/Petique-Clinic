import { useState } from "react";
import {
  FaExclamationTriangle,
  FaCalendarCheck,
  FaHome,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useUserPets } from "../../Hooks/UserProfile/useUserPets";
import {
  useUserSymptomChecks,
  useCreateSymptomCheck,
  useSymptomCheckStats,
  useMarkSymptomCheckResolved,
} from "../../Hooks/UserProfile/useSymptomChecker";
import type {
  ISymptomCheckFormData,
  ISymptomCheck,
} from "../../Interfaces/ISymptomChecker";
import SEO from "../SEO/SEO";
import SharedPagination from "./components/SharedPagination";
import Swal from "sweetalert2";

export default function SymptomChecker() {
  const { data: pets = [], isLoading: petsLoading } = useUserPets();
  const { data: statsData } = useSymptomCheckStats();
  const [currentPage, setCurrentPage] = useState(1);
  const [showHistory, setShowHistory] = useState(false);

  const { data: checksData, isLoading: checksLoading } = useUserSymptomChecks({
    limit: 10,
    page: currentPage,
  });

  const createMutation = useCreateSymptomCheck();
  const resolveMutation = useMarkSymptomCheckResolved();

  const [formData, setFormData] = useState<ISymptomCheckFormData>({
    petId: "",
    appetite: "normal",
    energy: "normal",
    vomiting: false,
    age: "",
    additionalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.petId || !formData.age) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a pet and enter the pet's age",
      });
      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Symptom Check Completed",
          text: "AI analysis has been generated successfully",
        });
        setFormData({
          petId: "",
          appetite: "normal",
          energy: "normal",
          vomiting: false,
          age: "",
          additionalNotes: "",
        });
        setShowHistory(true);
      },
      onError: (error: any) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.response?.data?.message || "Failed to create symptom check",
        });
      },
    });
  };

  const handleResolve = (id: string) => {
    Swal.fire({
      title: "Mark as Resolved?",
      text: "This will mark this symptom check as resolved",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark as resolved",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        resolveMutation.mutate(id);
      }
    });
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "emergency":
        return <FaExclamationTriangle className="text-red-500" />;
      case "appointment":
        return <FaCalendarCheck className="text-yellow-500" />;
      case "home_care":
        return <FaHome className="text-green-500" />;
      default:
        return null;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "emergency":
        return "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700";
      case "appointment":
        return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700";
      case "home_care":
        return "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-600 dark:text-red-400";
      case "high":
        return "text-orange-600 dark:text-orange-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (petsLoading) return <LoaderPage />;

  const symptomChecks = checksData?.data || [];
  const totalPages = checksData?.meta?.totalPages || 1;

  return (
    <>
      <SEO
        title="AI Symptom Checker | Pet Clinic"
        description="Check your pet's symptoms with AI-powered analysis"
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
            AI Symptom Checker
          </h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-[#F2A056] text-white rounded-lg hover:bg-[#e9a66f] transition"
          >
            {showHistory ? "New Check" : "View History"}
          </button>
        </div>

        {/* Stats Cards */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] p-4 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Checks
              </p>
              <p className="text-2xl font-bold text-[#F2A056]">
                {statsData.totalChecks || 0}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                Emergency
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {statsData.emergency || 0}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Appointment
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {statsData.appointment || 0}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400">
                Home Care
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statsData.homeCare || 0}
              </p>
            </div>
          </div>
        )}

        {!showHistory ? (
          /* Symptom Check Form */
          <div className="bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-2xl p-6 shadow-md">
            <h4 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              Pet Symptom Assessment
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pet Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  Select Pet *
                </label>
                <select
                  name="petId"
                  value={formData.petId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-lg bg-white dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                >
                  <option value="">Choose a pet</option>
                  {pets.map((pet: any) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} ({pet.category?.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  Pet Age *
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 2 years, 6 months"
                  required
                  className="w-full px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-lg bg-white dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                />
              </div>

              {/* Appetite */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  Appetite *
                </label>
                <select
                  name="appetite"
                  value={formData.appetite}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-lg bg-white dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                >
                  <option value="normal">Normal</option>
                  <option value="decreased">Decreased</option>
                  <option value="none">None</option>
                  <option value="increased">Increased</option>
                </select>
              </div>

              {/* Energy */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  Energy Level *
                </label>
                <select
                  name="energy"
                  value={formData.energy}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-lg bg-white dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                >
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                  <option value="very_low">Very Low</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Vomiting */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="vomiting"
                  id="vomiting"
                  checked={formData.vomiting}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#F2A056] border-gray-300 rounded focus:ring-[#F2A056]"
                />
                <label
                  htmlFor="vomiting"
                  className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                >
                  Is your pet vomiting?
                </label>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any other symptoms or concerns..."
                  className="w-full px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-lg bg-white dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                />
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full py-3 bg-[#F2A056] text-white rounded-lg hover:bg-[#e9a66f] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createMutation.isPending ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Symptoms"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* History */
          <div className="space-y-4">
            {checksLoading ? (
              <LoaderPage />
            ) : symptomChecks.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <p>No symptom checks found. Create your first check!</p>
              </div>
            ) : (
              symptomChecks.map((check: ISymptomCheck) => (
                <div
                  key={check._id}
                  className={`bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] border-2 rounded-2xl p-6 shadow-md ${getRecommendationColor(
                    check.aiAnalysis.recommendation
                  )}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {getRecommendationIcon(check.aiAnalysis.recommendation)}
                      <div>
                        <h5 className="font-semibold text-lg capitalize">
                          {check.pet.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(check.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {check.isResolved && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <FaCheckCircle />
                        Resolved
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Recommendation:</span>
                      <span className="capitalize font-semibold">
                        {check.aiAnalysis.recommendation.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Urgency:</span>
                      <span
                        className={`capitalize font-semibold ${getUrgencyColor(
                          check.aiAnalysis.urgency
                        )}`}
                      >
                        {check.aiAnalysis.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-white dark:bg-[var(--color-dark-background)] rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {check.aiAnalysis.explanation}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h6 className="font-medium mb-2">Suggested Actions:</h6>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {check.aiAnalysis.suggestedActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {!check.isResolved && (
                      <button
                        onClick={() => handleResolve(check._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {symptomChecks.length > 0 && (
              <SharedPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxVisiblePages={5}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
