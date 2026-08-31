/* ============================================================
   AURELIA AFFILIATE LINKS — OWNER ONLY (private config)
   ------------------------------------------------------------
   1. Join each partner's FREE affiliate program (see
      DEPLOYMENT-GUIDE.md Part 11).
   2. Paste your tracking ID into the "trackingId" field below.
   3. The homepage buttons become affiliate links and every
      booking pays YOU a commission — customers pay the same.
   NOTE: owner instructions are private — never printed on the
   public site. The visible note under the buttons is always a
   customer-friendly message.
   ============================================================ */
window.AURELIA_AFFILIATES = [
  {
    name: 'Trip.com',
    icon: '🌏',
    homeUrl: 'https://www.trip.com/flights/',
    trackingId: ''   // <-- paste your Trip.com affiliate ID here
  },
  {
    name: 'Cleartrip',
    icon: '🧭',
    homeUrl: 'https://www.cleartrip.com/flights',
    trackingId: ''   // <-- paste your Cleartrip affiliate ID here
  },
  {
    name: 'Skyscanner',
    icon: '🔍',
    homeUrl: 'https://www.skyscanner.co.in/flights',
    trackingId: ''   // <-- paste your Skyscanner associate ID here
  }
];

(function () {
  function build() {
    const box = document.getElementById('affiliateButtons');
    const note = document.getElementById('affiliateNote');
    if (!box) return;
    const activeCount = window.AURELIA_AFFILIATES.filter(p => p.trackingId).length;

    box.innerHTML = window.AURELIA_AFFILIATES.map(p => `
      <a href="${p.homeUrl}" target="_blank" rel="noopener"
         class="card-hover bg-gradient-to-b from-slate-50 to-white border-2 border-[#e6d9b8] rounded-xl p-4 text-center hover:border-brandGold transition block">
        <span class="text-2xl block mb-1">${p.icon}</span>
        <span class="block font-bold text-sm">${p.name}</span>
        <span class="block text-[11px] text-slate-400 mt-0.5">${p.trackingId ? 'Affiliate link ✓' : 'Book direct'}</span>
      </a>`).join('');

    if (note) {
      // Customer-friendly message only — owner instructions are shared privately, never on the site
      note.innerHTML = activeCount > 0
        ? '✨ Thank you for booking through our partner links — every booking supports Aurelia Tours &amp; Travels. Same prices, always.'
        : '✨ Book through our trusted partners — you pay the same price you\'d pay anywhere, and it supports our small business. Thank you!';
    }
  }
  document.addEventListener('DOMContentLoaded', build);
})();
