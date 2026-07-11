(function () {
  var grid = document.querySelector("[data-feat-grid]");
  if (!grid) return;

  var cards = grid.querySelectorAll("[data-feat]");
  if (!cards.length) return;

  // Cards are visible by default (CSS). Optional entrance animation only.
  function reveal(el) {
    el.classList.add("is-visible");
    el.classList.remove("is-animated");
  }

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cards.forEach(reveal);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
  );

  cards.forEach(function (card) {
    var top = card.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.92) {
      reveal(card);
    } else {
      card.classList.add("is-animated");
      observer.observe(card);
    }
  });
})();
