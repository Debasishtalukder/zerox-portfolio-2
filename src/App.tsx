/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { ArrowUpRight, Twitter, Github, Send } from 'lucide-react';

// --- Components ---

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-black/10 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5
          }}
          animate={{
            y: [null, '-100%'],
            opacity: [null, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  );
};

const SkillCard = ({ title, tags, icon }: { title: string, tags: string[], icon: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group p-8 bg-white border border-black/5 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 border-draw"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-sm text-gray-500 font-medium">#{tag}</span>
        ))}
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-radial from-black/5 to-transparent" />
    </motion.div>
  );
};

interface ExperienceProps {
  year: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  index: number;
}

const ExperienceCard = ({ year, role, company, description, tags, index }: ExperienceProps) => {
  return (
    <motion.div 
      className="sticky top-24 w-full max-w-4xl mx-auto mb-8"
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div 
        className="bg-[#f0f0f0] p-8 md:p-12 rounded-[32px] shadow-xl border border-black/5"
        style={{ marginTop: `${index * 40}px` }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2 md:mb-0">{year}</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-white/50 rounded-full text-xs font-bold uppercase tracking-tighter">{tag}</span>
            ))}
          </div>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-2">{role}</h3>
        <p className="text-xl text-gray-600 mb-6 font-medium">{company}</p>
        <p className="text-lg leading-relaxed text-gray-700 max-w-2xl">{description}</p>
      </div>
    </motion.div>
  );
};

interface ProjectProps {
  key?: React.Key;
  name: string;
  description: string;
  tags: string[];
  url: string;
}

const ProjectCard = ({ name, description, tags, url }: ProjectProps) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="min-w-[350px] md:min-w-[450px] bg-white border border-black rounded-2xl p-8 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-bold tracking-tight mb-2">{name}</h3>
          <p className="text-gray-500 text-base leading-relaxed">{description}</p>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-black text-white rounded-full hover:scale-110 transition-transform flex items-center justify-center group-hover:rotate-45"
        >
          <ArrowUpRight size={20} />
        </a>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag: string) => (
          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 border border-black/5 px-3 py-1.5 rounded-full">{tag}</span>
        ))}
      </div>
    </motion.div>
  );
};

const AvatarImage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(err => console.error("Video play error:", err));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <motion.div 
      className="relative w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[600px] aspect-square bg-white rounded-[48px] border border-black/10 overflow-hidden group cursor-pointer shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <video
        ref={videoRef}
        src="/avatar.mp4"
        poster="/avatar.png.png"
        muted
        loop
        playsInline
        preload="auto"
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-105'}`}
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 border-[1px] border-black/5 rounded-[48px] pointer-events-none ring-1 ring-inset ring-black/5" />
    </motion.div>
  );
};

const marqueeItems = [
  "Web3 Creator", "✦", "Vibe Coder", "✦", "Airdrop Hunter", "✦", 
  "Farcaster", "✦", "Base Chain", "✦", "Kaito AI", "✦", "Lovable AI", "✦", 
  "Sonic EVM", "✦", "Community Mod", "✦", "On-chain", "✦", "zerox", "✦"
];

