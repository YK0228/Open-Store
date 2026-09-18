import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", aiEnabled: Boolean(process.env.GEMINI_API_KEY) });
  });

  // AI Diagnostic endpoint
  app.post("/api/ai/diagnose", async (req: Request, res: Response) => {
    const { profile } = req.body;
    if (!profile) {
      res.status(400).json({ error: "Missing profile information" });
      return;
    }

    try {
      const ai = getAI();
      if (!ai) {
        // Return default structured insights
        res.json({
          source: "fallback",
          insights: generateFallbackInsights(profile),
        });
        return;
      }

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
      } catch (err) {
        parsed = generateFallbackInsights(profile);
      }

      res.json({
        source: "gemini",
        insights: parsed,
      });
    } catch (error: any) {
      console.error("AI Diagnose error:", error);
      res.json({
        source: "fallback",
        insights: generateFallbackInsights(profile),
      });
    }
  });

  // AI Q&A consultation assistant
  app.post("/api/ai/ask", async (req: Request, res: Response) => {
    const { question, storeType } = req.body;
    if (!question) {
      res.status(400).json({ error: "Missing question" });
      return;
    }

    try {
      const ai = getAI();
      if (!ai) {
        res.json({
          answer: getFallbackAnswer(question),
        });
        return;
      }

      const prompt = `你是台灣微型創業開店避坑專家「開店通 AI 顧問」。
使用者是一位準備開設「${storeType || "微型風格小店"}」的 28-40 歲上班族/斜槓青年。
使用者的疑問：『${question}』

請用專業、直白白話、具有實戰避坑經驗的口吻回答（繁體中文，約 150-250 字）。
重點提醒：
1. 直切核心痛點，不說官腔與農場文廢話。
2. 點出法律/法規/合約、水電裝潢、稅籍或政府政策（如青創貸款利息補貼、商業登記、勞基法規定）具體眉角。
3. 給予 1 個立竿見影的下一步行動。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.6,
        },
      });

      res.json({
        answer: response.text || getFallbackAnswer(question),
      });
    } catch (err: any) {
      console.error("AI Ask error:", err);
      res.json({
        answer: getFallbackAnswer(question),
      });
    }
  });

  // Leads submission endpoint (quote/consultation request)
  app.post("/api/leads/submit", (req: Request, res: Response) => {
    const { leadData } = req.body;
    const bookingId = "KD-" + Math.floor(100000 + Math.random() * 900000);
    res.json({
      success: true,
      bookingId,
      message: "預約成功！開店通顧問團隊將於 24 小時內與您聯繫。",
      receivedAt: new Date().toISOString(),
      lead: leadData,
    });
  });

  // Vite middleware / static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

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

function getFallbackAnswer(question: string): string {
  if (question.includes("裝潢") || question.includes("統包")) {
    return "新手開店強烈建議「重視圖面與契約驗收」，若非建築設計背景，找口碑良好的統包工程比自己拆包安全得多，能避免水電、木作、泥作相互踢皮球。關鍵原則：合約款項必須分 4-5 期（如簽約 10%、進場 30%、泥水水電完工 30%、木作油漆 20%、驗收無誤 10%），切勿一次預付超過半數！";
  }
  if (question.includes("貸款") || question.includes("補助") || question.includes("青年")) {
    return "經濟部「青年創業及啟動金貸款」是 18-45 歲創業者的黃金首選。資本額或核貸 100 萬元以下免保證人、由中小企業信保基金提供最少 9.5 成保證，前 5 年利息常享有政府補貼。關鍵準備：需先上滿 20 小時創業輔導課程（線上免費可認證），且公司或商號需設立登記未滿 5 年。";
  }
  if (question.includes("租約") || question.includes("店面") || question.includes("房東")) {
    return "商用租約三大雷區：1. 必須約定房東無條件同意設立營業登記（否則無法開發票與辦補助）；2. 約定免租裝潢期（通常爭取 2-4 週）；3. 營業用電水費計算方式要寫明，避免房東照最高級距隨意收費。";
  }
  return "微型創業最忌諱把所有自有資金在裝潢第一個月燒光。建議將啟動資金分成：硬體裝潢設備 50%、原物料與預付租押金 25%、不可動用的現金流防空洞（營運周轉金）25%。第一步請先鎖定最小可行性商品（MVP），在市集或線上驗證客群，再落地實體店面。";
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
