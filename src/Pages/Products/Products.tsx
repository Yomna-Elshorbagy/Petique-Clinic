import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../../Components/SEO/SEO";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import ProductCard from "../../Components/Products/ProductCard";
import ProductsHero from "../../Components/Products/ProductsHero";
import { getAllProducts } from "../../Apis/ProductApis";
import type { IProduct } from "../../Interfaces/IProducts";
import { getAllCategories } from "../../Apis/CategoryApis";
import type { ICategory } from "../../Interfaces/categryInterfaces";
import Features from "../../Components/Products/features";

interface ProductsState {
  items: IProduct[];
  allItems: IProduct[];
  loading: boolean;
  error: string | null;
}

interface PaginationState {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  prevPage: number | null;
  nextPage: number | null;
  totalResults: number;
}

interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  stock: "all" | "in" | "out";
}

const initialFilters: FilterState = {
  search: "",
  category: "all",
  minPrice: "",
  maxPrice: "",
  stock: "all",
};

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const { t } = useTranslation();

  const [productsState, setProductsState] = useState<ProductsState>({
    items: [],
    allItems: [],
    loading: true,
    error: null,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    numberOfPages: 1,
    limit: 12,
    prevPage: null,
    nextPage: null,
    totalResults: 0,
  });

  const [filters, setFilters] = useState<FilterState>(() => {
    // Initialize filters with category from URL if present
    if (categoryFromUrl) {
      return {
        ...initialFilters,
        category: decodeURIComponent(categoryFromUrl),
      };
    }
    return initialFilters;
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isFiltersDirty, setIsFiltersDirty] = useState(!!categoryFromUrl);

  const debouncedSearch = useDebouncedValue(filters.search, 300);

  // Update filters when URL category changes
  useEffect(() => {
    if (categoryFromUrl) {
      const decodedCategory = decodeURIComponent(categoryFromUrl);
      setFilters((prev) => ({
        ...prev,
        category: decodedCategory,
      }));
      setIsFiltersDirty(true);
    }
  }, [categoryFromUrl]);

  const fetchProducts = async (page: number = 1) => {
    try {
      setProductsState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await getAllProducts(page, pagination.limit);
      console.log("Products Array:", response.data);

      setProductsState({
        items: response.data,
        allItems: response.data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setProductsState({
        items: [],
        allItems: [],
        loading: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading products.",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      // fail silently for category dropdown
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(1);
  }, []);

  const filteredItems = useMemo(() => {
    let items = [...productsState.allItems];

    // text search on title
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.trim().toLowerCase();
      items = items.filter((product) =>
        product.title.toLowerCase().includes(term)
      );
    }

    // category filter (compare against populated category name)
    if (filters.category !== "all") {
      items = items.filter((product) => {
        if (typeof product.category === "string") {
          return product.category === filters.category;
        }
        return product.category?.name === filters.category;
      });
    }

    // price range
    const min =
      filters.minPrice.trim() !== "" ? Number(filters.minPrice) : undefined;
    const max =
      filters.maxPrice.trim() !== "" ? Number(filters.maxPrice) : undefined;

    if (typeof min === "number" && !Number.isNaN(min)) {
      items = items.filter(
        (product) => (product.finalPrice ?? product.price) >= min
      );
    }

    if (typeof max === "number" && !Number.isNaN(max)) {
      items = items.filter(
        (product) => (product.finalPrice ?? product.price) <= max
      );
    }

    // stock status
    if (filters.stock === "in") {
      items = items.filter((product) => product.stock > 0);
    } else if (filters.stock === "out") {
      items = items.filter((product) => product.stock <= 0);
    }

    return items;
  }, [productsState.allItems, debouncedSearch, filters]);

  const handlePageChange = (page: number, pageCount: number) => {
    if (page === pagination.currentPage || page < 1 || page > pageCount) return;
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsFiltersDirty(true);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setIsFiltersDirty(false);
    setSearchParams({});
  };

  const renderPagination = (pageCount: number, totalFiltered: number) => {
    if (pageCount <= 1) return null;

    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

    return (
      <nav
        aria-label="Product pagination"
        className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border-light)] pt-6"
      >
        <p className="text-sm text-[var(--color-text-muted)]">
          {t("pagination.showing")}{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">
            {Math.min(
              totalFiltered - (pagination.currentPage - 1) * pagination.limit,
              pagination.limit
            )}
          </span>{" "}
          {t("pagination.of")}{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">{totalFiltered}</span>{" "}
          {t("pagination.products")}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              handlePageChange(pagination.currentPage - 1, pageCount)
            }
            disabled={pagination.currentPage <= 1}
            className="
              inline-flex h-9 items-center rounded-full
              border border-[var(--color-border-light)]
              bg-[var(--color-bg-lighter)]
              px-4 text-xs font-medium
              text-[var(--color-text-primary)]
              transition-all duration-300
              hover:bg-[var(--color-bg-cream)]
              hover:shadow-sm
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {t("pagination.prev")}
          </button>

          <div className="flex items-center gap-1 overflow-x-auto rounded-full bg-[var(--color-bg-lighter)] px-2 py-1.5">
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page, pageCount)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                  page === pagination.currentPage
                    ? "bg-[var(--color-light-accent)] text-white shadow-md scale-110"
                    : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-lighter)] hover:text-amber-950 hover:shadow-sm hover:border hover:border-[var(--color-border-light)]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              handlePageChange(pagination.currentPage + 1, pageCount)
            }
            disabled={pagination.currentPage >= pageCount}
            className="
              inline-flex h-9 items-center rounded-full
              border border-[var(--color-border-light)]
              bg-[var(--color-bg-lighter)]
              px-4 text-xs font-medium
              text-[var(--color-text-primary)]
              transition-all duration-300
              hover:bg-[var(--color-bg-cream)]
              hover:shadow-sm
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <button>{t("pagination.next")}</button>
          </button>
        </div>
      </nav>
    );
  };

  if (productsState.loading && !productsState.items.length) {
    return <LoaderPage />;
  }

  const totalFiltered = filteredItems.length;
  const pageCount = Math.max(1, Math.ceil(totalFiltered / pagination.limit));
  const startIndex = (pagination.currentPage - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const pagedItems = filteredItems.slice(startIndex, endIndex);

  return (
    <>
      <SEO
        title="Products | Petique Clinic"
        description="Browse our curated pet products."
      />
      <ProductsHero />

      <section className=" py-4 text-center mt-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl text-[var(--color-text-secondary)] ">
            {t("products.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg  text-[#8A7A67] ">
            {t("products.subtitle")}
          </p>
        </div>
      </section>

      <Features />

      <main className="bg-[var(--color-light-background)] py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <section
            aria-label="Product filters"
            className="
              mb-8 rounded-2xl
              bg-[var(--color-bg-lighter)]
              p-5
              shadow-[0_4px_20px_rgba(0,0,0,0.08)]
              ring-1 ring-[var(--color-border-light)]
              backdrop-blur-sm
              transition-all duration-300
              hover:shadow-[0_6px_25px_rgba(0,0,0,0.12)]
              sm:p-6 lg:p-7
            "
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] sm:text-lg font-['Playfair_Display']">
                {t("products.filters.title")}
              </h2>
              <div className="flex items-center gap-2 text-xs">
                {isFiltersDirty && (
                  <span className="inline-flex h-6 items-center rounded-full bg-[var(--color-bg-warm)] px-3 text-[11px] font-medium text-[var(--color-text-primary)] ring-1 ring-[var(--color-border-medium)] animate-fadeIn">
                    {t("products.filters.active")}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-lighter)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-text-primary)] transition-all duration-300 hover:bg-[var(--color-bg-cream)] hover:border-[var(--color-border-medium)] hover:shadow-sm"
                >
                  {t("common.reset")}
                </button>
              </div>
            </div>

            <div className="grid gap-4 text-xs sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="search"
                  className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-primary)]"
                >
                  {t("products.filters.search")}
                </label>
                <input
                  id="search"
                  type="text"
                  value={filters.search}
                  onChange={(event) =>
                    handleFilterChange("search", event.target.value)
                  }
                  placeholder={t("products.filters.searchPlaceholder")}
                  className=" h-10 rounded-lg
                    border border-[var(--color-border-medium)]
                    bg-[var(--color-bg-cream)]
                    px-3 text-sm
                    text-[var(--color-text-primary)]
                    outline-none
                    transition-all duration-300
                    placeholder:text-[var(--color-text-muted)]
                    focus:bg-[var(--color-bg-lighter)]
                    focus:ring-1 focus:ring-[var(--color-light-accent)]
                    focus:border-[var(--color-light-accent)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-primary)]"
                >
                  {t("products.filters.category")}
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(event) =>
                    handleFilterChange("category", event.target.value)
                  }
                className=" h-10 rounded-lg
                    border border-[var(--color-border-medium)]
                    bg-[var(--color-bg-cream)]
                    px-3 text-sm
                    text-[var(--color-text-primary)]
                    outline-none
                    transition-all duration-300
                    placeholder:text-[var(--color-text-muted)]
                    focus:bg-[var(--color-bg-lighter)]
                    focus:ring-1 focus:ring-[var(--color-light-accent)]
                    focus:border-[var(--color-light-accent)]"                
                    >
                  <option value="all">
                    {t("products.filters.allCategories")}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  {t("products.filters.priceMin")}
                </label>
                <input
                  type="number"
                  min={0}
                  value={filters.minPrice}
                  onChange={(event) =>
                    handleFilterChange("minPrice", event.target.value)
                  }
                  placeholder={t("products.filters.min")}
                  className=" h-10 rounded-lg
                    border border-[var(--color-border-medium)]
                    bg-[var(--color-bg-cream)]
                    px-3 text-sm
                    text-[var(--color-text-primary)]
                    outline-none
                    transition-all duration-300
                    placeholder:text-[var(--color-text-muted)]
                    focus:bg-[var(--color-bg-lighter)]
                    focus:ring-1 focus:ring-[var(--color-light-accent)]
                    focus:border-[var(--color-light-accent)]"                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  {t("products.filters.priceMax")}
                </label>
                <input
                  type="number"
                  min={0}
                  value={filters.maxPrice}
                  onChange={(event) =>
                    handleFilterChange("maxPrice", event.target.value)
                  }
                  placeholder={t("products.filters.priceMax")}
                  className=" h-10 rounded-lg
                    border border-[var(--color-border-medium)]
                    bg-[var(--color-bg-cream)]
                    px-3 text-sm
                    text-[var(--color-text-primary)]
                    outline-none
                    transition-all duration-300
                    placeholder:text-[var(--color-text-muted)]
                    focus:bg-[var(--color-bg-lighter)]
                    focus:ring-1 focus:ring-[var(--color-light-accent)]
                    focus:border-[var(--color-light-accent)]"                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="stock"
                  className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-primary)]"
                >
                  {t("products.filters.stock")}
                </label>
                <select
                  id="stock"
                  value={filters.stock}
                  onChange={(event) =>
                    handleFilterChange(
                      "stock",
                      event.target.value as FilterState["stock"]
                    )
                  }
                  className=" h-10 rounded-lg
                    border border-[var(--color-border-medium)]
                    bg-[var(--color-bg-cream)]
                    px-3 text-sm
                    text-[var(--color-text-primary)]
                    outline-none
                    transition-all duration-300
                    placeholder:text-[var(--color-text-muted)]
                    focus:bg-[var(--color-bg-lighter)]
                    focus:ring-1 focus:ring-[var(--color-light-accent)]
                    focus:border-[var(--color-light-accent)]"                >
                  <option value="all">{t("products.filters.all")}</option>
                  <option value="in">{t("products.filters.inStock")}</option>
                  <option value="out">{t("products.filters.outStock")}</option>
                </select>
              </div>
            </div>
          </section>

          <section aria-label="Product list" className="space-y-4">
            {productsState.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 animate-fadeIn transition-all duration-300">
                {productsState.error}
              </div>
            )}

            {!productsState.loading &&
              !filteredItems.length &&
              !productsState.error && (
                <div className="
                  flex flex-col items-center justify-center
                  rounded-2xl
                  border border-dashed border-[var(--color-border-light)]
                  bg-[var(--color-bg-lighter)]
                  py-12 text-center
                  animate-fadeIn
                  transition-all duration-300
                ">
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">
                    {t("products.empty.title")}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mb-4">
                    {t("products.empty.subtitle")}
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center rounded-full bg-[#e6953a] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-amber-600/30 transition-all duration-300 hover:bg-[#cc7422] hover:shadow-lg hover:scale-105"
                  >
                    {t("products.empty.clear")}
                  </button>
                </div>
              )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pagedItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {productsState.loading && productsState.items.length > 0 && (
              <div className="mt-4 text-center text-sm text-stone-600 animate-pulse">
                Updating products...
              </div>
            )}

            {renderPagination(pageCount, totalFiltered)}
          </section>
        </div>
      </main>
    </>
  );
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default Products;
