import { UserProfile, ReadinessScore, PolicyTool } from "../types";
import { POLICY_TOOLS } from "../data/storeData";

export interface BudgetBreakdown {
  renovationAndHardware: number; // 裝潢與水電工程 (約 40%)
  coreEquipment: number; // 核心生財機具設備 (約 25%)
  rentAndDeposit: number; // 押金租金與前期物料 (約 15%)
  reserveEmergencyFunds: number; // 營運周轉金護城河 (約 20%)
  capitalGap: number; // 資金缺口
  recommendedLoan: number; // 建議申請之政策貸款額度
}

export function calculateReadiness(profile: UserProfile): ReadinessScore {
  const own = profile.ownFunds || 60;
  const target = profile.targetBudget || 120;
  const ownRatio = own / (target || 1);

  // Capital score calculation
  let capitalScore = 50;
  if (ownRatio >= 0.8) capitalScore = 96;
  else if (ownRatio >= 0.6) capitalScore = 88;
  else if (ownRatio >= 0.45) capitalScore = 78;
  else if (ownRatio >= 0.3) capitalScore = 65;
  else capitalScore = 52;

  // Mental score calculation
  let mentalScore = 70;
  if (profile.currentStatus === "resigned_prep") mentalScore += 18;
  else if (profile.currentStatus === "side_hustling") mentalScore += 15;
  else if (profile.currentStatus === "quiet_quitting") mentalScore += 10;
  else mentalScore += 5;

  if (profile.weeklyHours === "30+") mentalScore += 10;
  else if (profile.weeklyHours === "10-20") mentalScore += 6;
  else mentalScore += 2;

  mentalScore = Math.min(98, mentalScore);

  // Market knowledge score
  let marketScore = 75;
  if (profile.region) marketScore += 6;
  if (profile.storeScale) marketScore += 8;
  if ((profile.concerns || []).length >= 2) marketScore += 5; // Awareness of risks increases realism
  marketScore = Math.min(96, marketScore);

  // Digital readiness score
  const digitalScore = 84;

  const overall = Math.round(
    capitalScore * 0.35 +
      mentalScore * 0.25 +
      marketScore * 0.25 +
      digitalScore * 0.15
  );

  let levelTitle = "穩健起步者 (Ready to Launch)";
  let levelColor = "text-emerald-700 bg-emerald-50 border-emerald-200";

  if (overall >= 85) {
    levelTitle = "高成熟籌備者 (Prime Mover)";
    levelColor = "text-emerald-800 bg-emerald-50 border-emerald-300";
  } else if (overall >= 70) {
    levelTitle = "穩健起步型 (Solid Navigator)";
    levelColor = "text-blue-800 bg-blue-50 border-blue-200";
  } else if (overall >= 60) {
    levelTitle = "破冰摸索型 (Dream Shaper)";
    levelColor = "text-amber-800 bg-amber-50 border-amber-200";
  } else {
    levelTitle = "謹慎調研型 (Cautious Explorer)";
    levelColor = "text-rose-800 bg-rose-50 border-rose-200";
  }

  return {
    overall,
    capital: capitalScore,
    mental: mentalScore,
    market: marketScore,
    digital: digitalScore,
    levelTitle,
    levelColor,
  };
}

export function calculateBudgetBreakdown(profile: UserProfile): BudgetBreakdown {
  const target = Number(profile.targetBudget) || 120;
  const own = Number(profile.ownFunds) || 60;
  const gap = Math.max(0, target - own);

  const renovationAndHardware = Math.round(target * 0.38);
  const coreEquipment = Math.round(target * 0.25);
  const rentAndDeposit = Math.round(target * 0.15);
  const reserveEmergencyFunds = Math.round(target * 0.22); // 至少 22% 護城河

  // If gap exists, recommend loaning the gap plus a 10% safety cushion
  const recommendedLoan = gap > 0 ? Math.min(200, gap + 10) : 0;

  return {
    renovationAndHardware,
    coreEquipment,
    rentAndDeposit,
    reserveEmergencyFunds,
    capitalGap: gap,
    recommendedLoan,
  };
}

export function getMatchedPolicyTools(profile: UserProfile): PolicyTool[] {
  const target = Number(profile.targetBudget) || 120;
  const own = Number(profile.ownFunds) || 60;
  const gap = target - own;

  return POLICY_TOOLS.map((policy) => {
    let rate = policy.matchRate;

    // Adjust rate based on profile
    if (policy.id === "youth-loan") {
      if (gap > 0) rate = Math.min(99, rate + 1);
    }
    if (policy.id === "cloud-voucher") {
      rate = 97; // Always universally high match
    }
    if (policy.id === "energy-saving") {
      if (["cafe", "bakery", "beverage", "bistro"].includes(profile.storeType)) {
        rate = 98; // High refrigeration & cooling load
      }
    }
    if (policy.id === "phoenix-loan") {
      if (profile.currentStatus === "quiet_quitting" || profile.currentStatus === "side_hustling") {
        rate = 93;
      }
    }

    return {
      ...policy,
      matchRate: rate,
    };
  }).sort((a, b) => b.matchRate - a.matchRate);
}
