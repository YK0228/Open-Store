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
    const { question, storeType } = body || {};

    if (!question) {
      return new Response(JSON.stringify({ error: "Missing question" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          answer: getFallbackAnswer(question),
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

    return new Response(
      JSON.stringify({
        answer: response.text || getFallbackAnswer(question),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Cloudflare ask error:", err);
    return new Response(
      JSON.stringify({
        answer: getFallbackAnswer(""),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

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
