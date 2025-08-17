import React, { useState, useEffect } from 'react';
import { 
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  Music,
  Mail,
  Sun,
  Moon,
  Code,
  Briefcase,
  Menu,
  X
} from 'lucide-react';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentPage, setCurrentPage] = useState<'home' | 'projects'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: MessageCircle, label: 'Discord', url: 'https://discord.com' },
    { icon: Music, label: 'Spotify', url: 'https://spotify.com' },
    { icon: Mail, label: 'Email', url: 'mailto:soubha@example.com' },
  ];

  const projects = [
    {
      title: "Inkei - AI-Powered Project Management",
      description: "Built during the Aignite Hackathon at Heritage College, Inkei is a Jira-inspired project management system powered by AI. Just describe what you want to build, and the chatbot breaks it down into a structured plan with story points. Features include real-time chat, JWT-based authentication, and a clean UI for managing tasks collaboratively.",
      tech: ["React", "AI Integration", "JWT", "Real-time Chat", "Project Management"],
      github: "https://github.com/notlevi911/inkei",
      live: null
    },
    {
      title: "URL Shortener SaaS",
      description: "A full-stack URL shortening service with user authentication, Google OAuth, and analytics. Features include custom slugs, user management, and secure API endpoints. Built with modern web technologies and deployed on Vercel.",
      tech: ["React", "Node.js", "MongoDB", "JWT", "Google OAuth", "Vercel"],
      github: "https://github.com/notlevi911/url_shortner",
      live: "https://url-swart.vercel.app"
    },
    {
      title: "LeetCode Discord Bot",
      description: "An intelligent Discord bot that provides LeetCode problem solutions, coding challenges, and programming assistance. Built with n8n automation platform for seamless Discord integration and automated responses.",
      tech: ["Discord API", "n8n", "Automation", "LeetCode Integration", "Bot Development"],
      github: "https://github.com/notlevi911/leet-bot",
      live: null
    }
  ];

  const experience = [
    {
      title: "Full-Stack Developer Intern",
      company: "Oodser Technologies",
      location: "Rwanda",
      duration: "March 2024 - August 2024",
      description: [
        "Built and maintained scalable applications using MERN stack (React, Node.js, Express, MongoDB)",
        "Improved frontend load time by 25% and reduced API latency by 30%",
        "Integrated UI features and APIs, boosting team productivity by 40%",
        "Worked with CI/CD pipelines and agile, cross-timezone collaboration"
      ]
    }
  ];

  return (
    <div className="h-screen bg-amber-50 dark:bg-neutral-800 text-gray-800 dark:text-white overflow-hidden">
      {/* Navigation */}
      <nav className="bg-amber-50 dark:bg-neutral-800 h-16">
        <div className="max-w-6xl mx-auto px-6 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-semibold text-gray-800 dark:text-white">
                soubhagya
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-sm transition-colors ${
                  currentPage === 'home' 
                    ? 'text-gray-800 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('projects')}
                className={`text-sm transition-colors ${
                  currentPage === 'projects' 
                    ? 'text-gray-800 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                Projects
              </button>
              <a
                href="/Resume (1).pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                CV
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-amber-50 dark:bg-neutral-800 border-t border-amber-200/50 dark:border-neutral-700/50">
              <div className="flex flex-col p-6 space-y-6">
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-base transition-colors text-left ${
                    currentPage === 'home' 
                      ? 'text-gray-800 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('projects');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-base transition-colors text-left ${
                    currentPage === 'projects' 
                      ? 'text-gray-800 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  Projects
                </button>
                <a
                  href="/Resume (1).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base text-left text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  CV
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="h-[calc(100vh-4rem)]">
        {currentPage === 'home' ? (
          /* Home Page */
          <div className="h-[85%] flex flex-col md:flex-row justify-center items-center px-4 md:px-8 md:py-0">
            {/* Left Side - Introduction */}
            <div className="flex-1 max-w-2xl md:pr-24 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-white">
                hello
              </h1>
              
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-600 dark:text-gray-400">
                <p className="leading-relaxed">
                i’m just a developer trying to figure out what really clicks with me.
                currently in my 3rd year of b.tech.
                </p>
                <p className="leading-relaxed">
                i tinker with full-stack stuff, devops, and lately genAI (still learning the ropes).
                outside of coding, i fall into gacha games (trying to keep it under control ehe)
                </p>
                <p className="leading-relaxed">
                and i enjoy watching anime when i want to switch off.                </p>
              </div>
            </div>

            {/* Right Side - Social Links Box */}
            <div className="w-full md:w-80 px-2 md:px-0">
              <div className="bg-amber-100/50 dark:bg-neutral-700/50 p-4 md:p-6 rounded-2xl backdrop-blur-sm border border-black/20 dark:border-neutral-600/50">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col md:flex-row items-center md:space-x-3 p-2 md:p-3 rounded-xl bg-amber-50/80 dark:bg-neutral-600/80 border border-black/20 dark:border-neutral-500/50 text-gray-600 dark:text-gray-300 hover:bg-amber-200/80 dark:hover:bg-neutral-500/80 hover:text-gray-800 dark:hover:text-white transition-all duration-200 group"
                    >
                      <link.icon size={18} className="group-hover:scale-110 transition-transform duration-200 mb-1 md:mb-0" />
                      <span className="text-xs md:text-sm font-medium text-center">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Projects Page */
          <div className="h-full p-4 md:p-12 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800 dark:text-white">
                Projects & Experience
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Projects Section */}
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800 dark:text-white flex items-center">
                    <Code className="mr-2" size={24} />
                    Projects
                  </h2>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div key={index} className="bg-amber-100/50 dark:bg-neutral-700/50 p-4 md:p-6 rounded-xl border border-amber-200/50 dark:border-neutral-600/50">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-amber-200/50 dark:bg-neutral-600/50 text-gray-700 dark:text-gray-300 text-xs rounded-lg border border-amber-300/50 dark:border-neutral-500/50"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-amber-700 dark:text-amber-400 hover:underline"
                        >
                          View on GitHub →
        </a>
      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Section */}
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800 dark:text-white flex items-center">
                    <Briefcase className="mr-2" size={24} />
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {experience.map((exp, index) => (
                      <div key={index} className="bg-amber-100/50 dark:bg-neutral-700/50 p-4 md:p-6 rounded-xl border border-amber-200/50 dark:border-neutral-600/50">
                        <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {exp.company}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                          {exp.duration}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.description.map((desc, i) => (
                            <span key={i}>
                              {desc}
                              {i < exp.description.length - 1 ? <br /> : ''}
                            </span>
                          ))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Music Player */}
      <MusicPlayer 
        isVisible={isMusicPlayerVisible}
        onToggle={() => setIsMusicPlayerVisible(!isMusicPlayerVisible)}
      />
    </div>
  );
};

export default App;
