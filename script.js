document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");
  const headerElements = Array.from(document.querySelectorAll("header > *"));
  const revealTargets = Array.from(
    document.querySelectorAll(".section-title, .project, .skyline, footer")
  );
  const frameTargets = Array.from(document.querySelectorAll("header, section"));
  const cardTargets = Array.from(document.querySelectorAll(".project"));

  const getStoredTheme = () => {
    try {
      return window.localStorage.getItem("portfolio-theme");
    } catch {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      window.localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Browsers can block storage in some privacy modes.
    }
  };

  const applyTheme = (isNight) => {
    document.body.classList.toggle("night-theme", isNight);

    if (!themeToggle) {
      return;
    }

    themeToggle.setAttribute("aria-pressed", String(isNight));
    themeToggle.setAttribute(
      "aria-label",
      isNight ? "Switch to day theme" : "Switch to night theme"
    );
  };

  applyTheme(getStoredTheme() === "night");

  themeToggle?.addEventListener("click", () => {
    const isNight = !document.body.classList.contains("night-theme");
    applyTheme(isNight);
    storeTheme(isNight ? "night" : "day");
  });

  headerElements.forEach((element, index) => {
    element.style.transitionDelay = `${index * 140}ms`;
    requestAnimationFrame(() => {
      element.classList.add("is-visible");
    });
  });

  const distanceFromViewportCenter = (rect) => {
    const viewportCenter = window.innerHeight / 2;

    if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
      return 0;
    }

    return Math.min(
      Math.abs(rect.top - viewportCenter),
      Math.abs(rect.bottom - viewportCenter)
    );
  };

  const findFocusedElement = (elements) => {
    return elements.reduce(
      (focused, element) => {
        const rect = element.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          return focused;
        }

        const distance = distanceFromViewportCenter(rect);

        if (!focused.element || distance < focused.distance) {
          return { element, distance };
        }

        return focused;
      },
      { element: null, distance: Number.POSITIVE_INFINITY }
    ).element;
  };

  const setFocusedElement = (elements, focusedElement, className) => {
    elements.forEach((element) => {
      element.classList.toggle(className, element === focusedElement);
    });
  };

  let focusFrameRequest = null;

  const updateFrameFocus = () => {
    focusFrameRequest = null;
    const focusedFrame = findFocusedElement(frameTargets);
    const focusedCard = findFocusedElement(cardTargets);

    document.body.classList.toggle("frame-focus-ready", Boolean(focusedFrame));
    setFocusedElement(frameTargets, focusedFrame, "is-frame-focus");
    setFocusedElement(cardTargets, focusedCard, "is-card-focus");
  };

  const requestFrameFocusUpdate = () => {
    if (focusFrameRequest) {
      return;
    }

    focusFrameRequest = window.requestAnimationFrame(updateFrameFocus);
  };

  updateFrameFocus();
  window.addEventListener("scroll", requestFrameFocusUpdate, { passive: true });
  window.addEventListener("resize", requestFrameFocusUpdate);

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  revealTargets.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 110}ms`;
    observer.observe(element);
  });
});
