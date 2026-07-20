import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getMyOrders, updateOrderStatus, type Order } from "@/lib/products";
import { notifyOrderCancelled } from "@/lib/notify.functions";


export const Route = createFileRoute("/my-orders")({
  component: MyOrdersPage,
  head: () => ({ meta: [{ title: "طلباتي — مكتبة الشافعي" }] }),
});

const statusLabel: Record<Order["status"], { label: string; cls: string }> = {
  pending: { label: "قيد المراجعة", cls: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "مؤكد", cls: "bg-blue-100 text-blue-800" },
  delivered: { label: "تم التوصيل", cls: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغي", cls: "bg-red-100 text-red-800" },
};

function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = (uid: string) => {
    getMyOrders(uid).then(setOrders).catch(() => setOrders([]));
  };

  useEffect(() => {
    if (!user) return;
    load(user.uid);
  }, [user]);

  const handleCancel = async (order: Order) => {
    if (!confirm("متأكد إنك عايز تلغي الطلب؟")) return;
    setCancellingId(order.id);
    try {
      await updateOrderStatus(order.id, "cancelled");
      setOrders((prev) => prev?.map((o) => (o.id === order.id ? { ...o, status: "cancelled" } : o)) ?? null);
      notifyOrderCancelled({
        data: {
          orderId: order.id,
          customerName: order.customerName,
          phone: order.phone,
          address: order.address,
          notes: order.notes,
          total: order.total,
          items: order.items.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
          messageId: order.telegramMessageId ?? null,
        },
      }).catch(() => {});
    } catch (err) {
      alert("مقدرناش نلغي الطلب. جرب تاني.");
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };


  if (authLoading) return <div className="py-20 text-center text-muted-foreground">جاري...</div>;
  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-lg font-bold text-brand-dark">لازم تسجل دخول</p>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white">
          تسجيل الدخول
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-brand-dark sm:text-4xl">طلباتي</h1>
      {orders === null ? (
        <div className="py-20 text-center text-muted-foreground">جاري تحميل الطلبات...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
          <p className="text-lg font-bold text-brand-dark">مفيش طلبات لسه</p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white">
            ابدأ التسوق
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">طلب رقم</div>
                  <div className="font-bold text-brand-dark" dir="ltr">#{o.id.slice(0, 8)}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusLabel[o.status].cls}`}>
                  {statusLabel[o.status].label}
                </span>
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.name} × {it.qty}</span>
                    <span className="font-semibold">{it.price * it.qty} ج.م</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
                <span className="font-bold">الإجمالي</span>
                <span className="text-lg font-black text-brand-dark">{o.total} ج.م</span>
              </div>
              {o.status === "pending" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancel(o)}
                    disabled={cancellingId === o.id}
                    className="rounded-full border border-red-300 bg-red-50 px-5 py-2 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    {cancellingId === o.id ? "جاري الإلغاء..." : "إلغاء الطلب"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

