import LOGOS from "@assets/Logos"
import SCREENSHOTS from "@assets/Shots"
import MOCKUPS from "@assets/Mockup"
import SKILL_STACK from "@/constants/skillStack";
import { buildTechStack } from "@/utils/commonUtils";

//#region Types
/**
 * Projects List Type Definition
 * This interface defines the structure and types of properties for each project in the projects list.
 * It ensures consistency and type safety when working with project data throughout the application.
 * Each project includes details such as name, description, technologies used, features, and links.
 */
export interface IProject {
    isHidden: boolean;

    name: string;
    shortDescription: string;
    description: string;

    logoImage: ImageMetadata;
    previewImage: ImageMetadata;
    deviceMockupImage: ImageMetadata;

    theme: string;
    status: "completed" | "development";

    liveUrl: string;
    sourceUrl: string;

    demoCredentials?: {
        email: string;
        password: string;
    };

    technologies: {
        title: string;
        description: string;
        icon: ImageMetadata;
    }[];

    features: {
        title: string;
        description: string;
    }[];

    logoSize: number;

    versions: {
        title: string;
        version: string;
        url: string;
    }[];
}

/**
 * Technology Stack Type Definition
 * This interface defines the structure and types of properties for each technology in the tech stack.
 */
export interface ITechStack {
    title: string;
    description: string;
    icon: ImageMetadata;
}
//#endregion


//#region Tech Stack
export const TECH_STACK = {
    // Programming Languages
    ...buildTechStack(SKILL_STACK.ProgrammingLanguagesStack),

    // Web & Frontend
    ...buildTechStack(SKILL_STACK.FrontendStack),

    // Backend
    ...buildTechStack(SKILL_STACK.BackendStack),

    // Databases
    ...buildTechStack(SKILL_STACK.DatabaseStack),

    // DevOps & Tools
    ...buildTechStack(SKILL_STACK.DevOpsStack),

    // Libraries
    ...buildTechStack(SKILL_STACK.LibrariesStack),

    // Additional Skills
    ...buildTechStack(SKILL_STACK.AdditionalSkillsStack),
};
//#endregion


//#region COMMON_FEATURES
export const COMMON_FEATURES = {
    RESPONSIVE: {
        title: "Responsive Design",
        description: "Adaptive layout engineered for high visual fidelity and usability across mobile, tablet, and desktop viewports."
    },
    SECURE_AUTH: {
        title: "Secure Authentication",
        description: "Role-based access control and token-based authentication designed to protect sensitive routes and endpoints."
    },
    REST_API: {
        title: "RESTful API Integration",
        description: "Structured REST API endpoints delivering efficient CRUD operations, error handling, and validated data contracts."
    },
    PERFORMANCE: {
        title: "Performance & Scalability",
        description: "Optimized database queries, clean architectural design, and minimal latency for production workloads."
    },
};
//#endregion


