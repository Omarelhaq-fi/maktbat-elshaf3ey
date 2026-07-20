import { createFileRoute } from "@tanstack/react-router";
import { Phone, Facebook, Clock, MapPin, MessageCircle, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "تواصل معنا — مكتبة الشافعي" },
      {
        name: "description",
        content: "اتواصل مع مكتبة الشافعي على 01093923840 أو عبر صفحة الفيسبوك.",
      },
      { property: "og:title", content: "تواصل معنا — مكتبة الشافعي" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const body = `الاسم: ${name}%0Aالموبايل: ${phone}%0A%0A${encodeURIComponent(msg)}`;
    window.location.href = `https://wa.me/201093923840?text=${body}`;
  }

  return (
    <>
      <section className="border-b border-border/60 bg-gradient-to-l from-brand-orange/10 via-transparent to-brand-gold/15">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-brand-dark sm:text-5xl">تواصل معنا</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            احنا موجودين عشانك — اتصل، ابعت رسالة، أو عدّي علينا في المكتبة.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact cards */}
          <div className="space-y-4">
            <a
              href="tel:+201093923840"
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-brand-orange hover:shadow-lg transition-all"
            >
              <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-gold text-white shadow-md">
                <Phone className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-muted-foreground">اتصل بينا</div>
                <div dir="ltr" className="text-lg font-extrabold text-brand-dark group-hover:text-brand-orange">
                  01093923840
                </div>
              </div>
            </a>

            <a
              href="tel:+201091662769"
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-brand-orange hover:shadow-lg transition-all"
            >
              <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-gold text-white shadow-md">
                <Phone className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-muted-foreground">رقم تاني</div>
                <div dir="ltr" className="text-lg font-extrabold text-brand-dark group-hover:text-brand-orange">
                  +20 10 91662769
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/201093923840"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-brand-orange hover:shadow-lg transition-all"
            >
              <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.7_0.18_150)] text-white shadow-md">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-muted-foreground">واتساب</div>
                <div className="text-lg font-extrabold text-brand-dark group-hover:text-brand-orange">
                  ابعتلنا رسالة
                </div>
              </div>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61557499173184"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-brand-orange hover:shadow-lg transition-all"
            >
              <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.55_0.2_260)] text-white shadow-md">
                <Facebook className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-muted-foreground">فيسبوك</div>
                <div className="text-lg font-extrabold text-brand-dark group-hover:text-brand-orange">
                  صفحتنا الرسمية
                </div>
              </div>
            </a>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-brand-dark/5 p-4">
                <Clock className="h-5 w-5 text-brand-orange" />
                <div>
                  <div className="text-xs text-muted-foreground">مواعيد العمل</div>
                  <div className="text-sm font-bold text-brand-dark">9 ص — 11 م</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-brand-dark/5 p-4">
                <MapPin className="h-5 w-5 text-brand-orange" />
                <div>
                  <div className="text-xs text-muted-foreground">العنوان</div>
                  <div className="text-sm font-bold text-brand-dark">ال٤٧ الشارع المقابل لسيراميكا رويال، كفر الشيخ، مصر 33511</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/30 text-brand-dark">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-extrabold text-brand-dark">ابعتلنا رسالة</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              املا البيانات وابعت، الرسالة هتوصلنا على واتساب مباشرة.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-dark">الاسم</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
                  placeholder="اكتب اسمك"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-dark">الموبايل</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
                  placeholder="01xxxxxxxxx"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-dark">الرسالة</label>
                <textarea
                  required
                  rows={5}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
                  placeholder="محتاج تسأل عن إيه؟"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-orange transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                ابعت على واتساب
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
