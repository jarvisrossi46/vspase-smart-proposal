import React, { useEffect } from 'react';
import { useProposalStore, ProposalStep } from './store/proposalStore';
import { Stepper } from './components/Stepper';
import { ClientDetailsStep } from './components/steps/ClientDetailsStep';
import { TechnicalSpecsStep } from './components/steps/TechnicalSpecsStep';
import { CommercialsStep } from './components/steps/CommercialsStep';
import { ReviewGenerateStep } from './components/steps/ReviewGenerateStep';

/**
 * VS PASE Smart Proposal Management System
 * Main App Component - Mobile-First PWA
 */
function App() {
  const { currentStep, createNewProposal, currentProposal } = useProposalStore();

  // Initialize with a new proposal on first load
  useEffect(() => {
    if (!currentProposal) {
      createNewProposal();
    }
  }, [currentProposal, createNewProposal]);

  const renderStep = () => {
    switch (currentStep) {
      case ProposalStep.CLIENT_DETAILS:
        return <ClientDetailsStep />;
      case ProposalStep.TECHNICAL_SPECS:
        return <TechnicalSpecsStep />;
      case ProposalStep.COMMERCIALS:
        return <CommercialsStep />;
      case ProposalStep.REVIEW:
        return <ReviewGenerateStep />;
      default:
        return <ClientDetailsStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-blue-900">VS PASE</h1>
              <p className="text-xs text-gray-500">Smart Proposal System</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Offline Ready</p>
              <div className="flex items-center justify-end mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-green-600 font-medium">Auto-Saving</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper Navigation */}
      <Stepper />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {renderStep()}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-xs text-gray-500">
          <span>© 2024 VS Projects & System Engineers</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;