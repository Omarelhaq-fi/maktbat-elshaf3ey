import { Link } from "@tanstack/react-router";
import { Facebook, Phone, MapPin, Clock } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="مكتبة الشافعي" className="h-14 w-14 rounded-full ring-2 ring-brand-gold/50" />
            <div>
              <div className="text-lg font-extrabold">مكتبة الشافعي</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/80 max-w-md">
            مكتبتك اللي بتلاقي فيها كل حاجة — كتب دراسية، أدوات مكتبية، تصوير وطباعة، تنسيق أبحاث وتغليف. كله في مكان واحد وبأفضل جودة.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-brand-gold">روابط سريعة</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link to="/products" className="hover:text-brand-gold">المنتجات</Link></li>
            <li><Link to="/services" className="hover:text-brand-gold">الخدمات</Link></li>
            <li><Link to="/about" className="hover:text-brand-gold">من نحن</Link></li>
            <li><Link to="/contact" className="hover:text-brand-gold">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-brand-gold">تواصل</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-orange shrink-0" />
              <a href="tel:+201093923840" dir="ltr" className="hover:text-brand-gold">01093923840</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-orange shrink-0" />
              <a href="tel:+201091662769" dir="ltr" className="hover:text-brand-gold">+20 10 91662769</a>
            </li>
            <li className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-brand-orange shrink-0" />
              <a
                href="https://www.facebook.com/profile.php?id=61557499173184"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-gold"
              >
                صفحتنا على فيسبوك
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-orange shrink-0" />
              <span>يومياً من 9 ص لـ 11 م</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-orange shrink-0" />
              <span>ال٤٧ الشارع المقابل لسيراميكا رويال، كفر الشيخ، مصر 33511</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <div>© {new Date().getFullYear()} مكتبة الشافعي — جميع الحقوق محفوظة</div>
          <div>
            تصميم وتطوير{" "}
            <a
              href="https://www.instagram.com/omarelhaqq/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand-gold hover:text-white transition-colors"
            >
              Omar Elhaq
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
