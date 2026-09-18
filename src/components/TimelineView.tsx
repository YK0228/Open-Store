import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Clock,
  Sparkles,
} from "lucide-react";
import { PreparationPhase, PreparationTask } from "../types";
import { PREPARATION_PHASES } from "../data/storeData";

interface TimelineViewProps {
  storeTypeName: string;
}

export function TimelineView({ storeTypeName }: TimelineViewProps) {
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("kaidian_completed_tasks");
      return saved ? JSON.parse(saved) : ["p1-1"];
    } catch {
      return ["p1-1"];
    }
  });

  const [expandedPhaseId, setExpandedPhaseId] = useState<string>("phase-1");

  useEffect(() => {
    try {
      localStorage.setItem(
        "kaidian_completed_tasks",
        JSON.stringify(completedTaskIds)
      );
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  }, [completedTaskIds]);

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const allTasks = PREPARATION_PHASES.flatMap((p) => p.tasks);
  const totalTasks = allTasks.length;
  const completedCount = completedTaskIds.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const categoryLabels: Record<
    string,
    { label: string; color: string }
  > = {
    finance: { label: "資金政策", color: "bg-blue-50 text-blue-800 border-blue-200" },
    legal: { label: "工商法規", color: "bg-purple-50 text-purple-800 border-purple-200" },
    space: { label: "水電選址", color: "bg-amber-50 text-amber-900 border-amber-200" },
    digital: { label: "數位ESG", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    launch: { label: "試營運", color: "bg-stone-100 text-stone-800 border-stone-200" },
  };

  const handleExportChecklist = () => {
    const textContent = `【開店通】專屬籌備任務清單 — ${storeTypeName}\n完成進度：${completedCount} / ${totalTasks} (${progressPercent}%)\n\n` +
      PREPARATION_PHASES.map((p) => {
        return `== 第 ${p.phaseNumber} 階段：${p.title} (${p.period}) ==\n` +
          p.tasks
            .map((t) => {
              const done = completedTaskIds.includes(t.id) ? "[v]" : "[ ]";
              return `${done} ${t.title}\n   - 說明：${t.description}\n   ${t.pitfallTip ? `- 避坑提醒：${t.pitfallTip}\n` : ""}`;
            })
            .join("\n");
      }).join("\n\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `開店通_${storeTypeName}_從0到1籌備清單.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
      {/* Header & Overall progress bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-700" />
            <h2 className="text-xl font-bold text-stone-900">
              從 0 到 1 專屬籌備任務時間軸
            </h2>
          </div>
          <p className="mt-1 text-xs text-stone-600">
            針對「{storeTypeName}」設計的 5 大階段里程碑。勾選完成進度，逐步奪回人生自主權。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportChecklist}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>匯出離線清單</span>
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">
            <span>已完成</span>
            <span className="text-sm font-black text-amber-700">
              {completedCount} / {totalTasks}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs text-stone-500">
          <span>籌備實體化進度</span>
          <span className="font-bold text-stone-900">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full bg-amber-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase Accordion */}
      <div className="mt-6 space-y-4">
        {PREPARATION_PHASES.map((phase) => {
          const isExpanded = expandedPhaseId === phase.id;
          const phaseTasks = phase.tasks;
          const phaseCompleted = phaseTasks.filter((t) =>
            completedTaskIds.includes(t.id)
          ).length;

          return (
            <div
              key={phase.id}
              className={`overflow-hidden rounded-xl border transition-all ${
                isExpanded
                  ? "border-stone-300 bg-stone-50/50 shadow-2xs"
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}
            >
              {/* Phase Header */}
              <div
                onClick={() =>
                  setExpandedPhaseId(isExpanded ? "" : phase.id)
                }
                className="flex cursor-pointer items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      phaseCompleted === phaseTasks.length
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-900 text-white"
                    }`}
                  >
                    {phase.phaseNumber}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900 sm:text-base">
                        第 {phase.phaseNumber} 階段：{phase.title}
                      </h3>
                      <span className="rounded-md bg-stone-200/80 px-2 py-0.5 text-[11px] font-medium text-stone-700">
                        {phase.period}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-stone-600 line-clamp-1">
                      {phase.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-stone-500">
                    {phaseCompleted} / {phaseTasks.length} 完成
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-stone-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-stone-500" />
                  )}
                </div>
              </div>

              {/* Tasks List */}
              {isExpanded && (
                <div className="border-t border-stone-200/80 bg-white p-4 space-y-3">
                  {phaseTasks.map((task) => {
                    const isDone = completedTaskIds.includes(task.id);
                    const cat = categoryLabels[task.category] || {
                      label: "一般",
                      color: "bg-stone-100 text-stone-700",
                    };

                    return (
                      <div
                        key={task.id}
                        className={`rounded-xl border p-3.5 transition-all ${
                          isDone
                            ? "border-emerald-200 bg-emerald-50/20"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleTask(task.id)}
                            className="mt-0.5 shrink-0 transition-transform active:scale-95"
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-stone-300 hover:text-stone-400" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4
                                className={`text-sm font-bold ${
                                  isDone
                                    ? "text-stone-500 line-through"
                                    : "text-stone-900"
                                }`}
                              >
                                {task.title}
                              </h4>
                              {task.isCrucial && (
                                <span className="rounded-sm bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                                  關鍵必辦
                                </span>
                              )}
                              <span
                                className={`rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ${cat.color}`}
                              >
                                {cat.label}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                              {task.description}
                            </p>

                            {/* Pitfall Tip */}
                            {task.pitfallTip && (
                              <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-amber-50/70 p-2.5 text-xs text-amber-950 border border-amber-200/70">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-800 mt-0.5" />
                                <div className="leading-snug">
                                  <span className="font-bold text-amber-900 mr-1">
                                    避坑指引：
                                  </span>
                                  {task.pitfallTip}
                                </div>
                              </div>
                            )}

                            {/* Official Doc Hint */}
                            {task.officialDocHint && (
                              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
                                <FileText className="h-3.5 w-3.5 text-stone-400" />
                                <span>對應官方證明：{task.officialDocHint}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
