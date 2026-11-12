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
/* Row 505 (2026-11-12): Google fills the listing card (name, address, rating, review count) in a cid= embed only when
   the frame is 420px or wider; narrower frames show a bare pin. Below 420px the listing frame is drawn 420px wide and
   scaled down to fit its box, so phones see the full card. Geographic q= maps are left alone. */
(function () {
  function fit() {
    [].forEach.call(document.querySelectorAll('.map-embed iframe'), function (f) {
      var u = f.getAttribute('src') || f.getAttribute('data-src') || '';
      if (u.indexOf('cid=') < 0) return;
      var w = f.parentNode;
      f.style.cssText = ''; w.style.height = ''; w.style.position = '';
      var cw = w.clientWidth;
      if (!cw || cw >= 420) return;
      var h = f.offsetHeight, k = cw / 420;
      w.style.position = 'relative'; w.style.height = h + 'px';
      f.style.cssText = 'position:absolute;left:0;top:0;width:420px;max-width:none;min-height:0;height:' + Math.round(h / k) + 'px;transform:scale(' + k.toFixed(4) + ');transform-origin:0 0';
    });
  }
  addEventListener('resize', fit);
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', fit); else fit();
})();
