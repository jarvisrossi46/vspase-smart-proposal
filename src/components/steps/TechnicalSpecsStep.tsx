import React from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';

const EQUIPMENT_TYPES = [
  { value: '', label: 'Select Equipment Type' },
  { value: 'Fluidized Bed Dryer', label: 'Fluidized Bed Dryer' },
  { value: 'Rotary Dryer', label: 'Rotary Dryer' },
  { value: 'Rotary Cooler', label: 'Rotary Cooler' },
  { value: 'Vibrating Fluidized Bed Dryer', label: 'Vibrating Fluidized Bed Dryer' },
  { value: 'Static Fluidized Bed Dryer', label: 'Static Fluidized Bed Dryer' },
  { value: 'Custom Drying System', label: 'Custom Drying System' },
];

const MOC_OPTIONS = [
  { value: '', label: 'Select Material' },
  { value: 'SS304', label: 'SS304' },
  { value: 'SS316', label: 'SS316' },
  { value: 'SS316L', label: 'SS316L' },
  { value: 'Carbon Steel', label: 'Carbon Steel' },
  { value: 'Duplex Steel', label: 'Duplex Steel' },
  { value: 'SS304 with SS cladding', label: 'SS304 with SS cladding' },
];

/**
 * Step 2: Technical Specifications Form
 * Equipment details, scope of supply, technical parameters
 */
export const TechnicalSpecsStep: React.FC = () => {
  const {
    currentProposal,
    updateTechnicalSpecs,
    addEquipment,
    updateEquipment,
    removeEquipment,
    markStepComplete,
    nextStep,
    previousStep,
  } = useProposalStore();

  const techSpecs = currentProposal?.technicalSpecs;

  if (!techSpecs) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  const handleAddEquipment = () => {
    addEquipment({
      type: '',
      model: '',
      capacity: '',
      moc: '',
      motorHP: { totalHP: '' },
      quantity: 1,
      description: '',
    });
  };

  const handleUpdateEquipmentField = (index: number, field: string, value: any) => {
    const equipment = techSpecs.equipment[index];
    updateEquipment(index, { ...equipment, [field]: value });
  };

  const handleAddScopeItem = () => {
    const currentScope = techSpecs.scopeOfSupply || [];
    updateTechnicalSpecs({
      scopeOfSupply: [
        ...currentScope,
        { lineItemNo: currentScope.length + 1, item: '', description: '', quantity: 1, unit: 'Nos' },
      ],
    });
  };

  const handleUpdateScopeItem = (index: number, field: string, value: any) => {
    const currentScope = [...(techSpecs.scopeOfSupply || [])];
    currentScope[index] = { ...currentScope[index], [field]: value };
    updateTechnicalSpecs({ scopeOfSupply: currentScope });
  };

  const handleRemoveScopeItem = (index: number) => {
    const currentScope = [...(techSpecs.scopeOfSupply || [])];
    currentScope.splice(index, 1);
    // Renumber items
    currentScope.forEach((item, idx) => (item.lineItemNo = idx + 1));
    updateTechnicalSpecs({ scopeOfSupply: currentScope });
  };

  const handleContinue = () => {
    if (techSpecs.equipment.length === 0) {
      alert('Please add at least one equipment item');
      return;
    }
    markStepComplete(2);
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Equipment Details */}
      <Card
        title="Equipment Details"
        subtitle="Add main equipment for this proposal"
        headerAction={
          <Button variant="secondary" size="sm" onClick={handleAddEquipment}>
            + Add Equipment
          </Button>
        }
      >
        <div className="space-y-4">
          {techSpecs.equipment.length === 0 ? (
            <p className="text-gray-500 text-sm">No equipment added yet.</p>
          ) : (
            techSpecs.equipment.map((eq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">Equipment {index + 1}</h4>
                  <button
                    onClick={() => removeEquipment(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select
                    label="Equipment Type *"
                    value={eq.type}
                    onChange={(e) => handleUpdateEquipmentField(index, 'type', e.target.value)}
                    options={EQUIPMENT_TYPES}
                    required
                  />

                  <Input
                    label="Model Number"
                    value={eq.model || ''}
                    onChange={(e) => handleUpdateEquipmentField(index, 'model', e.target.value)}
                    placeholder="e.g., SD 6065"
                  />

                  <Input
                    label="Capacity"
                    value={eq.capacity || ''}
                    onChange={(e) => handleUpdateEquipmentField(index, 'capacity', e.target.value)}
                    placeholder="e.g., 60 MT/H"
                  />

                  <Select
                    label="Material of Construction (MOC)"
                    value={eq.moc}
                    onChange={(e) => handleUpdateEquipmentField(index, 'moc', e.target.value)}
                    options={MOC_OPTIONS}
                  />

                  <Input
                    label="Motor HP"
                    value={eq.motorHP?.totalHP || ''}
                    onChange={(e) =>
                      handleUpdateEquipmentField(index, 'motorHP', { totalHP: e.target.value })
                    }
                    placeholder="e.g., 125 HP"
                  />

                  <Input
                    label="Quantity"
                    type="number"
                    value={eq.quantity}
                    onChange={(e) =>
                      handleUpdateEquipmentField(index, 'quantity', parseInt(e.target.value) || 1)
                    }
                    min={1}
                  />
                </div>

                <TextArea
                  label="Description"
                  value={eq.description || ''}
                  onChange={(e) => handleUpdateEquipmentField(index, 'description', e.target.value)}
                  placeholder="Detailed description of the equipment"
                  rows={2}
                  className="mt-3"
                />
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Scope of Supply */}
      <Card
        title="Scope of Supply"
        subtitle="Detailed list of items included"
        headerAction={
          <Button variant="secondary" size="sm" onClick={handleAddScopeItem}>
            + Add Item
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Item</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Description</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700">Qty</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Unit</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {(techSpecs.scopeOfSupply || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                    No items added yet.
                  </td>
                </tr>
              ) : (
                techSpecs.scopeOfSupply.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-3 py-2 text-gray-600">{item.lineItemNo}</td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handleUpdateScopeItem(index, 'item', e.target.value)}
                        placeholder="Item name"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateScopeItem(index, 'description', e.target.value)
                        }
                        placeholder="Description"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateScopeItem(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                        min={1}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleUpdateScopeItem(index, 'unit', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleRemoveScopeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Warranty */}
      <Card title="Warranty & Standards">
        <div className="space-y-4">
          <TextArea
            label="Warranty Period"
            value={techSpecs.warrantyPeriod || ''}
            onChange={(e) => updateTechnicalSpecs({ warrantyPeriod: e.target.value })}
            placeholder="e.g., 12 months from commissioning or 18 months from dispatch, whichever is earlier"
            rows={2}
          />

          <Input
            label="Applicable Standards"
            value={techSpecs.standards?.join(', ') || ''}
            onChange={(e) =>
              updateTechnicalSpecs({ standards: e.target.value.split(',').map((s) => s.trim()) })
            }
            placeholder="e.g., ISO, ASME, API (comma separated)"
          />
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" size="lg" onClick={previousStep}>
          ← Back
        </Button>
        <Button variant="primary" size="lg" onClick={handleContinue}>
          Continue to Commercials →
        </Button>
      </div>
    </div>
  );
};