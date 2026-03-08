(function () {
  if (!window.Lenis) return;

  const lenis = new window.Lenis({
    duration: 2.2,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 0.7,
    smoothTouch: false,
    touchMultiplier: 1.4,
    infinite: false,
    lerp: 0.07,
    wheelMultiplier: 0.6
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      lenis.scrollTo(target, {
        duration: 2.4,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        lerp: 0.08
      });
    });
  });

  window.lenisStop = () => lenis.stop();
  window.lenisStart = () => lenis.start();
})();
