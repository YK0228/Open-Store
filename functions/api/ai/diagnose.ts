import { GoogleGenAI } from "@google/genai";

interface Env {
  GEMINI_API_KEY: string;
}

interface PagesContext<T = any> {
  request: Request;
  env: T;
  next: () => Promise<Response>;
}

export const onRequestPost = async (context: PagesContext<Env>): Promise<Response> => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as any;
    const profile = body?.profile;

    if (!profile) {
      return new Response(JSON.stringify({ error: "Missing profile information" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          source: "fallback",
          insights: generateFallbackInsights(profile),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `你是台灣微型創業與中小企業政策資深開店顧問「開店通 AI 導航員」。
請針對以下台灣 28-40 歲「安靜離職/斜槓轉全職」的新手店主 profile，提供專業、銳利、溫暖且避坑的客製化診斷報告：

使用者背景：
- 預計店型：${profile.storeTypeName || profile.storeType}
- 預估店面規模：${profile.storeScale || "小型獨立店面"}
- 預期所在區域商圈：${profile.region || "雙北/都會商圈"}
- 自有準備資金：約 NT$ ${profile.ownFunds} 萬元
- 預估開店總預算：約 NT$ ${profile.targetBudget} 萬元
- 資金缺口：約 NT$ ${Math.max(0, profile.targetBudget - profile.ownFunds)} 萬元
- 當前職業狀態：${profile.currentStatus || "全職上班族考慮離職"}
- 每週可籌備時數：${profile.weeklyHours || "10-15小時"}
- 最擔心的深水區痛點：${(profile.concerns || []).join("、") || "怕燒光積蓄、裝潢踩雷、政府補助不懂如何下手"}

請以繁體中文（台灣習慣用語，如「青創貸款」、「營業稅籍」、「統包/分包」、「頂讓」），返回一段簡潔結構化的 JSON 格式，不要包含 markdown 標籤，純 JSON：
{
  "advisorQuote": "一句直指核心並給予心理定錨的顧問打氣叮嚀（約35-50字）",
  "readinessSummary": "對其目前資金比例與時間投入的客觀綜合評述（約80字）",
  "fundingStrategy": "具體資金調度組合建議（包含自有資金比例、建議申貸之政策工具如青年創業貸款、微創鳳凰或SBIR建議，約100字）",
  "criticalPitfalls": [
    "第一條針對該店型最容易踩雷的裝潢或租約深水區",
    "第二條針對該店型最容易忽視的營運周轉或法規盲區",
    "第三條給安靜離職上班族的心理與時間切換建議"
  ],
  "firstActionStep": "當前階段通勤或週末最該立刻做的第一件具體小事（不超過40字）"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = generateFallbackInsights(profile);
    }

    return new Response(
      JSON.stringify({
        source: "gemini",
        insights: parsed,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Cloudflare diagnose error:", error);
    const body = (await request.clone().json().catch(() => ({}))) as any;
    return new Response(
      JSON.stringify({
        source: "fallback",
        insights: generateFallbackInsights(body?.profile || {}),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

function generateFallbackInsights(profile: any) {
  const own = Number(profile.ownFunds) || 60;
  const target = Number(profile.targetBudget) || 120;
  const gap = Math.max(0, target - own);
  const ownRatio = Math.round((own / (target || 1)) * 100);

  return {
    advisorQuote: `「創業不是賭上身家的豪賭，而是用科學配比把風險關在籠子裡的精密計算。」`,
    readinessSummary: `自有資金佔比約 ${ownRatio}%，資金儲備${ownRatio >= 60 ? "健康穩定" : "具備適度槓桿空間"}。配合政府青年創業貸款與政策利息補貼，可有效降低初期現金流壓力。`,
    fundingStrategy: `建議保留至少 4-6 個月的營運周轉金（約 ${Math.round(target * 0.25)} 萬元），缺口 ${gap} 萬元可優先透過「經濟部青年創業及啟動金貸款（100萬內免保人、政府補貼）」補足，避免過早動用高利民間貸款或個人信用貸款。`,
    criticalPitfalls: [
      `裝潢水電深水區：商業用電安培數與瓦斯管線常超出預期，簽約前務必請水電師傅現場勘查，合約嚴格約定「完工驗收無誤才付尾款 20%」。`,
      `店面法規盲區：台北市與主要都會區對餐飲油煙排氣、土地使用分區管制嚴格，頂讓前務必先查詢該地址是否能完成「商業營業登記」。`,
      `上班族心理調適：安靜離職階段切忌衝動裸辭，利用晚間與週末完成菜單盲測與政策培訓 20 小時時數，拿到青創申請門檻再遞件。`,
    ],
    firstActionStep: `本週完成線上青創培訓 20 小時認證（免費公務人員 E 等學習網），並盤點目標商圈 3 間競品客單價。`,
  };
}
