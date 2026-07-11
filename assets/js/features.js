(function () {
  var grid = document.querySelector("[data-feat-grid]");
  if (!grid) return;

  var cards = grid.querySelectorAll("[data-feat]");
  if (!cards.length) return;

  function reveal(el) {
    el.classList.add("is-visible");
  }

  if (!("IntersectionObserver" in window)) {
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
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );

  cards.forEach(function (card) {
    observer.observe(card);
  });
})();
