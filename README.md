# Hoang Anh Vu — Portfolio

A Next.js and TypeScript portfolio with a Three.js experience built with React Three Fiber. The site exports to static files.

## Local setup

Use Node.js 22 or later and npm 10.5.1 or later. Open PowerShell in `F:\Portfolio\website`:

```powershell
cd F:\Portfolio\website
npm install
npm run dev
```

Open `http://localhost:3000`. The development server can also be reached from the local network.

The main portfolio uses the developer studio direction: a staggered project gallery, always-visible experience chapters, paper/cobalt/dark sections, scroll reveals, and pointer interactions. Case studies share the same navigation, contact area, typography, and motion. `http://localhost:3000/design-study/` remains a design-preview route using the same home component.

## Verify and build

```powershell
npm run typecheck
npm run build
npm start
```

The build creates `out/`. `npm start` serves that export at `http://localhost:3000`; stop the development server first if it is using the same port. The exported files can be hosted by any static website host.

The build also runs `scripts/normalize-static-segments.mjs`. It adds the dot-separated prefetch filenames expected by the Next.js router when Windows has exported them as nested folders. Existing valid files are preserved; platforms that already export the correct names need no aliases.

## Editing

- `src/app/page.tsx`, `src/components/StudioHome.tsx`: home page sections and introduction.
- `src/app/studio.css`, `src/components/StudioChrome.tsx`, `src/app/studio-chrome.css`: developer studio layout and shared navigation/contact.
- `src/components/DirectionExperience.tsx`, `src/app/design-study/experience.css`: always-visible employment chapters.
- `src/components/DirectionMotion.tsx`, `src/app/design-study/motion.css`: progressive scroll reveals, pointer tilt, magnetic buttons, and preview parallax.
- `src/lib/projects.ts`: case studies, employment history, and skills.
- `src/app/work/[slug]/page.tsx`: individual case study layout.
- `src/app/globals.css`: responsive styles, colors, and typography.
- `src/app/home.css`: spatial hero and interactive artwork controls.
- `src/lib/case-studies.ts`, `src/app/case-study.css`: module cards and illustrative product workflows for case studies.
- `src/app/readability.css`: shared type sizes and section spacing.
- `src/components/HeroExperience.tsx`, `src/components/KineticScene.tsx`: accessible hero interaction and the full-stack application scene.
- `src/app/layout.tsx`: document metadata.
- `src/components/ThemeProvider.tsx`, `src/components/ThemeToggle.tsx`, `src/lib/theme.ts`, `src/app/theme.css`: shared light/dark theme, navigation toggle, and pre-paint preference initialization.

The hero uses one set of 474 rounded modules for both VŨ and the browser/API/database. The same opaque instances interpolate position, scale, rotation and color into the application; the shell is never swapped or crossfaded. Text and connections appear after assembly. Replay reverses those modules into the signature before assembling the app again.

The name field is editable directly inside the 3D browser. Send request runs an explicit typing, sending, validation, database write and response sequence, then preserves the saved result. Clicking or hovering a component highlights it; clicking API or Data opens an inspector within the banner. There is no separate form beneath the model. Everything is a local browser simulation, with no network requests or external artwork.

Focus the stage and press Enter or Space to send, R to replay the module transition, 1/2/3 to inspect Interface/API/Data, or Escape to reset. Escape closes an open inspector first. Reset clears records and cancels an active request. The demand loop pauses when the whole interactive widget is offscreen or the tab is hidden. Reduced motion keeps the app static and completes submissions instantly. Browsers without WebGL2 receive a CSS illustration. The scene does not link to projects or drive page navigation. `src/app/application-scene.css` styles its input, inspector, focus treatment and fallback; `src/lib/application-scene.ts` shares phase and component types.

Technology badges use local original-color Devicon SVGs in `public/icons/tech/`. `sources.json` pins their upstream commit and records ecosystem aliases; the upstream license is included. `TechIcon.tsx` shares the marks across hero, project, experience and case-study labels. The About toolkit marquee uses two equal-width groups for a seamless CSS loop, hides its duplicate from assistive technology, and stops on hover, keyboard focus, offscreen visibility, hidden tabs and reduced-motion preferences. Reduced motion presents one static wrapping list. There are no visible Pause/Play buttons.

The sun/moon toggle in the shared header switches the entire portfolio, including case studies and the Three.js materials. First visits default to dark; explicit choices persist in local storage and sync across tabs. An inline head script applies the preference before content paints, preserving the static export. The toggle continues working in memory if browser storage is unavailable. Original brand colors and public website screenshots are preserved in both themes.

Public project previews in `public/images/` are authentic website captures; `sources.json` records their source and scope. VALQUA's image shows the public product introduction, while the case study describes selected application modules. Project contribution text distinguishes personal work from the full team's product.

No account keys, environment variables, or external services are required to run locally. A private Sites manifest, if supplied for the optional hosted preview, is deployment metadata and is not needed for local development.

`serve` uses a scoped override to `compression@1.8.2` to address GHSA-vc2v-76pw-4v95. Commit `package-lock.json` with dependency changes for reproducible installs.
