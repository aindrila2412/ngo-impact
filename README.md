# Community Impact — Aindrila Das

Portfolio-grade NGO contribution showcase (Vite + TypeScript + modern CSS + Python content build).

**Honest framing:** volunteer/contributor role; organization-wide figures from NGO public materials — not personal KPIs. No invented ₹ totals, certificates, or phone number.

## Stack

| Layer | Role |
|-------|------|
| `content.json` | Single source of truth for copy & published numbers |
| `build_content.py` | Python emits `src/generated/` HTML + TS + palette CSS + `public/motif.svg` |
| `src/main.ts` | Theme toggle (localStorage), reveals, magnetic/tilt micro-interactions |
| `src/styles.css` | Teal / coral / cream design system (light + dark) |
| Vite | Dev server & production build (`base: './'`) |

## Preview

```bash
cd /workspace/aindrila-ngo-impact
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 5180
```

Open **http://127.0.0.1:5180/**

Dev mode (hot reload):

```bash
npm run content   # or automatic via predev
npm run dev
```

## Theme

Dark / light toggle in the header. Preference persists in `localStorage` under key **`ad-impact-theme`**.

## Design choices

- **Brand:** teal / coral / cream (distinct from the plum-rose personal portfolio)
- **Type:** Fraunces (editorial display) + Source Sans 3 (UI body)
- **Surfaces:** soft mesh gradients, glass cards, procedural book/leaf motif (Python SVG)
- **Motion:** scroll reveals, magnetic buttons, subtle card tilt (respects `prefers-reduced-motion`)
- **Numbers:** big “Impact at a glance” stat grid with tiny source labels + honesty banner

## Numbers & sources

See **[NUMBERS.md](./NUMBERS.md)** for every figure and URL.

## Sections

1. Editorial hero  
2. Impact at a glance (published org stats)  
3. About  
4. Contributions (libraries / donations / fundraising)  
5. Campaigns & timeline  
6. Organization panels  
7. Connection thread  
8. Evidence placeholders (incl. rupee totals slot)  
9. Contact (email · LinkedIn · GitHub · portfolio)

## Edit content

1. Edit `content.json`  
2. Run `python3 build_content.py` (or `npm run content`)  
3. Rebuild / refresh
