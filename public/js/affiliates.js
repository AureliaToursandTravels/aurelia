/* ============================================================
   AURELIA AFFILIATE LINKS — HOW YOU EARN A CUT ON BOOKINGS
   ------------------------------------------------------------
   1. Join each partner's FREE affiliate program (steps in
      DEPLOYMENT-GUIDE.md → Part 11).
   2. Paste your tracking ID into the "trackingId" field below.
   3. Done! The homepage button becomes an affiliate link and
      every booking made through it pays YOU a commission —
      while customers pay the exact same price.
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
      note.innerHTML = activeCount > 0
        ? '🎉 Affiliate tracking is ACTIVE — you earn a commission on every booking made through these links.'
        : '🔧 <strong>Owner tip:</strong> join the free affiliate programs (Wego, Trip.com, Cleartrip, Skyscanner — see guide Part 11) and paste your IDs in <code>public/js/affiliates.js</code> to start earning a cut on every booking made through these buttons. Until then, the buttons still work as direct booking links.';
    }
  }
  document.addEventListener('DOMContentLoaded', build);
})();
