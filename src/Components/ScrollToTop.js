import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Reset browser scrolling.
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Reset scrollable application containers.
    document.querySelectorAll("*").forEach((element) => {
      const style = window.getComputedStyle(element);
      const isScrollable =
        /(auto|scroll)/.test(style.overflowY) &&
        element.scrollHeight > element.clientHeight;

      if (isScrollable) {
        element.scrollTop = 0;
      }
    });
  }, [pathname]);

  return null;
}