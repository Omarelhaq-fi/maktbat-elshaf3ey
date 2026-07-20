import { createServerFn } from "@tanstack/react-start";

type OrderItem = { name: string; price: number; qty: number };
type Payload = {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  total: number;
  items: OrderItem[];
};

function buildOrderText(data: Payload, cancelled = false) {
  const itemsText = data.items
    .map((i) => `• ${i.name} × ${i.qty} = ${(i.price * i.qty).toFixed(2)} ج`)
    .join("\n");
  const header = cancelled
    ? `❌ <b>طلب ملغي — مكتبة الشافعي</b>`
    : `🛒 <b>طلب جديد — مكتبة الشافعي</b>`;
  return (
    `${header}\n\n` +
    `<b>رقم الطلب:</b> <code>${data.orderId}</code>\n` +
    `<b>الاسم:</b> ${data.customerName}\n` +
    `<b>الموبايل:</b> ${data.phone}\n` +
    `<b>العنوان:</b> ${data.address}\n` +
    (data.notes ? `<b>ملاحظات:</b> ${data.notes}\n` : "") +
    `\n<b>المنتجات:</b>\n${itemsText}\n\n` +
    `<b>الإجمالي:</b> ${data.total.toFixed(2)} جنيه\n` +
    `<b>الدفع:</b> عند الاستلام` +
    (cancelled ? `\n\n🚫 <b>الحالة:</b> ملغي من العميل` : "")
  );
}

export const notifyNewOrder = createServerFn({ method: "POST" })
  .inputValidator((data: Payload) => data)
  .handler(async ({ data }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      console.error("Telegram env vars missing");
      return { ok: false, messageId: null as number | null };
    }

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildOrderText(data),
          parse_mode: "HTML",
        }),
      });
      const body = await res.json();
      if (!res.ok || !body?.ok) {
        console.error("Telegram send failed:", res.status, body);
        return { ok: false, messageId: null as number | null };
      }
      return { ok: true, messageId: (body.result?.message_id as number) ?? null };
    } catch (err) {
      console.error("Telegram send error:", err);
      return { ok: false, messageId: null as number | null };
    }
  });

export const notifyOrderCancelled = createServerFn({ method: "POST" })
  .inputValidator((data: Payload & { messageId: number | null }) => data)
  .handler(async ({ data }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return { ok: false };

    const text = buildOrderText(data, true);

    if (!data.messageId) {
      console.error("Telegram cancel: no messageId on order, skipping (won't send a new message)");
      return { ok: false, reason: "no_message_id" };
    }
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: data.messageId,
          text,
          parse_mode: "HTML",
        }),
      });
      if (res.ok) return { ok: true };
      const body = await res.text();
      console.error("Telegram edit failed:", res.status, body);
      return { ok: false, reason: "edit_failed" };
    } catch (err) {
      console.error("Telegram cancel error:", err);
      return { ok: false, reason: "exception" };
    }
  });

