import React from "react"
import type { StepTrackerProps } from "../../Interfaces/components/stepTrackerProps"


export const StepTracker:React.FC<StepTrackerProps> = ({ steps }) => {
  return (
    <>
    <div className="mb-12">
          <div className="flex items-center justify-center">
            {steps.map((step, stepIdx) => (
              <React.Fragment key={step.id}>
                <div className="relative flex flex-col items-center group">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10
                    ${
                      step.status === "current"
                        ? "bg-(--color-light-accent) text-white shadow-lg scale-110"
                        : step.status === "complete"
                        ? "bg-(--color-light-primary) text-(--color-light-dark)"
                        : "bg-white dark:bg-(--color-dark-card) border-2 border-gray-200 dark:border-gray-700 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`mt-3 text-sm font-medium transition-colors duration-300 text-center
                    ${
                      step.status === "current"
                        ? "text-(--color-light-accent)"
                        : "text-(--color-light-textSecondary) dark:text-(--color-dark-textSecondary)"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className="w-24 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4 -mt-6"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
    </>
  )
}
