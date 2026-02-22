/**
 * Zustand Store for Proposal Wizard
 * Handles state management for the multi-step proposal form
 * With persistence for offline capability
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Proposal,
  ProposalStep,
  ProposalStatus,
  ProposalWizardState,
  ProposalWizardActions,
  ClientDetails,
  ClientSite,
  ClientContact,
  TechnicalSpecifications,
  EquipmentItem,
  Commercials,
  CommercialTerms,
  PricingItem,
  ProposalReview,
  Attachment,
  ProposalMetadata,
  Currency,
} from '../types/proposal.types';

// ============================================
// INITIAL STATE HELPERS
// ============================================

const generateId = (): string => Math.random().toString(36).substring(2, 15);

const createInitialClientDetails = (): ClientDetails => ({
  clientName: '',
  clientCode: '',
  industry: '',
  segment: '',
  sites: [],
  contacts: [],
  selectedSiteId: null,
  selectedContactId: null,
  enquiryReference: '',
  enquiryDate: new Date().toISOString().split('T')[0],
  proposedDeliveryDate: '',
});

const createInitialTechnicalSpecs = (): TechnicalSpecifications => ({
  equipment: [],
  standards: [],
  applicableCodes: [],
  testingRequirements: [],
  documentationRequirements: [],
  packagingRequirements: '',
  inspectionRequired: false,
  ambientTemperature: { min: 0, max: 50 },
  hazardousArea: false,
});

const createInitialCommercials = (): Commercials => ({
  currency: Currency.INR,
  pricingItems: [],
  subTotal: 0,
  totalTaxes: 0,
  grandTotal: 0,
  terms: {
    priceBasis: 'ex_works',
    freightBasis: '',
    packingForwarding: 0,
    insurance: 0,
    taxes: {
      gstRate: 18,
      gstNumber: '',
    },
    paymentTerms: '',
    advancePercentage: 30,
    creditDays: 0,
    deliveryWeeks: 8,
    deliverySchedule: '',
    partialShipment: false,
    priceValidityDays: 30,
    warrantyMonths: 12,
    performanceGuarantee: true,
    ldClause: true,
    forceMajeure: true,
    arbitration: '',
    jurisdiction: '',
  },
});

const createInitialReview = (): ProposalReview => ({
  notes: '',
  internalRemarks: '',
  attachments: [],
});

const createInitialMetadata = (): ProposalMetadata => ({
  id: generateId(),
  proposalNumber: `PROP-${Date.now()}`,
  revision: 'A',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'field-engineer',
  status: ProposalStatus.DRAFT,
  isSynced: false,
  deviceId: 'device-001',
});

const createInitialProposal = (): Proposal => ({
  metadata: createInitialMetadata(),
  clientDetails: createInitialClientDetails(),
  technicalSpecs: createInitialTechnicalSpecs(),
  commercials: createInitialCommercials(),
  review: createInitialReview(),
});

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useProposalStore = create<ProposalWizardState & ProposalWizardActions>()(
  persist(
    (set, get) => ({
      // ============================================
      // STATE
      // ============================================
      
      currentStep: ProposalStep.CLIENT_DETAILS,
      completedSteps: [],
      currentProposal: createInitialProposal(),
      draftId: null,
      lastSavedAt: null,
      isDirty: false,
      isLoading: false,
      isSaving: false,
      error: null,
      syncQueue: [],

      // ============================================
      // STEP NAVIGATION ACTIONS
      // ============================================

      goToStep: (step: ProposalStep) => {
        const { canNavigateToStep } = get();
        if (canNavigateToStep(step)) {
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const { currentStep, markStepComplete } = get();
        markStepComplete(currentStep);
        
        if (currentStep < ProposalStep.REVIEW) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > ProposalStep.CLIENT_DETAILS) {
          set({ currentStep: currentStep - 1 });
        }
      },

      markStepComplete: (step: ProposalStep) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(step)) {
          set({ completedSteps: [...completedSteps, step] });
        }
      },

      canNavigateToStep: (step: ProposalStep): boolean => {
        const { completedSteps, currentStep } = get();
        // Can navigate to completed steps or current step
        if (step === currentStep || completedSteps.includes(step)) {
          return true;
        }
        // Can navigate to next step if all previous are completed
        const previousSteps = Array.from({ length: step - 1 }, (_, i) => i + 1);
        return previousSteps.every(s => completedSteps.includes(s as ProposalStep));
      },

      // ============================================
      // PROPOSAL CRUD ACTIONS
      // ============================================

      createNewProposal: () => {
        set({
          currentStep: ProposalStep.CLIENT_DETAILS,
          completedSteps: [],
          currentProposal: createInitialProposal(),
          draftId: generateId(),
          lastSavedAt: new Date().toISOString(),
          isDirty: false,
          error: null,
        });
      },

      loadProposal: async (proposalId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In real app, fetch from API or local DB
          const response = await fetch(`/api/v1/proposals/${proposalId}`);
          if (!response.ok) throw new Error('Failed to load proposal');
          const proposal: Proposal = await response.json();
          
          set({
            currentProposal: proposal,
            lastSavedAt: new Date().toISOString(),
            isDirty: false,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      saveProposal: async () => {
        const { currentProposal } = get();
        if (!currentProposal) return;

        set({ isSaving: true });
        try {
          const updatedProposal: Proposal = {
            ...currentProposal,
            metadata: {
              ...currentProposal.metadata,
              updatedAt: new Date().toISOString(),
            },
          };

          // In real app, save to API
          // await fetch('/api/v1/proposals', { method: 'POST', body: JSON.stringify(updatedProposal) });
          
          set({
            currentProposal: updatedProposal,
            lastSavedAt: new Date().toISOString(),
            isDirty: false,
            isSaving: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isSaving: false });
        }
      },

      submitProposal: async () => {
        const { currentProposal, saveProposal } = get();
        if (!currentProposal) return;

        await saveProposal();
        
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            metadata: {
              ...state.currentProposal.metadata,
              status: ProposalStatus.SUBMITTED,
            },
          } : null,
        }));
      },

      deleteProposal: async (_proposalId: string) => {
        // In real app, delete from API
        set({ currentProposal: null, completedSteps: [] });
      },

      // ============================================
      // CLIENT DETAILS ACTIONS (Step 1)
      // ============================================

      updateClientDetails: (details: Partial<ClientDetails>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: { ...state.currentProposal.clientDetails, ...details },
          } : null,
          isDirty: true,
        }));
      },

      addSite: (site: Omit<ClientSite, 'id'>) => {
        const newSite: ClientSite = { ...site, id: generateId() };
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: {
              ...state.currentProposal.clientDetails,
              sites: [...state.currentProposal.clientDetails.sites, newSite],
            },
          } : null,
          isDirty: true,
        }));
      },

      updateSite: (siteId: string, site: Partial<ClientSite>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: {
              ...state.currentProposal.clientDetails,
              sites: state.currentProposal.clientDetails.sites.map(s =>
                s.id === siteId ? { ...s, ...site } : s
              ),
            },
          } : null,
          isDirty: true,
        }));
      },

      removeSite: (siteId: string) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: {
              ...state.currentProposal.clientDetails,
              sites: state.currentProposal.clientDetails.sites.filter(s => s.id !== siteId),
            },
          } : null,
          isDirty: true,
        }));
      },

      addContact: (contact: Omit<ClientContact, 'id'>) => {
        const newContact: ClientContact = { ...contact, id: generateId() };
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: {
              ...state.currentProposal.clientDetails,
              contacts: [...state.currentProposal.clientDetails.contacts, newContact],
            },
          } : null,
          isDirty: true,
        }));
      },

      updateContact: (contactId: string, contact: Partial<ClientContact>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: {
              ...state.currentProposal.clientDetails,
              contacts: state.currentProposal.clientDetails.contacts.map(c =>
                c.id === contactId ? { ...c, ...contact } : c
              ),
            },
          } : null,
          isDirty: true,
        }));
      },

      removeContact: (contactId: string) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: {
              ...state.currentProposal.clientDetails,
              contacts: state.currentProposal.clientDetails.contacts.filter(c => c.id !== contactId),
            },
          } : null,
          isDirty: true,
        }));
      },

      selectSite: (siteId: string) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: {
              ...state.currentProposal.clientDetails,
              selectedSiteId: siteId,
            },
          } : null,
          isDirty: true,
        }));
      },

      selectContact: (contactId: string) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            clientDetails: {
              ...state.currentProposal.clientDetails,
              selectedContactId: contactId,
            },
          } : null,
          isDirty: true,
        }));
      },

      // ============================================
      // TECHNICAL SPECS ACTIONS (Step 2)
      // ============================================

      updateTechnicalSpecs: (specs: Partial<TechnicalSpecifications>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            technicalSpecs: { ...state.currentProposal.technicalSpecs, ...specs },
          } : null,
          isDirty: true,
        }));
      },

      addEquipment: (equipment: Omit<EquipmentItem, 'id' | 'lineItemNo'>) => {
        const { currentProposal } = get();
        if (!currentProposal) return;

        const lineItemNo = currentProposal.technicalSpecs.equipment.length + 1;
        const newEquipment: EquipmentItem = {
          ...equipment,
          id: generateId(),
          lineItemNo,
        };

        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            technicalSpecs: {
              ...state.currentProposal.technicalSpecs,
              equipment: [...state.currentProposal.technicalSpecs.equipment, newEquipment],
            },
          } : null,
          isDirty: true,
        }));
      },

      updateEquipment: (equipmentId: string, equipment: Partial<EquipmentItem>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            technicalSpecs: {
              ...state.currentProposal.technicalSpecs,
              equipment: state.currentProposal.technicalSpecs.equipment.map(e =>
                e.id === equipmentId ? { ...e, ...equipment } : e
              ),
            },
          } : null,
          isDirty: true,
        }));
      },

      removeEquipment: (equipmentId: string) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            technicalSpecs: {
              ...state.currentProposal.technicalSpecs,
              equipment: state.currentProposal.technicalSpecs.equipment.filter(e => e.id !== equipmentId),
            },
          } : null,
          isDirty: true,
        }));
      },

      reorderEquipment: (equipmentIds: string[]) => {
        // Reorder equipment based on new ID order
        set(state => {
          if (!state.currentProposal) return state;
          const equipment = state.currentProposal.technicalSpecs.equipment;
          const reordered = equipmentIds
            .map(id => equipment.find(e => e.id === id))
            .filter((e): e is EquipmentItem => e !== undefined)
            .map((e, index) => ({ ...e, lineItemNo: index + 1 }));
          
          return {
            currentProposal: {
              ...state.currentProposal,
              technicalSpecs: {
                ...state.currentProposal.technicalSpecs,
                equipment: reordered,
              },
            },
            isDirty: true,
          };
        });
      },

      duplicateEquipment: (equipmentId: string) => {
        const { currentProposal } = get();
        if (!currentProposal) return;

        const equipment = currentProposal.technicalSpecs.equipment.find(e => e.id === equipmentId);
        if (!equipment) return;

        const { id, lineItemNo, tagNumber, ...rest } = equipment;
        const newEquipment: EquipmentItem = {
          ...rest,
          id: generateId(),
          lineItemNo: currentProposal.technicalSpecs.equipment.length + 1,
          tagNumber: `${tagNumber}-COPY`,
        };

        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            technicalSpecs: {
              ...state.currentProposal.technicalSpecs,
              equipment: [...state.currentProposal.technicalSpecs.equipment, newEquipment],
            },
          } : null,
          isDirty: true,
        }));
      },

      // ============================================
      // COMMERCIALS ACTIONS (Step 3)
      // ============================================

      updateCommercials: (commercials: Partial<Commercials>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            commercials: { ...state.currentProposal.commercials, ...commercials },
          } : null,
          isDirty: true,
        }));
      },

      updateTerms: (terms: Partial<CommercialTerms>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            commercials: {
              ...state.currentProposal.commercials,
              terms: { ...state.currentProposal.commercials.terms, ...terms },
            },
          } : null,
          isDirty: true,
        }));
      },

      addPricingItem: (item: Omit<PricingItem, 'equipmentId'>) => {
        const { currentProposal } = get();
        if (!currentProposal) return;

        const equipmentId = generateId();
        const newItem: PricingItem = { ...item, equipmentId };

        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            commercials: {
              ...state.currentProposal.commercials,
              pricingItems: [...state.currentProposal.commercials.pricingItems, newItem],
            },
          } : null,
          isDirty: true,
        }), false);

        // Recalculate totals
        get().calculateTotals();
      },

      updatePricingItem: (equipmentId: string, item: Partial<PricingItem>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            commercials: {
              ...state.currentProposal.commercials,
              pricingItems: state.currentProposal.commercials.pricingItems.map(i =>
                i.equipmentId === equipmentId ? { ...i, ...item } : i
              ),
            },
          } : null,
          isDirty: true,
        }), false);

        // Recalculate totals
        get().calculateTotals();
      },

      removePricingItem: (equipmentId: string) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            commercials: {
              ...state.currentProposal.commercials,
              pricingItems: state.currentProposal.commercials.pricingItems.filter(i => i.equipmentId !== equipmentId),
            },
          } : null,
          isDirty: true,
        }), false);

        // Recalculate totals
        get().calculateTotals();
      },

      calculateTotals: () => {
        set(state => {
          if (!state.currentProposal) return state;
          
          const { pricingItems, terms } = state.currentProposal.commercials;
          const gstRate = terms.taxes.gstRate;
          
          const subTotal = pricingItems.reduce((sum, item) => sum + item.totalPrice, 0);
          const totalTaxes = subTotal * (gstRate / 100);
          const grandTotal = subTotal + totalTaxes;

          return {
            currentProposal: {
              ...state.currentProposal,
              commercials: {
                ...state.currentProposal.commercials,
                subTotal,
                totalTaxes,
                grandTotal,
              },
            },
          };
        });
      },

      // ============================================
      // REVIEW ACTIONS (Step 4)
      // ============================================

      updateReview: (review: Partial<ProposalReview>) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            review: { ...state.currentProposal.review, ...review },
          } : null,
          isDirty: true,
        }));
      },

      addAttachment: (attachment: Attachment) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            review: {
              ...state.currentProposal.review,
              attachments: [...state.currentProposal.review.attachments, attachment],
            },
          } : null,
          isDirty: true,
        }));
      },

      removeAttachment: (attachmentId: string) => {
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            review: {
              ...state.currentProposal.review,
              attachments: state.currentProposal.review.attachments.filter(a => a.id !== attachmentId),
            },
          } : null,
          isDirty: true,
        }));
      },

      // ============================================
      // UTILITY ACTIONS
      // ============================================

      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      resetWizard: () => {
        set({
          currentStep: ProposalStep.CLIENT_DETAILS,
          completedSteps: [],
          currentProposal: createInitialProposal(),
          draftId: null,
          lastSavedAt: null,
          isDirty: false,
          error: null,
        });
      },

      markClean: () => set({ isDirty: false }),

      duplicatePreviousProposal: async (sourceProposalId: string): Promise<string> => {
        const { loadProposal } = get();
        await loadProposal(sourceProposalId);
        
        const newId = generateId();
        set(state => ({
          currentProposal: state.currentProposal ? {
            ...state.currentProposal,
            metadata: {
              ...createInitialMetadata(),
              id: newId,
              proposalNumber: `PROP-${Date.now()}`,
            },
          } : null,
          currentStep: ProposalStep.CLIENT_DETAILS,
          completedSteps: [],
        }));
        
        return newId;
      },
    }),
    {
      name: 'proposal-wizard-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentProposal: state.currentProposal,
        draftId: state.draftId,
        lastSavedAt: state.lastSavedAt,
        isDirty: state.isDirty,
        syncQueue: state.syncQueue,
      }),
    }
  )
);

// ============================================
// SELECTOR HOOKS (for performance)
// ============================================

export const useClientDetails = () => useProposalStore(state => state.currentProposal?.clientDetails);
export const useTechnicalSpecs = () => useProposalStore(state => state.currentProposal?.technicalSpecs);
export const useCommercials = () => useProposalStore(state => state.currentProposal?.commercials);
export const useReview = () => useProposalStore(state => state.currentProposal?.review);
export const useCurrentStep = () => useProposalStore(state => state.currentStep);
export const useCompletedSteps = () => useProposalStore(state => state.completedSteps);
export const useIsLoading = () => useProposalStore(state => state.isLoading);
export const useIsSaving = () => useProposalStore(state => state.isSaving);
export const useError = () => useProposalStore(state => state.error);
