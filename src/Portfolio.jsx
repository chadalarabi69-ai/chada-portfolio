import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, Sun, Moon, ArrowUp , Mail, Download,
  ExternalLink, GraduationCap, Network, Terminal, Send, MapPin,
  Briefcase, Award, ShieldCheck, HeartPulse, Bot, Code2, Sparkles,
  ArrowRight, CheckCircle2,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
 
/* ------------------------------------------------------------------ */
/*  Hook: reveal an element once it enters the viewport                */
/* ------------------------------------------------------------------ */
function useOnScreen(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
 
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return [ref, visible];
}
 
/* ------------------------------------------------------------------ */
/*  Reveal wrapper — fade + rise, replaces Framer Motion scroll reveal */
/* ------------------------------------------------------------------ */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useOnScreen();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
 
/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
function Counter({ target, suffix = "", duration = 1400 }) {
  const [ref, visible] = useOnScreen({ threshold: 0.5 });
  const [value, setValue] = useState(0);
 
  useEffect(() => {
    if (!visible) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);
 
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
 
/* ------------------------------------------------------------------ */
/*  Toast notification (for CV download placeholder, contact form)     */
/* ------------------------------------------------------------------ */
function Toast({ message, show }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl px-5 py-3 shadow-2xl shadow-blue-500/20">
        <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
        <span className="text-sm text-slate-100">{message}</span>
      </div>
    </div>
  );
}
 
/* ------------------------------------------------------------------ */
/*  Network canvas — signature ambient background for the hero         */
/*  (nodes + connecting lines, a nod to networking / cybersecurity)    */
/* ------------------------------------------------------------------ */
function NetworkCanvas() {
  const canvasRef = useRef(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let width, height, nodes;
 
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      const count = Math.min(46, Math.floor((width * height) / 18000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
    };
 
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!prefersReduced) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(59,130,246,${0.16 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.55)";
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };
 
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);
 
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
 
/* ------------------------------------------------------------------ */
/*  Abstract "avatar" illustration — easy to swap for a real photo     */
/* ------------------------------------------------------------------ */
function AvatarIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-500/30 via-blue-400/10 to-transparent blur-2xl" />
      <div className="relative h-full w-full rounded-[2.5rem] border border-white/10 bg-slate-800/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-500/10">
        <svg viewBox="0 0 400 400" className="h-full w-full">
          <defs>
            <linearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <radialGradient id="glowGrad" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="400" fill="#0F172A" />
          <circle cx="200" cy="180" r="180" fill="url(#glowGrad)" />
          <g opacity="0.5" stroke="#3B82F6" strokeWidth="1">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={0} y1={40 * i} x2={400} y2={40 * i - 60} />
            ))}
          </g>
          <circle cx="200" cy="150" r="72" fill="url(#avatarGrad)" opacity="0.9" />
          <path
            d="M90 360c8-70 62-118 110-118s102 48 110 118z"
            fill="url(#avatarGrad)"
            opacity="0.9"
          />
          <circle cx="200" cy="150" r="72" fill="none" stroke="#93C5FD" strokeWidth="2" opacity="0.6" />
          <circle cx="120" cy="90" r="4" fill="#60A5FA" />
          <circle cx="310" cy="120" r="3" fill="#60A5FA" />
          <circle cx="70" cy="220" r="3" fill="#60A5FA" />
          <circle cx="330" cy="260" r="4" fill="#60A5FA" />
        </svg>
      </div>
      <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl px-4 py-3 shadow-xl">
        <ShieldCheck className="h-5 w-5 text-blue-400" />
        <span className="text-xs font-medium text-slate-200">Cybersecurity focused</span>
      </div>
    </div>
  );
}
 
/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
 
const STATS = [
  { label: "Years Learning", value: 2, suffix: "+" },
  { label: "Certificates", value: 10, suffix: "+" },
  { label: "Projects", value: 5, suffix: "+" },
  { label: "Always Learning", value: 100, suffix: "%" },
];
 
