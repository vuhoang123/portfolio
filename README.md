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

## Verify and build

```powershell
npm run typecheck
npm run build
npm start
```

The build creates `out/`. `npm start` serves that export at `http://localhost:3000`; stop the development server first if it is using the same port. The exported files can be hosted by any static website host.

The build also runs `scripts/normalize-static-segments.mjs`. It adds the dot-separated prefetch filenames expected by the Next.js router when Windows has exported them as nested folders. Existing valid files are preserved; platforms that already export the correct names need no aliases.

## Editing

- `src/app/page.tsx`: home page sections and introduction.
- `src/lib/projects.ts`: case studies, employment history, and skills.
- `src/app/work/[slug]/page.tsx`: individual case study layout.
- `src/app/globals.css`: responsive styles, colors, and typography.
- `src/components/HeroExperience.tsx`, `LayerScene.tsx`, and `scene-textures.ts`: hero interaction, 3D layers, and canvas artwork.
- `src/components/SiteChrome.tsx`: shared navigation and footer.
- `src/app/layout.tsx`: document metadata.

The 3D interface is an illustrative view of UI, application operations, and data. It does not reproduce a company's private admin screen. Public project previews in `public/images/` are authentic website captures; `sources.json` records their source and scope. VALQUA's image shows the public product introduction, while the case study describes selected application modules. Project contribution text distinguishes personal work from the full team's product.

No account keys, environment variables, or external services are required to run locally. A private Sites manifest, if supplied for the optional hosted preview, is deployment metadata and is not needed for local development.

`serve` uses a scoped override to `compression@1.8.2` to address GHSA-vc2v-76pw-4v95. Commit `package-lock.json` with dependency changes for reproducible installs.
