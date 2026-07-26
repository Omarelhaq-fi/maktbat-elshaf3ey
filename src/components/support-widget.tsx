import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { MessageCircle, X, Send, ArrowRight, Plus, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  createTicket,
  getGuestTickets,
  getGuestToken,
  getTicket,
  markRead,
  sendMessage,
  subscribeMessages,
  subscribeMyTickets,
  subscribeTicket,
  type Ticket,
  type TicketMessage,
} from "@/lib/support";
import { toast } from "sonner";

type View = "list" | "new" | "chat";

export function SupportWidget() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const location = useLocation();
  

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);

  // Hide widget on admin dashboard, login, and checkout
  const hidden = useMemo(() => {
    const p = location.pathname;
    return (
      isAdmin ||
      p.startsWith("/mgmt-") ||
      p.startsWith("/login") ||
      p.startsWith("/checkout")
    );
  }, [location.pathname, isAdmin]);


  // Load tickets for badge + list
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      let unsub: (() => void) | undefined;
      subscribeMyTickets(user.uid, setTickets).then((u) => (unsub = u));
      return () => unsub?.();
    }
    const guests = getGuestTickets();
    if (guests.length === 0) {
      setTickets([]);
      return;
    }
    Promise.all(guests.map((g) => getTicket(g.id))).then((list) =>
      setTickets(list.filter((t): t is Ticket => !!t)),
    );
  }, [user, authLoading]);

  const totalUnread = useMemo(
    () => (tickets ?? []).reduce((sum, t) => sum + (t.userUnread || 0), 0),
    [tickets],
  );

  // Default view when opening
  useEffect(() => {
    if (!open) return;
    if (activeId) setView("chat");
    else if ((tickets?.length ?? 0) === 0) setView("new");
    else setView("list");
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (hidden) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "إغلاق الدعم" : "افتح شات الدعم"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-dark text-white shadow-2xl shadow-brand-dark/30 transition-transform hover:scale-110 hover:bg-brand-orange sm:h-16 sm:w-16"
      >
        <div className="relative">
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />}
          {!open && totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 flex min-w-5 h-5 items-center justify-center rounded-full bg-brand-orange px-1.5 text-[10px] font-black text-white ring-2 ring-white">
              {totalUnread}
            </span>
          )}
        </div>
        {!open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-dark/40" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-3 z-50 flex w-[min(400px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl animate-scale-in sm:right-5"
          style={{ height: "min(600px, calc(100vh - 8rem))" }}
        >
          <WidgetHeader
            view={view}
            onBack={() => {
              setActiveId(null);
              setView((tickets?.length ?? 0) === 0 ? "new" : "list");
            }}
            onClose={() => setOpen(false)}
          />

          <div className="flex-1 overflow-hidden">
            {view === "list" && (
              <ListView
                tickets={tickets}
                onOpen={(id) => {
                  setActiveId(id);
                  setView("chat");
                }}
                onNew={() => setView("new")}
              />
            )}
            {view === "new" && (
              <NewTicketView
                onCreated={(id) => {
                  setActiveId(id);
                  setView("chat");
                }}
              />
            )}
            {view === "chat" && activeId && (
              <ChatView ticketId={activeId} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function WidgetHeader({
  view,
  onBack,
  onClose,
}: {
  view: View;
  onBack: () => void;
  onClose: () => void;
}) {
  const title =
    view === "chat" ? "محادثة الدعم" : view === "new" ? "تذكرة جديدة" : "الدعم الفني";
  return (
    <div className="flex items-center justify-between gap-2 bg-gradient-to-l from-brand-dark to-brand-orange px-4 py-3 text-white">
      <div className="flex items-center gap-2 min-w-0">
        {view !== "list" && (
          <button
            onClick={onBack}
            aria-label="رجوع"
            className="rounded-full p-1 hover:bg-white/10"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
        <div className="min-w-0">
          <div className="text-sm font-black line-clamp-1">{title}</div>
          <div className="text-[11px] opacity-80">مكتبة الشافعي · بنرد بأسرع وقت</div>
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label="إغلاق"
        className="rounded-full p-1 hover:bg-white/10"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function ListView({
  tickets,
  onOpen,
  onNew,
}: {
  tickets: Ticket[] | null;
  onOpen: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-3">
        {tickets === null ? (
          <div className="py-10 text-center text-sm text-muted-foreground">جاري التحميل...</div>
        ) : tickets.length === 0 ? (
          <div className="py-10 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-brand-dark/30" />
            <p className="mt-3 text-sm font-bold text-brand-dark">مفيش محادثات لسه</p>
            <p className="mt-1 text-xs text-muted-foreground">ابدأ محادثة جديدة مع فريقنا</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => onOpen(t.id)}
                className="block w-full rounded-2xl border border-border/60 bg-background p-3 text-right transition-colors hover:border-brand-orange"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-brand-dark line-clamp-1">
                        {t.subject}
                      </h3>
                      {t.userUnread > 0 && (
                        <span className="inline-flex min-w-4 h-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-black text-white">
                          {t.userUnread}
                        </span>
                      )}
                    </div>
                    {t.lastMessagePreview && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {t.lastMessagePreview}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
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
      <div className="border-t border-border/60 p-3">
        <button
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-dark px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-orange"
        >
          <Plus className="h-4 w-4" />
          محادثة جديدة
        </button>
      </div>
    </div>
  );
}

function NewTicketView({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: user?.displayName ?? user?.email?.split("@")[0] ?? "",
    phone: "",
    subject: "",
    firstMessage: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName.trim() || !form.firstMessage.trim()) {
      toast.error("املأ الاسم والرسالة");
      return;
    }
    if (!user && !form.phone.trim()) {
      toast.error("لو من غير حساب لازم تدخل رقم موبايل");
      return;
    }
    setSubmitting(true);
    try {
      const { id } = await createTicket({
        userId: user?.uid ?? null,
        customerName: form.customerName,
        phone: form.phone,
        subject: form.subject || "استفسار",
        firstMessage: form.firstMessage,
      });
      toast.success("تم فتح المحادثة");
      onCreated(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصل خطأ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto space-y-2 p-3">
        <input
          required
          placeholder="الاسم *"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-orange"
        />
        <input
          placeholder={user ? "رقم موبايل (اختياري)" : "رقم موبايل *"}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          dir="ltr"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-orange"
        />
        <input
          placeholder="الموضوع (اختياري)"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-orange"
        />
        <textarea
          required
          rows={4}
          placeholder="اكتب رسالتك... *"
          value={form.firstMessage}
          onChange={(e) => setForm({ ...form, firstMessage: e.target.value })}
          className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-orange"
        />
        {!user && (
          <p className="text-[11px] text-muted-foreground">
            هتفتح المحادثة كضيف. سجّل دخول عشان تلاقي كل محادثاتك في مكان واحد.
          </p>
        )}
      </div>
      <div className="flex gap-2 border-t border-border/60 p-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-full bg-brand-dark px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-orange disabled:opacity-50"
        >
          {submitting ? "جاري الإرسال..." : "إرسال"}
        </button>
      </div>
    </form>
  );
}


function ChatView({ ticketId }: { ticketId: string }) {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubT: (() => void) | undefined;
    let unsubM: (() => void) | undefined;
    subscribeTicket(ticketId, setTicket).then((u) => (unsubT = u));
    subscribeMessages(ticketId, setMessages).then((u) => (unsubM = u));
    return () => {
      unsubT?.();
      unsubM?.();
    };
  }, [ticketId]);

  useEffect(() => {
    if (authLoading || !ticket) return;
    if (isAdmin) setAuthorized(true);
    else if (user && ticket.userId === user.uid) setAuthorized(true);
    else if (!ticket.userId) setAuthorized(getGuestToken(ticketId) === ticket.guestToken);
    else setAuthorized(false);
  }, [ticket, user, isAdmin, authLoading, ticketId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const side: "user" | "admin" = isAdmin ? "admin" : "user";
  useEffect(() => {
    if (!authorized || !ticket) return;
    const unread = side === "admin" ? ticket.adminUnread : ticket.userUnread;
    if (unread > 0) markRead(ticketId, side).catch(() => {});
  }, [authorized, ticket, side, ticketId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendMessage(ticketId, side, text, isAdmin ? "فريق الدعم" : ticket?.customerName);
      setText("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطأ في الإرسال");
    } finally {
      setSending(false);
    }
  }

  if (!ticket || authorized === null) {
    return <div className="py-10 text-center text-sm text-muted-foreground">جاري التحميل...</div>;
  }
  if (!authorized) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-bold text-brand-dark">مفيش صلاحية للمحادثة دي</p>
      </div>
    );
  }

  const closed = ticket.status === "closed";

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-brand-gold/5 p-3 space-y-2"
      >
        {messages.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">لسه مفيش رسائل</div>
        ) : (
          messages.map((m) => {
            const mine = m.sender === side;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? "bg-brand-dark text-white"
                      : m.sender === "admin"
                        ? "bg-brand-orange/20 text-brand-dark border border-brand-orange/40"
                        : "bg-card text-brand-dark border border-border/60"
                  }`}
                >
                  {!mine && m.sender === "admin" && (
                    <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold opacity-70">
                      <Shield className="h-3 w-3" />
                      فريق الدعم
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words">{m.text}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-border/60 p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e as unknown as React.FormEvent);
            }
          }}
          placeholder={closed ? "المحادثة مقفولة" : "اكتب رسالتك..."}
          disabled={closed || sending}
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-orange disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={closed || sending || !text.trim()}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-dark px-4 text-sm font-bold text-white hover:bg-brand-orange disabled:opacity-50"
          aria-label="إرسال"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
