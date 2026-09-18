import {
  Smartphone,
  QrCode,
  CreditCard,
  Leaf,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { DigitalSolution } from "../types";
import { DIGITAL_SOLUTIONS } from "../data/storeData";

interface DigitalTransformationPackProps {
  onOpenConsultation: (toolName?: string) => void;
}

export function DigitalTransformationPack({
  onOpenConsultation,
}: DigitalTransformationPackProps) {
  const categoryIcons: Record<string, React.ReactNode> = {
    pos: <Smartphone className="h-5 w-5 text-amber-700" />,
    ordering: <QrCode className="h-5 w-5 text-blue-600" />,
    payment: <CreditCard className="h-5 w-5 text-purple-600" />,
    esg: <Leaf className="h-5 w-5 text-emerald-700" />,
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-700" />
            <h2 className="text-xl font-bold text-stone-900">
              現代店鋪數位轉型包與低碳（ESG）營運導航
            </h2>
          </div>
          <p className="mt-1 text-xs text-stone-600">
            新手開店不再手忙腳亂！嚴選微型小店必備之雲端 POS、自動點餐與低碳節能設備，一開幕就具備現代競爭力。
          </p>
        </div>

        <button
          onClick={() => onOpenConsultation("數位轉型與節能設備統包")}
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 transition-colors shrink-0"
        >
          <span>一鍵索取轉型工具報價</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {DIGITAL_SOLUTIONS.map((tool) => (
          <div
            key={tool.id}
            className="flex flex-col justify-between rounded-xl border border-stone-200 p-5 transition-all hover:border-stone-300 hover:shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                    {categoryIcons[tool.category]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 sm:text-base">
                      {tool.name}
                    </h3>
                    <span className="text-xs text-stone-500 font-medium">
                      {tool.provider}
                    </span>
                  </div>
                </div>

                {tool.badge && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Highlight & Price */}
              <div className="mt-3 rounded-lg bg-stone-50 p-3">
                <p className="text-xs font-semibold text-stone-900">
                  {tool.highlight}
                </p>
                <div className="mt-1 text-[11px] text-stone-600 font-medium">
                  費用參考：{tool.priceModel}
                </div>
              </div>

              {/* Pros */}
              <div className="mt-3 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-700">
                  實戰效益：
                </span>
                <ul className="space-y-1 text-xs text-stone-600">
                  {tool.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ESG feature tag if present */}
              {tool.esgFeature && (
                <div className="mt-3 flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs text-emerald-900 border border-emerald-200">
                  <Leaf className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span className="font-semibold">ESG 亮點：</span>
                  <span>{tool.esgFeature}</span>
                </div>
              )}

              {/* Watch out */}
              <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/50 p-2.5 text-xs text-amber-950">
                <div className="flex items-start gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber-800 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 mr-1">
                      魔鬼細節注意：
                    </span>
                    {tool.watchOut}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-stone-100 pt-3">
              <button
                onClick={() => onOpenConsultation(tool.name)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors"
              >
                <span>索取此方案優惠報價</span>
                <ArrowRight className="h-3.5 w-3.5 text-stone-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
