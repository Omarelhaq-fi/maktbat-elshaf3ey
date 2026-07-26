import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  subscribeProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  subscribeAllOrders,
  updateOrderStatus,
  adjustStock,
  subscribeCategories,
  createCategory,
  deleteCategory,
  type Product,
  type Order,
  type Category,
} from "@/lib/products";
import { subscribeAllTickets, subscribeMessages, sendMessage, markRead, setTicketStatus, type Ticket, type TicketMessage } from "@/lib/support";
import { toast } from "sonner";
import { Trash2, Pencil, Plus, LogOut, Package, ShoppingBag, Tags, LifeBuoy, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/mgmt-9k2x-shafi")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "لوحة التحكم" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminPage() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"products" | "orders" | "categories" | "support">("products");
  const [supportUnread, setSupportUnread] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    let unsub: (() => void) | undefined;
    subscribeAllTickets((items) => {
      setSupportUnread(items.reduce((s, t) => s + (t.adminUnread ?? 0), 0));
    }).then((u) => (unsub = u));
    return () => unsub?.();
  }, [isAdmin]);

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground">جاري التحقق...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-brand-dark">غير مصرح بالوصول</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          هذه الصفحة محمية. سجل الدخول بحساب المدير.
        </p>
        <button
          onClick={() => navigate({ to: "/login" })}
          className="mt-6 rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white"
        >
          تسجيل الدخول
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-dark">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">مرحباً {user.email}</p>
        </div>
        <button
          onClick={async () => {
            await signOut();
            navigate({ to: "/" });
          }}
          className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-bold hover:bg-brand-gold/20"
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>
      </div>

      <div className="mb-6 flex gap-2 border-b border-border/60">
        <button
          onClick={() => setTab("products")}
          className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            tab === "products" ? "border-brand-orange text-brand-dark" : "border-transparent text-muted-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          المنتجات
        </button>
        <button
          onClick={() => setTab("categories")}
          className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            tab === "categories" ? "border-brand-orange text-brand-dark" : "border-transparent text-muted-foreground"
          }`}
        >
          <Tags className="h-4 w-4" />
          التصنيفات
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            tab === "orders" ? "border-brand-orange text-brand-dark" : "border-transparent text-muted-foreground"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          الطلبات
        </button>
        <button
          onClick={() => setTab("support")}
          className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            tab === "support" ? "border-brand-orange text-brand-dark" : "border-transparent text-muted-foreground"
          }`}
        >
          <LifeBuoy className="h-4 w-4" />
          الدعم
          {supportUnread > 0 && (
            <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-brand-orange px-1.5 text-[11px] font-black text-white">
              {supportUnread}
            </span>
          )}
        </button>
      </div>

      {tab === "products" ? (
        <ProductsAdmin />
      ) : tab === "categories" ? (
        <CategoriesAdmin />
      ) : tab === "orders" ? (
        <OrdersAdmin />
      ) : (
        <SupportAdmin />
      )}
    </section>
  );
}

