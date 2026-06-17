import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bot,
  CircuitBoard,
  Code2,
  ExternalLink,
  Gamepad2,
  Menu,
  MessageCircle,
  Rocket,
  Send,
  Smartphone,
  Sparkles,
  X,
  Zap
} from "lucide-react";
import "./styles.css";

const units = [
  {
    title: "Web Development",
    kicker: "Design for the real web",
    description:
      "Plan, design, build, style and publish interactive websites that work across screens.",
    outcome: "Create a polished, responsive site that can be shared online.",
    topics: [
      "HTML",
      "CSS",
      "JavaScript basics",
      "Responsive design",
      "UI design",
      "Website structure",
      "Publishing online"
    ],
    icon: Code2,
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=85",
    visual: "browser"
  },
  {
    title: "Game Development",
    kicker: "Make play interactive",
    description:
      "Turn ideas into playable experiences with mechanics, levels, scoring and testing.",
    outcome: "Prototype a playable game loop with clear goals, feedback and difficulty.",
    topics: [
      "Game design",
      "Player interaction",
      "Sprites",
      "Game logic",
      "Scoring systems",
      "Levels",
      "Testing"
    ],
    icon: Gamepad2,
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=85",
    visual: "game"
  },
  {
    title: "Mechatronics",
    kicker: "Code meets hardware",
    description:
      "Explore robotics, sensors and circuits to understand how smart systems move and react.",
    outcome: "Build smart systems that sense, respond and automate real-world actions.",
    topics: [
      "Robotics",
      "Sensors",
      "Motors",
      "Circuits",
      "Microcontrollers",
      "Inputs and outputs",
      "Automation"
    ],
    icon: CircuitBoard,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    visual: "circuit"
  },
  {
    title: "Python and App Development",
    kicker: "Solve problems with code",
    description:
      "Learn Python programming and design app ideas through debugging, logic and interface thinking.",
    outcome: "Code useful app-style solutions with clear logic and better debugging habits.",
    topics: [
      "Python",
      "Variables",
      "Conditions",
      "Loops",
      "Functions",
      "App interfaces",
      "Debugging"
    ],
    icon: Smartphone,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=85",
    visual: "app"
  }
];

