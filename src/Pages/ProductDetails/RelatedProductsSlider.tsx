import type { productdetails } from "../../Types/ProductDetailsType";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

type Props = {
  relatedProducts: productdetails[];
};

export default function RelatedProductsSlider({ relatedProducts }: Props) {
  return (
    <Slider
      dots={true}
      infinite={true}
      speed={500}
      slidesToShow={4}
      slidesToScroll={1}
      autoplay={true}
      autoplaySpeed={3000}
      responsive={[
        {
          breakpoint: 1024,
          settings: { slidesToShow: 3 },
        },
        {
          breakpoint: 768,
          settings: { slidesToShow: 2 },
        },
        {
          breakpoint: 640,
          settings: { slidesToShow: 1 },
        },
      ]}
    >
      {relatedProducts.map((product) => (
        <div key={product._id} className="p-4 ">
          <Link to={`/product-details/${product._id}`}>
            <div className="bg-[#ebe1d7]  rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
              <div className=" overflow-hidden bg-gray-50 ">
                <img
                  src={product.imageCover.secure_url}
                  alt={product.title}
                  className="w-full h-64   group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <h3 className="text-center font-bold text-gray-800 text-lg mb-2 ">
                  {product.title.split(" ").slice(0, 3).join(" ")}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {Array.from({ length: product.rate }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#f59e0b"
                      viewBox="0 0 24 24"
                      stroke="#f59e0b"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z"
                      />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-2xl font-bold text-orange-400">
                    ${product.finalPrice}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </Slider>
  );
}
