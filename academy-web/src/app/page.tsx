"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AnimateIn from "@/components/AnimateIn";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Bot, Cpu, Rocket, Wifi, Settings2, Globe,
  GraduationCap, Users, Award, Target,
  FlaskConical, BookOpen, CheckCircle, ArrowRight,
  Star, Zap, ChevronRight, MapPin,
} from "lucide-react";
import FacebookIcon from "@/components/FacebookIcon";

/* ─── Data ─── */

const founders = [
  {
    name: "Viraj Samarasinghe",
    role: "Software Engineer · AI Specialized",
    photo: "/viraj.jpg",
    linkedin: "https://www.linkedin.com/in/viraj-samarasinghe",
    tags: ["AI & Machine Learning", "Robotics", "Embedded Systems"],
  },
  {
    name: "Menura Dulkith",
    role: "Software Engineer · AI Specialized",
    photo: "/menura.jpg",
    linkedin: "https://www.linkedin.com/in/menura-dulkith",
    tags: ["AI & Machine Learning", "Robotics", "Embedded Systems"],
  },
];

const stats = [
  { value: "50+",  label: "Young Innovators", icon: Users },
  { value: "5+",   label: "Expert Engineers", icon: GraduationCap },
  { value: "1",    label: "Program",          icon: BookOpen },
  { value: "100%", label: "Hands-on Learning", icon: FlaskConical },
];

const programs = [
  {
    icon: Bot,
    title: "Robotics & AI",
    active: true,
    desc: "Build real robots and explore Artificial Intelligence hands-on. From mechanics and sensors to machine learning — all in one exciting program.",
    level: "Ages 9–14",
    duration: "3 Months",
    fee: "LKR 5,000",
    installment: "Pay in installments within 3 months",
    seminar: "Day 1 is a FREE seminar — intro to Robotics & AI, mindset building & motivation",
    color: "bg-white",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    icon: Rocket,
    title: "Autonomous Systems",
    active: false,
    desc: "Program self-driving vehicles, drones, and obstacle-avoiding robots.",
    level: "Ages 12–18",
    color: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-400",
    badge: "bg-slate-100 text-slate-400",
  },
  {
    icon: Wifi,
    title: "IoT & Smart Devices",
    active: false,
    desc: "Connect devices to the internet and build smart home gadgets.",
    level: "Ages 10–16",
    color: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-400",
    badge: "bg-slate-100 text-slate-400",
  },
  {
    icon: Settings2,
    title: "Mechanical Design",
    active: false,
    desc: "Design and 3D-print robot parts, learn gear systems and linkages.",
    level: "Ages 8–14",
    color: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-400",
    badge: "bg-slate-100 text-slate-400",
  },
  {
    icon: Globe,
    title: "Coding & AI Apps",
    active: false,
    desc: "Build real apps powered by AI — Python, block coding, and web fundamentals.",
    level: "Ages 9–17",
    color: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-400",
    badge: "bg-slate-100 text-slate-400",
  },
  {
    icon: Cpu,
    title: "Advanced AI & ML",
    active: false,
    desc: "Deep-dive into machine learning, image recognition and AI model building.",
    level: "Ages 13–18",
    color: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-400",
    badge: "bg-slate-100 text-slate-400",
  },
];

