import SKILLS from "@/assets/skills";

// Type definition
export interface ISkill {
    name: string;
    description: string;
    icon: ImageMetadata;
    link: string;
}

// #region Programming Languages
export const ProgrammingLanguagesStack = [
    {
        name: "Java",
        description: "Object-oriented programming language for building robust, scalable enterprise backend applications.",
        icon: SKILLS.JavaIcon,
        link: "https://www.oracle.com/java/",
    },
    {
        name: "JavaScript",
        description: "Core scripting language for dynamic web development and modern interactive frontend applications.",
        icon: SKILLS.JsIcon,
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
        name: "TypeScript",
        description: "Typed superset of JavaScript providing static types and enhanced tooling for modern web engineering.",
        icon: SKILLS.TsIcon,
        link: "https://www.typescriptlang.org/",
    },
    {
        name: "C",
        description: "Foundational procedural programming language with low-level memory management and high execution speed.",
        icon: SKILLS.CIcon,
        link: "https://en.cppreference.com/w/c",
    },
] as const;
// #endregion

// #region Web & Frontend Development
export const FrontendStack = [
    {
        name: "React.js",
        description: "Component-based JavaScript library for building responsive and dynamic user interfaces.",
        icon: SKILLS.ReactIcon,
        link: "https://react.dev/",
    },
    {
        name: "Astro",
        description: "Next-gen web framework delivering high-performance content-driven websites with zero JS by default.",
        icon: SKILLS.AstroIcon,
        link: "https://astro.build/",
    },
    {
        name: "Preact.js",
        description: "Fast 3kB alternative to React with the same modern API, used for lightweight interactive components.",
        icon: SKILLS.PreactIcon,
        link: "https://preactjs.com/",
    },
    {
        name: "HTML5",
        description: "Semantic standard markup language for creating structured web page content.",
        icon: SKILLS.HtmlIcon,
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    {
        name: "CSS3",
        description: "Style sheet language used for describing the presentation and styling of web documents.",
        icon: SKILLS.CssIcon,
        link: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework for rapid, modern, and highly responsive UI development.",
        icon: SKILLS.TailwindIcon,
        link: "https://tailwindcss.com/",
    },
    {
        name: "MapLibre GL",
        description: "Open-source mapping library for rendering interactive maps with WebGL in web applications.",
        icon: SKILLS.MaplibreIcon,
        link: "https://maplibre.org/",
    },
] as const;
// #endregion

// #region Backend Development
export const BackendStack = [
    {
        name: "Spring Boot",
        description: "Production-ready Java framework for building stand-alone, robust microservices and REST APIs.",
        icon: SKILLS.SpringBootIcon,
        link: "https://spring.io/projects/spring-boot",
    },
    {
        name: "REST APIs",
        description: "Architectural style for designing structured, scalable networked endpoints using standard HTTP.",
        icon: SKILLS.RestApiIcon,
        link: "https://restfulapi.net/",
    },
    {
        name: "Spring Security",
        description: "Powerful and customizable authentication and access-control framework for Java applications.",
        icon: SKILLS.SpringSecurityIcon,
        link: "https://spring.io/projects/spring-security",
    },
    {
        name: "JWT Authentication",
        description: "Compact, URL-safe means of representing claims securely between two parties for stateless auth.",
        icon: SKILLS.JwtIcon,
        link: "https://jwt.io/",
    },
] as const;
// #endregion

// #region Databases
export const DatabaseStack = [
    {
        name: "MySQL",
        description: "Open-source relational database management system for structured data and ACID transactions.",
        icon: SKILLS.MysqlIcon,
        link: "https://www.mysql.com/",
    },
] as const;
// #endregion

// #region DevOps & Tools
export const DevOpsStack = [
    {
        name: "Git",
        description: "Distributed version control system for tracking changes and collaborating on codebases.",
        icon: SKILLS.GitIcon,
        link: "https://git-scm.com/",
    },
    {
        name: "GitHub",
        description: "Cloud-based hosting service for Git repositories with CI/CD workflows and collaboration.",
        icon: SKILLS.GithubIcon,
        link: "https://github.com/",
    },
    {
        name: "Docker",
        description: "Containerization platform to package applications and dependencies into portable containers.",
        icon: SKILLS.DockerIcon,
        link: "https://www.docker.com/",
    },
    {
        name: "CI/CD",
        description: "Automated continuous integration and delivery pipelines for testing and deployment.",
        icon: SKILLS.CicdIcon,
        link: "https://resources.github.com/ci-cd/",
    },
    {
        name: "Maven",
        description: "Build automation and dependency management tool primarily used for Java projects.",
        icon: SKILLS.MavenIcon,
        link: "https://maven.apache.org/",
    },
    {
        name: "Postman",
        description: "Comprehensive API platform for testing, documenting, and debugging RESTful services.",
        icon: SKILLS.PostmanIcon,
        link: "https://www.postman.com/",
    },
    {
        name: "Swagger",
        description: "API documentation and interactive specification toolkit for designing, building, and documenting REST APIs.",
        icon: SKILLS.SwaggerIcon,
        link: "https://swagger.io/",
    },
    {
        name: "Vite",
        description: "Next-generation frontend build tooling and fast dev server powering modern web workflows.",
        icon: SKILLS.ViteIcon,
        link: "https://vitejs.dev/",
    },
] as const;
// #endregion

// #region Libraries & Animation
export const LibrariesStack = [
    {
        name: "GSAP",
        description: "High-performance JavaScript animation library for creating smooth, timeline-based web animations.",
        icon: SKILLS.GSAPIcon,
        link: "https://gsap.com/",
    },
    {
        name: "iText 7",
        description: "Core Java library for programmatic PDF generation, manipulation, and document workflows.",
        icon: SKILLS.ItextIcon,
        link: "https://itextpdf.com/",
    },
    {
        name: "Java2D",
        description: "Advanced 2D graphics, image processing, and rendering API built directly into Java.",
        icon: SKILLS.JavaIcon,
        link: "https://docs.oracle.com/javase/8/docs/technotes/guides/2d/",
    },
    {
        name: "Apache Commons CSV",
        description: "Reliable Java library for reading, writing, and parsing CSV data formats efficiently.",
        icon: SKILLS.CsvIcon,
        link: "https://commons.apache.org/proper/commons-csv/",
    },
] as const;
// #endregion

// #region Others / Additional Skills
export const AdditionalSkillsStack = [
    {
        name: "OS",
        description: "Operating Systems configuration, terminal environments, and core system administration.",
        icon: SKILLS.OsIcon,
        link: "https://en.wikipedia.org/wiki/Operating_system",
    },
    {
        name: "OOP",
        description: "Object-Oriented Programming principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.",
        icon: SKILLS.OopIcon,
        link: "https://en.wikipedia.org/wiki/Object-oriented_programming",
    },
    {
        name: "DSA",
        description: "Data Structures & Algorithms problem-solving with 300+ challenges completed on LeetCode.",
        icon: SKILLS.DsaIcon,
        link: "https://leetcode.com/",
    },
] as const;
// #endregion

// Default & alias exports
export const WebLanguagesStack = ProgrammingLanguagesStack;
export const FrontendLibrariesStack = FrontendStack;
export const BackendApisStack = BackendStack;
export const StateEventStack = AdditionalSkillsStack;
export const CloudDevOpsStack = DevOpsStack;
export const ToolingTestingStack = DevOpsStack;
export const ConfigTemplatingStack = LibrariesStack;
export const IdesDesignStack = AdditionalSkillsStack;

export default {
    ProgrammingLanguagesStack,
    FrontendStack,
    BackendStack,
    DatabaseStack,
    DevOpsStack,
    LibrariesStack,
    AdditionalSkillsStack,
    WebLanguagesStack,
    FrontendLibrariesStack,
    BackendApisStack,
};