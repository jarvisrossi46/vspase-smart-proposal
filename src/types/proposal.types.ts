/**
 * VS PASE Smart Proposal Management System
 * TypeScript Types & Interfaces
 * Based on VS PASE JSON Schema
 */

// ============================================
// ENUMS & CONSTANTS
// ============================================

export enum ProposalStep {
  CLIENT_DETAILS = 1,
  TECHNICAL_SPECS = 2,
  COMMERCIALS = 3,
  REVIEW = 4,
}

export enum ProposalStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum EquipmentType {
  PUMP = 'pump',
  VALVE = 'valve',
  HEAT_EXCHANGER = 'heat_exchanger',
  COMPRESSOR = 'compressor',
  BLOWER = 'blower',
  MIXER = 'mixer',
}

export enum MaterialOfConstruction {
  SS304 = 'SS304',
  SS316 = 'SS316',
  SS316L = 'SS316L',
  CARBON_STEEL = 'carbon_steel',
  CAST_IRON = 'cast_iron',
  DUPLEX_STEEL = 'duplex_steel',
  SUPER_DUPLEX = 'super_duplex',
  TITANIUM = 'titanium',
  HASTELLOY = 'hastelloy',
  DUCTILE_IRON = 'ductile_iron',
  BRONZE = 'bronze',
  OTHER = 'other',
}

export enum Currency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

// ============================================
// CLIENT DETAILS (Step 1)
// ============================================

export interface ClientContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface ClientSite {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ClientDetails {
  clientName: string;
  clientCode?: string;
  industry: string;
  segment: string;
  sites: ClientSite[];
  contacts: ClientContact[];
  selectedSiteId: string | null;
  selectedContactId: string | null;
  enquiryReference: string;
  enquiryDate: string;
  proposedDeliveryDate: string;
}

// ============================================
// TECHNICAL SPECIFICATIONS (Step 2)
// ============================================

export interface PumpSpecifications {
  flowRate: number; // m³/hr
  head: number; // meters
  liquid: string;
  temperature: number; // °C
  viscosity?: number; // cP
  specificGravity: number;
  suctionPressure?: number; // bar
  dischargePressure?: number; // bar
  npshAvailable?: number; // meters
  solidContent?: number; // percentage
  solidSize?: number; // mm
  phValue?: number;
}

export interface MotorSpecifications {
  powerHP: number;
  powerKW: number;
  rpm: number;
  voltage: number; // V
  frequency: number; // Hz
  protectionGrade: string; // e.g., IP55
  insulationClass: string; // e.g., F Class
  efficiencyClass: string; // e.g., IE3
  mounting: string; // e.g., B3, B5
}

export interface MechanicalSeal {
  sealType: string;
  faceMaterial: string;
  secondarySealMaterial: string;
  flushPlan?: string;
  barrierFluid?: string;
}

export interface EquipmentItem {
  id: string;
  lineItemNo: number;
  tagNumber: string;
  equipmentType: EquipmentType;
  type?: string; // For component UI
  model?: string; // Equipment model
  capacity?: string; // Capacity specification
  motorHP?: number; // Motor horsepower
  description: string;
  quantity: number;
  
  // Material Specifications
  moc: MaterialOfConstruction;
  mocRemarks?: string;
  casingMoc: MaterialOfConstruction;
  impellerMoc: MaterialOfConstruction;
  shaftMoc: MaterialOfConstruction;
  
  // Pump Specific
  pumpSpecs?: PumpSpecifications;
  
  // Motor Specific
  motorSpecs?: MotorSpecifications;
  motorMake?: string;
  motorMoc?: MaterialOfConstruction;
  
  // Seal
  sealType: 'mechanical' | 'gland_packing' | 'sealless';
  mechanicalSeal?: MechanicalSeal;
  
  // Accessories
  coupling?: {
    type: string;
    guard: boolean;
  };
  baseplate?: {
    type: string;
    material: MaterialOfConstruction;
  };
  
  // Custom requirements
  specialRequirements?: string;
  remarks?: string;
}

export interface TechnicalSpecifications {
  equipment: EquipmentItem[];
  scopeOfSupply?: string[]; // Items in scope
  standards: string[]; // ISO, API, ASME, etc.
  applicableCodes: string[];
  testingRequirements: string[];
  documentationRequirements: string[];
  packagingRequirements: string;
  paintingSpecification?: string;
  inspectionRequired: boolean;
  thirdPartyInspection?: string;
  warrantyPeriod?: string; // Warranty duration

  // Operational conditions
  ambientTemperature: {
    min: number;
    max: number;
  };
  altitude?: number; // meters above sea level
  hazardousArea: boolean;
  areaClassification?: string; // e.g., Zone 1, Zone 2
}

// ============================================
// COMMERCIALS (Step 3)
// ============================================

export interface PricingItem {
  equipmentId: string;
  lineItemNo: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: Currency;
  
  // Price breakup
  basicPrice: number;
  packingForwarding: number;
  freightInsurance: number;
  taxesGST: number;
  otherCharges: number;
}

export interface CommercialTerms {
  priceBasis: 'ex_works' | 'fob' | 'cif' | 'door_delivery';
  freightBasis: string;
  packingForwarding: number; // percentage or fixed
  insurance: number;
  taxes: {
    gstRate: number;
    gstNumber: string;
    otherTaxes?: string;
  };
  
