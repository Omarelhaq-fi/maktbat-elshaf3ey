import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { prepareOrderId, createOrderWithId } from "@/lib/products";
import { notifyNewOrder } from "@/lib/notify.functions";

import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "إتمام الطلب — مكتبة الشافعي" }] }),
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const storageKey = user ? `shafi:delivery:${user.uid}` : null;
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((f) => ({
          customerName: parsed.customerName ?? f.customerName,
          phone: parsed.phone ?? f.phone,
          address: parsed.address ?? f.address,
          notes: f.notes,
        }));
      }
    } catch { /* ignore */ }
  }, [storageKey]);


  if (!authLoading && !user) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-lg font-bold text-brand-dark">لازم تسجل دخول علشان تكمل الطلب</p>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white">
          تسجيل الدخول
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-lg font-bold text-brand-dark">السلة فاضية</p>
        <Link to="/products" className="mt-6 inline-flex rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white">
          تسوق دلوقتي
        </Link>
      </section>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.customerName.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("املأ كل الحقول المطلوبة");
      return;
    }
    setSubmitting(true);
    try {
      const orderId = await prepareOrderId();
      const notifyRes = await notifyNewOrder({
        data: {
          orderId,
          customerName: form.customerName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          notes: form.notes.trim() || undefined,
          total,
          items: items.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
        },
      }).catch(() => ({ ok: false, messageId: null as number | null }));
      await createOrderWithId(orderId, {
        userId: user.uid,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || undefined,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total,
        paymentMethod: "cod",
        telegramMessageId: notifyRes?.messageId ?? undefined,
      });

      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify({
            customerName: form.customerName.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
          }));
        } catch { /* ignore */ }
      }
      clear();
      toast.success("تم إرسال الطلب!");
      navigate({ to: "/my-orders", search: { new: orderId } as never });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "حصل خطأ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-brand-dark sm:text-4xl">إتمام الطلب</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-xl font-extrabold text-brand-dark">بيانات التوصيل</h2>
          {[
            { key: "customerName", label: "الاسم بالكامل", type: "text", required: true },
            { key: "phone", label: "رقم الموبايل", type: "tel", required: true },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-bold text-brand-dark mb-1">{f.label} *</label>
              <input
                type={f.type}
                required={f.required}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-1">العنوان بالتفصيل *</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-1">ملاحظات (اختياري)</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div className="rounded-xl bg-brand-gold/20 p-4 text-sm text-brand-dark">
            💰 <strong>الدفع كاش عند الاستلام</strong>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand-dark py-3 text-sm font-bold text-white hover:bg-brand-orange transition-colors disabled:opacity-50"
          >
            {submitting ? "جاري إرسال الطلب..." : "أكد الطلب"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6 sticky top-24">
          <h2 className="text-lg font-extrabold text-brand-dark">ملخص الطلب</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span className="line-clamp-1">{i.name} × {i.qty}</span>
                <span className="font-bold">{i.price * i.qty} ج.م</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3">
            <span className="font-bold">الإجمالي</span>
            <span className="text-lg font-black text-brand-dark">{total} ج.م</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
