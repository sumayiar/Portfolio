document.addEventListener("DOMContentLoaded", () => {
  const headerElements = Array.from(document.querySelectorAll("header > *"));
  const revealTargets = Array.from(
    document.querySelectorAll(".section-title, .project, .skyline, footer")
  );

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
