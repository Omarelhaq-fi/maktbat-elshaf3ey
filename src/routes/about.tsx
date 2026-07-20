import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Users, Award, Target } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "من نحن — مكتبة الشافعي" },
      {
        name: "description",
        content: "تعرف على مكتبة الشافعي. سنين خبرة في خدمة الطلاب.",
      },
      { property: "og:title", content: "من نحن — مكتبة الشافعي" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const values = [
  { icon: Heart, title: "شغف", desc: "بنحب اللي بنعمله وبنقدمه بحب." },
  { icon: Users, title: "قرب من الطالب", desc: "بنفهم احتياجاتك وبنساعدك." },
  { icon: Award, title: "جودة", desc: "أفضل الخامات وأحدث الأجهزة." },
  { icon: Target, title: "دقة", desc: "بندقق في كل تفصيلة عشانك." },
];

function AboutPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-gradient-to-l from-brand-gold/15 via-transparent to-brand-orange/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="text-center lg:text-right">
              <h1 className="text-4xl font-black text-brand-dark sm:text-5xl">من نحن</h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                <span className="font-bold text-brand-dark">مكتبة الشافعي</span>.
                من سنين واحنا بنخدم طلاب المنطقة، بنوفر كل احتياجاتهم من كتب وأدوات مكتبية،
                وبنقدم خدمات التصوير والطباعة وتنسيق الأبحاث بأعلى جودة.
              </p>
              <p className="mt-3 leading-8 text-muted-foreground">
                هدفنا إن كل طالب يلاقي عندنا اللي محتاجه في مكان واحد، وبأسعار مناسبة، وبابتسامة.
              </p>
            </div>
            <div className="mx-auto lg:mx-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-brand-orange/20 blur-3xl" />
                <img
                  src={logoAsset.url}
                  alt="مكتبة الشافعي"
                  className="relative h-56 w-56 rounded-full object-cover ring-4 ring-brand-gold/40 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-brand-dark">قيمنا</h2>
          <p className="mt-3 text-muted-foreground">اللي بنؤمن بيه وبنشتغل عليه كل يوم</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border/60 bg-card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-gold text-white shadow-md">
                <v.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-brand-dark">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { n: "10+", l: "سنين خبرة" },
            { n: "5000+", l: "طالب سعيد" },
            { n: "50+", l: "خدمة ومنتج" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-3xl bg-gradient-to-br from-brand-dark to-[oklch(0.28_0.09_25)] p-8 text-center text-white shadow-xl"
            >
              <div className="text-4xl font-black text-brand-gold sm:text-5xl">{s.n}</div>
              <div className="mt-2 text-sm font-semibold text-white/80">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-8 py-3.5 text-sm font-bold text-white hover:bg-brand-orange transition-colors"
          >
            اتواصل معانا
          </Link>
        </div>
      </section>
    </>
  );
}
