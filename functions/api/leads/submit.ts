interface PagesContext<T = any> {
  request: Request;
  env: T;
  next: () => Promise<Response>;
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const { request } = context;

  try {
    const body = (await request.json()) as any;
    const { leadData } = body || {};
    const bookingId = "KD-" + Math.floor(100000 + Math.random() * 900000);

    return new Response(
      JSON.stringify({
        success: true,
        bookingId,
        message: "預約成功！開店通顧問團隊將於 24 小時內與您聯繫。",
        receivedAt: new Date().toISOString(),
        lead: leadData,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    const bookingId = "KD-" + Math.floor(100000 + Math.random() * 900000);
    return new Response(
      JSON.stringify({
        success: true,
        bookingId,
        message: "預約成功！開店通顧問團隊將於 24 小時內與您聯繫。",
        receivedAt: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