const SKILL_GROUPS = [
  {
    title: "Programming",
    icon: Code2,
    items: [
      { name: "Python", level: 85 },
      { name: "C", level: 75 },
      { name: "HTML", level: 90 },
      { name: "CSS", level: 85 },
      { name: "JavaScript", level: 78 },
      { name: "SQL", level: 75 },
    ],
  },
  {
    title: "Networking",
    icon: Network,
    items: [
      { name: "Cisco Networking", level: 75 },
      { name: "TCP/IP", level: 80 },
      { name: "Routing", level: 70 },
      { name: "Switching", level: 70 },
    ],
  },
  {
    title: "Cybersecurity",
    icon: ShieldCheck,
    items: [
      { name: "Linux", level: 75 },
      { name: "Basic Security", level: 70 },
      { name: "Network Security", level: 65 },
    ],
  },
  {
    title: "Soft Skills",
    icon: Sparkles,
    items: [
      { name: "Problem Solving", level: 92 },
      { name: "Teamwork", level: 88 },
      { name: "Communication", level: 85 },
      { name: "Fast Learning", level: 95 },
    ],
  },
];
 
const CERTIFICATES = [
  {
    name: "Cisco Networking Basics",
    org: "Cisco Networking Academy",
    description:
      "Certificate covering networking fundamentals, TCP/IP, and basic network concepts.",
    image: "/certificates/cisco.png",
    link: "/certificates/cisco-certificate.pdf",
    icon: Network,
  },

  {
    name: "Microsoft Office Specialist",
    org: "Microsoft",
    description:
      "Certification demonstrating skills in Microsoft Office applications.",
    image: "/certificates/microsoft.png",
    link: "#",
    icon: Briefcase,
  },

  {
    name: "Microsoft 365 Copilot",
    org: "Microsoft",
    description:
      "Certificate about AI productivity tools and Microsoft Copilot.",
    image: "/certificates/copilot.png",
    link: "#",
    icon: Bot,
  },

  {
    name: "Linux Basics",
    org: "Independent Study",
    description:
      "Learning Linux fundamentals, commands, and system basics.",
    image: "/certificates/linux.png",
    link: "#",
    icon: Terminal,
  },

  {
    name: "Red Cross Certificate",
    org: "Moroccan Red Crescent",
    description:
      "Certificate in first aid and emergency response basics.",
    image: "/certificates/redcross.png",
    link: "#",
    icon: HeartPulse,
  },
];
 
const PROJECTS = [
  {
    title: "AusbildungAI",
    description:
      "An AI assistant that helps students discover and apply to German Ausbildung programs, offering smart matching and guided application support through a FastAPI backend.",
    tech: ["Python", "FastAPI", "AI / NLP", "React"],
  },
  {
    title: "Berlin Eats",
    description:
      "A modern restaurant website concept with menu browsing, table reservations, and a clean, fully responsive interface tailored for a Berlin dining brand.",
    tech: ["React", "Tailwind CSS", "Node.js"],
  },
  {
    title: "Portfolio Website",
    description:
      "This very site — a premium, responsive personal portfolio built with React, TypeScript, and Tailwind CSS, featuring glassmorphism and refined motion design.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
  },
];
 
