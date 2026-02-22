import React from 'react';
import { useProposalStore, ProposalStep } from '../../store/proposalStore';

/**
 * Stepper Component
 * Shows progress through 4-step wizard
 * Mobile-optimized with horizontal scroll if needed
 */
export const Stepper: React.FC = () => {
  const { currentStep, completedSteps, goToStep } = useProposalStore();

  const steps = [
    { id: ProposalStep.CLIENT_DETAILS, label: 'Client', number: 1 },
    { id: ProposalStep.TECHNICAL_SPECS, label: 'Technical', number: 2 },
    { id: ProposalStep.COMMERCIALS, label: 'Commercials', number: 3 },
    { id: ProposalStep.REVIEW, label: 'Review', number: 4 },
  ];

  const isStepAccessible = (stepId: ProposalStep): boolean => {
    // Can navigate to completed steps or current step
    return completedSteps.includes(stepId) || stepId === currentStep;
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = completedSteps.includes(step.id);
            const isAccessible = isStepAccessible(step.id);

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <button
                  onClick={() => isAccessible && goToStep(step.id)}
                  disabled={!isAccessible}
                  className={`flex flex-col items-center transition-all duration-200 ${
                    isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors duration-200 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ minWidth: '40px' }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};