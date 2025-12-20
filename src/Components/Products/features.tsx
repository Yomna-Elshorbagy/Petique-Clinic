import { ShoppingBag, Heart, PawPrint } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./features.module.css";

const ICON_MAP: Record<string, LucideIcon> = {
  shopping: ShoppingBag,
  care: Heart,
  happy: PawPrint,
};

const Features = () => {
  const { t, i18n } = useTranslation();

  const features = t("features.items", {
    returnObjects: true,
  }) as { icon: string; title: string; desc: string }[];

  return (
    <section
      className={styles.section}
      dir={i18n.dir()}   
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((feature, idx) => {
            const Icon = ICON_MAP[feature.icon];

            return (
              <div key={idx} className={styles.card}>
                {Icon && <Icon className={styles.icon} />}
                <h3 className={styles.title}>{feature.title}</h3>
                <p className={styles.description}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
