export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  role: string;
  company: string;
  stack: string[];
  description: string;
  headline: string;
  year: string;
  externalUrl: string;
  image: string;
  imageAlt: string;
  accent: string;
  contributions: string[];
  context: string;
  workflow: string[];
  outcome: string;
  scopeNote?: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  description: string[];
};

export type AdditionalWork = {
  title: string;
  description: string;
  stack: string[];
  href?: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

// Labels describe the employment context; individual project dates were not supplied.
export const projects: Project[] = [
  {
    slug: "evisa",
    number: "01",
    title: "Global eVisa",
    category: "Full-stack / Admin systems",
    role: "Full-stack Engineer",
    company: "The One Digi Corp",
    stack: ["Next.js", "Laravel"],
    description:
      "Customer order management and editable public content for an online visa-services website.",
    headline: "From customer submissions to internal operations.",
    year: "Current work",
    externalUrl: "https://global-evisa.com/en",
    image: "/images/evisa.webp",
    imageAlt:
      "The public Global eVisa website, introducing its online visa services.",
    accent: "#A7B8FF",
    context:
      "Global eVisa connects a customer-facing visa-services website with an admin system for orders and website content. My responsibility covered the admin system, database development, and project setup.",
    contributions: [
      "Built the database and set up the project.",
      "Developed admin order management using information submitted through customer application forms.",
      "Built admin tools for managing blogs, pricing, FAQs, and other public website content.",
      "Connected content configured in the admin system to the content displayed on the public website.",
    ],
    workflow: [
      "Customers submit their application information through the public forms.",
      "The admin system presents that information for internal order management.",
      "Administrators manage blogs, pricing, FAQs, and configurable website content.",
      "The public website displays the content configured in the admin system.",
    ],
    outcome:
      "Delivered the administration capabilities that connect customer submissions, order management, and editable public content within the application.",
    scopeNote:
      "The preview shows the public website. My main contribution was the admin system, database, and project setup within a team-built product.",
  },
  {
    slug: "skyservice",
    number: "02",
    title: "Vietnam Sky Service",
    category: "Full-stack / Service website",
    role: "Full-stack Engineer",
    company: "The One Digi Corp",
    stack: ["Next.js", "Laravel"],
    description:
      "A customer-facing website for airport and travel services, with substantial full-stack participation.",
    headline: "An entry point to airport and travel services.",
    year: "Current work",
    externalUrl: "https://vietnamskyservice.com/en",
    image: "/images/skyservice.webp",
    imageAlt:
      "Vietnam Sky Service's public website for airport and travel services.",
    accent: "#F0CD9B",
    context:
      "Vietnam Sky Service presents airport assistance and travel services to customers. I contributed a substantial portion of the Next.js and Laravel project as a Full-stack Engineer.",
    contributions: [
      "Contributed full-stack development within the Next.js and Laravel application.",
      "Worked on a substantial portion of the website alongside the development team.",
    ],
    workflow: [
      "The public website introduces airport assistance and travel-service options.",
      "Travelers can explore services and enter their trip details in a price-enquiry form.",
      "The website provides entry points for booking or requesting a personalized quote.",
    ],
    outcome:
      "Delivered full-stack work within a live website that presents airport and travel services to customers.",
    scopeNote:
      "The service-selection and enquiry flow describes the public product. This was a team-built project, with substantial full-stack participation on my part.",
  },
  {
    slug: "valqua",
    number: "03",
    title: "VALQUA SPM",
    category: "Frontend / Industrial software",
    role: "Frontend Developer",
    company: "Midota.,CO LTD",
    stack: ["Vue 2", "Vue 3", "TypeScript", "Vuex", "Bootstrap", "SCSS"],
    description:
      "Vue frontend modules for daily equipment reports, OCR-assisted input, and flange reporting.",
    headline: "Practical interfaces for industrial reporting.",
    year: "Earlier work",
    externalUrl: "https://spm.valqua.co.jp/",
    image: "/images/valqua.webp",
    imageAlt:
      "The VALQUA SPM product introduction website, rather than the reporting application.",
    accent: "#B5D2B7",
    context:
      "VALQUA SPM is an industrial application for factory work and maintenance management. I worked on selected frontend modules using Vue 2 and Vue 3 within an application backed by Ruby on Rails.",
    contributions: [
      "Implemented daily-report interfaces for entering equipment measurements.",
      "Built frontend workflows for OCR-assisted input from captured images.",
      "Implemented interfaces for capturing and attaching photos to daily reports.",
      "Developed flange-report interfaces for recording flange parameters.",
      "Built reusable frontend components and integrated interfaces with the application backend.",
    ],
    workflow: [
      "Daily-report interfaces combine equipment readings with captured report photos.",
      "OCR-assisted input brings image-derived values into the reporting workflow.",
      "Flange-report interfaces provide a dedicated workflow for recording flange parameters.",
    ],
    outcome:
      "Delivered frontend modules for structured industrial reporting, including measurements, photos, and OCR-assisted input, with reusable components and backend integration.",
    scopeNote:
      "My contribution was frontend development on selected modules, including the OCR-related interfaces. The linked website introduces the product; it is not the reporting application I developed.",
  },
  {
    slug: "offshore",
    number: "04",
    title: "Global Offshore",
    category: "Frontend / Corporate services",
    role: "Full-stack Engineer / UI contribution",
    company: "The One Digi Corp",
    stack: ["Next.js", "Laravel"],
    description:
      "UI implementation for an international company-formation and corporate-services website.",
    headline: "A public interface for international corporate services.",
    year: "Current work",
    externalUrl: "https://global-offshore.org/en",
    image: "/images/offshore.webp",
    imageAlt:
      "Global Offshore's public website for international corporate services.",
    accent: "#D5BCEB",
    context:
      "Global Offshore presents international company-formation and corporate services. I worked within the Next.js and Laravel project, with my contribution focused primarily on the user interface.",
    contributions: [
      "Implemented user-interface work within the Next.js and Laravel project.",
      "Contributed to the customer-facing presentation of the corporate-services website.",
    ],
    workflow: [
      "The public website introduces international company-formation and corporate services.",
      "Visitors explore the service information and the website's contact entry points.",
    ],
    outcome:
      "Delivered UI work for the public corporate-services website as part of the development team.",
    scopeNote:
      "Although my company role was Full-stack Engineer, my contribution to this project focused primarily on the UI.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const experiences: Experience[] = [
  {
    company: "The One Digi Corp",
    role: "Full-stack Engineer",
    period: "Dec 2025 - Present",
    description: [
      "Build customer-facing websites and admin systems with Next.js and Laravel.",
      "Contribute to Global eVisa, Vietnam Sky Service, and Global Offshore.",
      "For Global eVisa, develop the database, project setup, admin order management, and configurable public content.",
    ],
  },
  {
    company: "Midota.,CO LTD",
    role: "Web Developer",
    period: "Oct 2022 - Dec 2025",
    description: [
      "Developed Vue frontend modules for VALQUA SPM, including equipment reports, photos, OCR-assisted input, and flange reporting.",
      "Built reusable frontend components and collaborated with backend teams on application integration.",
      "On Chat Meeting, contributed frontend and backend real-time features while coordinating development tasks, team progress, and guidance for teammates.",
    ],
  },
];

export const additionalWork: AdditionalWork[] = [
  {
    title: "Chat Meeting",
    description:
      "Real-time messaging, group video calls, and project planning. As Web Developer and Team Leader on this project (Jan-Jun 2023), I contributed frontend and backend features and coordinated development tasks and team progress.",
    stack: ["Vue.js", "Vuex", "Laravel", "MySQL", "Docker", "WebSocket"],
  },
  {
    title: "Pharmastream-net",
    description:
      "Frontend and UI/UX contribution to an e-learning platform for doctors, with video courses and interactive exams (Oct 2023-Feb 2024). Collaborated with clients and backend teams.",
    // The earlier CV contains conflicting stack descriptions for this project.
    stack: [],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "Vue 2 / 3", "JavaScript", "TypeScript"],
  },
  {
    label: "Backend & data",
    items: ["PHP", "Laravel", "MySQL", "WebSocket"],
  },
  {
    label: "Application work",
    items: [
      "Admin systems",
      "Order management",
      "Configurable content",
      "Reporting workflows",
    ],
  },
  {
    label: "State & tools",
    items: [
      "Vuex",
      "Redux / Redux Toolkit",
      "Git",
      "Docker",
      "Postman",
      "Figma",
    ],
  },
  {
    label: "Collaboration",
    items: [
      "Team communication",
      "Agile / Scrum",
      "Project task coordination",
      "Technical documentation in English",
    ],
  },
];
