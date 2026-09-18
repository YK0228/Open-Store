interface Env {
  GEMINI_API_KEY?: string;
}

interface PagesContext<T = any> {
  request: Request;
  env: T;
}

export const onRequestGet = async (context: PagesContext<Env>): Promise<Response> => {
  return new Response(
    JSON.stringify({
      status: "ok",
      platform: "cloudflare-pages",
      aiEnabled: Boolean(context.env?.GEMINI_API_KEY),
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
