import React, { useState } from "react";
import {
  FaSearch,
  FaSyringe,
  FaExclamationTriangle,
  FaPaw,
  FaUser,
  FaPhone,
  FaClock,
} from "react-icons/fa";
import {
  useDoctorSearchPets,
  useDoctorTodayWithVaccinationAlerts,
} from "../../../Hooks/Reservation/useDoctorPatients";

const DoctorPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: alerts, isLoading: isLoadingAlerts } =
    useDoctorTodayWithVaccinationAlerts();
  const { data: searchResults, isLoading: isSearching } =
    useDoctorSearchPets(debouncedSearch);

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <div className="p-6 space-y-8 min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#86654F] flex items-center gap-3">
            <FaPaw className="text-[#D97706]" />
            Patient Management
          </h1>
          <p className="text-[#A98770] mt-1">
            Manage your patients and monitor vaccination alerts.
          </p>
        </div>
      </div>

      {/* Alerts Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FaExclamationTriangle className="text-amber-500 text-xl" />
          <h2 className="text-xl font-bold text-[#86654F]">
            Today's Vaccination Alerts
          </h2>
        </div>

        {isLoadingAlerts ? (
          <div className="h-32 flex items-center justify-center bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
            <span className="text-[#A98770]">Loading alerts...</span>
          </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alerts.map((alert: any) => (
              <div
                key={alert.petId}
                className="bg-white rounded-xl shadow-md border-l-4 border-amber-500 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <FaSyringe />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {alert.petName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Vaccination Alert
                        </p>
                      </div>
                    </div>
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                      Due Today
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-2">
                      <FaUser className="text-[#A98770]" />{" "}
                      {alert.owner?.userName}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaPhone className="text-[#A98770]" />{" "}
                      {alert.owner?.mobileNumber}
                    </p>
                  </div>

                  {alert.vaccinations && alert.vaccinations.length > 0 && (
                    <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <p className="text-xs font-bold text-amber-800 mb-1">
                        Vaccines Due:
                      </p>
                      <ul className="list-disc list-inside text-xs text-amber-700">
                        {alert.vaccinations.map((v: any, i: number) => (
                          <li key={i}>{v.vaccine.name || "Unknown Vaccine"}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
              <FaSyringe />
            </div>
            <p className="text-gray-500">No vaccination alerts for today.</p>
          </div>
        )}
      </section>

      {/* Search Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FaSearch className="text-[#86654F] text-xl" />
          <h2 className="text-xl font-bold text-[#86654F]">Search Patients</h2>
        </div>

        <div className="relative mb-8">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98770]" />
          <input
            type="text"
            placeholder="Search patients... eg: By owner name, email, phone, and by pet name, age , weight "
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FCF9F4] border-none focus:ring-2 focus:ring-[#A98770]/50 text-[#86654F] placeholder-[#A98770]/70 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {debouncedSearch && (
          <div className="space-y-6">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#A98770]/60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#86654F] mb-3"></div>
                <p>Searching database...</p>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {searchResults.map((pet: any) => (
                  <div
                    key={pet._id}
                    className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0eadd] relative overflow-hidden"
                  >
                    {/* Decorative Background Blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF6F1] rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start">
                      {/* Pet Avatar / Icon */}
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#f4ece4] to-[#eaddd0] flex flex-col items-center justify-center text-[#86654F] shadow-inner shrink-0 overflow-hidden border border-[#dccdc1]">
                        {pet.image?.secure_url ? (
                          <img
                            src={pet.image.secure_url}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <FaPaw className="text-3xl mb-1 opacity-80" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A98770]">
                              {pet.category?.name || "Pet"}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Pet Info */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-bold text-[#86654F] leading-tight group-hover:text-[#D97706] transition-colors">
                              {pet.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[#A98770]">
                              <span className="bg-[#FAF6F1] px-2 py-0.5 rounded-md border border-[#eee5db] text-xs font-medium uppercase tracking-wide">
                                {pet.category?.name || "Unknown Category"}
                              </span>
                              {pet.age && (
                                <span className="bg-[#FAF6F1] px-2 py-0.5 rounded-md border border-[#eee5db]">
                                  Age: {pet.age}{" "}
                                </span>
                              )}
                              {pet.weight && (
                                <span className="bg-[#FAF6F1] px-2 py-0.5 rounded-md border border-[#eee5db]">
                                  Weight: {pet.weight}
                                </span>
                              )}
                            </div>

                            {pet.allergies && pet.allergies.length > 0 && (
                              <div className="mt-2 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md inline-block border border-red-100">
                                <strong>Allergies:</strong>{" "}
                                {pet.allergies.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-[#f0eadd] my-3"></div>

                        {/* Owner Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm mb-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaUser className="text-[#D97706] text-xs" />
                            <span className="font-medium text-[#86654F]">
                              {pet.petOwner?.userName || "Unknown Owner"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaPhone className="text-[#D97706] text-xs" />
                            <span className="text-gray-500">
                              {pet.petOwner?.mobileNumber || "N/A"}
                            </span>
                          </div>
                          {pet.petOwner?.email && (
                            <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                              <span className="text-[#D97706] text-xs font-bold">
                                @
                              </span>
                              <span className="text-gray-500 truncate">
                                {pet.petOwner.email}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Vaccinations Mini-List */}
                        {pet.vaccinationHistory &&
                          pet.vaccinationHistory.length > 0 && (
                            <div className="mt-3 bg-[#FDFBF7] p-3 rounded-xl border border-[#f0eadd]">
                              <h4 className="text-xs font-bold text-[#86654F] mb-2 flex items-center gap-1">
                                <FaSyringe className="text-[#D97706]" />{" "}
                                Vaccination History
                              </h4>
                              <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                {pet.vaccinationHistory.map(
                                  (v: any, idx: number) => (
                                    <div
                                      key={v._id || idx}
                                      className="text-xs flex justify-between items-center border-b border-[#eee5db] last:border-0 pb-1 last:pb-0"
                                    >
                                      <div>
                                        <span className="text-gray-700 font-medium block">
                                          {/* Use vaccine name if populated in object, otherwise generic fallback */}
                                          {v.vaccineName || "Vaccine"}
                                          <span className="text-gray-400 font-normal ml-1">
                                            (Dose {v.doseNumber})
                                          </span>
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                          Date:{" "}
                                          {v.date
                                            ? new Date(
                                                v.date
                                              ).toLocaleDateString()
                                            : "N/A"}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span
                                          className={`px-1.5 py-0.5 rounded text-[10px] capitalize ${
                                            v.status === "completed"
                                              ? "bg-green-100 text-green-700"
                                              : v.status === "upcoming"
                                              ? "bg-blue-100 text-blue-700"
                                              : "bg-gray-100 text-gray-600"
                                          }`}
                                        >
                                          {v.status}
                                        </span>
                                        {v.nextDose && (
                                          <div className="text-[10px] text-[#A98770] mt-0.5">
                                            Next:{" "}
                                            {new Date(
                                              v.nextDose
                                            ).toLocaleDateString()}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-[#dccdc1] text-center">
                <div className="w-16 h-16 bg-[#FAF6F1] rounded-full flex items-center justify-center mb-4 text-[#dccdc1]">
                  <FaSearch size={24} />
                </div>
                <h3 className="text-lg font-semibold text-[#86654F]">
                  No patients found
                </h3>
                <p className="text-[#A98770] text-sm mt-1 max-w-xs">
                  We couldn't find any pets matching "{debouncedSearch}". Try a
                  different name, owner, or contact number.
                </p>
              </div>
            )}
          </div>
        )}

        {!debouncedSearch && (
          <div className="text-center py-12 opacity-50">
            <FaSearch className="mx-auto text-4xl text-gray-300 mb-2" />
            <p className="text-gray-400">Start typing to search for patients</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DoctorPatients;
