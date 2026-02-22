import React from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

/**
 * Step 1: Client Details Form
 * Mobile-first form for capturing client information
 * Auto-saves to Zustand store (IndexedDB) on every change
 */
export const ClientDetailsStep: React.FC = () => {
  const {
    currentProposal,
    updateClientDetails,
    addContact,
    removeContact,
    markStepComplete,
    nextStep,
  } = useProposalStore();

  const clientDetails = currentProposal?.clientDetails;

  if (!clientDetails) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  const handleInputChange = (field: string, value: string) => {
    updateClientDetails({ [field]: value });
  };

  const handleAddressChange = (field: string, value: string) => {
    updateClientDetails({
      clientAddress: {
        ...clientDetails.clientAddress,
        [field]: value,
      },
    });
  };

  const handleAddContact = () => {
    addContact({
      name: '',
      designation: '',
      email: '',
      phone: '',
      isPrimary: clientDetails.contacts.length === 0,
    });
  };

  const handleUpdateContact = (index: number, field: string, value: string | boolean) => {
    const updatedContacts = [...clientDetails.contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    updateClientDetails({ contacts: updatedContacts });
  };

  const handleContinue = () => {
    // Basic validation
    if (!clientDetails.clientName.trim()) {
      alert('Please enter client name');
      return;
    }
    markStepComplete(1);
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card title="Client Information" subtitle="Enter the client's company details">
        <div className="space-y-4">
          <Input
            label="Client Name *"
            value={clientDetails.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="e.g., The Seksaria Biswan Sugar Factory Ltd."
            required
          />

          <Input
            label="Project Name"
            value={clientDetails.projectName || ''}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
            placeholder="e.g., Expansion of Sugar Drying Facility"
          />

          <Input
            label="Enquiry Reference"
            value={clientDetails.enquiryReference || ''}
            onChange={(e) => handleInputChange('enquiryReference', e.target.value)}
            placeholder="e.g., ENQ/2024/001"
          />
        </div>
      </Card>

      {/* Address */}
      <Card title="Address" subtitle="Client's billing/shipping address">
        <div className="space-y-4">
          <Input
            label="Address Line 1"
            value={clientDetails.clientAddress?.line1 || ''}
            onChange={(e) => handleAddressChange('line1', e.target.value)}
            placeholder="Street address"
          />

          <Input
            label="Address Line 2"
            value={clientDetails.clientAddress?.line2 || ''}
            onChange={(e) => handleAddressChange('line2', e.target.value)}
            placeholder="Apartment, suite, etc."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={clientDetails.clientAddress?.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="City"
            />

            <Input
              label="State"
              value={clientDetails.clientAddress?.state || ''}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="State"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pincode"
              value={clientDetails.clientAddress?.pincode || ''}
              onChange={(e) => handleAddressChange('pincode', e.target.value)}
              placeholder="e.g., 261201"
            />

            <Input
              label="Country"
              value={clientDetails.clientAddress?.country || ''}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="e.g., India"
            />
          </div>
        </div>
      </Card>

      {/* Contacts */}
      <Card
        title="Contact Persons"
        subtitle="Add key contacts at the client organization"
        headerAction={
          <Button variant="secondary" size="sm" onClick={handleAddContact}>
            + Add Contact
          </Button>
        }
      >
        <div className="space-y-4">
          {clientDetails.contacts.length === 0 ? (
            <p className="text-gray-500 text-sm">No contacts added yet.</p>
          ) : (
            clientDetails.contacts.map((contact, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">Contact {index + 1}</h4>
                  <button
                    onClick={() => removeContact(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Name"
                    value={contact.name}
                    onChange={(e) => handleUpdateContact(index, 'name', e.target.value)}
                    placeholder="Contact person's name"
                  />

                  <Input
                    label="Designation"
                    value={contact.designation}
                    onChange={(e) => handleUpdateContact(index, 'designation', e.target.value)}
                    placeholder="e.g., Chief Engineer"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleUpdateContact(index, 'email', e.target.value)}
                      placeholder="email@company.com"
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => handleUpdateContact(index, 'phone', e.target.value)}
                      placeholder="+91-9876543210"
                    />
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={contact.isPrimary}
                      onChange={(e) => handleUpdateContact(index, 'isPrimary', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Primary Contact</span>
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button variant="primary" size="lg" onClick={handleContinue}>
          Continue to Technical Specs →
        </Button>
      </div>
    </div>
  );
};