/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
 
  const containerRef = useRef(null);
 
  /* loading screen */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);
 
  /* scroll progress + active section + scroll-to-top visibility */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(height > 0 ? (scrollTop / height) * 100 : 0);
      setShowTop(scrollTop > 500);
 
      const offsets = NAV_LINKS.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        return { id, top: Math.abs(el.getBoundingClientRect().top - 120) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) setActiveSection(offsets[0].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  /* cursor glow (desktop only) */
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;
    const onMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
 
  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2800);
  }, []);
 
  const scrollToId = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast("Please fill in your name, email, and message.");
      return;
    }
    setSent(true);
    showToast("Message sent! Chada will get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };
 
  const theme = dark
    ? {
        bg: "bg-slate-950",
        text: "text-slate-100",
        subtext: "text-slate-400",
        card: "bg-white/5 border-white/10",
        cardHover: "hover:bg-white/[0.08] hover:border-blue-500/40",
        navBg: "bg-slate-950/70 border-white/10",
        section: "",
        sectionAlt: "bg-slate-900/40",
      }
    : {
        bg: "bg-slate-50",
        text: "text-slate-900",
        subtext: "text-slate-600",
        card: "bg-white/70 border-slate-200",
        cardHover: "hover:bg-white hover:border-blue-500/40",
        navBg: "bg-white/70 border-slate-200",
        section: "",
        sectionAlt: "bg-slate-100/60",
      };
 
  return (
    <div
      ref={containerRef}
      className={`min-h-screen font-sans antialiased selection:bg-blue-500/30 selection:text-white transition-colors duration-500 ${theme.bg} ${theme.text}`}
    >
      {/* ---------------------------------------------------------- */}
      {/* Loading screen                                              */}
      {/* ---------------------------------------------------------- */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-blue-500/20 blur-md animate-pulse" />
        </div>
        <p className="mt-6 text-sm tracking-[0.3em] text-slate-400 uppercase">
          Loading Portfolio
        </p>
      </div>
 
      {/* ---------------------------------------------------------- */}
      {/* Cursor glow                                                 */}
      {/* ---------------------------------------------------------- */}
      <div
        className={`pointer-events-none fixed z-[60] h-[420px] w-[420px] rounded-full bg-blue-500/[0.07] blur-3xl transition-opacity duration-500 hidden md:block ${
          cursorVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: cursorPos.x - 210, top: cursorPos.y - 210 }}
      />
 
      {/* ---------------------------------------------------------- */}
      {/* Scroll progress bar                                        */}
      {/* ---------------------------------------------------------- */}
      <div className="fixed top-0 left-0 z-[90] h-[3px] w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-300 transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
 
      {/* ---------------------------------------------------------- */}
      {/* Navbar                                                      */}
      {/* ---------------------------------------------------------- */}
      <header
        className={`fixed top-0 z-[80] w-full border-b backdrop-blur-xl transition-colors duration-500 ${theme.navBg}`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => scrollToId("home")}
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30">
              CL
            </span>
            Chada Larabi
          </button>
 
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollToId(link.id)}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeSection === link.id
                      ? "text-blue-400"
                      : `${theme.subtext} hover:text-blue-400`
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-blue-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
 
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle dark or light mode"
              onClick={() => setDark((d) => !d)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${theme.card} ${theme.cardHover}`}
            >
              {dark ? (
                <Sun className="h-4 w-4 text-blue-400" />
              ) : (
                <Moon className="h-4 w-4 text-blue-500" />
              )}
            </button>
            <button
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen((m) => !m)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border md:hidden transition-colors duration-300 ${theme.card} ${theme.cardHover}`}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
 
        {/* mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-400 md:hidden ${
            menuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <ul className={`flex flex-col gap-1 border-t px-6 py-4 ${theme.navBg}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollToId(link.id)}
                  className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? "bg-blue-500/10 text-blue-400"
                      : `${theme.subtext} hover:bg-blue-500/5 hover:text-blue-400`
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>
 
      {/* ---------------------------------------------------------- */}
      {/* Hero / Home                                                 */}
      {/* ---------------------------------------------------------- */}
      <section
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16"
      >
        <div className="absolute inset-0 -z-10">
          <NetworkCanvas />
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-[120px]" />
        </div>
 
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                Open to internships &amp; opportunities in Germany
              </span>
            </Reveal>
 
            <Reveal delay={100}>
              <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-300 bg-clip-text text-transparent">
                  Chada Larabi
                </span>
              </h1>
            </Reveal>
 
            <Reveal delay={200}>
              <p className="mt-5 text-lg font-medium text-blue-400 sm:text-xl">
                Computer Science Student · Cybersecurity Enthusiast · Future IT
                Specialist
              </p>
            </Reveal>
 
            <Reveal delay={300}>
              <p className={`mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${theme.subtext}`}>
                Passionate about networking, cybersecurity, software
                development, and building innovative digital solutions.
                Currently studying Computer Science and preparing for an IT
                career in Germany.
              </p>
            </Reveal>
 
            <Reveal delay={400}>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToId("contact")}
                  className="group relative overflow-hidden rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Hire Me <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
                <button
                  onClick={() => scrollToId("projects")}
                  className={`rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${theme.card} ${theme.cardHover}`}
                >
                  See My Work
                </button>
                <button
                  onClick={() => showToast("Add your CV file, then wire this button to its link.")}
                  className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${theme.card} ${theme.cardHover}`}
                >
                  <Download className="h-4 w-4" />
                  Download CV
                </button>
              </div>
            </Reveal>
 
            <Reveal delay={500}>
              <div className="mt-10 flex items-center gap-4">
                {[
                  { icon: FaLinkedin, label: "LinkedIn", href: "#" },
                  { icon: FaGithub, label: "GitHub", href: "#" },
                  { icon: Mail, label: "Email", href: "mailto:your.email@example.com" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`group flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30 ${theme.card}`}
                  >
                    <Icon className="h-4 w-4 transition-colors group-hover:text-blue-400" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
 
          <Reveal delay={200}>
            <AvatarIllustration />
          </Reveal>
        </div>
      </section>
 
      {/* ---------------------------------------------------------- */}
      {/* About                                                       */}
      {/* ---------------------------------------------------------- */}
      <section id="about" className={`relative px-6 py-28 ${theme.sectionAlt}`}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading eyebrow="Get to know me" title="About Me" theme={theme} />
          </Reveal>
 
          <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-2">
            <Reveal>
              <div className={`rounded-3xl border p-8 backdrop-blur-xl ${theme.card}`}>
                <p className="text-base leading-relaxed sm:text-lg">
                  I am a Computer Science student at{" "}
                  <span className="font-semibold text-blue-400">
                    Mohammed V University
                  </span>{" "}
                  in Morocco. I enjoy learning new technologies and
                  continuously improving my programming and networking
                  skills. My goal is to become an IT professional
                  specializing in{" "}
                  <span className="font-semibold text-blue-400">
                    System Integration, Networking, and Cybersecurity
                  </span>{" "}
                  while contributing to innovative international projects.
                </p>
              </div>
            </Reveal>
 
            <div className="grid grid-cols-2 gap-5">
              {STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 100}>
                  <div
                    className={`group rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 ${theme.card} ${theme.cardHover}`}
                  >
                    <p className="text-3xl font-bold text-blue-400 sm:text-4xl">
                      <Counter target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className={`mt-2 text-xs font-medium uppercase tracking-wide ${theme.subtext}`}>
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* ---------------------------------------------------------- */}
      {/* Education                                                   */}
      {/* ---------------------------------------------------------- */}
      <section id="education" className="relative px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeading eyebrow="My academic path" title="Education" theme={theme} />
          </Reveal>
 
          <div className="relative mt-16 pl-10">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-blue-500/30 to-transparent" />
            <Reveal>
              <div className="relative">
                <span className="absolute -left-[34px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/50">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                <div className={`rounded-3xl border p-8 backdrop-blur-xl ${theme.card}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold">
                      Bachelor&apos;s Degree in Computer Science
                    </h3>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                      2024 — Present
                    </span>
                  </div>
                  <p className={`mt-1 flex items-center gap-2 text-sm ${theme.subtext}`}>
                    <GraduationCap className="h-4 w-4 text-blue-400" />
                    Mohammed V University, Morocco
                  </p>
                  <p className={`mt-4 text-sm font-medium ${theme.subtext}`}>
                    Relevant subjects
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Programming", "Networking", "Databases", "Operating Systems", "Cybersecurity"].map(
                      (subject) => (
                        <span
                          key={subject}
                          className="rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-xs font-medium text-blue-400"
                        >
                          {subject}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
 
      {/* ---------------------------------------------------------- */}
      {/* Certificates                                                */}
      {/* ---------------------------------------------------------- */}
      <section id="certificates" className={`relative px-6 py-28 ${theme.sectionAlt}`}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading eyebrow="Verified learning" title="Certificates" theme={theme} />
          </Reveal>
 
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATES.map((cert, i) => (
              <Reveal key={cert.name} delay={(i % 3) * 100}>
                <div
                  className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5 ${theme.card} ${theme.cardHover}`}
                >
                 <div className="overflow-hidden rounded-xl">
                   <img
                     src={cert.image}
                     alt={cert.name}
                     className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                 </div>

                  <h3 className="mt-5 text-base font-semibold">
                    {cert.name}
                    </h3>
                    <p className={`mt-1 text-sm ${theme.subtext}`}>
                      {cert.org}
                    </p>
                  <p className={`mt-3 text-sm leading-relaxed ${theme.subtext}`}>
                     {cert.description}
                   </p>
                  <a
                   href={cert.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="mt-5 flex items-center gap-1.5 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                  >
                    View Certificate <ExternalLink className="h-3.5 w-3.5" />
                   </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
 
      {/* ---------------------------------------------------------- */}
      {/* Skills                                                      */}
      {/* ---------------------------------------------------------- */}
      <section id="skills" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading eyebrow="What I work with" title="Skills" theme={theme} />
          </Reveal>
 
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {SKILL_GROUPS.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 100}>
                <div className={`rounded-3xl border p-8 backdrop-blur-xl ${theme.card}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <group.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{group.title}</h3>
                  </div>
                  <div className="mt-6 space-y-5">
                    {group.items.map((skill) => (
                      <SkillBar key={skill.name} skill={skill} theme={theme} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
 
      {/* ---------------------------------------------------------- */}
      {/* Projects                                                    */}
      {/* ---------------------------------------------------------- */}
      <section id="projects" className={`relative px-6 py-28 ${theme.sectionAlt}`}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading eyebrow="Selected work" title="Projects" theme={theme} />
          </Reveal>
 
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.title} delay={i * 120}>
                <div
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 ${theme.card} ${theme.cardHover}`}
                >
                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600/30 via-slate-800 to-slate-900">
                    <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.4)_1px,transparent_0)] [background-size:22px_22px]" />
                    <Code2 className="h-12 w-12 text-blue-300/70 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className={`mt-3 flex-1 text-sm leading-relaxed ${theme.subtext}`}>
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-blue-500/20 bg-blue-500/5 px-2.5 py-1 text-[11px] font-medium text-blue-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <a
                        href="#"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-400"
                      >
                        Live Demo <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href="#"
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors ${theme.card} ${theme.cardHover}`}
                      >
                        GitHub < ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
 
      {/* ---------------------------------------------------------- */}
      {/* Contact                                                     */}
      {/* ---------------------------------------------------------- */}
      <section id="contact" className="relative px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeading eyebrow="Let's talk" title="Contact" theme={theme} />
          </Reveal>
 
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${theme.subtext}`}>
                  Have an opportunity, a project, or just want to connect? My
                  inbox is always open — I try to reply within a day or two.
                </p>
                <div className={`flex items-center gap-4 rounded-2xl border p-5 ${theme.card}`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${theme.subtext}`}>Email</p>
                    <a href="mailto:your.email@example.com" className="text-sm font-medium hover:text-blue-400">
                      your.email@example.com
                    </a>
                  </div>
                </div>
                <div className={`flex items-center gap-4 rounded-2xl border p-5 ${theme.card}`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${theme.subtext}`}>Location</p>
                    <p className="text-sm font-medium">Morocco</p>
                  </div>
                </div>
              </div>
            </Reveal>
 
            <Reveal delay={100}>
              <form
                onSubmit={handleSubmit}
                className={`rounded-3xl border p-8 backdrop-blur-xl ${theme.card}`}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    theme={theme}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    theme={theme}
                  />
                </div>
                <div className="mt-5">
                  <Field
                    label="Subject"
                    value={form.subject}
                    onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
                    theme={theme}
                  />
                </div>
                <div className="mt-5">
                  <label className={`mb-1.5 block text-xs font-medium uppercase tracking-wide ${theme.subtext}`}>
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className={`w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 ${theme.card}`}
                    placeholder="Tell me a bit about the opportunity or project..."
                  />
                </div>
                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 disabled:opacity-60"
                >
                  {sent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Sent
                    </>
                  ) : (
                    <>
                      Send Message <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
 
      {/* ---------------------------------------------------------- */}
      {/* Footer                                                      */}
      {/* ---------------------------------------------------------- */}
      <footer className={`border-t px-6 py-10 ${theme.navBg}`}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className={`text-sm ${theme.subtext}`}>
            © 2026 Chada Larabi. Built with React, TypeScript &amp; Tailwind CSS.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: ExternalLink, href: "#" },
              { icon: ExternalLink, href: "#" },
              { icon: Mail, href: "mailto:your.email@example.com" },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-blue-500 hover:text-blue-400 ${theme.card}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>
 
      {/* ---------------------------------------------------------- */}
      {/* Scroll to top                                               */}
      {/* ---------------------------------------------------------- */}
      <button
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-[70] flex h-11 w-11 items-center justify-center rounded-full border bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
 
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}
 
/* ------------------------------------------------------------------ */
/*  Small reusable pieces                                              */
/* ------------------------------------------------------------------ */
function SectionHeading({ eyebrow, title, theme }) {
  return (
    <div className="text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-300" />
    </div>
  );
}
 
function Field({ label, value, onChange, type = "text", theme }) {
  return (
    <div>
      <label className={`mb-1.5 block text-xs font-medium uppercase tracking-wide ${theme.subtext}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 ${theme.card}`}
        placeholder={label}
      />
    </div>
  );
}
 
function SkillBar({ skill, theme }) {
  const [ref, visible] = useOnScreen({ threshold: 0.3 });
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className="text-blue-400">{visible ? skill.level : 0}%</span>
      </div>
      <div className={`mt-2 h-2 w-full overflow-hidden rounded-full ${theme.card}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-[width] duration-[1200ms] ease-out"
          style={{ width: visible ? `${skill.level}%` : "0%" }}
        />
      </div>
    </div>
  );
}
