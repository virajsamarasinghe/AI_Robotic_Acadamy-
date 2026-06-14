"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import AnimateIn from "@/components/AnimateIn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ─── Data ─────────────────────────────────────────────── */

const stats = [
  { value: "5,000+", label: "Students Enrolled" },
  { value: "120+", label: "Expert Instructors" },
  { value: "98%", label: "Job Placement Rate" },
  { value: "40+", label: "Industry Partners" },
];

const programs = [
  {
    icon: "🤖",
    title: "Robotics Engineering",
    desc: "Design, build, and program autonomous robots from scratch. Covers mechanics, electronics, and embedded systems.",
    level: "Beginner → Advanced",
    color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
  },
  {
    icon: "🧠",
    title: "Artificial Intelligence",
    desc: "Master machine learning, deep learning, computer vision, and NLP with hands-on projects.",
    level: "Intermediate",
    color: "from-purple-500/20 to-pink-600/20",
    border: "border-purple-500/30",
  },
  {
    icon: "🚀",
    title: "Autonomous Systems",
    desc: "Build self-driving vehicles and drones. Learn sensor fusion, path planning, and real-time control.",
    level: "Advanced",
    color: "from-orange-500/20 to-red-600/20",
    border: "border-orange-500/30",
  },
  {
    icon: "💡",
    title: "IoT & Smart Devices",
    desc: "Connect the physical world to the cloud. Design smart sensors, actuators, and edge AI systems.",
    level: "Beginner → Intermediate",
    color: "from-green-500/20 to-teal-600/20",
    border: "border-green-500/30",
  },
  {
    icon: "⚙️",
    title: "Industrial Automation",
    desc: "Program PLCs, robotic arms, and conveyor systems used in modern smart factories.",
    level: "Intermediate → Advanced",
    color: "from-yellow-500/20 to-amber-600/20",
    border: "border-yellow-500/30",
  },
  {
    icon: "🌐",
    title: "AI for Web & Apps",
    desc: "Integrate AI into real-world applications. Build chatbots, recommendation engines, and vision APIs.",
    level: "Beginner → Intermediate",
    color: "from-blue-500/20 to-indigo-600/20",
    border: "border-blue-500/30",
  },
];

const testimonials = [
  {
    name: "Aisha Patel",
    role: "Robotics Engineer @ Tesla",
    quote:
      "The curriculum here is unlike anything else. I went from zero robotics knowledge to landing a job at Tesla in 18 months.",
    avatar: "AP",
  },
  {
    name: "Marcus Chen",
    role: "AI Researcher @ DeepMind",
    quote:
      "The hands-on project approach makes all the difference. Every concept is immediately applied to real hardware.",
    avatar: "MC",
  },
  {
    name: "Priya Nair",
    role: "Founder, RoboStartup",
    quote:
      "The academy gave me both the technical skills and the entrepreneurial mindset to launch my own robotics company.",
    avatar: "PN",
  },
];

const features = [
  { icon: "🎯", title: "Project-Based Learning", desc: "Build 20+ real-world projects across your program" },
  { icon: "🏆", title: "Industry Certifications", desc: "Earn globally recognised certificates from top tech firms" },
  { icon: "👥", title: "1-on-1 Mentorship", desc: "Weekly sessions with working engineers and researchers" },
  { icon: "🔬", title: "State-of-the-Art Lab", desc: "Access to physical and virtual robotics labs 24/7" },
];

/* ─── Page ─────────────────────────────────────────────── */

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="bg-[#050A14] overflow-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-16"
      >
        {/* Animated grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-5xl mx-auto px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 px-4 py-1 text-sm rounded-full">
              🎓 Applications Open for 2025 Cohort
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
          >
            Where Kids Build{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Robots
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI
            </span>{" "}
            of Tomorrow
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            kidslab.lk is Sri Lanka&apos;s leading AI &amp; Robotics academy for
            young innovators. Hands-on projects, expert mentors, and a fun path
            into the technology of tomorrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              id="enroll"
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 h-12 rounded-full text-base shadow-lg shadow-cyan-500/25 transition-all"
            >
              Start Learning Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 h-12 rounded-full text-base backdrop-blur-sm"
            >
              View Programs →
            </Button>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-cyan-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Programs ── */}
      <section id="programs" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-4 py-1 rounded-full">
              Our Programs
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Learning Path
              </span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
              From beginner workshops to advanced research programs — find the
              track that fits your goals.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <AnimateIn key={p.title} delay={i * 0.08}>
                <Card
                  className={`bg-gradient-to-br ${p.color} border ${p.border} rounded-2xl h-full group cursor-pointer hover:scale-[1.02] transition-transform duration-300`}
                >
                  <CardContent className="p-6 flex flex-col gap-4 h-full">
                    <div className="text-4xl">{p.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                      <p className="mt-2 text-sm text-white/60 leading-relaxed">{p.desc}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <Badge className="bg-white/10 text-white/70 border-white/20 text-xs">
                        {p.level}
                      </Badge>
                      <span className="text-cyan-400 text-sm group-hover:translate-x-1 transition-transform duration-200">
                        Learn more →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features / Why Us ── */}
      <section id="about" className="py-28 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimateIn direction="left">
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-4 py-1 rounded-full">
                Why kidslab.lk?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Learning Built for{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Young Minds
                </span>
              </h2>
              <p className="mt-6 text-white/55 text-lg leading-relaxed">
                kidslab.lk is Sri Lanka&apos;s home for hands-on AI and Robotics
                education. We make cutting-edge technology accessible, fun, and
                relevant — so every child can be a creator, not just a consumer.
              </p>
              <Button className="mt-8 bg-white text-black font-semibold hover:bg-white/90 rounded-full px-8 h-11">
                Explore the Academy
              </Button>
            </AnimateIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <AnimateIn key={f.title} delay={i * 0.1} direction="right">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                    <div className="text-3xl mb-3">{f.icon}</div>
                    <h4 className="font-semibold text-white mb-1">{f.title}</h4>
                    <p className="text-sm text-white/50">{f.desc}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimateIn className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-400 border border-green-500/30 px-4 py-1 rounded-full">
              Student Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Hear From Our{" "}
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Graduates
              </span>
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimateIn key={t.name} delay={i * 0.12}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-6 h-full hover:border-white/20 transition-colors">
                  <p className="text-white/70 leading-relaxed text-sm">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-white/40 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-28 px-6">
        <AnimateIn>
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10 border border-white/10 rounded-3xl p-16">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl"
            >
              🤖
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Build the{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Future?
              </span>
            </h2>
            <p className="mt-6 text-white/55 text-lg max-w-xl mx-auto">
              Join thousands of young innovators at kidslab.lk who are already
              building tomorrow&apos;s technology. Enrolments are now open.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-10 h-12 rounded-full text-base shadow-lg shadow-cyan-500/25"
              >
                Apply Now — It&apos;s Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 h-12 rounded-full text-base"
              >
                Talk to an Advisor
              </Button>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              KL
            </div>
            <span className="font-semibold text-white/80">
              kidslab<span className="text-cyan-400">.lk</span>
            </span>
          </div>
          <p className="text-sm text-white/30">
            © 2025 kidslab.lk. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                {l}
              </a>
            ))}
            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61585638656242"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#1877F2] transition-colors"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
