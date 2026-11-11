/* Loads the Google map embeds once the page has loaded and the visitor starts using it (or 8 s after load). */
(function () {
  var started = false, ev = ['scroll', 'pointerdown', 'pointermove', 'touchstart', 'keydown', 'wheel'];
  function load(f) { var u = f.getAttribute('data-src'); if (u) { f.src = u; f.removeAttribute('data-src'); } }
  function go() {
    if (started) return; started = true;
    ev.forEach(function (t) { removeEventListener(t, go, true); });
    var fs = [].slice.call(document.querySelectorAll('iframe[data-src]'));
    if (!('IntersectionObserver' in window)) { fs.forEach(load); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '800px 0px' });
    fs.forEach(function (f) { io.observe(f); });
    setTimeout(function () { fs.forEach(load); }, 5000);  // any map scrolled past too fast still loads
  }
  function arm() { ev.forEach(function (t) { addEventListener(t, go, { capture: true, passive: true }); }); setTimeout(go, 8000); }
  if (document.readyState === 'complete') arm(); else addEventListener('load', arm);
})();
