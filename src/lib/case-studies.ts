type ScopeModule = { title: string; body: string };
type FlowStep = { title: string; body: string; scope: string; own?: boolean };
type FlowLane = { title: string; inputs: FlowStep[]; destination: FlowStep };
type ImplementationFocus = {
  title: string;
  steps: { label: string; body: string }[];
};

export type CaseStudyPresentation = {
  depth: "module" | "summary";
  scopeHeading: string;
  scopeIntro: string;
  modules: ScopeModule[];
  implementation?: ImplementationFocus;
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
    scopeHeading: "From a customer form to an admin workflow.",
    scopeIntro: "Order management was my largest module in this Next.js and Laravel project. My full-stack scope also covered the database, project setup and editable website content.",
    modules: [],
    implementation: {
      title: "The information behind an order.",
      steps: [
        { label: "The requirement", body: "The information a customer enters in the application form also needs a place inside the admin system, where the team manages orders." },
        { label: "What I built", body: "I set up the project, built the database and developed the order-management module around those customer submissions. The work connects information collected on the public website with the administration behind it." },
        { label: "Beyond orders", body: "I also built administration for blogs, pricing, FAQs and other public content. Administrators configure that content in the admin system, and the public pages display it." },
      ],
    },
    flowHeading: "Two workflows, connected to the website.",
    flowIntro: "Two sides of the same product: customer information coming in, and website content going out.",
    flowNote: "Module workflow illustration, rather than a screenshot of the production admin interface.",
    lanes: [
      { title: "Customer orders", inputs: [
        { title: "Application information", body: "Information customers submit through public forms.", scope: "Public website" },
      ], destination: { title: "Order management", body: "Admin tools for working with the submitted information.", scope: "My contribution", own: true } },
      { title: "Configurable content", inputs: [
        { title: "Content administration", body: "Manage blogs, pricing, FAQs and configurable content.", scope: "My contribution", own: true },
      ], destination: { title: "Public pages", body: "Display the content configured by administrators.", scope: "Public website" } },
    ],
    boundary: "This preview shows the customer-facing website. My main work was the administration behind it, within the team-built product.",
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
    boundary: "Substantial full-stack contribution within the development team.",
  },
  valqua: {
    depth: "module",
    scopeHeading: "A daily report, with more than typed input.",
    scopeIntro: "I developed the daily-report and flange-report frontend modules using Vue 2 and Vue 3, within a Ruby on Rails-backed application.",
    modules: [],
    implementation: {
      title: "Readings, images and a report.",
      steps: [
        { label: "The requirement", body: "Daily reporting brings together machine parameters, report photos and values read from captured images. The interface needs to support each kind of input as part of the reporting workflow." },
        { label: "What I built", body: "I implemented the Vue interfaces for entering machine parameters, capturing report photos and working with OCR-derived values. My responsibility was the frontend workflow and its integration with the application." },
        { label: "A separate reporting module", body: "I also developed the flange-report interface for recording flange parameters. It has its own reporting workflow alongside the daily-report module." },
      ],
    },
    flowHeading: "Measurements and images, brought into reports.",
    flowIntro: "The daily-report and flange-report modules support different kinds of reporting input.",
    flowNote: "Frontend module illustration. OCR processing and the Rails backend are application context; my scope was the interfaces and their integration.",
    lanes: [
      { title: "Daily equipment reports", inputs: [
        { title: "Readings & report photos", body: "Equipment values and photos entered or captured through the reporting interfaces.", scope: "Frontend scope", own: true },
        { title: "OCR-derived values", body: "Image-derived values supplied through the application's OCR workflow.", scope: "Application context" },
      ], destination: { title: "Daily-report interfaces", body: "Frontend workflows that bring measurements, photos and image-assisted input into a daily report.", scope: "Frontend scope", own: true } },
      { title: "Flange reports", inputs: [
        { title: "Flange parameters", body: "Parameters entered for flange reporting.", scope: "Reporting input" },
      ], destination: { title: "Flange-report interfaces", body: "A dedicated frontend workflow for recording the required parameters.", scope: "Frontend scope", own: true } },
    ],
    boundary: "The website below introduces VALQUA SPM. My work was inside the reporting application, whose internal screens are separate from this public preview.",
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
