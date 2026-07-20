import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer, Package, Scissors, Copy, Sparkles, Phone } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "الخدمات — مكتبة الشافعي" },
      {
        name: "description",
        content: "تصوير وطباعة، تنسيق وكتابة أبحاث، تغليف، وبشر ورق — كل الخدمات في مكتبة الشافعي.",
      },
      { property: "og:title", content: "الخدمات — مكتبة الشافعي" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

const services = [
  {
    icon: Printer,
    title: "التصوير والطباعة",
    desc: "خدمة تصوير مستندات وطباعة أبيض وأسود وألوان بجودة عالية وسرعة في التنفيذ.",
    features: ["طباعة A4 / A3", "تصوير بأحجام مختلفة", "ألوان أو أبيض وأسود"],
  },
  {
    icon: Package,
    title: "التغليف",
    desc: "تغليف كتب، مستندات، ومستلزمات مدرسية بشكل أنيق ومحكم.",
    features: ["تغليف بلاستيك", "تغليف حراري", "تغليف كتب مدرسية"],
  },
  {
    icon: Scissors,
    title: "بشر ورق",
    desc: "بشر ورق A4 و A3 وأحجام خاصة حسب الطلب.",
    features: ["كل الأحجام", "دقة عالية", "سرعة تنفيذ"],
  },
  {
    icon: Copy,
    title: "طلبات خاصة",
    desc: "أي طلب مخصص، احنا موجودين. كلمنا واحنا نحضرلك اللي محتاجه.",
    features: ["طلبات جماعية", "خصومات للطلاب", "تسليم سريع"],
  },
  {
    icon: Sparkles,
    title: "جودة مضمونة",
    desc: "بنستخدم أفضل الخامات وأحدث الأجهزة عشان نطلعلك أحسن نتيجة.",
    features: ["أجهزة حديثة", "خامات ممتازة", "خبرة سنين"],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-gradient-to-l from-brand-orange/10 via-transparent to-brand-gold/20">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-brand-dark sm:text-5xl">خدماتنا</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            خدمات متكاملة للطلاب والباحثين — من التصوير للطباعة لتنسيق الأبحاث والتغليف.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, idx) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-brand-orange to-brand-gold" />
              <div className="flex items-center justify-between">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-gold text-white shadow-md">
                  <s.icon className="h-7 w-7" />
                </div>
                <span className="text-4xl font-black text-brand-dark/10">0{idx + 1}</span>
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-brand-dark">{s.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-orange" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-gradient-to-l from-brand-dark to-[oklch(0.28_0.09_25)] p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl font-black sm:text-3xl">جاهزين نخدمك دلوقتي</h2>
          <p className="mt-2 text-white/80">اتواصل معانا وأطلب الخدمة اللي محتاجها.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="tel:+201093923840"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-brand-dark hover:bg-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">01093923840</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              صفحة التواصل
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
