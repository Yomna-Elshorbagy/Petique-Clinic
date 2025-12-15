import { Facebook, Twitter, Instagram, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CatImg from "../../assets/images/catimg.png";
import DogImg from "../../assets/images/dogimg.png";

const QUICK_LINK_ROUTES: Record<string, string> = {
  about: "/#about",
  faq: "/#faq",
  services: "/service",
  team: "/#team",
  portfolio: "/",
  blog: "/blog",
};

export default function Footer() {
  const { t } = useTranslation();

  const services = t("footer.services.items", {
    returnObjects: true,
  }) as string[];

  
const quickLinks = t("footer.quickLinks.items", {
  returnObjects: true,
}) as Record<string, string>;


  const openingHours = t("footer.openingHours.items", {
    returnObjects: true,
  }) as { day: string; time: string }[];

  return (
    <footer className="bg-[#3c2f2f] text-white pt-20 pb-6 relative overflow-hidden">
      <img
        src={CatImg}
        alt={t("footer.images.cat")}
        className="hidden lg:block w-20 xl:w-24 select-none absolute left-0 z-20"
        style={{ bottom: "80px" }}
      />

      <img
        src={DogImg}
        alt={t("footer.images.dog")}
        className="hidden lg:block w-24 xl:w-32 select-none absolute right-0 z-20"
        style={{ bottom: "95px" }}
      />

      {/* === MAIN GRID === */}
      <div className="container mx-auto px-4 relative z-10 lg:px-16 xl:px-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* COLUMN 1 */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-[#e6953a] rounded-full flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide text-[#e6953a]">
                  <Link to="/">Petique</Link>
                </h2>
                <p className="text-xs opacity-75">
                  {t("footer.brand.tagline")}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed opacity-90 mb-6 max-w-[260px]">
              {t("footer.description")}
            </p>

            <div className="flex items-center bg-white/5 rounded-full overflow-hidden border border-white/10 hover:border-orange-400/50 transition-all duration-300 w-full max-w-[260px]">
              <input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                className="px-5 py-3 bg-transparent text-sm flex-1 focus:outline-none text-white/60 border-0"
              />
              <button className="w-12 h-12 rounded-full bg-[#e6953a] hover:bg-orange-500 transition-all duration-300 hover:scale-110 group flex items-center justify-center">
                <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h3 className="text-lg font-bold mb-5 border-b-2 border-orange-400 pb-2 inline-block">
              {t("footer.services.title")}
            </h3>
            <ul className="space-y-3 text-sm">
              {services.map((service, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 opacity-90 hover:opacity-100 hover:translate-x-1 transition-all duration-300 group"
                >
                  <span className="text-orange-400 mt-0.5">•</span>
                  <Link
                    to="/service"
                    className="group-hover:text-orange-400 transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h3 className="text-lg font-bold mb-5 border-b-2 border-orange-400 pb-2 inline-block">
              {t("footer.quickLinks.title")}
            </h3>
            <ul className="space-y-3 text-sm">
              {Object.entries(quickLinks).map(([key, label]) => (
                <li
                  key={key}
                  className="flex items-start gap-2 opacity-90 hover:opacity-100 hover:translate-x-1 transition-all duration-300 group"
                >
                  <span className="text-orange-400 mt-0.5">•</span>
                  <Link
                    to={QUICK_LINK_ROUTES[key]}
                    className="group-hover:text-orange-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* COLUMN 4 */}
          <div>
            <h3 className="text-lg font-bold mb-5 border-b-2 border-orange-400 pb-2 inline-block">
              {t("footer.openingHours.title")}
            </h3>
            <div className="space-y-3 text-sm">
              {openingHours.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between pb-3 border-b border-white/10"
                >
                  <span className="font-medium">{item.day}</span>
                  <span className="text-orange-300">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === BOTTOM === */}
      <div className="border-t border-white/10 mt-12 pt-6">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-75 text-center md:text-left">
            {t("footer.copyright")}
          </p>

          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Send].map((Icon, i) => (
              <button
                key={i}
                className="w-10 h-10 rounded-full bg-[#e6953a] hover:bg-orange-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
