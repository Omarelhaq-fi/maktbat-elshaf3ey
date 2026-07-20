import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Pencil,
  Printer,
  FileText,
  Package,
  Gift,
  Phone,
  Facebook,
  ArrowLeft,
  Sparkles,
  Star,
  ShieldCheck,
  Clock,
} from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "مكتبة الشافعي — كتب، أدوات مكتبية، تصوير وطباعة" },
      {
        name: "description",
        content:
          "مكتبة الشافعي — كل احتياجاتك من كتب دراسية، أدوات مكتبية، تصوير، طباعة، وتنسيق أبحاث في مكان واحد.",
      },
      { property: "og:title", content: "مكتبة الشافعي" },
      { property: "og:url", content: "/" },
    ],
  }),
});

const highlights = [
  { icon: BookOpen, title: "كتب دراسية", desc: "كل المراحل والمناهج بأسعار مناسبة." },
  { icon: Pencil, title: "أدوات مكتبية", desc: "أقلام، كشاكيل، وكل مستلزماتك." },
  { icon: Printer, title: "تصوير وطباعة", desc: "جودة عالية وسرعة في التنفيذ." },
  
  { icon: Package, title: "تغليف", desc: "تغليف كتب ومستلزمات بشكل أنيق." },
  { icon: Gift, title: "بشر ومستلزمات", desc: "بشر ورق، وكل حاجة تلزم الطالب." },
];

const features = [
  { icon: Star, title: "جودة مضمونة", desc: "منتجات أصلية وخامات ممتازة." },
  { icon: ShieldCheck, title: "ثقة وخبرة", desc: "سنين خبرة في خدمة الطلاب." },
  { icon: Clock, title: "سرعة في التنفيذ", desc: "بنسلمك طلباتك في وقتها." },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 500px at 20% 0%, oklch(0.85 0.16 90 / 0.35), transparent 60%), radial-gradient(900px 400px at 85% 30%, oklch(0.68 0.19 45 / 0.25), transparent 60%), linear-gradient(180deg, oklch(0.985 0.012 75), oklch(0.97 0.02 70))",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-right">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-dark/10 px-4 py-1.5 text-xs font-bold text-brand-dark">
                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                مكتبة الشافعي
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight text-brand-dark sm:text-5xl lg:text-6xl">
                <span className="block">مكتبة الشافعي</span>
                <span className="mt-2 block bg-gradient-to-l from-brand-orange to-brand-gold bg-clip-text text-transparent">
                  كل احتياجاتك في مكان واحد
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0">
                كتب دراسية، أدوات مكتبية، تصوير وطباعة، تنسيق وكتابة أبحاث، بشر وتغليف — بجودة عالية وأسعار مناسبة.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href="tel:+201093923840"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-dark/20 hover:bg-brand-orange transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  اتصل بينا دلوقتي
                </a>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-brand-dark/20 bg-white px-6 py-3 text-sm font-bold text-brand-dark hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  اشتري دلوقتي
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-[2rem] bg-gradient-to-br from-brand-orange/30 to-brand-gold/30 blur-2xl" />
              <div className="relative rounded-[2rem] bg-gradient-to-br from-brand-dark to-[oklch(0.25_0.08_25)] p-8 shadow-2xl">
                <img
                  src={logoAsset.url}
                  alt="مكتبة الشافعي"
                  className="mx-auto h-56 w-56 rounded-full object-cover ring-4 ring-brand-gold/40 sm:h-72 sm:w-72"
                />
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  {["كتب", "أدوات", "طباعة"].map((label) => (
                    <div key={label} className="rounded-xl bg-white/10 px-2 py-3 text-xs font-bold text-white backdrop-blur">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-brand-dark sm:text-4xl">إيه اللي بنقدمهولك؟</h2>
          <p className="mt-3 text-muted-foreground">كل الخدمات والمنتجات اللي محتاجها الطالب والباحث</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-brand-gold/20 blur-2xl group-hover:bg-brand-orange/30 transition-colors" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange to-brand-gold text-white shadow-md">
                  <h.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-brand-dark">{h.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-gradient-to-l from-brand-dark to-[oklch(0.28_0.09_25)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-white/75">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-12 shadow-xl">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-brand-dark sm:text-3xl">محتاج حاجة معينة؟</h2>
              <p className="mt-2 text-muted-foreground">
                اتواصل معانا دلوقتي على الواتس أو الفيسبوك ونحضرلك طلبك في أسرع وقت.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+201093923840"
                className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white hover:bg-brand-orange transition-colors"
              >
                <Phone className="h-4 w-4" />
                اتصل بينا
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61557499173184"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
              >
                <Facebook className="h-4 w-4" />
                فيسبوك
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
