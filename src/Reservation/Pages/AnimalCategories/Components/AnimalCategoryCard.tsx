import { FaDog, FaCat, FaDove, FaFish, FaPaw } from "react-icons/fa";
import { GiRabbit, GiTortoise } from "react-icons/gi";

interface Props {
  category: any;
  index: number;
  onSoftDelete: (id: string) => void;
  onHardDelete: (id: string) => void;
  onEdit: (category: any) => void;
}

export default function AnimalCategoryCard({
  category,
  index,
  onSoftDelete,
  onHardDelete,
  onEdit,
}: Props) {
  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("dog")) return <FaDog />;
    if (lower.includes("cat")) return <FaCat />;
    if (lower.includes("bird")) return <FaDove />;
    if (lower.includes("fish")) return <FaFish />;
    if (lower.includes("rabbit")) return <GiRabbit />;
    if (lower.includes("turtle") || lower.includes("reptile"))
      return <GiTortoise />;
    return <FaPaw />;
  };

  const cardColors = [
    "bg-[#FDF2E9]",
    "bg-[#F4F1EA]",
    "bg-[#EBF5EE]",
    "bg-[#F9EBE0]",
    "bg-[#FDF4F4]",
    "bg-[#F0F0F0]",
  ];

  return (
    <div
      className={`${
        cardColors[index % cardColors.length]
      } p-8 rounded-3xl shadow-sm hover:shadow-md transition-all relative group h-48 flex flex-col justify-between`}
    >
      {/* ===> here hover buttons */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        {/* ===> Edit button */}
        <button
          onClick={() => onEdit(category)}
          className="p-2 bg-white/80 rounded-full text-blue-500 hover:bg-white hover:text-blue-600 transition-colors"
          title="Edit Category"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5h2M5 11h14M12 19l7-7-7-7"
            />
          </svg>
        </button>

        {/* ===> here soft delete */}
        <button
          onClick={() => onSoftDelete(category._id)}
          className="p-2 bg-white/80 rounded-full text-[#F9BE91] hover:bg-white hover:text-[#e0a070] transition-colors"
          title="Archive"
        >
          <span className="sr-only">Archive</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </button>

        {/* ===> here hard delete */}
        <button
          onClick={() => onHardDelete(category._id)}
          className="p-2 bg-white/80 rounded-full text-red-400 hover:bg-white hover:text-red-500 transition-colors"
          title="Delete Permanently"
        >
          <span className="sr-only">Delete</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#A98770] text-3xl shadow-sm">
        {getIcon(category.name)}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[#86654F] mb-1">
          {category.name}
        </h3>
        <p className="text-[#A98770] font-medium">
          <span className="text-3xl font-bold text-[#86654F] mr-2">
            {category.petCount || 0}
          </span>
          registered pets
        </p>
      </div>

      <div className="absolute bottom-0 right-0 opacity-10 text-9xl text-[#86654F] pointer-events-none overflow-hidden rounded-br-3xl">
        <div className="transform translate-x-4 translate-y-4">
          {getIcon(category.name)}
        </div>
      </div>
    </div>
  );
}
