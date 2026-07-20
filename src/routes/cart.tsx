import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "السلة — مكتبة الشافعي" }] }),
});

function CartPage() {
  const { items, setQty, remove, total, count } = useCart();

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-brand-dark sm:text-4xl">سلة المشتريات</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-brand-dark/30" />
          <p className="mt-4 text-lg font-bold text-brand-dark">السلة فاضية</p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white hover:bg-brand-orange"
          >
            تسوق دلوقتي
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-gold/10">
                  {it.imageUrl ? (
                    <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">📚</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-brand-dark line-clamp-1">{it.name}</h3>
                    <div className="text-sm font-bold text-brand-orange">{it.price} ج.م</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-input">
                      <button
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="p-2 hover:bg-brand-gold/20 rounded-full"
                        aria-label="نقص"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-8 text-center font-bold text-sm">{it.qty}</span>
                      <button
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="p-2 hover:bg-brand-gold/20 rounded-full"
                        aria-label="زيد"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      aria-label="احذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6 sticky top-24">
            <h2 className="text-xl font-extrabold text-brand-dark">ملخص الطلب</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">عدد المنتجات</span>
                <span className="font-bold">{count}</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2">
                <span className="font-bold">الإجمالي</span>
                <span className="text-lg font-black text-brand-dark">{total} ج.م</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                الدفع كاش عند الاستلام. مصاريف التوصيل تحدد حسب المنطقة.
              </p>
            </div>
            <Link
              to="/checkout"
              className="mt-5 flex items-center justify-center rounded-full bg-brand-dark py-3 text-sm font-bold text-white hover:bg-brand-orange transition-colors"
            >
              أكمل الطلب
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