const projects = [
  {
    name: "Prompt Gallery",
    url: "https://www.promptgallery.online/",
    description: "A gallery for sharing and discovering AI image prompts",
    tags: ["AI", "Prompts", "Gallery"]
  },
  {
    name: "Crypto Content Daily",
    url: "https://crypto-content-daily.vercel.app/",
    description: "Daily crypto content hub for Web3 creators",
    tags: ["Web3", "Content", "Crypto"]
  },
  {
    name: "Neynar Card Craft",
    url: "https://www.neynar-card-craft.fun",
    description: "Farcaster activity tracker and card generator",
    tags: ["Farcaster", "Neynar", "Web3"]
  },
  {
    name: "Get Skill",
    url: "https://get-skill-three.vercel.app",
    description: "A skill discovery and learning platform",
    tags: ["Skills", "Learning", "Web3"]
  },
  {
    name: "Agent Olympics Arena",
    url: "https://agent-olympics-arena.vercel.app/",
    description: "AI agent competition and battle platform",
    tags: ["AI Agents", "Gaming", "Web3"]
  },
  {
    name: "Prompt Hub",
    url: "https://prompt-hub-fun.vercel.app/",
    description: "Community hub for AI prompts sharing",
    tags: ["AI", "Prompts", "Community"]
  },
  {
    name: "Founders Fuel",
    url: "https://founders-fuel.vercel.app/",
    description: "Resource platform for Web3 founders",
    tags: ["Web3", "Founders", "Resources"]
  },
  {
    name: "Web3 Hub",
    url: "https://web3-hub-nine.vercel.app/",
    description: "Central hub for Web3 tools and resources",
    tags: ["Web3", "Hub", "Tools"]
  },
  {
    name: "Agent Arena Bot",
    url: "https://agent-arena-bot.vercel.app/",
    description: "AI bot battle arena platform",
    tags: ["AI", "Bots", "Arena"]
  },
  {
    name: "Agent Roast Arena",
    url: "https://agent-roast-arena.vercel.app/",
    description: "AI agents battle through roast exchanges",
    tags: ["AI", "Roast", "Entertainment"]
  },
  {
    name: "Base Bird",
    url: "https://base-bird-one.vercel.app/",
    description: "Base chain social activity tracker",
    tags: ["Base", "Social", "Web3"]
  },
  {
    name: "All Agent HereAI",
    url: "https://all-agent-hereai.vercel.app/",
    description: "All-in-one AI agent discovery platform",
    tags: ["AI Agents", "Discovery", "Web3"]
  },
  {
    name: "Student Perks",
    url: "https://student-perks-io.vercel.app",
    description: "Exclusive perks and discounts platform for students",
    tags: ["Students", "Perks", "Deals"]
  }
];

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ right: 0, left: 0 });

  useEffect(() => {
    const updateConstraints = () => {
      if (scrollRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const offsetWidth = scrollRef.current.offsetWidth;
        setDragConstraints({ right: 0, left: -(scrollWidth - offsetWidth + 40) });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [projects]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6 md:px-20 overflow-hidden py-20">
        <ParticleBackground />
        
        {/* Left Side: Avatar Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <AvatarImage />
        </motion.div>

        {/* Right Side: Text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <h1 className="font-display text-[100px] md:text-[150px] leading-[0.8] font-bold tracking-tighter mb-6">
            zerox
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide text-gray-600 mb-8">
            Crypto Creator <span className="mx-2 text-gray-300">|</span> 
            Vibe Coder <span className="mx-2 text-gray-300">|</span> 
            Airdrop Hunter
          </p>
          <div className="w-24 h-[1px] bg-gray-200 mb-10" />
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => scrollToSection('projects')}
              className="px-10 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform"
            >
              View Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-10 py-4 border border-black rounded-full font-bold hover:bg-black hover:text-white transition-all"
            >
              Contact
            </button>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: EXPERIENCE */}
      <section id="experience" className="py-32 px-6 md:px-20 bg-white">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-bold mb-20 tracking-tighter"
        >
          Experience
        </motion.h2>
        
        <div className="relative pb-20">
          <ExperienceCard 
            index={0}
            year="2021 — Present"
            role="Web3 Content Creator"
            company="Multiple Projects"
            description="Creating content and threads for Web3 projects across Twitter/X and Farcaster. Focused on storytelling and technical breakdowns."
            tags={["Content", "Twitter/X", "Web3"]}
          />
          <ExperienceCard 
            index={1}
            year="2022 — Present"
            role="Community Moderator"
            company="MiraDAO & Humanity Protocol"
            description="Moderating communities, onboarding users, managing engagement. Building healthy digital environments for decentralized protocols."
            tags={["Moderation", "Discord", "Community"]}
          />
          <ExperienceCard 
            index={2}
            year="2023 — Present"
            role="Mindshare Creator"
            company="Kaito AI, Wallchain, Cookie.fun"
            description="Creating ranked content for mindshare reward platforms. Leveraging AI tools to optimize reach and engagement."
            tags={["Kaito", "Mindshare", "Rewards"]}
          />
          <ExperienceCard 
            index={3}
            year="2024 — Present"
            role="Vibe Coder"
            company="Lovable AI & Vercel"
            description="Building and deploying web apps using AI tools without traditional coding. Rapid prototyping and shipping production-ready interfaces."
            tags={["Lovable", "Vercel", "React"]}
          />
          <ExperienceCard 
            index={4}
            year="2021 — Present"
            role="Airdrop Hunter"
            company="Various Protocols"
            description="Actively participating in testnets, quests and airdrop campaigns. Deep-diving into on-chain activities and early protocol testing."
            tags={["Airdrop", "DeFi", "On-chain"]}
          />
        </div>
      </section>

      {/* SECTION 3: SKILLS */}
      <section id="skills" className="py-32 px-6 md:px-20 bg-white">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-bold text-center mb-24 tracking-tighter"
        >
          What I Can Do
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <SkillCard 
            icon="🌐"
            title="Web3 Platforms"
            tags={["Farcaster", "Base", "Sonic EVM", "Kaito AI"]}
          />
          <SkillCard 
            icon="✍️"
            title="Content Creation"
            tags={["Twitter/X Threads", "Community Mod", "Mindshare"]}
          />
          <SkillCard 
            icon="⚡"
            title="Vibe Coding"
            tags={["Lovable AI", "Bolt", "Blackbox AI", "Vercel"]}
          />
          <SkillCard 
            icon="🎯"
            title="Airdrop Hunting"
            tags={["Testnets", "DeFi", "On-chain Quests"]}
          />
          <SkillCard 
            icon="🛠️"
            title="Tools"
            tags={["Supabase", "GitHub", "Telegram", "Discord"]}
          />
          <SkillCard 
            icon="⛓️"
            title="Chains"
            tags={["Base", "Ethereum", "Sonic", "Polygon"]}
          />
        </div>
      </section>

      {/* SECTION 4: PROJECTS */}
      <section id="projects" className="py-32 px-6 md:px-20 bg-white overflow-hidden">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-bold tracking-tighter"
          >
            Things I've Built
          </motion.h2>
          <p className="text-xl text-gray-400 mt-4 font-medium">Projects vibe coded with AI tools</p>
        </div>

        <div className="relative">
          <motion.div 
            ref={scrollRef}
            drag="x"
            dragConstraints={dragConstraints}
            className="flex gap-8 cursor-grab active:cursor-grabbing pb-10"
          >
            {projects.map((project, i) => (
              <ProjectCard 
                key={i}
                name={project.name}
                description={project.description}
                tags={project.tags}
                url={project.url}
              />
            ))}
          </motion.div>
          {/* Subtle scroll indicator */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-12 h-1 bg-black/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-black w-1/3"
                animate={{ x: ["0%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MARQUEE */}
      <section className="py-20 border-y border-black/5 overflow-hidden bg-white">
        <div className="flex flex-col gap-8">
          <div className="marquee-track animate-marquee-left">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                {marqueeItems.map((item, j) => (
                  <span key={j} className={`text-6xl md:text-8xl font-bold uppercase tracking-tighter ${item === '✦' ? 'text-gray-200' : 'text-black'}`}>
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="marquee-track animate-marquee-right">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                {marqueeItems.map((item, j) => (
                  <span key={j} className={`text-6xl md:text-8xl font-bold uppercase tracking-tighter ${item === '✦' ? 'text-gray-200' : 'text-black'}`}>
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CONTACT */}
      <section id="contact" className="py-40 px-6 md:px-20 bg-white text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter"
        >
          Let's Connect
        </motion.h2>
        <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto">
          Open for Web3 collabs, content work and new builds. 
          Let's build the future of the decentralized web together.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { icon: <Twitter size={20} />, label: "Twitter/X", handle: "@0xleo_ip", url: "https://x.com/0xleo_ip" },
            { icon: <Github size={20} />, label: "GitHub", handle: "Debasishtalukder", url: "https://github.com/Debasishtalukder" },
            { icon: <Send size={20} />, label: "Farcaster", handle: "deba9t6", url: "https://warpcast.com/deba9t6" },
            { icon: <Send size={20} />, label: "Telegram", handle: "@leo9t6", url: "https://t.me/leo9t6" }
          ].map((social, i) => (
            <motion.div key={i} className="flex flex-col items-center gap-2">
              <a 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 border border-black rounded-full font-bold hover:bg-black hover:text-white transition-all group"
              >
                {social.icon}
                <span>{social.label}</span>
              </a>
              <span className="text-xs text-gray-400 font-medium">{social.handle}</span>
            </motion.div>
          ))}
        </div>

        <footer className="mt-40 pt-10 border-t border-black/5">
          <p className="text-gray-400 text-sm font-medium">© zerox 2026 — Vibe Coded with AI</p>
        </footer>
      </section>
    </div>
  );
}
