/* ============================================================
   AURELIA AFFILIATE LINKS — OWNER ONLY (private config)
   ------------------------------------------------------------
   Every partner below shows on the site as a booking button.
   Join that program's free affiliate scheme, then paste your
   tracking ID into its "trackingId" field — the button becomes
   an earning link instantly. Until then it works as a normal
   direct booking link (no commission, but keeps customers happy).

   Programs to join (search these exact names):
   - Trip.com Affiliate  · Cleartrip Affiliate · Skyscanner Partners
   - MakeMyTrip Affiliate · Goibibo Affiliate · Yatra Affiliate
   - EaseMyTrip Affiliate · Ixigo Affiliate · Expedia Partner
   - Kayak Affiliate · Booking.com Affiliate · Agoda Affiliate
   - Hotels.com Affiliate
   NOTE: instructions here are private — never shown on the site.
   ============================================================ */
window.AURELIA_AFFILIATES = [
  { name: 'Trip.com', icon: '🌏', homeUrl: 'https://www.trip.com/flights/', trackingId: '' },
  { name: 'Cleartrip', icon: '🧭', homeUrl: 'https://www.cleartrip.com/flights', trackingId: '' },
  { name: 'Skyscanner', icon: '🔍', homeUrl: 'https://www.skyscanner.co.in/flights', trackingId: '' },
  { name: 'MakeMyTrip', icon: '🟠', homeUrl: 'https://www.makemytrip.com/flights/', trackingId: '' },
  { name: 'Goibibo', icon: '🔷', homeUrl: 'https://www.goibibo.com/flights/', trackingId: '' },
  { name: 'Yatra', icon: '🛫', homeUrl: 'https://www.yatra.com/flights', trackingId: '' },
  { name: 'EaseMyTrip', icon: '🟢', homeUrl: 'https://www.easemytrip.com/flights', trackingId: '' },
  { name: 'Ixigo', icon: '💠', homeUrl: 'https://www.ixigo.com/flights', trackingId: '' },
  { name: 'Expedia', icon: '🌐', homeUrl: 'https://www.expedia.co.in/flights', trackingId: '' },
  { name: 'Kayak', icon: '🩵', homeUrl: 'https://www.kayak.co.in/flights', trackingId: '' },
  { name: 'Booking.com', icon: '🛏️', homeUrl: 'https://www.booking.com', trackingId: '' },
  { name: 'Agoda', icon: '🏨', homeUrl: 'https://www.agoda.com', trackingId: '' },
  { name: 'Hotels.com', icon: '🏝️', homeUrl: 'https://www.hotels.com', trackingId: '' }
];

(function () {
  function build() {
    const box = document.getElementById('affiliateButtons');
    const note = document.getElementById('affiliateNote');
    if (!box) return;
    const activeCount = window.AURELIA_AFFILIATES.filter(p => p.trackingId).length;

    box.innerHTML = window.AURELIA_AFFILIATES.map(p => `
      <a href="${p.homeUrl}" target="_blank" rel="noopener"
         class="card-hover bg-gradient-to-b from-slate-50 to-white border-2 border-[#e6d9b8] rounded-xl p-3 text-center hover:border-brandGold transition block">
        <span class="text-xl block mb-1">${p.icon}</span>
        <span class="block font-bold text-xs">${p.name}</span>
        <span class="block text-[10px] text-slate-400 mt-0.5">${p.trackingId ? 'Affiliate ✓' : 'Book direct'}</span>
      </a>`).join('');

    if (note) {
      // Customer-friendly only — owner instructions stay private
      note.innerHTML = '✨ Book through our trusted partners — you pay the same price you\'d pay anywhere, and it supports our small business. Thank you!';
    }
  }
  document.addEventListener('DOMContentLoaded', build);
})();
