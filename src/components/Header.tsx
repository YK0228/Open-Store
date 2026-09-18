import { Store, ShieldAlert, Sparkles, BookOpen, MessageSquareText } from "lucide-react";

interface HeaderProps {
  currentTab: "quiz" | "report" | "pitfalls";
  onTabChange: (tab: "quiz" | "report" | "pitfalls") => void;
  hasCompletedQuiz: boolean;
  onOpenConsultation: () => void;
  onOpenAiChat: () => void;
}

export function Header({
  currentTab,
  onTabChange,
  hasCompletedQuiz,
  onOpenConsultation,
  onOpenAiChat,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand logo & title */}
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => onTabChange(hasCompletedQuiz ? "report" : "quiz")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/20">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-stone-900">
                開店通
              </span>
              <span className="hidden rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 sm:inline-block">
                微型創業第一站
              </span>
            </div>
            <p className="text-xs text-stone-700">
              奪回人生主導權・上班族微型開店新手導航
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <nav className="flex rounded-lg bg-stone-200/70 p-1 text-xs font-medium text-stone-600 sm:text-sm">
            <button
              id="nav-quiz-btn"
              onClick={() => onTabChange("quiz")}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                currentTab === "quiz"
                  ? "bg-white font-semibold text-stone-900 shadow-xs"
                  : "hover:text-stone-900"
              }`}
            >
              創業適性診斷
            </button>
            <button
              id="nav-report-btn"
              onClick={() => onTabChange("report")}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                currentTab === "report"
                  ? "bg-white font-semibold text-stone-900 shadow-xs"
                  : "hover:text-stone-900"
              } ${!hasCompletedQuiz ? "opacity-75" : ""}`}
            >
              開店儀表板
              {!hasCompletedQuiz && (
                <span className="ml-1 text-[10px] text-amber-800">預覽</span>
              )}
            </button>
            <button
              id="nav-pitfalls-btn"
              onClick={() => onTabChange("pitfalls")}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors ${
                currentTab === "pitfalls"
                  ? "bg-white font-semibold text-stone-900 shadow-xs"
                  : "hover:text-stone-900"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-800" />
              <span>避坑精選</span>
            </button>
          </nav>

          {/* Quick AI & Consultation CTAs */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              id="header-ai-advisor-btn"
              onClick={onOpenAiChat}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-800" />
              <span>AI 避坑顧問</span>
            </button>

            <button
              id="header-consult-btn"
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-stone-800 transition-colors"
            >
              <MessageSquareText className="h-3.5 w-3.5 text-amber-400" />
              <span>預約專家諮詢</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
