import { Bone } from "lucide-react";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { posts } from "./posts";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Blog() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    gsap.to(".bone-icon", {
      y: -10,
      x: isRTL ? -10 : 10,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, [isRTL]);

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 3;

  const getTranslatedPost = (post: (typeof posts)[0]) => {
    const id = post.id;
    const tTitle = t(`blog.posts.${id}.title`);
    const tDescription = t(`blog.posts.${id}.description`);
    const tCategory = t(`blog.posts.${id}.category`);
    const tTags = t(`blog.posts.${id}.tags`, { returnObjects: true }) as
      | string[]
      | undefined;
    const tContent = t(`blog.posts.${id}.content`, { returnObjects: true }) as
      | typeof post.content
      | undefined;

    return {
      title: tTitle.startsWith("blog.posts") ? post.title : tTitle,
      description: tDescription.startsWith("blog.posts")
        ? post.description
        : tDescription,
      category: tCategory.startsWith("blog.posts") ? post.category : tCategory,
      tags: Array.isArray(tTags) ? tTags : post.tags || [],
      content: tContent?.intro ? tContent : post.content,
    };
  };

  const translatedPosts = posts.map((post) => ({
    id: post.id,
    date: post.date,
    image: post.image,
    ...getTranslatedPost(post),
  }));
  console.log(translatedPosts);

  const categories = [...new Set(translatedPosts.map((post) => post.category))];
  console.log(categories);
  const allTags = [...new Set(translatedPosts.flatMap((post) => post.tags))];
  const latestPosts = translatedPosts.slice(0, 6);

  const filteredPosts = translatedPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesCategory && matchesTag;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <>
      {/* Header */}
      <div className="bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] transition-colors duration-300">
        <div className="relative bg-[#1f1b22] dark:bg-[var(--color-dark-card)] h-[360px] px-10 py-10 overflow-visible flex items-center justify-center md:justify-start font-serif">
          <div className="max-w-7xl text-center md:text-left w-full">
            <Bone
              key={i18n.language}
              className={`bone-icon w-30 h-30 text-white drop-shadow-[0_0_10px_#ff9100] ${
                isRTL
                  ? "ml-0 mr-[-30px] scale-y-[-1]"
                  : "ml-[-30px] mr-0 scale-y-[1]"
              }`}
              strokeWidth={2.5}
              color="#e3e3e3"
            />
            <h1
              className={`text-white text-3xl md:text-5xl font-extrabold mt-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("blog.latestArticles")}
            </h1>

            <div className="mt-8 flex justify-start md:justify-start gap-6 text-[#e9a66f] font-medium text-1xl md:text-1xl">
              <Link to="/home" className="hover:text-white transition-colors">
                {t("blog.home")}
              </Link>
              <span className="text-[#e9a66f]"> &gt; </span>
              <p className="text-white font-semibold">{t("blog.blog")}</p>
            </div>
          </div>

          <img
            src="/src/assets/images/cat-relaxing.png"
            alt="cat"
            className={`hidden md:block absolute bottom-[-120px] w-[600px] z-10 ${
              isRTL ? "left-0" : "right-0"
            }`}
          />
        </div>

        <div className="container mx-auto flex flex-col md:flex-row gap-6 mt-20 justify-center font-serif p-3 mb-10">
          {/* Posts Column */}
          <div className="w-full md:w-1/2">
            {expandedPostId === null ? (
              <>
                {displayedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="mb-6 bg-white dark:bg-[var(--color-dark-card)] rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    <img
                      src={post.image[0]}
                      alt={post.title}
                      className="w-full h-110 object-cover object-top md:h-140 md:object-center"
                    />
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mt-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {post.date} | {post.category}
                      </p>
                      <p className="mt-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                        {post.description}
                      </p>

                      <button
                        className="text-white bg-[#e9a66f] rounded-full w-50 mt-5 p-3 text-[18px]"
                        onClick={() => setExpandedPostId(post.id)}
                      >
                        {t("blog.readMore")}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i + 1
                          ? "bg-[#e9a66f] text-white"
                          : "text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* Expanded Post View */
              translatedPosts
                .filter((post) => post.id === expandedPostId)
                .map((post) => (
                  <div key={post.id} className="mb-6">
                    <div className="bg-white dark:bg-[var(--color-dark-card)] p-8 rounded-xl shadow-lg">
                      <img
                        src={post.image[0]}
                        alt={post.title}
                        className="w-full h-130 object-cover rounded"
                      />
                      <p className="text-gray-500 dark:text-gray-400 mt-3">
                        {post.date} | {post.category}
                      </p>
                      <h1 className="text-4xl font-bold mt-6 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                        {post.title}
                      </h1>

                      {post.content.intro && (
                        <p className="mt-6 leading-relaxed text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                          {post.content.intro}
                        </p>
                      )}
                      {post.content.body && (
                        <p className="mt-6 leading-relaxed text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                          {post.content.body}
                        </p>
                      )}
                      {post.content.head && (
                        <h2 className="text-3xl font-bold mt-6 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                          {post.content.head}
                        </h2>
                      )}
                      {post.content.tips && (
                        <ul className="pl-6 mt-4 space-y-2">
                          {post.content.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="flex items-center justify-center w-5 h-5 bg-[#e9a66f] text-white rounded-full text-xs font-bold">
                                ✓
                              </span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {post.content.conclusion && (
                        <p className="mt-6 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                          {post.content.conclusion}
                        </p>
                      )}

                      <button
                        className="bg-[var(--color-text-primary)] dark:bg-[var(--color-dark-accent)] text-white rounded-full px-6 py-2 mt-6 hover:opacity-90 transition"
                        onClick={() => setExpandedPostId(null)}
                      >
                        {t("blog.showLess")}
                      </button>
                    </div>

                    <div className="bg-white dark:bg-[var(--color-dark-card)] p-4 rounded-xl shadow-md mt-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-[#e9a66f] text-white rounded-full"
                            onClick={() => setSelectedTag(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3 mt-6 md:mt-0 space-y-6 p-3">
            {/* Search */}
            <div className="w-full max-w-md flex rounded-full overflow-hidden shadow-md">
              <input
                type="text"
                placeholder={t("blog.search")}
                className="flex-1 p-2 bg-white dark:bg-[var(--color-dark-card)] text-gray-800 dark:text-[var(--color-dark-text)] outline-none border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-[#e9a66f] text-white px-4 font-semibold hover:bg-orange-600 transition-colors">
                {t("blog.search")}
              </button>
            </div>

            {/* Latest Posts */}
            <div>
              <h3 className="font-bold mb-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                {t("blog.latestPosts")}
              </h3>
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex gap-2 mb-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-[var(--color-dark-background)]"
                  onClick={() => {
                    setExpandedPostId(post.id);
                    setSelectedCategory(post.category);
                    setSelectedTag(null);
                  }}
                >
                  <img
                    src={post.image[0]}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {post.date}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {post.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div>
              {/* <h3 className="font-bold mb-2 text-white">{t("blog.AllCategories")}</h3> */}
              <ul>
                <li
                  className={`cursor-pointer mb-1 font-semibold ${
                    selectedCategory === null
                      ? "text-[#e9a66f]"
                      : "text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                  }`}
                  onClick={() => {
                    setSelectedCategory(null);
                    setExpandedPostId(null);
                    setSelectedTag(null);
                  }}
                >
                  {t("blog.AllCategories")}
                </li>
                {categories?.map((cat) => (
                  <li
                    key={cat}
                    className={`cursor-pointer mb-1 ${
                      selectedCategory === cat
                        ? "text-[#e9a66f]"
                        : "text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setExpandedPostId(null);
                      setSelectedTag(null);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-[#e9a66f]">
                {t("blog.tags")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(
                  (expandedPostId
                    ? translatedPosts.find((p) => p.id === expandedPostId)?.tags
                    : allTags) || []
                ).map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1 rounded-full cursor-pointer ${
                      selectedTag === tag
                        ? "bg-[#e9a66f] text-white"
                        : "bg-gray-200 dark:bg-[var(--color-dark-background)] text-gray-800 dark:text-[var(--color-dark-text)]"
                    }`}
                    onClick={() => {
                      setSelectedTag(tag);
                      setExpandedPostId(null);
                      setSelectedCategory(null);
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {selectedTag && (
                  <span
                    className="text-xs px-3 py-1 bg-gray-500 text-white rounded-full cursor-pointer ml-2"
                    onClick={() => setSelectedTag(null)}
                  >
                    Clear ×
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
