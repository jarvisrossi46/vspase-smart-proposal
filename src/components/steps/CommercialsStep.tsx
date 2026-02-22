import React, { useEffect } from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
];

/**
 * Step 3: Commercials Form
 * Pricing, taxes, payment terms
 */
export const CommercialsStep: React.FC = () => {
  const {
    currentProposal,
    updateCommercials,
    updateTerms,
    calculateTotals,
    markStepComplete,
    nextStep,
    previousStep,
  } = useProposalStore();

  const commercials = currentProposal?.commercials;
  const terms = commercials?.terms;

  useEffect(() => {
    calculateTotals();
  }, [commercials?.pricingItems, commercials?.currency]);

  if (!commercials) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  const handleAddPricingItem = () => {
    const currentItems = commercials.pricingItems || [];
    updateCommercials({
      pricingItems: [
        ...currentItems,
        {
          lineItemNo: currentItems.length + 1,
          description: '',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
    });
  };

  const handleUpdatePricingItem = (index: number, field: string, value: any) => {
    const items = [...(commercials.pricingItems || [])];
    items[index] = { ...items[index], [field]: value };

    // Auto-calculate total
    if (field === 'quantity' || field === 'unitPrice') {
      items[index].totalPrice = items[index].quantity * items[index].unitPrice;
    }

    updateCommercials({ pricingItems: items });
  };

  const handleRemovePricingItem = (index: number) => {
    const items = [...(commercials.pricingItems || [])];
    items.splice(index, 1);
    // Renumber
    items.forEach((item, idx) => (item.lineItemNo = idx + 1));
    updateCommercials({ pricingItems: items });
  };

  const calculateGrandTotal = () => {
    const subTotal = commercials.pricingItems?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;
    const gstAmount = subTotal * ((commercials.taxes?.gstRate || 0) / 100);
    const freight = commercials.freight?.amount || 0;
    const insurance = commercials.insurance?.amount || 0;
    return subTotal + gstAmount + freight + insurance;
  };

  const handleContinue = () => {
    if (!commercials.pricingItems || commercials.pricingItems.length === 0) {
      alert('Please add at least one pricing item');
      return;
    }
    markStepComplete(3);
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Currency & Pricing */}
      <Card title="Pricing Details" subtitle="Item-wise cost breakdown">
        <div className="mb-4">
          <Select
            label="Currency"
            value={commercials.currency}
            onChange={(e) => updateCommercials({ currency: e.target.value })}
            options={CURRENCY_OPTIONS}
          />
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Description</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700">Qty</th>
                <th className="px-3 py-2 text-right font-medium text-gray-700">Unit Price</th>
                <th className="px-3 py-2 text-right font-medium text-gray-700">Total</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {(commercials.pricingItems || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                    No items added. Click "Add Item" below.
                  </td>
                </tr>
              ) : (
                commercials.pricingItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-3 py-2 text-gray-600">{item.lineItemNo}</td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleUpdatePricingItem(index, 'description', e.target.value)
                        }
                        placeholder="Item description"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdatePricingItem(
                            index,
                            'quantity',
                            parseInt(e.target.value) || 1
                          )
                        }
                        min={1}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleUpdatePricingItem(
                            index,
                            'unitPrice',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min={0}
                        className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {commercials.currency} {item.totalPrice?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleRemovePricingItem(index)}
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

        <Button variant="secondary" size="sm" onClick={handleAddPricingItem}>
          + Add Pricing Item
        </Button>
      </Card>

      {/* Taxes & Additional Charges */}
      <Card title="Taxes & Additional Charges">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
            <input
              type="number"
              value={commercials.taxes?.gstRate || ''}
              onChange={(e) =>
                updateCommercials({
                  taxes: { ...commercials.taxes, gstRate: parseFloat(e.target.value) || 0 },
                })
              }
              placeholder="18"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Input
            label="GST Number"
            value={commercials.taxes?.gstNumber || ''}
            onChange={(e) =>
              updateCommercials({
                taxes: { ...commercials.taxes, gstNumber: e.target.value },
              })
            }
            placeholder="27AABCU9603R1ZX"
          />

          <Input
            label="Freight Amount"
            type="number"
            value={commercials.freight?.amount || ''}
            onChange={(e) =>
              updateCommercials({
                freight: { ...commercials.freight, amount: parseFloat(e.target.value) || 0 },
              })
            }
            placeholder="0"
          />

          <Input
            label="Insurance Amount"
            type="number"
            value={commercials.insurance?.amount || ''}
            onChange={(e) =>
              updateCommercials({
                insurance: { ...commercials.insurance, amount: parseFloat(e.target.value) || 0 },
              })
            }
            placeholder="0"
          />
        </div>
      </Card>

      {/* Payment Terms */}
      <Card title="Payment Terms">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Advance (%)</label>
            <input
              type="number"
              value={terms?.advancePercentage || ''}
              onChange={(e) =>
                updateTerms({ advancePercentage: parseFloat(e.target.value) || 0 })
              }
              placeholder="30"
              min={0}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Input
            label="Delivery Period (weeks)"
            type="number"
            value={terms?.deliveryWeeks || ''}
            onChange={(e) => updateTerms({ deliveryWeeks: parseInt(e.target.value) || 0 })}
            placeholder="12"
          />

          <Input
            label="Price Validity (days)"
            type="number"
            value={terms?.priceValidityDays || ''}
            onChange={(e) => updateTerms({ priceValidityDays: parseInt(e.target.value) || 0 })}
            placeholder="90"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms Description</label>
          <textarea
            value={terms?.paymentTerms || ''}
            onChange={(e) => updateTerms({ paymentTerms: e.target.value })}
            placeholder="e.g., 30% advance with PO, 40% against progress, 30% before dispatch"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </Card>

      {/* Grand Total */}
      <Card title="Summary">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">Grand Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              {commercials.currency} {calculateGrandTotal().toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" size="lg" onClick={previousStep}>
          ← Back
        </Button>
        <Button variant="primary" size="lg" onClick={handleContinue}>
          Continue to Review →
        </Button>
      </div>
    </div>
  );
};