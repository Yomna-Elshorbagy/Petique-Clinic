import { ShoppingBag, Heart, PawPrint } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./features.module.css";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const features: Feature[] = [
  { icon: ShoppingBag, title: "Wide Selection", desc: "Wide variety of products for dogs, cats, and more" },
  { icon: Heart, title: "Quality Care", desc: "Vet-approved products you can trust" },
  { icon: PawPrint, title: "Happy Pets", desc: "Making tails wag since 2024" },
];

const Features = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.card}>
              <feature.icon className={styles.icon} />
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.description}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
