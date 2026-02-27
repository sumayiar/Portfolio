document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("animated-name");
  const divider = document.querySelector(".divider");

  // Name reveal
  setTimeout(() => {
    name.style.transition = "all 1.8s ease-out";
    name.style.opacity = "1";
    name.style.transform = "translateY(0)";
  }, 300);

  // Divider animation
  setTimeout(() => {
    divider.style.transition = "transform 1.6s ease-out";
    divider.style.transform = "scaleX(1)";
  }, 800);
});
