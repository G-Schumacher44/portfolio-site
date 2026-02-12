Self‑Hosted Roboto
==================

Place the following font files in this folder to enable the self‑hosted Roboto setup referenced by `index.html`.

Expected files
- roboto-regular.woff2 (weight 400)
- roboto-regular.woff  (fallback)
- roboto-500.woff2     (weight 500)
- roboto-500.woff      (fallback)
- roboto-700.woff2     (weight 700)
- roboto-700.woff      (fallback)

Paths used in CSS
- files/fonts/roboto/roboto-regular.woff2
- files/fonts/roboto/roboto-regular.woff
- files/fonts/roboto/roboto-500.woff2
- files/fonts/roboto/roboto-500.woff
- files/fonts/roboto/roboto-700.woff2
- files/fonts/roboto/roboto-700.woff

Notes
- WOFF2 is preferred and smallest; WOFF is kept as a fallback for broader compatibility.
- If you only have WOFF2, you can omit the WOFF sources — the page will still work in modern browsers.
- After adding files, no further changes are needed; the site will automatically use the local fonts.

