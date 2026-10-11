type ScopeModule = { title: string; body: string };
type FlowStep = { title: string; body: string; scope: string; own?: boolean };
type FlowLane = { title: string; inputs: FlowStep[]; destination: FlowStep };

export type CaseStudyPresentation = {
  depth: "module" | "summary";
  scopeHeading: string;
  scopeIntro: string;
  modules: ScopeModule[];
  flowHeading: string;
  flowIntro: string;
  flowNote: string;
  lanes: FlowLane[];
  journey?: string[];
  boundary: string;
};

// Editorial presentation of confirmed scope. Diagrams illustrate workflows,
// never production screens, measured results, or unconfirmed architecture.
export const caseStudies: Record<string, CaseStudyPresentation> = {
  evisa: {
    depth: "module",
    scopeHeading: "The administration behind the application.",
    scopeIntro: "My largest module was order management. I also built the tools that let administrators configure public website content.",
    modules: [
      { title: "Project & database foundation", body: "Set up the project and built its database as part of my full-stack responsibility." },
    ],
    flowHeading: "Two workflows, connected to the website.",
    flowIntro: "Orders and website content each have a dedicated administration workflow.",
    flowNote: "Workflow illustration based on my confirmed scope. It shows the relationship between product modules, rather than the production admin interface.",
    lanes: [
      { title: "Customer orders", inputs: [
        { title: "Application information", body: "Information customers submit through public forms.", scope: "Public website" },
      ], destination: { title: "Order management", body: "Admin tools for working with the submitted information.", scope: "My contribution", own: true } },
      { title: "Configurable content", inputs: [
        { title: "Content administration", body: "Manage blogs, pricing, FAQs and configurable content.", scope: "My contribution", own: true },
      ], destination: { title: "Public pages", body: "Display the content configured by administrators.", scope: "Public website" } },
    ],
    boundary: "The public website below provides product context. The administration, database and project setup were my main responsibility within the team-built product.",
  },
  skyservice: {
    depth: "summary",
    scopeHeading: "A substantial full-stack contribution.",
    scopeIntro: "I worked on a substantial portion of this team-built Next.js and Laravel website, as a Full-stack Engineer at The One Digi Corp.",
    modules: [],
    flowHeading: "From service discovery to an enquiry.",
    flowIntro: "The public experience helps travelers explore airport and travel services before sharing their trip details.",
    flowNote: "Public customer journey, shown for product context.",
    lanes: [],
    journey: ["Explore services", "Enter trip details", "Booking or enquiry"],
    boundary: "This was a team-built product. My scope covered substantial full-stack participation; specific module ownership is not presented here.",
  },
  valqua: {
    depth: "module",
    scopeHeading: "Vue interfaces for reporting at work.",
    scopeIntro: "I handled selected frontend modules for daily equipment reports and flange reporting, using Vue 2 and Vue 3.",
    modules: [
      { title: "Reusable frontend components", body: "Built shared Vue components used in the reporting interfaces." },
      { title: "Application integration", body: "Connected the frontend modules with the existing Ruby on Rails-backed application." },
    ],
    flowHeading: "Measurements and images, brought into reports.",
    flowIntro: "The daily-report module combines entered readings, report photos and OCR-assisted frontend input. Flange reports have their own interface.",
    flowNote: "Workflow illustration based on the selected frontend modules I developed. OCR-derived values and the Rails backend are application context; my scope was the interfaces and their integration.",
    lanes: [
      { title: "Daily equipment reports", inputs: [
        { title: "Readings & report photos", body: "Equipment values and photos entered or captured through the reporting interfaces.", scope: "Frontend scope", own: true },
        { title: "OCR-derived values", body: "Image-derived values supplied through the application's OCR workflow.", scope: "Application context" },
      ], destination: { title: "Daily-report interfaces", body: "Frontend workflows that bring measurements, photos and image-assisted input into a daily report.", scope: "Frontend scope", own: true } },
      { title: "Flange reports", inputs: [
        { title: "Flange parameters", body: "Parameters entered for flange reporting.", scope: "Reporting input" },
      ], destination: { title: "Flange-report interfaces", body: "A dedicated frontend workflow for recording the required parameters.", scope: "Frontend scope", own: true } },
    ],
    boundary: "My role covered selected Vue frontend modules. The website below introduces VALQUA SPM; it is separate from the reporting application I worked on.",
  },
  offshore: {
    depth: "summary",
    scopeHeading: "A focus on the public interface.",
    scopeIntro: "I implemented UI work for the corporate-services website within the team's Next.js and Laravel application. My company role was Full-stack Engineer; this project contribution was primarily UI.",
    modules: [],
    flowHeading: "An entry point to corporate services.",
    flowIntro: "Visitors use the website to explore international company-formation services and find contact options.",
    flowNote: "Public website experience, shown for product context.",
    lanes: [],
    journey: ["Service introduction", "Explore information", "Contact options"],
    boundary: "UI contribution within a team-built product.",
  },
};