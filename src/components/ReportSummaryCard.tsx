import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  DollarSign,
  PiggyBank,
  Building,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { UserProfile, ReadinessScore } from "../types";
import { calculateBudgetBreakdown, BudgetBreakdown } from "../utils/calculator";

interface ReportSummaryCardProps {
  profile: UserProfile;
  score: ReadinessScore;
  onOpenAiConsult: () => void;
  onRetest: () => void;
}

interface AIAdvisorData {
  advisorQuote: string;
  readinessSummary: string;
  fundingStrategy: string;
  criticalPitfalls: string[];
  firstActionStep: string;
}

export function ReportSummaryCard({
  profile,
  score,
  onOpenAiConsult,
  onRetest,
}: ReportSummaryCardProps) {
  const [budget, setBudget] = useState<BudgetBreakdown>(calculateBudgetBreakdown(profile));
  const [aiData, setAiData] = useState<AIAdvisorData | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  useEffect(() => {
    setBudget(calculateBudgetBreakdown(profile));
    fetchAiInsights(profile);
  }, [profile]);

  const fetchAiInsights = async (currProfile: UserProfile) => {
    setIsLoadingAi(true);
    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: currProfile }),
      });
      const data = await res.json();
      if (data && data.insights) {
        setAiData(data.insights);
      }
    } catch (err) {
      console.error("Failed to load AI insights:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const ownPercent = Math.min(100, Math.round((profile.ownFunds / (profile.targetBudget || 1)) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner with Store Profile & Scores */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Store Meta */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-stone-900 px-2.5 py-1 text-xs font-bold text-white">
                {profile.storeTypeName}
              </span>
              <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                {profile.storeScale || "7-12 坪"}
              </span>
              <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                {profile.region || "生活感文青社區"}
              </span>
              <span className="text-xs text-stone-600">
                籌備狀態：{profile.currentStatus === "quiet_quitting" ? "安靜離職中" : "在職/副業摸索"}
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
              你的專屬開店體檢報告
            </h1>
            <p className="text-sm text-stone-600">
              依據 2025-2026 最新政策貸款、店面水電裝潢行情與微型創業存活模型精算產出。
            </p>
          </div>

          {/* Right: Big Readiness Score Gauge */}
          <div className="flex items-center gap-4 rounded-xl border border-stone-100 bg-stone-50/80 p-4 sm:p-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-stone-200">
              <span className="text-3xl font-black text-stone-900">
                {score.overall}
              </span>
              <span className="absolute bottom-1.5 text-[10px] font-bold text-stone-600">
                / 100 分
              </span>
            </div>

            <div>
              <span
                className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-bold ${score.levelColor}`}
              >
                {score.levelTitle}
              </span>
              <p className="mt-1 text-xs text-stone-600">
                {score.overall >= 75
                  ? "各項指標均衡，可直接進入青創貸款送件與選址階段"
                  : "資金或籌備時間仍有加強空間，建議先補足 20 小時培訓時數"}
              </p>
              <button
                onClick={onRetest}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>重新調整測驗參數</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Mini Progress Bars */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-stone-100 pt-5 sm:grid-cols-4">
          <div className="rounded-lg bg-stone-50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">資金充裕度</span>
              <span className="font-bold text-stone-900">{score.capital}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-amber-600 transition-all"
                style={{ width: `${score.capital}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg bg-stone-50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">心理與時間承諾</span>
              <span className="font-bold text-stone-900">{score.mental}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${score.mental}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg bg-stone-50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">商圈與規模認知</span>
              <span className="font-bold text-stone-900">{score.market}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${score.market}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg bg-stone-50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">數位工具匹配度</span>
              <span className="font-bold text-stone-900">{score.digital}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-purple-600 transition-all"
                style={{ width: `${score.digital}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health & Capital Shield Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Capital allocation */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-amber-700" />
              <h2 className="text-lg font-bold text-stone-900">
                微型創業「資金黃金護城河」試算
              </h2>
            </div>
            <span className="text-xs font-semibold text-stone-500">
              總預算 NT$ {profile.targetBudget} 萬元
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5">
              <span className="text-xs text-amber-900 font-medium">自有投入資金</span>
              <div className="mt-1 text-lg font-black text-amber-900">
                NT$ {profile.ownFunds} 萬
              </div>
              <span className="text-[11px] text-amber-700">
                佔總預算 {ownPercent}%
              </span>
            </div>

            <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-3.5">
              <span className="text-xs text-blue-900 font-medium">資金缺口 (建議融資)</span>
              <div className="mt-1 text-lg font-black text-blue-900">
                {budget.capitalGap > 0 ? `NT$ ${budget.capitalGap} 萬` : "無缺口"}
              </div>
              <span className="text-[11px] text-blue-700">
                {budget.capitalGap === 0
                  ? "自有資金充裕"
                  : budget.capitalGap <= 100
                  ? "青創 100 萬免保人"
                  : budget.capitalGap <= 400
                  ? "青創貸款+低利政策"
                  : "政策融資+信保+創投"}
              </span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
              <span className="text-xs text-stone-500 font-medium">裝修與生財機具</span>
              <div className="mt-1 text-lg font-black text-stone-900">
                NT$ {budget.renovationAndHardware + budget.coreEquipment} 萬
              </div>
              <span className="text-[11px] text-stone-500">
                建議硬體上限 63%
              </span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
              <span className="text-xs text-emerald-900 font-medium">4-6 個月營運周轉金</span>
              <div className="mt-1 text-lg font-black text-emerald-900">
                NT$ {budget.reserveEmergencyFunds} 萬
              </div>
              <span className="text-[11px] text-emerald-700">
                不可挪動的救命防空洞
              </span>
            </div>
          </div>

          {/* Allocation progress bar */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs text-stone-500">
              <span>預算結構安全佔比建議</span>
              <span className="font-medium text-stone-700">裝潢水電 38% | 核心設備 25% | 租押料件 15% | 周轉護城河 22%</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-stone-100">
              <div className="bg-stone-800" style={{ width: "38%" }} title="裝潢水電 38%" />
              <div className="bg-amber-600" style={{ width: "25%" }} title="核心機具設備 25%" />
              <div className="bg-stone-400" style={{ width: "15%" }} title="租押金與原物料 15%" />
              <div className="bg-emerald-600" style={{ width: "22%" }} title="緊急營運周轉金 22%" />
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-stone-800" />
                裝潢水電 (約 {budget.renovationAndHardware} 萬)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-600" />
                核心機具 (約 {budget.coreEquipment} 萬)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-stone-400" />
                押租物料 (約 {budget.rentAndDeposit} 萬)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                周轉金護城河 (約 {budget.reserveEmergencyFunds} 萬)
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Action Callout */}
        <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-stone-900 p-6 text-white shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                This Week First Step
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-white">
              本週通勤立刻能做的第一件事
            </h3>
            <p className="mt-2 text-xs text-stone-300 leading-relaxed">
              {aiData?.firstActionStep ||
                "先至行政院『e 等公務園』完成免費 20 小時創業培訓時數認證，備妥青創貸款申請門檻。"}
            </p>
          </div>

          <div className="mt-6 border-t border-stone-800 pt-4">
            <button
              onClick={onOpenAiConsult}
              className="flex w-full items-center justify-between rounded-xl bg-amber-600 px-4 py-3 text-xs font-bold text-white hover:bg-amber-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>向 AI 顧問提問避坑細節</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="mt-2 block text-center text-[10px] text-stone-400">
              問水電、問租約、問青創貸款申請門檻
            </span>
          </div>
        </div>
      </div>

      {/* AI Advisor Diagnostic Block */}
      <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/60 via-stone-50 to-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                開店通 AI 導航員深度診斷評語
              </h2>
              <span className="text-[11px] text-stone-500">
                基於 Gemini 3.8 Flash 商業智慧模型運算
              </span>
            </div>
          </div>
          {isLoadingAi && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              AI 精算中...
            </span>
          )}
        </div>

        {/* Advisor Quote */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
          <p className="text-sm font-bold italic text-amber-950 sm:text-base">
            {aiData?.advisorQuote ||
              "「創業不是賭上身家的豪賭，而是用科學配比把風險關在籠子裡的精密計算。」"}
          </p>
        </div>

        {/* Strategy & Readiness Details */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span>現況成熟度與心理定錨</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-stone-600">
              {aiData?.readinessSummary ||
                `自有資金約佔 ${ownPercent}%，具備穩健的起步條件。現階段重點在於將「安靜離職」的迷茫轉為每週具體的商圈蹲點與政策時數累積，勿衝動在第一個月簽約大花裝潢。`}
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
              <DollarSign className="h-4 w-4 text-emerald-700" />
              <span>政策資金調度建議</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-stone-600">
              {aiData?.fundingStrategy ||
                `保留至少 25 萬營運周轉金，缺口可優先運用「經濟部青年創業貸款 100 萬免保人」補足；再搭配「臺灣雲市集 3 萬元數位券」省下首年 iPad POS 軟體費。`}
            </p>
          </div>
        </div>

        {/* Critical Pitfall Alert for this store type */}
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>針對「{profile.storeTypeName}」三大致命踩雷警示</span>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs text-rose-800">
            {(
              aiData?.criticalPitfalls || [
                "水電安培數陷阱：老屋電盤常無法負載商業機具，簽約前務必請甲級水電現勘確認需否向台電申請加大容量。",
                "裝潢口頭追加款：拒絕統包『一式』模糊報價單，款項堅持依照工期分五期付款，驗收合格才付尾款 10%。",
                "租約營業登記盲區：務必在租賃契約加註『若因法規無法完成營業設立登記，無條件退還全額押金』。",
              ]
            ).map((pitfall, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-rose-700">•</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