const whyUs = [
  {
    icon: Target,
    title: "Project-Based Learning",
    desc: "Every lesson ends with a real build. Kids learn by doing, not just watching.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Award,
    title: "University-Backed",
    desc: "Curriculum designed and taught by Computer Engineers from the University of Ruhuna.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    desc: "Max 12 students per class ensures every child gets personal attention and guidance.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: FlaskConical,
    title: "Real Lab Equipment",
    desc: "Actual robotics kits, sensors, microcontrollers — not simulations.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: GraduationCap,
    title: "Age-Appropriate Tracks",
    desc: "Programs designed for ages 8–18, with difficulty scaling as they grow.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Zap,
    title: "Fast, Fun & Engaging",
    desc: "Gamified challenges, team projects, and showcases keep kids excited to learn.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const testimonials = [
  {
    name: "Kavisha Fernando",
    role: "Parent · Galle",
    quote: "My daughter was nervous at first, but after the first class she couldn't stop talking about robots. The engineers make it so fun and easy to understand.",
    stars: 5,
  },
  {
    name: "Tharindu Perera",
    role: "Student · Age 13",
    quote: "I built my first robot here! The teachers are from a real university and they explain everything step by step. I want to become an engineer now.",
    stars: 5,
  },
  {
    name: "Nimal Jayasinghe",
    role: "Parent · Matara",
    quote: "The quality is outstanding. Real university engineers teaching kids — I'm impressed by how much my son has learned in just 3 months.",
    stars: 5,
  },
];

/* ─── Reusable section label ─── */
function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-label text-blue-600 mb-3 ${className}`}>{children}</p>
  );
}

/* ─── Page ─── */

/* ── LinkedIn icon ── */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Seminar countdown ── */
function SeminarCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date("2026-06-27T00:00:00").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setT({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1 xl:gap-2">
      {([
        [t.d, "DAYS"], [t.h, "HRS"], [t.m, "MIN"], [t.s, "SEC"],
      ] as [number, string][]).map(([v, l], i) => (
        <div key={l} className="flex items-center gap-1 xl:gap-2">
          {i > 0 && (
            <span className="text-white/35 font-bold text-lg xl:text-xl 2xl:text-2xl leading-none pb-4">
              :
            </span>
          )}
          <div className="text-center">
            <div
              className="rounded-xl xl:rounded-2xl bg-white/15 flex items-center justify-center"
              style={{
                minWidth: "clamp(2.5rem, 3.5vw, 4.5rem)",
                padding: "clamp(0.4rem, 0.7vw, 1rem) clamp(0.5rem, 0.9vw, 1.25rem)",
              }}
            >
              <span
                className="text-white font-extrabold tabular-nums leading-none"
                style={{ fontSize: "clamp(1.1rem, 1.8vw, 2.5rem)" }}
              >
                {String(v).padStart(2, "0")}
              </span>
            </div>
            <p
              className="text-white/45 font-semibold tracking-widest mt-1"
              style={{ fontSize: "clamp(0.5rem, 0.55vw, 0.7rem)" }}
            >
              {l}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  /* ── JSON-LD structured data ── */
  const jsonLd = [
    /* 1. WebSite */
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "kidslab.lk",
      "url": "https://kidslab.lk",
      "description": "Sri Lanka's Robotics & AI academy for children aged 9–14",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://kidslab.lk/register",
        "query-input": "required name=search_term_string",
      },
    },
    /* 2. EducationalOrganization */
    {
      "@context": "https://schema.org",
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "name": "kidslab.lk",
      "alternateName": "kidslab Academy",
      "url": "https://kidslab.lk",
      "logo": "https://kidslab.lk/logo.png",
      "image": "https://kidslab.lk/logo.png",
      "description": "Robotics & AI academy for children aged 9–14, conducted by Computer Engineers from the University of Ruhuna.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Hapugala",
        "addressLocality": "Galle",
        "postalCode": "80000",
        "addressCountry": "LK",
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 6.0328, "longitude": 80.2168 },
      "telephone": "+94703906478",
      "email": "info@kidslab.lk",
      "foundingDate": "2026",
      "founders": [
        { "@type": "Person", "name": "Viraj Samarasinghe" },
        { "@type": "Person", "name": "Menura Dulkith" },
      ],
      "parentOrganization": {
        "@type": "CollegeOrUniversity",
        "name": "University of Ruhuna",
        "department": "Faculty of Engineering — Department of Computer Engineering",
        "address": { "@type": "PostalAddress", "addressLocality": "Hapugala, Galle", "addressCountry": "LK" },
      },
      "sameAs": [
        "https://www.facebook.com/kidslab.lk",
        "https://wa.me/94703906478",
      ],
    },
    /* 3. Course */
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Robotics & AI for Kids",
      "description": "A 3-month hands-on program covering robotics mechanics, sensors, microcontrollers, and machine learning basics. Designed for children aged 9–14. Taught by Computer Engineers from the University of Ruhuna.",
      "provider": { "@type": "EducationalOrganization", "name": "kidslab.lk", "url": "https://kidslab.lk" },
      "educationalLevel": "Beginner",
      "audience": { "@type": "EducationalAudience", "educationalRole": "student", "audienceType": "Children aged 9–14" },
      "timeRequired": "P3M",
      "numberOfCredits": 0,
      "offers": {
        "@type": "Offer",
        "price": "5000",
        "priceCurrency": "LKR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-06-27",
        "url": "https://kidslab.lk/register",
        "description": "Payable in installments within 3 months. Day 1 is a FREE seminar.",
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "in-person",
        "location": { "@type": "Place", "name": "kidslab.lk Academy", "address": { "@type": "PostalAddress", "addressLocality": "Hapugala, Galle", "addressCountry": "LK" } },
        "startDate": "2026-06-27",
        "endDate": "2026-09-27",
        "instructor": [
          { "@type": "Person", "name": "Viraj Samarasinghe", "jobTitle": "Software Engineer · AI Specialized" },
          { "@type": "Person", "name": "Menura Dulkith",     "jobTitle": "Software Engineer · AI Specialized" },
        ],
      },
    },
    /* 4. Event — Free Seminar */
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Free Robotics & AI Introductory Seminar — kidslab.lk",
      "description": "A free introductory seminar covering basics of Robotics & AI, mindset building, and motivation. No obligation to enrol. Open to children aged 9–14 and their parents.",
      "image": [
        "https://kidslab.lk/og-image.png",
        "https://kidslab.lk/logo.png",
      ],
      "startDate": "2026-06-27T09:00:00+05:30",
      "endDate":   "2026-06-27T13:00:00+05:30",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "kidslab.lk Academy",
        "address": { "@type": "PostalAddress", "streetAddress": "Hapugala", "addressLocality": "Galle", "addressCountry": "LK" },
      },
      "organizer": { "@type": "EducationalOrganization", "name": "kidslab.lk", "url": "https://kidslab.lk" },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "LKR",
        "availability": "https://schema.org/LimitedAvailability",
        "url": "https://kidslab.lk/register",
        "validFrom": "2026-06-14",
      },
      "performer": [
        { "@type": "Person", "name": "Viraj Samarasinghe" },
        { "@type": "Person", "name": "Menura Dulkith" },
      ],
      "audience": { "@type": "Audience", "audienceType": "Children aged 9–14 and parents" },
    },
    /* 5a. Person — Viraj Samarasinghe */
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://kidslab.lk/#viraj-samarasinghe",
      "name": "Viraj Samarasinghe",
      "givenName": "Viraj",
      "familyName": "Samarasinghe",
      "jobTitle": "Software Engineer — AI Specialized",
      "description": "Computer Engineering graduate from the University of Ruhuna, Faculty of Engineering, Sri Lanka. Co-founder of kidslab.lk, specializing in Artificial Intelligence, Robotics, and Embedded Systems. Passionate about making technology education accessible to children in Sri Lanka.",
      "image": "https://kidslab.lk/viraj.jpg",
      "nationality": { "@type": "Country", "name": "Sri Lanka" },
      "worksFor": {
        "@type": "EducationalOrganization",
        "name": "kidslab.lk",
        "url": "https://kidslab.lk",
        "foundingDate": "2026",
      },
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Software Engineer",
        "occupationLocation": { "@type": "Country", "name": "Sri Lanka" },
        "skills": "Artificial Intelligence, Machine Learning, Robotics, Embedded Systems, Python, Computer Vision",
        "educationRequirements": "Bachelor of Science in Computer Engineering",
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "University of Ruhuna",
        "department": "Faculty of Engineering — Department of Computer Engineering",
        "address": { "@type": "PostalAddress", "addressLocality": "Hapugala, Galle", "addressCountry": "LK" },
      },
      "knowsAbout": [
        "Artificial Intelligence", "Machine Learning", "Robotics",
        "Embedded Systems", "Computer Engineering", "IoT",
        "Python Programming", "STEM Education for Children",
      ],
      "url": "https://kidslab.lk/#viraj-samarasinghe",
      "sameAs": [
        "https://www.linkedin.com/in/viraj-samarasinghe",
        "https://kidslab.lk",
      ],
    },
    /* 5b. Person — Menura Dulkith */
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://kidslab.lk/#menura-dulkith",
      "name": "Menura Dulkith",
      "givenName": "Menura",
      "familyName": "Dulkith",
      "jobTitle": "Software Engineer — AI Specialized",
      "description": "Computer Engineering graduate from the University of Ruhuna, Faculty of Engineering, Sri Lanka. Co-founder of kidslab.lk, specializing in Artificial Intelligence, Robotics, and Embedded Systems. Dedicated to inspiring the next generation of young engineers in Sri Lanka.",
      "image": "https://kidslab.lk/menura.jpg",
      "nationality": { "@type": "Country", "name": "Sri Lanka" },
      "worksFor": {
        "@type": "EducationalOrganization",
        "name": "kidslab.lk",
        "url": "https://kidslab.lk",
        "foundingDate": "2026",
      },
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Software Engineer",
        "occupationLocation": { "@type": "Country", "name": "Sri Lanka" },
        "skills": "Artificial Intelligence, Machine Learning, Robotics, Embedded Systems, Python, Computer Vision",
        "educationRequirements": "Bachelor of Science in Computer Engineering",
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "University of Ruhuna",
        "department": "Faculty of Engineering — Department of Computer Engineering",
        "address": { "@type": "PostalAddress", "addressLocality": "Hapugala, Galle", "addressCountry": "LK" },
      },
      "knowsAbout": [
        "Artificial Intelligence", "Machine Learning", "Robotics",
        "Embedded Systems", "Computer Engineering", "IoT",
        "Python Programming", "STEM Education for Children",
      ],
      "url": "https://kidslab.lk/#menura-dulkith",
      "sameAs": [
        "https://www.linkedin.com/in/menura-dulkith",
        "https://kidslab.lk",
      ],
    },
    /* 5c. ProfilePage — Viraj (for Google's People results & AI KGs) */
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": "https://kidslab.lk/#team",
      "name": "Meet the Founders — kidslab.lk",
      "description": "Viraj Samarasinghe and Menura Dulkith, co-founders of kidslab.lk, are Computer Engineering graduates from the University of Ruhuna specializing in AI & Robotics.",
      "url": "https://kidslab.lk/#team",
      "mainEntity": [
        { "@id": "https://kidslab.lk/#viraj-samarasinghe" },
        { "@id": "https://kidslab.lk/#menura-dulkith" },
      ],
    },
    /* 6. FAQPage — key AEO schema */
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is kidslab.lk?",
          "acceptedAnswer": { "@type": "Answer", "text": "kidslab.lk is Sri Lanka's Robotics & AI academy for children aged 9–14, conducted by Computer Engineers from the University of Ruhuna, Faculty of Engineering, based in Galle, Sri Lanka." },
        },
        {
          "@type": "Question",
          "name": "What age group is the Robotics & AI program for?",
          "acceptedAnswer": { "@type": "Answer", "text": "The program is designed for children aged 9 to 14 years old." },
        },
        {
          "@type": "Question",
          "name": "How much does the Robotics & AI program cost?",
          "acceptedAnswer": { "@type": "Answer", "text": "The course fee is LKR 5,000 for 3 months. It can be paid in installments within 3 months. Day 1 is a completely free introductory seminar with no obligation to continue." },
        },
        {
          "@type": "Question",
          "name": "When is the free seminar?",
          "acceptedAnswer": { "@type": "Answer", "text": "The free introductory seminar is on 27 June 2026 at the kidslab.lk Academy in Hapugala, Galle, Sri Lanka. Seats are limited — register at kidslab.lk/register." },
        },
        {
          "@type": "Question",
          "name": "What will my child learn in the Robotics & AI program?",
          "acceptedAnswer": { "@type": "Answer", "text": "Children learn to build real robots using mechanics, sensors, and microcontrollers. The program also covers Artificial Intelligence basics, machine learning concepts, and hands-on project building — all in one 3-month course." },
        },
        {
          "@type": "Question",
          "name": "Who teaches the classes at kidslab.lk?",
          "acceptedAnswer": { "@type": "Answer", "text": "Classes are designed and taught by Viraj Samarasinghe and Menura Dulkith — Computer Engineering graduates from the University of Ruhuna, Faculty of Engineering, who specialize in AI & Robotics." },
        },
        {
          "@type": "Question",
          "name": "Where are the kidslab.lk classes held?",
          "acceptedAnswer": { "@type": "Answer", "text": "Classes are held at the kidslab.lk Academy in Hapugala, Galle 80000, Sri Lanka." },
        },
        {
          "@type": "Question",
          "name": "Can I pay the course fee in installments?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The LKR 5,000 course fee can be paid in installments spread over 3 months." },
        },
        {
          "@type": "Question",
          "name": "How do I register for the free seminar or the course?",
          "acceptedAnswer": { "@type": "Answer", "text": "Visit kidslab.lk/register and fill in your child's details. You can also contact us via WhatsApp at +94703906478." },
        },
        {
          "@type": "Question",
          "name": "Is kidslab.lk affiliated with the University of Ruhuna?",
          "acceptedAnswer": { "@type": "Answer", "text": "The programs are designed and conducted by Computer Engineering graduates and professionals from the University of Ruhuna, Faculty of Engineering." },
        },
        {
          "@type": "Question",
          "name": "Who is Viraj Samarasinghe?",
          "acceptedAnswer": { "@type": "Answer", "text": "Viraj Samarasinghe is a Software Engineer specializing in AI, and co-founder of kidslab.lk. He is a Computer Engineering graduate from the University of Ruhuna, Faculty of Engineering, Sri Lanka, with expertise in Artificial Intelligence, Robotics, and Embedded Systems." },
        },
        {
          "@type": "Question",
          "name": "Who is Menura Dulkith?",
          "acceptedAnswer": { "@type": "Answer", "text": "Menura Dulkith is a Software Engineer specializing in AI, and co-founder of kidslab.lk. He is a Computer Engineering graduate from the University of Ruhuna, Faculty of Engineering, Sri Lanka, with expertise in Artificial Intelligence, Robotics, and Embedded Systems." },
        },
      ],
    },
  ];

  return (
    <>
      {/* Inject all JSON-LD schemas */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <LoadingScreen />
      <main className="bg-white">
        <Navbar />

        {/* ══ Hero ══════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-violet-50/60" />
          <div
            className="absolute top-0 right-0 w-[700px] h-[700px] opacity-25"
            style={{
              background:
                "radial-gradient(circle at 65% 35%, #dbeafe 0%, transparent 55%), radial-gradient(circle at 80% 75%, #ede9fe 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "radial-gradient(#1e40af 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          />

          <motion.div
            style={{ y: heroY }}
            className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-10 xl:px-16 w-full py-24 xl:py-32"
          >
            <div className="grid lg:grid-cols-2 gap-20 xl:gap-28 items-center">

              {/* ── Left: copy ── */}
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-label mb-7" style={{ backgroundColor: "#f0f1f5", border: "1px solid #c8ccd8", color: "var(--brand-navy)" }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-500" />
                    Enrolments Open · 2026
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-display-xl text-slate-900"
                >
                  Where Kids Learn to{" "}
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, var(--brand-navy), #3a5298)" }}>
                    Build Robots
                  </span>{" "}
                  &{" "}
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, var(--brand-red), #c0392b)" }}>
                    AI
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-body-xl text-slate-500 mt-6"
                >
                  Sri Lanka&apos;s leading Robotics &amp; AI academy for
                  children, conducted by{" "}
                  <span className="font-semibold text-slate-800">
                    Computer Engineers from the University of Ruhuna
                  </span>
                  , Faculty of Engineering.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-9 flex flex-wrap gap-3"
                >
                  <motion.div
                    className="rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 0 0px rgba(29,43,82,0.45)",
                        "0 0 0 7px rgba(29,43,82,0.13)",
                        "0 0 0 14px rgba(29,43,82,0)",
                      ],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  >
                    <a href="/register">
                      <Button
                        size="lg"
                        className="btn-register text-white font-semibold px-8 xl:px-10 h-12 xl:h-14 2xl:h-16 rounded-full text-[15px] xl:text-base 2xl:text-lg tracking-[-0.01em] shadow-md"
                        style={{ backgroundColor: "var(--brand-navy)" }}
                      >
                        Register for Free Seminar
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  </motion.div>
                  <a href="#programs">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 px-8 xl:px-10 h-12 xl:h-14 2xl:h-16 rounded-full text-[15px] xl:text-base 2xl:text-lg tracking-[-0.01em] font-medium transition-all"
                    >
                      Explore Programs
                    </Button>
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.44 }}
                  className="mt-9 flex flex-wrap gap-5"
                >
                  {["Ages 8–18", "Hands-on Kits", "University Certified"].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-slate-500" style={{ fontSize: "0.875rem" }}>
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="font-medium">{t}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* ── Right: orbital visual ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }}
                className="relative hidden lg:flex items-center justify-center"
              >
                <div className="orbital-ring relative w-[340px] h-[340px] xl:w-[440px] xl:h-[440px] 2xl:w-[560px] 2xl:h-[560px]">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-blue-100"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-8 rounded-full border border-dashed border-violet-100"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [-7, 7, -7] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-36 h-36 xl:w-44 xl:h-44 2xl:w-56 2xl:h-56 rounded-3xl bg-white shadow-2xl shadow-blue-200/60 flex items-center justify-center p-3"
                      style={{ border: "2px solid #e8ecf4" }}
                    >
                      <Image
                        src="/logo.png"
                        alt="kidslab.lk"
                        width={120}
                        height={120}
                        className="object-contain rounded-xl"
                      />
                    </motion.div>
                  </div>
                  {[
                    { Icon: Cpu,       angle: 0,   color: "bg-blue-500",   delay: 0   },
                    { Icon: Zap,       angle: 72,  color: "bg-amber-500",  delay: 0.5 },
                    { Icon: Rocket,    angle: 144, color: "bg-violet-500", delay: 1   },
                    { Icon: Wifi,      angle: 216, color: "bg-teal-500",   delay: 1.5 },
                    { Icon: Settings2, angle: 288, color: "bg-orange-500", delay: 2   },
                  ].map(({ Icon, angle, color, delay }) => (
                    <div
                      key={angle}
                      className="absolute top-1/2 left-1/2"
                      style={{ transform: `translate(-50%,-50%) rotate(${angle}deg) translateX(var(--orbital-r)) rotate(-${angle}deg)` }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + delay * 0.14, type: "spring", stiffness: 160 }}
                      >
                        <motion.div
                          animate={{ y: [-4, 4, -4] }}
                          transition={{ duration: 2.8 + delay * 0.3, repeat: Infinity, ease: "easeInOut" }}
                          className={`w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-xl ${color} shadow-lg flex items-center justify-center`}
                        >
                          <Icon className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                        </motion.div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── Seminar countdown banner ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52 }}
              className="mt-12 xl:mt-16 rounded-2xl xl:rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-navy) 0%, #2a3f6f 55%, #5a1515 100%)",
              }}
            >
              <div className="px-6 xl:px-10 py-5 xl:py-7 flex flex-col sm:flex-row items-center justify-between gap-4 xl:gap-6">
                <div className="flex items-center gap-3 xl:gap-4">
                  <div className="w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full bg-green-400 animate-pulse shrink-0" />
                  <div>
                    <p className="text-white font-bold text-base xl:text-xl 2xl:text-2xl tracking-tight">
                      Free Seminar — 27 June 2026
                    </p>
                    <p className="text-white/55 text-sm xl:text-base mt-0.5">
                      Seats are limited · Register now to secure your spot
                    </p>
                  </div>
                </div>
                <SeminarCountdown />
              </div>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.58 }}
              className="mt-6 xl:mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-6"
            >
              {stats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 xl:px-8 py-5 xl:py-7 flex items-center gap-4 xl:gap-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p
                      className="font-extrabold text-slate-900 leading-none tracking-tight"
                      style={{ fontSize: "1.625rem", fontFamily: "var(--font-display)" }}
                    >
                      {value}
                    </p>
                    <p className="text-slate-400 mt-1" style={{ fontSize: "0.8125rem" }}>{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ══ University Banner ══════════════════════════════════════════ */}
        <section className="bg-gradient-to-r from-blue-700 to-violet-700 py-4 px-6">
          <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-blue-200 shrink-0" />
            <p className="text-center" style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.8)", letterSpacing: "0.01em" }}>
              Programs conducted by{" "}
              <span className="font-bold text-white">
                Computer Engineers · University of Ruhuna, Faculty of Engineering
              </span>
              <span className="hidden sm:inline text-blue-300 mx-2">·</span>
              <span className="inline-flex items-center gap-1 text-blue-100">
                <MapPin className="w-3 h-3" /> Hapugala, Galle, Sri Lanka
              </span>
            </p>
          </div>
        </section>

        {/* ══ Programs ══════════════════════════════════════════════════ */}
        <section id="programs" className="py-28 px-6 xl:py-36 xl:px-12 bg-slate-50">
          <div className="max-w-screen-2xl mx-auto">
            <AnimateIn className="text-center mb-16">
              <SectionLabel>Our Programs</SectionLabel>
              <h2 className="text-display-lg text-slate-900">
                Start Your{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, var(--brand-navy), #3a5298)" }}>
                  Journey
                </span>
              </h2>
              <p className="text-body-xl text-slate-500 mt-5 max-w-lg mx-auto">
                One flagship program now enrolling — more programs coming soon.
              </p>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {programs.map((p, i) => (
                <AnimateIn key={p.title} delay={i * 0.07} className="h-full min-h-[560px]">
                  {p.active ? (
                    /* ── Active program card ── */
                    <motion.div
                      className="h-full rounded-2xl"
                      animate={{
                        boxShadow: [
                          "0 0 0 0px rgba(29,43,82,0.3), 0 10px 40px rgba(29,43,82,0.08)",
                          "0 0 0 5px rgba(29,43,82,0.1), 0 10px 40px rgba(29,43,82,0.15)",
                          "0 0 0 10px rgba(29,43,82,0), 0 10px 40px rgba(29,43,82,0.08)",
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                    >
                    <Card className="border-2 rounded-2xl h-full hover:-translate-y-1 transition-transform duration-300" style={{ borderColor: "var(--brand-navy)", backgroundColor: "#fff" }}>
                      <CardContent className="p-7 flex flex-col gap-5 h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center`}>
                            <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                          </div>
                          <span className="text-label px-3 py-1 rounded-full text-white text-[10px] inline-flex items-center gap-1.5" style={{ backgroundColor: "var(--brand-red)" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                            Enrolling Now
                          </span>
                        </div>

                        {/* Title & desc */}
                        <div>
                          <h3 className="text-display-md" style={{ color: "var(--brand-navy)" }}>{p.title}</h3>
                          <p className="text-body-md text-slate-500 mt-2">{p.desc}</p>
                        </div>

                        {/* Seminar callout */}
                        <div className="rounded-xl px-4 py-3 flex gap-3 items-start" style={{ backgroundColor: "#f0f4ff", border: "1px solid #c8d4f0" }}>
                          <Star className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-red)" }} />
                          <p className="text-[13px] text-slate-600 leading-snug">{p.seminar}</p>
                        </div>

                        {/* Meta badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className="text-label px-3 py-1.5 rounded-full bg-blue-100 text-blue-700">{p.level}</span>
                          <span className="text-label px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">{p.duration}</span>
                        </div>

                        {/* Fee */}
                        <div className="rounded-xl px-4 py-3 border border-slate-100 bg-slate-50 flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Course Fee</p>
                            <p className="text-xl font-extrabold mt-0.5" style={{ color: "var(--brand-navy)" }}>{p.fee}</p>
                          </div>
                          <p className="text-[12px] text-slate-500 text-right max-w-[130px] leading-snug">{p.installment}</p>
                        </div>

                        {/* CTA */}
                        <a href="/register" className="mt-auto">
                          <motion.div
                            className="rounded-full"
                            animate={{
                              boxShadow: [
                                "0 0 0 0px rgba(29,43,82,0.4)",
                                "0 0 0 4px rgba(29,43,82,0.13)",
                                "0 0 0 8px rgba(29,43,82,0)",
                              ],
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                          >
                            <button className="btn-register w-full text-white font-semibold h-11 rounded-full text-[14px] tracking-[-0.01em] hover:opacity-90" style={{ backgroundColor: "var(--brand-navy)" }}>
                              Register for Free Seminar
                            </button>
                          </motion.div>
                        </a>
                      </CardContent>
                    </Card>
                    </motion.div>
                  ) : (
                    /* ── Coming soon card ── */
                    <Card className={`${p.color} border-0 rounded-2xl h-full relative overflow-hidden`}>
                      <CardContent className="p-7 flex flex-col gap-5 h-full opacity-50 select-none">
                        <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center`}>
                          <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-display-md text-slate-400">{p.title}</h3>
                          <p className="text-body-md text-slate-400 mt-2">{p.desc}</p>
                        </div>
                        <div className="pt-4 border-t border-black/[0.06]">
                          <span className="text-label px-3 py-1.5 rounded-full bg-slate-100 text-slate-400">{p.level}</span>
                        </div>
                      </CardContent>
                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span className="text-label px-4 py-1.5 rounded-full bg-slate-800 text-white text-[11px]">Coming Soon</span>
                      </div>
                    </Card>
                  )}
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ Why kidslab.lk ════════════════════════════════════════════ */}
        <section id="about" className="py-28 px-6 xl:py-36 xl:px-12 bg-white">
          <div className="max-w-screen-2xl mx-auto">
            <AnimateIn className="text-center mb-16">
              <SectionLabel><span style={{ color: "var(--brand-navy)" }}>Why kid<span style={{ color: "var(--brand-red)" }}>s</span>lab.lk?</span></SectionLabel>
              <h2 className="text-display-lg text-slate-900">
                Learning Built for{" "}
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Young Minds
                </span>
              </h2>
              <p className="text-body-xl text-slate-500 mt-5 max-w-lg mx-auto">
                We believe every child can be a creator. Our approach combines
                university-level expertise with kid-friendly teaching.
              </p>
            </AnimateIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {whyUs.map((item, i) => (
                <AnimateIn key={item.title} delay={i * 0.07} className="h-full">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full">
                    <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center mb-5`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <h4 className="text-display-md text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-body-md text-slate-500">{item.desc}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ Team / Founders ════════════════════════════════════════════ */}
        <section id="team" className="py-28 px-6 xl:py-36 xl:px-12 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -left-32 top-0 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
          <div className="absolute -right-32 bottom-0 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />

          <div className="max-w-screen-2xl mx-auto relative z-10">

            {/* Header */}
            <AnimateIn className="text-center mb-16 xl:mb-20">
              <p className="text-label text-blue-400 mb-3">Meet the Founders</p>
              <h2 className="text-display-lg text-white">
                Built by Real{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, #60a5fa, #a78bfa)" }}>
                  Engineers
                </span>
              </h2>
              <p className="text-body-xl text-slate-400 mt-5 max-w-xl mx-auto">
                Computer Engineering graduates from the University of Ruhuna,
                specializing in AI &amp; Robotics.
              </p>
            </AnimateIn>

            {/* Founder cards — full-bleed portrait */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:gap-8 max-w-2xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">
              {founders.map((f, i) => (
                <AnimateIn key={f.name} delay={i * 0.15} className="h-full">
                  <div
                    className="group relative rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                    style={{ aspectRatio: "3 / 4" }}
                  >
                    {/* Full-bleed photo */}
                    <Image
                      src={f.photo}
                      alt={f.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 600px"
                    />

                    {/* Dark gradient overlay — bottom-heavy so text is readable */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(8,12,35,1) 0%, rgba(8,12,35,0.88) 35%, rgba(8,12,35,0.35) 65%, rgba(8,12,35,0.1) 100%)",
                      }}
                    />

                    {/* Co-Founder badge — top left */}
                    <div className="absolute top-4 left-4 xl:top-5 xl:left-5">
                      <span
                        className="inline-flex items-center gap-1.5 bg-blue-500/90 text-white font-bold rounded-full px-3 py-1 tracking-widest uppercase backdrop-blur-sm"
                        style={{ fontSize: "clamp(0.55rem, 0.6vw, 0.75rem)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                        Co‑Founder
                      </span>
                    </div>

                    {/* Content — pinned to bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 xl:p-8 2xl:p-10 flex flex-col gap-3 xl:gap-4">

                      {/* Name + role */}
                      <div>
                        <h3
                          className="text-white font-extrabold tracking-tight leading-tight"
                          style={{ fontSize: "clamp(1.2rem, 1.6vw, 2rem)" }}
                        >
                          {f.name}
                        </h3>
                        <p
                          className="text-blue-300 font-medium mt-1"
                          style={{ fontSize: "clamp(0.78rem, 0.9vw, 1.1rem)" }}
                        >
                          {f.role}
                        </p>
                      </div>

                      {/* University */}
                      <div className="flex items-center gap-2 text-slate-400" style={{ fontSize: "clamp(0.68rem, 0.75vw, 0.9rem)" }}>
                        <GraduationCap className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 text-blue-400" />
                        University of Ruhuna · Faculty of Engineering
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {f.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-white/10 text-blue-200 border border-white/15 px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase backdrop-blur-sm"
                            style={{ fontSize: "clamp(0.55rem, 0.6vw, 0.72rem)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* LinkedIn */}
                      <a
                        href={f.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 self-start inline-flex items-center gap-2 px-4 xl:px-5 py-2 xl:py-2.5 rounded-full border border-[#0A66C2]/50 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/50 text-[#93c5fd] hover:text-white transition-all duration-200 font-semibold backdrop-blur-sm"
                        style={{ fontSize: "clamp(0.75rem, 0.85vw, 1rem)" }}
                      >
                        <LinkedInIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                        LinkedIn Profile
                      </a>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>

            {/* University strip */}
            <AnimateIn delay={0.3} className="mt-10 xl:mt-14">
              <div className="max-w-3xl xl:max-w-5xl mx-auto bg-white/[0.04] border border-white/8 rounded-2xl px-8 xl:px-12 py-5 xl:py-6 flex flex-col sm:flex-row items-center justify-center gap-4 xl:gap-8">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 xl:w-6 xl:h-6 text-blue-400 shrink-0" />
                  <p className="text-slate-300 font-semibold" style={{ fontSize: "clamp(0.8rem, 0.9vw, 1.1rem)" }}>
                    University of Ruhuna · Faculty of Engineering
                  </p>
                </div>
                <div className="hidden sm:block w-px h-5 bg-white/20" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 xl:w-5 xl:h-5 text-slate-500 shrink-0" />
                  <p className="text-slate-500" style={{ fontSize: "clamp(0.75rem, 0.85vw, 1rem)" }}>
                    Hapugala, Galle, Sri Lanka
                  </p>
                </div>
              </div>
            </AnimateIn>

          </div>
        </section>

        {/* ══ Testimonials ══════════════════════════════════════════════ */}
        <section className="py-28 px-6 xl:py-36 xl:px-12 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <AnimateIn className="text-center mb-16">
              <SectionLabel className="text-green-600">Student &amp; Parent Reviews</SectionLabel>
              <h2 className="text-display-lg text-slate-900">
                What They&apos;re{" "}
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Saying
                </span>
              </h2>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {testimonials.map((t, i) => (
                <AnimateIn key={t.name} delay={i * 0.1} className="h-full">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col gap-5 h-full hover:shadow-md transition-shadow duration-300">
                    <div className="flex gap-1">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-body-md text-slate-600 flex-1 leading-[1.75]">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold shrink-0" style={{ fontSize: "0.6875rem" }}>
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900" style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}>
                          {t.name}
                        </p>
                        <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.8125rem" }}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ Contact ═══════════════════════════════════════════════════ */}
        <section id="contact" className="py-28 px-6 xl:py-36 xl:px-12 bg-slate-50">
          <div className="max-w-screen-2xl mx-auto">
            <AnimateIn className="text-center mb-14">
              <SectionLabel>Get In Touch</SectionLabel>
              <h2 className="text-display-lg text-slate-900">
                Ready to{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, var(--brand-navy), #3a5298)" }}>
                  Enrol Your Child?
                </span>
              </h2>
              <p className="text-body-xl text-slate-500 mt-4 max-w-xl mx-auto">
                Reach out via any channel below — we&apos;re happy to answer your questions and guide you through the process.
              </p>
            </AnimateIn>

            <div className="grid md:grid-cols-2 gap-8 xl:gap-12 max-w-4xl mx-auto items-stretch">
              {/* Contact channels */}
              <AnimateIn delay={0.1} className="h-full">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 xl:p-10 flex flex-col gap-5 h-full">
                  <h3 className="text-display-md" style={{ color: "var(--brand-navy)" }}>Contact Us</h3>

                  {/* WhatsApp */}
                  <a href="https://wa.me/94703906478" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#25D366" }}>
                      <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.651 4.833 1.789 6.863L2 30l7.347-1.766A13.924 13.924 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm6.34 19.386c-.347-.174-2.053-1.013-2.373-1.128-.32-.116-.553-.174-.786.174-.233.347-.9 1.128-1.103 1.36-.203.232-.406.26-.752.087-.347-.174-1.464-.54-2.788-1.72-1.031-.918-1.727-2.05-1.93-2.397-.202-.347-.021-.534.152-.707.157-.155.347-.406.52-.609.174-.203.232-.347.348-.578.115-.232.058-.435-.029-.609-.087-.174-.786-1.894-1.077-2.592-.283-.68-.57-.588-.786-.598l-.668-.012a1.28 1.28 0 00-.927.435c-.32.347-1.218 1.19-1.218 2.9s1.247 3.363 1.42 3.596c.174.232 2.453 3.745 5.944 5.252.831.359 1.48.573 1.985.733.834.265 1.594.228 2.194.138.669-.1 2.053-.84 2.343-1.651.29-.812.29-1.507.203-1.651-.086-.145-.32-.232-.667-.406z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-green-700 transition-colors">WhatsApp</p>
                      <p className="text-slate-400 text-sm">+94 70 390 6478</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-green-500 transition-colors" />
                  </a>

                  {/* Facebook */}
                  <a href="https://www.facebook.com/profile.php?id=61585638656242" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#1877F2" }}>
                      <FacebookIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">Facebook</p>
                      <p className="text-slate-400 text-sm">kidslab.lk — Academy for Kids</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-blue-500 transition-colors" />
                  </a>

                  {/* Email */}
                  <a href="mailto:info@kidslab.lk"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--brand-navy)" }}>
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">Email</p>
                      <p className="text-slate-400 text-sm">info@kidslab.lk</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
                  </a>

                  {/* Location */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Location</p>
                      <p className="text-slate-400 text-sm">Hapugala, Galle, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>

              {/* CTA card */}
              <AnimateIn delay={0.18} className="h-full">
                <div className="rounded-2xl p-8 xl:p-10 flex flex-col justify-between h-full relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, #2a3f6f 60%, #5a1515 100%)" }}>
                  {/* Decorative rings */}
                  <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-white/10" />
                  <div className="absolute -right-8 -bottom-20 w-80 h-80 rounded-full border border-white/10" />

                  <div className="relative z-10">
                    <div className="bg-white/15 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                      <Image src="/logo.png" alt="kidslab.lk" width={44} height={44} className="rounded-xl object-contain" />
                    </div>
                    <h3 className="text-display-md text-white">Free Seminar — First Day</h3>
                    <p className="text-white/75 mt-3 leading-relaxed text-body-md">
                      Attend our <span className="text-white font-semibold">free introductory seminar</span> — basic Robotics &amp; AI, mindset building &amp; motivation. No commitment required.
                    </p>

                    <div className="mt-6 space-y-2">
                      {["Ages 9–14", "3-Month Program", "LKR 5,000 · Pay in Installments"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-white/80 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 flex flex-col gap-3">
                    <a href="/register" className="block">
                      <button className="w-full bg-white font-bold h-12 rounded-full text-sm tracking-[-0.01em] transition-all hover:bg-slate-50 shadow-lg" style={{ color: "var(--brand-navy)" }}>
                        Register for Free Seminar →
                      </button>
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61585638656242" target="_blank" rel="noopener noreferrer" className="block">
                      <button className="w-full border border-white/25 text-white font-medium h-11 rounded-full text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <FacebookIcon className="w-4 h-4" />
                        Follow on Facebook
                      </button>
                    </a>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>

        {/* ══ Footer ════════════════════════════════════════════════════ */}
        <footer className="bg-slate-900 text-white pt-14 pb-10 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-12 pb-12 border-b border-white/10">
              {/* Brand */}
              <div className="max-w-[260px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white rounded-xl p-1.5 flex-shrink-0">
                    <Image
                      src="/logo.png"
                      alt="kidslab.lk logo"
                      width={56}
                      height={56}
                      className="rounded-lg object-contain"
                    />
                  </div>
                  <span className="font-bold text-[1.0625rem] tracking-[-0.02em]">
                    kid<span style={{ color: "#e07070" }}>s</span>lab.lk
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed" style={{ fontSize: "0.875rem" }}>
                  Sri Lanka&apos;s leading AI &amp; Robotics academy for young
                  innovators — taught by University of Ruhuna engineers.
                </p>
                <a
                  href="https://www.facebook.com/profile.php?id=61585638656242"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 text-slate-400 hover:text-[#1877F2] transition-colors"
                  style={{ fontSize: "0.875rem" }}
                >
                  <FacebookIcon className="w-4 h-4" />
                  Follow on Facebook
                </a>
              </div>

              {/* Link columns */}
              <div className="grid grid-cols-2 gap-x-16 gap-y-3">
                <div>
                  <p className="text-label text-slate-500 mb-4">Programs</p>
                  {["Robotics", "AI & ML", "IoT", "Autonomous Systems", "Coding"].map((l) => (
                    <a key={l} href="#programs" className="block text-slate-400 hover:text-white mb-2.5 transition-colors" style={{ fontSize: "0.875rem" }}>
                      {l}
                    </a>
                  ))}
                </div>
                <div>
                  <p className="text-label text-slate-500 mb-4">Academy</p>
                  {["About Us", "Our Team", "University Partner", "Enrol", "Contact"].map((l) => (
                    <a key={l} href="#" className="block text-slate-400 hover:text-white mb-2.5 transition-colors" style={{ fontSize: "0.875rem" }}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500" style={{ fontSize: "0.8125rem" }}>
              <p>© 2026 kid<span style={{ color: "#e07070" }}>s</span>lab.lk — All rights reserved.</p>
              <p className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" style={{ color: "#e07070" }} />
                Powered by University of Ruhuna, Faculty of Engineering
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Floating WhatsApp button ── */}
      <a
        href="https://wa.me/94703906478"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 xl:bottom-8 xl:right-8 2xl:bottom-10 2xl:right-10 z-50 flex items-center justify-center w-14 h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.651 4.833 1.789 6.863L2 30l7.347-1.766A13.924 13.924 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.556 11.556 0 01-5.867-1.6l-.42-.25-4.36 1.048 1.068-4.248-.275-.437A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.34-8.614c-.347-.174-2.053-1.013-2.373-1.128-.32-.116-.553-.174-.786.174-.233.347-.9 1.128-1.103 1.36-.203.232-.406.26-.752.087-.347-.174-1.464-.54-2.788-1.72-1.031-.918-1.727-2.05-1.93-2.397-.202-.347-.021-.534.152-.707.157-.155.347-.406.52-.609.174-.203.232-.347.348-.578.115-.232.058-.435-.029-.609-.087-.174-.786-1.894-1.077-2.592-.283-.68-.57-.588-.786-.598l-.668-.012a1.28 1.28 0 00-.927.435c-.32.347-1.218 1.19-1.218 2.9s1.247 3.363 1.42 3.596c.174.232 2.453 3.745 5.944 5.252.831.359 1.48.573 1.985.733.834.265 1.594.228 2.194.138.669-.1 2.053-.84 2.343-1.651.29-.812.29-1.507.203-1.651-.086-.145-.32-.232-.667-.406z" />
        </svg>
      </a>
    </>
  );
}
