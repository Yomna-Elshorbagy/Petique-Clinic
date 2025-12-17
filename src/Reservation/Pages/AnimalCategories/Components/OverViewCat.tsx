import { FaDog, FaCat, FaDove, FaFish, FaPaw } from "react-icons/fa";
import { GiRabbit, GiTortoise } from "react-icons/gi";
import type { IAnimalCategory } from "../../../../Interfaces/IAnimalCategory";

type Props = {
  categories: (IAnimalCategory & { petCount?: number })[];
  maxCount?: number;
};

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("dog")) return <FaDog />;
  if (lowerName.includes("cat")) return <FaCat />;
  if (lowerName.includes("bird")) return <FaDove />;
  if (lowerName.includes("fish")) return <FaFish />;
  if (lowerName.includes("rabbit")) return <GiRabbit />;
  if (lowerName.includes("turtle") || lowerName.includes("reptile"))
    return <GiTortoise />;
  return <FaPaw />;
};

export default function CategoryOverview({ categories, maxCount }: Props) {
  const computedMax =
    maxCount && maxCount > 0
      ? maxCount
      : Math.max(...categories.map((c) => c.petCount || 0), 1);

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm border border-[#F0E9E4]">
      <h2 className="text-xl font-semibold text-[#86654F] mb-4">
        Category Overview
      </h2>

      <div className="space-y-4">
        {categories.map((cat) => {
          const count = cat.petCount || 0;
          const pct = Math.round((count / computedMax) * 100);

          return (
            <div key={cat._id} className="flex items-center gap-4">
              <div className="w-11 h-11 flex-shrink-0 rounded-md bg-[#FBF6F3] flex items-center justify-center text-[#A98770] text-lg shadow-sm">
                {getIcon(cat.name)}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#86654F] font-medium">{cat.name}</span>
                  <span className="text-sm text-[#A98770]">{count} pets</span>
                </div>

                <div
                  className="w-full h-3 rounded-full bg-[#F3ECE7] overflow-hidden"
                  aria-hidden
                >
                  <div
                    className="h-full rounded-full bg-[#B2896A] transition-all"
                    style={{
                      width: `${pct}%`,
                      minWidth: count === 0 ? "2%" : undefined,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
