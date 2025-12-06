import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, Search } from "lucide-react";
import { getAllClinicReviews } from "../../Apis/ClinicReviewsApis";
import ReviewCard from "./Components/ReviewCard";
import ReviewModal from "./Components/ReviewModal";
import type { IClinicReviewWithUser } from "../../Interfaces/IReviews";
import { Helmet } from "react-helmet";

const ClinicReviews: React.FC = () => {
    const [reviews, setReviews] = useState<IClinicReviewWithUser[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<IClinicReviewWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<"all" | "doctor" | "service" | "clinic">("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await getAllClinicReviews();
            setReviews(data);
            setFilteredReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        if (activeFilter === "all") {
            setFilteredReviews(reviews);
        } else if (activeFilter === "doctor") {
            setFilteredReviews(reviews.filter((r) => r.doctor));
        } else if (activeFilter === "service") {
            setFilteredReviews(reviews.filter((r) => r.service));
        } else if (activeFilter === "clinic") {
            setFilteredReviews(reviews.filter((r) => !r.doctor && !r.service));
        }
    }, [activeFilter, reviews]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#FDFBF7] pb-20 pt-10"
        >
            <Helmet>
                <title>Clinic Reviews | Petique</title>
            </Helmet>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* ===> header Section <=== */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-[#5A4033] mb-2">Recent Reviews</h1>
                            <p className="text-[#8C7A6B]">
                                {reviews.length} reviews found
                            </p>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-[#E5A46C] hover:bg-[#D4935B] text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-[#E5A46C]/20 transform hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5" />
                            Write a Review
                        </button>
                    </div>

                    {/* ===> Filters <=== */}
                    <div className="flex items-center gap-4 mt-8 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                            { id: "all", label: "All Reviews" },
                            { id: "doctor", label: "Doctors" },
                            { id: "service", label: "Services" },
                            { id: "clinic", label: "Clinic" },
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${activeFilter === filter.id
                                    ? "bg-[#E5A46C] text-white border-[#E5A46C] shadow-md shadow-[#E5A46C]/20"
                                    : "bg-white border-[#EAE0D5] text-[#8C7A6B] hover:border-[#E5A46C] hover:text-[#E5A46C]"
                                    }`}
                            >
                                {filter.id === "all" && <Filter className="w-4 h-4" />}
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/*===> reviews Grid <===*/}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-[#F0EAE0] h-72 animate-pulse">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-[#F5F0EB] rounded-full" />
                                    <div className="space-y-3">
                                        <div className="h-4 w-32 bg-[#F5F0EB] rounded" />
                                        <div className="h-3 w-24 bg-[#F5F0EB] rounded" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-[#F5F0EB] rounded" />
                                    <div className="h-4 w-full bg-[#F5F0EB] rounded" />
                                    <div className="h-4 w-2/3 bg-[#F5F0EB] rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredReviews.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="bg-white p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#F0EAE0]">
                            <Search className="w-10 h-10 text-[#D4C5B5]" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-[#5A4033]">No reviews found</h3>
                        <p className="text-[#8C7A6B] mt-2">Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchReviews}
            />
        </motion.div>
    );
};

export default ClinicReviews;