const projects = [
  {
    name: "NYX LLM",
    url: "https://nyx-llm.vercel.app",
    description: "An AI-style web experience showing how interfaces can make complex tools feel approachable.",
    palette: "gold"
  },
  {
    name: "Runeforge",
    url: "https://runeforge-six.vercel.app",
    description: "A game-flavoured project example with interactive design, atmosphere and web publishing.",
    palette: "blue"
  },
  {
    name: "Lazeecloth",
    url: "https://lazeecloth.lovable.app",
    description: "A product-style website example showing layout, branding and polished visual presentation.",
    palette: "green"
  }
];

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxStyle = useMemo(
    () => ({
      transform: `translate3d(0, ${scrollY * 0.08}px, 0)`
    }),
    [scrollY]
  );

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setNavOpen(false);
  };

  return (
    <>
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo("home")} aria-label="Go to home">
          <span className="brandMark"><Sparkles size={18} /></span>
          <span>Computing Technology</span>
        </button>
        <nav className={navOpen ? "nav navOpen" : "nav"}>
          <button onClick={() => scrollTo("home")}>Home</button>
          <button onClick={() => scrollTo("units")}>Units</button>
          <button onClick={() => scrollTo("projects")}>Projects</button>
          <button onClick={() => setChatOpen(true)}>Ask Bot</button>
        </nav>
        <button className="iconButton menuButton" onClick={() => setNavOpen(!navOpen)} aria-label="Open navigation">
          {navOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="heroBackdrop" style={parallaxStyle} aria-hidden="true">
            <div className="codePane">
              <span>const idea = "build";</span>
              <span>design.website()</span>
              <span>robot.sense()</span>
              <span>game.update()</span>
            </div>
            <div className="deviceStack">
              <div className="screen screenLarge">
                <div className="screenBar" />
                <div className="screenGrid">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="screen screenSmall">
                <Zap size={24} />
                <strong>LIVE</strong>
              </div>
            </div>
          </div>
          <div className="heroContent">
            <div className="eyebrow"><Rocket size={16} /> Year 9 and Year 10 elective</div>
            <h1>Computing Technology Stage 5</h1>
            <p className="heroLead">
              Build websites, games, apps, robots, and digital systems while learning the skills behind the technology you use every day.
            </p>
            <p className="heroSub">
              Design, code, build and create real digital technologies in a subject made for curious Year 8 students choosing what comes next.
            </p>
            <div className="heroActions">
              <button className="primaryButton" onClick={() => scrollTo("units")}>
                Explore the Course <ArrowRight size={18} />
              </button>
              <button className="secondaryButton" onClick={() => setChatOpen(true)}>
                Ask the Course Bot <MessageCircle size={18} />
              </button>
            </div>
          </div>
          <div className="scrollCue">Scroll to explore</div>
        </section>

        <section id="units" className="parallaxSection">
          <div className="sectionIntro">
            <span className="eyebrow">Four creative technology worlds</span>
            <h2>What you will explore</h2>
            <p>
              Each unit builds practical confidence: you learn how technology works, then use those ideas to make something of your own.
            </p>
          </div>

          <div className="unitRail">
            {units.map((unit, index) => (
              <UnitPanel key={unit.title} unit={unit} index={index} scrollY={scrollY} />
            ))}
          </div>
        </section>

        <section className="whySection">
          <div>
            <span className="eyebrow">Why choose it?</span>
            <h2>Create like a designer. Think like a developer.</h2>
          </div>
          <div className="whyGrid">
            <div>
              <strong>Make real things</strong>
              <p>Websites, games, app ideas and smart systems give your learning a visible result.</p>
            </div>
            <div>
              <strong>Build future skills</strong>
              <p>Problem solving, design thinking, coding and testing are useful in almost every career path.</p>
            </div>
            <div>
              <strong>Work creatively</strong>
              <p>You get to experiment, improve ideas and make technology feel personal and purposeful.</p>
            </div>
          </div>
        </section>

        <section id="projects" className="projectsSection">
          <div className="sectionIntro">
            <span className="eyebrow">Project inspiration</span>
            <h2>Explore what web skills can create</h2>
            <p>These examples show how design, code and publishing can turn ideas into real online experiences.</p>
          </div>
          <div className="projectGrid">
            {projects.map((project) => (
              <a className={`projectCard ${project.palette}`} key={project.url} href={project.url} target="_blank" rel="noreferrer">
                <div className="mockBrowser">
                  <div className="dots"><span /><span /><span /></div>
                  <div className="previewLines">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <span className="projectLink">
                  Visit project <ExternalLink size={16} />
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <button className="chatLauncher" onClick={() => setChatOpen(true)} aria-label="Open course chatbot">
        <Bot />
        <span>Ask Bot</span>
      </button>
      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

function UnitPanel({ unit, index, scrollY }) {
  const Icon = unit.icon;
  const ref = useRef(null);
  const [metrics, setMetrics] = useState({ top: 0, height: 1 });

  useEffect(() => {
    const updateMetrics = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMetrics({ top: rect.top + window.scrollY, height: rect.height || 1 });
    };
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
  const travel = Math.max(1, metrics.height - viewportHeight);
  const progress = Math.max(0, Math.min(1, (scrollY - metrics.top) / travel));
  const depth = progress - 0.5;
  const direction = index % 2 === 0 ? 1 : -1;
  const hold = Math.max(0, 1 - Math.abs(progress - 0.5) * 3.2);

  return (
    <article
      className={`unitPanel ${index % 2 === 1 ? "reverse" : ""}`}
      ref={ref}
      style={{
        "--imageShift": `${depth * -92}px`,
        "--imageX": `${depth * 170 * direction}px`,
        "--copyShift": `${depth * 42}px`,
        "--copyX": `${depth * -118 * direction}px`,
        "--floatShift": `${depth * -118}px`,
        "--floatX": `${depth * 280 * direction}px`,
        "--sparkX": `${depth * -360 * direction}px`,
        "--holdGlow": hold.toFixed(3),
        "--holdBlur": `${8 + hold * 34}px`,
        "--holdOpacity": (0.35 + hold * 0.55).toFixed(3),
        "--panelIndex": index
      }}
    >
      <div className="unitScene">
        <div className="unitImageWrap">
          <img src={unit.image} alt="" loading={index === 0 ? "eager" : "lazy"} />
          <div className={`unitVisual ${unit.visual}`}>
            <Icon size={28} />
            <span>{unit.kicker}</span>
          </div>
        </div>
        <div className="unitCopy">
          <span className="unitNumber">0{index + 1}</span>
          <h3>{unit.title}</h3>
          <p>{unit.description}</p>
          <div className="unitOutcome">
            <strong>You will build</strong>
            <span>{unit.outcome}</span>
          </div>
          <div className="topicList">
            {unit.topics.map((topic) => (
              <span key={topic}>{topic}</span>
            ))}
          </div>
          <div className="sceneHold">
            <span />
            <span>Focus moment</span>
          </div>
        </div>
        <div className="parallaxSparks" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </article>
  );
}

function Chatbot({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I can answer questions about Computing Technology Stage 5. Ask me what you will build, what topics you will learn, or whether this subject might be right for you."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", text }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text: data.answer || "I could not answer that just now. Try asking about the course units or what you will build."
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text: "I am having trouble connecting right now, but this subject covers web development, games, mechatronics, Python and app development."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={open ? "chatPanel open" : "chatPanel"} aria-hidden={!open}>
      <div className="chatHeader">
        <div>
          <span className="chatIcon"><Bot size={18} /></span>
          <strong>Course Bot</strong>
        </div>
        <button className="iconButton" onClick={onClose} aria-label="Close chatbot"><X /></button>
      </div>
      <div className="chatMessages">
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
            {message.text}
          </div>
        ))}
        {loading && <div className="message bot thinking">Thinking...</div>}
        <div ref={endRef} />
      </div>
      <form className="chatForm" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about websites, games, robots..."
          aria-label="Ask the course bot"
        />
        <button type="submit" className="sendButton" aria-label="Send message" disabled={loading || !input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </aside>
  );
}

createRoot(document.getElementById("root")).render(<App />);
