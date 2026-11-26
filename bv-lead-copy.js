/* Bloomview lead copy for spartanroofing-nj.com — added 2026-11-24.
 *
 * What it does: when someone submits a form or taps a phone link, it sends a COPY to Bloomview's recorder so the
 * client report can count the lead and say which page and source it came from. The form still posts to formsubmit.co
 * exactly as before. If Bloomview's server is down, nothing on the site changes.
 *
 * Server side is already live (tested 2026-11-24): https://bloomviewgrowth.com/collect/spartan-lead.php (forms)
 * and https://bloomviewgrowth.com/collect/phone-click.php with s=spartan (taps). Both only accept this domain.
 *
 * Install: put this file in the site and load it on every page, before </body>:
 *   <script src="/bv-lead-copy.js" defer></script>
 */
(function () {
  var LEAD = "https://bloomviewgrowth.com/collect/spartan-lead.php";
  var TAP = "https://bloomviewgrowth.com/collect/phone-click.php";

  // First touch: where this visitor first came from, kept for 30 days.
  function firstTouch() {
    try {
      var saved = JSON.parse(localStorage.getItem("bv_ft") || "null");
      if (saved && Date.now() - saved.t < 30 * 864e5) return saved;
    } catch (e) {}
    var q = new URLSearchParams(location.search);
    var src = (q.get("utm_source") || "").toLowerCase();
    var med = (q.get("utm_medium") || "").toLowerCase();
    var ref = (document.referrer || "").toLowerCase();
    var ch = "direct", ev = "no referrer";
    if (q.get("gclid") || q.get("gbraid") || q.get("wbraid")) { ch = "google_ads"; ev = "click id on landing URL"; }
    else if (/gbp|gmb|google.?business/.test(src + " " + med)) { ch = "gbp"; ev = "utm " + src + "/" + med; }
    else if (/chatgpt|openai|perplexity|gemini|copilot|claude/.test(src + " " + ref)) { ch = "ai_search"; ev = src || ref.slice(0, 60); }
    else if (/facebook|instagram|fbclid/.test(src + " " + ref + " " + location.search)) { ch = "social"; ev = src || "social referrer"; }
    else if (/google\./.test(ref)) { ch = "google_search"; ev = "google referrer"; }
    else if (/bing\.|yahoo\.|duckduckgo\./.test(ref)) { ch = "other_search"; ev = ref.split("/")[2] || "search referrer"; }
    else if (ref && ref.indexOf(location.hostname) === -1) { ch = "referral"; ev = ref.split("/")[2] || "referrer"; }
    var ft = { ch: ch, ev: ev.slice(0, 80), land: (location.pathname + location.search).slice(0, 200), t: Date.now() };
    try { localStorage.setItem("bv_ft", JSON.stringify(ft)); } catch (e) {}
    return ft;
  }
  var ft = firstTouch();

  function send(url, fields) {
    var fd = new FormData();
    for (var k in fields) if (fields[k] != null) fd.append(k, fields[k]);
    if (navigator.sendBeacon) navigator.sendBeacon(url, fd);
  }

  // Forms: copy the fields formsubmit gets. Never blocks or changes the real submit.
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (!f || !/formsubmit\.co/.test(f.action || "")) return;
    var g = function (n) { var el = f.elements[n]; return el ? el.value : ""; };
    send(LEAD, {
      name: g("name"), phone: g("phone"), email: g("email"), address: g("address"), message: g("message"),
      page: location.pathname, source: g("source"), _honey: g("_honey"),
      bv_channel: ft.ch, bv_landing: ft.land, bv_evidence: ft.ev
    });
  }, true);

  // Phone taps
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
    if (!a) return;
    send(TAP, {
      s: "spartan", phone: a.getAttribute("href").slice(4), text: (a.textContent || "").trim().slice(0, 80),
      page: location.pathname + location.search, ch: ft.ch, land: ft.land, ev: ft.ev
    });
  }, true);
})();
