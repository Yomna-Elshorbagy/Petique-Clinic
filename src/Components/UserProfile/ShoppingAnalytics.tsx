import React from "react";
import {
  useUserSpendingSummary,
  useUserTopCategories,
  useUserTopProducts,
} from "../../Hooks/UserProfile/useUserOrderAnalysis";
import {
  FaShoppingCart,
  FaWallet,
  FaChartLine,
  FaBoxOpen,
  FaThLarge,
} from "react-icons/fa";

const ShoppingAnalytics: React.FC = () => {
  const { data: summary, isLoading: isSummaryLoading } =
    useUserSpendingSummary();
  const { data: categories, isLoading: isCategoriesLoading } =
    useUserTopCategories();
  const { data: products, isLoading: isProductsLoading } = useUserTopProducts();

  const isLoading =
    isSummaryLoading || isCategoriesLoading || isProductsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F2A056]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1) Spending Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-[#A98868]/10 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-[#F2A056]/10 text-[#F2A056] rounded-xl">
            <FaWallet size={24} />
          </div>
          <div>
            <p className="text-sm text-[#A98868] dark:text-gray-400 font-medium uppercase tracking-wider">
              Total Spending
            </p>
            <h3 className="text-2xl font-bold text-[#443935] dark:text-white">
              EGP {summary?.totalSpent.toFixed(2) || "0.00"}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-[#A98868]/10 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-[#A98868]/10 text-[#A98868] rounded-xl">
            <FaShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-[#A98868] dark:text-gray-400 font-medium uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-bold text-[#443935] dark:text-white">
              {summary?.totalOrders || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-[#A98868]/10 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-[#8fb339]/10 text-[#8fb339] rounded-xl">
            <FaChartLine size={24} />
          </div>
          <div>
            <p className="text-sm text-[#A98868] dark:text-gray-400 font-medium uppercase tracking-wider">
              Avg Order Value
            </p>
            <h3 className="text-2xl font-bold text-[#443935] dark:text-white">
              EGP {summary?.avgOrderValue.toFixed(2) || "0.00"}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2) Top Categories */}
        <div className="bg-[#FCF9F4] dark:bg-gray-800/50 p-6 rounded-2xl border border-[#A98868]/10">
          <div className="flex items-center gap-3 mb-6">
            <FaThLarge className="text-[#F2A056]" />
            <h4 className="text-lg font-bold text-[#443935] dark:text-white">
              Most Purchased Categories
            </h4>
          </div>
          <div className="space-y-4">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat._id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-[#443935] dark:text-gray-200">
                      {cat.categoryName}
                    </span>
                    <span className="text-[#A98868]">
                      {cat.totalQuantity} items
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-[#F2A056] h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (cat.totalQuantity /
                            (categories[0].totalQuantity || 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#A98868] text-center py-4">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* 3) Top Products */}
        <div className="bg-[#FCF9F4] dark:bg-gray-800/50 p-6 rounded-2xl border border-[#A98868]/10">
          <div className="flex items-center gap-3 mb-6">
            <FaBoxOpen className="text-[#F2A056]" />
            <h4 className="text-lg font-bold text-[#443935] dark:text-white">
              Favorite Products
            </h4>
          </div>
          <div className="space-y-4">
            {products && products.length > 0 ? (
              products.map((prod) => (
                <div
                  key={prod.productId}
                  className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-[#A98868]/5"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={prod.image || "/placeholder-product.png"}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/100x100?text=Pet";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-[#443935] dark:text-gray-200 truncate">
                      {prod.title}
                    </h5>
                    <p className="text-xs text-[#A98868]">
                      {prod.totalQuantity} times purchased
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#F2A056]">
                      EGP {prod.totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#A98868] text-center py-4">
                No data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAnalytics;
