import React, { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

function setMetaTag(attrName: string, attrValue: string, content: string) {
  const selector = `[${attrName}="${attrValue}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(`meta${selector}`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

const SEO: React.FC<SEOProps> = ({
  title = "Pet Clinic",
  description = "",
  keywords = "Pets , Vet ,",
  image = "",
  url = "http://localhost:5175/",
}) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    if (description) setMetaTag("name", "description", description);
    if (keywords) setMetaTag("name", "keywords", keywords);

    if (title) setMetaTag("property", "og:title", title);
    if (description) setMetaTag("property", "og:description", description);
    if (image) setMetaTag("property", "og:image", image);
    if (url) setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:type", "website");

    setMetaTag("name", "twitter:card", "summary_large_image");
    if (title) setMetaTag("name", "twitter:title", title);
    if (description) setMetaTag("name", "twitter:description", description);
    if (image) setMetaTag("name", "twitter:image", image);

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, keywords, image, url]);

  return null;
};

export default SEO;
