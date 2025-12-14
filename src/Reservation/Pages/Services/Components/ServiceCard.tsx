import { FaTrash, FaArchive, FaClock, FaStar } from "react-icons/fa";

interface Service {
  _id: string;
  title: string;
  description: string;
  priceRange: string;
  category?: string;
  image?: {
    secure_url: string;
  };
  duration?: string;
}

interface CardProps {
  service: Service;
  onSoftDelete: (id: string) => void;
  onHardDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ServiceCard({
  service,
  onSoftDelete,
  onHardDelete,
  onEdit,
}: CardProps) {
  const popularity = Math.floor(Math.random() * (100 - 60 + 1) + 60);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-[#FCF9F4] p-3 rounded-2xl text-[#86654F]">
          <FaStar size={20} />
        </div>
        {service.category && (
          <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-600 shadow-sm">
            {service.category}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#E5A46C] transition-colors">
          {service.title ?? (service as any).name}
        </h3>
        <span className="text-[10px] font-mono text-[#A98770] bg-[#F7F3EF] px-1.5 py-0.5 rounded-md border border-[#E9DFD5]">
          #{service._id?.slice(-6).toUpperCase()}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
        {service.description}
      </p>

      {/* ===> stats row */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <FaClock className="text-[#E5A46C]" />
          <span>{service.duration}</span>
        </div>
        <span className="font-bold text-lg text-[#86654F]">
          ${service.priceRange}
        </span>
      </div>

      {/* ===> popularity Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Popularity</span>
          <span>{popularity}%</span>
        </div>
        <div className="w-full bg-[#f0ebe6] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#86654F] to-[#E5A46C] h-full rounded-full"
            style={{ width: `${popularity}%` }}
          />
        </div>
      </div>

      {/* ===> actions */}
      <div className="mt-auto">
        <button onClick={() => onEdit(service._id)} className="w-full py-3 rounded-xl border border-[#E5A46C] text-[#86654F] font-semibold hover:bg-[#E5A46C] hover:text-white transition-all flex items-center justify-center gap-2 mb-3">
          Edit Details
        </button>

        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSoftDelete(service._id);
            }}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Soft Delete"
          >
            <FaArchive />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onHardDelete(service._id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Permanently"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
