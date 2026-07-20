import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, ShoppingCart, User, LogOut } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/products", label: "المنتجات" },
  { to: "/services", label: "الخدمات" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logoAsset.url} alt="مكتبة الشافعي" className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-orange/30" />
          <div className="hidden sm:block">
            <div className="text-base font-extrabold text-brand-dark leading-tight">مكتبة الشافعي</div>
            <div className="text-[11px] text-muted-foreground">كل احتياجاتك في مكان واحد</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-4 py-2 rounded-full text-sm font-semibold text-foreground/80 hover:text-brand-dark hover:bg-brand-gold/20 transition-colors"
              activeProps={{ className: "text-brand-dark bg-brand-gold/30" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-full bg-brand-gold/30 p-2.5 text-brand-dark hover:bg-brand-gold/50"
            aria-label="السلة"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 min-w-5 h-5 px-1 rounded-full bg-brand-orange text-white text-[11px] font-black flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link
                to="/my-orders"
                className="inline-flex items-center gap-2 rounded-full bg-brand-gold/30 px-3 py-2 text-sm font-bold text-brand-dark hover:bg-brand-gold/50"
              >
                <User className="h-4 w-4" />
                طلباتي
              </Link>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center justify-center rounded-full bg-brand-gold/30 p-2 text-brand-dark hover:bg-brand-gold/50"
                aria-label="خروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-brand-gold/30 px-3 py-2 text-sm font-bold text-brand-dark hover:bg-brand-gold/50"
            >
              <User className="h-4 w-4" />
              دخول
            </Link>
          )}

          <a
            href="tel:+201093923840"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-brand-orange transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span dir="ltr">01093923840</span>
          </a>
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-full bg-brand-gold/30 p-2 text-brand-dark"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-foreground/80 hover:bg-brand-gold/20"
                activeProps={{ className: "text-brand-dark bg-brand-gold/30" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/my-orders"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-foreground/80 hover:bg-brand-gold/20"
                >
                  طلباتي
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="text-right px-4 py-3 rounded-xl text-sm font-semibold text-foreground/80 hover:bg-brand-gold/20"
                >
                  تسجيل خروج
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-foreground/80 hover:bg-brand-gold/20"
              >
                تسجيل الدخول
              </Link>
            )}
            <a
              href="tel:+201093923840"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-4 py-3 text-sm font-bold text-white"
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">01093923840</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
