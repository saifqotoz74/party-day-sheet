# Party Day Sheet

Venue owners who host kids' parties and events keep the deposit in a payment app, the headcount in a text thread, and the waiver in someone's inbox, then reconcile all three by hand on party day.

Problem source: a comment by u/Cicada01123 in r/Entrepreneur, "What's a problem you face regularly that you wish someone would solve?" (https://www.reddit.com/r/Entrepreneur/comments/1xamgwv/whats_a_problem_you_face_regularly_that_you_wish/).

- One card per booking: deposit paid against deposit due, waiver signed or missing, expected vs confirmed headcount, balance due on the day.
- A booking is marked Ready only when the deposit is fully paid and the waiver is signed.
- Day view with totals (bookings, guests, money still to collect) and a print layout for the front desk.
- Runs in the browser, data in `localStorage`, no signup.

Pure HTML, CSS and JavaScript. Open `index.html`.

Limits: it records payments, it does not take them; waivers are marked signed rather than collected (see the Intake and Consent Vault project for that). Single device. A portfolio/demo project.
