export type StoreCategory =
  | "cafe"
  | "bakery"
  | "lifestyle"
  | "beverage"
  | "salon"
  | "bistro";

export interface StoreTypeOption {
  id: StoreCategory;
  name: string;
  tagline: string;
  typicalBudgetMin: number; // in NT$ 10k (萬元)
  typicalBudgetMax: number;
  minScale: string;
  keyChallenge: string;
  iconName: string;
  recommendedTools: string[];
  keyRegulations: string[];
}

export type WorkStatus =
  | "quiet_quitting" // 安靜離職摸索中
  | "fulltime_looking" // 全職在職觀望
  | "side_hustling" // 已有副業接案準備獨立
  | "resigned_prep"; // 已離職全力籌備中

export type WeeklyHours =
  | "5-10" // 平日通勤碎片（5-10小時）
  | "10-20" // 週末衝刺期（10-20小時）
  | "30+"; // 全職高強度投入（30小時以上）

export interface UserProfile {
  storeType: StoreCategory;
  storeTypeName: string;
  storeScale: string;
  region: string;
  ownFunds: number; // in 萬元
  targetBudget: number; // in 萬元
  currentStatus: WorkStatus;
  weeklyHours: WeeklyHours;
  concerns: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface ReadinessScore {
  overall: number; // 0-100
  capital: number;
  mental: number;
  market: number;
  digital: number;
  levelTitle: string;
  levelColor: string;
}

export interface PreparationTask {
  id: string;
  title: string;
  description: string;
  category: "finance" | "legal" | "space" | "digital" | "launch";
  isCrucial: boolean;
  pitfallTip?: string;
  officialDocHint?: string;
}

export interface PreparationPhase {
  id: string;
  phaseNumber: number;
  title: string;
  period: string;
  tagline: string;
  tasks: PreparationTask[];
}

export interface PolicyTool {
  id: string;
  name: string;
  agency: string;
  maxAmount: string;
  type: "loan" | "subsidy" | "esg" | "digital";
  matchRate: number; // 0-100
  highlight: string;
  plainSummary: string;
  eligibilityConditions: string[];
  pitfallWarning: string;
  hasTemplate: boolean;
  templateDocName?: string;
  tags: string[];
}

export interface DigitalSolution {
  id: string;
  name: string;
  provider: string;
  category: "pos" | "ordering" | "payment" | "esg";
  highlight: string;
  priceModel: string;
  pros: string[];
  watchOut: string;
  badge?: string;
  esgFeature?: string;
}

export interface PitfallStory {
  id: string;
  title: string;
  category: "renovation" | "contract" | "equipment" | "cashflow";
  persona: string;
  theMistake: string;
  burnedAmount: string;
  keyTakeaway: string;
  checklistRule: string;
}

export interface ConsultationInquiry {
  name: string;
  phone: string;
  email: string;
  lineId?: string;
  storeType: string;
  region: string;
  budget: string;
  interestedServices: string[];
  consultationTopic: string;
  preferredTime: string;
}
