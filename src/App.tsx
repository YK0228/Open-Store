import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DiagnosticQuiz } from "./components/DiagnosticQuiz";
import { ReportSummaryCard } from "./components/ReportSummaryCard";
import { TimelineView } from "./components/TimelineView";
import { PolicyDashboard } from "./components/PolicyDashboard";
import { DigitalTransformationPack } from "./components/DigitalTransformationPack";
import { PitfallLibraryModal } from "./components/PitfallLibraryModal";
import { ConsultationModal } from "./components/ConsultationModal";
import { AiAdvisorDrawer } from "./components/AiAdvisorDrawer";
import { UserProfile, ReadinessScore } from "./types";
import { calculateReadiness } from "./utils/calculator";
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  Smartphone,
  ShieldAlert,
  MessageSquareText,
  RotateCcw,
  Bot,
} from "lucide-react";

const DEFAULT_PROFILE: UserProfile = {
  storeType: "cafe",
  storeTypeName: "獨立風格咖啡廳",
  storeScale: "獨立小館 (7-12 坪)",
  region: "生活感文青社區巷弄",
  ownFunds: 70,
  targetBudget: 130,
  currentStatus: "quiet_quitting",
  weeklyHours: "10-20",
  concerns: [
    "裝潢水電報價不透明，被統包廠商當肥羊宰割",
    "政策補助與青創貸款如天書，不知道如何合法申請",
    "開幕前幾個月營收不如預期，資金斷鏈燒光積蓄",
  ],
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("kaidian_user_profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(() => {
    try {
      return localStorage.getItem("kaidian_quiz_completed") === "true";
    } catch {
      return false;
    }
  });

  const [currentTab, setCurrentTab] = useState<"quiz" | "report" | "pitfalls">(
    hasCompletedQuiz ? "report" : "quiz"
  );

  const [activeReportSection, setActiveReportSection] = useState<
    "overview" | "timeline" | "policy" | "digital"
  >("overview");

  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [consultationTopic, setConsultationTopic] = useState<string | undefined>();
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isPitfallsModalOpen, setIsPitfallsModalOpen] = useState<boolean>(false);

  // Save profile changes
  useEffect(() => {
    try {
      localStorage.setItem("kaidian_user_profile", JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  const score: ReadinessScore = calculateReadiness(profile);

  const handleQuizComplete = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setHasCompletedQuiz(true);
    try {
      localStorage.setItem("kaidian_quiz_completed", "true");
    } catch (e) {
      console.error(e);
    }
    setCurrentTab("report");
    setActiveReportSection("overview");
  };

  const handleOpenConsultationWithTopic = (topic?: string) => {
    setConsultationTopic(topic);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-amber-100 selection:text-amber-900 pb-20 sm:pb-12">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === "pitfalls") {
            setIsPitfallsModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        hasCompletedQuiz={hasCompletedQuiz}
        onOpenConsultation={() => handleOpenConsultationWithTopic("開店通專屬專家諮詢")}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* VIEW 1: Assessment Quiz */}
        {currentTab === "quiz" && (
          <DiagnosticQuiz
            initialProfile={profile}
            onComplete={handleQuizComplete}
          />
        )}

        {/* VIEW 2: Report & Dashboard */}
        {currentTab === "report" && (
          <div className="space-y-6">
            {/* Sub-navigation bar inside report */}
            <div className="sticky top-[61px] z-30 flex items-center justify-between overflow-x-auto rounded-xl border border-stone-200/90 bg-stone-50/95 p-1.5 backdrop-blur-md shadow-2xs">
              <div className="flex items-center gap-1">
                <button
                  id="section-overview-btn"
                  onClick={() => setActiveReportSection("overview")}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    activeReportSection === "overview"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>體檢總覽與資金試算</span>
                </button>

                <button
                  id="section-timeline-btn"
                  onClick={() => setActiveReportSection("timeline")}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    activeReportSection === "timeline"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  <span>0 到 1 籌備時間軸</span>
                </button>

                <button
                  id="section-policy-btn"
                  onClick={() => setActiveReportSection("policy")}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    activeReportSection === "policy"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>政策與補助儀表板</span>
                </button>

                <button
                  id="section-digital-btn"
                  onClick={() => setActiveReportSection("digital")}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    activeReportSection === "digital"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5 text-blue-400" />
                  <span>數位轉型與低碳導航</span>
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-2 pr-1">
                <button
                  onClick={() => setIsPitfallsModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                  <span>避坑案例庫</span>
                </button>
              </div>
            </div>

            {/* Sub-sections */}
            {activeReportSection === "overview" && (
              <div className="space-y-6">
                <ReportSummaryCard
                  profile={profile}
                  score={score}
                  onOpenAiConsult={() => setIsAiChatOpen(true)}
                  onRetest={() => setCurrentTab("quiz")}
                />
                <PolicyDashboard
                  profile={profile}
                  onOpenConsultation={handleOpenConsultationWithTopic}
                />
                <TimelineView storeTypeName={profile.storeTypeName} />
                <DigitalTransformationPack
                  onOpenConsultation={handleOpenConsultationWithTopic}
                />
              </div>
            )}

            {activeReportSection === "timeline" && (
              <TimelineView storeTypeName={profile.storeTypeName} />
            )}

            {activeReportSection === "policy" && (
              <PolicyDashboard
                profile={profile}
                onOpenConsultation={handleOpenConsultationWithTopic}
              />
            )}

            {activeReportSection === "digital" && (
              <DigitalTransformationPack
                onOpenConsultation={handleOpenConsultationWithTopic}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile Users during Commute */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5 sm:hidden">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg ring-4 ring-amber-600/20 active:scale-95 transition-transform"
          aria-label="開啟 AI 避坑顧問"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>

      {/* Modals & Drawers */}
      <PitfallLibraryModal
        isOpen={isPitfallsModalOpen}
        onClose={() => setIsPitfallsModalOpen(false)}
        onOpenConsultation={() => {
          setIsPitfallsModalOpen(false);
          handleOpenConsultationWithTopic("水電合約與防坑審查");
        }}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        profile={profile}
        initialTopic={consultationTopic}
      />

      <AiAdvisorDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        profile={profile}
      />
    </div>
  );
}
