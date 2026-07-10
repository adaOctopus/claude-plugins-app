"use client";

import { useEffect } from "react";
import { COMING_SOON_SECTION_ID } from "@/lib/site-mode";

/** Smooth-scroll to #coming-soon when landing with that hash (WIP redirects). */
export function ScrollToHashOnLoad() {
  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash !== `#${COMING_SOON_SECTION_ID}`) return;
      const target = document.getElementById(COMING_SOON_SECTION_ID);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