function emptyForm() {
  return { name: "", description: "", price: 0, category: "", imageUrl: "", stock: 0 };
}

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    subscribeProducts(setProducts).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    subscribeCategories(setCategories).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        await updateProduct(editing.id, form);
        toast.success("تم التحديث");
      } else {
        await createProduct(form);
        toast.success("تم الإضافة");
      }
      setForm(emptyForm());
      setEditing(null);
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطأ");
    }
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      category: p.category,
      imageUrl: p.imageUrl ?? "",
      stock: p.stock,
    });
    setShowForm(true);
  }

  async function del(id: string) {
    if (!confirm("تأكيد الحذف؟")) return;
    try {
      await deleteProduct(id);
      toast.success("تم الحذف");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطأ");
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            setEditing(null);
            setForm(emptyForm());
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-sm font-bold text-white hover:bg-brand-orange"
        >
          <Plus className="h-4 w-4" />
          منتج جديد
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-6 rounded-2xl border border-border/60 bg-card p-6 space-y-3">
          <h3 className="text-lg font-extrabold text-brand-dark">
            {editing ? "تعديل منتج" : "إضافة منتج"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="اسم المنتج"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-input px-3 py-2 text-sm"
            />
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">اختر التصنيف</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <input
              required
              type="number"
              min={0}
              placeholder="السعر"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="rounded-xl border border-input px-3 py-2 text-sm"
            />
            <input
              required
              type="number"
              min={0}
              placeholder="الكمية"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              className="rounded-xl border border-input px-3 py-2 text-sm"
            />
            <input
              placeholder="رابط الصورة (اختياري)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-input px-3 py-2 text-sm"
              dir="ltr"
            />
            <textarea
              placeholder="الوصف"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-input px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-brand-dark px-5 py-2 text-sm font-bold text-white">
              {editing ? "حفظ" : "إضافة"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setForm(emptyForm());
              }}
              className="rounded-full border border-input px-5 py-2 text-sm font-bold"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-brand-gold/20 text-brand-dark">
            <tr>
              <th className="p-3 text-right">المنتج</th>
              <th className="p-3 text-right">التصنيف</th>
              <th className="p-3 text-right">السعر</th>
              <th className="p-3 text-right">الكمية</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  مفيش منتجات — أضف واحد
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-border/60">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.imageUrl && (
                        <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <span className="font-bold">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 font-bold">{p.price} ج.م</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded-lg p-2 hover:bg-brand-gold/20"
                        aria-label="تعديل"
                      >
                        <Pencil className="h-4 w-4 text-brand-dark" />
                      </button>
                      <button
                        onClick={() => del(p.id)}
                        className="rounded-lg p-2 hover:bg-red-100"
                        aria-label="حذف"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    subscribeAllOrders(setOrders).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  async function setStatus(order: Order, status: Order["status"]) {
    if (order.status === status) return;
    try {
      await updateOrderStatus(order.id, status);
      const wasCancelled = order.status === "cancelled";
      const nowCancelled = status === "cancelled";
      if (!wasCancelled && nowCancelled) {
        await adjustStock(order.items.map((i) => ({ id: i.id, qty: i.qty })), 1).catch(() => {});
      } else if (wasCancelled && !nowCancelled) {
        await adjustStock(order.items.map((i) => ({ id: i.id, qty: i.qty })), -1).catch(() => {});
      }
      toast.success("تم التحديث");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطأ");
    }
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center text-muted-foreground">
          مفيش طلبات لسه
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground" dir="ltr">#{o.id.slice(0, 8)}</div>
                <div className="mt-1 font-extrabold text-brand-dark">{o.customerName}</div>
                <div className="text-sm text-muted-foreground" dir="ltr">{o.phone}</div>
                <div className="mt-1 text-sm">{o.address}</div>
                {o.notes && <div className="mt-1 text-xs italic text-muted-foreground">ملاحظات: {o.notes}</div>}
              </div>
              <div className="text-left">
                <div className="text-2xl font-black text-brand-dark">{o.total} ج.م</div>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o, e.target.value as Order["status"])}
                  className="mt-2 rounded-xl border border-input bg-background px-3 py-1.5 text-sm font-bold"
                >
                  <option value="pending">قيد المراجعة</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="delivered">تم التوصيل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
            <ul className="mt-4 space-y-1 border-t border-border/60 pt-3 text-sm">
              {o.items.map((it) => (
                <li key={it.id} className="flex justify-between">
                  <span>{it.name} × {it.qty}</span>
                  <span className="font-bold">{it.price * it.qty} ج.م</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    let unsub: (() => void) | undefined;
    subscribeCategories(setCategories).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.name === trimmed)) {
      toast.error("التصنيف موجود بالفعل");
      return;
    }
    try {
      await createCategory(trimmed);
      setName("");
      toast.success("تم الإضافة");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطأ");
    }
  }

  async function del(id: string) {
    if (!confirm("تأكيد الحذف؟ المنتجات اللي في التصنيف ده مش هتتحذف.")) return;
    try {
      await deleteCategory(id);
      toast.success("تم الحذف");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطأ");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row rounded-2xl border border-border/60 bg-card p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم التصنيف (مثلاً: الكتب الدراسية)"
          className="flex-1 rounded-xl border border-input px-3 py-2 text-sm"
        />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-5 py-2 text-sm font-bold text-white hover:bg-brand-orange">
          <Plus className="h-4 w-4" />
          إضافة تصنيف
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-brand-gold/20 text-brand-dark">
            <tr>
              <th className="p-3 text-right">التصنيف</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-6 text-center text-muted-foreground">
                  مفيش تصنيفات — أضف واحد
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-t border-border/60">
                  <td className="p-3 font-bold">{c.name}</td>
                  <td className="p-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => del(c.id)}
                        className="rounded-lg p-2 hover:bg-red-100"
                        aria-label="حذف"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupportAdmin() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    subscribeAllTickets(setTickets).then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  const shown = tickets.filter((t) => filter === "all" || t.status === filter);
  const selected = tickets.find((t) => t.id === selectedId) ?? null;

  if (selected) {
    return <AdminChat ticket={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["all", "open", "closed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              filter === f ? "bg-brand-dark text-white" : "bg-brand-gold/20 text-brand-dark"
            }`}
          >
            {f === "all" ? "الكل" : f === "open" ? "مفتوحة" : "مقفولة"}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center text-muted-foreground">
          مفيش تذاكر
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className="block w-full text-right rounded-2xl border border-border/60 bg-card p-5 hover:border-brand-orange transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-brand-orange shrink-0" />
                    <h3 className="font-extrabold text-brand-dark line-clamp-1">{t.subject}</h3>
                    {t.adminUnread > 0 && (
                      <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-brand-orange px-1.5 text-[11px] font-black text-white">
                        {t.adminUnread}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.customerName}
                    {t.phone && <> · <span dir="ltr">{t.phone}</span></>}
                    {t.userId ? " · حساب مسجل" : " · ضيف"}
                  </p>
                  {t.lastMessagePreview && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {t.lastMessagePreview}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    t.status === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {t.status === "open" ? "مفتوحة" : "مقفولة"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminChat({ ticket, onBack }: { ticket: Ticket; onBack: () => void }) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    subscribeMessages(ticket.id, setMessages).then((u) => (unsub = u));
    markRead(ticket.id, "admin").catch(() => {});
    return () => unsub?.();
  }, [ticket.id]);

  useEffect(() => {
    if (ticket.adminUnread > 0) markRead(ticket.id, "admin").catch(() => {});
  }, [ticket.id, ticket.adminUnread]);

  const send = async () => {
    const clean = text.trim();
    if (!clean || sending) return;
    setSending(true);
    try {
      await sendMessage(ticket.id, "admin", clean, "الدعم");
      setText("");
    } catch {
      toast.error("فشل الإرسال");
    } finally {
      setSending(false);
    }
  };

  const toggleStatus = async () => {
    try {
      await setTicketStatus(ticket.id, ticket.status === "open" ? "closed" : "open");
      toast.success(ticket.status === "open" ? "تم قفل التذكرة" : "تم فتح التذكرة");
    } catch {
      toast.error("فشل التحديث");
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="rounded-lg bg-brand-gold/20 px-3 py-1.5 text-sm font-bold text-brand-dark hover:bg-brand-gold/30">
            رجوع
          </button>
          <div className="min-w-0">
            <h3 className="font-extrabold text-brand-dark line-clamp-1">{ticket.subject}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {ticket.customerName}
              {ticket.phone && <> · <span dir="ltr">{ticket.phone}</span></>}
              {ticket.userId ? " · حساب مسجل" : " · ضيف"}
            </p>
          </div>
        </div>
        <button
          onClick={toggleStatus}
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            ticket.status === "open" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {ticket.status === "open" ? "قفل التذكرة" : "إعادة فتح"}
        </button>
      </div>

      <div className="max-h-[420px] min-h-[300px] overflow-y-auto space-y-3 p-4 bg-muted/20">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">لا رسائل بعد</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "admin" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                  m.sender === "admin"
                    ? "bg-brand-orange text-white"
                    : "bg-white border border-border/60 text-brand-dark"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border/60 p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="اكتب ردك..."
          className="flex-1 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm outline-none focus:border-brand-orange"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="rounded-xl bg-brand-dark px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}

