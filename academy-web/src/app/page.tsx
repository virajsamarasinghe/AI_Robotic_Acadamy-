"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
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

const stats = [
  { value: "500+", label: "Young Innovators", icon: Users },
  { value: "10+",  label: "Expert Engineers",  icon: GraduationCap },
  { value: "6",    label: "Programs",           icon: BookOpen },
  { value: "100%", label: "Hands-on Learning",  icon: FlaskConical },
];

const programs = [
  {
    icon: Bot,
    title: "Robotics Engineering",
    desc: "Build real robots from scratch. Cover mechanics, sensors, actuators, and embedded programming with age-appropriate kits.",
    level: "Ages 8–16",
    color: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    icon: Cpu,
    title: "Artificial Intelligence",
    desc: "Discover machine learning, image recognition, and AI logic through fun, visual, hands-on experiments.",
    level: "Ages 10–17",
    color: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    icon: Rocket,
    title: "Autonomous Systems",
    desc: "Program self-driving vehicles, drones, and obstacle-avoiding robots using real sensors and control systems.",
    level: "Ages 12–18",
    color: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    icon: Wifi,
    title: "IoT & Smart Devices",
    desc: "Connect devices to the internet, build smart home gadgets, and learn cloud connectivity with Arduino & Raspberry Pi.",
    level: "Ages 10–16",
    color: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
  },
  {
    icon: Settings2,
    title: "Mechanical Design",
    desc: "Design and 3D-print robot parts, learn gear systems, linkages, and bring physical creations to life.",
    level: "Ages 8–14",
    color: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    icon: Globe,
    title: "Coding & AI Apps",
    desc: "Build real apps powered by AI. Learn Python, block coding, and modern web fundamentals.",
    level: "Ages 9–17",
    color: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "bg-green-100 text-green-700",
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

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <>
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
            className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-24"
          >
            <div className="grid lg:grid-cols-2 gap-20 items-center">

              {/* ── Left: copy ── */}
              <div className="max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-label mb-7">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Enrolments Open · 2025
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-display-xl text-slate-900"
                >
                  Where Kids Learn to{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    Build Robots
                  </span>{" "}
                  &{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
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
                  <a href="#enroll" id="enroll">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 h-12 rounded-full text-[15px] tracking-[-0.01em] shadow-md shadow-blue-200 transition-all"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                  <a href="#programs">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 px-8 h-12 rounded-full text-[15px] tracking-[-0.01em] font-medium transition-all"
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
                <div className="relative w-[340px] h-[340px]">
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
                      className="w-36 h-36 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-2xl shadow-blue-200/60 flex items-center justify-center"
                    >
                      <Bot className="w-20 h-20 text-white" />
                    </motion.div>
                  </div>
                  {[
                    { Icon: Cpu,       angle: 0,   color: "bg-blue-500",   delay: 0   },
                    { Icon: Zap,       angle: 72,  color: "bg-amber-500",  delay: 0.5 },
                    { Icon: Rocket,    angle: 144, color: "bg-violet-500", delay: 1   },
                    { Icon: Wifi,      angle: 216, color: "bg-teal-500",   delay: 1.5 },
                    { Icon: Settings2, angle: 288, color: "bg-orange-500", delay: 2   },
                  ].map(({ Icon, angle, color, delay }) => {
                    const rad = (angle * Math.PI) / 180;
                    const r = 140;
                    const x = Math.cos(rad) * r;
                    const y = Math.sin(rad) * r;
                    return (
                      <motion.div
                        key={angle}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + delay * 0.14, type: "spring", stiffness: 160 }}
                        style={{ left: `calc(50% + ${x}px - 20px)`, top: `calc(50% + ${y}px - 20px)` }}
                        className="absolute"
                      >
                        <motion.div
                          animate={{ y: [-4, 4, -4] }}
                          transition={{ duration: 2.8 + delay * 0.3, repeat: Infinity, ease: "easeInOut" }}
                          className={`w-10 h-10 rounded-xl ${color} shadow-lg flex items-center justify-center`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.58 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 flex items-center gap-4"
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
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2.5">
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
        <section id="programs" className="py-28 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <AnimateIn className="text-center mb-16">
              <SectionLabel>Our Programs</SectionLabel>
              <h2 className="text-display-lg text-slate-900">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Learning Path
                </span>
              </h2>
              <p className="text-body-xl text-slate-500 mt-5 max-w-lg mx-auto">
                Six carefully designed programs covering Robotics, AI, IoT,
                and more — for ages 8 to 18.
              </p>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {programs.map((p, i) => (
                <AnimateIn key={p.title} delay={i * 0.07}>
                  <Card className={`${p.color} border-0 rounded-2xl h-full group cursor-pointer hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md`}>
                    <CardContent className="p-7 flex flex-col gap-5 h-full">
                      <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center`}>
                        <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-display-md text-slate-900">{p.title}</h3>
                        <p className="text-body-md text-slate-500 mt-2">{p.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
                        <span className={`text-label px-3 py-1.5 rounded-full ${p.badge}`}>
                          {p.level}
                        </span>
                        <span className={`text-[13px] font-semibold ${p.iconColor} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                          Learn more <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ Why kidslab.lk ════════════════════════════════════════════ */}
        <section id="about" className="py-28 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <AnimateIn className="text-center mb-16">
              <SectionLabel className="text-violet-600">Why kidslab.lk?</SectionLabel>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {whyUs.map((item, i) => (
                <AnimateIn key={item.title} delay={i * 0.07}>
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

        {/* ══ University of Ruhuna ═══════════════════════════════════════ */}
        <section id="team" className="py-28 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950">
          <div className="max-w-6xl mx-auto">
            <AnimateIn className="text-center mb-16">
              <p className="text-label text-blue-400 mb-3">Our Instructors</p>
              <h2 className="text-display-lg text-white">
                Taught by Real{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Engineers
                </span>
              </h2>
              <p className="text-body-xl text-slate-400 mt-5 max-w-lg mx-auto">
                Not just teachers — actual Computer Engineering professionals
                who bring real industry knowledge to every class.
              </p>
            </AnimateIn>

            <AnimateIn>
              <div className="bg-white/[0.06] border border-white/10 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center backdrop-blur-sm">
                <div className="shrink-0 flex flex-col items-center gap-5">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-2xl">
                    <GraduationCap className="w-14 h-14 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold" style={{ fontSize: "0.875rem" }}>
                      University of Ruhuna
                    </p>
                    <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.75rem" }}>
                      Est. 1978 · Matara, Sri Lanka
                    </p>
                  </div>
                </div>

                <Separator orientation="vertical" className="hidden md:block h-44 bg-white/10" />

                <div className="flex-1">
                  <p className="text-label text-blue-400 mb-2">Faculty of Engineering</p>
                  <h3 className="text-display-md text-white mb-1.5" style={{ fontSize: "1.5rem" }}>
                    Department of Computer Engineering
                  </h3>
                  <p className="text-body-md text-slate-300 mt-4 mb-7 leading-relaxed">
                    kidslab.lk programs are designed and delivered by Computer Engineering
                    graduates and undergraduates from the University of Ruhuna — one of
                    Sri Lanka&apos;s most respected state universities. Every instructor brings
                    deep technical knowledge and a passion for inspiring the next generation
                    of engineers.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {["Computer Engineering", "Embedded Systems", "Machine Learning", "Robotics & Control", "IoT Development"].map((tag) => (
                      <span
                        key={tag}
                        className="text-label bg-white/10 text-blue-300 border border-white/10 px-3 py-1.5 rounded-full"
                        style={{ letterSpacing: "0.06em" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-6 text-slate-400" style={{ fontSize: "0.875rem" }}>
                    <MapPin className="w-4 h-4 shrink-0" />
                    Hapugala, Galle 80000, Sri Lanka
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* ══ Testimonials ══════════════════════════════════════════════ */}
        <section className="py-28 px-6 bg-slate-50">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <AnimateIn key={t.name} delay={i * 0.1}>
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

        {/* ══ CTA ═══════════════════════════════════════════════════════ */}
        <section id="contact" className="py-28 px-6 bg-white">
          <AnimateIn>
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 rounded-3xl px-10 py-20 md:py-24 shadow-2xl shadow-blue-200/50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full border border-white" />
              </div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
              >
                <Bot className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-display-lg text-white">
                Ready to Start Building?
              </h2>
              <p className="text-body-xl text-blue-100 mt-5 max-w-md mx-auto">
                Give your child a head start in the future of technology.
                Enrol at kidslab.lk today — first class is free.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 h-12 rounded-full text-[15px] tracking-[-0.01em] shadow-lg transition-all"
                >
                  Enrol Now — Free First Class
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <a
                  href="https://www.facebook.com/profile.php?id=61585638656242"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/25 text-white hover:bg-white/10 px-8 h-12 rounded-full text-[15px] tracking-[-0.01em] font-medium"
                  >
                    <FacebookIcon className="mr-2 w-4 h-4" />
                    Follow on Facebook
                  </Button>
                </a>
              </div>
            </div>
          </AnimateIn>
        </section>

        {/* ══ Footer ════════════════════════════════════════════════════ */}
        <footer className="bg-slate-900 text-white pt-14 pb-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-12 pb-12 border-b border-white/10">
              {/* Brand */}
              <div className="max-w-[260px]">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-[1.0625rem] tracking-[-0.02em]">
                    kidslab<span className="text-blue-400">.lk</span>
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
              <p>© 2025 kidslab.lk — All rights reserved.</p>
              <p className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                Powered by University of Ruhuna, Faculty of Engineering
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