export const PROJECTS_LIST: IProject[] = [
    {
        isHidden: false,
        name: "ProbeLink",
        shortDescription: "ISP Network Infrastructure Planning & Site Survey Tool for MDUs, commercial buildings, and campuses.",
        description: "An ISP Network Infrastructure Planning and Site Survey platform engineered during Infosys Virtual Internship 6.0. Organizes sites into hierarchical properties, buildings, floors, and spaces with an interactive canvas for floor plans and polygon geometry. Enables field engineers to log equipment, record cable routes, complete dynamic checklists, and generate RF heatmaps with automated one-click PDF reports.",
        logoImage: LOGOS.ProbeLinkLogo,
        previewImage: SCREENSHOTS.ProbeLinkShots,
        deviceMockupImage: MOCKUPS.ClimateMockup,
        theme: "cyan",
        status: "completed",
        liveUrl: "https://github.com/krishkantrai27/ProbeLink",
        sourceUrl: "https://github.com/krishkantrai27/ProbeLink",
        technologies: [
            TECH_STACK.Java,
            TECH_STACK.SpringBoot,
            TECH_STACK.Reactjs,
            TECH_STACK.SpringSecurity,
            TECH_STACK.JWTAuthentication,
            TECH_STACK.RESTAPIs,
            TECH_STACK.MySQL,
            TECH_STACK.MapLibreGL,
            TECH_STACK.iText7,
            TECH_STACK.Docker,
            TECH_STACK.Maven,
        ],
        features: [
            {
                title: "Hierarchical Property Management",
                description: "Structured organization of campuses, MDUs, and commercial spaces into Properties → Buildings → Floors → Spaces."
            },
            {
                title: "Interactive Canvas & RF Heatmaps",
                description: "Interactive floor plan canvas to draw space polygons, track cable routes, and render RF signal coverage."
            },
            {
                title: "Automated PDF Reporting",
                description: "One-click generation of professional site survey reports with floor plans, equipment inventory, and checklists via iText 7."
            },
            COMMON_FEATURES.SECURE_AUTH,
            COMMON_FEATURES.REST_API,
            COMMON_FEATURES.PERFORMANCE,
        ],
        logoSize: 90,
        versions: [],
    },
    {
        isHidden: false,
        name: "FarmXchange",
        shortDescription: "Blockchain-powered agricultural supply chain platform connecting farmers directly with buyers.",
        description: "A transparent agricultural supply chain and marketplace application designed to eliminate intermediaries. Features multi-role access for Farmers, Distributors, Retailers, Consumers, and Admins, allowing direct crop listing, bidding, real-time wallet transactions, and immutable traceability from farm to delivery.",
        logoImage: LOGOS.FarmXchangeLogo,
        previewImage: SCREENSHOTS.FarmXchangeShots,
        deviceMockupImage: MOCKUPS.DaysbeyondMockup,
        theme: "emerald",
        status: "completed",
        liveUrl: "https://github.com/krishkantrai27/FarmXchange",
        sourceUrl: "https://github.com/krishkantrai27/FarmXchange",
        technologies: [
            TECH_STACK.Java,
            TECH_STACK.SpringBoot,
            TECH_STACK.Reactjs,
            TECH_STACK.SpringSecurity,
            TECH_STACK.JWTAuthentication,
            TECH_STACK.RESTAPIs,
            TECH_STACK.MySQL,
            TECH_STACK.TailwindCSS,
            TECH_STACK.Docker,
            TECH_STACK.Postman,
        ],
        features: [
            {
                title: "Direct Farmer-to-Buyer Marketplace",
                description: "Empowers verified farmers to list crops directly, set pricing per kg, and connect with retailers without middlemen."
            },
            {
                title: "Multi-Role Access & Verification Queue",
                description: "4-tier user roles with admin verification queue for farmer credentials, fraud prevention, and account moderation."
            },
            {
                title: "Real-time Order & Logistics Tracking",
                description: "Automated price calculation, digital wallet deduction, and end-to-end delivery tracking with transaction logs."
            },
            COMMON_FEATURES.SECURE_AUTH,
            COMMON_FEATURES.REST_API,
            COMMON_FEATURES.PERFORMANCE,
        ],
        logoSize: 90,
        versions: [],
    },
    {
        isHidden: false,
        name: "Blog Application",
        shortDescription: "Modern full-stack blogging platform with JWT authentication, rich media posts, and interactive comments.",
        description: "A modern, full-stack blogging platform that delivers a premium dark-theme reading and writing experience. Built with a robust Spring Boot backend and blazing-fast React frontend, featuring JWT authentication, rich media post authoring, categorical organization, real-time comments, and author performance analytics.",
        logoImage: LOGOS.BloggyLogo,
        previewImage: SCREENSHOTS.BloggyShots,
        deviceMockupImage: MOCKUPS.YoatubeMockup,
        theme: "violet",
        status: "completed",
        liveUrl: "https://github.com/krishkantrai27/blog-application",
        sourceUrl: "https://github.com/krishkantrai27/blog-application",
        technologies: [
            TECH_STACK.Java,
            TECH_STACK.SpringBoot,
            TECH_STACK.Reactjs,
            TECH_STACK.SpringSecurity,
            TECH_STACK.JWTAuthentication,
            TECH_STACK.RESTAPIs,
            TECH_STACK.MySQL,
            TECH_STACK.TailwindCSS,
            TECH_STACK.Vite,
            TECH_STACK.Maven,
        ],
        features: [
            {
                title: "Full Content Management (CRUD)",
                description: "Seamless authoring, editing, and categorizing of rich articles with custom image upload support."
            },
            {
                title: "JWT-Protected Author Workflows",
                description: "Secure stateless authentication ensuring only authorized users can publish, modify posts, and moderate comments."
            },
            {
                title: "Interactive Community Engagement",
                description: "Engaging comment feeds, like systems, and author analytics dashboards to track reader reach."
            },
            COMMON_FEATURES.SECURE_AUTH,
            COMMON_FEATURES.REST_API,
            COMMON_FEATURES.PERFORMANCE,
        ],
        logoSize: 90,
        versions: [],
    },
];

export default PROJECTS_LIST;