import { AlertTriangle, DollarSign, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { PITFALL_STORIES } from "../data/storeData";
import { PitfallStory } from "../types";

interface PitfallLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export function PitfallLibraryModal({
  isOpen,
  onClose,
  onOpenConsultation,
}: PitfallLibraryModalProps) {
  if (!isOpen) return null;

  const categoryLabels: Record<string, string> = {
    renovation: "水電裝潢追加款",
    contract: "商用租約與營業登記",
    equipment: "二手生財設備陷阱",
    cashflow: "現金流斷鏈與周轉",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                微型創業「避坑血淚精選庫」
              </h2>
              <p className="text-xs text-stone-600">
                前輩用數十萬真金白銀換來的慘痛教訓，替你的上班積蓄築起防護網。
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stories List */}
        <div className="mt-5 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {PITFALL_STORIES.map((story) => (
            <div
              key={story.id}
              className="rounded-xl border border-stone-200 bg-stone-50/50 p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-stone-200 px-2 py-0.5 text-xs font-bold text-stone-800">
                  {categoryLabels[story.category] || "避坑案例"}
                </span>
                <span className="text-xs text-stone-500">{story.persona}</span>
              </div>

              <h3 className="text-base font-bold text-stone-900">
                {story.title}
              </h3>

              {/* The Mistake */}
              <div className="rounded-lg bg-white p-3 text-xs leading-relaxed text-stone-700 border border-stone-100">
                <span className="font-bold text-stone-900 block mb-1">
                  踩雷經過：
                </span>
                {story.theMistake}
              </div>

              {/* Burned Amount Badge */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>代價：{story.burnedAmount}</span>
              </div>

              {/* Key Takeaway */}
              <div className="rounded-lg bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-950 border border-amber-200/80">
                <span className="font-bold text-amber-900 block mb-1">
                  開店通避坑心法：
                </span>
                {story.keyTakeaway}
              </div>

              {/* Checklist Rule */}
              <div className="flex items-start gap-2 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong className="font-bold text-emerald-950">合約防守底線：</strong>
                  {story.checklistRule}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100 pt-4">
          <span className="text-xs text-stone-500">
            遇到類似合約或報價問題？開店通提供免費合約防坑初審。
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              關閉案例庫
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800"
            >
              預約專業顧問審查
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
