import { Avatar_180, Avatar_250 } from "@assets/images";

// Importing SVGs as raw strings
import GithubIconRaw from "@assets/SVGs/Github.svg?raw";
import GmailIconRaw from "@assets/SVGs/Gmail.svg?raw";
import LinkedinIconRaw from "@assets/SVGs/Linkedin.svg?raw";
import LeetcodeIconRaw from "@assets/SVGs/Leetcode.svg?raw";
import InstagramIconRaw from "@assets/SVGs/Instagram.svg?raw";

import { LogoIcon } from "@/assets/SVGs";
import { ThemeOptions } from "../../scripts/generateThemes";

// Theme Configuration
export const themeConfig = ThemeOptions.SUNSET;

// Site Configuration
export const siteConfig = {
    title: "Krish Kant Rai | Full Stack Java Developer",
    description: "Krish Kant Rai is a Full Stack Java Developer skilled in Spring Boot, React.js, and MySQL, building secure REST APIs and scalable web applications.",
    canonical: "https://krishkant.netlify.app/",
    googleSiteVerification: "",
    keywords: "Krish, Krish Kant Rai, Full Stack Java Developer, Spring Boot, React.js, MySQL, REST APIs, Spring Security, JWT Authentication, Java, JavaScript, Docker, Git, CI/CD, Maven, Postman, Swagger, Web Developer, Portfolio",
    avatar: "https://raw.githubusercontent.com/krishkantrai27/krishkantrai27.github.io/main/Avatar.webp",
    siteUrl: "https://krishkant.netlify.app/",
}

// Header Section
export const headerConfig = {
    logotext: "Hey There.",
    actionButton: {
        text: "Resume",
        url: "/resume.pdf" // use full URL or Public Folder path
    },
}

// Hero Section
export const heroConfig = {
    salutation: "Hi👋🏻 My name is",
    firstName: "Krish",
    lastName: "",
    position: "Full Stack Java Developer",
    tagLine: {
        prefixText: "I build",
        highlightedText: "Scalable Systems",
        suffixText: "on the Internet."
    },
    avatar: Avatar_180,
    links: [
        {
            label: "GitHub",
            url: "https://github.com/krishkantrai27",
            icon: GithubIconRaw
        },
        {
            label: "Gmail",
            url: "mailto:krishkantrai2006@gmail.com",
            icon: GmailIconRaw
        },
        {
            label: "LinkedIn",
            url: "https://www.linkedin.com/in/krish-kant-rai-3a8734338/",
            icon: LinkedinIconRaw
        },
        {
            label: "LeetCode",
            url: "https://leetcode.com/u/krishkant/",
            icon: LeetcodeIconRaw
        }
    ],
}

// About Section
export const aboutConfig = {
    aboutAvatar: Avatar_250,
    description: [
        "Hey there! 👋🏻 I'm Krish Kant Rai, a Full Stack Java Developer skilled in Spring Boot, React.js, and MySQL, with hands-on experience building secure REST APIs and JWT-based authentication.",
        "I am passionate about developing scalable web applications with efficient backend systems and clean, modern frontend interfaces. I specialize in backend architecture, role-based access control, and database design.",
        "With a strong foundation in Object-Oriented Programming (OOP) and Data Structures & Algorithms (300+ problems solved on LeetCode), I focus on writing robust, maintainable, and high-performance code.",
        "If you're looking for a developer who ships secure, production-ready systems and scalable web applications, let's connect! 😄"
    ],
}

// Footer Section
export const footerConfig = {
    logo: LogoIcon,
    title: "Krish Kant Rai | Portfolio.",
    links: [
        {
            label: "GitHub",
            url: "https://github.com/krishkantrai27",
            icon: GithubIconRaw
        },
        {
            label: "Gmail",
            url: "mailto:krishkantrai2006@gmail.com",
            icon: GmailIconRaw
        },
        {
            label: "LinkedIn",
            url: "https://www.linkedin.com/in/krish-kant-rai-3a8734338/",
            icon: LinkedinIconRaw
        },
        {
            label: "LeetCode",
            url: "https://leetcode.com/u/krishkant/",
            icon: LeetcodeIconRaw
        },
        {
            label: "Instagram",
            url: "https://www.instagram.com/_krish_kant/",
            icon: InstagramIconRaw
        }
    ],
    copyrightText: `© Copyright ${new Date().getFullYear()} Krish Kant Rai`
}
