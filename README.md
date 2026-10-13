# Javim Medical Consultants Limited

A minimalist, responsive laboratory website built with Vite, vanilla JavaScript and Three.js. Figtree and DM Mono are bundled locally, without external font requests.

## Current design

Screenshots of the current implementation. The landing-page DNA scene is paused in these captures. Its transparent canvas lets the light page background show through.

### Desktop homepage

![Desktop homepage with transparent DNA scene](docs/screenshots/desktop.png)

[View the complete homepage](docs/screenshots/homepage.png)

### Mobile homepage

<img src="docs/screenshots/mobile.png" alt="Mobile homepage design" width="390" />

### DNA scene

![Homepage with the DNA visualization selected](docs/screenshots/dna.png)

### Interactive anatomy explorer

![Expanded anatomy explorer and related laboratory tests](docs/screenshots/anatomy.png)

### Services catalogue

<img src="docs/screenshots/services.png" alt="Mobile service catalogue filtered to thyroid testing" width="390" />

## Development

Use the existing checkout at `/workspace/Javim-Medical-Consulting`. Cloud tasks are isolated; a separate Git worktree is unnecessary.

```sh
npm ci --cache /tmp/javim-npm-cache
npm run dev -- --port 5173
```

Node 22.12+ or 24 is supported. `npm run build` creates `dist/`; `npm run preview -- --port 4173` serves the production build. The host must serve `index.html` for `/services` and `/privacy`. Vercel rewrites are included.

## Structure and content

- `/`: homepage, expandable service categories, expandable body-system explorer, company/corporate content and contact details.
- `/services`: 42 tests in seven categories, text/alias search and department filtering. Anatomy links prefill the search.
- `/privacy`: website privacy notice. The laboratory's own patient-data policy still needs to be supplied and reviewed before launch.
- `src/data.js`: catalogue, contact information, body-system mappings and booking configuration.
- `src/scene.js`: live blood-cell and DNA scenes. The animation module loads only on the homepage.
- `public/assets/`: logo and favicon.

Unverified business statistics, outsourcing claims, instant-result claims and clinical promises from the supplied copy have been removed. The source labels a Salmonella antigen test as “Widal”; these are different methods, so the display uses “Typhoid Testing” and asks the lab to confirm its method. Have the owner/clinical team review test descriptions before publication.

## Booking

WhatsApp booking works using the confirmed number. Three options are presented: lab visit, prepared-specimen drop-off, and sample collection request. Collection includes both prepared-specimen pickup and visits to collect samples in Nairobi and surrounding areas, subject to team confirmation.

Once public Cal.com event links exist, copy `.env.example` to `.env.local` and fill the matching `VITE_CAL_*_URL` fields. Restart the development server or rebuild. Only HTTPS links on `cal.com` or its subdomains are accepted; empty/invalid links retain the WhatsApp fallback. Links are public settings, never credentials. Cal.com scheduling is not verified until real events are provided. Configure collection-event availability and confirmation to match the lab's actual operations.

## Visual assets and limitations

The supplied logo images were visible in the conversation but were not available as local downloadable files, and retrieval from the former website was blocked. The current mark is a hand-recreated SVG based on the supplied artwork, not the original vector. Replace `public/assets/javim-mark.svg` and `favicon.svg` with approved originals for launch.

The landing-page DNA uses offset helical strands, paired bases, small molecular details and subtle surface grain with soft lighting. The WebGL canvas preserves alpha, has no opaque scene background or fog, and composites directly over the light page. Its slow rotation supports pointer/touch exploration, a pause control, reduced-motion preferences, off-screen suspension and a static DNA fallback. This is an original scientific illustration, not a scientifically exact molecular model or a claim that Javim offers genetic testing. The former blood-cell/DNA switcher and technical labels have been removed from the hero.

The anatomy explorer is an original stylized SVG with clickable and keyboard-selectable organs; it is not realistic 3D anatomy. Related tests provide service navigation, not diagnostic recommendations. No other brands' or watermarked stock imagery is included.

## Validation

```sh
npm test
npm run build
# With the development server running:
npx playwright test
```

Browser tests use `/usr/bin/chromium` in this environment. Set `CHROMIUM_PATH` if installed elsewhere. Test coverage includes catalogue aliases/counts, anatomical service mappings, booking URLs, scene controls, modal dismissal, mobile navigation, reduced motion, search input safety, WebGL fallback and automated WCAG accessibility scans.

No backend or patient records are stored by this app. WhatsApp, Cal.com and Maps are external services. Deployment/publication is a separate step.
