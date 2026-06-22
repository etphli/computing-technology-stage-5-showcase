import React, { useEffect, useRef, useState } from "react";
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

async function requestCourseBot(message) {
  const endpoints = ["/api/chat"];
  const productionLocalEndpoint = "http://localhost:4173/api/chat";
  const localHostnames = ["localhost", "127.0.0.1"];

  if (localHostnames.includes(window.location.hostname) && window.location.origin !== "http://localhost:4173") {
    endpoints.push(productionLocalEndpoint);
  }

  let lastError;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      if (!data.answer) {
        throw new Error(data.error || `Course bot request failed with ${response.status}`);
      }

      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchOptimized = window.matchMedia("(pointer: coarse), (max-width: 1100px)");

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const setStaticParallax = () => {
      document.documentElement.style.setProperty("--heroParallax", "0px");
      document.querySelectorAll(".unitPanel").forEach((panel) => {
        panel.style.setProperty("--imageShift", "0px");
        panel.style.setProperty("--imageX", "0px");
        panel.style.setProperty("--copyShift", "0px");
        panel.style.setProperty("--copyX", "0px");
        panel.style.setProperty("--floatShift", "0px");
        panel.style.setProperty("--floatX", "0px");
        panel.style.setProperty("--sparkX", "0px");
        panel.style.setProperty("--holdGlow", "1");
        panel.style.setProperty("--holdBlur", "14px");
        panel.style.setProperty("--holdOpacity", "0.75");
      });
    };

    const updateParallax = () => {
      frame = 0;

      if (reducedMotion.matches || touchOptimized.matches) {
        setStaticParallax();
        return;
      }

      document.documentElement.style.setProperty("--heroParallax", `${window.scrollY * 0.08}px`);

      const viewportHeight = window.innerHeight || 800;
      document.querySelectorAll(".unitPanel").forEach((panel, index) => {
        const rect = panel.getBoundingClientRect();
        const travel = Math.max(1, rect.height - viewportHeight);
        const progress = clamp(-rect.top / travel, 0, 1);
        const depth = progress - 0.5;
        const direction = index % 2 === 0 ? 1 : -1;
        const hold = Math.max(0, 1 - Math.abs(progress - 0.5) * 3.2);

        panel.style.setProperty("--imageShift", `${depth * -76}px`);
        panel.style.setProperty("--imageX", `${depth * 130 * direction}px`);
        panel.style.setProperty("--copyShift", `${depth * 32}px`);
        panel.style.setProperty("--copyX", `${depth * -86 * direction}px`);
        panel.style.setProperty("--floatShift", `${depth * -92}px`);
        panel.style.setProperty("--floatX", `${depth * 190 * direction}px`);
        panel.style.setProperty("--sparkX", `${depth * -240 * direction}px`);
        panel.style.setProperty("--holdGlow", hold.toFixed(3));
        panel.style.setProperty("--holdBlur", `${8 + hold * 24}px`);
        panel.style.setProperty("--holdOpacity", (0.35 + hold * 0.55).toFixed(3));
      });
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateParallax);
      }
    };

    requestUpdate();
    const syncMode = () => {
      if (reducedMotion.matches || touchOptimized.matches) {
        window.removeEventListener("scroll", requestUpdate);
        requestUpdate();
      } else {
        window.addEventListener("scroll", requestUpdate, { passive: true });
        requestUpdate();
      }
    };

    syncMode();
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener?.("change", syncMode);
    touchOptimized.addEventListener?.("change", syncMode);

    const chapterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { rootMargin: "-32% 0px -32% 0px", threshold: 0 }
    );
    document.querySelectorAll(".unitPanel").forEach((panel) => chapterObserver.observe(panel));

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener?.("change", syncMode);
      touchOptimized.removeEventListener?.("change", syncMode);
      chapterObserver.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

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
          <div className="heroBackdrop" aria-hidden="true">
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
              <UnitPanel key={unit.title} unit={unit} index={index} />
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

function UnitPanel({ unit, index }) {
  const Icon = unit.icon;

  return (
    <article
      className={`unitPanel ${index % 2 === 1 ? "reverse" : ""}`}
      style={{
        "--imageShift": "38px",
        "--imageX": `${index % 2 === 0 ? -65 : 65}px`,
        "--copyShift": "-16px",
        "--copyX": `${index % 2 === 0 ? 43 : -43}px`,
        "--floatShift": "46px",
        "--floatX": `${index % 2 === 0 ? -95 : 95}px`,
        "--sparkX": `${index % 2 === 0 ? 120 : -120}px`,
        "--holdGlow": "0",
        "--holdBlur": "8px",
        "--holdOpacity": "0.35",
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
        <div className="sceneChapter" aria-hidden="true">
          <span className="sceneChapterNumber">0{index + 1}</span>
          <div className="sceneChapterDots">
            {units.map((_, dotIndex) => (
              <span className={dotIndex === index ? "current" : ""} key={`chapter-${dotIndex}`} />
            ))}
          </div>
          <small>Explore</small>
        </div>
      </div>
    </article>
  );
}

function renderInlineMarkdown(text, keyPrefix) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-bold-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <React.Fragment key={`${keyPrefix}-text-${index}`}>{part}</React.Fragment>;
  });
}

function MarkdownMessage({ text }) {
  const blocks = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const content = paragraph.join(" ").trim();
    if (content) {
      blocks.push({
        type: "paragraph",
        content
      });
    }
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push(list);
    list = null;
  };

  text.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    const numberMatch = line.match(/^\d+\.\s+(.+)$/);

    if (bulletMatch || numberMatch) {
      flushParagraph();
      const type = bulletMatch ? "ul" : "ol";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push(bulletMatch?.[1] || numberMatch[1]);
      return;
    }

    flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return (
    <div className="markdownMessage">
      {blocks.map((block, blockIndex) => {
        if (block.type === "paragraph") {
          return (
            <p key={`paragraph-${blockIndex}`}>
              {renderInlineMarkdown(block.content, `paragraph-${blockIndex}`)}
            </p>
          );
        }

        const ListTag = block.type;
        return (
          <ListTag key={`list-${blockIndex}`}>
            {block.items.map((item, itemIndex) => (
              <li key={`item-${blockIndex}-${itemIndex}`}>
                {renderInlineMarkdown(item, `item-${blockIndex}-${itemIndex}`)}
              </li>
            ))}
          </ListTag>
        );
      })}
    </div>
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
      const data = await requestCourseBot(text);
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
            {message.role === "bot" ? <MarkdownMessage text={message.text} /> : message.text}
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
