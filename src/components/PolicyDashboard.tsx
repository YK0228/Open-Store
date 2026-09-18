import { useState } from "react";
import {
  FileText,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Leaf,
  Filter,
  ArrowRight,
  Info,
  X,
} from "lucide-react";
import { PolicyTool, UserProfile } from "../types";
import { getMatchedPolicyTools } from "../utils/calculator";

interface PolicyDashboardProps {
  profile: UserProfile;
  onOpenConsultation: (policyName?: string) => void;
}

export function PolicyDashboard({
  profile,
  onOpenConsultation,
}: PolicyDashboardProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const matchedPolicies = getMatchedPolicyTools(profile);

  const filtered = matchedPolicies.filter((p) => {
    if (filterType === "all") return true;
    return p.type === filterType;
  });

  const handleDownloadTemplate = (docName: string) => {
    const templateText = `【${docName}】\n官方白話撰寫要點與審查通過架構指引\n適用對象：微型店家（咖啡、餐飲、選品、美業、輕食）\n\n` +
      `一、計畫核心摘要（審查委員 30 秒必讀點）：\n` +
      `1. 創辦人背景與創業起心動念（強調相關從業經驗或 20 小時培訓時數成果）\n` +
      `2. 目標店型定位與商圈客群洞察（為什麼在這個地點開這間店能活下來？）\n` +
      `3. 核心產品與定價毛利（平均客單價、毛利率、每日預計出單量）\n\n` +
      `二、資金需求與分年償還計畫：\n` +
      `- 自有資金準備額度：約 NT$ ${profile.ownFunds} 萬元\n` +
      `- 預計申貸/補助額度：約 NT$ ${Math.max(0, profile.targetBudget - profile.ownFunds)} 萬元\n` +
      `- 預估單月固定營運成本：店租 3-5 萬、水電 1 萬、人事薪資、原物料成本 (約佔營業額 30%)\n` +
      `- 損益平衡點推估：每日需完成多少筆客單即可打平，展現對財務嚴謹的控制力。\n\n` +
      `三、常見被行庫退件之深水區地雷：\n` +
      `1. 勿找坊間收費抽成代辦（代辦套版計畫書行庫經辦一眼即知，容易被列為高風險名單）\n` +
      `2. 確保個人聯徵紀錄良好（近期勿有信用卡循環利息或遲繳紀錄）\n` +
      `3. 公司或行號登記地址需為合法建物，能開立足額發票。\n\n` +
      `開店通祝您順利取得政策紅利，奪回人生主導權！`;

    const blob = new Blob([templateText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = docName.replace(".pdf", ".txt");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
      {/* Title & Description */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-700" />
            <h2 className="text-xl font-bold text-stone-900">
              政府政策工具與創業補助匹配儀表板
            </h2>
          </div>
          <p className="mt-1 text-xs text-stone-600">
            拒絕看不懂的政府官腔農場文！白話文解讀申請門檻，自動推薦最適合「{profile.storeTypeName}」的低利政策資金。
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 rounded-lg bg-stone-100 p-1 text-xs">
          {[
            { id: "all", label: "全部政策" },
            { id: "loan", label: "低利貸款" },
            { id: "subsidy", label: "免還補助" },
            { id: "esg", label: "節能低碳" },
            { id: "digital", label: "數位券" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                filterType === tab.id
                  ? "bg-white text-stone-900 font-bold shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Policy List */}
      <div className="mt-6 space-y-4">
        {filtered.map((policy) => {
          const typeColors: Record<string, string> = {
            loan: "bg-blue-50 text-blue-900 border-blue-200",
            subsidy: "bg-emerald-50 text-emerald-900 border-emerald-200",
            esg: "bg-teal-50 text-teal-900 border-teal-200",
            digital: "bg-purple-50 text-purple-900 border-purple-200",
          };

          return (
            <div
              key={policy.id}
              className="rounded-xl border border-stone-200 p-5 transition-all hover:border-stone-300 hover:shadow-xs"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                        typeColors[policy.type]
                      }`}
                    >
                      {policy.type === "loan" && "政策低利貸款"}
                      {policy.type === "subsidy" && "免償還補助款"}
                      {policy.type === "esg" && "綠色節能補貼"}
                      {policy.type === "digital" && "數位轉型紅包"}
                    </span>
                    <h3 className="text-base font-bold text-stone-900">
                      {policy.name}
                    </h3>
                    <span className="text-xs text-stone-500">
                      主管機關：{policy.agency}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-amber-900">
                    額度亮點：{policy.maxAmount} — {policy.highlight}
                  </p>
                </div>

                {/* Match Score Badge */}
                <div className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 border border-amber-200">
                  <span>匹配度</span>
                  <span className="text-sm font-black text-amber-800">
                    {policy.matchRate}%
                  </span>
                </div>
              </div>

              {/* Plain Summary */}
              <div className="mt-3 rounded-lg bg-stone-50 p-3 text-xs leading-relaxed text-stone-700">
                <span className="font-bold text-stone-900 mr-1">
                  【白話文核心解讀】
                </span>
                {policy.plainSummary}
              </div>

              {/* Conditions & Pitfall */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-stone-100 bg-white p-3">
                  <span className="text-[11px] font-bold text-stone-700">
                    申請門檻條件：
                  </span>
                  <ul className="mt-1.5 space-y-1 text-xs text-stone-600">
                    {policy.eligibilityConditions.map((cond, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-950">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-800" />
                    <span>避坑盲區提醒：</span>
                  </div>
                  <p className="mt-1.5 text-xs text-amber-900 leading-relaxed">
                    {policy.pitfallWarning}
                  </p>
                </div>
              </div>

              {/* Tags & Action Buttons */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-stone-100 pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {policy.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {policy.hasTemplate && policy.templateDocName && (
                    <button
                      onClick={() =>
                        handleDownloadTemplate(policy.templateDocName!)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5 text-stone-500" />
                      <span>下載計畫書白話範本</span>
                    </button>
                  )}

                  <button
                    onClick={() => onOpenConsultation(policy.name)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
                  >
                    <span>諮詢此方案</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
