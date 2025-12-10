import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import type {
  productdetails,
  review,
  Users,
} from "../../Types/ProductDetailsType";
import { baseURL } from "../../Apis/BaseUrl";
import { toast, ToastContainer } from "react-toastify";
import { FaPaw } from "react-icons/fa";

import RelatedProductsSlider from "./RelatedProductsSlider";
import Loader from "./Loader";
import ErrorLoader from "./ErrorLoader";
import BackButton from "./BackButton";
import ErrorMessage from "./ErrorMessage";
import ReviewModal from "./ReviewModal";
import ToggleButton from "./ToggleButton";
import ReviewCard from "./ReviewCard";
import ReviewButton from "./ReviewButton";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showFull, setShowFull] = useState(false);
  const token = localStorage.getItem("accessToken");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showReviews, setShowReviews] = useState(false);
  const queryClient = useQueryClient();
  //get product
  async function getproductdetails() {
    const { data } = await axios.get(`${baseURL}/products/${id}`);
    return data.data;
  }
  let { isLoading, isError, data } = useQuery<productdetails>({
    queryKey: ["productdetails", id],
    queryFn: getproductdetails,
  });

  // related product
  async function getrelatedproducts() {
    const { data } = await axios.get(`${baseURL}/products/related/${id}`);
    return data.relatedProducts;
  }
  let {
    isLoading: relatedLoading,
    isError: relatedError,
    data: relatedProducts,
  } = useQuery<productdetails[]>({
    queryKey: ["relatedproducts", id],
    queryFn: getrelatedproducts,
  });
  // get review
  async function getreviews() {
    const { data: reviews } = await axios.get(
      `${baseURL}/reviews/productReviews/${id}`,
      {
        headers: {
          authentication: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(reviews.data);
    return reviews.data;
  }
  let {
    isLoading: reviewloading,
    isError: reviewError,
    data: reviewdata,
  } = useQuery<review[]>({
    queryKey: ["Reviews", id],
    queryFn: getreviews,
  });
  // get user
  async function getuser() {
    const { data: user } = await axios.get(`${baseURL}/user/allUsers`, {
      headers: {
        authentication: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(user.data);
    return user.data;
  }
  const { data: userdata } = useQuery<Users[]>({
    queryKey: ["users"],
    queryFn: getuser,
  });
  // DELETE REVIEW
  const deletereview = useMutation({
    mutationFn: async (reviewId: string) => {
      await axios.delete(`${baseURL}/reviews/${reviewId}`, {
        headers: {
          authentication: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Review deleted successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ["Reviews", id] });
    },
    onError: (error) => {
      console.log("delete review error:", error);
      toast.error("Failed to delete Review ", { position: "top-center" });
    },
  });
  // add review
  const addreview = useMutation({
    mutationFn: async (newReview: { rate: number; comment: string }) => {
      const { data } = await axios.post(
        `${baseURL}/reviews/`,
        {
          product: id,
          rate: newReview.rate,
          comment: newReview.comment,
        },
        {
          headers: {
            authentication: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("new review", data);
      return data;
    },
    onSuccess: () => {
      toast.success("Review added successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ["Reviews", id] });
    },
    onError: (error) => {
      console.log("add review error", error);
      toast.error("Failed to add review", { position: "top-center" });
    },
  });
  if (isLoading) return <Loader />;

  if (isError) {
    return <ErrorLoader />;
  }

  if (!data) return null;
  //counter
  const handleIncrease = () => {
    console.log(data.stock);
    if (quantity < data.stock) setQuantity(quantity + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // jsx
  return (
    <>
      <div className="bg-[#f7f4ef] min-h-screen  relative">
        <BackButton />
        <div className="max-w-6xl mx-auto pt-28">
          <div className="flex flex-col md:flex-row  gap-10 items-center md:items-start  md:justify-between">
            <div className="flex flex-col items-center">
              <div className=" bg-white rounded-2xl overflow-hidden flex items-center justify-center w-[400px] h-[400px] shadow-lg">
                <img
                  src={selectedImage || data.imageCover.secure_url}
                  alt={data.title}
                  className="w-full h-full  "
                />
              </div>

              <div className="flex gap-3 mt-5">
                {[data.imageCover, ...data.subImages].map((img, index) => (
                  <img
                    key={index}
                    src={img.secure_url}
                    alt={`thumbnail-${index}`}
                    className={`
              w-20 h-20  rounded-xl border cursor-pointer shadow-sm 
              transition-all duration-200 hover:scale-105
              ${
                selectedImage === img.secure_url
                  ? "border-[#e9a66f] border-2"
                  : "border-gray-300"
              }
            `}
                    onClick={() => setSelectedImage(img.secure_url)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full  md:w-1/2 flex flex-col gap-4 bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
              <h1 className="text-3xl font-bold text-orange-400">
                {data.title}
              </h1>

              <p className="text-[#3a342f] leading-relaxed">
                {showFull
                  ? data.description
                  : data.description.split(" ").slice(0, 20).join(" ") + "..."}
                <span
                  className="text-orange-400 cursor-pointer ml-1"
                  onClick={() => setShowFull(!showFull)}
                >
                  {showFull ? "Show Less" : "Read More"}
                </span>
              </p>

              <p className="text-xl font-semibold text-orange-400">
                Price:{" "}
                <span className="  font-bold text-[#3a342f]">
                  ${data.finalPrice}
                </span>
              </p>

              <p className="text-orange-400 font-semibold text-lg">
                Category:{" "}
                <span className="font-bold text-[#3a342f]">
                  {data.category.name}
                </span>
              </p>

              <div className="flex items-center gap-4 mt-4">
                <button
                  className="w-10 h-10 bg-gray-200 rounded-lg text-xl font-bold disabled:opacity-40"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <span className="text-lg font-medium">{quantity}</span>

                <button
                  className="w-10 h-10 bg-gray-200 rounded-lg text-xl font-bold disabled:opacity-40"
                  onClick={handleIncrease}
                  disabled={quantity >= data.stock}
                >
                  +
                </button>
              </div>

              <button className="mt-6 px-6 py-3 bg-orange-400 text-white text-lg font-bold rounded-xl shadow-md ">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <hr className="my-10 border-t border-gray-300" />

        <h2 className="text-4xl  text-center font-bold text-orange-400 mb-5 flex items-center justify-center gap-2">
          Proudct Reviews <FaPaw size={28} />
        </h2>
        {showReviews && (
          <>
            <ReviewButton isOpen={() => setIsModalOpen(true)} />
            {reviewloading && <Loader />}
            {reviewError && <ErrorMessage />}
            {reviewdata &&
              reviewdata.length > 0 &&
              reviewdata.map((review) => {
                const user = userdata?.find(
                  (user) => user._id === review.user._id
                );
                if (!user) return null;
                return (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    user={user}
                    onDelete={(id) => deletereview.mutate(id)}
                  />
                );
              })}
          </>
        )}

        <ToggleButton
          isOpen={showReviews}
          onClick={() => setShowReviews(!showReviews)}
        />

        <hr className="my-10 border-t border-gray-300" />
        <h2 className="text-4xl  text-center font-bold text-orange-400 mb-6 flex items-center justify-center gap-2">
          Related Products <FaPaw size={28} />
        </h2>

        {relatedLoading && <Loader />}
        {relatedError && <ErrorLoader />}

        {relatedProducts && relatedProducts.length > 0 && (
          <RelatedProductsSlider relatedProducts={relatedProducts} />
        )}
        <ToastContainer />

        {isModalOpen && (
          <ReviewModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={(rate, comment) => addreview.mutate({ rate, comment })}
          />
        )}
      </div>
    </>
  );
}
