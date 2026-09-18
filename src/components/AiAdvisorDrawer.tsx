import { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { UserProfile } from "../types";

interface AiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function AiAdvisorDrawer({
  isOpen,
  onClose,
  profile,
}: AiAdvisorDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `嗨！我是你的開店通 AI 避坑導航顧問。針對你想籌備的「${profile.storeTypeName}」，無論是水電裝潢防坑、青年創業貸款 100 萬免保人申請細節，還是安靜離職階段的時間切換，隨時直接問我！`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickQuestions = [
    "在職上班族申辦青創貸款，原公司會知道嗎？",
    "裝潢報價統包好還是自己拆包分工？",
    "商用店面租約一定要寫哪些條款防房東反悔？",
    "二手商用義式機/冰箱能買嗎？水有多深？",
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || inputQuery;
    if (!q.trim() || isLoading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: "user", text: q }];
    setMessages(newMsgs);
    if (!questionText) setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          storeType: profile.storeTypeName,
        }),
      });
      const data = await res.json();
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          text:
            data.answer ||
            "微型創業最重謹慎調度資金與審核合約細節。建議步步為營，先完成最小可行性產品盲測與青創 20 小時培訓時數。",
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          text:
            "網路通訊稍有延遲，但原則上：經濟部青年創業貸款核貸 100 萬以內免保人，需先在 e 等公務園上完 20 小時時數，銀行核貸是看負責人個人信用與公司計畫書，並不會主動通知原在職公司。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl border-l border-stone-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              開店通 AI 避坑顧問
            </h3>
            <span className="text-[11px] text-stone-500">
              專屬導航・{profile.storeTypeName}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="border-b border-stone-100 bg-amber-50/40 p-3">
        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900 mb-2">
          <HelpCircle className="h-3 w-3" />
          上班族最常發問的痛點：
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="rounded-md border border-amber-200 bg-white px-2 py-1 text-[11px] text-stone-700 hover:bg-amber-100/60 hover:text-stone-900 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                m.role === "user"
                  ? "bg-stone-900 text-white"
                  : "bg-amber-600 text-white"
              }`}
            >
              {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-800 border border-stone-200/80"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-600" />
            <span>AI 顧問正在調閱法規與實戰案例...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 p-3 bg-stone-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="輸入任何關於水電、租約或補助問題..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-600 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="rounded-xl bg-stone-900 p-2 text-white hover:bg-stone-800 disabled:opacity-40 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
