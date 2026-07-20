import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Search, ArrowDownUp } from "lucide-react";
import { subscribeProducts, subscribeCategories, type Product, type Category } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

type SortKey = "newest" | "price-asc" | "price-desc" | "name";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "المنتجات — مكتبة الشافعي" },
      { name: "description", content: "اطلب كتب دراسية، أدوات مكتبية، أقلام ومستلزمات ويتم توصيلها لباب البيت." },
      { property: "og:title", content: "المنتجات — مكتبة الشافعي" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
});

function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cat, setCat] = useState<string>("الكل");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const { add } = useCart();

  useEffect(() => {
    let unsub: (() => void) | undefined;
    subscribeProducts((items) => setProducts(items)).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    subscribeCategories(setCategories).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  const cats = useMemo(() => {
    const names = new Set<string>();
    categories.forEach((c) => c.name && names.add(c.name));
    (products ?? []).forEach((p) => p.category && names.add(p.category));
    return ["الكل", ...Array.from(names)];
  }, [categories, products]);

  const filtered = useMemo(() => {
    const list = (products ?? []).filter(
      (p) => (cat === "الكل" || p.category === cat) && (q === "" || p.name.includes(q))
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "ar"));
    return sorted;
  }, [products, cat, q, sort]);

  return (
    <>
      <section className="border-b border-border/60 bg-gradient-to-l from-brand-gold/20 via-transparent to-brand-orange/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-brand-dark sm:text-5xl">منتجاتنا</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            اطلب اللي تحبه ويوصلك لباب البيت — الدفع كاش عند الاستلام.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:w-80">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full rounded-full border border-input bg-background py-2.5 pr-10 pl-4 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div className="relative">
              <ArrowDownUp className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full sm:w-56 appearance-none rounded-full border border-input bg-background py-2.5 pr-10 pl-4 text-sm font-semibold text-brand-dark outline-none focus:border-brand-orange"
              >
                <option value="newest">الأحدث</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="name">الاسم (أ - ي)</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  cat === c ? "bg-brand-dark text-white" : "bg-brand-gold/20 text-brand-dark hover:bg-brand-gold/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>


        {products === null ? (
          <div className="py-20 text-center text-muted-foreground">جاري تحميل المنتجات...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-bold text-brand-dark">مفيش منتجات متاحة حالياً</p>
            <p className="mt-2 text-sm text-muted-foreground">جرب فلتر تاني أو ارجع بعدين.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-square overflow-hidden bg-brand-gold/10">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-brand-dark/30 text-6xl">📚</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="text-xs font-semibold text-brand-orange">{p.category}</div>
                  <h2 className="mt-1 line-clamp-2 font-extrabold text-brand-dark">{p.name}</h2>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-lg font-black text-brand-dark">
                      {p.price} <span className="text-xs font-bold">ج.م</span>
                    </div>
                    {p.stock <= 0 && (
                      <span className="text-xs font-bold text-red-600">نافذ</span>
                    )}
                  </div>
                  <button
                    disabled={p.stock <= 0}
                    onClick={() => {
                      add({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl });
                      toast.success("اتضاف للسلة");
                    }}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    ضيف للسلة
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-brand-dark/5 border border-brand-dark/10 p-6 text-center">
          <p className="text-sm text-brand-dark">
            عندك سلة جاهزة؟{" "}
            <Link to="/cart" className="font-bold underline">
              روح للسلة وأكمل الطلب
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
