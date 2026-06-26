document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");
  const headerElements = Array.from(document.querySelectorAll("header > *"));
  const revealTargets = Array.from(
    document.querySelectorAll(".section-title, .project, .skyline, footer")
  );

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
