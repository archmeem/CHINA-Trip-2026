# China Trip 2026 — Archive / Memories

Minimal mobile-first PWA for iPhone/desktop.

The completed Sep 5–21, 2026 trip opens in Memories with a day selector.
The itinerary, original planning notes, saved reservation statuses and documents are retained.
The full Itinerary, Saved Documents and read-only Checklist Archive remain accessible.
Optional/pending items describe the saved plan, not verified attendance.

`travel-policy.js` sets `window.TRIP_ARCHIVE = true`. Booking actions, booking deadlines,
preparation edits and calendar reminder exports are disabled. `index.html` loads the
archive branch in `today.js` instead of the live assistant and alert modules.
No migration, storage-key change or data deletion is performed.


## iPhone
For full PWA behavior, host these files on any HTTPS static host (GitHub Pages, Cloudflare Pages, Netlify, etc.). Open the HTTPS address in Safari and use Share → Add to Home Screen.

Opening index.html directly can show the UI but iOS does not provide full PWA/service-worker behavior from file://.

## Privacy
Uploaded files remain in IndexedDB on the original browser/device and origin. Existing optional Firebase state sync remains unchanged; it does not sync document bytes. Keep using the same site address and browser to access local documents.


## Current hotel update
- Beijing: THE YARD HOTEL BEIJING, Tian'anmen Square (Sep 5–7)
- Yangshuo: Poetry Meadow (Sep 15–17)


