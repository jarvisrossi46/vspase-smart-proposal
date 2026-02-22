import React, { useState } from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Step 4: Review & Generate PDF
 * Final review of all data and PDF generation
 */
export const ReviewGenerateStep: React.FC = () => {
  const { currentProposal, previousStep, goToStep } = useProposalStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!currentProposal) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  const clientDetails = currentProposal.clientDetails;
  const techSpecs = currentProposal.technicalSpecs;
  const commercials = currentProposal.commercials;

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(API_ENDPOINTS.generatePDF, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProposal),
      });

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `VS_PASE_Proposal_${currentProposal.metadata?.proposalNumber || 'New'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const grandTotal =
    commercials?.pricingItems?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Proposal</h2>
        <p className="text-gray-600 mt-2">
          Review all details before generating the final PDF
        </p>
      </div>

      {/* Client Details Summary */}
      <Card
        title="Client Details"
        headerAction={
          <button
            onClick={() => goToStep(1)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Client:</span>
            <p className="font-medium">{clientDetails?.clientName || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Project:</span>
            <p className="font-medium">{clientDetails?.projectName || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Location:</span>
            <p className="font-medium">
              {clientDetails?.clientAddress?.city},{' '}
              {clientDetails?.clientAddress?.country}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Contacts:</span>
            <p className="font-medium">{clientDetails?.contacts?.length || 0} added</p>
          </div>
        </div>
      </Card>

      {/* Technical Specifications Summary */}
      <Card
        title="Technical Specifications"
        headerAction={
          <button
            onClick={() => goToStep(2)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        }
      >
        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-gray-500">Equipment:</span>
            <p className="font-medium">
              {techSpecs?.equipment?.length || 0} items added
            </p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Main Equipment:</span>
            <ul className="mt-1 space-y-1">
              {techSpecs?.equipment?.map((eq, idx) => (
                <li key={idx} className="font-medium">
                  • {eq.type} - {eq.model} ({eq.capacity})
                </li>
              )) || 'N/A'}
            </ul>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Scope Items:</span>
            <p className="font-medium">{techSpecs?.scopeOfSupply?.length || 0} items</p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Warranty:</span>
            <p className="font-medium">{techSpecs?.warrantyPeriod || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Commercials Summary */}
      <Card
        title="Commercial Details"
        headerAction={
          <button
            onClick={() => goToStep(3)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Currency:</span>
            <p className="font-medium">{commercials?.currency || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Line Items:</span>
            <p className="font-medium">{commercials?.pricingItems?.length || 0}</p>
          </div>
          <div>
            <span className="text-gray-500">GST Rate:</span>
            <p className="font-medium">{commercials?.taxes?.gstRate || 0}%</p>
          </div>
          <div>
            <span className="text-gray-500">Delivery:</span>
            <p className="font-medium">{commercials?.terms?.deliveryWeeks || 0} weeks</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Grand Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              {commercials?.currency} {grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-red-800 font-medium">PDF Generation Failed</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <p className="text-red-600 text-xs mt-2">
                Check your connection or try again. Your data is safely saved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-green-800 font-medium">PDF Generated Successfully!</h4>
              <p className="text-green-700 text-sm">Your proposal has been downloaded.</p>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ready to Generate?</h3>
          <p className="text-gray-600 text-sm mt-1">
            This will create a professional PDF proposal
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="w-full py-4 text-lg"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating PDF...
            </span>
          ) : (
            '📄 Generate PDF Proposal'
          )}
        </Button>

        <p className="text-center text-xs text-gray-500 mt-3">
          Your data is auto-saved. You can close and return anytime.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-start pt-4">
        <Button variant="secondary" size="lg" onClick={previousStep}>
          ← Back to Commercials
        </Button>
      </div>
    </div>
  );
};