  // Payment terms
  paymentTerms: string;
  advancePercentage: number;
  creditDays: number;
  
  // Delivery
  deliveryWeeks: number;
  deliverySchedule: string;
  partialShipment: boolean;
  
  // Validity
  priceValidityDays: number;
  
  // Additional terms
  warrantyMonths: number;
  performanceGuarantee: boolean;
  ldClause: boolean;
  forceMajeure: boolean;
  arbitration: string;
  jurisdiction: string;
}

export interface Commercials {
  currency: Currency;
  exchangeRate?: number; // if foreign currency
  pricingItems: PricingItem[];
  
  // Totals
  subTotal: number;
  totalTaxes: number;
  grandTotal: number;
  
  // Terms
  terms: CommercialTerms;
  
  // Additional costs
  sparesCost?: number;
  commissioningCost?: number;
  trainingCost?: number;
  amcCost?: number; // Annual maintenance
}

// ============================================
// REVIEW & METADATA (Step 4)
// ============================================

export interface ProposalReview {
  notes: string;
  internalRemarks: string;
  attachments: Attachment[];
  signatures?: {
    preparedBy: string;
    reviewedBy?: string;
    approvedBy?: string;
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  blobUrl?: string; // For local storage
  uploadedAt: string;
}

export interface ProposalMetadata {
  id: string;
  proposalNumber: string;
  revision: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: ProposalStatus;
  isSynced: boolean;
  lastSyncedAt?: string;
  deviceId: string;
}

// ============================================
// MAIN PROPOSAL INTERFACE
// ============================================

export interface Proposal {
  metadata: ProposalMetadata;
  clientDetails: ClientDetails;
  technicalSpecs: TechnicalSpecifications;
  commercials: Commercials;
  review: ProposalReview;
}

// ============================================
// STORE STATE & ACTIONS
// ============================================

export interface ProposalWizardState {
  // Navigation
  currentStep: ProposalStep;
  completedSteps: ProposalStep[];
  
  // Current proposal being edited
  currentProposal: Proposal | null;
  
  // Draft state (auto-saved)
  draftId: string | null;
  lastSavedAt: string | null;
  isDirty: boolean;
  
  // UI State
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Offline queue for sync
  syncQueue: string[]; // proposal IDs to sync
}

export interface ProposalWizardActions {
  // Step navigation
  goToStep: (step: ProposalStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  markStepComplete: (step: ProposalStep) => void;
  canNavigateToStep: (step: ProposalStep) => boolean;
  
  // Proposal CRUD
  createNewProposal: () => void;
  loadProposal: (proposalId: string) => Promise<void>;
  saveProposal: () => Promise<void>;
  submitProposal: () => Promise<void>;
  deleteProposal: (proposalId: string) => Promise<void>;
  
  // Step 1: Client Details
  updateClientDetails: (details: Partial<ClientDetails>) => void;
  addSite: (site: Omit<ClientSite, 'id'>) => void;
  updateSite: (siteId: string, site: Partial<ClientSite>) => void;
  removeSite: (siteId: string) => void;
  addContact: (contact: Omit<ClientContact, 'id'>) => void;
  updateContact: (contactId: string, contact: Partial<ClientContact>) => void;
  removeContact: (contactId: string) => void;
  selectSite: (siteId: string) => void;
  selectContact: (contactId: string) => void;
  
  // Step 2: Technical Specs
  updateTechnicalSpecs: (specs: Partial<TechnicalSpecifications>) => void;
  addEquipment: (equipment: Omit<EquipmentItem, 'id' | 'lineItemNo'>) => void;
  updateEquipment: (equipmentId: string, equipment: Partial<EquipmentItem>) => void;
  removeEquipment: (equipmentId: string) => void;
  reorderEquipment: (equipmentIds: string[]) => void;
  duplicateEquipment: (equipmentId: string) => void;
  
  // Step 3: Commercials
  updateCommercials: (commercials: Partial<Commercials>) => void;
  updateTerms: (terms: Partial<CommercialTerms>) => void;
  addPricingItem: (item: Omit<PricingItem, 'equipmentId'>) => void;
  updatePricingItem: (equipmentId: string, item: Partial<PricingItem>) => void;
  removePricingItem: (equipmentId: string) => void;
  calculateTotals: () => void;
  
  // Step 4: Review
  updateReview: (review: Partial<ProposalReview>) => void;
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (attachmentId: string) => void;
  
  // Utility actions
  setError: (error: string | null) => void;
  clearError: () => void;
  resetWizard: () => void;
  markClean: () => void;
  
  // Clone feature
  duplicatePreviousProposal: (sourceProposalId: string) => Promise<string>;
}

export type ProposalStore = ProposalWizardState & ProposalWizardActions;

// ============================================
// UTILITY TYPES
// ============================================

export interface StoredProposal {
  proposal: Proposal;
  savedAt: string;
}

export interface ProposalListItem {
  id: string;
  proposalNumber: string;
  clientName: string;
  status: ProposalStatus;
  grandTotal: number;
  createdAt: string;
  isSynced: boolean;
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Step validation rules
export type StepValidation = {
  [key in ProposalStep]: (proposal: Proposal | null) => ValidationResult;
};
