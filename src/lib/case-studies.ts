type ScopeModule = { title: string; body: string };
type FlowStep = { title: string; body: string; scope: string; own?: boolean };
type FlowLane = { title: string; steps: FlowStep[] };

export type CaseStudyPresentation = {
  product: string;
  audience: string;
  focus: string;
  scopeIntro: string;
  modules: ScopeModule[];
  flowIntro: string;
  flowNote: string;
  lanes: FlowLane[];
  foundation?: { title: string; body: string };
  capabilities: ScopeModule[];
};

// Presentation of the confirmed facts in projects.ts, not additional project claims.
export const caseStudies: Record<string, CaseStudyPresentation> = {
  evisa: {
    product: "Online visa services",
    audience: "Customers & internal administrators",
    focus: "Orders, content & project foundations",
    scopeIntro: "My work centered on the internal side of the product: establishing the project, developing the database, and building tools for orders and public content.",
    modules: [
      { title: "Database & project setup", body: "Built the database and set up the project that connects the customer-facing website with its administration capabilities." },
      { title: "Order administration", body: "Developed admin order management using the information customers submit through application forms." },
      { title: "Content management", body: "Built admin tools for blogs, pricing, FAQs, and other configurable website content." },
      { title: "Admin-to-website connection", body: "Connected content configured in the admin system with the content displayed on the public website." },
    ],
    flowIntro: "Two connected workflows: customer information enters order administration, while managed content feeds the public website.",
    flowNote: "A simplified illustration of the confirmed product workflows. The admin modules are my contribution; the public preview above shows the customer-facing website.",
    lanes: [
      { title: "Customer information", steps: [
        { title: "Application forms", body: "Customers submit their application information.", scope: "PUBLIC WEBSITE" },
        { title: "Order administration", body: "Administrators work with the submitted information to manage orders.", scope: "MY CONTRIBUTION", own: true },
      ] },
      { title: "Website content", steps: [
        { title: "Content administration", body: "Manage blogs, pricing, FAQs, and configurable content.", scope: "MY CONTRIBUTION", own: true },
        { title: "Public pages", body: "Display the content configured in the admin system.", scope: "PUBLIC WEBSITE" },
      ] },
    ],
    foundation: { title: "Shared foundation / Database + project setup", body: "The database and project setup were also part of my responsibility." },
    capabilities: [
      { title: "Order operations", body: "Administration built around customer-submitted application information." },
      { title: "Editable public content", body: "Blogs, prices, and FAQs managed through internal tools." },
      { title: "Connected application", body: "Project setup and database work supporting the public and admin sides." },
    ],
  },
  skyservice: {
    product: "Airport & travel services",
    audience: "Travelers exploring service options",
    focus: "Substantial full-stack participation",
    scopeIntro: "A broad full-stack contribution within a team-built Next.js and Laravel product, supporting its customer-facing service website.",
    modules: [
      { title: "Full-stack development", body: "Contributed development within the Next.js and Laravel application as a Full-stack Engineer." },
      { title: "Substantial project participation", body: "Worked on a substantial portion of the website alongside the development team." },
    ],
    flowIntro: "The public experience gives travelers a way to explore services, provide trip details, and enter a booking or enquiry flow.",
    flowNote: "This illustrates the public product experience. It describes the customer journey within a team-built website; it is not an internal architecture diagram.",
    lanes: [
      { title: "Public customer journey", steps: [
        { title: "Explore services", body: "Discover airport assistance and travel-service options.", scope: "PUBLIC WEBSITE" },
        { title: "Enter trip details", body: "Provide travel information in a price-enquiry form.", scope: "PUBLIC WEBSITE" },
        { title: "Booking / enquiry", body: "Use an entry point to book or request a personalized quote.", scope: "PUBLIC WEBSITE" },
      ] },
    ],
    capabilities: [
      { title: "Full-stack contribution", body: "Delivered application work with Next.js and Laravel." },
      { title: "Live service website", body: "Contributed to a public product presenting airport and travel services." },
    ],
  },
  valqua: {
    product: "Industrial reporting application",
    audience: "Teams carrying out factory & maintenance work",
    focus: "Selected Vue frontend modules",
    scopeIntro: "I developed selected frontend modules for structured reporting, image-assisted input, and integration with the application's backend.",
    modules: [
      { title: "Daily equipment reports", body: "Implemented daily-report interfaces for entering equipment measurements." },
      { title: "Report photos", body: "Built interfaces for capturing images and attaching photos to daily reports." },
      { title: "OCR-assisted input", body: "Developed the frontend workflows that bring image-derived values into the reporting process." },
      { title: "Flange reporting", body: "Implemented dedicated report interfaces for recording flange parameters." },
      { title: "Reusable Vue components", body: "Built reusable frontend components and integrated interfaces with the application backend." },
    ],
    flowIntro: "The reporting interfaces bring measurements, photos, and image-assisted input into daily workflows, alongside a dedicated flange-reporting workflow.",
    flowNote: "A simplified illustration of the frontend workflows I worked on. OCR processing is application context; my scope covered the OCR-related interfaces and backend integration.",
    lanes: [
      { title: "Daily equipment reporting", steps: [
        { title: "Readings & photos", body: "Enter equipment measurements and capture or attach report photos.", scope: "FRONTEND SCOPE", own: true },
        { title: "Daily-report interfaces", body: "Combine structured measurements with images in the reporting workflow.", scope: "FRONTEND SCOPE", own: true },
      ] },
      { title: "Image-assisted input", steps: [
        { title: "Image-derived values", body: "Values supplied through the application's OCR-assisted workflow.", scope: "APPLICATION CONTEXT" },
        { title: "OCR-assisted interfaces", body: "Bring those values into the frontend reporting process.", scope: "FRONTEND SCOPE", own: true },
      ] },
      { title: "Flange reporting", steps: [
        { title: "Flange parameters", body: "Enter the parameters required by the flange-reporting interfaces.", scope: "FRONTEND SCOPE", own: true },
        { title: "Flange-report interfaces", body: "Provide a dedicated frontend workflow for structured flange reports.", scope: "FRONTEND SCOPE", own: true },
      ] },
    ],
    foundation: { title: "Application context / Vue frontend + Ruby on Rails backend", body: "I worked on Vue 2 and Vue 3 modules and their integration with the existing application backend." },
    capabilities: [
      { title: "Structured reporting", body: "Frontend modules for equipment measurements and flange parameters." },
      { title: "Image-assisted entry", body: "Report photos and interfaces that use OCR-derived values." },
      { title: "Reusable frontend", body: "Shared components and integration with the application's backend." },
    ],
  },
  offshore: {
    product: "International corporate services",
    audience: "Visitors exploring company-formation services",
    focus: "Customer-facing UI implementation",
    scopeIntro: "My contribution to this product concentrated on the public user interface, within the team's Next.js and Laravel application.",
    modules: [
      { title: "UI implementation", body: "Implemented user-interface work within the Next.js and Laravel project." },
      { title: "Customer-facing presentation", body: "Contributed to the website's presentation of international company-formation and corporate services." },
    ],
    flowIntro: "The public interface introduces the services, helps visitors explore the information, and provides contact entry points.",
    flowNote: "This illustrates the public website experience. My work focused primarily on the UI within a team-built product.",
    lanes: [
      { title: "Public service exploration", steps: [
        { title: "Service introduction", body: "Discover international company-formation and corporate services.", scope: "PUBLIC WEBSITE" },
        { title: "Explore information", body: "Read the information presented for the available services.", scope: "PUBLIC WEBSITE" },
        { title: "Contact entry points", body: "Use the website's contact options to take the next step.", scope: "PUBLIC WEBSITE" },
      ] },
    ],
    capabilities: [
      { title: "Public interface", body: "UI work for a live international corporate-services website." },
      { title: "Application contribution", body: "Frontend work within the team's Next.js and Laravel project." },
    ],
  },
};
